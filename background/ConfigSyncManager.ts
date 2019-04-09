class ConfigSyncManager {
    private lastKnownSerialised: string = "";
    private enabled: boolean = false;

    public updateFromRemoteConfig (config: {settings: Partial<Config>, version: number}) {

        // Will be falsy if a user is not logged in to a DB in Kee Vault
        // or an add-on or page update is required
        if (!config || !config.settings || !config.version) {
            return;
        }

        if (config.version !== configManager.current.version) {
            configManager.migrateFromRemoteToLatestVersion();
        }

        // No point processing potential config changes if we have yet to
        // hear that our connected session supports that feature
        this.enabled = true;

        this.lastKnownSerialised = JSON.stringify(config);

        configManager.setASAP(config.settings);
    }

    public updateToRemoteConfig (settings: Config) {
        if (!this.enabled) return;

        // Other items will not be synced remotely. This minimises
        // risk when one addon instance is upgraded before another because
        // we may need to perform type checks and/or coercion between stored
        // values and those running in the new add-on version
        const syncableSettings = {
            autoFillForms: settings.autoFillForms,
            autoFillFormsWithMultipleMatches: settings.autoFillFormsWithMultipleMatches,
            autoSubmitForms: settings.autoSubmitForms,
            autoSubmitMatchedForms: settings.autoSubmitMatchedForms,
            listAllOpenDBs: settings.listAllOpenDBs,
            logLevel: settings.logLevel,
            mruGroup: settings.mruGroup,
            notifyWhenEntryUpdated: settings.notifyWhenEntryUpdated,
            overWriteFieldsAutomatically: settings.overWriteFieldsAutomatically,
            rememberMRUDB: settings.rememberMRUDB,
            rememberMRUGroup: settings.rememberMRUGroup,
            saveFavicons: settings.saveFavicons,
            searchAllOpenDBs: settings.searchAllOpenDBs,
            siteConfig: settings.siteConfig,
            autoSubmitNetworkAuthWithSingleMatch: settings.autoSubmitNetworkAuthWithSingleMatch,
            notificationCountGeneric: settings.notificationCountGeneric,
            notificationCountSavePassword: settings.notificationCountSavePassword,
            currentSearchTermTimeout: settings.currentSearchTermTimeout,
            animateWhenOfferingSave: settings.animateWhenOfferingSave
        };
        const syncableConfig = {settings: syncableSettings, version: settings.version};

        // TODO:v: Somehow, this stringify puts the mruGroup property in different places, at least
        // in early 2019 Firefox Nightly builds. Seems to be created at the same time every time
        // per above code so not sure why it isn't following the stringify spec... but in any
        // case, it is probably a good idea to use something that's deterministic from just
        // property names rather than creation time.
        const latestSerialised = JSON.stringify(syncableConfig);
        if (latestSerialised === this.lastKnownSerialised) return;

        KeeLog.debug(`Config different. latestSerialised: ${latestSerialised} this.lastKnownSerialised: ${this.lastKnownSerialised}`);

        try
        {
            kee.KeePassRPC.updateAddonSettings(syncableSettings, settings.version);
            this.lastKnownSerialised = latestSerialised;
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    public reset () {
        this.enabled = false;
        this.lastKnownSerialised = "";
    }
}
