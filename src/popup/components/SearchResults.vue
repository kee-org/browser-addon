<template>
    <div id="searchPanel" class="pb-6 pt-0 pr-0">
        <v-divider v-show="filteredMatches && filteredMatches.length > 0" />

        <!-- prettier-ignore -->
        <Entry
v-for="(match, index) of filteredMatches" :key="match.entry.uuid" :ref="setNodesA"
            :entrySummary="match.entry" :isFirstInAList="index === 0" :frame-id="frameId"
            :entry-index="match.originalIndex" :data-index="index" @move-next-in-list="
                nextInList(index, 'listAarray', filteredMatches.length)
            " @move-prev-in-list="
    prevInList(index, 'listAarray')
" @move-out-of-list="exitList" />

        <v-divider v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0" class="mt-2" />
        <v-subheader
v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0" class="text-center"
            style="justify-content: center">
            {{ $i18n("matches_from_other_sites") }}
        </v-subheader>

        <Entry
v-for="(entry, index) of deduplicatedSearchResults" :key="entry.uuid" :ref="setNodesB"
            :entrySummary="entry" :isFirstInAList="index === 0" :data-index="index"
            @move-next-in-list="nextInList(index, 'listBarray', deduplicatedSearchResults.length)"
            @move-prev-in-list="prevInList(index, 'listBarray')" @move-out-of-list="exitList" />
    </div>
</template>

<script lang="ts">
import Entry from "./Entry.vue";
import { KeeLog } from "../../common/Logger";
import { EntrySummary } from "../../common/model/EntrySummary";
import { Entry as ModelEntry } from "../../common/model/Entry";
import { SearcherMatchedOnly } from "../../common/SearcherMatchedOnly";
import { mapState } from "pinia";
import useStore from "../../store";

export default {
    components: { Entry },
    props: ["matchedEntries", "frameId"],
    data() {
        return {
            filteredMatches: null,
            uidMap: new Map<string, number>(),
            aNodes: [],
            bNodes: [],
            searchOnlyMatches: null as SearcherMatchedOnly
        };
    },
    computed: {
        ...mapState(useStore, ["currentSearchTerm", "searchResults"]),
        deduplicatedSearchResults: function () {
            if (this.searchResults) {
                if (this.matchedEntries) {
                    return this.searchResults.filter(
                        e => !this.matchedEntries.some(m => m.uuid === e.uuid)
                    );
                } else {
                    return this.searchResults;
                }
            }
            return null;
        }
    },
    watch: {
        matchedEntries: function (newVal) {
            this.initAndSearchMatchedEntries(newVal);
        },
        currentSearchTerm: function (newVal) {
            this.searchOnlyMatches.execute(
                newVal,
                this.onSearchOnlyMatchesComplete.bind(this)
            );
        }
    },
    beforeUpdate() {
        this.aNodes = [];
        this.bNodes = [];
    },
    created() {
        this.initAndSearchMatchedEntries(this.matchedEntries);
    },
    //TODO: test if search term stuff works OK despite change to watches rather than vuex mutation subscribers
    // Especially whether results are cleared if database locks due to time out while popup is open
    // mounted() {
    //     this.subscribe(mutation => {
    //         if (mutation.type === mTypes.updateCurrentSearchTerm) {
    //             this.searchOnlyMatches.execute(
    //                 this.currentSearchTerm,
    //                 this.onSearchOnlyMatchesComplete.bind(this)
    //             );
    //         }
    //     });
    // },
    methods: {
        setNodesA(node) {
            this.aNodes.push(node);
        },
        setNodesB(node) {
            this.bNodes.push(node);
        },
        onSearchOnlyMatchesComplete(entrySummaries: EntrySummary[]) {
            KeeLog.debug("onSearchOnlyMatchesComplete");
            entrySummaries = entrySummaries.sort(function (a, b) {
                if (a.relevanceScore > b.relevanceScore) return -1;
                if (a.relevanceScore < b.relevanceScore) return 1;
                return 0;
            });
            this.filteredMatches = entrySummaries.map(m => ({
                entry: m,
                originalIndex: this.uidMap.get(m.uuid)
            }));
        },
        nextInList(currentIndex: number, listName: string, listLength: any) {
            const currentVueNode = (listName === "listAarray" ? this.aNodes : this.bNodes).find(
                e => parseInt(e.$el.dataset.index) === currentIndex
            );
            if (currentIndex < listLength - 1) {
                currentVueNode.$el.nextElementSibling.focus();
            } else if (listName === "listAarray" && this.deduplicatedSearchResults.length > 0) {
                const firstBListVueNode = this.bNodes.find(
                    e => parseInt(e.$el.dataset.index) === 0
                );
                firstBListVueNode.$el.focus();
            }
        },
        prevInList(currentIndex: number, listName: string) {
            const currentVueNode = (listName === "listAarray" ? this.aNodes : this.bNodes).find(
                e => parseInt(e.$el.dataset.index) === currentIndex
            );
            if (currentIndex > 0) {
                currentVueNode.$el.previousElementSibling.focus();
            } else if (listName === "listBarray" && this.filteredMatches.length > 0) {
                const lastAListVueNode = this.aNodes.find(
                    e => parseInt(e.$el.dataset.index) === this.filteredMatches.length - 1
                );
                lastAListVueNode.$el.focus();
            } else {
                (document.getElementById("searchBox") as HTMLInputElement).focus();
            }
        },
        exitList() {
            (document.getElementById("searchBox") as HTMLInputElement).focus();
        },
        initAndSearchMatchedEntries(matchedEntries: ModelEntry[]) {
            if (matchedEntries) {
                for (let i = 0; i < matchedEntries.length; i++) {
                    this.uidMap.set(matchedEntries[i].uuid, matchedEntries[i].entryIndex);
                }
            }
            this.searchOnlyMatches = new SearcherMatchedOnly(
                matchedEntries?.map(e => EntrySummary.fromEntry(e))
            );
            this.searchOnlyMatches.execute(
                this.currentSearchTerm,
                this.onSearchOnlyMatchesComplete.bind(this)
            );
        }
    }
};
</script>
