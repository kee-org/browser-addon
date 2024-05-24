<template>
    <v-app>
        <div id="i18n_root">
            <h1 style="font-size: 42px;"><img src="/assets/images/64.png"
                    style="margin-bottom: 4px; margin-right: 10px; display: inline;" />{{ $i18n("welcome_to_kee") }}
            </h1>

            <p style="font-weight: bold;">{{ $i18n("introduction_to_kee") }}</p>

            <p v-if="showPermissionsInfo">{{ $i18n("all_sites_permissions_required_start") }} <a
                    href="https://kee.pm/open-source/" target="_blank">{{ $i18n("all_sites_permissions_required_why_open_source_link_text")
                    }}</a> {{ $i18n("all_sites_permissions_required_middle") }} <a
                    href="https://kee.pm/extension-permissions/" target="_blank">{{
                        $i18n("all_sites_permissions_required_permissions_link_text") }}</a> {{
        $i18n("all_sites_permissions_required_end") }}</p>

            <v-btn v-if="showPermissionsInfo" color="primary" style="margin-top: 24px;" size="x-large"
                @click="requestPermissions">{{ $i18n("continue") }}</v-btn>

            <p v-if="showToolbarInfo">{{ $i18n("recommend_action_button_should_be_pinned") }}</p>

            <img v-if="showToolbarInfo" style="margin-top: 24px;" width="309"
                src="/assets/images/pinChromeScreenshot.png" />

            <div v-if="showDatabaseSourceOptions">
                <p>{{ $i18n("kee_works_with_a_password_manager") }}</p>

                <p>{{ $i18n("recommend_start_with_kee_vault") }}</p>

                <p>{{ $i18n("recommend_start_with_kee_vault2") }}</p>

                <v-btn color="primary" style="margin-top: 24px;" size="x-large" @click="loadKeeVault">{{
                    $i18n("load_kee_vault_now")
                }}</v-btn>

                <p>{{ $i18n("you_can_use_KeePass_instead") }} {{ $i18n("table_summarises_differences") }}
                </p>

                <table>
                    <tr>
                        <th> </th>
                        <th>Kee Vault</th>
                        <th>KeePass</th>
                    </tr>
                    <tr>
                        <td>{{ $i18n("access_from_multiple_devices") }}</td>
                        <td>{{ $i18n("yes") }}</td>
                        <td>{{ $i18n("no") }} *</td>
                    </tr>
                    <tr>
                        <td>{{ $i18n("shared_preferences") }}</td>
                        <td>{{ $i18n("yes_configure_once") }}</td>
                        <td>{{ $i18n("no_configure_multiple") }}</td>
                    </tr>
                    <tr>
                        <td>{{ $i18n("installation_required") }}</td>
                        <td>{{ $i18n("no") }}</td>
                        <td>{{ $i18n("yes") }}</td>
                    </tr>
                    <tr>
                        <td>{{ $i18n("difficulty") }}</td>
                        <td>{{ $i18n("difficulty_kee_vault") }}</td>
                        <td>{{ $i18n("difficulty_keepass") }}</td>
                    </tr>
                </table>

                <p>* {{ $i18n("keepass_sync_config_explanation") }}</p>

                <p>{{ $i18n("point_user_to_keepass_install_instructions_start") }} <a
                        href="https://forum.kee.pm/t/installing-kee-instructions/23" target="_blank">{{
                            $i18n("point_user_to_forum_link_text") }}</a>{{
        $i18n("point_user_to_keepass_install_instructions_end")
    }}</p>
            </div>
        </div>
    </v-app>
</template>

<script setup lang="ts">
import { ref } from "vue";
import "../styles";
import { isFirefox } from "webext-detect-page";

async function requestPermissions() {
    const permissionsToRequest = {
        origins: ["<all_urls>"]
    };
    await chrome.permissions.request(permissionsToRequest);
}

async function checkPermissions() {
    const permissionsToCheck = {
        origins: ["<all_urls>"]
    };
    return await chrome.permissions.contains(permissionsToCheck);
}

async function switchToKeeVaultTab() {
    const vaultTabs = await chrome.tabs.query({
        url: ["https://keevault.pm/*", "https://app-beta.kee.pm/*", "https://app-dev.kee.pm/*"]
    });
    if (vaultTabs && vaultTabs[0]) {
        chrome.tabs.update(vaultTabs[0].id, { active: true });
        chrome.windows.update(vaultTabs[0].windowId, { focused: true });
        return true;
    }
    return false;
}

async function initialiseDatabaseSourcePossibilities(permissionsInfoWasShown: boolean = false) {
    if (await switchToKeeVaultTab()) {
        // Kee Vault users that already have the app open in another tab and
        // have the required permissions will never see the toolbar pinning hint
        // but we think that it is not critical.
        close();
    } else {
        showDatabaseSourceOptions.value = true;
        showPermissionsInfo.value = false;
        if (permissionsInfoWasShown) showToolbarInfo.value = false;
    }
}

async function asyncSetup() {
    document.title = "Kee " + extensionVersion.value;
    if (await checkPermissions()) {
        await initialiseDatabaseSourcePossibilities();
    } else {
        chrome.permissions.onAdded.addListener(async permissions => {
            if (permissions.origins.includes("<all_urls>")) {
                await initialiseDatabaseSourcePossibilities(true);
            }
        });
        showPermissionsInfo.value = true;
    }
}
function loadKeeVault() {
    window.open("https://keevault.pm");
    close();
}

const manifest = chrome.runtime.getManifest();
const showPermissionsInfo = ref(false);
const showDatabaseSourceOptions = ref(false);
const extensionVersion = ref(manifest.version);
const showToolbarInfo = ref(!isFirefox());
asyncSetup.call(this);
</script>

<style>
#main {
    padding: 20px;
    text-align: center;
    background-color: rgb(var(--v-theme-background));
}

.v-application {
    padding: 0px;
    margin: auto;
    max-width: 1000px;
    text-align: center;
}

p {
    padding-top: 24px;
}

a {
    text-decoration: underline;
}

div#i18n_root {
    display: flex;
    flex-direction: column;
    align-items: center;
}

div#i18n_root table {
    border: 1px solid grey;
    max-width: 80vw;
    margin: 15px;
}

div#i18n_root th,
div#i18n_root td {
    border-left: solid 1px grey;
    text-align: center;
    padding: 5px 15px;
    width: 30%;
}

div#i18n_root td:first-child,
div#i18n_root th:first-child {
    border-left: none;
    text-align: right;
    width: 40%;
}</style>
