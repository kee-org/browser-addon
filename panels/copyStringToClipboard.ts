import { KeeLog } from "../common/Logger";

export async function copyStringToClipboard(value: string) {
    try {
        await navigator.clipboard.writeText(value);
    } catch (e) {
        try {
            // Fallback to old textarea hack if required.
            // See https://github.com/kee-org/browser-addon/issues/273
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
