import * as types from "./mutation-types";

export const updateActiveKeePassDatabaseIndex = ({ commit }, payload) => {
    commit(types.updateActiveKeePassDatabaseIndex, payload);
};

export const updateConnected = ({ commit }, payload) => {
    commit(types.updateConnected, payload);
};

export const updateConnectedWebsocket = ({ commit }, payload) => {
    commit(types.updateConnectedWebsocket, payload);
};

export const updateCurrentSearchTerm = ({ commit }, payload) => {
    commit(types.updateCurrentSearchTerm, payload);
};

export const updateKeePassDatabases = ({ commit }, payload) => {
    commit(types.updateKeePassDatabases, payload);
};

export const updateLastKeePassRPCRefresh = ({ commit }, payload) => {
    commit(types.updateLastKeePassRPCRefresh, payload);
};

export const updateLatestConnectionError = ({ commit }, payload) => {
    commit(types.updateLatestConnectionError, payload);
};

export const updateLoginsFound = ({ commit }, payload) => {
    commit(types.updateLoginsFound, payload || false);
};

export const updateNotifications = ({ commit }, payload) => {
    commit(types.updateNotifications, payload);
};

export const updatePasswordProfiles = ({ commit }, payload) => {
    commit(types.updatePasswordProfiles, payload);
};

export const updateGeneratedPassword = ({ commit }, payload) => {
    commit(types.updateGeneratedPassword, payload);
};

export const updateSubmittedData = ({ commit }, payload) => {
    commit(types.updateSubmittedData, payload || null);
};

export const updateSaveState = ({ commit }, payload) => {
    commit(types.updateSaveState, payload || null);
};

export const updateSearchResults = ({ commit }, payload) => {
    commit(types.updateSearchResults, payload || null);
};

export const updateSearchResultWithFullDetails = ({ commit }, payload) => {
    commit(types.updateSearchResultWithFullDetails, payload || null);
};

export const addNotification = ({ commit }, payload) => {
    commit(types.addNotification, payload);
};

export const updateSaveEntryResult = ({ commit }, payload) => {
    commit(types.updateSaveEntryResult, payload || null);
};

export const removeFieldFromActiveEntry = ({ commit }, payload) => {
    commit(types.removeFieldFromActiveEntry, payload || null);
};

export const updateEntryUpdateStartedAtTimestamp = ({ commit }, payload) => {
    commit(types.updateEntryUpdateStartedAtTimestamp, payload || null);
};
