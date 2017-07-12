type ButtonAction = "enableHighSecurityKPRPCConnection" |
    "loadUrlHelpSensitiveLogging" | "disableNotifyWhenEntryUpdated";

interface Button {
    label: string;
    action?: ButtonAction;
    id?: string;
    tooltip?: string;
}
