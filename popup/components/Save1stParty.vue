<template>
  <div>
    <v-slide-y-transition>
      <v-container
        class="my-0 pa-0 mx-2"
      >
        <v-row
          dense
          justify="center"
          align="center"
        >
          <v-col class="">
            <v-text-field
              :placeholder="TITLE"
              style=""
              :value="saveState.newEntry.title"
              autofocus
              @input="setTitle"
            />
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

    Hello
    <v-btn
      right
      color="light-blue lighten-3"
      absolute
      style="bottom: 20px; right: 0px"
      @click="generatePassword"
    >
      {{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}
      <v-icon class="pl-4">mdi-flash</v-icon>
    </v-btn>
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

export default {
    components: {
        FieldEditor
    },
    data: () => ({
        originalFields: []
    }),
    computed: {
        ...mapGetters(["saveState"])
    },
    methods: {
        generatePassword: function (this: any) {
            Port.postMessage({ action: Action.GeneratePassword });
            window.close();
        },
        setTitle: function (this: any, value) {
            console.error(this.$store.state.saveState.newEntry.title);
            const updatedSaveState = Object.assign({}, this.$store.state.saveState) as SaveState;
            updatedSaveState.newEntry = new Entry({...updatedSaveState.newEntry, title: value });
            this.$store.dispatch("updateSaveState", updatedSaveState);
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
