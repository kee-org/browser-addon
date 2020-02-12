import { fetchFavicon } from "./fetchFavicon";
import { showUpdateSuccessNotification } from "./showUpdateSuccessNotification";
import { AddonMessage } from "../common/AddonMessage";
import { KeeLog } from "../common/Logger";
import { KeeNotification } from "../common/KeeNotification";
import { Action } from "../common/Action";
import { configManager } from "../common/ConfigManager";
import { keeLoginInfo, keeLoginField } from "../common/kfDataModel";
import { VaultMessage } from "../common/VaultMessage";
import { VaultAction } from "../common/VaultAction";
import { SiteConfig } from "../common/config";
import store from "../store";

// callbacks for messaging / ports

export function browserPopupMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from browser popup script");

    if (msg.removeNotification) {
        window.kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
    }
    if (msg.loadUrlUpgradeKee) {
        browser.tabs.create({
            url: "https://www.kee.pm/upgrade-kprpc"
        });
    }
    if (msg.action === Action.GeneratePassword) {
        window.kee.initiatePasswordGeneration();
    }
    // if (msg.action === Action.ShowMatchedLoginsPanel) {
    //     if (store.state.connected) {
    //         let frameIdWithMatchedLogins = window.kee.frameIdWithMatchedLogins(window.kee.tabStates.get(window.kee.foregroundTabId).frames);
    //         if (frameIdWithMatchedLogins == -1) frameIdWithMatchedLogins = 0;
    //         window.kee.tabStates.get(window.kee.foregroundTabId).framePorts.get(0).postMessage({action: Action.ShowMatchedLoginsPanel, frameId: frameIdWithMatchedLogins });
    //     }
    // }
    if (msg.action === Action.SaveLatestLogin) {
        if (store.state.connected) {
            const persistentItem = window.kee.persistentTabStates.get(window.kee.foregroundTabId).items.find(item => item.itemType == "submittedData");
            window.kee.tabStates.get(window.kee.foregroundTabId).framePorts.get(0).postMessage(
                { submittedData: persistentItem.submittedData } as AddonMessage);
            persistentItem.accessCount++;
        }
    }

    if (msg.action == Action.ManualFill && msg.selectedLoginIndex != null) {
        window.kee.tabStates.get(window.kee.foregroundTabId).framePorts.get(msg.frameId || 0).postMessage(msg);
        window.kee.tabStates.get(window.kee.foregroundTabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action === Action.OpenKeePass) {
        window.kee.openKeePass();
    }
    if (msg.findMatches) {
        window.kee.findLogins(null, null, null, msg.findMatches.uuid, msg.findMatches.DBfilename, null, null, result => {
            window.kee.browserPopupPort.postMessage({ findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.loginEditor) {
        window.kee.launchLoginEditor(msg.loginEditor.uniqueID, msg.loginEditor.DBfilename);
    }
}

export function pageMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from page script");

    if (msg.findMatches) {
        window.kee.findLogins(msg.findMatches.uri, null, null, null, null, null, null, result => {
            this.postMessage({ isForegroundTab: this.sender.tab.id === window.kee.foregroundTabId,
                findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.removeNotification) {
        window.kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        try { window.kee.browserPopupPort.postMessage({ isForegroundTab: this.sender.tab.id === window.kee.foregroundTabId } as AddonMessage); }
        catch (e) { /* whatever */ }
    }
    if (msg.logins) {
        window.kee.tabStates.get(this.sender.tab.id).frames.get(this.sender.frameId).logins = msg.logins;
    }
    if (msg.submittedData) {

        // Record the URL of the favicon now but don't resolve it to
        // data until we know we want to actually save this login
        msg.submittedData.favIconUrl = this.sender.tab.favIconUrl;

        const submittedLogin = new keeLoginInfo();
        submittedLogin.init([msg.submittedData.url], null, null, msg.submittedData.usernameIndex,
            msg.submittedData.passwordFields.map(function (item) {
                const newField = new keeLoginField();
                newField.fieldId = item.fieldId;
                newField.type = item.type;
                newField.name = item.name;
                newField.value = item.value;
                return newField; }),
            null, msg.submittedData.title,
            msg.submittedData.otherFields.map(function (item) {
                const newField = new keeLoginField();
                newField.fieldId = item.fieldId;
                newField.type = item.type;
                newField.name = item.name;
                newField.value = item.value;
                return newField; }),
            1);

        const persistentItem = {
            itemType: "submittedData" as "submittedData",
            submittedData: msg.submittedData,
            submittedLogin: submittedLogin,
            creationDate: new Date(),
            accessCount: 0,
            maxAccessCount: 20
        };

        if (!window.kee.persistentTabStates.get(this.sender.tab.id)) {
            window.kee.persistentTabStates.set(this.sender.tab.id, {items: [] });
        }

        // Don't allow more than one login to be tracked for this tab
        if (window.kee.persistentTabStates.get(this.sender.tab.id)) {
            window.kee.persistentTabStates.get(this.sender.tab.id).items =
                window.kee.persistentTabStates.get(this.sender.tab.id).items.filter(item => item.itemType !== "submittedData");
        }

        window.kee.persistentTabStates.get(this.sender.tab.id).items.push(persistentItem);

        if (configManager.current.notificationCountSavePassword < 10) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("common/images/128.png"),
                title: $STR("savePasswordText"),
                message: $STR("notification_save_password_tip") + "\n" + $STR("notification_only_shown_some_times")
            });
            configManager.setASAP({notificationCountSavePassword: configManager.current.notificationCountSavePassword+1});
        }
        if (configManager.current.animateWhenOfferingSave) {
            window.kee.animateBrowserActionIcon();
        }
    }
    if (msg.action === Action.ShowMatchedLoginsPanel) {
        window.kee.tabStates.get(this.sender.tab.id).framePorts.get(0).postMessage({action: Action.ShowMatchedLoginsPanel, frameId: this.sender.frameId });
    }
    if (msg.action === Action.RemoveSubmittedData) {
        if (window.kee.persistentTabStates.get(this.sender.tab.id)) {
            window.kee.persistentTabStates.get(this.sender.tab.id).items =
                window.kee.persistentTabStates.get(this.sender.tab.id).items.filter(item => item.itemType !== "submittedData");
        }
    }
    if (msg.action === Action.PageHide) {
        try {
            window.kee.tabStates.get(this.sender.frameId).framePorts.forEach((port, key, map) => {
                try {
                    port.disconnect();
                } catch (e) {
                    if (KeeLog && KeeLog.debug) {
                        KeeLog.debug("failed to disconnect a frame port on tab " + key +
                    ". This is probably not a problem but we may now be reliant on browser " +
                    "GC to clear down memory. The exception that caused this is: " + e.message + " : " + e.stack);
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


export function vaultMessageHandler (this: browser.runtime.Port, msg: VaultMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    let result;
    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from vault script");
    switch (msg.action) {
        case VaultAction.Init:
            result = window.kee.KeePassRPC.startEventSession(msg.sessionId, msg.features, msgToPage => this.postMessage(msgToPage));
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

export function iframeMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    if (msg.mutation) {
        window.kee.syncBackground.onMessage(this, msg.mutation);
    }

    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from iframe script");

    const tabId = this.sender.tab.id;
    const frameId = this.sender.frameId;
    const port = this;

    if (msg.action == Action.ManualFill && msg.selectedLoginIndex != null) {
        window.kee.tabStates.get(tabId).framePorts.get(msg.frameId || 0).postMessage(msg);
        window.kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
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
        window.kee.generatePassword(msg.passwordProfile, window.kee.tabStates.get(tabId).url, generatedPassword => {
            if (generatedPassword) {
                port.postMessage({ generatedPassword: generatedPassword } as AddonMessage);
            } else {
                KeeLog.warn("Kee received an empty/missing password. Check the configuration of your password manager.");
            }
        });
    }

    if (msg.loginEditor) {
        window.kee.launchLoginEditor(msg.loginEditor.uniqueID, msg.loginEditor.DBfilename);
    }

    if (msg.saveData) {
        const persistentItem = window.kee.persistentTabStates.get(tabId).items.find(item => item.itemType == "submittedData");

        fetchFavicon(persistentItem.submittedData.favIconUrl).then(dataUrl => {

            if (dataUrl) {
                persistentItem.submittedLogin.iconImageData = dataUrl.substr(22);
            }

            if (msg.saveData.update) {
                window.kee.updateLogin(persistentItem.submittedLogin, msg.saveData.oldLoginUUID, msg.saveData.urlMergeMode, msg.saveData.db);
                showUpdateSuccessNotification(msg.saveData.oldLoginUUID, msg.saveData.db);
            }
            else {
                const result = window.kee.addLogin(persistentItem.submittedLogin, msg.saveData.group, msg.saveData.db);
                if (configManager.current.rememberMRUGroup) {
                    if (!configManager.current.mruGroup) configManager.current.mruGroup = {};
                    configManager.current.mruGroup[msg.saveData.db] = msg.saveData.group;
                    configManager.save();
                }
            }

            window.kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
        });
    }

    if (msg.neverSave) {
        const persistentItem = window.kee.persistentTabStates.get(tabId).items.find(item => item.itemType == "submittedData");
        const url = new URL(persistentItem.submittedData.url);
        const host = url.host;
        const configLookup = configManager.siteConfigLookupFor("Host", "Exact");
        if (!configLookup[host]) {
            configLookup[host] = {config: new SiteConfig(), source: "User", matchWeight: 100};
        }
        configLookup[host].config.preventSaveNotification = true;
        configManager.save();
        window.kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
    }
}
