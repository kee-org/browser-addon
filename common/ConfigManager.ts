/*
  Entry-specific configuration is stored in KeePass but in future maybe
  we'll still make it available from this interface.
*/

/// <reference path="DefaultSiteConfig.ts" />
/// <reference path="config.ts" />
/// <reference path="kfDataModel.ts" />

declare const publicSuffixList;
declare const punycode;
declare const pslData;

// Pretend browser (WebExtensions) is chrome (there's a polyfill from Mozilla but it doesn't work well enough yet so this buys us time)
declare const chrome;

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
defaultConfig.version = 2; // increment when changes are introduced that require data migration
defaultConfig.triggerChangeInputEventAfterFill = false;
defaultConfig.autoSubmitNetworkAuthWithSingleMatch = false;
defaultConfig.searchNetworkAuth = true;
defaultConfig.notificationCountGeneric = 0;
defaultConfig.notificationCountSavePassword = 0;

class ConfigManager {
    public current: Config;
    private readonly maxCharsPerPage: number = 10000;
    private pslInitialised = false;

    public constructor () {
        this.current = defaultConfig;
        browser.storage.onChanged.addListener(this.reloadOnStorageChange);
    }

    get psl () {
        if (!publicSuffixList) throw new Error("publicSuffixList library not present");
        if (!this.pslInitialised) {
            publicSuffixList.parse(pslData.text, punycode.toASCII);
            this.pslInitialised = true;
        }
        return publicSuffixList;
    }

    private reloadOnStorageChange (changes: browser.storage.StorageChange, area: string) {
        // We assume every change requires a reload of the config data. Since we batch and
        // page the data to enable enough storage space this is likley safe for the
        // long-term but perhaps performance gains could be found around here one day.
        //
        // We also reload after every save which is horribly inefficient but the alternative
        // is finding a reliable cross-process locking mechanism to ensure we only disable
        // reloading during an async save operation and not for a moment longer. That's just
        // not worth the risk of missing a change from another process.

        configManager.reload();
    }

    public setASAP (values: Partial<Config>) {
        Object.assign(this.current, values);
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

    public save (callback?) {
        const configString = JSON.stringify(this.current);
        const pages = this.splitStringToPages(configString);
        const configValues: any = {};

        //TODO:3: Need to be able to save some config details locally and others synced
        configValues.keeConfigPageCount = pages.length;

        for (let i=0; i < pages.length; i++)
        {
            configValues["keeConfigPage" + i] = pages[i];
        }
        if (callback) chrome.storage.local.set(configValues, callback);
        else chrome.storage.local.set(configValues);
    }

    public load (onLoaded) {
        browser.storage.local.get().then(config => {
            const pageCount = config["keeConfigPageCount"];

            if (pageCount) {

                let configString = "";
                for (let i=0; i < pageCount; i++)
                {
                    const nextPage = config["keeConfigPage" + i];
                    if (nextPage)
                        configString += nextPage;
                }
                if (configString)
                    this.current = JSON.parse(configString);
            } else {
                const oldPageCount = config["keefoxConfigPageCount"];

                if (oldPageCount) {

                    let configString = "";
                    for (let i=0; i < oldPageCount; i++)
                    {
                        const nextPage = config["keefoxConfigPage" + i];
                        if (nextPage)
                            configString += nextPage;
                    }
                    if (configString)
                        this.current = JSON.parse(configString);
                    //TODO:3: Delete the old keefox prefixed data to save space
                }
            }
            this.fixInvalidConfigData();
            this.migrateToLatestVersion();
            onLoaded();
        });
    }

    // This is typically invalid due to the previous execution of alpha and beta code
    // on the user's system. Maybe should just bump up config versions every time but
    // with only a few hours until 2.0 launch, it's not the time to test such a new migration process.
    private fixInvalidConfigData () {
        let saveNeeded: boolean = false;
        if (this.current.KPRPCStoredKeys == null) {
            this.current.KPRPCStoredKeys = {};
            saveNeeded = true;
        }
        if (this.current.notificationCountGeneric == null) {
            this.current.notificationCountGeneric = 0;
            saveNeeded = true;
        }
        if (this.current.notificationCountSavePassword == null) {
            this.current.notificationCountSavePassword = 0;
            saveNeeded = true;
        }
        if (saveNeeded) this.save();
    }

    private reload (onLoaded?) {
        browser.storage.local.get().then(config => {
            const pageCount = config["keeConfigPageCount"];

            if (pageCount) {

                let configString = "";
                for (let i=0; i < pageCount; i++)
                {
                    const nextPage = config["keeConfigPage" + i];
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
            if (method == "Exact") {
                if (!this.current.siteConfig.domainExact) this.current.siteConfig.domainExact = new SiteConfigLookup();
                return this.current.siteConfig.domainExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.domainPrefix) this.current.siteConfig.domainPrefix = new SiteConfigLookup();
                return this.current.siteConfig.domainPrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.domainRegex) this.current.siteConfig.domainRegex = new SiteConfigLookup();
                return this.current.siteConfig.domainRegex;
            }
        } else if (target == "Host") {
            if (method == "Exact") {
                if (!this.current.siteConfig.hostExact) this.current.siteConfig.hostExact = new SiteConfigLookup();
                return this.current.siteConfig.hostExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.hostPrefix) this.current.siteConfig.hostPrefix = new SiteConfigLookup();
                return this.current.siteConfig.hostPrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.hostRegex) this.current.siteConfig.hostRegex = new SiteConfigLookup();
                return this.current.siteConfig.hostRegex;
            }
        } else if (target == "Page") {
            if (method == "Exact") {
                if (!this.current.siteConfig.pageExact) this.current.siteConfig.pageExact = new SiteConfigLookup();
                return this.current.siteConfig.pageExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.pagePrefix) this.current.siteConfig.pagePrefix = new SiteConfigLookup();
                return this.current.siteConfig.pagePrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.pageRegex) this.current.siteConfig.pageRegex = new SiteConfigLookup();
                return this.current.siteConfig.pageRegex;
            }
        }
        return null;
    }

    public siteConfigFor (url: string): SiteConfig {
        const matchedConfigNodes = this.findAllConfigsFor(url);
        matchedConfigNodes.sort(node => -node.matchWeight);
        return this.deriveConfigFromMatches(matchedConfigNodes);
    }

    private findAllConfigsFor (urlString: string) {
        const matchedConfigNodes: SiteConfigNode[] = [];
        const url = new URL(urlString);
        const host = url.host;
        const page = host + url.pathname;
        const domain = this.psl.getDomain(host);

        for (const value in this.current.siteConfig.domainExact) {
            if (value === domain) {
                matchedConfigNodes.push(this.current.siteConfig.domainExact[value]);
            }
        }
        for (const value in this.current.siteConfig.hostExact) {
            if (value === host) {
                matchedConfigNodes.push(this.current.siteConfig.hostExact[value]);
            }
        }
        for (const value in this.current.siteConfig.pageExact) {
            if (value === page) {
                matchedConfigNodes.push(this.current.siteConfig.pageExact[value]);
            }
        }
        for (const value in this.current.siteConfig.domainPrefix) {
            if (domain.startsWith(value)) {
                matchedConfigNodes.push(this.current.siteConfig.domainPrefix[value]);
            }
        }
        for (const value in this.current.siteConfig.hostPrefix) {
            if (host.startsWith(value)) {
                matchedConfigNodes.push(this.current.siteConfig.hostPrefix[value]);
            }
        }
        for (const value in this.current.siteConfig.pagePrefix) {
            if (page.startsWith(value)) {
                matchedConfigNodes.push(this.current.siteConfig.pagePrefix[value]);
            }
        }
        for (const value in this.current.siteConfig.domainRegex) {
            if (new RegExp(value).test(domain)) {
                matchedConfigNodes.push(this.current.siteConfig.domainRegex[value]);
            }
        }
        for (const value in this.current.siteConfig.hostRegex) {
            if (new RegExp(value).test(host)) {
                matchedConfigNodes.push(this.current.siteConfig.hostRegex[value]);
            }
        }
        for (const value in this.current.siteConfig.pageRegex) {
            if (new RegExp(value).test(page)) {
                matchedConfigNodes.push(this.current.siteConfig.pageRegex[value]);
            }
        }

        return matchedConfigNodes;
    }

    private deriveConfigFromMatches (matchedConfigNodes: SiteConfigNode[]) {
        const derivedConfig: SiteConfig = {};
        matchedConfigNodes.forEach(node => {
            if (node.config.preventSaveNotification !== undefined && derivedConfig.preventSaveNotification == null) {
                derivedConfig.preventSaveNotification = node.config.preventSaveNotification;
            }

            if (node.config.blackList !== undefined) {
                if (derivedConfig.blackList === undefined) {
                    derivedConfig.blackList = {};
                }
                if (node.config.blackList.form !== undefined) {
                    if (derivedConfig.blackList.form === undefined) {
                        derivedConfig.blackList.form = {};
                    }
                    if (node.config.blackList.form.ids !== undefined) {
                        if (derivedConfig.blackList.form.ids === undefined) {
                            derivedConfig.blackList.form.ids = node.config.blackList.form.ids;
                        }
                    }
                    if (node.config.blackList.form.names !== undefined) {
                        if (derivedConfig.blackList.form.names === undefined) {
                            derivedConfig.blackList.form.names = node.config.blackList.form.names;
                        }
                    }
                }
                if (node.config.blackList.fields !== undefined) {
                    if (derivedConfig.blackList.fields === undefined) {
                        derivedConfig.blackList.fields = {};
                    }
                    if (node.config.blackList.fields.ids !== undefined) {
                        if (derivedConfig.blackList.fields.ids === undefined) {
                            derivedConfig.blackList.fields.ids = node.config.blackList.fields.ids;
                        }
                    }
                    if (node.config.blackList.fields.names !== undefined) {
                        if (derivedConfig.blackList.fields.names === undefined) {
                            derivedConfig.blackList.fields.names = node.config.blackList.fields.names;
                        }
                    }
                }
            }

            if (node.config.whiteList !== undefined) {
                if (derivedConfig.whiteList === undefined) {
                    derivedConfig.whiteList = {};
                }
                if (node.config.whiteList.form !== undefined) {
                    if (derivedConfig.whiteList.form === undefined) {
                        derivedConfig.whiteList.form = {};
                    }
                    if (node.config.whiteList.form.ids !== undefined) {
                        if (derivedConfig.whiteList.form.ids === undefined) {
                            derivedConfig.whiteList.form.ids = node.config.whiteList.form.ids;
                        }
                    }
                    if (node.config.whiteList.form.names !== undefined) {
                        if (derivedConfig.whiteList.form.names === undefined) {
                            derivedConfig.whiteList.form.names = node.config.whiteList.form.names;
                        }
                    }
                }
                if (node.config.whiteList.fields !== undefined) {
                    if (derivedConfig.whiteList.fields === undefined) {
                        derivedConfig.whiteList.fields = {};
                    }
                    if (node.config.whiteList.fields.ids !== undefined) {
                        if (derivedConfig.whiteList.fields.ids === undefined) {
                            derivedConfig.whiteList.fields.ids = node.config.whiteList.fields.ids;
                        }
                    }
                    if (node.config.whiteList.fields.names !== undefined) {
                        if (derivedConfig.whiteList.fields.names === undefined) {
                            derivedConfig.whiteList.fields.names = node.config.whiteList.fields.names;
                        }
                    }
                }
            }
        });
        return derivedConfig;
    }

    public isFormInteresting (form: HTMLFormElement, conf: SiteConfig, otherFields: keeLoginField[]) {

        const blacklisted = (conf.blackList && conf.blackList.form && conf.blackList.form.ids || []).indexOf(form.id) >= 0
            || (conf.blackList && conf.blackList.form && conf.blackList.form.names || []).indexOf(form.name) >= 0
            || (conf.blackList && conf.blackList.fields && conf.blackList.fields.ids || []).some(id => otherFields.find(field => id === field.fieldId) !== undefined)
            || (conf.blackList && conf.blackList.fields && conf.blackList.fields.names || []).some(name => otherFields.find(field => name === field.name) !== undefined);

        if (blacklisted) return false;

        const whitelisted = (conf.whiteList && conf.whiteList.form && conf.whiteList.form.ids || []).indexOf(form.id) >= 0
            || (conf.whiteList && conf.whiteList.form && conf.whiteList.form.names || []).indexOf(form.name) >= 0
            || (conf.whiteList && conf.whiteList.fields && conf.whiteList.fields.ids || []).some(id => otherFields.find(field => id === field.fieldId) !== undefined)
            || (conf.whiteList && conf.whiteList.fields && conf.whiteList.fields.names || []).some(name => otherFields.find(field => name === field.name) !== undefined);

        if (whitelisted) return true;

        return null;
    }

}

let configManager = new ConfigManager();
