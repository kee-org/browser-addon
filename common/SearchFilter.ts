import { SearcherAll } from "./SearcherAll";
import { utils } from "./utils";

// Pretend browser (WebExtensions) is chrome (we include a
// polyfill from Mozilla but it doesn't work in some cases)
declare const chrome;

export class SearchFilter {

    public attachFilterToSearchBox (searchBox: HTMLInputElement, searchRequestor, currentURIs: string[], search: SearcherAll) {
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
        if (currentURL) {
            try {
                const hostname = new URL(currentURL).hostname;
                const isIPAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(hostname);
                const domain = isIPAddress ? hostname : utils.psl.getDomain(hostname);
                this.updateSearchFilterFinish(searchFilter, current, [domain]);
            } catch (e) {
                searchFilter.setAttribute("disabled", "true");
            }
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
