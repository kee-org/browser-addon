import { Mutation } from "./Mutation";
import { KeeLog } from "~/common/Logger";
import NonReactiveStore from "./NonReactiveStore";

export default class BackgroundStore extends NonReactiveStore {

    onRemoteMessage(sourcePort: chrome.runtime.Port, mutation: Mutation) {
        super.onRemoteMessage(sourcePort, mutation);

        KeeLog.debug("BackgroundStore.onRemoteMessage distributing");
        this.distributeAction(mutation, sourcePort);
    }

};
