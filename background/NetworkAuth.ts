class NetworkAuth {
    pendingRequests = [];

    public completed (requestDetails) {
        const index = this.pendingRequests.indexOf(requestDetails.requestId);
        if (index > -1) {
            this.pendingRequests.splice(index, 1);
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
        this.pendingRequests.push(requestDetails.requestId);
        KeeLog.debug("Providing credentials for: " + requestDetails.requestId);

        return new Promise<browser.webRequest.BlockingResponse>((resolve, reject) => {

            if (!kee.appState.connected || kee.appState.ActiveKeePassDatabaseIndex < 0) {
                resolve({ cancel: false });
                return;
            }

                let originalUrl;

                if (requestDetails.isProxy) {
                    if (requestDetails.proxyInfo) {
                        // Firefox
                        originalUrl = requestDetails.proxyInfo.host;
                    } else {
                        // Chrome
                        originalUrl = requestDetails.challenger.host;
                    }
                } else {
                    originalUrl = requestDetails.url;
                }

                const url = new URL(originalUrl);
                url.hostname = __punycode.toUnicode(url.hostname);

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
                    type: "popup" as browser.windows.CreateType,
                    url: "/dialogs/NetworkAuth.html",
                    width: 600,
                    height: 300
                };
                browser.windows.create(createData)

                // This is a workaround for the Firefox bug in #71
                .then(win => setTimeout(() => {
                    try {
                    return browser.windows.update(win.id, {width: 610, height: 310 })
                    .then(() => {
                        browser.windows.update(win.id, {width: 600, height: 300 });
                    });
                } catch (e) {
                    // Ignore - just means that the window has already been closed.
                }
                }, 1500));
            });
        });
    }

    public startListening () {
        if (__KeeIsRunningInAWebExtensionsBrowser) {
            browser.webRequest.onAuthRequired.addListener(
                requestDetails => this.provideCredentialsAsync(requestDetails),
                { urls: ["<all_urls>"] },
                ["blocking"]
            );
        } else {
            chrome.webRequest.onAuthRequired.addListener(
                (requestDetails, callback) => { this.provideCredentialsAsyncBlockingCallback(requestDetails, callback); },
                { urls: ["<all_urls>"] },
                ["asyncBlocking"]
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

        KeeLog.debug("Network authentication listeners started");
    }
}
