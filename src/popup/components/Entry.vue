<template>
    <v-hover>
        <v-card
            ref="card"
            v-slot="{ hover }"
            :tabindex="`${tabindex}`"
            :elevation="`${hover ? 12 : 3}`"
            class="my-2"
            :ripple="false"
            @focusin="focusin"
            @focusout="focusout"
            @keyup.context-menu.stop.prevent="showFullDetails"
            @keyup.arrow-down.stop.prevent="nextInList"
            @keyup.arrow-up.stop.prevent="prevInList"
            @keyup.arrow-right.stop.prevent="showFullDetails"
            @keyup.arrow-left.stop.prevent="hideFullDetails"
            @keyup.escape.stop.prevent="exitList"
            @keyup.enter.self.stop.prevent="primaryClickAction"
            @keyup.enter.ctrl.self.stop.prevent="loadInNewTab"
        >
            <v-container class="ma-0 pa-0 my-2" :style="titleStyle">
                <v-row
                    class="mr-3 ml-12 my-0"
                    :style="`${hover ? 'cursor: pointer' : ''}`"
                    @click.left.exact="primaryClickAction"
                    @click.middle.exact="loadInNewTab"
                    @click.left.ctrl="loadInNewTab"
                    @click.middle.ctrl="primaryClickAction"
                    @click.right.stop.prevent="showFullDetails"
                >
                    <v-col class="text-truncate">
                        <v-hover>
                            <v-container fluid class="ma-0 pa-0">
                                <v-row no-gutters class="my-0">
                                    <v-col class="text-truncate">
                                        {{ entrySummary.title }}
                                    </v-col>
                                </v-row>
                                <v-row no-gutters class="my-0">
                                    <v-col
                                        :style="`${expanded ? 'visibility:hidden' : ''}`"
                                        class="text-truncate text-caption"
                                    >
                                        {{ usernameDisplayValue }}
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-hover>
                    </v-col>
                    <v-col v-if="hover || focussed" cols="2" class="mr-3 align-self-center">
                        <v-btn icon @click.stop.prevent="toggleFullDetails">
                            <v-icon>{{ expanded ? "mdi-chevron-down" : "mdi-chevron-up" }}</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-card-text class="py-0 text-truncate" style="cursor: default">
                <v-slide-y-transition>
                    <v-container
                        v-if="expanded && !!entrySummary.fullDetails"
                        class="my-0 pa-0 mx-2"
                    >
                        <Field v-for="f of allFields" :key="f.uuid" :field="f" />
                        <v-row justify="space-between" align="center" class="my-0">
                            <v-col class="text-truncate">
                                <v-tooltip
                                    location="top"
                                    :disabled="!entryPathIsLong"
                                    :open-delay="tooltipDelay"
                                >
                                    <template #activator="{ on }">
                                        <v-row
                                            class="justify-left text-truncate flex-nowrap my-0"
                                            align="center"
                                            v-on="on"
                                        >
                                            <v-icon size="small" class="py-1 pl-0 pr-2">mdi-folder</v-icon>
                                            <span class="text-truncate text-caption py-1">{{
                                                entryPath
                                            }}</span>
                                        </v-row>
                                    </template>
                                    <span>{{ fullEntryPath }}</span>
                                </v-tooltip>
                                <v-tooltip location="top" :open-delay="tooltipDelay">
                                    <template #activator="{ on }">
                                        <v-row
                                            class="justify-left text-truncate flex-nowrap my-0"
                                            align="center"
                                            v-on="on"
                                        >
                                            <v-icon size="small" class="py-1 pl-0 pr-2">mdi-cloud</v-icon>
                                            <span class="text-truncate text-caption py-1">{{
                                                entryDomain
                                            }}</span>
                                        </v-row>
                                    </template>
                                    <span>{{ entrySummary.url }}</span>
                                </v-tooltip>
                            </v-col>

                            <v-col class="ma-2 shrink">
                                <v-btn size="small" location="left" icon="mdi-pencil" @click="editEntry">
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="isMatchedEntry" justify="space-between" align="center">
                            <v-col class="text-truncate pt-0 ma-0">
                                <v-divider></v-divider>
                                <v-checkbox
                                    :label="$i18n('preferred_matching_entry')"
                                    :model-value="entrySummary.isPreferredMatch"
                                    @update:model-value="onPreferredEntryClick"
                                ></v-checkbox>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-slide-y-transition>
            </v-card-text>
        </v-card>
    </v-hover>
</template>

<script lang="ts">
import Field from "./Field.vue";
import { AddonMessage } from "../../common/AddonMessage";
import { Port } from "../../common/port";
import useStore from "../../store";
import { KeeURL } from "../../common/KeeURL";
import { Action } from "../../common/Action";
import { supplementEntryState } from "../supplementEntryState";
import { reconcileURLs } from "../reconcileURLs";
import { SaveState } from "../../common/SaveState";
import { Entry } from "../../common/model/Entry";
import { EntrySummary } from "../../common/model/EntrySummary";
import { tooltipDelay } from "../../common/Timings";

export default {
    components: { Field },
    mixins: [Port.mixin],
    props: ["entrySummary", "isFirstInAList", "entryIndex", "frameId"],
    emits: ["move-next-in-list", "move-prev-in-list", "move-out-of-list", "pref-entry-toggle"],
    setup () {
        const { updateSaveState } = useStore();
        return { updateSaveState };
    },
    data: () => ({
        expanded: false,
        focussed: false,
        tooltipDelay: tooltipDelay
    }),
    computed: {
        titleStyle: function () {
            const e = this.entrySummary as EntrySummary;
            return (
                "background-size:32px; background-position:16px calc(50% + 1px); background-image:url(data:image/png;base64," +
                e.icon.iconImageData +
                ")"
            );
        },
        usernameDisplayValue: function () {
            const e = this.entrySummary as EntrySummary;
            return e && e.usernameValue
                ? e.usernameValue
                : "[" + $STR("noUsername_partial_tip") + "]";
        },
        tabindex: function () {
            return this.isFirstInAList ? "0" : "-1";
        },
        allFields: function () {
            const e = this.entrySummary.fullDetails as Entry;
            return e.fields;
        },
        entryDomain: function () {
            const urlStr = this.entrySummary.url;
            if (!urlStr || urlStr.length < 4) return "<unknown>";
            const kurl = KeeURL.fromString(urlStr);
            if (!kurl) {
                return "<error>";
            }
            return kurl.domainWithPort || kurl.url.host;
        },
        entryPath: function () {
            if (!this.entryPathIsLong) {
                return this.fullEntryPath;
            }
            const e = this.entrySummary.fullDetails as Entry;
            return "... > " + e.parentGroup.path;
        },
        entryPathIsLong: function () {
            return this.fullEntryPath.length > 35;
        },
        fullEntryPath: function () {
            const e = this.entrySummary.fullDetails as Entry;
            return e.database.name + " > " + e.parentGroup.path;
        },
        isMatchedEntry: function () {
            const e = this.entrySummary as EntrySummary;
            return typeof e.isPreferredMatch === "boolean";
        }
    },
    methods: {
        toggleFullDetails() {
            if (!this.expanded) {
                this.showFullDetails();
            } else {
                this.hideFullDetails();
            }
        },
        showFullDetails() {
            if (!this.expanded && !this.entrySummary.fullDetails) {
                Port.postMessage({
                    findMatches: {
                        uuid: this.entrySummary.uuid,
                        DBfilename: this.entrySummary.dbFileName
                    }
                } as AddonMessage);
            }
            this.expanded = true;
        },
        hideFullDetails() {
            this.expanded = false;
        },
        async editEntry() {
            const ss = this.saveState as SaveState;
            const entry = this.entrySummary.fullDetails as Entry;
            const updatedSaveState = Object.assign({}, ss);
            const { urls, showWarning } = await reconcileURLs(entry.URLs, ss.submittedData?.url);
            updatedSaveState.newEntry = supplementEntryState(entry, ss, urls);
            updatedSaveState.titleResetValue = entry.title;
            updatedSaveState.lastActiveAt = new Date();
            updatedSaveState.showURLMismatchWarning = showWarning;
            this.updateSaveState(updatedSaveState);
        },
        focusin: function (e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = true;
            }
        },
        focusout: function (e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = false;
            }
        },
        async primaryClickAction() {
            if (this.entryIndex !== undefined) {
                // We are expected to fill an already discovered entry
                this.manualFill();
            } else {
                // Overwriting the Kee Vault tab causes much confusion so prevent that from happening
                const currentTab = await browser.tabs.query({
                    currentWindow: true,
                    active: true,
                    url: [
                        "https://keevault.pm/*",
                        "https://app-beta.kee.pm/*",
                        "https://app-dev.kee.pm/*"
                    ]
                });
                if (currentTab && currentTab.length > 0) {
                    this.loadInNewTab();
                } else {
                    this.loadInSameTab();
                }
            }
        },
        loadInSameTab() {
            browser.tabs.update({ url: this.entrySummary.url });
            window.close();
        },
        loadInNewTab() {
            browser.tabs.create({ url: this.entrySummary.url });
            window.close();
        },
        manualFill() {
            Port.postMessage({
                action: Action.ManualFill,
                selectedEntryIndex: this.entryIndex,
                frameId: this.frameId
            });
            window.close();
        },
        nextInList() {
            this.$emit("move-next-in-list");
        },
        prevInList() {
            this.$emit("move-prev-in-list");
        },
        exitList() {
            this.$emit("move-out-of-list");
        },
        onPreferredEntryClick() {
            this.$emit("pref-entry-toggle", { uuid: this.entrySummary.uuid });
        }
    }
};
</script>
