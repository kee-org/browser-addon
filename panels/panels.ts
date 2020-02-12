import { copyStringToClipboard } from "./copyStringToClipboard";
import { MatchedLoginsPanel } from "./MatchedLoginsPanel";
import { GeneratePasswordPanel } from "./GeneratePasswordPanel";
import { SavePasswordPanel } from "./SavePasswordPanel";
import { FrameState } from "../common/FrameState";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { SyncContent } from "../store/syncContent";
import store from "../store";
import { MutationPayload } from "vuex";
import { Port } from "../common/port";

let frameState: FrameState;

function updateFrameState (newState: FrameState) {
    const oldState = frameState;
    frameState = newState;
}

function closePanel () {
    //TODO:4: Might want more fine-grained closing in future
    Port.postMessage( { action: Action.CloseAllPanels } );
}

function startup () {
    KeeLog.debug("iframe page starting");
    KeeLog.attachConfig(configManager.current);
    syncContent = new SyncContent(store);
    Port.startup("iframe_" + parentFrameId);

    let cancelAutoClose: () => void;

    switch (params["panel"])
    {
        case "matchedLogins":
            matchedLoginsPanel = new MatchedLoginsPanel(Port.raw, closePanel, parentFrameId);
            document.getElementById("header").innerText = $STR("matched_logins_label");
            Port.raw.onMessage.addListener(function (m: AddonMessage) {
                KeeLog.debug("In iframe script, received message from background script");

                if (m.initialState) {
                    syncContent.init(m.initialState, (mutation: MutationPayload) => {
                        Port.postMessage({mutation} as AddonMessage);
                    });
                }
                if (m.mutation) {
                    syncContent.onRemoteMutation(m.mutation);
                    return;
                }

                if (m.frameState) updateFrameState(m.frameState);

                const mainPanel = matchedLoginsPanel.createNearNode(document.getElementById("header"), frameState.logins);

                // Focus the window (required in Firefox to get focus onto the new iframe)
                // and then the first login item (enables keyboard navigation). Combined,
                // these operations blur focus from the text box, thereby hiding any
                // autocomplete popup the browser has displayed)
                window.focus();
                (document.getElementById("Kee-MatchedLoginsList").firstChild.firstChild as any).focus();

                if (cancelAutoClose) mainPanel.addEventListener("click", cancelAutoClose);
            });
            break;
        case "generatePassword":
            generatePasswordPanel = new GeneratePasswordPanel(Port.raw, closePanel);
            document.getElementById("header").innerText = $STR("Menu_Button_copyNewPasswordToClipboard_label");
            Port.raw.onMessage.addListener(function (m: AddonMessage) {
                KeeLog.debug("In iframe script, received message from background script");

                if (m.initialState) {
                    syncContent.init(m.initialState, (mutation: MutationPayload) => {
                        Port.postMessage({mutation} as AddonMessage);
                    });
                }
                if (m.mutation) {
                    syncContent.onRemoteMutation(m.mutation);
                    return;
                }

                if (m.frameState) updateFrameState(m.frameState);

                if (m.passwordProfiles && m.passwordProfiles.length > 0) {
                    const mainPanel = generatePasswordPanel.createNearNode(document.getElementById("header"), m.passwordProfiles.map(p => p.name));

                    // Focus the window (required in Firefox to get focus onto the new iframe)
                    // and then the first password profile (enables keyboard navigation).
                    window.focus();
                    (document.getElementById("GeneratePasswordContainer").querySelector(".passwordProfileList").firstChild as any).focus();
                } else if (m.generatedPassword) {
                    copyStringToClipboard(m.generatedPassword);

                    if (configManager.current.notifyPasswordAvailableForPaste) {
                        const container = document.getElementById("GeneratePasswordContainer");

                        while (container.hasChildNodes()) {
                            container.removeChild(container.lastChild);
                        }

                        const text1 = document.createElement("div");
                        text1.innerText = $STR("generatePassword_done_1");
                        container.appendChild(text1);
                        const text2 = document.createElement("div");
                        text2.innerText = $STR("generatePassword_done_2");
                        container.appendChild(text2);

                        const buttonNever = document.createElement("button");
                        buttonNever.style.marginTop = "20px";
                        buttonNever.innerText = $STR("dont_show_again");
                        buttonNever.addEventListener("click", () => {
                            configManager.setASAP({notifyPasswordAvailableForPaste: false});
                            closePanel();
                        });
                        container.appendChild(buttonNever);
                    } else {
                        closePanel();
                    }

                } else {
                    window.focus();
                    Port.postMessage({ action: Action.GetPasswordProfiles });
                }
            });
            break;
        case "savePassword":
            document.getElementById("header").innerText = $STR("save_login");
            Port.raw.onMessage.addListener(function (m: AddonMessage) {
                KeeLog.debug("In iframe script, received message from background script");

                if (m.initialState) {
                    syncContent.init(m.initialState, (mutation: MutationPayload) => {
                        Port.postMessage({mutation} as AddonMessage);
                    });
                }
                if (m.mutation) {
                    syncContent.onRemoteMutation(m.mutation);
                    return;
                }

                if (m.frameState) updateFrameState(m.frameState);

                savePasswordPanel = new SavePasswordPanel(Port.raw, m.submittedData);

                const mainPanel = savePasswordPanel.createNearNode(document.getElementById("header"));
                if (cancelAutoClose) mainPanel.addEventListener("click", cancelAutoClose);
            });
            break;
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

            cancelAutoClose = () => {
                clearInterval(autoCloseInterval);
                autoCloseSetting.style.display = "none";
                autoCloseLabel.textContent = $STR("autoclose_cancelled");
            };

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
            autoCloseSetting.id = "autoCloseCheckbox";
            autoCloseSetting.type = "checkbox";
            autoCloseSetting.checked = true;
            autoCloseSetting.addEventListener("change", cancelAutoClose);
            const autoCloseLabel = document.createElement("label");
            autoCloseLabel.textContent = $STRF("autoclose_countdown", autoCloseTime.toString());
            autoCloseLabel.htmlFor = "autoCloseCheckbox";
            autoCloseLabel.id = "autoCloseLabel";
            autoClose.appendChild(autoCloseSetting);
            autoClose.appendChild(autoCloseLabel);
            document.getElementById("closeContainer").appendChild(autoClose);

            document.getElementById("optionsContainer").addEventListener("click", cancelAutoClose);
        }
    }
    KeeLog.info("iframe page ready");
}

let matchedLoginsPanel: MatchedLoginsPanel;
let generatePasswordPanel: GeneratePasswordPanel;
let savePasswordPanel: SavePasswordPanel;
let syncContent: SyncContent;

const params = {};

document.location.search.substr(1).split("&").forEach(pair => {
    const [key, value] = pair.split("=");
    params[key] = value;
});

const parentFrameId = parseInt(params["parentFrameId"]);

// Load our config and start the panel once done
configManager.load(startup);
