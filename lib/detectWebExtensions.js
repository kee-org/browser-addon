// This needs to be run before we load the webextensions polyfill
let __KeeIsRunningInAWebExtensionsBrowser = true;
if (typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype) {
    __KeeIsRunningInAWebExtensionsBrowser = false;
}
