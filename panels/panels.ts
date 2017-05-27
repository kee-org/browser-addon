/// <reference path="MatchedLoginsPanel.ts" />

function updateAppState (newState: AppState) {
    const oldState = appState;
    appState = newState;
    const shouldRemoveMatches = (oldState && oldState.connected &&
        (!appState.connected || (oldState.KeePassDatabases.length > 0 && appState.KeePassDatabases.length == 0))
        );
}

KeeFoxLog.debug("iframe page started");

let matchedLoginsPanel: MatchedLoginsPanel;

let params = {};
document.location.search.substr(1).split("&").forEach(pair => {
  const [key, value] = pair.split("=");
  params[key] = value;
});

const parentFrameId = params["parentFrameId"];

let myPort = chrome.runtime.connect({ name: "iframe_" + parentFrameId });

switch (params["panel"])
{
    case "matchedLogins":
        matchedLoginsPanel = new MatchedLoginsPanel();
        myPort.onMessage.addListener(function (m: AddonMessage) {
            KeeFoxLog.debug("In iframe script, received message from background script: ");

            if (m.appState) this.updateAppState(m.appState);

            //TODO:c: sometimes don't do this?
            matchedLoginsPanel.createNearNode(document.getElementById("arrowContainer"), appState.logins);
        });
    break;
}

KeeFoxLog.info("iframe page ready");
