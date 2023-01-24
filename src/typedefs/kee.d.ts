import type {Kee} from "../background/KF";

declare global {
    declare const __KeeIsRunningInAWebExtensionsBrowser: boolean;
    interface Window {
      //TODO: See if it is possible to manage the persistent external connection and
      // in-memory caches without a global var nowadays
        kee: Kee;
    }
}
