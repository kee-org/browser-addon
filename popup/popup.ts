import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import store from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import i18n from "../common/Vuei18n";
import { Port } from "../common/port";
import { SyncContent } from "../store/syncContent";
import { MutationPayload } from "vuex";
import { Entry } from "../common/model/Entry";
import { Action } from "../common/Action";
import { EntrySummary } from "../common/model/EntrySummary";

Vue.use(i18n);
Vue.use(Vuetify);

Vue.prototype.$browser = browser;

let syncContent: SyncContent;

function startup () {
    KeeLog.debug("popup started");
    KeeLog.attachConfig(configManager.current);
    syncContent = new SyncContent(store);
    Port.startup("browserPopup");

    Port.raw.onMessage.addListener(function (m: AddonMessage) {
        KeeLog.debug("In browser popup script, received message from background script: ");

        if (m.initialState) {
            syncContent.init(m.initialState, (mutation: MutationPayload) => {
                Port.postMessage({mutation} as AddonMessage);
            }, () => {
                new Vue({
                    el: "#main",
                    store,
                    vuetify: new Vuetify({
                        theme: {
                            dark: window.matchMedia("(prefers-color-scheme: dark)").matches
                        }
                    }),
                    mounted () {
                        // This can wait until after the popup app has rendered, at least until there is
                        // some way to launch in password generation mode
                        Port.postMessage({ action: Action.GetPasswordProfiles });
                    },
                    render (h) {
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
            });
        }
        if (m.mutation) {
            syncContent.onRemoteMutation(m.mutation);
            return;
        }

        if (store.state.connected && m.findMatchesResult) {
            console.warn(m);
            store.dispatch("updateSearchResultWithFullDetails", JSON.parse(JSON.stringify(m.findMatchesResult[0])));
        }
    });

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
