import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import mutations from "./mutations";
import * as actions from "./actions";
import * as mTypes from "./mutation-types";
import { KeeState } from "./KeeState";
import {SaveState} from "../common/SaveState";

Vue.use(Vuex);

export default new Vuex.Store<KeeState>({
    strict: true, //__VUEX_STRICT_CONFIG__
    state: {
        latestConnectionError: "",
        lastKeePassRPCRefresh: 0,
        ActiveKeePassDatabaseIndex: -1,
        KeePassDatabases: [],
        PasswordProfiles: [],
        notifications: [],
        connected: false,
        connectedWebsocket: false,
        currentSearchTerm: null,
        loginsFound: false,
        searchResults: null,
        saveState: new SaveState()
    },
    getters,
    mutations,
    actions
});

export { mTypes };
