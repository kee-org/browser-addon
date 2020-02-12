import { ResultWrapper } from "./kprpcClient";
import { KeeLog } from "../common/Logger";
import { VaultProtocol } from "../common/VaultProtocol";
import { VaultMessage } from "../common/VaultMessage";

/*
EventSession.js manages the low-level transport connection between this
client and an KeePassRPC server via DOM events.

It can marshall independent event messages to/from a content script that connects
to a server instance in a tab.

Every 5 seconds we expect a ping from any active server running in this browser.
After 6 missed pings, we'll assume the session is dead.

The session keeps running until the tab is closed even if no databases are open
so the current Kee concepts of closed app vs closed db still apply.

*/

export class EventSession {
    constructor (public readonly sessionId: string, public readonly messageToWebPage) {}
}

export class EventSessionManager {
    private eventActivityTimer: number; // we only support one session
    private eventActivityTimeout = 30000;
    private latestSession: EventSession;
    private callbacks: {};
    private _features: string[] = [];

    public isActive () {
        return !!this.latestSession;
    }

    public features () {
        return this.latestSession ? this._features : [];
    }

    public registerCallback (requestId: number, callback: (resultWrapper: Partial<ResultWrapper>) => void) {
        this.callbacks[requestId] = callback;
    }

    public invokeCallback (requestId: number, resultWrapper: Partial<ResultWrapper>) {
        if (this.callbacks[requestId] != null)
            this.callbacks[requestId](resultWrapper);
    }

    public unregisterCallback (requestId: number) {
        delete this.callbacks[requestId];
    }

    constructor (private onOpen, private onClose, private onMessage)
    {
        this.eventActivityTimer = null;
        this.callbacks = {};
    }

    public startSession (sessionId: string, features: string[], messageToWebPage) {
        KeeLog.debug("Event session starting");

        // We do basic session validation at the session layer but allow the KPRPC
        // client to determine feature capabilities and handle application layer setup
        if (!sessionId) {
            return {
                protocol: VaultProtocol.Error,
                error: {
                    code: "SESSION_NOT_SUPPLIED",
                    messageParams: ["you must supply a sessionId"]
                }
            };
        }
        if (this.latestSession && this.latestSession.sessionId) {
            if (sessionId === this.latestSession.sessionId) {
                KeeLog.warn("Duplicate session start request received");
                return;
            } else {
                KeeLog.warn("Session start request received while session still active. Destroying old session.");
                this.closeSession();
            }
        }

        this.latestSession = new EventSession(sessionId, messageToWebPage);

        // One possible outcome of invoking this callback is that
        // the session we just created is destroyed
        this.onOpen(features);

        if (this.isActive()) {

            this._features = features;

            clearTimeout(this.eventActivityTimer);
            this.eventActivityTimer = setTimeout(() => {
                this.closeSession();
            }, this.eventActivityTimeout);

            return {
                protocol: VaultProtocol.AckInit
            };
        }
    }

    // We invoke this when our content script receives a message event from the KPRPC server running in a web page.
    // After a few sanity checks relating to the low-level session maintenance
    // (the sort of stuff that the websockets Web API already handles for us with KeePass)
    // we forward the message to the same message handler that is used for the KeePass plugin.
    public messageReciever (data: VaultMessage)
    {
        KeeLog.debug("message received");

        if (!data.sessionId) {
            this.sendErrorMessage({
                code: "SESSION_NOT_SUPPLIED",
                messageParams: ["you must supply a sessionId"]
            });
            return;
        }

        if (data.protocol === VaultProtocol.Teardown)
        {
            // We might be told to tear down an existing session if we know that the tab
            // is being closed or refreshed or maybe if the server is being upgraded
            this.closeSession();
            return;
        }

        if (!this.latestSession) {
            return {
                protocol: VaultProtocol.Error,
                error: {
                    code: "SESSION_MISSING",
                    messageParams: ["Session not initialised or has timed out"]
                }
            };
        }
        if (data.sessionId != this.latestSession.sessionId) {
            this.sendErrorMessage({
                code: "SESSION_MISMATCH",
                messageParams: ["Already attached to a session (maybe in a different tab). Reinitialisation required."]
            });
            // Don't think this can happen but if it can, returning the error to also be sent to the page
            // attempting to create the new session is safest
            return {
                protocol: VaultProtocol.Error,
                error: {
                    code: "SESSION_MISMATCH",
                    messageParams: ["Already attached to a session (maybe in a different tab). Reinitialisation required."]
                }
            };
        }

        clearTimeout(this.eventActivityTimer);
        this.eventActivityTimer = setTimeout(() => {
            this.closeSession();
        }, this.eventActivityTimeout);

        if (data.protocol === VaultProtocol.Ping) return;

        if (data.protocol === VaultProtocol.Jsonrpc)
        {
            data.encryptionNotRequired = true;
            this.onMessage(data);
        }
    }

    sendErrorMessage (error) {
        if (!this.latestSession) {
            KeeLog.error("Server session went away.");
            throw new Error("Server session went away.");
        }
        this.latestSession.messageToWebPage( { error: error, protocol: VaultProtocol.Error });
    }

    public sendMessage (msg: VaultMessage) {
        if (!this.latestSession) {
            KeeLog.error("Server session went away.");
            throw new Error("Server session went away.");
        }
        this.latestSession.messageToWebPage(msg);
    }

    closeSession ()
    {
        KeeLog.debug("Closing event session");
        clearTimeout(this.eventActivityTimer);
        this.latestSession = null;
        this._features = [];
        this.callbacks = {};
        window.kee.configSyncManager.reset();
        this.onClose();
    }
}
