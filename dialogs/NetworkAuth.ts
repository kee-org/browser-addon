class NetworkAuth {
    public setupPage (logins: keeLoginInfo[], realm: string, url: string, isProxy: boolean) {
        const instructions = isProxy ? $STRF("network_auth_proxy_description", [url]) : $STRF("network_auth_http_auth_description", [url, realm] );
        document.getElementById("network_auth_instructions").textContent = instructions;
        this.createNearNode(document.getElementById("network_auth_choose"), logins);
    }

    supplyNetworkAuth (loginIndex: number) {
        (chrome as any).tabs.getCurrent(tab => {
            chrome.runtime.sendMessage({action: "NetworkAuth_ok", selectedLoginIndex: loginIndex });
            const removing = (chrome as any).tabs.remove(tab.id);
        });
    }

    public createNearNode (node: HTMLElement, logins) {
        const container = document.createElement("div");
        container.id = "Kee-MatchedLoginsList";
        const list = document.createElement("ul");
        this.setLogins(logins, list);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);
    }

    private setLogins (logins, container)
    {
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
            loginItem.dataset.fileName = login.database.fileName;
            loginItem.dataset.frameKey = login.frameKey;
            loginItem.dataset.formIndex = login.formIndex != null ? login.formIndex.toString() : "";
            loginItem.dataset.loginIndex = i.toString();
            loginItem.dataset.uuid = login.uniqueID;
            loginItem.title = $STRF("matchedLogin_tip", [login.title, displayGroupPath, usernameDisplayValue]);
            loginItem.tabIndex = -1;

            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);

            //TODO:3: keyboard nav
            //loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
            loginItem.addEventListener("click", function (event) {
                event.stopPropagation();
                if (event.button == 0 || event.button == 1)
                    this.dispatchEvent(new Event("keeCommand"));
            }, false);
            loginItem.addEventListener("keeCommand", function (event) {
                networkAuth.supplyNetworkAuth(this.dataset.loginIndex);
            }, false);

            container.appendChild(loginItem);
        }
    }
}

let networkAuth: NetworkAuth;

function setupNetworkAuthDialog () {
    window.addEventListener("unload", e => chrome.runtime.sendMessage({ action: "NetworkAuth_cancel" }));
    KeeLog.attachConfig(configManager.current);
    networkAuth = new NetworkAuth();
    chrome.runtime.onMessage.addListener(message => {
        if (message && message.action && message.action === "NetworkAuth_matchedLogins")
            networkAuth.setupPage(message.logins, message.realm, message.url, message.isProxy);
    });
    chrome.runtime.sendMessage({action: "NetworkAuth_load" });
    document.getElementById("i18n_root").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => configManager.load(setupNetworkAuthDialog));
