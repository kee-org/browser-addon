/// <reference path="config.ts" />
/// <reference path="KeeNotification.ts" />

interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    PasswordProfiles: PasswordProfile[];
    notifications: KeeNotification[];
    connected: boolean;
    currentSearchTerm: string;
}
