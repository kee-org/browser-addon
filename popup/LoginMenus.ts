import { AddonMessage } from "../common/AddonMessage";
import { keeLoginInfo } from "../common/kfDataModel";

export class LoginMenus {

    constructor (private myPort: browser.runtime.Port) {}

    private copyStringToClipboard (value) {
        const copyFrom = document.createElement("textarea");
        copyFrom.textContent = value;
        const body = document.getElementsByTagName("body")[0];
        body.appendChild(copyFrom);
        copyFrom.select();
        document.execCommand("copy");
        body.removeChild(copyFrom);
    }

    public showContextActions (uuid: string, dbFileName: string) {
        this.myPort.postMessage({findMatches: { uuid: uuid, DBfilename: dbFileName}} as AddonMessage);
    }

    public createContextActions (kfl: keeLoginInfo) {
        const loginContextActions = document.createElement("div");
        loginContextActions.classList.add("contextActions");

        const editButton = document.createElement("button");
            editButton.textContent = $STR("Logins_Context_Edit_Login_label");
            //"chrome://kee/skin/pencil.png"
            editButton.addEventListener("click", event => {
                event.stopPropagation();
                event.preventDefault();
                this.myPort.postMessage({loginEditor: { uniqueID: kfl.uniqueID, DBfilename: kfl.database.fileName}} as AddonMessage);
            }, false);
            editButton.addEventListener("keyup", event => {
                if (event.keyCode === 13) editButton.click();
            });
            loginContextActions.appendChild(editButton);

        const otherFieldCount = (kfl.otherFields != null && kfl.otherFields.length > 0) ? kfl.otherFields.length : 0;
        const usernameField = (otherFieldCount > 0) ? kfl.otherFields[kfl.usernameIndex] : null;
        const passwordFieldCount = (kfl.passwords != null && kfl.passwords.length > 0) ? kfl.passwords.length : 0;
        const passwordField = (passwordFieldCount > 0) ? kfl.passwords[0] : null;

        if (usernameField != null)
        {
            const button = document.createElement("button");
            button.textContent = $STR("copy_username_label");
            //"chrome://kee/skin/copy.png",
            button.addEventListener("click", event => {
                event.stopPropagation();
                event.preventDefault();
                this.copyStringToClipboard(usernameField.value);
            }, false);
            button.addEventListener("keydown", event => {
                if (event.keyCode === 13) button.click();
            });
            loginContextActions.appendChild(button);
        }

        if (passwordField != null) {
            const button = document.createElement("button");
            button.textContent = $STR("copy_password_label");
            //"chrome://kee/skin/copy.png",
            button.addEventListener("click", event => {
                event.stopPropagation();
                event.preventDefault();
                this.copyStringToClipboard(passwordField.value);
            }, false);
            button.addEventListener("keydown", event => {
                if (event.keyCode === 13) button.click();
            });
            loginContextActions.appendChild(button);
        }
        if (otherFieldCount > 1 || passwordFieldCount > 1) {

            if (otherFieldCount > 1) {
                kfl.otherFields.forEach((o, i) => {
                    if (i != kfl.usernameIndex && o.type != "checkbox") {
                        const button = document.createElement("button");
                        button.textContent = $STR("copy") + " " + o.name + " (" + o.fieldId + ")";
                        //"chrome://kee/skin/copy.png",
                        button.addEventListener("click", event => {
                            event.stopPropagation();
                            event.preventDefault();
                            this.copyStringToClipboard(o.value);
                        }, false);
                        button.addEventListener("keydown", event => {
                            if (event.keyCode === 13) button.click();
                        });
                        loginContextActions.appendChild(button);
                    }
                });
            }
            if (passwordFieldCount > 1) {
                kfl.passwords.forEach((p, i) => {
                    if (i != 0 && p.type != "checkbox") {
                        const button = document.createElement("button");
                        button.textContent = $STR("copy") + " " + p.name + " (" + p.fieldId + ")";
                        //"chrome://kee/skin/copy.png",
                        button.addEventListener("click", event => {
                            event.stopPropagation();
                            event.preventDefault();
                            this.copyStringToClipboard(p.value);
                        }, false);
                        button.addEventListener("keydown", event => {
                            if (event.keyCode === 13) button.click();
                        });
                        loginContextActions.appendChild(button);
                    }
                });
            }
        }
        return loginContextActions;
    }
    public hideContextMenuButton (node) {
        const optionsMenuTrigger = document.getElementById("Kee-optionsMenuTrigger");
        node.removeChild(optionsMenuTrigger);
    }

    public onMouseEnterLogin (event) {
        // Don't do anything if the context buttons are already showing
        if (event.target.querySelector("button") !== null) return;

        const optionsMenuTrigger = document.createElement("div");
        optionsMenuTrigger.addEventListener("click", evt => {
            evt.preventDefault();
            evt.stopPropagation();
            const dataset = (evt.target as any).parentElement.dataset;
            this.showContextActions(dataset.uuid, dataset.filename);
        }, false);
        optionsMenuTrigger.setAttribute("id", "Kee-optionsMenuTrigger");
        event.target.appendChild(optionsMenuTrigger);
    }

    public onMouseLeaveLogin (event) {
        const optionsMenuTrigger = document.getElementById("Kee-optionsMenuTrigger");
        if (!optionsMenuTrigger) return;
        event.target.removeChild(optionsMenuTrigger);
    }
}
