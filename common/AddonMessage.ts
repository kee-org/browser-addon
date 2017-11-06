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
    loadUrlUpgradeKee?: boolean;
    addNotification?: KeeNotification;
    removeNotification?: string;
    findMatches?: { uri: string };
    findMatchesResult?: any;
    logins?: keeLoginInfo[];
    action?: Action.Primary | Action.DetectForms | Action.ManualFill | Action.GeneratePassword | Action.CloseAllPanels | Action.ShowMatchedLoginsPanel | Action.RemoveSubmittedData | Action.SaveLatestLogin;
    selectedLoginIndex?: number;
    passwordProfiles?: any[];
    generatedPassword?: string;
    passwordProfile?: string;
    submittedData?: SubmittedData;
    saveData?: SaveData;
    loginEditor?: { uniqueID: string, DBfilename: string};
    neverSave?: boolean;
    loginsFound?: boolean;
}
