import Vue from "vue";
import App from "./App.vue";
import store from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { Action } from "../common/Action";
import i18n from "vue-plugin-webextension-i18n";
import { VuexMessage, isVuexMessage } from "../common/VuexMessage";
import { myPort, startupPort } from "./port";
import { keeLoginInfo } from "../common/kfDataModel";

Vue.use(i18n);

Vue.prototype.$browser = browser;

/* eslint-disable no-new */
// tslint:disable-next-line:no-unused-expression
new Vue({
  el: "#main",
  store,
  render: h => h(App)
});

function convertSingleLoginEntryResult (result)
{
    let isError = false;

    try {
        if (result && result.length == 1) {
                const kfl = new keeLoginInfo();
                kfl.initFromEntry(result[0]);
                // strip functions in case this upsets vuex state transfer across processes
                return JSON.parse(JSON.stringify(kfl));
        } else {
            isError = true;
        }
    } catch (e) {
        isError = true;
    }

    if (isError) {
        KeeLog.error("Unexpected error handling response for detailed field data");
    }

    return;
}

function startup () {
    KeeLog.debug("popup started");

    KeeLog.attachConfig(configManager.current);

    startupPort();

    myPort.onMessage.addListener(function (m: AddonMessage | VuexMessage) {
        if (isVuexMessage(m)) return;
        KeeLog.debug("In browser popup script, received message from background script: ");
        //updateAppState(m.appState);
        // updateConnectionStatus();
        // updateNotifications();

        //TODO: once appstate is split and managed from background, etc. these
        //commits can all happen in bg process, with no need for this listener to be invoked at all
        if (m.appState) {
            store.dispatch("updateActiveKeePassDatabaseIndex", m.appState.ActiveKeePassDatabaseIndex);
            store.dispatch("updateConnected", m.appState.connected);
            store.dispatch("updateConnectedWebsocket", m.appState.connectedWebsocket);
            store.dispatch("updateCurrentSearchTerm", m.appState.currentSearchTerm);
            if (!m.appState.currentSearchTerm) store.dispatch("updateSearchResults", null);
            store.dispatch("updateKeePassDatabases", m.appState.KeePassDatabases);
            store.dispatch("updateLastKeePassRPCRefresh", m.appState.lastKeePassRPCRefresh);
            store.dispatch("updateLatestConnectionError", m.appState.latestConnectionError);
            store.dispatch("updateNotifications", m.appState.notifications);
            // store.dispatch("updateNotifications", [{
            //     name: "Test notification",
            //     buttons: [],
            //     id: "test-notification",
            //     messages: ["paragraph 1", "paragraph 2"],
            //     priority: "Medium",
            //     allowMultiple: false
            // }]);
            store.dispatch("updatePasswordProfiles", m.appState.PasswordProfiles);
        }
        store.dispatch("updateSubmittedData", m.submittedData);
        // store.dispatch("POP_Eg");
        store.dispatch("updateLoginsFound", !!m.loginsFound);

        // Do this one first...
        // if (appState.connected) { // showGeneratePasswordLink
        //     document.getElementById("generatePasswordLink").style.display = "block";
        // } else {
        //     document.getElementById("generatePasswordLink").style.display = "none";
        // }
        // if (appState.connected && m.submittedData) { // showSaveLatestLogin
        //     document.getElementById("saveLatestLogin").style.display = "block";
        // } else {
        //     document.getElementById("saveLatestLogin").style.display = "none";
        // }
        // if (appState.connected && m.loginsFound) { // showMatchedLogins
        //     document.getElementById("showMatchedLogins").style.display = "block";
        // } else {
        //     document.getElementById("showMatchedLogins").style.display = "none";
        // }

        if (store.state.connected && m.findMatchesResult) {
             store.dispatch("updateContextMenuResult", convertSingleLoginEntryResult(m.findMatchesResult) );
        // } else {
            //updateSearchPanel();
        }

        // This maybe could be moved to onMounted once all vuex state is changed before this popup is opened.
        setTimeout(() => {
            window.focus();
            const sb = $("#searchBox");
            if (sb) sb.focus();
            window.scrollTo(0, 0);
        }, 50);

        // // Some Firefox bug causes the scroll position to go wrong sometimes
        // // so this forces the correct position
        // window.scrollTo(0, 0);

        // https://bugs.chromium.org/p/chromium/issues/detail?id=31262 prevents us doing something like this:
        //
        // window.addEventListener("unload", function () {
        //     if (searchPanel.currentSearchTerm) {
        //         myPort.postMessage({currentSearchTerm: searchPanel.currentSearchTerm} as AddonMessage);
        //     }
        // });
        //
        // So we have to post messages on every keypress :-(
    });

    document.getElementById("optionsLink").addEventListener("click", () => {
        browser.runtime.openOptionsPage();
        window.close();
    });
    document.getElementById("generatePasswordLink").addEventListener("click", () => {
        myPort.postMessage({ action: Action.GeneratePassword });
        window.close();
    });
    document.getElementById("saveLatestLogin").addEventListener("click", () => {
        myPort.postMessage({ action: Action.SaveLatestLogin });
        window.close();
    });
    document.getElementById("showMatchedLogins").addEventListener("click", () => {
        myPort.postMessage({ action: Action.ShowMatchedLoginsPanel });
        window.close();
    });
    document.getElementById("helpLink").addEventListener("click", () => {
        browser.tabs.create({ url: "https://www.kee.pm/help" });
        window.close();
    });

    document.getElementById("password-open-kee-vault").addEventListener("click", async () => {
        KeeLog.debug("open Kee Vault requested");
        const vaultTabs = await browser.tabs.query({url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]});
        if (vaultTabs && vaultTabs[0]) {
            browser.tabs.update(vaultTabs[0].id, { active: true });
        } else {
            browser.tabs.create({
                url: "https://keevault.pm/",
                active: true
            });
        }
        window.close();
    });
    document.getElementById("password-open-keepass").addEventListener("click", () => {
        KeeLog.debug("open KeePass requested");
        if (store.state.connectedWebsocket) {
            myPort.postMessage({ action: Action.OpenKeePass });
        } else {
            KeeLog.info("KeePass no longer connected so taking no action");
        }
        window.close();
    });

    //setupKeeVaultLaunchMessage();

    KeeLog.info("popup ready");
}

// function setupKeeVaultLaunchMessage () {
//     if (configManager.current.keeVaultLaunchMessageDismissed) return;
//     if (configManager.current.keeVaultLaunchStart === undefined || configManager.current.keeVaultLaunchEnd === undefined) return;
//     const now = Date.now();
//     if (configManager.current.keeVaultLaunchStart > now || configManager.current.keeVaultLaunchEnd < now) return;

//     document.querySelector(".keevault-launch-message-cta").addEventListener("click", () => {
//         // 404 until we have a finalised URL on Product Hunt
//         browser.tabs.create({ url: "https://www.kee.pm/launch-button-redirect-to-ph" });
//         window.close();
//     });
//     document.getElementById("keevault-launch-message-hide").addEventListener("click", ev => {
//         ev.preventDefault();
//         ev.stopPropagation();
//         configManager.setASAP({keeVaultLaunchMessageDismissed: true});
//         document.getElementById("keevault-launch-message-hide").classList.add("hide");
//         document.getElementById("keevault-launch-message-hide-confirmed").classList.remove("hide");
//     });
//     document.querySelector(".keevault-launch-message").classList.remove("hide");
// }

// Hack around Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1516132
// and https://bugzilla.mozilla.org/show_bug.cgi?format=default&id=1416505
document.addEventListener("DOMContentLoaded", () => {
    let count = 0;
    const timer = setInterval(() => {
        let newPl = "";
        const pl = document.getElementById("searchBox").getAttribute("placeholder");
        if (pl.endsWith(" ")) newPl = pl.trim();
        else newPl = pl + " ";
        document.getElementById("searchBox").setAttribute("placeholder", newPl);
        count++;
        if (count > 20) clearInterval(timer);
    }, 200);
});

// Load our config and start the page script once done
configManager.load(startup);
