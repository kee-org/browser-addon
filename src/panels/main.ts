import { MatchedLoginsPanel } from "./MatchedLoginsPanel";
import { FrameState } from "../common/FrameState";
import { Action } from "../common/Action";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import useStore, { KeeStore } from "../store";
import { Port } from "../common/port";
import { App, createApp } from "vue";
import { createVuetify } from "vuetify";
import Panel from "./Panel.vue";
import { createPinia } from "pinia";
import { setup as i18nSetup } from "../common/i18n";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { IPCPiniaPlugin } from "../common/IPCPiniaPlugin";

let frameState: FrameState;

function updateFrameState(newState: FrameState) {
    frameState = newState;
}

let vueApp: App<Element>;
let store: KeeStore;

function startup() {
    KeeLog.debug("iframe page starting");
    KeeLog.attachConfig(configManager.current);
    Port.startup("iframe_" + parentFrameId);

    const darkTheme = params["theme"] === "dark";

    switch (params["panel"]) {
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
                        piniaInstance.use(IPCPiniaPlugin);
                        vueApp.use(vuetify);
                        vueApp.use(piniaInstance);
                        vueApp.config.globalProperties.$browser = browser;
                        vueApp.config.globalProperties.$i18n = chrome.i18n.getMessage;
                        store = useStore();

                        store.$patch(m.initialState);
                        vueApp.mount("#main");

                        //TODO:4: Could be done earlier to speed up initial rendering?
                        Port.postMessage({
                            action: Action.GetPasswordProfiles
                        });
                    } catch (e) {
                        KeeLog.error("Failed to create user interface.", e);
                    }
                }
                if (m.mutation) {
                    store.onRemoteMessage(Port.raw, m.mutation);
                    return;
                }
                if (m.frameState) updateFrameState(m.frameState);
            });
            break;
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
