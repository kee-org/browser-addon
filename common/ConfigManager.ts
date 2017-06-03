/*
  Entry-specific configuration is stored in KeePass but in future maybe
  we'll still make it available from this interface.
*/

/// <reference path="DefaultSiteConfig.ts" />
/// <reference path="config.ts" />

let defaultConfig = new Config();
defaultConfig.autoFillDialogs = false;
defaultConfig.autoFillForms = true;
defaultConfig.autoFillFormsWithMultipleMatches = false;
defaultConfig.autoSubmitForms = false;
defaultConfig.autoSubmitDialogs = false;
defaultConfig.autoSubmitMatchedForms = false;
defaultConfig.connSLClient = 2;
defaultConfig.connSLServerMin = 2;
defaultConfig.keePassDBToOpen = "";
defaultConfig.keePassMRUDB = "";
defaultConfig.KeePassRPCWebSocketPort = 12546;
defaultConfig.KPRPCUsername = "";
defaultConfig.KPRPCStoredKeys = {};
defaultConfig.lastConnectedToKeePass = "";
defaultConfig.listAllOpenDBs = true;
defaultConfig.logLevel = 4;
defaultConfig.logMethodConsole = false;
defaultConfig.logMethodFile = false;
defaultConfig.logSensitiveData = false;
defaultConfig.metricsUsageDisabled = false;
defaultConfig.metricsUserId = "";
defaultConfig.notifyWhenEntryUpdated = true;
defaultConfig.notifyWhenLateDiscovery = false;
defaultConfig.notifyWhenLoggedOut = false;
defaultConfig.overWriteFieldsAutomatically = true;
defaultConfig.rememberMRUDB = true;
defaultConfig.rememberMRUGroup = true;
defaultConfig.saveFavicons = true;
defaultConfig.searchAllOpenDBs = true;
defaultConfig.config = null;
defaultConfig.siteConfig = defaultSiteConfig;
defaultConfig.tutorialProgress = "";
defaultConfig.version = 2;
defaultConfig.triggerChangeInputEventAfterFill = false;

class ConfigManager {
    public current: Config;

    private readonly maxCharsPerPage: number = 10000;

    public constructor () {
        this.current = defaultConfig;
        browser.storage.onChanged.addListener(this.reloadOnStorageChange);
    }

    private reloadOnStorageChange (changes: browser.storage.StorageChange, area: string) {
        // We assume every change requires a reload of the config data. Since we batch and
        // page the data to enable enough storage space this is likley safe for the
        // long-term but perhaps performance gains could be found around here one day.
        //
        // We also reload after every save which is horribly inefficient but the alternative
        // is finding a reliabel cross-process lockign mechanism to ensure we only disable
        // reloading during an async save operation and not for a moment longer. That's just
        // not worth the risk of missing a change from another process.

        configManager.reload();
    }

    public setASAP (values: Partial<Config>) {
        (Object as any).assign(this.current, values);
        this.save();
    }

    private splitStringToPages (str: string) {
        const numPages = Math.ceil(str.length / this.maxCharsPerPage);
        const pages = new Array(numPages);

        for (let i = 0, o = 0; i < numPages; ++i, o += this.maxCharsPerPage) {
            pages[i] = str.substr(o, this.maxCharsPerPage);
        }
        return pages;
    }

    public save () {
        const configString = JSON.stringify(this.current);
        const pages = this.splitStringToPages(configString);

        //TODO:3: Need to be able to save some config details locally and others synced
        browser.storage.local.set({ "keefoxConfigPageCount": pages.length });

        for (let i=0; i < pages.length; i++)
        {
            browser.storage.local.set({ ["keefoxConfigPage" + i]: pages[i] });
        }
    }

    public load (onLoaded) {
        browser.storage.local.get().then(config => {
            const pageCount = config["keefoxConfigPageCount"];

            if (pageCount) {

                let configString = "";
                for (let i=0; i < pageCount; i++)
                {
                    const nextPage = config["keefoxConfigPage" + i];
                    if (nextPage)
                        configString += nextPage;
                }
                if (configString)
                    this.current = JSON.parse(configString);
            }
            this.migrateToLatestVersion();
            onLoaded();
        });
    }

    private reload (onLoaded?) {
        browser.storage.local.get().then(config => {
            const pageCount = config["keefoxConfigPageCount"];

            if (pageCount) {

                let configString = "";
                for (let i=0; i < pageCount; i++)
                {
                    const nextPage = config["keefoxConfigPage" + i];
                    if (nextPage)
                        configString += nextPage;
                }
                if (configString)
                    this.current = Object.assign(this.current, JSON.parse(configString));
            }
            if (onLoaded) onLoaded();
        });
    }

    private migrateToLatestVersion () {
        switch (this.current.version) {
            case 1: this.migrateToVersion2();
        }
    }

    private migrateToVersion2 () {
        let newSiteConfig = new SiteConfigIndex();

        if (!this.current.config || this.current.config.length == 0) {
            newSiteConfig = defaultSiteConfig;
            return;
        }
        newSiteConfig.pageRegex = new SiteConfigLookup();
        newSiteConfig.hostExact = new SiteConfigLookup();
        newSiteConfig.pagePrefix = new SiteConfigLookup();

        newSiteConfig.pageRegex["^.*$"] = {
            matchWeight: 0,
            config: this.migrateIndividualSiteConfigSettingsToV2(this.current.config[0].config),
            source: "Migration"
        };

        for (let i=1; i<this.current.config.length; i++) // skip first which is always "*"
        {
            const url = this.current.config[i].url;
            if (url.indexOf("://") == -1) continue; // invalid data from old config
            const withoutProtocol = url.substr(url.indexOf("://")+3);
            if (withoutProtocol.length <= 1) continue; // invalid data from old config

            const newConfig = this.migrateIndividualSiteConfigSettingsToV2(this.current.config[i].config);

            const pathIndex = withoutProtocol.indexOf("/");

            if (pathIndex > -1 || pathIndex == withoutProtocol.lastIndexOf("/"))
            {
                // removing trailing slash if we have only a host name
                const host = pathIndex > -1 ? withoutProtocol.substr(0, pathIndex) : withoutProtocol;

                // User may have configured a prefix match in KeeFox 1.x but it's not an especially useful
                // behaviour and has potential to be unsafe in future so we convert all to exact matches now
                newSiteConfig.hostExact[host] = { config: newConfig, matchWeight: 100, source: "Migration" };
            } else {

                // keep increasing weight until we find no other shorter existing entries. This assumes ordering by length
                // in the original data so that it can be transferred to the new config in same order
                // which isn't completely safe but only because of bugs in KeeFox 1.x which may have affected data integrity
                // in one or two rare cases and which we can no longer fix reliably anyway.
                let weight = 200;
                for (const pagePrefix in newSiteConfig.pagePrefix)
                {
                    if (withoutProtocol.startsWith(pagePrefix)) weight++;
                }

                newSiteConfig.pagePrefix[withoutProtocol] = { config: newConfig, matchWeight: weight, source: "Migration" };
            }
        }

        Object.assign(this.current, { siteConfig: newSiteConfig, config: null, version: 2 } as Partial<Config>);
        this.save();
    }

    private migrateIndividualSiteConfigSettingsToV2 (oldConfig: any): SiteConfig {
        const sc = new SiteConfig();
        if (oldConfig.preventSaveNotification == null) sc.preventSaveNotification = oldConfig.preventSaveNotification;
        if (oldConfig.interestingForms) {
            if (oldConfig.interestingForms.name_w) {
                if (!sc.whiteList) sc.whiteList = { form: { names: [] } };
                else if (!sc.whiteList.form) sc.whiteList.form = { names: [] };
                else if (!sc.whiteList.form.names) sc.whiteList.form.names = [];
                sc.whiteList.form.names = oldConfig.interestingForms.name_w;
            }
            if (oldConfig.interestingForms.id_w) {
                if (!sc.whiteList) sc.whiteList = { form: { ids: [] } };
                else if (!sc.whiteList.form) sc.whiteList.form = { ids: [] };
                else if (!sc.whiteList.form.ids) sc.whiteList.form.ids = [];
                sc.whiteList.form.ids = oldConfig.interestingForms.id_w;
            }
            if (oldConfig.interestingForms.name_b) {
                if (!sc.blackList) sc.blackList = { form: { names: [] } };
                else if (!sc.blackList.form) sc.blackList.form = { names: [] };
                else if (!sc.blackList.form.names) sc.blackList.form.names = [];
                sc.blackList.form.names = oldConfig.interestingForms.name_b;
            }
            if (oldConfig.interestingForms.id_b) {
                if (!sc.blackList) sc.blackList = { form: { ids: [] } };
                else if (!sc.blackList.form) sc.blackList.form = { ids: [] };
                else if (!sc.blackList.form.ids) sc.blackList.form.ids = [];
                sc.blackList.form.ids = oldConfig.interestingForms.id_b;
            }
            if (oldConfig.interestingForms.f_name_w) {
                if (!sc.whiteList) sc.whiteList = { fields: { names: [] } };
                else if (!sc.whiteList.fields) sc.whiteList.fields = { names: [] };
                else if (!sc.whiteList.fields.names) sc.whiteList.fields.names = [];
                sc.whiteList.fields.names = oldConfig.interestingForms.f_name_w;
            }
            if (oldConfig.interestingForms.f_id_w) {
                if (!sc.whiteList) sc.whiteList = { fields: { ids: [] } };
                else if (!sc.whiteList.fields) sc.whiteList.fields = { ids: [] };
                else if (!sc.whiteList.fields.ids) sc.whiteList.fields.ids = [];
                sc.whiteList.fields.ids = oldConfig.interestingForms.f_id_w;
            }
            if (oldConfig.interestingForms.f_name_b) {
                if (!sc.blackList) sc.blackList = { fields: { names: [] } };
                else if (!sc.blackList.fields) sc.blackList.fields = { names: [] };
                else if (!sc.blackList.fields.names) sc.blackList.fields.names = [];
                sc.blackList.fields.names = oldConfig.interestingForms.f_name_b;
            }
            if (oldConfig.interestingForms.f_id_b) {
                if (!sc.blackList) sc.blackList = { fields: { ids: [] } };
                else if (!sc.blackList.fields) sc.blackList.fields = { ids: [] };
                else if (!sc.blackList.fields.ids) sc.blackList.fields.ids = [];
                sc.blackList.fields.ids = oldConfig.interestingForms.f_id_b;
            }
        }
        return sc;
    }

    public siteConfigLookupFor (target: "Domain" | "Host" | "Page", method: "Exact" | "Prefix" | "Regex") {
        if (target == "Domain") {
            if (method == "Exact") return this.current.siteConfig.domainExact;
            if (method == "Prefix") return this.current.siteConfig.domainPrefix;
            if (method == "Regex") return this.current.siteConfig.domainRegex;
        } else if (target = "Host") {
            if (method == "Exact") return this.current.siteConfig.hostExact;
            if (method == "Prefix") return this.current.siteConfig.hostPrefix;
            if (method == "Regex") return this.current.siteConfig.hostRegex;
        } else if (target = "Page") {
            if (method == "Exact") return this.current.siteConfig.pageExact;
            if (method == "Prefix") return this.current.siteConfig.pagePrefix;
            if (method == "Regex") return this.current.siteConfig.pageRegex;
        }
        return null;
    }

    public siteConfigFor (url: string): SiteConfig {

//TODO:c: Resolve by finding all matches from the 9 lookups, ordering by match weight descending
//and interate until a config value for every setting has been found.
        return null;
    }

    public isFormInteresting (form: HTMLFormElement) {

        return null;

        //TODO:c: re-implement
        // let interestingForm: boolean = null;

        // interestingForm = siteConfigManager.valueAllowed(form.id, conf.interestingForms.id_w, conf.interestingForms.id_b, interestingForm);
        // interestingForm = siteConfigManager.valueAllowed(form.name, conf.interestingForms.name_w, conf.interestingForms.name_b, interestingForm);

        // if (interestingForm === false)
        // {
        //     this.Logger.debug("Lost interest in this form after inspecting form name and ID");
        //     continue;
        // }

        // for (const f in otherFields)
        // {
        //     interestingForm = siteConfigManager.valueAllowed(otherFields[f].id, conf.interestingForms.f_id_w, conf.interestingForms.f_id_b, interestingForm);
        //     interestingForm = siteConfigManager.valueAllowed(otherFields[f].name, conf.interestingForms.f_name_w, conf.interestingForms.f_name_b, interestingForm);
        // }

        // //TODO:1.6: #444 interestingForm = keefox_org.this.config.cssSelectorAllowed(document,conf.interestingForms.f_css_w,conf.interestingForms.f_css_b,interestingForm);

    }

}

let configManager = new ConfigManager();
