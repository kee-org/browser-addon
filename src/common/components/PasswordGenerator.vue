<template>
    <v-dialog
:model-value="true" fullscreen persistent :scrim="false" :transition="dialogTransition"
        @keydown.esc="cancel">
        <v-card>
            <div>
                <v-card-text>
                    <v-select
v-model="selectedProfile" :items="items" :label="$i18n('password_profile')"
                        color="secondary" :hint="$i18n('password_profile_hint')" persistent-hint class="mt-0"
                        @update:model-value="profileChanged" />
                    <v-card
:loading="loading" class="mx-auto px-3 py-0 mt-4" style="font-family: monospace"
                        max-width="300">
                        <v-container class="justify-space-between" style="display: flex; column-gap: 1rem;">
                            <v-sheet class="flex-grow-1" style="align-self: center; flex-shrink: 1; overflow-wrap: anywhere; text-align: center;">
                                {{ renderedPassword }}
                            </v-sheet>
                            <v-sheet style="align-self: center;">
                                <v-btn size="small" icon @click="revealed = !revealed">
                                    <mdi-eye v-if="revealed" scale="150" />
                                    <mdi-eye-off v-if="!revealed" scale="150" />
                                </v-btn>
                            </v-sheet>
                    </v-container>
                    </v-card>
                    <div v-if="!standalone">
                        <br />
                        {{ $i18n("password_will_be_set_on_field") }}
                    </div>
                    <div v-if="!standalone">
                        <v-checkbox v-model="forceCopy" :label="$i18n('also_copy_to_clipboard')">
                        </v-checkbox>
                    </div>
                    <div v-if="!standalone">
                        {{ forceCopyHint }}
                    </div>
                </v-card-text>
            </div>
            <v-card-actions>
                <v-list-item class="w-100">
                    <div class="justify-self-end">
                        <v-btn variant="elevated" color="tertiary" @click="cancel">
                            {{ cancelButtonText }}
                        </v-btn>

                        <v-btn variant="elevated" color="primary" :disabled="disabled" @click="ok">
                            {{ okButtonText }}
                        </v-btn>
                    </div>
                </v-list-item>
            </v-card-actions>
        </v-card>
        <MdiMenuUp v-if="false" />
        <MdiMenuDown v-if="false" />
    </v-dialog>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { Action } from "../../common/Action";
import { SaveState } from "../../common/SaveState";
import useStore from "../../store";
import { mapState } from "pinia";
import MdiMenuUp from "~icons/mdi/menu-up";
import MdiMenuDown from "~icons/mdi/menu-down";
//TODO:  2 x hacks above may not be needed
import { KeeLog } from "../Logger";

export default {
    props: ["field", "standalone", "topmost"],
    emits: ["copy-to-clipboard", "dialog-closed"],
    setup() {
        const { updateGeneratedPassword } = useStore();
        return { updateGeneratedPassword };
    },
    data: () => ({
        selectedProfile: "",
        forceCopy: false,
        //generatedPassword: "",
        revealed: false,
        loading: false
    }),
    computed: {
        ...mapState(useStore, ["PasswordProfiles", "saveState", "generatedPassword"]),
        items: function () {
            return this.PasswordProfiles.map(p => p.name);
        },
        disabled: function () {
            return !this.generatedPassword;
        },
        forceCopyHint: function () {
            return this.forceCopy ? this.$i18n("generatePassword_done_2") : "";
        },
        renderedPassword: function () {
            return this.revealed
                ? this.generatedPassword
                : "*".repeat(this.generatedPassword.length);
        },
        okButtonText: function () {
            if (this.standalone) {
                return this.$i18n("generator_action_copy");
            } else if (this.forceCopy) {
                return this.$i18n("generator_action_apply_and_copy");
            } else {
                return this.$i18n("generator_action_apply");
            }
        },
        cancelButtonText: function () {
            return this.standalone ? this.$i18n("close") : this.$i18n("cancel");
        },
        dialogTransition: function () {
            return this.topmost ? "false" : "dialog-transition";
        }
    },
    // watch: {
    //     generatedPassword: function (newState: SaveState, oldState: SaveState) {
    //                 KeeLog.error("watch outer fired");
    //         this.loading = false;
    //     }
    // },
    methods: {
        ok: async function () {
            if (this.standalone || this.forceCopy) {
                this.$emit("copy-to-clipboard", { value: this.generatedPassword });
            }
            this.$emit("dialog-closed", { value: this.generatedPassword });
        },
        cancel: function () {
            this.$emit("dialog-closed");
        },
        profileChanged: function (item: string) {
            this.loading = true;
            const unwatch = this.$watch(
                "generatedPassword",
                newValue => {
                    KeeLog.debug("watch inner fired");
                    unwatch();
                    // this.updateGeneratedPassword("");
                    // this.generatedPassword = newValue;
                    this.loading = false;
                }
            );
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
