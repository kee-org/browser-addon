/// <reference path="../common/Logger.ts" />
/// <reference path="../common/ConfigManager.ts" />
/// <reference path="../common/utils.ts" />

// constructor
class BackgroundUtils {
    constructor ()
    {
    }

    // Checks whether the user's sensitive data is being logged for debugging purposes
    oneOffSensitiveLogCheckHandler = function ()
    {
        if (configManager.current.logSensitiveData)
        {
            const button: Button = {
                label: $STR("learn_more"),
                action: "loadUrlHelpSensitiveLogging"
            };
            kee.notifyUser(new KeeNotification(
                "kee-sensitivelog", [button], utils.newGUID(), [$STR("notifyBarLogSensitiveData_label")], "High", false));
        }
    };

    /*******************************************
    / General utility functions
    /*******************************************/

    openAndReuseOneTabPerURL = function (url) {
        KeeLog.debug({
            m: "trying to find an already open tab with the requested url",
            sm: "trying to find an already open tab with this url: " + url,
            r: true } as LogMessage);
        browser.tabs.query({ url }).then(tabs => {
            tabs.length > 0
                ? browser.tabs.update(tabs[0].id, { active: true })
                : browser.tabs.create({ url });
        });
    };

}

let backgroundUtils = new BackgroundUtils();
