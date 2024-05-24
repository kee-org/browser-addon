// 2023: All tests fail because we can't run them in vite or jest.
// Probably impossible to make them work again now so abandoning them until MV3 rewrite. Just in case
// though, some comments like the ones below are the closest we got to any feasible workaround for the bugs.
// vi.hoisted(() => {
//     globalThis.jest = vi;
// global.chrome = {runtime:{id: "test id"}};
// globalThis.chrome = {runtime:{id: "test id"}};
// });
import { beforeEach, describe, expect, it, vi } from "vitest";
//globalThis.jest = vi;

import { SiteConfig } from "../common/config";

const urlStringPage1 = "https://www.kee.pm/examplePage?param=whatever";
const urlStringPage2 = "https://www.kee.pm/otherPage";

const urlStringDomain1 = "https://kee.pm";
const urlStringHost1 = "https://www.kee.pm";

const exampleEntryUUID1 = "1111";
const exampleEntryUUID2 = "2222";

beforeEach(() => {
    vi.resetModules();
});

it("resolved site config returns matching uuid with Domain preference set", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.togglePreferredEntryUuid(exampleEntryUUID1, urlStringPage1);
    const result = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    expect(result).toBe(exampleEntryUUID1);
});

it("resolved site config returns no matching uuid with no preference set", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    const result = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    expect(result).toBeNull();
});

it("resolved site config returns no matching uuid with incorrect Page preference set", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringPage1),
        "Page",
        "Exact",
        "Auto"
    );
    const result = configManager.siteConfigFor(urlStringPage2).preferredEntryUuid;
    expect(result).toBeNull();
});

it("removing preferred entry uuid for site config with other settings removes only the preferred entry uuid", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        {
            preferredEntryUuid: exampleEntryUUID1,
            listMatchingCaseSensitive: false,
            preventSaveNotification: true
        } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "Auto"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID1, urlStringDomain1);
    const result = configManager.siteConfigLookupFor("Domain", "Exact")[
        configManager.valueFromUrl(new URL(urlStringDomain1), "Domain")
    ];
    expect(result).toBeDefined();
    expect(result.config).toBeDefined();
    expect(result.config.preferredEntryUuid).toBeNull();
    expect(result.config.listMatchingCaseSensitive).toBe(false);
    expect(result.config.preventSaveNotification).toBe(true);
});

it("removing preferred entry uuid for site config with no other settings removes the entire site config definition", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        {
            preferredEntryUuid: exampleEntryUUID1
        } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "Auto"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID1, urlStringDomain1);
    const result = configManager.siteConfigLookupFor("Domain", "Exact")[
        configManager.valueFromUrl(new URL(urlStringDomain1), "Domain")
    ];
    expect(result).toBeUndefined();
});

it("removing preferred entry uuid for previously user-edited site config with no other settings removes only the preferred entry uuid", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        {
            preferredEntryUuid: exampleEntryUUID1
        } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "User"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID1, urlStringDomain1);
    const result = configManager.siteConfigLookupFor("Domain", "Exact")[
        configManager.valueFromUrl(new URL(urlStringDomain1), "Domain")
    ];
    expect(result).toBeDefined();
    expect(result.config).toBeDefined();
    expect(result.config.preferredEntryUuid).toBeNull();
});

it("setting a matching entry as no longer preferred invokes 'remove' for Domain, Hostname and Page site config definitions", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "Auto"
    );
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringHost1),
        "Host",
        "Exact",
        "Auto"
    );
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringPage1),
        "Page",
        "Exact",
        "Auto"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID1, urlStringPage1);
    const resultVisible = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    const resultDefunctDomainConfigRemoved = configManager.siteConfigLookupFor("Domain", "Exact")[
        configManager.valueFromUrl(new URL(urlStringDomain1), "Domain")
    ];
    const resultDefunctHostConfigRemoved = configManager.siteConfigLookupFor("Host", "Exact")[
        configManager.valueFromUrl(new URL(urlStringHost1), "Host")
    ];
    const resultDefunctPageConfigRemoved = configManager.siteConfigLookupFor("Page", "Exact")[
        configManager.valueFromUrl(new URL(urlStringPage1), "Page")
    ];
    expect(resultVisible).toBeNull();
    expect(resultDefunctDomainConfigRemoved).toBeUndefined();
    expect(resultDefunctHostConfigRemoved).toBeUndefined();
    expect(resultDefunctPageConfigRemoved).toBeUndefined();
});

it("setting new matching entry as preferred invokes 'remove' for all config settings that can determine the current preferred entry if they are equally or more specific than the configured target", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "Auto"
    );
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringHost1),
        "Host",
        "Exact",
        "Auto"
    );
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringPage1),
        "Page",
        "Exact",
        "Auto"
    );
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID2 } as SiteConfig,
        new URL(urlStringPage2),
        "Page",
        "Exact",
        "Auto"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID2, urlStringPage1);
    const resultVisible = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    const resultOtherVisibleStillCorrect = configManager.siteConfigFor(urlStringPage2)
        .preferredEntryUuid;
    const resultDefunctHostConfigRemoved = configManager.siteConfigLookupFor("Host", "Exact")[
        configManager.valueFromUrl(new URL(urlStringHost1), "Host")
    ];
    const resultDefunctPageConfigRemoved = configManager.siteConfigLookupFor("Page", "Exact")[
        configManager.valueFromUrl(new URL(urlStringPage1), "Page")
    ];
    expect(resultVisible).toBe(exampleEntryUUID2);
    expect(resultOtherVisibleStillCorrect).toBe(exampleEntryUUID2);
    expect(resultDefunctHostConfigRemoved).toBeUndefined();
    expect(resultDefunctPageConfigRemoved).toBeUndefined();
});

it("setting new matching entry as preferred updates an existing Exact per site config definition", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.addSiteConfigParameters(
        { preferredEntryUuid: exampleEntryUUID1 } as SiteConfig,
        new URL(urlStringDomain1),
        "Domain",
        "Exact",
        "Auto"
    );
    configManager.togglePreferredEntryUuid(exampleEntryUUID2, urlStringPage1);
    const result = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    expect(result).toBe(exampleEntryUUID2);
});

it("setting new matching entry as preferred creates new Exact per site config definition", async () => {
    const configManager = (await import("../common/ConfigManager")).configManager;
    configManager.togglePreferredEntryUuid(exampleEntryUUID2, urlStringPage1);
    const resultVisible = configManager.siteConfigFor(urlStringPage1).preferredEntryUuid;
    const resultDomainConfigCreated = configManager.siteConfigLookupFor("Domain", "Exact")[
        configManager.valueFromUrl(new URL(urlStringDomain1), "Domain")
    ];
    expect(resultVisible).toBe(exampleEntryUUID2);
    expect(resultDomainConfigCreated).toBeDefined();
    expect(resultDomainConfigCreated.source).toBe("Auto");
});
