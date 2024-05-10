<template>
    <v-app>
        <div id="i18n_root">

            <!--TODO: onboarding wizard -->
            <h1 style="font-size: 42px;"><img src="/assets/images/64.png"
                    style="margin-bottom: 4px; margin-right: 10px; display: inline;" />{{ $i18n("welcome_to_kee") }} 3.11</h1>

            <p style="font-weight: bold;">{{ $i18n("introduction_to_kee") }}</p>

            <p>It can only work when given access to each web page that you load. We've been doing this for decades and are fully open source so you can trust us with this permission but we welcome additional verification and scrutiny - if you are interested, .... is a good place to start.</p>

            <p>Since it's used on most sites, we also recommend keeping the browser icon on your toolbar for ease of access. TODO: Browser-specific screenshot and instructions (maybe don't bother for Firefox since we already request it goes there at install time)</p>

            <p>{{ $i18n("kee_works_with_a_password_manager") }}</p>

            <p>{{ $i18n("recommend_start_with_kee_vault") }}</p>

            <p>{{ $i18n("recommend_start_with_kee_vault2") }}</p>

            <v-btn color="primary" size="x-large" @click="loadKeeVault">{{ $i18n("load_kee_vault_now") }}</v-btn>
            <v-btn color="primary" size="x-large" @click="requestPermissions">request perms TODO l18n etc</v-btn>

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
                    href="https://forum.kee.pm/t/installing-kee-instructions/23" target="_blank"
                    >{{ $i18n("point_user_to_forum_link_text") }}</a>{{ $i18n("point_user_to_keepass_install_instructions_end") }}</p>

        </div>
    </v-app>
</template>

<script lang="ts">
import "../styles";

async function requestPermissions() {
	  const permissionsToRequest = {
	    origins: ["<all_urls>"]
	  }
	  await chrome.permissions.request(permissionsToRequest);
	}

export default {
    data: () => ({

    }),
    methods: {
        loadKeeVault: function () {
            window.open("https://keevault.pm");
        },
        requestPermissions: function () {
            requestPermissions();
        }
    }
};
//TODO: Could inspect connection status and behave differently if we know the user is already up and running?

// import { mapState } from "pinia";
// import PasswordGenerator from "../common/components/PasswordGenerator.vue";
// import { Port } from "../common/port";
// import { Action } from "../common/Action";
// import { AddonMessage } from "../common/AddonMessage";
// import useStore from "../store";
// import "../styles";

// export default {
//     components: {
//         PasswordGenerator
//     },
//     data: () => ({
//         showPasswordGenerator: false
//     }),
//     computed: {
//         ...mapState(useStore, [
//             "showGeneratePasswordLink",
//             "connectionStatus",
//             "connectionStatusDetail",
//             "connected",
//             "databaseIsOpen"
//         ])
//     },
//     methods: {
//         passwordGeneratorClosed: function () {
//             Port.postMessage({ action: Action.CloseAllPanels } as AddonMessage);
//         },
//         copyToClipboard: function (payload) {
//             if (payload?.value) {
//                 Port.postMessage({ copyToClipboard: payload.value } as AddonMessage);
//             }
//         }
//     }
// };
</script>

<style>
#main {
    padding: 20px;
    text-align: center;
}

.v-application {
    padding: 0px;
    margin: auto;
    max-width: 600px;
    text-align: center;
}

div#i18n_root {
    display: flex;
    flex-direction: column;
    align-items: center;
}

div#i18n_root > table {
    border: 1px solid grey;
    max-width: 80vw;
    margin: 15px;
}

div#i18n_root th, div#i18n_root td {
    border-left: solid 1px grey;
    text-align: center;
    padding: 5px 15px;
    width: 30%;
}

div#i18n_root td:first-child, div#i18n_root th:first-child {
    border-left: none;
    text-align: right;
    width: 40%;
}

</style>
