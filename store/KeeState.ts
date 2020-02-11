import { Database, PasswordProfile } from "../common/kfDataModel";
import { KeeNotification } from "../common/KeeNotification";
import { SearchResult } from "../common/search";
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
    searchResults: SearchResult[];
    saveState: SaveState;
}
