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
                            <!-- TODO: restore search feature when we have time to create a new treeview system that supports it -->
                            <!-- <v-sheet class="pa-4 pb-1">
                                <v-text-field v-model="search" :label="$i18n('Search_label')" color="secondary"
                                    variant="outlined" hide-details="auto" clearable density="compact"
                                    clear-icon="mdi-close-circle-outline" />
                            </v-sheet> -->
                            <v-card-text>
                                <tree-view id="my-tree" :initial-model="filteredItems"
                                    selectionMode="single" :modelDefaults="{
                                        selectable: true,
                                        idProperty: 'uuid',
                                        labelProperty: 'title',
                                        childrenProperty: 'groups',
                                        expandable: true,
                                        state: {
                                            expanded: true
                                        }
                                    }"
                                    style="height: 225px; overflow-y: auto; cursor: pointer"
                                    @treeNodeSelectedChange="setGroup"
                                    >
                                    <template #text="{ model }">
                                        <v-container>
                                            <v-btn v-if="model.groups.length > 0" icon size="1.5rem"  color="secondary"
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
                <v-row v-if="displayReason">
                    <v-col>
                        <v-card-text>{{ displayReason }}</v-card-text>
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
import { KeeLog } from "~/common/Logger";

// const foreachrecursivefiltermap = (groups: Group[], include: (grp: Group) => boolean, activateOrNot: (grp: Group) => Group): Group[] => {
//     const chosenGroups: Group[] = [];
//     for (const group of groups) {
//         if (include(group)) {
//             chosenGroups.push(activateOrNot(group));
//         }
//         chosenGroups.push(...foreachrecursivefiltermap(group.groups, include, activateOrNot));
//     }
//     return chosenGroups;
// }

const recursivefiltermap = (group: Group, include: (grp: Group) => boolean, activateOrNot: (grp: Group) => Group): Group => {
    const chosenChildGroups: Group[] = [];

    for (const childGroup of group.groups) {
        const chosenChildGroup = recursivefiltermap(childGroup, include, activateOrNot);
        if (chosenChildGroup) chosenChildGroups.push(chosenChildGroup);
    }

    // groups can be included just because a child is included
    if (include(group) || chosenChildGroups.length > 0) {
        const g = new Group(Object.assign({}, group, { groups: chosenChildGroups }));
        return activateOrNot(g);
    }
    return null;


}

function findDatabaseByGroup(databases: Database[], group: Group) {
    return databases.find(db => Group.containsId(db.root, group.uuid));
}

export default {
    components: {
        TreeView
    },
    props: ["preferredGroupUuid", "displayReason"],
    setup() {
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
        },
        filteredItems: function () {
            const selectionObj = {
                treeNodeSpec: {
                    state: {
                        selected: true
                    }
                }
            };
            const result = this.items.map(item => recursivefiltermap(
                item,
                (grp) => {
                    const s = (this.search ?? "").toLowerCase();
                    return grp.title.toLowerCase().includes(s);
                },
                // hackity hack
                // We have to assign to a new object becauase otherwise vue triggers pinia to change the objects directly and we can't handle that cross-process yet.
                // Also we have to do that at the end for every item, and also hack in a workaround for the treeview bug that prevents uuid being used as the id parameter
                (grp) => grp.uuid === this.preferredGroupUuid ? Object.assign({}, grp, selectionObj,  {id: grp.uuid}) : Object.assign({}, grp, {id: grp.uuid}) )
            ).filter(i => i);
            const jsoned = JSON.stringify(result);
            return JSON.parse(jsoned);
        }
    },
    watch: {
        skipInFuture: async function (newValue: boolean, oldValue: boolean) {
            KeeLog.warn(`${newValue} ${oldValue}`);
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
        blah: function (el: any) {
            console.log(el);
        },
        saveEntry: function () {
            Port.postMessage({ action: Action.CreateEntry } as AddonMessage);
            window.close();
        },
        setGroup: function (group: Group) {
            if (!group?.uuid) return;

            // We are sent the deselection event too (assuming they arrive in order)
            //TODO: They do not!!!
            // POS. Will have to skip form validation as well as searching!!
            //TODO: Also have to find some way to stop the pinia mutations since above JSON round trip is not working.
            // Maybe this function is somehow reenabling the link.
            if (!(group as any).treeNodeSpec?.state?.selected) {
            KeeLog.warn(`desel`);
                this.saveEnabled = false;
                return;
            }
            KeeLog.warn(`sel`);
            const database = findDatabaseByGroup(this.KeePassDatabases, group);
            const updatedSaveState = Object.assign({}, this.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                parentGroup: group,
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
