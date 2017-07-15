class SearchFilter {

    private pslInitialised = false;

    get psl () {
        if (!publicSuffixList) throw new Error("publicSuffixList library not present");
        if (!this.pslInitialised) {
            publicSuffixList.parse(pslData.text, punycode.toASCII);
            this.pslInitialised = true;
        }
        return publicSuffixList;
    }

    public attachFilterToSearchBox (searchBox: HTMLInputElement, searchRequestor, currentURIs: string[], search: Search) {
        let inMainPanel = false;
        if (searchBox.getAttribute("id") === "KeeFox-PanelSection-searchbox")
            inMainPanel = true;

        const doc = searchBox.ownerDocument;
        let prefix = "SaveLogin";
        if (inMainPanel)
            prefix = "PanelSection";

        const searchFilter = doc.createElement("select");
        searchFilter.setAttribute("disabled", "true");
        searchFilter.setAttribute("id", "KeeFox-" + prefix + "-searchfilter");
        searchFilter.classList.add("KeeFox-Search-Filter");
        const searchFilterOptionAll = doc.createElement("option");
        searchFilterOptionAll.setAttribute("value", "");
        searchFilterOptionAll.setAttribute("id", "KeeFox-"+prefix+"-searchfilter-all");
        searchFilterOptionAll.classList.add("KeeFox-Search-Filter");
        searchFilterOptionAll.textContent = $STR("all-websites");
        const searchFilterOptionCurrent = doc.createElement("option");
        searchFilterOptionCurrent.setAttribute("value", "");
        searchFilterOptionCurrent.setAttribute("id", "KeeFox-"+prefix+"-searchfilter-current");
        searchFilterOptionCurrent.classList.add("KeeFox-Search-Filter");
        searchFilterOptionCurrent.textContent = $STR("current-website");

        if (inMainPanel)
            searchFilterOptionAll.setAttribute("selected", "true");
        else
            searchFilterOptionCurrent.setAttribute("selected", "true");

        if (!inMainPanel)
            this.updateSearchFilterStart(searchFilter, searchFilterOptionCurrent, currentURIs[0]);

        searchFilter.appendChild(searchFilterOptionAll);
        searchFilter.appendChild(searchFilterOptionCurrent);
        const searchFilterChangeHandler = function (e) {
            search.execute(e.target.ownerDocument.getElementById("KeeFox-"+prefix+"-searchbox").value,
                searchRequestor.onSearchComplete.bind(searchRequestor),
                e.target.selectedOptions[0].value.split(","));
            e.target.ownerDocument.getElementById("KeeFox-"+prefix+"-searchbox").focus();
        };
        searchFilter.addEventListener("change", searchFilterChangeHandler.bind(this), false);

        const searchFields = doc.createElement("div");
        searchFields.classList.add("keefox-searchFields", "xulhbox");
        searchFields.appendChild(searchBox);
        searchFields.appendChild(searchFilter);

        return searchFields;
    }


    private updateSearchFilterStart (searchFilter, current, currentURL) {
        // If we've been given a URI we use only that one, otherwise we ask the content
        // document to provide a list of all URLs at some future time
        if (currentURL) {
            try {
                //TODO:c: IP address support
                const url = new URL(currentURL);
                const host = url.host;
                const domain = this.psl.getDomain(host);
                this.updateSearchFilterFinish(searchFilter, current, [domain]);
            } catch (e) {
                searchFilter.setAttribute("disabled", "true");
            }
        } else {
            //TODO:c: main panel support?
            // let callbackName = "keefox:";
            // try {
            //     let uuidGenerator = Cc["@mozilla.org/uuid-generator;1"]
            //         .getService(Ci.nsIUUIDGenerator);
            //     let uuid = uuidGenerator.generateUUID();
            //     callbackName += uuid.toString();
            // } catch (e) {
            //     // Fall back to something a little less unique
            //     callbackName += Math.random();
            // }
            // let messageManager = gBrowser.selectedBrowser.messageManager;
            // let myCallback = function (message) {
            //     messageManager.removeMessageListener(callbackName, myCallback);
            //     this.updateSearchFilterFinish(searchFilter, current, message.data.domains);
            // }.bind(this);
            // messageManager.addMessageListener(callbackName, myCallback);
            // messageManager.sendAsyncMessage("keefox:getAllFrameDomains", { callbackName: callbackName });
        }
    }

    private updateSearchFilterFinish (searchFilter, current, domains) {

        if (domains && domains.length > 0) {
            searchFilter.removeAttribute("disabled");
            searchFilter.selectedIndex = 0;
            const currentUrls = domains.join(",");

            current.setAttribute("value", currentUrls);
        } else {
            searchFilter.setAttribute("disabled", "true");
        }
    }

    private getFilterState (doc, prefix)
    {
        if (doc.getElementById("KeeFox-" + prefix + "-searchfilter").selectedOptions[0].id == "KeeFox-"+prefix+"-searchfilter-all")
            return "all";
        else
            return "current";
    }
}
