class KFCommands {

    public init ()
    {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case "detect-forms":
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                case "primary-action":
                    if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                        kee.loginToKeePass();
                    } else {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: "primary" });
                        }, this);
                    }
                break;
                case "generate-password":
                    if (kee.appState.connected) {
                        kee.tabStates[kee.foregroundTabId].framePorts[0].postMessage({ action: "generatePassword" });
                    }
                break;
            }
        });

        browser.contextMenus.onClicked.addListener((info, tab) => {
            const id = (info.menuItemId as string);
            switch (id) {
                case "detect-forms":
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                // case "primary-action":
                //     if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                //         kee.loginToKeePass();
                //     } else {
                //         kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                //                 port.postMessage({ action: "primary" });
                //         }, this);
                //     }
                // break;
                case "generate-password":
                    if (kee.appState.connected) {
                        kee.tabStates[kee.foregroundTabId].framePorts[0].postMessage({ action: "generatePassword" });
                    }
                break;
            }
            if (id.startsWith("matchedLogin-")) {
                kee.tabStates[kee.foregroundTabId].framePorts[(info as any).frameId].postMessage({ action: "manualFill", selectedLoginIndex: id.substr(id.indexOf("-")+1) });
            }
        });
    }

    public setupContextMenuItems () {
        chrome.contextMenus.removeAll(() => {
            if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                try {
                    browser.contextMenus.create({
                        id: "detect-forms",
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: "detect-forms",
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                    });
                }
            }

            if (kee.appState.connected) {
                try {
                    browser.contextMenus.create({
                        id: "generate-password",
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: "generate-password",
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                    });
                }
            }

            // if (kee.appState.ActiveKeePassDatabaseIndex < 0) {

            // }

            if (kee.foregroundTabId >= 0
            && kee.tabStates[kee.foregroundTabId]
            && kee.tabStates[kee.foregroundTabId].frames
            && kee.tabStates[kee.foregroundTabId].frames.length > 0) {
                kee.tabStates[kee.foregroundTabId].frames.forEach(frame => {
                    for (let j=0; j<frame.logins.length; j++) {
                        const login = frame.logins[j];
                        try {
                            browser.contextMenus.create({
                                id: "matchedLogin-" + j,
                                title: login.title,
                                contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                        });
                        } catch (e) {
                            // try again with Chrome-supported contexts
                            browser.contextMenus.create({
                                id: "matchedLogin-" + j,
                                title: login.title,
                                contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                            });
                        }
                    }
                });
            }
        });
    }
}

// initialise the command system
let commandManager = new KFCommands();
commandManager.init();
