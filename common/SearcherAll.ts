import { KeeLog } from "./Logger";
import { KeeState } from "../store/KeeState";
import { SearchConfig } from "./model/SearchConfig";
import { EntrySummary } from "./model/EntrySummary";
import { resolveConfig, tokenise, calculateMatchScore } from "./SearchUtils";
import { Group } from "./model/Group";
import { KeeURL } from "./KeeURL";

export class SearcherAll {
    constructor(private state: KeeState, config: Partial<SearchConfig>) {
        this.searchConfig = resolveConfig(config);
        this.validateConfig();
    }
    private configIsValid: boolean;
    private makeAsyncTimer;
    private searchConfig: SearchConfig;

    private reconfigure(config) {
        this.searchConfig = resolveConfig(config);
        return this.validateConfig();
    }

    public execute(query, onComplete, filterDomains: string[]) {
        let abort = false;
        const filteringByDomain =
            filterDomains &&
            filterDomains.length > 0 &&
            Array.isArray(filterDomains) &&
            filterDomains[0].length > 0
                ? true
                : false;

        if (!this.configIsValid) {
            KeeLog.error(
                "You can't execute a search while the search configuration is invalid. Please fix it by calling reconfigure()."
            );
            abort = true;
        }

        if ((!query || query.length == 0) && !filteringByDomain) abort = true;

        if (this.state.KeePassDatabases.length == 0) abort = true;

        onComplete = onComplete || this.searchConfig.onComplete;

        if (abort) {
            if (onComplete) {
                onComplete([]);
                return;
            } else {
                return [];
            }
        }

        const results = [];
        function addResult(this: any, result) {
            if (this.searchConfig.onMatch) {
                result = this.searchConfig.onMatch(result);
                if (result) results.push(result);
                else return false;
            } else results.push(result);
            return true;
        }

        // allow pre-tokenised search terms to be supplied
        let keywords = [];
        if (Array.isArray(query)) keywords = query;
        else if (query.length > 0) keywords = tokenise(query);

        let filter;

        if (filteringByDomain) {
            filter = item => {
                if (!item.uRLs || item.uRLs.length <= 0) return false;

                for (const filterDomain of filterDomains) {
                    const filteredUrls = item.uRLs.filter(itemURL => {
                        try {
                            if (itemURL.indexOf(filterDomain) < 0) return false;
                            const url = KeeURL.fromString(itemURL);
                            return url.domainOrIPAddress === filterDomain;
                        } catch (e) {
                            return false;
                        } // ignore invalid URLs
                    });
                    if (filteredUrls.length > 0) return true;
                }
                return false;
            };
        }

        function actualSearch(this: SearcherAll) {
            let databases;
            if (this.searchConfig.searchAllDatabases) databases = this.state.KeePassDatabases;
            else databases = [this.state.KeePassDatabases[this.state.ActiveKeePassDatabaseIndex]];

            for (let i = 0; i < databases.length; i++) {
                const root = databases[i].root;
                const dbFileName = databases[i].fileName;
                this.treeTraversal(root, keywords, 0, addResult.bind(this), 0, dbFileName, filter);
            }
            if (onComplete) onComplete(results);
        }

        if (onComplete) {
            // Create a timer to make the search run async
            this.makeAsyncTimer = setTimeout(actualSearch.bind(this), 1);
            return;
        } else {
            actualSearch.call(this);
            return results;
        }
    }

    private validateConfig() {
        this.configIsValid = true;

        if (this.searchConfig.version != 1) {
            KeeLog.warn("Unknown config version");
            this.configIsValid = false;
        }

        if (
            this.searchConfig.searchAllDatabases !== true &&
            this.searchConfig.searchAllDatabases !== false
        ) {
            KeeLog.warn("searchAllDatabases should be a boolean");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchTitles !== true && this.searchConfig.searchTitles !== false) {
            KeeLog.warn("searchTitles should be a boolean");
            this.configIsValid = false;
        }

        if (
            this.searchConfig.searchUsernames !== true &&
            this.searchConfig.searchUsernames !== false
        ) {
            KeeLog.warn("searchUsernames should be a boolean");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchGroups !== true && this.searchConfig.searchGroups !== false) {
            KeeLog.warn("searchGroups should be a boolean");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchURLs !== true && this.searchConfig.searchURLs !== false) {
            KeeLog.warn("searchURLs should be a boolean");
            this.configIsValid = false;
        }

        if (isNaN(this.searchConfig.weightTitles) || this.searchConfig.weightTitles <= 0) {
            KeeLog.warn("weightTitles should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this.searchConfig.weightUsernames) || this.searchConfig.weightUsernames <= 0) {
            KeeLog.warn("weightUsernames should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this.searchConfig.weightGroups) || this.searchConfig.weightGroups <= 0) {
            KeeLog.warn("weightGroups should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this.searchConfig.weightURLs) || this.searchConfig.weightURLs <= 0) {
            KeeLog.warn("weightURLs should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this.searchConfig.maximumResults) || this.searchConfig.maximumResults <= 0) {
            KeeLog.warn("maximumResults should be a positive number");
            this.configIsValid = false;
        }

        if (
            this.searchConfig.onComplete != null &&
            typeof this.searchConfig.onComplete !== "function"
        ) {
            KeeLog.warn("onComplete should be a function (or ommitted)");
            this.configIsValid = false;
        }

        if (this.searchConfig.onMatch != null && typeof this.searchConfig.onMatch !== "function") {
            KeeLog.warn("onMatch should be a function (or ommitted)");
            this.configIsValid = false;
        }

        return this.configIsValid;
    }

    private treeTraversal(
        branch: Group,
        keywords: string[],
        parentGroupMatchScore: number,
        addResult: (item: EntrySummary) => boolean,
        currentResultCount,
        dbFileName,
        filter
    ) {
        let totalResultCount = currentResultCount;
        for (const leaf of branch.entrySummaries) {
            const item = leaf;

            // We might already know this is a match if the item is contained within
            // a matching group but we check again because we probably want to update
            // the relevance score for the item
            const matchResult = calculateMatchScore(
                item,
                keywords,
                parentGroupMatchScore,
                this.searchConfig,
                filter
            );
            if (matchResult > 0.0) {
                const accepted = addResult({
                    ...item,
                    ...{ relevanceScore: matchResult }
                });
                if (accepted) {
                    totalResultCount++;
                    if (totalResultCount >= this.searchConfig.maximumResults)
                        return totalResultCount;
                }
            }
        }
        for (const subBranch of branch.groups) {
            const groupMatchScore = calculateMatchScore(
                { title: subBranch.title },
                keywords,
                parentGroupMatchScore,
                this.searchConfig,
                filter
            );
            totalResultCount = this.treeTraversal(
                subBranch,
                keywords,
                groupMatchScore,
                addResult,
                totalResultCount,
                dbFileName,
                filter
            );
            if (totalResultCount >= this.searchConfig.maximumResults) return totalResultCount;
        }
        return totalResultCount;
    }
}
