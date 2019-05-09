type ButtonAction = "enableHighSecurityKPRPCConnection" |
    "disableNotifyWhenEntryUpdated" |
    "loadUrlUpgradeKee" | "launchLoginEditorFromNotification";

interface Button {
    label: string;
    action?: ButtonAction;
    id?: string;
    tooltip?: string;
    values?: { [id: string] : string; };
}
