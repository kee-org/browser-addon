<template>
    <v-dialog value="true" fullscreen hide-overlay transition="dialog-transition">
        <v-card>
            <div>
                <v-card-text>
                    <h2 class="text-center">
                        Add field
                    </h2>

                    <v-radio-group v-model="field.type">
                        <template v-slot:label>
                            <div class="font-weight-bold">
                                What type of field is this?
                            </div>
                        </template>
                        <v-radio label="Text (e.g. a name or email address)" value="text"></v-radio>
                        <v-radio label="Password (e.g. a PIN)" value="password"></v-radio>
                    </v-radio-group>

                    <v-text-field
                        v-model="field.name"
                        label="Name"
                        hint="If possible, use the same text as the visible web page field label. This will help Kee fill in the correct web page field"
                        color="secondary"
                        dense
                        outlined
                        class="my-1 mb-0"
                        type="text"
                    >
                    </v-text-field>

                    <v-text-field
                        v-model="field.value"
                        label="Value"
                        color="secondary"
                        dense
                        outlined
                        class="mt-0 mb-10"
                        hide-details="auto"
                        :type="renderType"
                    >
                        <template slot="append">
                            <v-btn
                                v-if="field.type === 'password'"
                                small
                                icon
                                @click="revealed = !revealed"
                            >
                                <v-icon>{{ revealed ? "mdi-eye" : "mdi-eye-off" }}</v-icon>
                            </v-btn>
                        </template>
                    </v-text-field>

                    <v-expansion-panels v-model="panel" accordion hover>
                        <v-expansion-panel>
                            <v-expansion-panel-header>
                                Advanced configuration
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <h3 class="my-2">
                                    Field locators
                                </h3>
                                <p>
                                    Kee automatically works out where each field should be filled in
                                    on a web page. Some pages do not follow the latest industry
                                    standards and so you can use field locators to give Kee a
                                    helping hand.
                                </p>

                                <p>
                                    Getting these settings correct requires technical knowledge and
                                    using the wrong values can make things worse so leave them alone
                                    unless you fully understand their meaning.
                                </p>
                                <v-card class="my-2">
                                    <v-card-title class="text-subtitle-1">
                                        HTML attributes
                                    </v-card-title>
                                    <v-text-field
                                        v-model="field.locators[0].name"
                                        label="name"
                                        color="secondary"
                                        dense
                                        outlined
                                        hide-details="auto"
                                        type="text"
                                        class="pa-3"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        v-model="field.locators[0].id"
                                        label="id"
                                        color="secondary"
                                        dense
                                        outlined
                                        hide-details="auto"
                                        type="text"
                                        class="pa-3"
                                    >
                                    </v-text-field>
                                </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-card-text>
            </div>
            <v-card-actions>
                <v-spacer />

                <v-btn right color="tertiary" @click="cancel">
                    Cancel
                </v-btn>
                <v-btn :disabled="!enabled" right color="primary" @click="addClicked">
                    Add
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { mapGetters } from "vuex";
import { Action } from "../../common/Action";
import { Field } from "../../common/model/Field";

export default {
    data: () => ({
        field: new Field({ type: "text", locators: [{ name: "", id: "", type: "" }], value: "" }),
        revealed: true,
        panel: []
    }),
    computed: {
        renderType: function (this: any) {
            if (this.field.type === "password") {
                return this.revealed ? "text" : "password";
            }
            return this.field.type;
        },
        enabled: function (this: any) {
            return this.field.name && this.field.value;
        }
    },
    methods: {
        addClicked: async function (this: any) {
            console.error("add clicked");
            this.field.locators[0].type = this.field.type;
            this.$emit("add-field-closed", { field: this.field });
        },
        cancel: function (this: any) {
            this.$emit("add-field-closed");
        }
    }
};
</script>
<style>
.v-text-field__details {
    min-height: 48px;
}

.v-text-field__details .v-messages__message {
    line-height: 16px;
}
</style>
