/// <reference path="../common/AppState.ts" />
/// <reference path="../common/TabState.ts" />

interface AddonMessage {
    appState?: AppState;
    tabState?: TabState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlHelpSensitiveLogging?: boolean;
    removeNotification?: number;
    findMatches?: { uri: string };
    findMatchesResult?: any;
    logins?: keeFoxLoginInfo[];
    action?: "primary" | "detectForms" | "manualFill" | "generatePassword";
    selectedLoginIndex?: number;
}
