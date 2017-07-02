/*
kprpcClient.js provides functionality for
communication using the KeePassRPC protocol >= version 1.3.
*/

/// <reference path="session.ts" />
/// <reference path="../common/FeatureFlags.ts" />
/// <reference path="../common/Logger.ts" />
/// <reference path="../common/ConfigManager.ts" />

class kprpcClient {
    public requestId: number;
    private callbacks: {};
    private callbacksData: {};
    private clientVersion: number[];
    private authPromptAborted: boolean;
    private srpClientInternals: SRPc;
    private secretKey;
    private securityLevel: number;
    private securityLevelServerMinimum: number;
    private authenticated: boolean;
    private session: Session;
    private keyChallengeParams: { sc: string, cc: string };

    public constructor () {
        this.requestId = 1;
        this.callbacks = {};
        this.callbacksData = {};
        this.clientVersion = [2, 0, 0];
        this.authPromptAborted = false;
        this.srpClientInternals = null;
        this.secretKey = null;
        this.securityLevel = 3;
        this.securityLevelServerMinimum = 3;
        this.authenticated = false;
        this.session = new Session(
            () => this.setup(),
            obj => this.receive(obj)
        );
    }

    startup () {
        this.session.startup();
    }

    // send a request to the current RPC server.
    // calling functions MUST manage the requestID to limit thread concurrency errors
    request (session, method, params, callback, requestId, callbackData = null) {
        if (requestId == undefined || requestId == null || requestId < 0)
            throw new Error("JSON-RPC communciation requested with no requestID provided.");

        this.callbacks[requestId] = callback;
        if (callbackData != null)
            this.callbacksData[requestId] = callbackData;

        const data = JSON.stringify({ params: params, method: method, id: requestId });
        KeeFoxLog.debug("Sending a JSON-RPC request", ": "  + data);

        try {
            this.sendJSONRPC(data);
        } catch (ex) {
            KeeFoxLog.warn("JSON-RPC request could not be sent. Expect an async error soon.");
            setTimeout(function () {
                this.processJSONRPCresponse({
                    id: requestId,
                    error: {
                        message: "Send failure. Maybe the server went away?"
                    },
                    message: "error"
                });
            }.bind(this), 50);
        }
    }


    // interpret the message from the RPC server
    evalJson (method, params) {
        let data = JSON.stringify(params);
        KeeFoxLog.debug("Evaluating a JSON-RPC object we just recieved", ": " + data);

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
            keefox_org.KPRPCListener(signal);
        }, 5);
    }


    // No need to return anything from this function so sync or async implementation is fine
    sendJSONRPC (data) {
        // async webcrypto:
        if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
            this.encrypt(data, this.sendJSONRPCDecrypted);
            return;
        }
    }

    sendJSONRPCDecrypted (encryptedContainer) {

        const data2server =
            {
                protocol: "jsonrpc",
                srp: null,
                key: null,
                error: null,
                jsonrpc: encryptedContainer,
                version: utils.versionAsInt(this.clientVersion)
            };

        this.send(JSON.stringify(data2server));
    }

    send (data) {
        try {
            this.session.webSocket.send(data);
        } catch (ex) {
            KeeFoxLog.error("Failed to send a websocket message. Exception details: " + ex + ", stack: " + ex.stack);
        }
    }


    // Close the current connection and reset those variables that are shared at the moment (e.g. secret key + authenticated status)
    // NB: Legacy support complicates the situation at the moment but in a future KeeFox release we'll
    // probably create a more concrete representation for an existing connection so it's clearer
    // what we have to reset and what is just boilerplate around every connection
    resetConnection () {
        this.authenticated = false;
        this.srpClientInternals = null;
        this.secretKey = null;

        // Close the websocket connection if there is one (if it's already closed, nothing will happen)
        if (this.session.webSocket)
            this.session.webSocket.close();
    }

    // data = JSON (underlying network/transport layer must have already formed incoming message(s) into JSON objects)
    receive (data) {
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
                        KeeFoxLog.error($STR("conn_setup_client_features_missing") + " Extra info: " + extra);
                        keefox_org.appState.latestConnectionError = "VERSION_CLIENT_TOO_LOW";
                        this.showConnectionMessage($STR("conn_setup_client_features_missing"));
                    } else if (data.error.code == "UNRECOGNISED_PROTOCOL") {
                        KeeFoxLog.error($STR("conn_unknown_protocol") + " "
                            + $STRF("further_info_may_follow", extra));
                        keefox_org.appState.latestConnectionError = "UNRECOGNISED_PROTOCOL";
                    } else if (data.error.code == "INVALID_MESSAGE") {
                        KeeFoxLog.error($STR("conn_invalid_message") + " "
                            + $STRF("further_info_may_follow", extra));
                        keefox_org.appState.latestConnectionError = "INVALID_MESSAGE";
                    } else if (data.error.code == "AUTH_RESTART") {
                        KeeFoxLog.error($STR("conn_setup_restart") + " "
                            + $STRF("further_info_may_follow", extra));
                        keefox_org.appState.latestConnectionError = "AUTH_RESTART";
                        this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                        this.showConnectionMessage($STR("conn_setup_restart") + " "
                            + $STR("conn_setup_retype_password"));
                    } else {
                        KeeFoxLog.error($STR("conn_unknown_error") + " "
                            + $STRF("further_info_may_follow", extra));
                        keefox_org.appState.latestConnectionError = "UNKNOWN_JSONRPC";
                        this.showConnectionMessage($STR("conn_unknown_error") + " "
                            + $STRF("further_info_may_follow", ["See KeeFox log"]));
                    }
                }
                this.resetConnection();
                break;
            default: return;
        }

    }

    receiveSetup (data) {
        // double check
        if (data.protocol != "setup")
            return;

        if (this.authenticated) {
            KeeFoxLog.warn($STR("conn_setup_restart"));
            this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
            keefox_org.appState.latestConnectionError = "ALREADY_AUTHENTICATED";
            this.showConnectionMessage($STR("conn_setup_restart")
                + " " + $STR("conn_setup_retype_password"));
            this.resetConnection();
            return; // already authenticated so something went wrong. Do the full Auth process again to be safe.
        }

        if (data.error) {
            const extra = [];
            if (data.error.messageParams && data.error.messageParams.length >= 1)
                extra[0] = data.error.messageParams[0];
            switch (data.error.code) {
                case "AUTH_CLIENT_SECURITY_LEVEL_TOO_LOW": KeeFoxLog.warn($STR("conn_setup_client_sl_low"));
                    keefox_org.appState.latestConnectionError = "AUTH_CLIENT_SECURITY_LEVEL_TOO_LOW";
                    const button: Button = {
                        label: $STR("conn_setup_client_sl_low_resolution"),
                        action: "enableHighSecurityKPRPCConnection"
                    };
                    this.showConnectionMessage($STR("conn_setup_client_sl_low"), [button]);
                    break;
                case "AUTH_FAILED": KeeFoxLog.warn($STR("conn_setup_failed") + " "
                    + $STRF("further_info_may_follow", extra));
                    keefox_org.appState.latestConnectionError = "AUTH_FAILED";
                    this.showConnectionMessage($STR("conn_setup_failed")
                        + " " + $STR("conn_setup_retype_password"));
                    // There may be a stored key that has become corrupt through a change of security level, etc.
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    break;
                case "AUTH_RESTART": KeeFoxLog.warn($STR("conn_setup_restart") + " "
                    + $STRF("further_info_may_follow", extra));
                    keefox_org.appState.latestConnectionError = "AUTH_RESTART";
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    this.showConnectionMessage($STR("conn_setup_restart")
                        + " " + $STR("conn_setup_retype_password"));
                    break;
                case "AUTH_EXPIRED": KeeFoxLog.warn($STRF("conn_setup_expired", extra));
                    keefox_org.appState.latestConnectionError = "AUTH_EXPIRED";
                    this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                    this.showConnectionMessage($STR("conn_setup_expired")
                        + " " + $STR("conn_setup_retype_password"));
                    break;
                case "AUTH_INVALID_PARAM": KeeFoxLog.error($STRF("conn_setup_invalid_param", extra));
                    keefox_org.appState.latestConnectionError = "AUTH_INVALID_PARAM";
                    break;
                case "AUTH_MISSING_PARAM": KeeFoxLog.error($STRF("conn_setup_missing_param", extra));
                    keefox_org.appState.latestConnectionError = "AUTH_MISSING_PARAM";
                    break;
                default: KeeFoxLog.error($STR("conn_unknown_error") + " "
                    + $STRF("further_info_may_follow", extra));
                    keefox_org.appState.latestConnectionError = "UNKNOWN_SETUP";
                    this.showConnectionMessage($STR("conn_unknown_error") + " "
                        + $STRF("further_info_may_follow", ["See KeeFox log"]));
                    break;
            }
            this.resetConnection();
            return;
        }

        // Versions of KeePassRPC <= 1.6.x will reject connections (send an "error" property) from
        // KeeFox clients that are too new (like this one). For >= 1.7 it will only do so if it also
        // decides that this client does not support features essential for it to function.
        // Therefore if we've reached this far, we can check the server's list of features that get
        // sent back on the server's first handshake response and reject if the server is missing features we need.
        if (data.features && !FeatureFlags.required.every(function (feature) { return data.features.indexOf(feature) !== -1; }))
        {
            KeeFoxLog.error($STR("conn_setup_server_features_missing"));
            keefox_org.appState.latestConnectionError = "VERSION_CLIENT_TOO_HIGH";
            this.showConnectionMessage($STR("conn_setup_server_features_missing"));
            this.resetConnection();
            return;
        }

        FeatureFlags.received = data.features;

        // We use key authentication when we have a pre-agreed secret key
        if (data.key !== undefined && data.key !== null) {
            if (this.checkServerSecurityLevel(data.key.securityLevel)) {
                if (data.key.sc) {
                    this.keyChallengeResponse1(data);
                } else if (data.key.sr) {
                    this.keyChallengeResponse2(data);
                } else {

                }
            } else {
                KeeFoxLog.warn($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
                keefox_org.appState.latestConnectionError = "AUTH_SERVER_SECURITY_LEVEL_TOO_LOW";
                this.sendError("AUTH_SERVER_SECURITY_LEVEL_TOO_LOW", [this.getSecurityLevelServerMinimum()]);
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
                KeeFoxLog.warn($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
                keefox_org.appState.latestConnectionError = "AUTH_SERVER_SECURITY_LEVEL_TOO_LOW";
                this.sendError("AUTH_SERVER_SECURITY_LEVEL_TOO_LOW", [this.getSecurityLevelServerMinimum()]);
                this.showConnectionMessage($STRF("conn_setup_server_sl_low", [this.getSecurityLevelServerMinimum().toString()]));
            }
        }
    }

    sendError (errCode, errParams) {
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

        this.send(JSON.stringify(data2server));
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

            this.send(JSON.stringify(data2server));
        });
    }

    keyChallengeResponse2 (data) {
        utils.hash("0" + this.getStoredKey() + this.keyChallengeParams.sc + this.keyChallengeParams.cc).then(digest => {
            const sr = digest.toLowerCase();

            if (sr != data.key.sr) {
                KeeFoxLog.warn($STR("conn_setup_failed"));
                keefox_org.appState.latestConnectionError = "CHALLENGE_RESPONSE_MISMATCH";
                this.showConnectionMessage($STR("conn_setup_failed")
                    + " " + $STR("conn_setup_retype_password"));
                this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
                this.resetConnection();
                return;
            }
            else {
                // note down our agreed secret key somewhere that we can find it easily later
                this.secretKey = this.getStoredKey();

                // 0.025 second delay before we try to do the KeeFox connection startup stuff
                setTimeout(this.onConnectStartup, 50, "CR", this.onConnectStartup);
            }
        });
    }

    getSideChannelPassword (data) {

        // get the user to type in the one-time password

        const s = data.srp.s;
        const B = data.srp.B;
        const _this = this;

        function handleMessage (request, sender, sendResponse) {
            _this.identifyToClient(request.password, s, B);
            browser.runtime.onMessage.removeListener(handleMessage);
        }

        browser.runtime.onMessage.addListener(handleMessage);

        this.authPromptAborted = false;

        const createData = {
            type: "popup",
            url: "/dialogs/SRP.html",
            width: 700,
            height: 550
        };
        const creating = (browser as any).windows.create(createData);
    }

    identifyToClient (password, s, B) {
        this.srpClientInternals.p = password;
        this.srpClientInternals.receive_salts(s, B).then(() => {

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

            this.send(JSON.stringify(data2server));
        });
    }

    proofToClient (data) {
        this.srpClientInternals.confirm_authentication(data.srp.M2);

        if (!this.srpClientInternals.authenticated) {
            KeeFoxLog.warn($STR("conn_setup_failed"));
            keefox_org.appState.latestConnectionError = "SRP_AUTH_FAILURE";
            this.showConnectionMessage($STR("conn_setup_failed")
                + " " + $STR("conn_setup_retype_password"));
            this.removeStoredKey(this.getUsername(this.getSecurityLevel()));
            this.resetConnection();
            return;
        }
        else {
            // note down our agreed secret key somewhere that we can find it easily later
            this.srpClientInternals.key().then(key => {

                if (!key) return;

                this.secretKey = key;

                // store the key somewhere persistent (according to the security level rules)
                this.setStoredKey(this.srpClientInternals.I, this.getSecurityLevel(), key);

                // 0.025 second delay before we try to do the KeeFox connection startup stuff
                setTimeout(this.onConnectStartup, 50, "SRP", this.onConnectStartup);
            });
        }

    }

    onConnectStartup (type, thisFunction, timeout) {

        // if any errors were shown, they are now resolved
        keefox_org.removeUserNotifications((notification: KeeFoxNotification) => notification.name != "keefox-connection-message");
        keefox_org.appState.latestConnectionError = "";

        //TODO:c:tutorial, etc.
        //keefox_org._keeFoxExtension.prefs.setValue("lastConnectedToKeePass", ISO8601DateUtils.create(new Date()));
        keefox_org._refreshKPDB();
        keefox_org.getApplicationMetadata();
    }

    // No need to return anything from this function so sync or async implementation is fine
    receiveJSONRPC (data) {
        // async webcrypto:
        if (typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined") {
            this.decrypt(data.jsonrpc, this.receiveJSONRPCDecrypted);
            return;
        }
        throw new Error("Webcrypto required but disabled or broken");
    }

    receiveJSONRPCDecrypted (data) {

        if (data === null)
            return; // decryption failed; connection has been reset and user will re-enter password for fresh authentication credentials

        const obj = JSON.parse(data);

        // if we failed to parse an object from the JSON
        if (!obj)
            return;

        this.processJSONRPCresponse(obj);
    }

    processJSONRPCresponse (obj) {

        if ("result" in obj && obj.result !== false) {
            // quick hack test
            if (obj.result == null)
                return;

            try {
                if (this.callbacks[obj.id] != null)
                    this.callbacks[obj.id](obj, this.callbacksData[obj.id]);
                delete this.callbacks[obj.id];
                delete this.callbacksData[obj.id];
            } catch (e) {
                delete this.callbacks[obj.id];
                delete this.callbacksData[obj.id];
                KeeFoxLog.warn("An error occurred when processing the result callback for JSON-RPC object id " + obj.id + ": " + e);
            }
        } else if ("error" in obj) {
            try {
                KeeFoxLog.error("An error occurred in KeePassRPC object id: " + obj.id + " with this message: " + obj.message + " and this error: " + obj.error + " and this error message: " + obj.error.message);
                if (this.callbacks[obj.id] != null)
                    this.callbacks[obj.id](obj, this.callbacksData[obj.id]);
                delete this.callbacks[obj.id];
                delete this.callbacksData[obj.id];
            } catch (e) {
                delete this.callbacks[obj.id];
                delete this.callbacksData[obj.id];
                KeeFoxLog.warn("An error occurred when processing the error callback for JSON-RPC object id " + obj.id + ": " + e);
            }
        } else if ("method" in obj) {
            const result: any = { id: obj.id };

            try {
                result.result = this.evalJson(obj.method, obj.params);
                if (!result.result)
                    result.result = null;
            } catch (e) {
                result.error = e;
                KeeFoxLog.error("An error occurred when processing a JSON-RPC request: " + e);
            }
            // json rpc not specific about notifications, other than the fact
            // they do not have the id in the request.  do not respond to
            // notifications

            // not serving anything interesting from Firefox...
            //if ("id" in obj)
            //    session.writeData(JSON.stringify(result));
        } else {
            KeeFoxLog.error("Unexpected error processing receiveJSONRPC");
        }
    }


    setup () {
        // Sometimes things go wrong (e.g. user cancels master password
        // dialog box; maybe startup windows disappear)
        try {
            let setupKey = null;
            let setupSRP = null;


            //this.getSecurityLevelServerMinimum();

            //this.securityLevel = 3;
            //this.securityLevelServerMinimum = 3;
            const securityLevel = this.getSecurityLevel();

            const username = this.getUsername(securityLevel);

            // If we find a secure key already, lets send the unique username for this client instead of the srp object. Server will then enter challenge-response handshake phase
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
                    clientDisplayName: "KeeFox",
                    clientDisplayDescription: $STR("conn_display_description")
                };

            this.send(JSON.stringify(data2server));
        } catch (ex) {
            // Need to make sure that the underlying web socket connection has been
            // closed so we are able to retry the connection a bit later but we'll
            // enforce a little delay just in case the reason for the problem is
            // that the application startup is progressing very slowly for some other reason
            KeeFoxLog.warn("An attempt to setup the KPRPC secure channel has failed. It will not be retried for at least 10 seconds." +
                " If you see this message regularly and are not sure why, please ask on the help forum. Technical detail about the problem follows: " + ex);
            this.session.connectionProhibitedUntil = new Date();
            this.session.connectionProhibitedUntil.setTime(
                this.session.connectionProhibitedUntil.getTime() + 10000);
            this.resetConnection();
            KeeFoxLog.debug("Connection state reset ready for next attempt in at least 10 seconds");
        }

    }

    getUsername (securityLevel) {
        let username = "";

        // if we expect client to be able to retrieve a password from a stored location, we'll re-use the most recent username if we can find it. Otherwise we'll start from scratch
        if (securityLevel <= 2) {
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
        // read these from config. Local Firefox attacker could change config to a lower security level but in doing so, a new SRP auth will be triggered during which the server has opportunity
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

        KeeFoxLog.debug("starting webcrypto encryption");

        const KPRPC = this;
        const wc = crypto.subtle;
        const iv: any = crypto.getRandomValues(new Uint8Array(16));
        const secretKey = this.secretKey;
        const messageAB = utils.stringToByteArray(plaintext);

        // get our secret key
        const secretKeyAB = utils.hexStringToByteArray(secretKey);

        const typescriptHack = wc.importKey(
            "raw",                            // Exported key format
            secretKeyAB,                      // The exported key
            { name: "AES-CBC", length: 256 }, // Algorithm the key will be used with
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
                        KeeFoxLog.error("Failed to calculate HMAC. Exception: " + e);
                        callback(null);
                    });

            })
            .catch(function (e) {
                KeeFoxLog.error("Failed to encrypt. Exception: " + e);
                callback(null);
            });
    }

    // Decrypt incoming data from KeePassRPC using AES-CBC and a separate HMAC
    decrypt (encryptedContainer, callback) {
        KeeFoxLog.debug("starting webcrypto decryption");

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
        KeeFoxLog.debug("decryption stage 'data prep 1' took: " + (tn - t));
        t = tn;

        const typescriptHack4 = wc.digest({ name: "SHA-1" }, secretKeyAB) as Promise<ArrayBuffer>;
        typescriptHack4.then(function (secretkeyHash) {
            tn = (new Date()).getTime();
            KeeFoxLog.debug("decryption stage 'key hash' took: " + (tn - t));
            t = tn;

            // fill the hmacData bytearray with the rest of the data
            secretkeyHashAB.set(new Uint8Array(secretkeyHash));
            utils.base64toByteArrayForHMAC(iv, 0, ivAB);

            tn = (new Date()).getTime();
            KeeFoxLog.debug("decryption stage 'data prep 2' took: " + (tn - t));
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
            KeeFoxLog.debug("decryption stage 'generate HMAC' took: " + (tn - t));
            t = tn;

            if (ourHMAC == hmac) {
                const typescriptHack3 = wc.importKey(
                    "raw",                            // Exported key format
                    secretKeyAB,                      // The exported key
                    { name: "AES-CBC", length: 256 }, // Algorithm the key will be used with
                    true,                             // Can extract key value to binary string
                    ["encrypt", "decrypt"]            // Use for these operations
                ) as Promise<CryptoKey>;
                typescriptHack3.then(function (pwKey) {
                    tn = (new Date()).getTime();
                    KeeFoxLog.debug("decryption stage 'import key' took: " + (tn - t));
                    t = tn;
                    const alg = { name: "AES-CBC", iv: ivAB };
                    return wc.decrypt(alg, pwKey, messageAB);
                })
                    .then(function (decrypted) {
                        tn = (new Date()).getTime();
                        KeeFoxLog.debug("decryption stage 'aes-cbc' took: " + (tn - t));
                        t = tn;
                        const plainText = new TextDecoder("utf-8").decode(decrypted);
                        tn = (new Date()).getTime();
                        KeeFoxLog.debug("decryption stage 'utf-8 conversion' took: " + (tn - t));
                        t = tn;

                        const callbackTarget = function (func, data) {
                            func(data);
                        };

                        // Do the callback async because we don't want exceptions in
                        // JSONRPC handling being treated as connection errors
                        setTimeout(callbackTarget, 1, callback.bind(KPRPC), plainText);
                    })
                    .catch(function (e) {
                        KeeFoxLog.error("Failed to decrypt. Exception: " + e);

                        KeeFoxLog.warn($STR("conn_setup_restart"));
                        keefox_org.appState.latestConnectionError = "DECRYPTION_FAILED";
                        KPRPC.showConnectionMessage($STR("conn_setup_restart")
                            + " " + $STR("conn_setup_retype_password"));
                        KPRPC.removeStoredKey(KPRPC.getUsername(KPRPC.getSecurityLevel()));
                        KPRPC.resetConnection();
                        callback(null);
                    });
            }
        })
            .catch(function (e) {
                KeeFoxLog.error("Failed to hash secret key. Exception: " + e);

                KeeFoxLog.warn($STR("conn_setup_restart"));
                keefox_org.appState.latestConnectionError = "SECRET_KEY_HASH_FAILED";
                this.showConnectionMessage($STR("conn_setup_restart")
                    + " " + $STR("conn_setup_retype_password"));
                KPRPC.removeStoredKey(KPRPC.getUsername(KPRPC.getSecurityLevel()));
                KPRPC.resetConnection();
                callback(null);
            });
    }

    showConnectionMessage (msg: string, buttons?: Button[]) {
        keefox_org.notifyUser(new KeeFoxNotification(
            "keefox-connection-message", buttons ? buttons : [], utils.newGUID(), msg, "Medium", false));
    }

}
