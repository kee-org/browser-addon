<template>
    <v-row v-if="field.type === 'password' || field.type === 'text'">
        <v-col>
            <v-text-field
                :label="label"
                :value="field.value"
                color="secondary"
                dense
                outlined
                hide-details="auto"
                :type="renderType"
                @input="valueChanged"
                @focus="onFocus"
                @blur="onBlur"
            >
                <template slot="append">
                    <v-fade-transition>
                        <v-btn v-if="focussed && resettable" small icon @click="reset">
                            <v-icon>mdi-undo</v-icon>
                        </v-btn>
                    </v-fade-transition>
                    <v-btn
                        v-if="field.type === 'password'"
                        small
                        icon
                        @click="revealed = !revealed"
                    >
                        <v-icon>{{ revealed ? "mdi-eye" : "mdi-eye-off" }}</v-icon>
                    </v-btn>
                </template>
                <template slot="append-outer">
                    <v-btn
                        v-if="field.type === 'password'"
                        small
                        icon
                        class="mr-3"
                        @click="showPasswordGenerator = true"
                    >
                        <v-icon>mdi-flash</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteClicked">
                        <v-icon>mdi-delete</v-icon>
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
        showPasswordGenerator: false,
        focussed: false
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
        valueChanged: function (this: any, value) {
            this.$emit("field-value-changed", { uuid: this.field.uuid, value });
        },
        deleteClicked: function (this: any) {
            this.$emit("field-deleted", { uuid: this.field.uuid });
        },
        passwordGeneratorClosed: function (this: any, payload) {
            if (payload?.value) this.valueChanged(payload.value);
            this.showPasswordGenerator = false;
        },
        onFocus(this: any) {
            this.focussed = true;
        },
        onBlur(this: any) {
            this.focussed = false;
        }
    }
};
</script>
