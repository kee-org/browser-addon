<template>
  <div id="searchPanel">
    <div><input type="text" :placeholder="$i18n('Search_label')" id="searchBox" name="cc5704978dc0411591addc66d25c325b" class="form-control" :value="currentSearchTerm" :title="$i18n('Search_tip')" @input="onSearchInput" @keydown="searchBoxKeyboardNavHandler" autofocus/></div>
    <div id="searchResults">
      <ul v-show="searchResults && searchResults.length > 0" id="searchResults-Container">
        <LoginEntry v-for="(entry, index) of searchResults" :key="entry.uniqueID" :entry="entry" :index="index"></LoginEntry>
      </ul>
    </div>
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
import { Port } from '../common/port';
import { Search, SearchResult } from '../common/search';
import LoginEntry from "./LoginEntry.vue";
import { mTypes } from '../store';

export default {
  created(this: any){
    this.onDBChanged = () => {
      this.search = new Search({
      KeePassDatabases: this.$store.getters.KeePassDatabases,
      ActiveKeePassDatabaseIndex: this.$store.getters.ActiveKeePassDatabaseIndex, } as any, {
        version: 1,
        searchAllDatabases: configManager.current.searchAllOpenDBs,
        maximumResults: 50
      });
    };
    this.onDBChanged();
  },
  data() {
    return {};
  },
  components: {LoginEntry},

  mounted(this: any) {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === mTypes.updateKeePassDatabases) {
        this.onDBChanged();
      }
    });
  },
  computed: {
    ...mapGetters(['currentSearchTerm', 'searchResults'])
  },

  methods: {
    ...mapActions(actionNames),
    onSearchComplete (logins: SearchResult[])
    {
      console.log("onSearchComplete");
        logins = logins.sort(function (a, b) {
            if (a.relevanceScore > b.relevanceScore)
                return -1;
            if (a.relevanceScore < b.relevanceScore)
                return 1;
            return 0;
        }).map(l => Object.assign(l, {fullDetails:null}));
        (this as any).$store.dispatch("updateSearchResults", logins);
    },
    onSearchInput (evt) {
      const pm = (this as any).postMessage;
      pm({currentSearchTerm: evt.target.value} as AddonMessage);
      (this as any).$store.dispatch('updateCurrentSearchTerm', evt.target.value);
      (this as any).search.execute(evt.target.value,
          (this as any).onSearchComplete.bind(this), []
      );
    },
    searchBoxKeyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
            {
                event.preventDefault();
                event.stopPropagation();
                const searchResults = document.getElementById("searchResults-Container");
                if (searchResults && searchResults.firstElementChild) {
                    (searchResults.firstElementChild as HTMLLIElement).focus();
                }
                break;
            }
            case 40: // down
            {
                event.preventDefault();
                event.stopPropagation();
                const searchResults = document.getElementById("searchResults-Container");
                if (searchResults && searchResults.firstElementChild) {
                    (searchResults.firstElementChild as HTMLLIElement).focus();
                }
                break;
            }
            case 27: // esc
            {
                // This does not work in Firefox due to https://bugzilla.mozilla.org/show_bug.cgi?id=1373175
                event.preventDefault();
                event.stopPropagation();
                const searchBox = (document.getElementById("searchBox") as HTMLInputElement);
                if (searchBox.value) {
                    searchBox.value = "";
                    searchBox.dispatchEvent(new Event("input"));
                } else {
                    window.close();
                }
                break;
            }
        }
    },
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
