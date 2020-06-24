import { SearchConfig } from "./model/SearchConfig";
import { EntrySummary } from "./model/EntrySummary";
import { resolveConfig, tokenise, calculateMatchScore } from "./SearchUtils";

export class SearcherMatchedOnly {
    private searchConfig: SearchConfig;
    constructor (private matchedEntrySummaries: EntrySummary[]) {
        this.searchConfig = resolveConfig({version: 1});
    }

    private filterExistingResults (entrySummaries: EntrySummary[], keywords: string[]) {
        return entrySummaries.filter(entrySummary => calculateMatchScore(entrySummary, keywords, 0, this.searchConfig));
    }

    public execute (query: string, onComplete) {
        let abort = false;

        if (!this.matchedEntrySummaries || this.matchedEntrySummaries.length === 0) abort = true;

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
            onComplete(this.matchedEntrySummaries);
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
            const results = this.filterExistingResults(this.matchedEntrySummaries, keywords);
            onComplete(results);
        }, 1);
    }
}
