import { MutationType } from "pinia";
import { KeeStore } from ".";
import { KeeState } from "./KeeState";
import { MutationPayload } from "./syncBackground";

export class SyncContent {
    initialized: boolean;
    receivedMutations: MutationPayload[];
    pendingMutations: MutationPayload[];
    private sendMutation: (mutation: MutationPayload) => void;

    constructor(private store: KeeStore) {
        this.receivedMutations = [];
        this.initialized = false;
        this.pendingMutations = [];

        this.store.$subscribe(mutation => {
            if (mutation.type == MutationType.patchObject) {
                this.hookMutation(mutation);
                } else {
                    throw new Error("Pinia generated a non-object mutation. We don't think we can support this and need to know that it is possible for it to happen! Tell us now or weird things will happen.");
                } // 'direct' | 'patch object' | 'patch function'
        });
    }

    init(initialState: KeeState, sendMutation, vueInit?) {
        this.sendMutation = sendMutation;

        this.store.$patch(initialState);
        this.initialized = true;
        this.processPendingMutations();

        if (vueInit) vueInit();
    }

    reset(newState: KeeState) {
        this.store.$patch(newState);
    }

    public onRemoteMutation(mutation: MutationPayload) {
        if (!this.initialized) {
            return;
        }

        this.receivedMutations.push(mutation);
        this.store.$patch(mutation.payload);
    }

    hookMutation(mutation: MutationPayload) {
        if (!this.initialized) {
            return this.pendingMutations.push(mutation);
        }

        if (!this.receivedMutations.length) {
            return this.sendMutation(mutation);
        }

        // Check if it's received mutation, if it's just ignore it, if not send to background
        for (let i = this.receivedMutations.length - 1; i >= 0; i--) {
            if (
                this.receivedMutations[i] == mutation.payload
            ) {
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

    processPendingMutations() {
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
