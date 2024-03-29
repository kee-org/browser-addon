import { Database } from "../common/model/Database";
import { PasswordProfile } from "../common/model/PasswordProfile";
import { KeeNotification } from "../common/KeeNotification";
import { EntrySummary } from "../common/model/EntrySummary";
import { SaveState } from "../common/SaveState";
import { SaveEntryResult } from "../common/SaveEntryResult";

// This is broadly the list of state that is needed to render UI
// It can be optionally stored in a reactive environment like Vue3/Pinia.
// Changes to the state must be made via methods which can optionally
// distribute those changes to multiple webextension context scopes.
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

export const defaults = {
    latestConnectionError: "",
    lastKeePassRPCRefresh: 0,
    ActiveKeePassDatabaseIndex: -1,
    KeePassDatabases: [],
    PasswordProfiles: [],
    notifications: [],
    connected: false,
    connectedWebsocket: false,
    currentSearchTerm: null,
    loginsFound: false,
    searchResults: null,
    saveState: new SaveState(),
    generatedPassword: "",
    saveEntryResult: {
        result: null,
        receivedAt: new Date(),
        fileName: null,
        uuid: null
    },
    entryUpdateStartedAtTimestamp: 0
};
