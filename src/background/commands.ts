import { Command } from "./Command";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { kee } from "./KF";


export class KFCommands {
    private contextMenuUpdateLock = false;

    public init() {
        chrome.commands.onCommand.addListener(command => {
            const store = kee.store;
            switch (command) {
                case Command.DetectForms:
                    if (store.state.connected && store.state.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates
                            .get(kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({
                                    action: Action.DetectForms
                                });
                            }, this);
                    }
                    break;
                case Command.PrimaryAction:
                    if (store.state.ActiveKeePassDatabaseIndex < 0) {
                        kee.loginToPasswordManager();
                    } else {
                        kee.tabStates
                            .get(kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({ action: Action.Primary });
                            }, this);
                    }
                    break;
                case Command.GeneratePassword:
                    kee.initiatePasswordGeneration();
                    break;
            }
        });

        chrome.contextMenus.onClicked.addListener(info => {
            const id = info.menuItemId as string;
            const store = kee.store;
            switch (id) {
                case Command.DetectForms:
                    if (store.state.connected && store.state.ActiveKeePassDatabaseIndex >= 0) {
                        kee.tabStates
                            .get(kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({
                                    action: Action.DetectForms
                                });
                            }, this);
                    }
                    break;
                // case Command.PrimaryAction:
                //     if (store.ActiveKeePassDatabaseIndex < 0) {
                //         kee.loginToPasswordManager();
                //     } else {
                //         kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
                //                 port.postMessage({ action: Action.Primary });
                //         }, this);
                //     }
                // break;
                case Command.GeneratePassword:
                    kee.initiatePasswordGeneration();
                    break;
            }
            if (id.startsWith("matchedLogin-")) {
                kee.tabStates
                    .get(kee.foregroundTabId)
                    .framePorts.get(info.frameId)
                    .postMessage({
                        action: Action.ManualFill,
                        selectedEntryIndex: id.substr(id.indexOf("-") + 1)
                    });
            }
        });
    }

    public async setupContextMenuItems() {
        if (commandManager.contextMenuUpdateLock) {
            KeeLog.debug(
                "If you are missing entries from your context menu, we will need" +
                    " to spend more effort on the setupContextMenuItems implementation (wait" +
                    " by using semaphores rather than assuming new search results always follow" +
                    " setup requests with no results)"
            );
            return;
        }
        const store = kee.store;

        commandManager.contextMenuUpdateLock = true;
        try {
            await chrome.contextMenus.removeAll();

            if (store.state.connected && store.state.ActiveKeePassDatabaseIndex >= 0) {
                try {
                    chrome.contextMenus.create({
                        id: Command.DetectForms,
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: [
                            "editable",
                            "frame",
                            "image",
                            "link",
                            "page",
                            "password",
                            "selection"
                        ] as any
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    chrome.contextMenus.create({
                        id: Command.DetectForms,
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: ["editable", "frame", "image", "link", "page", "selection"]
                    });
                }
            }

            if (store.state.connected) {
                try {
                    chrome.contextMenus.create({
                        id: Command.GeneratePassword,
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: [
                            "editable",
                            "frame",
                            "image",
                            "link",
                            "page",
                            "password",
                            "selection"
                        ] as any
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    chrome.contextMenus.create({
                        id: Command.GeneratePassword,
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: ["editable", "frame", "image", "link", "page", "selection"]
                    });
                }
            }

            if (
                kee.foregroundTabId >= 0 &&
                kee.tabStates.has(kee.foregroundTabId) &&
                kee.tabStates.get(kee.foregroundTabId).frames
            ) {
                kee.tabStates.get(kee.foregroundTabId).frames.forEach(frame => {
                    for (let j = 0; j < frame.entries.length; j++) {
                        const entry = frame.entries[j];
                        try {
                            chrome.contextMenus.create({
                                id: "matchedLogin-" + j,
                                title: entry.title,
                                documentUrlPatterns: ["http://*/*", "https://*/*"],
                                contexts: [
                                    "editable",
                                    "frame",
                                    "image",
                                    "link",
                                    "page",
                                    "password",
                                    "selection"
                                ] as any
                            });
                        } catch (e) {
                            // try again with Chrome-supported contexts
                            chrome.contextMenus.create({
                                id: "matchedLogin-" + j,
                                title: entry.title,
                                documentUrlPatterns: ["http://*/*", "https://*/*"],
                                contexts: [
                                    "editable",
                                    "frame",
                                    "image",
                                    "link",
                                    "page",
                                    "selection"
                                ]
                            });
                        }
                    }
                });
            }
        } finally {
            commandManager.contextMenuUpdateLock = false;
        }
    }
}

// initialise the command system
export const commandManager = new KFCommands();
commandManager.init();
