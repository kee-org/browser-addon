import { defineStore, DefineStoreOptions, StateTree, StoreDefinition, _GettersTree } from "pinia";

import { KeeState, defaults } from "./KeeState";
import { SaveState } from "../common/SaveState";
import { SessionType } from "../common/SessionType";
import { Field } from "../common/model/Field";

/**
 * A replacement for `defineStore` which makes all state properties readonly
 * to prevent mutations outside of actions.
 */
// function defineImmutableStore<Id extends string, S extends StateTree = any, G extends _GettersTree<S> = any, A = any>(
//     id: Id,
//     options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
//   ): StoreDefinition<Id, Readonly<S>, G, A> {
//     return defineStore(id, options);
//   }

const useStore = defineStore("kee", {
    state: (): KeeState => (defaults),
    getters: {
        showGeneratePasswordLink: (state: KeeState) => state.connected,
        showMatchedLogins: (state: KeeState) => !!state.loginsFound,
        showNotifications: (state: KeeState) =>
            state.notifications && !!state.notifications.length,
        databaseIsOpen: (state: KeeState) =>
            state.connected && !!state.KeePassDatabases.length,

        databaseName: (state: KeeState) => {
            if (
                state.KeePassDatabases &&
                state.KeePassDatabases.length &&
                state.ActiveKeePassDatabaseIndex >= 0
            ) {
                const db = state.KeePassDatabases[state.ActiveKeePassDatabaseIndex];
                return db.name ? db.name : db.fileName.replace(/^.*[\\/]/, "");
            }
            return "";
        },
        connectionStatus(state: KeeState): string {
            if (state.connected) {
                if (state.KeePassDatabases.length > 1) {
                    return $STRF("multiplePasswordSourcesEnabled", [
                        state.KeePassDatabases.length.toString()
                    ]);
                } else if (state.KeePassDatabases.length == 1) {
                    return this.databaseName;
                } else {
                    return $STR("notifyBarLoginToKeePassButton_tip");
                }
            } else {
                return $STR("notifyBarLaunchKeePassButton_tip");
            }
        },
        connectionStatusDetail(state: KeeState): string {
            if (state.connected) {
                if (state.KeePassDatabases.length > 1) {
                    return $STRF("loggedInMultiple_tip", [
                        state.KeePassDatabases.length.toString(),
                        this.databaseName
                    ]);
                } else if (state.KeePassDatabases.length == 1) {
                    return $STRF("loggedIn_tip", this.databaseName);
                }
            }
            return $STR("notifyBarLaunchKeePass_label");
        },
        showOpenKeePassButton: (state: KeeState) => {
            if (state.connectedWebsocket) {
                const hasWebsocketDBs = state.KeePassDatabases.some(
                    db => db.sessionType === SessionType.Websocket
                );
                const supportsWebsocketFocus = state.KeePassDatabases.some(
                    db =>
                        db.sessionType === SessionType.Websocket &&
                        db.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE") >= 0
                );
                if (!hasWebsocketDBs || supportsWebsocketFocus) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    },
    actions: {
        updateActiveKeePassDatabaseIndex(payload) {
            this.ActiveKeePassDatabaseIndex = payload;
        },

        updateConnected(payload) {
            this.connected = payload;
        },

        updateConnectedWebsocket(payload) {
            this.connectedWebsocket = payload;
        },

        updateCurrentSearchTerm(payload) {
            this.currentSearchTerm = payload;
        },

        updateKeePassDatabases(payload) {
            this.KeePassDatabases = payload;
        },

        updateLastKeePassRPCRefresh(payload) {
            this.lastKeePassRPCRefresh = payload;
        },

        updateLatestConnectionError(payload) {
            this.latestConnectionError = payload;
        },

        updateLoginsFound(payload) {
            this.loginsFound = payload || false;
        },

        updateNotifications(payload) {
            this.notifications = payload;
        },

        updatePasswordProfiles(payload) {
            this.PasswordProfiles = payload;
        },

        updateGeneratedPassword(payload) {
            this.generatedPassword = payload;
        },

        updateSubmittedData(payload) {
            if (!this.saveState) {
                this.saveState = new SaveState();
            }
            this.saveState.submittedData = payload || null;
        },

        updateSaveState(payload) {
            this.saveState = payload || null;
        },

        updateSearchResults(payload) {
            this.searchResults = payload || null;
        },

        updateSearchResultWithFullDetails(payload) {
            const id = payload.uuid;
            for (const s of this.searchResults) {
                if (s.uuid === id) {
                    s.fullDetails = payload || null;
                    break;
                }
            }
        },

        addNotification(payload) {
            this.notifications.push(payload);
        },

        updateSaveEntryResult(payload) {
            this.saveEntryResult = payload || null;
        },

        removeFieldFromActiveEntry(payload) {

            const firstTextFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.type === "text"
            );
            const firstPasswordFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.type === "password"
            );
            const originalFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.uuid === (payload || null)
            );
            this.saveState.newEntry.fields.splice(originalFieldIndex, 1);

            if (originalFieldIndex === firstTextFieldIndex) {
                const newUsernameIndex = this.saveState.newEntry.fields.findIndex(
                    f => f.type === "text"
                );
                if (newUsernameIndex < 0) return;
                const newUsername = this.saveState.newEntry.fields.splice(newUsernameIndex, 1)[0];
                this.saveState.newEntry.fields.splice(
                    originalFieldIndex,
                    0,
                    new Field({ ...newUsername, name: "KeePass username" })
                );
            } else if (originalFieldIndex === firstPasswordFieldIndex) {
                const newPasswordIndex = this.saveState.newEntry.fields.findIndex(
                    f => f.type === "password"
                );
                if (newPasswordIndex < 0) return;
                const newPassword = this.saveState.newEntry.fields.splice(newPasswordIndex, 1)[0];
                this.saveState.newEntry.fields.splice(
                    originalFieldIndex,
                    0,
                    new Field({ ...newPassword, name: "KeePass password" })
                );
            }
        },

        updateEntryUpdateStartedAtTimestamp(payload) {
            this.entryUpdateStartedAtTimestamp = payload || null;
        }

    }
});

export default useStore;

export type KeeStore = Omit<
    ReturnType<typeof useStore>,
    keyof ReturnType<typeof defineStore>
>;
