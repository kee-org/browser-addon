import { KeeState } from "./KeeState";
import { SessionType } from "../common/kfDataModel";

export const connected = (state: KeeState) => state.connected;
export const showGeneratePasswordLink = (state: KeeState) => state.connected;
export const saveState = (state: KeeState) => state.saveState;
export const showSaveStart = (state: KeeState) => state.saveState && state.saveState.startedAt && state.saveState.startedAt > new Date(Date.now()-6000);
export const showSaveRecovery = (state: KeeState, getters) => !getters.showSaveStart && state.saveState && state.saveState.startedAt && state.saveState.startedAt > new Date(Date.now()-12000);
export const showMatchedLogins = (state: KeeState) => !!state.loginsFound;
export const showNotifications = (state: KeeState) => state.notifications && !!state.notifications.length;
export const databaseIsOpen = (state: KeeState) => state.connected && !!state.KeePassDatabases.length;
export const showSearchPanel = (state: KeeState, getters) => getters.databaseIsOpen && !getters.showSaveStart;
export const notifications = (state: KeeState) => state.notifications;
export const currentSearchTerm = (state: KeeState) => state.currentSearchTerm;
export const searchResults = (state: KeeState) => state.searchResults;
export const ActiveKeePassDatabaseIndex = (state: KeeState) => state.ActiveKeePassDatabaseIndex;
export const KeePassDatabases = (state: KeeState) => state.KeePassDatabases;

export const databaseName = (state: KeeState) => {
    if (state.KeePassDatabases && state.KeePassDatabases.length && state.ActiveKeePassDatabaseIndex >= 0) {
        const db = state.KeePassDatabases[state.ActiveKeePassDatabaseIndex];
        return db.name ? db.name : db.fileName.replace(/^.*[\\/]/, "");
    }
    return "";
};
export const connectionStatus = (state: KeeState, getters) => {
    if (state.connected) {
        if (state.KeePassDatabases.length > 1) {
            return $STRF("multiplePasswordSourcesEnabled", [state.KeePassDatabases.length.toString()]);
        } else if (state.KeePassDatabases.length == 1) {
            return getters.databaseName;
        } else {
            return $STR("notifyBarLoginToKeePassButton_tip");
        }
    } else {
        return $STR("notifyBarLaunchKeePassButton_tip");
    }
};
export const connectionStatusDetail = (state: KeeState, getters) => {
    if (state.connected) {
        if (state.KeePassDatabases.length > 1) {
            return $STRF("loggedInMultiple_tip", [state.KeePassDatabases.length.toString(), getters.databaseName]);
        } else if (state.KeePassDatabases.length == 1) {
            return $STRF("loggedIn_tip", getters.databaseName);
        } else {
            return $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLoginToKeePassButton_tip");
        }
    } else {
        return $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLaunchKeePassButton_tip");
    }
};
export const showOpenKeePassButton = (state: KeeState) => {
    if (state.connectedWebsocket) {
        const hasWebsocketDBs = state.KeePassDatabases.some(db => db.sessionType === SessionType.Websocket);
        const supportsWebsocketFocus = state.KeePassDatabases.some(db => db.sessionType === SessionType.Websocket &&
                db.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE") >= 0);
        if (!hasWebsocketDBs || supportsWebsocketFocus) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
};
