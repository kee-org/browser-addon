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
            label="Password profile"
            outlined
            hint="Select which set of rules the new password will follow. Rules include password length and the sort of characters that are allowed. Create new profiles in your password manager."
            persistent-hint
          />
        </v-card-text>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="green darken-1"
          text
          @click="cancel"
        >
          Cancel
        </v-btn>

        <v-btn
          color="green darken-1"
          text
          @click="ok"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Port } from "../../common/port";
import { mapGetters } from "vuex";
import { Action } from "../../common/Action";

export default {
    props: ["field"],
    data: () => ({
        selectedProfile: "" //TODO: select most recently used or first result or something
    }),
    computed: {
        ...mapGetters(["PasswordProfiles", ""]),
        items: function (this: any) {
            return this.PasswordProfiles.map(p => p.name);
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
            Port.postMessage({ action: Action.GeneratePassword, passwordProfile: this.selectedProfile });
        },
        cancel: function (this: any) {
            this.$emit("dialog-closed");
        }
    }
};
</script>
