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
    <v-alert
      v-if="showURLMismatchWarning"
      border="top"
      colored-border
      type="warning"
      elevation="1"
      class="my-3"
    >
      <v-row align="center">
        <v-col>
          <p>This entry is for a different site.</p>
          <p>Continuing with this update will enable you to fill these credentials into this site too.</p>
          <p>Make sure this is not an attempt to trick you into revealing your password!</p>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col>
          <div>
            <v-checkbox
              v-model="differentSiteConfirmation"
              label="I understand; there is a legitimate reason for these credentials to be shared with the current website from now on."
            />
          </div>
        </v-col>
      </v-row>
    </v-alert>
    <v-btn
      right
      color="light-blue lighten-3"
      @click="cancel"
    >
      {{ $i18n('cancel') }}
    </v-btn>
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
      :disabled="showURLMismatchWarning && !differentSiteConfirmation"
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
        originalFields: [],
        differentSiteConfirmation: false
    }),
    computed: {
        ...mapGetters(["saveState"]),
        resettableTitle: function (this: any) {
            return this.$store.state.saveState.titleResetValue !== this.$store.state.saveState.newEntry.title;
        },
        editingExisting: function (this: any) {
            return !!(this.$store.state.saveState as SaveState).newEntry.database.fileName;
        },
        showURLMismatchWarning: function (this: any) {
            return this.saveState.showURLMismatchWarning;
        }
    },
    methods: {
        cancel: function (this: any) {
            this.$emit("cancel-clicked");
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
                    uuid: entry.uuid,
                    DBfilename: entry.database.fileName
                }
            } as AddonMessage);
            window.close();
        },
        setTitle: function (this: any, value) {
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({...updatedSaveState.newEntry, title: value });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        },
        resetTitle: function (this: any) {
            this.setTitle(this.$store.state.saveState.titleResetValue);
        },
        fieldValueChanged: function (this: any, change) {
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            const originalFieldIndex = (this.$store.state.saveState as SaveState).newEntry.fields.findIndex(f => f.uuid === change.uuid);
            const originalField = (this.$store.state.saveState as SaveState).newEntry.fields[originalFieldIndex];
            const newField = new Field({...originalField, value: change.value });
            //TODO:4: faster deep clone
            const newFields = JSON.parse(JSON.stringify(updatedSaveState.newEntry.fields)) as Field[];
            newFields[originalFieldIndex] = newField;
            updatedSaveState.newEntry = new Entry({...updatedSaveState.newEntry, fields: newFields });
            this.$store.dispatch("updateSaveState", updatedSaveState);
        }
    }
};
</script>

<style>
</style>
