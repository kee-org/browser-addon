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
import { mapState } from "pinia";
import PasswordGenerator from "../common/components/PasswordGenerator.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";
import useStore from "../store";

export default {
    components: {
        PasswordGenerator
    },
    data: () => ({
        showPasswordGenerator: false
    }),
    computed: {
        ...mapState(useStore, [
            "showGeneratePasswordLink",
            "connectionStatus",
            "connectionStatusDetail",
            "connected",
            "databaseIsOpen"
        ])
    },
    methods: {
        passwordGeneratorClosed: function () {
            Port.postMessage({ action: Action.CloseAllPanels } as AddonMessage);
        },
        copyToClipboard: function (payload) {
            if (payload?.value) {
                Port.postMessage({ copyToClipboard: payload.value } as AddonMessage);
            }
        }
    }
};
</script>

<style></style>
