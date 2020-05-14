<template>
  <v-row
    v-if="useful"
    justify="center"
    align="center"
  >
    <v-col class="text-truncate my-2 text-right">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <span
            v-on="on"
            @click="toggleReveal"
          >{{ displayValue }}</span>
        </template>
        <span>{{ tooltip }}</span>
      </v-tooltip>
    </v-col>

    <v-col
      class="my-0 shrink"
    >
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            small
            icon
            class="my-0"
            v-on="on"
            @click="copyValue"
          >
            <v-icon small>
              mdi-content-copy
            </v-icon>
          </v-btn>
        </template>
        <span>{{ $i18n('copy_value_to_clipboard') }}</span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { copyStringToClipboard } from "../copyStringToClipboard";
import { Field } from "../../common/model/Field";

export default {
    props: ["field"],
    data: () => ({
        revealed: false
    }),
    computed: {
        displayValue: function (this: any) {
            return Field.getDisplayValue(this.field, this.revealed);
        },
        tooltip: function (this: any) {
            return Field.getDisplayTooltip(this.field, this.revealed);
        },
        useful: function (this:any) {
            return this.field.type !== "checkbox" && this.displayValue.length > 0;
        }
    },
    methods: {
        toggleReveal: function (this: any) {
            this.revealed = !this.revealed;
        },
        copyValue: function (this: any) {
            copyStringToClipboard(Field.getDisplayValue(this.field, true));
        }
    }
};
</script>
