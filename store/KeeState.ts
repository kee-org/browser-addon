import { Database, PasswordProfile } from "../common/kfDataModel";
import { KeeNotification } from "../common/KeeNotification";
import { SubmittedData } from "../common/SubmittedData";
import { SearchResult } from "../common/search";

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
    submittedData: SubmittedData;
    loginsFound: boolean;
    searchResults: SearchResult[];
}
