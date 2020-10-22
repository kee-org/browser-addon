<template>
    <v-hover>
        <v-card
            ref="card"
            slot-scope="{ hover }"
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
                    class="mr-3 ml-12"
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
                                <v-row no-gutters>
                                    <v-col class="text-truncate">
                                        {{ entrySummary.title }}
                                    </v-col>
                                </v-row>
                                <v-row no-gutters>
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
                        <v-row justify="space-between" align="center">
                            <v-col class="text-truncate">
                                <v-tooltip
                                    top
                                    :disabled="!entryPathIsLong"
                                    :open-delay="tooltipDelay"
                                >
                                    <template #activator="{ on }">
                                        <v-row
                                            class="justify-left text-truncate flex-nowrap"
                                            align="center"
                                            v-on="on"
                                        >
                                            <v-icon small class="py-1 pl-0 pr-2">mdi-folder</v-icon>
                                            <span class="text-truncate text-caption py-1">{{
                                                entryPath
                                            }}</span>
                                        </v-row>
                                    </template>
                                    <span>{{ fullEntryPath }}</span>
                                </v-tooltip>
                                <v-tooltip top :open-delay="tooltipDelay">
                                    <template #activator="{ on }">
                                        <v-row
                                            class="justify-left text-truncate flex-nowrap"
                                            align="center"
                                            v-on="on"
                                        >
                                            <v-icon small class="py-1 pl-0 pr-2">mdi-cloud</v-icon>
                                            <span class="text-truncate text-caption py-1">{{
                                                entryDomain
                                            }}</span>
                                        </v-row>
                                    </template>
                                    <span>{{ entrySummary.url }}</span>
                                </v-tooltip>
                            </v-col>

                            <v-col class="ma-2 shrink">
                                <v-btn fab small left @click="editEntry">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                        <v-row v-if="isMatchedEntry" justify="space-between" align="center">
                            <v-col class="text-truncate pt-0 ma-0">
                                <v-divider></v-divider>
                                <v-checkbox
                                    :label="$i18n('preferred_matching_entry')"
                                    :input-value="entrySummary.isPreferredMatch"
                                    @change="onPreferredEntryClick"
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
import { mapActions } from "vuex";
import { names as actionNames } from "../../store/action-names";
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
    data: () => ({
        expanded: false,
        focussed: false,
        tooltipDelay: tooltipDelay
    }),
    computed: {
        titleStyle: function (this: any) {
            const e = this.entrySummary as EntrySummary;
            return (
                "background-size:32px; background-position:16px calc(50% + 1px); background-image:url(data:image/png;base64," +
                e.icon.iconImageData +
                ")"
            );
        },
        usernameDisplayValue: function (this: any) {
            const e = this.entrySummary as EntrySummary;
            return e && e.usernameValue
                ? e.usernameValue
                : "[" + $STR("noUsername_partial_tip") + "]";
        },
        tabindex: function (this: any) {
            return this.isFirstInAList ? "0" : "-1";
        },
        allFields: function (this: any) {
            const e = this.entrySummary.fullDetails as Entry;
            return e.fields;
        },
        entryDomain: function (this: any) {
            const urlStr = this.entrySummary.url;
            if (!urlStr || urlStr.length < 4) return "<unknown>";
            const kurl = KeeURL.fromString(urlStr);
            if (!kurl) {
                return "<error>";
            }
            return kurl.domainWithPort || kurl.url.host;
        },
        entryPath: function (this: any) {
            if (!this.entryPathIsLong) {
                return this.fullEntryPath;
            }
            const e = this.entrySummary.fullDetails as Entry;
            return "... > " + e.parentGroup.path;
        },
        entryPathIsLong: function (this: any) {
            return this.fullEntryPath.length > 35;
        },
        fullEntryPath: function (this: any) {
            const e = this.entrySummary.fullDetails as Entry;
            return e.database.name + " > " + e.parentGroup.path;
        },
        isMatchedEntry: function (this: any) {
            const e = this.entrySummary as EntrySummary;
            return typeof e.isPreferredMatch === "boolean";
        }
    },
    methods: {
        ...mapActions(actionNames),
        toggleFullDetails(this: any) {
            if (!this.expanded) {
                this.showFullDetails();
            } else {
                this.hideFullDetails();
            }
        },
        showFullDetails(this: any) {
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
        hideFullDetails(this: any) {
            this.expanded = false;
        },
        async editEntry(this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const entry = this.entrySummary.fullDetails as Entry;
            const updatedSaveState = Object.assign({}, ss);
            const { urls, showWarning } = await reconcileURLs(entry.URLs, ss.submittedData?.url);
            updatedSaveState.newEntry = supplementEntryState(entry, ss, urls);
            updatedSaveState.titleResetValue = entry.title;
            updatedSaveState.lastActiveAt = new Date();
            updatedSaveState.showURLMismatchWarning = showWarning;
            this.$store.dispatch("updateSaveState", updatedSaveState);
        },
        focusin: function (this: any, e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = true;
            }
        },
        focusout: function (this: any, e) {
            if (!(this.$refs.card as any).$el.contains(e.relatedTarget)) {
                this.focussed = false;
            }
        },
        async primaryClickAction(this: any) {
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
        loadInSameTab(this: any) {
            browser.tabs.update({ url: this.entrySummary.url });
            window.close();
        },
        loadInNewTab(this: any) {
            browser.tabs.create({ url: this.entrySummary.url });
            window.close();
        },
        manualFill(this: any) {
            Port.postMessage({
                action: Action.ManualFill,
                selectedEntryIndex: this.entryIndex,
                frameId: this.frameId
            });
            window.close();
        },
        nextInList(this: any) {
            this.$emit("move-next-in-list");
        },
        prevInList(this: any) {
            this.$emit("move-prev-in-list");
        },
        exitList(this: any) {
            this.$emit("move-out-of-list");
        },
        onPreferredEntryClick(this: any) {
            this.$emit("pref-entry-toggle", { uuid: this.entrySummary.uuid });
        }
    }
};
</script>
