<template>
    <div>
        <v-slide-y-transition>
            <v-container class="my-0 pa-0">
                <v-row>
                    <v-col>
                        <v-text-field
                            :label="$i18n('title')"
                            color="secondary"
                            :value="saveState.newEntry.title"
                            dense
                            outlined
                            hide-details="auto"
                            :type="text"
                            autofocus
                            @input="setTitle"
                            @focus="onTitleFocus"
                            @blur="onTitleBlur"
                        >
                            <template slot="append">
                                <v-btn v-if="titleFocussed && resettableTitle" small icon @click="resetTitle">
                                    <v-icon>mdi-undo</v-icon>
                                </v-btn>
                            </template>
                        </v-text-field>
                    </v-col>
                </v-row>

                <FieldEditor
                    v-for="f of saveState.newEntry.fields"
                    :key="f.uuid"
                    :field="f"
                    @field-value-changed="fieldValueChanged"
                    @field-deleted="fieldDeleted"
                />
            </v-container>
        </v-slide-y-transition>
        <v-alert
            v-if="showURLMismatchWarning"
            border="top"
            colored-border
            type="warning"
            :icon="false"
            elevation="1"
            class="my-3"
        >
            <v-row dense>
                <v-col>
                    <p>{{ $i18n("url_mismatch_1") }}</p>
                    <p>{{ $i18n("url_mismatch_2") }}</p>
                    <p>{{ $i18n("url_mismatch_3") }}</p>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col class="my-0 py-0">
                    <div>
                        <v-checkbox
                            v-model="differentSiteConfirmation"
                            class="my-0 py-0"
                            hide-details
                            :label="$i18n('url_mismatch_confirm', entryDomain)"
                        />
                    </div>
                </v-col>
            </v-row>
        </v-alert>
        <v-btn right color="tertiary" @click="cancel">
            {{ $i18n("cancel") }}
        </v-btn>
        <v-btn
            v-if="!loading && !editingExisting && !skipWhere"
            right
            color="primary"
            @click="nextClicked"
        >
            {{ $i18n("next") }}
        </v-btn>
        <v-btn
            v-if="!loading && !editingExisting && skipWhere"
            right
            color="primary"
            @click="saveEntry"
        >
            {{ $i18n("save") }}
        </v-btn>
        <v-btn v-if="loading" loading disabled right color="primary">
            .........
        </v-btn>
        <v-btn
            v-if="editingExisting"
            :disabled="showURLMismatchWarning && !differentSiteConfirmation"
            right
            color="primary"
            @click="updateEntry"
        >
            {{ $i18n("update") }}
        </v-btn>
        <v-alert
            v-if="editingExisting"
            border="top"
            colored-border
            type="info"
            :icon="false"
            elevation="1"
            class="my-4"
        >
            <v-row align="center">
                <v-col class="grow">
                    {{ $i18n("make_additional_changes_using_full_editor") }}
                </v-col>
            </v-row>
            <v-row align="center">
                <v-col class="grow">
                    <v-btn small @click="openFullEntryEditor">
                        {{ $i18n("open_full_editor") }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-alert>
    </div>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { Action } from "../../common/Action";
import { mapGetters } from "vuex";
import { SaveState } from "../../common/SaveState";
import { Entry } from "../../common/model/Entry";
import FieldEditor from "./FieldEditor.vue";
import { Field } from "../../common/model/Field";
import { AddonMessage } from "../../common/AddonMessage";
import { KeeURL } from "../../common/KeeURL";
import { TemporaryIDString, GroupSummary } from "../../common/model/GroupSummary";
import { configManager } from "../../common/ConfigManager";
import { DatabaseSummary } from "../../common/model/DatabaseSummary";
import { Database } from "../../common/model/Database";
import { Group } from "../../common/model/Group";
import { SearcherAll } from "../../common/SearcherAll";

export default {
    components: {
        FieldEditor
    },
    data: () => ({
        originalFields: [],
        differentSiteConfirmation: false,
        loading: true,
        preferToSkipWhere: false,
        skipWhere: false,
        domainMatchesExistingEntry: false,
        preferredGroupUuid: null,
        preferredDb: null,
        primaryFound: false,
        titleFocussed: true
    }),
    computed: {
        ...mapGetters(["saveState"]),
        resettableTitle: function (this: any) {
            return (
                this.$store.state.saveState.titleResetValue !==
                this.$store.state.saveState.newEntry.title
            );
        },
        editingExisting: function (this: any) {
            const e = (this.$store.state.saveState as SaveState).newEntry;
            return e.database.fileName && e.database.root.uuid !== TemporaryIDString;
        },
        showURLMismatchWarning: function (this: any) {
            return this.saveState.showURLMismatchWarning;
        },
        entryDomain: function (this: any) {
            const urlStr = (this.saveState as SaveState).newEntry.URLs[0];
            if (!urlStr || urlStr.length < 4) return "<unknown>";
            const kurl = KeeURL.fromString(urlStr);
            if (!kurl) {
                return "<error>";
            }
            return kurl.domainWithPort || kurl.url.host;
        },
        displayWhereReason: function (this: any) {
            if (this.loading || !this.preferToSkipWhere) return null;
            return this.domainMatchesExistingEntry
                ? this.$i18n("skip_where_reason_domain_entry_exists")
                : this.primaryFound
                ? this.$i18n("skip_where_reason_group_not_found")
                : null;
        }
    },
    async mounted(this: any) {
        this.preferToSkipWhere = configManager.current.rememberMRUGroup;
        const dbs = this.$store.state.KeePassDatabases as Database[];
        const { preferredGroupUuid, preferredDb, primaryFound } = this.getPreferredGroup(
            configManager.current.mruGroup,
            dbs
        );
        this.preferredGroupUuid = preferredGroupUuid;
        if (this.preferToSkipWhere) {
            this.preferredDb = preferredDb;
            this.primaryFound = primaryFound;

            this.domainMatchesExistingEntry = this.anyEntryMatchesNewDomain();

            if (this.preferredGroupUuid && this.preferredDb && !this.domainMatchesExistingEntry) {
                this.skipWhere = true;
            }
        }
        this.loading = false;
    },
    methods: {
        cancel: function (this: any) {
            this.$emit("cancel-clicked");
        },
        nextClicked: function (this: any) {
            this.$emit("save-where-clicked", this.displayWhereReason, this.preferredGroupUuid);
        },
        saveEntry: function (this: any) {
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                parentGroup: new GroupSummary({ uuid: this.preferredGroupUuid }),
                database: this.preferredDb
            });
            this.$store.dispatch("updateSaveState", updatedSaveState);
            Port.postMessage({ action: Action.CreateEntry } as AddonMessage);
            window.close();
        },
        updateEntry: function (this: any) {
            Port.postMessage({ action: Action.UpdateEntry } as AddonMessage);
            window.close();
        },
        openFullEntryEditor(this: any) {
            const entry = (this.$store.state.saveState as SaveState).newEntry;
            Port.postMessage({
                loginEditor: {
                    uuid: entry.uuid,
                    DBfilename: entry.database.fileName
                }
            } as AddonMessage);
            window.close();
        },
        setTitle: function (this: any, value) {
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                title: value
            });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        },
        resetTitle: function (this: any) {
            this.setTitle(this.$store.state.saveState.titleResetValue);
        },
        fieldValueChanged: function (this: any, change) {
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            const originalFieldIndex = (this.$store.state
                .saveState as SaveState).newEntry.fields.findIndex(f => f.uuid === change.uuid);
            const originalField = (this.$store.state.saveState as SaveState).newEntry.fields[
                originalFieldIndex
            ];
            const newField = new Field({
                ...originalField,
                value: change.value
            });
            //TODO:4: faster deep clone
            const newFields = JSON.parse(
                JSON.stringify(updatedSaveState.newEntry.fields)
            ) as Field[];
            newFields[originalFieldIndex] = newField;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                fields: newFields
            });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        },
        fieldDeleted: function (this: any, field: Partial<Field>) {
            this.$store.dispatch("removeFieldFromActiveEntry", field.uuid);
        },
        getPreferredGroup: function (mruGroup: { [key: string]: string }, dbs: Database[]) {
            if (!mruGroup) {
                return { preferredGroupUuid: null, preferredDb: null, primaryFound: false };
            }

            let primaryFound = false;
            const UUIDs = [];
            const primaryUuid = mruGroup["{<{{<<kee-primary>>}}>}"];
            if (primaryUuid) {
                primaryFound = true;
                UUIDs.push(primaryUuid);
            }

            // We normally expect the value in the primary key to be correct but it may not
            // be if the user has just upgraded from Kee 3.4 or lower, or if they have a
            // particuarlly complex set of databases with different filenames and/or duplicate
            // UUIDs or if they constantly switch back and forth between multiple databases so
            // we may as well try the one specific to the currently open database, although
            // only if there is a single open database.
            if (dbs.length === 1 && mruGroup[dbs[0].fileName]) {
                if (mruGroup[dbs[0].fileName] !== UUIDs[0]) {
                    UUIDs.push(mruGroup[dbs[0].fileName]);
                }
            }

            for (const groupId of UUIDs) {
                if (!groupId) continue;
                const matchedDb = dbs.find(db => Group.containsId(db.root, groupId));
                if (matchedDb) {
                    return {
                        preferredGroupUuid: groupId,
                        preferredDb: new DatabaseSummary({
                            fileName: matchedDb.fileName,
                            root: new GroupSummary({ uuid: TemporaryIDString })
                        }),
                        primaryFound
                    };
                }
            }
            return {
                preferredGroupUuid: null,
                preferredDb: null,
                primaryFound
            };
        },
        anyEntryMatchesNewDomain: function (this: any) {
            const urlStr = (this.saveState as SaveState).newEntry.URLs[0];
            if (!urlStr || urlStr.length < 4) return false;
            const kurl = KeeURL.fromString(urlStr);
            if (!kurl) {
                return false;
            }
            const search = new SearcherAll(
                {
                    KeePassDatabases: this.$store.getters.KeePassDatabases,
                    ActiveKeePassDatabaseIndex: this.$store.getters.ActiveKeePassDatabaseIndex
                } as any,
                {
                    version: 1,
                    searchAllDatabases: configManager.current.searchAllOpenDBs,
                    maximumResults: 1
                }
            );
            const results = search.execute("", undefined, [kurl.domainOrIPAddress]);
            return !!results?.length;
        },
        onTitleFocus (this: any) {
            this.titleFocussed = true;
        },
        onTitleBlur (this: any) {
            this.titleFocussed = false;
        }
    }
};
</script>
