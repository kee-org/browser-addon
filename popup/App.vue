
<template>
  <v-app
    id="inspire"
  >
    <v-app-bar
      v-model="showSearchPanel"
      app
      style="max-width: 400px;"
    >
      <SearchInput />
    </v-app-bar>
    <v-content :class="`${showSearchPanel ? 'app_height_medium' : 'app_height_tall'}`">
      <v-container
        fluid
      >
        <v-alert
          v-show="showSaveRecovery"
          :value="true"
          color="warning"
          icon="mdi-warning"
          outlined
        >
          Continue saving or discard your changes?<br>
          <v-btn @click="saveRecover">
            Continue
          </v-btn>
          <v-btn @click="saveDiscard">
            Discard
          </v-btn>
        </v-alert>
        <div
          v-if="showNotifications"
          id="notifications"
          class="pt-6"
        >
          <Notification
            v-for="n of notifications"
            :key="n.id"
            :notification="n"
          />
        </div>
        <SearchResults
          v-show="showSearchPanel"
          :matched-logins="matchedLogins"
          :frame-id="frameId"
        />
        <Save1stParty v-show="showSaveStart" />
      </v-container>
    </v-content>

    <v-fade-transition>
      <v-btn
        v-show="showSearchPanel && !showSaveRecovery"
        color="light-blue darken-2"
        fab
        small
        absolute
        bottom
        right
        style="bottom: 75px; right: 24px"
        @click="saveStart"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fade-transition> <!-- </v-fab-transition> -->

    <v-footer
      app
      height="auto"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            id="password-open-kee-vault"
            :aria-label="$i18n('Menu_Button_open_kee_vault_label')"
            class="mx-2"
            icon
            v-on="on"
            @click="openKeeVault"
          >
            <img
              width="24px"
              height="24px"
              src="../common/images/48-kee-vault.png"
            >
          </v-btn>
        </template>
        <span>{{ $i18n('Menu_Button_open_kee_vault_label') }}</span>
      </v-tooltip>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <v-btn
            v-show="showOpenKeePassButton"
            id="password-open-keepass"
            :aria-label="$i18n('Menu_Button_open_keepass_label')"
            class="mx-0"
            icon
            v-on="on"
            @click="openKeePass"
          >
            <img
              width="24px"
              height="24px"
              src="../common/images/48-keepass.png"
            >
          </v-btn>
        </template>
        <span>{{ $i18n('Menu_Button_open_keepass_label') }}</span>
      </v-tooltip>
      <v-divider
        vertical
      ></v-divider>
      <v-icon
        size="20px"
        :color="statusIconColour"
        class="mx-2"
      >
        mdi-lock
      </v-icon>
      <v-tooltip top>
        <template v-slot:activator="{ on }">
          <div
            class="caption py-1 shrink"
            style="word-break: break-word;overflow-wrap: break-word;max-width: 250px;"
            v-on="on"
          >
            {{ connectionStatus }}
          </div>
        </template>
        <span>{{ connectionStatusDetail }}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

      <v-menu
        top
        offset-y
        small
      >
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            small
            v-on="on"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </template>

        <v-list>
          <!-- <v-list-tile @click="">
                <v-list-tile-title class="mr-4 text-xs-right body-2">Force form field detection</v-list-tile-title>
                <v-icon size="20px">mdi-refresh</v-icon>
                </v-list-tile> -->
          <v-list-item @click="showHelp">
            <v-list-item-title
              right
              class="mr-4 text-right body-2"
            >
              {{ $i18n('Help_Centre_Button_label') }}
            </v-list-item-title>
            <v-icon size="20px">
              mdi-help
            </v-icon>
          </v-list-item>
          <v-list-item @click="showOptions">
            <v-list-item-title class="mr-4 text-right body-2">
              {{ $i18n('Menu_Button_options_label') }}
            </v-list-item-title>
            <v-icon size="20px">
              mdi-settings
            </v-icon>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from "vuex";
import { names as actionNames } from "../store/action-names";
import { SessionType, keeLoginInfo } from "../common/kfDataModel";
import { KeeState } from "../store/KeeState";
import Notification from "./components/Notification.vue";
import SearchInput from "./components/SearchInput.vue";
import SearchResults from "./components/SearchResults.vue";
import Save1stParty from "./components/Save1stParty.vue";
import { Port } from "../common/port";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { SaveState } from "../common/SaveState";
import { KeeVue } from "./KeeVue";
import { Entry, mapToFields } from "../common/model/Entry";

export default {
    components: {
        Notification,
        SearchResults,
        SearchInput,
        Save1stParty
    },
    mixins: [Port.mixin],
    props: ["matchedLogins", "frameId"],
    data: () => ({
        saveLastActiveAt: null
    }),
    computed: {
        ...mapGetters(["showGeneratePasswordLink", "saveState",
            "showMatchedLogins","showOpenKeePassButton","connectionStatus",
            "connectionStatusDetail", "connected", "databaseIsOpen",
            "notifications", "showNotifications"]),
        statusIconColour: function (this: any) {
            if (this.connected && this.databaseIsOpen) {
                return "green";
            } else if (this.connected) {
                return "orange";
            }
            return "red";
        },
        showSaveStart: function (this: any) {
            return this.saveLastActiveAt > new Date(Date.now()-6000);
        },
        showSaveRecovery: function (this: any) {
            return !this.showSaveStart && this.saveLastActiveAt > new Date(Date.now()-12000);
        },
        showSearchPanel: function (this: any) {
            return this.databaseIsOpen && !this.showSaveStart;
        }
    },
    mounted (this: any) {
        const ss = this.$store.state.saveState as SaveState;
        this.saveLastActiveAt = ss?.lastActiveAt;
    },
    methods: {
        ...mapActions(actionNames),
        showOptions: () => {
            browser.runtime.openOptionsPage();
            window.close();
        },
        saveStart: function (this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = supplementEntryState(new Entry({}), ss);
            updatedSaveState.lastActiveAt = new Date();
            this.$store.dispatch("updateSaveState", updatedSaveState);
            this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveRecover: function (this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.lastActiveAt = new Date();
            this.$store.dispatch("updateSaveState", updatedSaveState);
            this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveDiscard: function (this: any) {
            const ss = this.$store.state.saveState as SaveState;
            const updatedSaveState = Object.assign({}, ss);
            updatedSaveState.newEntry = new Entry({});
            updatedSaveState.lastActiveAt = null;
            this.$store.dispatch("updateSaveState", updatedSaveState);
            this.saveLastActiveAt = updatedSaveState.lastActiveAt;
        },
        saveLatestLogin: () => {
            Port.postMessage({ action: Action.SaveLatestLogin });
            window.close();
        },
        showMatchedLoginsPanel: () => {
            Port.postMessage({ action: Action.ShowMatchedLoginsPanel });
            window.close();
        },
        showHelp: () => {
            browser.tabs.create({ url: "https://www.kee.pm/help" });
            window.close();
        },
        openKeeVault: async function () {
            KeeLog.debug("open Kee Vault requested");
            const vaultTabs = await browser.tabs.query({url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]});
            if (vaultTabs && vaultTabs[0]) {
                browser.tabs.update(vaultTabs[0].id, { active: true });
            } else {
                browser.tabs.create({
                    url: "https://keevault.pm/",
                    active: true
                });
            }
            window.close();
        },
        openKeePass: function () {
            KeeLog.debug("open KeePass requested");
            if ((this as any).$store.state.connectedWebsocket) {
                Port.postMessage({ action: Action.OpenKeePass });
            } else {
                KeeLog.info("KeePass no longer connected so taking no action");
            }
            window.close();
        }
    }
};

function supplementEntryState (entry: Entry, saveState: SaveState) {
    const sd = saveState.submittedData;
    const overwrite = (sd ? {
        URLs: [sd.url],
        fields: mapToFields(sd.usernameIndex, sd.otherFields, sd.passwordFields),
        title: sd.title
    //TODO: e.iconImageData
    } : {}) as Entry;
    return Object.assign(Object.assign({}, entry), overwrite);
}
</script>

<style>
/*
html {
  overflow-y: hidden;
}

body {
    max-height: 570px;
}

.application--wrap {
  display: grid;
  min-height: 570px;
  max-height: 570px;
  height: 570px;
  grid-template-rows: 1fr auto;
}

.v-content {
  flex: 0 1 auto;
  max-height: 100%;
  overflow-y: hidden;
} */

.v-content__wrap {
  overflow-y: scroll;
}

.app_height_medium .v-content__wrap {
  max-height: 466px;
  min-height: 466px;
  height: 466px;
}

.app_height_tall .v-content__wrap {
  max-height: 522px;
  min-height: 522px;
  height: 522px;
}


</style>
