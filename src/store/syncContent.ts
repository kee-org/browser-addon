import { MutationType } from "pinia";
import { KeeLog } from "~/common/Logger";
import { deepEqual } from "~/common/utils";
import { KeeStore } from ".";
import { KeeState } from "./KeeState";
import { Mutation, MutationPayload } from "./syncBackground";

export class SyncContent {
    private store: KeeStore;
    initialized: boolean;
    receivedPayloads: MutationPayload[];
    pendingMutations: Mutation[];
    private sendMutationPayload: (mutation: MutationPayload) => void;

    constructor() {
        this.receivedPayloads = [];
        this.initialized = false;
        this.pendingMutations = [];
    }

    init(store: KeeStore, initialState: KeeState, sendMutation: (mutation: MutationPayload) => void, vueMount?) {
        this.store = store;
        this.store.$subscribe(mutation => {
            if (mutation.type == MutationType.patchObject) {
                this.handleLocallyGeneratedMutation(mutation);
                } else {
                    throw new Error("Pinia generated a non-object mutation. We don't think we can support this and need to know that it is possible for it to happen! Tell us now or weird things will happen.");
                } // 'direct' | 'patch object' | 'patch function'
        });
        this.sendMutationPayload = sendMutation;

        this.store.$patch(initialState);
        this.initialized = true;
        this.processPendingLocallySourcedMutations();

        if (vueMount) vueMount();
    }

    reset(newState: KeeState) {
        this.store.$patch(newState);
    }

    public onRemoteMutationPayload(payload: MutationPayload) {
        if (!this.initialized) {
            return;
        }
        KeeLog.debug("processing payload from remote store");
        this.receivedPayloads.push(payload);
        this.store.$patch(payload);
    }

    handleLocallyGeneratedMutation(mutation: Mutation) {
        if (!this.initialized) {
            return this.pendingMutations.push(mutation);
        }

        if (!this.receivedPayloads.length) {
            return this.sendMutationPayload(mutation.payload);
        }

        // Check if it's received mutation, if it's just ignore it, if not send to background
        for (let i = this.receivedPayloads.length - 1; i >= 0; i--) {
            if (
                deepEqual(this.receivedPayloads[i], mutation.payload)
            ) {
                KeeLog.debug("payload is deepequal");
                this.receivedPayloads.splice(i, 1);

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
                //TODO:4: Experiment with Pinia to see if this issue has gone away
                break;
            } else if (i == 0) {
                KeeLog.debug("payload is not deepequal to any remotely received payload so will send");
                this.sendMutationPayload(mutation.payload);
            }
        }
    }

    processPendingLocallySourcedMutations() {
        if (!this.pendingMutations.length) {
            return;
        }

        for (let i = 0; i < this.pendingMutations.length; i++) {
            this.sendMutationPayload(this.pendingMutations[i].payload);
            this.pendingMutations.splice(i, 1);
        }
    }
}
