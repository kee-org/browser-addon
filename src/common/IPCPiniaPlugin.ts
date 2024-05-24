import { KeeLog } from "./Logger";
import { AddonMessage } from "./AddonMessage";
import { Port } from "./port";
import { Mutation } from "../store/Mutation";

export function IPCPiniaPlugin() {
    return {
        distributeAction: (mutation: Mutation) => {
            //TODO:5: Find a way to more efficiently distribute Pinia Patch objects / Vue3 Proxy objects without this additional JSON mapping / manipulation
            const json = JSON.stringify(mutation);
            KeeLog.debug("New non-background mutation/action going to be distributed.");
            Port.postMessage({ mutation: JSON.parse(json) } as AddonMessage);
        }
    };
}
