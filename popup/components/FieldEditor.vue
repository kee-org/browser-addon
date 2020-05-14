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
        @click:append-outer="showPasswordGenerator = true"
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
      <PasswordGenerator
        v-if="showPasswordGenerator"
        @dialog-closed="passwordGeneratorClosed"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Field } from "../../common/model/Field";
import PasswordGenerator from "./PasswordGenerator.vue";

export default {
    components: {
        PasswordGenerator
    },
    props: ["field"],
    data: () => ({
        revealed: false,
        showPasswordGenerator: false
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
            return Field.getDisplayName(this.field);
        }
    },
    methods: {
        reset: function (this: any) {
            this.valueChanged(this.field.resetValue);
        },
        valueChanged: function (this:any, value) {
            this.$emit("field-value-changed", { uuid: this.field.uuid, value });
        },
        passwordGeneratorClosed: function (this: any, payload) {
            if (payload?.value) this.valueChanged(payload.value);
            this.showPasswordGenerator = false;
        }
    }
};
</script>

<style>

</style>
