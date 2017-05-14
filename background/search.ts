/*
  Includes contributions from https://github.com/haoshu
*/
"use strict";

class Search {

    _keefox_org;

    constructor (keefox_org, config) {
        this._keefox_org = keefox_org;
        this.resolveConfig(config);
        this.validateConfig();
    }
    configIsValid: boolean;
    makeAsyncTimer;

    reconfigure = function (config) {
        this.resolveConfig(config);
        return this.validateConfig();
    };

    execute = function (query, onComplete, filterURLs) {
        let abort = false;
        const filteringByURL = (filterURLs
            && filterURLs.length > 0
            && Array.isArray(filterURLs)
            && filterURLs[0].length > 0) ? true : false;

        if (!this.configIsValid) {
            KeeFoxLog.error("You can't execute a search while the search configuration is invalid. Please fix it by calling reconfigure().");
            abort = true;
        }

        if ((!query || query.length == 0) && !filteringByURL)
            abort = true;

        if (this._keefox_org.appState.KeePassDatabases.length == 0)
            abort = true;

        onComplete = onComplete || this._config.onComplete;

        if (abort) {
            if (onComplete) {
                onComplete([]);
                return;
            } else {
                return [];
            }
        }

        const results = [];
        function addResult (result) {
            if (this._config.onMatch) {
                result = this._config.onMatch(result);
                if (result)
                    results.push(result);
                else
                    return false;
            }
            else
                results.push(result);
            return true;
        };

        // allow pre-tokenised search terms to be supplied
        let keywords = [];
        if (Array.isArray(query))
            keywords = query;
        else if (query.length > 0)
            keywords = this.tokenise(query);

        let filter;

        if (filteringByURL) {
            filter = function (item) {
                if (!item.uRLs || item.uRLs.length <= 0)
                    return false;

                for (const url of filterURLs) {
                    //TODO:1.6: Might need to do something more complex here to avoid false
                    // matches in other parts of the item's URL. We don't use these results
                    // for anything security sensitive though so might not be a high priority.
                    if (item.uRLs.filter(function (i) { return (i.toLowerCase().indexOf(url) >= 0); }).length > 0)
                        return true;
                }
                return false;
            };
        }

        function actualSearch () {
            let databases;
            if (this._config.searchAllDatabases)
                databases = this._keefox_org.appState.KeePassDatabases;
            else
                databases = [this._keefox_org.appState.KeePassDatabases[this._keefox_org.appState.ActiveKeePassDatabaseIndex]];

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
            //TODO:2: use a background worker instead?
            return;
        } else {
            actualSearch.call(this);
            return results;
        }
    };

    resolveConfig = function (config) {
        if (!config)
            config = {};
        else {
            if (config.version != 1)
                KeeFoxLog.warn("Unknown search config version. Will use version 1 defaults");
        }

        this._config = {
            // KeeFox will check the supplied version number and behave consistently
            // for each version, regardless of the current KeeFox addon version.
            // If you supply a config object, you must at least include this property
            version: 1,

            // Whether to search all logged in databases or just the active one
            // (generally will want to respect the KeeFox option with this name)
            searchAllDatabases: (typeof config.searchAllDatabases !== "undefined" ? config.searchAllDatabases : true),

            // Disable searching in some parts of the entries if required
            searchTitles: (typeof config.searchTitles !== "undefined" ? config.searchTitles : true),
            searchUsernames: (typeof config.searchUsernames !== "undefined" ? config.searchUsernames : true),
            searchGroups: (typeof config.searchGroups !== "undefined" ? config.searchGroups : true),
            searchURLs: (typeof config.searchURLs !== "undefined" ? config.searchURLs : true),

            // Custom weights allow the order of results to be manipulated in a way
            // that best fits the context in which those results will be displayed
            // A relevanceScore will be returned with each result item - it's up to
            // the caller whether they are interested in processing this score data (e.g.
            // ordering results in relevance order)
            weightTitles: config.weightTitles || 2,
            weightUsernames: config.weightUsernames || 1,
            weightGroups: config.weightGroups || 0.25,
            weightURLs: config.weightURLs || 0.75,

            // Maximum number of results to return, it's up to the caller to decide if
            // they want to accept a result. Return a falsey value from onMatch to indicate that
            // the match was not accepted and it will then not be counted towards this maximum.
            maximumResults: (typeof config.maximumResults !== "undefined" ? config.maximumResults : 30),

            // Include a callback function if you want to run the search asynchronously, if
            // omitted the search will block and return the full set of results.
            // You can also set a unique callback for each call: Search.execute(query, useThisCallbackInstead);
            onComplete: config.onComplete,

            // A callback function to handle an individual result. Whatever is
            // returned from this optional function will be added to the list of complete results
            onMatch: config.onMatch

        };
    };

    validateConfig = function () {
        this.configIsValid = true;

        if (this._config.version != 1) {
            KeeFoxLog.warn("Unknown config version");
            this.configIsValid = false;
        }

        if (this._config.searchAllDatabases !== true && this._config.searchAllDatabases !== false) {
            KeeFoxLog.warn("searchAllDatabases should be a boolean");
            this.configIsValid = false;
        }

        if (this._config.searchTitles !== true && this._config.searchTitles !== false) {
            KeeFoxLog.warn("searchTitles should be a boolean");
            this.configIsValid = false;
        }

        if (this._config.searchUsernames !== true && this._config.searchUsernames !== false) {
            KeeFoxLog.warn("searchUsernames should be a boolean");
            this.configIsValid = false;
        }

        if (this._config.searchGroups !== true && this._config.searchGroups !== false) {
            KeeFoxLog.warn("searchGroups should be a boolean");
            this.configIsValid = false;
        }

        if (this._config.searchURLs !== true && this._config.searchURLs !== false) {
            KeeFoxLog.warn("searchURLs should be a boolean");
            this.configIsValid = false;
        }

        if (isNaN(this._config.weightTitles) || this._config.weightTitles <= 0) {
            KeeFoxLog.warn("weightTitles should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this._config.weightUsernames) || this._config.weightUsernames <= 0) {
            KeeFoxLog.warn("weightUsernames should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this._config.weightGroups) || this._config.weightGroups <= 0) {
            KeeFoxLog.warn("weightGroups should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this._config.weightURLs) || this._config.weightURLs <= 0) {
            KeeFoxLog.warn("weightURLs should be a positive number");
            this.configIsValid = false;
        }

        if (isNaN(this._config.maximumResults) || this._config.maximumResults <= 0) {
            KeeFoxLog.warn("maximumResults should be a positive number");
            this.configIsValid = false;
        }

        if (this._config.onComplete != null && typeof (this._config.onComplete) !== "function") {
            KeeFoxLog.warn("onComplete should be a function (or ommitted)");
            this.configIsValid = false;
        }

        if (this._config.onMatch != null && typeof (this._config.onMatch) !== "function") {
            KeeFoxLog.warn("onMatch should be a function (or ommitted)");
            this.configIsValid = false;
        }

        return this.configIsValid;
    };

    tokenise = function (text) {
        const tokens = text.match(/'[^']*'|"[^"]*"|[^\s ]+/g) || [];
        tokens.forEach(function (value, index, array) {
            array[index] = array[index].replace(/(^['"])|(['"]$)/g, "")
                .replace(/[\s ]+/g, " ")
                .toLowerCase();
        });
        return tokens;
    };

    isMatched = function (item, keywords, isInMatchingGroup, filter) {

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
                return true;
            for (const keyword of keywords) {
                if (item.title.toLowerCase().indexOf(keyword) >= 0)
                    return true;
            }
            return false;
        }

        let matchScore = 0.0;

        // Sometimes the attribute is not found. This try catch is a quick
        // hack to skip the result and keep things moving in the POC.
        //try
        //{
        for (const keyword of keywords) {
            let keywordScore = 0;
            if (this._config.searchTitles && item.title && item.title.toLowerCase().indexOf(keyword) >= 0)
                keywordScore += this._config.weightTitles;
            if (this._config.searchUsernames && item.usernameValue && item.usernameValue.toLowerCase().indexOf(keyword) >= 0)
                keywordScore += this._config.weightUsernames;
            if (this._config.searchURLs && item.uRLs &&
                item.uRLs.filter(function (i) { return (i.toLowerCase().indexOf(keyword) >= 0); }).length > 0)
                keywordScore += this._config.weightURLs;

            // Increment the relevance score proportionally to the number of keywords
            matchScore += keywordScore * (1 / keywords.length);
        }

        if (isInMatchingGroup)
            matchScore += this._config.weightGroups;

        return matchScore;

        //} catch (e)
        //{
        //    return false;
        //}
        //return 0.0;
    };

    convertItem = function (path, node, dbFileName) {
        const item: any = new Object();
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
    };

    treeTraversal = function (branch, path, isInMatchingGroup, keywords, addResult, currentResultCount, dbFileName, filter) {
        let totalResultCount = currentResultCount;
        for (const leaf of branch.childLightEntries) {
            const item = this.convertItem(path, leaf, dbFileName);

            // We might already know this is a match if the item is contained within
            // a matching group but we check again because we probably want to update
            // the relevance score for the item
            const matchResult = this.isMatched(item, keywords, isInMatchingGroup, filter);
            if (matchResult > 0.0) {
                item.relevanceScore = matchResult;
                const accepted = addResult(item);
                if (accepted) {
                    totalResultCount++;
                    if (totalResultCount >= this._config.maximumResults)
                        return totalResultCount;
                }
            }
        }
        for (const subBranch of branch.childGroups) {
            const subIsInMatchingGroup = this.isMatched({ title: subBranch.title }, keywords, isInMatchingGroup, filter);
            totalResultCount = this.treeTraversal(subBranch, path + "/" + subBranch.title, subIsInMatchingGroup, keywords, addResult, totalResultCount, dbFileName, filter);
            if (totalResultCount >= this._config.maximumResults)
                return totalResultCount;
        }
        return totalResultCount;
    };
};
