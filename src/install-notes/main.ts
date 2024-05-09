import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import useStore, { KeeStore } from "../store";
import { App, createApp } from "vue";
import { createVuetify } from "vuetify";
import Root from "./App.vue";
import { createPinia } from "pinia";
import { setup as i18nSetup } from "../common/i18n";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { IPCPiniaPlugin } from "../common/IPCPiniaPlugin";

let vueApp: App<Element>;
let store: KeeStore;

async function start() {
    await configManager.load();
    KeeLog.debug("install notes page starting");
    KeeLog.attachConfig(configManager.current);

    const darkTheme = params["theme"] === "dark";

    try {
        const piniaInstance = createPinia();
        vueApp = createApp({
            render: () => h(Root, {})
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
        vueApp.config.globalProperties.$chrome = chrome;
        vueApp.config.globalProperties.$i18n = chrome.i18n.getMessage;
        store = useStore();

        vueApp.mount("#main");

    } catch (e) {
        KeeLog.error("Failed to create user interface.", e);
    }

    KeeLog.info("install notes page ready");
}

const params: { [key: string]: string } = {};

document.location.search
    .substr(1)
    .split("&")
    .forEach(pair => {
        const [key, value] = pair.split("=");
        params[key] = value;
    });

(async () => {
    await start();
})();

i18nSetup();
