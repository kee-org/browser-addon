import { LoginMenus } from "./LoginMenus";
import { Search, SearchResult } from "../common/search";
import { AppState } from "../common/AppState";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { keeLoginInfo } from "../common/kfDataModel";
import { KeeLog } from "../common/Logger";

export class SearchPanel {

    private search: Search;
    private loginMenus: LoginMenus;

    private _currentSearchTerm: string;

    public get currentSearchTerm () : string {
        return this._currentSearchTerm;
    }

    constructor (private appState: AppState,
        private myPort: browser.runtime.Port)
    {
        this.loginMenus = new LoginMenus(myPort);
        this.search = new Search(appState, {
            version: 1,
            searchAllDatabases: configManager.current.searchAllOpenDBs,
            maximumResults: 50
        });
    }

    public init (searchFor?: string) {
        const searchBox = (document.getElementById("searchBox") as HTMLInputElement);
        searchBox.placeholder = $STR("Search_label");
        searchBox.title = $STR("Search_tip");
        searchBox.addEventListener("input", evt => {
            this._currentSearchTerm = searchBox.value;
            this.myPort.postMessage({currentSearchTerm: this.currentSearchTerm} as AddonMessage);
            this.search.execute(this._currentSearchTerm,
                this.onSearchComplete.bind(this), []
            );
        });
        searchBox.addEventListener("keydown", this.searchBoxKeyboardNavHandler);
        if (searchFor) {
            searchBox.value = searchFor;
            this._currentSearchTerm = searchFor;
            this.search.execute(searchFor,
                this.onSearchComplete.bind(this), []
            );
        }
    }

    private searchBoxKeyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
            {
                event.preventDefault();
                event.stopPropagation();
                const searchResults = document.getElementById("searchResults-Container");
                if (searchResults && searchResults.firstElementChild) {
                    (searchResults.firstElementChild as HTMLLIElement).focus();
                }
                break;
            }
            case 40: // down
            {
                event.preventDefault();
                event.stopPropagation();
                const searchResults = document.getElementById("searchResults-Container");
                if (searchResults && searchResults.firstElementChild) {
                    (searchResults.firstElementChild as HTMLLIElement).focus();
                }
                break;
            }
            case 27: // esc
            {
                // This does not work in Firefox due to https://bugzilla.mozilla.org/show_bug.cgi?id=1373175
                event.preventDefault();
                event.stopPropagation();
                const searchBox = (document.getElementById("searchBox") as HTMLInputElement);
                if (searchBox.value) {
                    searchBox.value = "";
                    searchBox.dispatchEvent(new Event("input"));
                } else {
                    window.close();
                }
                break;
            }
        }
    }

    public createContextActions (login: keeLoginInfo) {

        if (!login.uniqueID) return;

        let loginItem: HTMLLIElement;
        for (const node of $$("#searchResults-Container > li")) {
            const li = node as HTMLLIElement;
            if (li.dataset["uuid"] == login.uniqueID) {
                loginItem = li;
                break;
            }
        }

        if (!loginItem) return;

        if (loginItem.querySelector("div.contextActions") === null) {
            const loginContextActions = this.loginMenus.createContextActions(login);
            loginItem.appendChild(loginContextActions);
            this.loginMenus.hideContextMenuButton(loginItem);
        }
    }

    private onSearchComplete (logins: SearchResult[])
    {
        logins = logins.sort(function (a, b) {
            if (a.relevanceScore > b.relevanceScore)
                return -1;
            if (a.relevanceScore < b.relevanceScore)
                return 1;
            return 0;
        });
        this.showSearchResults(logins);
    }

    // Calling this function with null or empty logins array will clear all existing search results
    private showSearchResults (logins: SearchResult[])
    {
        KeeLog.debug("BrowserPopup showSearchResults started");

        const ps = this;

        // The container that we want to add our search results to.
        const container = this.getEmptyContainerFor("searchResults");
        if (container === undefined || container == null || logins == null || logins.length == 0)
            return;

        KeeLog.debug(logins.length + " search results found");

        for (let i = 0; i < logins.length; i++) {
            const login = logins[i];
            let usernameValue = "";
            let usernameName = "";
            let usernameDisplayValue = "[" + $STR("noUsername_partial_tip") + "]";
            usernameValue = login.usernameValue;
            if (usernameValue != undefined && usernameValue != null && usernameValue != "")
                usernameDisplayValue = usernameValue;
            usernameName = login.usernameName;

            const loginItem = document.createElement("li");
            loginItem.setAttribute("class", "login-item");
            loginItem.setAttribute("data-filename", login.dbFileName);
            loginItem.setAttribute("data-usernameName", usernameName);
            loginItem.setAttribute("data-usernameValue", usernameValue);
            loginItem.setAttribute("data-url", login.url);
            loginItem.setAttribute("data-uuid", login.uniqueID);
            loginItem.setAttribute("style", "background-image:url(data:image/png;base64," + login.iconImageData + ")");
            loginItem.setAttribute("title", $STRF(
                "savePasswordLogin_tip", [usernameDisplayValue, login.url]));
            loginItem.setAttribute("tabindex", i == 0 ? "0" : "-1");

            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);
            loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
            loginItem.addEventListener("click", function (event) {
                event.stopPropagation();

                if (event.button == 0)
                {
                    this.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
                }
            }, false);
            loginItem.addEventListener("mousedown", function (event) {
                if (event.button == 1 && event.target == event.currentTarget)
                {
                    event.stopPropagation();
                    event.preventDefault();
                    this.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
                    return false;
                }
            }, false);
            loginItem.addEventListener("keeCommand", function (event: CustomEvent) {
                let newTab = false;
                if (event.detail.button === 0) {
                    if (event.detail.ctrlKey === false) {
                        newTab = false;
                    } else {
                        newTab = true;
                    }
                } else {
                    if (event.detail.ctrlKey === false) {
                        newTab = true;
                    } else {
                        newTab = false;
                    }
                }
                if (newTab) {
                    browser.tabs.create({url: (event.target as HTMLLIElement).dataset.url});
                } else {
                    browser.tabs.update({url: (event.target as HTMLLIElement).dataset.url});
                }
            }, false);

            loginItem.addEventListener("contextmenu", event => {
                event.stopPropagation();
                event.preventDefault();
                this.loginMenus.showContextActions(login.uniqueID, login.dbFileName);
            }, false);
            loginItem.addEventListener("mouseenter", e => this.loginMenus.onMouseEnterLogin(e), false);
            loginItem.addEventListener("mouseleave", e => this.loginMenus.onMouseLeaveLogin(e), false);

            container.appendChild(loginItem);
        }

        KeeLog.debug(logins.length + " search results set.");
    }

    private keyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: 0, ctrlKey: event.ctrlKey }}));
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
                } else {
                    (document.getElementById("searchBox") as HTMLInputElement).focus();
                }
                break;
            case 27: // esc
                event.preventDefault();
                event.stopPropagation();
                (document.getElementById("searchBox") as HTMLInputElement).focus();
                break;
            case 93: // context
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new Event("contextmenu"));
                break;
        }
    }

    private getEmptyContainerFor (id)
    {
        const panelSection = document.getElementById(id);
        if (panelSection === undefined || panelSection == null)
            return null;

        // Remove all of the existing items by removing the top-level list
        // if it has been created earlier
        if (panelSection.childNodes.length > 0)
            panelSection.removeChild(panelSection.childNodes[0]);

        // Create the ul menu top level container
        const groupContainer = document.createElement("ul");
        groupContainer.setAttribute("id", id + "-Container");
        panelSection.appendChild(groupContainer);
        return groupContainer;
    }
}
