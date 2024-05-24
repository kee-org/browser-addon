import type { AddonMessage } from "./AddonMessage";
import { KeeLog } from "./Logger";
import type { VaultMessage } from "./VaultMessage";

class ContentPortManager {
    private port: chrome.runtime.Port;

    // public mixin = {
    //     methods: {
    //         postMessage: msg => {
    //             this.port.postMessage(msg);
    //         }
    //     }
    // };

    public postMessage(msg: AddonMessage | VaultMessage) {
        try {
            this.port.postMessage(msg);
        } catch (e) {
            if (KeeLog && KeeLog.warn) KeeLog.warn("Failed to post a message. If the addon has just auto-updated this is expected.");
        }
    }

    public startup(name: string) {
        this.port = chrome.runtime.connect({ name });
    }

    public shutdown() {
        this.port = null;
    }

    public get raw(): chrome.runtime.Port {
        return this.port;
    }
}

export const Port = new ContentPortManager();
