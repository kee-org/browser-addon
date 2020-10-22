<template>
    <v-app id="inspire">
        <PasswordGenerator
            :standalone="true"
            :topmost="true"
            @dialog-closed="passwordGeneratorClosed"
            @copy-to-clipboard="copyToClipboard"
        />
    </v-app>
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import { names as actionNames } from "../store/action-names";
import PasswordGenerator from "../common/components/PasswordGenerator.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";

export default {
    components: {
        PasswordGenerator
    },
    mixins: [Port.mixin],
    data: () => ({
        showPasswordGenerator: false
    }),
    computed: {
        ...mapGetters([
            "showGeneratePasswordLink",
            "connectionStatus",
            "connectionStatusDetail",
            "connected",
            "databaseIsOpen"
        ])
    },
    methods: {
        ...mapActions(actionNames),
        passwordGeneratorClosed: function (this: any) {
            Port.postMessage({ action: Action.CloseAllPanels } as AddonMessage);
        },
        copyToClipboard: function (this: any, payload) {
            if (payload?.value) {
                Port.postMessage({ copyToClipboard: payload.value } as AddonMessage);
            }
        }
    }
};
</script>

<style></style>
