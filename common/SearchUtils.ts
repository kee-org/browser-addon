import { KeeLog } from "./Logger";
import { SearchConfig } from "./model/SearchConfig";

export function isMatched (item, keywords, isInMatchingGroup, searchConfig: SearchConfig, filter?) {

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

export function resolveConfig (config: Partial<SearchConfig>) {
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

export function tokenise (text) {
    const tokens = text.match(/'[^']*'|"[^"]*"|[^\s ]+/g) || [];
    tokens.forEach(function (value, index, array) {
        array[index] = array[index].replace(/(^['"])|(['"]$)/g, "")
            .replace(/[\s ]+/g, " ")
            .toLowerCase();
    });
    return tokens;
}
