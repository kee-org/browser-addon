import { copyStringToClipboard } from "./copyStringToClipboard";
import { keeLoginInfo } from "../common/kfDataModel";
import { KeeLog } from "../common/Logger";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";

export class MatchedLoginsPanel {

    constructor (private myPort: browser.runtime.Port,
        private closePanel: () => void,
        private parentFrameId: number) {}

    public createNearNode (node: HTMLElement, logins) {
        const container = document.createElement("div");
        container.id = "Kee-MatchedLoginsList";
        const list = document.createElement("ul");
        this.setLogins(logins, list);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);

        return container;
    }

    private setLogins (logins, container)
    {
        logins.sort((a, b) => b.relevanceScore - a.relevanceScore);
        this.setLoginsAllMatches(logins, container);
    }

    private setLoginsAllMatches (logins: keeLoginInfo[], container) {
        KeeLog.debug("setting " + logins.length + " matched logins");

        // add every matched login to the container(s)
        for (let i = 0; i < logins.length; i++) {
            const login = logins[i];
            let usernameValue = "";
            let usernameDisplayValue = "[" + $STR("noUsername_partial_tip") + "]";
            let usernameName = "";
            let usernameId = "";
            const displayGroupPath = login.database.name + "/" + login.parentGroup.path;

            if (login.usernameIndex != null && login.usernameIndex != undefined && login.usernameIndex >= 0
                && login.otherFields != null && login.otherFields.length > 0) {
                const field = login.otherFields[login.usernameIndex];

                usernameValue = field.value;
                if (usernameValue != undefined && usernameValue != null && usernameValue != "")
                    usernameDisplayValue = usernameValue;
                usernameName = field.name;
                usernameId = field.fieldId;
            }

            const loginItem = document.createElement("li");
            loginItem.className = "";
            loginItem.style.backgroundImage = "url(data:image/png;base64," + login.iconImageData + ")";
            loginItem.dataset.filename = login.database.fileName;
            loginItem.dataset.frameKey = login.frameKey;
            loginItem.dataset.formIndex = login.formIndex.toString();
            loginItem.dataset.loginIndex = login.loginIndex.toString();
            loginItem.dataset.uuid = login.uniqueID;
            loginItem.title = $STRF("matchedLogin_tip", [login.title, displayGroupPath, usernameDisplayValue]);
            loginItem.tabIndex = i == 0 ? 0 : -1;

            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);

            const loginContextActions = this.createContextActions(login);
            loginItem.appendChild(loginContextActions);

            loginItem.addEventListener("keydown", e => this.keyboardNavHandler(e), false);
            loginItem.addEventListener("click", function (event) {
                event.stopPropagation();
                if (event.button == 0 || event.button == 1)
                    this.dispatchEvent(new Event("keeCommand"));
            }, false);
            loginItem.addEventListener("contextmenu", event => {
                event.stopPropagation();
                event.preventDefault();
                this.showContextActions(loginContextActions);
            }, false);
            loginItem.addEventListener("keeCommand", event => {
                this.myPort.postMessage({
                    action: Action.ManualFill,
                    selectedLoginIndex: (event.currentTarget as any).dataset.loginIndex,
                    frameId: this.parentFrameId });
            }, false);
            loginItem.addEventListener("mouseenter", e => this.onMouseEnterLogin(e), false);
            loginItem.addEventListener("mouseleave", e => this.onMouseLeaveLogin(e), false);

            container.appendChild(loginItem);
        }
    }

    private keyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new Event("keeCommand"));
                break;
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLLIElement).focus();
                }
                break;
            case 38: // up
                event.preventDefault();
                event.stopPropagation();
                if (target.previousElementSibling) {
                    (target.previousElementSibling as HTMLLIElement).focus();
                }
                break;
            case 27: // esc
                event.preventDefault();
                event.stopPropagation();
                this.closePanel();
                break;
            case 93: // context
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new Event("contextmenu"));
                break;
        }
    }

    public showContextActions (element: Element) {
        element.classList.remove("disabled");
        element.classList.add("enabled");
    }

    private createContextActions (this: MatchedLoginsPanel, kfl: keeLoginInfo) {
        const loginContextActions = document.createElement("div");
        loginContextActions.classList.add("disabled");

        const editButton = document.createElement("button");
        editButton.textContent = $STR("Logins_Context_Edit_Login_label");
        //"chrome://kee/skin/pencil.png"
        editButton.addEventListener("click", event => {
            event.stopPropagation();
            event.preventDefault();
            this.myPort.postMessage({loginEditor: { uniqueID: kfl.uniqueID, DBfilename: kfl.database.fileName}} as AddonMessage);
            this.myPort.postMessage({action: Action.CloseAllPanels} as AddonMessage);
        }, false);
        editButton.addEventListener("keydown", event => {
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
                copyStringToClipboard(usernameField.value);
                this.myPort.postMessage({action: Action.CloseAllPanels} as AddonMessage);
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
                copyStringToClipboard(passwordField.value);
                this.myPort.postMessage({action: Action.CloseAllPanels} as AddonMessage);
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
                            copyStringToClipboard(o.value);
                            this.myPort.postMessage({action: Action.CloseAllPanels} as AddonMessage);
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
                            copyStringToClipboard(p.value);
                            this.myPort.postMessage({action: Action.CloseAllPanels} as AddonMessage);
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

    public onMouseEnterLogin (event) {
        const optionsMenuTrigger = document.createElement("div");
        optionsMenuTrigger.addEventListener("click", evt => {
            evt.preventDefault();
            evt.stopPropagation();
            this.showContextActions((evt.currentTarget as any).parentElement.getElementsByTagName("div")[0]);
        }, false);
        optionsMenuTrigger.setAttribute("id", "Kee-optionsMenuTrigger");
        event.target.appendChild(optionsMenuTrigger);
    }

    public onMouseLeaveLogin (event) {
        const optionsMenuTrigger = document.getElementById("Kee-optionsMenuTrigger");
        event.target.removeChild(optionsMenuTrigger);
    }
}
