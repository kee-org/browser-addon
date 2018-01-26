let appState: AppState;
const keePopupLoadTime = Date.now();
let formUtils: FormUtils;
let formFilling: FormFilling;
let formSaving: FormSaving;
let passwordGenerator: PasswordGenerator;
let tabId: number;
let frameId: number;
let myPort: browser.runtime.Port;
let inputsObserver: MutationObserver;
let messagingPortConnectionRetryTimer: number;

let keeDuplicationCount;

if (keeDuplicationCount) {
    if (KeeLog && KeeLog.error) KeeLog.error("Duplicate Kee instance detected! Found this many other instances: " + keeDuplicationCount);
    else console.error("Duplicate Kee instance detected! Found this many other instances: " + keeDuplicationCount);
} else {
    keeDuplicationCount = 0;
}
keeDuplicationCount += 1;

const sameMembers = (arr1, arr2) =>
    arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));

function shouldSearchForMatches (oldState: AppState, newState: AppState) {
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

function tutorialIntegration () {
    if (window.location.hostname.endsWith("tutorial-addon-1.kee.pm")
        || window.location.hostname.endsWith("tutorial-addon.kee.pm")) {
        const transferElement = document.createElement("KeeFoxAddonStateTransferElement");
        transferElement.setAttribute("state", JSON.stringify({
            connected: appState.connected,
            version: browser.runtime.getManifest().version,
            dbLoaded: appState.KeePassDatabases && appState.KeePassDatabases.length > 0
        }));
        document.documentElement.appendChild(transferElement);

        const event = new Event("KeeFoxAddonStateTransferEvent", { bubbles: true, cancelable: false });
        transferElement.dispatchEvent(event);
    }
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

    tutorialIntegration();
}

function startup () {
    KeeLog.debug("content page starting");

    inputsObserver = new MutationObserver(mutations => {

        // If we have already scheduled a rescan recently, no further action required
        if (formFilling.formFinderTimer !== null) return;

        // Only proceed if we have a DB to search
        if (!appState.connected || appState.ActiveKeePassDatabaseIndex < 0) return;

        let rescan = false;
        const interestingNodes = ["form", "input", "select"];
        mutations.forEach(mutation => {
            if (rescan) return;
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (rescan) break;
                    for (let i=0; i<interestingNodes.length; i++) {
                        const element = (node as Element);
                        if (element.querySelector && element.querySelector(interestingNodes[i])) {
                            rescan = true;
                            break;
                        }
                    }
                }
            }
        });

        // Schedule a rescan soon. Not immediately, in case a batch of mutations are about to be triggered.
        if (rescan) formFilling.formFinderTimer = setTimeout(formFilling.findMatchesInThisFrame.bind(formFilling), 500);
    });

    try {
        connectToMessagingPort();
        if (myPort == null) {
            KeeLog.warn("Failed to connect to messaging port. We'll try again later.");
        }
    } catch (ex) {
        KeeLog.warn("Failed to connect to messaging port. We'll try again later. Exception message: " + ex.message);
    }

    messagingPortConnectionRetryTimer = setInterval(() => {
        if (myPort == null || appState == null) {
            KeeLog.info("Messaging port was not established at page startup. Retrying now...");
            try {
                connectToMessagingPort();
                if (myPort == null) {
                    KeeLog.warn("Failed to connect to messaging port. We'll try again later.");
                }
            } catch (ex) {
                KeeLog.warn("Failed to connect to messaging port. We'll try again later. Exception message: " + ex.message);
            }
        } else {
            clearInterval(messagingPortConnectionRetryTimer);
        }
    }, 5000);

    KeeLog.info("content page ready");
}

function connectToMessagingPort () {

    if (myPort) {
        KeeLog.warn("port already set to: " + myPort.name);
    }
    myPort = chrome.runtime.connect({ name: "page" });

    myPort.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser content page script, received message from background script");

        if (!appState) {
            if (m.appState) {
                onFirstConnect(m.appState, m.isForegroundTab, m.tabId, m.frameId);
            } else {
                KeeLog.warn("browser content page script received message before initialisation complete");
                return;
            }
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

        if (m.action == Action.ManualFill && m.selectedLoginIndex != null) {
            formFilling.closeMatchedLoginsPanel();
            formFilling.fillAndSubmit(false, null, m.selectedLoginIndex);
        }

        if (m.action == Action.DetectForms) {
            formFilling.removeKeeIconFromAllFields();
            if (appState.connected && appState.KeePassDatabases.length > 0) {
                formFilling.findMatchesInThisFrame();
            }
        }

        if (m.action == Action.Primary) {
            formFilling.executePrimaryAction();
        }

        if (m.action == Action.GeneratePassword) {
            passwordGenerator.createGeneratePasswordPanel();
        }

        if (m.action == Action.CloseAllPanels) {
            passwordGenerator.closeGeneratePasswordPanel();
            formFilling.closeMatchedLoginsPanel();
            formSaving.closeSavePasswordPanel();
            myPort.postMessage({ action: Action.RemoveSubmittedData } as AddonMessage);
        }

        if (m.action == Action.ShowMatchedLoginsPanel) {
            formFilling.createMatchedLoginsPanelInCenter(m.frameId);
        }

    });
}

// Load our config and start the page script once done
configManager.load(startup);
