<template>
  <div id="main">
    <div class="panel-body">
        <div v-if="showNotifications" id="notifications">
            <Notification v-for="n of notifications" :notification="n" :key="n.id"></Notification>
        </div>
        <SearchPanel v-show="showSearchPanel"></SearchPanel>
        <div class="list-group" id="menu-items">
            <a v-show="showMatchedLogins" href="#" id="showMatchedLogins" class="list-group-item" @click="showMatchedLoginsPanel">{{ $i18n('matched_logins_label') }}</a>
            <a v-show="showSaveLatestLogin" href="#" id="saveLatestLogin" class="list-group-item" @click="saveLatestLogin">{{ $i18n('saveLatestLogin') }}</a>
            <a v-show="showGeneratePasswordLink" href="#" id="generatePasswordLink" class="list-group-item" @click="generatePassword">{{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}</a>
            <a href="#" id="helpLink" class="list-group-item" @click="showHelp">{{ $i18n('Help_Centre_Button_label') }}</a>
            <a href="#" id="optionsLink" class="list-group-item" @click="showOptions">{{ $i18n('Menu_Button_options_label') }}</a>
            <div id="debug" class="list-group-item hidden"></div>
        </div>
    </div>
    <div class="panel-heading" id="connectionStatus">{{connectionStatus}}</div>
    <div id="passwordOpenButtons">
        <a href="#" class="password-open-item" id="password-open-kee-vault" @click="openKeeVault">{{ $i18n('Menu_Button_open_kee_vault_label') }}</a>
        <a v-show="showOpenKeePassButton" href="#" class="password-open-item" id="password-open-keepass" @click="openKeePass">{{ $i18n('Menu_Button_open_keepass_label') }}</a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { names as actionNames } from '../store/action-names';
import { SessionType } from '../common/kfDataModel';
import { KeeState } from '../store/KeeState';
import Notification from "./Notification.vue";
import SearchPanel from "./SearchPanel.vue";
import { Port } from '../common/port';
import { Action } from '../common/Action';
import { KeeLog } from '../common/Logger';

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(['showGeneratePasswordLink', 'showSaveLatestLogin', 
    'showMatchedLogins','showOpenKeePassButton','connectionStatus', 
    'notifications', 'showNotifications', 'showSearchPanel']),
    
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
      SearchPanel
  },

  mounted: function () {
    // Hack around Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1516132
    // and https://bugzilla.mozilla.org/show_bug.cgi?format=default&id=1416505
    document.addEventListener("DOMContentLoaded", () => {
        let count = 0;
        const timer = setInterval(() => {
            let newPl = "";
            const pl = document.getElementById("searchBox").getAttribute("placeholder");
            if (pl.endsWith(" ")) newPl = pl.trim();
            else newPl = pl + " ";
            document.getElementById("searchBox").setAttribute("placeholder", newPl);
            count++;
            if (count > 20) clearInterval(timer);
        }, 200);
    });
  },
  mixins: [Port.mixin]
};
</script>
