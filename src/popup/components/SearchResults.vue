<template>
    <div id="searchPanel" class="pb-6 pt-0 pr-0">
        <v-divider v-show="filteredMatches && filteredMatches.length > 0" class="mt-2" />
        <Entry
v-for="(match, index) of filteredMatches" :key="match.entry.uuid" :ref="setNodesA"
            :entrySummary="match.entry" :isFirstInAList="index === 0" :frame-id="frameId"
            :entry-index="match.originalIndex" :dataIndex="index" @move-next-in-list="
                nextInList(index, 'listAarray', filteredMatches.length)
            " @move-prev-in-list="
    prevInList(index, 'listAarray')
" @move-out-of-list="exitList"
@pref-entry-toggle="onPreferredEntryClick"  />

        <v-divider v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0" class="mt-2" />
        <v-list-subheader
v-show="deduplicatedSearchResults && deduplicatedSearchResults.length > 0" class="text-center"
            style="justify-content: center">
            {{ $i18n("matches_from_other_sites") }}
        </v-list-subheader>

        <Entry
v-for="(entry, index) of deduplicatedSearchResults" :key="entry.uuid" :ref="setNodesB"
            :entrySummary="entry" :isFirstInAList="index === 0" :dataIndex="index"
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
    props: ["matchedEntriesIn", "frameId"],
    emits: ["pref-entry-toggle"],
    data() {
        return {
            filteredMatches: null,
            uidMap: new Map<string, number>(),
            aNodes: [],
            bNodes: [],
            searchOnlyMatches: null as SearcherMatchedOnly,
            matchedEntries: this.$props.matchedEntriesIn
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
            KeeLog.debug("about to reinit");
            this.initAndSearchMatchedEntries(newVal);
        },
        currentSearchTerm: function (newVal) {
            KeeLog.debug("about to reexecute");
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
        KeeLog.debug("created. about to init");
        this.initAndSearchMatchedEntries(this.matchedEntries);
    },
    methods: {
        setNodesA(node) {
            if (node) this.aNodes.push(node);
        },
        setNodesB(node) {
            if (node) this.bNodes.push(node);
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
                e => {
            return parseInt(e.dataIndex) === currentIndex;
                }
            );
            if (currentIndex < listLength - 1) {
                // Current treeview implementation seems to have some text node get
                // focus even after we ask the div to get focus. So we have to skip forward 2 and back 1
                currentVueNode.$el.nextElementSibling.nextElementSibling.focus();
            } else if (listName === "listAarray" && this.deduplicatedSearchResults.length > 0) {
                const firstBListVueNode = this.bNodes.find(
                    e => parseInt(e.dataIndex) === 0
                );
                firstBListVueNode.$el.nextElementSibling.focus();
            }
        },
        prevInList(currentIndex: number, listName: string) {
            const currentVueNode = (listName === "listAarray" ? this.aNodes : this.bNodes).find(
                e => parseInt(e.dataIndex) === currentIndex
            );
            if (currentIndex > 0) {
                currentVueNode.$el.previousElementSibling.focus();
            } else if (listName === "listBarray" && this.filteredMatches.length > 0) {
                const lastAListVueNode = this.aNodes.find(
                    e => parseInt(e.dataIndex) === this.filteredMatches.length - 1
                );
                lastAListVueNode.$el.nextElementSibling.focus();
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
            KeeLog.debug("about to execute");
            this.searchOnlyMatches.execute(
                this.currentSearchTerm,
                this.onSearchOnlyMatchesComplete.bind(this)
            );
        },
        onPreferredEntryClick(payload: any) {
            //TODO: find out if we really have to do this boilerplate re-emitting in v3
            this.$emit("pref-entry-toggle", payload);
        }
    }
};
</script>
