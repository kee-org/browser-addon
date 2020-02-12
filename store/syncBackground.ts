import { Store, MutationPayload } from "vuex";
import { KeeState } from "./KeeState";
import { KeeLog } from "../common/Logger";

export class SyncBackground {

    receivedMutations: MutationPayload[] = [];

    constructor (
        private store: Store<KeeState>,
        private distributeMutation: (mutation, excludedPort: browser.runtime.Port) => void) {

        store.subscribe((mutation, state) => {
            KeeLog.debug("mutation type: " + mutation.type);
            // Check if it is a remotely received mutation, if it is just ignore it, if not distribute
            for (let i = 0; i < this.receivedMutations.length; i++) {
                if (this.receivedMutations[i].type == mutation.type && this.receivedMutations[i].payload == mutation.payload) {
                    this.receivedMutations.splice(i, 1);
                    return;
                }
            }
            KeeLog.debug("local mutation so distributing mutation");
            this.distributeMutation(mutation, null);
        });
    }

    onMessage (sourcePort: browser.runtime.Port, mutation: MutationPayload) {
        this.receivedMutations.push(mutation);
        this.store.commit(mutation.type, mutation.payload);
        KeeLog.debug("SyncBackground.onMessage distributing");
        this.distributeMutation(mutation, sourcePort);
    }
}
