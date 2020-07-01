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

    constructor(locator: Partial<Locator>) {
        this.id = locator.id || "";
        this.name = locator.name || "";
        this.type = locator.type || "";
        this.query = locator.query;
        this.labels = locator.labels;
    }

    //TODO:4: Things like MaxLength that can be used to both help identify the field and generate new values/passwords
}
