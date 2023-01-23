import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { Entry } from "../common/model/Entry";

class NetworkAuth {
    public setupPage(entries: Entry[], realm: string, url: string, isProxy: boolean) {
        const instructions = isProxy
            ? $STRF("network_auth_proxy_description", [url])
            : $STRF("network_auth_http_auth_description", [url, realm]);
        document.getElementById("network_auth_instructions").textContent = instructions;
        this.createNearNode(document.getElementById("network_auth_choose"), entries);
    }

    async supplyNetworkAuth(entryIndex: number) {
        const tab = await browser.tabs.getCurrent();
        browser.runtime.sendMessage({
            action: "NetworkAuth_ok",
            selectedEntryIndex: entryIndex
        });
        await browser.tabs.remove(tab.id);
    }

    public createNearNode(node: HTMLElement, entries: Entry[]) {
        const container = document.createElement("div");
        container.id = "Kee-MatchedLoginsList";
        const list = document.createElement("ul");
        this.setLogins(entries, list);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);
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
            loginItem.dataset.formIndex = entry.formIndex != null ? entry.formIndex.toString() : "";
            loginItem.dataset.entryIndex = i.toString();
            loginItem.dataset.uuid = entry.uuid;
            loginItem.title = $STRF("matchedLogin_tip", [
                entry.title,
                displayGroupPath,
                usernameDisplayValue
            ]);
            loginItem.tabIndex = -1;

            loginItem.textContent = $STRF("matchedLogin_label", [
                usernameDisplayValue,
                entry.title
            ]);

            //TODO:4: keyboard nav
            //loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
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
                "keeCommand",
                function (this: HTMLElement) {
                    networkAuth.supplyNetworkAuth(parseInt(this.dataset.entryIndex));
                },
                false
            );

            container.appendChild(loginItem);
        }
    }
}

let networkAuth: NetworkAuth;

function setupNetworkAuthDialog() {
    window.addEventListener("beforeunload", () =>
        browser.runtime.sendMessage({ action: "NetworkAuth_cancel" })
    );
    KeeLog.attachConfig(configManager.current);
    networkAuth = new NetworkAuth();
    browser.runtime.onMessage.addListener(message => {
        if (message && message.action && message.action === "NetworkAuth_matchedEntries") {
            networkAuth.setupPage(message.entries, message.realm, message.url, message.isProxy);
        }
    });
    browser.runtime.sendMessage({ action: "NetworkAuth_load" });
    document.getElementById("i18n_root").style.display = "block";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => configManager.load(setupNetworkAuthDialog));
} else {
    configManager.load(setupNetworkAuthDialog);
}
