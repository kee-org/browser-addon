import { AppState } from "./AppState";
import { FrameState } from "./FrameState";
import { VaultAction } from "./VaultAction";
import { Tokens } from "./Tokens";
import { VaultProtocol } from "./VaultProtocol";

export interface VaultMessage {
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
