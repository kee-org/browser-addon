<template>
    <v-text-field
id="searchBox" single-line density="compact" variant="solo" :placeholder="$i18n('Search_label')" hide-details class="search my-0 py-0 mx-2"
        style="" name="cc5704978dc0411591addc66d25c325b" :model-value="currentSearchTerm" autofocus
        @update:model-value="onSearchInput" @keyup.arrow-down.stop.prevent="focusFirstResult"
        @keyup.enter.stop.prevent="focusFirstResult" @keyup.escape.stop.prevent="handleEscape" />
</template>

<script lang="ts">
import { configManager } from "../../common/ConfigManager";
import { Port } from "../../common/port";
import { SearcherAll } from "../../common/SearcherAll";
import useStore from "../../store";
import { KeeLog } from "../../common/Logger";
import { EntrySummary } from "../../common/model/EntrySummary";
import { mapState } from "pinia";
import { Database } from "../../common/model/Database";

export default {
    setup() {
        const { updateSearchResults, updateCurrentSearchTerm } = useStore();
        return { updateSearchResults, updateCurrentSearchTerm };
    },
    data() {
        return {
            search: null as SearcherAll
        };
    },
    computed: {
        ...mapState(useStore, ["currentSearchTerm", "KeePassDatabases", "ActiveKeePassDatabaseIndex"])
    },
    watch: {
        KeePassDatabases: function (newState: Database[], oldState: Database[]) {
            this.onDBChanged();
        }
    },
    created() {
        this.onDBChanged();
    },
    // mounted() {
    //     //TODO: Find a way to trigger the onDBChanged function using pinia even though it no longer supplies a subscription to mutations feature.
    //     // Probably by using onAction instead of looking for mutations
    //     this.$store.$subscribe((mutation: Mutation) => {
    //         if (mutation.type === mTypes.updateKeePassDatabases) {
    //             this.onDBChanged();
    //         }
    //     });
    // },
    methods: {
        onDBChanged() {
            this.search = new SearcherAll(
                {
                    KeePassDatabases: this.KeePassDatabases,
                    ActiveKeePassDatabaseIndex: this.ActiveKeePassDatabaseIndex
                } as any,
                {
                    version: 1,
                    searchAllDatabases: configManager.current.searchAllOpenDBs,
                    maximumResults: 50
                }
            );
        },
        onSearchComplete(entrySummaries: EntrySummary[]) {
            KeeLog.debug("onSearchComplete");
            entrySummaries = entrySummaries
                .sort(function (a, b) {
                    if (a.relevanceScore > b.relevanceScore) return -1;
                    if (a.relevanceScore < b.relevanceScore) return 1;
                    return 0;
                })
                .map(l => Object.assign(l, { fullDetails: null }));
            this.updateSearchResults(entrySummaries);
        },
        onSearchInput(value) {
            // Think this is OK but if it is actually async then user may have subsequent
            // characters deleted when the change is actually applied
            this.updateCurrentSearchTerm(value);
            this.search.execute(value, this.onSearchComplete.bind(this), []);
        },
        focusFirstResult() {
            const firstCard = document.querySelector("#searchPanel > .v-card");
            if (firstCard) {
                (firstCard as HTMLLIElement).focus();
            }
        },
        handleEscape() {
            // This does not work in Firefox due to https://bugzilla.mozilla.org/show_bug.cgi?id=1373175
            const searchBox = document.getElementById("searchBox") as HTMLInputElement;
            if (searchBox.value) {
                searchBox.value = "";
                searchBox.dispatchEvent(new Event("input"));
            } else {
                window.close();
            }
        }
    }
};
</script>

<style>
/* .search.v-text-field.v-text-field--solo .v-input__control {
    min-height: 36px !important;
} */
</style>
