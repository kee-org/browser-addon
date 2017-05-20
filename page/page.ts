/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />

declare const chrome: typeof browser;

let appState;
let keefoxPopupLoadTime = Date.now();
let formUtils: FormUtils;
let formFilling: FormFilling;
let tabId: number;
let frameId: number;

const sameMembers = (arr1, arr2) =>
    arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));

function shouldSearchForMatches (oldState: AppState, newState: AppState) {
    // Initially at least, we won't ever autofill a matching login - will require user to click to say they want it to be filled in. Can work out how/if/when we support that later.
    //TODO:c: consider prefs for autofill + whether invoked by page load (or dom mutation?) that should search or just something like a tab change (or non-top-level frame?) which should not.

    if (newState.connected) {
        if (newState.KeePassDatabases.length > 0) {
            if (!oldState) {
                return true;
            }
            if (oldState.KeePassDatabases.length != newState.KeePassDatabases.length) {
                return true;
            }
            if (oldState.ActiveKeePassDatabaseIndex != newState.ActiveKeePassDatabaseIndex) {
                return true;
            }
            if (sameMembers(oldState.KeePassDatabases, newState.KeePassDatabases)) {
                return true; //TODO:c: Check that sameMembers does the comparison we want. Might need to go a level deeper and look at something unique like fileName
            }
        }
    }
    return false;
}

function updateAppState (newState: AppState, isForegroundTab: boolean) {
    const oldState = appState;
    appState = newState;
    if (isForegroundTab && shouldSearchForMatches(oldState, appState))
        formFilling.findMatchesInThisFrame();
}

function renderMatchedLogins (logins: any[]) {
    KeeFoxLog.warn("TODO: Add results to browser panel or do some autofill or something?");
    for (const login of logins) {
        KeeFoxLog.info("login: " + login);
    }
}

//TODO:c: Update any in page UI that needs to know about the new results
function matchResultReceiver (results) {
}


function matchFinder (uri: string) {
    myPort.postMessage({ findMatches: { uri } });
}

function startup (currentAppState: AppState, isForegroundTab: boolean, myTabId: number, myFrameId: number) {
    tabId = myTabId;
    frameId = myFrameId;

    KeeFoxLog.configureFromPreferences(currentAppState.config);
    formUtils = new FormUtils(KeeFoxLog);
    formFilling = new FormFilling(formUtils, KeeFoxLog, currentAppState.config, matchResultReceiver, matchFinder);

    updateAppState(currentAppState, isForegroundTab);
}

KeeFoxLog.debug("content page started");

let myPort = chrome.runtime.connect({ name: "page" });
myPort.postMessage({ greeting: "hello from content page script" });

myPort.onMessage.addListener(function (m: AddonMessage) {
    KeeFoxLog.debug("In browser popup script, received message from background script: ");
    KeeFoxLog.debug(m.appState.connected.toString());

    if (!appState) {
        startup(m.appState, m.isForegroundTab, m.tabId, m.frameId);
    } else {
        updateAppState(m.appState, m.isForegroundTab);
    }

    if (m.findMatchesResult) {
        formFilling.findLoginsResultHandler(m.findMatchesResult);
        renderMatchedLogins(m.findMatchesResult);
    }
});

KeeFoxLog.info("content page ready");
