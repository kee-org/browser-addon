import { Action } from "./Action";
import { FrameState } from "./FrameState";
import { KeeNotification } from "./KeeNotification";
import { keeLoginInfo, PasswordProfile } from "./kfDataModel";
import { SubmittedData } from "./SubmittedData";
import { SaveData } from "./SaveData";
import { KeeState } from "../store/KeeState";
import { MutationPayload } from "vuex";

export interface AddonMessage {
    frameState?: FrameState;
    isForegroundTab?: boolean;
    tabId?: number;
    frameId?: number;
    loadUrlUpgradeKee?: boolean;
    addNotification?: KeeNotification;
    removeNotification?: string;
    findMatches?: { uri?: string; uuid?: string; DBfilename?: string };
    findMatchesResult?: any;
    logins?: keeLoginInfo[];
    action?: Action;
    selectedLoginIndex?: number;
    passwordProfiles?: PasswordProfile[];
    generatedPassword?: string;
    passwordProfile?: string;
    submittedData?: SubmittedData;
    saveData?: SaveData;
    loginEditor?: { uniqueID: string; DBfilename: string};
    neverSave?: boolean;
    loginsFound?: boolean;
    initialState?: KeeState;
    resetState?: KeeState;
    mutation?: MutationPayload;
}
