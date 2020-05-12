<template>
  <div
    id="searchPanel"
    class="pb-6 pt-0 pr-0"
  >
    <v-divider v-show="filteredMatches && filteredMatches.length > 0" />

    <Entry
      v-for="(match, index) of filteredMatches"
      :key="match.entry.uniqueID"
      ref="listAarray"
      :entrySummary="match.entry"
      :isFirstInAList="index === 0"
      :frame-id="frame-id"
      :login-index="match.originalIndex"
      @move-next-in-list="nextInList(index, 'listAarray', filteredMatches.length)"
      @move-prev-in-list="prevInList(index, 'listAarray', filteredMatches.length)"
      @move-out-of-list="exitList"
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
      ref="listBarray"
      :entrySummary="entry"
      :isFirstInAList="index === 0"
      :data-index="index"
      @move-next-in-list="nextInList(index, 'listBarray', deduplicatedSearchResults.length)"
      @move-prev-in-list="prevInList(index, 'listBarray', deduplicatedSearchResults.length)"
      @move-out-of-list="exitList"
    />
  </div>
</template>

<script lang="ts">
import { Component } from "vue";
import { mapActions, mapGetters } from "vuex";
import { names as actionNames } from "../../store/action-names";
import { configManager } from "../../common/ConfigManager";
import { AddonMessage } from "../../common/AddonMessage";
import Entry from "./Entry.vue";
import { mTypes } from "../../store";
import { KeeLog } from "../../common/Logger";
import { EntrySummary } from "../../common/model/EntrySummary";
import { SearcherMatchedOnly } from "../../common/SearcherMatchedOnly";

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
        this.searchOnlyMatches = new SearcherMatchedOnly(this.matchedLogins);
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
        onSearchOnlyMatchesComplete (this: any, logins: EntrySummary[]) {
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
        },
        nextInList (this: any, currentIndex: number, listName: string, listLength: any) {
            const currentVueNode = this.$refs[listName].find(e => parseInt(e.$el.dataset.index) === currentIndex);
            if (currentIndex < listLength - 1) {
                currentVueNode.$el.nextElementSibling.focus();
            } else if (listName === "listAarray" && this.deduplicatedSearchResults.length > 0) {
                const firstBListVueNode = this.$refs["listBarray"].find(e => parseInt(e.$el.dataset.index) === 0);
                firstBListVueNode.$el.focus();
            }
        },
        prevInList (this: any, currentIndex: number, listName: string, listLength: any) {
            const currentVueNode = this.$refs[listName].find(e => parseInt(e.$el.dataset.index) === currentIndex);
            if (currentIndex > 0) {
                currentVueNode.$el.previousElementSibling.focus();
            } else if (listName === "listBarray" && this.filteredMatches.length > 0) {
                const lastAListVueNode = this.$refs["listAarray"].find(e => parseInt(e.$el.dataset.index) === this.filteredMatches.length - 1);
                lastAListVueNode.$el.focus();
            } else {
                (document.getElementById("searchBox") as HTMLInputElement).focus();
            }
        },
        exitList (this: any) {
            (document.getElementById("searchBox") as HTMLInputElement).focus();
        }
    }
};
</script>

<style>
</style>
