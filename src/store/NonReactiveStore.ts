import * as types from "./mutation-types";
import { defaults, KeeState } from "./KeeState";
import { SaveState } from "../common/SaveState";
import { Entry } from "../common/model/Entry";
import { SaveEntryResult } from "../common/SaveEntryResult";
import { Field } from "../common/model/Field";
import { Database } from "../common/model/Database";
import { KeeNotification } from "../common/KeeNotification";
import { PasswordProfile } from "../common/model/PasswordProfile";
import { SubmittedData } from "../common/SubmittedData";
import { EntrySummary } from "../common/model/EntrySummary";
import { Mutation } from "./Mutation";

function undefAbort(payload) {
    if (payload === undefined) {
        throw new Error(
            "FATAL! undefined value sent to commit that must never set an undefined value. No-one knows what will happen now but Kee is probably broken in some way until a browser restart."
        );
    }
}

declare type BackgroundDistributor = (mutation: Mutation, excludedPort?: chrome.runtime.Port) => void;

export default class NonReactiveStore {

    private _state: KeeState = defaults;

    public get state() : KeeState {
        return this._state;
    }

    public constructor(protected distributeAction: BackgroundDistributor) {

    }

    public onRemoteMessage(sourcePort: chrome.runtime.Port, mutation: Mutation) {
        if (mutation.type === types.addNotification) {
            this.addNotification(mutation.payload, false);
        } else if (mutation.type === types.removeFieldFromActiveEntry) {
            this.removeFieldFromActiveEntry(mutation.payload, false);
        } else if (mutation.type === types.updateActiveKeePassDatabaseIndex) {
            this.updateActiveKeePassDatabaseIndex(mutation.payload, false);
        } else if (mutation.type === types.updateConnected) {
            this.updateConnected(mutation.payload, false);
        } else if (mutation.type === types.updateConnectedWebsocket) {
            this.updateConnectedWebsocket(mutation.payload, false);
        } else if (mutation.type === types.updateCurrentSearchTerm) {
            this.updateCurrentSearchTerm(mutation.payload, false);
        } else if (mutation.type === types.updateEntryUpdateStartedAtTimestamp) {
            this.updateEntryUpdateStartedAtTimestamp(mutation.payload, false);
        } else if (mutation.type === types.updateGeneratedPassword) {
            this.updateGeneratedPassword(mutation.payload, false);
        } else if (mutation.type === types.updateKeePassDatabases) {
            this.updateKeePassDatabases(mutation.payload, false);
        } else if (mutation.type === types.updateLastKeePassRPCRefresh) {
            this.updateLastKeePassRPCRefresh(mutation.payload, false);
        } else if (mutation.type === types.updateLatestConnectionError) {
            this.updateLatestConnectionError(mutation.payload, false);
        } else if (mutation.type === types.updateLoginsFound) {
            this.updateLoginsFound(mutation.payload, false);
        } else if (mutation.type === types.updateNotifications) {
            this.updateNotifications(mutation.payload, false);
        } else if (mutation.type === types.updatePasswordProfiles) {
            this.updatePasswordProfiles(mutation.payload, false);
        } else if (mutation.type === types.updateSaveEntryResult) {
            this.updateSaveEntryResult(mutation.payload, false);
        } else if (mutation.type === types.updateSaveState) {
            this.updateSaveState(mutation.payload, false);
        } else if (mutation.type === types.updateSearchResultWithFullDetails) {
            this.updateSearchResultWithFullDetails(mutation.payload, false);
        } else if (mutation.type === types.updateSearchResults) {
            this.updateSearchResults(mutation.payload, false);
        } else if (mutation.type === types.updateSubmittedData) {
            this.updateSubmittedData(mutation.payload, false);
        }
    }

    public resetTo(s: KeeState) {
        this._state = s;
    }

    public updateActiveKeePassDatabaseIndex(payload: number, distribute: boolean = true) {
        undefAbort(payload);
        this.state.ActiveKeePassDatabaseIndex = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateActiveKeePassDatabaseIndex, payload));
    }
    public updateConnected(payload: boolean, distribute: boolean = true) {
        undefAbort(payload);
        this.state.connected = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateConnected, payload));
    }
    public updateConnectedWebsocket(payload: boolean, distribute: boolean = true) {
        undefAbort(payload);
        this.state.connectedWebsocket = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateConnectedWebsocket, payload));
    }
    public updateCurrentSearchTerm(payload: string, distribute: boolean = true) {
        undefAbort(payload);
        this.state.currentSearchTerm = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateCurrentSearchTerm, payload));
    }
    public updateKeePassDatabases(payload: Database[], distribute: boolean = true) {
        undefAbort(payload);
        this.state.KeePassDatabases = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateKeePassDatabases, payload));
    }
    public updateLastKeePassRPCRefresh(payload: number, distribute: boolean = true) {
        undefAbort(payload);
        this.state.lastKeePassRPCRefresh = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateLastKeePassRPCRefresh, payload));
    }
    public updateLatestConnectionError(payload: string, distribute: boolean = true) {
        undefAbort(payload);
        this.state.latestConnectionError = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateLatestConnectionError, payload));
    }
    public updateLoginsFound(payload: boolean, distribute: boolean = true) {
        undefAbort(payload);
        this.state.loginsFound = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateLoginsFound, payload));
    }
    public updateNotifications(payload: KeeNotification[], distribute: boolean = true) {
        undefAbort(payload);
        this.state.notifications = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateNotifications, payload));
    }
    public updatePasswordProfiles(payload: PasswordProfile[], distribute: boolean = true) {
        undefAbort(payload);
        this.state.PasswordProfiles = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updatePasswordProfiles, payload));
    }
    public updateGeneratedPassword(payload: string, distribute: boolean = true) {
        undefAbort(payload);
        this.state.generatedPassword = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateGeneratedPassword, payload));
    }
    public updateSubmittedData(payload: SubmittedData, distribute: boolean = true) {
        undefAbort(payload);
        if (!this.state.saveState) {
            this.state.saveState = new SaveState();
        }
        this.state.saveState.submittedData = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateSubmittedData, payload));
    }
    public updateSaveState(payload: SaveState, distribute: boolean = true) {
        undefAbort(payload);
        this.state.saveState = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateSaveState, payload));
    }
    public updateSearchResults(payload: EntrySummary[], distribute: boolean = true) {
        undefAbort(payload);
        this.state.searchResults = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateSearchResults, payload));
    }
    public updateSearchResultWithFullDetails(payload: Entry, distribute: boolean = true) {
        undefAbort(payload);
        const id = payload.uuid;
        for (const s of this.state.searchResults) {
            if (s.uuid === id) {
                s.fullDetails = payload;
                break;
            }
        }
        if (distribute) this.distributeAction?.(new Mutation(types.updateSearchResultWithFullDetails, payload));
    }
    public addNotification(payload: KeeNotification, distribute: boolean = true) {
        undefAbort(payload);
        this.state.notifications.push(payload);
        if (distribute) this.distributeAction?.(new Mutation(types.addNotification, payload));
    }
    public updateSaveEntryResult(payload: SaveEntryResult, distribute: boolean = true) {
        undefAbort(payload);
        this.state.saveEntryResult = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateSaveEntryResult, payload));
    }
    public removeFieldFromActiveEntry(payload: string, distribute: boolean = true) {
        undefAbort(payload);

        const firstTextFieldIndex = this.state.saveState.newEntry.fields.findIndex(
            f => f.type === "text"
        );
        const firstPasswordFieldIndex = this.state.saveState.newEntry.fields.findIndex(
            f => f.type === "password"
        );
        const originalFieldIndex = this.state.saveState.newEntry.fields.findIndex(
            f => f.uuid === payload
        );
        this.state.saveState.newEntry.fields.splice(originalFieldIndex, 1);

        if (originalFieldIndex === firstTextFieldIndex) {
            const newUsernameIndex = this.state.saveState.newEntry.fields.findIndex(
                f => f.type === "text"
            );
            if (newUsernameIndex >= 0) {
                const newUsername = this.state.saveState.newEntry.fields.splice(newUsernameIndex, 1)[0];
                this.state.saveState.newEntry.fields.splice(
                    originalFieldIndex,
                    0,
                    new Field({ ...newUsername, name: "KeePass username" })
                );
            }
        } else if (originalFieldIndex === firstPasswordFieldIndex) {
            const newPasswordIndex = this.state.saveState.newEntry.fields.findIndex(
                f => f.type === "password"
            );
            if (newPasswordIndex >= 0) {
                const newPassword = this.state.saveState.newEntry.fields.splice(newPasswordIndex, 1)[0];
                this.state.saveState.newEntry.fields.splice(
                    originalFieldIndex,
                    0,
                    new Field({ ...newPassword, name: "KeePass password" })
                );
            }
        }
        if (distribute) this.distributeAction?.(new Mutation(types.removeFieldFromActiveEntry, payload));
    }
    public updateEntryUpdateStartedAtTimestamp(payload: number, distribute: boolean = true) {
        undefAbort(payload);
        this.state.entryUpdateStartedAtTimestamp = payload;
        if (distribute) this.distributeAction?.(new Mutation(types.updateEntryUpdateStartedAtTimestamp, payload));
    }
};
