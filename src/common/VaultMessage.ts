import { FrameState } from "./FrameState";
import { VaultAction } from "./VaultAction";
import type { Tokens } from "./Tokens";
import { VaultProtocol } from "./VaultProtocol";
import type { KeeState } from "../store/KeeState";
import { Mutation } from "../store/Mutation";

export interface VaultMessage {
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
    initialState?: KeeState;
    mutation?: Mutation;
}
