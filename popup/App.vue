<template>
  <div id="main">
    <div class="panel-body">
        <div v-if="showNotifications" id="notifications">
            <Notification v-for="n of notifications" :notification="n" :key="n.id"></Notification>
        </div>
        <SearchPanel v-show="showSearchPanel"></SearchPanel>
        <div class="list-group" id="menu-items">
            <a v-show="showMatchedLogins" href="#" id="showMatchedLogins" class="list-group-item">{{ $i18n('matched_logins_label') }}</a>
            <a v-show="showSaveLatestLogin" href="#" id="saveLatestLogin" class="list-group-item">{{ $i18n('saveLatestLogin') }}</a>
            <a v-show="showGeneratePasswordLink" href="#" id="generatePasswordLink" class="list-group-item">{{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}</a>
            <a href="#" id="helpLink" class="list-group-item">{{ $i18n('Help_Centre_Button_label') }}</a>
            <a href="#" id="optionsLink" class="list-group-item">{{ $i18n('Menu_Button_options_label') }}</a>
            <div id="debug" class="list-group-item hidden"></div>
        </div>
    </div>
    <div class="panel-heading" id="connectionStatus">{{connectionStatus}}</div>
    <div id="passwordOpenButtons">
        <a href="#" class="password-open-item" id="password-open-kee-vault">{{ $i18n('Menu_Button_open_kee_vault_label') }}</a>
        <a v-show="showOpenKeePassButton" href="#" class="password-open-item" id="password-open-keepass">{{ $i18n('Menu_Button_open_keepass_label') }}</a>
    </div>
    <div>Timer: {{ timer }}</div>
    <div>Magic: {{ magic }}</div>
    <div>Counter: {{ counter }} <button v-on:click="decrementCounter">-</button><button v-on:click="incrementCounter">+</button></div>
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

export default {
  data() {
    return {};
  },

  computed: {
    ...mapGetters(['timer', 'counter', 'magic', 'showGeneratePasswordLink', 'showSaveLatestLogin', 
    'showMatchedLogins','showOpenKeePassButton','connectionStatus', 'notifications', 'showNotifications', 'showSearchPanel']),
    
  },

  methods: {
    ...mapActions(actionNames)
  },

  components: {
      Notification,
      SearchPanel
  }
};
</script>
