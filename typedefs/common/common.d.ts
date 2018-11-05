/// <reference types="../typedefs/browser" />
declare const enum Action {
    CloseAllPanels = "closeAllPanels",
    DetectForms = "detectForms",
    GetPasswordProfiles = "getPasswordProfiles",
    GeneratePassword = "generatePassword",
    ManualFill = "manualFill",
    Primary = "primary",
    RemoveSubmittedData = "removeSubmittedData",
    ShowMatchedLoginsPanel = "showMatchedLoginsPanel",
    SaveLatestLogin = "saveLatestLogin"
}
declare type SiteConfigMethod = "Exact" | "Prefix" | "Regex";
declare type SiteConfigTarget = "Domain" | "Host" | "Page";
declare type SiteConfigNodeType = "Migration" | "User" | "Default";
declare class FormMatchConfig {
    form?: {
        names?: string[];
        ids?: string[];
    };
    fields?: {
        names?: string[];
        ids?: string[];
    };
    querySelectors?: string[];
}
declare class SiteConfig {
    whiteList?: FormMatchConfig;
    blackList?: FormMatchConfig;
    preventSaveNotification?: boolean;
}
declare class SiteConfigNode {
    config: SiteConfig;
    matchWeight: number;
    source: SiteConfigNodeType;
}
declare class SiteConfigLookup {
    [key: string]: SiteConfigNode;
}
declare class SiteConfigIndex {
    domainRegex?: SiteConfigLookup;
    domainExact?: SiteConfigLookup;
    domainPrefix?: SiteConfigLookup;
    hostRegex?: SiteConfigLookup;
    hostExact?: SiteConfigLookup;
    hostPrefix?: SiteConfigLookup;
    pageRegex?: SiteConfigLookup;
    pageExact?: SiteConfigLookup;
    pagePrefix: SiteConfigLookup;
}
declare class Config {
    autoFillDialogs: boolean;
    autoFillForms: boolean;
    autoFillFormsWithMultipleMatches: boolean;
    autoSubmitForms: boolean;
    autoSubmitDialogs: boolean;
    autoSubmitMatchedForms: boolean;
    connSLClient: number;
    connSLServerMin: number;
    keePassDBToOpen: string;
    keePassMRUDB: string;
    KeePassRPCWebSocketPort: number;
    KPRPCUsername: string;
    KPRPCStoredKeys: {
        [key: string]: string;
    };
    lastConnectedToKeePass: string;
    listAllOpenDBs: boolean;
    logLevel: number;
    logMethodConsole: boolean;
    logMethodFile: boolean;
    logSensitiveData: boolean;
    metricsUsageDisabled: boolean;
    metricsUserId: string;
    mruGroup: {
        [key: string]: string;
    };
    notifyWhenEntryUpdated: boolean;
    notifyWhenLateDiscovery: boolean;
    notifyWhenLoggedOut: boolean;
    overWriteFieldsAutomatically: boolean;
    rememberMRUDB: boolean;
    rememberMRUGroup: boolean;
    saveFavicons: boolean;
    searchAllOpenDBs: boolean;
    siteConfig: SiteConfigIndex;
    config: {
        url: string;
        config: {};
    }[];
    tutorialProgress: string;
    version: number;
    triggerChangeInputEventAfterFill: boolean;
    autoSubmitNetworkAuthWithSingleMatch: boolean;
    searchNetworkAuth: boolean;
    portConnectionDelay: number;
    notificationCountGeneric: number;
    notificationCountSavePassword: number;
    currentSearchTermTimeout: number;
}
declare type ButtonAction = "enableHighSecurityKPRPCConnection" | "loadUrlHelpSensitiveLogging" | "disableNotifyWhenEntryUpdated" | "loadUrlUpgradeKee";
interface Button {
    label: string;
    action?: ButtonAction;
    id?: string;
    tooltip?: string;
}
declare class KeeNotification {
    name: string;
    buttons: Button[];
    id: string;
    messages: string[];
    priority: "High" | "Medium" | "Low";
    allowMultiple: boolean;
    myPort?: any;
    constructor(name: string, buttons: Button[], id: string, //Guid
    messages: string[], priority: "High" | "Medium" | "Low", allowMultiple: boolean, myPort?: any);
    render(): HTMLDivElement;
    renderButtons(container: HTMLDivElement): HTMLDivElement;
    renderCloseButton(container: HTMLDivElement): HTMLDivElement;
    renderStandardMessages(container: HTMLDivElement): HTMLDivElement;
    prepareNotificationButton(button: HTMLButtonElement, buttonDefinition: Button): HTMLButtonElement;
    dispatchActionResponse(action: ButtonAction): void;
}
interface AppState {
    latestConnectionError: string;
    lastKeePassRPCRefresh: number;
    ActiveKeePassDatabaseIndex: number;
    KeePassDatabases: Database[];
    notifications: KeeNotification[];
    connected: boolean;
    currentSearchTerm: string;
}
interface LogMessage {
    m: string;
    sm: string;
    r: boolean;
}
declare class KeeLogger {
    constructor();
    config: {
        logLevel: number;
        logSensitiveData: boolean;
    };
    attachConfig(config: {
        logLevel: number;
        logSensitiveData: boolean;
    }): void;
    private getMessage;
    debug(data: LogMessage | string, sensitiveMessage?: string, replace?: boolean): void;
    info(data: LogMessage | string, sensitiveMessage?: string, replace?: boolean): void;
    warn(data: LogMessage | string, sensitiveMessage?: string, replace?: boolean): void;
    error(data: LogMessage | string, sensitiveMessage?: string, replace?: boolean): void;
}
declare let KeeLog: KeeLogger;
declare let getURIExcludingQS: (uriString: any) => string;
declare let getURIHostAndPort: (uriString: any) => string;
declare let getURISchemeHostAndPort: (uriString: any) => string;
declare let getURIScheme: (uriString: any) => any;
declare let keeFormFieldType: {
    radio: string;
    username: string;
    text: string;
    password: string;
    select: string;
    checkbox: string;
};
declare class Database {
    name: string;
    fileName: string;
    iconImageData: string;
    root: any;
}
declare class keeLoginInfo {
    URLs: string[];
    matchAccuracy: number;
    httpRealm: string;
    usernameIndex: number;
    passwords: keeLoginField[];
    uniqueID: string;
    title: string;
    otherFields: keeLoginField[];
    relevanceScore: number;
    maximumPage: number;
    iconImageData: string;
    parentGroup: any;
    priority: number;
    alwaysAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoFill: boolean;
    neverAutoSubmit: boolean;
    database: Database;
    lowFieldMatchRatio: any;
    formIndex: number;
    loginIndex: number;
    frameKey: any;
    constructor();
    asJSONifiable(): any;
    toJSON(): any;
    fromJSON(json: any): void;
    toSource(): string;
    init(aURLs: any, unusedParameter: any, aHttpRealm: any, aUsernameIndex: any, aPasswords: any, aUniqueID: any, aTitle: any, otherFieldsArray: any, aMaximumPage: any): void;
    initFromEntry(entry: any): void;
    private allURLsMatch;
    private allPasswordsMatch;
    private usernamesMatch;
    allURLsContainedIn(URLs: any, ignoreURIPathsAndSchemes: any, ignoreURIPaths: any): boolean;
    private allPasswordsContainedIn;
    private allOtherFieldsContainedIn;
    matches(aLogin: any, ignorePasswords: any, ignoreURIPaths: any, ignoreURIPathsAndSchemes: any, ignoreUsernames: any, uriUtils: any): boolean;
    containedIn(aLogin: any, ignorePasswords: any, ignoreURIPaths: any, ignoreURIPathsAndSchemes: any, ignoreUsernames: any): boolean;
    mergeWith(previousStageLogin: any): void;
    asEntry(): any;
}
declare class keeLoginField {
    name: string;
    value: string;
    fieldId: string;
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;
    type: "password" | "text" | "radio" | "select-one" | "checkbox";
    formFieldPage: number;
    constructor();
    toJSON(): any;
    fromJSONifiable(intermediateObject: any): void;
    toSource(): string;
    init(aName: any, aValue: any, aID: any, aType: any, aFormFieldPage: any): void;
    asFormField(isUsername: boolean): any;
}
declare class FrameState {
    logins: keeLoginInfo[];
    url: string;
}
declare class TabState {
    frames: Map<number, FrameState>;
    url: string;
    framePorts: Map<number, browser.runtime.Port>;
    ourIframePorts: Map<number, browser.runtime.Port>;
}
interface SubmittedData {
    url: string;
    usernameIndex: number;
    passwordFields: any[];
    title: string;
    otherFields: any[];
    isPasswordChangeForm: boolean;
    isRegistrationForm: boolean;
    favIconUrl: string;
}
interface SaveData {
    db: string;
    group: string;
    oldLoginUUID: string;
    update: boolean;
    urlMergeMode: number;
}
interface AddonMessage {
    appState?: AppState;
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlHelpSensitiveLogging?: boolean;
    loadUrlUpgradeKee?: boolean;
    addNotification?: KeeNotification;
    removeNotification?: string;
    findMatches?: {
        uri?: string;
        uuid?: string;
    };
    findMatchesResult?: any;
    logins?: keeLoginInfo[];
    action?: Action;
    selectedLoginIndex?: number;
    passwordProfiles?: any[];
    generatedPassword?: string;
    passwordProfile?: string;
    submittedData?: SubmittedData;
    saveData?: SaveData;
    loginEditor?: {
        uniqueID: string;
        DBfilename: string;
    };
    neverSave?: boolean;
    loginsFound?: boolean;
    currentSearchTerm?: string;
}
declare let defaultSiteConfig: SiteConfigIndex;
declare const __publicSuffixList: any;
declare const __punycode: any;
declare const __pslData: any;
declare const chrome: any;
declare const LATEST_VERSION: number;
declare let defaultConfig: Config;
declare class ConfigManager {
    current: Config;
    private readonly maxCharsPerPage;
    private pslInitialised;
    constructor();
    private readonly psl;
    private reloadOnStorageChange;
    setASAP(values: Partial<Config>): void;
    private splitStringToPages;
    save(callback?: any): void;
    load(onLoaded: any): void;
    private fixInvalidConfigData;
    private migrateToLatestVersion;
    private reload;
    siteConfigLookupFor(target: "Domain" | "Host" | "Page", method: "Exact" | "Prefix" | "Regex"): SiteConfigLookup;
    siteConfigFor(url: string): SiteConfig;
    private findAllConfigsFor;
    private deriveConfigFromMatches;
    isFormInteresting(form: HTMLFormElement, conf: SiteConfig, otherFields: keeLoginField[]): boolean;
}
declare let configManager: ConfigManager;
declare class ConfigMigrations {
    migrateToVersion4(current: Config): void;
    migrateToVersion3(current: Config): void;
    migrateToVersion2(current: Config): void;
    private migrateIndividualSiteConfigSettingsToV2;
}
declare class FeatureFlags {
    static readonly offered: string[];
    static readonly required: string[];
    static received: string[];
}
declare class SearchFilter {
    private pslInitialised;
    readonly psl: any;
    attachFilterToSearchBox(searchBox: HTMLInputElement, searchRequestor: any, currentURIs: string[], search: Search): HTMLDivElement;
    private updateSearchFilterStart;
    private updateSearchFilterFinish;
    private getFilterState;
}
declare class SearchConfig {
    version: number;
    searchAllDatabases: boolean;
    searchTitles: boolean;
    searchUsernames: boolean;
    searchGroups: boolean;
    searchURLs: boolean;
    weightTitles: number;
    weightUsernames: number;
    weightGroups: number;
    weightURLs: number;
    maximumResults: number;
    onComplete: () => void;
    onMatch: () => void;
}
declare class Search {
    constructor(appState: AppState, config: Partial<SearchConfig>);
    private configIsValid;
    private makeAsyncTimer;
    private appState;
    private searchConfig;
    private reconfigure;
    private pslInitialised;
    readonly psl: any;
    execute(query: any, onComplete: any, filterDomains: string[]): any[];
    private resolveConfig;
    private validateConfig;
    private tokenise;
    private isMatched;
    private convertItem;
    private treeTraversal;
}
declare class Utils {
    constructor();
    /*******************************************
    / General utility functions
    /*******************************************/
    versionAsInt: (versionArray: any) => number;
    versionAsArray: (versionInt: any) => number[];
    versionAsString: (versionInt: any) => string;
    toHexString: (charCode: any) => string;
    BigIntFromRandom: (byteCount: any) => any;
    hash: <T extends string | Uint8Array>(data: T, outFormat?: string, algorithm?: string) => PromiseLike<string>;
    intToByteArray: (int: any) => number[];
    intArrayToByteArray: (intArray: any) => any[];
    stringToByteArray: (str: any) => Uint8Array;
    base64toByteArrayForHMAC: (input: any, extraLength: any, view?: any) => any;
    base64toByteArray: (input: any) => Uint8Array;
    byteArrayToBase64: (arrayBuffer: any) => string;
    hexStringToByteArray: (hexString: any, byteArray?: any) => any;
    newGUID: () => string;
}
declare let utils: Utils;
