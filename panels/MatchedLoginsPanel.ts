/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/FrameState.ts" />
/// <reference path="../common/AddonMessage.ts" />

class MatchedLoginsPanel {

    public createNearNode (node: HTMLElement, logins) {
        const container = document.createElement("div");
        container.id = "KeeFox-MatchedLoginsList";
        const list = document.createElement("ul");
        this.setLogins(logins, list);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);
    }

    private setLogins (logins, container)
    {
        logins.sort((a, b) => b.relevanceScore - a.relevanceScore);
        this.setLoginsAllMatches(logins, container);
    }

    private setLoginsAllMatches (logins, container) {
        KeeFoxLog.debug("setting " + logins.length + " matched logins");

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
            loginItem.dataset.fileName = login.database.fileName;
            loginItem.dataset.frameKey = login.frameKey;
            loginItem.dataset.formIndex = login.formIndex;
            loginItem.dataset.loginIndex = login.loginIndex;
            loginItem.dataset.uuid = login.uniqueID;
            loginItem.title = $STRF("matchedLogin_tip", [login.title, displayGroupPath, usernameDisplayValue]);
            loginItem.tabIndex = -1;

            //TODO:c: context menus and keyboard nav
            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);
            //loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
            loginItem.addEventListener("mouseup", function (event) {
                event.stopPropagation();
                if (event.button == 0 || event.button == 1)
                    this.dispatchEvent(new Event("keefoxCommand"));
                else if (event.button == 2) {
                  //  keefox_win.panel.addLoginContextActions(document, this.getAttribute("data-uuid"), this.getAttribute("data-fileName"));
                  //  keefox_win.panel.displayContextMenu(keefox_win.panel._currentWindow.document, event, "KeeFox-login-context");
                }
            }, false);
            loginItem.addEventListener("keefoxCommand", function (event) {
                myPort.postMessage({ action: "manualFill", selectedLoginIndex: this.dataset.loginIndex, frameId: parentFrameId });
            }, false);
            // loginItem.addEventListener("keefoxContext", function (event) {
            //     keefox_win.panel.addLoginContextActions(document, this.getAttribute("data-uuid"), this.getAttribute("data-fileName"));
            //     keefox_win.panel.displayContextMenu(keefox_win.panel._currentWindow.document,
            //         { target: event.detail.target, layerX: event.detail.layerX, layerY: event.detail.layerY },
            //         "KeeFox-login-context");
            // }, false);
            loginItem.addEventListener("mouseenter", matchedLoginsPanel.onMouseEnterLogin, false);

            container.appendChild(loginItem);
        }
    }


    public onMouseEnterLogin (event) {
        if (matchedLoginsPanel.contextMenuShowing)
            return;

        const optionsMenuTrigger = document.createElement("div");
        optionsMenuTrigger.addEventListener("mouseup", function (evt) {

            evt.preventDefault();
            evt.stopPropagation();

            KeeFoxLog.debug("mouseup: " + this.parentElement.dataset.uuid + ":" + this.parentElement.dataset.fileName);

            //TODO:c: context menus, etc.
            // keefox_win.panel.addLoginContextActions(document,
            //     this.parentNode.getAttribute('data-uuid'),
            //     this.parentNode.getAttribute('data-fileName'));

            // Anchor to the parent li element because this trigger element will disappear soon
            // keefox_win.panel.displayContextMenu(
            //     keefox_win.panel._currentWindow.document,
            //     {
            //         target: event.target.parentNode,
            //         layerX: this.offsetLeft + event.layerX,
            //         layerY: this.offsetTop + event.layerY
            //     },
            //     'KeeFox-login-context');

        }, false);
        optionsMenuTrigger.setAttribute("id", "KeeFox-optionsMenuTrigger");
        event.target.appendChild(optionsMenuTrigger);
        event.target.removeEventListener("mouseenter", matchedLoginsPanel.onMouseEnterLogin, false);
        event.target.addEventListener("mouseleave", matchedLoginsPanel.onMouseLeaveLogin, false);
    }

    public onMouseLeaveLogin (event) {
        const optionsMenuTrigger = document.getElementById("KeeFox-optionsMenuTrigger");
        event.target.removeChild(optionsMenuTrigger);
        event.target.removeEventListener("mouseleave", matchedLoginsPanel.onMouseLeaveLogin, false);
        event.target.addEventListener("mouseenter", matchedLoginsPanel.onMouseEnterLogin, false);
    }

    private contextMenuShowing = false; //TODO:c: record when shown

}
