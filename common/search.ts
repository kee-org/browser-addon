import { KeeLog } from "./Logger";
import { keeLoginInfo } from "./kfDataModel";
import { KeeState } from "../store/KeeState";
import { utils } from "./utils";

/*
  Includes contributions from https://github.com/haoshu
*/

// Pretend browser (WebExtensions) is chrome (we include a
// polyfill from Mozilla but it doesn't work in some cases)
declare const chrome;

export class SearchResult {
    iconImageData: string;
    usernameValue: string;
    usernameName: string;
    path: string;
    title: string;
    uRLs: string[];
    url: string;
    uniqueID: string;
    dbFileName: string;
    relevanceScore: number;
    fullDetails?: keeLoginInfo;
}

export class SearchConfig {
    // Kee will check the supplied version number and behave consistently
    // for each version, regardless of the current Kee addon version.
    // If you supply a config object, you must at least include this property
    version: number;

    // Whether to search all logged in databases or just the active one
    // (generally will want to respect the Kee option with this name)
    searchAllDatabases: boolean;

    // Disable searching in some parts of the entries if required
    searchTitles: boolean;
    searchUsernames: boolean;
    searchGroups: boolean;
    searchURLs: boolean;

    // Custom weights allow the order of results to be manipulated in a way
    // that best fits the context in which those results will be displayed
    // A relevanceScore will be returned with each result item - it's up to
    // the caller whether they are interested in processing this score data (e.g.
    // ordering results in relevance order)
    weightTitles: number;
    weightUsernames: number;
    weightGroups: number;
    weightURLs: number;

    // Maximum number of results to return, it's up to the caller to decide if
    // they want to accept a result. Return a falsey value from onMatch to indicate that
    // the match was not accepted and it will then not be counted towards this maximum.
    // This applies per database rather than a total across all DBs
    maximumResults: number;

    // Include a callback function if you want to run the search asynchronously, if
    // omitted the search will block and return the full set of results.
    // You can also set a unique callback for each call: Search.execute(query, useThisCallbackInstead);
    onComplete: () => void;

    // A callback function to handle an individual result. Whatever is
    // returned from this optional function will be added to the list of complete results
    onMatch: () => void;
}

function isMatched (item, keywords, isInMatchingGroup, searchConfig: SearchConfig, filter?) {

    if (filter) {
        if (!filter(item))
            return 0;
        if (keywords.length < 1)
            return 1; // Fixed relevance score for all matches
    } else if (keywords.length < 1) {
        return 0;
    }

    if (!item.url) {
        // must be a group.
        // If we know that a parent group has already matched, no point in searching further
        if (isInMatchingGroup)
            return 1;
        for (const keyword of keywords) {
            if (item.title.toLowerCase().indexOf(keyword) >= 0)
                return 1;
        }
        return 0;
    }

    let matchScore = 0.0;

    for (const keyword of keywords) {
        let keywordScore = 0;
        if (searchConfig.searchTitles && item.title && item.title.toLowerCase().indexOf(keyword) >= 0)
            keywordScore += searchConfig.weightTitles;
        if (searchConfig.searchUsernames && item.usernameValue && item.usernameValue.toLowerCase().indexOf(keyword) >= 0)
            keywordScore += searchConfig.weightUsernames;
        if (searchConfig.searchURLs && item.uRLs &&
            item.uRLs.filter(function (i) { return (i.toLowerCase().indexOf(keyword) >= 0); }).length > 0)
            keywordScore += searchConfig.weightURLs;

        // Increment the relevance score proportionally to the number of keywords
        matchScore += keywordScore * (1 / keywords.length);
    }

    if (isInMatchingGroup)
        matchScore += searchConfig.weightGroups;

    return matchScore;
}

function resolveConfig (config: Partial<SearchConfig>) {
    if (!config)
        config = {};
    else {
        if (config.version != 1)
            KeeLog.warn("Unknown search config version. Will use version 1 defaults");
    }

    return {
        version: 1,
        searchAllDatabases: (typeof config.searchAllDatabases !== "undefined" ? config.searchAllDatabases : true),
        searchTitles: (typeof config.searchTitles !== "undefined" ? config.searchTitles : true),
        searchUsernames: (typeof config.searchUsernames !== "undefined" ? config.searchUsernames : true),
        searchGroups: (typeof config.searchGroups !== "undefined" ? config.searchGroups : true),
        searchURLs: (typeof config.searchURLs !== "undefined" ? config.searchURLs : true),
        weightTitles: config.weightTitles || 2,
        weightUsernames: config.weightUsernames || 1,
        weightGroups: config.weightGroups || 0.25,
        weightURLs: config.weightURLs || 0.75,
        maximumResults: (typeof config.maximumResults !== "undefined" ? config.maximumResults : 30),
        onComplete: config.onComplete,
        onMatch: config.onMatch
    };
}

function tokenise (text) {
    const tokens = text.match(/'[^']*'|"[^"]*"|[^\s ]+/g) || [];
    tokens.forEach(function (value, index, array) {
        array[index] = array[index].replace(/(^['"])|(['"]$)/g, "")
            .replace(/[\s ]+/g, " ")
            .toLowerCase();
    });
    return tokens;
}

export class Search {

    constructor (private state: KeeState, config: Partial<SearchConfig>) {
        this.searchConfig = resolveConfig(config);
        this.validateConfig();
    }
    private configIsValid: boolean;
    private makeAsyncTimer;
    private searchConfig: SearchConfig;

    private reconfigure (config) {
        this.searchConfig = resolveConfig(config);
        return this.validateConfig();
    }

    public execute (query, onComplete, filterDomains: string[]) {
        let abort = false;
        const filteringByURL = (filterDomains
            && filterDomains.length > 0
            && Array.isArray(filterDomains)
            && filterDomains[0].length > 0) ? true : false;

        if (!this.configIsValid) {
            KeeLog.error("You can't execute a search while the search configuration is invalid. Please fix it by calling reconfigure().");
            abort = true;
        }

        if ((!query || query.length == 0) && !filteringByURL)
            abort = true;

        if (this.state.KeePassDatabases.length == 0)
            abort = true;

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
        function addResult (this: any, result) {
            if (this.searchConfig.onMatch) {
                result = this.searchConfig.onMatch(result);
                if (result)
                    results.push(result);
                else
                    return false;
            }
            else
                results.push(result);
            return true;
        }

        // allow pre-tokenised search terms to be supplied
        let keywords = [];
        if (Array.isArray(query))
            keywords = query;
        else if (query.length > 0)
            keywords = tokenise(query);

        let filter;

        if (filteringByURL) {
            filter = item => {
                if (!item.uRLs || item.uRLs.length <= 0)
                    return false;

                for (const filterDomain of filterDomains) {
                    try {
                        const filteredItems = item.uRLs.filter(itemURL => {
                            try {
                                let itemHostname: string;
                                // We're only really interested in the domain so can be lax about
                                // protocols and just prepend if necessary in order to make valid URLs
                                if (!itemURL.startsWith("https://") && !itemURL.startsWith("http://") && !itemURL.startsWith("file://"))
                                {
                                    itemHostname = new URL("http://" + itemURL).hostname;
                                } else
                                {
                                    itemHostname = new URL(itemURL).hostname;
                                }
                                const itemIsIPAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(itemHostname);
                                const itemDomain = itemIsIPAddress ? itemHostname : utils.psl.getDomain(itemHostname);
                                return (filterDomain === itemDomain);
                            } catch (e) { return false; } // ignore invalid URLs
                        });
                        if (filteredItems.length > 0) return true;
                    } catch (e) {
                        // ignore invalid URLs
                    }
                }
                return false;
            };
        }

        function actualSearch (this: any) {
            let databases;
            if (this.searchConfig.searchAllDatabases)
                databases = this.state.KeePassDatabases;
            else
                databases = [this.state.KeePassDatabases[this.state.ActiveKeePassDatabaseIndex]];

            for (let i = 0; i < databases.length; i++) {
                const root = databases[i].root;
                const dbFileName = databases[i].fileName;
                this.treeTraversal(root, "", false, keywords, addResult.bind(this), 0, dbFileName, filter);
            }
            onComplete(results);
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

    private validateConfig () {
        this.configIsValid = true;

        if (this.searchConfig.version != 1) {
            KeeLog.warn("Unknown config version");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchAllDatabases !== true && this.searchConfig.searchAllDatabases !== false) {
            KeeLog.warn("searchAllDatabases should be a boolean");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchTitles !== true && this.searchConfig.searchTitles !== false) {
            KeeLog.warn("searchTitles should be a boolean");
            this.configIsValid = false;
        }

        if (this.searchConfig.searchUsernames !== true && this.searchConfig.searchUsernames !== false) {
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

        if (this.searchConfig.onComplete != null && typeof (this.searchConfig.onComplete) !== "function") {
            KeeLog.warn("onComplete should be a function (or ommitted)");
            this.configIsValid = false;
        }

        if (this.searchConfig.onMatch != null && typeof (this.searchConfig.onMatch) !== "function") {
            KeeLog.warn("onMatch should be a function (or ommitted)");
            this.configIsValid = false;
        }

        return this.configIsValid;
    }

    private convertItem (path, node, dbFileName) {
        const item: SearchResult = new SearchResult();
        item.iconImageData = node.iconImageData;
        item.usernameValue = node.usernameValue;
        item.usernameName = node.usernameName;
        item.path = path;
        item.title = node.title;
        item.uRLs = node.uRLs;
        item.url = node.uRLs[0];
        item.uniqueID = node.uniqueID;
        item.dbFileName = dbFileName;
        return item;
    }

    private treeTraversal (branch, path, isInMatchingGroup, keywords, addResult: (item: SearchResult) => boolean, currentResultCount, dbFileName, filter) {
        let totalResultCount = currentResultCount;
        for (const leaf of branch.childLightEntries) {
            const item = this.convertItem(path, leaf, dbFileName);

            // We might already know this is a match if the item is contained within
            // a matching group but we check again because we probably want to update
            // the relevance score for the item
            const matchResult = isMatched(item, keywords, isInMatchingGroup, this.searchConfig, filter);
            if (matchResult > 0.0) {
                item.relevanceScore = matchResult;
                const accepted = addResult(item);
                if (accepted) {
                    totalResultCount++;
                    if (totalResultCount >= this.searchConfig.maximumResults)
                        return totalResultCount;
                }
            }
        }
        for (const subBranch of branch.childGroups) {
            const subIsInMatchingGroup = isMatched({ title: subBranch.title }, keywords, isInMatchingGroup, this.searchConfig, filter);
            totalResultCount = this.treeTraversal(subBranch, path + "/" + subBranch.title, subIsInMatchingGroup, keywords, addResult, totalResultCount, dbFileName, filter);
            if (totalResultCount >= this.searchConfig.maximumResults)
                return totalResultCount;
        }
        return totalResultCount;
    }

}

export class SearchOnlyMatches {
    private searchConfig: SearchConfig;
    constructor (private matchedLogins: SearchResult[]) {
        this.searchConfig = resolveConfig({version: 1});
    }

    private filterExistingResults (logins: SearchResult[], keywords) {
        return logins.filter(login => isMatched(login, keywords, false, this.searchConfig));
    }

    public execute (query, onComplete) {
        let abort = false;

        if (!this.matchedLogins || this.matchedLogins.length === 0) abort = true;

        onComplete = onComplete || this.searchConfig.onComplete;

        if (!onComplete) abort = true;

        if (abort) {
            if (onComplete) {
                onComplete([]);
                return;
            } else {
                return [];
            }
        }

        if (!query || query.length === 0) {
            onComplete(this.matchedLogins);
            return;
        }

        // allow pre-tokenised search terms to be supplied
        let keywords = [];
        if (Array.isArray(query))
            keywords = query;
        else if (query.length > 0)
            keywords = tokenise(query);

        // Create a timer to make the search run async
        setTimeout(() => {
            const results = this.filterExistingResults(this.matchedLogins, keywords);
            onComplete(results);
        }, 1);
    }
}
