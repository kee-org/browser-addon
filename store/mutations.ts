import * as types from "./mutation-types";
import { KeeState } from "./KeeState";
import { SaveState } from "../common/SaveState";
import { Entry } from "../common/model/Entry";
import { SaveEntryResult } from "../common/SaveEntryResult";
import { Field } from "../common/model/Field";

function undefAbort(payload) {
    if (payload === undefined) {
        throw new Error(
            "FATAL! undefined value sent to commit that must never set an undefined value. No-one knows what will happen now but Kee is probably broken in some way until a browser restart."
        );
    }
}

export default {
    [types.updateActiveKeePassDatabaseIndex](state: KeeState, payload) {
        undefAbort(payload);
        state.ActiveKeePassDatabaseIndex = payload;
    },
    [types.updateConnected](state: KeeState, payload) {
        undefAbort(payload);
        state.connected = payload;
    },
    [types.updateConnectedWebsocket](state: KeeState, payload) {
        undefAbort(payload);
        state.connectedWebsocket = payload;
    },
    [types.updateCurrentSearchTerm](state: KeeState, payload) {
        undefAbort(payload);
        state.currentSearchTerm = payload;
    },
    [types.updateKeePassDatabases](state: KeeState, payload) {
        undefAbort(payload);
        state.KeePassDatabases = payload;
    },
    [types.updateLastKeePassRPCRefresh](state: KeeState, payload) {
        undefAbort(payload);
        state.lastKeePassRPCRefresh = payload;
    },
    [types.updateLatestConnectionError](state: KeeState, payload) {
        undefAbort(payload);
        state.latestConnectionError = payload;
    },
    [types.updateLoginsFound](state: KeeState, payload) {
        undefAbort(payload);
        state.loginsFound = payload;
    },
    [types.updateNotifications](state: KeeState, payload) {
        undefAbort(payload);
        state.notifications = payload;
    },
    [types.updatePasswordProfiles](state: KeeState, payload) {
        undefAbort(payload);
        state.PasswordProfiles = payload;
    },
    [types.updateGeneratedPassword](state: KeeState, payload) {
        undefAbort(payload);
        state.generatedPassword = payload;
    },
    [types.updateSubmittedData](state: KeeState, payload) {
        undefAbort(payload);
        if (!state.saveState) {
            state.saveState = new SaveState();
        }
        state.saveState.submittedData = payload;
    },
    [types.updateSaveState](state: KeeState, payload: SaveState) {
        undefAbort(payload);
        state.saveState = payload;
    },
    [types.updateSearchResults](state: KeeState, payload) {
        undefAbort(payload);
        state.searchResults = payload;
    },
    [types.updateSearchResultWithFullDetails](state: KeeState, payload: Entry) {
        undefAbort(payload);
        const id = payload.uuid;
        for (const s of state.searchResults) {
            if (s.uuid === id) {
                s.fullDetails = payload;
                break;
            }
        }
    },
    [types.addNotification](state: KeeState, payload) {
        undefAbort(payload);
        state.notifications.push(payload);
    },
    [types.updateSaveEntryResult](state: KeeState, payload: SaveEntryResult) {
        undefAbort(payload);
        state.saveEntryResult = payload;
    },
    [types.removeFieldFromActiveEntry](state: KeeState, payload: string) {
        undefAbort(payload);

        const firstTextFieldIndex = state.saveState.newEntry.fields.findIndex(
            f => f.type === "text"
        );
        const firstPasswordFieldIndex = state.saveState.newEntry.fields.findIndex(
            f => f.type === "password"
        );
        const originalFieldIndex = state.saveState.newEntry.fields.findIndex(
            f => f.uuid === payload
        );
        state.saveState.newEntry.fields.splice(originalFieldIndex, 1);

        if (originalFieldIndex === firstTextFieldIndex) {
            const newUsernameIndex = state.saveState.newEntry.fields.findIndex(
                f => f.type === "text"
            );
            if (newUsernameIndex < 0) return;
            const newUsername = state.saveState.newEntry.fields.splice(newUsernameIndex, 1)[0];
            state.saveState.newEntry.fields.splice(
                originalFieldIndex,
                0,
                new Field({ ...newUsername, name: "KeePass username" })
            );
        } else if (originalFieldIndex === firstPasswordFieldIndex) {
            const newPasswordIndex = state.saveState.newEntry.fields.findIndex(
                f => f.type === "password"
            );
            if (newPasswordIndex < 0) return;
            const newPassword = state.saveState.newEntry.fields.splice(newPasswordIndex, 1)[0];
            state.saveState.newEntry.fields.splice(
                originalFieldIndex,
                0,
                new Field({ ...newPassword, name: "KeePass password" })
            );
        }
    },
    [types.updateEntryUpdateStartedAtTimestamp](state: KeeState, payload) {
        undefAbort(payload);
        state.entryUpdateStartedAtTimestamp = payload;
    }
};
