// import { KeeState } from "./KeeState";
// import { SessionType } from "../common/SessionType";

// const dsafdasf = {
// showGeneratePasswordLink: (state: KeeState) => state.connected,
// showMatchedLogins: (state: KeeState) => !!state.loginsFound,
// showNotifications: (state: KeeState) =>
//     state.notifications && !!state.notifications.length,
// databaseIsOpen: (state: KeeState) =>
//     state.connected && !!state.KeePassDatabases.length,

// databaseName: (state: KeeState) => {
//     if (
//         state.KeePassDatabases &&
//         state.KeePassDatabases.length &&
//         state.ActiveKeePassDatabaseIndex >= 0
//     ) {
//         const db = state.KeePassDatabases[state.ActiveKeePassDatabaseIndex];
//         return db.name ? db.name : db.fileName.replace(/^.*[\\/]/, "");
//     }
//     return "";
// },
// connectionStatus (state: KeeState): string {
//     if (state.connected) {
//         if (state.KeePassDatabases.length > 1) {
//             return $STRF("multiplePasswordSourcesEnabled", [
//                 state.KeePassDatabases.length.toString()
//             ]);
//         } else if (state.KeePassDatabases.length == 1) {
//             return this.databaseName;
//         } else {
//             return $STR("notifyBarLoginToKeePassButton_tip");
//         }
//     } else {
//         return $STR("notifyBarLaunchKeePassButton_tip");
//     }
// },
// connectionStatusDetail (state: KeeState): string {
//     if (state.connected) {
//         if (state.KeePassDatabases.length > 1) {
//             return $STRF("loggedInMultiple_tip", [
//                 state.KeePassDatabases.length.toString(),
//                 this.databaseName
//             ]);
//         } else if (state.KeePassDatabases.length == 1) {
//             return $STRF("loggedIn_tip", this.databaseName);
//         }
//     }
//     return $STR("notifyBarLaunchKeePass_label");
// },
// showOpenKeePassButton: (state: KeeState) => {
//     if (state.connectedWebsocket) {
//         const hasWebsocketDBs = state.KeePassDatabases.some(
//             db => db.sessionType === SessionType.Websocket
//         );
//         const supportsWebsocketFocus = state.KeePassDatabases.some(
//             db =>
//                 db.sessionType === SessionType.Websocket &&
//                 db.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE") >= 0
//         );
//         if (!hasWebsocketDBs || supportsWebsocketFocus) {
//             return true;
//         } else {
//             return false;
//         }
//     } else {
//         return false;
//     }
// }
// };
