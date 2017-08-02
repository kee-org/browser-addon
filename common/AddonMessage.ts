/// <reference path="../common/AppState.ts" />
/// <reference path="../common/TabState.ts" />
/// <reference path="../common/SubmittedData.ts" />
/// <reference path="../common/SaveData.ts" />
/// <reference path="../common/KeeNotification.ts" />

interface AddonMessage {
    appState?: AppState;
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlHelpSensitiveLogging?: boolean;
    addNotification?: KeeNotification;
    removeNotification?: string;
    findMatches?: { uri: string };
    findMatchesResult?: any;
    logins?: keeLoginInfo[];
    action?: "primary" | "detectForms" | "manualFill" | "generatePassword" | "closeAllPanels" | "showMatchedLoginsPanel" | "removeSubmittedData";
    selectedLoginIndex?: number;
    passwordProfiles: any[];
    generatedPassword: string;
    passwordProfile: string;
    submittedData?: SubmittedData;
    saveData?: SaveData;
    loginEditor?: { uniqueID: string, DBfilename: string};
}
