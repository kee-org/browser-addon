/// <reference path="../common/config.ts" />
/// <reference path="../common/KeeFoxNotification.ts" />

interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: any[];
    notifications: KeeFoxNotification[];
    connected: boolean;
    config: Config;
}
