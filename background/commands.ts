/// <reference path="../common/Logger.ts" />

/*
TODO:c: will need to split this into commands that can work inside content pages and those that are global via commands manifest settings
*/

class KFCommands {
    _KFLog = KeeFoxLog;

    MOD_SHIFT = 1;
    MOD_ALT = 2;
    MOD_CTRL = 4;
    MOD_META = 8;
    CONTEXT_MAIN = 1;
    CONTEXT_SUB = 2;
    CONTEXT_INPUT = 4;
    CONTEXT_BUTTON = 8;

    MOD_DEFAULT = 5;

    default_commands = [];
    commandsConfigVersion = 2;

    setDefaultCommands = function ()
    {
        this.default_commands = [
        {
            "name": "loginToKeePass",
            "description": "loggedOut.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 50,
            "contextLocationFlags": 0,
            "speech": {},
            "gesture": {},
            "label": "loggedOut.label",
            "tooltip": "loggedOut.tip",
            "accesskey": ""
            // global.
        },
        {
            "name": "showMenuMatchedLogins",
            "description": "KeeFox-matched-logins.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 50,
            "contextLocationFlags": this.CONTEXT_SUB | this.CONTEXT_MAIN,
            "speech": {},
            "gesture": {},
            "label": "KeeFox-matched-logins.label",
            "tooltip": "", // No tooltip for a menu
            "accesskey": ""
            // global. can make it show a "select login" dialog attached to the form (or top left if psuedo form)
        },
        {
            "name": "fillMatchedLogin",
            "description": "KeeFox-placeholder-for-best-match",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 50,
            "contextLocationFlags": this.CONTEXT_SUB | this.CONTEXT_MAIN,
            "speech": {},
            "gesture": {},
            "label": "", // will be replaced with content from the best matched login
            "tooltip": "", // will be replaced with content from the best matched login
            "accesskey": ""
            // global.
        },
        {
            "name": "detectForms",
            "description": "KeeFox_Menu-Button.fillCurrentDocument.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 54, // '6'
            "contextLocationFlags": this.CONTEXT_SUB | this.CONTEXT_INPUT,
            "speech": {},
            "gesture": {},
            "label": "KeeFox_Menu-Button.fillCurrentDocument.label",
            "tooltip": "KeeFox_Menu-Button.fillCurrentDocument.tip",
            "accesskey": ""
            // page.
        },
        {
            "name": "generatePassword",
            "description": "KeeFox_Menu-Button.copyNewPasswordToClipboard.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 52, // '4'
            "contextLocationFlags": this.CONTEXT_SUB | this.CONTEXT_INPUT | this.CONTEXT_MAIN,
            "speech": {},
            "gesture": {},
            "label": "KeeFox_Menu-Button.copyNewPasswordToClipboard.label",
            "tooltip": "KeeFox_Menu-Button.copyNewPasswordToClipboard.tip",
            "accesskey": ""
            // page. Option to insert into text or password field if one is focussed when generator panel is displayed.
        }
        ];
    };

    init = function ()
    {
        browser.commands.onCommand.addListener(command => {
            switch (command) {
                case "detect-forms":
                    if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                case "primary-action":
                    if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {
                        keefox_org.loginToKeePass();
                    } else {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "primary" });
                        }, this);
                    }
                break;
                case "generate-password":
                    if (keefox_org.appState.connected) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "generatePassword" });
                        }, this);
                    }
                break;
            }
        });

        browser.contextMenus.onClicked.addListener((info, tab) => {
            switch (info.menuItemId) {
                case "detect-forms":
                    if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "detectForms" });
                        }, this);
                    }
                break;
                // case "primary-action":
                //     if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {
                //         keefox_org.loginToKeePass();
                //     } else {
                //         keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                //                 port.postMessage({ action: "primary" });
                //         }, this);
                //     }
                // break;
                case "generate-password":
                    if (keefox_org.appState.connected) {
                        keefox_org.ports.tabs[keefox_org.foregroundTabId].forEach(port => {
                                port.postMessage({ action: "generatePassword" });
                        }, this);
                    }
                break;
            }
        });
    };

    public setupContextMenuItems (connected: boolean, dbCount: number, logins) {
        if (keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0) {
            try {
                browser.contextMenus.create({
                    id: "detect-forms",
                    title: $STR("Menu_Button_fillCurrentDocument_label"),
                    contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
                });
            } catch (e) {
                // try again with Chrome-supported contexts
                browser.contextMenus.create({
                    id: "detect-forms",
                    title: $STR("Menu_Button_fillCurrentDocument_label"),
                    contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                });
            }
        }

        if (keefox_org.appState.connected) {
            try {
                browser.contextMenus.create({
                    id: "generate-password",
                    title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                    contexts: [ "editable", "frame", "image", "link", "page", "password", "selection" ]
            });
            } catch (e) {
                // try again with Chrome-supported contexts
                browser.contextMenus.create({
                    id: "generate-password",
                    title: $STR("Menu_Button_copyNewPasswordToClipboard_label"),
                    contexts: [ "editable", "frame", "image", "link", "page", "selection" ]
                });
            }
        }

        // if (keefox_org.appState.ActiveKeePassDatabaseIndex < 0) {

        // }
    }
}

//TODO:c: need to do this later I expect
// initialise the command system
let commandManager = new KFCommands();
commandManager.init();
