/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />
/// <reference path="../common/ConfigManager.ts" />

class SearchResult extends SiteConfigNode {
    value: string;
    method: "Exact" | "Prefix" | "Regex";
    target: "Domain" | "Host" | "Page";
}

declare const chrome: typeof browser;

let siteModeAll: boolean = true;
let specificSite: SearchResult;
let searchResults: SearchResult[];

function setupPage () {
    loadInitialConfig();
    setupInputListeners();
    document.getElementById("i18n_root").style.display = "block";
}

function loadInitialConfig () {

    (document.getElementById("pref_searchAllOpenDBs_label") as HTMLInputElement).checked
        = configManager.current.searchAllOpenDBs ? configManager.current.searchAllOpenDBs : null;
    (document.getElementById("pref_listAllOpenDBs_label") as HTMLInputElement).checked
        = configManager.current.listAllOpenDBs ? configManager.current.listAllOpenDBs : null;
    (document.getElementById("pref_notifyWhenLateDiscovery_label") as HTMLInputElement).checked
        = configManager.current.notifyWhenLateDiscovery ? configManager.current.notifyWhenLateDiscovery : null;

    (document.getElementById("pref_autoFillFormsWithMultipleMatches_label") as HTMLInputElement).checked
        = configManager.current.autoFillFormsWithMultipleMatches ? configManager.current.autoFillFormsWithMultipleMatches : null;
    (document.getElementById("pref_triggerChangeInputEventAfterFill_label") as HTMLInputElement).checked
        = configManager.current.triggerChangeInputEventAfterFill ? configManager.current.triggerChangeInputEventAfterFill : null;

    const save = configManager.current.siteConfig.pageRegex["^.*$"].config.preventSaveNotification;
    (document.getElementById("pref_notifyBarRequestPasswordSave_label") as HTMLInputElement).checked
        = save ? save : null;
    (document.getElementById("pref_saveFavicons_label") as HTMLInputElement).checked
        = configManager.current.saveFavicons ? configManager.current.saveFavicons : null;
    (document.getElementById("pref_rememberMRUGroup_label") as HTMLInputElement).checked
        = configManager.current.rememberMRUGroup ? configManager.current.rememberMRUGroup : null;
    (document.getElementById("pref_notifyWhenEntryUpdated_label") as HTMLInputElement).checked
        = configManager.current.notifyWhenEntryUpdated ? configManager.current.notifyWhenEntryUpdated : null;

    (document.getElementById("pref_logMethodConsole") as HTMLInputElement).checked
        = configManager.current.logMethodConsole ? configManager.current.logMethodConsole : null;

    (document.getElementById("pref_rememberMRUDB_label") as HTMLInputElement).checked
        = configManager.current.rememberMRUDB ? configManager.current.rememberMRUDB : null;

    (document.getElementById("pref_when_keefox_chooses_standard_form_desc") as HTMLSelectElement).value =
        configManager.current.autoSubmitForms ? "FillAndSubmit" : (configManager.current.autoFillForms ? "Fill" : "DoNothing");
    (document.getElementById("pref_when_user_chooses_desc") as HTMLSelectElement).value =
        configManager.current.autoSubmitMatchedForms ? "FillAndSubmit" : "Fill";
    (document.getElementById("pref_logLevel_desc") as HTMLSelectElement).value =
        stringFromLogLevel(configManager.current.logLevel);

    (document.getElementById("pref_keePassRPCPort_label") as HTMLInputElement).value =
        configManager.current.KeePassRPCWebSocketPort ? configManager.current.KeePassRPCWebSocketPort.toString() : "";

    (document.getElementById("pref_keePassDBToOpen_label") as HTMLInputElement).value =
        configManager.current.keePassDBToOpen;

}

function setupInputListeners () {

    document.getElementById("pref_searchAllOpenDBs_label").addEventListener("change", saveSearchAllOpenDBs);
    document.getElementById("pref_listAllOpenDBs_label").addEventListener("change", saveListAllOpenDBs);
    document.getElementById("pref_notifyWhenLateDiscovery_label").addEventListener("change", saveNotifyWhenLateDiscovery);
    document.getElementById("pref_autoFillFormsWithMultipleMatches_label").addEventListener("change", saveAutoFillFormsWithMultipleMatches);
    document.getElementById("pref_triggerChangeInputEventAfterFill_label").addEventListener("change", saveTriggerChangeInputEventAfterFill);

    document.getElementById("pref_notifyBarRequestPasswordSave_label").addEventListener("change", saveOfferToSavePasswords);
    document.getElementById("pref_saveFavicons_label").addEventListener("change", saveSaveFavicons);
    document.getElementById("pref_rememberMRUGroup_label").addEventListener("change", saveRememberMRUGroup);
    document.getElementById("pref_notifyWhenEntryUpdated_label").addEventListener("change", saveNotifyWhenEntryUpdated);
    document.getElementById("pref_logMethodConsole").addEventListener("change", saveLogMethodConsole);
    document.getElementById("pref_rememberMRUDB_label").addEventListener("change", saveRememberMRUDB);

    document.getElementById("pref_when_keefox_chooses_standard_form_desc").addEventListener("change", saveWhenKeefoxChoosesStandardForm);
    document.getElementById("pref_when_user_chooses_desc").addEventListener("change", saveWhenUserChooses);
    document.getElementById("pref_logLevel_desc").addEventListener("change", saveLogLevel);

    document.getElementById("pref_keePassRPCPort_label").addEventListener("change", saveKPRPCPort);

    document.getElementById("pref_keePassDBToOpen_label").addEventListener("change", saveKPRPCDBToOpen);

    document.getElementById("siteOptionsModeAll").addEventListener("change", switchToAllSitesMode);
    document.getElementById("siteOptionsModeSpecific").addEventListener("change", switchToSpecificSitesMode);

    document.getElementById("siteChooserSearch").addEventListener("input", siteChooserKeyPress);
    document.getElementById("siteSearchClearButton").addEventListener("click", siteChooserClearSearch);
}

function switchToAllSitesMode (e) {
    e.preventDefault();
    if (e.target.checked) {
        siteModeAll = true;
        document.getElementById("siteChooser").style.display = "none";

        document.getElementById("settings").style.display = "block";

        document.getElementById("panelFindingEntries").style.display = "block";
        document.getElementById("panelFillingEntries").style.display = "block";
        document.getElementById("panelLogging").style.display = "block";
        document.getElementById("panelAdvanced").style.display = "block";

        [].forEach.call($$(".siteSpecificToggle"), node => (node as HTMLElement).style.display = "none");
        [].forEach.call($$(".nonSiteSpecificField"), node => (node as HTMLElement).style.display = null);

        //$$(".siteSpecificToggle").forEach(node => (node as HTMLElement).style.display = "none");
        //TODO: disable/enable fields

        // Update field values
        const save = configManager.current.siteConfig.pageRegex["^.*$"].config.preventSaveNotification;
    (document.getElementById("pref_notifyBarRequestPasswordSave_label") as HTMLInputElement).checked
        = save ? save : null;

    }
}

function switchToSpecificSitesMode (e) {
    e.preventDefault();
    if (e.target.checked) {
        siteModeAll = false;
        //specificSite = { value: "test", config: {}, matchWeight: 10, source: "Test" };
        document.getElementById("siteChooser").style.display = "block";

        // only show settings when we have a known site to configure
        document.getElementById("settings").style.display = "none";

        document.getElementById("panelFindingEntries").style.display = "none";
        document.getElementById("panelFillingEntries").style.display = "none";
        document.getElementById("panelLogging").style.display = "none";
        document.getElementById("panelAdvanced").style.display = "none";

        [].forEach.call($$(".siteSpecificToggle"), node => (node as HTMLElement).style.display = null);
        [].forEach.call($$(".nonSiteSpecificField"), node => (node as HTMLElement).style.display = "none");
        //[].forEach.call($$(".siteSpecificField"), node => (node as HTMLElement).style.display = null);

        //TODO: disable/enable fields

    }
}

function siteChooserKeyPress (e) {
    const searchTerm = (document.getElementById("siteChooserSearch") as HTMLInputElement).value;

    document.getElementById("siteChooserSearchResults").style.display = "none";
    document.getElementById("siteAddButton").style.display = "none";
    document.getElementById("siteEditButton").style.display = "none";
    document.getElementById("siteChooserSearchResults").innerHTML = "";

    if (searchTerm.length < 2) {
        document.getElementById("siteSearchClearButton").style.display = "none";
        return;
    } else {
        document.getElementById("siteSearchClearButton").style.display = "block";
    }

    searchResults = findMatchingSiteConfigValues(searchTerm);

    if (searchResults.length == 0) {
        document.getElementById("siteAddButton").style.display = "block";
        return;
    } else if (searchResults.length == 1 && searchResults[0].value == searchTerm) {
        document.getElementById("siteEditButton").style.display = "block";
        return;
    }

    for (const resultIndex in searchResults) {
        const a = document.createElement("a");
        a.href = "#";
        a.innerText = searchResults[resultIndex].value;
        const li = document.createElement("li");
        li.addEventListener("click", selectSite.bind(this, resultIndex));

        li.appendChild(a);
        document.getElementById("siteChooserSearchResults").appendChild(li);

    }
    document.getElementById("siteChooserSearchResults").style.display = "block";
}

function selectSite (searchResultIndex) {

    specificSite = searchResults[searchResultIndex];

    document.getElementById("siteChooserSearchResults").style.display = "none";
    document.getElementById("siteAddButton").style.display = "none";
    document.getElementById("siteEditButton").style.display = "block";
    document.getElementById("siteSearchClearButton").style.display = "block";
    (document.getElementById("siteChooserSearch") as HTMLInputElement).value = specificSite.value;

    document.getElementById("settings").style.display = "block";

    // Update field values
    const save = specificSite.config.preventSaveNotification;
    (document.getElementById("pref_notifyBarRequestPasswordSave_label") as HTMLInputElement).checked
        = save ? save : null;
    //TODO: update more field data
}

function siteChooserClearSearch (e) {
    (document.getElementById("siteChooserSearch") as HTMLInputElement).value = "";
    document.getElementById("siteChooserSearchResults").style.display = "none";
    document.getElementById("siteSearchClearButton").style.display = "none";
    document.getElementById("siteAddButton").style.display = "none";
    document.getElementById("siteEditButton").style.display = "none";
    document.getElementById("settings").style.display = "none";
}

function findMatchingSiteConfigValues (searchTerm: string) {
    const results: SearchResult[] = [];

    const lookups: SiteConfigLookup[] = [];
    if (configManager.current.siteConfig.domainExact) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.domainExact, "Domain", "Exact");
    }
    if (configManager.current.siteConfig.domainPrefix) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.domainPrefix, "Domain", "Prefix");
    }
    if (configManager.current.siteConfig.domainRegex) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.domainRegex, "Domain", "Regex");
    }
    if (configManager.current.siteConfig.hostExact) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.hostExact, "Host", "Exact");
    }
    if (configManager.current.siteConfig.hostPrefix) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.hostPrefix, "Host", "Prefix");
    }
    if (configManager.current.siteConfig.hostRegex) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.hostRegex, "Host", "Regex");
    }
    if (configManager.current.siteConfig.pageExact) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.pageExact, "Page", "Exact");
    }
    if (configManager.current.siteConfig.pagePrefix) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.pagePrefix, "Page", "Prefix");
    }
    if (configManager.current.siteConfig.pageRegex) {
        findSiteConfigValues(searchTerm, results, configManager.current.siteConfig.pageRegex, "Page", "Regex");
    }

    //TODO:c: Order results
    return results;
}

function findSiteConfigValues (
    searchTerm: string,
    results: SearchResult[],
    lookup: SiteConfigLookup,
    target: "Domain" | "Host" | "Page",
    method: "Exact" | "Prefix" | "Regex"
    ) {

    for (const siteConfigNodeIndex in lookup) {
        if (siteConfigNodeIndex.startsWith(searchTerm)) {
            results.push(Object.assign(
                { value: siteConfigNodeIndex, target: target, method: method },
                lookup[siteConfigNodeIndex]));
        }
    }
}

function saveSearchAllOpenDBs (e) {
    e.preventDefault();
    configManager.setASAP({ searchAllOpenDBs: (document.getElementById("pref_searchAllOpenDBs_label") as HTMLInputElement).checked });
}

function saveListAllOpenDBs (e) {
    e.preventDefault();
    configManager.setASAP({ listAllOpenDBs: (document.getElementById("pref_listAllOpenDBs_label") as HTMLInputElement).checked });
}

function saveNotifyWhenLateDiscovery (e) {
    e.preventDefault();
    configManager.setASAP({ notifyWhenLateDiscovery: (document.getElementById("pref_notifyWhenLateDiscovery_label") as HTMLInputElement).checked });
}

function saveAutoFillFormsWithMultipleMatches (e) {
    e.preventDefault();
    configManager.setASAP({ autoFillFormsWithMultipleMatches: (document.getElementById("pref_autoFillFormsWithMultipleMatches_label") as HTMLInputElement).checked });
}

function saveTriggerChangeInputEventAfterFill (e) {
    e.preventDefault();
    configManager.setASAP({ triggerChangeInputEventAfterFill: (document.getElementById("pref_triggerChangeInputEventAfterFill_label") as HTMLInputElement).checked });
}

function saveOfferToSavePasswords (e) {
    e.preventDefault();
    const save = (document.getElementById("pref_notifyBarRequestPasswordSave_label") as HTMLInputElement).checked;

    if (siteModeAll) {
        configManager.current.siteConfig.pageRegex["^.*$"].config.preventSaveNotification = save;
    } else {
        const siteConfigLookup = configManager.siteConfigLookupFor(specificSite.target, specificSite.method);
        if (!siteConfigLookup) return;
        siteConfigLookup[specificSite.value].config.preventSaveNotification = save;
    }
    configManager.save();
}

function saveSaveFavicons (e) {
    e.preventDefault();
    configManager.setASAP({ saveFavicons: (document.getElementById("pref_saveFavicons_label") as HTMLInputElement).checked });
}

function saveRememberMRUGroup (e) {
    e.preventDefault();
    configManager.setASAP({ rememberMRUGroup: (document.getElementById("pref_rememberMRUGroup_label") as HTMLInputElement).checked });
}

function saveNotifyWhenEntryUpdated (e) {
    e.preventDefault();
    configManager.setASAP({ notifyWhenEntryUpdated: (document.getElementById("pref_notifyWhenEntryUpdated_label") as HTMLInputElement).checked });
}

function saveLogMethodConsole (e) {
    e.preventDefault();
    configManager.setASAP({ logMethodConsole: (document.getElementById("pref_logMethodConsole") as HTMLInputElement).checked });
}

function saveRememberMRUDB (e) {
    e.preventDefault();
    configManager.setASAP({ rememberMRUDB: (document.getElementById("pref_rememberMRUDB_label") as HTMLInputElement).checked });
}

function saveWhenKeefoxChoosesStandardForm (e) {
    e.preventDefault();
    const selectedValue = (document.getElementById("pref_when_keefox_chooses_standard_form_desc") as HTMLSelectElement).value;
    configManager.setASAP({ autoFillForms: selectedValue != "DoNothing" });
    configManager.setASAP({ autoSubmitForms: selectedValue == "FillAndSubmit" });
}

function saveWhenUserChooses (e) {
    e.preventDefault();
    const selectedValue = (document.getElementById("pref_when_user_chooses_desc") as HTMLSelectElement).value;
    configManager.setASAP({ autoSubmitMatchedForms: selectedValue == "FillAndSubmit" });
}

function saveLogLevel (e) {
    e.preventDefault();
    const selectedValue = (document.getElementById("pref_logLevel_desc") as HTMLSelectElement).value;
    configManager.setASAP({ logLevel: logLevelFromString(selectedValue) });
}

function saveKPRPCPort (e) {
    e.preventDefault();
    configManager.setASAP({ KeePassRPCWebSocketPort: parseInt((document.getElementById("pref_keePassRPCPort_label") as HTMLInputElement).value) });
}

function saveKPRPCDBToOpen (e) {
    e.preventDefault();
    configManager.setASAP({ keePassDBToOpen: (document.getElementById("pref_keePassDBToOpen_label") as HTMLInputElement).value });
}

function logLevelFromString (level) {
    switch (level) {
        case "Debugging": return 4;
        case "Information": return 3;
        case "Warnings": return 2;
        case "Errors": return 1;
        default: return 0;
    }
}

function stringFromLogLevel (level) {
    switch (level) {
        case 4: return "Debugging";
        case 3: return "Information";
        case 2: return "Warnings";
        case 1: return "Errors";
        default: return "Internal error - report to KeeFox team";
    }
}

document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage));
