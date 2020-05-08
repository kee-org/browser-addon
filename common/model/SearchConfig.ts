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
