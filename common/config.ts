class Config {
    version: number;
    autoFillDialogs: boolean;
    autoFillForms: boolean;
    autoSubmitForms: boolean;
    autoFillFormsWithMultipleMatches: boolean;
    autoSubmitFormsWithMultipleMatches: boolean;
    overWriteFieldsAutomatically: boolean;
    tabResultsCacheEnabled: boolean;
    logLevel: number;
    siteConfig: { url: string, config: {}}[];
    searchAllOpenDBs: boolean;
    KeePassRPCWebSocketPort: number;
    keePassDBToOpen: string;
    keePassMRUDB: string;
    KPRPCUsername: string;
    connSLClient: number;
    connSLServerMin: number;
    KPRPCStoredKeys: string[];
    rememberMRUDB: boolean;
    logSensitiveData: boolean;
}
