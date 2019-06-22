<template>
  <li 
  class="login-item" 
  :style="inlineStyle" 
  :title="$i18n('savePasswordLogin_tip', [usernameDisplayValue, entry.url])" 
  :tabindex="tabindex"
  :data-uuid="entry.uniqueID"
  :data-filename="entry.dbFileName"
  @keydown="searchResultKeyboardNavHandler"
  @click="clickHandler"
  @mousedown="onMouseDown"
  @keeCommand="keeCommand"
  @mouseenter="onMouseEnter"
  @mouseleave="onMouseLeave"
  @contextmenu="onContextMenu">
    {{$i18n('matchedLogin_label', [usernameDisplayValue, entry.title])}}
  </li>
</template>


<script lang="ts">
/*

// needed (above) until context buttons refactor
loginItem.setAttribute("data-uuid", login.uniqueID);
loginItem.setAttribute("data-filename", login.dbFileName);

*/

import { Component } from "vue";
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex';
import { names as actionNames } from '../store/action-names';
import { SessionType } from '../common/kfDataModel';
import { KeeState } from '../store/KeeState';
import { ButtonAction } from '../common/Button';
import { configManager } from '../common/ConfigManager';
import { AddonMessage } from '../common/AddonMessage';
import { Port } from '../common/port';
import { LoginMenus } from './LoginMenus';

export default {
  props: ['entry','index'],
  data() {
    return {};
  },
  created(this: any){
    this.loginMenus = new LoginMenus(Port.raw);
  },
  watch: {
      // Eventually we'll rewrite LoginMenus.ts into Vue and then this watch and associated hacks can go away
      'entry.fullDetails': function () {
            const t = (this as any);
            if (!t.entry.fullDetails) return;
            const actions = t.loginMenus.createContextActions(t.entry.fullDetails);
            t.$el.appendChild(actions);
            t.loginMenus.hideContextMenuButton(t.$el);
      }
  },

  computed: {
    usernameDisplayValue: function () {
      const e = (this as any).entry;
      return e && e.usernameValue ? e.usernameValue : "[" + $STR("noUsername_partial_tip") + "]";
    },
    inlineStyle: function () {
      const e = (this as any).entry;
      return "background-image:url(data:image/png;base64," + e.iconImageData + ")";
    },
    tabindex: function () {
      return (this as any).index === 0 ? "0" : "-1";
    }
    
  },

  methods: {
    ...mapActions(actionNames),

    //TODO: generalise for more than just search result items
    searchResultKeyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: 0, ctrlKey: event.ctrlKey }}));
                break;
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLLIElement).focus();
                }
                break;
            case 38: // up
                event.preventDefault();
                event.stopPropagation();
                if (target.previousElementSibling) {
                    (target.previousElementSibling as HTMLLIElement).focus();
                } else {
                    (document.getElementById("searchBox") as HTMLInputElement).focus();
                }
                break;
            case 27: // esc
                event.preventDefault();
                event.stopPropagation();
                (document.getElementById("searchBox") as HTMLInputElement).focus();
                break;
            case 93: // context
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new Event("contextmenu"));
                break;
        }
    },
    clickHandler: function (event) {
        event.stopPropagation();
        const target = event.target as HTMLLIElement;

        if (event.button == 0)
        {
            target.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
        }
    },
    onMouseDown: function (event) {
        if (event.button == 1 && event.target == event.currentTarget)
        {
            event.stopPropagation();
            event.preventDefault();
            const target = event.target as HTMLLIElement;
            target.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
            return false;
        }
    },
    keeCommand: function (event: CustomEvent) {
      let newTab = false;
      if (event.detail.button === 0) {
          if (event.detail.ctrlKey === false) {
              newTab = false;
          } else {
              newTab = true;
          }
      } else {
          if (event.detail.ctrlKey === false) {
              newTab = true;
          } else {
              newTab = false;
          }
      }
      const e = (this as any).entry;
      if (newTab) {
          browser.tabs.create({url: e.url});
      } else {
          browser.tabs.update({url: e.url});
      }
    },
    onMouseEnter: function (e) { return (this as any).loginMenus.onMouseEnterLogin(e); },
    onMouseLeave: function (e) { return (this as any).loginMenus.onMouseLeaveLogin(e); },
    onContextMenu: function (e) {
        event.stopPropagation();
        event.preventDefault();
        const t = (this as any);
        t.loginMenus.showContextActions(t.entry.uniqueID, t.entry.dbFileName);
    }
  },
  mixins: [Port.mixin]
};

</script>
