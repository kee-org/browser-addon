import { Search } from "../common/search";
import { SubmittedData } from "../common/SubmittedData";
import { AddonMessage } from "../common/AddonMessage";
import { configManager } from "../common/ConfigManager";
import { SearchFilter } from "../common/SearchFilter";
import { KeeLog } from "../common/Logger";
import store from "../store";

interface SaveData {
    db: string;
    group: string;
    oldLoginUUID: string;
    update: boolean;
    urlMergeMode: number;
}

export class SavePasswordPanel {

    private doc: HTMLDocument;
    private saveData: SaveData;
    private search: Search;
    private submittedData: SubmittedData;

    constructor (private myPort: browser.runtime.Port,
        submittedData: SubmittedData)
    {
        this.doc = window.document;
        this.submittedData = submittedData;

        this.search = new Search(store.state, {
            version: 1,
            searchAllDatabases: true,
            maximumResults: 50
        });
    }

    public createNearNode (node: HTMLElement) {
        this.saveData = {} as any;
        const container = document.createElement("div");
        container.id = "SavePasswordContainer";
        this.generateUI(container);
        node.parentNode.insertBefore(container, node.nextSibling);

        // Set initial results for current website
        const filter = (document.getElementById("Kee-SaveLogin-searchfilter-current") as HTMLOptionElement);
        this.search.execute((document.getElementById("Kee-SaveLogin-searchbox") as HTMLInputElement).value,
            this.onSearchComplete.bind(this),
            filter.value.split(",")
        );

        return container;
    }


    private generateUI (container) {
        const saveTypeChooser = this.createSaveTypeChooser();
        container.appendChild(saveTypeChooser);
        const saveTypeContainer = this.createSaveTypeContainer();
        container.appendChild(saveTypeContainer);
        const neverButton = document.createElement("button");
        neverButton.id = "neverForThisSiteButton";
        neverButton.textContent = $STR("notifyBarNeverForSiteButton_label");
        neverButton.addEventListener("click", e => {
            this.myPort.postMessage({ neverSave: true } as AddonMessage);
        });
        container.appendChild(neverButton);
        return container;
    }

    private DBChangeHandler (event: Event) {
        const select = (event.target as HTMLSelectElement);
        const opt = select.selectedOptions[0] as HTMLOptionElement;
        select.style.backgroundImage = opt.style.backgroundImage;
        this.updateGroups(store.state.KeePassDatabases.find(db => db.fileName === select.value),
            this.doc.getElementById("kee-save-password-group-select"));
        this.saveData.db = opt.value;
    }

    private createDBSelect () {

        const dbOptions = [];

        for (let dbi = 0; dbi < store.state.KeePassDatabases.length; dbi++)
        {
            const db = store.state.KeePassDatabases[dbi];
            const opt: HTMLOptionElement = this.doc.createElement("option") as HTMLOptionElement;
            opt.setAttribute("value", db.fileName);
            if (db.name)
                opt.textContent = db.name;
            else
                opt.textContent = db.fileName;
            if (dbi == store.state.ActiveKeePassDatabaseIndex)
                opt.selected = true;
            opt.style.backgroundImage = "url(data:image/png;base64," + db.iconImageData + ")";
            dbOptions.push(opt);
        }


        const sel = this.doc.createElement("select") as HTMLSelectElement;
        sel.setAttribute("id", "kee-save-password-db-select");
        sel.addEventListener("change", this.DBChangeHandler.bind(this), false);
        for (const o of dbOptions)
            sel.appendChild(o);

        this.saveData.db = sel.selectedOptions[0].value;

        return sel;
    }

    private createGroupSelect () {
        const sel = this.doc.createElement("select") as HTMLSelectElement;
        sel.addEventListener("change", event => {
            const target = event.target as HTMLSelectElement;
            const opt = target.selectedOptions[0];
            target.style.backgroundImage = opt.style.backgroundImage;
            target.style.paddingLeft = (parseInt(opt.style.paddingLeft.substring(0,
                opt.style.paddingLeft.length - 2)) - 5) + "px";
            target.style.backgroundPosition = opt.style.backgroundPosition;
            this.saveData.group = opt.value;
        }, false);
        sel.setAttribute("id", "kee-save-password-group-select");

        return sel;
    }

    private updateGroups (db, sel) {

        const groupOptions = [];
        let mruGroup = "";
        if (configManager.current.rememberMRUGroup) {
            if (configManager.current.mruGroup) {
                mruGroup = configManager.current.mruGroup[db.fileName];
            }
        }

        // Hacky this:any since code already works and is not long for this world
        function generateGroupOptions (this: any, group, depth) {

            const opt = this.doc.createElement("option");
            opt.setAttribute("value", group.uniqueID);
            opt.textContent = group.title;

            if (mruGroup == group.uniqueID)
                opt.setAttribute("selected", "true");

            const indent = 20 + depth * 16;
            opt.style.paddingLeft = (indent+5) + "px";
            opt.style.backgroundPosition = (indent-15) + "px 7px";
            opt.style.backgroundImage = "url(data:image/png;base64," + group.iconImageData + ")";

            groupOptions.push(opt);

            for (const c of group.childGroups)
                generateGroupOptions.call(this, c, depth+1);
        }

        generateGroupOptions.call(this, db.root, 0);

        for (const opt in sel){
            sel.remove(opt);
        }
        for (const o of groupOptions)
            sel.appendChild(o);

        const currentOpt = sel.selectedOptions[0];
        sel.style.backgroundImage = currentOpt.style.backgroundImage;
        sel.style.paddingLeft = (currentOpt.style.paddingLeft.substring(0,
            currentOpt.style.paddingLeft.length - 2) - 5) + "px";
        sel.style.backgroundPosition = currentOpt.style.backgroundPosition;

        this.saveData.group = currentOpt.value;
    }

    private getCurrentUrlMergeMode ()  {
        const radio = Array.from(document.querySelectorAll("#Kee-loginURLsUpdateRadioGroup input"));
        const mergeMode = (radio.find((r: HTMLInputElement) => r.checked) as HTMLInputElement).value;
        return mergeMode;
    }

    private createSaveTypeChooser ()
    {
        const saveTypeChooser = this.doc.createElement("div");
        saveTypeChooser.classList.add("xulhbox");
        const createButton = this.doc.createElement("button");
        createButton.setAttribute("id", "kee-save-password-new-button");
        createButton.textContent = $STR("create_new_entry");
        createButton.addEventListener("click", this.enableNewEntry.bind(this));
        createButton.classList.add("selected");
        const updateButton = this.doc.createElement("button");
        updateButton.setAttribute("id", "kee-save-password-update-button");
        updateButton.textContent = $STR("update_existing_entry");
        updateButton.addEventListener("click", this.enableEditEntry.bind(this));
        updateButton.classList.add("unselected");

        saveTypeChooser.appendChild(createButton);
        saveTypeChooser.appendChild(updateButton);
        return saveTypeChooser;
    }

    private createSaveTypeContainer ()
    {
        const saveTypeContainer = this.doc.createElement("div");
        saveTypeContainer.classList.add("xulvbox");
        saveTypeContainer.setAttribute("id", "kee-save-password-saveTypeContainer");

        const typeNew = this.createSaveTypeNew();
        const typeUpdate1 = this.createSaveTypeUpdate1();
        const typeUpdate2 = this.createSaveTypeUpdate2();

        saveTypeContainer.appendChild(typeNew);
        saveTypeContainer.appendChild(typeUpdate1);
        saveTypeContainer.appendChild(typeUpdate2);
        return saveTypeContainer;
    }

    private createSaveTypeNew ()
    {
        const panel = this.doc.createElement("div");
        panel.setAttribute("id", "kee-save-password-new-panel");
        panel.classList.add("enabled", "xulvbox");

        const dbSel = this.createDBSelect();
        dbSel.style.backgroundImage = dbSel.selectedOptions[0].style.backgroundImage;

        const dbSelContainer = this.doc.createElement("div");
        dbSelContainer.classList.add("xulhbox", "kee-save-password");
        const dbSelLabel = this.doc.createElement("label");
        dbSelLabel.setAttribute("for", dbSel.id);
        dbSelLabel.textContent = $STR("database_label");

        dbSelContainer.appendChild(dbSelLabel);
        dbSelContainer.appendChild(dbSel);

        if (dbSel.options.length <= 1)
            dbSelContainer.classList.add("disabled");

        panel.appendChild(dbSelContainer);

        const groupSelContainer = this.createGroupSelector();
        panel.appendChild(groupSelContainer);

        panel.appendChild(this.generateCreateButton());

        return panel;
    }

    private createSaveTypeUpdate1 ()
    {
        const panel = this.doc.createElement("div");
        panel.classList.add("disabled", "xulvbox");
        panel.setAttribute("id", "kee-save-password-update-panel1");
        const whichEntryLabel = this.doc.createElement("label");
        whichEntryLabel.textContent = $STR("whichEntry_label");
        whichEntryLabel.classList.add("Kee-message");
        panel.appendChild(whichEntryLabel);

        const searchResultspanel = this.doc.createElement("div");
        searchResultspanel.classList.add("xulvbox");
        const searchBox = this.doc.createElement("input");
        searchBox.setAttribute("placeholder", $STR("Search_label"));
        searchBox.setAttribute("type", "text");
        searchBox.setAttribute("id", "Kee-SaveLogin-searchbox");
        searchBox.setAttribute("title", $STR("Search_tip"));
        searchBox.classList.add("Kee-Search");
        searchBox.addEventListener("input", e => {
            this.search.execute((e.target as any).value, this.onSearchComplete.bind(this),
                (e.target as any).ownerDocument.getElementById("Kee-SaveLogin-searchfilter").selectedOptions[0].value.split(","));
        }, false);

        const searchFields = (new SearchFilter()).attachFilterToSearchBox(searchBox, this, [this.submittedData.url], this.search);

        const searchResults = this.doc.createElement("div");
        searchResults.setAttribute("id", "Kee-SaveLogin-SearchResults");

        searchResultspanel.appendChild(searchFields);
        searchResultspanel.appendChild(searchResults);
        panel.appendChild(searchResultspanel);

        return panel;
    }

    private createSaveTypeUpdate2 ()
    {
        const panel = this.doc.createElement("div");
        panel.classList.add("disabled", "xulvbox");
        panel.setAttribute("id", "kee-save-password-update-panel2");

        const selectedEntryContainer = this.doc.createElement("div");
        selectedEntryContainer.classList.add("xulhbox");
        const selectedEntryList = this.doc.createElement("ul");
        selectedEntryList.setAttribute("id", "Kee-SaveLogin-selectedEntryList");
        selectedEntryContainer.appendChild(selectedEntryList);
        const spacer1 = this.doc.createElement("span");
        spacer1.classList.add("xulspacer");
        selectedEntryContainer.appendChild(spacer1);
        const selectedEntryChangeButton = this.doc.createElement("button");
        selectedEntryChangeButton.textContent = $STR("search_again");
        selectedEntryChangeButton.classList.add("Kee-SaveLogin-Change-Setting");
        selectedEntryChangeButton.addEventListener("click", this.enableSelectEntryToUpdate.bind(this));
        selectedEntryContainer.appendChild(selectedEntryChangeButton);
        panel.appendChild(selectedEntryContainer);

        const loginURLsUpdateStatusContainer = this.doc.createElement("div");
        loginURLsUpdateStatusContainer.classList.add("xulhbox");
        loginURLsUpdateStatusContainer.setAttribute("id", "Kee-loginURLsUpdateStatusContainer");
        const loginURLsUpdateStatus = this.doc.createElement("label");
        loginURLsUpdateStatus.textContent = $STR("change_url_status");
        loginURLsUpdateStatus.classList.add("Kee-message");
        loginURLsUpdateStatusContainer.appendChild(loginURLsUpdateStatus);
        const spacer3 = this.doc.createElement("span");
        spacer3.classList.add("xulspacer");
        loginURLsUpdateStatusContainer.appendChild(spacer3);
        const loginURLsUpdateButton = this.doc.createElement("button");
        loginURLsUpdateButton.textContent = $STR("more_options");
        loginURLsUpdateButton.classList.add("Kee-SaveLogin-Change-Setting");
        loginURLsUpdateButton.addEventListener("click", this.enableEditURLs.bind(this));
        loginURLsUpdateStatusContainer.appendChild(loginURLsUpdateButton);
        panel.appendChild(loginURLsUpdateStatusContainer);

        const loginURLsUpdateRadioGroup = this.doc.createElement("div");
        loginURLsUpdateRadioGroup.classList.add("disabled", "xulradiogroup");
        loginURLsUpdateRadioGroup.setAttribute("id", "Kee-loginURLsUpdateRadioGroup");

        const loginURLsUpdateRadio1Label = this.doc.createElement("label");
        const loginURLsUpdateRadio1 = this.doc.createElement("input");
        loginURLsUpdateRadio1.setAttribute("type", "radio");
        loginURLsUpdateRadio1.setAttribute("id", "loginURLsUpdateRadio1");
        loginURLsUpdateRadio1.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio1.setAttribute("value", "1");
        loginURLsUpdateRadio1.setAttribute("checked", "true");
        loginURLsUpdateRadio1Label.appendChild(loginURLsUpdateRadio1);
        loginURLsUpdateRadio1Label.appendChild(document.createTextNode($STR("change_url_option_1")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio1Label);

        const loginURLsUpdateRadio2Label = this.doc.createElement("label");
        const loginURLsUpdateRadio2 = this.doc.createElement("input");
        loginURLsUpdateRadio2.setAttribute("type", "radio");
        loginURLsUpdateRadio2.setAttribute("id", "loginURLsUpdateRadio2");
        loginURLsUpdateRadio2.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio2.setAttribute("value", "2");
        loginURLsUpdateRadio2Label.appendChild(loginURLsUpdateRadio2);
        loginURLsUpdateRadio2Label.appendChild(document.createTextNode($STR("change_url_option_2")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio2Label);

        const loginURLsUpdateRadio3Label = this.doc.createElement("label");
        const loginURLsUpdateRadio3 = this.doc.createElement("input");
        loginURLsUpdateRadio3.setAttribute("type", "radio");
        loginURLsUpdateRadio3.setAttribute("id", "loginURLsUpdateRadio3");
        loginURLsUpdateRadio3.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio3.setAttribute("value", "3");
        loginURLsUpdateRadio3Label.appendChild(loginURLsUpdateRadio3);
        loginURLsUpdateRadio3Label.appendChild(document.createTextNode($STR("change_url_option_3")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio3Label);

        const loginURLsUpdateRadio4Label = this.doc.createElement("label");
        const loginURLsUpdateRadio4 = this.doc.createElement("input");
        loginURLsUpdateRadio4.setAttribute("type", "radio");
        loginURLsUpdateRadio4.setAttribute("id", "loginURLsUpdateRadio4");
        loginURLsUpdateRadio4.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio4.setAttribute("value", "4");
        loginURLsUpdateRadio4Label.appendChild(loginURLsUpdateRadio4);
        loginURLsUpdateRadio4Label.appendChild(document.createTextNode($STR("change_url_option_4")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio4Label);

        panel.appendChild(loginURLsUpdateRadioGroup);
        panel.appendChild(this.generateUpdateButton());

        return panel;
    }

    private generateCreateButton ()
    {
        return this.generateCreateUpdateButton($STR("create"));
    }

    private generateUpdateButton ()
    {
        return this.generateCreateUpdateButton($STR("update"));
    }

    private generateCreateUpdateButton (label: string)
    {
        const hbox = this.doc.createElement("div");
        hbox.classList.add("xulhbox", "xulpackend");
        const button = this.doc.createElement("button");
        button.textContent = label;
        button.addEventListener("click", e => this.saveButtonCallback());
        hbox.appendChild(button);
        return hbox;
    }

    private createGroupSelector ()
    {
        const groupSel = this.createGroupSelect();
        this.updateGroups(
            store.state.KeePassDatabases[store.state.ActiveKeePassDatabaseIndex], groupSel);

        const groupSelContainer = this.doc.createElement("div");
        groupSelContainer.classList.add("kee-save-password", "xulhbox");
        const groupSelLabel = this.doc.createElement("label");
        groupSelLabel.setAttribute("for", groupSel.id);
        groupSelLabel.textContent = $STR("group_label");

        groupSelContainer.appendChild(groupSelLabel);
        groupSelContainer.appendChild(groupSel);
        return groupSelContainer;
    }

    private enableEditEntry () {
        // If we've already chosen an entry to edit, clicking on this tab takes
        // us back to the 2nd stage of the update process
        if (this.saveData.oldLoginUUID)
            this.enableUpdateEntryDetails();
        else
            this.enableSelectEntryToUpdate();
    }

    private enableEditURLs ()
    {
        const loginURLsUpdateStatusContainer = this.doc.getElementById("Kee-loginURLsUpdateStatusContainer");
        const loginURLsUpdateRadioGroup = this.doc.getElementById("Kee-loginURLsUpdateRadioGroup");
        loginURLsUpdateStatusContainer.classList.add("disabled");
        loginURLsUpdateStatusContainer.classList.remove("enabled");
        loginURLsUpdateRadioGroup.classList.add("enabled");
        loginURLsUpdateRadioGroup.classList.remove("disabled");
    }

    private enableNewEntry ()
    {
        const panel1 = this.doc.getElementById("kee-save-password-new-panel");
        const panel2 = this.doc.getElementById("kee-save-password-update-panel1");
        const panel3 = this.doc.getElementById("kee-save-password-update-panel2");
        panel1.classList.add("enabled");
        panel2.classList.add("disabled");
        panel3.classList.add("disabled");
        panel1.classList.remove("disabled");
        panel2.classList.remove("enabled");
        panel3.classList.remove("enabled");
        this.saveData.update = false;

        const select = (this.doc.getElementById("kee-save-password-db-select") as HTMLSelectElement);
        const opt = select.selectedOptions[0] as HTMLOptionElement;
        this.saveData.db = opt.value;

        this.setTypeChooserButtonState("kee-save-password-new-button", "kee-save-password-update-button");
    }

    private enableSelectEntryToUpdate ()
    {
        const panel1 = this.doc.getElementById("kee-save-password-new-panel");
        const panel2 = this.doc.getElementById("kee-save-password-update-panel1");
        const panel3 = this.doc.getElementById("kee-save-password-update-panel2");
        panel1.classList.add("disabled");
        panel2.classList.add("enabled");
        panel3.classList.add("disabled");
        panel1.classList.remove("enabled");
        panel2.classList.remove("disabled");
        panel3.classList.remove("enabled");
        this.saveData.update = true;
        const selectedEntryList = this.doc.getElementById("Kee-SaveLogin-selectedEntryList");
        while (selectedEntryList.firstChild)
            selectedEntryList.removeChild(selectedEntryList.firstChild);
        this.saveData.oldLoginUUID = null;
        this.saveData.db = null;

        this.setTypeChooserButtonState("kee-save-password-update-button", "kee-save-password-new-button");
    }

    private enableUpdateEntryDetails ()
    {
        const panel1 = this.doc.getElementById("kee-save-password-new-panel");
        const panel2 = this.doc.getElementById("kee-save-password-update-panel1");
        const panel3 = this.doc.getElementById("kee-save-password-update-panel2");
        panel1.classList.add("disabled");
        panel2.classList.add("disabled");
        panel3.classList.add("enabled");
        panel1.classList.remove("enabled");
        panel2.classList.remove("enabled");
        panel3.classList.remove("disabled");
        this.saveData.update = true;

        this.setTypeChooserButtonState("kee-save-password-update-button", "kee-save-password-new-button");
    }

    private setTypeChooserButtonState (selectedId, unselectedId)
    {
        const selectedButton = this.doc.getElementById(selectedId);
        const otherButton = this.doc.getElementById(unselectedId);
        selectedButton.classList.add("selected");
        otherButton.classList.add("unselected");
        selectedButton.classList.remove("unselected");
        otherButton.classList.remove("selected");
    }

    private onSearchComplete (logins)
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
    private showSearchResults (logins)
    {
        KeeLog.debug("passwordSaver showSearchResults started");

        const ps = this;

        // The container that we want to add our search results to.
        const container = this.getEmptyContainerFor("Kee-SaveLogin-SearchResults");
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

            const loginItem = ps.doc.createElement("li");
            loginItem.setAttribute("class", "login-item");
            loginItem.setAttribute("data-filename", login.dbFileName);
            loginItem.setAttribute("data-usernameName", usernameName);
            loginItem.setAttribute("data-usernameValue", usernameValue);
            loginItem.setAttribute("data-url", login.url);
            loginItem.setAttribute("data-uuid", login.uniqueID);
            loginItem.setAttribute("style", "background-image:url(data:image/png;base64," + login.iconImageData + ")");
            loginItem.setAttribute("title", $STRF(
                "savePasswordLogin_tip", [usernameDisplayValue, login.url]));
            loginItem.setAttribute("tabindex", "-1");

            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);
            //TODO:4: Keyboard nav?
            //loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
            loginItem.addEventListener("mouseup", function (event) {
                // Make sure no parent groups override the actions of this handler
                event.stopPropagation();

                if (event.button == 0 || event.button == 1)
                {
                    this.dispatchEvent(new CustomEvent("keeCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
                }
            }, false);
            loginItem.addEventListener("keeCommand", function (this: HTMLElement, event) {
                ps.saveData.oldLoginUUID = this.getAttribute("data-uuid");
                ps.saveData.db = this.getAttribute("data-filename");

                const item = ps.doc.createElement("li");
                item.setAttribute("class", "login-item");
                item.setAttribute("style", this.getAttribute("style"));
                item.setAttribute("title", this.getAttribute("title"));
                item.setAttribute("tabindex", "-1");
                item.textContent = this.textContent;
                ps.doc.getElementById("Kee-SaveLogin-selectedEntryList").appendChild(item);

                ps.enableUpdateEntryDetails();
            }, false);

            container.appendChild(loginItem);
        }

        KeeLog.debug(logins.length + " search results set.");
    }

    private getEmptyContainerFor (id)
    {
        const panelSection = this.doc.getElementById(id);
        if (panelSection === undefined || panelSection == null)
            return null;

        // Remove all of the existing items by removing the top-level list
        // if it has been created earlier
        if (panelSection.childNodes.length > 0)
            panelSection.removeChild(panelSection.childNodes[0]);

        // Create the ul menu top level container
        const groupContainer = this.doc.createElement("ul");
        groupContainer.setAttribute("id", id + "-Container");
        panelSection.appendChild(groupContainer);
        return groupContainer;
    }

    private saveButtonCallback () {
        this.saveData.urlMergeMode = parseInt(this.getCurrentUrlMergeMode());
        this.myPort.postMessage({ saveData: this.saveData } as AddonMessage);
    }
}
