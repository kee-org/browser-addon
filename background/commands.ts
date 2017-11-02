
const enum Command {
    DetectForms = "detect-forms",
    PrimaryAction = "primary-action",
    GeneratePassword = "generate-password"
}

class KFCommands {
    public init ()
    {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case Command.DetectForms:
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: Actions.DetectForms });
                        }, this);
                    }
                break;
                case Command.PrimaryAction:
                    if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                        kee.loginToKeePass();
                    } else {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: Actions.Primary });
                        }, this);
                    }
                break;
                case Command.GeneratePassword:
                    if (kee.appState.connected) {
                        kee.tabStates[kee.foregroundTabId].framePorts[0].postMessage({ action: Actions.GeneratePassword });
                    }
                break;
            }
        });

        browser.contextMenus.onClicked.addListener((info, tab) => {
            const id = (info.menuItemId as string);
            switch (id) {
                case Command.DetectForms:
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                                port.postMessage({ action: Actions.DetectForms });
                        }, this);
                    }
                break;
                // case Command.PrimaryAction:
                //     if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                //         kee.loginToKeePass();
                //     } else {
                //         kee.tabStates[kee.foregroundTabId].framePorts.forEach(port => {
                //                 port.postMessage({ action: Actions.Primary });
                //         }, this);
                //     }
                // break;
                case Command.GeneratePassword:
                    if (kee.appState.connected) {
                        kee.tabStates[kee.foregroundTabId].framePorts[0].postMessage({ action: Actions.GeneratePassword });
                    }
                break;
            }
            if (id.startsWith("matchedLogin-")) {
                kee.tabStates[kee.foregroundTabId].framePorts[(info as any).frameId].postMessage({ action: Actions.ManualFill, selectedLoginIndex: id.substr(id.indexOf("-")+1) });
            }
        });
    }

    public setupContextMenuItems () {
        chrome.contextMenus.removeAll(() => {
            if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                try {
                    browser.contextMenus.create({
                        id: Command.DetectForms,
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: Command.DetectForms,
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                    });
                }
            }

            if (kee.appState.connected) {
                try {
                    browser.contextMenus.create({
                        id: Command.GeneratePassword,
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: Command.GeneratePassword,
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
