class NetworkAuth {
    pendingRequests = [];

    public completed (requestDetails) {
        const index = this.pendingRequests.indexOf(requestDetails.requestId);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
        }
    }

    public provideCredentialsAsyncCallback (
        requestDetails: browser.webRequest.WebAuthenticationChallengeDetails,
        callback: (response: browser.webRequest.BlockingResponse) => void
    ) {
        this.provideCredentialsAsync(requestDetails)
        .then(
            result => callback(result)
        ).catch(
            reason => {
                KeeLog.error("BlockingResponse promise failed: " + reason);
                callback({ cancel: false });
            }
        );
    }

    public provideCredentialsAsync (
        requestDetails: browser.webRequest.WebAuthenticationChallengeDetails
    ): Promise<browser.webRequest.BlockingResponse> {
        if (this.pendingRequests.indexOf(requestDetails.requestId) !== -1) {
            KeeLog.info("Stored credentials for " + requestDetails.requestId + " are incorrect.");
            return Promise.resolve({ cancel: false });
        } else {
            this.pendingRequests.push(requestDetails.requestId);
            KeeLog.debug("providing credentials for: " + requestDetails.requestId);

            return new Promise<browser.webRequest.BlockingResponse>((resolve, reject) => {

                if (!kee.appState.connected || kee.appState.ActiveKeePassDatabaseIndex < 0) {
                    resolve({ cancel: false });
                    return;
                }

                kee.findLogins(requestDetails.url, null, requestDetails.realm, null, null, null, null, result => {

                    let foundLogins = null;
                    const convertedResult: keeLoginInfo[] = [];
                    let isError = false;

                    try {
                        if (result.result) {
                            foundLogins = result.result;

                            for (const i in foundLogins) {
                                const kfl = new keeLoginInfo();
                                kfl.initFromEntry(foundLogins[i]);

                                // Only consider logins that a username and password to fill in
                                if (kfl.passwords != null && kfl.passwords.length > 0
                                    && kfl.otherFields != null && kfl.otherFields.length > 0)
                                    convertedResult.push(kfl);
                            }
                        } else {
                            isError = true;
                        }
                    } catch (e) {
                        isError = true;
                    }

                    if (isError || convertedResult.length <= 0) {
                        resolve( { cancel: false } );
                        return;
                    }

                    if (convertedResult.length === 1 && configManager.current.autoSubmitNetworkAuthWithSingleMatch) {
                        const login = convertedResult[0];
                        resolve({ authCredentials: { username: login.otherFields[login.usernameIndex].value, password: login.passwords[0].value } });
                        return;
                    }

                    function handleMessage (request, sender: browser.runtime.MessageSender, sendResponse) {
                        switch (request.action) {
                            case "NetworkAuth_ok":
                                const login = convertedResult[request.selectedLoginIndex];
                                resolve({ authCredentials: { username: login.otherFields[login.usernameIndex].value, password: login.passwords[0].value } });
                                chrome.runtime.onMessage.removeListener(handleMessage);
                                break;
                            case "NetworkAuth_cancel":
                                resolve({ cancel: false });
                                chrome.runtime.onMessage.removeListener(handleMessage);
                                break;
                            case "NetworkAuth_load":
                                // Can't use sendResponse because Mozilla chose to not implement it, contrary to the MDN docs
                                chrome.tabs.sendMessage(sender.tab.id, {
                                    action: "NetworkAuth_matchedLogins",
                                    logins: convertedResult,
                                    realm: requestDetails.realm,
                                    url: requestDetails.url,
                                    isProxy: requestDetails.isProxy });
                                break;
                        }
                    }

                    chrome.runtime.onMessage.addListener(handleMessage);

                    const createData = {
                        type: "popup",
                        url: "/dialogs/NetworkAuth.html",
                        width: 600,
                        height: 300
                    };
                    const creating = (browser as any).windows.create(createData);
                });
            });
        }
    }

    public startListening () {
        try {
            // Chrome, Edge
            chrome.webRequest.onAuthRequired.addListener(
                (requestDetails, callback) => { this.provideCredentialsAsyncCallback(requestDetails, callback); },
                { urls: ["<all_urls>"] },
                ["asyncBlocking"]
            );
        } catch (e) {
            // Firefox
            browser.webRequest.onAuthRequired.addListener(
                requestDetails => { this.provideCredentialsAsync(requestDetails); },
                { urls: ["<all_urls>"] },
                ["blocking"]
            );
        }

        browser.webRequest.onCompleted.addListener(
            requestDetails => { this.completed(requestDetails); },
            { urls: ["<all_urls>"] }
        );

        browser.webRequest.onErrorOccurred.addListener(
            requestDetails => { this.completed(requestDetails); },
            { urls: ["<all_urls>"] }
        );
    }
}
