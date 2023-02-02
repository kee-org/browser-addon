import type {Kee} from "../background/KF";

declare global {
    interface Window {
        //TODO:4: See if it is possible to manage the persistent
        // external connection, cross-process messaging and our
        // in-memory caches without a global var in MV3
        kee: Kee;
    }
}
