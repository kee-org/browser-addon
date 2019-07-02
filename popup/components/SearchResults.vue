<template>
  <div id="searchPanel" class="pb-4 pt-0 pr-0">

    <v-divider v-show="filteredMatches && filteredMatches.length > 0"></v-divider>

    <Entry
      v-for="(match, index) of filteredMatches"
      :key="match.entry.uniqueID"
      :entry="match.entry"
      :index="index"
      :frameId="frameId"
      :loginIndex="match.originalIndex"
    ></Entry>

    <v-divider v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0" class="mt-2"></v-divider>
      <v-subheader
        v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0"
        class="text-xs-center"
        style="justify-content: center;"
      >{{ $i18n('matches_from_other_sites') }}</v-subheader>

    <Entry
      v-for="(entry, index) of deduplicatedSearchResults"
      :key="entry.uniqueID"
      :entry="entry"
      :index="index"
    ></Entry>
    
  </div>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapActions, mapGetters } from "vuex";
import { names as actionNames } from "../../store/action-names";
import { configManager } from "../../common/ConfigManager";
import { AddonMessage } from "../../common/AddonMessage";
import { Search, SearchResult, SearchOnlyMatches } from "../../common/search";
import Entry from "./Entry.vue";
import { mTypes } from "../../store";

export default {
  props: ['matchedLogins', 'frameId'],
  created(this: any) {
    if (this.matchedLogins) {
      for (let i=0; i < this.matchedLogins.length; i++) {
        this.uidMap.set(this.matchedLogins[i].uniqueID, i);
      }
    }
    this.searchOnlyMatches = new SearchOnlyMatches(this.matchedLogins);
    this.searchOnlyMatches.execute(this.currentSearchTerm, (this as any).onSearchOnlyMatchesComplete.bind(this));
  },
  data() {
    return {
      filteredMatches: null,
      uidMap: new Map<string, number>()
    };
  },
  components: { Entry },

  mounted(this: any) {
    this.$store.subscribe((mutation, state) => {
      // if (mutation.type === mTypes.updateKeePassDatabases) {
      //   this.onDBChanged();
      // }
      if (mutation.type === mTypes.updateCurrentSearchTerm) {
        this.searchOnlyMatches.execute(this.currentSearchTerm, (this as any).onSearchOnlyMatchesComplete.bind(this));
      }
    });
  },
  computed: {
    ...mapGetters(["currentSearchTerm", "searchResults"]),
    deduplicatedSearchResults: function (this: any) {
      if (this.searchResults) {
        if (this.matchedLogins) {
          return this.searchResults.filter(
            e => !this.matchedLogins.some(m => m.uniqueID === e.uniqueID));
        } else {
          return this.searchResults;
        }
      }
      return null;
    }
  },

  methods: {
    ...mapActions(actionNames),
    onSearchOnlyMatchesComplete(this: any, logins: SearchResult[]) {
      console.log("onSearchOnlyMatchesComplete");
      logins = logins
        .sort(function(a, b) {
          if (a.relevanceScore > b.relevanceScore) return -1;
          if (a.relevanceScore < b.relevanceScore) return 1;
          return 0;
        });
      this.filteredMatches = logins.map(m => ({
        entry: m,
        originalIndex: this.uidMap.get(m.uniqueID)
      }));
    },
  }
};
</script>

<style>
</style>
