class KFCommands {
    public init ()
    {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case Command.DetectForms:
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
                            port.postMessage({ action: Action.DetectForms });
                        }, this);
                    }
                break;
                case Command.PrimaryAction:
                    if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                        kee.loginToKeePass();
                    } else {
                        kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
                            port.postMessage({ action: Action.Primary });
                        }, this);
                    }
                break;
                case Command.GeneratePassword:
                    if (kee.appState.connected) {
                        kee.tabStates.get(kee.foregroundTabId).framePorts.get(0).postMessage({ action: Action.GeneratePassword });
                    }
                break;
            }
        });

        browser.contextMenus.onClicked.addListener((info, tab) => {
            const id = (info.menuItemId as string);
            switch (id) {
                case Command.DetectForms:
                    if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
                            port.postMessage({ action: Action.DetectForms });
                        }, this);
                    }
                break;
                // case Command.PrimaryAction:
                //     if (kee.appState.ActiveKeePassDatabaseIndex < 0) {
                //         kee.loginToKeePass();
                //     } else {
                //         kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
                //                 port.postMessage({ action: Action.Primary });
                //         }, this);
                //     }
                // break;
                case Command.GeneratePassword:
                    if (kee.appState.connected) {
                        kee.tabStates.get(kee.foregroundTabId).framePorts.get(0).postMessage({ action: Action.GeneratePassword });
                    }
                break;
            }
            if (id.startsWith("matchedLogin-")) {
                kee.tabStates.get(kee.foregroundTabId).framePorts.get(info.frameId).postMessage({ action: Action.ManualFill, selectedLoginIndex: id.substr(id.indexOf("-")+1) });
            }
        });
    }

    public async setupContextMenuItems () { // switch to promises?
        await browser.contextMenus.removeAll();

        if (kee.appState.connected && kee.appState.ActiveKeePassDatabaseIndex >= 0) {
            try {
                browser.contextMenus.create({
                    id: Command.DetectForms,
                    title: $STR("Menu_Button_fillCurrentDocument_label"),
                    contexts: [ browser.contextMenus.ContextType.EDITABLE,
                            browser.contextMenus.ContextType.FRAME,
                            browser.contextMenus.ContextType.IMAGE,
                            browser.contextMenus.ContextType.LINK,
                            browser.contextMenus.ContextType.PAGE,
                            browser.contextMenus.ContextType.PASSWORD,
                            browser.contextMenus.ContextType.SELECTION ]
                });
            } catch (e) {
                // try again with Chrome-supported contexts
                browser.contextMenus.create({
                    id: Command.DetectForms,
                    title: $STR("Menu_Button_fillCurrentDocument_label"),
                    contexts: [ browser.contextMenus.ContextType.EDITABLE,
                        browser.contextMenus.ContextType.FRAME,
                        browser.contextMenus.ContextType.IMAGE,
                        browser.contextMenus.ContextType.LINK,
                        browser.contextMenus.ContextType.PAGE,
                        browser.contextMenus.ContextType.SELECTION ]
                });
            }
        }

        if (kee.appState.connected) {
            try {
                browser.contextMenus.create({
                    id: Command.GeneratePassword,
                    title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                    contexts: [ browser.contextMenus.ContextType.EDITABLE,
                        browser.contextMenus.ContextType.FRAME,
                        browser.contextMenus.ContextType.IMAGE,
                        browser.contextMenus.ContextType.LINK,
                        browser.contextMenus.ContextType.PAGE,
                        browser.contextMenus.ContextType.PASSWORD,
                        browser.contextMenus.ContextType.SELECTION ]
            });
            } catch (e) {
                // try again with Chrome-supported contexts
                browser.contextMenus.create({
                    id: Command.GeneratePassword,
                    title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                    contexts: [ browser.contextMenus.ContextType.EDITABLE,
                        browser.contextMenus.ContextType.FRAME,
                        browser.contextMenus.ContextType.IMAGE,
                        browser.contextMenus.ContextType.LINK,
                        browser.contextMenus.ContextType.PAGE,
                        browser.contextMenus.ContextType.SELECTION ]
                });
            }
        }

        // if (kee.appState.ActiveKeePassDatabaseIndex < 0) {

        // }

        if (kee.foregroundTabId >= 0
        && kee.tabStates.has(kee.foregroundTabId)
        && kee.tabStates.get(kee.foregroundTabId).frames) {
            kee.tabStates.get(kee.foregroundTabId).frames.forEach(frame => {
                for (let j=0; j<frame.logins.length; j++) {
                    const login = frame.logins[j];
                    try {
                        browser.contextMenus.create({
                            id: "matchedLogin-" + j,
                            title: login.title,
                            contexts: [ browser.contextMenus.ContextType.EDITABLE,
                                browser.contextMenus.ContextType.FRAME,
                                browser.contextMenus.ContextType.IMAGE,
                                browser.contextMenus.ContextType.LINK,
                                browser.contextMenus.ContextType.PAGE,
                                browser.contextMenus.ContextType.PASSWORD,
                                browser.contextMenus.ContextType.SELECTION ]
                    });
                    } catch (e) {
                        // try again with Chrome-supported contexts
                        browser.contextMenus.create({
                            id: "matchedLogin-" + j,
                            title: login.title,
                            contexts: [ browser.contextMenus.ContextType.EDITABLE,
                                browser.contextMenus.ContextType.FRAME,
                                browser.contextMenus.ContextType.IMAGE,
                                browser.contextMenus.ContextType.LINK,
                                browser.contextMenus.ContextType.PAGE,
                                browser.contextMenus.ContextType.SELECTION ]
                        });
                    }
                }
            });
        }
    }
}

// initialise the command system
let commandManager = new KFCommands();
commandManager.init();
