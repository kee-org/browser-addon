/// <reference path="commands.ts" />
/// <reference path="backgroundUtils.ts" />
/// <reference path="PersistentTabState.ts" />

class Kee {

    appState: AppState;
    tabStates: TabState[];
    persistentTabStates: PersistentTabState[];
    utils: Utils;
    search: Search;
    foregroundTabId: number;

    regularKPRPCListenerQueueHandlerTimer: number;

    // Our link to the JSON-RPC objects required for communication with KeePass
    KeePassRPC: jsonrpcClient;

    _installerTabLoaded: boolean;

    processingCallback: boolean;
    pendingCallback: string;
    urlToOpenOnStartup: string;

    browserPopupPort: Partial<browser.runtime.Port>;
    onPortConnected: any;

    constructor ()
    {

        this.appState = {
            latestConnectionError: "",
            lastKeePassRPCRefresh: 0,
            ActiveKeePassDatabaseIndex: -1,
            KeePassDatabases: [],
            notifications: [],
            connected: false
        };

        this.tabStates = [];
        this.persistentTabStates = [];

        this.foregroundTabId = -1;

        this.utils = utils;

        this.search = new Search(this.appState, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs
        });

        // Create a timer for checking whether user is logging sensitive data
        setTimeout(backgroundUtils.oneOffSensitiveLogCheckHandler, 45000);

        // Create a timer for KPRPC connection establishment
        this.regularKPRPCListenerQueueHandlerTimer = setInterval(this.RegularKPRPCListenerQueueHandler, 5000);

        this._keeBrowserStartup();

        this.browserPopupPort = {postMessage: msg => {} };
        this.onPortConnected = function (p: browser.runtime.Port) {
            let name = p.name;
            let parentFrameId: number;
            if (name.startsWith("iframe")) {
                parentFrameId = parseInt(name.substr(7));
                name = "iframe";
            }
            switch (name) {
                case "browserPopup": {
                    p.onMessage.addListener(browserPopupMessageHandler);
                    p.onDisconnect.addListener(browserPopupDisconnect);

                    p.postMessage({ appState: kee.appState });

                    kee.browserPopupPort = p;
                    kee.resetBrowserActionColor();
                    break;
                }
                case "page": {
                    p.onMessage.addListener(pageMessageHandler.bind(p));
                    p.onDisconnect.addListener(pageDisconnect.bind(p));

                    const connectMessage = {
                        appState: kee.appState,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === kee.foregroundTabId
                    } as AddonMessage;

                    if (!kee.tabStates[p.sender.tab.id]) {
                        kee.tabStates[p.sender.tab.id] = new TabState();
                        if (kee.persistentTabStates[p.sender.tab.id]) {
                             kee.persistentTabStates[p.sender.tab.id].items.forEach(item => {
                                if (item.itemType === "submittedData") {
                                    connectMessage.submittedData = item.submittedData;
                                    item.accessCount++;
                                }
                            });
                        }
                    }

                    if (p.sender.frameId === 0) {
                        kee.tabStates[p.sender.tab.id].url = p.sender.tab.url;
                    }
                    kee.tabStates[p.sender.tab.id].frames[p.sender.frameId] = new FrameState();
                    kee.tabStates[p.sender.tab.id].framePorts[p.sender.frameId] = p;

                    p.postMessage(connectMessage);

                    break;
                }
                case "iframe": {
                    p.onMessage.addListener(iframeMessageHandler.bind(p));
                    p.onDisconnect.addListener(iframeDisconnect.bind(p));

                    const connectMessage = {
                        appState: kee.appState,
                        frameState: kee.tabStates[p.sender.tab.id].frames[parentFrameId],
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === kee.foregroundTabId
                    } as AddonMessage;

                    if (kee.persistentTabStates[p.sender.tab.id]) {
                        kee.persistentTabStates[p.sender.tab.id].items.forEach(item => {
                            if (item.itemType === "submittedData") {
                                connectMessage.submittedData = item.submittedData;
                            }
                        });
                    }

                    p.postMessage(connectMessage);

                    kee.tabStates[p.sender.tab.id].ourIframePorts[p.sender.frameId] = p;
                    break;
                }
            }
        };

        browser.runtime.onConnect.addListener(this.onPortConnected);

        // Setup any ports that we were notified of before the addon finished initialising
        //TODO:c: Check to see if there is any chance these will fail (tab closed during init?) and handle as appropriate
        portsQueue.forEach(port => this.onPortConnected(port));
        portsQueue = null;
        browser.runtime.onConnect.removeListener(onConnectedBeforeInitialised);

        browser.tabs.onActivated.addListener(event => {
                kee.foregroundTabId = event.tabId;
                //TODO:c: Is this the right time to send updated appstate and potentially scan for new form fields?
                //TODO:c: Should we inform all inactive tabs too?
                const tab = kee.tabStates[event.tabId];

                if (tab && tab.framePorts) // Might not have had time to setup the port yet
                {
                    tab.framePorts.forEach(port => {
                        port.postMessage({ appState: kee.appState, isForegroundTab: true } as AddonMessage);
                    });
                }

                commandManager.setupContextMenuItems();
            }
        );
        // browser.tabs.onUpdated.addListener((id, event) =>
        //     event.url
        // );

        browser.privacy.services.passwordSavingEnabled.set({ value: false }, function () {
            if (chrome.runtime.lastError !== undefined) {
                KeeLog.warn("KeeFox was unable to disable built-in password manager saving - confusion may ensue! " + chrome.runtime.lastError);
            }
        });

    }


    notifyUser (notification: KeeNotification) {
        if (!notification.allowMultiple) {
            kee.removeUserNotifications((n: KeeNotification) => n.name != notification.name);
        }
        kee.appState.notifications.push(notification);
        kee.browserPopupPort.postMessage({appState: kee.appState});
        browser.browserAction.setIcon({path: "common/images/highlight-48.png" });
    }

    removeUserNotifications (unlessTrue: (notification: KeeNotification) => boolean) {
        kee.appState.notifications = kee.appState.notifications.filter(unlessTrue);
        kee.browserPopupPort.postMessage({appState: kee.appState});
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
        KeeLog.info("Kee initialising");

        //this._keeVariableInit();
        this.KeePassRPC = new jsonrpcClient();
        this.KeePassRPC.startup();

        KeeLog.info("Kee initialised OK although the connection to KeePass may not be established just yet...");
    }

    // Temporarilly disable Kee. Used (for e.g.) when KeePass is shut down.
    _pauseKee ()
    {
        KeeLog.debug("Pausing Kee.");
        this.appState.KeePassDatabases = null;
        this.appState.ActiveKeePassDatabaseIndex = -1;
        this.appState.connected = false;
        kee.browserPopupPort.postMessage( { appState: this.appState });

        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        // Poke every port. In future might just limit to active tab?
        kee.tabStates.forEach(ts => {
            ts.framePorts.forEach(port => {
                port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
            }, this);
        }, this);

        commandManager.setupContextMenuItems();

        KeeLog.info("Kee paused.");
    }

    _refreshKPDB ()
    {
        this.getAllDatabases();
        KeeLog.debug("Refresh of Kee's view of the KeePass database initiated.");
    }

    updateKeePassDatabases (newDatabases)
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

        kee.browserPopupPort.postMessage( { appState: this.appState });

        // Poke every port. In future might just limit to active tab?
        kee.tabStates.forEach(ts => {
            ts.framePorts.forEach(port => {
                port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
            }, this);
        }, this);

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
        if (this.appState.KeePassDatabases != null && this.appState.KeePassDatabases.length > 0
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
        if (this.appState.KeePassDatabases != null && this.appState.KeePassDatabases.length > 0
            && this.appState.KeePassDatabases[index] != null
            && this.appState.KeePassDatabases[index].root != null)
            return this.appState.KeePassDatabases[index].fileName;
        else
            return null;
    }

    getAllDatabaseFileNames ()
    {
        try
        {
            return this.KeePassRPC.getMRUdatabases();
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
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

    changeLocation (locationId)
    {
        try
        {
            this.KeePassRPC.changeLocation(locationId);
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

    getApplicationMetadata ()
    {
        try
        {
            return this.KeePassRPC.getApplicationMetadata();
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    findLogins (fullURL, formSubmitURL, httpRealm, uniqueID, dbFileName, freeText, username, callback, callbackData?)
    {
        try
        {
            return this.KeePassRPC.findLogins(fullURL, formSubmitURL, httpRealm, uniqueID, dbFileName, freeText, username, callback, callbackData);
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

    getPasswordProfiles (callback)
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
        let pause = false;
        let refresh = false;

        switch (sig) {
            case "0": KeeLog.info("KeePassRPC is requesting authentication [deprecated]."); break;
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
            case "12": KeeLog.info("KeePass is shutting down.");
                pause = true;
                break;
            default: KeeLog.error("Invalid signal received by KPRPCListener (" + sig + ")"); break;
        }

        if (!pause && !refresh)
            return;

        const now = (new Date()).getTime();

        // If there is nothing in the queue at the moment we can process this callback straight away
        if (!kee.processingCallback && kee.pendingCallback == "")
        {
            KeeLog.debug("Signal executing now. @" + sigTime);
            kee.processingCallback = true;
            executeNow = true;
        }
        // Otherwise we need to add the action for this callback to a queue and leave it up to the regular callback processor to execute the action

        // if we want to pause Kee then we do it immediately or make sure it's the next (and only) pending task after the current task has finished
        if (pause)
        {
            if (executeNow) kee._pauseKee(); else kee.pendingCallback = "_pauseKee";
        }

        if (refresh)
        {
            if (executeNow) { kee.appState.lastKeePassRPCRefresh = now; kee._refreshKPDB(); } else kee.pendingCallback = "_refreshKPDB";
        }

        KeeLog.info("Signal handled or queued. @" + sigTime);
        if (executeNow)
        {
            //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
            if (kee.pendingCallback=="_pauseKee")
                kee._pauseKee();
            else if (kee.pendingCallback=="_refreshKPDB")
                kee._refreshKPDB();
            else
                KeeLog.info("A pending signal was found and handled.");
            kee.pendingCallback = "";
            kee.processingCallback = false;
            KeeLog.info("Signal handled. @" + sigTime);
        }
    }

    RegularKPRPCListenerQueueHandler ()
    {
        // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
        if (kee.processingCallback || kee.pendingCallback == "")
            return;

        KeeLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
        kee.processingCallback = true;
        if (kee.pendingCallback=="_pauseKee")
            kee._pauseKee();
        else if (kee.pendingCallback=="_refreshKPDB")
            kee._refreshKPDB();
        kee.pendingCallback = "";
        kee.processingCallback = false;
        KeeLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
    }

    //TODO:#8: tabs.currentTab().then(tab => tab.favIconUrl) will get the URI for a favicon but then need to make a network request to download
    // it I think! In any case, must be run from content script rather than background script.
    /*
    loadFavicon= function(url, faviconLoader)
    {
        try
        {
            var ioservice = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);

            var pageURI = ioservice.newURI(url, null, null);

            var faviconService =
                Components.classes["@mozilla.org/browser/favicon-service;1"]
                    .getService(Components.interfaces.nsIFaviconService);

            // find out if we can used the new async service
            faviconService = faviconService.QueryInterface(Components.interfaces.mozIAsyncFavicons);

            faviconService.getFaviconDataForPage(pageURI,faviconLoader);
            return;

        } catch (ex)
        {
            // something failed so we can't get the favicon. We don't really mind too much...
            faviconLoader.onComplete(null,0,null,null);
            if (KeeLog.logSensitiveData)
            {
                KeeLog.info("favicon load failed for " + url + " : " + ex);
                throw "We couldn't find a favicon for this URL: " + url + " BECAUSE: " + ex;
            } else
            {
                KeeLog.info("favicon load failed: " + ex);
                throw "We couldn't find a favicon BECAUSE: " + ex;
            }
        }
    }
    */

    onSearchCompleted (results)
    {
        // a default search results handler. In practice I expect that each search
        // execution will want to supply its own callback but this might be useful
        // if we find it neater to integrate with an Observer pattern, etc.
    }

}

let kee: Kee;

// Make sure user knows we're not ready yet
browser.browserAction.setBadgeText({ text: "OFF" });
browser.browserAction.setBadgeBackgroundColor({ color: "red" });
browser.browserAction.disable();

// Assumes config and logging have been initialised before this is called.
function startup () {
    kee = new Kee();
    browser.browserAction.enable();
}

// callbacks for messaging / ports

function browserPopupMessageHandler (msg: AddonMessage) {
    console.log("In background script, received message from browser popup script: " + msg);

    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        kee.browserPopupPort.postMessage({ appState: kee.appState } as AddonMessage);
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
    if (msg.action == "generatePassword") {
        if (kee.appState.connected) {
            kee.tabStates[kee.foregroundTabId].framePorts[0].postMessage({ action: "generatePassword" });
        }
    }
}

function browserPopupDisconnect () {
    // Just keeps other code neater if we can assume there's always a non-null message reciever
    kee.browserPopupPort = {postMessage: msg => {}};
}

function pageMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    console.log("In background script, received message from page script: " + msg);

    if (msg.findMatches) {
        kee.findLogins(msg.findMatches.uri, null, null, null, null, null, null, result => {
            this.postMessage({ appState: kee.appState, isForegroundTab: this.sender.tab.id === kee.foregroundTabId,
            findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.removeNotification) {
        kee.removeUserNotifications((n: KeeNotification) => n.id != msg.removeNotification);
        kee.browserPopupPort.postMessage({ appState: kee.appState, isForegroundTab: this.sender.tab.id === kee.foregroundTabId } as AddonMessage);
    }
    if (msg.logins) {
        kee.tabStates[this.sender.tab.id].frames[this.sender.frameId].logins = msg.logins;
    }
    if (msg.submittedData) {

        // Record the URL of the favicon now but don't resolve it to
        // data until we know we want to actually save this login
        msg.submittedData.favIconUrl = this.sender.tab.favIconUrl;

        kee.findLogins(msg.submittedData.url, null,
            null, null, null, null, null, response => {

            let existingLogin = false;

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

            // if no resultWrapper is provided, we just go ahead anyway assuming it's a new login
            if (response && response.result)
            {
                for (const i in response.result)
                {
                    const kfl = new keeLoginInfo();
                    kfl.initFromEntry(response.result[i]);
                    //TODO:3: Should be able to extend the search in containedIn() so we take into
                    // account the current page information and therefore can detect that the submitted
                    // form data is part of a larger multi-page login form. That situation should only
                    // come up very rarely though (e.g. maybe when user has navigated back to the
                    // non-first page of a multi-page login form, or when their credentials have been
                    // invalidated remotely and they end up on one of the non-first pages to
                    // submit updated credentials)
                    if (submittedLogin.containedIn(kfl, false, true, true, false))
                        existingLogin = true;
                }
            }

            if (existingLogin) return;

            if (!kee.persistentTabStates[this.sender.tab.id]) {
                kee.persistentTabStates[this.sender.tab.id] = {items: [] };
            }
            const persistentItem = {
                itemType: "submittedData" as "submittedData",
                submittedData: msg.submittedData,
                submittedLogin: submittedLogin,
                creationDate: new Date(),
                accessCount: 0,
                maxAccessCount: 20
            };
            kee.persistentTabStates[this.sender.tab.id].items.push(persistentItem);

            // If a few seconds go past without any new page port registration and the current
            // port is still active, assume the login was ajax or an iframe so post the updated
            // appdata to the existing port
            setTimeout(() => {
                if (persistentItem.accessCount === 0
                    && kee.tabStates[this.sender.tab.id]
                    && kee.tabStates[this.sender.tab.id].framePorts
                    && kee.tabStates[this.sender.tab.id].framePorts[0]) {
                    kee.tabStates[this.sender.tab.id].framePorts[0].postMessage(
                        { appState: kee.appState, submittedData: persistentItem.submittedData } as AddonMessage);
                    persistentItem.accessCount++;
                }
            }, 3000);
        });
    }
    if (msg.action === "showMatchedLoginsPanel") {
        kee.tabStates[this.sender.tab.id].framePorts[0].postMessage({action: "showMatchedLoginsPanel", frameId: this.sender.frameId });
    }
    if (msg.action === "removeSubmittedData") {
        if (kee.persistentTabStates[this.sender.tab.id]) {
            kee.persistentTabStates[this.sender.tab.id].items =
                kee.persistentTabStates[this.sender.tab.id].items.filter(item => item.itemType !== "submittedData");
        }
    }
}

function iframeMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    console.log("In background script, received message from iframe script: " + msg);

    const tabId = this.sender.tab.id;
    const frameId = this.sender.frameId;
    const port = this;

    if (msg.action == "manualFill" && msg.selectedLoginIndex != null) {
        kee.tabStates[tabId].framePorts[msg.frameId || 0].postMessage(msg);
        kee.tabStates[tabId].framePorts[0].postMessage({ action: "closeAllPanels" });
    }

    if (msg.action == "closeAllPanels") {
        kee.tabStates[tabId].framePorts[0].postMessage(msg);
    }

    if (msg.action == "generatePassword") {
        kee.getPasswordProfiles(passwordProfiles => {
            kee.generatePassword(msg.passwordProfile, kee.tabStates[tabId].url, generatedPassword => {
                port.postMessage({ passwordProfiles: passwordProfiles, generatedPassword: generatedPassword } as AddonMessage);
            });
        });
    }

    if (msg.loginEditor) {
        kee.launchLoginEditor(msg.loginEditor.uniqueID, msg.loginEditor.DBfilename);
    }

    if (msg.saveData) {
        const persistentItem = kee.persistentTabStates[tabId].items.find(item => item.itemType == "submittedData");

        fetchFavicon(persistentItem.submittedData.favIconUrl).then(dataUrl => {

            if (dataUrl) {
                persistentItem.submittedLogin.iconImageData = dataUrl.substr(22);
            }

            if (msg.saveData.update) {
                const result = kee.updateLogin(persistentItem.submittedLogin, msg.saveData.oldLoginUUID, msg.saveData.urlMergeMode, msg.saveData.db);
                showUpdateSuccessNotification();
            }
            else {
                const result = kee.addLogin(persistentItem.submittedLogin, msg.saveData.group, msg.saveData.db);
                if (configManager.current.rememberMRUGroup) {
                    if (!configManager.current.mruGroup) configManager.current.mruGroup = {};
                    configManager.current.mruGroup[msg.saveData.db] = msg.saveData.group;
                    configManager.save();
                }
            }

            kee.tabStates[tabId].framePorts[0].postMessage({ action: "closeAllPanels" });
        });

        //TODO:#9: tutorial guides, etc.
        // if (login.URLs[0].startsWith("http://tutorial-section-b.keefox.org/part2"))
        //     kee.tutorialHelper.tutorialProgressSaved();
    }
}

function fetchFavicon (url): Promise<string> {
    return new Promise(function (resolve, reject) {
        if (!url) {
            resolve(undefined);
            return;
        }
        const img = new Image();
        img.onload = function () {
            const canvas = document.createElement("canvas");
            canvas.width = (this as any).width;
            canvas.height = (this as any).height;

            const ctx = canvas.getContext("2d");
            ctx.drawImage((this as any), 0, 0);

            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL);
        };
        img.src = url;
    });
}

function showUpdateSuccessNotification ()
{
    if (configManager.current.notifyWhenEntryUpdated)
    {
        const button: Button = {
            label: $STR("dont_show_again"),
            action: "disableNotifyWhenEntryUpdated"
        };
        const messages = [$STR("password_successfully_updated"),
            $STR("keepass_history_pointer"),
            $STR("change_field_status"),
            $STR("change_field_explanation"),
            $STR("multi_page_update_warning")];
        const notification = new KeeNotification(
            "password-updated", [button], utils.newGUID(), messages, "Medium", false);
        kee.notifyUser(notification);
    }
}

function pageDisconnect () {
    delete kee.tabStates[this.sender.tab.id].framePorts[this.sender.frameId];

    // If we have no remaining page ports, we can assume this tab has closed and reclaim some memory
    // This also allows us to identify when a new page is loading in an existing tab (all ports will disconnect first)

    for (const i in kee.tabStates[this.sender.tab.id].framePorts) return;

    delete kee.tabStates[this.sender.tab.id];
}

function iframeDisconnect () {
    delete kee.tabStates[this.sender.tab.id].ourIframePorts[this.sender.frameId];
}

let portsQueue = [];

function onConnectedBeforeInitialised (port: browser.runtime.Port) {
    portsQueue.push(port);
}

// Before we've initialised this main module, we might receive connection
// attempts from content pages, etc. so we store them for later processing.
browser.runtime.onConnect.addListener(onConnectedBeforeInitialised);

// Load our config and start the addon once done
configManager.load(startup);
