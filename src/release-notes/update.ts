import {setup as i18nSetup } from "../common/i18n";

document.getElementById("betaTestingCTA").addEventListener("click", () => {
    window.open("https://forum.kee.pm/t/beta-testing-the-kee-browser-extension/2022");
});

document.getElementById("betaTestingFeedbackCTA").addEventListener("click", () => {
    window.open("https://forum.kee.pm/");
});

document.getElementById("keeVaultCTA").addEventListener("click", () => {
    window.open("https://forum.kee.pm/kee-vault-launch");
});

const root = document.documentElement;

if (import.meta.env.VITE_KEE_CHANNEL) {
    console.error("beta 1");
    root.style.setProperty("--display-none-when-beta", "none");
  } else {
    console.error("prod");
    root.style.setProperty("--display-none-when-not-beta", "none");
  }
i18nSetup();
