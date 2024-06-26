import { Action } from "./Action";
import { FrameState } from "./FrameState";
import { KeeNotification } from "./KeeNotification";
import { PasswordProfile } from "./model/PasswordProfile";
import type { SubmittedData } from "./SubmittedData";
import type { KeeState } from "../store/KeeState";
import { Entry } from "./model/Entry";
import { Mutation } from "../store/Mutation";

// Do not use classes on this interface unless they are simple data
// objects that can be represented in JSON. This interface is used
// by the browser cross-process communication layer which we have
// no control over and thus we can only avoid bugs by ensuring that
// this rule is followed. In cases where a class with additional
// functionality is required, manually new up each object as and
// when required or use static methods instead.

export interface AddonMessage {
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlUpgradeKee?: boolean;
    addNotification?: KeeNotification;
    removeNotification?: string;
    findMatches?: { uri?: string; uuid?: string; DBfilename?: string };
    findMatchesResult?: Entry[];
    entries?: Entry[];
    action?: Action;
    selectedEntryIndex?: number;
    passwordProfiles?: PasswordProfile[];
    generatedPassword?: string;
    passwordProfile?: string;
    submittedData?: SubmittedData;
    loginEditor?: { uuid: string; DBfilename: string };
    loginsFound?: boolean;
    initialState?: KeeState;
    resetState?: KeeState;
    mutation?: Mutation;
    url?: string;
    copyToClipboard?: string;
}
