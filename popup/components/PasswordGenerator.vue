<template>
    <v-dialog value="true" fullscreen hide-overlay transition="dialog-transition">
        <v-card>
            <div>
                <v-card-text>
                    <v-select
                        v-model="selectedProfile"
                        :items="items"
                        :label="$i18n('password_profile')"
                        outlined
                        color="secondary"
                        :hint="$i18n('password_profile_hint')"
                        persistent-hint
                        class="mt-4"
                        @change="profileChanged"
                    />
                    <v-card
                        :loading="loading"
                        class="mx-auto px-3 py-0 mt-4"
                        style="font-family: monospace;"
                        max-width="300"
                    >
                        <v-row class="flex-nowrap" align="center">
                            <v-col cols="10" class="text-center">
                                {{ renderedPassword }}
                            </v-col>
                            <v-col cols="2">
                                <v-btn small icon @click="revealed = !revealed">
                                    <v-icon>
                                        {{ revealed ? "mdi-eye" : "mdi-eye-off" }}
                                    </v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                    <div>
                        <br />
                        {{ $i18n("password_will_be_set_on_field") }}
                    </div>
                    <div>
                        <v-checkbox
                            v-model="forceCopy"
                            :label="$i18n('also_copy_to_clipboard')"
                            persistent-hint
                            :hint="forceCopyHint"
                        />
                    </div>
                </v-card-text>
            </div>
            <v-card-actions>
                <v-spacer />

                <v-btn color="tertiary" @click="cancel">
                    {{ $i18n("cancel") }}
                </v-btn>

                <v-btn color="primary" :disabled="disabled" @click="ok">
                    {{
                        forceCopy
                            ? $i18n("generator_action_apply_and_copy")
                            : $i18n("generator_action_apply")
                    }}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { mapGetters } from "vuex";
import { Action } from "../../common/Action";
import { SaveState } from "../../common/SaveState";
import { copyStringToClipboard } from "../copyStringToClipboard";

export default {
    props: ["field"],
    data: () => ({
        selectedProfile: "",
        forceCopy: false,
        generatedPassword: "",
        revealed: false,
        loading: false
    }),
    computed: {
        ...mapGetters(["PasswordProfiles", "saveState"]),
        items: function (this: any) {
            return this.PasswordProfiles.map(p => p.name);
        },
        disabled: function (this: any) {
            return !this.generatedPassword;
        },
        forceCopyHint: function (this: any) {
            return this.forceCopy ? this.$i18n("generatePassword_done_2") : "";
        },
        renderedPassword: function (this: any) {
            return this.revealed
                ? this.generatedPassword
                : "*".repeat(this.generatedPassword.length);
        }
    },
    methods: {
        ok: async function (this: any) {
            if (this.forceCopy) {
                await copyStringToClipboard(this.generatedPassword);
            }
            this.$emit("dialog-closed", { value: this.generatedPassword });
        },
        cancel: function (this: any) {
            this.$emit("dialog-closed");
        },
        profileChanged: function (this: any, item: string) {
            this.loading = true;
            const unwatch = this.$watch("$store.state.generatedPassword", function (
                this: any,
                newValue
            ) {
                unwatch();
                this.$store.dispatch("updateGeneratedPassword", "");
                this.generatedPassword = newValue;
                this.loading = false;
            });
            Port.postMessage({
                action: Action.GeneratePassword,
                passwordProfile: item,
                url: (this.saveState as SaveState).newEntry?.URLs?.[0]
            });
        }
    }
};
</script>
<style>
.v-input--checkbox .v-messages__wrapper {
    min-height: 32px;
}
.v-text-field__details .v-messages__message,
.v-input--checkbox .v-messages__message {
    line-height: 16px;
}
</style>
