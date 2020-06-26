import { KeeLog } from "../common/Logger";

export async function copyStringToClipboard(value: string) {
    try {
        await navigator.clipboard.writeText(value);
    } catch (e) {
        KeeLog.error("Failed to write to clipboard");
    }
}
