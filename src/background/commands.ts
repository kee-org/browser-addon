import { Command } from "./Command";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import {useStubStore} from "../store";

const store = useStubStore();

export class KFCommands {
    private contextMenuUpdateLock = false;

    public init() {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case Command.DetectForms:
                    if (store.connected && store.ActiveKeePassDatabaseIndex >= 0) {
                        window.kee.tabStates
                            .get(window.kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({
                                    action: Action.DetectForms
                                });
                            }, this);
                    }
                    break;
                case Command.PrimaryAction:
                    if (store.ActiveKeePassDatabaseIndex < 0) {
                        window.kee.loginToPasswordManager();
                    } else {
                        window.kee.tabStates
                            .get(window.kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({ action: Action.Primary });
                            }, this);
                    }
                    break;
                case Command.GeneratePassword:
                    window.kee.initiatePasswordGeneration();
                    break;
            }
        });

        browser.contextMenus.onClicked.addListener(info => {
            const id = info.menuItemId as string;
            switch (id) {
                case Command.DetectForms:
                    if (store.connected && store.ActiveKeePassDatabaseIndex >= 0) {
                        window.kee.tabStates
                            .get(window.kee.foregroundTabId)
                            .framePorts.forEach(port => {
                                port.postMessage({
                                    action: Action.DetectForms
                                });
                            }, this);
                    }
                    break;
                // case Command.PrimaryAction:
                //     if (store.ActiveKeePassDatabaseIndex < 0) {
                //         window.kee.loginToPasswordManager();
                //     } else {
                //         window.kee.tabStates.get(window.kee.foregroundTabId).framePorts.forEach(port => {
                //                 port.postMessage({ action: Action.Primary });
                //         }, this);
                //     }
                // break;
                case Command.GeneratePassword:
                    window.kee.initiatePasswordGeneration();
                    break;
            }
            if (id.startsWith("matchedLogin-")) {
                window.kee.tabStates
                    .get(window.kee.foregroundTabId)
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

        commandManager.contextMenuUpdateLock = true;
        try {
            await browser.contextMenus.removeAll();

            if (store.connected && store.ActiveKeePassDatabaseIndex >= 0) {
                try {
                    browser.contextMenus.create({
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
                        ]
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: Command.DetectForms,
                        title: $STR("Menu_Button_fillCurrentDocument_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: ["editable", "frame", "image", "link", "page", "selection"]
                    });
                }
            }

            if (store.connected) {
                try {
                    browser.contextMenus.create({
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
                        ]
                    });
                } catch (e) {
                    // try again with Chrome-supported contexts
                    browser.contextMenus.create({
                        id: Command.GeneratePassword,
                        title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                        documentUrlPatterns: ["http://*/*", "https://*/*"],
                        contexts: ["editable", "frame", "image", "link", "page", "selection"]
                    });
                }
            }

            if (
                window.kee.foregroundTabId >= 0 &&
                window.kee.tabStates.has(window.kee.foregroundTabId) &&
                window.kee.tabStates.get(window.kee.foregroundTabId).frames
            ) {
                window.kee.tabStates.get(window.kee.foregroundTabId).frames.forEach(frame => {
                    for (let j = 0; j < frame.entries.length; j++) {
                        const entry = frame.entries[j];
                        try {
                            browser.contextMenus.create({
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
                                ]
                            });
                        } catch (e) {
                            // try again with Chrome-supported contexts
                            browser.contextMenus.create({
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
