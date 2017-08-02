/// <reference path="config.ts" />
/// <reference path="KeeNotification.ts" />

interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    notifications: KeeNotification[];
    connected: boolean;
}
