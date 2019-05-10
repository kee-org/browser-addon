let appState: AppState;
let keePopupLoadTime = Date.now();
let myPort: browser.runtime.Port;
let searchPanel: SearchPanel;

function updateConnectionStatus () {
    if (appState.connected) {
        if (appState.KeePassDatabases.length > 1) {
            $("#connectionStatus").innerText = $STRF("loggedInMultiple_tip", [
                appState.KeePassDatabases.length.toString(),
                getDatabaseName(appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex])
            ]);
        } else if (appState.KeePassDatabases.length == 1) {
            $("#connectionStatus").innerText = $STRF("loggedIn_tip", getDatabaseName(appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex]));
        } else {
            $("#connectionStatus").innerText = $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLoginToKeePassButton_tip");
        }
    } else {
        $("#connectionStatus").innerText = $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLaunchKeePassButton_tip");
    }
    if (appState.connectedWebsocket) {
        const hasWebsocketDBs = appState.KeePassDatabases.some(db => db.sessionType === SessionType.Websocket);
        const supportsWebsocketFocus = appState.KeePassDatabases.some(db => {
            return db.sessionType === SessionType.Websocket &&
                db.sessionFeatures.indexOf("KPRPC_OPEN_AND_FOCUS_DATABASE") >= 0;
        });
        if (!hasWebsocketDBs || supportsWebsocketFocus) {
            $("#password-open-keepass").classList.remove("hide");
        } else {
            $("#password-open-keepass").classList.add("hide");
        }
    } else {
        $("#password-open-keepass").classList.add("hide");
    }
}

function getDatabaseName (database) {
    return database.name ? database.name : database.fileName.replace(/^.*[\\\/]/, "");
}

function updateAppState (newState) {
    if (!appState) {
        //$("#debug").innerText = "Render time: " + (Date.now() - keePopupLoadTime);
        $("#main").classList.remove("hidden");
        $("#loading").classList.add("hidden");
    }

    appState = newState;
}

function updateNotifications () {
    const notificationContainer = $("#notifications");
    if (appState.notifications.length > 0) {
        notificationContainer.classList.remove("hidden");
    } else {
        notificationContainer.classList.add("hidden");
    }
    while (notificationContainer.hasChildNodes()) {
        notificationContainer.removeChild(notificationContainer.lastChild);
    }
    for (const notificationData of appState.notifications) {
        const notification = new KeeNotification(
            notificationData.name,
            notificationData.buttons,
            notificationData.id,
            notificationData.messages,
            notificationData.priority,
            notificationData.allowMultiple,
            myPort);
        notificationContainer.appendChild(notification.render());
    }
}

function updateSearchPanel (entryDetails?: keeLoginInfo) {
    if (appState.connected && appState.KeePassDatabases.length > 0)
    {
        if (entryDetails) {
            searchPanel.createContextActions(entryDetails);
        } else {
            searchPanel = new SearchPanel();

            // focus and pre-populate search box if it's not already visible
            if ($("#searchPanel").classList.contains("hidden")) {
                searchPanel.init(appState.currentSearchTerm);
                $("#searchPanel").classList.remove("hidden");
                window.focus();
                $("#searchBox").focus();
            } else {
                searchPanel.init();
            }
        }
    } else {
        $("#searchPanel").classList.add("hidden");
    }
}

function convertSingleLoginEntryResult (result)
{
    let isError = false;

    try {
        if (result && result.length == 1) {
                const kfl = new keeLoginInfo();
                kfl.initFromEntry(result[0]);
                return kfl;
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

    myPort = browser.runtime.connect({ name: "browserPopup" });

    myPort.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser popup script, received message from background script: ");
        updateAppState(m.appState);
        updateConnectionStatus();
        updateNotifications();
        if (appState.connected) {
            document.getElementById("generatePasswordLink").style.display = "block";
        } else {
            document.getElementById("generatePasswordLink").style.display = "none";
        }
        if (appState.connected && m.submittedData) {
            document.getElementById("saveLatestLogin").style.display = "block";
        } else {
            document.getElementById("saveLatestLogin").style.display = "none";
        }
        if (appState.connected && m.loginsFound) {
            document.getElementById("showMatchedLogins").style.display = "block";
        } else {
            document.getElementById("showMatchedLogins").style.display = "none";
        }

        if (appState.connected && m.findMatchesResult) {
            updateSearchPanel(convertSingleLoginEntryResult(m.findMatchesResult));
        } else {
            updateSearchPanel();
        }

        // Some Firefox bug causes the scroll position to go wrong sometimes
        // so this forces the correct position
        window.scrollTo(0, 0);

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
        if (appState.connectedWebsocket) {
            myPort.postMessage({ action: Action.OpenKeePass });
        } else {
            KeeLog.info("KeePass no longer connected so taking no action");
        }
        window.close();
    });

    setupKeeVaultLaunchMessage();

    KeeLog.info("popup ready");
}

function setupKeeVaultLaunchMessage () {
    if (configManager.current.keeVaultLaunchMessageDismissed) return;
    if (configManager.current.keeVaultLaunchStart === undefined || configManager.current.keeVaultLaunchEnd === undefined) return;
    const now = Date.now();
    if (configManager.current.keeVaultLaunchStart > now || configManager.current.keeVaultLaunchEnd < now) return;

    document.querySelector(".keevault-launch-message-cta").addEventListener("click", () => {
        // 404 until we have a finalised URL on Product Hunt
        browser.tabs.create({ url: "https://www.kee.pm/launch-button-redirect-to-ph" });
        window.close();
    });
    document.getElementById("keevault-launch-message-hide").addEventListener("click", ev => {
        ev.preventDefault();
        ev.stopPropagation();
        configManager.setASAP({keeVaultLaunchMessageDismissed: true});
        document.getElementById("keevault-launch-message-hide").classList.add("hide");
        document.getElementById("keevault-launch-message-hide-confirmed").classList.remove("hide");
    });
    document.querySelector(".keevault-launch-message").classList.remove("hide");
}

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
