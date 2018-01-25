class NetworkAuth {
    pendingRequests = [];

    public completed (requestDetails) {
        const index = this.pendingRequests.indexOf(requestDetails.requestId);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
        }
    }

    public provideCredentialsBlockingCallback (
        requestDetails: browser.webRequest.WebAuthenticationChallengeDetails,
        callback: (response: browser.webRequest.BlockingResponse) => void
    ) {
        if (!callback) {
            // Firefox treats this handler as a sync or async block, depending on the return type.
            // We return a Promise to indicate we want to run an async lookup for credentials
            return this.provideCredentialsAsync(requestDetails);
        } else {
            // Chrome & Edge treat this handler as a sync block so we need to return immediately
            // provideCredentialsAsyncBlockingCallback will take the necessary action
            return { cancel: false };
        }
    }

    public provideCredentialsAsyncBlockingCallback (
        requestDetails: browser.webRequest.WebAuthenticationChallengeDetails,
        callback: (response: browser.webRequest.BlockingResponse) => void
    ) {
        // Firefox fails to register the event listener so this function
        // only executes in other browsers

        this.provideCredentialsAsync(requestDetails)
        .then(
            result => callback(result)
        ).catch(
            reason => {
                KeeLog.error("AsyncBlockingCallback promise failed: " + reason);
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
            KeeLog.debug("Providing credentials for: " + requestDetails.requestId);

            return new Promise<browser.webRequest.BlockingResponse>((resolve, reject) => {

                if (!kee.appState.connected || kee.appState.ActiveKeePassDatabaseIndex < 0) {
                    resolve({ cancel: false });
                    return;
                }

                const url = new URL(requestDetails.url);
                url.hostname = punycode.toUnicode(url.hostname);

                kee.findLogins(url.href, null, requestDetails.realm, null, null, null, null, result => {

                    let foundLogins = null;
                    const convertedResult: keeLoginInfo[] = [];
                    let isError = false;

                    try {
                        if (result.result) {
                            foundLogins = result.result;

                            for (const i in foundLogins) {
                                const kfl = new keeLoginInfo();
                                kfl.initFromEntry(foundLogins[i]);

                                // Only consider logins that contain a username and password to fill in
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
                                browser.runtime.onMessage.removeListener(handleMessage);
                                break;
                            case "NetworkAuth_cancel":
                                resolve({ cancel: false });
                                browser.runtime.onMessage.removeListener(handleMessage);
                                break;
                            case "NetworkAuth_load":
                                // Can't use sendResponse() because Mozilla chose to not implement it, contrary to the MDN docs
                                browser.tabs.sendMessage(sender.tab.id, {
                                    action: "NetworkAuth_matchedLogins",
                                    logins: convertedResult,
                                    realm: requestDetails.realm,
                                    url: url.href,
                                    isProxy: requestDetails.isProxy });
                                break;
                        }
                    }

                    browser.runtime.onMessage.addListener(handleMessage);

                    const createData = {
                        type: browser.windows.CreateType.POPUP,
                        url: "/dialogs/NetworkAuth.html",
                        width: 600,
                        height: 300
                    };
                    browser.windows.create(createData);
                });
            });
        }
    }

    public startListening () {
        try {
            // Firefox currently logs an error message to console which isn't ideal but is the
            // only way to get cross-browser support for this API.
            // (Error: Invalid option asyncBlocking)
            // We try/catch just in case that ever changes, although it's likely code changes
            // would also be required to retain functionality if this change were made.
            chrome.webRequest.onAuthRequired.addListener(
                (requestDetails, callback) => { this.provideCredentialsAsyncBlockingCallback(requestDetails, callback); },
                { urls: ["<all_urls>"] },
                ["asyncBlocking"]
            );
        } catch (e) {
            KeeLog.error("Unexpected exception calling an asyncBlocking chrome.webRequest.onAuthRequired.addListener");
        }

        chrome.webRequest.onAuthRequired.addListener(
            (requestDetails, callback) => this.provideCredentialsBlockingCallback(requestDetails, callback),
            { urls: ["<all_urls>"] },
            ["blocking"]
        );

        browser.webRequest.onCompleted.addListener(
            requestDetails => { this.completed(requestDetails); },
            { urls: ["<all_urls>"] }
        );

        browser.webRequest.onErrorOccurred.addListener(
            requestDetails => { this.completed(requestDetails); },
            { urls: ["<all_urls>"] }
        );

        KeeLog.debug("Network authentication listeners started");
    }
}
