import { AccountManager } from "./AccountManager";
import { PersistentTabState } from "./PersistentTabState";
import { jsonrpcClient } from "./jsonrpcClient";
import { ConfigSyncManager } from "./ConfigSyncManager";
import { NetworkAuth } from "./NetworkAuth";
import { AnimateIcon } from "./AnimateIcon";
import { NativeNotification } from "./NativeNotification";
import { commandManager } from "./commands";
import {
    browserPopupMessageHandler,
    pageMessageHandler,
    vaultMessageHandler,
    iframeMessageHandler
} from "./messageHandlers";
import { TabState } from "../common/TabState";
import { Utils, utils } from "../common/utils";
import { SearcherAll } from "../common/SearcherAll";
import { configManager } from "../common/ConfigManager";
import { KeeLog } from "../common/Logger";
import { AddonMessage } from "../common/AddonMessage";
import { FrameState } from "../common/FrameState";
import { VaultMessage } from "../common/VaultMessage";
import { KeeNotification } from "../common/KeeNotification";
import { VaultProtocol } from "../common/VaultProtocol";
import { SessionType } from "../common/SessionType";
import { Action } from "../common/Action";
import store from "../store";
import { SyncBackground } from "../store/syncBackground";
import { MutationPayload } from "vuex";
import { Database } from "../common/model/Database";
import { Entry } from "../common/model/Entry";
import { SaveEntryResult } from "../common/SaveEntryResult";

export class Kee {
    accountManager: AccountManager;
    tabStates: Map<number, TabState>;
    persistentTabStates: Map<number, PersistentTabState>;
    utils: Utils;
    search: SearcherAll;
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
    animateIcon: AnimateIcon;
    syncBackground: SyncBackground;

    constructor() {
        this.syncBackground = new SyncBackground(
            store,
            (mutation: MutationPayload, excludedPort: browser.runtime.Port) => {
                const allPorts: Partial<browser.runtime.Port>[] = [];
                allPorts.push(this.browserPopupPort);
                allPorts.push(this.vaultPort);

                const ts = window.kee.tabStates.get(window.kee.foregroundTabId);
                if (ts) {
                    ts.framePorts.forEach(port => {
                        allPorts.push(port);
                    });
                    ts.ourIframePorts.forEach(port => {
                        allPorts.push(port);
                    });
                }

                for (const port of allPorts) {
                    if (port !== excludedPort) {
                        try {
                            port.postMessage({ mutation } as AddonMessage);
                        } catch (e) {
                            // Sometimes dead ports are left lying around by the browser (especially
                            // during upgrades, etc.). We can do nothing about this but must not let
                            // it cause this function to fail to execute to the end.
                        }
                    }
                }
            }
        );
        this.accountManager = new AccountManager();

        this.tabStates = new Map<number, TabState>();
        this.persistentTabStates = new Map<number, PersistentTabState>();

        this.foregroundTabId = -1;

        this.utils = utils;

        this.search = new SearcherAll(store.state, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs
        });

        this.networkAuth = new NetworkAuth();
        this.animateIcon = new AnimateIcon();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.browserPopupPort = { postMessage: _msg => {} };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.vaultPort = { postMessage: _msg => {} };
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
                    clearTimeout(window.kee.currentSearchTermTimer);
                    p.onMessage.addListener(browserPopupMessageHandler.bind(p));
                    p.onDisconnect.addListener(() => {
                        window.kee.browserPopupPort = {
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            postMessage: _msg => {}
                        };
                        window.kee.currentSearchTermTimer = setTimeout(() => {
                            store.dispatch("updateCurrentSearchTerm", null);
                            store.dispatch("updateSearchResults", null);
                        }, configManager.current.currentSearchTermTimeout * 1000);
                    });

                    const connectMessage = {
                        initialState: store.state
                    } as AddonMessage;

                    let submittedData: any = null;
                    let loginsFound = false;

                    if (window.kee.persistentTabStates.get(window.kee.foregroundTabId)) {
                        window.kee.persistentTabStates
                            .get(window.kee.foregroundTabId)
                            .items.forEach(item => {
                                if (item.itemType === "submittedData") {
                                    submittedData = item.submittedData;
                                }
                            });
                    }

                    if (window.kee.tabStates.has(window.kee.foregroundTabId)) {
                        const frames = window.kee.tabStates.get(window.kee.foregroundTabId).frames;
                        const matchedFrameID = window.kee.frameIdWithMatchedLogins(frames);
                        if (matchedFrameID >= 0) {
                            loginsFound = true;
                            connectMessage.entries = frames.get(matchedFrameID).entries;
                            connectMessage.frameId = matchedFrameID;
                            connectMessage.tabId = window.kee.foregroundTabId;
                        }
                    }

                    store.dispatch("updateSubmittedData", submittedData);
                    store.dispatch("updateLoginsFound", loginsFound);

                    p.postMessage(connectMessage);
                    window.kee.browserPopupPort = p;
                    window.kee.resetBrowserActionColor();
                    break;
                }
                case "page": {
                    p.onMessage.addListener(pageMessageHandler.bind(p));

                    const tabId = p.sender.tab.id;
                    const frameId = p.sender.frameId;
                    const connectMessage = {
                        initialState: store.state,
                        frameId,
                        tabId,
                        isForegroundTab: tabId === window.kee.foregroundTabId
                    } as AddonMessage;

                    window.kee.createTabStateIfMissing(tabId);

                    if (frameId === 0) {
                        window.kee.tabStates.get(tabId).url = p.sender.tab.url;

                        if (window.kee.persistentTabStates.get(tabId)?.items?.length > 0) {
                            window.kee.persistentTabStates.get(
                                tabId
                            ).items = window.kee.persistentTabStates
                                .get(tabId)
                                .items.filter(
                                    item =>
                                        item.itemType !== "submittedData" ||
                                        item.creationDate > new Date(Date.now() - 3600000)
                                );
                        }
                    }
                    window.kee.tabStates.get(tabId).frames.set(frameId, new FrameState());
                    window.kee.tabStates.get(tabId).framePorts.set(frameId, p);
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
                        initialState: store.state,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === window.kee.foregroundTabId
                    } as VaultMessage;

                    window.kee.vaultPort = p;
                    p.postMessage(connectMessage);
                    break;
                }
                case "iframe": {
                    p.onMessage.addListener(iframeMessageHandler.bind(p));

                    const connectMessage = {
                        initialState: store.state,
                        frameState: window.kee.tabStates
                            .get(p.sender.tab.id)
                            .frames.get(parentFrameId),
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === window.kee.foregroundTabId
                    } as AddonMessage;

                    if (window.kee.persistentTabStates.get(p.sender.tab.id)) {
                        window.kee.persistentTabStates.get(p.sender.tab.id).items.forEach(item => {
                            if (item.itemType === "submittedData") {
                                connectMessage.submittedData = item.submittedData;
                            }
                        });
                    }

                    p.postMessage(connectMessage);
                    window.kee.tabStates
                        .get(p.sender.tab.id)
                        .ourIframePorts.set(p.sender.frameId, p);
                    break;
                }
            }
        };
    }

    frameIdWithMatchedLogins(frames: Map<number, FrameState>) {
        let frameId = -1;
        frames.forEach((frame, i) => {
            if (frameId == -1 && frame && frame.entries && frame.entries.length > 0) frameId = i;
        });
        return frameId;
    }

    async init() {
        // Create a timer for KPRPC connection establishment
        this.regularKPRPCListenerQueueHandlerTimer = setInterval(
            this.RegularKPRPCListenerQueueHandler,
            5000
        );

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
            if (
                this.accountManager.featureEnabledMultiSessionTypes &&
                !this.KeePassRPC.eventSessionManagerIsActive
            ) {
                this.inviteKeeVaultConnection();
            }
        });

        browser.runtime.onConnect.addListener(this.onPortConnected);

        this.networkAuth.startListening();

        await browser.privacy.services.passwordSavingEnabled.set({
            value: false
        });

        if (browser.runtime.lastError != null) {
            KeeLog.warn(
                "KeeFox was unable to disable built-in password manager saving - confusion may ensue! " +
                    browser.runtime.lastError.message
            );
        }
    }

    notifyUser(notification: KeeNotification, nativeNotification?: NativeNotification) {
        window.kee.removeUserNotifications((n: KeeNotification) => n.name != notification.name);
        store.dispatch("addNotification", notification);
        browser.browserAction.setIcon({
            path: "common/images/highlight-48.png"
        });
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
                    message:
                        $STR("notification_yellow_background") +
                        "\n" +
                        $STR("notification_only_shown_some_times")
                });
                configManager.setASAP({
                    notificationCountGeneric: configManager.current.notificationCountGeneric + 1
                });
            }
        }
    }

    removeUserNotifications(unlessTrue: (notification: KeeNotification) => boolean) {
        store.dispatch("updateNotifications", store.state.notifications.filter(unlessTrue));
    }

    animateBrowserActionIcon(duration = 1200) {
        // Firefox claims that a janky icon animation is less intrusive for users
        // than a smoothly animated one and therefore will not develop the smooth
        // animation support available in other browsers. Our user testing confirms
        // this is not the case so where we are able to (i.e. not Firefox) we
        // enable a nice smooth animation to subtly hint that they might want to
        // click on the icon. We have to make the animation in Firefox much less subtle :-(
        // https://bugzilla.mozilla.org/show_bug.cgi?format=default&id=1309347
        this.animateIcon.start(duration, !__KeeIsRunningInAWebExtensionsBrowser);
    }

    resetBrowserActionColor() {
        browser.browserAction.setIcon({ path: "common/images/48.png" });
    }

    shutdown() {
        // These log messages never appear. Does this function even get executed?
        KeeLog.debug("Kee module shutting down...");
        // if (this.KeePassRPC != undefined && this.KeePassRPC != null)
        //     this.KeePassRPC..session.shutdown();
        // if (this.regularKPRPCListenerQueueHandlerTimer != undefined && this.regularKPRPCListenerQueueHandlerTimer != null)
        //     clearInterval(this.regularKPRPCListenerQueueHandlerTimer);
        // this.KeePassRPC = null;

        KeeLog.debug("Kee module shut down.");
    }

    _keeBrowserStartup() {
        KeeLog.debug("Kee initialising");
        this.KeePassRPC = new jsonrpcClient();
        KeeLog.info(
            "Kee initialised OK although the connection to a KeePassRPC server is probably not established just yet..."
        );
    }

    // Temporarily disable Kee. Used (for e.g.) when KeePass is shut down.
    _pauseKee() {
        KeeLog.debug("Pausing Kee.");
        store.dispatch("updateKeePassDatabases", []);
        store.dispatch("updateActiveKeePassDatabaseIndex", -1);
        store.dispatch("updateConnected", false);
        store.dispatch("updateConnectedWebsocket", false);
        store.dispatch("updateCurrentSearchTerm", null);
        store.dispatch("updateSearchResults", null);

        try {
            this.refreshFormStatus(Action.ResetForms);
        } catch (e) {
            KeeLog.error(
                "Uncaught exception posting message in _pauseKee: " + e.message + " : " + e.stack
            );
        }

        browser.browserAction.setBadgeText({ text: "OFF" });
        browser.browserAction.setBadgeBackgroundColor({ color: "red" });

        commandManager.setupContextMenuItems();

        KeeLog.info("Kee paused.");
    }

    _refreshKPDB() {
        this.getAllDatabases();
        KeeLog.debug("Refresh of Kee's view of the KeePass database initiated.");
    }

    inviteKeeVaultConnection() {
        if (this.vaultPort) {
            this.vaultPort.postMessage({
                protocol: VaultProtocol.Reconnect
            } as VaultMessage);
        }
    }

    updateKeePassDatabases(newDatabases: Database[]) {
        //TODO:4: To improve performance we might need to determine if anything
        // has actually changed before doing the dispatches and poking the
        // current tab frames to find entries
        let newDatabaseActiveIndex = -1;
        for (let i = 0; i < newDatabases.length; i++) {
            if (newDatabases[i].active) {
                newDatabaseActiveIndex = i;
                break;
            }
        }
        store.dispatch("updateConnected", true);
        store.dispatch("updateConnectedWebsocket", this.KeePassRPC.websocketSessionManagerIsActive);
        store.dispatch("updateKeePassDatabases", newDatabases);
        store.dispatch("updateActiveKeePassDatabaseIndex", newDatabaseActiveIndex);
        store.dispatch("updateSearchResults", null);
        store.dispatch("updateCurrentSearchTerm", null);

        KeeLog.info("Number of databases open: " + newDatabases.length);

        if (newDatabases.length > 0) {
            browser.browserAction.setBadgeText({ text: "" });
            browser.browserAction.setBadgeBackgroundColor({ color: "blue" });
        } else {
            browser.browserAction.setBadgeText({ text: "OFF" });
            browser.browserAction.setBadgeBackgroundColor({ color: "orange" });
        }

        if (configManager.current.rememberMRUDB) {
            const MRUFN = this.getDatabaseFileName();
            if (MRUFN != null && MRUFN != undefined) configManager.current.keePassMRUDB = MRUFN;
            configManager.save();
        }

        try {
            this.refreshFormStatus(Action.DetectForms);
        } catch (e) {
            KeeLog.error(
                "Uncaught exception posting message in updateKeePassDatabases: " +
                    e.message +
                    " : " +
                    e.stack
            );
        }

        commandManager.setupContextMenuItems();
    }

    private refreshFormStatus(action: Action) {
        window.kee.tabStates.forEach((ts, tabId) => {
            //TODO:4: This should be equivalent but much faster than testing in the inner
            // loop. Unless tabId does not equal port.sender.tab.id?
            //if (tabId !== this.foregroundTabId) return;

            ts.framePorts.forEach((port, key, map) => {
                try {
                    if (port.sender.tab.id === this.foregroundTabId) {
                        port.postMessage({ action } as AddonMessage);
                    }
                } catch (e) {
                    if (KeeLog && KeeLog.info) {
                        KeeLog.info(
                            "failed to request form field reset/update on tab " +
                                tabId +
                                ". Assuming port is broken (possible browser bug) and deleting the port. " +
                                "Kee may no longer work in the affected tab, if indeed the tab even " +
                                "exists any more. The exception that caused this is: " +
                                e.message +
                                " : " +
                                e.stack
                        );
                    }
                    map.delete(key);
                }
            }, this);
        }, this);
    }

    // if the MRU database is known, open that but otherwise send empty string which will cause user
    // to be prompted to choose a DB to open
    getKeePassFileNameToOpen() {
        let databaseFileName = configManager.current.keePassDBToOpen;
        if (databaseFileName == "" || this.isKeeVaultFileName(databaseFileName)) {
            databaseFileName = configManager.current.keePassMRUDB;
        }
        return !this.isKeeVaultFileName(databaseFileName) ? databaseFileName : "";
    }

    getVaultFileNameToOpen() {
        let databaseFileName = configManager.current.keePassDBToOpen;
        if (databaseFileName == "" || !this.isKeeVaultFileName(databaseFileName)) {
            databaseFileName = configManager.current.keePassMRUDB;
        }
        return this.isKeeVaultFileName(databaseFileName) ? databaseFileName : "";
    }

    isKeeVaultFileName(name: string) {
        if (name.indexOf("-") === -1) return false;
        if (name.indexOf("/") >= 0 || name.indexOf("\\") >= 0) return false;
        return true;
    }

    openKeePass() {
        const hasWebsocketDBs = store.state.KeePassDatabases.some(
            db => db.sessionType === SessionType.Websocket
        );
        const supportsWebsocketFocus = store.state.KeePassDatabases.some(
            db =>
                db.sessionType === SessionType.Websocket &&
                db.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE") >= 0
        );

        if (hasWebsocketDBs && !supportsWebsocketFocus) {
            KeeLog.warn(
                "Can't open KeePass because KeePassRPC version does not support KPRPC_OPEN_AND_FOCUS_DATABASE"
            );
            return;
        }

        this.selectDatabase(
            this.getKeePassFileNameToOpen(),
            !hasWebsocketDBs,
            SessionType.Websocket
        );
    }

    async loginToPasswordManager() {
        const sessionType = await this.selectAndFocusDatabase(
            this.getVaultFileNameToOpen(),
            this.getKeePassFileNameToOpen()
        );
        if (sessionType !== SessionType.Websocket) {
            const vaultTabs = await browser.tabs.query({
                url: [
                    "https://keevault.pm/*",
                    "https://app-beta.kee.pm/*",
                    "https://app-dev.kee.pm/*"
                ]
            });
            if (vaultTabs && vaultTabs[0]) {
                browser.tabs.update(vaultTabs[0].id, { active: true });
                browser.windows.update(vaultTabs[0].windowId, { focused: true });
            } else {
                browser.tabs.create({
                    url: "https://keevault.pm/",
                    active: true
                });
            }
        }
    }

    recordEntrySaveResult(saveType: "updated" | "created", entry?: Entry) {
        if (!entry) {
            store.dispatch("updateSaveEntryResult", {
                result: "error",
                receivedAt: new Date()
            } as SaveEntryResult);
            return false;
        } else {
            store.dispatch("updateSaveEntryResult", {
                result: saveType,
                receivedAt: new Date(),
                fileName: entry.database.fileName,
                uuid: entry.uuid
            } as SaveEntryResult);
            return true;
        }
    }

    /*******************************************
    / These functions are essentially wrappers for the actions that
    / Kee needs to take against KeePass via the KeePassRPC plugin connection.
    /*******************************************/

    getDatabaseName(index) {
        if (index == undefined) index = store.state.ActiveKeePassDatabaseIndex;
        if (
            store.state.KeePassDatabases.length > 0 &&
            store.state.KeePassDatabases[index] != null &&
            store.state.KeePassDatabases[index].root != null
        ) {
            return store.state.KeePassDatabases[index].name;
        } else return null;
    }

    getDatabaseFileName(index?) {
        if (index == undefined) index = store.state.ActiveKeePassDatabaseIndex;
        if (
            store.state.KeePassDatabases.length > 0 &&
            store.state.KeePassDatabases[index] != null &&
            store.state.KeePassDatabases[index].root != null
        ) {
            return store.state.KeePassDatabases[index].fileName;
        } else return null;
    }

    selectDatabase(fileName, requestReturnFocus, sessionType?: SessionType) {
        try {
            this.KeePassRPC.selectDB(fileName, requestReturnFocus, sessionType);
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    selectAndFocusDatabase(vaultFileName: string, keepassFilename: string) {
        try {
            return this.KeePassRPC.selectAndFocusDatabase(vaultFileName, keepassFilename);
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    async addLogin(
        entry: Entry,
        parentUUID: string,
        dbFileName: string,
        clearSubmittedData: () => void
    ) {
        try {
            const newEntry = await this.KeePassRPC.addLogin(entry, parentUUID, dbFileName);
            const success = this.recordEntrySaveResult("created", newEntry);
            if (success) clearSubmittedData();
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    async updateLogin(
        entry: Entry,
        oldLoginUUID: string,
        dbFileName: string,
        clearSubmittedData: () => void
    ) {
        try {
            const changedEntry = await this.KeePassRPC.updateLogin(entry, oldLoginUUID, dbFileName);
            const success = this.recordEntrySaveResult("updated", changedEntry);
            if (success) clearSubmittedData();
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    getAllDatabases() {
        try {
            return this.KeePassRPC.getAllDatabases();
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    async findLogins(fullURL, httpRealm, uuid, dbFileName, freeText, username) {
        try {
            return this.KeePassRPC.findLogins(
                fullURL,
                httpRealm,
                uuid,
                dbFileName,
                freeText,
                username
            );
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    launchLoginEditor(uuid, dbFileName) {
        try {
            this.KeePassRPC.launchLoginEditor(uuid, dbFileName);
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    launchGroupEditor(uuid, dbFileName) {
        try {
            this.KeePassRPC.launchGroupEditor(uuid, dbFileName);
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    async getPasswordProfiles() {
        try {
            return this.KeePassRPC.getPasswordProfiles();
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    async generatePassword(profileName: string, url: string) {
        try {
            return this.KeePassRPC.generatePassword(profileName, url);
        } catch (e) {
            KeeLog.error(
                "Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " +
                    e
            );
            throw e;
        }
    }

    // Could use multiple callback functions but just one keeps KeePassRPC simpler
    // this is only called once no matter how many windows are open. so functions
    // within need to handle all open windows for now, that just means every
    // window although in future maybe there could be a need to store a list of
    // relevant windows and call those instead
    KPRPCListener(sig) {
        const sigTime = Date();

        KeeLog.debug("Signal received by KPRPCListener (" + sig + ") @" + sigTime);

        let executeNow = false;
        let refresh = false;

        switch (sig) {
            case "0":
                KeeLog.warn("KeePassRPC is requesting authentication [deprecated].");
                break;
            case "3":
                KeeLog.info("KeePass' currently active DB is about to be opened.");
                break;
            case "4":
                KeeLog.info("KeePass' currently active DB has just been opened.");
                refresh = true;
                break;
            case "5":
                KeeLog.info("KeePass' currently active DB is about to be closed.");
                break;
            case "6":
                KeeLog.info("KeePass' currently active DB has just been closed.");
                refresh = true;
                break;
            case "7":
                KeeLog.info("KeePass' currently active DB is about to be saved.");
                break;
            case "8":
                KeeLog.info("KeePass' currently active DB has just been saved.");
                refresh = true;
                break;
            case "9":
                KeeLog.info("KeePass' currently active DB is about to be deleted.");
                break;
            case "10":
                KeeLog.info("KeePass' currently active DB has just been deleted.");
                break;
            case "11":
                KeeLog.info("KeePass' active DB has been changed/selected.");
                refresh = true;
                break;
            case "12":
                KeeLog.info(
                    "KeePass is shutting down. [deprecated: Now inferred from connection loss]"
                );
                break;
            default:
                KeeLog.error("Invalid signal received by KPRPCListener (" + sig + ")");
                break;
        }

        if (!refresh) return;

        const now = new Date().getTime();

        // If there is nothing in the queue at the moment we can process this callback straight away
        if (!window.kee.processingCallback && window.kee.pendingCallback == "") {
            KeeLog.debug("Signal executing now. @" + sigTime);
            window.kee.processingCallback = true;
            executeNow = true;
        }
        // Otherwise we need to add the action for this callback to a queue and leave it up to the regular callback processor to execute the action

        if (refresh) {
            if (executeNow) {
                store.dispatch("updateLastKeePassRPCRefresh", now);
                window.kee._refreshKPDB();
            } else {
                window.kee.pendingCallback = "_refreshKPDB";
            }
        }

        KeeLog.debug("Signal handled or queued. @" + sigTime);
        if (executeNow) {
            //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
            try {
                if (window.kee.pendingCallback == "_refreshKPDB") window.kee._refreshKPDB();
                else KeeLog.debug("A pending signal was found and handled.");
            } finally {
                window.kee.pendingCallback = "";
                window.kee.processingCallback = false;
            }
            KeeLog.debug("Signal handled. @" + sigTime);
        }
    }

    RegularKPRPCListenerQueueHandler() {
        // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
        if (window.kee.processingCallback || window.kee.pendingCallback == "") return;

        KeeLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
        window.kee.processingCallback = true;
        try {
            if (window.kee.pendingCallback == "_refreshKPDB") window.kee._refreshKPDB();
        } finally {
            window.kee.pendingCallback = "";
            window.kee.processingCallback = false;
        }
        KeeLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
    }

    createTabStateIfMissing(tabId: number) {
        if (!window.kee.tabStates.has(tabId)) {
            window.kee.tabStates.set(tabId, new TabState());
        }
    }

    deleteTabState(tabId: number) {
        window.kee.tabStates.delete(tabId);
    }

    initiatePasswordGeneration() {
        if (store.state.connected) {
            const tabState = window.kee.tabStates.get(window.kee.foregroundTabId);
            if (tabState) {
                const framePort = tabState.framePorts.get(0);
                if (framePort) {
                    framePort.postMessage({ action: Action.GeneratePassword });
                    return;
                }
            }
            // Focussed on a Kee Vault tab or other tab we are not allowed to inject content scripts into
            if (window.kee.vaultPort) {
                window.kee.vaultPort.postMessage({
                    protocol: VaultProtocol.ShowGenerator
                } as VaultMessage);
                browser.tabs.update(window.kee.vaultPort.sender.tab.id, {
                    active: true
                });
                browser.windows.update(window.kee.vaultPort.sender.tab.windowId, { focused: true });
            }
        }
    }
}
