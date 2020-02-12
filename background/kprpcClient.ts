import { EventSessionManager } from "./EventSession";
import { SRPc } from "./SRP";
import { WebsocketSessionManager } from "./WebsocketSession";
import { SessionType } from "../common/kfDataModel";
import { VaultMessage } from "../common/VaultMessage";
import { KeeLog } from "../common/Logger";
import { VaultProtocol } from "../common/VaultProtocol";
import { utils } from "../common/utils";
import { Button } from "../common/Button";
import { FeatureFlags } from "../common/FeatureFlags";
import { KeeNotification } from "../common/KeeNotification";
import { configManager } from "../common/ConfigManager";
import store from "../store";

/*
kprpcClient.js provides functionality for
communication using the KeePassRPC protocol >= version 1.7
*/

export interface ResultWrapper { result: any; error: any }

class SessionResponse {
    sessionType: SessionType;
    resultWrapper: Partial<ResultWrapper>;
    features: string[];
}

// Only supports one response per session type
class SessionResponseManager {
    private responses: SessionResponse[] = [];
    constructor (private responsesRequired: number, private onComplete: (sessionResponses: SessionResponse[]) => void) {
    }
    public onResponse (sessionType: SessionType, resultWrapper: Partial<ResultWrapper>, features: string[]) {
        this.responses.push({ sessionType, resultWrapper, features });
        if (this.responses.length === this.responsesRequired && this.onComplete)
            this.onComplete(this.responses);
    }
}

export class kprpcClient {

    public requestId: number;
    private clientVersion: number[];
    private srpClientInternals: SRPc;
    private secretKey;
    private websocketSessionManager: WebsocketSessionManager;
    private eventSessionManager: EventSessionManager;
    private keyChallengeParams: { sc: string; cc: string };

    public constructor () {
        this.requestId = 1;
        this.clientVersion = [2, 0, 0];
        this.srpClientInternals = null;
        this.secretKey = null;
        this.eventSessionManager = new EventSessionManager(
            features => this.setupEventSession(features),
            () => this.onEventSessionClosed(),
            obj => this.receive(obj, this.eventSessionManager)
        );
        this.websocketSessionManager = new WebsocketSessionManager(
            () => window.kee.accountManager.featureEnabledMultiSessionTypes || !this.eventSessionManager.isActive(),
            () => this.setupWebsocketSession(),
            () => this.onWebsocketSessionClosed(),
            obj => this.receive(obj, this.websocketSessionManager),
            () => !!this.secretKey
        );
    }

    startWebsocketSessionManager () {
        this.websocketSessionManager.startup();
    }
    startEventSession (sessionId: string, features: string[], messageToWebPage) {
        return this.eventSessionManager.startSession(sessionId, features, messageToWebPage);
    }
    eventSessionMessageFromPage (data: VaultMessage) {
        return this.eventSessionManager.messageReciever(data);
    }

    getSessionManagerByType (sessionType: SessionType) {
        return sessionType === SessionType.Event ? this.eventSessionManager : this.websocketSessionManager;
    }

    getPrimarySessionManager () {
        if (this.eventSessionManager.isActive())
            return this.eventSessionManager;
        else if (this.websocketSessionManager.isActive())
            return this.websocketSessionManager;
        else
            return null;
    }

    getManagersForActiveSessions () {
        const activeSessions: (WebsocketSessionManager | EventSessionManager)[] = [];
        if (this.eventSessionManager.isActive()) activeSessions.push(this.eventSessionManager);
        if (this.websocketSessionManager.isActive()) activeSessions.push(this.websocketSessionManager);
        return activeSessions;
    }

    // send a request to the current RPC server.
    // calling functions MUST manage the requestID to limit thread concurrency errors
    //TODO:v: is above still necessary after e10s refactoring and new WebExtensions arch?
    // Each type of request may or may not invoke a callback.
    // Each request (uniquely identified by the requestId) may be distributed to one or more servers.
    request (
        sessionManagers: (WebsocketSessionManager | EventSessionManager)[],
        method: string,
        params: any[],
        onComplete: (sessionResponses: SessionResponse[]) => void,
        requestId: number) {

        if (requestId == undefined || requestId == null || requestId < 0)
            throw new Error("JSON-RPC communication requested with no requestID provided");

        const data = JSON.stringify({ jsonrpc: "2.0", params: params, method: method, id: requestId });
        KeeLog.debug("Sending a JSON-RPC request");

        // May want to generalise to more than these two servers one day but this does the job for now
        const responseManager = new SessionResponseManager(sessionManagers.length, onComplete);
        for (const sessionManager of sessionManagers) {
            try {
                if (sessionManager instanceof EventSessionManager) {
                    this.eventSessionManager.registerCallback(requestId, resultWrapper => responseManager.onResponse(SessionType.Event, resultWrapper, sessionManager.features()));
                    this.sendJSONRPCUnencrypted(data);
                } else {
                    // async webcrypto:
                    if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
                        this.websocketSessionManager.registerCallback(requestId, resultWrapper => responseManager.onResponse(SessionType.Websocket, resultWrapper, sessionManager.features()));
                        this.encrypt(data, this.sendJSONRPCEncrypted);
                    }
                }
            } catch (ex) {
                KeeLog.warn("JSON-RPC request could not be sent. Expect an async error soon. Exception: " + ex.message + ":" + ex.stack);
                setTimeout(() => {
                    this.processJSONRPCresponse({
                        id: requestId,
                        error: {
                            message: "Send failure. Maybe the server went away?"
                        },
                        message: "error"
                    }, sessionManager);
                }, 50);
            }
        }
    }

    // interpret the message from the RPC server
    evalJson (method, params) {
        let data = JSON.stringify(params);
        KeeLog.debug("Evaluating a JSON-RPC object we just received");

        if (data) {
            data = data.match(/\s*\[(.*)\]\s*/)[1];
        }

        // We only really need one method to be callable... but we'll keep the
        // old name to enable Authentication attempts to fail with older
        // RPC server versions
        if (method == "KPRPCListener" || method == "callBackToKeeFoxJS")
            this.KPRPCListener(data);
    }

    KPRPCListener (signal) {
        // call this async so that json reader can get back to listening ASAP and prevent deadlocks
        setTimeout(function () {
            window.kee.KPRPCListener(signal);
        }, 5);
    }


    sendJSONRPCEncrypted (encryptedContainer) {
        const data2server =
            {
                protocol: VaultProtocol.Jsonrpc,
                srp: null,
                key: null,
                error: null,
                jsonrpc: encryptedContainer,
                version: utils.versionAsInt(this.clientVersion)
            };
        this.websocketSessionManager.sendMessage(JSON.stringify(data2server));
    }

    sendJSONRPCUnencrypted (json) {
        const data2server =
            {
                protocol: VaultProtocol.Jsonrpc,
                srp: null,
                key: null,
                error: null,
                jsonrpc: json,
                encryptionNotRequired: true,
                version: utils.versionAsInt(this.clientVersion)
            };
        this.eventSessionManager.sendMessage(data2server);
    }

    // After the current connection has been closed we reset those variables
    // that are shared at the moment (e.g. secret key + authenticated status)
    // and notify Kee Vault that it can try to connect now (if applicable)
    onWebsocketSessionClosed () {
        this.srpClientInternals = null;
        this.secretKey = null;

        if (!this.eventSessionManager.isActive()) {
            window.kee._pauseKee();
            window.kee.inviteKeeVaultConnection();
        } else {
            window.kee._refreshKPDB();
        }
    }

    onEventSessionClosed () {
        if (!this.websocketSessionManager.isActive()) {
            window.kee._pauseKee();
        } else {
            window.kee._refreshKPDB();
        }
    }

    // data = JSON (underlying network/transport layer must have already formed incoming message(s) into JSON objects)
    receive (data, sessionManager: EventSessionManager | WebsocketSessionManager) {
        if (data === undefined || data === null)
            return;
        if (data.protocol === undefined || data.protocol === null)
            return;
        switch (data.protocol) {
            case "setup": this.receiveSetup(data); break;
            case "jsonrpc": this.receiveJSONRPC(data); break;
            case "error":
                if (data.error) {
                    const extra = [];
                    if (data.error.messageParams && data.error.messageParams.length >= 1)
                        extra[0] = data.error.messageParams[0];

                    if (data.error.code == "VERSION_CLIENT_TOO_LOW") {
                        // This means that the server requires us to support a feature that we don't have
                        KeeLog.error($STR("conn_setup_client_features_missing") + " Extra info: " + extra);
                        store.dispatch("updateLatestConnectionError", "VERSION_CLIENT_TOO_LOW");
                        this.showConnectionMessage($STR("conn_setup_client_features_missing"));
                    } else if (data.error.code == "UNRECOGNISED_PROTOCOL") {
                        KeeLog.error($STR("conn_unknown_protocol") + " "
                            + $STRF("further_info_may_follow", extra));
                        store.dispatch("updateLatestConnectionError", "UNRECOGNISED_PROTOCOL");
                    } else if (data.error.code == "INVALID_MESSAGE") {
                        KeeLog.error($STR("conn_invalid_message") + " "
                            + $STRF("further_info_may_follow", extra));
                        store.dispatch("updateLatestConnectionError", "INVALID_MESSAGE");
                    } else if (data.error.code == "AUTH_RESTART") {
                        KeeLog.error($STR("conn_setup_restart") + " "
                            + $STRF("further_info_may_follow", extra));
                        store.dispatch("updateLatestConnectionError", "AUTH_RESTART");
                        this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                        this.showConnectionMessage($STR("conn_setup_restart") + " "
                            + $STR("conn_setup_retype_password"));
                    } else {
                        KeeLog.error($STR("conn_unknown_error") + " "
                            + $STRF("further_info_may_follow", extra));
                        store.dispatch("updateLatestConnectionError", "UNKNOWN_JSONRPC");
                        this.showConnectionMessage($STR("conn_unknown_error") + " "
                            + $STRF("further_info_may_follow", ["See Kee log"]));
                    }
                }
                sessionManager.closeSession();
                break;
            default: return;
        }
    }

    receiveSetup (data) {
        // double check
        if (data.protocol != "setup")
            return;

        if (data.error) {
            const extra = [];
            if (data.error.messageParams && data.error.messageParams.length >= 1)
                extra[0] = data.error.messageParams[0];
            switch (data.error.code) {
                case "AUTH_CLIENT_SECURITY_LEVEL_TOO_LOW": {
                    KeeLog.warn($STR("conn_setup_client_sl_low"));
                    store.dispatch("updateLatestConnectionError", "AUTH_CLIENT_SECURITY_LEVEL_TOO_LOW");
                    const button: Button = {
                        label: $STR("conn_setup_client_sl_low_resolution"),
                        action: "enableHighSecurityKPRPCConnection"
                    };
                    this.showConnectionMessage($STR("conn_setup_client_sl_low"), [button]);
                    break;
                }
                case "AUTH_FAILED": {
                    KeeLog.warn($STR("conn_setup_failed") + " "
                    + $STRF("further_info_may_follow", extra));
                    store.dispatch("updateLatestConnectionError", "AUTH_FAILED");
                    this.showConnectionMessage($STR("conn_setup_failed")
                        + " " + $STR("conn_setup_retype_password"));
                    // There may be a stored key that has become corrupt through a change of security level, etc.
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    break;
                }
                case "AUTH_RESTART": {
                    KeeLog.warn($STR("conn_setup_restart") + " "
                    + $STRF("further_info_may_follow", extra));
                    store.dispatch("updateLatestConnectionError", "AUTH_RESTART");
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    this.showConnectionMessage($STR("conn_setup_restart")
                        + " " + $STR("conn_setup_retype_password"));
                    break;
                }
                case "AUTH_EXPIRED": {
                    KeeLog.warn($STRF("conn_setup_expired", extra));
                    store.dispatch("updateLatestConnectionError", "AUTH_EXPIRED");
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    this.showConnectionMessage($STR("conn_setup_expired")
                        + " " + $STR("conn_setup_retype_password"));
                    break;
                }
                case "AUTH_INVALID_PARAM": {
                    KeeLog.error($STRF("conn_setup_invalid_param", extra));
                    store.dispatch("updateLatestConnectionError", "AUTH_INVALID_PARAM");
                    break;
                }
                case "AUTH_MISSING_PARAM": {
                    KeeLog.error($STRF("conn_setup_missing_param", extra));
                    store.dispatch("updateLatestConnectionError", "AUTH_MISSING_PARAM");
                    break;
                }
                default: {
                    KeeLog.error($STR("conn_unknown_error") + " "
                    + $STRF("further_info_may_follow", extra));
                    store.dispatch("updateLatestConnectionError", "UNKNOWN_SETUP");
                    this.showConnectionMessage($STR("conn_unknown_error") + " "
                        + $STRF("further_info_may_follow", ["See Kee log"]));
                    break;
                }
            }
            this.websocketSessionManager.closeSession();
            return;
        }

        if ((data.srp && data.srp.stage === "identifyToClient") ||
            (data.key && data.key.sc)) {
            if (!this.serverHasRequiredFeatures(data.features)) {
                KeeLog.error($STRF("conn_setup_server_features_missing", ["https://www.kee.pm/upgrade-kprpc"]));
                store.dispatch("updateLatestConnectionError", "VERSION_CLIENT_TOO_HIGH");
                const button: Button = {
                    label: $STR("upgrade_kee"),
                    action: "loadUrlUpgradeKee"
                };
                this.showConnectionMessage($STRF("conn_setup_server_features_missing", ["https://www.kee.pm/upgrade-kprpc"]), [button]);
                this.websocketSessionManager.closeSession();
                return;
            }
            this.websocketSessionManager.setClaimedFeatures(data.features);
        }

        // We use key authentication when we have a pre-agreed secret key
        if (data.key !== undefined && data.key !== null) {
            if (this.checkServerSecurityLevel(data.key.securityLevel)) {
                if (data.key.sc) {
                    this.keyChallengeResponse1(data);
                } else if (data.key.sr) {
                    this.keyChallengeResponse2(data);
                }
            } else {
                KeeLog.warn($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
                store.dispatch("updateLatestConnectionError", "AUTH_SERVER_SECURITY_LEVEL_TOO_LOW");
                this.sendWebsocketsError("AUTH_SERVER_SECURITY_LEVEL_TOO_LOW", [this.getSecurityLevelServerMinimum()]);
                this.showConnectionMessage($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
            }
        }

        // We use SRP when we have no knowledge of a pre-agreed secret key
        if (data.srp !== undefined && data.srp !== null) {
            if (this.checkServerSecurityLevel(data.srp.securityLevel)) {
                switch (data.srp.stage) {
                    case "identifyToClient": this.getSideChannelPassword(data); break;
                    case "proofToClient": this.proofToClient(data); break;
                    default: return;
                }
            } else {
                KeeLog.warn($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
                store.dispatch("updateLatestConnectionError", "AUTH_SERVER_SECURITY_LEVEL_TOO_LOW");
                this.sendWebsocketsError("AUTH_SERVER_SECURITY_LEVEL_TOO_LOW", [this.getSecurityLevelServerMinimum()]);
                this.showConnectionMessage($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
            }
        }
    }

    sendWebsocketsError (errCode, errParams) {
        const data2server =
            {
                protocol: "setup",
                srp: null,
                key: null,
                error: {
                    code: errCode,
                    params: errParams
                },
                version: utils.versionAsInt(this.clientVersion)
            };

        this.websocketSessionManager.sendMessage(JSON.stringify(data2server));
    }

    serverHasRequiredFeatures (features) {
        // Versions of KeePassRPC <= 1.6.x will reject connections (send an "error" property) from
        // Kee clients that are too new (like this one). For >= 1.7 it will only do so if it also
        // decides that this client does not support features essential for it to function.
        // Therefore if we've reached this far, we can check the server's list of features that get
        // sent back on the server's first handshake response and reject if the server is missing features we need.
        if (!features || !FeatureFlags.required.every(function (feature) { return features.indexOf(feature) !== -1; }))
        {
            return false;
        }
        return true;
    }

    checkServerSecurityLevel (serverSecurityLevel) {
        if (serverSecurityLevel >= this.getSecurityLevelServerMinimum())
            return true;
        return false;
    }

    keyChallengeResponse1 (data) {

        this.keyChallengeParams = {
            sc: data.key.sc,
            cc: utils.BigIntFromRandom(32).toString(16).toLowerCase()
        };

        utils.hash("1" + this.getStoredKey() + this.keyChallengeParams.sc + this.keyChallengeParams.cc).then(digest => {
            const cr = digest.toLowerCase();

            const data2server =
                {
                    protocol: "setup",
                    key:
                    {
                        cc: this.keyChallengeParams.cc,
                        cr: cr,
                        securityLevel: this.getSecurityLevel()
                    },
                    version: utils.versionAsInt(this.clientVersion)
                };

            this.websocketSessionManager.sendMessage(JSON.stringify(data2server));
        });
    }

    keyChallengeResponse2 (data) {
        utils.hash("0" + this.getStoredKey() + this.keyChallengeParams.sc + this.keyChallengeParams.cc).then(digest => {
            const sr = digest.toLowerCase();

            if (sr != data.key.sr) {
                KeeLog.warn($STR("conn_setup_failed"));
                store.dispatch("updateLatestConnectionError", "CHALLENGE_RESPONSE_MISMATCH");
                this.showConnectionMessage($STR("conn_setup_failed")
                    + " " + $STR("conn_setup_retype_password"));
                this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                this.websocketSessionManager.closeSession();
                return;
            }
            else {
                // note down our agreed secret key somewhere that we can find it easily later
                this.secretKey = this.getStoredKey();

                // 0.025 second delay before we try to do the Kee connection startup stuff
                setTimeout(this.onConnectStartup, 50, "CR", this.onConnectStartup);
            }
        });
    }

    async getSideChannelPassword (data) {

        // get the user to type in the one-time password

        const s = data.srp.s;
        const B = data.srp.B;
        const _this = this;

        const vaultTabs = await browser.tabs.query({url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]});

        function handleMessage (request, sender, sendResponse) {
            if (request.action !== "SRP_ok") return;
            _this.identifyToClient(request.password, s, B);
            browser.runtime.onMessage.removeListener(handleMessage);
        }

        browser.runtime.onMessage.addListener(handleMessage);

        const createData = {
            url: "/dialogs/SRP.html",
            active: !(vaultTabs && vaultTabs[0] && vaultTabs[0].active)
        };
        const creating = browser.tabs.create(createData);
    }

    identifyToClient (password, s, B) {
        this.srpClientInternals.p = password;
        this.srpClientInternals.receiveSalts(s, B).then(() => {

            const data2server =
                {
                    protocol: "setup",
                    srp:
                    {
                        stage: "proofToServer",
                        M: this.srpClientInternals.M,
                        securityLevel: this.getSecurityLevel()
                    },
                    version: utils.versionAsInt(this.clientVersion)
                };

            this.websocketSessionManager.sendMessage(JSON.stringify(data2server));
        });
    }

    proofToClient (data) {
        this.srpClientInternals.confirmAuthentication(data.srp.M2);

        if (!this.srpClientInternals.authenticated) {
            KeeLog.warn($STR("conn_setup_failed"));
            store.dispatch("updateLatestConnectionError", "SRP_AUTH_FAILURE");
            this.showConnectionMessage($STR("conn_setup_failed")
                + " " + $STR("conn_setup_retype_password"));
            this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
            this.websocketSessionManager.closeSession();
            return;
        }
        else {
            // note down our agreed secret key somewhere that we can find it easily later
            this.srpClientInternals.key().then(key => {

                if (!key) return;

                this.secretKey = key;

                // store the key somewhere persistent (according to the security level rules)
                this.setStoredKey(this.srpClientInternals.I, this.getSecurityLevel(), key);

                // 0.025 second delay before we try to do the Kee connection startup stuff
                setTimeout(this.onConnectStartup, 50, "SRP");
            });
        }

    }

    onConnectStartup (type) {
        // if any errors were shown, they are now resolved
        window.kee.removeUserNotifications((notification: KeeNotification) => notification.name != "kee-connection-message");
        store.dispatch("updateLatestConnectionError", "");
        window.kee._refreshKPDB();
    }

    // No need to return anything from this function so sync or async implementation is fine
    receiveJSONRPC (data) {
        if (data.encryptionNotRequired) {
            this.receiveJSONRPCUnencrypted(data.jsonrpc);
        } else {
            // async webcrypto:
            if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
                this.decrypt(data.jsonrpc, this.receiveJSONRPCDecrypted);
                return;
            }
            throw new Error("Webcrypto required but disabled or broken");
        }
    }

    receiveJSONRPCUnencrypted (data) {
        if (data === null) return; // duff data sent by server
        const obj = JSON.parse(data);

        // if we failed to parse an object from the JSON
        if (!obj) return;

        this.processJSONRPCresponse(obj, this.eventSessionManager);
    }

    receiveJSONRPCDecrypted (data) {
        if (data === null) {
            return; // decryption failed; connection has been reset and user will re-enter password for fresh authentication credentials
        }
        const obj = JSON.parse(data);

        // if we failed to parse an object from the JSON
        if (!obj) return;

        this.processJSONRPCresponse(obj, this.websocketSessionManager);
    }

    processJSONRPCresponse (obj, sessionManager: EventSessionManager | WebsocketSessionManager) {
        const sessionType = sessionManager instanceof EventSessionManager ? SessionType.Event : SessionType.Websocket;
        if ("result" in obj && obj.result !== false) {
            // A null result indicates something went wrong with the request to KPRPC but it could
            // be as simple as the user not being logged in to any databases. To ensure that all
            // expected responses from different servers are seen and that all callbacks get unregistered,
            // we no longer abort early. When we're confident that no scenarios cause issues for
            // callbacks that might assume null results are already filtered out, we can remove
            // this whole comment block.
            // if (obj.result == null)
            //     return;

            try {
                sessionManager.invokeCallback(obj.id, obj);
                sessionManager.unregisterCallback(obj.id);
            } catch (e) {
                sessionManager.unregisterCallback(obj.id);
                KeeLog.warn("[" + sessionType + "] An error occurred when processing the result callback for JSON-RPC object id " + obj.id + ": " + e);
            }
        } else if ("error" in obj) {
            try {
                KeeLog.error("[" + sessionType + "] An error occurred in KeePassRPC object id: " + obj.id + " with this message: " + obj.message + " and this error: " + obj.error + " and this error message: " + obj.error.message);
                sessionManager.invokeCallback(obj.id, obj);
                sessionManager.unregisterCallback(obj.id);
            } catch (e) {
                sessionManager.unregisterCallback(obj.id);
                KeeLog.warn("[" + sessionType + "] An error occurred when processing the error callback for JSON-RPC object id " + obj.id + ": " + e);
            }
        } else if ("method" in obj) {
            const result: any = { id: obj.id };

            try {
                result.result = this.evalJson(obj.method, obj.params);
                if (!result.result)
                    result.result = null;
            } catch (e) {
                result.error = e;
                KeeLog.error("[" + sessionType + "] An error occurred when processing a JSON-RPC request: " + e);
            }
        } else if (!("id" in obj)) {
            // This probably means the server sent a response that breaks JSON-RPC-2 spec
            KeeLog.error("[" + sessionType + "] Unexpected error processing receiveJSONRPC");
        }
    }

    setupEventSession (features: string[]) {

        if (!window.kee.accountManager.featureEnabledMultiSessionTypes && this.websocketSessionManager.isActive()) {
            KeeLog.debug("Session activation aborted: Existing session already active and account does not have the multiple sessions feature.");
            this.eventSessionManager.closeSession();
            return;
        }

        // We don't expect this to happen because we can control the features offered
        // by the server before we make them required by a new version of the browser-addon.
        // An edge case may be if we remove a feature from the server and ancient versions
        // of the browser addon still require it but since we intend to describe such removals
        // via new feature flags anyway, we will be fine for the reasonably foreseeable future.
        // Therefore the messages displayed to the user may not make complete sense - which
        // is better than requiring translation of text that should not be rendered
        if (!this.serverHasRequiredFeatures(features))
        {
            KeeLog.error("eventSession: " + $STRF("conn_setup_server_features_missing", ["https://www.kee.pm/upgrade-kprpc"]));
            store.dispatch("updateLatestConnectionError", "VERSION_CLIENT_TOO_HIGH");
            const button: Button = {
                label: $STR("upgrade_kee"),
                action: "loadUrlUpgradeKee"
            };
            this.showConnectionMessage($STRF("conn_setup_server_features_missing", ["https://www.kee.pm/upgrade-kprpc"]), [button]);
            this.eventSessionManager.closeSession();
            return;
        }

        this.onConnectStartup("vault");
    }

    setupWebsocketSession () {

        if (!window.kee.accountManager.featureEnabledMultiSessionTypes && this.eventSessionManager.isActive()) {
            KeeLog.debug("Session activation aborted: Existing session already active and account does not have the multiple sessions feature.");
            this.websocketSessionManager.closeSession();
            return;
        }

        // Sometimes things go wrong (e.g. user cancels master password
        // dialog box; maybe startup windows disappear)
        try {
            let setupKey = null;
            let setupSRP = null;
            const securityLevel = this.getSecurityLevel();
            const username = this.getUsername(securityLevel);

            // If we find a secure key already, lets send the unique username for this
            // client instead of the srp object. Server will then enter
            // challenge-response handshake phase
            const storedKey = this.getStoredKey(username, securityLevel);

            if (storedKey) {
                // send a setup message asking to mutally authenticate using the shared key
                setupKey =
                    {
                        username: username,
                        securityLevel: securityLevel
                    };
            } else {
                // start the SRP authentication procedure
                this.srpClientInternals = new SRPc();
                this.srpClientInternals.setup(username);
                setupSRP =
                    {
                        stage: "identifyToServer",
                        I: this.srpClientInternals.I,
                        A: this.srpClientInternals.Astr,
                        securityLevel: securityLevel
                    };
            }

            const data2server =
                {
                    protocol: "setup",
                    srp: setupSRP,
                    key: setupKey,
                    version: utils.versionAsInt(this.clientVersion),
                    features: FeatureFlags.offered,

                    // these parameters allows KPRPC to identify which type of client is making
                    // this request. We can't trust it but it can help the user to understand what's going on.
                    clientTypeId: "keefox",
                    clientDisplayName: "Kee",
                    clientDisplayDescription: $STR("conn_display_description")
                };

            this.websocketSessionManager.sendMessage(JSON.stringify(data2server));
        } catch (ex) {
            // Need to make sure that the underlying web socket connection has been
            // closed so we are able to retry the connection a bit later but we'll
            // enforce a little delay just in case the reason for the problem is
            // that the application startup is progressing very slowly for some other reason
            KeeLog.warn("An attempt to setup the KPRPC secure channel has failed. It will not be retried for at least 10 seconds." +
                " If you see this message regularly and are not sure why, please ask on the help forum. Technical detail about the problem follows: " + ex);
            this.websocketSessionManager.connectionProhibitedUntil = new Date();
            this.websocketSessionManager.connectionProhibitedUntil.setTime(
                this.websocketSessionManager.connectionProhibitedUntil.getTime() + 10000);
            this.websocketSessionManager.closeSession();
            KeeLog.debug("Connection state reset ready for next attempt in at least 10 seconds");
        }

    }

    getUsername (securityLevel) {
        let username = "";

        // if we expect client to be able to retrieve a password from a stored location,
        // we'll re-use the most recent username if we can find it. Otherwise we'll start from scratch
        if (securityLevel <= 2 && configManager.current.KPRPCUsername) {
            username = configManager.current.KPRPCUsername;
        }

        if (username.length <= 0) {
            username = utils.newGUID();
            configManager.current.KPRPCUsername = username;
            configManager.save();
        }
        return username;
    }

    getSecurityLevel () {
        // read these from config. Local Firefox attacker could change config to a lower security
        // level but in doing so, a new SRP auth will be triggered during which the server has opportunity
        // to reject the client because its security level is too low.
        return configManager.current.connSLClient;
    }

    getSecurityLevelServerMinimum () {
        return configManager.current.connSLServerMin;
    }

    getStoredKey (username?, securityLevel = 0) {
        if (username === undefined) {
            securityLevel = this.getSecurityLevel();
            username = this.getUsername(securityLevel);
        }

        if (securityLevel >= 3 || securityLevel <= 0)
            return null;
        if (securityLevel == 2 || securityLevel == 1) {
            // There is no longer any way to adjust the security of the stored key so we must treat all as if they are securityLevel 1
            return configManager.current.KPRPCStoredKeys[username];
        }
    }


    setStoredKey (username: string, securityLevel, key: string) {
        if (securityLevel >= 3 || securityLevel <= 0)
            return;
        if (securityLevel == 2 || securityLevel == 1) {
            // There is no longer any way to adjust the security of the stored key so we must treat all as if they are securityLevel 1
            // store the key
            configManager.current.KPRPCStoredKeys[username] = key;
            configManager.save();
        }
    }

    removeStoredKey (username, securityLevel?) {
        if (!securityLevel || securityLevel == 2 || securityLevel == 1) {
            // There is no longer any way to adjust the security of the stored key so we must treat all as if they are securityLevel 1
            // clear the key
            configManager.current.KPRPCStoredKeys[username] = "";
            configManager.save();
        }
    }

    // Encrypt plaintext using web crypto api
    encrypt (plaintext, callback) {

        KeeLog.debug("starting webcrypto encryption");

        const KPRPC = this;
        const wc = crypto.subtle;
        const iv: any = crypto.getRandomValues(new Uint8Array(16));
        const secretKey = this.secretKey;
        const messageAB = utils.stringToByteArray(plaintext);

        // get our secret key
        const secretKeyAB = utils.hexStringToByteArray(secretKey);

        // "as any" is needed due to typescript browser API type definition bug introduced in TS 2.9
        // The extra typescriptHack const is needed so we can cast to Promise rather than
        // PromiseLike which is some bullshit buggy type definition
        const typescriptHack = wc.importKey(
            "raw",                            // Exported key format
            secretKeyAB,                      // The exported key
            { name: "AES-CBC", length: 256 } as any, // Algorithm the key will be used with
            true,                             // Can extract key value to binary string
            ["encrypt", "decrypt"]            // Use for these operations
        ) as Promise<CryptoKey>;
        typescriptHack.then(function (pwKey) {
            const alg = { name: "AES-CBC", iv: iv };
            return wc.encrypt(alg, pwKey, messageAB);
        })
            .then(function (encrypted) {

                const typescriptHack2 = wc.digest({ name: "SHA-1" }, secretKeyAB) as Promise<ArrayBuffer>;
                typescriptHack2.then(function (secretkeyHash) {

                    const hmacData = new Uint8Array(20 + encrypted.byteLength + 16);
                    const len = hmacData.byteLength;

                    // fill the hmacData bytearray with the data
                    hmacData.set(new Uint8Array(secretkeyHash));
                    hmacData.set(new Uint8Array(encrypted), 20);
                    hmacData.set(iv, encrypted.byteLength + 20);

                    // We could get a promise from crypto.subtle.digest({name: "SHA-1"}, hmacData)
                    // but that takes quite a lot longer than our existing hash utility
                    // presumably because the base64 implementation within the Firefox
                    // XPCOM hash component is native rather than running in Javascript
                    // when the promise completes
                    utils.hash(hmacData, "base64", "SHA-1").then(ourHMAC => {

                        const ivAB = hmacData.subarray(len - 16);
                        const encryptedMessage = {
                            message: utils.byteArrayToBase64(encrypted),
                            iv: utils.byteArrayToBase64(ivAB),
                            hmac: ourHMAC
                        };

                        const callbackTarget = function (func, data) {
                            func(data);
                        };

                        // Do the callback async because we don't want exceptions in
                        // JSONRPC handling being treated as encryption errors
                        setTimeout(callbackTarget, 1, callback.bind(KPRPC), encryptedMessage);
                    });
                })
                    .catch(function (e) {
                        KeeLog.error("Failed to calculate HMAC. Exception: " + e);
                        callback(null);
                    });

            })
            .catch(function (e) {
                KeeLog.error("Failed to encrypt. Exception: " + e);
                callback(null);
            });
    }

    // Decrypt incoming data from KeePassRPC using AES-CBC and a separate HMAC
    decrypt (encryptedContainer, callback) {
        KeeLog.debug("starting webcrypto decryption");

        const KPRPC = this;
        let t = (new Date()).getTime();
        const wc = crypto.subtle;

        const message = encryptedContainer.message;
        const iv = encryptedContainer.iv;
        const hmac = encryptedContainer.hmac;
        const secretKey = this.secretKey;

        // get our secret key
        const secretKeyAB = utils.hexStringToByteArray(secretKey);

        // Put our encrypted message into an array that includes space at the start
        // for holding the other data we'll want to run our HMAC hash over (this
        // means we can store the message just once in memory - probably won't
        // make a difference for small messages but when the entire KeePass
        // database contents is being shifted around we should save a fair few ms)
        const hmacData = utils.base64toByteArrayForHMAC(message, 36);
        const len = hmacData.length;

        // create views for use in the decryption routines
        const secretkeyHashAB = hmacData.subarray(0, 20);
        const messageAB = hmacData.subarray(20, len - 16);
        const ivAB = hmacData.subarray(len - 16);

        let tn = (new Date()).getTime();
        KeeLog.debug("decryption stage 'data prep 1' took: " + (tn - t));
        t = tn;

        const typescriptHack4 = wc.digest({ name: "SHA-1" }, secretKeyAB) as Promise<ArrayBuffer>;
        typescriptHack4.then(function (secretkeyHash) {
            tn = (new Date()).getTime();
            KeeLog.debug("decryption stage 'key hash' took: " + (tn - t));
            t = tn;

            // fill the hmacData bytearray with the rest of the data
            secretkeyHashAB.set(new Uint8Array(secretkeyHash));
            utils.base64toByteArrayForHMAC(iv, 0, ivAB);

            tn = (new Date()).getTime();
            KeeLog.debug("decryption stage 'data prep 2' took: " + (tn - t));
            t = tn;

            // We could get a promise from crypto.subtle.digest({name: "SHA-1"}, hmacData)
            // but that takes quite a lot longer than our existing hash utility
            // presumably because the base64 implementation within the Firefox
            // XPCOM hash component is native rather than running in Javascript
            // when the promise completes
            return utils.hash(hmacData, "base64", "SHA-1");


        }).then(digest => {
            const ourHMAC = digest;
            tn = (new Date()).getTime();
            KeeLog.debug("decryption stage 'generate HMAC' took: " + (tn - t));
            t = tn;

            if (ourHMAC == hmac) {
                // "as any" is needed due to typescript browser API type definition bug introduced in TS 2.9
                // The extra typescriptHack3 const is needed so we can cast to Promise rather than
                // PromiseLike which is some bullshit buggy type definition
                const typescriptHack3 = wc.importKey(
                    "raw",                            // Exported key format
                    secretKeyAB,                      // The exported key
                    { name: "AES-CBC", length: 256 } as any, // Algorithm the key will be used with
                    true,                             // Can extract key value to binary string
                    ["encrypt", "decrypt"]            // Use for these operations
                ) as Promise<CryptoKey>;
                typescriptHack3.then(function (pwKey) {
                    tn = (new Date()).getTime();
                    KeeLog.debug("decryption stage 'import key' took: " + (tn - t));
                    t = tn;
                    const alg = { name: "AES-CBC", iv: ivAB };
                    return wc.decrypt(alg, pwKey, messageAB);
                })
                    .then(function (decrypted) {
                        tn = (new Date()).getTime();
                        KeeLog.debug("decryption stage 'aes-cbc' took: " + (tn - t));
                        t = tn;
                        const plainText = new TextDecoder("utf-8").decode(decrypted);
                        tn = (new Date()).getTime();
                        KeeLog.debug("decryption stage 'utf-8 conversion' took: " + (tn - t));
                        t = tn;

                        const callbackTarget = function (func, data) {
                            func(data);
                        };

                        // Do the callback async because we don't want exceptions in
                        // JSONRPC handling being treated as connection errors
                        setTimeout(callbackTarget, 1, callback.bind(KPRPC), plainText);
                    })
                    .catch(function (e) {
                        KeeLog.error("Failed to decrypt. Exception: " + e);

                        KeeLog.warn($STR("conn_setup_restart"));
                        store.dispatch("updateLatestConnectionError", "DECRYPTION_FAILED");
                        KPRPC.showConnectionMessage($STR("conn_setup_restart")
                            + " " + $STR("conn_setup_retype_password"));
                        KPRPC.removeStoredKey(KPRPC.getUsername(KPRPC.getSecurityLevel()));
                        KPRPC.websocketSessionManager.closeSession();
                        callback(null);
                    });
            }
        })
            .catch(function (e) {
                KeeLog.error("Failed to hash secret key. Exception: " + e);

                KeeLog.warn($STR("conn_setup_restart"));
                store.dispatch("updateLatestConnectionError", "SECRET_KEY_HASH_FAILED");
                KPRPC.showConnectionMessage($STR("conn_setup_restart")
                    + " " + $STR("conn_setup_retype_password"));
                KPRPC.removeStoredKey(KPRPC.getUsername(KPRPC.getSecurityLevel()));
                KPRPC.websocketSessionManager.closeSession();
                callback(null);
            });
    }

    showConnectionMessage (msg: string, buttons?: Button[]) {
        window.kee.notifyUser(new KeeNotification(
            "kee-connection-message", buttons ? buttons : [], utils.newGUID(), [msg], "Medium"));
    }

}
