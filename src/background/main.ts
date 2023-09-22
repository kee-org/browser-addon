import { isFirefox } from "webext-detect-page";
import { kee } from "./KF";
import { commandManager } from "./commands";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";
import { configSyncManager } from "./ConfigSyncManager";
import { NetworkAuth } from "./NetworkAuth";
// import { PersistentLogger } from "../common/PersistentLogger";

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import("/@vite/client");
    // load latest content script
    import("./contentScriptHMR");
  }

const userBusySeconds = 60 * 15;
const maxUpdateDelaySeconds = 60 * 60 * 8;

// window.KeePersistentLogger = new PersistentLogger();

const networkAuth = new NetworkAuth();
//TODO: start listening for network auth requests in this top level synchronous module

// Make sure user knows we're not ready yet
chrome.action.setBadgeText({ text: "OFF" });
chrome.action.setBadgeBackgroundColor({ color: "red" });
chrome.action.disable();

//TODO: Split creation of Kee object from connection attempts, if not already done. Probably put the init stuff somewhere else in startup lifecycle?
// Assumes config and logging have been initialised before this is called.
async function startup() {
    // window.KeePersistentLogger.init(configManager.current.logLevel >= 4);
    KeeLog.attachConfig(configManager.current);
    await showReleaseNotesAfterUpdate();
    kee.init();
    configManager.addChangeListener(() =>
        configSyncManager.updateToRemoteConfig(configManager.current)
    );
    chrome.action.enable();
}

async function showReleaseNotesAfterUpdate() {
    //TODO: Retest and try to use onInstalled or similar if now possible.
    // chrome.runtime.onInstalled is not reliably called after an update. E.g.
    // in Firefox after a browser restart. Hence we must track the recent update
    // using our async config store rather than rely on the runtime event being fired.
    if (configManager.current.mustShowReleaseNotesAtStartup) {
        const tab = await chrome.tabs.create({
            url: "/dist/release-notes/update-notes.html",
            active: true
        });
        chrome.windows.update(tab.windowId, { focused: true, drawAttention: true });
        configManager.setASAP({ mustShowReleaseNotesAtStartup: false });
    }
}

chrome.windows.onFocusChanged.addListener(async function (windowId) {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Focus changed for id: " + windowId);
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        const tabs = await chrome.tabs.query({
            active: true,
            windowId: windowId
        });
        if (tabs[0] && tabs[0].id != null) onTabActivated(tabs[0].id);
    }
});

chrome.tabs.onActivated.addListener(event => {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Tab activated with id: " + event.tabId);
    onTabActivated(event.tabId);
});

function onTabActivated(tabId) {
    updateForegroundTab(tabId);

    if (kee) {
        // May not have set up kee yet
        commandManager.setupContextMenuItems();
    }
}

function updateForegroundTab(tabId: number) {
    if (kee && kee.foregroundTabId !== tabId) {
        // May not have set up kee yet
        kee.foregroundTabId = tabId;
        if (kee.tabStates.has(tabId) && kee.tabStates.get(tabId).framePorts) {
            // May not have set up port yet
            if (KeeLog && KeeLog.debug) KeeLog.debug("kee activated on tab: " + tabId);
            kee.tabStates.get(tabId).framePorts.forEach(port => {
                port.postMessage({
                    isForegroundTab: true,
                    action: Action.DetectForms,
                    resetState: kee.store.state
                } as AddonMessage);
            });
        }
    }
}

//TODO: Find out if Chrome still requires us to do this to ensure reliable behaviour after
// first install/update and modify script execution calls if needed
// https://developer.chrome.com/docs/extensions/migrating/api-calls/
// // Some browsers (e.g. Firefox) automatically inject content scripts on install/update
// // but others don't (e.g. Chrome). To ensure every existing tab has exactly one
// // instance of this content script running in it, we programmatically inject the script.
// if (!isFirefox()) {
//     chrome.runtime.onInstalled.addListener(() => {
//         const showErrors = () => {
//             if (chrome.runtime.lastError) {
//                 if (KeeLog && KeeLog.error) KeeLog.error(chrome.runtime.lastError.message);
//                 else console.error(chrome.runtime.lastError);
//             }
//         };
//         chrome.runtime.getManifest().content_scripts?.forEach(script => {
//             const allFrames = script.all_frames;
//             const url = script.matches;

//             // We have to define the list of expected Vault URLs here as well as in
//             // the manifest because there is no API available to automatically handle
//             // the manifest globs and it's not worth bundling a generic parser for
//             // just this one use case.
//             const vaultURLs = [
//                 "https://app-dev.kee.pm:8087/",
//                 "https://app-beta.kee.pm/",
//                 "https://app.kee.pm/",
//                 "https://keevault.pm/"
//             ];

//             const loadContentScripts = (tab: chrome.tabs.Tab) => {
//                 if (tab.url && tab.url.startsWith("chrome://")) return;
//                 if (script.exclude_globs && script.exclude_globs.length > 0) {
//                     if (vaultURLs.some(excludedURL => tab.url.startsWith(excludedURL))) return;
//                 }
//                 if (script.include_globs && script.include_globs.length > 0) {
//                     if (!vaultURLs.some(includedURL => tab.url.startsWith(includedURL))) return;
//                 }
//                 (script.js || []).forEach(file => {
//                     chrome.scripting.executeScript(tab.id, { allFrames, file }).then(showErrors);
//                 });
//                 (script.css || []).forEach(file => {
//                     chrome.tabs.insertCSS(tab.id, { allFrames, file }).then(showErrors);
//                 });
//             };
//             chrome.tabs.query({ url }).then(tabs => tabs.forEach(loadContentScripts));
//         });
//     });
// }

chrome.runtime.onInstalled.addListener(async function (details) {
    if (details.reason === "install") {
        const vaultTabs = await chrome.tabs.query({
            url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]
        });
        if (vaultTabs && vaultTabs[0]) {
            chrome.tabs.update(vaultTabs[0].id, { active: true });
            chrome.windows.update(vaultTabs[0].windowId, { focused: true });
        } else {
            chrome.tabs.create({
                url: "/dist/release-notes/install-notes.html"
            });
        }
    }
});

//TODO: re-enable update idle delay feature
// chrome.runtime.onUpdateAvailable.addListener(async () => {
//     await configManager.setASAP({ mustShowReleaseNotesAtStartup: true });
//     if ((await chrome.idle.queryState(userBusySeconds)) === "idle") {
//         chrome.runtime.reload();
//     } else {
//         chrome.idle.setDetectionInterval(userBusySeconds);
//         chrome.idle.onStateChanged.addListener(status => {
//             if (status !== "active") {
//                 chrome.runtime.reload();
//             }
//         });
//         self.setTimeout(() => {
//             chrome.runtime.reload();
//         }, maxUpdateDelaySeconds * 1000);
//     }
// });

// Load our config and start the addon once done
configManager.load(startup);
