import RuntimeEnvironment from "../common/RuntimeEnvironment";
import { Kee } from "./KF";
import { commandManager } from "./commands";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";
import { useStubStore } from "../store";
// import { PersistentLogger } from "../common/PersistentLogger";

const userBusySeconds = 60 * 15;
const maxUpdateDelaySeconds = 60 * 60 * 8;

// window.KeePersistentLogger = new PersistentLogger();

// Make sure user knows we're not ready yet
browser.browserAction.setBadgeText({ text: "OFF" });
browser.browserAction.setBadgeBackgroundColor({ color: "red" });
browser.browserAction.disable();

const store = useStubStore();

// Assumes config and logging have been initialised before this is called.
async function startup() {
    // window.KeePersistentLogger.init(configManager.current.logLevel >= 4);
    KeeLog.attachConfig(configManager.current);
    await showReleaseNotesAfterUpdate();
    window.kee = new Kee();
    window.kee.init();
    configManager.addChangeListener(() =>
        window.kee.configSyncManager.updateToRemoteConfig(configManager.current)
    );
    browser.browserAction.enable();
}

async function showReleaseNotesAfterUpdate() {
    // browser.runtime.onInstalled is not reliably called after an update. E.g.
    // in Firefox after a browser restart. Hence we must track the recent update
    // using our async config store rather than rely on the runtime event being fired.
    if (configManager.current.mustShowReleaseNotesAtStartup) {
        const tab = await browser.tabs.create({
            url: "release-notes/update-notes.html",
            active: true
        });
        browser.windows.update(tab.windowId, { focused: true, drawAttention: true });
        configManager.setASAP({ mustShowReleaseNotesAtStartup: false });
    }
}

browser.windows.onFocusChanged.addListener(async function (windowId) {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Focus changed for id: " + windowId);
    if (windowId !== browser.windows.WINDOW_ID_NONE) {
        const tabs = await browser.tabs.query({
            active: true,
            windowId: windowId
        });
        if (tabs[0] && tabs[0].id != null) onTabActivated(tabs[0].id);
    }
});

browser.tabs.onActivated.addListener(event => {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Tab activated with id: " + event.tabId);
    onTabActivated(event.tabId);
});

function onTabActivated(tabId) {
    updateForegroundTab(tabId);

    if (window.kee) {
        // May not have set up kee yet
        commandManager.setupContextMenuItems();
    }
}

function updateForegroundTab(tabId: number) {
    if (window.kee && window.kee.foregroundTabId !== tabId) {
        // May not have set up kee yet
        window.kee.foregroundTabId = tabId;
        if (window.kee.tabStates.has(tabId) && window.kee.tabStates.get(tabId).framePorts) {
            // May not have set up port yet
            if (KeeLog && KeeLog.debug) KeeLog.debug("kee activated on tab: " + tabId);
            window.kee.tabStates.get(tabId).framePorts.forEach(port => {
                port.postMessage({
                    isForegroundTab: true,
                    action: Action.DetectForms,
                    resetState: JSON.parse(
                        JSON.stringify(store.$state))
                } as AddonMessage);
            });
        }
    }
}

// Some browsers (e.g. Firefox) automatically inject content scripts on install/update
// but others don't (e.g. Chrome). To ensure every existing tab has exactly one
// instance of this content script running in it, we programatically inject the script.
if (!RuntimeEnvironment.isWebExtensionsBrowser) {
    browser.runtime.onInstalled.addListener(() => {
        const showErrors = () => {
            if (browser.runtime.lastError) {
                if (KeeLog && KeeLog.error) KeeLog.error(browser.runtime.lastError.message);
                else console.error(browser.runtime.lastError);
            }
        };
        browser.runtime.getManifest().content_scripts.forEach(script => {
            const allFrames = script.all_frames;
            const url = script.matches;

            // We have to define the list of expected Vault URLs here as well as in
            // the manifest because there is no API available to automatically handle
            // the manifest globs and it's not worth bundling a generic parser for
            // just this one use case.
            const vaultURLs = [
                "https://app-dev.kee.pm:8087/",
                "https://app-beta.kee.pm/",
                "https://app.kee.pm/",
                "https://keevault.pm/"
            ];

            const loadContentScripts = (tab: browser.tabs.Tab) => {
                if (tab.url && tab.url.startsWith("chrome://")) return;
                if (script.exclude_globs && script.exclude_globs.length > 0) {
                    if (vaultURLs.some(excludedURL => tab.url.startsWith(excludedURL))) return;
                }
                if (script.include_globs && script.include_globs.length > 0) {
                    if (!vaultURLs.some(includedURL => tab.url.startsWith(includedURL))) return;
                }
                (script.js || []).forEach(file => {
                    browser.tabs.executeScript(tab.id, { allFrames, file }).then(showErrors);
                });
                (script.css || []).forEach(file => {
                    browser.tabs.insertCSS(tab.id, { allFrames, file }).then(showErrors);
                });
            };
            browser.tabs.query({ url }).then(tabs => tabs.forEach(loadContentScripts));
        });
    });
}

browser.runtime.onInstalled.addListener(async function (details) {
    if (details.reason === "install") {
        const vaultTabs = await browser.tabs.query({
            url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]
        });
        if (vaultTabs && vaultTabs[0]) {
            browser.tabs.update(vaultTabs[0].id, { active: true });
            browser.windows.update(vaultTabs[0].windowId, { focused: true });
        } else {
            browser.tabs.create({
                url: "release-notes/install-notes.html"
            });
        }
    }
});

browser.runtime.onUpdateAvailable.addListener(async () => {
    await configManager.setASAP({ mustShowReleaseNotesAtStartup: true });
    if ((await browser.idle.queryState(userBusySeconds)) === "idle") {
        browser.runtime.reload();
    } else {
        browser.idle.setDetectionInterval(userBusySeconds);
        browser.idle.onStateChanged.addListener(status => {
            if (status !== "active") {
                browser.runtime.reload();
            }
        });
        window.setTimeout(() => {
            browser.runtime.reload();
        }, maxUpdateDelaySeconds * 1000);
    }
});

// Load our config and start the addon once done
configManager.load(startup);
