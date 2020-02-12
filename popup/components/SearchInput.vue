<template>
  <v-text-field
    id="searchBox"
    solo
    :placeholder="$i18n('Search_label')"
    hide-details
    class="search my-0"
    style=""
    name="cc5704978dc0411591addc66d25c325b"
    :value="currentSearchTerm"
    :title="$i18n('Search_tip')"
    autofocus
    @input="onSearchInput"
    @keyup.arrow-down.stop.prevent="focusFirstResult"
    @keyup.enter.stop.prevent="focusFirstResult"
    @keyup.escape.stop.prevent="handleEscape"
  />
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import { names as actionNames } from "../../store/action-names";
import { configManager } from "../../common/ConfigManager";
import { AddonMessage } from "../../common/AddonMessage";
import { Port } from "../../common/port";
import { Search, SearchResult } from "../../common/search";
import { mTypes } from "../../store";
import { KeeLog } from "../../common/Logger";

export default {
    mixins: [Port.mixin],
    data () {
        return {};
    },
    computed: {
        ...mapGetters(["currentSearchTerm"])
    },
    created (this: any) {
        this.onDBChanged = () => {
            this.search = new Search(
                {
                    KeePassDatabases: this.$store.getters.KeePassDatabases,
                    ActiveKeePassDatabaseIndex: this.$store.getters
                        .ActiveKeePassDatabaseIndex
                } as any,
                {
                    version: 1,
                    searchAllDatabases: configManager.current.searchAllOpenDBs,
                    maximumResults: 50
                }
            );
        };
        this.onDBChanged();
    },
    mounted (this: any) {
        this.$store.subscribe((mutation, state) => {
            if (mutation.type === mTypes.updateKeePassDatabases) {
                this.onDBChanged();
            }
        });
    },
    methods: {
        ...mapActions(actionNames),
        onSearchComplete (logins: SearchResult[]) {
            KeeLog.debug("onSearchComplete");
            logins = logins
                .sort(function (a, b) {
                    if (a.relevanceScore > b.relevanceScore) return -1;
                    if (a.relevanceScore < b.relevanceScore) return 1;
                    return 0;
                })
                .map(l => Object.assign(l, { fullDetails: null }));
            (this as any).$store.dispatch("updateSearchResults", logins);
        },
        onSearchInput (value) {
            // Think this is OK but if it is actually async then user may have subsequent
            // characters deleted when the change is actually applied
            (this as any).$store.dispatch(
                "updateCurrentSearchTerm",
                value
            );
            (this as any).search.execute(
                value,
                (this as any).onSearchComplete.bind(this),
                []
            );
        },
        focusFirstResult () {
            const filteredMatches = document.getElementById("filteredMatches-Container");
            if (filteredMatches && filteredMatches.firstElementChild) {
                (filteredMatches.firstElementChild as HTMLLIElement).focus();
                return;
            }
            const searchResults = document.getElementById("searchResults-Container");
            if (searchResults && searchResults.firstElementChild) {
                (searchResults.firstElementChild as HTMLLIElement).focus();
            }
        },
        handleEscape () {
            // This does not work in Firefox due to https://bugzilla.mozilla.org/show_bug.cgi?id=1373175
            const searchBox = document.getElementById(
                "searchBox"
            ) as HTMLInputElement;
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
.search.v-text-field.v-text-field--solo .v-input__control {
  min-height: 36px !important;
}
</style>
