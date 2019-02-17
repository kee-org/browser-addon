/// <reference path="./AppState.ts" />
/// <reference path="./FrameState.ts" />
/// <reference path="./SubmittedData.ts" />
/// <reference path="./VaultAction.ts" />
/// <reference path="./VaultProtocol.ts" />
/// <reference path="./Tokens.ts" />

interface VaultMessage {
    appState?: AppState;
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    action?: VaultAction;
    sessionId?: string;
    features?: string[];
    protocol?: VaultProtocol;
    jsonrpc?: string;
    encryptionNotRequired?: boolean;
    error?: any;
    tokens?: Tokens;
}
