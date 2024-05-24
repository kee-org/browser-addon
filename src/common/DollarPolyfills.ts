export function $(selector: any, el?: Document) {
    if (!el) el = document;
    return el.querySelector(selector);
}
export function $$(selector: any, el?: Document) {
    if (!el) el = document;
    return el.querySelectorAll(selector);
}
export function $STR(str: string) {
    const msg = chrome.i18n.getMessage(str);
    return msg || str;
}
export function $STRF(str: string, subs: any) {
    const msg = chrome.i18n.getMessage(str, subs);
    return msg || str;
}
