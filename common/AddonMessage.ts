/// <reference path="../common/AppState.ts" />

interface AddonMessage {
    appState?: AppState;
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
