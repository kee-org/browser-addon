<!-- eslint-disable vuetify/no-deprecated-props -->
<!-- above due to eslint bug incorrectly highlighting border="top" as a problem -->
<template>
    <v-app class="">
        <v-app-bar v-model="showSearchPanel" class="py-1" density="compact" app style="max-width: 400px">
            <SearchInput />
        </v-app-bar>
        <v-main>
            <v-container fluid class="overflow-auto pa-0" style="padding: 8px;">
                <div :class="`${showSearchPanel ? 'app_height_medium' : 'app_height_tall'}`">
                    <v-alert v-show="showSaveRecovery" color="secondary" border="top" border-color="primary"
                        elevation="1">
                        <v-row dense>
                            <v-col>{{ $i18n("unsaved_changes") }}</v-col>
                        </v-row>
                        <v-row dense class="py-1" align="start">
                            <v-col>
                                <v-btn color="primary" size="small" @click="saveRecover">
                                    {{ $i18n("continue_saving") }}
                                </v-btn>
                            </v-col>
                            <v-col>
                                <v-btn color="tertiary" size="small" @click="saveDiscard">
                                    {{ $i18n("discard_changes") }}
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-alert>
                    <v-alert v-show="showSaveResult" color="secondary" border="top" border-color="primary"
                        elevation="1">
                        <v-row dense>
                            <v-col>{{ $i18n("you_recently_saved") }}</v-col>
                        </v-row>
                        <v-row dense class="py-1" align="start">
                            <v-col>
                                <v-btn size="small" @click="openFullEntryEditor">
                                    {{ $i18n("open_full_editor") }}
                                </v-btn>
                            </v-col>
                            <v-spacer />
                        </v-row>
                    </v-alert>

                    <div v-if="showNotifications" id="notifications" class="pt-6">
                        <Notification v-for="n of notifications" :key="n.id" :notification="n" />
                    </div>
                    <SearchResults v-show="showSearchPanel" :matched-entries-in="cachedMatchedEntries" :frame-id="frameId"
                        @pref-entry-toggle="prefEntryToggle" />
                    <Save1stParty v-if="showSaveStart && !showSaveWhere" @save-where-clicked="saveWhere"
                        @cancel-clicked="saveDiscard" />
                    <SaveWhere v-if="showSaveWhere" :display-reason="displayWhereReason"
                        :preferred-group-uuid="preferredGroupUuid" />
                </div>
            </v-container>
        </v-main>


        <v-btn v-show="showSearchPanel && !showSaveRecovery" position="fixed" location="bottom right" color="primary"
            style="bottom: 70px; right: 16px" :class="hasSubmittedData ? 'pulse-button' : ''" icon @click="saveStart">
            <mdi-plus scale="150" />
            <v-tooltip location="left" :open-delay="tooltipDelay" activator="parent">
                <span>{{ $i18n("create_new_entry") }}</span>
            </v-tooltip>
        </v-btn>

        <v-footer app height="auto" style="padding:8px;">
            <v-btn id="password-open-kee-vault" :aria-label="$i18n('Menu_Button_open_kee_vault_label')"
                class="ml-0 mr-1" size="small" icon @click="openKeeVault">
                <v-img width="24px" height="24px" src="/assets/images/48-kee-vault.png" />
                <v-tooltip location="top" :open-delay="tooltipDelay" activator="parent">
                    <span>{{ $i18n("Menu_Button_open_kee_vault_label") }}</span>
                </v-tooltip>
            </v-btn>

            <v-btn v-show="showOpenKeePassButton" id="password-open-keepass"
                :aria-label="$i18n('Menu_Button_open_keepass_label')" class="mr-1 ml-n1" size="small" icon
                @click="openKeePass">
                <v-img width="24px" height="24px" src="/assets/images/48-keepass.png" />
                <v-tooltip location="top" :open-delay="tooltipDelay" activator="parent">
                    <span>{{ $i18n("Menu_Button_open_keepass_label") }}</span></v-tooltip>
            </v-btn>
            <v-divider vertical />
            <mdi-lock :color="statusIconColour" class="mx-1" />

            <div class="text-caption py-1 shrink"
                style="word-break: break-word; overflow-wrap: break-word; max-width: 210px; font-size: 0.8rem">
                {{ connectionStatus }}
                <v-tooltip location="top" :open-delay="tooltipDelay" activator="parent">
                    <span>{{ connectionStatusDetail }}</span>
                </v-tooltip>
            </div>
            <!--
            <v-spacer /> -->

            <v-btn icon size="small" class="ms-auto">
                <mdi-menu scale="150" />
                <v-menu location="top" activator="parent">
                    <v-list>
                        <v-list-item @click="showHelp">
                            <v-list-item-title class="text-right text-body-2">
                                {{ $i18n("Help_Centre_Button_label") }}
                            </v-list-item-title>
                            <template #append>
                                <mdi-help class="ml-2" />
                            </template>
                        </v-list-item>
                        <v-list-item @click="showOptions">
                            <v-list-item-title class="text-right text-body-2">
                                {{ $i18n("Menu_Button_options_label") }}
                            </v-list-item-title>
                            <template #append>
                                <mdi-cog class="ml-2" />
                            </template>
                        </v-list-item>
                        <v-list-item v-show="showSearchPanel" @click="showPasswordGenerator = true">
                            <v-list-item-title class="text-right text-body-2">
                                {{ $i18n("Menu_Button_copyNewPasswordToClipboard_label") }}
                            </v-list-item-title>
                            <template #append>
                                <mdi-flash class="ml-2" />
                            </template>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-btn>
        </v-footer>
        <PasswordGenerator v-if="showPasswordGenerator" :standalone="true" @dialog-closed="passwordGeneratorClosed"
            @copy-to-clipboard="copyToClipboard" />
    </v-app>
</template>

<script lang="ts">
import Notification from "./components/Notification.vue";
import SearchInput from "./components/SearchInput.vue";
import SearchResults from "./components/SearchResults.vue";
import Save1stParty from "./components/Save1stParty.vue";
import SaveWhere from "./components/SaveWhere.vue";
import PasswordGenerator from "../common/components/PasswordGenerator.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { SaveState } from "../common/SaveState";
import { Entry } from "../common/model/Entry";
import { supplementEntryState } from "./supplementEntryState";
import { fetchFavicon, getFaviconUrl } from "./favicon";
import { autoRecoveryTimeMs, manualRecoveryPromptTimeMs, tooltipDelay } from "../common/Timings";
import { SaveEntryResult } from "../common/SaveEntryResult";
import { Field } from "../common/model/Field";
import { Locator } from "../common/model/Locator";
import { copyStringToClipboard } from "../common/copyStringToClipboard";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import useStore from "../store";
import { mapState } from "pinia";
import punycode from "punycode/";

export default {
    components: {
        Notification: Notification,
        SearchResults: SearchResults,
        SearchInput: SearchInput,
        Save1stParty: Save1stParty,
        SaveWhere: SaveWhere,
        PasswordGenerator: PasswordGenerator
    },
    props: ["matchedEntries", "frameId"],
    setup() {
        const { updateSaveState, updateSaveEntryResult } = useStore();
        return { updateSaveState, updateSaveEntryResult };
    },
    data: function () {
        return {
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

            cachedMatchedEntries: this.matchedEntries,

            // imported constants are only available in Vue if we assign them to data
            tooltipDelay: tooltipDelay,
            manualRecoveryPromptTimeMs: manualRecoveryPromptTimeMs,
            autoRecoveryTimeMs: autoRecoveryTimeMs,
            showPasswordGenerator: false,
            lastSaveEntryResult: null
        };
    },
    computed: {
        ...mapState(useStore, [
            "showGeneratePasswordLink",
            "saveState",
            "showMatchedLogins",
            "showOpenKeePassButton",
            "connectionStatus",
            "connectionStatusDetail",
            "connected",
            "databaseIsOpen",
            "notifications",
            "showNotifications",
            "connectedWebsocket",
            "saveEntryResult"
        ]),
        statusIconColour: function () {
            if (this.connected && this.databaseIsOpen) {
                return "green";
            } else if (this.connected) {
                return "orange";
            }
            return "red";
        },
        showSaveStart: function () {
            return new Date(this.saveLastActiveAt) > new Date(Date.now() - this.autoRecoveryTimeMs);
        },
        showSaveRecovery: function () {
            KeeLog.debug(`showSaveRecovery ${this.showSaveStart} : ${new Date(this.saveLastActiveAt)} ${new Date(Date.now() - this.manualRecoveryPromptTimeMs
            )} : ${new Date(this.saveLastActiveAt) > new Date(Date.now() - this.manualRecoveryPromptTimeMs)}`);
            return (
                !this.showSaveStart &&
                new Date(this.saveLastActiveAt) >
                new Date(Date.now() - this.manualRecoveryPromptTimeMs)
            );
        },
        showSearchPanel: function () {
            return this.databaseIsOpen && !this.showSaveStart;
        },
        hasSubmittedData: function () {
            return (this.saveState as SaveState)?.submittedData?.fields?.length > 0;
        },
        showSaveResult: function () {
            return this.lastSaveEntryResult && !this.showSaveStart;
        }
    },
    watch: {
        saveState: {
            handler: function (newState: SaveState, oldState: SaveState) {
                //TODO: For some reason the old and new state are always identical.
                // So we now always update the last active date but this may have
                // some side-effect we're yet to find. Perhaps the watch only
                // gets called as a response to a reflected message from the
                // background so it has already been changed locally.
                if (newState?.newEntry?.uuid !== oldState?.newEntry?.uuid) {
                    KeeLog.debug("savestate watch modified");
                } else {
                    KeeLog.debug("savestate watch not modified");
                }
                this.saveLastActiveAt = newState.lastActiveAt;
            },
            deep: true
        },
    },
    mounted: async function () {
        this.saveLastActiveAt = this.saveState?.lastActiveAt;

        const discardRequired = this.handleLastSaveResult();

        // Clear the newEntry if it is beyond our maximum recovery time
        // This frees up memory but more importantly allows the watch for saveState to
        // set the appropriate last active datetime when the user attempts to re-edit
        // the same entry as most recently.
        if (
            discardRequired ||
            this.saveState?.lastActiveAt <=
            new Date(Date.now() - this.manualRecoveryPromptTimeMs)
        ) {
            KeeLog.debug("discarding upon mount");
            this.saveDiscard();
        }

        const favIconUrl = await getFaviconUrl();
        if (!favIconUrl) return;
        const favicon = await fetchFavicon(favIconUrl);
        if (!favicon) return;

        const updatedSaveState = Object.assign({}, JSON.parse(JSON.stringify(this.saveState)));
        updatedSaveState.favicon = favicon;
        this.updateSaveState(updatedSaveState);
    },
    methods: {
        showOptions: () => {
            browser.runtime.openOptionsPage();
            window.close();
        },
        saveStart: async function () {
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
            const ss = JSON.parse(JSON.stringify(this.saveState as SaveState));
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = supplementEntryState(new Entry(entryTemplate), ss);
            updatedSaveState.titleResetValue = updatedSaveState.newEntry.title;
            updatedSaveState.lastActiveAt = new Date();
            updatedSaveState.showURLMismatchWarning = false;
            KeeLog.debug("updating saveState");
            this.updateSaveState(updatedSaveState);
            //this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveRecover: function () {
            const ss = JSON.parse(JSON.stringify(this.saveState as SaveState));
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.lastActiveAt = new Date();
            this.updateSaveState(updatedSaveState);

            // Normally we ignore active datetime changes but user has explicitly requested this
            this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveDiscard: function () {
            const ss = JSON.parse(JSON.stringify(this.saveState as SaveState));
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = new Entry({});
            updatedSaveState.titleResetValue = null;
            updatedSaveState.lastActiveAt = null;
            updatedSaveState.showURLMismatchWarning = false;
            updatedSaveState.favicon = null;
            this.updateSaveState(updatedSaveState);
            //this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveWhere: function (displayWhereReason: string, preferredGroupUuid: string) {
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
            if (this.connectedWebsocket) {
                Port.postMessage({ action: Action.OpenKeePass });
            } else {
                KeeLog.info("KeePass no longer connected so taking no action");
            }
            window.close();
        },
        handleLastSaveResult: function () {
            const lastResult = this.saveEntryResult as SaveEntryResult;

            if (!lastResult?.result) return false;

            if (lastResult.result === "created" || lastResult.result === "updated") {
                if (!configManager.current.hideConfirmationAfterSave) {
                    this.lastSaveEntryResult = lastResult;
                }
                this.updateSaveEntryResult({
                    result: null,
                    receivedAt: new Date()
                } as SaveEntryResult);
                return true;
            } else {
                this.updateSaveEntryResult({
                    result: null,
                    receivedAt: new Date()
                } as SaveEntryResult);
                return false;
            }
        },
        passwordGeneratorClosed: function () {
            this.showPasswordGenerator = false;
        },
        copyToClipboard: async function (payload) {
            if (payload?.value) await copyStringToClipboard(payload.value);
        },
        prefEntryToggle: async function (payload: any) {
            if (payload?.uuid) {
                const currentTab = (
                    await browser.tabs.query({
                        active: true,
                        currentWindow: true
                    })
                )[0];
                if (!currentTab) return;
                const url = new URL(currentTab.url);
                url.hostname = punycode.toUnicode(url.hostname);
                configManager.togglePreferredEntryUuid(payload.uuid, url.href);
                const conf = configManager.siteConfigFor(url.href);
                this.cachedMatchedEntries = this.cachedMatchedEntries.map(me => {
                    me.isPreferredMatch = conf.preferredEntryUuid === me.uuid ? true : false;
                    return me;
                });
                Port.postMessage({ action: Action.DetectForms } as AddonMessage);
            }
        },
        openFullEntryEditor: function () {
            Port.postMessage({
                loginEditor: {
                    uuid: this.lastSaveEntryResult.uuid,
                    DBfilename: this.lastSaveEntryResult.fileName
                }
            } as AddonMessage);
            this.lastSaveEntryResult = null;
            window.close();
        }
    }
};
</script>

<style>
.text-truncate{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}

.app_height_medium {
    max-height: 456px;
    min-height: 456px;
    height: 456px;
}

.app_height_tall {
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
