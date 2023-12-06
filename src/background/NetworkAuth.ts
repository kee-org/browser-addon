import { isFirefox } from "webext-detect-page";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Entry } from "../common/model/Entry";
import punycode from "punycode/";
import { kee } from "./KF";

export class NetworkAuth {
    constructor() {}

    pendingRequests = [];

    public completed(requestDetails) {
        const index = this.pendingRequests.indexOf(requestDetails.requestId);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
        }
    }

    public provideCredentialsAsyncBlockingCallback(
        requestDetails: any,
        callback: (response: chrome.webRequest.BlockingResponse) => void
    ) {
        // Firefox fails to register the event listener so this function
        // only executes in other browsers

        this.provideCredentialsAsync(requestDetails)
            .then(result => callback(result))
            .catch(reason => {
                KeeLog.error("AsyncBlockingCallback promise failed", reason);
                callback({ cancel: false });
            });
    }

    public async provideCredentialsAsync(
        requestDetails: any
    ): Promise<chrome.webRequest.BlockingResponse> {
        this.pendingRequests.push(requestDetails.requestId);
        KeeLog.debug("Providing credentials for: " + requestDetails.requestId);

        if (!kee.store.state.connected || kee.store.state.ActiveKeePassDatabaseIndex < 0) {
            return { cancel: false };
        }

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

        return new Promise<chrome.webRequest.BlockingResponse>(resolve => {
            function handleMessage(request, sender: chrome.runtime.MessageSender) {
                switch (request.action) {
                    case "NetworkAuth_ok": {
                        const entry = matchedEntries[request.selectedEntryIndex];
                        resolve({
                            authCredentials: {
                                username: Entry.getUsernameField(entry).value,
                                password: Entry.getPasswordField(entry).value
                            }
                        });
                        chrome.runtime.onMessage.removeListener(handleMessage);
                        break;
                    }
                    case "NetworkAuth_cancel": {
                        resolve({ cancel: false });
                        chrome.runtime.onMessage.removeListener(handleMessage);
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

            const createData = {
                type: "popup",
                url: "/dist/dialogs/NetworkAuth.html",
                width: 600,
                height: 300
            } as chrome.windows.CreateData;
            chrome.windows.create(createData);
        });
    }

}
