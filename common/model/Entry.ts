import { Icon } from "./Icon";
import { Database } from "./Database";
import { utils } from "../utils";
import { Field } from "./Field";
import { EntryDto, FormFieldTypeDTO } from "./KPRPCDTOs";
import { DatabaseSummary } from "./DatabaseSummary";
import { GroupSummary } from "./GroupSummary";

// Although we use uuids for Fields and possibly Locators, we don't allow them to exist outside of their parent entry.

export class Entry {

    // array of URL strings (normally just one is needed
    // but a given entry can be associated with more than one site
    // or with multiple pages on that site)
    readonly URLs: string[];

    // How accurate is the best URL match for this entry (only set if entry
    // was supplied in response to certain search requests). Higher = closer match
    readonly matchAccuracy: number;

    // The realm of a HTTP authentication request
    readonly httpRealm: string;

    // The index of the otherField which we will treat as the username in KeePass
    // readonly usernameIndex: number;

    readonly fields: Field[];

    // The KeePass entry's uniqueID (if known)
    readonly uuid: string;

    // The title of the KeePass entry (auto-generated from the page title by default,
    // or the page URL's hostname if no title is set)
    readonly title: string;

    readonly icon: Icon;

    readonly parentGroup: GroupSummary;

    readonly alwaysAutoFill: boolean;
    readonly alwaysAutoSubmit: boolean;
    readonly neverAutoFill: boolean;
    readonly neverAutoSubmit: boolean;

    readonly database : DatabaseSummary;

    // How relevant this entry is to the current form in
    // the browser - transient (not stored in KeePass)
    //TODO:4 put all match data into a new object?
    relevanceScore: number;
    lowFieldMatchRatio: any;
    formIndex: number;
    entryIndex: number;

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
        this.database = e.database || new Database({});
    }

    public static getUsernameField (entry: Entry) {
        return entry.fields.find(f => f.type === "text");
    }
    public static getPasswordField (entry: Entry) {
        return entry.fields.find(f => f.type === "password");
    }

    public static fromKPRPCEntryDTO (entryDto: EntryDto, db: DatabaseSummary) {
        const sortedFields: Field[] = [];
        let maximumPage = 1;
        const usernameIndex = entryDto.formFieldList.findIndex(f => f.type === FormFieldTypeDTO.username);

        const unsortedFields = entryDto.formFieldList.map((f, i) => {

            if (f.page > maximumPage)
                maximumPage = f.page;

            return Field.fromKPRPCFieldDTO(f);
        });
        const firstPasswordIndex = unsortedFields.findIndex(f => f.type === "password");

        if (usernameIndex > -1) {
            sortedFields.push(unsortedFields[usernameIndex]);
        }
        if (firstPasswordIndex > -1) {
            sortedFields.push(unsortedFields[firstPasswordIndex]);
        }
        unsortedFields.forEach((f, i) => {
            if (i !== usernameIndex && i !== firstPasswordIndex) {
                sortedFields.push(f);
            }
        });

        const entry = new Entry({
            URLs: entryDto.uRLs,
            neverAutoFill: entryDto.neverAutoFill,
            alwaysAutoFill: entryDto.alwaysAutoFill,
            neverAutoSubmit: entryDto.neverAutoSubmit,
            alwaysAutoSubmit: entryDto.alwaysAutoSubmit,
            icon: { version: 1, iconImageData: entryDto.iconImageData },
            parentGroup: GroupSummary.fromKPRPCGroupSummaryDTO(entryDto.parent),
            database: db,
            matchAccuracy: entryDto.matchAccuracy,
            httpRealm: entryDto.hTTPRealm,
            uuid: entryDto.uniqueID,
            title: entryDto.title,
            fields: sortedFields
        });

        return entry;
    }

    public static toKPRPCEntryDTO (entry: Entry) {
        const entryDto = new EntryDto();
        entryDto.alwaysAutoFill = entry.alwaysAutoFill;
        entryDto.alwaysAutoSubmit = entry.alwaysAutoSubmit;
        entryDto.formFieldList = entry.fields.map((f, i) => Field.toKPRPCFieldDTO(f, i === 0));
        entryDto.hTTPRealm = entry.httpRealm;
        entryDto.iconImageData = entry.icon.iconImageData;
        entryDto.neverAutoFill = entry.neverAutoFill;
        entryDto.neverAutoSubmit = entry.neverAutoSubmit;
        entryDto.title = entry.title;
        entryDto.uRLs = entry.URLs;
        return entryDto;
    }
}
