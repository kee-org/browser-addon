export class Locator {

    // HTML id attribute
    id: string;

    // HTML name attribute
    name: string;

    // HTML input type
    type: string;

    // HTML DOM select query
    query?: string;

    constructor (locator: Partial<Locator>) {
        this.id = locator.id || "";
        this.name = locator.name || "";
        this.type = locator.type || "";
        this.query = locator.query;
    }

    //TODO: Things like MaxLength that can be used to both help identify the field and generate new values/passwords
}
