<template>
    <div>
        <v-slide-y-transition>
            <v-container class="my-0 pa-0">
                <v-row justify="center">
                    <v-col style="cursor: default" class="text-h6 text-center py-0">
                        {{ $i18n("where") }}
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card class="mx-auto" max-width="500">
                            <v-sheet class="pa-4 pb-1">
                                <v-text-field
                                    v-model="search"
                                    :label="$i18n('Search_label')"
                                    color="secondary"
                                    outlined
                                    hide-details="auto"
                                    clearable
                                    dense
                                    clear-icon="mdi-close-circle-outline"
                                />
                            </v-sheet>
                            <v-card-text>
                                <v-treeview
                                    :active="groupUuidArray"
                                    :items="items"
                                    :search="search"
                                    selection-type="independent"
                                    item-children="groups"
                                    item-key="uuid"
                                    item-text="title"
                                    open-all
                                    dense
                                    activatable
                                    hoverable
                                    color="secondary"
                                    style="height: 240px; overflow-y: auto; cursor: pointer"
                                    return-object="true"
                                    @update:active="setGroup"
                                />
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row v-if="displayReason">
                    <v-col>
                        <v-card-text>{{ displayReason }}</v-card-text>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-0">
                        <v-checkbox
                            v-model="skipInFuture"
                            :label="$i18n('skip_where_enable_context')"
                        ></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </v-slide-y-transition>

        <v-btn :disabled="!saveEnabled" right color="primary" @click="saveEntry">
            {{ $i18n("save") }}
        </v-btn>
    </div>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { Action } from "../../common/Action";
import { SaveState } from "../../common/SaveState";
import { Entry } from "../../common/model/Entry";
import { Group } from "../../common/model/Group";
import { AddonMessage } from "../../common/AddonMessage";
import { Database } from "../../common/model/Database";
import { DatabaseSummary } from "../../common/model/DatabaseSummary";
import { GroupSummary, TemporaryIDString } from "../../common/model/GroupSummary";
import { configManager } from "../../common/ConfigManager";
import useStore from "../../store";
import { mapState } from "pinia";

// const deepMapKeys = (obj, f) =>
//     Array.isArray(obj)
//         ? obj.map(val => deepMapKeys(val, f))
//         : typeof obj === "object"
//         ? Object.keys(obj).reduce((acc, current) => {
//               const val = obj[current];
//               acc[f(current)] =
//                   val !== null && typeof val === "object"
//                       ? deepMapKeys(val, f)
//                       : (acc[f(current)] = val);
//               return acc;
//           }, {})
//         : obj;

function findDatabaseByGroup(databases: Database[], group: Group) {
    return databases.find(db => Group.containsId(db.root, group.uuid));
}

export default {
    mixins: [Port.mixin],
    props: ["preferredGroupUuid", "displayReason"],
    setup () {
        const { updateSaveState } = useStore();
        return { updateSaveState };
    },
    data: () => ({
        search: null,
        saveEnabled: false,
        skipInFuture: configManager.current.rememberMRUGroup,
        groupUuidArray: []
    }),
    computed: {
        ...mapState(useStore, ["saveState", "KeePassDatabases", "ActiveKeePassDatabaseIndex"]),
        rootGroup: function () {
            return this.KeePassDatabases[this.ActiveKeePassDatabaseIndex].root;
        },
        items: function () {
            return this.KeePassDatabases.map(db => db.root);
        }
    },
    watch: {
        skipInFuture: async function (newValue: boolean, oldValue: boolean) {
            if (newValue !== oldValue) {
                this.saveEnabled = false;
                configManager.current.rememberMRUGroup = newValue;
                await configManager.save();
                this.saveEnabled = true;
            }
        }
    },
    mounted() {
        this.groupUuidArray = [{ uuid: this.preferredGroupUuid }];
    },
    methods: {
        saveEntry: function () {
            Port.postMessage({ action: Action.CreateEntry } as AddonMessage);
            window.close();
        },
        setGroup: function (values) {
            if (!(values?.length > 0)) return;
            const database = findDatabaseByGroup(this.KeePassDatabases, values[0]);
            const updatedSaveState = Object.assign({}, this.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                parentGroup: values[0],
                database: new DatabaseSummary({
                    fileName: database.fileName,
                    root: new GroupSummary({ uuid: TemporaryIDString })
                })
            });
            this.updateSaveState(updatedSaveState);
            this.saveEnabled = true;
        }
    }
};
</script>
