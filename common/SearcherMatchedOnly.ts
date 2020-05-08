import { SearchConfig } from "./model/SearchConfig";
import { EntrySummary } from "./model/EntrySummary";
import { resolveConfig, tokenise, isMatched } from "./SearchUtils";

export class SearcherMatchedOnly {
    private searchConfig: SearchConfig;
    constructor (private matchedLogins: EntrySummary[]) {
        this.searchConfig = resolveConfig({version: 1});
    }

    private filterExistingResults (logins: EntrySummary[], keywords) {
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
