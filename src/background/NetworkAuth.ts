import { isFirefox } from "webext-detect-page";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Entry } from "../common/model/Entry";
import punycode from "punycode/";
import { kee } from "./KF";

export class NetworkAuth {
    constructor() { }

    public async provideCredentialsAsync(
        requestDetails: any
    ): Promise<chrome.webRequest.BlockingResponse> {
        KeeLog.debug("Considering handling request ID: " + requestDetails.requestId);

        if (!kee.store.state.connected || kee.store.state.ActiveKeePassDatabaseIndex < 0) {
            return { cancel: false };
        }

        KeeLog.info("Finding credentials for request ID: " + requestDetails.requestId);
        const url = new URL(requestDetails.url);
        url.hostname = punycode.toUnicode(url.hostname);

        const result = await kee.findLogins(
            url.href,
            requestDetails.realm,
            null,
            null,
            null,
            null
        );
        let matchedEntries: Entry[] = [];
        let isError = false;

        try {
            if (result) {
                matchedEntries = result.filter(
                    (entry: Entry) => Entry.getUsernameField(entry) && Entry.getPasswordField(entry)
                );
            } else {
                isError = true;
            }
        } catch (e) {
            isError = true;
        }

        if (isError || matchedEntries.length <= 0) {
            return { cancel: false };
        }

        if (
            matchedEntries.length === 1 &&
            configManager.current.autoSubmitNetworkAuthWithSingleMatch
        ) {
            const entry = matchedEntries[0];
            return {
                authCredentials: {
                    username: Entry.getUsernameField(entry).value,
                    password: Entry.getPasswordField(entry).value
                }
            };
        }

        matchedEntries.sort((_e1, e2) => (e2.httpRealm === requestDetails.realm ? 1 : 0));

        // eslint-disable-next-line no-async-promise-executor
        return new Promise<chrome.webRequest.BlockingResponse>(async (resolve, reject) => {
            function handleMessage(request, sender: chrome.runtime.MessageSender) {
                switch (request.action) {
                    case "NetworkAuth_ok": {
                        const entry = matchedEntries[request.selectedEntryIndex];
                        KeeLog.debug("Filling request ID: " + requestDetails.requestId);
                        resolve({
                            authCredentials: {
                                username: Entry.getUsernameField(entry).value,
                                password: Entry.getPasswordField(entry).value
                            }
                        });
                        chrome.runtime.onMessage.removeListener(handleMessage);
                        chrome.windows.onRemoved.removeListener(declineHandling);
                        break;
                    }
                    case "NetworkAuth_load": {
                        // Can't use sendResponse() because Mozilla chose to not implement it, contrary to the MDN docs
                        chrome.tabs.sendMessage(sender.tab.id, {
                            action: "NetworkAuth_matchedEntries",
                            entries: matchedEntries,
                            realm: requestDetails.realm,
                            url: url.href,
                            isProxy: requestDetails.isProxy
                        });
                        break;
                    }
                }
            }

            chrome.runtime.onMessage.addListener(handleMessage);

            let wind;

            function declineHandling(closingWindowId: number) {
                if (closingWindowId !== wind?.id) return;
                KeeLog.debug("Cancelling request ID: " + requestDetails.requestId);
                resolve({ cancel: false });
                chrome.runtime.onMessage.removeListener(handleMessage);
                chrome.windows.onRemoved.removeListener(declineHandling);
            }
            const createData = {
                type: "popup",
                url: "/dist/dialogs/NetworkAuth.html",
                width: 600,
                height: 300
            } as chrome.windows.CreateData;
            try {
                wind = await chrome.windows.create(createData);
                chrome.windows.onRemoved.addListener(declineHandling);
            } catch (e) {
                reject(e);
            }
        });
    }

}
