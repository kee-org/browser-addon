let appState: AppState;
let keePopupLoadTime = Date.now();
let myPort: browser.runtime.Port;

function updateConnectionStatus () {
    if (appState.connected) {
        if (appState.KeePassDatabases.length > 1) {
            $("#connectionStatus").innerText = $STRF("loggedInMultiple_tip", [
                appState.KeePassDatabases.length.toString(),
                appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex].name
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

function startup () {
    KeeLog.debug("popup started");

    KeeLog.attachConfig(configManager.current);

    myPort = chrome.runtime.connect({ name: "browserPopup" });

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
    });

    document.getElementById("optionsLink").addEventListener("click", () => chrome.runtime.openOptionsPage() );
    document.getElementById("generatePasswordLink").addEventListener("click", () => myPort.postMessage({ action: Action.GeneratePassword }) );
    document.getElementById("saveLatestLogin").addEventListener("click", () => myPort.postMessage({ action: Action.SaveLatestLogin }) );
    document.getElementById("showMatchedLogins").addEventListener("click", () => myPort.postMessage({ action: Action.ShowMatchedLoginsPanel }) );

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
