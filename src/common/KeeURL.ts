import { utils } from "./utils";
import { KeeLog } from "./Logger";

export class KeeURL {
    private constructor(
        private _domain: string,
        private _url: URL,
        private _isIPAddress: boolean
    ) {}

    public get domain(): string {
        return this._domain;
    }
    public get url(): URL {
        return this._url;
    }
    public get isIPAddress(): boolean {
        return this._isIPAddress;
    }
    public get domainOrIPAddress(): string {
        return this._domain ?? (this._isIPAddress ? this._url.hostname : "");
    }

    public get domainWithPort(): string {
        if (!this._domain) return "";
        if (this._url.port) return this._domain + ":" + this._url.port;
        return this._domain;
    }

    public static fromString(urlStr: string) {
        if (
            !urlStr.startsWith("https://") &&
            !urlStr.startsWith("http://") &&
            !urlStr.startsWith("file://")
        ) {
            urlStr = "https://" + urlStr;
        }
        try {
            const url = new URL(urlStr);
            const isIPAddress = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/.test(
                url.hostname
            );
            const domain = isIPAddress ? null : utils.psl.getDomain(url.hostname);
            return new KeeURL(domain, url, isIPAddress);
        } catch (e) {
            KeeLog.warn("Error processing URL: " + e);
        }
        return null;
    }
}
