import { FormFilling } from "./formFilling";
import { FormUtils } from "./formsUtils";
import { FormSaving } from "./formSaving";
import { PasswordGenerator } from "./PasswordGenerator";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { Action } from "../common/Action";
import store from "../store";
import { SyncContent } from "../store/syncContent";
import { MutationPayload } from "vuex";

/* This orchestrates the main functions of the add-on
on all website pages except those containing a KPRPC server */

// tslint:disable-next-line:no-var-keyword
var keeDuplicationCount;

if (keeDuplicationCount) {
    if (KeeLog && KeeLog.error) KeeLog.error("Duplicate Kee content script instance detected! Found this many other instances: " + keeDuplicationCount);
    else console.error("Duplicate Kee content script instance detected! Found this many other instances: " + keeDuplicationCount);
} else {
    keeDuplicationCount = 0;
}
keeDuplicationCount += 1;

const keePopupLoadTime = Date.now();
let formUtils: FormUtils;
let formFilling: FormFilling;
let formSaving: FormSaving;
let passwordGenerator: PasswordGenerator;
let tabId: number;
let frameId: number;
let myPort: browser.runtime.Port;
let syncContent: SyncContent;
let connected: boolean = false;
let inputsObserver: MutationObserver;
let messagingPortConnectionRetryTimer: number;

function matchFinder (uri: string) {
    myPort.postMessage({ findMatches: { uri } });
}

function tutorialIntegration () {
    if (window.location.hostname.endsWith("tutorial-addon-1.kee.pm")
        || window.location.hostname.endsWith("tutorial-addon.kee.pm")) {
        const transferElement = document.createElement("KeeFoxAddonStateTransferElement");
        transferElement.setAttribute("state", JSON.stringify({
            connected: store.state.connected,
            version: browser.runtime.getManifest().version,
            dbLoaded: store.state.KeePassDatabases.length > 0,
            sessionNames: store.state.KeePassDatabases.map(db => db.sessionType.toString()).filter((v, i, a) => a.indexOf(v) === i)
        }));
        document.documentElement.appendChild(transferElement);

        const event = new Event("KeeFoxAddonStateTransferEvent", { bubbles: true, cancelable: false });
        transferElement.dispatchEvent(event);
    }
}

function onFirstConnect (myTabId: number, myFrameId: number) {
    tabId = myTabId;
    frameId = myFrameId;

    KeeLog.attachConfig(configManager.current);
    formUtils = new FormUtils(KeeLog);
    formSaving = new FormSaving(myPort, frameId, KeeLog, formUtils, configManager.current);
    formFilling = new FormFilling(myPort, frameId, formUtils, formSaving, KeeLog, configManager.current, matchFinder);
    passwordGenerator = new PasswordGenerator(frameId);

    inputsObserver.observe(document.body, { childList: true, subtree: true });

    tutorialIntegration();
}

inputsObserver = new MutationObserver(mutations => {

    // If we have already scheduled a rescan recently, no further action required
    if (formFilling.formFinderTimer !== null) return;

    // Only proceed if we have a DB to search
    if (!store.state.connected || store.state.ActiveKeePassDatabaseIndex < 0) return;

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

function startup () {
    KeeLog.debug("content page starting");

    try {
        connectToMessagingPort();
        if (myPort == null) {
            KeeLog.warn("Failed to connect to messaging port. We'll try again later.");
        }
    } catch (ex) {
        KeeLog.warn("Failed to connect to messaging port. We'll try again later. Exception message: " + ex.message);
    }

    messagingPortConnectionRetryTimer = setInterval(() => {
        if (myPort == null || !connected) {
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

    KeeLog.debug("content page ready");
}

function connectToMessagingPort () {

    if (myPort) {
        KeeLog.warn("port already set to: " + myPort.name);
    }
    myPort = browser.runtime.connect({ name: "page" });

    myPort.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser content page script, received message from background script");

        if (m.initialState) {
            syncContent = new SyncContent(store, m.initialState, (mutation: MutationPayload) => {
                myPort.postMessage({mutation} as AddonMessage);
            });
        }
        if (m.mutation) {
            syncContent.onRemoteMutation(m.mutation);
        }

        if (!connected) {
            onFirstConnect(m.tabId, m.frameId);
            formFilling.findMatchesInThisFrame();
            connected = true;
        } else if (m.action == Action.DetectForms) {
            formFilling.removeKeeIconFromAllFields();
            formSaving.removeAllSubmitHandlers();
            formFilling.findMatchesInThisFrame();
        }

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

        if (m.action == Action.ResetForms) {
            formFilling.removeKeeIconFromAllFields();
            formSaving.removeAllSubmitHandlers();
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

window.addEventListener("pageshow", ev => {
    pageShowFired = true;
    clearTimeout(missingPageShowTimer);
    if (configReady) {
        startup();
    }
});
window.addEventListener("pagehide", ev => {
    inputsObserver.disconnect();
    if (myPort) myPort.postMessage({ action: Action.PageHide });
    formFilling.removeKeeIconFromAllFields();
    myPort = null;
    connected = false;
    tabId = undefined;
    frameId = undefined;
    formUtils = undefined;
    formSaving = undefined;
    formFilling = undefined;
    passwordGenerator = undefined;
});

// Load our config
let pageShowFired = false;
let configReady = false;
let missingPageShowTimer: number;
configManager.load(() => {
    configReady = true;
    if (pageShowFired) {
        startup();
    } else {
        // Page show does not always fire (e.g. on first install of the extension)
        // so we won't wait around forever, at the cost of occasional duplicate
        // startup code - broadly limited to discovering that the message port
        // is already established.
        missingPageShowTimer = setTimeout(startup, 1500);
    }
});
