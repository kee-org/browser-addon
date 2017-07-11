/// <reference path="../common/AppState.ts" />
/// <reference path="../common/TabState.ts" />
/// <reference path="../common/SubmittedData.ts" />
/// <reference path="../common/SaveData.ts" />

interface AddonMessage {
    appState?: AppState;
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlHelpSensitiveLogging?: boolean;
    removeNotification?: number;
    findMatches?: { uri: string };
    findMatchesResult?: any;
    logins?: keeFoxLoginInfo[];
    action?: "primary" | "detectForms" | "manualFill" | "generatePassword" | "closeAllPanels" | "showMatchedLoginsPanel" | "removeSubmittedData";
    selectedLoginIndex?: number;
    passwordProfiles: any[];
    generatedPassword: string;
    passwordProfile: string;
    submittedData?: SubmittedData;
    saveData?: SaveData;
    loginEditor?: { uniqueID: string, DBfilename: string};
}
