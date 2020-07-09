import { AddonMessage } from "../common/AddonMessage";
import { KeeLog } from "../common/Logger";
import { KeeNotification } from "../common/KeeNotification";
import { Action } from "../common/Action";
import { configManager } from "../common/ConfigManager";
import { VaultMessage } from "../common/VaultMessage";
import { VaultAction } from "../common/VaultAction";
import store from "../store";
import { Entry } from "../common/model/Entry";

// callbacks for messaging / ports

export function browserPopupMessageHandler(this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from browser popup script.");
    }

    if (msg.removeNotification) {
        window.kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
    }
    if (msg.loadUrlUpgradeKee) {
        browser.tabs.create({
            url: "https://www.kee.pm/upgrade-kprpc"
        });
    }
    if (msg.action == Action.GetPasswordProfiles) {
        window.kee.getPasswordProfiles(passwordProfiles => {
            store.dispatch("updatePasswordProfiles", passwordProfiles);
        });
    }
    if (msg.action === Action.GeneratePassword) {
        window.kee.generatePassword(
            msg.passwordProfile,
            msg.url ?? "unknown URL",
            generatedPassword => {
                if (generatedPassword) {
                    store.dispatch("updateGeneratedPassword", generatedPassword);
                } else {
                    KeeLog.warn(
                        "Kee received an empty/missing password. Check the configuration of your password manager."
                    );
                }
            }
        );
    }
    if (msg.action === Action.CreateEntry || msg.action === Action.UpdateEntry) {
        if (store.state.connected) {
            const sourceEntry = store.state.saveState.newEntry;
            const existingOrTemporaryUuid = sourceEntry.uuid;
            const dbFileName = sourceEntry.database.fileName;
            const parentGroupUuid: string = sourceEntry.parentGroup.uuid;

            // shallow clone so we don't impact the values we have to wipe out below
            // KPRPC has particular expectations about some Entry properties.
            // parent group UUID, DB and UUID should all be undefined or null as set below.
            const entry = new Entry(
                Object.assign(Object.assign({} as Entry, sourceEntry) as Entry, {
                    parentGroup: undefined,
                    uuid: null,
                    database: undefined,

                    // We will rarely have access to the favicon data at the time the initial
                    // Entry is created for editing in the popup so set it at this much later
                    // point instead.
                    icon: configManager.current.saveFavicons
                        ? {
                              version: 1,
                              iconImageData: store.state.saveState.favicon
                          }
                        : null
                })
            );

            // Might be changed by the user before KPRPC says all worked OK
            const tabId = window.kee.foregroundTabId;
            const clearSubmittedData = () => {
                if (window.kee.persistentTabStates.get(tabId)?.items?.length > 0) {
                    window.kee.persistentTabStates.get(
                        tabId
                    ).items = window.kee.persistentTabStates
                        .get(tabId)
                        .items.filter(item => item.itemType !== "submittedData");
                }
            };

            if (msg.action === Action.UpdateEntry) {
                window.kee.updateLogin(
                    entry,
                    existingOrTemporaryUuid,
                    dbFileName,
                    clearSubmittedData
                );
            } else {
                window.kee.addLogin(entry, parentGroupUuid, dbFileName, clearSubmittedData);
            }
            if (!configManager.current.mruGroup) configManager.current.mruGroup = {};
            configManager.current.mruGroup[dbFileName] = parentGroupUuid;
            configManager.current.mruGroup["{<{{<<kee-primary>>}}>}"] = parentGroupUuid;
            configManager.save();
        }
    }

    if (msg.action == Action.ManualFill && msg.selectedEntryIndex != null) {
        window.kee.tabStates
            .get(window.kee.foregroundTabId)
            .framePorts.get(msg.frameId || 0)
            .postMessage(msg);
        window.kee.tabStates
            .get(window.kee.foregroundTabId)
            .framePorts.get(0)
            .postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action === Action.OpenKeePass) {
        window.kee.openKeePass();
    }
    if (msg.findMatches) {
        window.kee.findLogins(
            null,
            null,
            msg.findMatches.uuid,
            msg.findMatches.DBfilename,
            null,
            null,
            result => {
                window.kee.browserPopupPort.postMessage({
                    findMatchesResult: result
                } as AddonMessage);
            }
        );
    }
    if (msg.loginEditor) {
        window.kee.launchLoginEditor(msg.loginEditor.uuid, msg.loginEditor.DBfilename);
    }
}

export async function pageMessageHandler(this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from page script.");
    }

    if (msg.findMatches) {
        window.kee.findLogins(msg.findMatches.uri, null, null, null, null, null, result => {
            this.postMessage({
                isForegroundTab: this.sender.tab.id === window.kee.foregroundTabId,
                findMatchesResult: result
            } as AddonMessage);
        });
    }
    if (msg.removeNotification) {
        window.kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        try {
            window.kee.browserPopupPort.postMessage({
                isForegroundTab: this.sender.tab.id === window.kee.foregroundTabId
            } as AddonMessage);
        } catch (e) {
            /* whatever */
        }
    }
    if (msg.entries) {
        window.kee.tabStates.get(this.sender.tab.id).frames.get(this.sender.frameId).entries =
            msg.entries;
    }
    if (msg.submittedData) {
        const persistentItem = {
            itemType: "submittedData" as "submittedData",
            submittedData: msg.submittedData,
            creationDate: new Date()
        };

        if (!window.kee.persistentTabStates.get(this.sender.tab.id)) {
            window.kee.persistentTabStates.set(this.sender.tab.id, {
                items: []
            });
        }

        // Don't allow more than one entry to be tracked for this tab
        if (window.kee.persistentTabStates.get(this.sender.tab.id)) {
            window.kee.persistentTabStates.get(
                this.sender.tab.id
            ).items = window.kee.persistentTabStates
                .get(this.sender.tab.id)
                .items.filter(item => item.itemType !== "submittedData");
        }

        window.kee.persistentTabStates.get(this.sender.tab.id).items.push(persistentItem);

        if (configManager.current.notificationCountSavePassword < 10) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("common/images/128.png"),
                title: $STR("savePasswordText"),
                message:
                    $STR("notification_save_password_tip") +
                    "\n" +
                    $STR("notification_only_shown_some_times")
            });
            configManager.setASAP({
                notificationCountSavePassword:
                    configManager.current.notificationCountSavePassword + 1
            });
        }
        if (configManager.current.animateWhenOfferingSave) {
            window.kee.animateBrowserActionIcon();
        }
    }
    if (msg.action === Action.ShowMatchedLoginsPanel) {
        window.kee.tabStates.get(this.sender.tab.id).framePorts.get(0).postMessage({
            action: Action.ShowMatchedLoginsPanel,
            frameId: this.sender.frameId
        });
    }
    if (msg.action === Action.PageHide) {
        try {
            window.kee.tabStates.get(this.sender.frameId).framePorts.forEach((port, key, map) => {
                try {
                    port.disconnect();
                } catch (e) {
                    if (KeeLog && KeeLog.debug) {
                        KeeLog.debug(
                            "failed to disconnect a frame port on tab " +
                                key +
                                ". This is probably not a problem but we may now be reliant on browser " +
                                "GC to clear down memory. The exception that caused this is: " +
                                e.message +
                                " : " +
                                e.stack
                        );
                    }
                } finally {
                    map.delete(key);
                }
            });
        } catch (e) {
            // Happens when an iframe is hidden after the top-level frame. The
            // only impact is some messaging ports remaining open for longer
            // than required. Pretty sure the browser has to deal with this
            // situation already - probably just through standard GC.
        }
        if (this.sender.frameId === 0) {
            window.kee.deleteTabState(this.sender.tab.id);
        }
    }
}

export function vaultMessageHandler(this: browser.runtime.Port, msg: VaultMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    let result;
    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from vault script.");
    }
    switch (msg.action) {
        case VaultAction.Init:
            result = window.kee.KeePassRPC.startEventSession(
                msg.sessionId,
                msg.features,
                msgToPage => this.postMessage(msgToPage)
            );
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.MessageToClient:
            result = window.kee.KeePassRPC.eventSessionMessageFromPage(msg);
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.FocusRequired:
            browser.tabs.update(this.sender.tab.id, { active: true });
            browser.windows.update(this.sender.tab.windowId, { focused: true });
            return;
        case VaultAction.AccountChanged:
            window.kee.accountManager.processNewTokens(msg.tokens);
            return;
    }
}

export function iframeMessageHandler(this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from iframe script.");
    }

    const tabId = this.sender.tab.id;
    const frameId = this.sender.frameId;
    const port = this;

    if (msg.action == Action.ManualFill && msg.selectedEntryIndex != null) {
        window.kee.tabStates
            .get(tabId)
            .framePorts.get(msg.frameId || 0)
            .postMessage(msg);
        window.kee.tabStates
            .get(tabId)
            .framePorts.get(0)
            .postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action == Action.CloseAllPanels) {
        window.kee.tabStates.get(tabId).framePorts.get(0).postMessage(msg);
    }

    if (msg.action == Action.GetPasswordProfiles) {
        window.kee.getPasswordProfiles(passwordProfiles => {
            store.dispatch("updatePasswordProfiles", passwordProfiles);
            if (passwordProfiles.length > 0) {
                port.postMessage({ passwordProfiles } as AddonMessage);
            }
        });
    }

    if (msg.action == Action.GeneratePassword) {
        window.kee.generatePassword(
            msg.passwordProfile,
            window.kee.tabStates.get(tabId).url,
            generatedPassword => {
                if (generatedPassword) {
                    port.postMessage({
                        generatedPassword: generatedPassword
                    } as AddonMessage);
                } else {
                    KeeLog.warn(
                        "Kee received an empty/missing password. Check the configuration of your password manager."
                    );
                }
            }
        );
    }

    if (msg.loginEditor) {
        window.kee.launchLoginEditor(msg.loginEditor.uuid, msg.loginEditor.DBfilename);
    }
}
