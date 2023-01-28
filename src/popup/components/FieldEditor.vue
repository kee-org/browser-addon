<template>
    <v-row v-if="field.type === 'password' || field.type === 'text'">
        <v-col>
            <v-text-field
                :label="label"
                :model-value="field.value"
                color="secondary"
                dense
                variant="outlined"
                hide-details="auto"
                :type="renderType"
                @update:model-value="valueChanged"
                @focus="onFocus"
                @blur="onBlur"
            >
                <template #append-inner>
                    <v-fade-transition>
                        <v-btn v-if="focussed && resettable" size="small" icon @click="reset">
                            <mdi-undo />
                        </v-btn>
                    </v-fade-transition>
                    <v-btn
                        v-if="field.type === 'password'"
                        size="small"
                        icon
                        @click="revealed = !revealed"
                    >
                        <mdi-eye v-if="revealed"/>
                        <mdi-eye-off v-if="!revealed"/>
                    </v-btn>
                </template>
                <template #append>
                    <v-btn
                        v-if="field.type === 'password'"
                        size="small"
                        icon
                        class="mr-3"
                        @click="showPasswordGenerator = true"
                    >
                        <mdi-flash />
                    </v-btn>
                    <v-btn size="small" icon @click="deleteClicked">
                        <mdi-delete />
                    </v-btn>
                </template>
            </v-text-field>
            <PasswordGenerator
                v-if="showPasswordGenerator"
                @dialog-closed="passwordGeneratorClosed"
                @copy-to-clipboard="copyToClipboard"
            />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Field } from "../../common/model/Field";
import PasswordGenerator from "../../common/components/PasswordGenerator.vue";
import { copyStringToClipboard } from "../../common/copyStringToClipboard";

export default {
    components: {
        PasswordGenerator
    },
    props: ["field"],
    emits: ["field-value-changed", "field-deleted"],
    data: () => ({
        revealed: false,
        showPasswordGenerator: false,
        focussed: false
    }),
    computed: {
        renderType: function () {
            if (this.field.type === "password") {
                return this.revealed ? "text" : "password";
            }
            return this.field.type;
        },
        resettable: function () {
            return this.field.resetValue !== this.field.value;
        },
        label: function () {
            return Field.getDisplayName(this.field);
        }
    },
    methods: {
        reset: function () {
            this.valueChanged(this.field.resetValue);
        },
        valueChanged: function (value) {
            this.$emit("field-value-changed", { uuid: this.field.uuid, value });
        },
        deleteClicked: function () {
            this.$emit("field-deleted", { uuid: this.field.uuid });
        },
        passwordGeneratorClosed: function (payload) {
            if (payload?.value) this.valueChanged(payload.value);
            this.showPasswordGenerator = false;
        },
        onFocus() {
            this.focussed = true;
        },
        onBlur() {
            this.focussed = false;
        },
        copyToClipboard: async function (payload) {
            if (payload?.value) await copyStringToClipboard(payload.value);
        }
    }
};
</script>
