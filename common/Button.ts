export type ButtonAction = "enableHighSecurityKPRPCConnection" |
"disableNotifyWhenEntryUpdated" |
"loadUrlUpgradeKee" | "launchLoginEditorFromNotification";

export interface Button {
    label: string;
    action?: ButtonAction;
    id?: string;
    tooltip?: string;
    values?: { [id: string] : string };
}
