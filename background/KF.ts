/// <reference path="../common/config.ts" />
/// <reference path="search.ts" />
/// <reference path="../common/Logger.ts" />
/// <reference path="commands.ts" />
/// <reference path="utils.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />
/// <reference path="../common/KeeFoxNotification.ts" />

class KeeFox {

    appState: AppState;
    utils: Utils;
    search: Search;
    foregroundTabId: number;

    regularKPRPCListenerQueueHandlerTimer: number;

    _KFLog: KeeFoxLogger;

    // Our link to the JSON-RPC objects required for communication with KeePass
    KeePassRPC: jsonrpcClient;

    _installerTabLoaded: boolean;

    processingCallback: boolean;
    pendingCallback: string;
    urlToOpenOnStartup: string;
    ports: {
        tabs: browser.runtime.Port[][];
        browserPopup: Partial<browser.runtime.Port>;
        onConnected: any;
    };

    constructor ()
    {
        // Make sure user knows we're not ready yet
        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        this.appState = {
            latestConnectionError: "",
            lastKeePassRPCRefresh: 0,
            ActiveKeePassDatabaseIndex: -1,
            KeePassDatabases: [],
            notifications: [],
            connected: false,
            config: config
        };

        this.foregroundTabId = -1;

        this._KFLog = KeeFoxLog;
        this.utils = utils;

        this.search = new Search(this, {
            version: 1,
            searchAllDatabases: config.searchAllOpenDBs
        });

        //TODO:c: tutorial guides, etc.
        //this.tutorialHelper = tutorialHelper;
        //this.sampleChecker = sampleChecker;

        // Create a timer for checking whether user is logging sensitive data
        setTimeout(utils.oneOffSensitiveLogCheckHandler, 45000);

        // Create a timer for KPRPC connection establishment
        this.regularKPRPCListenerQueueHandlerTimer = setInterval(this.RegularKPRPCListenerQueueHandler, 5000);

        this.appState.lastKeePassRPCRefresh = 0;
        this.appState.ActiveKeePassDatabaseIndex = 0;
        this._keeFoxBrowserStartup();

        this.ports = {
            tabs: [],
            browserPopup: {postMessage: msg => {} },
            onConnected: function (p: browser.runtime.Port) {
                switch (p.name) {
                    case "browserPopup": {
                        p.onMessage.addListener(browserPopupMessageHandler);
                        p.onDisconnect.addListener(browserPopupDisconnect);
                        p.postMessage({ appState: keefox_org.appState });
                        keefox_org.ports.browserPopup = p;
                        break;
                    }
                    case "page": {
                        p.onMessage.addListener(pageMessageHandler.bind(p));
                        p.onDisconnect.addListener(pageDisconnect.bind(p));
                        p.postMessage({ appState: keefox_org.appState, frameId: p.sender.frameId, tabId: p.sender.tab.id, isForegroundTab: p.sender.tab.id === keefox_org.foregroundTabId } as AddonMessage);
                        const tab = keefox_org.ports.tabs[p.sender.tab.id];
                        if (!tab)
                            keefox_org.ports.tabs[p.sender.tab.id] = [];
                        keefox_org.ports.tabs[p.sender.tab.id][p.sender.frameId] = p;
                        break;
                    }
                }

            }
        };

        browser.runtime.onConnect.addListener(this.ports.onConnected);

        browser.tabs.onActivated.addListener(event => {
                keefox_org.foregroundTabId = event.tabId;
                //TODO:c: Is this the right time to send updated appstate and potentially scan for new form fields?
                //TODO:c: Should we inform all inactive tabs too?
                const frames = keefox_org.ports.tabs[event.tabId];

                if (frames) // Might not have had time to setup the port yet //TODO:c: (also, existing tabs when extension installed won't have our code running in them until we add support for that)
                {
                    frames.forEach(port => {
                        port.postMessage({ appState: keefox_org.appState, isForegroundTab: true } as AddonMessage);
                    });
                }
            }
        );
        // browser.tabs.onUpdated.addListener((id, event) =>
        //     event.url
        // );

        // browser.browserAction.onClicked.addListener(function() {
        //     this.ports.browserPopup.postMessage({appState: {connected:true}});
        // });
    }


    notifyUser (notification: KeeFoxNotification) {
        if (!notification.allowMultiple) {
            keefox_org.removeUserNotifications((n: KeeFoxNotification) => n.name != notification.name);
        }
        keefox_org.appState.notifications.push(notification);
        keefox_org.ports.browserPopup.postMessage({appState: keefox_org.appState});
    }

    removeUserNotifications (test: (notification: KeeFoxNotification) => boolean) {
        keefox_org.appState.notifications = keefox_org.appState.notifications.filter(test);
        keefox_org.ports.browserPopup.postMessage({appState: keefox_org.appState});
    }

    getDBbyFilename (fileName)
    {
        this._KFLog.debug("Getting database for filename: " + fileName);
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
        this._KFLog.debug("KeeFox module shutting down...");
        // if (this.KeePassRPC != undefined && this.KeePassRPC != null)
        //     this.KeePassRPC..session.shutdown();
        // if (this.regularKPRPCListenerQueueHandlerTimer != undefined && this.regularKPRPCListenerQueueHandlerTimer != null)
        //     clearInterval(this.regularKPRPCListenerQueueHandlerTimer);
        // this.KeePassRPC = null;

        this._KFLog.debug("KeeFox module shut down.");
        this._KFLog = null;
    }

    _keeFoxBrowserStartup ()
    {
        this._KFLog.info("KeeFox initialising");

        //this._keeFoxVariableInit();
        this.KeePassRPC = new jsonrpcClient();
        this.KeePassRPC.startup();

        this._KFLog.info("KeeFox initialised OK although the connection to KeePass may not be established just yet...");
    }

    // Temporarilly disable KeeFox. Used (for e.g.) when KeePass is shut down.
    _pauseKeeFox ()
    {
        this._KFLog.debug("Pausing KeeFox.");
        this.appState.KeePassDatabases = null;
        this.appState.ActiveKeePassDatabaseIndex = -1;
        this.appState.connected = false;
        keefox_org.ports.browserPopup.postMessage( { appState: this.appState });

        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        // Poke every port. In future might just limit to active tab?
        keefox_org.ports.tabs.forEach(frame => {
            frame.forEach(port => {
                port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
            }, this);
        }, this);

        this._KFLog.info("KeeFox paused.");
    }

    _refreshKPDB ()
    {
        this.getAllDatabases();
        this._KFLog.debug("Refresh of KeeFox's view of the KeePass database initiated.");
    }

    updateKeePassDatabases (newDatabases)
    {
        let newDatabaseActiveIndex = -1; //TODO:c: check if this is a problem. maybe used to be always 0+ but think should be -1 for when no DB is active but might reveal old bugs
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

        this._KFLog.info("Number of databases open: " + newDatabases.length);

        if (newDatabases.length > 0) {
            browser.browserAction.setBadgeText({ text: "" });
            browser.browserAction.setBadgeBackgroundColor({ color: "blue" });
        } else {
            browser.browserAction.setBadgeText({ text: "OFF" });
            browser.browserAction.setBadgeBackgroundColor({ color: "orange" });
        }

        if (config.rememberMRUDB)
        {
            const MRUFN = this.getDatabaseFileName();
            if (MRUFN != null && MRUFN != undefined && !(MRUFN instanceof Error))
                configManager.setASAP({ keePassMRUDB: MRUFN });
        }

        keefox_org.ports.browserPopup.postMessage( { appState: this.appState });

        // Poke every port. In future might just limit to active tab?
        keefox_org.ports.tabs.forEach(frame => {
            frame.forEach(port => {
                port.postMessage({ appState: this.appState, isForegroundTab: port.sender.tab.id === this.foregroundTabId });
            }, this);
        }, this);

//TODO:c: update context menu?
    }

    // if the MRU database is known, open that but otherwise send empty string which will cause user
    // to be prompted to choose a DB to open
    loginToKeePass ()
    {
        let databaseFileName = config.keePassDBToOpen;
        if (databaseFileName == "")
            databaseFileName = config.keePassMRUDB;

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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
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
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
            throw e;
        }
    }

    getPasswordProfiles ()
    {
        try
        {
            return this.KeePassRPC.getPasswordProfiles();
        } catch (e)
        {
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
            throw e;
        }
    }

    generatePassword (profileName, url)
    {
        try
        {
            return this.KeePassRPC.generatePassword(profileName, url);
        } catch (e)
        {
            this._KFLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the KeeFox team that they should be handling this exception: " + e);
            throw e;
        }
    }

    //TODO:c:implement necessary observers
    //TODO:c:security - need to notice change of sensitive loggin setting
    /*
    _observer :
    {
        _kf : null,

        QueryInterface : XPCOMUtils.generateQI([Ci.nsIObserver,
                                                Ci.nsISupportsWeakReference]),
        // nsObserver
        observe = function (subject, topic, data)
        {

            switch(topic)
            {
                case "nsPref:changed":
                    window.keefox_org._KFLog.debug("Observed an event: " + subject + "," + topic + "," + data);
                    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
                                       .getService(Ci.nsIWindowMediator);
                    var window = wm.getMostRecentWindow("navigator:browser") ||
                        wm.getMostRecentWindow("mail:3pane");

                    // get a reference to the prompt service component.
                    var promptService = Cc["@mozilla.org/embedcomp/prompt-service;1"]
                                    .getService(Ci.nsIPromptService);
                    subject.QueryInterface(Ci.nsIPrefBranch);

                    this.preferenceChangeResponder(subject, data, window, promptService);
                    break;
                case "http-on-modify-request":
                    // Send a custom header to the tutorial website so we know that
                    // the user is running KeeFox 1.5 or above. We don't send any
                    // details (such as the exact version) until the tutorial page
                    // requests the information via a custom Javascript event.
                    let httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);

                    // This can throw a NS_ERROR_FAILURE sometimes. No idea why - maybe some
                    // requests have no host? Anyway, it's not something we're interested in
                    // but is unfortunate because we now have to try/catch just in case
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
                    break;
            }
        }

        preferenceChangeResponder = function (prefBranch, prefName, window, promptService)
        {
            switch (prefName)
            {
                case "logSensitiveData":
                    // Allow the change to go ahead but warn the user (in case they did not understand the change that was made)
                    window.keefox_org._KFLog.configureFromPreferences();
                    utils.oneOffSensitiveLogCheckHandler();
                    break;
                case "searchAllOpenDBs":
                    keefox_org.search.reconfigure({
                        version: 1,
                        searchAllDatabases: keefox_org._keeFoxExtension.prefs.getValue("searchAllOpenDBs", true)
                    });
                    break;
                case "listAllOpenDBs":
                    keefox_org._refreshKPDB();
                    break;
                case "alwaysDisplayUsernameWhenTitleIsShown":
                    keefox_org._refreshKPDB();
                    break;
            }
        }

        notify = function (subject, topic, data) { }
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

        keefox_org._KFLog.debug("Signal received by KPRPCListener (" + sig + ") @" + sigTime);

        let executeNow = false;
        let pause = false;
        let refresh = false;

        switch (sig) {
            case "0": keefox_org._KFLog.info("KeePassRPC is requesting authentication [deprecated]."); break;
            case "3": keefox_org._KFLog.info("KeePass' currently active DB is about to be opened."); break;
            case "4": keefox_org._KFLog.info("KeePass' currently active DB has just been opened.");
                refresh = true;
                break;
            case "5": keefox_org._KFLog.info("KeePass' currently active DB is about to be closed."); break;
            case "6": keefox_org._KFLog.info("KeePass' currently active DB has just been closed.");
                refresh = true;
                break;
            case "7": keefox_org._KFLog.info("KeePass' currently active DB is about to be saved."); break;
            case "8": keefox_org._KFLog.info("KeePass' currently active DB has just been saved.");
                refresh = true;
                break;
            case "9": keefox_org._KFLog.info("KeePass' currently active DB is about to be deleted."); break;
            case "10": keefox_org._KFLog.info("KeePass' currently active DB has just been deleted."); break;
            case "11": keefox_org._KFLog.info("KeePass' active DB has been changed/selected.");
                refresh = true;
                break;
            case "12": keefox_org._KFLog.info("KeePass is shutting down.");
                pause = true;
                break;
            default: keefox_org._KFLog.error("Invalid signal received by KPRPCListener (" + sig + ")"); break;
        }

        if (!pause && !refresh)
            return;

        const now = (new Date()).getTime();

        // If there is nothing in the queue at the moment we can process this callback straight away
        if (!keefox_org.processingCallback && keefox_org.pendingCallback == "")
        {
            keefox_org._KFLog.debug("Signal executing now. @" + sigTime);
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

        keefox_org._KFLog.info("Signal handled or queued. @" + sigTime);
        if (executeNow)
        {
            //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
            if (keefox_org.pendingCallback=="_pauseKeeFox")
                keefox_org._pauseKeeFox();
            else if (keefox_org.pendingCallback=="_refreshKPDB")
                keefox_org._refreshKPDB();
            else
                keefox_org._KFLog.info("A pending signal was found and handled.");
            keefox_org.pendingCallback = "";
            keefox_org.processingCallback = false;
            keefox_org._KFLog.info("Signal handled. @" + sigTime);
        }
    }

    RegularKPRPCListenerQueueHandler ()
    {
        // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
        if (keefox_org.processingCallback || keefox_org.pendingCallback == "")
            return;

        keefox_org._KFLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
        keefox_org.processingCallback = true;
        if (keefox_org.pendingCallback=="_pauseKeeFox")
            keefox_org._pauseKeeFox();
        else if (keefox_org.pendingCallback=="_refreshKPDB")
            keefox_org._refreshKPDB();
        keefox_org.pendingCallback = "";
        keefox_org.processingCallback = false;
        keefox_org._KFLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
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
            if (this._KFLog.logSensitiveData)
            {
                this._KFLog.info("favicon load failed for " + url + " : " + ex);
                throw "We couldn't find a favicon for this URL: " + url + " BECAUSE: " + ex;
            } else
            {
                this._KFLog.info("favicon load failed: " + ex);
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

};

let keefox_org = new KeeFox();

// attach our utils so it can be called from outside this module
keefox_org.utils = utils;


// callbacks for messaging / ports

function browserPopupMessageHandler (msg: AddonMessage) {
    console.log("In background script, received message from browser popup script: " + msg);

    if (msg.removeNotification) {
        delete keefox_org.appState.notifications[msg.removeNotification];
        keefox_org.ports.browserPopup.postMessage({ appState: keefox_org.appState });
    }
    if (msg.loadUrlHelpSensitiveLogging) {
        browser.tabs.create({
            "url": "https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive"
        });
    }
};

function browserPopupDisconnect () {
    // Just keeps other code neater if we can assume there's always a non-null message reciever
    keefox_org.ports.browserPopup = {postMessage: msg => {}};
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
        keefox_org.ports.browserPopup.postMessage({ appState: keefox_org.appState, isForegroundTab: this.sender.tab.id === keefox_org.foregroundTabId } as AddonMessage);
    }
};

function pageDisconnect () {
    delete keefox_org.ports.tabs[this.sender.tab.id][this.sender.frameId];
    if (keefox_org.ports.tabs[this.sender.tab.id].length == 0)
        delete keefox_org.ports.tabs[this.sender.tab.id];
}

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
