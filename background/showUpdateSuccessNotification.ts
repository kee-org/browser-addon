import { configManager } from "../common/ConfigManager";
import { Button } from "../common/Button";
import { KeeNotification } from "../common/KeeNotification";
import { utils } from "../common/utils";

export function showUpdateSuccessNotification (uniqueID: string, fileName: string) {
    if (configManager.current.notifyWhenEntryUpdated) {
        const button1: Button = {
            label: $STR("dont_show_again"),
            action: "disableNotifyWhenEntryUpdated"
        };
        const button2: Button = {
            label: $STR("showEntry"),
            action: "launchLoginEditorFromNotification",
            values: { uniqueID, fileName }
        };
        const messages = [$STR("password_successfully_updated"),
            $STR("entry_history_pointer"),
            $STR("change_field_status"),
            $STR("change_field_explanation"),
            $STR("multi_page_update_warning")];
        const notification = new KeeNotification("password-updated", [button2, button1], utils.newGUID(), messages, "Medium");
        window.kee.notifyUser(notification);
    }
}
