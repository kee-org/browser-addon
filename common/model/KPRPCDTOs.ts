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

export enum PlaceholderHandling { Default = "Default", Enabled = "Enabled", Disabled = "Disabled" }

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
