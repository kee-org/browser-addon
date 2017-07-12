/// <reference path="config.ts" />
/// <reference path="KeeFoxNotification.ts" />

interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    notifications: KeeFoxNotification[];
    connected: boolean;
}
