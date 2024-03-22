import { isFirefox } from "webext-detect-page";
import { kee } from "./KF";
import { commandManager } from "./commands";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Action } from "../common/Action";
import type { AddonMessage } from "../common/AddonMessage";
import { configSyncManager } from "./ConfigSyncManager";
import { NetworkAuth } from "./NetworkAuth";
// import { PersistentLogger } from "../common/PersistentLogger";

// only on dev mode
if (import.meta.hot) {
    // @ts-expect-error for background HMR
    import("/@vite/client");
    // doesn't apepar to work in MV3
    // load latest content script
    // import("./contentScriptHMR");
}


let resolveInitialised: (value?: boolean | PromiseLike<boolean>) => void;

// We can'ty do anything useful if we fail to intiialise so just crash and let this Promise get GCd
const initialised: Promise<boolean> = new Promise((resolve, _) => {
    resolveInitialised = resolve;
});


const userBusySeconds = 60 * 15;
const maxUpdateDelaySeconds = 60 * 60 * 8;

// window.KeePersistentLogger = new PersistentLogger();

const networkAuth = new NetworkAuth();

// Make sure user knows we're not ready yet
chrome.action.setBadgeText({ text: "OFF" });
chrome.action.setBadgeBackgroundColor({ color: "red" });
chrome.action.disable();

// Assumes config and logging have been initialised before this is called.
async function startup() {
    // window.KeePersistentLogger.init(configManager.current.logLevel >= 4);
    KeeLog.attachConfig(configManager.current);
    await showReleaseNotesAfterUpdate();
    resolveInitialised(await kee.init());
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
        const ports = kee.tabStates.get(tabId)?.framePorts;
        if (ports) {
            // May not have set up port yet
            if (KeeLog && KeeLog.debug) KeeLog.debug("kee activated on tab: " + tabId);

            ports.forEach((port, frameId) => {
                try {
                    port.postMessage({
                        isForegroundTab: true,
                        action: Action.DetectForms,
                        resetState: kee.store.state
                    } as AddonMessage);
                } catch (e) {
                    if (KeeLog && KeeLog.warn) KeeLog.warn("Failed to post a message to a foreground tab port. Will remove the port now.");
                    ports.delete(frameId);
                }
            });
        }
    }
}

//TODO: Below seems likely still required. need to check if friefox has changed behaviour in mv3 mode too.
// Some browsers (e.g. Firefox) automatically inject content scripts on install/update
// but others don't (e.g. Chrome). To ensure every existing tab has exactly one
// instance of this content script running in it, we programmatically inject the script.
if (!isFirefox()) {
    chrome.runtime.onInstalled.addListener(() => {
        // const showErrors = () => {
        //     if (chrome.runtime.lastError) {
        //         if (KeeLog && KeeLog.error) KeeLog.error(chrome.runtime.lastError.message);
        //         else console.error(chrome.runtime.lastError);
        //     }
        // };
        chrome.runtime.getManifest().content_scripts?.forEach(async script => {
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

            const loadOperations = [];
            const loadContentScripts = (tab: chrome.tabs.Tab) => {
                // Firefox used to open every new tab with an about page so maybe it was important
                // to not block that injection but I think that is no longer an issue so we can
                // avoid the log noise by skipping those pages now.
                if (tab.url && tab.url.startsWith("about:")) return;
                if (tab.url && tab.url.startsWith("chrome://")) return;
                if (script.exclude_globs && script.exclude_globs.length > 0) {
                    if (vaultURLs.some(excludedURL => tab.url.startsWith(excludedURL))) return;
                }
                if (script.include_globs && script.include_globs.length > 0) {
                    if (!vaultURLs.some(includedURL => tab.url.startsWith(includedURL))) return;
                }
                if (script?.js?.length > 0) {
                    loadOperations.push(chrome.scripting.executeScript({
                        target: { tabId: tab.id, allFrames },
                        files: script.js
                    }));
                }
                if (script?.css?.length > 0) {
                    loadOperations.push(chrome.scripting.insertCSS({
                        target: { tabId: tab.id, allFrames },
                        files: script.css
                    }));
                }
            };
            try {
                const tabs = await chrome.tabs.query({ url });
                tabs.forEach(loadContentScripts);
                await Promise.all(loadOperations);
            } catch (e) {
                if (!(e.message as string).endsWith(" is showing error page")) {
                    if (KeeLog && KeeLog.error) KeeLog.error(e.message);
                    else console.error(e);
                }
            }
        });
    });
}

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


//TODO: verify works... probably need to cache incoming requests and process them after this init function has been called. Or, maybe just deferring the initial response to the content/popup script is sufficient?
chrome.runtime.onConnect.addListener(async port => {
    await initialised;
    kee.onPortConnected(port);
});

// With MV3 we must always listen to httpauth requests and decide whether to handle them
// based on whether we have already initalised the pinia store, got connected to KPRPC, have open DBs, etc.

//TODO: Find out if Firefox MV3 still requires the older blocking option
// if (isFirefox()) {
chrome.webRequest.onAuthRequired.addListener(
    async (requestDetails, callback) => {
        if (KeeLog?.debug) KeeLog.debug("onAuthRequired request started");
        //      try {

        // We may crash at startup / session restore if we're not initialised yet
        await Promise.race([initialised, new Promise(resolve => self.setTimeout(resolve, 20000))]);
        if (KeeLog?.debug) KeeLog.debug("onAuthRequired request ongoing");
        const result = await networkAuth.provideCredentialsAsync(requestDetails);
        callback(result);
        // } catch {
        //     KeeLog.error("AsyncBlockingCallback promise failed", reason);
        //     callback({ cancel: false });
        // }
    },
    { urls: ["<all_urls>"] },
    [isFirefox() ? "blocking" : "asyncBlocking"]
);
// } else {
// chrome.webRequest.onAuthRequired.addListener(
//     (requestDetails, callback) => {
//         networkAuth.provideCredentialsAsyncBlockingCallback(requestDetails, callback);
//     },
//     { urls: ["<all_urls>"] },
//     ["asyncBlocking"]
// );
//}

// Load our config and start the addon once done
configManager.load(startup);
