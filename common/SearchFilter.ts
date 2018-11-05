class SearchFilter {

    private pslInitialised = false;

    get psl () {
        if (!__publicSuffixList) throw new Error("publicSuffixList library not present");
        if (!this.pslInitialised) {
            __publicSuffixList.parse(__pslData.text, __punycode.toASCII);
            this.pslInitialised = true;
        }
        return __publicSuffixList;
    }

    public attachFilterToSearchBox (searchBox: HTMLInputElement, searchRequestor, currentURIs: string[], search: Search) {
        let inMainPanel = false;
        if (searchBox.getAttribute("id") === "Kee-PanelSection-searchbox")
            inMainPanel = true;

        const doc = searchBox.ownerDocument;
        let prefix = "SaveLogin";
        if (inMainPanel)
            prefix = "PanelSection";

        const searchFilter = doc.createElement("select");
        searchFilter.setAttribute("disabled", "true");
        searchFilter.setAttribute("id", "Kee-" + prefix + "-searchfilter");
        searchFilter.classList.add("Kee-Search-Filter");
        const searchFilterOptionAll = doc.createElement("option");
        searchFilterOptionAll.setAttribute("value", "");
        searchFilterOptionAll.setAttribute("id", "Kee-"+prefix+"-searchfilter-all");
        searchFilterOptionAll.classList.add("Kee-Search-Filter");
        searchFilterOptionAll.textContent = $STR("all_websites");
        const searchFilterOptionCurrent = doc.createElement("option");
        searchFilterOptionCurrent.setAttribute("value", "");
        searchFilterOptionCurrent.setAttribute("id", "Kee-"+prefix+"-searchfilter-current");
        searchFilterOptionCurrent.classList.add("Kee-Search-Filter");
        searchFilterOptionCurrent.textContent = $STR("current_website");

        if (inMainPanel)
            searchFilterOptionAll.setAttribute("selected", "true");
        else
            searchFilterOptionCurrent.setAttribute("selected", "true");

        if (!inMainPanel)
            this.updateSearchFilterStart(searchFilter, searchFilterOptionCurrent, currentURIs[0]);

        searchFilter.appendChild(searchFilterOptionAll);
        searchFilter.appendChild(searchFilterOptionCurrent);
        const searchFilterChangeHandler = e => {
            search.execute(e.target.ownerDocument.getElementById("Kee-"+prefix+"-searchbox").value,
                searchRequestor.onSearchComplete.bind(searchRequestor),
                e.target.selectedOptions[0].value.split(","));
            e.target.ownerDocument.getElementById("Kee-"+prefix+"-searchbox").focus();
        };
        searchFilter.addEventListener("change", searchFilterChangeHandler.bind(this), false);

        const searchFields = doc.createElement("div");
        searchFields.classList.add("kee-searchFields", "xulhbox");
        searchFields.appendChild(searchBox);
        searchFields.appendChild(searchFilter);

        return searchFields;
    }


    private updateSearchFilterStart (searchFilter, current, currentURL) {
        // If we've been given a URI we use only that one, otherwise we ask the content
        // document to provide a list of all URLs at some future time
        if (currentURL) {
            try {
                const hostname = new URL(currentURL).hostname;
                const isIPAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(hostname);
                const domain = isIPAddress ? hostname : this.psl.getDomain(hostname);
                this.updateSearchFilterFinish(searchFilter, current, [domain]);
            } catch (e) {
                searchFilter.setAttribute("disabled", "true");
            }
        } else {
            //TODO:#7: main panel support?
            // let callbackName = "kee:";
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
            // messageManager.sendAsyncMessage("kee:getAllFrameDomains", { callbackName: callbackName });
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
        if (doc.getElementById("Kee-" + prefix + "-searchfilter").selectedOptions[0].id == "Kee-"+prefix+"-searchfilter-all")
            return "all";
        else
            return "current";
    }
}
