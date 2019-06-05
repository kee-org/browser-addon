import { Database, PasswordProfile } from "./kfDataModel";
import { KeeNotification } from "./KeeNotification";

export interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    PasswordProfiles: PasswordProfile[];
    notifications: KeeNotification[];
    connected: boolean;
    connectedWebsocket: boolean;
    currentSearchTerm: string;
}
