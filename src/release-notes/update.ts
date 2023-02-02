import {setup as i18nSetup } from "../common/i18n";

document.getElementById("betaTestingCTA").addEventListener("click", () => {
    window.open("https://forum.kee.pm/t/beta-testing-the-kee-browser-extension/2022");
});

document.getElementById("keeVaultCTA").addEventListener("click", () => {
    window.open("https://forum.kee.pm/kee-vault-launch");
});

i18nSetup();
