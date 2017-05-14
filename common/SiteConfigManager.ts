/// <reference path="Logger.ts" />

class SiteConfigManager
{
    private configCache = {};

    public valueAllowed (val, whitelist, blacklist, def)
    {
        if (val === undefined || val === null)
            return def;

        for (const b in blacklist)
            if (blacklist[b].toLowerCase() == val.toLowerCase())
            {
                KeeFoxLog.debug("Value found in blacklist");
                // a blacklist match always overrides the existing default behaviour
                return false;
            }
        for (const w in whitelist)
            if (whitelist[w].toLowerCase() == val.toLowerCase())
            {
                KeeFoxLog.debug("Value found in whitelist");
                // a whitelist match only overrides an unspecified default behaviour
                if (def == null)
                    return true;
            }
        return def;
    };

    private cloneObj (obj)
    {
        //TODO:2: improve speed? See http://jsperf.com/clone/5 https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ?
        //TODO:2: Might be useful in a utils location, not just for config manipulation
        return JSON.parse(JSON.stringify(obj));
    };

    private getConfigDefinitionForURL (siteConfig, url)
    {
        for (let i=1; i<siteConfig.length; i++) // skip first which is always "*"
        {
            if (url == siteConfig[i].url)
            {
                return siteConfig[i].config;
            }
        }

        // No config defined yet
        return {};
    };

    public getConfigForURL (siteConfig, url: string)
    {
        let workingConf;

        // Ignore trailing slashes
        url = url.endsWith("/") ? url.substring(0, url.length - 1) : url;

        if (this.configCache[url] === undefined)
        {
            if (siteConfig[0].url != "*")
                throw new Error("invalid config");

            workingConf = this.cloneObj(siteConfig[0].config);

            for (let i=1; i<siteConfig.length; i++) // skip first which is always "*"
            {
                // Ignore trailing slashes
                const currentUrl = siteConfig[i].url.endsWith("/")
                    ? siteConfig[i].url.substring(0, siteConfig[i].url.length - 1)
                    : siteConfig[i].url;
                if (url.indexOf(currentUrl) == 0)
                {
                    workingConf = this.applyMoreSpecificConfig(workingConf, siteConfig[i].config);
                }
            }
            KeeFoxLog.debug("Adding configuration to cache");
            this.configCache[url] = workingConf;
        } else
        {
            KeeFoxLog.debug("Returning configuration from cache");
            workingConf = this.configCache[url];
        }
        return workingConf;
    };

    private removeURLFromCache (url){
        for (const curl in this.configCache)
        {
            if ((curl as any).startsWith(url))
            {
                delete this.configCache[curl];
                KeeFoxLog.debug("Remove config cache entry '"+curl+"' for URL '"+url+"'");
            }
        }
    };

    private applyMoreSpecificConfig (workingConfig, extraConfig)
    {
        for (const prop in extraConfig)
        {
            if (extraConfig.hasOwnProperty(prop))
            {
                try
                {
                    if (extraConfig[prop].constructor == Object || typeof(extraConfig[prop]) == "object")
                    {
                        workingConfig[prop] = this.applyMoreSpecificConfig(workingConfig[prop], extraConfig[prop]);
//                    } else if (typeof(extraConfig[prop].length) != "undefined")
//                    {
//                        for (let a in extraConfig[prop])
//                        {
//                            workingConfig[prop][a] = this.applyMoreSpecificConfig(workingConfig[prop][a], extraConfig[prop][a]);
//                        }
                    } else
                    {
                        workingConfig[prop] = extraConfig[prop];
                    }
                } catch (ex)
                {
                    workingConfig[prop] = extraConfig[prop];
                }
            }
        }
        return workingConfig;
    };

    private setConfigForURL (siteConfig, url, newConfig)
    {
        KeeFoxLog.debug("setConfigForURL");

        // Clear the current config cache.
        //TODO:2: would be more efficient to only remove affected URLs
        this.configCache = {};

        if (url == "*")
        {
            siteConfig[0].config = newConfig;
            return;
        }
        // example.com/page.htm
        // example.com/longerpage
        // example.com/longerpage2
        // example.com/dil
        // example.com/dil/
        // example.com/dil/pag.htm
        // example.com/dir/page.htm
        // example.com/dir/page2.htm
        // example.com/longerpage.htm

        // if above url is exact prefix of currently visited url we want to apply the config.
        // order is important cos we assume a match that occurs later must be more specific
        // think that will always be the case

        let insertionPoint = siteConfig.length;

        // Ignore trailing slashes
        url = url.endsWith("/") ? url.substring(0, url.length - 1) : url;

        for (let i=1; i<siteConfig.length; i++) // skip the first default "*"
        {
            // Ignore trailing slashes
            const currentUrl = siteConfig[i].url.endsWith("/")
                ? siteConfig[i].url.substring(0, siteConfig[i].url.length - 1)
                : siteConfig[i].url;

            // If search URL is longer, keep looking
            if (url.length > currentUrl.length) continue;

            // If it's the same URL, update the config entry for that URL
            if (url == currentUrl)
            {
                siteConfig[i].config = newConfig;
                return;
            }

            // If we've found a URL longer than the one we want to insert, this is where we need to put the new URL
            if (url.length < currentUrl.length)
            {
                insertionPoint = i;
                break;
            }
        }

        if (insertionPoint == siteConfig.length)
            siteConfig.push({"url": url, "config": newConfig});
        else
            siteConfig.splice(insertionPoint, 0, {"url": url, "config": newConfig});
        //this._KFLog.debug(JSON.stringify(siteConfig));
    };

    private removeUrl (siteConfig, url)
    {
        if (url == "*") return;
        for (let i=0; i<siteConfig.length; i++)
        {
            if (url == siteConfig[i].url)
            {
                siteConfig.splice(i, 1);
                this.removeURLFromCache(url);
                break;
            }
        }
    };
}

let siteConfigManager = new SiteConfigManager();
