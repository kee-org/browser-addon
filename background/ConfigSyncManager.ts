import { Config } from "../common/config";
import { configManager } from "../common/ConfigManager";
import { KeeLog } from "../common/Logger";

export class ConfigSyncManager {
    private lastKnownSynced: {settings: Partial<Config>; version: number};
    private enabled: boolean = false;

    public updateFromRemoteConfig (config: {settings: Partial<Config>; version: number}) {

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

        // Clone so changes via references later can't affect later comparison
        this.lastKnownSynced = JSON.parse(JSON.stringify(config));

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
            animateWhenOfferingSave: settings.animateWhenOfferingSave,
            manualSubmitOverrideProhibited: !!settings.manualSubmitOverrideProhibited
        };
        const syncableConfig = {settings: syncableSettings, version: settings.version};

        if (window["fast-equals"].deepEqual(syncableConfig, this.lastKnownSynced)) return;

        const serialisedLatest = JSON.stringify(syncableConfig);
        KeeLog.debug(`Config different. latest: ${serialisedLatest} this.lastKnownSynced: ${JSON.stringify(this.lastKnownSynced)}`);

        try
        {
            window.kee.KeePassRPC.updateAddonSettings(syncableSettings, settings.version);
            // Clone so changes via references later can't affect later comparison
            this.lastKnownSynced = JSON.parse(JSON.stringify(syncableConfig));
        } catch (e)
        {
            KeeLog.error("Unexpected exception while connecting to KeePassRPC. Please inform the Kee team that they should be handling this exception: " + e);
            throw e;
        }
    }

    public reset () {
        this.enabled = false;
        this.lastKnownSynced = null;
    }
}
