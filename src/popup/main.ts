import { App as VueApp, createApp, h } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import useStore from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import { Port } from "../common/port";
import { SyncContent } from "../store/syncContent";
import { createPinia } from "pinia";
import { Action } from "../common/Action";
import { MutationPayload } from "~/store/syncBackground";

const piniaInstance = createPinia();
const store = useStore();
let vueApp: VueApp<Element>;
let syncContent: SyncContent;

function startup() {
    KeeLog.debug("popup started");
    KeeLog.attachConfig(configManager.current);
    syncContent = new SyncContent(store);
    Port.startup("browserPopup");

    Port.raw.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser popup script, received message from background script: ");

        if (m.initialState) {
            syncContent.init(
                m.initialState,
                (mutation: MutationPayload) => {
                    Port.postMessage({ mutation: mutation } as AddonMessage);
                },
                () => {

                    vueApp = createApp({
                        mounted: function () {
                            // This can wait until after the popup app has rendered, at least until there is
                            // some way to launch in password generation mode
                            Port.postMessage({
                                action: Action.GetPasswordProfiles
                            });
                        },
                        render: () => h(App, {
                            props: {
                                matchedEntries: !m.entries ? null : m.entries,
                                frameId: m.frameId
                            }
                        })
                    });

                    const vuetify = createVuetify({
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
                    vueApp.use(vuetify);
                    vueApp.use(piniaInstance);
                    vueApp.mount("#main");
                    vueApp.config.globalProperties.$browser = browser;
                    vueApp.config.globalProperties.$i18n = browser.i18n.getMessage;

                    // This maybe could be moved to onMounted once all vuex state is changed before this popup is opened.
                    window.setTimeout(() => {
                        window.focus();
                        const sb = $("#searchBox");
                        if (sb) sb.focus();
                        window.scrollTo(0, 0);
                    }, 50);
                }
            );
        }
        if (m.mutation) {
            syncContent.onRemoteMutation(m.mutation);
            return;
        }

        if (store.connected && m.findMatchesResult) {
            store.updateSearchResultWithFullDetails(
                JSON.parse(JSON.stringify(m.findMatchesResult[0]))
            );
        }
    });

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
