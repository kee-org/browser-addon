import { Icon } from "./Icon";
import { Database } from "./Database";
import { keeLoginInfo, keeLoginField } from "../kfDataModel";
import { utils } from "../utils";
import { Field } from "./Field";
//import { Group } from "./"

// Although we use uuids for Fields and possibly Locators, we don't allow them to exist outside of their parent entry.

export class Entry {

    // array of URL strings (normally just one is needed
    // but a given login can be associated with more than one site
    // or with multiple pages on that site)
    readonly URLs: string[];

    // How accurate is the best URL match for this login (only set if login
    // was supplied in response to certain search requests). Higher = closer match
    readonly matchAccuracy: number;

    // The realm of a HTTP authentication request
    readonly httpRealm: string;

    // The index of the otherField which we will treat as the username in KeePass
    readonly usernameIndex: number;

    readonly fields: Field[];

    // The KeePass entry's uniqueID (if known)
    readonly uuid: string;

    //TODO:* Remove once legacy Group (implicit) class is no longer needed
    // This is needed for treeview iteration in the UI - both groups and
    // entries need to have the same property names
    public get uniqueID () : string {
        return this.uuid;
    }

    // The title of the KeePass entry (auto-generated from the page title by default,
    // or the page URL's hostname if no title is set)
    readonly title: string;


    readonly icon: Icon;

    readonly parentGroup: any; //TODO:* Can currently be some sort of unspecified (implicit) Group class. E.g. used for parentGroup.path (string).

    readonly alwaysAutoFill: boolean;
    readonly alwaysAutoSubmit: boolean;
    readonly neverAutoFill: boolean;
    readonly neverAutoSubmit: boolean;

    readonly database : Database;

    // How relevant this login entry is to the current form in
    // the browser - transient (not stored in KeePass)
    //TODO:* put all match data into a new object?
    relevanceScore: number;
    lowFieldMatchRatio: any;
    formIndex: number;
    loginIndex: number;
    // frameKey: any; appears to be unused

    constructor (e: Partial<Entry>) {
        this.alwaysAutoFill = e.alwaysAutoFill || false;
        this.alwaysAutoSubmit = e.alwaysAutoSubmit || false;
        this.neverAutoFill = e.neverAutoFill || false;
        this.neverAutoSubmit = e.neverAutoSubmit || false;
        this.URLs = e.URLs || [];
        this.fields = e.fields || [];
        this.httpRealm = e.httpRealm || "";
        this.parentGroup = e.parentGroup || null;
        this.uuid = e.uuid || utils.newGUID();
        this.title = e.title || "";
        this.matchAccuracy = e.matchAccuracy || 0;
        this.icon = e.icon || { version: 1, iconImageData: "" };
        this.database = e.database || new Database();
        // this.database = e.database || null;
    }


    //TODO:* allow mapping to/from KPRPC DTOs directly.
    // In short term we only use this new model for the popup GUI but ultimately want to
    //replace keeLoginInfo which will mean implementing a different set of mappings

    public static fromKeeLoginInfo (kli: keeLoginInfo) {

        const entry = new Entry({
            URLs: kli.URLs,
            neverAutoFill: kli.neverAutoFill,
            alwaysAutoFill: kli.alwaysAutoFill,
            neverAutoSubmit: kli.neverAutoSubmit,
            alwaysAutoSubmit: kli.alwaysAutoSubmit,
            icon: { version: 1, iconImageData: kli.iconImageData },
            parentGroup: kli.parentGroup,
            database: kli.database,
            matchAccuracy: kli.matchAccuracy,
            httpRealm: kli.httpRealm,
            uuid: kli.uniqueID,
            title: kli.title,
            fields: mapToFields(kli.usernameIndex, kli.otherFields, kli.passwords)
        });

        return entry;

    }

    public static toKeeLoginInfo (entry: Entry) {
        const kli: keeLoginInfo = new keeLoginInfo();
        kli.URLs = entry.URLs;
        kli.alwaysAutoFill = entry.alwaysAutoFill;
        kli.alwaysAutoSubmit = entry.alwaysAutoSubmit;
        kli.database = entry.database;
        kli.httpRealm = entry.httpRealm || null; // KPRPC (possibly) expects null rather than "" or undefined so we're defensive
        kli.iconImageData = entry.icon.iconImageData;
        kli.matchAccuracy = entry.matchAccuracy;
        kli.neverAutoFill = entry.neverAutoFill;
        kli.neverAutoSubmit = entry.neverAutoSubmit;
        kli.otherFields = entry.fields.filter(f => f.type !== "password").map(f => Field.toKeeLoginField(f));
        kli.parentGroup = entry.parentGroup;
        kli.passwords = entry.fields.filter(f => f.type === "password").map(f => Field.toKeeLoginField(f));
        kli.uniqueID = entry.uuid;
        kli.usernameIndex = 0;
        kli.title = entry.title;
        kli.priority = 0; // See #999999
        return kli;
    }

}

// By convention the first entry will be the username
export function mapToFields (usernameIndex: number, otherFields: keeLoginField[], passwords: keeLoginField[]) {
    const fields: Field[] = [];
    if (usernameIndex >= 0 && otherFields[usernameIndex]) {
        fields.push(Field.fromKeeLoginField(otherFields[usernameIndex]));
    }
    otherFields.forEach((f, index) => {
        if (index !== usernameIndex) {
            fields.push(Field.fromKeeLoginField(f));
        }
    });
    passwords.forEach(f => {
        fields.push(Field.fromKeeLoginField(f));
    });
    return fields;
}

// // By convention the first entry will be the username
// export function mapFromFields (fields: Field[]) {
//     const usernameIndex: number = 0;
//     const otherFields: keeLoginField[] = [];
//     const passwords: keeLoginField[] = [];
//     fields.forEach(f => {
//         otherFields.push(Field.toKeeLoginField(f));
//     });
//     fields.forEach(f => {
//         passwords.push(Field.toKeeLoginField(f));
//     });
//     return { usernameIndex, otherFields, passwords };
// }
