import type { AddonMessage } from "../common/AddonMessage";
import { KeeLog } from "../common/Logger";
import { KeeNotification } from "../common/KeeNotification";
import { Action } from "../common/Action";
import { configManager } from "../common/ConfigManager";
import type { VaultMessage } from "../common/VaultMessage";
import { VaultAction } from "../common/VaultAction";
import { Entry } from "../common/model/Entry";
import { copyStringToClipboard } from "../common/copyStringToClipboard";
import { kee } from "./KF";
import { accountManager } from "./AccountManager";


// callbacks for messaging / ports

export async function browserPopupMessageHandler(this: chrome.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        kee.store.onRemoteMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from browser popup script.");
    }

    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
    }
    if (msg.loadUrlUpgradeKee) {
        chrome.tabs.create({
            url: "https://www.kee.pm/upgrade-kprpc"
        });
    }
    if (msg.action == Action.GetPasswordProfiles) {
        const passwordProfiles = await kee.getPasswordProfiles();
        kee.store.updatePasswordProfiles(passwordProfiles);
    }
    if (msg.action === Action.GeneratePassword) {
        const generatedPassword = await kee.generatePassword(
            msg.passwordProfile,
            msg.url ?? "unknown URL"
        );
        if (generatedPassword) {
            kee.store.updateGeneratedPassword(generatedPassword);
        } else {
            KeeLog.warn(
                "Kee received an empty/missing password. Check the configuration of your password manager."
            );
        }
    }
    if (msg.action === Action.CreateEntry || msg.action === Action.UpdateEntry) {
        if (kee.store.state.connected) {
            const sourceEntry = kee.store.state.saveState.newEntry;
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
                              iconImageData: kee.store.state.saveState.favicon
                          }
                        : null
                })
            );

            // Might be changed by the user before KPRPC says all worked OK
            const tabId = kee.foregroundTabId;
            const clearSubmittedData = () => {
                if (kee.persistentTabStates.get(tabId)?.items?.length > 0) {
                    kee.persistentTabStates.get(
                        tabId
                    ).items = kee.persistentTabStates
                        .get(tabId)
                        .items.filter(item => item.itemType !== "submittedData");
                }
            };

            if (msg.action === Action.UpdateEntry) {
                kee.store.updateEntryUpdateStartedAtTimestamp(Date.now());
                kee.updateLogin(
                    entry,
                    existingOrTemporaryUuid,
                    dbFileName,
                    clearSubmittedData
                );
            } else {
                kee.addLogin(entry, parentGroupUuid, dbFileName, clearSubmittedData);
            }
            if (!configManager.current.mruGroup) configManager.current.mruGroup = {};
            configManager.current.mruGroup[dbFileName] = parentGroupUuid;
            configManager.current.mruGroup["{<{{<<kee-primary>>}}>}"] = parentGroupUuid;
            configManager.save();
        }
    }

    if (msg.action == Action.ManualFill && msg.selectedEntryIndex != null) {
        kee.tabStates
            .get(kee.foregroundTabId)
            .framePorts.get(msg.frameId || 0)
            .postMessage(msg);
        kee.tabStates
            .get(kee.foregroundTabId)
            .framePorts.get(0)
            .postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action === Action.OpenKeePass) {
        kee.openKeePass();
    }
    if (msg.findMatches) {
        const result = await kee.findLogins(
            null,
            null,
            msg.findMatches.uuid,
            msg.findMatches.DBfilename,
            null,
            null
        );
        kee.browserPopupPort.postMessage({
            findMatchesResult: result
        } as AddonMessage);
    }
    if (msg.loginEditor) {
        kee.launchLoginEditor(msg.loginEditor.uuid, msg.loginEditor.DBfilename);
    }
    if (msg.action === Action.DetectForms) {
        kee.tabStates.get(kee.foregroundTabId).framePorts.forEach(port => {
            port.postMessage({
                action: Action.DetectForms
            });
        }, this);
    }
}

export async function pageMessageHandler(this: chrome.runtime.Port, msg: AddonMessage) {
    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from page script.");
    }

    if (msg.mutation) {
        kee.store.onRemoteMessage(this, msg.mutation);
    }

    if (msg.findMatches) {
        kee.tabStates.get(this.sender.tab.id).frames.get(this.sender.frameId).entries = [];
        const result = await kee.findLogins(
            msg.findMatches.uri,
            null,
            null,
            null,
            null,
            null
        );
        this.postMessage({
            isForegroundTab: this.sender.tab.id === kee.foregroundTabId,
            findMatchesResult: result
        } as AddonMessage);
    }
    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        try {
            kee.browserPopupPort.postMessage({
                isForegroundTab: this.sender.tab.id === kee.foregroundTabId
            } as AddonMessage);
        } catch (e) {
            /* whatever */
        }
    }
    if (msg.entries) {
        kee.tabStates.get(this.sender.tab.id).frames.get(this.sender.frameId).entries =
            msg.entries;
    }
    if (msg.submittedData) {
        const persistentItem = {
            itemType: "submittedData" as const,
            submittedData: msg.submittedData,
            creationDate: new Date()
        };

        if (!kee.persistentTabStates.get(this.sender.tab.id)) {
            kee.persistentTabStates.set(this.sender.tab.id, {
                items: []
            });
        }

        // Don't allow more than one entry to be tracked for this tab
        if (kee.persistentTabStates.get(this.sender.tab.id)) {
            kee.persistentTabStates.get(
                this.sender.tab.id
            ).items = kee.persistentTabStates
                .get(this.sender.tab.id)
                .items.filter(item => item.itemType !== "submittedData");
        }

        kee.persistentTabStates.get(this.sender.tab.id).items.push(persistentItem);

        // Don't alert the user if it's less than 90 seconds since they initiated an
        // update request - highly likely that this is just the result of that
        // operation being submitted to the website.
        if (kee.store.state.entryUpdateStartedAtTimestamp >= Date.now() - 90000) return;

        if (configManager.current.notificationCountSavePassword < 10) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: chrome.runtime.getURL("/assets/images/128.png"),
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
            kee.animateBrowserActionIcon();
        }
    }
    if (msg.action === Action.ShowMatchedLoginsPanel) {
        kee.tabStates.get(this.sender.tab.id).framePorts.get(0).postMessage({
            action: Action.ShowMatchedLoginsPanel,
            frameId: this.sender.frameId
        });
    }
    if (msg.action === Action.PageHide) {
        try {
            kee.tabStates.get(this.sender.frameId).framePorts.forEach((port, key, map) => {
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
            kee.deleteTabState(this.sender.tab.id);
        }
    }
}

export function vaultMessageHandler(this: chrome.runtime.Port, msg: VaultMessage) {
    if (msg.mutation) {
        kee.store.onRemoteMessage(this, msg.mutation);
    }

    let result;
    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from vault script.");
    }
    switch (msg.action) {
        case VaultAction.Init:
            result = kee.KeePassRPC.startEventSession(
                msg.sessionId,
                msg.features,
                msgToPage => this.postMessage(msgToPage)
            );
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.MessageToClient:
            result = kee.KeePassRPC.eventSessionMessageFromPage(msg);
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.FocusRequired:
            chrome.tabs.update(this.sender.tab.id, { active: true });
            chrome.windows.update(this.sender.tab.windowId, { focused: true });
            return;
        case VaultAction.AccountChanged:
            accountManager.processNewTokens(msg.tokens);
            return;
    }
}

export async function iframeMessageHandler(this: chrome.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        kee.store.onRemoteMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) {
        KeeLog.debug("In background script, received message from iframe script.");
    }

    const tabId = this.sender.tab.id;

    if (msg.action == Action.ManualFill && msg.selectedEntryIndex != null) {
        kee.tabStates
            .get(tabId)
            .framePorts.get(msg.frameId || 0)
            .postMessage(msg);
        kee.tabStates
            .get(tabId)
            .framePorts.get(0)
            .postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action == Action.CloseAllPanels) {
        kee.tabStates.get(tabId).framePorts.get(0).postMessage(msg);
    }

    if (msg.action == Action.GetPasswordProfiles) {
        const passwordProfiles = await kee.getPasswordProfiles();
        kee.store.updatePasswordProfiles(passwordProfiles);
    }

    if (msg.action == Action.GeneratePassword) {
        const generatedPassword = await kee.generatePassword(
            msg.passwordProfile,
            kee.tabStates.get(tabId).url
        );
        if (generatedPassword) {
            kee.store.updateGeneratedPassword(generatedPassword);
            this.postMessage({
                generatedPassword: generatedPassword
            } as AddonMessage);
        } else {
            KeeLog.warn(
                "Kee received an empty/missing password. Check the configuration of your password manager."
            );
        }
    }

    if (msg.loginEditor) {
        kee.launchLoginEditor(msg.loginEditor.uuid, msg.loginEditor.DBfilename);
    }

    if (msg.copyToClipboard) {
        await copyStringToClipboard(msg.copyToClipboard);
    }
}
