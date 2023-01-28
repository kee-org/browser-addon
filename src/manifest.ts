/* eslint-disable camelcase */
import fs from "fs-extra";
import type { Manifest } from "webextension-polyfill";
import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";

export async function getManifest() {
    const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;

    // update this file to update this manifest.json
    // can also be conditional based on your need
    const manifest: Manifest.WebExtensionManifest = {
        manifest_version: 2,
        name: pkg.displayName || pkg.name,
        version: pkg.version,
        description: pkg.description,
        // browser_action: {
        //     default_icon: "./assets/icon-512.png",
        //     default_popup: "./dist/popup/index.html"
        // },
        // options_ui: {
        //     page: "./dist/options/index.html",
        //     open_in_tab: true,
        //     chrome_style: false
        // },
        // background: {
        //     page: "./dist/background/index.html",
        //     persistent: false
        // },
        // icons: {
        //     16: "./assets/icon-512.png",
        //     48: "./assets/icon-512.png",
        //     128: "./assets/icon-512.png"
        // },
        // permissions: ["tabs", "storage", "activeTab", "http://*/", "https://*/"],
        // content_scripts: [
        //     {
        //         matches: ["http://*/*", "https://*/*"],
        //         js: ["./dist/contentScripts/index.global.js"]
        //     }
        // ],
        "default_locale": "en",
    //TODO: Support Chrome version of manifest. e.g.: "version_name": "3.10.0 beta",
    "author": "Kee Vault Ltd",
    "background": {
        // "scripts": [
        //     "lib/dollar-polyfill.js",
        //     "lib/detectWebExtensions.js",
        //     "lib/tp/browser-polyfill.min.js",
        //     "lib/moduleHack.js",
        //     "lib/tp/punycode.js",
        //     "lib/moduleUnhack.js",
        //     "lib/pslData.js",
        //     "lib/tp/publicsuffixlist.min.js",
        //     "lib/tp/fast-equals.min.js",
        //     "lib/pkg/vue.runtime.min.js",
        //     "lib/pkg/vuex.min.js",
        //     "common/common.js",
        //     "lib/tp/biginteger.js",
        //     "background/background.js"
        // ],
        page: "./dist/background/index.html",
        "persistent": true
    },
    "content_scripts": [{
        "all_frames": true,
        "matches": ["<all_urls>"],
        "exclude_globs": ["https://app-dev.kee.pm:8087/*", "https://app-beta.kee.pm/*", "https://app.kee.pm/*", "https://keevault.pm/*"],
        "js": [
                // "lib/dollar-polyfill.js",
                // "lib/detectWebExtensions.js",
                // "lib/tp/browser-polyfill.min.js",
                // "lib/moduleHack.js",
                // "lib/tp/punycode.js",
                // "lib/moduleUnhack.js",
                // "lib/pslData.js",
                // "lib/tp/publicsuffixlist.min.js",
                // "lib/pkg/vue.runtime.min.js",
                // "lib/pkg/vuex.min.js",
                // "common/common.js",
                // "page/page.js"
                "./dist/page/index.global.js"
        ],
        "run_at": "document_end"
    // },{
    //     "all_frames": false,
    //     "matches": ["<all_urls>"],
    //     "include_globs": ["https://app-dev.kee.pm:8087/*", "https://app-beta.kee.pm/*", "https://app.kee.pm/*", "https://keevault.pm/*"],
    //     "js": [
    //             "lib/dollar-polyfill.js",
    //             "lib/detectWebExtensions.js",
    //             "lib/tp/browser-polyfill.min.js",
    //             "lib/moduleHack.js",
    //             "lib/tp/punycode.js",
    //             "lib/moduleUnhack.js",
    //             "lib/pslData.js",
    //             "lib/tp/publicsuffixlist.min.js",
    //             "lib/pkg/vue.runtime.min.js",
    //             "lib/pkg/vuex.min.js",
    //             "common/common.js",
    //             "vault/vault.js"
    //     ],
    //     "run_at": "document_end"
    }
],
    "icons": {
        "16": "./assets/images/16.png",
        "32": "./assets/images/32.png",
        "48": "./assets/images/48.png",
        "64": "./assets/images/64.png",
        "96": "./assets/images/96.png",
        "128": "./assets/images/128.png"
    },
    "browser_action": {
        "default_icon": {
            "16": "./assets/images/16.png",
            "32": "./assets/images/32.png",
            "48": "./assets/images/48.png",
            "64": "./assets/images/64.png"
        },
        "default_title": "Kee",
        // "default_popup": "popup/popup.html"
        default_popup: "./dist/popup/index.html",
        "default_area": "navbar"
    },
    "options_ui": {
        // "page": "settings/settings.html",
        page: "./dist/settings/index.html",
        "open_in_tab": true
    },
    "permissions": [
        "tabs",
        "contextMenus",
        "storage",
        "clipboardWrite",
        "webNavigation",
        "activeTab",
        "privacy",
        "webRequestBlocking",
        "webRequest",
        "<all_urls>",
        "notifications",
        "unlimitedStorage",
        "idle"
    ],
    // "web_accessible_resources" : [
	// 	"panels/*"
    // ],
    "commands": {
        "_execute_browser_action": {
            "suggested_key": {
                "default": "Alt+Shift+K"
            }
        },
        "primary-action": {
            "suggested_key": {
                "default": "Alt+Shift+V"
            },
            "description": "__MSG_KB_shortcut_simple_2_desc__"
        },
        "generate-password": {
            "suggested_key": {
                "default": "Alt+Shift+G"
            },
            "description": "__MSG_Menu_Button_copyNewPasswordToClipboard_label__"
        },
        "detect-forms": {
            "suggested_key": {
                "default": "Alt+Shift+M"
            },
            "description": "__MSG_Menu_Button_fillCurrentDocument_label__"
        }
    },
    "applications": {
        "gecko": {
            "id": "keefox@chris.tomlinson",
            "update_url": "https://raw.githubusercontent.com/kee-org/browser-addon-updates/master/beta/update.json",
            "strict_min_version": "78.0"
        }
    }
    };

    if (isDev) {
        // for content script, as browsers will cache them for each reload,
        // we use a background script to always inject the latest version
        // see src/background/contentScriptHMR.ts
        delete manifest.content_scripts;
        //manifest.permissions?.push("webNavigation");

        // this is required on dev for Vite script to load
        // eslint-disable-next-line no-useless-escape
        manifest.content_security_policy = `script-src \'self\' http://localhost:${port}; object-src \'self\'`;
    }

    return manifest;
}
