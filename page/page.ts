/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />

declare const chrome: typeof browser;

let appState: AppState;
let keefoxPopupLoadTime = Date.now();
let formUtils: FormUtils;
let formFilling: FormFilling;
let passwordGenerator: PasswordGenerator;
let tabId: number;
let frameId: number;
let myPort: browser.runtime.Port;
let iframesObserver: MutationObserver;

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
    const shouldSearch = shouldSearchForMatches(oldState, appState);
    const shouldRemoveMatches = shouldSearch || (oldState && oldState.connected &&
        (!appState.connected || (oldState.KeePassDatabases.length > 0 && appState.KeePassDatabases.length == 0))
        );

    if (shouldRemoveMatches)
        formFilling.removeKeeFoxIconFromAllFields();
    if (isForegroundTab && shouldSearch) {
        formFilling.findMatchesInThisFrame();
    }
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

function onFirstConnect (currentAppState: AppState, isForegroundTab: boolean, myTabId: number, myFrameId: number) {
    tabId = myTabId;
    frameId = myFrameId;

    KeeFoxLog.attachConfig(configManager.current);
    formUtils = new FormUtils(KeeFoxLog);
    formFilling = new FormFilling(formUtils, KeeFoxLog, configManager.current, matchResultReceiver, matchFinder);
    passwordGenerator = new PasswordGenerator();

    updateAppState(currentAppState, isForegroundTab);

    iframesObserver.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });

    // Look for any frames that were added in original page source or before we've done this content script signup
    myPort.postMessage({ action: "lookForNewIframes" });
}

function startup () {
    KeeFoxLog.debug("content page starting");

    iframesObserver = new MutationObserver(mutations => {
        let rescan = false;
        mutations.forEach(mutation => {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeName.toLowerCase() === "iframe") rescan = true;
                }
            }
            if (mutation.type === "attributes"
            && mutation.attributeName.toLowerCase() === "src"
            && mutation.target.nodeName.toLowerCase() === "iframe") {
                rescan = true;
                //TODO:c: Might need to limit this to only src changes that will cause a page refresh (and hence a socket disconnection)
                //TODO:c: This doesn't work. The background script thinks that the iframe still has the old about:blank URL when it rescans.
                // Need to find some way to know when it is safe to inspect the URL
            }
        });
        if (rescan) myPort.postMessage({ action: "lookForNewIframes" });
    });

    myPort = chrome.runtime.connect({ name: "page" });

    myPort.onMessage.addListener(function (m: AddonMessage) {
        KeeFoxLog.debug("In browser content page script, received message from background script");

        if (!appState) {
            onFirstConnect(m.appState, m.isForegroundTab, m.tabId, m.frameId);
        } else if (m.appState) {
            updateAppState(m.appState, m.isForegroundTab);
        }

        if (m.findMatchesResult) {
            formFilling.findLoginsResultHandler(m.findMatchesResult);
            renderMatchedLogins(m.findMatchesResult);
        }

        if (m.action == "manualFill" && m.selectedLoginIndex != null) {
            formFilling.closeMatchedLoginsPanel();
            formFilling.fillAndSubmit(false, null, m.selectedLoginIndex);
        }

        if (m.action == "detectForms") {
            formFilling.removeKeeFoxIconFromAllFields();
            formFilling.findMatchesInThisFrame();
        }

        if (m.action == "primary") {
            formFilling.executePrimaryAction();
        }

        if (m.action == "generatePassword") {
            passwordGenerator.createGeneratePasswordPanel();
        }

        if (m.action == "closeAllPanels") {
            passwordGenerator.closeGeneratePasswordPanel();
            formFilling.closeMatchedLoginsPanel();
        }

        if (m.action == "showMatchedLoginsPanel") {
            formFilling.createMatchedLoginsPanelInCenter(m.frameId);
        }

    });

    KeeFoxLog.info("content page ready");
}

// Load our config and start the page script once done
configManager.load(startup);
