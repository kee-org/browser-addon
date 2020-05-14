<template>
  <div>
    <v-slide-y-transition>
      <v-container
        class="my-0 pa-0"
      >
        <v-row>
          <v-col>
            Where? {{ rootGroupUUID }}
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card
              class="mx-auto"
              max-width="500"
            >
              <v-sheet class="pa-4 primary lighten-2">
                <v-text-field
                  v-model="search"
                  label="Search"
                  dark
                  flat
                  solo-inverted
                  hide-details
                  clearable
                  dense
                  clear-icon="mdi-close-circle-outline"
                />
              </v-sheet>
              <v-card-text>
                <v-treeview
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
                  style="height:250px; overflow-y: auto;"
                  return-object="true"
                  @update:active="setGroup"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-slide-y-transition>

    <v-btn
      right
      color="light-blue lighten-3"
      @click="saveEntry"
    >
      {{ $i18n('save') }}
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { Action } from "../../common/Action";
import { mapGetters } from "vuex";
import { SaveState } from "../../common/SaveState";
import { Entry } from "../../common/model/Entry";
import { Group } from "../../common/model/Group";
import { Field } from "../../common/model/Field";
import { AddonMessage } from "../../common/AddonMessage";
import { Database } from "../../common/model/Database";
import { DatabaseSummary } from "../../common/model/DatabaseSummary";

const deepMapKeys = (obj, f) =>
    Array.isArray(obj)
        ? obj.map(val => deepMapKeys(val, f))
        : typeof obj === "object"
            ? Object.keys(obj).reduce((acc, current) => {
                const val = obj[current];
                acc[f(current)] =
          val !== null && typeof val === "object" ? deepMapKeys(val, f) : (acc[f(current)] = val);
                return acc;
            }, {})
            : obj;

function groupContainsId (group: Group, id: string) {
    if (group.uuid === id) return true;

    if (group.groups && group.groups.some(g => groupContainsId(g, id))) return true;

    return false;
}

function findDatabaseByGroup (databases: Database[], group: Group) {
    return databases.find(db => groupContainsId(db.root, group.uuid));
}

export default {
    data: () => ({
        search: null
    }),
    computed: {
        ...mapGetters(["saveState", "KeePassDatabases", "ActiveKeePassDatabaseIndex"]),
        rootGroupUUID: function (this: any) {
            return this.KeePassDatabases[this.ActiveKeePassDatabaseIndex].root.uuid;
        },
        rootGroup: function (this: any) {
            return this.KeePassDatabases[this.ActiveKeePassDatabaseIndex].root;
        },
        items: function (this: any) {
            return this.KeePassDatabases.map(db => db.root);
        }
    },
    methods: {
        saveEntry: function (this: any) {
            Port.postMessage({ action: Action.CreateEntry } as AddonMessage);
            window.close();
        },
        setGroup: function (this: any, value) {
            console.error(this.$store.state.saveState.newEntry.parentGroup);
            console.error(value);
            console.error(value[0]);
            const database = findDatabaseByGroup(this.KeePassDatabases, value[0]);
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({
                ...updatedSaveState.newEntry,
                parentGroup: value[0],
                database: DatabaseSummary.fromDatabase(database)
            });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        }
    }
};

</script>

<style>
</style>
