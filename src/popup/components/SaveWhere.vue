<template>
    <div>
        <v-slide-y-transition>
            <v-container class="ma-0 pa-0" style="cursor: default; padding: 0; margin: 0">
                <v-row justify="center" style="cursor: default; padding: 0; margin: 0">
                    <v-col style="cursor: default; padding: 0; margin: 0" class="text-6 text-center">
                        {{ $i18n("where") }}
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-card class="mx-auto" max-width="500">
                            <!-- TODO: restore search feature when we have time to setup a new/improved treeview component that supports it -->
                            <!-- <v-sheet class="pa-4 pb-1">
                                <v-text-field v-model="search" :label="$i18n('Search_label')" color="secondary"
                                    variant="outlined" hide-details="auto" clearable density="compact"
                                    clear-icon="mdi-close-circle-outline" />
                            </v-sheet> -->
                            <v-card-text>
                                <tree-view ref="treeViewRef" id="my-tree" :initial-model="items" selectionMode="single"
                                    :modelDefaults="{
                                        selectable: true,
                                        idProperty: 'uuid',
                                        labelProperty: 'title',
                                        childrenProperty: 'groups',
                                        expandable: true,
                                        state: {
                                            expanded: true
                                        }
                                    }" style="height: 225px; overflow-y: auto; cursor: pointer"
                                    @treeNodeSelectedChange="setGroup">
                                    <template #text="{ model }">
                                        <v-container>
                                            <v-btn v-if="model.groups.length > 0" icon size="1.5rem" color="secondary"
                                                style="margin-left:0.5rem; margin-right: 0.5rem;"
                                                @click="$event.currentTarget.parentElement.previousElementSibling.click()">
                                                <mdi-chevron-up v-if="model.treeNodeSpec.state.expanded" scale="150" />
                                                <mdi-chevron-down v-if="!(model.treeNodeSpec.state.expanded)"
                                                    scale="150" />
                                            </v-btn>
                                            {{ model.title }}
                                        </v-container>
                                    </template>

                                </tree-view>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col class="py-0">
                        <v-checkbox v-model="skipInFuture" :label="$i18n('skip_where_enable_context')"></v-checkbox>
                    </v-col>
                </v-row>
            </v-container>
        </v-slide-y-transition>

        <v-btn :disabled="!saveEnabled" location="right" color="primary" @click="saveEntry">
            {{ $i18n("save") }}
        </v-btn>

        <v-container v-if="displayReason">
            {{ displayReason }}
        </v-container>
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
import { TreeView } from "@grapoza/vue-tree"
//import { KeeLog } from "~/common/Logger";

const recursiveFilterMap = (group: Group, filter: (grp: Group) => boolean, map: (grp: Group) => Group): Group => {
    const chosenChildGroups: Group[] = [];

    for (const childGroup of group.groups) {
        const chosenChildGroup = recursiveFilterMap(childGroup, filter, map);
        if (chosenChildGroup) chosenChildGroups.push(chosenChildGroup);
    }

    // groups can be included just because a child is included
    if (filter(group) || chosenChildGroups.length > 0) {
        const old = JSON.parse(JSON.stringify(group));
        old.groups = chosenChildGroups;
        const g = new Group(old);
        return map(g);
    }
    return null;
}

function findDatabaseByGroup(databases: Database[], group: Group) {
    return databases.find(db => Group.containsId(db.root, group.uuid));
}

// const findById = (uuid: String) => (xs) =>
//     xs.reduce(
//         (res, x: Group) => res ? res : x.uuid === uuid ? x : findById(uuid)(x.groups || []),
//         undefined
//     )

// function populateShadowTreeLevel(shadowTreeLevel: any[], treeArrayLevel: any[]) {
//     for (const shadowItem of shadowTreeLevel) {
//         const correspondingTreeItem = treeArrayLevel.find(i => i.uuid === shadowItem.uuid);
//         if (correspondingTreeItem) {
//             shadowItem.nodeTreeSpec = correspondingTreeItem.nodeTreeSpec;
//             populateShadowTreeLevel(shadowItem.groups, correspondingTreeItem.groups);
//         }
//     }
// }


//const treeArray = [];

// can't be reactive
// needs to just cache a copy of the real tree temporarilly
//let shadowTree = [];

export default {
    components: {
        TreeView
    },
    props: ["preferredGroupUuid", "displayReason"],
    setup() {
        const { updateSaveState } = useStore();
        return { updateSaveState };
    },
    data: function () {
        return {
            search: "",
            updatingConfig: false,
            skipInFuture: configManager.current.rememberMRUGroup,
            lastSelectedGroupUuid: this.$props.preferredGroupUuid, // caller has already checked that this uuid is present in list of DBs and groups
            initialSelectedGroupId: JSON.parse(JSON.stringify(this.$props.preferredGroupUuid)) // really do not want this to be reactive!
        };
    },
    computed: {
        ...mapState(useStore, ["saveState", "KeePassDatabases", "ActiveKeePassDatabaseIndex"]),
        rootGroup: function () {
            return this.KeePassDatabases[this.ActiveKeePassDatabaseIndex].root;
        },
        saveEnabled: function () {
            return !this.updatingConfig && this.lastSelectedGroupUuid?.length > 0;
        },
        items: function () {
            // array of all databases root group
            const groups = this.KeePassDatabases.map(db => recursiveFilterMap(db.root, g => true, (g) => {
                const grp = new Group({
                    entrySummaries: [],
                    groups: g.groups,
                    icon: null,
                    path: g.path,
                    title: g.title,
                    uuid: g.uuid
                }
                );
                if (g.uuid === this.initialSelectedGroupId) {
                    (grp as any).treeNodeSpec = {
                        state: {
                            selected: true
                        }
                    }
                }
                return grp;
            }));
            //const groups = this.KeePassDatabases.map(db => db.root);
            const json = JSON.stringify(groups);
            //KeeLog.error("items: ", groups);
            return JSON.parse(json) as Group[];
        },
        // filteredItems: function () {

        //     //TODO: try selected: false for all others if multiselection bug still happens

        //     // Need to keep this to trick vue into recomputing when search term is modified
        //     //TODO: verify above and check for a less noisy solution
        //     console.log("search hack: " + this.search);

        //     if (treeArray.length > 0) {
        //         // Treeview component may have changed treenodespec since we last ran this computed value
        //         // We have to clone to avoid infinite references continually trigger re-evaluation of this property

        //         // for every item in the shadow tree, we need to update it with whatever is currently stored in the corresponding item in the treeArray
        //         //Shadow tree will always contain all items but real tree might not, and might have updated some of the data for the items that are in the shdow tree

        //         populateShadowTreeLevel(shadowTree, treeArray);

        //     }

        //     const result = this.items.map(item => recursiveFilterMap(
        //         item,
        //         (grp) => {
        //             const s = (this.search ?? "").toLowerCase();
        //             return grp.title.toLowerCase().includes(s);
        //         },
        //         (clonedGroup) => {
        //             return findById(clonedGroup.uuid)(shadowTree);
        //         })
        //     ).filter(i => i); // filtering removes any nulls if entire top level objects have been filtered away
        //     const jsoned = JSON.stringify(result);
        //     KeeLog.error("jsoned", jsoned);
        //     treeArray.length = 0;
        //     treeArray.push(...result);
        //     return treeArray;
        // }
    },
    watch: {
        skipInFuture: async function (newValue: boolean, oldValue: boolean) {
            if (newValue !== oldValue) {
                this.updatingConfig = true;
                configManager.current.rememberMRUGroup = newValue;
                await configManager.save();
                this.updatingConfig = false;
            }
        }
    },
    mounted() {
        // Not certain that mounted is the right place for this but maybe it's fine
        if (this.initialSelectedGroupId?.length > 0) {
            const selected = (this.$refs.treeViewRef as any).getSelected();
            const selectedGroup = selected?.[0];
            if (selectedGroup) {
                this.setGroup(selectedGroup);
            }
        }

        // const selectionObj = {
        //     treeNodeSpec: {
        //         state: {
        //             selected: true
        //         }
        //     }
        // };

        // // Could maybe just use this.items but a seperate shadow tree is probably less risky in case other changes cause items to react
        // shadowTree = this.items.map(item => recursiveFilterMap(
        //     item,
        //     g => true,
        //     //TODO: unnecessary to use a cloned group here I think
        //     (clonedGroup) => clonedGroup.uuid === this.lastSelectedGroupUuid ? Object.assign(clonedGroup, selectionObj) : clonedGroup)
        // );
    },
    methods: {
        blah: function (el: any) {
            console.log(el);
        },
        saveEntry: function () {
            Port.postMessage({ action: Action.CreateEntry } as AddonMessage);
            window.close();
        },
        setGroup: function (group: Group) {
            if (!group?.uuid) return;

            // We are sent the deselection event too (but often (always?) after the selection event so it is impossible to re-disable the Save button safely)

            if (!(group as any).treeNodeSpec?.state?.selected) {
                //this.saveEnabled = false;
                return;
            }

            const selectedGroup = JSON.parse(JSON.stringify(group));
            delete selectedGroup.treeNodeSpec;
            const database = findDatabaseByGroup(this.KeePassDatabases, selectedGroup);

            // Maybe object assign isn't actually removing the proxy objects?
            const updatedSaveState = Object.assign({}, this.saveState) as SaveState;
            //const updatedSaveState = JSON.parse(JSON.stringify(this.saveState)) as SaveState;

            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                parentGroup: selectedGroup,
                database: new DatabaseSummary({
                    fileName: JSON.parse(JSON.stringify(database.fileName)),
                    root: new GroupSummary({ uuid: TemporaryIDString })
                })
            });
            this.updateSaveState(updatedSaveState);
            this.lastSelectedGroupUuid = selectedGroup.uuid;
        }
    }
};

</script>

<style>
.grtv-wrapper.grtv-default-skin {
    --baseHeight: 1rem;
    --itemSpacing: 1rem
}

.grtv-wrapper.grtv-default-skin .grtvn {
    padding-left: 0
}

.grtv-wrapper.grtv-default-skin .grtvn:first-child {
    margin-top: 0
}

.grtv-wrapper.grtv-default-skin .grtvn[role=treeitem]:focus {
    outline: 0
}

.grtv-wrapper.grtv-default-skin .grtvn[role=treeitem]:focus>.grtvn-self {
    outline: black dotted 1px
}

.grtv-wrapper.grtv-default-skin .grtvn-self {
    display: flex;
    align-items: flex-start;
    line-height: var(--baseHeight)
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander {
    padding: 0;
    background: none;
    border: none;
    height: var(--baseHeight)
}

.grtv-wrapper.grtv-default-skin .grtvn-self-selected {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
    font-weight: bold;
}

.grtv-wrapper.grtv-default-skin .grtvn-self:hover {
    background: rgb(var(--v-theme-surface-variant));
    color: rgb(var(--v-theme-on-surface-variant));
    font-weight: bold;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander,
.grtv-wrapper.grtv-default-skin .grtvn-self-checkbox,
.grtv-wrapper.grtv-default-skin .grtvn-self-radio,
.grtv-wrapper.grtv-default-skin .grtvn-self-spacer,
.grtv-wrapper.grtv-default-skin .grtvn-self-action {
    min-width: 0.5rem
}

.grtv-wrapper.grtv-default-skin>.grtv>.grtvn>.grtvn-self>.grtvn-self-expander {
    min-width: 0
}

.grtv-wrapper.grtv-default-skin .grtvn-self>.v-container {
    padding: 0;
    min-height: 40px;
    display: flex;
    align-content: center;
    justify-content: start;
    align-items: center;
}

.grtv-wrapper.grtv-default-skin .grtvn-self-expander,
.grtv-wrapper.grtv-default-skin .grtvn-self-spacer {
    margin: 0
}

.grtv-wrapper.grtv-default-skin .grtvn-self-text,
.grtv-wrapper.grtv-default-skin .grtvn-self-label {
    margin-left: var(--itemSpacing)
}

.grtv-wrapper.grtv-default-skin .grtvn-children-wrapper {
    margin: 0 0 0 calc(1rem + var(--itemSpacing))
}

.grtv-wrapper.grtv-default-skin .grtvn-children {
    padding: 0;
    list-style: none
}

.grtv-wrapper.grtv-default-skin>.grtv {
    margin: 0;
    padding: 0;
    list-style: none
}
</style>
