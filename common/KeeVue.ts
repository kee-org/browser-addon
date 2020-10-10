import Vue from "vue";
import { Store } from "vuex";
import { KeeState } from "../store/KeeState";

export abstract class KeeVue extends Vue {
    public $store: Store<KeeState>;
}
