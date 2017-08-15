type ButtonAction = "enableHighSecurityKPRPCConnection" |
    "loadUrlHelpSensitiveLogging" | "disableNotifyWhenEntryUpdated" |
    "loadUrlUpgradeKee";

interface Button {
    label: string;
    action?: ButtonAction;
    id?: string;
    tooltip?: string;
}
