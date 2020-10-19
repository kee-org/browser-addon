import { copyStringToClipboard } from "../common/copyStringToClipboard";
import { KeeLog } from "../common/Logger";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";
import { Entry } from "../common/model/Entry";

export class MatchedLoginsPanel {
    constructor(
        private myPort: browser.runtime.Port,
        private closePanel: () => void,
        private parentFrameId: number
    ) {}

    public createNearNode(node: HTMLElement, entries: Entry[]) {
        const container = document.createElement("div");
        container.id = "Kee-MatchedLoginsList";
        const list = document.createElement("ul");
        this.setLogins(entries, list);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);

        return container;
    }

    private setLogins(entries: Entry[], container) {
        KeeLog.debug("setting " + entries.length + " matched entries");

        // add every matched entry to the container(s)
        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            let usernameDisplayValue = "[" + $STR("noUsername_partial_tip") + "]";
            const displayGroupPath = entry.database.name + "/" + entry.parentGroup.path;

            const usernameField = Entry.getUsernameField(entry);
            if (usernameField && usernameField.value) {
                usernameDisplayValue = usernameField.value;
            }

            const loginItem = document.createElement("li");
            loginItem.className = "";
            loginItem.style.backgroundImage =
                "url(data:image/png;base64," + entry.icon.iconImageData + ")";
            loginItem.dataset.filename = entry.database.fileName;
            loginItem.dataset.formIndex = entry.formIndex.toString();
            loginItem.dataset.entryIndex = entry.entryIndex.toString();
            loginItem.dataset.uuid = entry.uuid;
            loginItem.title = $STRF("matchedLogin_tip", [
                entry.title,
                displayGroupPath,
                usernameDisplayValue
            ]);
            loginItem.tabIndex = i == 0 ? 0 : -1;

            loginItem.textContent = $STRF("matchedLogin_label", [
                usernameDisplayValue,
                entry.title
            ]);

            const loginContextActions = this.createContextActions(entry);
            loginItem.appendChild(loginContextActions);

            loginItem.addEventListener("keydown", e => this.keyboardNavHandler(e), false);
            loginItem.addEventListener(
                "click",
                function (event) {
                    event.stopPropagation();
                    if (event.button == 0 || event.button == 1) {
                        this.dispatchEvent(new Event("keeCommand"));
                    }
                },
                false
            );
            loginItem.addEventListener(
                "contextmenu",
                event => {
                    event.stopPropagation();
                    event.preventDefault();
                    this.showContextActions(loginContextActions);
                },
                false
            );
            loginItem.addEventListener(
                "keeCommand",
                event => {
                    this.myPort.postMessage({
                        action: Action.ManualFill,
                        selectedEntryIndex: (event.currentTarget as any).dataset.entryIndex,
                        frameId: this.parentFrameId
                    });
                },
                false
            );
            loginItem.addEventListener("mouseenter", e => this.onMouseEnterLogin(e), false);
            loginItem.addEventListener("mouseleave", e => this.onMouseLeaveLogin(e), false);

            container.appendChild(loginItem);
        }
    }

    private keyboardNavHandler(event: KeyboardEvent) {
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

    public showContextActions(element: Element) {
        element.classList.remove("disabled");
        element.classList.add("enabled");
    }

    private createContextActions(this: MatchedLoginsPanel, entry: Entry) {
        const loginContextActions = document.createElement("div");
        loginContextActions.classList.add("disabled");

        const editButton = document.createElement("button");
        editButton.textContent = $STR("Logins_Context_Edit_Login_label");
        //"chrome://kee/skin/pencil.png"
        editButton.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                event.preventDefault();
                this.myPort.postMessage({
                    loginEditor: {
                        uuid: entry.uuid,
                        DBfilename: entry.database.fileName
                    }
                } as AddonMessage);
                this.myPort.postMessage({
                    action: Action.CloseAllPanels
                } as AddonMessage);
            },
            false
        );
        editButton.addEventListener("keydown", event => {
            if (event.keyCode === 13) editButton.click();
        });
        loginContextActions.appendChild(editButton);

        const otherFieldCount = entry.fields.filter(f => f.type !== "password").length ?? 0;
        const usernameField = Entry.getUsernameField(entry);
        const passwordFieldCount = entry.fields.filter(f => f.type === "password").length ?? 0;
        const passwordField = Entry.getPasswordField(entry);

        if (usernameField != null) {
            const button = document.createElement("button");
            button.textContent = $STR("copy_username_label");
            //"chrome://kee/skin/copy.png",
            button.addEventListener(
                "click",
                event => {
                    event.stopPropagation();
                    event.preventDefault();
                    copyStringToClipboard(usernameField.value);
                    this.myPort.postMessage({
                        action: Action.CloseAllPanels
                    } as AddonMessage);
                },
                false
            );
            button.addEventListener("keydown", event => {
                if (event.keyCode === 13) button.click();
            });
            loginContextActions.appendChild(button);
        }

        if (passwordField != null) {
            const button = document.createElement("button");
            button.textContent = $STR("copy_password_label");
            //"chrome://kee/skin/copy.png",
            button.addEventListener(
                "click",
                event => {
                    event.stopPropagation();
                    event.preventDefault();
                    copyStringToClipboard(passwordField.value);
                    this.myPort.postMessage({
                        action: Action.CloseAllPanels
                    } as AddonMessage);
                },
                false
            );
            button.addEventListener("keydown", event => {
                if (event.keyCode === 13) button.click();
            });
            loginContextActions.appendChild(button);
        }
        if (otherFieldCount > 1) {
            entry.fields
                .filter(f => f.type !== "password")
                .forEach((o, i) => {
                    if (i != 0 && o.locators[0].type != "checkbox") {
                        const button = document.createElement("button");
                        button.textContent =
                            $STR("copy") + " " + o.name + " (" + o.locators[0].id + ")";
                        //"chrome://kee/skin/copy.png",
                        button.addEventListener(
                            "click",
                            event => {
                                event.stopPropagation();
                                event.preventDefault();
                                copyStringToClipboard(o.value);
                                this.myPort.postMessage({
                                    action: Action.CloseAllPanels
                                } as AddonMessage);
                            },
                            false
                        );
                        button.addEventListener("keydown", event => {
                            if (event.keyCode === 13) button.click();
                        });
                        loginContextActions.appendChild(button);
                    }
                });
        }
        if (passwordFieldCount > 1) {
            entry.fields
                .filter(f => f.type === "password")
                .forEach((p, i) => {
                    if (i != 0) {
                        const button = document.createElement("button");
                        button.textContent =
                            $STR("copy") + " " + p.name + " (" + p.locators[0].id + ")";
                        //"chrome://kee/skin/copy.png",
                        button.addEventListener(
                            "click",
                            event => {
                                event.stopPropagation();
                                event.preventDefault();
                                copyStringToClipboard(p.value);
                                this.myPort.postMessage({
                                    action: Action.CloseAllPanels
                                } as AddonMessage);
                            },
                            false
                        );
                        button.addEventListener("keydown", event => {
                            if (event.keyCode === 13) button.click();
                        });
                        loginContextActions.appendChild(button);
                    }
                });
        }
        return loginContextActions;
    }

    public onMouseEnterLogin(event) {
        const optionsMenuTrigger = document.createElement("div");
        optionsMenuTrigger.addEventListener(
            "click",
            evt => {
                evt.preventDefault();
                evt.stopPropagation();
                this.showContextActions(
                    (evt.currentTarget as any).parentElement.getElementsByTagName("div")[0]
                );
            },
            false
        );
        optionsMenuTrigger.setAttribute("id", "Kee-optionsMenuTrigger");
        event.target.appendChild(optionsMenuTrigger);
    }

    public onMouseLeaveLogin(event) {
        const optionsMenuTrigger = document.getElementById("Kee-optionsMenuTrigger");
        event.target.removeChild(optionsMenuTrigger);
    }
}
