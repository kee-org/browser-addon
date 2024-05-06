import { App as VueApp, createApp, h } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import useStore, { KeeStore } from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { Port } from "../common/port";
import { createPinia } from "pinia";
import { Action } from "../common/Action";
import "../styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { IPCPiniaPlugin } from "../common/IPCPiniaPlugin";

const piniaInstance = createPinia();
let vueApp: VueApp<Element>;
let store: KeeStore;

async function start() {
    await configManager.load();
    KeeLog.debug("popup starting");
    KeeLog.attachConfig(configManager.current);
    Port.startup("browserPopup");

    Port.raw.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser popup script, received message from background script.");

        if (m.initialState) {

        try {
            vueApp = createApp({
                mounted: function () {
                    // This can wait until after the popup app has rendered, at least until there is
                    // some way to launch in password generation mode
                    Port.postMessage({
                        action: Action.GetPasswordProfiles
                    });
                },
                render: () => h(App, {
                        matchedEntries: !m.entries ? null : m.entries,
                        frameId: m.frameId
                })
            });

            const vuetify = createVuetify({
                components,
                directives,
                theme: {
                    defaultTheme: configManager.activeTheme,
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

            store.$patch(m.initialState);

            vueApp.mount("#main");
            //TODO: Sometimes popup size is wrong initially. Possibly only when in dev
            // mode and it's much slower to load everything? In any case, might be
            // affected by timing of when we mount the main app to the popup DOM
            // Each time I've seen it, it's an extra 16px right and bottom.
            // (footer padding = 8px each side; extra width and height = 16px.
            // I changed default from 16px 8px so height is unchanged.)

            // This maybe could be moved to onMounted once all vuex state is changed before this popup is opened.
            window.setTimeout(() => {
                window.focus();
                const sb = $("#searchBox");
                if (sb) sb.focus();
                window.scrollTo(0, 0);
            }, 50);
        } catch (e) {
            KeeLog.error("Failed to create user interface.", e);
        }
        }
        if (m.mutation) {
            store.onRemoteMessage(Port.raw, m.mutation);
            return;
        }

        if (store?.connected && m.findMatchesResult) {
            store.updateSearchResultWithFullDetails(
                JSON.parse(JSON.stringify(m.findMatchesResult[0]))
            );
        }
    });

    KeeLog.info("popup ready");
}

(async () => {
    await start();
})();
