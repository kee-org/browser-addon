import { waitForElementById } from "./waitForElementById";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { utils } from "../common/utils";
import { VaultAction } from "../common/VaultAction";
import { VaultMessage } from "../common/VaultMessage";
import { VaultProtocol } from "../common/VaultProtocol";
import { SyncContent } from "../store/syncContent";
import store from "../store";
import { MutationPayload } from "vuex";
import { AddonMessage } from "../common/AddonMessage";
import { Port } from "../common/port";

/*
  This links Kee to an instance of Kee Vault via the KPRPC protocol.
  It is injected to the top level frame of tabs with suitable URLs.

  We generate unique session IDs here but EventSession in the background
  context owns the concept of which session is actually active (so it can
  deal correctly with multiple tabs, page reloads, etc.)

  KPRPC requires bi-directional message flows. window.postMessage is an
  obvious candidate medium but calls from the web page are not able to target
  our addon so to avoid accidentally leaking info from the vault to other
  addons, we must use custom events instead.

  We considered encrypting the data that flows across these custom events but
  ultimately prove that if a malicious addon were to actively attack the event
  stream, encryption can not help (the malicious addon can just as easily
  access the secret keys for decryption or just modify the page to exfiltrate
  the data bypassing any event communication medium we utilise).

  So all we really need to do is make sure that there is no chance of an addon
  accidentally listening in to our messages just in case limitations in that
  3rd party addon result in either bugs in one of the addons or accidental
  data leakage through logs or other output methods.

  In short, no add-on or cloud-hosted password service can protect itself from
  malicious web browsers or addons so we do not address that threat vector but
  we do take steps to prevent accidental data disclosure.
*/

// eslint-disable-next-line no-var
var keeDuplicationCount;

if (keeDuplicationCount) {
    if (KeeLog && KeeLog.error) KeeLog.error("Duplicate Kee content script instance detected! Found this many other instances: " + keeDuplicationCount);
    else console.error("Duplicate Kee content script instance detected! Found this many other instances: " + keeDuplicationCount);
} else {
    keeDuplicationCount = 0;
}
keeDuplicationCount += 1;

let tabId: number;
let frameId: number;
let messagingPortConnectionRetryTimer: number;
let connected: boolean = false;

const customEventNameToPage = "KeeMessageToPage" + Math.random();
const customEventNameFromPage = "KeeMessageFromPage" + Math.random();
let features: string[];
let sessionId: string;

// let observer: MutationObserver = new MutationObserver();

function startup () {
    KeeLog.debug("content vault starting");

    try {
        Background.connect();
        if (Port.raw == null) {
            KeeLog.warn("Failed to connect to messaging port. We'll try again later.");
        }
    } catch (ex) {
        KeeLog.warn("Failed to connect to messaging port. We'll try again later. Exception message: " + ex.message);
    }

    messagingPortConnectionRetryTimer = setInterval(() => {
        if (Port.raw == null || !connected) {
            KeeLog.info("Messaging port was not established at vault startup. Retrying now...");
            try {
                Background.connect();
                if (Port.raw == null) {
                    KeeLog.warn("Failed to connect to messaging port. We'll try again later.");
                }
            } catch (ex) {
                KeeLog.warn("Failed to connect to messaging port. We'll try again later. Exception message: " + ex.message);
            }
        } else {
            clearInterval(messagingPortConnectionRetryTimer);
        }
    }, 5000);

    KeeLog.info("content vault ready");
}

function onFirstConnect (myTabId: number, myFrameId: number) {
    tabId = myTabId;
    frameId = myFrameId;
    KeeLog.attachConfig(configManager.current);
    Page.connect();
}

// Orchestrate the link between this content script and the web page
class Page {

    // Inject an idempotent script to the page which is (probably) running an instance of a KPRPC server
    public static async connect () {
        // Look for a special DOM element so we only attempt to
        // connect to pages that claim to expose a KPRPC interface for us
        const magicTag = await waitForElementById("keeVaultMagic_existsHere");
        if (!magicTag) {
            // It often does not exist at page load but something
            // weird is happening if it still doesn't by this point
            KeeLog.error("Unexpected failure waiting for indication from Kee Vault that we should connect to it");
            return;
        }

        const body = document.getElementsByTagName("body")[0];
        const existingScript = document.getElementById("keeVaultMagic_existsExactlyHere");
        if (existingScript) existingScript.parentElement.removeChild(existingScript);
        const script = document.createElement("script");
        script.setAttribute("id", "keeVaultMagic_existsExactlyHere");
        script.innerText = `
    window.KeeAddonSupportedFeatures = [
        "KPRPC_FEATURE_BROWSER_HOSTED",
        "KPRPC_FEATURE_VERSION_1_6",
        "KPRPC_FEATURE_WARN_USER_WHEN_FEATURE_MISSING",
        "BROWSER_SETTINGS_SYNC"];

    function messageToKeeAddon(detail) {
        var messageEvent = new CustomEvent("${customEventNameFromPage}", {"detail":detail});
        document.dispatchEvent(messageEvent);
    }

    function initKeeAddonLink() {
        var KeeAddonEnabledEvent = new CustomEvent('KeeAddonEnabled', {"detail":"${customEventNameToPage}"});
        document.dispatchEvent(KeeAddonEnabledEvent);
        console.log("Kee addon link activated");
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initKeeAddonLink); }
    else { initKeeAddonLink() }
    console.log("Kee addon link injected");
        `;
        body.appendChild(script);
    }

    public static send (msg) {
        const messageEvent = new CustomEvent(customEventNameToPage, {detail: msg});
        document.dispatchEvent(messageEvent);
    }

    public static receive (event: CustomEvent) {
        if (!sessionId && !event.detail.features && !event.detail.tokens) {
            // We have no active session but the app did not supply init data
            // (list of supported features) so we have to assume a fault in
            // the app or perhaps a timeout caused by device standby and
            // request that it start the connection process again.
            Page.connect();
        } else if (event.detail.features) {
            // If we get sent a list of KPRPC features, we need to start a new session
            features = event.detail.features;
            sessionId = utils.newGUID();
            Background.initLink();
        } else if (event.detail.focusRequired) {
            Background.send({
                action: VaultAction.FocusRequired
            } as VaultMessage);
        } else if (event.detail.message) {
            Background.send({
                action: VaultAction.MessageToClient,
                sessionId: sessionId,
                protocol: VaultProtocol.Jsonrpc,
                jsonrpc: event.detail.message,
                encryptionNotRequired: true
            } as VaultMessage);
        } else if (event.detail.ping === true) {
            Background.send({
                action: VaultAction.MessageToClient,
                sessionId: sessionId,
                protocol: VaultProtocol.Ping
            } as VaultMessage);
        } else if (event.detail.tokens) {
            Background.send({
                action: VaultAction.AccountChanged,
                sessionId: sessionId,
                tokens: event.detail.tokens
            } as VaultMessage);
        }
    }

    public static invalidateCurrentSession () {
        sessionId = null;
    }
}

let syncContent: SyncContent;

// Orchestrate the link between this content script and the addon background process
class Background {

    public static connect () {
        if (Port.raw) {
            KeeLog.warn("port already set to: " + Port.raw.name);
        }
        syncContent = new SyncContent(store);
        Port.startup("vault");

        Port.raw.onMessage.addListener(function (m: VaultMessage) {
            KeeLog.debug("In browser content vault script, received message from background script");
            if (m.initialState) {
                syncContent.init(m.initialState, (mutation: MutationPayload) => {
                    Port.postMessage({mutation} as AddonMessage);
                });
            }
            if (m.mutation) {
                syncContent.onRemoteMutation(m.mutation);
                return;
            }

            if (!connected) {
                onFirstConnect(m.tabId, m.frameId);
                connected = true;
            }

            if (m.protocol) Background.receive(m);
        });
    }

    public static initLink () {
        // we're ready to accept messages for any KPRPC server hosted within this frame
        Background.send({
            action: VaultAction.Init,
            sessionId: sessionId,
            features: features
        } as VaultMessage);
    }

    public static receive (message: VaultMessage) {
        switch (message.protocol) {
            case VaultProtocol.AckInit: Page.send(JSON.stringify({protocol: VaultProtocol.AckInit} as VaultMessage)); break;
            case VaultProtocol.Error: Background.receiveError(message.error); break;
            case VaultProtocol.Jsonrpc: Background.receiveJsonrpc(message.jsonrpc); break;
            case VaultProtocol.Reconnect: Background.initLink(); break;
            case VaultProtocol.ShowGenerator: Page.send(JSON.stringify({protocol: VaultProtocol.ShowGenerator} as VaultMessage)); break;
            default: throw new Error("Unexpected protocol message from addon background");
        }
    }

    public static receiveError (error) {
        if (!tryHandleErrorLocally(error)) {
            if (KeeLog && KeeLog.error) KeeLog.error("Did not know how to handle this error. Errors outside of the JSONRPC protocol"
                + " are unexpected within the context of a single browser: " + error);
        }
    }

    public static receiveJsonrpc (json) {
        Page.send(json);
    }

    public static send (message: VaultMessage) {
        Port.postMessage(message);
    }

}

function tryHandleErrorLocally (error) {

    KeeLog.info("Attempting to handle error locally: " + error.code);

    switch (error.code)
    {
        case "ALREADY_CONNECTED": return true;
        case "SESSION_MISSING":
            // We probably timed out so we'll reinit
            Page.invalidateCurrentSession();
            Page.connect();
            return true;
        case "SESSION_MISMATCH":
            // Retry. A mismatched session most likely indicates that the user has reloaded the page
            // The vault app ensures that only one instance responds to this link file so that
            // we prevent constant battles between different tabs invalidating each other's session.
            Page.invalidateCurrentSession();
            Page.connect();
            return true;
        default: return false;
    }
}

//Listen for messages from the page.
addEventListener(customEventNameFromPage, Page.receive, true);

window.addEventListener("pageshow", ev => {
    pageShowFired = true;
    clearTimeout(missingPageShowTimer);
    if (configReady) {
        startup();
    }
});
window.addEventListener("pagehide", ev => {
    // Session may have already been invalidated in which case
    // we don't want to make things worse by telling the client
    // to teardown an unknown session
    if (Port.raw && sessionId) {
        Port.postMessage({
            action: VaultAction.MessageToClient,
            sessionId: sessionId,
            protocol: VaultProtocol.Teardown
        } as VaultMessage);
    }
    sessionId = null;
    Port.shutdown();
    connected = false;
    tabId = undefined;
    frameId = undefined;
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
