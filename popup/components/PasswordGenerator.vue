<template>
  <v-dialog
    value="true"
    fullscreen
    hide-overlay
    transition="dialog-transition"
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
          />
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer />

        <v-btn
          color="tertiary"
          @click="cancel"
        >
          {{ $i18n('cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          :disabled="disabled"
          @click="ok"
        >
          {{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}
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
    props: ["field"],
    data: () => ({
        selectedProfile: ""
    }),
    computed: {
        ...mapGetters(["PasswordProfiles", "saveState"]),
        items: function (this: any) {
            return this.PasswordProfiles.map(p => p.name);
        },
        disabled: function (this: any) {
            return !this.selectedProfile;
        }
    },
    methods: {
        ok: async function (this: any) {
            const unwatch = this.$watch(
                "$store.state.generatedPassword",
                function (this: any, newValue) {
                    unwatch();
                    this.$store.dispatch("updateGeneratedPassword", "");
                    this.$emit("dialog-closed", { value: newValue });
                }
            );
            Port.postMessage({ action: Action.GeneratePassword, passwordProfile: this.selectedProfile, url: (this.saveState as SaveState).newEntry?.URLs?.[0] });
        },
        cancel: function (this: any) {
            this.$emit("dialog-closed");
        }
    }
};
</script>
