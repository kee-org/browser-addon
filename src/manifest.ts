/* eslint-disable camelcase */
import fs from "fs-extra";
import type PkgType from "../package.json";
import { isBeta, isDev, isChrome, port, r } from "../scripts/utils";

type Manifest = chrome.runtime.Manifest;

export async function getManifest() {
    const pkg = (await fs.readJSON(r("package.json"))) as typeof PkgType;
    //chrome.runtime.connect(port);
    // update this file to update this manifest.json
    // can also be conditional based on your need
    const manifest: Manifest = {
        manifest_version: 3,
        name: pkg.displayName || pkg.name,
        version: pkg.version,
        description: pkg.description,
        default_locale: "en",
        version_name: pkg.version,

        // necessary to omit scripts in 2024 to avoid warning noise in Chrome
        // background: {
        //     service_worker: "./dist/background/index.js",
        //     scripts: ["dist/background/index.js"],
        //     type: "module"
        //   } as any, // type error - doesn't support scripts
        background: {
            service_worker: "./dist/background/index.js",
            type: "module"
        },
        content_scripts: [{
            all_frames: true,
            matches: ["<all_urls>"],
            exclude_globs: ["https://app-dev.kee.pm:8087/*", "https://app-beta.kee.pm/*", "https://app.kee.pm/*", "https://keevault.pm/*"],
            js: [
                "./dist/page/index.global.js"
            ],
            run_at: "document_end"
        }, {
            all_frames: false,
            matches: ["<all_urls>"],
            include_globs: ["https://app-dev.kee.pm:8087/*", "https://app-beta.kee.pm/*", "https://app.kee.pm/*", "https://keevault.pm/*"],
            js: [
                "./dist/vault/index.global.js"
            ],
            run_at: "document_end"
        }
        ],
        icons: {
            "16": "./assets/images/16.png",
            "32": "./assets/images/32.png",
            "48": "./assets/images/48.png",
            "64": "./assets/images/64.png",
            "96": "./assets/images/96.png",
            "128": "./assets/images/128.png"
        },
        action: {
            "default_icon": {
                "16": "./assets/images/16.png",
                "32": "./assets/images/32.png",
                "48": "./assets/images/48.png",
                "64": "./assets/images/64.png"
            },
            "default_title": "Kee",
            default_popup: "./dist/popup/index.html"
        },
        options_ui: {
            page: "./dist/settings/index.html",
            open_in_tab: true
        },
        permissions: [
            "alarms",
            "tabs",
            "contextMenus",
            "storage",
            "clipboardWrite",
            "webNavigation",
            "activeTab",
            "privacy",
            //"webRequestAuthProvider", // Supported in Firefox 126+ (https://bugzilla.mozilla.org/show_bug.cgi?id=1820569)
            "webRequest",
            "webRequestBlocking", // Required for Firefox HTTP Auth before 126
            "notifications",
            "unlimitedStorage",
            "idle",
            "scripting" // new requirement for MV3 to support reliable enabling of Kee Vault website and in-page assistance for tabs already open when extension is installed/updated
        ] as any, // type error - doesn't support webRequestAuthProvider

        // As of 2024 host permission management is still chaotic across Firefox and Chrome but if
        // they can ever come up with the promised solution for optional per-site management, we
        // could look into requesting "optional_host_permissions": ["<all_urls>"] and
        // host_permissions: ["*://*.kee.pm/*", "*://*.keevault.pm/*"] to give end users more
        // options for risk management.
        host_permissions: ["<all_urls>"],

        // http and https only(no file) - otherwise should be identical to <all_urls>
        //host_permissions: ["*://*/*"],

        web_accessible_resources: [
            {
                resources: ["lib/linkContentScriptToKeeVaultWebsite.js"],
                matches: ["*://*.kee.pm/*", "*://*.keevault.pm/*"]
            },
            {
                resources: ["dist/panels/*"],
                matches: ["<all_urls>"]
            }
        ],
        content_security_policy: {
            extension_pages: isDev
                // http://localhost:${port} is required on dev for Vite script to load
                // http://localhost:8099 for Vue devtools connection
                // https://bugzilla.mozilla.org/show_bug.cgi?id=1864284 prevents this from working in Firefox
                ? `script-src 'self' http://localhost:${port} http://localhost:8099`
                : "script-src 'self'" // default FF 106 & Chrome 111
        },
        commands: {
            "_execute_action": {
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
        "browser_specific_settings": {
            "gecko": {
                "id": "keefox@chris.tomlinson",
                "update_url": "https://raw.githubusercontent.com/kee-org/browser-addon-updates/master/beta/update.json",
                "strict_min_version": "125.0" //TODO: change to 126
            }
        },
        minimum_chrome_version: "123"
    };

    if (!isBeta) {
        delete manifest.browser_specific_settings.gecko.update_url;
    } else {
        manifest.version_name += " beta";
    }

    if (isChrome) {
        // still necessary to remove this in 2024 to avoid warning noise
        delete manifest.browser_specific_settings;

        // required in Chromium until bug 40252021/40738001 is fixed. Prohibited in Firefox
        manifest.permissions?.push("offscreen");
    } else {
        delete manifest.version_name;
        (manifest as any).background = {
            scripts: ["dist/background/index.js"],
            type: "module"
        };
        (manifest as any).action.default_area = "navbar";
    }

    //TODO:f: test if below is possible on Firefox
    // impossible unless https://bugs.chromium.org/p/chromium/issues/detail?id=1198822 is resolved.
    // Until then, all changes to content scripts require a manual browser reload and content page reload.
    // if (isDev) {
    //     // for content script, as browsers will cache them for each reload,
    //     // we use a background script to always inject the latest version
    //     // see src/background/contentScriptHMR.ts
    //     delete manifest.content_scripts;
    //     //manifest.permissions?.push("webNavigation");
    // }

    return manifest;
}
