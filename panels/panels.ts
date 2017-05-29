/// <reference path="MatchedLoginsPanel.ts" />
/// <reference path="GeneratePasswordPanel.ts" />

declare const chrome: typeof browser;
let appState: AppState;
let tabState: TabState;

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
let generatePasswordPanel: GeneratePasswordPanel;

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
        document.getElementById("header").innerText = $STR("matched_logins_label");
        myPort.onMessage.addListener(function (m: AddonMessage) {
            KeeFoxLog.debug("In iframe script, received message from background script: ");

            if (m.appState) this.updateAppState(m.appState);
            if (m.tabState) this.updateTabState(m.tabState);

            //TODO:c: sometimes don't do this?
            matchedLoginsPanel.createNearNode(document.getElementById("header"), tabState.logins);
        });
    break;
    case "generatePassword":
        generatePasswordPanel = new GeneratePasswordPanel();
        document.getElementById("header").innerText = $STR("Menu_Button_copyNewPasswordToClipboard_label");
        myPort.onMessage.addListener(function (m: AddonMessage) {
            KeeFoxLog.debug("In iframe script, received message from background script: ");

            if (m.appState) this.updateAppState(m.appState);
            if (m.tabState) this.updateTabState(m.tabState);

            generatePasswordPanel.createNearNode(document.getElementById("header"));
        });
    break;
}

function closePanel () {
    //TODO:3: Might want more fine-grained closing in future
    myPort.postMessage( { action: "closeAllPanels" } );
}

const closeButton = document.createElement("button");
closeButton.textContent = $STR("close");
closeButton.addEventListener("click", e => {
    closePanel();
});
document.getElementById("closeContainer").appendChild(closeButton);

if (params["autoCloseTime"]) {
    const autoCloseTime = parseInt(params["autoCloseTime"]);
    if (!Number.isNaN(autoCloseTime) && autoCloseTime > 0) {
        const autoCloseTimerEnd = Date.now() + autoCloseTime*1000;
        const autoCloseInterval = setInterval(() => {
            const now = Date.now();
            if (now >= autoCloseTimerEnd) {
                clearInterval(autoCloseInterval);
                closePanel();
            }
            const secondsRemaining = Math.ceil((autoCloseTimerEnd - now)/1000);
            document.getElementById("autoCloseLabel").textContent = $STRF("autoclose_countdown", secondsRemaining.toString());
        }, 1000);
        const autoClose = document.createElement("div");
        autoClose.id="autoClose";
        const autoCloseSetting = document.createElement("input");
        autoCloseSetting.type = "checkbox";
        autoCloseSetting.checked = true;
        autoCloseSetting.addEventListener("change", e => {
            clearInterval(autoCloseInterval);
        });
        const autoCloseLabel = document.createElement("label");
        autoCloseLabel.textContent = $STRF("autoclose_countdown", autoCloseTime.toString());
        autoCloseLabel.htmlFor = "autoClose";
        autoCloseLabel.id = "autoCloseLabel";
        autoClose.appendChild(autoCloseSetting);
        autoClose.appendChild(autoCloseLabel);
        document.getElementById("closeContainer").appendChild(autoClose);
    }
}

KeeFoxLog.info("iframe page ready");