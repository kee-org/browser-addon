type SiteConfigMethod = "Exact" | "Prefix" | "Regex";
type SiteConfigTarget = "Domain" | "Host" | "Page";
type SiteConfigNodeType = "Migration" | "User" | "Default";

class FormMatchConfig {
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

class SiteConfig {
    whiteList?: FormMatchConfig;
    blackList?: FormMatchConfig;
    preventSaveNotification?: boolean;
}

class SiteConfigNode {
    config: SiteConfig;
    matchWeight: number; // help to decide which config to use when more than one matches current URL
    source: SiteConfigNodeType;
}

class SiteConfigLookup {
    [key: string]: SiteConfigNode;
}

class SiteConfigIndex {
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

class Config {
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
    KPRPCStoredKeys: {[key: string]: string};
    lastConnectedToKeePass: string;
    listAllOpenDBs: boolean;
    logLevel: number;
    logMethodConsole: boolean;
    logMethodFile: boolean;
    logSensitiveData: boolean;
    metricsUsageDisabled: boolean;
    metricsUserId: string;
    mruGroup: {[key: string]: string};
    notifyWhenEntryUpdated: boolean;
    notifyWhenLateDiscovery: boolean;
    notifyWhenLoggedOut: boolean;
    overWriteFieldsAutomatically: boolean;
    rememberMRUDB: boolean;
    rememberMRUGroup: boolean;
    saveFavicons: boolean;
    searchAllOpenDBs: boolean;
    siteConfig: SiteConfigIndex;
    config: { url: string, config: {} }[];
    tutorialProgress: string;
    version: number; // default is incremented when changes are introduced that require data migration
    triggerChangeInputEventAfterFill: boolean;
    autoSubmitNetworkAuthWithSingleMatch: boolean;
    searchNetworkAuth: boolean;
    portConnectionDelay: number; // deprecated
    notificationCountGeneric: number;
    notificationCountSavePassword: number;
    currentSearchTermTimeout: number;
    notifyPasswordAvailableForPaste: boolean;
    animateWhenOfferingSave: boolean;
}
