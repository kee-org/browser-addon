import { SiteConfig, Config, SiteConfigLookup, SiteConfigIndex } from "./config";
import { defaultSiteConfig } from "./DefaultSiteConfig";

export class ConfigMigrations {
    public migrateToVersion7(current: Config) {
        if (current.notificationCountSavePassword > 6) {
            Object.assign(current, {
                notificationCountSavePassword: 6,
                version: 7
            } as Partial<Config>);
        }
    }

    public migrateToVersion6(current: Config) {
        Object.assign(current, {
            animateWhenOfferingSave: true,
            version: 6
        } as Partial<Config>);
    }

    public migrateToVersion5(current: Config) {
        Object.assign(current, {
            notifyPasswordAvailableForPaste: true,
            version: 5
        } as Partial<Config>);
    }

    public migrateToVersion4(current: Config) {
        let newLogLevel = 2;
        if (current.logLevel === 1) {
            newLogLevel = 1;
        }

        Object.assign(current, { logLevel: newLogLevel, version: 4 } as Partial<Config>);
    }

    public migrateToVersion3(current: Config) {
        if (current.notificationCountGeneric == null) {
            current.notificationCountGeneric = 0;
        }
        if (current.notificationCountSavePassword == null) {
            current.notificationCountSavePassword = 0;
        }

        Object.assign(current, {
            currentSearchTermTimeout: 30,
            version: 3
        } as Partial<Config>);
    }

    public migrateToVersion2(current: Config) {
        let newSiteConfig = new SiteConfigIndex();

        if (!current.config || current.config.length == 0) {
            newSiteConfig = defaultSiteConfig;
            return;
        }
        newSiteConfig.pageRegex = new SiteConfigLookup();
        newSiteConfig.hostExact = new SiteConfigLookup();
        newSiteConfig.pagePrefix = new SiteConfigLookup();

        newSiteConfig.pageRegex["^.*$"] = {
            matchWeight: 0,
            config: this.migrateIndividualSiteConfigSettingsToV2(current.config[0].config),
            source: "Migration"
        };

        for (
            let i = 1;
            i < current.config.length;
            i++ // skip first which is always "*"
        ) {
            const url = current.config[i].url;
            if (url.indexOf("://") == -1) continue; // invalid data from old config
            const withoutProtocol = url.substr(url.indexOf("://") + 3);
            if (withoutProtocol.length <= 1) continue; // invalid data from old config

            const newConfig = this.migrateIndividualSiteConfigSettingsToV2(
                current.config[i].config
            );

            const pathIndex = withoutProtocol.indexOf("/");

            if (pathIndex > -1 || pathIndex == withoutProtocol.lastIndexOf("/")) {
                // removing trailing slash if we have only a host name
                const host =
                    pathIndex > -1 ? withoutProtocol.substr(0, pathIndex) : withoutProtocol;

                // User may have configured a prefix match in KeeFox 1.x but it's not an especially useful
                // behaviour and has potential to be unsafe in future so we convert all to exact matches now
                newSiteConfig.hostExact[host] = {
                    config: newConfig,
                    matchWeight: 100,
                    source: "Migration"
                };
            } else {
                // keep increasing weight until we find no other shorter existing entries. This assumes ordering by length
                // in the original data so that it can be transferred to the new config in same order
                // which isn't completely safe but only because of bugs in KeeFox 1.x which may have affected data integrity
                // in one or two rare cases and which we can no longer fix reliably anyway.
                let weight = 200;
                for (const pagePrefix in newSiteConfig.pagePrefix) {
                    if (withoutProtocol.startsWith(pagePrefix)) weight++;
                }

                newSiteConfig.pagePrefix[withoutProtocol] = {
                    config: newConfig,
                    matchWeight: weight,
                    source: "Migration"
                };
            }
        }

        Object.assign(current, {
            siteConfig: newSiteConfig,
            config: null,
            version: 2
        } as Partial<Config>);
    }

    private migrateIndividualSiteConfigSettingsToV2(oldConfig: any): SiteConfig {
        const sc = new SiteConfig();
        if (oldConfig.preventSaveNotification == null) {
            sc.preventSaveNotification = oldConfig.preventSaveNotification;
        }
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
}
