<template>
        <v-sheet v-if="useful" class="my-0" style="display: flex; align-items: center;">
<v-sheet class="text-truncate my-2 text-right flex-grow-1">
            <span :style="fieldStyle" @click="toggleReveal">
                <v-tooltip location="bottom" :open-delay="tooltipDelay" activator="parent">
                    <span>{{ tooltip }}</span>
                </v-tooltip>
                {{ displayValue }}
            </span>
        </v-sheet>

        <v-sheet class="my-1 mx-2 shrink">
            <v-btn size="small" icon class="my-0" @click="copyValue">
                <v-tooltip location="start" :open-delay="tooltipDelay" activator="parent">
                    <span>{{ $i18n("copy_value_to_clipboard") }}</span>
                </v-tooltip>
                <mdi-content-copy />
            </v-btn>
        </v-sheet>
    </v-sheet>
</template>

<script lang="ts">
import { copyStringToClipboard } from "../../common/copyStringToClipboard";
import { Field } from "../../common/model/Field";
import { tooltipDelay } from "../../common/Timings";

export default {
    props: ["field"],
    data: () => ({
        revealed: false,
        tooltipDelay: tooltipDelay
    }),
    computed: {
        displayValue: function () {
            return Field.getDisplayValue(this.field, this.revealed);
        },
        tooltip: function () {
            return Field.getDisplayTooltip(this.field, this.revealed);
        },
        useful: function () {
            return this.field.type !== "checkbox" && this.displayValue.length > 0;
        },
        fieldStyle: function () {
            return this.field.type === "password" ? "cursor: pointer" : "cursor: default";
        }
    },
    methods: {
        toggleReveal: function () {
            this.revealed = !this.revealed;
        },
        copyValue: async function () {
            await copyStringToClipboard(Field.getDisplayValue(this.field, true));
        }
    }
};
</script>
