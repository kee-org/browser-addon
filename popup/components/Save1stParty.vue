<template>
  <div>
    <v-slide-y-transition>
      <v-container
        class="my-0 pa-0"
      >
        <v-row>
          <v-col>
            <v-text-field
              :label="$i18n('title')"
              style=""
              :value="saveState.newEntry.title"
              dense
              outlined
              hide-details="auto"
              :type="text"
              autofocus
              @input="setTitle"
            >
              <template slot="append">
                <v-btn
                  v-if="resettableTitle"
                  small
                  icon
                  @click="resetTitle"
                >
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
        />
      </v-container>
    </v-slide-y-transition>

    <v-btn
      v-if="!editingExisting"
      right
      color="light-blue lighten-3"
      @click="nextClicked"
    >
      {{ $i18n('next') }}
    </v-btn>
    <v-btn
      v-if="editingExisting"
      right
      color="light-blue lighten-3"
      @click="updateEntry"
    >
      update
    </v-btn>
    <v-alert
      v-if="editingExisting"
      border="top"
      colored-border
      type="info"
      elevation="1"
      class="my-4"
    >
      <v-row align="center">
        <v-col class="grow">
          Additional changes can be made using the full editor.
        </v-col>
        <v-col class="shrink">
          <v-btn
            small
            @click="openFullEntryEditor"
          >
            Open advanced editor
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

export default {
    components: {
        FieldEditor
    },
    data: () => ({
        originalFields: []
    }),
    computed: {
        ...mapGetters(["saveState"]),
        resettableTitle: function (this: any) {
            return this.$store.state.saveState.titleResetValue !== this.$store.state.saveState.newEntry.title;
        },
        editingExisting: function (this: any) {
            console.error("db: " + (this.$store.state.saveState as SaveState).newEntry.database.fileName);
            return !!(this.$store.state.saveState as SaveState).newEntry.database.fileName;
        }
    },
    methods: {
        generatePassword: function (this: any) {
            Port.postMessage({ action: Action.GeneratePassword });
            window.close();
        },
        nextClicked: function (this: any) {
            this.$emit("save-where-clicked");
        },
        updateEntry: function (this: any) {
            Port.postMessage({ action: Action.UpdateEntry } as AddonMessage);
            window.close();
        },
        openFullEntryEditor (this: any) {
            const entry = (this.$store.state.saveState as SaveState).newEntry;
            Port.postMessage({
                loginEditor: {
                    uniqueID: entry.uuid, //TODO: needs to be uniqueId instead? test if editing old and new entries works in KV and KP
                    DBfilename: entry.database.fileName
                }
            } as AddonMessage);
            window.close();
        },
        setTitle: function (this: any, value) {
            console.error(this.$store.state.saveState.newEntry.title);
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({...updatedSaveState.newEntry, title: value });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        },
        resetTitle: function (this: any) {
            this.setTitle(this.$store.state.saveState.titleResetValue);
        },
        fieldValueChanged: function (this: any, change) {
            console.error(change);
            console.error(change.value);
            console.error(change.uuid);
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            const originalFieldIndex = (this.$store.state.saveState as SaveState).newEntry.fields.findIndex(f => f.uuid === change.uuid);
            const originalField = (this.$store.state.saveState as SaveState).newEntry.fields[originalFieldIndex];
            const newField = new Field({...originalField, value: change.value });
            //TODO: faster deep clone
            const newFields = JSON.parse(JSON.stringify(updatedSaveState.newEntry.fields));
            newFields[originalFieldIndex] = newField;
            updatedSaveState.newEntry = new Entry({...updatedSaveState.newEntry, fields: newFields });
            this.$store.dispatch("updateSaveState", updatedSaveState);
            // get original field index position
            // clone original field, including updated value
            // set index position to new field
        }
    }
};
</script>

<style>
</style>
