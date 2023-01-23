import { AddonMessage } from "./AddonMessage";
import { VaultMessage } from "./VaultMessage";

class ContentPortManager {
    private port: browser.runtime.Port;

    public mixin = {
        methods: {
            postMessage: msg => {
                this.port.postMessage(msg);
            }
        }
    };

    public postMessage(msg: AddonMessage | VaultMessage) {
        this.port.postMessage(msg);
    }

    public startup(name: string) {
        this.port = browser.runtime.connect({ name });
    }

    public shutdown() {
        this.port = null;
    }

    public get raw(): browser.runtime.Port {
        return this.port;
    }
}

export const Port = new ContentPortManager();
