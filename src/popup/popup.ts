import { createApp } from "vue";
import { createVuetify } from "vuetify";
import App from "./App.vue";
import store from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import i18n from "../common/Vuei18n";
import { Port } from "../common/port";
import { SyncContent } from "../store/syncContent";
import { createPinia } from "pinia";
import { Action } from "../common/Action";


const app = createApp(App);

const vuetify = createVuetify({});
app.use(vuetify);
app.use(createPinia());
app.use(i18n);

Vue.prototype.$browser = browser;

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
                    new Vue({
                        el: "#main",
                        store: store,
                        vuetify: new Vuetify({
                            theme: {
                                dark: configManager.activeTheme === "dark",
                                themes: {
                                    dark: {
                                        primary: "#1a466b",
                                        secondary: "#ABB2BF",
                                        tertiary: "#e66a2b",
                                        error: "#C34034",
                                        info: "#2196F3",
                                        success: "#4CAF50",
                                        warning: "#FFC107"
                                    },
                                    light: {
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
                        }),
                        mounted: function () {
                            // This can wait until after the popup app has rendered, at least until there is
                            // some way to launch in password generation mode
                            Port.postMessage({
                                action: Action.GetPasswordProfiles
                            });
                        },
                        render: function (h) {
                            return h(App, {
                                props: {
                                    matchedEntries: !m.entries ? null : m.entries,
                                    frameId: m.frameId
                                }
                            });
                        }
                    });

                    // This maybe could be moved to onMounted once all vuex state is changed before this popup is opened.
                    setTimeout(() => {
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
