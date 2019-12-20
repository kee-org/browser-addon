import { KeeState } from "./KeeState";
import { Store, MutationPayload } from "vuex";
import { KeeLog } from "../common/Logger";

export class SyncContent {
    initialized: any;
    receivedMutations: any;
    pendingMutations: any[];
    private sendMutation: (mutation: MutationPayload) => void;

    constructor (private store: Store<KeeState>) {
        this.receivedMutations = [];
        this.initialized = false;
        this.pendingMutations = [];

        this.store.subscribe(mutation => {
            this.hookMutation(mutation);
        });
    }

    init (initialState: KeeState, sendMutation, vueInit?) {
        this.sendMutation = sendMutation;

        this.store.replaceState(initialState);
        this.initialized = true;
        this.processPendingMutations();

        if (vueInit) vueInit();
    }

    reset (newState: KeeState) {
        this.store.replaceState(newState);
    }

    public onRemoteMutation (mutation) {
        if (!this.initialized) {
            return;
        }

        this.receivedMutations.push(mutation);
        this.store.commit(mutation.type, mutation.payload);
    }

    hookMutation (mutation: MutationPayload) {
        if (!this.initialized) {
            return this.pendingMutations.push(mutation);
        }

        if (!this.receivedMutations.length) {
            return this.sendMutation(mutation);
        }
        if (this.receivedMutations.length > 1) {
            KeeLog.error("Misunderstood mutation hook ordering. Bugs ahoy!");
        }

        // Check if it's received mutation, if it's just ignore it, if not send to background
        for (let i = this.receivedMutations.length - 1; i >= 0; i--) {
            if (this.receivedMutations[i].type == mutation.type && this.receivedMutations[i].payload == mutation.payload) {
                // If multiple mutations can be in received queue, think we should break here... otherwise duplicate received
                // mutations could be sent cos more than one will have been removed from the list of known local mutations
                this.receivedMutations.splice(i, 1);
            } else if (i == 0) {
                this.sendMutation(mutation);
            }
        }
    }

    processPendingMutations () {
        if (!this.pendingMutations.length) {
            return;
        }

        for (let i = 0; i < this.pendingMutations.length; i++) {
            // Must be a locally committed mutation
            this.sendMutation(this.pendingMutations[i]);
            this.pendingMutations.splice(i, 1);
        }
    }
}
