
<template>
  <v-app id="inspire" :dark="darkTheme" style="overflow-y: hidden">
      <v-toolbar app fixed style="max-width: 400px;">
          <SearchInput v-show="showSearchPanel"/>
      </v-toolbar>
    <v-content style="overflow-y: hidden">
      <v-container fluid fill-height style="padding: 0px; overflow-y: hidden">
        <v-layout row wrap justify-center align-top style="overflow-y: scroll;padding-right: 24px;padding-left: 32px;">
          <v-flex xs12 class="pb-4">
            <div v-if="showNotifications" id="notifications" class="pt-4">
                <Notification v-for="n of notifications" :notification="n" :key="n.id"></Notification>
            </div>
            <SearchResults v-show="showSearchPanel" :matchedLogins="matchedLogins" :frameId="frameId"></SearchResults>
          </v-flex>
        </v-layout>
        
      </v-container>
    </v-content>

<v-speed-dial v-show="showSaveLatestLogin || showGeneratePasswordLink" absolute bottom right direction="top" style="bottom: 75px; right: 24px">
            <template v-slot:activator>
              <v-btn color="light-blue darken-2" fab small>
                <v-icon>add</v-icon>
                <v-icon>close</v-icon>
              </v-btn>
            </template>
            <v-btn v-show="showSaveLatestLogin" right color="light-blue lighten-3" absolute style="bottom: 80px; right: 0px" @click="saveLatestLogin">{{ $i18n('saveLatestLogin') }}
                <v-icon class="pl-3">add_circle</v-icon>
            </v-btn>
            <v-btn v-show="showGeneratePasswordLink" right color="light-blue lighten-3" absolute style="bottom: 20px; right: 0px" @click="generatePassword">{{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}
              <v-icon class="pl-3">flash_on</v-icon>
            </v-btn>
          </v-speed-dial>

    <v-footer height="auto">
      <v-tooltip top>
        <v-btn :aria-label="$i18n('Menu_Button_open_kee_vault_label')" slot="activator" class="mx-2" icon id="password-open-kee-vault" @click="openKeeVault">
            <img width="24px" height="24px" src="../common/images/48-kee-vault.png" />
        </v-btn>
        <span>{{ $i18n('Menu_Button_open_kee_vault_label') }}</span>
        </v-tooltip>
      <v-tooltip top>
        <v-btn :aria-label="$i18n('Menu_Button_open_keepass_label')" slot="activator" class="mx-0" icon v-show="showOpenKeePassButton" id="password-open-keepass" @click="openKeePass">
            <img width="24px" height="24px" src="../common/images/48-keepass.png" />
        </v-btn>
        <span>{{ $i18n('Menu_Button_open_keepass_label') }}</span>
        </v-tooltip>
      <v-divider class="ml-1" vertical></v-divider>
      <v-icon size="20px" :color="statusIconColour" class="mx-2">lock</v-icon>
      <v-tooltip top>
        <v-flex
          shrink
          slot="activator"
          class="caption py-1"
          style="word-break: break-word;overflow-wrap: break-word;"
        >{{connectionStatus}}</v-flex>
        <span>{{connectionStatusDetail}}</span>
      </v-tooltip>

      <v-spacer></v-spacer>

        <v-menu top offset-y small>
            <template v-slot:activator="{ on }">
                <v-btn
                icon
                small
                v-on="on"
                >
                <v-icon>menu</v-icon>
                </v-btn>
            </template>

            <v-list>
                <!-- <v-list-tile @click="">
                <v-list-tile-title class="mr-3 text-xs-right body-2">Force form field detection</v-list-tile-title>
                <v-icon size="20px">refresh</v-icon>
                </v-list-tile> -->
                <v-list-tile @click="showHelp">
                <v-list-tile-title right class="mr-3 text-xs-right body-2">{{ $i18n('Help_Centre_Button_label') }}</v-list-tile-title>
                <v-icon size="20px">help</v-icon>
                </v-list-tile>
                <v-list-tile @click="showOptions">
                <v-list-tile-title class="mr-3 text-xs-right body-2">{{ $i18n('Menu_Button_options_label') }}</v-list-tile-title>
                <v-icon size="20px">settings</v-icon>
                </v-list-tile>
            </v-list>
        </v-menu>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { names as actionNames } from '../store/action-names';
import { SessionType } from '../common/kfDataModel';
import { KeeState } from '../store/KeeState';
import Notification from "./components/Notification.vue";
import SearchInput from "./components/SearchInput.vue";
import SearchResults from "./components/SearchResults.vue";
import { Port } from '../common/port';
import { Action } from '../common/Action';
import { KeeLog } from '../common/Logger';

export default {
    props: ['matchedLogins', 'frameId'],
  computed: {
    ...mapGetters(['showGeneratePasswordLink', 'showSaveLatestLogin', 
    'showMatchedLogins','showOpenKeePassButton','connectionStatus',
    'connectionStatusDetail', 'connected', 'databaseIsOpen',
    'notifications', 'showNotifications', 'showSearchPanel']),
    darkTheme: () => window.matchMedia("prefers-color-scheme: dark").matches,
    statusIconColour: function (this: any) {
        if (this.connected && this.databaseIsOpen) {
            return "green";
        } else if (this.connected) {
            return "orange";
        }
        return "red";
    }
  },

  methods: {
    ...mapActions(actionNames),
    showOptions: () => {
        browser.runtime.openOptionsPage();
        window.close();
    },
    generatePassword: () => {
        Port.postMessage({ action: Action.GeneratePassword });
        window.close();
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
    openKeeVault: async function() {
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
    openKeePass: function() {
        KeeLog.debug("open KeePass requested");
        if ((this as any).$store.state.connectedWebsocket) {
            Port.postMessage({ action: Action.OpenKeePass });
        } else {
            KeeLog.info("KeePass no longer connected so taking no action");
        }
        window.close();
    }
  },

  components: {
      Notification,
      SearchResults,
      SearchInput
  },

  mixins: [Port.mixin]
};
</script>

<style>

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
}

</style>
