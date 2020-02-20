<template>
  <v-row>
    <v-col>
      <v-text-field
        v-if="field.type === 'password' || field.type === 'text'"
        :label="label"
        style=""
        :value="field.value"
        dense
        outlined
        hide-details="auto"
        :append-outer-icon="field.type === 'password' ? 'mdi-flash' : ''"
        :type="renderType"
        @input="valueChanged"
        @click:append-outer="reset"
      >
        <template slot="append">
          <v-btn
            v-if="resettable"
            small
            icon
            @click="reset"
          >
            <v-icon>mdi-undo</v-icon>
          </v-btn>
          <v-btn
            v-if="field.type === 'password'"
            small
            icon
            @click="revealed = !revealed"
          >
            <v-icon>{{ revealed ? 'mdi-eye' : 'mdi-eye-off' }}</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Field } from "../../common/model/Field";
export default {
    props: ["field"],
    data: () => ({
        revealed: false //TODO: does it matter that this gets lost when popup closes? probably too minor an issue to worry about urgently
    }),
    computed: {
        renderType: function (this: any) {
            if (this.field.type === "password") {
                return this.revealed ? "text" : "password";
            }
            return this.field.type;
        },
        resettable: function (this: any) {
            return this.field.resetValue !== this.field.value;
        },
        label: function (this: any) {
            return (this.field as Field).name;
        }
    },
    methods: {
        reset: function (this: any) {
            this.valueChanged(this.field.resetValue);
        },
        valueChanged: function (this:any, value) {
            this.$emit("field-value-changed", { uuid: this.field.uuid, value });
        }
    }
};
</script>

<style>

</style>
