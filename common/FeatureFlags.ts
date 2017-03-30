class FeatureFlags {

    public static readonly offered: string[] = [

        // Full feature set as of KeeFox 1.6
        "KPRPC_FEATURE_VERSION_1_6",

        // Trivial example showing how we've added a new client feature
        "KPRPC_FEATURE_WARN_USER_WHEN_FEATURE_MISSING"

        // in the rare event that we want to check for the absense of a feature
        // we would add a feature flag along the lines of "KPRPC_FEATURE_REMOVED_INCOMPATIBLE_THING_X"

    ];

    public static readonly required: string[] = [

        // Full feature set as of KeeFox 1.6
        "KPRPC_FEATURE_VERSION_1_6"

    ];

    public static received: string[];

}
