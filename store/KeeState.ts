import { Database, PasswordProfile } from "../common/kfDataModel";
import { KeeNotification } from "../common/KeeNotification";
import { EntrySummary } from "../common/model/EntrySummary";
import { SaveState } from "../common/SaveState";

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
}
