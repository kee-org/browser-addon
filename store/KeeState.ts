import { Database } from "../common/model/Database";
import { PasswordProfile } from "../common/model/PasswordProfile";
import { KeeNotification } from "../common/KeeNotification";
import { EntrySummary } from "../common/model/EntrySummary";
import { SaveState } from "../common/SaveState";
import { SaveEntryResult } from "../common/SaveEntryResult";

export interface KeeState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    PasswordProfiles: PasswordProfile[];
    notifications: KeeNotification[];
    connected: boolean;
    connectedWebsocket: boolean;
    currentSearchTerm: string;
    loginsFound: boolean;
    searchResults: EntrySummary[];
    saveState: SaveState;
    generatedPassword: string;
    saveEntryResult: SaveEntryResult;
    entryUpdateStartedAtTimestamp: number;
}
