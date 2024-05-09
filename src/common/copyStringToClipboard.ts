import { KeeLog } from "./Logger";
import { isChrome, isExtensionContext } from "webext-detect-page";

// https://issues.chromium.org/issues/40738001
// https://developer.chrome.com/docs/extensions/reference/api/offscreen
// https://issues.chromium.org/issues/40252021

export async function copyStringToClipboard(value: string) {
    if (isChrome && isExtensionContext) {
        try {
            await mv3ClipboardWorkaround(value);
        } catch (e) {
            KeeLog.error("Failed to write to clipboard using MV3 offscreen workaround");
        }
    }
    try {
        // Actually I think isExtensionContext is true for the popup and that this operation
        // will work within that context because the user has focus but hopefully the MV3
        // workaround works fine in that situation too.
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

async function mv3ClipboardWorkaround(value: string) {
    await chrome.offscreen.createDocument({
        url: chrome.runtime.getURL('lib/copyToClipboard.html'),
        reasons: [chrome.offscreen.Reason.CLIPBOARD],
        justification: 'Required by Chromium to copy text.',
    });
    chrome.runtime.sendMessage({
        type: 'copy-data-to-clipboard',
        target: 'offscreen-doc',
        data: value
    });
}
