import * as types from "./mutation-types";

updateActiveKeePassDatabaseIndex (payload) {
    this.updateActiveKeePassDatabaseIndex(payload);
},

updateConnected (payload) {
    this.updateConnected(payload);
},

updateConnectedWebsocket (payload) {
    this.updateConnectedWebsocket(payload);
},

updateCurrentSearchTerm (payload) {
    this.updateCurrentSearchTerm(payload);
},

updateKeePassDatabases (payload) {
    this.updateKeePassDatabases(payload);
},

updateLastKeePassRPCRefresh (payload) {
    this.updateLastKeePassRPCRefresh(payload);
},

updateLatestConnectionError (payload) {
    this.updateLatestConnectionError(payload);
},

updateLoginsFound (payload) {
    this.updateLoginsFound(payload || false);
},

updateNotifications (payload) {
    this.updateNotifications(payload);
},

updatePasswordProfiles (payload) {
    this.updatePasswordProfiles(payload);
},

updateGeneratedPassword (payload) {
    this.updateGeneratedPassword(payload);
},

updateSubmittedData (payload) {
    this.updateSubmittedData(payload || null);
},

updateSaveState (payload) {
    this.updateSaveState(payload || null);
},

updateSearchResults (payload) {
    this.updateSearchResults(payload || null);
},

updateSearchResultWithFullDetails (payload) {
    this.updateSearchResultWithFullDetails(payload || null);
},

addNotification (payload) {
    this.addNotification(payload);
},

updateSaveEntryResult (payload) {
    this.updateSaveEntryResult(payload || null);
},

removeFieldFromActiveEntry (payload) {
    this.removeFieldFromActiveEntry(payload || null);
},

updateEntryUpdateStartedAtTimestamp (payload) {
    this.updateEntryUpdateStartedAtTimestamp(payload || null);
},
