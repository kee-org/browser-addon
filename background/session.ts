/*
session.js manages the low-level transport connection between this
client and an KeePassRPC server.
*/

/// <reference path="../common/Logger.ts" />
/// <reference path="../common/ConfigManager.ts" />

class Session {
    private reconnectionAttemptFrequency: number;
    private connectionTimeout: number;
    private activityTimeout: number;
    private connectLock: boolean;

    private webSocketPort: number;
    private webSocketHost: string;
    private webSocketURI: string;
    public webSocket: WebSocket;

    // We use a HTTP channel for basic polling of the port listening status of
    // the KPRPC server because it's quick and not subject to the rate limiting
    // of webSocket connections as per Firefox bug #711793 and RFC 7.2.3:
    // http://tools.ietf.org/html/rfc6455#section-7.2.3
    // See KeeFox issue #189 for connection algorithm overview:
    // https://github.com/luckyrat/KeeFox/issues/189#issuecomment-23635771
    private httpChannel;
    private httpChannelURI: string;
    private reconnectTimer;
    private onConnectDelayTimer;
    public connectionProhibitedUntil: Date;
    private speculativeWebSocketAttemptProhibitedUntil: Date;
    private webSocketTimer;
    private onOpen;
    private onMessage;

constructor (onOpen, onMessage)
{
    this.onOpen = onOpen;
    this.onMessage = onMessage;
    this.reconnectionAttemptFrequency = 2000;
    this.connectionTimeout = 10000; // short timeout for connections
    this.activityTimeout = 3600000; // long timeout for activity
    this.connectLock = false;       // protect the connect function so only one event
                                    // thread (e.g. timer) can execute it at the same time

    this.webSocketPort = 12546;
    this.webSocketHost = "127.0.0.1";
    this.webSocketURI = "ws://" + this.webSocketHost + ":" + this.webSocketPort;
    this.webSocket = null;

    // We use a HTTP channel for basic polling of the port listening status of
    // the KPRPC server because it's quick and not subject to the rate limiting
    // of webSocket connections as per Firefox bug #711793 and RFC 7.2.3:
    // http://tools.ietf.org/html/rfc6455#section-7.2.3
    // See KeeFox issue #189 for connection algorithm overview:
    // https://github.com/luckyrat/KeeFox/issues/189#issuecomment-23635771
    this.httpChannel = null;
    this.httpChannelURI = "http://" + this.webSocketHost + ":" + this.webSocketPort;
    this.reconnectTimer = null;
    this.onConnectDelayTimer = null;
    this.connectionProhibitedUntil = new Date(0);
    this.speculativeWebSocketAttemptProhibitedUntil = new Date(0);
}

startup () {
        const defaultWebSocketPort = 12546;
        this.webSocketPort = configManager.current.KeePassRPCWebSocketPort;

        // Don't allow user to select an invalid port
        if (this.webSocketPort <= 0 || this.webSocketPort > 65535
            || this.webSocketPort == 19455)
        {
            configManager.current.KeePassRPCWebSocketPort = defaultWebSocketPort;
            configManager.save();

            this.webSocketPort = defaultWebSocketPort;
        }
        this.webSocketURI = "ws://" + this.webSocketHost + ":" + this.webSocketPort;
        this.httpChannelURI = "http://" + this.webSocketHost + ":" + this.webSocketPort;

        // start regular attempts to reconnect to KeePassRPC
        // NB: overheads here include a test whether a socket is alive
        // and regular timer scheduling overheads - hopefully that's insignificant
        // but if not we can try more complicated connection strategies
        this.reconnectSoon();
}
    // It would be neater to pause this timer when we know we are connected
    // but the overhead is so minimal (and so essential in most cases - i.e.
    // all times when the user does not have KeePass open) that we just
    // leave it running to avoid complications that would come from trying
    // to synchronise the state of the timer with the connection state.
    //TODO:c:review above - should be doable now
    reconnectSoon ()
    {
        KeeFoxLog.debug("Creating a reconnection timer.");
         // Create a timer
         this.reconnectTimer = window.setInterval(this.attemptConnection.bind(this), this.reconnectionAttemptFrequency);
    }

    tryToconnectToWebsocket () {
        KeeFoxLog.debug("Attempting to connect to RPC server webSocket.");
        const connectResult = this.connect();
        if (connectResult == "alive")
            KeeFoxLog.debug("Connection already established.");
        if (connectResult == "locked")
            KeeFoxLog.debug("Connection attempt already underway.");
    }

    httpConnectionAttemptCallback () {
        // We can't try to connect straight away because the old HTTP ephemeral
        // TCP port is still hanging around during this onClose callback and on some
        // machines, ephemeral ports flout IANA guidelines including using
        // KeePassRPC's TCP port. If we tried to connect now, we risk connecting
        // back to Firefox and causing a deadlock. A small delay gives Firefox
        // a chance to cleanly close the old port
        this.webSocketTimer = window.setTimeout(this.tryToconnectToWebsocket.bind(this), 50);
    }

    // Initiates a connection to the KPRPC server.
    connect ()
    {
        // closure for websocket event callbacks
        const _this = this;

        if (this.connectLock)
            return "locked";
        if (this.webSocket !== undefined && this.webSocket !== null && this.webSocket.readyState != 3)
            return "alive";
        if (this.connectionProhibitedUntil.getTime() > (new Date()).getTime())
            return "locked";

        KeeFoxLog.debug("Trying to open a webSocket connection");

        this.connectLock = true;
        try
        {
            this.webSocket = new WebSocket(this.webSocketURI);
        } catch (ex)
        {
            // This shouldn't happen much - most errors will be caught in the onerror function below
            this.connectLock = false;
            return;
        }

        this.webSocket.onopen = function (event) {
            KeeFoxLog.info("Websocket connection opened");

            _this.connectLock = false;

            // Start the SRP or shared key negotiation
            _this.onOpen();
        };
        this.webSocket.onmessage = function (event) {
            KeeFoxLog.debug("received message from web socket");

            const obj = JSON.parse(event.data);

            // if we failed to parse an object from the JSON
            if (!obj)
            {
                KeeFoxLog.error("received bad message from web socket. Can't parse from JSON.");
                return;
            }
            _this.onMessage(obj);
        };
        this.webSocket.onerror = function (event) {
            KeeFoxLog.debug("Websocket connection error");

            _this.connectLock = false;

            // webSocket spec says that we can't know why there was an error
            KeeFoxLog.debug("Websocket connection error end");
        };
        this.webSocket.onclose = function (event) {
            keefox_org._pauseKeeFox();
            KeeFoxLog.debug("Websocket connection closed");
        };

    }

    attemptConnection () {
        const rpc = this;

        // Check we are allowed to connect
        if (rpc.connectionProhibitedUntil.getTime() > (new Date()).getTime())
            return;

        // Check we're not in the middle of trying to connect to the websocket
        if (rpc.connectLock)
            return;

        // Check current websocket connection state. No point in trying
        // if we know we're already successfully connected
        if (rpc.webSocket !== undefined && rpc.webSocket !== null && rpc.webSocket.readyState != 3)
            return;

        // Every 73 seconds we can try to connect to the WebSocket directly.
        // This allows for the 60 second web socket connection block timeout,
        // a 10 second connection timeout, 1 second for the extra delay introduced
        // by the web socket connection block and 2 seconds for luck (we really
        // don't want this to have any chance of affecting the normal situation
        // 99.9% of users will be in).
        if ((new Date()).getTime() > rpc.speculativeWebSocketAttemptProhibitedUntil.getTime())
        {
            KeeFoxLog.debug("Speculatively trying to open a webSocket connection");
            rpc.speculativeWebSocketAttemptProhibitedUntil = new Date();
            rpc.speculativeWebSocketAttemptProhibitedUntil.setTime(
                rpc.speculativeWebSocketAttemptProhibitedUntil.getTime() + 73000);
            rpc.httpConnectionAttemptCallback();
        } else
        {
            // closure for http event callbacks
            const _this = this;

            const xhr = new XMLHttpRequest();

            xhr.open("GET", rpc.httpChannelURI, true);
            xhr.timeout = 750;
            xhr.onerror = function () {
                // an error indicates that KeePass is running (or that it is at least worth attempting a precious websocket connection)
                KeeFoxLog.debug("HTTP connection did not timeout. We will now attempt a web socket connection.");
                rpc.httpConnectionAttemptCallback();
            };
            xhr.ontimeout = function () {
                // a timeout indicates that KeePass is not running
                KeeFoxLog.debug("HTTP connection timed out. Will not attempt web socket connection.");
            };
            xhr.onabort = function (x) {
                KeeFoxLog.warn("HTTP connection aborted. Will not attempt web socket connection.");
            };

            // Try to connect
            // There may be more than one concurrent attempted connection.
            // If more than one attempted connection returns a timeout,
            // we will see a batch of "alive" or "locked" states for subsequent callbacks
            // That should be fine but we could implement a more complex request ID
            // tracking system in future if it becomes a problem
            xhr.send();
        }
    }
}
