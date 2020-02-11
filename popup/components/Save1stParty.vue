<template>
  <div>Hello
    <v-btn right color="light-blue lighten-3" absolute style="bottom: 20px; right: 0px" @click="generatePassword">{{ $i18n('Menu_Button_copyNewPasswordToClipboard_label') }}
              <v-icon class="pl-3">flash_on</v-icon>
            </v-btn>
  </div>
  
</template>

<script lang="ts">
import { Port } from '../../common/port';
import { Action } from '../../common/Action';

export default {
  data: () => ({
    anything: false
  }),
  methods: {
    
    generatePassword: function(this: any) {
      Port.postMessage({ action: Action.GeneratePassword });
      window.close();
    },
  }
};
</script>

<style>
</style>
