<template>
  <div>
    <div class="flex1">
      <div class="Kee-message" v-for="(msg, index) of notification.messages" :key="index">{{msg}}</div>
    </div>
    <div class="kee-button-actions"><button v-for="(but, index) of notification.buttons" 
    :key="index" 
    :title="but.tooltip" 
    :id="but.id"
    @click="dispatchActionResponse(notification.id, but.action, but.values)">{{but.label}}</button></div>
    <span class="close-button glyphicon glyphicon-remove" :title="$i18n('close')" @click="closeNotification(notification.id)"></span>
  </div>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { names as actionNames } from '../store/action-names';
import { SessionType } from '../common/kfDataModel';
import { KeeState } from '../store/KeeState';
import { ButtonAction } from '../common/Button';
import { configManager } from '../common/ConfigManager';
import { AddonMessage } from '../common/AddonMessage';
import { portMixin } from './port';

export default {
  props: ['notification'],
  data() {
    return {};
  },

  methods: {
    ...mapActions(actionNames),
    dispatchActionResponse (id: string, action: ButtonAction, data: { [id: string] : string; }) {
      const pm = (this as any).postMessage;
        switch (action) {
            case "enableHighSecurityKPRPCConnection":
                configManager.current.connSLClient = 3;
                configManager.save();
                break;
            case "loadUrlUpgradeKee":
                pm({ loadUrlUpgradeKee: true });
                break;
            case "disableNotifyWhenEntryUpdated":
                configManager.current.notifyWhenEntryUpdated = false;
                configManager.save();
                break;
            case "launchLoginEditorFromNotification":
                pm({loginEditor: { uniqueID: data.uniqueID, DBfilename: data.fileName}} as AddonMessage);
                break;
        }
        pm({ removeNotification: id } as AddonMessage);
    },
    closeNotification (id: string) {
      const pm = (this as any).postMessage;
      pm({ removeNotification: id } as AddonMessage);
    }
  },
  mixins: [portMixin]
};
</script>
