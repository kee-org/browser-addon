import Vue from "vue";
import Vuex from "vuex";
import VuexWebExtensions from "vuex-webextensions";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";
import * as mTypes from "./mutation-types";
import { KeeState } from "./KeeState";

Vue.use(Vuex);

export default new Vuex.Store<KeeState>({
    strict: true,
    state: {
        timer: 0,
        counter: 0,
        latestConnectionError: "",
        lastKeePassRPCRefresh: 0,
        ActiveKeePassDatabaseIndex: -1,
        KeePassDatabases: [],
        PasswordProfiles: [],
        notifications: [],
        connected: false,
        connectedWebsocket: false,
        currentSearchTerm: null,
        submittedData: null,
        loginsFound: false,
        searchResults: null
    },
    getters,
    mutations,
    actions,
    plugins: [
        VuexWebExtensions({})
    ]
});

export { mTypes };
