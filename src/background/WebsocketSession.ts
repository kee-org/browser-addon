import type { ResultWrapper } from "./kprpcClient";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";

/*
WebsocketSessionManager.js manages the low-level websocket connection between this
client and an KeePassRPC server.
*/

export class WebsocketSessionManager {
    private reconnectionAttemptFrequency: number;
    private connectLock: boolean;
    private wasEverOpen: boolean;

    private webSocketPort: number;
    private webSocketHost: string;
    private webSocketURI: string;
    public webSocket: WebSocket;

    // We use a HTTP channel for basic polling of the port listening status of
    // the KPRPC server because it's quick and not subject to the rate limiting
    // of webSocket connections as per Firefox bug #711793 and RFC 7.2.3:
    // http://tools.ietf.org/html/rfc6455#section-7.2.3
    private httpChannelURI: string;
    private _reconnectTimer;
    public connectionProhibitedUntil: Date;
    private speculativeWebSocketAttemptProhibitedUntil: Date;
    private _webSocketTimer;
    private onOpening;
    private onOpen;
    private onClose;
    private onMessage;
    private isKPRPCAuthorised: () => boolean;
    private pendingPortChange;
    private _features: string[] = [];

    private callbacks: Record<string, (resultWrapper: Partial<ResultWrapper>) => void>;

    public isActive() {
        return (
            this.webSocket !== undefined &&
            this.webSocket !== null &&
            this.webSocket.readyState == WebSocket.OPEN &&
            this.isKPRPCAuthorised()
        );
    }

    public features() {
        return this.isActive() ? this._features : [];
    }

    public setClaimedFeatures(features) {
        this._features = features;
    }

    public registerCallback(
        requestId: number,
        callback: (resultWrapper: Partial<ResultWrapper>) => void
    ) {
        this.callbacks[requestId] = callback;
    }

    public invokeCallback(requestId: number, resultWrapper: Partial<ResultWrapper>) {
        if (this.callbacks[requestId] != null) this.callbacks[requestId](resultWrapper);
    }

    public unregisterCallback(requestId: number) {
        delete this.callbacks[requestId];
    }

    constructor(onOpening, onOpen, onClose, onMessage, isKPRPCAuthorised) {
        this.onOpening = onOpening;
        this.onOpen = onOpen;
        this.onClose = onClose;
        this.onMessage = onMessage;
        this.isKPRPCAuthorised = isKPRPCAuthorised;
        this.reconnectionAttemptFrequency = 2000;
        this.connectLock = false; // protect the connect function so only one event thread (e.g. timer) can execute it at the same time
        this.wasEverOpen = false; // Allows us to only do cleanup when required

        this.webSocketHost = "127.0.0.1";
        this.webSocket = null;

        // We use a HTTP channel for basic polling of the port listening status of
        // the KPRPC server because it's quick and not subject to the rate limiting
        // of webSocket connections as per Firefox bug #711793 and RFC 7.2.3:
        // http://tools.ietf.org/html/rfc6455#section-7.2.3
        // See KeeFox issue #189 for connection algorithm overview:
        // https://github.com/luckyrat/KeeFox/issues/189#issuecomment-23635771
        this._reconnectTimer = null;
        this.connectionProhibitedUntil = new Date(0);
        this.speculativeWebSocketAttemptProhibitedUntil = new Date(0);

        this.callbacks = {};
    }

    startup() {
        this.pendingPortChange = null;
        chrome.runtime.onMessage.addListener(request => {
            if (request.action !== "KPRPC_Port_Change") return;
            if (this.pendingPortChange != null) {
                clearTimeout(this.pendingPortChange);
            }
            this.pendingPortChange = self.setTimeout(() => {
                this.configureConnectionURIs();
                if (
                    this.webSocket !== undefined &&
                    this.webSocket !== null &&
                    this.webSocket.readyState != WebSocket.CLOSED
                ) {
                    this.webSocket.close();
                }
            }, 1000);
        });

        this.configureConnectionURIs();

        // start regular attempts to reconnect to KeePassRPC
        // NB: overheads here include a HTTP GET request
        // and regular timer scheduling overheads - hopefully that's insignificant
        // but if not we can try more complicated connection strategies
        this._reconnectTimer = setInterval(
            this.attemptConnection.bind(this),
            this.reconnectionAttemptFrequency
        );
        KeeLog.debug("Created an HTTP/ws reconnection timer.");
    }

    configureConnectionURIs() {
        const defaultWebSocketPort = 12546;
        this.webSocketPort = configManager.current.KeePassRPCWebSocketPort;

        // Don't allow user to select an invalid port
        if (this.webSocketPort <= 0 || this.webSocketPort > 65535 || this.webSocketPort == 19455) {
            configManager.current.KeePassRPCWebSocketPort = defaultWebSocketPort;
            configManager.save();

            this.webSocketPort = defaultWebSocketPort;
        }
        this.webSocketURI = "ws://" + this.webSocketHost + ":" + this.webSocketPort;
        this.httpChannelURI = "http://" + this.webSocketHost + ":" + this.webSocketPort + "/pingAvailabilityTest";
    }

    tryToconnectToWebsocket() {
        KeeLog.debug("Attempting to connect to RPC server webSocket.");
        const connectResult = this.connect();
        if (connectResult == "alive") KeeLog.debug("Connection already established.");
        if (connectResult == "locked") KeeLog.debug("Connection attempt already underway.");
    }

    httpConnectionAttemptCallback() {
        // We can't try to connect straight away because the old HTTP ephemeral
        // TCP port is still hanging around during this onClose callback and on some
        // machines, ephemeral ports flout IANA guidelines including using
        // KeePassRPC's TCP port. If we tried to connect now, we risk connecting
        // back to the browser and causing a deadlock. A small delay gives the browser
        // a chance to cleanly close the old port
        this._webSocketTimer = self.setTimeout(this.tryToconnectToWebsocket.bind(this), 100);
    }

    // Initiates a connection to the KPRPC server.
    connect() {
        // closure for websocket event callbacks
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this = this;

        if (this.connectLock) return "locked";
        if (
            this.webSocket !== undefined &&
            this.webSocket !== null &&
            this.webSocket.readyState == WebSocket.OPEN
        ) {
            return "alive";
        }
        if (this.connectionProhibitedUntil.getTime() > new Date().getTime()) return "locked";
        if (!this.onOpening()) return "locked";

        KeeLog.debug("Trying to open a webSocket connection");

        this.connectLock = true;
        this.wasEverOpen = false;
        try {
            this.webSocket = new WebSocket(this.webSocketURI);
        } catch (ex) {
            // This shouldn't happen much - most errors will be caught in the onerror function below
            this.connectLock = false;
            return;
        }

        this.webSocket.onopen = function () {
            KeeLog.info("Websocket connection opened");

            _this.connectLock = false;
            _this.wasEverOpen = true;

            // Start the SRP or shared key negotiation
            _this.onOpen();
        };
        this.webSocket.onmessage = function (event) {
            KeeLog.debug("received message from web socket");

            const obj = JSON.parse(event.data);

            // if we failed to parse an object from the JSON
            if (!obj) {
                KeeLog.error("received bad message from web socket. Can't parse from JSON.");
                return;
            }
            _this.onMessage(obj);
        };
        this.webSocket.onerror = function () {
            if (_this.wasEverOpen) {
                // webSocket spec says that we can't know why there was an error
                KeeLog.debug("Websocket connection error");
            }
            _this.connectLock = false;
        };
        this.webSocket.onclose = function () {
            if (_this.wasEverOpen) {
                _this.wasEverOpen = false;
                _this.onCloseSession();
                KeeLog.debug("Websocket connection closed");
            }
        };
    }

    closeSession() {
        // Close the websocket connection if there is one (if it's already closed, nothing will happen)
        if (this.webSocket) this.webSocket.close();
    }

    onCloseSession() {
        this.callbacks = {};
        this.onClose();
    }

    async attemptConnection() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const rpc = this;

        // Check we're not in the middle of trying to connect to the websocket
        if (rpc.connectLock) return;

        // Check current websocket connection state. No point in trying
        // if we know we're already successfully connected
        if (
            rpc.webSocket !== undefined &&
            rpc.webSocket !== null &&
            rpc.webSocket.readyState != WebSocket.CLOSED
        ) {
            return;
        }

        // Check we are allowed to connect
        if (rpc.connectionProhibitedUntil.getTime() > new Date().getTime()) return;

        // Every 73 seconds we can try to connect to the WebSocket directly.
        // This allows for the 60 second web socket connection block timeout,
        // a 10 second connection timeout, 1 second for the extra delay introduced
        // by the web socket connection block and 2 seconds for luck (we really
        // don't want this to have any chance of affecting the normal situation
        // 99.9% of users will be in).
        if (new Date().getTime() > rpc.speculativeWebSocketAttemptProhibitedUntil.getTime()) {
            KeeLog.debug("Speculatively trying to open a webSocket connection");
            rpc.speculativeWebSocketAttemptProhibitedUntil = new Date();
            rpc.speculativeWebSocketAttemptProhibitedUntil.setTime(
                rpc.speculativeWebSocketAttemptProhibitedUntil.getTime() + 73000
            );
            rpc.httpConnectionAttemptCallback();
        } else {
            try {
                const httpResponse = await fetch(rpc.httpChannelURI);
                if (httpResponse.status == 404) {
                    // Since KeePassRPC.plgx 2.0 we return a 404 iff a request targets the
                    // special ping path - /pingAvailabilityTest - earlier versions of Kee
                    // will experience no behaviour change but if someone fails to upgrade
                    // KeePassRPC they may experience slower connection startup, if they
                    // are not already afflicted by the increasingly common changes to
                    // networking stacks in operating systems and browser network layers
                    // which have gradually invalidated our earlier connection establishment protocol.

                    KeeLog.debug("HTTP request succeeded, attempting web socket connection");
                    rpc.httpConnectionAttemptCallback();
                } else {
                    KeeLog.warn("HTTP request got unexpected response code. Another service is listening on KPRPC port?");
                }
            } catch (error) {
                KeeLog.debug(`HTTP request failed: ${error.message} (${error.status} ${error.statusText}), not attempting web socket connection`);
            }
        }
    }

    sendMessage(data) {
        try {
            this.webSocket.send(data);
        } catch (ex) {
            KeeLog.error(
                "Failed to send a websocket message. Exception details: " +
                ex +
                ", stack: " +
                ex.stack
            );
        }
    }
}
