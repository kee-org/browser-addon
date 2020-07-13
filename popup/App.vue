<template>
    <v-app id="inspire">
        <v-app-bar v-model="showSearchPanel" app style="max-width: 400px;">
            <SearchInput />
        </v-app-bar>
        <v-main :class="`${showSearchPanel ? 'app_height_medium' : 'app_height_tall'}`">
            <v-container fluid>
                <v-alert
                    v-show="showSaveRecovery"
                    color="secondary"
                    border="top"
                    colored-border
                    elevation="1"
                >
                    <v-row dense>
                        <v-col>{{ $i18n("unsaved_changes") }}</v-col>
                    </v-row>
                    <v-row dense align="start">
                        <v-col>
                            <v-btn color="primary" @click="saveRecover">
                                {{ $i18n("continue_saving") }}
                            </v-btn>
                        </v-col>
                        <v-col>
                            <v-btn color="tertiary" @click="saveDiscard">
                                {{ $i18n("discard_changes") }}
                            </v-btn>
                        </v-col>
                        <v-spacer />
                    </v-row>
                </v-alert>
                <div v-if="showNotifications" id="notifications" class="pt-6">
                    <Notification v-for="n of notifications" :key="n.id" :notification="n" />
                </div>
                <SearchResults
                    v-show="showSearchPanel"
                    :matched-entries="matchedEntries"
                    :frame-id="frameId"
                />
                <Save1stParty
                    v-if="showSaveStart && !showSaveWhere"
                    @save-where-clicked="saveWhere"
                    @cancel-clicked="saveDiscard"
                />
                <SaveWhere
                    v-if="showSaveWhere"
                    :display-reason="displayWhereReason"
                    :preferred-group-uuid="preferredGroupUuid"
                />
            </v-container>
        </v-main>

        <v-tooltip left :open-delay="tooltipDelay">
            <template v-slot:activator="{ on }">
                <v-btn
                    v-show="showSearchPanel && !showSaveRecovery"
                    fab
                    small
                    absolute
                    bottom
                    right
                    color="primary"
                    style="bottom: 75px; right: 24px;"
                    :class="hasSubmittedData ? 'pulse-button' : ''"
                    v-on="on"
                    @click="saveStart"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
            </template>
            <span>{{ $i18n("create_new_entry") }}</span>
        </v-tooltip>

        <v-footer app height="auto">
            <v-tooltip top :open-delay="tooltipDelay">
                <template v-slot:activator="{ on }">
                    <v-btn
                        id="password-open-kee-vault"
                        :aria-label="$i18n('Menu_Button_open_kee_vault_label')"
                        class="ml-0 mr-2"
                        icon
                        v-on="on"
                        @click="openKeeVault"
                    >
                        <img width="24px" height="24px" src="../common/images/48-kee-vault.png" />
                    </v-btn>
                </template>
                <span>{{ $i18n("Menu_Button_open_kee_vault_label") }}</span>
            </v-tooltip>
            <v-tooltip top :open-delay="tooltipDelay">
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-show="showOpenKeePassButton"
                        id="password-open-keepass"
                        :aria-label="$i18n('Menu_Button_open_keepass_label')"
                        class="mr-2 ml-n1"
                        icon
                        v-on="on"
                        @click="openKeePass"
                    >
                        <img width="24px" height="24px" src="../common/images/48-keepass.png" />
                    </v-btn>
                </template>
                <span>{{ $i18n("Menu_Button_open_keepass_label") }}</span>
            </v-tooltip>
            <v-divider vertical />
            <v-icon size="20px" :color="statusIconColour" class="mx-2">
                mdi-lock
            </v-icon>
            <v-tooltip top :open-delay="tooltipDelay">
                <template v-slot:activator="{ on }">
                    <div
                        class="text-caption py-1 shrink"
                        style="word-break: break-word; overflow-wrap: break-word; max-width: 210px;"
                        v-on="on"
                    >
                        {{ connectionStatus }}
                    </div>
                </template>
                <span>{{ connectionStatusDetail }}</span>
            </v-tooltip>

            <v-spacer />

            <v-menu top offset-y small>
                <template v-slot:activator="{ on }">
                    <v-btn icon small v-on="on">
                        <v-icon>mdi-menu</v-icon>
                    </v-btn>
                </template>

                <v-list>
                    <v-list-item @click="showHelp">
                        <v-list-item-title right class="mr-4 text-right text-body-2">
                            {{ $i18n("Help_Centre_Button_label") }}
                        </v-list-item-title>
                        <v-icon size="20px">
                            mdi-help
                        </v-icon>
                    </v-list-item>
                    <v-list-item @click="showOptions">
                        <v-list-item-title class="mr-4 text-right body-2">
                            {{ $i18n("Menu_Button_options_label") }}
                        </v-list-item-title>
                        <v-icon size="20px">
                            mdi-settings
                        </v-icon>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-footer>
    </v-app>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { names as actionNames } from "../store/action-names";
import { SessionType } from "../common/SessionType";
import { KeeState } from "../store/KeeState";
import Notification from "./components/Notification.vue";
import SearchInput from "./components/SearchInput.vue";
import SearchResults from "./components/SearchResults.vue";
import Save1stParty from "./components/Save1stParty.vue";
import SaveWhere from "./components/SaveWhere.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { SaveState } from "../common/SaveState";
import { KeeVue } from "./KeeVue";
import { Entry } from "../common/model/Entry";
import { supplementEntryState } from "./supplementEntryState";
import { fetchFavicon, getFaviconUrl } from "./favicon";
import { autoRecoveryTimeMs, manualRecoveryPromptTimeMs, tooltipDelay } from "../common/Timings";
import { SaveEntryResult } from "../common/SaveEntryResult";
import { Field } from "../common/model/Field";
import { Locator } from "../common/model/Locator";

export default {
    components: {
        Notification,
        SearchResults,
        SearchInput,
        Save1stParty,
        SaveWhere
    },
    mixins: [Port.mixin],
    props: ["matchedEntries", "frameId"],
    data: () => ({
        // We can't use the Vuex property directly because when it changes it causes
        // the app to re-render from scratch, destroying the user input that triggered
        // the datestamp change. Instead we can watch for changes and only modify this
        // value in a set of circumstances that meet our requirements.
        // Also note that Chromium and Firefox extensions behave differently - Chrome
        // persists strings to represent the Date whereas Firefox persists a valid
        // Date object. Hence every place where this is used, you must wrap the
        // variable in a new Date(...) call before comparing against other Dates
        saveLastActiveAt: null,
        showSaveWhere: false,
        displayWhereReason: null,
        preferredGroupUuid: "",

        // imported constants are only available in Vue if we assign them to data
        tooltipDelay,
        manualRecoveryPromptTimeMs,
        autoRecoveryTimeMs
    }),
    computed: {
        ...mapGetters([
            "showGeneratePasswordLink",
            "saveState",
            "showMatchedLogins",
            "showOpenKeePassButton",
            "connectionStatus",
            "connectionStatusDetail",
            "connected",
            "databaseIsOpen",
            "notifications",
            "showNotifications"
        ]),
        statusIconColour: function (this: any) {
            if (this.connected && this.databaseIsOpen) {
                return "green";
            } else if (this.connected) {
                return "orange";
            }
            return "red";
        },
        showSaveStart: function (this: any) {
            return new Date(this.saveLastActiveAt) > new Date(Date.now() - this.autoRecoveryTimeMs);
        },
        showSaveRecovery: function (this: any) {
            return (
                !this.showSaveStart &&
                new Date(this.saveLastActiveAt) >
                    new Date(Date.now() - this.manualRecoveryPromptTimeMs)
            );
        },
        showSearchPanel: function (this: any) {
            return this.databaseIsOpen && !this.showSaveStart;
        },
        hasSubmittedData: function (this: any) {
            return (this.$store.state.saveState as SaveState)?.submittedData?.fields?.length > 0;
        }
    },
    watch: {
        saveState: function (this: any, newState: SaveState, oldState: SaveState) {
            if (newState?.newEntry?.uuid !== oldState?.newEntry?.uuid) {
                this.saveLastActiveAt = newState.lastActiveAt;
            }
        }
    },
    async mounted(this: any) {
        this.saveLastActiveAt = this.$store.state.saveState?.lastActiveAt;

        const discardRequired = this.handleLastSaveResult();

        // Clear the newEntry if it is beyond our maximum recovery time
        // This frees up memory but more importantly allows the watch for saveState to
        // set the appropriate last active datetime when the user attempts to re-edit
        // the same entry as most recently.
        if (
            discardRequired ||
            this.$store.state.saveState?.lastActiveAt <=
                new Date(Date.now() - this.manualRecoveryPromptTimeMs)
        ) {
            this.saveDiscard();
        }

        const favIconUrl = await getFaviconUrl();
        if (!favIconUrl) return;
        const favicon = await fetchFavicon(favIconUrl);
        if (!favicon) return;

        const updatedSaveState = Object.assign({}, this.$store.state.saveState);
        updatedSaveState.favicon = favicon;
        this.$store.dispatch("updateSaveState", updatedSaveState);
    },
    methods: {
        ...mapActions(actionNames),
        showOptions: () => {
            browser.runtime.openOptionsPage();
            window.close();
        },
        saveStart: async function (this: any) {
            const currentTab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
            if (!currentTab) return;
            const entryTemplate = {
                URLs: [currentTab.url],
                title: currentTab.title,
                fields: [
                    new Field({
                        name: "KeePass username",
                        type: "text",
                        locators: [
                            new Locator({
                                type: "text"
                            })
                        ]
                    }),
                    new Field({
                        name: "KeePass password",
                        type: "password",
                        locators: [
                            new Locator({
                                type: "password"
                            })
                        ]
                    })
                ]
            };
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = supplementEntryState(new Entry(entryTemplate), ss);
            updatedSaveState.titleResetValue = updatedSaveState.newEntry.title;
            updatedSaveState.lastActiveAt = new Date();
            updatedSaveState.showURLMismatchWarning = false;
            this.$store.dispatch("updateSaveState", updatedSaveState);
            //this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveRecover: function (this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.lastActiveAt = new Date();
            this.$store.dispatch("updateSaveState", updatedSaveState);

            // Normally we ignore active datetime changes but user has explicitly requested this
            this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveDiscard: function (this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = new Entry({});
            updatedSaveState.titleResetValue = null;
            updatedSaveState.lastActiveAt = null;
            updatedSaveState.showURLMismatchWarning = false;
            updatedSaveState.favicon = null;
            this.$store.dispatch("updateSaveState", updatedSaveState);
            //this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveWhere: function (this: any, displayWhereReason: string, preferredGroupUuid: string) {
            this.displayWhereReason = displayWhereReason;
            this.preferredGroupUuid = preferredGroupUuid;
            this.showSaveWhere = true;
        },
        showHelp: () => {
            browser.tabs.create({ url: "https://www.kee.pm/help" });
            window.close();
        },
        openKeeVault: async function () {
            KeeLog.debug("open Kee Vault requested");
            const vaultTabs = await browser.tabs.query({
                url: [
                    "https://keevault.pm/*",
                    "https://app-beta.kee.pm/*",
                    "https://app-dev.kee.pm/*"
                ]
            });
            if (vaultTabs && vaultTabs[0]) {
                browser.tabs.update(vaultTabs[0].id, { active: true });
                browser.windows.update(vaultTabs[0].windowId, { focused: true });
            } else {
                browser.tabs.create({
                    url: "https://keevault.pm/",
                    active: true
                });
            }
            window.close();
        },
        openKeePass: function () {
            KeeLog.debug("open KeePass requested");
            if ((this as any).$store.state.connectedWebsocket) {
                Port.postMessage({ action: Action.OpenKeePass });
            } else {
                KeeLog.info("KeePass no longer connected so taking no action");
            }
            window.close();
        },
        handleLastSaveResult: function (this: any) {
            const lastResult = this.$store.state.saveEntryResult as SaveEntryResult;

            if (!lastResult.result) return false;

            if (lastResult.result === "created" || lastResult.result === "updated") {
                //TODO: Render info notification panel before wiping current data - see #263
                this.$store.dispatch("updateSaveEntryResult", {
                    result: null,
                    receivedAt: new Date()
                } as SaveEntryResult);
                return true;
            } else {
                this.$store.dispatch("updateSaveEntryResult", {
                    result: null,
                    receivedAt: new Date()
                } as SaveEntryResult);
                return false;
            }
        }
    }
};
</script>

<style>
.v-main__wrap {
    overflow-y: scroll;
}

.app_height_medium .v-main__wrap {
    max-height: 466px;
    min-height: 466px;
    height: 466px;
}

.app_height_tall .v-main__wrap {
    max-height: 522px;
    min-height: 522px;
    height: 522px;
}

.pulse-button {
    animation: pulse 0.5s 2 cubic-bezier(0.45, 0.05, 0.55, 0.95) 0.25s reverse;
}

@keyframes pulse {
    0% {
        opacity: 1;
        transform: scale(1);
    }
    25% {
        opacity: 1;
        transform: scale(1.25);
    }
    50% {
        opacity: 1;
        transform: scale(1);
    }
    75% {
        opacity: 1;
        transform: scale(0.8);
    }
    100% {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
