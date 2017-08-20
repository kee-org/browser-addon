class SrpDialog {
    setupPage() {
        document.getElementById("pref_sl_server").value =
            configManager.current.connSLServerMin.toString();
        document.getElementById("pref_sl_client_high").checked =
            configManager.current.connSLClient === 3 ? true : null;
        document.getElementById("password").addEventListener("keyup", e => {
            this.updateButtonState();
        });
        document.getElementById("pref_sl_server").addEventListener("change", e => {
            this.updateButtonState();
        });
        document.getElementById("pref_sl_client_high").addEventListener("change", e => {
            this.updateButtonState();
        });
        document.getElementById("ok").addEventListener("click", this.primaryButtonClicked.bind(this));
        window.addEventListener("unload", e => chrome.runtime.sendMessage({ action: "SRP_ok", password: "" }));
    }
    updateButtonState() {
        const passwordSet = document.getElementById("password").value.length > 0;
        const settingsChanged = this.settingsChanged();
        if (passwordSet && settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("srp_save_connect");
            document.getElementById("ok").disabled = null;
        }
        else if (passwordSet && !settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("srp_connect");
            document.getElementById("ok").disabled = null;
        }
        else if (!passwordSet && settingsChanged) {
            document.getElementById("ok").innerHTML = $STR("save");
            document.getElementById("ok").disabled = null;
        }
        else {
            document.getElementById("ok").innerHTML = $STR("srp_connect");
            document.getElementById("ok").disabled = true;
        }
    }
    primaryButtonClicked() {
        const password = document.getElementById("password");
        if (this.settingsChanged()) {
            const clientHigh = document.getElementById("pref_sl_client_high");
            const serverSL = document.getElementById("pref_sl_server");
            configManager.current.connSLClient = clientHigh.checked ? 3 : 2;
            configManager.current.connSLServerMin = parseInt(serverSL.value);
            configManager.save(this.continueSRP.bind(this, password.value));
        }
        else {
            this.continueSRP(password.value);
        }
    }
    settingsChanged() {
        const clientHigh = document.getElementById("pref_sl_client_high");
        const serverSL = document.getElementById("pref_sl_server");
        const clientHighPrevious = configManager.current.connSLClient === 3;
        return clientHigh.checked !== clientHighPrevious || serverSL.value !== configManager.current.connSLServerMin.toString();
    }
    continueSRP(password) {
        chrome.windows.getCurrent(win => {
            chrome.runtime.sendMessage({ action: "SRP_ok", password: password });
            const removing = chrome.windows.remove(win.id);
        });
    }
}
let srp;
function setupPage() {
    KeeLog.attachConfig(configManager.current);
    srp = new SrpDialog();
    srp.setupPage();
    document.getElementById("i18n_root").style.display = "block";
}
document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage));

//# sourceMappingURL=SRP.js.map
