/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />

declare const chrome: typeof browser;

let appState: AppState;
let keePopupLoadTime = Date.now();
let formUtils: FormUtils;
let formFilling: FormFilling;
let formSaving: FormSaving;
let passwordGenerator: PasswordGenerator;
let tabId: number;
let frameId: number;
let myPort: browser.runtime.Port;
let inputsObserver: MutationObserver;

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
    const shouldRemoveSubmitListeners = shouldRemoveMatches || (isForegroundTab && shouldSearch);

    if (shouldRemoveMatches) {
        formFilling.removeKeeIconFromAllFields();
    }
    if (shouldRemoveSubmitListeners) {
        formSaving.removeAllSubmitHandlers();
    }
    if (isForegroundTab && shouldSearch) {
        formFilling.findMatchesInThisFrame();
    }
}

function matchFinder (uri: string) {
    myPort.postMessage({ findMatches: { uri } });
}

function onFirstConnect (currentAppState: AppState, isForegroundTab: boolean, myTabId: number, myFrameId: number) {
    tabId = myTabId;
    frameId = myFrameId;

    KeeLog.attachConfig(configManager.current);
    formUtils = new FormUtils(KeeLog);
    formSaving = new FormSaving(KeeLog, formUtils, configManager.current);
    formFilling = new FormFilling(formUtils, formSaving, KeeLog, configManager.current, matchFinder);
    passwordGenerator = new PasswordGenerator();

    inputsObserver.observe(document.body, { childList: true, subtree: true });

    updateAppState(currentAppState, isForegroundTab);
}

function startup () {
    KeeLog.debug("content page starting");

    inputsObserver = new MutationObserver(mutations => {

        // If we have already scheduled a rescan recently, no further action required
        if (formFilling.formFinderTimer !== null) return;

        let rescan = false;
        const interestingNodes = ["input", "form", "select"];
        mutations.forEach(mutation => {
            if (rescan) return;
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    const nodeName = node.nodeName.toLowerCase();
                    if (interestingNodes.indexOf(nodeName) >= 0) rescan = true;
                }
            }
        });

        // Schedule a rescan soon. Not immediately, in case a batch of mutations are about to be triggered.
        if (rescan) formFilling.formFinderTimer = setTimeout(formFilling.findMatchesInThisFrame.bind(formFilling), 500);
    });

    myPort = chrome.runtime.connect({ name: "page" });

    myPort.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser content page script, received message from background script");

        if (!appState) {
            onFirstConnect(m.appState, m.isForegroundTab, m.tabId, m.frameId);
        } else if (m.appState) {
            updateAppState(m.appState, m.isForegroundTab);
        }
//
                //if (m.frameState) updateFrameState(m.frameState);
        if (m.submittedData) {
            formSaving.createSavePasswordPanel();
        }

        if (m.findMatchesResult) {
            formFilling.findLoginsResultHandler(m.findMatchesResult);
        }

        if (m.action == "manualFill" && m.selectedLoginIndex != null) {
            formFilling.closeMatchedLoginsPanel();
            formFilling.fillAndSubmit(false, null, m.selectedLoginIndex);
        }

        if (m.action == "detectForms") {
            formFilling.removeKeeIconFromAllFields();
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
            formSaving.closeSavePasswordPanel();
            myPort.postMessage({action: "removeSubmittedData"} as AddonMessage);
        }

        if (m.action == "showMatchedLoginsPanel") {
            formFilling.createMatchedLoginsPanelInCenter(m.frameId);
        }

    });

    KeeLog.info("content page ready");
}

// Load our config and start the page script once done
configManager.load(startup);
