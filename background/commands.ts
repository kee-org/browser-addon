/// <reference path="../common/Logger.ts" />

"use strict";

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
            "name": "showMenuKeeFox",
            "description": "KeeFox_Menu-Button.tip",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 49, // '1'
            "contextLocationFlags": 0,
            "speech": {},
            "gesture": {},
            "label": "KeeFox_Menu-Button.label",
            "tooltip": "KeeFox_Menu-Button.tip",
            "accesskey": ""
            // global - main browseraction association
        },
        {
            "name": "showMenuChangeDatabase",
            "description": "KeeFox_Menu-Button.changeDB.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 53, // '5'
            "contextLocationFlags": this.CONTEXT_SUB,
            "speech": {},
            "gesture": {},
            "label": "KeeFox_Menu-Button.changeDB.label",
            "tooltip": "KeeFox_Menu-Button.changeDB.tip",
            "accesskey": ""
            // no. Only makes sense in world where main panel can be given focus programatically.
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
        },
        {
            "name": "showMenuLogins",
            "description": "KeeFox_Logins-Button.label",
            "keyboardModifierFlags": this.MOD_DEFAULT,
            "key": 51, // '3'
            "contextLocationFlags": 0,
            "speech": {},
            "gesture": {},
            "label": "KeeFox_Logins-Button.label",
            "tooltip": "KeeFox_Logins-Button.tip",
            "accesskey": ""
            // no. user should use main browseraction global instead.
        }
//        {
//            "name": "autoTypeHere",
//            "description": $STR("KeeFox-auto-type-here.label"),
//            "keyboardModifierFlags": this.MOD_DEFAULT,
//            "key": "4",
//            "contextLocationFlags": this.CONTEXT_INPUT,
//            "speech": {},
//            "gesture": {},
//            "label": $STR("KeeFox-auto-type-here.label"),
//            "tooltip": $STR("KeeFox-auto-type-here.tip"),
//            "accesskey": ""
//        }
        ];
    };

    // Hard coded set of command conditions that can determine whether a given command is
    // allowed to run (or whether a possibly lower priority command can run instead)
    // sanity checks for valid state should be performed in the main action if you don't
    // want an alternative action to execute instead
    // If a condition evaluates to false then it won't be displayed on a context menu
    conditions = {
        loginToKeePass: function ()
        {
            return keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex == -1;
        },
        fillMatchedLogin: function ()
        {
            if (!keefox_org.appState.connected || keefox_org.appState.ActiveKeePassDatabaseIndex == -1)
                return false;
            //TODO:c: establish if 1 login was found
            return true;
        },
        showMenuMatchedLogins: function (target)
        {
            if (!keefox_org.appState.connected || keefox_org.appState.ActiveKeePassDatabaseIndex == -1)
                return false;
            //TODO:c: establish if > 1 logins were found
            return true;
        },
        generatePassword: function ()
        {
            return keefox_org.appState.connected;
        },
        detectForms: function ()
        {
            return keefox_org.appState.connected && keefox_org.appState.ActiveKeePassDatabaseIndex >= 0;
        },
        showMenuGeneratePassword: function ()
        {
            return keefox_org.appState.connected;
        }
    };

    // Hard coded set of command functions that don't care how they were invoked
    actions = {
        showMenuKeeFox: function ()
        {
            keefox_win.panel.displayPanel();
            keefox_win.panel.hideSubSections();
        },
        loginToKeePass: function ()
        {
            keefox_org.loginToKeePass();
        },
        detectForms: function ()
        {
            //var currentGBrowser = win.gBrowser;
            // Notify all parts of the UI that might need to clear their matched logins data
            keefox_win.mainUI.resetSearchInterface();
            keefox_win.mainUI.removeLogins();
            // win.gBrowser.selectedBrowser.messageManager.sendAsyncMessage("keefox:findMatches", {
            //     autofillOnSuccess: true,
            //     autosubmitOnSuccess: false,
            //     notifyUserOnSuccess: false
            // });
        },
        generatePassword: function ()
        {

            keefox_win.panel.displayPanel();
            keefox_win.panel.hideSubSections();
            keefox_win.panel.showSubSectionGeneratePassword();
        },
        fillMatchedLogin: function ()
        {
            //TODO:c: implement
            return;
        },
        showMenuMatchedLogins: function (target)
        {
            //TODO:c: implement
        },
        autoTypeHere: function ()
        {

        }
    };

    init = function ()
    {
        this.setDefaultCommands();
        this.load();
        this.resolveConfiguration();
    };

    kbEventHandler = function (e)
    {
        //TODO:2: Can we find the context from the event?

        //let keefox_org = keefox_org;

        // establish which key was pressed
        // let key = e.keyCode;

        // let modifierIndex = (e.ctrlKey ? keefox_org.commandManager.MOD_CTRL : 0) |
        //                     (e.altKey ? keefox_org.commandManager.MOD_ALT : 0) |
        //                     (e.shiftKey ? keefox_org.commandManager.MOD_SHIFT : 0) |
        //                     (e.metaKey ? keefox_org.commandManager.MOD_META : 0);
        // let keyConfig = keefox_org.commandManager.activeKeys[modifierIndex][key];
        // if (keyConfig)
        // {
        //     for (let i=0; i<keyConfig.length; i++)
        //     {
        //         let commandName = keyConfig[i];
        //         if (typeof keefox_org.commandManager.conditions[commandName] === 'function')
        //             if (!keefox_org.commandManager.conditions[commandName]())
        //                 continue;
        //         keefox_org._KFLog.debug("Executing command action: " + commandName);
        //         //TODO:2: Pass event target information to action
        //         keefox_org.commandManager.actions[commandName]();
        //         break;
        //     }
        // }
    };

    // set of keys we are interested in listening to. KB listening events are always passed through to our event handler so we use this 2d "array" to quickly determine if we are interested in the particular key combination
    // the user has just fired. The array is initialised in setupListeners()
    activeKeys = [];

    // No point in registering a listener if we end up not wanting to respond to any events
    listenToKeyboard = false;

    resolveConfiguration = function ()
    {
        // initialise every possible modifier key combination (saves us time and complication when processing a key event)
        this.activeKeys = [];

        for (let i=0; i<(this.MOD_SHIFT | this.MOD_ALT | this.MOD_CTRL | this.MOD_META); i++)
            this.activeKeys[i] = {};

        for (let i=0; i<this.commands.length; i++)
        {
            // Not interested in keyboard events for this command unless we have a keyboard key configured
            if (this.commands[i].key != undefined && this.commands[i].key != null && this.commands[i].key > 0)
            {
                if (!(this.activeKeys[this.commands[i].keyboardModifierFlags][this.commands[i].key] instanceof Array))
                    this.activeKeys[this.commands[i].keyboardModifierFlags][this.commands[i].key] = [];
                this.activeKeys[this.commands[i].keyboardModifierFlags][this.commands[i].key].push(this.commands[i].name);
                this.listenToKeyboard = true;
            }
        }
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

    load = function ()
    {
        this._KFLog.debug("Loading commands");
        //TODO:c:reimplement
        // var prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        // var prefBranch = prefService.getBranch("extensions.keefox@chris.tomlinson.");

        // try
        // {
        //     var prefData = prefBranch.getComplexValue("commands", Ci.nsISupportsString).data;
        //     var coms = JSON.parse(prefData);
        //     var currentVersion = prefBranch.getIntPref("commandsVersion");
        //     // Backwards migrations are not supported
        //     if (currentVersion < this.commandsConfigVersion)
        //         this.migrateConfig(currentVersion, this.commandsConfigVersion, coms);
        //     else
        //         this.commands = coms;
        // } catch (ex) {
        //     var coms = JSON.parse(JSON.stringify(this.default_commands)); //TODO:2: faster clone? https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ?
        //     this.commands = coms;
        //     this.save();
        // }
    };

    save = function ()
    {
        this._KFLog.debug("Saving commands");

        //TODO:c:reimplement
        // var prefService = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefService);
        // var prefBranch = prefService.getBranch("extensions.keefox@chris.tomlinson.");

        // var str = Cc["@mozilla.org/supports-string;1"].createInstance(Ci.nsISupportsString);
        // str.data = JSON.stringify(this.commands);
        // prefBranch.setComplexValue("commands", Ci.nsISupportsString, str);

        // prefBranch.setIntPref("commandsVersion",this.commandsConfigVersion);
    };

    migrateConfig = function (currentVersion, newVersion, currentConfig)
    {
        // If anything goes wrong with the migration, we just let the catch
        // in load() deal with it (reset to the latest defaults)

        // Nice and easy to start with; we have only one possible migration path ...
        if (currentVersion == 1 && newVersion == 2)
        {
            // ... and that migration path makes no modifications to the default
            // configuration of the handful of commands that were supported in
            // version 1 so we just start with the default v2 config and overwrite
            // some select objects from the existing configuration
            const newConfig = this.default_commands;
            const commandsToMigrate = ["installKeeFox", "launchKeePass", "loginToKeePass",
                "showMenuMatchedLogins", "fillMatchedLogin", "showMenuKeeFox", "showMenuLogins"];
            const mergedConfig = newConfig.map(function (newItem) {
                if (commandsToMigrate.indexOf(newItem.name) >= 0)
                    return currentConfig.filter(function (currentItem) {
                        return currentItem.name === newItem.name;
                    })[0];
                else
                    return newItem;
            });
            this.commands = mergedConfig;
            this.save();
        } else if (currentVersion == 2 && newVersion == 3)
        {
            //TODO:c: Delete loads of useless config entries
        }
    };

}

//TODO:c: need to do this later I expect
// initialise the command system
//var commandManager = new KFCommands;
//commandManager.init();
