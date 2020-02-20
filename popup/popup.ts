import Vue from "vue";
import Vuetify from "vuetify";
import App from "./App.vue";
import store from "../store";
import { KeeLog } from "../common/Logger";
import { configManager } from "../common/ConfigManager";
import { AddonMessage } from "../common/AddonMessage";
import i18n from "../common/Vuei18n";
import { Port } from "../common/port";
import { keeLoginInfo } from "../common/kfDataModel";
import { SyncContent } from "../store/syncContent";
import { MutationPayload } from "vuex";
import { SearchResult } from "../common/search";
import { Entry } from "../common/model/Entry";

Vue.use(i18n);
Vue.use(Vuetify);

Vue.prototype.$browser = browser;

let syncContent: SyncContent;

function convertSingleLoginEntryResult (result)
{
    let isError = false;

    try {
        if (result && result.length == 1) {
            const kfl = new keeLoginInfo();
            kfl.initFromEntry(result[0]);
            // strip functions in case this upsets vuex state transfer across processes
            return JSON.parse(JSON.stringify(kfl));
        } else {
            isError = true;
        }
    } catch (e) {
        isError = true;
    }

    if (isError) {
        KeeLog.error("Unexpected error handling response for detailed field data");
    }

    return;
}

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
                            dark: window.matchMedia("prefers-color-scheme: dark").matches
                        }
                    }),
                    //render: h => h(App),
                    render (h) {
                        return h(App, {
                            props: {
                                matchedLogins: !m.logins ? null : m.logins.map(
                                    e => ({
                                        fullDetails: Entry.fromKeeLoginInfo(e),
                                        dbFileName: e.database.fileName,
                                        iconImageData: e.iconImageData,
                                        path: e.parentGroup.path,
                                        relevanceScore: e.relevanceScore,
                                        title: e.title,
                                        uRLs: e.URLs,
                                        uniqueID: e.uniqueID,
                                        url: e.URLs[0],
                                        usernameName: (e.otherFields && e.usernameIndex >= 0) ? e.otherFields[e.usernameIndex].name : "<no username>",
                                        usernameValue: (e.otherFields && e.usernameIndex >= 0) ? e.otherFields[e.usernameIndex].value : "<no username>"
                                    } as SearchResult)
                                ),
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
            store.dispatch("updateContextMenuResult", convertSingleLoginEntryResult(m.findMatchesResult) );
        }

        // if (store.state.connected && m.findMatchesResult) {
        //     const kfl = convertSingleLoginEntryResult(m.findMatchesResult);
        //     const id = kfl.uniqueID;
        //     for (const s of state.searchResults) {
        //         if (s.uniqueID === id) {
        //             s.fullDetails = kfl;
        //             break;
        //         }
        //     }
        // }

    });

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
