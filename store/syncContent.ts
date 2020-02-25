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

        // Check if it's received mutation, if it's just ignore it, if not send to background
        for (let i = this.receivedMutations.length - 1; i >= 0; i--) {
            if (this.receivedMutations[i].type == mutation.type && this.receivedMutations[i].payload == mutation.payload) {
                this.receivedMutations.splice(i, 1);

                // Multiple mutations can be in the received queue so we have to break,
                // otherwise duplicate received mutations will result in some being sent
                // to the background thread, leading to an infinite loop.
                // The exact mechanism by which this can happen is unclear and it
                // may be a bug or mutable implementation detail of VueX. I hypothesise
                // that multiple mutations arriving in a short period of time can get
                // batched together in a way that allows multiple hooks to queue up
                // before being invoked. Thus the first time that this loop is created
                // it sets up a higher chance that the loop will repeat again, until
                // such time as the batching behaviour is all but guaranteed and the
                // loop can never end.
                break;
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
