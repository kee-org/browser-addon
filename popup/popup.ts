/// <reference path="../common/Logger.ts" />

// Pretend browser (WebExtensions) is chrome (there's a polyfill from Mozilla but it doesn't work well enough yet so this buys us time)
//TODO:c: Review before launch - maybe can switch to browser + polyfill? Promises (and Edge support) are sticking points at the moment.
declare const chrome: typeof browser;

let appState;
let keefoxPopupLoadTime = Date.now();

function updateConnectionStatus () {
  $("#connectionStatus").innerText = appState.connected ? "Connected" : "Not connected";
}

function updateAppState (newState) {
  if (!appState) {
    $("#debug").innerText = "Render time: " + (Date.now() - keefoxPopupLoadTime);
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
  for (const notification of appState.notifications) {
    notificationContainer.appendChild(notification.render());
  }
}

KeeFoxLog.debug("popup started");


let myPort = chrome.runtime.connect({ name: "browserPopup" });
myPort.postMessage({ greeting: "hello from content script" });

myPort.onMessage.addListener(function (m: any) {
  KeeFoxLog = new KeeFoxLogger(m.appState.config);
  KeeFoxLog.debug("In browser popup script, received message from background script: ");
  KeeFoxLog.debug(m.appState.connected);
  updateAppState(m.appState);
  updateConnectionStatus();
  updateNotifications();
});
KeeFoxLog.info("popup ready");
