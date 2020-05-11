import { getAllFrameURLs } from "./getAllFrameURLs";
import { KeeURL } from "../common/KeeURL";

export async function reconcileURLs (oldUrls: string[], submittedUrl?: string) {
    const currentTab = !submittedUrl ? (await browser.tabs.query({ active: true, currentWindow:true }))[0] : null;

    // primary url to compare against entry being edited
    const compareUrl = submittedUrl ?? currentTab.url;

    // An Exact match, regardless of the existing entry's configuration
    if (oldUrls.some(url => url === compareUrl)) {
        return { urls: oldUrls, showWarning: false};
    }

    // A Domain match, regardless of the existing entry's configuration
    if (oldUrls.some(url => KeeURL.fromString(url).domainOrIPAddress === KeeURL.fromString(compareUrl).domainOrIPAddress)) {
        return { urls: [compareUrl].concat(oldUrls.slice(1)), showWarning: false};
    }

    if (!submittedUrl) {
        const allFrameUrls = await getAllFrameURLs(currentTab);
        if (oldUrls.some(url => allFrameUrls.some(fu => KeeURL.fromString(fu).domainOrIPAddress === KeeURL.fromString(url).domainOrIPAddress))) {
            return { urls: oldUrls, showWarning: false};
        }
    }

    return { urls: [compareUrl].concat(oldUrls.slice(1)), showWarning: true};
}
