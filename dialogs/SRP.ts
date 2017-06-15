/// <reference path="../common/Logger.ts" />
/// <reference path="../common/ConfigManager.ts" />

class SrpDialog {
    public setupPage () {
        (document.getElementById("pref_sl_server") as HTMLSelectElement).value =
            configManager.current.connSLServerMin.toString();
        (document.getElementById("pref_sl_client_high") as HTMLInputElement).checked =
            configManager.current.connSLClient === 3 ? true : null;

        (document.getElementById("password") as HTMLInputElement).addEventListener("keyup", e => {
            this.updateButtonState();
        });
        (document.getElementById("pref_sl_server") as HTMLSelectElement).addEventListener("change", e => {
            this.updateButtonState();
        });
        (document.getElementById("pref_sl_client_high") as HTMLInputElement).addEventListener("change", e => {
            this.updateButtonState();
        });

        document.getElementById("ok").addEventListener("click", this.primaryButtonClicked.bind(this));

        window.addEventListener("unload", e => chrome.runtime.sendMessage({action: "ok", password: "" }));
    }

    updateButtonState () {
        const passwordSet = (document.getElementById("password") as HTMLInputElement).value.length > 0;
        const settingsChanged = this.settingsChanged();
        if (passwordSet && settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("srp_save_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else if (passwordSet && !settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("srp_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else if (!passwordSet && settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("save");
            (document.getElementById("ok") as HTMLButtonElement).disabled = null;
        } else {
            document.getElementById("ok").innerHTML = $STR("srp_connect");
            (document.getElementById("ok") as HTMLButtonElement).disabled = true;
        }
    }

    primaryButtonClicked () {
        const password = document.getElementById("password") as HTMLInputElement;
        if (this.settingsChanged()) {
            const clientHigh = document.getElementById("pref_sl_client_high") as HTMLInputElement;
            const serverSL = document.getElementById("pref_sl_server") as HTMLSelectElement;
            configManager.current.connSLClient = clientHigh.checked ? 3 : 2;
            configManager.current.connSLServerMin = parseInt(serverSL.value);
            configManager.save(this.continueSRP.bind(this, password.value));
        } else {
            this.continueSRP(password.value);
        }
    }

    settingsChanged () {
        const clientHigh = document.getElementById("pref_sl_client_high") as HTMLInputElement;
        const serverSL = document.getElementById("pref_sl_server") as HTMLSelectElement;
        const clientHighPrevious = configManager.current.connSLClient === 3;
        return clientHigh.checked !== clientHighPrevious || serverSL.value !== configManager.current.connSLServerMin.toString();
    }

    continueSRP (password: string) {
        (chrome as any).windows.getCurrent(win => {
            chrome.runtime.sendMessage({action: "ok", password: password });
            const removing = (chrome as any).windows.remove(win.id);
        });
    }
}
