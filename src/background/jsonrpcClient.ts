import { kprpcClient } from "./kprpcClient";
import { EventSessionManager } from "./EventSession";
import { VaultMessage } from "../common/VaultMessage";
import { SessionType } from "../common/SessionType";
import { PasswordProfile } from "../common/model/PasswordProfile";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Config } from "../common/config";
import { WebsocketSessionManager } from "./WebsocketSession";
import { DatabaseDto, EntryDto } from "../common/model/KPRPCDTOs";
import { Database } from "../common/model/Database";
import { Entry } from "../common/model/Entry";
import { DatabaseSummary } from "../common/model/DatabaseSummary";
import BackgroundStore from "../store/BackgroundStore";
import { configSyncManager } from "./ConfigSyncManager";

/*
jsonrpcClient provides a JSON-RPC client and method proxies for
communication between Kee and a KeePassRPC server.
*/

export class jsonrpcClient {
    private kprpcClient: kprpcClient;

    constructor(private store: BackgroundStore) {
        this.kprpcClient = new kprpcClient(store);
        this.kprpcClient.startWebsocketSessionManager();
    }

    startEventSession(sessionId: string, features: string[], messageToWebPage) {
        return this.kprpcClient.startEventSession(sessionId, features, messageToWebPage);
    }

    eventSessionMessageFromPage(data: VaultMessage) {
        return this.kprpcClient.eventSessionMessageFromPage(data);
    }

    sessionManagerForFilename(dbFileName: string) {
        const sessionType = this.store.state.KeePassDatabases.find(db => db.fileName === dbFileName)
            .sessionType;
        return this.kprpcClient.getSessionManagerByType(sessionType);
    }

    sessionManagerForPasswordProfile(profile: string) {
        const sessionType = this.store.state.PasswordProfiles.find(p => p.name === profile).sessionType;
        return this.kprpcClient.getSessionManagerByType(sessionType);
    }

    public get eventSessionManagerIsActive(): boolean {
        return this.kprpcClient.getSessionManagerByType(SessionType.Event).isActive();
    }

    public get websocketSessionManagerIsActive(): boolean {
        return this.kprpcClient.getSessionManagerByType(SessionType.Websocket).isActive();
    }

    //***************************************
    // Functions below orchestrate requests to one or more KPRPC servers,
    // targeting methods exposed in the KeePassRPC server.
    // See KeePassRPCService.cs for more detail on what each method does.
    //***************************************

    launchGroupEditor(uuid: string, dbFileName: string) {
        this.kprpcClient.request(
            [this.sessionManagerForFilename(dbFileName)],
            "LaunchGroupEditor",
            [uuid, dbFileName]
        );
    }

    launchLoginEditor(uuid: string, dbFileName: string) {
        this.kprpcClient.request(
            [this.sessionManagerForFilename(dbFileName)],
            "LaunchLoginEditor",
            [uuid, dbFileName]
        );
    }

    selectAndFocusDatabase(vaultFileName: string, keepassFilename: string) {
        let sessionManager: EventSessionManager | WebsocketSessionManager;
        const smEvent = this.kprpcClient.getSessionManagerByType(SessionType.Event);
        const smWebsocket = this.kprpcClient.getSessionManagerByType(SessionType.Websocket);
        if (smEvent.isActive() && smWebsocket.isActive()) {
            if (vaultFileName && !keepassFilename) {
                sessionManager = smEvent;
            } else if (keepassFilename && !vaultFileName) {
                sessionManager = smWebsocket;
            } else {
                sessionManager = smEvent;
            }
        } else if (smEvent.isActive()) {
            sessionManager = smEvent;
        } else if (smWebsocket.isActive()) {
            sessionManager = smWebsocket;
        }
        if (!sessionManager) {
            KeeLog.info("No active session found");
            return null;
        }
        if (sessionManager instanceof WebsocketSessionManager) {
            this.kprpcClient.request([sessionManager], "OpenAndFocusDatabase", [
                keepassFilename,
                false
            ]);
        }

        return sessionManager instanceof EventSessionManager
            ? SessionType.Event
            : SessionType.Websocket;
    }

    selectDB(fileName: string, requestFocusReturn: boolean, sessionType: SessionType) {
        const sessionManager = sessionType
            ? this.kprpcClient.getSessionManagerByType(sessionType)
            : null;

        // Requesting return focus is default behaviour for ChangeDatabase so we know if we want to
        // suppress that behaviour we must use the OpenAndFocusDatabase feature.
        if (!requestFocusReturn) {
            // Sanity check
            if (sessionManager instanceof EventSessionManager) {
                KeeLog.error("Kee Vault does not support OpenAndFocusDatabase feature");
                return;
            }
            this.kprpcClient.request([sessionManager], "OpenAndFocusDatabase", [
                fileName,
                requestFocusReturn
            ]);
        } else {
            this.kprpcClient.request([sessionManager], "ChangeDatabase", [fileName, false]);
        }
    }

    async addLogin(entry: Entry, parentUUID: string, dbFileName: string) {
        const jslogin = Entry.toKPRPCEntryDTO(entry);
        const sessionResponses = await this.kprpcClient.request(
            [this.sessionManagerForFilename(dbFileName)],
            "AddLogin",
            [jslogin, parentUUID, dbFileName]
        );
        const result = sessionResponses?.[0].resultWrapper?.result;
        if (result) {
            const db = DatabaseSummary.fromKPRPCDatabaseSummaryDTO(result.db);
            return Entry.fromKPRPCEntryDTO(result, db);
        }
        return null;
    }

    async updateLogin(entry: Entry, oldLoginUUID: string, dbFileName: string) {
        const jslogin = Entry.toKPRPCEntryDTO(entry);
        const sessionManager = this.sessionManagerForFilename(dbFileName);
        const urlMergeMode = sessionManager
            .features()
            .some(f => f === "KPRPC_FEATURE_ENTRY_URL_REPLACEMENT")
            ? 5
            : 2;
        const sessionResponses = await this.kprpcClient.request([sessionManager], "UpdateLogin", [
            jslogin,
            oldLoginUUID,
            urlMergeMode,
            dbFileName
        ]);
        const result = sessionResponses?.[0].resultWrapper?.result;
        if (result) {
            const db = DatabaseSummary.fromKPRPCDatabaseSummaryDTO(result.db);
            return Entry.fromKPRPCEntryDTO(result, db);
        }
        return null;
    }

    async findLogins(
        fullURL: string,
        httpRealm: string,
        uuid: string,
        dbFileName: string,
        freeText: string,
        username: string
    ) {
        if (this.store.state.KeePassDatabases.length <= 0) {
            return [];
        }

        // This has no meaning any more and is ignored in KPRPC 1.10+ but if
        // we don't supply it to older versions of KPRPC, all non-matching
        // entries will have their URLs tested twice before they are determined
        // to be not a match.
        const lst = "LSTnoForms";

        if (dbFileName == undefined || dbFileName == null || dbFileName == "") {
            if (!configManager.current.searchAllOpenDBs) {
                dbFileName =
                    this.store.state.KeePassDatabases[this.store.state.ActiveKeePassDatabaseIndex].fileName;
            } else dbFileName = "";
        }

        // If we have been asked to search in a specific DB filename (possibly implicitly by
        // user settings) we can search in just that session, otherwise we search them all
        const potentialSessionManagers: (WebsocketSessionManager | EventSessionManager)[] = [];
        if (dbFileName) potentialSessionManagers.push(this.sessionManagerForFilename(dbFileName));
        else {
            potentialSessionManagers.push(...this.kprpcClient.getManagersForActiveSessions());
        }

        const sessionManagers = potentialSessionManagers.filter(
            sm =>
                (sm instanceof EventSessionManager &&
                    this.store.state.KeePassDatabases.some(db => db.sessionType == SessionType.Event)) ||
                (sm instanceof WebsocketSessionManager &&
                    this.store.state.KeePassDatabases.some(
                        db => db.sessionType == SessionType.Websocket
                    ))
        );

        if (sessionManagers.length <= 0) {
            return [];
        }

        const urls = [];

        if (fullURL) {
            urls.push(fullURL);

            // Google treat youtube.com and google.com as the same property when authenticating
            //TODO:v: extend to wider concept of equivelent domains (beware ownership changes)
            if (fullURL.search(/$https:\/\/accounts\.youtube\.com\/?/) >= 0) {
                urls.push("https://accounts.google.com");
            }
        }

        const sessionResponses = await this.kprpcClient.request(sessionManagers, "FindLogins", [
            urls,
            null,
            httpRealm,
            lst,
            false,
            uuid,
            dbFileName,
            freeText,
            username
        ]);
        const results: Entry[] = [];
        for (const sessionResponse of sessionResponses) {
            if (sessionResponse.resultWrapper?.result?.[0]) {
                const db = DatabaseSummary.fromKPRPCDatabaseSummaryDTO(
                    sessionResponse.resultWrapper.result[0].db
                );
                results.push(
                    ...sessionResponse.resultWrapper.result.map((res: EntryDto) =>
                        Entry.fromKPRPCEntryDTO(res, db)
                    )
                );
            }
        }
        return results;
    }

    async getAllDatabases() {
        const activeSessions = this.kprpcClient.getManagersForActiveSessions();

        const sessionResponses = await this.kprpcClient.request(
            activeSessions,
            "GetAllDatabases",
            null
        );
        const dbs: Database[] = [];
        sessionResponses.sort(s => (s.sessionType === SessionType.Event ? -1 : 1));
        for (const sessionResponse of sessionResponses) {
            if (sessionResponse.resultWrapper.result !== null) {
                const recievedDBs =
                    sessionResponse.sessionType === SessionType.Event
                        ? sessionResponse.resultWrapper.result.dbs
                        : sessionResponse.resultWrapper.result;
                for (const db of recievedDBs as Array<DatabaseDto>) {
                    if (!dbs.find(d => d.fileName === db.fileName)) {
                        dbs.push(
                            Database.fromKPRPCDatabaseDTO(
                                db,
                                sessionResponse.sessionType,
                                sessionResponse.features
                            )
                        );
                    } else {
                        KeeLog.debug("Database with duplicate file name found. Ignoring.");
                    }
                }
                if (sessionResponse.sessionType === SessionType.Event) {
                    configSyncManager.updateFromRemoteConfig(
                        sessionResponse.resultWrapper.result.config
                    );
                }
            }
        }
        kee.updateKeePassDatabases(dbs);
    }

    updateAddonSettings(settings: Partial<Config>, version: number) {
        const sessionManager = this.kprpcClient.getSessionManagerByType(SessionType.Event);
        if (!sessionManager) {
            return;
        }

        this.kprpcClient.request([sessionManager], "UpdateAddonSettings", [settings, version]);
    }

    async getPasswordProfiles() {
        const activeSessions = this.kprpcClient.getManagersForActiveSessions();

        const sessionResponses = await this.kprpcClient.request(
            activeSessions,
            "GetPasswordProfiles",
            null
        );
        const profiles: PasswordProfile[] = [];
        sessionResponses.sort(s => (s.sessionType === SessionType.Event ? -1 : 1));
        for (const sessionResponse of sessionResponses) {
            if (sessionResponse.resultWrapper.result !== null) {
                for (const profileName of sessionResponse.resultWrapper.result as string[]) {
                    if (!profiles.find(p => p.name === profileName)) {
                        profiles.push({
                            name: profileName,
                            sessionType: sessionResponse.sessionType
                        });
                    } else {
                        KeeLog.debug("Password profile with duplicate name found. Ignoring.");
                    }
                }
            }
        }
        return profiles;
    }

    async generatePassword(profileName: string, url: string): Promise<string> {
        const session = this.sessionManagerForPasswordProfile(profileName);
        const sessionResponses = await this.kprpcClient.request([session], "GeneratePassword", [
            profileName,
            url
        ]);
        const sessionResponse = sessionResponses[0];
        if (sessionResponse.resultWrapper.result !== null) {
            return sessionResponse.resultWrapper.result;
        }
    }
}
