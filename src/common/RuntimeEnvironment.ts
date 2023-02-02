// This needs to be run before we load the webextensions polyfill - best to always
// import it first in each execution environment (background, content script, etc.)
class _RuntimeEnvironment {
    public isWebExtensionsBrowser =
    !(typeof browser === "undefined" || Object.getPrototypeOf(browser) !== Object.prototype);
}

const RuntimeEnvironment = new _RuntimeEnvironment();
export default RuntimeEnvironment;
