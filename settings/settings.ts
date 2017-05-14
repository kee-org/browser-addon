/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />
/// <reference path="../common/SiteConfigManager.ts" />
/// <reference path="../common/ConfigManager.ts" />

declare const chrome: typeof browser;

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

}

function saveSearchAllOpenDBs (e) {
  e.preventDefault();
  configManager.setASAP({searchAllOpenDBs: (document.getElementById("pref_searchAllOpenDBs_label") as HTMLInputElement).checked});
}
function saveListAllOpenDBs (e) {
  e.preventDefault();
  configManager.setASAP({listAllOpenDBs: (document.getElementById("pref_listAllOpenDBs_label") as HTMLInputElement).checked});
}
function saveNotifyWhenLateDiscovery (e) {
  e.preventDefault();
  configManager.setASAP({notifyWhenLateDiscovery: (document.getElementById("pref_notifyWhenLateDiscovery_label") as HTMLInputElement).checked});
}
function saveAutoFillFormsWithMultipleMatches (e) {
  e.preventDefault();
  configManager.setASAP({autoFillFormsWithMultipleMatches: (document.getElementById("pref_autoFillFormsWithMultipleMatches_label") as HTMLInputElement).checked});
}
function saveTriggerChangeInputEventAfterFill (e) {
  e.preventDefault();
  configManager.setASAP({triggerChangeInputEventAfterFill: (document.getElementById("pref_triggerChangeInputEventAfterFill_label") as HTMLInputElement).checked});
}
function saveSaveFavicons (e) {
  e.preventDefault();
  configManager.setASAP({saveFavicons: (document.getElementById("pref_saveFavicons_label") as HTMLInputElement).checked});
}
function saveRememberMRUGroup (e) {
  e.preventDefault();
  configManager.setASAP({rememberMRUGroup: (document.getElementById("pref_rememberMRUGroup_label") as HTMLInputElement).checked});
}
function saveNotifyWhenEntryUpdated (e) {
  e.preventDefault();
  configManager.setASAP({notifyWhenEntryUpdated: (document.getElementById("pref_notifyWhenEntryUpdated_label") as HTMLInputElement).checked});
}
function saveLogMethodConsole (e) {
  e.preventDefault();
  configManager.setASAP({logMethodConsole: (document.getElementById("pref_logMethodConsole") as HTMLInputElement).checked});
}
function saveRememberMRUDB (e) {
  e.preventDefault();
  configManager.setASAP({rememberMRUDB: (document.getElementById("pref_rememberMRUDB_label") as HTMLInputElement).checked});
}

function saveWhenKeefoxChoosesStandardForm (e) {
  e.preventDefault();
  const selectedValue = (document.getElementById("pref_when_keefox_chooses_standard_form_desc") as HTMLSelectElement).value;
  configManager.setASAP({autoFillForms: selectedValue != "DoNothing"});
  configManager.setASAP({autoSubmitForms: selectedValue == "FillAndSubmit"});
}

function saveWhenUserChooses (e) {
  e.preventDefault();
  const selectedValue = (document.getElementById("pref_when_user_chooses_desc") as HTMLSelectElement).value;
  configManager.setASAP({autoSubmitMatchedForms: selectedValue == "FillAndSubmit"});
}

function saveLogLevel (e) {
  e.preventDefault();
  const selectedValue = (document.getElementById("pref_logLevel_desc") as HTMLSelectElement).value;
  configManager.setASAP({logLevel: logLevelFromString(selectedValue)});
}

function saveKPRPCPort (e) {
  e.preventDefault();
  configManager.setASAP({KeePassRPCWebSocketPort: parseInt((document.getElementById("pref_keePassRPCPort_label") as HTMLInputElement).value)});
}

function saveKPRPCDBToOpen (e) {
    e.preventDefault();
    configManager.setASAP({keePassDBToOpen: (document.getElementById("pref_keePassDBToOpen_label") as HTMLInputElement).value});
}

function logLevelFromString (level) {
    switch (level)
    {
        case "Debugging": return 4;
        case "Information": return 3;
        case "Warnings": return 2;
        case "Errors": return 1;
        default: return 0;
    }
}

function stringFromLogLevel (level) {
    switch (level)
    {
        case 4: return "Debugging";
        case 3: return "Information";
        case 2: return "Warnings";
        case 1: return "Errors";
        default: return "Internal error - report to KeeFox team";
    }
}

document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage) );
