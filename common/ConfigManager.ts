import {
    Config,
    SiteConfig,
    SiteConfigLookup,
    SiteConfigMethod,
    SiteConfigNode,
    SiteConfigNodeType,
    SiteConfigTarget
} from "./config";
import { ConfigMigrations } from "./ConfigMigrations";
import { defaultSiteConfig } from "./DefaultSiteConfig";
import { utils } from "./utils";
import { Field } from "./model/Field";
import { KeeLog } from "./Logger";

type SiteConfigNodeAndIndex = {
    node: SiteConfigNode;
    target: SiteConfigTarget;
    method: SiteConfigMethod;
    lookupValue: string;
};

/*
  Entry-specific configuration is stored in KeePass but in future maybe
  we'll still make it available from this interface.
*/

// Pretend browser (WebExtensions) is chrome (we include a
// polyfill from Mozilla but it doesn't work in some cases)
declare const chrome;

// increment when changes are introduced that require data migration
export const LATEST_VERSION = 7;

export const defaultConfig = new Config();
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
defaultConfig.logLevel = 2;
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
defaultConfig.version = LATEST_VERSION;
defaultConfig.triggerChangeInputEventAfterFill = false;
defaultConfig.autoSubmitNetworkAuthWithSingleMatch = false;
defaultConfig.searchNetworkAuth = true;
defaultConfig.notificationCountGeneric = 0;
defaultConfig.notificationCountSavePassword = 0;
defaultConfig.currentSearchTermTimeout = 30;
defaultConfig.notifyPasswordAvailableForPaste = true;
defaultConfig.animateWhenOfferingSave = true;
defaultConfig.keeVaultLaunchMessageDismissed = false;
defaultConfig.keeVaultLaunchStart = 8640000000000000;
defaultConfig.keeVaultLaunchEnd = 8640000000000000;
defaultConfig.manualSubmitOverrideProhibited = false;
defaultConfig.theme = null;
defaultConfig.hideConfirmationAfterSave = false;
defaultConfig.mustShowReleaseNotesAtStartup = false;

export class ConfigManager {
    public current: Config;
    private readonly maxCharsPerPage: number = 10000;
    private _listeners = [];

    public constructor() {
        this.current = defaultConfig;
        browser.storage.onChanged.addListener((a, b) => this.reloadOnStorageChange(a, b));
    }

    // Some processes may want to take action when settings are changed (e.g. the background
    // process to notify the KPRPC server). Using this rather than browser.storage.onChanged.addListener
    // ensures that our configManager data is consistent with the underlying storage
    public addChangeListener(listener) {
        this._listeners.push(listener);
    }

    private reloadOnStorageChange(changes: browser.storage.StorageChange, area: string) {
        // We assume every change requires a reload of the config data. Since we batch and
        // page the data to enable enough storage space this is likley safe for the
        // long-term but perhaps performance gains could be found around here one day.
        //
        // We also reload after every save which is horribly inefficient but the alternative
        // is finding a reliable cross-process locking mechanism to ensure we only disable
        // reloading during an async save operation and not for a moment longer. That's just
        // not worth the risk of missing a change from another process.

        configManager.reload(() => this._listeners.forEach(listener => listener(changes, area)));
    }

    public async setASAP(values: Partial<Config>) {
        Object.assign(this.current, values);
        await this.save();
        return;
    }

    private splitStringToPages(str: string) {
        const numPages = Math.ceil(str.length / this.maxCharsPerPage);
        const pages = new Array(numPages);

        for (let i = 0, o = 0; i < numPages; ++i, o += this.maxCharsPerPage) {
            pages[i] = str.substr(o, this.maxCharsPerPage);
        }
        return pages;
    }

    public async save() {
        const configString = JSON.stringify(this.current);
        const pages = this.splitStringToPages(configString);
        const configValues: any = {};

        configValues.keeConfigPageCount = pages.length;

        for (let i = 0; i < pages.length; i++) {
            configValues["keeConfigPage" + i] = pages[i];
        }
        await browser.storage.local.set(configValues);
    }

    public load(onLoaded) {
        // We completely replace current config with what we load because we
        // don't know that applying onto the defaults will result in a safe
        // migration from any old version that we load. It would probably be
        // fine but might require version comparisons... in which case we might
        // as well just increment the version number and run a migration once
        // rather than incur increased ongoing load costs.
        browser.storage.local.get().then(config => {
            const pageCount = config["keeConfigPageCount"];

            if (pageCount) {
                let configString = "";
                for (let i = 0; i < pageCount; i++) {
                    const nextPage = config["keeConfigPage" + i];
                    if (nextPage) configString += nextPage;
                }
                if (configString) this.current = JSON.parse(configString);
            } else {
                const oldPageCount = config["keefoxConfigPageCount"];

                if (oldPageCount) {
                    let configString = "";
                    for (let i = 0; i < oldPageCount; i++) {
                        const nextPage = config["keefoxConfigPage" + i];
                        if (nextPage) configString += nextPage;
                    }
                    if (configString) this.current = JSON.parse(configString);
                    //TODO:4: Delete the old keefox prefixed data to save space
                }
            }
            this.fixInvalidConfigData();
            this.migrateToLatestVersion();
            onLoaded();
        });
    }

    // This is typically invalid due to the previous execution of alpha and beta code
    // on the user's system but whatever the reason, the items here are especially hard
    // to fix through the UI and critical to Kee functionality so we take no chances
    private fixInvalidConfigData() {
        let saveNeeded = false;
        if (this.current.KPRPCStoredKeys == null) {
            this.current.KPRPCStoredKeys = {};
            saveNeeded = true;
        }
        if (saveNeeded) this.save();
    }

    private migrateToLatestVersion() {
        if (this.current.version >= LATEST_VERSION) return;
        const migrations = new ConfigMigrations();
        /* eslint-disable no-fallthrough */
        switch (this.current.version) {
            case 1:
                migrations.migrateToVersion2(this.current);
            case 2:
                migrations.migrateToVersion3(this.current);
            case 3:
                migrations.migrateToVersion4(this.current);
            case 4:
                migrations.migrateToVersion5(this.current);
            case 5:
                migrations.migrateToVersion6(this.current);
            case 6:
                migrations.migrateToVersion7(this.current);
        }
        /* eslint-enable no-fallthrough */
        this.save();
    }

    public migrateFromRemoteToLatestVersion() {
        if (this.current.version >= LATEST_VERSION) return;
        const migrations = new ConfigMigrations();
        /* eslint-disable no-fallthrough */
        switch (this.current.version) {
            case 5:
                migrations.migrateToVersion6(this.current);
            case 6:
                migrations.migrateToVersion7(this.current);
        }
        /* eslint-enable no-fallthrough */
        this.save();
    }

    private reload(onLoaded?) {
        browser.storage.local.get().then(config => {
            const pageCount = config["keeConfigPageCount"];

            if (pageCount) {
                let configString = "";
                for (let i = 0; i < pageCount; i++) {
                    const nextPage = config["keeConfigPage" + i];
                    if (nextPage) configString += nextPage;
                }
                if (configString) {
                    this.current = Object.assign(this.current, JSON.parse(configString));
                }
            }
            if (onLoaded) onLoaded();
        });
    }

    public siteConfigLookupFor(target: SiteConfigTarget, method: SiteConfigMethod) {
        if (target == "Domain") {
            if (method == "Exact") {
                if (!this.current.siteConfig.domainExact) {
                    this.current.siteConfig.domainExact = new SiteConfigLookup();
                }
                return this.current.siteConfig.domainExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.domainPrefix) {
                    this.current.siteConfig.domainPrefix = new SiteConfigLookup();
                }
                return this.current.siteConfig.domainPrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.domainRegex) {
                    this.current.siteConfig.domainRegex = new SiteConfigLookup();
                }
                return this.current.siteConfig.domainRegex;
            }
        } else if (target == "Host") {
            if (method == "Exact") {
                if (!this.current.siteConfig.hostExact) {
                    this.current.siteConfig.hostExact = new SiteConfigLookup();
                }
                return this.current.siteConfig.hostExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.hostPrefix) {
                    this.current.siteConfig.hostPrefix = new SiteConfigLookup();
                }
                return this.current.siteConfig.hostPrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.hostRegex) {
                    this.current.siteConfig.hostRegex = new SiteConfigLookup();
                }
                return this.current.siteConfig.hostRegex;
            }
        } else if (target == "Page") {
            if (method == "Exact") {
                if (!this.current.siteConfig.pageExact) {
                    this.current.siteConfig.pageExact = new SiteConfigLookup();
                }
                return this.current.siteConfig.pageExact;
            }
            if (method == "Prefix") {
                if (!this.current.siteConfig.pagePrefix) {
                    this.current.siteConfig.pagePrefix = new SiteConfigLookup();
                }
                return this.current.siteConfig.pagePrefix;
            }
            if (method == "Regex") {
                if (!this.current.siteConfig.pageRegex) {
                    this.current.siteConfig.pageRegex = new SiteConfigLookup();
                }
                return this.current.siteConfig.pageRegex;
            }
        }
        return null;
    }

    public siteConfigFor(url: string): SiteConfig {
        const matchedConfigNodes = this.findAllConfigsFor(url);
        matchedConfigNodes.sort((node1, node2) => node2.matchWeight - node1.matchWeight);
        return this.deriveConfigFromMatches(matchedConfigNodes);
    }

    private findAllConfigsFor(urlString: string) {
        const matchedConfigNodes: SiteConfigNode[] = [];
        const url = new URL(urlString);
        const host = url.host;
        const page = host + url.pathname;
        const domain = utils.psl.getDomain(host);

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

    private findAllConfigsAndIndexFor(urlString: string) {
        const matchedConfigNodesAndIndexes: SiteConfigNodeAndIndex[] = [];
        const url = new URL(urlString);
        const host = url.host;
        const page = host + url.pathname;
        const domain = utils.psl.getDomain(host);

        for (const value in this.current.siteConfig.domainExact) {
            if (value === domain) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.domainExact[value],
                    target: "Domain",
                    method: "Exact",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.hostExact) {
            if (value === host) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.hostExact[value],
                    target: "Host",
                    method: "Exact",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.pageExact) {
            if (value === page) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.pageExact[value],
                    target: "Page",
                    method: "Exact",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.domainPrefix) {
            if (domain.startsWith(value)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.domainPrefix[value],
                    target: "Domain",
                    method: "Prefix",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.hostPrefix) {
            if (host.startsWith(value)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.hostPrefix[value],
                    target: "Host",
                    method: "Prefix",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.pagePrefix) {
            if (page.startsWith(value)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.pagePrefix[value],
                    target: "Page",
                    method: "Prefix",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.domainRegex) {
            if (new RegExp(value).test(domain)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.domainRegex[value],
                    target: "Domain",
                    method: "Regex",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.hostRegex) {
            if (new RegExp(value).test(host)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.hostRegex[value],
                    target: "Host",
                    method: "Regex",
                    lookupValue: value
                });
            }
        }
        for (const value in this.current.siteConfig.pageRegex) {
            if (new RegExp(value).test(page)) {
                matchedConfigNodesAndIndexes.push({
                    node: this.current.siteConfig.pageRegex[value],
                    target: "Page",
                    method: "Regex",
                    lookupValue: value
                });
            }
        }

        return matchedConfigNodesAndIndexes;
    }

    private deriveConfigFromMatches(matchedConfigNodes: SiteConfigNode[]) {
        const derivedConfig: SiteConfig = {};
        matchedConfigNodes.forEach(node => {
            if (
                node.config.preventSaveNotification !== undefined &&
                derivedConfig.preventSaveNotification == null
            ) {
                derivedConfig.preventSaveNotification = node.config.preventSaveNotification;
            }
            if (
                node.config.listMatchingCaseSensitive !== undefined &&
                derivedConfig.listMatchingCaseSensitive == null
            ) {
                derivedConfig.listMatchingCaseSensitive = node.config.listMatchingCaseSensitive;
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
                            derivedConfig.blackList.fields.names =
                                node.config.blackList.fields.names;
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
                            derivedConfig.whiteList.fields.names =
                                node.config.whiteList.fields.names;
                        }
                    }
                }
            }

            if (
                node.config.preferredEntryUuid !== undefined &&
                derivedConfig.preferredEntryUuid == null
            ) {
                derivedConfig.preferredEntryUuid = node.config.preferredEntryUuid;
            }
        });
        return derivedConfig;
    }

    private normalizeFormProperty(input: unknown, ic: boolean) {
        if (typeof input !== "string") return null;
        return ic ? input.toLowerCase() : input;
    }

    public isFormInteresting(form: HTMLFormElement, conf: SiteConfig, otherFields: Field[]) {
        const ic = conf.listMatchingCaseSensitive !== true;
        const fieldIds = otherFields
            .map(field => (ic ? field.locators[0]?.id.toLowerCase() : field.locators[0]?.id))
            .filter(Boolean);
        const fieldNames = otherFields
            .map(field => (ic ? field.locators[0]?.name.toLowerCase() : field.locators[0]?.name))
            .filter(Boolean);
        const formId = this.normalizeFormProperty(form.id, ic);
        const formName = this.normalizeFormProperty(form.name, ic);
        const excludeFormIds = (conf?.blackList?.form?.ids || [])
            .map(x => (ic ? x?.toLowerCase() : x))
            .filter(Boolean);
        const excludeFormNames = (conf?.blackList?.form?.names || [])
            .map(x => (ic ? x?.toLowerCase() : x))
            .filter(Boolean);
        const excludeFieldIds = (conf?.blackList?.fields?.ids || [])
            .map(x => (ic ? x?.toLowerCase() : x))
            .filter(Boolean);
        const excludeFieldNames = (conf?.blackList?.fields?.names || [])
            .map(x => (ic ? x?.toLowerCase() : x))
            .filter(Boolean);

        const excluded =
            excludeFormIds.indexOf(formId) >= 0 ||
            excludeFormNames.indexOf(formName) >= 0 ||
            excludeFieldIds.some(id => fieldIds.find(i => id === i) !== undefined) ||
            excludeFieldNames.some(name => fieldNames.find(n => name === n) !== undefined);

        if (excluded) return false;

        const includeFormIds = conf?.whiteList?.form?.ids || [];
        const includeFormNames = conf?.whiteList?.form?.names || [];
        const includeFieldIds = conf?.whiteList?.fields?.ids || [];
        const includeFieldNames = conf?.whiteList?.fields?.names || [];

        const included =
            includeFormIds.indexOf(formId) >= 0 ||
            includeFormNames.indexOf(formName) >= 0 ||
            includeFieldIds.some(id => fieldIds.find(i => id === i) !== undefined) ||
            includeFieldNames.some(name => fieldNames.find(n => name === n) !== undefined);

        if (included) return true;

        return null;
    }

    public get activeTheme(): string {
        return (
            this.current.theme ||
            (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        );
    }

    public togglePreferredEntryUuid(uuid: string, urlString: string) {
        let url;
        try {
            url = new URL(urlString);
        } catch (e) {
            KeeLog.error(
                "Invalid URL supplied to togglePreferredEntryUuid. Preferred entry will not be altered."
            );
            return;
        }
        const configuredTarget: SiteConfigTarget = "Domain";
        const allConfigNodesAndLookups = this.findAllConfigsAndIndexFor(urlString);
        const derivedConfig = this.siteConfigFor(urlString);
        const currentPreferredUuid = derivedConfig.preferredEntryUuid;

        if (currentPreferredUuid === uuid) {
            allConfigNodesAndLookups.forEach(cnl => {
                if (cnl.node.config.preferredEntryUuid === uuid) {
                    this.removePreferredEntryUuid(cnl);
                }
            });
        } else {
            allConfigNodesAndLookups.forEach(cnl => {
                if (
                    cnl.node.config.preferredEntryUuid === currentPreferredUuid &&
                    this.leastSpecificTarget(configuredTarget, cnl.target) === configuredTarget
                ) {
                    this.removePreferredEntryUuid(cnl);
                }
            });

            this.addSiteConfigParameters(
                { preferredEntryUuid: uuid } as SiteConfig,
                url,
                configuredTarget,
                "Exact",
                "Auto"
            );
        }
        this.save();
    }

    private removePreferredEntryUuid(cnl: SiteConfigNodeAndIndex) {
        cnl.node.config.preferredEntryUuid = null;

        // Unless the user has manually modified the per-site config for this site
        // we can tidy up this unnecessary data
        if (cnl.node.source === "Auto" && this.equalsDefaultSiteConfig(cnl.node.config)) {
            const lookup = this.siteConfigLookupFor(cnl.target, cnl.method);
            delete lookup[cnl.lookupValue];
        }
    }

    private equalsDefaultSiteConfig(config: SiteConfig) {
        if (typeof config.preferredEntryUuid === "boolean") return false;
        if (typeof config.preventSaveNotification === "boolean") return false;
        if (typeof config.listMatchingCaseSensitive === "boolean") return false;
        if (config.whiteList) return false;
        if (config.blackList) return false;
        return true;
    }

    private leastSpecificTarget(t1: SiteConfigTarget, t2: SiteConfigTarget): SiteConfigTarget {
        if (t1 === "Domain" || t2 === "Domain") {
            return "Domain";
        }
        if (t1 === "Host" || t2 === "Host") {
            return "Host";
        }
        return "Page";
    }

    public valueFromUrl(url: URL, target: SiteConfigTarget): string {
        const host = url.host;
        if (target === "Host") return host;
        if (target === "Page") return host + url.pathname;
        if (target === "Domain") return utils.psl.getDomain(host);
    }

    public addSiteConfigParameters(
        partialConfig: Partial<SiteConfig>,
        url: URL,
        target: SiteConfigTarget,
        method: SiteConfigMethod,
        source: SiteConfigNodeType
    ) {
        const value = this.valueFromUrl(url, target);
        const configLookup = configManager.siteConfigLookupFor(target, method);
        if (!configLookup[value]) {
            configLookup[value] = { config: new SiteConfig(), source, matchWeight: 100 };
        }
        Object.assign(configLookup[value].config, partialConfig);
    }
}

export const configManager = new ConfigManager();
