import { fieldTypeEnumToDOMTypeEstimate } from "./Field";
import { Locator } from "./Locator";
import { SessionType } from "./SessionType";

export class PasswordProfileDto {
    name: string;
    sessionType: SessionType;
}

export class DatabaseDto {
    name: string;
    fileName?: string;
    iconImageData: string;
    root: GroupDto;
    active?: boolean;
}

export class DatabaseSummaryDto {
    name: string;
    fileName?: string;
    iconImageData: string;
    root: GroupSummaryDto;
    active?: boolean;
}

export class GroupSummaryDto {
    title: string;
    uniqueID: string;
    iconImageData: string;
    path: string;
}

export class GroupDto {
    title: string;
    uniqueID: string;
    iconImageData: string;
    path: string;
    childLightEntries: EntrySummaryDto[];
    childGroups: GroupDto[];
    //childEntries: EntryDto[] - this is only needed if we ever request GetAllDatabases(true) but Kee currently has no need for this KPRPC feature
}

export class LightGroupDto2 {
    title: string;
    uniqueID: string;
    icon: Icon;
    path: string;
}

export class DatabaseDto2 {
    name: string;
    fileName?: string;
    iconImageData: string;
    root: GroupDto2;
    active?: boolean;
}

export class DatabaseSummaryDto2 {
    name: string;
    fileName?: string;
    icon: Icon;
    root: LightGroupDto2;
    active?: boolean;
}

export class GroupDto2 {
    title: string;
    uniqueID: string;
    icon: Icon;
    path: string;
    childLightEntries: LightEntryDto2[];
    childGroups: GroupDto2[];
    //childEntries: EntryDto2[] - this is only needed if we ever request GetAllDatabases(true) but Kee currently has no need for this KPRPC feature
}


export enum PlaceholderHandling {
    Default = "Default",
    Enabled = "Enabled",
    Disabled = "Disabled"
}

export enum MatchAccuracyEnum {
    // Best = Non-URL match (i.e. we matched by UUID instead)
    // Best = Regex match (it is impossible for us to infer how
    // accurate a regex match is in comparison with other classes
    // of match so we always treat it as the best possible match
    // even if the regex itself is very loose)
    // Best = Same URL including query string

    // Close = Same URL excluding query string

    // HostnameAndPort = Same hostname and port

    // Hostname = Same hostname (domain + subdomains)

    // Domain = Same domain

    // None = No match (e.g. when we are being asked to return all entries)

    Best = 50,
    Close = 40,
    HostnameAndPort = 30,
    Hostname = 20,
    Domain = 10,
    None = 0
}


export enum EntryAutomationBehaviour {
    Default,
    NeverAutoFillNeverAutoSubmit,
    NeverAutoSubmit,
    AlwaysAutoFillAlwaysAutoSubmit,
    AlwaysAutoFill,
    AlwaysAutoFillNeverAutoSubmit
}

export enum FieldTypeEnum { Text = "Text", Password = "Password", Existing = "Existing", Toggle = "Toggle", Otp = "Otp", SomeChars = "SomeChars" }

// For standard KeePass entries with no KPRPC-specific config, we can save storage
// space (and one day data-exchange bytes) by just recording that the client should
// use a typical locator to work out which field is the best match, because we have
// no additional information to help with this task.
// We could extend this to very common additional heuristics in future (e.g. if many
// sites and entries end up with a custom locator with Id and Name == "password").
// That would be pretty complex though so probably won't be worthwhile.
export enum FieldMatcherType {
    Custom = "Custom",
    UsernameDefaultHeuristic = "UsernameDefaultHeuristic",
    PasswordDefaultHeuristic = "PasswordDefaultHeuristic"
}


export class EntryDto {
    db: DatabaseDto;
    parent: GroupSummaryDto;
    iconImageData: string;
    alwaysAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoFill: boolean;
    neverAutoSubmit: boolean;
    priority: number;
    uRLs: string[];
    matchAccuracy: number;
    hTTPRealm: string;
    uniqueID: string;
    title: string;
    formFieldList: FieldDto[];
}

export class EntryDto2 {
    urls: string[];
    realm: string;
    title: string;
    fields: FieldDto2[];
    behaviour?: EntryAutomationBehaviour;
    uniqueID: string;
    parent: LightGroupDto2;
    icon: Icon;
    db: DatabaseDto2;
    matchAccuracy: number;
    // matcherConfigs: EntryMatcherConfig[]; // not implemented yet - KPRPC_FEATURE_ENTRY_CLIENT_MATCHERS
    authenticationMethods: string[];
}

export class LightEntryDto2 {
    urls: string[];
    title: string;
    uniqueID: string;
    usernameName: string;
    usernameValue: string;
    icon: Icon;
    authenticationMethods: string[];
}

export class Icon {
    index?: string;
    refId?: string;
    base64?: string;
}

export class EntrySummaryDto {
    iconImageData: string;
    uRLs: string[];
    uniqueID: string;
    title: string;
    usernameValue: string;
    usernameName: string;
}

// tslint:disable-next-line:class-name
export class FieldDto {
    displayName: string;

    // "name" attribute on the HTML form element
    name: string;

    // "value" attribute on the HTML form element
    value: string;

    // "id" attribute on the HTML form element
    id: string;

    // "type" attribute on the HTML form element
    type: FormFieldTypeDTO;

    page: number;
}

export enum FormFieldTypeDTO {
    radio = "FFTradio",
    username = "FFTusername",
    text = "FFTtext",
    password = "FFTpassword",
    select = "FFTselect",
    checkbox = "FFTcheckbox"
}

export class FieldDto2 {
    // a base64 encoded 128bit unique ID.
    uuid: string;

    // display name, not form field name attribute
    name: string;

    // e.g. "Username" for a KeePass Property or "." for this object
    valuePath: string;

    // When set by server, should be set iff valuePath == "."
    // Can be set to new value by client no matter what the valuePath is
    value: string;

    // Set only by server. This is the value we use for all rendering, form filling, etc.
    resolvedValue: string;

    // Fields with multiple positive page numbers are effectively treated as multiple Entries
    // when Kee assesses potential matches and field candidates to fill. Other clients might
    // use for similar logical grouping purposes.
    page: number = 1;

    // A conceptual category, rather than a specific name or representation of that type.
    // E.g. an HTML radio button is just one specific representation of the concept of a
    // field that we will match based upon pre-existing data included in a web page.
    type: FieldTypeEnum;

    // If null, behaviour depends on inherited behaviour of database this field is contained within.
    placeholderHandling?: PlaceholderHandling;

    // All the ways we could consider that this field is a match/block. Could be related to
    // information we have in the server but at least initially it's only going to be used
    // by the client to evaluate conditions that only it knows (e.g. the DOM state of an
    // HTML page). Initially we expect a single config per Field but we might relax that
    // for some clients in future so store an array just in case.
    matcherConfigs: FieldMatcherConfig[];

    public constructor(init?: Partial<FieldDto2>) {
        Object.assign(this, init);
    }
}


// How we can locate a field in the client. At least one property must be set.
// Not all versions of all clients will act upon the hints here and the
// weighting they apply to each factor may vary
// An array property matches if any of its items match.
export class FieldMatcher {
    matchLogic?: MatcherLogic; // default to Client initially
    ids: string[]; // HTML id attribute
    names: string[]; // HTML name attribute
    types: string[]; // HTML input type
    queries: string[]; // HTML DOM select query
    labels: string[]; // HTML Label or otherwise visible UI label
    autocompleteValues: string[]; // HTML autocomplete attribute values
    maxLength?: number; // max chars allowed in a candidate field for this to match
    minLength?: number; // min chars allowed in a candidate field for this to match

    public constructor(init?: Partial<FieldMatcher>) {
        Object.assign(this, init);
    }
}

export class FieldMatcherConfig {
    matcherType?: FieldMatcherType;
    customMatcher?: FieldMatcher;
    weight?: number; // 0 = client decides or ignores locator
    actionOnMatch?: MatchAction;

    public constructor(init?: Partial<FieldMatcherConfig>) {
        Object.assign(this, init);
    }

    // public static forSingleClientMatch(id: string, name: string, fft: kfDm.keeFormFieldType): FieldMatcherConfig {
    //     var htmlType = Utilities.FormFieldTypeToHtmlType(fft);
    //     return FieldMatcherConfig.forSingleClientMatchHtmlType(id, name, htmlType);
    // }

    public static defaultForType(type: FieldTypeEnum): FieldMatcherConfig {
        // We should already have a matcher config but in case a bug means it is missing,
        // we can use this method to infer one from only the type of the field. It's
        // never going to be very accurate but keeps things working.
        if (type == FieldTypeEnum.Password) {
            return new FieldMatcherConfig(
                {
                    matcherType: FieldMatcherType.PasswordDefaultHeuristic
                }
            )
        } else if (type == FieldTypeEnum.Text) {
            return new FieldMatcherConfig(
                {
                    matcherType: FieldMatcherType.UsernameDefaultHeuristic
                }
            )
        } else {
            return new FieldMatcherConfig(
                {
                    customMatcher: new FieldMatcher(
                        {
                            ids: [],
                            names: [],
                            types: [fieldTypeEnumToDOMTypeEstimate(type)],
                            queries: [],
                        })
                }
            )
        }
    }

    public static forSingleClientMatchHtmlType(id: string, name: string, htmlType: string, domSelector?: string): FieldMatcherConfig {
        return new FieldMatcherConfig(
            {
                customMatcher: new FieldMatcher(
                    {
                        ids: !id ? [] : [id],
                        names: !name ? [] : [name],
                        types: !htmlType ? [] : [htmlType],
                        queries: !domSelector ? [] : [domSelector],
                    })
            });
    }

    public static fromLocator(locator: Locator, defaultMatcherType?: FieldMatcherType) {
        const custom = this.forSingleClientMatchHtmlType(locator.id, locator.name, locator.type, locator.query);
        if (defaultMatcherType) {
            // We ignore custom.customMatcher.types but maybe will need/want to consider it more carefully in future - e.g. a DOM type hint for a username might help?
            // Currently labels and autoCompleteValues are always empty but maybe that will change one day
            if ((custom.customMatcher.ids?.length ?? 0) === 0
            && (custom.customMatcher.names?.length ?? 0) === 0
            && (custom.customMatcher.queries?.length ?? 0) === 0
            && (custom.customMatcher.autocompleteValues?.length ?? 0) === 0
            && (custom.customMatcher.labels?.length ?? 0) === 0) {
                return new FieldMatcherConfig(
                    {
                        matcherType: defaultMatcherType
                    }
                )
            }
        }
        return custom;
    }
}


export enum MatchAction { TotalMatch, TotalBlock, WeightedMatch, WeightedBlock }

export enum MatcherLogic { Client = "Client", All = "All", Any = "Any" }
