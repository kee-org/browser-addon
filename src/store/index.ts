import { defineStore, _GettersTree } from "pinia";

import { KeeState, defaults } from "./KeeState";
import { SaveState } from "../common/SaveState";
import { SessionType } from "../common/SessionType";
import { Field } from "../common/model/Field";
import { Mutation } from "./Mutation";
import * as types from "./mutation-types";
import { SaveEntryResult } from "~/common/SaveEntryResult";
import { KeeNotification } from "~/common/KeeNotification";
import { Database } from "~/common/model/Database";
import { Entry } from "~/common/model/Entry";
import { EntrySummary } from "~/common/model/EntrySummary";
import { PasswordProfile } from "~/common/model/PasswordProfile";
import { SubmittedData } from "~/common/SubmittedData";

/**
 * A replacement for `defineStore` which makes all state properties readonly
 * to prevent mutations outside of actions.
 * DOES NOT PREVENT RUNTIME MUTATIONS SO TSC MUST BE RUN AT COMPILE TIME
 */
// function defineImmutableStore<Id extends string, S extends StateTree = any, G extends _GettersTree<S> = any, A = any>(
//     id: Id,
//     options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
// ): StoreDefinition<Id, Readonly<S>, G, A> {
//     return defineStore(id, options);
// }

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

    // by default, all actions distribute their activity to other parts of the webextension.
    // The notable time we want to avoid this is when we have received a notification of
    // some activity in another part of the addon that we need to apply here.
    //TODO:f: Find some way to remove duplicate code in a typesafe manner for NonReactiveStore equivalents
    actions: {
        onRemoteMessage(sourcePort: chrome.runtime.Port, mutation: Mutation) {
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
        },
        updateActiveKeePassDatabaseIndex(payload: number, distribute: boolean = true) {
            this.ActiveKeePassDatabaseIndex = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateActiveKeePassDatabaseIndex, payload));
        },
        updateConnected(payload: boolean, distribute: boolean = true) {
            this.connected = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateConnected, payload));
        },
        updateConnectedWebsocket(payload: boolean, distribute: boolean = true) {
            this.connectedWebsocket = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateConnectedWebsocket, payload));
        },
        updateCurrentSearchTerm(payload: string, distribute: boolean = true) {
            this.currentSearchTerm = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateCurrentSearchTerm, payload));
        },
        updateKeePassDatabases(payload: Database[], distribute: boolean = true) {
            this.KeePassDatabases = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateKeePassDatabases, payload));
        },
        updateLastKeePassRPCRefresh(payload: number, distribute: boolean = true) {
            this.lastKeePassRPCRefresh = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateLastKeePassRPCRefresh, payload));
        },
        updateLatestConnectionError(payload: string, distribute: boolean = true) {
            this.latestConnectionError = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateLatestConnectionError, payload));
        },
        updateLoginsFound(payload: boolean, distribute: boolean = true) {
            this.loginsFound = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateLoginsFound, payload));
        },
        updateNotifications(payload: KeeNotification[], distribute: boolean = true) {
            this.notifications = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateNotifications, payload));
        },
        updatePasswordProfiles(payload: PasswordProfile[], distribute: boolean = true) {
            this.PasswordProfiles = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updatePasswordProfiles, payload));
        },
        updateGeneratedPassword(payload: string, distribute: boolean = true) {
            this.generatedPassword = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateGeneratedPassword, payload));
        },
        updateSubmittedData(payload: SubmittedData, distribute: boolean = true) {
            if (!this.saveState) {
                this.saveState = new SaveState();
            }
            this.saveState.submittedData = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateSubmittedData, payload));
        },
        updateSaveState(payload: SaveState, distribute: boolean = true) {
            this.saveState = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateSaveState, payload));
        },
        updateSearchResults(payload: EntrySummary[], distribute: boolean = true) {
            this.searchResults = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateSearchResults, payload));
        },
        updateSearchResultWithFullDetails(payload: Entry, distribute: boolean = true) {
            const id = payload.uuid;
            for (const s of this.searchResults) {
                if (s.uuid === id) {
                    s.fullDetails = payload;
                    break;
                }
            }
            if (distribute) this.distributeAction?.(new Mutation(types.updateSearchResultWithFullDetails, payload));
        },
        addNotification(payload: KeeNotification, distribute: boolean = true) {
            this.notifications.push(payload);
            if (distribute) this.distributeAction?.(new Mutation(types.addNotification, payload));
        },
        updateSaveEntryResult(payload: SaveEntryResult, distribute: boolean = true) {
            this.saveEntryResult = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateSaveEntryResult, payload));
        },
        removeFieldFromActiveEntry(payload: string, distribute: boolean = true) {

            const firstTextFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.type === "text"
            );
            const firstPasswordFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.type === "password"
            );
            const originalFieldIndex = this.saveState.newEntry.fields.findIndex(
                f => f.uuid === payload
            );
            this.saveState.newEntry.fields.splice(originalFieldIndex, 1);

            if (originalFieldIndex === firstTextFieldIndex) {
                const newUsernameIndex = this.saveState.newEntry.fields.findIndex(
                    f => f.type === "text"
                );
                if (newUsernameIndex >= 0) {
                    const newUsername = this.saveState.newEntry.fields.splice(newUsernameIndex, 1)[0];
                    this.saveState.newEntry.fields.splice(
                        originalFieldIndex,
                        0,
                        new Field({ ...newUsername, name: "KeePass username" })
                    );
                }
            } else if (originalFieldIndex === firstPasswordFieldIndex) {
                const newPasswordIndex = this.saveState.newEntry.fields.findIndex(
                    f => f.type === "password"
                );
                if (newPasswordIndex >= 0) {
                    const newPassword = this.saveState.newEntry.fields.splice(newPasswordIndex, 1)[0];
                    this.saveState.newEntry.fields.splice(
                        originalFieldIndex,
                        0,
                        new Field({ ...newPassword, name: "KeePass password" })
                    );
                }
            }
            if (distribute) this.distributeAction?.(new Mutation(types.removeFieldFromActiveEntry, payload));
        },
        updateEntryUpdateStartedAtTimestamp(payload: number, distribute: boolean = true) {
            this.entryUpdateStartedAtTimestamp = payload;
            if (distribute) this.distributeAction?.(new Mutation(types.updateEntryUpdateStartedAtTimestamp, payload));
        }
    }
});

export default useStore;

export type KeeStore = Omit<
    ReturnType<typeof useStore>,
    keyof ReturnType<typeof defineStore>
>;

// // We use Pinia's store and reactivity all across the extension
// // but in many scopes we won't ever want to render a real Vue
// // instance. However, Pinia requires one to exist before it
// // will dish out our store.
// let stubVueApp: App<Element>;
// let stubPinia: Pinia;
// export function useStubStore() {
//     if (!stubPinia) {
//         stubPinia = createPinia();
//     }
//     if (!stubVueApp) {
//         stubVueApp = createApp(defineComponent);
//         stubVueApp.use(stubPinia);
//     }
//     return useStore();
// }
