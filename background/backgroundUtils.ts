import { KeeLog } from "../common/Logger";

// constructor
class BackgroundUtils {
    constructor ()
    {
    }

    /*******************************************
    / General utility functions
    /*******************************************/

    openAndReuseOneTabPerURL = function (url) {
        KeeLog.debug("trying to find an already open tab with the requested url");
        browser.tabs.query({ url }).then(tabs =>
            tabs.length > 0
                ? browser.tabs.update(tabs[0].id, { active: true })
                : browser.tabs.create({ url })
        );
    };

}

export const backgroundUtils = new BackgroundUtils();
