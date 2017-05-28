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
    };

    contextSubPopupShowing = function (event)
    {
        const children = event.target.ownerDocument.getElementById("keefox-command-context-sub-popup").children;
        for (let i=0; i < children.length; i++)
        {
            const mi = children[i];
            if (mi.id.indexOf("keefox-command-context-") != 0)
                continue;

            //let keefox_org = keefox_org;

            // // Set default visibility for this menu item
            // // Should always be false but just in case...
            // mi.hidden = !(mi.keeFoxValidContexts & keefox_org.commandManager.CONTEXT_SUB);

            // // Update visibility for this menu item based upon the current KeeFox state
            // if (typeof keefox_org.commandManager.conditions[mi.keeFoxCommandName] === 'function')
            //     mi.hidden = mi.hidden || !keefox_org.commandManager.conditions[mi.keeFoxCommandName]();
        }
    };

    contextMainPopupShowing = function (event)
    {
        if (event.target.ownerDocument.defaultView.gContextMenu == null)
            return; // not a context menu (e.g. tooltip)

        const children = event.target.ownerDocument.getElementById("contentAreaContextMenu").children;
        for (let i=0; i < children.length; i++)
        {
            const mi = children[i];
            if (mi.id.indexOf("keefox-command-context-") != 0)
                continue;

           // let keefox_org = keefox_org;

            // // Set default visibility for this menu item
            // let textEnabled = mi.keeFoxValidContexts & keefox_org.commandManager.CONTEXT_INPUT;
            // let mainEnabled = mi.keeFoxValidContexts & keefox_org.commandManager.CONTEXT_MAIN;
            // mi.hidden = !((event.target.ownerDocument.defaultView.gContextMenu.onTextInput && textEnabled)
            //             || (!event.target.ownerDocument.defaultView.gContextMenu.onTextInput && mainEnabled));

            // // Update visibility for this menu item based upon the current KeeFox state
            // if (typeof keefox_org.commandManager.conditions[mi.keeFoxCommandName] === 'function')
            //     mi.hidden = mi.hidden || !keefox_org.commandManager.conditions[mi.keeFoxCommandName]();
        }
    };

    // Setup listeners and context menus for the supplied window object
    setupListeners = function (win)
    {
        for (let i=0; i<this.commands.length; i++)
        {
            //TODO:1.6: ? Need to work on what constitutes a disabled/hidden menu item. need to be invisible and detached in an ideal world.
            if (this.commands[i].contextLocationFlags & this.CONTEXT_MAIN
                || this.commands[i].contextLocationFlags & this.CONTEXT_INPUT
                || this.commands[i].contextLocationFlags & this.CONTEXT_BUTTON)
            {
                // Find any existing node with this command's ID and enable it.
                // nodes can't be disabled again afterwards but that's not a feature we
                // directly expose to the user so a browser restart is an acceptable compromise
                let item = document.getElementById("keefox-command-context-" + this.commands[i].name);
                if (!item)
                {
                    // not found in existing dom structure so lets add it
                    // we only support adding menuitems dynamically like this
                    // i.e. adding sub menu elements needs to be done by ensuring
                    // they are already in the dom before this init happens (e.g. via XUL config)
                    const mi = document.createElement("menuitem");
                    mi.setAttribute("id", "keefox-command-context-" + this.commands[i].name);
                    document.getElementById("contentAreaContextMenu").appendChild(mi);
                    item = mi;
                }
                item.setAttribute("disabled", "false");
                item.setAttribute("label", $STR(this.commands[i].label));
                item.setAttribute("tooltip", $STR(this.commands[i].tooltip));
                if (this.commands[i].image)
                    item.setAttribute("image", this.commands[i].image);
                else
                    item.setAttribute("image", "chrome://keefox/skin/KeeFox16.png");
                item.classList.add("menuitem-iconic");

                // //item.setAttribute("accesskey", this.commands[i].accesskey);
                // item.keeFoxCommandName = this.commands[i].name;
                // item.keeFoxValidContexts = this.commands[i].contextLocationFlags;
                // item.addEventListener("command", function(event) {
                //         let kf = keefox_org;
                //         kf.commandManager.actions[this.keeFoxCommandName]();
                //     }, false);
            }

            //TODO:1.6: repeat for submenu context type

        }

        if (this.listenToKeyboard)
        {
            // attach our keyboard listener
            this._KFLog.debug("Attaching keyboard listener");
            win.addEventListener("keydown", this.kbEventHandler, false);
        } else
        {
            this._KFLog.debug("No need to attach keyboard listener");
        }

    };

    cloneObj = function (obj)
    {
        //TODO:2: improve speed? See http://jsperf.com/clone/5 https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ?
        //TODO:2: Might be useful in a utils location, not just for config manipulation
        return JSON.parse(JSON.stringify(obj));
    };

    commands = [];

}

//TODO:c: need to do this later I expect
// initialise the command system
let commandManager = new KFCommands();
commandManager.init();
