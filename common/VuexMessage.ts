import { AddonMessage } from "./AddonMessage";
import { VaultMessage } from "./VaultMessage";

export interface VuexMessage {
    type: "@@STORE_SYNC_MUTATION" | "@@STORE_SYNC_STATE";
    data?: any;
}

export function isVuexMessage (obj: VuexMessage | AddonMessage | VaultMessage): obj is VuexMessage {
    if ((obj as VuexMessage).type) {
      return true;
    }
    return false;
}
