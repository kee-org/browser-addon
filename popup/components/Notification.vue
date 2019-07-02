<template>
  <v-card color="yellow lighten-3">
          <div style="float: right">
              <v-btn
                flat
                class="ml-3 mr-2 px-2"
                @click="closeNotification(notification.id)"
              >{{$i18n('close')}}
                  <v-icon>close</v-icon></v-btn>          
        </div>
    
    <v-card-text>
      <p v-for="(msg, index) of notification.messages" :key="index">{{msg}}</p>
    </v-card-text>
    <v-card-actions>
      <v-layout row justify-center align-end class="mb-1 mt-1">
          <v-flex>
                <v-layout row wrap justify-left align-end class="ml-2">
                    <v-tooltip top
                        v-for="(but, index) of notification.buttons"
                        :key="index"
                        :disabled="!but.tooltip" >
                      <v-btn
                        :id="but.id"
                        class="mr-3 my-2"
                        color="primary"
                        slot="activator"
                        @click="dispatchActionResponse(notification.id, but.action, but.values)"
                      >{{but.label}}</v-btn>
                      <span>{{but.tooltip}}</span>
                    </v-tooltip>
                </v-layout>
          </v-flex>
      </v-layout>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { names as actionNames } from '../../store/action-names';
import { SessionType } from '../../common/kfDataModel';
import { KeeState } from '../../store/KeeState';
import { ButtonAction } from '../../common/Button';
import { configManager } from '../../common/ConfigManager';
import { AddonMessage } from '../../common/AddonMessage';
import { Port } from '../../common/port';

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
  mixins: [Port.mixin]
};
</script>
