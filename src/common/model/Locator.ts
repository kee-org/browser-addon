import { FieldMatcherConfig, FieldMatcherType } from "./KPRPCDTOs";

export class Locator {
    // HTML id attribute
    id: string;

    // HTML name attribute
    name: string;

    // HTML input type
    type: string;

    // HTML DOM select query
    query?: string;

    // Visible and accessibility labels
    labels?: string[];

    // Any autocomplete values we found, or require, in the DOM
    autocompleteValues?: string[];

    constructor(locator: Partial<Locator>) {
        this.id = locator.id || "";
        this.name = locator.name || "";
        this.type = locator.type || "";
        this.query = locator.query;
        this.labels = locator.labels;
        this.autocompleteValues = locator.autocompleteValues;
    }

    static fromFieldMatcherConfig(fmc: FieldMatcherConfig) {
        if (fmc.matcherType === FieldMatcherType.UsernameDefaultHeuristic) {
            return new Locator({
                id: "",
                name: "",
                type: "text"
            });
        }
        if (fmc.matcherType === FieldMatcherType.PasswordDefaultHeuristic) {
            return new Locator({
                id: "",
                name: "",
                type: "password"
            });
        }
        const matcher = fmc.customMatcher;
        return new Locator({
            id: matcher.ids?.[0] ?? "",
            name: matcher.names?.[0] ?? "",
            type: matcher.types?.[0] ?? ""
        });
    }

    //TODO:4: Things like MaxLength that can be used to both help identify the field and generate new values/passwords
}
