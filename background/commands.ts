class KFCommands {

    public init ()
    {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case "detect-forms":
                    if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                case "primary-action":
                    if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {
                        keefox_org.loginToKeePass();
                    } else {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "primary" });
                        }, this);
                    }
                break;
                case "generate-password":
                    if (keefox_org.appState.connected) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "generatePassword" });
                        }, this);
                    }
                break;
            }
        });

        browser.contextMenus.onClicked.addListener((info, tab) => {
            const id = (info.menuItemId as string);
            switch (id) {
                case "detect-forms":
                    if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                // case "primary-action":
                //     if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {
                //         keefox_org.loginToKeePass();
                //     } else {
                //         keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                //                 port.postMessage({ action: "primary" });
                //         }, this);
                //     }
                // break;
                case "generate-password":
                    if (keefox_org.appState.connected) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "generatePassword" });
                        }, this);
                    }
                break;
            }
            if (id.startsWith("matchedLogin-")) {
                keefox_org.ports.tabs[keefox_org.foregroundTabId][(info as any).frameId].postMessage({ action: "manualFill", selectedLoginIndex: id.substr(id.indexOf("-")+1) });
            }
        });
    };

    public setupContextMenuItems () {
        chrome.contextMenus.removeAll(() => {
            if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
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

            if (keefox_org.appState.connected) {
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

            // if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {

            // }

            if (keefox_org.foregroundTabId >= 0
            && keefox_org.tabStates[keefox_org.foregroundTabId]
            && keefox_org.tabStates[keefox_org.foregroundTabId].logins
            && keefox_org.tabStates[keefox_org.foregroundTabId].logins.length > 0) {
                for (let i=0; i<keefox_org.tabStates[keefox_org.foregroundTabId].logins.length; i++) {
                    const login = keefox_org.tabStates[keefox_org.foregroundTabId].logins[i];
                    try {
                        browser.contextMenus.create({
                            id: "matchedLogin-" + i,
                            title: login.title,
                            contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                    });
                    } catch (e) {
                        // try again with Chrome-supported contexts
                        browser.contextMenus.create({
                            id: "matchedLogin-" + i,
                            title: login.title,
                            contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                        });
                    }
                }
            }
        });
    }
}

// initialise the command system
let commandManager = new KFCommands();
commandManager.init();
