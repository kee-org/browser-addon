/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/AddonMessage.ts" />
/// <reference path="../common/SiteConfigManager.ts" />
/// <reference path="../common/ConfigManager.ts" />

declare const chrome: typeof browser;

function setupPage () {
    (document.getElementById("pref_searchAllOpenDBs_label") as HTMLInputElement).checked
        = configManager.current.searchAllOpenDBs ? configManager.current.searchAllOpenDBs : null;
}

function saveOptions (e) {
  e.preventDefault();
  configManager.setASAP({searchAllOpenDBs: (document.getElementById("pref_searchAllOpenDBs_label") as HTMLInputElement).checked});
}

document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage) );
document.querySelector("form").addEventListener("submit", saveOptions);
