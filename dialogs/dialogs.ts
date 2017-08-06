declare const dialogMode: string;
let srp: SrpDialog;

function setupPage () {
    KeeLog.attachConfig(configManager.current);

    switch (dialogMode)
    {
        case "srp":
            srp = new SrpDialog();
            srp.setupPage();
            break;
    }

    document.getElementById("i18n_root").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => configManager.load(setupPage));
