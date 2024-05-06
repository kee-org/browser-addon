import { KeeLog } from "./Logger";

// https://issues.chromium.org/issues/40738001
// https://developer.chrome.com/docs/extensions/reference/api/offscreen
// https://issues.chromium.org/issues/40252021

//TODO: navigator.clipboard and document are both missing in MV3 background environment so can't copy to clipboard at the moment. Does work from popup panel though since that doesn't have to go via background scripts... or maybe doesn't even use this function - need to investigate difference.
export async function copyStringToClipboard(value: string) {
    //if chrome, use the offscreen document
    try {
        await navigator.clipboard.writeText(value);
    } catch (e) {
        try {
            // Fallback to old textarea hack if required.
            // See https://github.com/kee-org/browser-addon/issues/273
            // and https://bugs.chromium.org/p/chromium/issues/detail?id=874848
            const copyFrom = document.createElement("textarea");
            copyFrom.textContent = value;
            const body = document.getElementsByTagName("body")[0];
            body.appendChild(copyFrom);
            copyFrom.select();
            document.execCommand("copy");
            body.removeChild(copyFrom);
            KeeLog.info("Failed to write to clipboard using modern API so used the fallback hack");
        } catch (e2) {
            KeeLog.error("Failed to write to clipboard using modern API and fallback hack");
        }
    }
}
