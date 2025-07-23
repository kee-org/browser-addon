export class FeatureFlags {
    public static readonly offered: string[] = [
        // Full feature set as of KeeFox 1.6
        "KPRPC_FEATURE_VERSION_1_6",

        // Trivial example showing how we've added a new client feature
        "KPRPC_FEATURE_WARN_USER_WHEN_FEATURE_MISSING",

        // This version can communicate with a browser-hosted server
        "KPRPC_FEATURE_BROWSER_HOSTED",

        // Sync settings across multiple browsers and devices
        "BROWSER_SETTINGS_SYNC",

        // We understand the KPRPC v2 DTO format
        "KPRPC_FEATURE_DTO_V2"//,

        // We can request a full list of custom icons and handle references only within each individual entry
        //"KPRPC_FEATURE_ICON_REFERENCES"

        // in the rare event that we want to check for the absense of a feature
        // we would add a feature flag along the lines of "KPRPC_FEATURE_REMOVED_INCOMPATIBLE_THING_X"
    ];

    public static readonly required: string[] = [
        // Full feature set as of KeeFox 1.6
        "KPRPC_FEATURE_VERSION_1_6",

        // Allow clients without the name KeeFox to connect
        "KPRPC_GENERAL_CLIENTS",

        // Require the security fix released on 29th July 2020
        "KPRPC_SECURITY_FIX_20200729"
    ];
}
