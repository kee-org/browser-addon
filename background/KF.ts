/// <reference path="../common/config.ts" />
/// <reference path="../common/ConfigManager.ts" />
/// <reference path="search.ts" />
/// <reference path="../common/Logger.ts" />
/// <reference path="commands.ts" />
/// <reference path="utils.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/TabState.ts" />
/// <reference path="../common/FrameState.ts" />
/// <reference path="../common/AddonMessage.ts" />
/// <reference path="../common/KeeFoxNotification.ts" />

declare const chrome: typeof browser;

class KeeFox {

    appState: AppState;
    tabStates: TabState[];
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

        this.foregroundTabId = -1;

        this.utils = utils;

        this.search = new Search(this, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs
        });

        //TODO:c: tutorial guides, etc.
        //this.tutorialHelper = tutorialHelper;
        //this.sampleChecker = sampleChecker;

        // Create a timer for checking whether user is logging sensitive data
        setTimeout(utils.oneOffSensitiveLogCheckHandler, 45000);

        // Create a timer for KPRPC connection establishment
        this.regularKPRPCListenerQueueHandlerTimer = setInterval(this.RegularKPRPCListenerQueueHandler, 5000);

        this._keeFoxBrowserStartup();

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

                    p.postMessage({ appState: keefox_org.appState });

                    keefox_org.browserPopupPort = p;
                    break;
                }
                case "page": {
                    p.onMessage.addListener(pageMessageHandler.bind(p));
                    p.onDisconnect.addListener(pageDisconnect.bind(p));

                    p.postMessage({
                        appState: keefox_org.appState,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === keefox_org.foregroundTabId
                    } as AddonMessage);

                    if (p.sender.frameId === 0) {
                        keefox_org.tabStates[p.sender.tab.id] = new TabState();
                        keefox_org.tabStates[p.sender.tab.id].url = p.sender.tab.url;
                    }
                    keefox_org.tabStates[p.sender.tab.id].frames[p.sender.frameId] = new FrameState();
                    keefox_org.tabStates[p.sender.tab.id].framePorts[p.sender.frameId] = p;
                    break;
                }
                case "iframe": {
                    p.onMessage.addListener(iframeMessageHandler.bind(p));
                    p.onDisconnect.addListener(iframeDisconnect.bind(p));

                    p.postMessage({
                        appState: keefox_org.appState,
                        frameState: keefox_org.tabStates[p.sender.tab.id].frames[parentFrameId],
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === keefox_org.foregroundTabId
                    } as AddonMessage);

                    keefox_org.tabStates[p.sender.tab.id].ourIframePorts[p.sender.frameId] = p;
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
                keefox_org.foregroundTabId = event.tabId;
                //TODO:c: Is this the right time to send updated appstate and potentially scan for new form fields?
                //TODO:c: Should we inform all inactive tabs too?
                const tab = keefox_org.tabStates[event.tabId];

                if (tab && tab.framePorts) // Might not have had time to setup the port yet //TODO:c: (also, existing tabs when extension installed won't have our code running in them until we add support for that)
                {
                    tab.framePorts.forEach(port => {
                        port.postMessage({ appState: keefox_org.appState, isForegroundTab: true } as AddonMessage);
                    });
                }

                commandManager.setupContextMenuItems();
            }
        );
        // browser.tabs.onUpdated.addListener((id, event) =>
        //     event.url
        // );

    }


    notifyUser (notification: KeeFoxNotification) {
        if (!notification.allowMultiple) {
            keefox_org.removeUserNotifications((n: KeeFoxNotification) => n.name != notification.name);
        }
        keefox_org.appState.notifications.push(notification);
        keefox_org.browserPopupPort.postMessage({appState: keefox_org.appState});
    }

    removeUserNotifications (test: (notification: KeeFoxNotification) => boolean) {
        keefox_org.appState.notifications = keefox_org.appState.notifications.filter(test);
        keefox_org.browserPopupPort.postMessage({appState: keefox_org.appState});
    }

    getDBbyFilename (fileName)
    {
        KeeFoxLog.debug("Getting database for filename: " + fileName);
        if (fileName == undefined || fileName == null || fileName.length == 0)
            return this.appState.KeePassDatabases[this.appState.ActiveKeePassDatabaseIndex];

        for (let i=0; i < this.appState.KeePassDatabases.length; i++)
        {
            if (this.appState.KeePassDatabases[i].fileName == fileName)
                return this.appState.KeePassDatabases[i];
        }
    }

    shutdown ()
    {
        // These log messages never appear. Does this function even get executed?
        KeeFoxLog.debug("KeeFox module shutting down...");
        // if (this.KeePassRPC != undefined && this.KeePassRPC != null)
        //     this.KeePassRPC..session.shutdown();
        // if (this.regularKPRPCListenerQueueHandlerTimer != undefined && this.regularKPRPCListenerQueueHandlerTimer != null)
        //     clearInterval(this.regularKPRPCListenerQueueHandlerTimer);
        // this.KeePassRPC = null;

        KeeFoxLog.debug("KeeFox module shut down.");
        KeeFoxLog = null;
    }

    _keeFoxBrowserStartup ()
    {
        KeeFoxLog.info("KeeFox initialising");

        //this._keeFoxVariableInit();
        this.KeePassRPC = new jsonrpcClient();
        this.KeePassRPC.startup();

        KeeFoxLog.info("KeeFox initialised OK although the connection to KeePass may not be established just yet...");
    }

    // Temporarilly disable KeeFox. Used (for e.g.) when KeePass is shut down.
    _pauseKeeFox ()
    {
        KeeFoxLog.debug("Pausing KeeFox.");
        this.appState.KeePassDatabases = null;
        this.appState.ActiveKeePassDatabaseIndex = -1;
        this.appState.connected = false;
        keefox_org.browserPopupPort.postMessage( { appState: this.appState });

        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        // Poke every port. In future might just limit to active tab?
        keefox_org.tabStates.forEach(ts => {
            ts.framePorts.forEach(port => {
                port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
            }, this);
        }, this);

        commandManager.setupContextMenuItems();

        KeeFoxLog.info("KeeFox paused.");
    }

    _refreshKPDB ()
    {
        this.getAllDatabases();
        KeeFoxLog.debug("Refresh of KeeFox's view of the KeePass database initiated.");
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

        KeeFoxLog.info("Number of databases open: " + newDatabases.length);

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
            if (MRUFN != null && MRUFN != undefined && !(MRUFN instanceof Error))
                configManager.current.keePassMRUDB = MRUFN;
                configManager.save();
        }

        keefox_org.browserPopupPort.postMessage( { appState: this.appState });

        // Poke every port. In future might just limit to active tab?
        keefox_org.tabStates.forEach(ts => {
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
    / KeeFox needs to take against KeePass via the KeePassRPC plugin connection.
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            KeeFoxLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
            throw e;
        }
    }

    //TODO:c:implement tutorial custom header
    /*
    case "http-on-modify-request":
        // Send a custom header to the tutorial website so we know that
        // the user is running KeeFox 1.5 or above. We don't send any
        // details (such as the exact version) until the tutorial page
        // requests the information via a custom Javascript event.
        let httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
        try {
            let host = httpChannel.originalURI.host;
            if (host.startsWith("tutorial") &&
                (host == "tutorial.keefox.org" ||
                host == "tutorial-section-b.keefox.org" ||
                host == "tutorial-section-c.keefox.org" ||
                host == "tutorial-section-d.keefox.org"))
                httpChannel.setRequestHeader("X-KeeFox", "Installed", false);
        } catch (e)
        {
            // Don't care
        }
    */

    // Could use multiple callback functions but just one keeps KeePassRPC simpler
    // this is only called once no matter how many windows are open. so functions
    // within need to handle all open windows for now, that just means every
    // window although in future maybe there could be a need to store a list of
    // relevant windows and call those instead
    KPRPCListener (sig)
    {
        const sigTime = Date();

        KeeFoxLog.debug("Signal received by KPRPCListener (" + sig + ") @" + sigTime);

        let executeNow = false;
        let pause = false;
        let refresh = false;

        switch (sig) {
            case "0": KeeFoxLog.info("KeePassRPC is requesting authentication [deprecated]."); break;
            case "3": KeeFoxLog.info("KeePass' currently active DB is about to be opened."); break;
            case "4": KeeFoxLog.info("KeePass' currently active DB has just been opened.");
                refresh = true;
                break;
            case "5": KeeFoxLog.info("KeePass' currently active DB is about to be closed."); break;
            case "6": KeeFoxLog.info("KeePass' currently active DB has just been closed.");
                refresh = true;
                break;
            case "7": KeeFoxLog.info("KeePass' currently active DB is about to be saved."); break;
            case "8": KeeFoxLog.info("KeePass' currently active DB has just been saved.");
                refresh = true;
                break;
            case "9": KeeFoxLog.info("KeePass' currently active DB is about to be deleted."); break;
            case "10": KeeFoxLog.info("KeePass' currently active DB has just been deleted."); break;
            case "11": KeeFoxLog.info("KeePass' active DB has been changed/selected.");
                refresh = true;
                break;
            case "12": KeeFoxLog.info("KeePass is shutting down.");
                pause = true;
                break;
            default: KeeFoxLog.error("Invalid signal received by KPRPCListener (" + sig + ")"); break;
        }

        if (!pause && !refresh)
            return;

        const now = (new Date()).getTime();

        // If there is nothing in the queue at the moment we can process this callback straight away
        if (!keefox_org.processingCallback && keefox_org.pendingCallback == "")
        {
            KeeFoxLog.debug("Signal executing now. @" + sigTime);
            keefox_org.processingCallback = true;
            executeNow = true;
        }
        // Otherwise we need to add the action for this callback to a queue and leave it up to the regular callback processor to execute the action

        // if we want to pause KeeFox then we do it immediately or make sure it's the next (and only) pending task after the current task has finished
        if (pause)
        {
            if (executeNow) keefox_org._pauseKeeFox(); else keefox_org.pendingCallback = "_pauseKeeFox";
        }

        if (refresh)
        {
            if (executeNow) { keefox_org.appState.lastKeePassRPCRefresh = now; keefox_org._refreshKPDB(); } else keefox_org.pendingCallback = "_refreshKPDB";
        }

        KeeFoxLog.info("Signal handled or queued. @" + sigTime);
        if (executeNow)
        {
            //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
            if (keefox_org.pendingCallback=="_pauseKeeFox")
                keefox_org._pauseKeeFox();
            else if (keefox_org.pendingCallback=="_refreshKPDB")
                keefox_org._refreshKPDB();
            else
                KeeFoxLog.info("A pending signal was found and handled.");
            keefox_org.pendingCallback = "";
            keefox_org.processingCallback = false;
            KeeFoxLog.info("Signal handled. @" + sigTime);
        }
    }

    RegularKPRPCListenerQueueHandler ()
    {
        // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
        if (keefox_org.processingCallback || keefox_org.pendingCallback == "")
            return;

        KeeFoxLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
        keefox_org.processingCallback = true;
        if (keefox_org.pendingCallback=="_pauseKeeFox")
            keefox_org._pauseKeeFox();
        else if (keefox_org.pendingCallback=="_refreshKPDB")
            keefox_org._refreshKPDB();
        keefox_org.pendingCallback = "";
        keefox_org.processingCallback = false;
        KeeFoxLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
    }

    //TODO:c: tabs.currentTab().then(tab => tab.favIconUrl) will get the URI for a favicon but then need to make a network request to download
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
            if (KeeFoxLog.logSensitiveData)
            {
                KeeFoxLog.info("favicon load failed for " + url + " : " + ex);
                throw "We couldn't find a favicon for this URL: " + url + " BECAUSE: " + ex;
            } else
            {
                KeeFoxLog.info("favicon load failed: " + ex);
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

let keefox_org: KeeFox;

// Make sure user knows we're not ready yet
browser.browserAction.setBadgeText({ text: "OFF" });
browser.browserAction.setBadgeBackgroundColor({ color: "red" });
browser.browserAction.disable();

// Assumes config and logging have been initialised before this is called.
function startup () {
    keefox_org = new KeeFox();
    browser.browserAction.enable();
}


// callbacks for messaging / ports

function browserPopupMessageHandler (msg: AddonMessage) {
    console.log("In background script, received message from browser popup script: " + msg);

    if (msg.removeNotification) {
        delete keefox_org.appState.notifications[msg.removeNotification];
        keefox_org.browserPopupPort.postMessage({ appState: keefox_org.appState });
    }
    if (msg.loadUrlHelpSensitiveLogging) {
        browser.tabs.create({
            url: "https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive"
        });
    }

    if (msg.action == "generatePassword") {
        if (keefox_org.appState.connected) {
            keefox_org.tabStates[keefox_org.foregroundTabId].framePorts[0].postMessage({ action: "generatePassword" });
        }
    }
}

function browserPopupDisconnect () {
    // Just keeps other code neater if we can assume there's always a non-null message reciever
    keefox_org.browserPopupPort = {postMessage: msg => {}};
}

function pageMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    console.log("In background script, received message from page script: " + msg);

    if (msg.findMatches) {
        keefox_org.findLogins(msg.findMatches.uri, null, null, null, null, null, null, result => {
            this.postMessage({ appState: keefox_org.appState, isForegroundTab: this.sender.tab.id === keefox_org.foregroundTabId,
            findMatchesResult: result.result } as AddonMessage);
        });
    }
    if (msg.removeNotification) {
        delete keefox_org.appState.notifications[msg.removeNotification];
        keefox_org.browserPopupPort.postMessage({ appState: keefox_org.appState, isForegroundTab: this.sender.tab.id === keefox_org.foregroundTabId } as AddonMessage);
    }
    if (msg.logins) {
        keefox_org.tabStates[this.sender.tab.id].frames[this.sender.frameId].logins = msg.logins;
    }
    if (msg.action === "lookForNewIframes") {
        injectScriptsToTab(this.sender.tab.id);
    }
    if (msg.action === "showMatchedLoginsPanel") {
        keefox_org.tabStates[this.sender.tab.id].framePorts[0].postMessage({action: "showMatchedLoginsPanel", frameId: this.sender.frameId });
    }
}

function iframeMessageHandler (this: browser.runtime.Port, msg: AddonMessage) {
    console.log("In background script, received message from iframe script: " + msg);

    const tabId = this.sender.tab.id;
    const frameId = this.sender.frameId;
    const port = this;

    if (msg.action == "manualFill" && msg.selectedLoginIndex != null) {
        keefox_org.tabStates[tabId].framePorts[msg.frameId || 0].postMessage(msg);
        keefox_org.tabStates[tabId].framePorts[0].postMessage({ action: "closeAllPanels" });
    }

    if (msg.action == "closeAllPanels") {
        keefox_org.tabStates[tabId].framePorts[0].postMessage(msg);
    }

    if (msg.action == "generatePassword") {
        keefox_org.getPasswordProfiles(passwordProfiles => {
            keefox_org.generatePassword(msg.passwordProfile, keefox_org.tabStates[tabId].url, generatedPassword => {
                port.postMessage({ passwordProfiles: passwordProfiles, generatedPassword: generatedPassword } as AddonMessage);
            });
        });
    }
}

function pageDisconnect () {
    delete keefox_org.tabStates[this.sender.tab.id].framePorts[this.sender.frameId];

    // If we have no remaining page ports, we can assume this tab has closed and reclaim some memory
    if (keefox_org.tabStates[this.sender.tab.id].framePorts.length == 0)
        delete keefox_org.tabStates[this.sender.tab.id];
}

function iframeDisconnect () {
    delete keefox_org.tabStates[this.sender.tab.id].ourIframePorts[this.sender.frameId];
    delete keefox_org.tabStates[this.sender.tab.id].contentScriptInjected[this.sender.frameId];
}

function injectScriptsToTab (tabId: number) {
    chrome.webNavigation.getAllFrames({tabId: tabId}, frames => {
        for (const frame of frames) {
            if (frame.frameId === 0 || frame.url.startsWith("about:") || frame.url.startsWith("chrome:")) continue;
            if (!keefox_org.tabStates[tabId].contentScriptInjected[frame.frameId]) {
                browser.tabs.executeScript(tabId, { frameId: frame.frameId, file: "/common/dollar-polyfill.js" } as browser.tabs.InjectDetails);
                browser.tabs.executeScript(tabId, { frameId: frame.frameId, file: "/common/browser-polyfill.js" } as browser.tabs.InjectDetails);
                browser.tabs.executeScript(tabId, { frameId: frame.frameId, file: "/page/page.js" } as browser.tabs.InjectDetails);
                keefox_org.tabStates[tabId].contentScriptInjected[frame.frameId] = true;
            }
        }
    });
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


//TODO:c: below might be useful code from v1
//     setLoginActions: function (resultWrapper)
//     {
//         let isError = false;

//         try
//         {
//             if ("result" in resultWrapper && resultWrapper.result !== false && resultWrapper.result != null)
//             {
//                 let foundLogin = resultWrapper.result[0];

//                 var kfl = keeFoxLoginInfo();
//                 kfl.initFromEntry(foundLogin);

//                 let context = document.getElementById('KeeFox-login-context');
//                 let loadingMessage = document.getElementById('KeeFox-login-context-loading');

//                 if (kfl.uniqueID == loadingMessage.getAttribute('data-uuid')
//                     && kfl.database.fileName == loadingMessage.getAttribute('data-fileName'))
//                 {
//                     // We got an answer for the correct login

//                     // later we'll ignore the one marked as username
//                     let otherFieldCount = (kfl.otherFields != null && kfl.otherFields.length > 0) ? kfl.otherFields.length : 0;
//                     let usernameField = (otherFieldCount > 0) ? kfl.otherFields[kfl.usernameIndex] : null;

//                     // later we'll ignore the first password in the list
//                     let passwordFieldCount = (kfl.passwords != null && kfl.passwords.length > 0) ? kfl.passwords.length : 0;
//                     let passwordField = (passwordFieldCount > 0) ? kfl.passwords[0] : null;

//                     if (usernameField != null)
//                     {
//                         context = keefox_win.panel.addContextMenuItem(context,
//                            $STR("copy-username.label"),
//                            "chrome://keefox/skin/copy.png",
//                             "KeeFox-login-context-copyuser",
//                             function (event) {
//                                 keefox_org.utils.copyStringToClipboard(usernameField.value);
//                                 keefox_win.panel.CustomizableUI.hidePanelForNode(keefox_win.panel._currentWindow.document.getElementById('keefox-panelview'));
//                             });
//                     }

//                     if (passwordField != null) {
//                         context = keefox_win.panel.addContextMenuItem(context,
//                             $STR("copy-password.label"),
//                             "chrome://keefox/skin/copy.png",
//                             "KeeFox-login-context-copypass",
//                             function (event) {
//                                 keefox_org.utils.copyStringToClipboard(passwordField.value);
//                                 keefox_win.panel.CustomizableUI.hidePanelForNode(keefox_win.panel._currentWindow.document.getElementById('keefox-panelview'));
//                             });
//                     }
//                     if (otherFieldCount > 1 || passwordFieldCount > 1) {
//                         let copyOther = document.createElement('menu');
//                         copyOther.setAttribute("label", $STR("copy-other.label"));
//                         copyOther.id = "KeeFox-login-context-copyother";
//                         let copyOtherPopup = document.createElement('menupopup');
//                         copyOther.appendChild(copyOtherPopup);
//                         let validFieldFound = false;

//                         if (otherFieldCount > 1) {
//                             kfl.otherFields.forEach(function (o, i) {
//                                 if (i != kfl.usernameIndex && o.type != "checkbox") {
//                                     validFieldFound = true;
//                                     copyOtherPopup = keefox_win.panel.addContextMenuItem(copyOtherPopup,
//                                         o.name + " (" + o.fieldId + ")",
//                                         "chrome://keefox/skin/copy.png",
//                                         "",
//                                         function (event) {
//                                             keefox_org.utils.copyStringToClipboard(o.value);
//                                             keefox_win.panel.CustomizableUI.hidePanelForNode(keefox_win.panel._currentWindow.document.getElementById('keefox-panelview'));
//                                         });
//                                 }
//                             });
//                         }
//                         if (passwordFieldCount > 1) {
//                             kfl.passwords.forEach(function (p, i) {
//                                 if (i != 0 && p.type != "checkbox") {
//                                     validFieldFound = true;
//                                     copyOtherPopup = keefox_win.panel.addContextMenuItem(copyOtherPopup,
//                                     p.name + " (" + p.fieldId + ")",
//                                     "chrome://keefox/skin/copy.png",
//                                     "",
//                                     function (event) {
//                                         keefox_org.utils.copyStringToClipboard(p.value);
//                                         keefox_win.panel.CustomizableUI.hidePanelForNode(keefox_win.panel._currentWindow.document.getElementById('keefox-panelview'));
//                                     });
//                                 }
//                             });
//                         }
//                         if (validFieldFound)
//                             context.appendChild(copyOther);
//                     }

//                     context.removeChild(loadingMessage);
//                 } else
//                 {
//                     isError = true;
//                 }
//             } else
//             {
//                 isError = true;
//             }
//         } catch (e) {
//             isError = true;
//         }
//         return;
//     },
