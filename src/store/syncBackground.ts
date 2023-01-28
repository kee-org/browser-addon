import { KeeState, defaults } from "./KeeState";
import { KeeLog } from "../common/Logger";
import { KeeStore } from ".";
import { MutationType, SubscriptionCallbackMutation, SubscriptionCallbackMutationPatchObject, _DeepPartial } from "pinia";
import { deepEqual } from "~/common/utils";

export declare type Mutation = SubscriptionCallbackMutationPatchObject<Readonly<KeeState>>;
export declare type MutationPayload = _DeepPartial<Readonly<KeeState>>;

export class SyncBackground {
    receivedPayloads: MutationPayload[] = [];

    constructor(
        private store: KeeStore,
        private distributeMutationPayload: (mutation: MutationPayload, excludedPort: browser.runtime.Port) => void
    ) {
        //const store = useStore();
        store.$subscribe((mutation: SubscriptionCallbackMutation<Readonly<KeeState>>, _state: KeeState) => {
            // import { MutationType } from 'pinia'
            if (mutation.type == MutationType.patchObject) {

            // Check if it is a remotely received mutation, if it is just ignore it, if not distribute
            for (let i = 0; i < this.receivedPayloads.length; i++) {
                if (
                    deepEqual(this.receivedPayloads[i], mutation.payload)
                ) {
                    this.receivedPayloads.splice(i, 1);
                    return;
                }
            }
            KeeLog.debug("local mutation so distributing mutation");
            this.distributeMutationPayload(mutation.payload, null);
            KeeLog.debug("distributed");
            } else {
                KeeLog.error("mutation type: " + mutation.type);
                KeeLog.error("mutation: " + JSON.stringify(mutation));
                throw new Error("Pinia generated a non-object mutation. We don't think we can support this and need to know that it is possible for it to happen! Tell us now or weird things will happen.");
            } // 'direct' | 'patch object' | 'patch function'
            // same as cartStore.$id
            // mutation.storeId // 'cart'
            // only available with mutation.type === 'patch object'
            // mutation.payload // patch object passed to cartStore.$patch()

            // persist the whole state to the local storage whenever it changes
            // localStorage.setItem('cart', JSON.stringify(state))

        }, {
            flush: "sync"
        });
    }

    onMessage(sourcePort: browser.runtime.Port, mutation: MutationPayload) {
        this.receivedPayloads.push(mutation);
        this.store.$patch(mutation);
        KeeLog.debug("SyncBackground.onMessage distributing");
        this.distributeMutationPayload(mutation, sourcePort);
    }
}
