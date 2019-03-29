/// <reference path="commands.ts" />
/// <reference path="backgroundUtils.ts" />
/// <reference path="PersistentTabState.ts" />
/// <reference path="AccountManager.ts" />
/// <reference path="ConfigSyncManager.ts" />

class Kee {
    accountManager: AccountManager;
    appState: AppState;
    tabStates: Map<number, TabState>;
    persistentTabStates: Map<number, PersistentTabState>;
    utils: Utils;
    search: Search;
    foregroundTabId: number;

    regularKPRPCListenerQueueHandlerTimer: number;
    currentSearchTermTimer: number;

    // Our link to the JSON-RPC objects required for communication with KeePass
    KeePassRPC: jsonrpcClient;
    configSyncManager = new ConfigSyncManager();

    _installerTabLoaded: boolean;

    processingCallback: boolean;
    pendingCallback: string;
    urlToOpenOnStartup: string;

    browserPopupPort: Partial<browser.runtime.Port>;
    vaultPort: Partial<browser.runtime.Port>;
    onPortConnected: any;

    networkAuth: NetworkAuth;

    constructor ()
    {
        this.accountManager = new AccountManager();

        this.appState = {
            latestConnectionError: "",
            lastKeePassRPCRefresh: 0,
            ActiveKeePassDatabaseIndex: -1,
            KeePassDatabases: [],
            PasswordProfiles: [],
            notifications: [],
            connected: false,
            currentSearchTerm: null
        };

        this.tabStates = new Map<number, TabState>();
        this.persistentTabStates = new Map<number, PersistentTabState>();

        this.foregroundTabId = -1;

        this.utils = utils;

        this.search = new Search(this.appState, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs
        });

        this.networkAuth = new NetworkAuth();

        this.browserPopupPort = {postMessage: msg => {} };
        this.vaultPort = {postMessage: msg => {} };
        this.onPortConnected = function (p: browser.runtime.Port) {
            if (KeeLog && KeeLog.debug) KeeLog.debug(p.name + " port connected");
            let name = p.name;
            let parentFrameId: number;
            if (name.startsWith("iframe")) {
                parentFrameId = parseInt(name.substr(7));
                name = "iframe";
            }
            switch (name) {
                case "browserPopup": {
                    p.onMessage.addListener(browserPopupMessageHandler);

                    const connectMessage = {
                        appState: kee.appState
                    } as AddonMessage;

                    if (kee.persistentTabStates.get(kee.foregroundTabId)) {
                        kee.persistentTabStates.get(kee.foregroundTabId).items.forEach(item => {
                            if (item.itemType === "submittedData") {
                                connectMessage.submittedData = item.submittedData;
                                item.accessCount++;
                            }
                        });
                    }

                    if (kee.tabStates.has(kee.foregroundTabId)
                        && kee.frameIdWithMatchedLogins(kee.tabStates.get(kee.foregroundTabId).frames) >= 0) {
                        connectMessage.loginsFound = true;
                    }

                    p.postMessage(connectMessage);
                    kee.browserPopupPort = p;
                    kee.resetBrowserActionColor();
                    break;
                }
                case "page": {
                    p.onMessage.addListener(pageMessageHandler.bind(p));

                    const connectMessage = {
                        appState: kee.appState,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === kee.foregroundTabId
                    } as AddonMessage;

                    kee.createTabStateIfMissing(p.sender.tab.id);

                    if (p.sender.frameId === 0) {
                        kee.tabStates.get(p.sender.tab.id).url = p.sender.tab.url;
                    }
                    kee.tabStates.get(p.sender.tab.id).frames.set(p.sender.frameId, new FrameState());
                    kee.tabStates.get(p.sender.tab.id).framePorts.set(p.sender.frameId, p);
                    p.postMessage(connectMessage);
                    break;
                }
                case "vault": {
                    p.onMessage.addListener(vaultMessageHandler.bind(p));
                    /* Potentially could/should call messageCloseSession() when the port is disconnected but
                     earlier experience suggests disconnection does not occur before a new port is connected in Firefox due to a
                     bug (works fine in Chrome) so we would risk closing the freshly opened session instead.
                    p.onDisconnect.addListener(this.messageCloseSession();)
                    */

                    const connectMessage = {
                        appState: kee.appState,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === kee.foregroundTabId
                    } as VaultMessage;

                    kee.vaultPort = p;
                    p.postMessage(connectMessage);
                    break;
                }
                case "iframe": {
                    p.onMessage.addListener(iframeMessageHandler.bind(p));

                    const connectMessage = {
                        appState: kee.appState,
                        frameState: kee.tabStates.get(p.sender.tab.id).frames.get(parentFrameId),
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === kee.foregroundTabId
                    } as AddonMessage;

                    if (kee.persistentTabStates.get(p.sender.tab.id)) {
                        kee.persistentTabStates.get(p.sender.tab.id).items.forEach(item => {
                            if (item.itemType === "submittedData") {
                                connectMessage.submittedData = item.submittedData;
                            }
                        });
                    }

                    p.postMessage(connectMessage);
                    kee.tabStates.get(p.sender.tab.id).ourIframePorts.set(p.sender.frameId, p);
                    break;
                }
            }
        };

    }

    frameIdWithMatchedLogins (frames: Map<number, FrameState>) {
        let frameId = -1;
        frames.forEach((frame, i) => {
            if (frameId == -1 && frame && frame.logins && frame.logins.length > 0) frameId = i;
        });
        return frameId;
    }

    async init () {

        // Create a timer for checking whether user is logging sensitive data
        setTimeout(backgroundUtils.oneOffSensitiveLogCheckHandler, 45000);

        // Create a timer for KPRPC connection establishment
        this.regularKPRPCListenerQueueHandlerTimer = setInterval(this.RegularKPRPCListenerQueueHandler, 5000);

        this._keeBrowserStartup();

        // This listener is called when a new account is logged in to within Kee Vault. It
        // does not require an active KPRPC event session for delivery
        this.accountManager.addListener(() => {
            // If there is a vault port available but no active session, we poke the content script to
            // reinitialise the connection if it now looks likely that it will succeed (as a result of
            // a new account being logged in to which has the required multi-session feature).
            // We don't bother with the WebSocket equivalent because that will automatically be tried
            // regularly anyway.
            // We also don't worry about kicking people off from active sessions if their license expires.
            if (this.accountManager.fe_multiSessionTypes && !this.KeePassRPC.eventSessionManagerIsActive) {
                this.inviteKeeVaultConnection();
            }
        });

        browser.runtime.onConnect.addListener(this.onPortConnected);

        this.networkAuth.startListening();

        await browser.privacy.services.passwordSavingEnabled.set({ value: false });

        if (browser.runtime.lastError != null) {
            KeeLog.warn("KeeFox was unable to disable built-in password manager saving - confusion may ensue! " + browser.runtime.lastError.message);
        }

    }

    notifyUser (notification: KeeNotification, nativeNotification?: NativeNotification) {
        if (!notification.allowMultiple) {
            kee.removeUserNotifications((n: KeeNotification) => n.name != notification.name);
        }
        kee.appState.notifications.push(notification);
        try { kee.browserPopupPort.postMessage({appState: kee.appState}); } catch (e) {}
        browser.browserAction.setIcon({path: "common/images/highlight-48.png" });
        if (nativeNotification) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("common/images/128.png"),
                title: nativeNotification.title,
                message: nativeNotification.message
            });
        } else {
            if (configManager.current.notificationCountGeneric < 5) {
                browser.notifications.create({
                    type: "basic",
                    iconUrl: browser.extension.getURL("common/images/128.png"),
                    title: $STR("notification_raised_title"),
                    message: $STR("notification_yellow_background") + "\n" + $STR("notification_only_shown_some_times")
                });
                configManager.setASAP({notificationCountGeneric: configManager.current.notificationCountGeneric+1});
            }
        }
    }

    removeUserNotifications (unlessTrue: (notification: KeeNotification) => boolean) {
        kee.appState.notifications = kee.appState.notifications.filter(unlessTrue);
        try { kee.browserPopupPort.postMessage({appState: kee.appState}); } catch (e) {}
    }

    resetBrowserActionColor () {
        browser.browserAction.setIcon({path: "common/images/48.png" });
    }

    shutdown ()
    {
        // These log messages never appear. Does this function even get executed?
        KeeLog.debug("Kee module shutting down...");
        // if (this.KeePassRPC != undefined && this.KeePassRPC != null)
        //     this.KeePassRPC..session.shutdown();
        // if (this.regularKPRPCListenerQueueHandlerTimer != undefined && this.regularKPRPCListenerQueueHandlerTimer != null)
        //     clearInterval(this.regularKPRPCListenerQueueHandlerTimer);
        // this.KeePassRPC = null;

        KeeLog.debug("Kee module shut down.");
        KeeLog = null;
    }

    _keeBrowserStartup ()
    {
        KeeLog.debug("Kee initialising");
        this.KeePassRPC = new jsonrpcClient();
        KeeLog.info("Kee initialised OK although the connection to a KeePassRPC server is probably not established just yet...");
    }

    // Temporarilly disable Kee. Used (for e.g.) when KeePass is shut down.
    _pauseKee ()
    {
        KeeLog.debug("Pausing Kee.");
        this.appState.KeePassDatabases = [];
        this.appState.ActiveKeePassDatabaseIndex = -1;
        this.appState.connected = false;

        try { kee.browserPopupPort.postMessage({appState: this.appState}); } catch (e) {}
        try
        {
            // Poke every port. In future might just limit to active tab?
            kee.tabStates.forEach((ts, tabId) => {
                ts.framePorts.forEach((port, key, map) => {
                    try {
                        port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
                    } catch (e) {
                        if (KeeLog && KeeLog.info) {
                            KeeLog.info("failed to _pauseKee on tab " + tabId +
                            ". Assuming port is broken (possible browser bug) and deleting the port. " +
                            "Kee may no longer work in the affected tab, if indeed the tab even " +
                            "exists any more. The exception that caused this is: " + e.message + " : " + e.stack);
                        }
                        map.delete(key);
                    }
                }, this);
            }, this);
        }
        catch (e)
        {
            KeeLog.error("Uncaught exception posting message in _pauseKee: " + e.message + " : " + e.stack);
        }

        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        commandManager.setupContextMenuItems();

        KeeLog.info("Kee paused.");
    }

    _refreshKPDB ()
    {
        this.getAllDatabases();
        KeeLog.debug("Refresh of Kee's view of the KeePass database initiated.");
    }

    inviteKeeVaultConnection ()
    {
        if (this.vaultPort) {
            this.vaultPort.postMessage({protocol: VaultProtocol.Reconnect} as VaultMessage);
        }
    }

    updateKeePassDatabases (newDatabases: Database[])
    {
        let newDatabaseActiveIndex = -1;
        for (let i=0; i < newDatabases.length; i++)
        {
            if (newDatabases[i].active)
            {
                newDatabaseActiveIndex = i;
                break;
            }
        }
        this.appState.connected = true;
        this.appState.KeePassDatabases = newDatabases;
        this.appState.ActiveKeePassDatabaseIndex = newDatabaseActiveIndex;

        KeeLog.info("Number of databases open: " + newDatabases.length);

        if (newDatabases.length > 0) {
            browser.browserAction.setBadgeText({ text: "" });
            browser.browserAction.setBadgeBackgroundColor({ color: "blue" });
        } else {
            browser.browserAction.setBadgeText({ text: "OFF" });
            browser.browserAction.setBadgeBackgroundColor({ color: "orange" });
        }

        if (configManager.current.rememberMRUDB)
        {
            const MRUFN = this.getDatabaseFileName();
            if (MRUFN != null && MRUFN != undefined)
                configManager.current.keePassMRUDB = MRUFN;
                configManager.save();
        }

        try { kee.browserPopupPort.postMessage({appState: this.appState}); } catch (e) {}
        try
        {
            // Poke every port. In future might just limit to active tab?
            kee.tabStates.forEach((ts, tabId) => {
                ts.framePorts.forEach((port, key, map) => {
                    try {
                        port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
                    } catch (e) {
                        if (KeeLog && KeeLog.info) {
                            KeeLog.info("failed to updateKeePassDatabases on tab " + tabId +
                            ". Assuming port is broken (possible browser bug) and deleting the port. " +
                            "Kee may no longer work in the affected tab, if indeed the tab even " +
                            "exists any more. The exception that caused this is: " + e.message + " : " + e.stack);
                        }
                        map.delete(key);
                    }
                }, this);
            }, this);
        }
        catch (e)
        {
            KeeLog.error("Uncaught exception posting message in updateKeePassDatabases: " + e.message + " : " + e.stack);
        }

        commandManager.setupContextMenuItems();
    }

    // if the MRU database is known, open that but otherwise send empty string which will cause user
    // to be prompted to choose a DB to open
    loginToKeePass ()
    {
        let databaseFileName = configManager.current.keePassDBToOpen;
        if (databaseFileName == "")
            databaseFileName = configManager.current.keePassMRUDB;

        this.changeDatabase(databaseFileName, true);
    }

    /*******************************************
    / These functions are essentially wrappers for the actions that
    / Kee needs to take against KeePass via the KeePassRPC plugin connection.
    /*******************************************/

    getDatabaseName (index)
    {
        if (index == undefined)
            index = this.appState.ActiveKeePassDatabaseIndex;
        if (this.appState.KeePassDatabases.length > 0
            && this.appState.KeePassDatabases[index] != null
            && this.appState.KeePassDatabases[index].root != null)
            return this.appState.KeePassDatabases[index].name;
        else
            return null;
    }

    getDatabaseFileName (index?)
    {
        if (index == undefined)
            index = this.appState.ActiveKeePassDatabaseIndex;
        if (this.appState.KeePassDatabases.length > 0
            && this.appState.KeePassDatabases[index] != null
            && this.appState.KeePassDatabases[index].root != null)
            return this.appState.KeePassDatabases[index].fileName;
        else
            return null;
    }

    changeDatabase (fileName, closeCurrent)
    {
        try
        {
            this.KeePassRPC.changeDB(fileName, closeCurrent);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    addLogin (login, parentUUID, dbFileName)
    {
        try
        {
            return this.KeePassRPC.addLogin(login, parentUUID, dbFileName);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    updateLogin (login, oldLoginUUID, urlMergeMode, dbFileName)
    {
        try
        {
            return this.KeePassRPC.updateLogin(login, oldLoginUUID, urlMergeMode, dbFileName);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    getAllDatabases ()
    {
        try
        {
            return this.KeePassRPC.getAllDatabases();
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    findLogins (fullURL, formSubmitURL, httpRealm, uniqueID, dbFileName, freeText, username, callback)
    {
        try
        {
            return this.KeePassRPC.findLogins(fullURL, formSubmitURL, httpRealm, uniqueID, dbFileName, freeText, username, callback);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    launchLoginEditor (uuid, dbFileName)
    {
        try
        {
            this.KeePassRPC.launchLoginEditor(uuid, dbFileName);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    launchGroupEditor (uuid, dbFileName)
    {
        try
        {
            this.KeePassRPC.launchGroupEditor(uuid, dbFileName);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    getPasswordProfiles (callback: (profiles: PasswordProfile[]) => void)
    {
        try
        {
            return this.KeePassRPC.getPasswordProfiles(callback);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    generatePassword (profileName, url, callback)
    {
        try
        {
            return this.KeePassRPC.generatePassword(profileName, url, callback);
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    // Could use multiple callback functions but just one keeps KeePassRPC simpler
    // this is only called once no matter how many windows are open. so functions
    // within need to handle all open windows for now, that just means every
    // window although in future maybe there could be a need to store a list of
    // relevant windows and call those instead
    KPRPCListener (sig)
    {
        const sigTime = Date();

        KeeLog.debug("Signal received by KPRPCListener (" + sig + ") @" + sigTime);

        let executeNow = false;
        let refresh = false;

        switch (sig) {
            case "0": KeeLog.warn("KeePassRPC is requesting authentication [deprecated]."); break;
            case "3": KeeLog.info("KeePass' currently active DB is about to be opened."); break;
            case "4": KeeLog.info("KeePass' currently active DB has just been opened.");
                refresh = true;
                break;
            case "5": KeeLog.info("KeePass' currently active DB is about to be closed."); break;
            case "6": KeeLog.info("KeePass' currently active DB has just been closed.");
                refresh = true;
                break;
            case "7": KeeLog.info("KeePass' currently active DB is about to be saved."); break;
            case "8": KeeLog.info("KeePass' currently active DB has just been saved.");
                refresh = true;
                break;
            case "9": KeeLog.info("KeePass' currently active DB is about to be deleted."); break;
            case "10": KeeLog.info("KeePass' currently active DB has just been deleted."); break;
            case "11": KeeLog.info("KeePass' active DB has been changed/selected.");
                refresh = true;
                break;
            case "12": KeeLog.info("KeePass is shutting down. [deprecated: Now inferred from connection loss]"); break;
            default: KeeLog.error("Invalid signal received by KPRPCListener (" + sig + ")"); break;
        }

        if (!refresh) return;

        const now = (new Date()).getTime();

        // If there is nothing in the queue at the moment we can process this callback straight away
        if (!kee.processingCallback && kee.pendingCallback == "")
        {
            KeeLog.debug("Signal executing now. @" + sigTime);
            kee.processingCallback = true;
            executeNow = true;
        }
        // Otherwise we need to add the action for this callback to a queue and leave it up to the regular callback processor to execute the action

        if (refresh)
        {
            if (executeNow) { kee.appState.lastKeePassRPCRefresh = now; kee._refreshKPDB(); } else kee.pendingCallback = "_refreshKPDB";
        }

        KeeLog.debug("Signal handled or queued. @" + sigTime);
        if (executeNow)
        {
            //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
            try {
                if (kee.pendingCallback=="_refreshKPDB")
                    kee._refreshKPDB();
                else
                    KeeLog.debug("A pending signal was found and handled.");
            } finally {
                kee.pendingCallback = "";
                kee.processingCallback = false;
            }
            KeeLog.debug("Signal handled. @" + sigTime);
        }
    }

    RegularKPRPCListenerQueueHandler ()
    {
        // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
        if (kee.processingCallback || kee.pendingCallback == "")
            return;

        KeeLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
        kee.processingCallback = true;
        try {
            if (kee.pendingCallback=="_refreshKPDB")
                kee._refreshKPDB();
        } finally
        {
            kee.pendingCallback = "";
            kee.processingCallback = false;
        }
        KeeLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
    }

    createTabStateIfMissing (tabId: number) {
        if (!kee.tabStates.has(tabId)) {
            kee.tabStates.set(tabId, new TabState());
        }
    }

    deleteTabState (tabId: number) {
        kee.tabStates.delete(tabId);
    }

    initiatePasswordGeneration () {
        if (kee.appState.connected) {
            const tabState = kee.tabStates.get(kee.foregroundTabId);
            if (tabState) {
                const framePort = tabState.framePorts.get(0);
                if (framePort) {
                    framePort.postMessage({ action: Action.GeneratePassword });
                    return;
                }
            }
            // Probably focussed on a Kee Vault tab
            if (kee.vaultPort) {
                kee.vaultPort.postMessage({protocol: VaultProtocol.ShowGenerator} as VaultMessage);
            }
        }
    }
}

let kee: Kee;
let updateForegroundTabRetryTimer;

// Make sure user knows we're not ready yet
browser.browserAction.setBadgeText({ text: "OFF" });
browser.browserAction.setBadgeBackgroundColor({ color: "red" });
browser.browserAction.disable();

// Assumes config and logging have been initialised before this is called.
function startup () {
    KeeLog.attachConfig(configManager.current);
    kee = new Kee();
    kee.init();
    configManager.addChangeListener(() => kee.configSyncManager.updateToRemoteConfig(configManager.current));
    browser.browserAction.enable();
}

// callbacks for messaging / ports

function browserPopupMessageHandler (msg: AddonMessage) {
    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from browser popup script: " + msg);

    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        try { kee.browserPopupPort.postMessage({ appState: kee.appState } as AddonMessage); } catch (e) {}
    }
    if (msg.loadUrlHelpSensitiveLogging) {
        browser.tabs.create({
            url: "https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive"
        });
    }
    if (msg.loadUrlUpgradeKee) {
        browser.tabs.create({
            url: "https://www.kee.pm/upgrade-kprpc"
        });
    }
    if (msg.action === Action.GeneratePassword) {
        kee.initiatePasswordGeneration();
    }
    if (msg.action === Action.ShowMatchedLoginsPanel) {
        if (kee.appState.connected) {
            let frameIdWithMatchedLogins = kee.frameIdWithMatchedLogins(kee.tabStates.get(kee.foregroundTabId).frames);
            if (frameIdWithMatchedLogins == -1) frameIdWithMatchedLogins = 0;
            kee.tabStates.get(kee.foregroundTabId).framePorts.get(0).postMessage({action: Action.ShowMatchedLoginsPanel, frameId: frameIdWithMatchedLogins });
        }
    }
    if (msg.action === Action.SaveLatestLogin) {
        if (kee.appState.connected) {
            const persistentItem = kee.persistentTabStates.get(kee.foregroundTabId).items.find(item => item.itemType == "submittedData");
            kee.tabStates.get(kee.foregroundTabId).framePorts.get(0).postMessage(
                { appState: kee.appState, submittedData: persistentItem.submittedData } as AddonMessage);
            persistentItem.accessCount++;
        }
    }
    if (msg.findMatches) {
        kee.findLogins(null, null, null, msg.findMatches.uuid, msg.findMatches.DBfilename, null, null, result => {
            kee.browserPopupPort.postMessage({ appState: kee.appState, findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.loginEditor) {
        kee.launchLoginEditor(msg.loginEditor.uniqueID, msg.loginEditor.DBfilename);
    }
    if (msg.currentSearchTerm != null) {
        kee.appState.currentSearchTerm = msg.currentSearchTerm;
        clearTimeout(kee.currentSearchTermTimer);
        kee.currentSearchTermTimer = setTimeout(() => {
            kee.appState.currentSearchTerm = null;
        }, configManager.current.currentSearchTermTimeout * 1000);
    }
}

function pageMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from page script", ": " + msg);

    if (msg.findMatches) {
        kee.findLogins(msg.findMatches.uri, null, null, null, null, null, null, result => {
            this.postMessage({ appState: kee.appState, isForegroundTab: this.sender.tab.id === kee.foregroundTabId,
            findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        try { kee.browserPopupPort.postMessage({ appState: kee.appState, isForegroundTab: this.sender.tab.id === kee.foregroundTabId } as AddonMessage); } catch (e) {}
    }
    if (msg.logins) {
        kee.tabStates.get(this.sender.tab.id).frames.get(this.sender.frameId).logins = msg.logins;
    }
    if (msg.submittedData) {

        // Record the URL of the favicon now but don't resolve it to
        // data until we know we want to actually save this login
        msg.submittedData.favIconUrl = this.sender.tab.favIconUrl;

        const submittedLogin = new keeLoginInfo();
        submittedLogin.init([msg.submittedData.url], null, null, msg.submittedData.usernameIndex,
        msg.submittedData.passwordFields.map(function (item) {
            const newField = new keeLoginField();
            newField.fieldId = item.fieldId;
            newField.type = item.type;
            newField.name = item.name;
            newField.value = item.value;
            return newField; }),
        null, msg.submittedData.title,
        msg.submittedData.otherFields.map(function (item) {
            const newField = new keeLoginField();
            newField.fieldId = item.fieldId;
            newField.type = item.type;
            newField.name = item.name;
            newField.value = item.value;
            return newField; }),
        1);

        const persistentItem = {
            itemType: "submittedData" as "submittedData",
            submittedData: msg.submittedData,
            submittedLogin: submittedLogin,
            creationDate: new Date(),
            accessCount: 0,
            maxAccessCount: 20
        };

        if (!kee.persistentTabStates.get(this.sender.tab.id)) {
            kee.persistentTabStates.set(this.sender.tab.id, {items: [] });
        }

        // Don't allow more than one login to be tracked for this tab
        if (kee.persistentTabStates.get(this.sender.tab.id)) {
            kee.persistentTabStates.get(this.sender.tab.id).items =
                kee.persistentTabStates.get(this.sender.tab.id).items.filter(item => item.itemType !== "submittedData");
        }

        kee.persistentTabStates.get(this.sender.tab.id).items.push(persistentItem);

        if (configManager.current.notificationCountSavePassword < 10) {
            browser.notifications.create({
                type: "basic",
                iconUrl: browser.extension.getURL("common/images/128.png"),
                title: $STR("savePasswordText"),
                message: $STR("notification_save_password_tip") + "\n" + $STR("notification_only_shown_some_times")
            });
            configManager.setASAP({notificationCountSavePassword: configManager.current.notificationCountSavePassword+1});
        }
    }
    if (msg.action === Action.ShowMatchedLoginsPanel) {
        kee.tabStates.get(this.sender.tab.id).framePorts.get(0).postMessage({action: Action.ShowMatchedLoginsPanel, frameId: this.sender.frameId });
    }
    if (msg.action === Action.RemoveSubmittedData) {
        if (kee.persistentTabStates.get(this.sender.tab.id)) {
            kee.persistentTabStates.get(this.sender.tab.id).items =
                kee.persistentTabStates.get(this.sender.tab.id).items.filter(item => item.itemType !== "submittedData");
        }
    }
    if (msg.action === Action.PageHide) {
        try {
            kee.tabStates.get(this.sender.frameId).framePorts.forEach((port, key, map) => {
            try {
                port.disconnect();
            } catch (e) {
                if (KeeLog && KeeLog.debug) {
                    KeeLog.debug("failed to disconnect a frame port on tab " + key +
                    ". This is probably not a problem but we may now be reliant on browser " +
                    "GC to clear down memory. The exception that caused this is: " + e.message + " : " + e.stack);
                }
            } finally {
                map.delete(key);
            }
        });
        } catch (e) {
            // Happens when an iframe is hidden after the top-level frame. The
            // only impact is some messaging ports remaining open for longer
            // than required. Pretty sure the browser has to deal with this
            // situation already - probably just through standard GC.
        }
        if (this.sender.frameId === 0) {
            kee.deleteTabState(this.sender.tab.id);
        }
    }
    if (msg.action === Action.PageShow) {
        kee.createTabStateIfMissing(this.sender.tab.id);
    }
}


function vaultMessageHandler (this: browser.runtime.Port, msg: VaultMessage) {
    let result;
    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from vault script: " + JSON.stringify(msg));
    switch (msg.action) {
        case VaultAction.Init:
            result = kee.KeePassRPC.startEventSession(msg.sessionId, msg.features, msgToPage => this.postMessage(msgToPage));
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.MessageToClient:
            result = kee.KeePassRPC.eventSessionMessageFromPage(msg);
            if (result) {
                this.postMessage(result);
            }
            return;
        case VaultAction.FocusRequired:
            browser.tabs.update(this.sender.tab.id, { active: true });
            browser.windows.update(this.sender.tab.windowId, { focused: true });
            return;
        case VaultAction.AccountChanged:
            kee.accountManager.processNewTokens(msg.tokens);
            return;
    }
}

function iframeMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    if (KeeLog && KeeLog.debug) KeeLog.debug("In background script, received message from iframe script: " + msg);

    const tabId = this.sender.tab.id;
    const frameId = this.sender.frameId;
    const port = this;

    if (msg.action == Action.ManualFill && msg.selectedLoginIndex != null) {
        kee.tabStates.get(tabId).framePorts.get(msg.frameId || 0).postMessage(msg);
        kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
    }

    if (msg.action == Action.CloseAllPanels) {
        kee.tabStates.get(tabId).framePorts.get(0).postMessage(msg);
    }

    if (msg.action == Action.GetPasswordProfiles) {
        kee.getPasswordProfiles(passwordProfiles => {
            kee.appState.PasswordProfiles = passwordProfiles;
            if (passwordProfiles.length > 0) {
                port.postMessage({ passwordProfiles } as AddonMessage);
            }
        });
    }

    if (msg.action == Action.GeneratePassword) {
        kee.generatePassword(msg.passwordProfile, kee.tabStates.get(tabId).url, generatedPassword => {
            port.postMessage({ generatedPassword: generatedPassword } as AddonMessage);
        });
    }

    if (msg.loginEditor) {
        kee.launchLoginEditor(msg.loginEditor.uniqueID, msg.loginEditor.DBfilename);
    }

    if (msg.saveData) {
        const persistentItem = kee.persistentTabStates.get(tabId).items.find(item => item.itemType == "submittedData");

        fetchFavicon(persistentItem.submittedData.favIconUrl).then(dataUrl => {

            if (dataUrl) {
                persistentItem.submittedLogin.iconImageData = dataUrl.substr(22);
            }

            if (msg.saveData.update) {
                kee.updateLogin(persistentItem.submittedLogin, msg.saveData.oldLoginUUID, msg.saveData.urlMergeMode, msg.saveData.db);
                showUpdateSuccessNotification(msg.saveData.oldLoginUUID, msg.saveData.db);
            }
            else {
                const result = kee.addLogin(persistentItem.submittedLogin, msg.saveData.group, msg.saveData.db);
                if (configManager.current.rememberMRUGroup) {
                    if (!configManager.current.mruGroup) configManager.current.mruGroup = {};
                    configManager.current.mruGroup[msg.saveData.db] = msg.saveData.group;
                    configManager.save();
                }
            }

            kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
        });
    }

    if (msg.neverSave) {
        const persistentItem = kee.persistentTabStates.get(tabId).items.find(item => item.itemType == "submittedData");
        const url = new URL(persistentItem.submittedData.url);
        const host = url.host;
        const configLookup = configManager.siteConfigLookupFor("Host", "Exact");
        if (!configLookup[host]) {
            configLookup[host] = {config: new SiteConfig(), source: "User", matchWeight: 100};
        }
        configLookup[host].config.preventSaveNotification = true;
        configManager.save();
        kee.tabStates.get(tabId).framePorts.get(0).postMessage({ action: Action.CloseAllPanels });
    }
}

function fetchFavicon (url): Promise<string> {
    return new Promise(function (resolve, reject) {
        if (!url) {
            resolve(undefined);
            return;
        }
        const img = new Image();
        img.onload = function (this: HTMLImageElement) {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);

            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = url;
    });
}

function showUpdateSuccessNotification (uniqueID: string, fileName: string)
{
    if (configManager.current.notifyWhenEntryUpdated)
    {
        const button1: Button = {
            label: $STR("dont_show_again"),
            action: "disableNotifyWhenEntryUpdated"
        };
        const button2: Button = {
            label: $STR("showEntry"),
            action: "launchLoginEditorFromNotification",
            values: { uniqueID, fileName}
        };
        const messages = [$STR("password_successfully_updated"),
            $STR("entry_history_pointer"),
            $STR("change_field_status"),
            $STR("change_field_explanation"),
            $STR("multi_page_update_warning")];
        const notification = new KeeNotification(
            "password-updated", [button1, button2], utils.newGUID(), messages, "Medium", false);
        kee.notifyUser(notification);
    }
}

browser.windows.onFocusChanged.addListener(async windowId => {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Focus changed for id: " + windowId);
    if (windowId !== browser.windows.WINDOW_ID_NONE)
    {
        const tabs = await browser.tabs.query({active: true, windowId: windowId});
        if (tabs[0] && tabs[0].id != null) onTabActivated(tabs[0].id);
    }
});

browser.tabs.onActivated.addListener(event => {
    if (KeeLog && KeeLog.debug) KeeLog.debug("Tab activated with id: " + event.tabId);
    onTabActivated(event.tabId);
});

function onTabActivated (tabId) {

    updateForegroundTab(tabId);

    if (kee) // May not have set up kee yet
    {
        commandManager.setupContextMenuItems();
    }
}

function updateForegroundTab (tabId: number) {
    if (kee && kee.foregroundTabId !== tabId) { // May not have set up kee yet
        kee.foregroundTabId = tabId;
        if (kee.tabStates.has(tabId) && kee.tabStates.get(tabId).framePorts) // May not have set up port yet
        {
            if (KeeLog && KeeLog.debug) KeeLog.debug("kee activated on tab: " + tabId);
            kee.tabStates.get(tabId).framePorts.forEach(port => {
                port.postMessage({ appState: kee.appState, isForegroundTab: true, action: Action.DetectForms } as AddonMessage);
            });
        }
    }
}

// Some browsers (e.g. Firefox) automatically inject content scripts on install/update
// but others don't (e.g. Chrome). To ensure every existing tab has exactly one
// instance of this content script running in it, we programatically inject the script.
if (!__KeeIsRunningInAWebExtensionsBrowser) {
    browser.runtime.onInstalled.addListener(details => {
        const showErrors = () => {
            if (browser.runtime.lastError) {
                if (KeeLog && KeeLog.error) KeeLog.error(browser.runtime.lastError.message);
                else console.error(browser.runtime.lastError);
            }
        };
        browser.runtime.getManifest().content_scripts.forEach(script => {
            const allFrames = script.all_frames;
            const url = script.matches;

            // We have to define the list of expected Vault URLs here as well as in
            // the manifest because there is no API available to automatically handle
            // the manifest globs and it's not worth bundling a generic parser for
            // just this one use case.
            const vaultURLs = ["https://app-dev.kee.pm:8087/", "https://app-beta.kee.pm/", "https://app.kee.pm/", "https://keevault.pm/"];

            const loadContentScripts = (tab: browser.tabs.Tab) => {
                if (tab.url && tab.url.startsWith("chrome://")) return;
                if (script.exclude_globs && script.exclude_globs.length > 0) {
                    if (vaultURLs.some(excludedURL => tab.url.startsWith(excludedURL))) return;
                }
                if (script.include_globs && script.include_globs.length > 0) {
                    if (!vaultURLs.some(includedURL => tab.url.startsWith(includedURL))) return;
                }
                (script.js || []).forEach(file => {
                    browser.tabs.executeScript(tab.id, { allFrames, file }).then(showErrors);
                });
                (script.css || []).forEach(file => {
                    browser.tabs.insertCSS(tab.id, { allFrames, file }).then(showErrors);
                });
            };
            browser.tabs.query({ url }).then(tabs => tabs.forEach(loadContentScripts));
        });
    });
}

browser.runtime.onInstalled.addListener(async details => {
    if (details.reason === "update") {
        browser.tabs.create({
            url: "release-notes/update-notes.html"
        });
    } else if (details.reason === "install") {
        const vaultTabs = await browser.tabs.query({url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]});
        if (vaultTabs && vaultTabs[0]) {
            browser.tabs.update(vaultTabs[0].id, { active: true });
        } else {
            browser.tabs.create({
                url: "release-notes/install-notes.html"
            });
        }
    }
});

// Load our config and start the addon once done
configManager.load(startup);
