window.KeeAddonSupportedFeatures = [
    "KPRPC_FEATURE_BROWSER_HOSTED",
    "KPRPC_FEATURE_VERSION_1_6",
    "KPRPC_FEATURE_WARN_USER_WHEN_FEATURE_MISSING",
    "BROWSER_SETTINGS_SYNC"];

function messageToKeeAddon(detail) {
    const ourScriptTag = document.getElementById("keeVaultMagic_existsExactlyHere");
    const eventName = ourScriptTag.dataset["kvCustomEventNameFromPage"];
    var messageEvent = new CustomEvent(eventName, {"detail":detail});
    document.dispatchEvent(messageEvent);
}

function initKeeAddonLink() {
    const ourScriptTag = document.getElementById("keeVaultMagic_existsExactlyHere");
    const eventName = ourScriptTag.dataset["kvCustomEventNameToPage"];
    var KeeAddonEnabledEvent = new CustomEvent('KeeAddonEnabled', {"detail":eventName});
    document.dispatchEvent(KeeAddonEnabledEvent);
    console.log("Kee addon link activated");
}

if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initKeeAddonLink); }
else { initKeeAddonLink() }
console.log("Kee addon link injected");
