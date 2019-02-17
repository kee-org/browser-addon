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

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
