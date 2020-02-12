import { kprpcClient, ResultWrapper } from "./kprpcClient";
import { EventSessionManager } from "./EventSession";
import { VaultMessage } from "../common/VaultMessage";
import { SessionType, Database, PasswordProfile } from "../common/kfDataModel";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Config } from "../common/config";
import store from "../store";
import { WebsocketSessionManager } from "./WebsocketSession";

/*
jsonrpcClient provides a JSON-RPC client and method proxies for
communication between Kee and a KeePassRPC server.
*/


export class jsonrpcClient {
    private kprpcClient: kprpcClient;

    constructor () {
        this.kprpcClient = new kprpcClient();
        this.kprpcClient.startWebsocketSessionManager();
    }

    startEventSession (sessionId: string, features: string[], messageToWebPage) {
        return this.kprpcClient.startEventSession(sessionId, features, messageToWebPage);
    }

    eventSessionMessageFromPage (data: VaultMessage) {
        return this.kprpcClient.eventSessionMessageFromPage(data);
    }

    sessionManagerForFilename (dbFileName: string) {
        const sessionType = store.state.KeePassDatabases.find(db => db.fileName === dbFileName).sessionType;
        return this.kprpcClient.getSessionManagerByType(sessionType);
    }

    sessionManagerForPasswordProfile (profile: string) {
        const sessionType = store.state.PasswordProfiles.find(p => p.name === profile).sessionType;
        return this.kprpcClient.getSessionManagerByType(sessionType);
    }

    public get eventSessionManagerIsActive () : boolean {
        return this.kprpcClient.getSessionManagerByType(SessionType.Event).isActive();
    }

    public get websocketSessionManagerIsActive () : boolean {
        return this.kprpcClient.getSessionManagerByType(SessionType.Websocket).isActive();
    }


    //***************************************
    // Functions below orchestrate requests to one or more KPRPC servers,
    // targeting methods exposed in the KeePassRPC server.
    // See KeePassRPCService.cs for more detail on what each method does.
    //***************************************

    launchGroupEditor (uniqueID, dbFileName)
    {
        this.kprpcClient.request([this.sessionManagerForFilename(dbFileName)], "LaunchGroupEditor", [uniqueID, dbFileName], null, ++this.kprpcClient.requestId);
    }

    launchLoginEditor (uniqueID, dbFileName)
    {
        this.kprpcClient.request([this.sessionManagerForFilename(dbFileName)], "LaunchLoginEditor", [uniqueID, dbFileName], null, ++this.kprpcClient.requestId);
    }

    selectDB (fileName: string, requestFocusReturn: boolean, sessionType?: SessionType)
    {
        let sessionManager = sessionType ? this.kprpcClient.getSessionManagerByType(sessionType) : null;
        if (!sessionManager) {
            // We should only use this branch for opening a database when no DB is opened in any session.
            // We may have just opened the vault, or we may have an existing session open to
            // one or more Event and/or Websocket servers.
            // There's no logical way to decide which session to target this request at so we just go
            // for whatever is active, preferring an Event source if multiple sessions are open
            sessionManager = this.kprpcClient.getPrimarySessionManager();
            if (!sessionManager) {
                KeeLog.error("No active session found");
                return;
            }
        }

        // Requesting return focus is default behaviour for ChangeDatabase so we know if we want to
        // suppress that behaviour we must use the OpenAndFocusDatabase feature.
        if (!requestFocusReturn) {
            // Sanity check
            if (sessionManager instanceof EventSessionManager) {
                KeeLog.error("Kee Vault does not support OpenAndFocusDatabase feature");
                return;
            }
            this.kprpcClient.request([sessionManager], "OpenAndFocusDatabase", [fileName, requestFocusReturn], null, ++this.kprpcClient.requestId);
        } else {
            this.kprpcClient.request([sessionManager], "ChangeDatabase", [fileName, false], null, ++this.kprpcClient.requestId);
        }
    }

    addLogin (login, parentUUID, dbFileName)
    {
        const jslogin = login.asEntry();
        this.kprpcClient.request([this.sessionManagerForFilename(dbFileName)], "AddLogin", [jslogin, parentUUID, dbFileName], null, ++this.kprpcClient.requestId);
    }

    updateLogin (login, oldLoginUUID, urlMergeMode, dbFileName) {
        const jslogin = login.asEntry();
        this.kprpcClient.request([this.sessionManagerForFilename(dbFileName)], "UpdateLogin", [jslogin, oldLoginUUID, urlMergeMode, dbFileName], null, ++this.kprpcClient.requestId);
    }

    findLogins (fullURL: string, formSubmitURL, httpRealm, uniqueID: string, dbFileName, freeText, username, callback: (resultWrapper: Partial<ResultWrapper>) => void)
    {
        if (store.state.KeePassDatabases.length <= 0) {
            callback({ result: []});
        }
        let lst = "LSTall";
        if (httpRealm == undefined || httpRealm == null || httpRealm == "")
            lst = "LSTnoRealms";
        else if (formSubmitURL == undefined || formSubmitURL == null || formSubmitURL == "")
            lst = "LSTnoForms";

        if (dbFileName == undefined || dbFileName == null || dbFileName == "")
        {
            if (!configManager.current.searchAllOpenDBs)
                dbFileName = store.state.KeePassDatabases[store.state.ActiveKeePassDatabaseIndex].fileName;
            else
                dbFileName = "";
        }

        // If we have been asked to search in a specific DB filename (possibly implicitly by
        // user settings) we can search in just that session, otherwise we search them all
        const potentialSessionManagers: (WebsocketSessionManager | EventSessionManager)[] = [];
        if (dbFileName)
            potentialSessionManagers.push(this.sessionManagerForFilename(dbFileName));
        else {
            potentialSessionManagers.push(...this.kprpcClient.getManagersForActiveSessions());
        }

        const sessionManagers = potentialSessionManagers.filter(sm =>
            (sm instanceof EventSessionManager && store.state.KeePassDatabases.some(db => db.sessionType == SessionType.Event))
                || (sm instanceof WebsocketSessionManager && store.state.KeePassDatabases.some(db => db.sessionType == SessionType.Websocket))
        );

        if (sessionManagers.length <= 0) {
            callback({ result: []});
        }

        const urls = [];

        if (fullURL) {
            urls.push(fullURL);

            // Google treat youtube.com and google.com as the same property when authenticating
            //TODO:v: extend to wider concept of equivelent domains (beware ownership changes)
            if (fullURL.search(/$https:\/\/accounts\.youtube\.com\/?/) >= 0)
                urls.push("https://accounts.google.com");
        }

        this.kprpcClient.request(sessionManagers, "FindLogins", [urls, formSubmitURL, httpRealm, lst, false, uniqueID, dbFileName, freeText, username], sessionResponses => {
            const results: any[] = [];
            for (const sessionResponse of sessionResponses) {
                if (sessionResponse.resultWrapper.result != null) {
                    results.push(...sessionResponse.resultWrapper.result.map(res => {
                        res.db.sessionType = sessionResponse.sessionType;
                        res.db.sessionFeatures = sessionResponse.features;
                        return res;
                    }));
                }
            }
            callback({ result: results });
            //TODO:4: Refactor so we return entries instead of the raw wrappers (not a keeLoginInfo though cos that is not JSONifiable)
        }, ++this.kprpcClient.requestId);
    }

    getAllDatabases ()
    {
        const activeSessions = this.kprpcClient.getManagersForActiveSessions();

        const result = this.kprpcClient.request(activeSessions, "GetAllDatabases", null, sessionResponses => {
            const dbs: Database[] = [];
            sessionResponses.sort(s => s.sessionType === SessionType.Event ? -1 : 1);
            for (const sessionResponse of sessionResponses) {
                if (sessionResponse.resultWrapper.result !== null) {
                    const recievedDBs = sessionResponse.sessionType === SessionType.Event
                        ? sessionResponse.resultWrapper.result.dbs : sessionResponse.resultWrapper.result;
                    for (const db of recievedDBs as Array<Database>) {
                        if (!dbs.find(d => d.fileName === db.fileName)) {
                            db.sessionType = sessionResponse.sessionType;
                            db.sessionFeatures = sessionResponse.features;
                            dbs.push(db);
                        } else
                        {
                            KeeLog.debug("Database with duplicate file name found. Ignoring.");
                        }
                    }
                    if (sessionResponse.sessionType === SessionType.Event) {
                        window.kee.configSyncManager.updateFromRemoteConfig(sessionResponse.resultWrapper.result.config);
                    }
                }
            }
            window.kee.updateKeePassDatabases(dbs);
        }, ++this.kprpcClient.requestId);
    }

    updateAddonSettings (settings: Partial<Config>, version: number)
    {
        const sessionManager = this.kprpcClient.getSessionManagerByType(SessionType.Event);
        if (!sessionManager) {
            return;
        }

        this.kprpcClient.request([sessionManager], "UpdateAddonSettings", [settings, version], null, ++this.kprpcClient.requestId);
    }

    getPasswordProfiles (callback: (profiles: PasswordProfile[]) => void) {
        const activeSessions = this.kprpcClient.getManagersForActiveSessions();

        const result = this.kprpcClient.request(activeSessions, "GetPasswordProfiles", null, sessionResponses => {
            const profiles: PasswordProfile[] = [];
            sessionResponses.sort(s => s.sessionType === SessionType.Event ? -1 : 1);
            for (const sessionResponse of sessionResponses) {
                if (sessionResponse.resultWrapper.result !== null) {
                    for (const profileName of sessionResponse.resultWrapper.result as Array<string>) {
                        if (!profiles.find(p => p.name === profileName)) {
                            profiles.push({name: profileName, sessionType: sessionResponse.sessionType});
                        } else
                        {
                            KeeLog.debug("Password profile with duplicate name found. Ignoring.");
                        }
                    }
                }
            }
            callback(profiles);
        }, ++this.kprpcClient.requestId);
    }

    generatePassword (profileName, url, callback)
    {
        const session = this.sessionManagerForPasswordProfile(profileName);
        this.kprpcClient.request([session], "GeneratePassword", [profileName, url], sessionResponses => {
            const sessionResponse = sessionResponses[0];
            if (sessionResponse.resultWrapper.result !== null) {
                callback(sessionResponse.resultWrapper.result);
            }
        }, ++this.kprpcClient.requestId);
    }
}
