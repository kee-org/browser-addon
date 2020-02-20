import { Icon } from "./Icon";
import { Database } from "./Database";
import { keeLoginInfo, keeLoginField } from "../kfDataModel";
import { utils } from "../utils";
import { Field } from "./Field";

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

    // The title of the KeePass entry (auto-generated from the page title by default,
    // or the page URL's hostname if no title is set)
    readonly title: string;


    readonly icon: Icon;

    readonly parentGroup; //TODO: What type? New Group class? seems to just be used for parentGroup.path (string) so far?

    readonly alwaysAutoFill: boolean;
    readonly alwaysAutoSubmit: boolean;
    readonly neverAutoFill: boolean;
    readonly neverAutoSubmit: boolean;

    readonly database : Database;

    // How relevant this login entry is to the current form in
    // the browser - transient (not stored in KeePass)
    //TODO: denormalise match data into a new object?
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
    }


    //TODO: allow mapping to/from KPRPC DTOs directly.
    // In short term we only use this new model for the popup GUI but ultimately want to
    //replace keeLoginInfo which will mean implementing a different set of mappings

    static fromKeeLoginInfo (kli: keeLoginInfo) {

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

    // toKeeLoginInfo () {
    //     const entry: any = {};

    //     entry.db = this.database;
    //     entry.parent = this.parentGroup;
    //     entry.iconImageData = this.iconImageData;
    //     entry.alwaysAutoFill = this.alwaysAutoFill;
    //     entry.alwaysAutoSubmit = this.alwaysAutoSubmit;
    //     entry.neverAutoFill = this.neverAutoFill;
    //     entry.neverAutoSubmit = this.neverAutoSubmit;
    //     entry.priority = this.priority;
    //     entry.uRLs = this.URLs;
    //     entry.matchAccuracy = this.matchAccuracy;
    //     entry.hTTPRealm = this.httpRealm;
    //     entry.uniqueID = this.uniqueID;
    //     entry.title = this.title;
    //     entry.formFieldList = [];
    //     for (const password of this.passwords)
    //         entry.formFieldList.push(password.asFormField(false));
    //     for (let i = 0; i < this.otherFields.length; i++)
    //         if (this.usernameIndex == i)
    //             entry.formFieldList.push(this.otherFields[i].asFormField(true));
    //         else
    //             entry.formFieldList.push(this.otherFields[i].asFormField(false));

    //     return entry;
    // }

}

//TODO: Verify that the round-trips don't delete fields of types we're not showing in the UI (checkboxes, etc.)

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
