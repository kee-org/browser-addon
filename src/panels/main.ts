import { MatchedLoginsPanel } from "./MatchedLoginsPanel";
import { FrameState } from "../common/FrameState";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { SyncContent } from "../store/syncContent";
import useStore, { KeeStore, useStubStore } from "../store";
import { Port } from "../common/port";
import { App, createApp } from "vue";
import { createVuetify } from "vuetify";
import Panel from "./Panel.vue";
import { createPinia } from "pinia";
import { MutationPayload } from "../store/syncBackground";
import {setup as i18nSetup } from "../common/i18n";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

let frameState: FrameState;

function updateFrameState(newState: FrameState) {
    frameState = newState;
}

function closePanel() {
    //TODO:4: Might want more fine-grained closing in future
    Port.postMessage({ action: Action.CloseAllPanels });
}

let vueApp: App<Element>;
let syncContent: SyncContent;
let store: KeeStore;

function startup() {
    KeeLog.debug("iframe page starting");
    KeeLog.attachConfig(configManager.current);
    syncContent = new SyncContent();
    Port.startup("iframe_" + parentFrameId);

    let cancelAutoClose: () => void;

    const isLegacy = params["panel"]?.endsWith("Legacy");
    const darkTheme = params["theme"] === "dark";

    switch (params["panel"]) {
        case "matchedLoginsLegacy":
            matchedLoginsPanel = new MatchedLoginsPanel(Port.raw, closePanel, parentFrameId);
            store = useStubStore();
            document.getElementById("header").innerText = $STR("matched_logins_label");
            Port.raw.onMessage.addListener(function (m: AddonMessage) {
                KeeLog.debug("In iframe script, received message from background script");

                if (m.initialState) {
                    syncContent.init(store, m.initialState, (mutationPayload: MutationPayload) => {
                        const json = JSON.stringify(mutationPayload);
                        KeeLog.debug("New non-background panel mutation: " + json);
                        Port.postMessage({ mutation: JSON.parse(json) } as AddonMessage);
                    });
                }
                if (m.mutation) {
                    syncContent.onRemoteMutationPayload(m.mutation);
                    return;
                }

                if (m.frameState) updateFrameState(m.frameState);

                const mainPanel = matchedLoginsPanel.createNearNode(
                    document.getElementById("header"),
                    frameState.entries
                );

                // Focus the window (required in Firefox to get focus onto the new iframe)
                // and then the first entry item (enables keyboard navigation). Combined,
                // these operations blur focus from the text box, thereby hiding any
                // autocomplete popup the browser has displayed)
                window.focus();
                (document.getElementById("Kee-MatchedLoginsList").firstChild
                    .firstChild as any).focus();

                if (cancelAutoClose) mainPanel.addEventListener("click", cancelAutoClose);
            });
            break;
        case "generatePassword":
            Port.raw.onMessage.addListener(function (m: AddonMessage) {
                KeeLog.debug("In iframe script, received message from background script");

                if (m.initialState) {
                    try {
                        const piniaInstance = createPinia();
                        vueApp = createApp({
                            render: () => h(Panel, {})
                        });

                        const vuetify = createVuetify({
                            components,
                            directives,
                            theme: {
                                defaultTheme: darkTheme ? "dark" : "light",
                                themes: {
                                    dark: {
                                        dark: true,
                                        colors: {
                                            primary: "#1a466b",
                                            secondary: "#ABB2BF",
                                            tertiary: "#e66a2b",
                                            error: "#C34034",
                                            info: "#2196F3",
                                            success: "#4CAF50",
                                            warning: "#FFC107"
                                        }
                                    },
                                    light: {
                                        dark: false,
                                        colors: {
                                            primary: "#1a466b",
                                            secondary: "#13334e",
                                            tertiary: "#e66a2b",
                                            error: "#C34034",
                                            info: "#2196F3",
                                            success: "#4CAF50",
                                            warning: "#FFC107"
                                        }
                                    }
                                }
                            }
                        });
                        vueApp.use(vuetify);
                        vueApp.use(piniaInstance);
                        vueApp.config.globalProperties.$browser = browser;
                        vueApp.config.globalProperties.$i18n = browser.i18n.getMessage;
                        store = useStore();

                        syncContent.init(
                            store,
                            m.initialState,
                            (mutationPayload: MutationPayload) => {
                                //TODO: Find a way to more efficiently distribute Pinia Patch objects / Vue3 Proxy objects without this additional JSON mapping / manipulation
                                const json = JSON.stringify(mutationPayload);
                                KeeLog.debug("New non-background panel mutation: " + json);
                                Port.postMessage({ mutation: JSON.parse(json) } as AddonMessage);
                            },
                            () => {
                                vueApp.mount("#main");

                                //TODO:4: Could be done earlier to speed up initial rendering?
                                Port.postMessage({
                                    action: Action.GetPasswordProfiles
                                });
                            }
                        );
                    } catch (e) {
                        KeeLog.error("Failed to create user interface.", e);
                    }
                }
                if (m.mutation) {
                    syncContent.onRemoteMutationPayload(m.mutation);
                    return;
                }
                if (m.frameState) updateFrameState(m.frameState);
            });
            break;
    }

    if (isLegacy) {
        const closeButton = document.createElement("button");
        closeButton.textContent = $STR("close");
        closeButton.addEventListener("click", () => {
            closePanel();
        });
        document.getElementById("closeContainer").appendChild(closeButton);

        if (params["autoCloseTime"]) {
            const autoCloseTime = parseInt(params["autoCloseTime"]);
            // eslint-disable-next-line id-blacklist
            if (!Number.isNaN(autoCloseTime) && autoCloseTime > 0) {
                cancelAutoClose = () => {
                    clearInterval(autoCloseInterval);
                    autoCloseSetting.style.display = "none";
                    autoCloseLabel.textContent = $STR("autoclose_cancelled");
                };

                const autoCloseTimerEnd = Date.now() + autoCloseTime * 1000;
                const autoCloseInterval = window.setInterval(() => {
                    const now = Date.now();
                    if (now >= autoCloseTimerEnd) {
                        clearInterval(autoCloseInterval);
                        closePanel();
                    }
                    const secondsRemaining = Math.ceil((autoCloseTimerEnd - now) / 1000);
                    document.getElementById("autoCloseLabel").textContent = $STRF(
                        "autoclose_countdown",
                        secondsRemaining.toString()
                    );
                }, 1000);
                const autoClose = document.createElement("div");
                autoClose.id = "autoClose";
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

                document
                    .getElementById("optionsContainer")
                    .addEventListener("click", cancelAutoClose);
            }
        }
    }
    KeeLog.info("iframe page ready");
}

let matchedLoginsPanel: MatchedLoginsPanel;

const params: { [key: string]: string } = {};

document.location.search
    .substr(1)
    .split("&")
    .forEach(pair => {
        const [key, value] = pair.split("=");
        params[key] = value;
    });

const parentFrameId = parseInt(params["parentFrameId"]);

// Load our config and start the panel once done
configManager.load(startup);

i18nSetup();
