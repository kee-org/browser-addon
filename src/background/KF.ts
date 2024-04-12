import { isFirefox } from "webext-detect-page";
import { PersistentTabState } from "./PersistentTabState";
import { jsonrpcClient } from "./jsonrpcClient";
import { NetworkAuth } from "./NetworkAuth";
//import { AnimateIcon } from "./AnimateIcon";
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
import type { AddonMessage } from "../common/AddonMessage";
import { FrameState } from "../common/FrameState";
import type { VaultMessage } from "../common/VaultMessage";
import { KeeNotification } from "../common/KeeNotification";
import { VaultProtocol } from "../common/VaultProtocol";
import { SessionType } from "../common/SessionType";
import { Action } from "../common/Action";
import { Database } from "../common/model/Database";
import { Entry } from "../common/model/Entry";
import { SaveEntryResult } from "../common/SaveEntryResult";
import BackgroundStore from "~/store/BackgroundStore";
import { Mutation } from "~/store/Mutation";
import { accountManager } from "./AccountManager";

class Kee {
    tabStates: Map<number, TabState>;
    persistentTabStates: Map<number, PersistentTabState>;
    utils: Utils;
    search: SearcherAll;
    foregroundTabId: number;

    regularKPRPCListenerQueueHandlerTimer: number;
    currentSearchTermTimer: number;

    // Our link to the JSON-RPC objects required for communication with KeePass
    KeePassRPC: jsonrpcClient;

    //TODO: Make many other vars a singleton so we can just import it to other places that depend on it

    _installerTabLoaded: boolean;

    processingCallback: boolean;
    pendingCallback: string;
    urlToOpenOnStartup: string;

    browserPopupPort: Partial<chrome.runtime.Port>;
    vaultPort: Partial<chrome.runtime.Port>;
    onPortConnected: (p: chrome.runtime.Port) => void;

    networkAuth: NetworkAuth;
    store: BackgroundStore;

    private static instance: Kee;

    public static getInstance(): Kee {
        if (!Kee.instance) {
            Kee.instance = new Kee();
        }
        return Kee.instance;
    }

    private constructor() {
        this.store = new BackgroundStore((mutation: Mutation, excludedPort: chrome.runtime.Port) => {

            function tryPostMessage(port: Partial<chrome.runtime.Port>, mutationObj: any): boolean {
                try {
                    port.postMessage({ mutation: mutationObj } as AddonMessage);
                    return true;
                } catch (e) {
                    KeeLog.warn("Dead port found", e);
                    // Sometimes dead ports are left lying around by the browser (especially
                    // during upgrades, etc.). We can do nothing about this except try to
                    // tidy up our reference to it and must not let it cause a failure to post to any valid ports.
                    return false;
                }
            }
            //TODO: Find a way to more efficiently distribute Pinia Patch objects / Vue3 Proxy objects without this additional JSON mapping / manipulation
            const json = JSON.stringify(mutation);
            KeeLog.debug("New background mutation for distribution");
            const mutationObj = JSON.parse(json);

            //TODO: Maybe try to tidy up these ports too? Should already be dealt with elsewhere and they are a bit more complex because some things expect them to always exist as at least a stub.
            if (this.browserPopupPort !== excludedPort) tryPostMessage(this.browserPopupPort, mutationObj);
            if (this.vaultPort !== excludedPort) tryPostMessage(this.vaultPort, mutationObj);

            const foregroundTabState = this.tabStates.get(this.foregroundTabId);
            if (foregroundTabState) {
                for (const [id, port] of foregroundTabState.framePorts) {
                    if (port !== excludedPort && !tryPostMessage(port, mutationObj)) {
                        foregroundTabState.framePorts.delete(id);
                    }
                }
                for (const [id, port] of foregroundTabState.ourIframePorts) {
                    if (port !== excludedPort && !tryPostMessage(port, mutationObj)) {
                        foregroundTabState.ourIframePorts.delete(id);
                    }
                }
            }
        });

        this.tabStates = new Map<number, TabState>();
        this.persistentTabStates = new Map<number, PersistentTabState>();

        this.foregroundTabId = -1;

        this.utils = utils;

        this.search = new SearcherAll(this.store.state, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs
        });

        //this.animateIcon = new AnimateIcon();

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.browserPopupPort = { postMessage: _msg => { } };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.vaultPort = { postMessage: _msg => { } };
        this.onPortConnected = async function (p: chrome.runtime.Port) {
            if (KeeLog && KeeLog.debug) KeeLog.debug(p.name + " port connected");
            let name = p.name;
            let parentFrameId: number;
            if (name.startsWith("iframe")) {
                parentFrameId = parseInt(name.substr(7));
                name = "iframe";
            }
            switch (name) {
                case "browserPopup": {
                    clearTimeout(this.currentSearchTermTimer);
                    p.onMessage.addListener(browserPopupMessageHandler.bind(p));
                    p.onDisconnect.addListener(() => {
                        this.browserPopupPort = {
                            // eslint-disable-next-line @typescript-eslint/no-empty-function
                            postMessage: _msg => { }
                        };
                        this.currentSearchTermTimer = self.setTimeout(() => {
                            this?.store?.updateCurrentSearchTerm(null);
                            this?.store?.updateSearchResults(null);
                        }, configManager.current.currentSearchTermTimeout * 1000);
                    });

                    let submittedData: any = null;
                    let loginsFound = false;

                    if (this.persistentTabStates.get(this.foregroundTabId)) {
                        this.persistentTabStates
                            .get(this.foregroundTabId)
                            .items.forEach(item => {
                                if (item.itemType === "submittedData") {
                                    submittedData = item.submittedData;
                                }
                            });
                    }

                    const matchedLogins: any = {};
                    if (this.tabStates.has(this.foregroundTabId)) {
                        const frames = this.tabStates.get(this.foregroundTabId).frames;
                        const matchedFrameID = this.frameIdWithMatchedLogins(frames);
                        if (matchedFrameID >= 0) {
                            loginsFound = true;
                            matchedLogins.entries = frames.get(matchedFrameID).entries;
                            matchedLogins.frameId = matchedFrameID;
                            matchedLogins.tabId = this.foregroundTabId;
                        }
                    }

                    this.store.updateSubmittedData(submittedData);
                    this.store.updateLoginsFound(loginsFound);

                    const connectMessage = {
                        initialState: this.store.state
                    } as AddonMessage;

                    if (matchedLogins.entries) {
                        connectMessage.entries = matchedLogins.entries;
                        connectMessage.frameId = matchedLogins.frameId;
                        connectMessage.tabId = matchedLogins.tabId;
                    }

                    try {
                        p.postMessage(connectMessage);
                    } catch (e) {
                        KeeLog.error("postMessage error", e);
                    }
                    this.browserPopupPort = p;

                    this.resetBrowserActionColor();
                    break;
                }
                case "page": {
                    p.onMessage.addListener(pageMessageHandler.bind(p));

                    const tabId = p.sender.tab.id;
                    const frameId = p.sender.frameId;
                    const connectMessage = {
                        initialState: this.store.state,
                        frameId,
                        tabId,
                        isForegroundTab: tabId === this.foregroundTabId
                    } as AddonMessage;

                    //TODO: Also need p.onDisconnect.addListener(() => { here?
                    // p.onDisconnect.addListener(port => {
                    //     const states = this.tabStates.get(tabId);
                    //     states.frames.delete(frameId);
                    //     states.framePorts.delete(frameId);

                    // });
                    this.createTabStateIfMissing(tabId);

                    if (frameId === 0) {
                        this.tabStates.get(tabId).url = p.sender.tab.url;

                        if (this.persistentTabStates.get(tabId)?.items?.length > 0) {
                            this.persistentTabStates.get(
                                tabId
                            ).items = this.persistentTabStates
                                .get(tabId)
                                .items.filter(
                                    item =>
                                        item.itemType !== "submittedData" ||
                                        item.creationDate > new Date(Date.now() - 3600000)
                                );
                        }
                    }
                    this.tabStates.get(tabId).frames.set(frameId, new FrameState());
                    this.tabStates.get(tabId).framePorts.set(frameId, p);
                    p.postMessage(connectMessage);
                    break;
                }
                case "vault": {
                    p.onMessage.addListener(vaultMessageHandler.bind(p));
                    //TODO: below is too complex.? Maybe can close over the tabid/frameid or something?
                    /* Potentially could/should call messageCloseSession() when the port is disconnected but
                     earlier experience suggests disconnection does not occur before a new port is connected in Firefox due to a
                     bug (works fine in Chrome) so we would risk closing the freshly opened session instead.
                    p.onDisconnect.addListener(this.messageCloseSession();)
                    */
                    //TODO: Test again in Firefox to see if behaviour is now reliable enough. If not, enable the listener only for Chromium.
                    // Or maybe can pass the port metadata in case we can workaround the bug using some of that data?
                    // p.onDisconnect.addListener(port => {
                    //     // Only take action if the port we received this on is the same as the one we are currently tracking as active. This helps us to tidy up after the user closes the Kee Vault tab or navigates away from the site
                    //     //but ensures we don't close newly opened connections when an old port is closed (such as during page refreshes, extension updates, etc.)
                    //     if (port == this.vaultPort) {
                    //     // eslint-disable-next-line @typescript-eslint/no-empty-function
                    //     this.vaultPort = { postMessage: _msg => { } };
                    //     this.KeePassRPC.closeEventSession();
                    //     }
                    // });

                    const connectMessage = {
                        initialState: this.store.state,
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === this.foregroundTabId
                    } as VaultMessage;

                    this.vaultPort = p;
                    p.postMessage(connectMessage);
                    break;
                }
                case "iframe": {
                    p.onMessage.addListener(iframeMessageHandler.bind(p));
                    p.onDisconnect.addListener(() => {
                        this.tabStates
                            .get(p.sender.tab.id)
                            ?.ourIframePorts?.delete(p.sender.frameId);
                    });

                    const connectMessage = {
                        initialState: this.store.state,
                        frameState: this.tabStates
                            .get(p.sender.tab.id)
                            .frames.get(parentFrameId),
                        frameId: p.sender.frameId,
                        tabId: p.sender.tab.id,
                        isForegroundTab: p.sender.tab.id === this.foregroundTabId
                    } as AddonMessage;

                    if (this.persistentTabStates.get(p.sender.tab.id)) {
                        this.persistentTabStates.get(p.sender.tab.id).items.forEach(item => {
                            if (item.itemType === "submittedData") {
                                connectMessage.submittedData = item.submittedData;
                            }
                        });
                    }

                    p.postMessage(connectMessage);
                    this.tabStates
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

    async init(): Promise<boolean> {
        // // Create a timer for KPRPC connection establishment
        // this.regularKPRPCListenerQueueHandlerTimer = self.setInterval(
        //     this.RegularKPRPCListenerQueueHandler,
        //     5000
        // );

        this._keeBrowserStartup();

        // This listener is called when a new account is logged in to within Kee Vault. It
        // does not require an active KPRPC event session for delivery
        accountManager.addListener(() => {
            // If there is a vault port available but no active session, we poke the content script to
            // reinitialise the connection if it now looks likely that it will succeed (as a result of
            // a new account being logged in to which has the required multi-session feature).
            // We don't bother with the WebSocket equivalent because that will automatically be tried
            // regularly anyway.
            // We also don't worry about kicking people off from active sessions if their license expires.
            if (
                accountManager.featureEnabledMultiSessionTypes &&
                !this.KeePassRPC.eventSessionManagerIsActive
            ) {
                this.inviteKeeVaultConnection();
            }
        });

        await chrome.privacy.services.passwordSavingEnabled.set({
            value: false
        });

        if (chrome.runtime.lastError != null) {
            KeeLog.warn(
                "KeeFox was unable to disable built-in password manager saving - confusion may ensue! " +
                chrome.runtime.lastError.message
            );
        }
        return true;
    }

    notifyUser(notification: KeeNotification, nativeNotification?: NativeNotification) {
        this.removeUserNotifications((n: KeeNotification) => n.name != notification.name);
        this.store.addNotification(notification);
        chrome.action.setIcon({
            path: "/assets/images/highlight-48.png"
        });
        if (nativeNotification) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: chrome.runtime.getURL("/assets/images/128.png"),
                title: nativeNotification.title,
                message: nativeNotification.message
            });
        } else {
            if (configManager.current.notificationCountGeneric < 5) {
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: chrome.runtime.getURL("/assets/images/128.png"),
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
        this.store.updateNotifications(this.store.state.notifications.filter(unlessTrue));
    }

    animateBrowserActionIcon(duration = 1200) {
        // Firefox claims that a janky icon animation is less intrusive for users
        // than a smoothly animated one and therefore will not develop the smooth
        // animation support available in other browsers. Our user testing confirms
        // this is not the case so where we are able to (i.e. not Firefox) we
        // enable a nice smooth animation to subtly hint that they might want to
        // click on the icon. We have to make the animation in Firefox much less subtle :-(
        // https://bugzilla.mozilla.org/show_bug.cgi?format=default&id=1309347
        //this.animateIcon.start(duration, !isFirefox());
    }

    resetBrowserActionColor() {
        chrome.action.setIcon({ path: "/assets/images/48.png" });
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
        this.KeePassRPC = new jsonrpcClient(this.store);
        KeeLog.info(
            "Kee initialised OK although the connection to a KeePassRPC server is probably not established just yet..."
        );
    }

    // Temporarily disable Kee. Used (for e.g.) when KeePass is shut down.
    _pauseKee() {
        KeeLog.debug("Pausing Kee.");
        this.store.updateKeePassDatabases([]);
        this.store.updateActiveKeePassDatabaseIndex(-1);
        this.store.updateConnected(false);
        this.store.updateConnectedWebsocket(false);
        this.store.updateCurrentSearchTerm(null);
        this.store.updateSearchResults(null);

        try {
            this.refreshFormStatus(Action.ResetForms);
        } catch (e) {
            KeeLog.error(
                "Uncaught exception posting message in _pauseKee: " + e.message + " : " + e.stack
            );
        }

        chrome.action.setBadgeText({ text: "OFF" });
        chrome.action.setBadgeBackgroundColor({ color: "red" });

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
        this.store.updateConnected(true);
        this.store.updateConnectedWebsocket(this.KeePassRPC.websocketSessionManagerIsActive);
        this.store.updateKeePassDatabases(newDatabases);
        this.store.updateActiveKeePassDatabaseIndex(newDatabaseActiveIndex);
        this.store.updateSearchResults(null);
        this.store.updateCurrentSearchTerm(null);

        KeeLog.info("Number of databases open: " + newDatabases.length);

        if (newDatabases.length > 0) {
            chrome.action.setBadgeText({ text: "" });
            chrome.action.setBadgeBackgroundColor({ color: "blue" });
        } else {
            chrome.action.setBadgeText({ text: "OFF" });
            chrome.action.setBadgeBackgroundColor({ color: "orange" });
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
        this.tabStates.forEach((ts, tabId) => {
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
        const hasWebsocketDBs = this.store.state.KeePassDatabases.some(
            db => db.sessionType === SessionType.Websocket
        );
        const supportsWebsocketFocus = this.store.state.KeePassDatabases.some(
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
            const vaultTabs = await chrome.tabs.query({
                url: [
                    "https://keevault.pm/*",
                    "https://app-beta.kee.pm/*",
                    "https://app-dev.kee.pm/*"
                ]
            });
            if (vaultTabs && vaultTabs[0]) {
                chrome.tabs.update(vaultTabs[0].id, { active: true });
                chrome.windows.update(vaultTabs[0].windowId, { focused: true });
            } else {
                chrome.tabs.create({
                    url: "https://keevault.pm/",
                    active: true
                });
            }
        }
    }

    recordEntrySaveResult(saveType: "updated" | "created", entry?: Entry) {
        if (!entry) {
            this.store.updateSaveEntryResult({
                result: "error",
                receivedAt: new Date()
            } as SaveEntryResult);
            return false;
        } else {
            this.store.updateSaveEntryResult({
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
        if (index == undefined) index = this.store.state.ActiveKeePassDatabaseIndex;
        if (
            this.store.state.KeePassDatabases.length > 0 &&
            this.store.state.KeePassDatabases[index] != null &&
            this.store.state.KeePassDatabases[index].root != null
        ) {
            return this.store.state.KeePassDatabases[index].name;
        } else return null;
    }

    getDatabaseFileName(index?) {
        if (index == undefined) index = this.store.state.ActiveKeePassDatabaseIndex;
        if (
            this.store.state.KeePassDatabases.length > 0 &&
            this.store.state.KeePassDatabases[index] != null &&
            this.store.state.KeePassDatabases[index].root != null
        ) {
            return this.store.state.KeePassDatabases[index].fileName;
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

        //   let executeNow = false;
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

        // // If there is nothing in the queue at the moment we can process this callback straight away
        // if (!this.processingCallback && this.pendingCallback == "") {
        //     KeeLog.debug("Signal executing now. @" + sigTime);
        //     this.processingCallback = true;
        //     executeNow = true;
        // }
        // // Otherwise we need to add the action for this callback to a queue and leave it up to the regular callback processor to execute the action

        if (refresh) {
            //       if (executeNow) {
            this.store.updateLastKeePassRPCRefresh(now);
            this._refreshKPDB();
            // } else {
            //     this.pendingCallback = "_refreshKPDB";
            // }
        }

        // KeeLog.debug("Signal handled or queued. @" + sigTime);
        // if (executeNow) {
        // //trigger any pending callback handler immediately rather than waiting for the timed handler to pick it up
        // try {
        //     if (this.pendingCallback == "_refreshKPDB") this._refreshKPDB();
        //     else KeeLog.debug("A pending signal was found and handled.");
        // } finally {
        //     this.pendingCallback = "";
        //     this.processingCallback = false;
        // }
        KeeLog.debug("Signal handled. @" + sigTime);
        //   }
    }

    //TODO: verify this simplification is fine.
    // The only possible callback handler for signals is refreshDb so we don't need this timer, etc. any more
    // RegularKPRPCListenerQueueHandler() {
    //     // If there is nothing in the queue at the moment or we are already processing a callback, we give up for now
    //     if (this.processingCallback || this.pendingCallback == "") return;

    //     KeeLog.debug("RegularKPRPCListenerQueueHandler will execute the pending item now");
    //     this.processingCallback = true;
    //     try {
    //         if (this.pendingCallback == "_refreshKPDB") this._refreshKPDB();
    //     } finally {
    //         this.pendingCallback = "";
    //         this.processingCallback = false;
    //     }
    //     KeeLog.debug("RegularKPRPCListenerQueueHandler has finished executing the item");
    // }

    createTabStateIfMissing(tabId: number) {
        if (!this.tabStates.has(tabId)) {
            this.tabStates.set(tabId, new TabState());
        }
    }

    deleteTabState(tabId: number) {
        this.tabStates.delete(tabId);
    }

    initiatePasswordGeneration() {
        if (this.store.state.connected) {
            const tabState = this.tabStates.get(this.foregroundTabId);
            if (tabState) {
                const framePort = tabState.framePorts.get(0);
                if (framePort) {
                    framePort.postMessage({ action: Action.GeneratePassword });
                    return;
                }
            }
            // Focussed on a Kee Vault tab or other tab we are not allowed to inject content scripts into
            if (this.vaultPort) {
                this.vaultPort.postMessage({
                    protocol: VaultProtocol.ShowGenerator
                } as VaultMessage);
                chrome.tabs.update(this.vaultPort.sender.tab.id, {
                    active: true
                });
                chrome.windows.update(this.vaultPort.sender.tab.windowId, { focused: true });
            }
        }
    }
}

export const kee = Kee.getInstance();
