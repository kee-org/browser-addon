/// <reference path="MatchedLoginsPanel.ts" />

function updateAppState (newState: AppState) {
    const oldState = appState;
    appState = newState;
}

function updateTabState (newState: TabState) {
    const oldState = tabState;
    tabState = newState;
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
            if (m.tabState) this.updateTabState(m.tabState);

            //TODO:c: sometimes don't do this?
            matchedLoginsPanel.createNearNode(document.getElementById("arrowContainer"), tabState.logins);
        });
    break;
}

KeeFoxLog.info("iframe page ready");
