import { KeeLog } from "../common/Logger";

// constructor
class BackgroundUtils {
    constructor() {}

    /*******************************************
    / General utility functions
    /*******************************************/

    openAndReuseOneTabPerURL = function (url) {
        KeeLog.debug("trying to find an already open tab with the requested url");
        browser.tabs.query({ url }).then(tabs => {
            if (tabs.length > 0) {
                browser.tabs.update(tabs[0].id, { active: true });
                browser.windows.update(tabs[0].windowId, { focused: true });
            } else {
                browser.tabs.create({ url });
            }
        });
    };
}

export const backgroundUtils = new BackgroundUtils();
