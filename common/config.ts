
//TODO:c: These might not be useful afterall
class QuerySelectorTemplates {
    public static FormName: { toQS: "form[name=%s]", fromQS: "^form\[name=([^\]]+\]$" };
    public static FormId: { toQS: "form#%s", fromQS: "^form#(.+)$" };
}
// It's much more effecient to batch query selectors into just white or black list queries
// but maybe we'll add support for custom weighting in future like this
class WeightedQuerySelector {
    querySelector: string;
    weight: number;
}

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
    weightedQuerySelectors?: WeightedQuerySelector[];
    whiteList?: FormMatchConfig;
    blackList?: FormMatchConfig;
    preventSaveNotification?: boolean;
}

class SiteConfigNode {
    config: SiteConfig;
    matchWeight: number; // help to decide which config to use when more than one matches current URL
    source: string;
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
    KPRPCStoredKeys: string[];
    lastConnectedToKeePass: string;
    listAllOpenDBs: boolean;
    logLevel: number;
    logMethodConsole: boolean;
    logMethodFile: boolean;
    logSensitiveData: boolean;
    metricsUsageDisabled: boolean;
    metricsUserId: string;
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
    version: number;
    triggerChangeInputEventAfterFill: boolean;
}
