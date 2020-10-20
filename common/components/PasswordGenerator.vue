<template>
    <v-dialog
        value="true"
        fullscreen
        persistent
        hide-overlay
        :transition="dialogTransition"
        @keydown.esc="cancel"
    >
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
                    <div v-if="!standalone">
                        <br />
                        {{ $i18n("password_will_be_set_on_field") }}
                    </div>
                    <div v-if="!standalone">
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
                    {{ cancelButtonText }}
                </v-btn>

                <v-btn color="primary" :disabled="disabled" @click="ok">
                    {{ okButtonText }}
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

export default {
    mixins: [Port.mixin],
    props: ["field", "standalone", "topmost"],
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
        },
        okButtonText: function (this: any) {
            if (this.standalone) {
                return this.$i18n("generator_action_copy");
            } else if (this.forceCopy) {
                return this.$i18n("generator_action_apply_and_copy");
            } else {
                return this.$i18n("generator_action_apply");
            }
        },
        cancelButtonText: function (this: any) {
            return this.standalone ? this.$i18n("close") : this.$i18n("cancel");
        },
        dialogTransition: function (this: any) {
            return this.topmost ? "false" : "dialog-transition";
        }
    },
    methods: {
        ok: async function (this: any) {
            if (this.standalone || this.forceCopy) {
                this.$emit("copy-to-clipboard", { value: this.generatedPassword });
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
                url: (this.saveState as SaveState)?.newEntry?.URLs?.[0]
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
