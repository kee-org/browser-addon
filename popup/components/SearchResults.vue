<template>
  <div
    id="searchPanel"
    class="pb-6 pt-0 pr-0"
  >
    <v-divider v-show="filteredMatches && filteredMatches.length > 0" />

    <Entry
      v-for="(match, index) of filteredMatches"
      :key="match.entry.uniqueID"
      :entry="match.entry"
      :index="index"
      :frame-id="frame-id"
      :login-index="match.originalIndex"
    />

    <v-divider
      v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0"
      class="mt-2"
    />
    <v-subheader
      v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0"
      class="text-center"
      style="justify-content: center;"
    >
      {{ $i18n('matches_from_other_sites') }}
    </v-subheader>

    <Entry
      v-for="(entry, index) of deduplicatedSearchResults"
      :key="entry.uniqueID"
      :entry="entry"
      :index="index"
    />
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
import { KeeLog } from "../../common/Logger";

export default {
    components: { Entry },
    props: ["matchedLogins", "frameId"],
    data () {
        return {
            filteredMatches: null,
            uidMap: new Map<string, number>()
        };
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
    created (this: any) {
        if (this.matchedLogins) {
            for (let i=0; i < this.matchedLogins.length; i++) {
                this.uidMap.set(this.matchedLogins[i].uniqueID, i);
            }
        }
        this.searchOnlyMatches = new SearchOnlyMatches(this.matchedLogins);
        this.searchOnlyMatches.execute(this.currentSearchTerm, (this as any).onSearchOnlyMatchesComplete.bind(this));
    },
    mounted (this: any) {
        this.$store.subscribe((mutation, state) => {
            // if (mutation.type === mTypes.updateKeePassDatabases) {
            //   this.onDBChanged();
            // }
            if (mutation.type === mTypes.updateCurrentSearchTerm) {
                this.searchOnlyMatches.execute(this.currentSearchTerm, (this as any).onSearchOnlyMatchesComplete.bind(this));
            }
        });
    },
    methods: {
        ...mapActions(actionNames),
        onSearchOnlyMatchesComplete (this: any, logins: SearchResult[]) {
            KeeLog.debug("onSearchOnlyMatchesComplete");
            logins = logins
                .sort(function (a, b) {
                    if (a.relevanceScore > b.relevanceScore) return -1;
                    if (a.relevanceScore < b.relevanceScore) return 1;
                    return 0;
                });
            this.filteredMatches = logins.map(m => ({
                entry: m,
                originalIndex: this.uidMap.get(m.uniqueID)
            }));
        }
    }
};
</script>

<style>
</style>
