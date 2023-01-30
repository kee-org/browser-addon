import { createPinia, defineStore, DefineStoreOptions, Pinia, StateTree, StoreDefinition, _GettersTree } from "pinia";

import { KeeState, defaults } from "./KeeState";
import { SaveState } from "../common/SaveState";
import { SessionType } from "../common/SessionType";
import { Field } from "../common/model/Field";
import { App } from "vue";
import { KeeLog } from "~/common/Logger";

/**
 * A replacement for `defineStore` which makes all state properties readonly
 * to prevent mutations outside of actions.
 * DOES NOT PREVENT RUNTIME MUTATIONS SO TSC MUST BE RUN AT COMPILE TIME
 */
function defineImmutableStore<Id extends string, S extends StateTree = any, G extends _GettersTree<S> = any, A = any>(
    id: Id,
    options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
): StoreDefinition<Id, Readonly<S>, G, A> {
    return defineStore(id, options);
}

const useStore = defineImmutableStore("kee", {
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
            this.$patch({ ActiveKeePassDatabaseIndex: payload });
        },

        updateConnected(payload) {
            this.$patch({ connected: payload });
        },

        updateConnectedWebsocket(payload) {
            this.$patch({ connectedWebsocket: payload });
        },

        updateCurrentSearchTerm(payload) {
            this.$patch({ currentSearchTerm: payload });
        },

        updateKeePassDatabases(payload) {
            this.$patch({ KeePassDatabases: payload });
        },

        updateLastKeePassRPCRefresh(payload) {
            this.$patch({ lastKeePassRPCRefresh: payload });
        },

        updateLatestConnectionError(payload) {
            this.$patch({ latestConnectionError: payload });
        },

        updateLoginsFound(payload) {
            this.$patch({ loginsFound: payload || false });
        },

        updateNotifications(payload) {
            this.$patch({ notifications: payload });
        },

        updatePasswordProfiles(payload) {
            this.$patch({ PasswordProfiles: payload });
        },

        updateGeneratedPassword(payload) {
            this.$patch({ generatedPassword: payload });
        },

        updateSubmittedData(payload) {
            //const patch = this.saveState ? {} : new SaveState();
            this.$patch({
                saveState: {
                    submittedData: payload || null
                }
            });
        },

        updateSaveState(payload) {
            this.$patch({ saveState: payload || null });
        },

        updateSearchResults(payload) {
            this.$patch({ searchResults: payload || null });
        },

        updateSearchResultWithFullDetails(payload) {
            const cloned = JSON.parse(JSON.stringify(this.searchResults));
            const id = payload.uuid;
            for (const s of cloned) {
                if (s.uuid === id) {
                    s.fullDetails = payload || null;
                    break;
                }
            }
            this.$patch({ searchResults: cloned });
        },

        addNotification(payload) {
            const cloned = JSON.parse(JSON.stringify(this.notifications));
            cloned.push(payload);
            this.$patch({ notifications: cloned });
        },

        updateSaveEntryResult(payload) {
            this.$patch({ saveEntryResult: payload || null });
        },

        removeFieldFromActiveEntry(payload) {
            const cloned = JSON.parse(JSON.stringify(this.saveState.newEntry.fields));
            const firstTextFieldIndex = cloned.findIndex(
                f => f.type === "text"
            );
            const firstPasswordFieldIndex = cloned.findIndex(
                f => f.type === "password"
            );
            const originalFieldIndex = cloned.findIndex(
                f => f.uuid === (payload || null)
            );
            cloned.splice(originalFieldIndex, 1);

            if (originalFieldIndex === firstTextFieldIndex) {
                const newUsernameIndex = cloned.findIndex(
                    f => f.type === "text"
                );
                if (newUsernameIndex >= 0) {
                    const newUsername = cloned.splice(newUsernameIndex, 1)[0];
                    cloned.splice(
                        originalFieldIndex,
                        0,
                        new Field({ ...newUsername, name: "KeePass username" })
                    );
                }
            } else if (originalFieldIndex === firstPasswordFieldIndex) {
                const newPasswordIndex = cloned.findIndex(
                    f => f.type === "password"
                );
                if (newPasswordIndex >= 0) {
                    const newPassword = cloned.splice(newPasswordIndex, 1)[0];
                    cloned.splice(
                        originalFieldIndex,
                        0,
                        new Field({ ...newPassword, name: "KeePass password" })
                    );
                }
            }
            KeeLog.debug(`before ${JSON.stringify(this.saveState)}`);
            this.$patch({ saveState: { newEntry: { fields: cloned } } });
            KeeLog.debug(`after ${JSON.stringify(this.saveState)}`);
        },

        updateEntryUpdateStartedAtTimestamp(payload) {
            this.$patch({ entryUpdateStartedAtTimestamp: payload || null });
        }

    }
});

export default useStore;

export type KeeStore = Omit<
    ReturnType<typeof useStore>,
    keyof ReturnType<typeof defineStore>
>;


//TODO: Does this create a suitable stub Vue instance for Pinia to work with MV2?
let stubVueApp: App<Element>;
let stubPinia: Pinia;
export function useStubStore() {
    if (!stubPinia) {
        stubPinia = createPinia();
    }
    if (!stubVueApp) {
        stubVueApp = createApp(defineComponent);
        stubVueApp.use(stubPinia);
    }
    return useStore();
}
