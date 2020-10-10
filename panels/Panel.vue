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
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { names as actionNames } from "../store/action-names";
import { SessionType } from "../common/SessionType";
import { KeeState } from "../store/KeeState";
import PasswordGenerator from "../common/components/PasswordGenerator.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { KeeVue } from "../common/KeeVue";
import { Entry } from "../common/model/Entry";
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
