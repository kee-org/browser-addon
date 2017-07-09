/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/FrameState.ts" />
/// <reference path="../common/AddonMessage.ts" />

interface SaveData {
    db: string;
    group: string;
    oldLoginUUID: string;
    update: boolean;
}

class SavePasswordPanel {

    private doc: HTMLDocument;
    private saveData: SaveData;

    constructor ()
    {
        this.doc = window.document;

//TODO:c: searching support
/*
        Cu.import("resource://kfmod/search.js", this);

        this.search = new this.Search(keefox_org, {
            version: 1,
            searchAllDatabases: true,
            maximumResults: 50
        });
        */
    }

    public createNearNode (node: HTMLElement) {
        this.saveData = {} as any;
        //this.saveButtonCallback = saveButtonCallback;
        const container = document.createElement("div");
        container.id = "SavePasswordContainer";
        this.generateUI(container);
        node.parentNode.insertBefore(container, node.nextSibling);
    }


    private generateUI (container) {
        const saveTypeChooser = this.createSaveTypeChooser();
        container.appendChild(saveTypeChooser);
        const saveTypeContainer = this.createSaveTypeContainer();
        container.appendChild(saveTypeContainer);
        return container;
    }

    private createDBSelect () {

        const dbOptions = [];

        for (let dbi = 0; dbi < appState.KeePassDatabases.length; dbi++)
        {
            const db = appState.KeePassDatabases[dbi];
            const opt: HTMLOptionElement = this.doc.createElement("option") as HTMLOptionElement;
            opt.setAttribute("value", db.fileName);
            if (db.name)
                opt.textContent = db.name;
            else
                opt.textContent = db.fileName;
            if (dbi == appState.ActiveKeePassDatabaseIndex)
                opt.selected = true;
            opt.style.backgroundImage = "url(data:image/png;base64," + db.iconImageData + ")";
            dbOptions.push(opt);
        }

        const changeHandler = function (event) {
            //TODO:c: reimplement
            // const opt = event.target.selectedOptions[0];
            // event.target.style.backgroundImage = opt.style.backgroundImage;
            // this.updateGroups(keefox_org.getDBbyFilename(event.target.value),
            //     this.doc.getElementById("keefox-save-password-group-select"));
            // this.saveData.db = opt.value;
        };

        const sel = this.doc.createElement("select") as HTMLSelectElement;
        sel.setAttribute("id", "keefox-save-password-db-select");
        sel.addEventListener("change", changeHandler.bind(this), false);
        for (const o of dbOptions)
          sel.appendChild(o);

        this.saveData.db = (sel.selectedOptions[0] as any).value;

        return sel;
    }

    private createGroupSelect () {

        const changeHandler = function (event) {
            const opt = event.target.selectedOptions[0];
            event.target.style.backgroundImage = opt.style.backgroundImage;
            event.target.style.paddingLeft = (opt.style.paddingLeft.substring(0,
                opt.style.paddingLeft.length - 2) - 5) + "px";
            event.target.style.backgroundPosition = opt.style.backgroundPosition;
            this.saveData.group = opt.value;
        };

        const sel = this.doc.createElement("select") as HTMLSelectElement;
        sel.addEventListener("change", changeHandler.bind(this), false);
        sel.setAttribute("id", "keefox-save-password-group-select");

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

        function generateGroupOptions (group, depth) {

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
        //const radioOptions = this.doc.getElementById("KeeFox-loginURLsUpdateRadioGroup");
        //TODO:c: radiogroup
        //return radioOptions.selectedIndex + 1;
        return 1;
    }

    private createSaveTypeChooser ()
    {
        const saveTypeChooser = this.doc.createElement("div");
        saveTypeChooser.classList.add("xulhbox");
        const createButton = this.doc.createElement("button");
        createButton.setAttribute("id", "keefox-save-password-new-button");
        createButton.innerHTML = $STR("create_new_entry");
        createButton.addEventListener("click", this.enableNewEntry.bind(this));
        createButton.classList.add("selected");
        const updateButton = this.doc.createElement("button");
        updateButton.setAttribute("id", "keefox-save-password-update-button");
        updateButton.innerHTML = $STR("update_existing_entry");
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
        saveTypeContainer.setAttribute("id", "keefox-save-password-saveTypeContainer");

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
        panel.setAttribute("id", "keefox-save-password-new-panel");
        panel.classList.add("enabled", "xulvbox");

        const dbSel = this.createDBSelect();
        dbSel.style.backgroundImage = (dbSel.selectedOptions[0] as any).style.backgroundImage;

        const dbSelContainer = this.doc.createElement("div");
        dbSelContainer.classList.add("xulhbox", "keeFox-save-password");
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
        panel.setAttribute("id", "keefox-save-password-update-panel1");
        const whichEntryLabel = this.doc.createElement("label");
        whichEntryLabel.textContent = $STR("whichEntry_label");
        whichEntryLabel.classList.add("KeeFox-message");
        panel.appendChild(whichEntryLabel);

        const searchResultspanel = this.doc.createElement("div");
        searchResultspanel.classList.add("xulvbox");
        const searchBox = this.doc.createElement("input");
        searchBox.setAttribute("placeholder", $STR("Search_label"));
        searchBox.setAttribute("type", "text");
        searchBox.setAttribute("id", "KeeFox-SaveLogin-searchbox");
        searchBox.setAttribute("title", $STR("Search_tip"));
        searchBox.classList.add("KeeFox-Search");
        searchBox.addEventListener("input", function (e){
            this.search.execute(e.target.value, this.onSearchComplete.bind(this),
                e.target.ownerDocument.getElementById("KeeFox-SaveLogin-searchfilter").selectedOptions[0].value.split(","));
        }.bind(this), false);

        //TODO:c: search
        //const searchFields = keefox_win.SearchFilter.attachFilterToSearchBox(searchBox, this, keefox_org.utils.stringsToNsIURIs(this.URLs));

        const searchResults = this.doc.createElement("div");
        searchResults.setAttribute("id", "KeeFox-SaveLogin-SearchResults");

        //searchResultspanel.appendChild(searchFields);
        searchResultspanel.appendChild(searchResults);
        panel.appendChild(searchResultspanel);

        return panel;
    }

    private createSaveTypeUpdate2 ()
    {
        const panel = this.doc.createElement("div");
        panel.classList.add("disabled", "xulvbox");
        panel.setAttribute("id", "keefox-save-password-update-panel2");

        const selectedEntryContainer = this.doc.createElement("div");
        selectedEntryContainer.classList.add("xulhbox");
        const selectedEntryList = this.doc.createElement("ul");
        selectedEntryList.setAttribute("id", "KeeFox-SaveLogin-selectedEntryList");
        selectedEntryContainer.appendChild(selectedEntryList);
        const spacer1 = this.doc.createElement("span");
        spacer1.classList.add("xulspacer");
        selectedEntryContainer.appendChild(spacer1);
        const selectedEntryChangeButton = this.doc.createElement("button");
        selectedEntryChangeButton.innerHTML = $STR("search_again");
        selectedEntryChangeButton.classList.add("KeeFox-SaveLogin-Change-Setting");
        selectedEntryChangeButton.addEventListener("click", this.enableSelectEntryToUpdate.bind(this));
        selectedEntryContainer.appendChild(selectedEntryChangeButton);
        panel.appendChild(selectedEntryContainer);

        const loginURLsUpdateStatusContainer = this.doc.createElement("div");
        loginURLsUpdateStatusContainer.classList.add("xulhbox");
        loginURLsUpdateStatusContainer.setAttribute("id", "KeeFox-loginURLsUpdateStatusContainer");
        const loginURLsUpdateStatus = this.doc.createElement("label");
        loginURLsUpdateStatus.innerHTML = $STR("change_url_status");
        loginURLsUpdateStatus.classList.add("KeeFox-message");
        loginURLsUpdateStatusContainer.appendChild(loginURLsUpdateStatus);
        const spacer3 = this.doc.createElement("span");
        spacer3.classList.add("xulspacer");
        loginURLsUpdateStatusContainer.appendChild(spacer3);
        const loginURLsUpdateButton = this.doc.createElement("button");
        loginURLsUpdateButton.innerHTML = $STR("more_options");
        loginURLsUpdateButton.classList.add("KeeFox-SaveLogin-Change-Setting");
        loginURLsUpdateButton.addEventListener("click", this.enableEditURLs.bind(this));
        loginURLsUpdateStatusContainer.appendChild(loginURLsUpdateButton);
        panel.appendChild(loginURLsUpdateStatusContainer);

        const loginURLsUpdateRadioGroup = this.doc.createElement("div");
        loginURLsUpdateRadioGroup.classList.add("disabled", "xulradiogroup");
        loginURLsUpdateRadioGroup.setAttribute("id", "KeeFox-loginURLsUpdateRadioGroup");

        const loginURLsUpdateRadio1Label = this.doc.createElement("label");
        const loginURLsUpdateRadio1 = this.doc.createElement("input");
        loginURLsUpdateRadio1.setAttribute("type", "radio");
        loginURLsUpdateRadio1.setAttribute("id", "loginURLsUpdateRadio1");
        loginURLsUpdateRadio1.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio1.setAttribute("checked", "true");
        loginURLsUpdateRadio1Label.appendChild(loginURLsUpdateRadio1);
        loginURLsUpdateRadio1Label.appendChild(document.createTextNode($STR("change_url_option_1")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio1Label);

        const loginURLsUpdateRadio2Label = this.doc.createElement("label");
        const loginURLsUpdateRadio2 = this.doc.createElement("input");
        loginURLsUpdateRadio2.setAttribute("type", "radio");
        loginURLsUpdateRadio2.setAttribute("id", "loginURLsUpdateRadio2");
        loginURLsUpdateRadio2.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio2.setAttribute("checked", "");
        loginURLsUpdateRadio2Label.appendChild(loginURLsUpdateRadio2);
        loginURLsUpdateRadio2Label.appendChild(document.createTextNode($STR("change_url_option_2")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio2Label);

        const loginURLsUpdateRadio3Label = this.doc.createElement("label");
        const loginURLsUpdateRadio3 = this.doc.createElement("input");
        loginURLsUpdateRadio3.setAttribute("type", "radio");
        loginURLsUpdateRadio3.setAttribute("id", "loginURLsUpdateRadio3");
        loginURLsUpdateRadio3.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio3.setAttribute("checked", "");
        loginURLsUpdateRadio3Label.appendChild(loginURLsUpdateRadio3);
        loginURLsUpdateRadio3Label.appendChild(document.createTextNode($STR("change_url_option_3")));
        loginURLsUpdateRadioGroup.appendChild(loginURLsUpdateRadio3Label);

        const loginURLsUpdateRadio4Label = this.doc.createElement("label");
        const loginURLsUpdateRadio4 = this.doc.createElement("input");
        loginURLsUpdateRadio4.setAttribute("type", "radio");
        loginURLsUpdateRadio4.setAttribute("id", "loginURLsUpdateRadio4");
        loginURLsUpdateRadio4.setAttribute("name", "loginURLsUpdateRadioGroup");
        loginURLsUpdateRadio4.setAttribute("checked", "");
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
        button.innerHTML = label;
        button.addEventListener("click", e => this.saveButtonCallback());
        hbox.appendChild(button);
        return hbox;
    }

    private createGroupSelector ()
    {
        const groupSel = this.createGroupSelect();
        this.updateGroups(
           appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex], groupSel);

        const groupSelContainer = this.doc.createElement("div");
        groupSelContainer.classList.add("keeFox-save-password", "xulhbox");
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
        const loginURLsUpdateStatusContainer = this.doc.getElementById("KeeFox-loginURLsUpdateStatusContainer");
        const loginURLsUpdateRadioGroup = this.doc.getElementById("KeeFox-loginURLsUpdateRadioGroup");
        loginURLsUpdateStatusContainer.classList.add("disabled");
        loginURLsUpdateStatusContainer.classList.remove("enabled");
        loginURLsUpdateRadioGroup.classList.add("enabled");
        loginURLsUpdateRadioGroup.classList.remove("disabled");
    }

    private enableNewEntry ()
    {
        const panel1 = this.doc.getElementById("keefox-save-password-new-panel");
        const panel2 = this.doc.getElementById("keefox-save-password-update-panel1");
        const panel3 = this.doc.getElementById("keefox-save-password-update-panel2");
        panel1.classList.add("enabled");
        panel2.classList.add("disabled");
        panel3.classList.add("disabled");
        panel1.classList.remove("disabled");
        panel2.classList.remove("enabled");
        panel3.classList.remove("enabled");
        this.saveData.update = false;

        this.setTypeChooserButtonState("keefox-save-password-new-button", "keefox-save-password-update-button");
    }

    private enableSelectEntryToUpdate ()
    {
        const panel1 = this.doc.getElementById("keefox-save-password-new-panel");
        const panel2 = this.doc.getElementById("keefox-save-password-update-panel1");
        const panel3 = this.doc.getElementById("keefox-save-password-update-panel2");
        panel1.classList.add("disabled");
        panel2.classList.add("enabled");
        panel3.classList.add("disabled");
        panel1.classList.remove("enabled");
        panel2.classList.remove("disabled");
        panel3.classList.remove("enabled");
        this.saveData.update = true;
        const selectedEntryList = this.doc.getElementById("KeeFox-SaveLogin-selectedEntryList");
        while (selectedEntryList.firstChild)
            selectedEntryList.removeChild(selectedEntryList.firstChild);
        this.saveData.oldLoginUUID = null;
        this.saveData.db = null;

        this.setTypeChooserButtonState("keefox-save-password-update-button", "keefox-save-password-new-button");
    }

    private enableUpdateEntryDetails ()
    {
        const panel1 = this.doc.getElementById("keefox-save-password-new-panel");
        const panel2 = this.doc.getElementById("keefox-save-password-update-panel1");
        const panel3 = this.doc.getElementById("keefox-save-password-update-panel2");
        panel1.classList.add("disabled");
        panel2.classList.add("disabled");
        panel3.classList.add("enabled");
        panel1.classList.remove("enabled");
        panel2.classList.remove("enabled");
        panel3.classList.remove("disabled");
        this.saveData.update = true;

        this.setTypeChooserButtonState("keefox-save-password-update-button", "keefox-save-password-new-button");
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

    private abortAndLaunchManualEdit ()
    {
        //TODO:c: reimplement
        // keefox_org.launchLoginEditor(this.saveData.oldLoginUUID, this.saveData.db);
        // keefox_win.notificationManager.remove("password-save");
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
        KeeFoxLog.debug("passwordSaver showSearchResults started");

        const ps = this;

        // The container that we want to add our search results to.
        const container = this.getEmptyContainerFor("KeeFox-SaveLogin-SearchResults");
        if (container === undefined || container == null || logins == null || logins.length == 0)
            return;

        KeeFoxLog.debug(logins.length + " search results found");

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
            loginItem.setAttribute("data-fileName", login.dbFileName);
            loginItem.setAttribute("data-usernameName", usernameName);
            loginItem.setAttribute("data-usernameValue", usernameValue);
            loginItem.setAttribute("data-url", login.url);
            loginItem.setAttribute("data-uuid", login.uniqueID);
            loginItem.setAttribute("style", "background-image:url(data:image/png;base64," + login.iconImageData + ")");
            loginItem.setAttribute("title", $STRF(
                "savePasswordLogin_tip", [usernameDisplayValue, login.url]));
            loginItem.setAttribute("tabindex", "-1");

            loginItem.textContent = $STRF("matchedLogin_label", [usernameDisplayValue, login.title]);
            //TODO:3: Keyboard nav?
            //loginItem.addEventListener("keydown", this.keyboardNavHandler, false);
            loginItem.addEventListener("mouseup", function (event) {
                // Make sure no parent groups override the actions of this handler
                event.stopPropagation();

                if (event.button == 0 || event.button == 1)
                {
                    this.dispatchEvent(new CustomEvent("keefoxCommand", { detail: { button: event.button, ctrlKey: event.ctrlKey }}));
                }
            }, false);
            loginItem.addEventListener("keefoxCommand", function (event) {
                ps.saveData.oldLoginUUID = this.getAttribute("data-uuid");
                ps.saveData.db = this.getAttribute("data-fileName");

                const item = ps.doc.createElement("li");
                item.setAttribute("class", "login-item");
                item.setAttribute("style", this.getAttribute("style"));
                item.setAttribute("title", this.getAttribute("title"));
                item.setAttribute("tabindex", "-1");
                item.textContent = this.textContent;
                ps.doc.getElementById("KeeFox-SaveLogin-selectedEntryList").appendChild(item);

                ps.enableUpdateEntryDetails();
            }, false);

            container.appendChild(loginItem);
        }

        // Update the UI state to reflect the number of logins found
        //if (container.childElementCount > 0)
        //    this.enableUIElement("KeeFox-PanelSubSection-SearchResults");

        KeeFoxLog.debug(logins.length + " search results set.");
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

    private showUpdateSuccessNotification ()
    {
        if (configManager.current.notifyWhenEntryUpdated)
        {
            //TODO:c: reimplement
            const aNotifyBox = null; //keefox_win.UI._getNotificationManager();
            const buttons = [
                {
                    label:     $STR("dont_show_again"),
                    popup:     null,
                    callback:  function () {
                        configManager.current.notifyWhenEntryUpdated = false;
                        configManager.save();
                    }
                }
            ];
            const notification = {
                name: "password-updated",
                render: function (container) {

                    // We will append the rendered view of our own notification information to the
                    // standard notification container that we have been supplied
                    const doc = container.ownerDocument;
                    container = doc.ownerGlobal.keefox_win.notificationManager
                        .renderStandardMessage(container, $STR("password_successfully_updated"));

                    const vb = doc.createElement("div");
                    vb.classList.add("xulvboxflex");
                    vb.setAttribute("id", "keefox-password-updated-notification");

                    const p1 = doc.createElement("label");
                    p1.textContent = $STR("keepass_history_pointer");
                    p1.classList.add("KeeFox-message");
                    vb.appendChild(p1);
                    const p2 = doc.createElement("label");
                    p2.textContent = $STR("change_field_status");
                    p2.classList.add("KeeFox-message");
                    vb.appendChild(p2);
                    const p3 = doc.createElement("label");
                    p3.textContent = $STR("change_field_explanation");
                    p3.classList.add("KeeFox-message");
                    vb.appendChild(p3);
                    const p4 = doc.createElement("label");
                    p4.textContent = $STR("multi_page_update_warning");
                    p4.classList.add("KeeFox-message");
                    vb.appendChild(p4);

                    container.appendChild(vb);

                    // We might customise other aspects of the notifications but when we want
                    // to display buttons we can treat them all the same
                    container = doc.ownerGlobal.keefox_win.notificationManager
                        .renderButtons(buttons, doc, aNotifyBox, "password-updated", container);

                    return container;
                },
                thisTabOnly: true,
                priority: null,
                persist: true
            };
            aNotifyBox.add(notification);
        }
    }

    private saveButtonCallback () {
        this.saveData.urlMergeMode = 1; //TODO:c: reimplement
        myPort.postMessage({ saveData: this.saveData } as AddonMessage);
    }
}
