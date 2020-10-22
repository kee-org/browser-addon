import { configManager } from "../common/ConfigManager";
import { KeeLog } from "../common/Logger";

class SrpDialog {
    public setupPage() {
        (document.getElementById(
            "pref_sl_server"
        ) as HTMLSelectElement).value = configManager.current.connSLServerMin.toString();
        (document.getElementById("pref_sl_client_high") as HTMLInputElement).checked =
            configManager.current.connSLClient === 3 ? true : null;

        (document.getElementById("password") as HTMLInputElement).addEventListener("keyup", () => {
            this.updateButtonState();
        });
        (document.getElementById("pref_sl_server") as HTMLSelectElement).addEventListener(
            "change",
            () => {
                this.updateButtonState();
            }
        );
        (document.getElementById("pref_sl_client_high") as HTMLInputElement).addEventListener(
            "change",
            () => {
                this.updateButtonState();
            }
        );

        document
            .getElementById("ok")
            .addEventListener("click", this.primaryButtonClicked.bind(this));
        document.getElementById("form").addEventListener(
            "submit",
            (event => {
                event.preventDefault();
                this.primaryButtonClicked();
            }).bind(this)
        );

        window.addEventListener("beforeunload", () =>
            browser.runtime.sendMessage({ action: "SRP_ok", password: "" })
        );
    }

    updateButtonState() {
        const passwordSet =
            (document.getElementById("password") as HTMLInputElement).value.length > 0;
        const settingsChanged = this.settingsChanged();
        if (passwordSet && settingsChanged) {
            document.getElementById("ok").textContent = $STR("srp_save_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else if (passwordSet && !settingsChanged) {
            document.getElementById("ok").textContent = $STR("srp_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else if (!passwordSet && settingsChanged) {
            document.getElementById("ok").textContent = $STR("save");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else {
            document.getElementById("ok").textContent = $STR("srp_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = true;
        }
    }

    primaryButtonClicked() {
        const password = document.getElementById("password") as HTMLInputElement;
        if (this.settingsChanged()) {
            const clientHigh = document.getElementById("pref_sl_client_high") as HTMLInputElement;
            const serverSL = document.getElementById("pref_sl_server") as HTMLSelectElement;
            configManager.current.connSLClient = clientHigh.checked ? 3 : 2;
            configManager.current.connSLServerMin = parseInt(serverSL.value);
            configManager.save().then(this.continueSRP.bind(this, password.value));
        } else {
            this.continueSRP(password.value);
        }
    }

    settingsChanged() {
        const clientHigh = document.getElementById("pref_sl_client_high") as HTMLInputElement;
        const serverSL = document.getElementById("pref_sl_server") as HTMLSelectElement;
        const clientHighPrevious = configManager.current.connSLClient === 3;
        return (
            clientHigh.checked !== clientHighPrevious ||
            serverSL.value !== configManager.current.connSLServerMin.toString()
        );
    }

    async continueSRP(password: string) {
        const tab = await browser.tabs.getCurrent();
        browser.runtime.sendMessage({
            action: "SRP_ok",
            password: password
        });
        await browser.tabs.remove(tab.id);
    }
}

let srp: SrpDialog;

function setupPage() {
    KeeLog.attachConfig(configManager.current);
    srp = new SrpDialog();
    srp.setupPage();
    document.getElementById("i18n_root").style.display = "block";
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage));
} else {
    configManager.load(setupPage);
}
