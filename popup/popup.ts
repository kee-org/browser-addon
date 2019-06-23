import Vue from "vue";
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

Vue.use(i18n);

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
                /* eslint-disable no-new */
                // tslint:disable-next-line:no-unused-expression
                new Vue({
                    el: "#main",
                    store,
                    render: h => h(App)
                });
            });
        }
        if (m.mutation) {
            syncContent.onRemoteMutation(m.mutation);
        }

        if (store.state.connected && m.findMatchesResult) {
             store.dispatch("updateContextMenuResult", convertSingleLoginEntryResult(m.findMatchesResult) );
        }

        // This maybe could be moved to onMounted once all vuex state is changed before this popup is opened.
        setTimeout(() => {
            window.focus();
            const sb = $("#searchBox");
            if (sb) sb.focus();
            window.scrollTo(0, 0);
        }, 50);
    });

    KeeLog.info("popup ready");
}

// Load our config and start the page script once done
configManager.load(startup);
