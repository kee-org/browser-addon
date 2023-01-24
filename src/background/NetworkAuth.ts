import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import useStore, { KeeStore } from "../store";
import { Entry } from "../common/model/Entry";

declare const punycode;

// Pretend browser (WebExtensions) is chrome (we include a
// polyfill from Mozilla but it doesn't work in some cases)
declare const chrome;

export class NetworkAuth {
    pendingRequests = [];
    store: KeeStore = useStore();

    public completed(requestDetails) {
        const index = this.pendingRequests.indexOf(requestDetails.requestId);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
        }
    }

    public provideCredentialsAsyncBlockingCallback(
        requestDetails: any,
        callback: (response: browser.webRequest.BlockingResponse) => void
    ) {
        // Firefox fails to register the event listener so this function
        // only executes in other browsers

        this.provideCredentialsAsync(requestDetails)
            .then(result => callback(result))
            .catch(reason => {
                KeeLog.error("AsyncBlockingCallback promise failed: " + reason);
                callback({ cancel: false });
            });
    }

    public async provideCredentialsAsync(
        requestDetails: any
    ): Promise<browser.webRequest.BlockingResponse> {
        this.pendingRequests.push(requestDetails.requestId);
        KeeLog.debug("Providing credentials for: " + requestDetails.requestId);

        if (!this.store.connected || this.store.ActiveKeePassDatabaseIndex < 0) {
            return { cancel: false };
        }

        const url = new URL(requestDetails.url);
        url.hostname = punycode.toUnicode(url.hostname);

        const result = await window.kee.findLogins(
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

        return new Promise<browser.webRequest.BlockingResponse>(resolve => {
            function handleMessage(request, sender: browser.runtime.MessageSender) {
                switch (request.action) {
                    case "NetworkAuth_ok": {
                        const entry = matchedEntries[request.selectedEntryIndex];
                        resolve({
                            authCredentials: {
                                username: Entry.getUsernameField(entry).value,
                                password: Entry.getPasswordField(entry).value
                            }
                        });
                        browser.runtime.onMessage.removeListener(handleMessage);
                        break;
                    }
                    case "NetworkAuth_cancel": {
                        resolve({ cancel: false });
                        browser.runtime.onMessage.removeListener(handleMessage);
                        break;
                    }
                    case "NetworkAuth_load": {
                        // Can't use sendResponse() because Mozilla chose to not implement it, contrary to the MDN docs
                        browser.tabs.sendMessage(sender.tab.id, {
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

            browser.runtime.onMessage.addListener(handleMessage);

            const createData = {
                type: "popup" as browser.windows.CreateType,
                url: "/dialogs/NetworkAuth.html",
                width: 600,
                height: 300
            };
            browser.windows.create(createData);
        });
    }

    public startListening() {
        if (__KeeIsRunningInAWebExtensionsBrowser) {
            browser.webRequest.onAuthRequired.addListener(
                requestDetails => this.provideCredentialsAsync(requestDetails),
                { urls: ["<all_urls>"] },
                ["blocking"]
            );
        } else {
            chrome.webRequest.onAuthRequired.addListener(
                (requestDetails, callback) => {
                    this.provideCredentialsAsyncBlockingCallback(requestDetails, callback);
                },
                { urls: ["<all_urls>"] },
                ["asyncBlocking"]
            );
        }

        browser.webRequest.onCompleted.addListener(
            requestDetails => {
                this.completed(requestDetails);
            },
            { urls: ["<all_urls>"] }
        );

        browser.webRequest.onErrorOccurred.addListener(
            requestDetails => {
                this.completed(requestDetails);
            },
            { urls: ["<all_urls>"] }
        );

        KeeLog.debug("Network authentication listeners started");
    }
}
