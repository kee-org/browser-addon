/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />

// Pretend browser (WebExtensions) is chrome (there's a polyfill from Mozilla but it doesn't work well enough yet so this buys us time)
//TODO:c: Review before launch - maybe can switch to browser + polyfill? Promises (and Edge support) are sticking points at the moment.
declare const chrome: typeof browser;

let appState: AppState;
let keefoxPopupLoadTime = Date.now();

function updateConnectionStatus () {
    if (appState.connected) {
        if (appState.KeePassDatabases.length > 1) {
            $("#connectionStatus").innerText = $STRF("loggedInMultiple_tip", [
                appState.KeePassDatabases.length,
                appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex].name
            ]);
        } else if (appState.KeePassDatabases.length == 1) {
            $("#connectionStatus").innerText = $STRF("loggedIn_tip", appState.KeePassDatabases[appState.ActiveKeePassDatabaseIndex].name);
        } else {
            $("#connectionStatus").innerText = $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLoginToKeePassButton_tip");
        }
    } else {
        $("#connectionStatus").innerText = $STR("notifyBarLaunchKeePass_label") + " " + $STR("notifyBarLaunchKeePassButton_tip");
    }
}

function updateAppState (newState) {
    if (!appState) {
        //$("#debug").innerText = "Render time: " + (Date.now() - keefoxPopupLoadTime);
        $("#main").classList.remove("hidden");
        $("#loading").classList.add("hidden");
    }

    appState = newState;
}

function updateNotifications () {
    const notificationContainer = $("#notifications");
    while (notificationContainer.hasChildNodes()) {
        notificationContainer.removeChild(notificationContainer.lastChild);
    }
    for (const notificationData of appState.notifications) {
        const notification = new KeeFoxNotification(
            notificationData.name,
            notificationData.buttons,
            notificationData.id,
            notificationData.message,
            notificationData.priority,
            notificationData.allowMultiple);
        notificationContainer.appendChild(notification.render());
    }
}

KeeFoxLog.debug("popup started");


let myPort = chrome.runtime.connect({ name: "browserPopup" });
myPort.postMessage({ greeting: "hello from content script" });

myPort.onMessage.addListener(function (m: any) {
    KeeFoxLog.configureFromPreferences(m.appState.config);
    KeeFoxLog.debug("In browser popup script, received message from background script: ");
    KeeFoxLog.debug(m.appState.connected);
    updateAppState(m.appState);
    updateConnectionStatus();
    updateNotifications();
    if (appState.connected) {
        document.getElementById("generatePasswordLink").style.display = "block";
    } else {
        document.getElementById("generatePasswordLink").style.display = "none";
    }
});

document.getElementById("optionsLink").addEventListener("click", () => chrome.runtime.openOptionsPage() );
document.getElementById("generatePasswordLink").addEventListener("click", () => myPort.postMessage({ action: "generatePassword" }) );

KeeFoxLog.info("popup ready");
