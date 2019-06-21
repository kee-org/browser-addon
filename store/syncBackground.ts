import { Store, MutationPayload } from "vuex";
import { KeeState } from "./KeeState";

export class SyncBackground {
    constructor (
        private store: Store<KeeState>,
        private distributeMutation: (mutation, excludedPort: browser.runtime.Port) => void) { }

    onMessage (sourcePort: browser.runtime.Port, mutation: MutationPayload) {
        this.store.commit(mutation.type, mutation.payload);
        this.distributeMutation(mutation, sourcePort);
    }
}
