# Simple and secure password management

## Kee automatically fills login forms to save you time and protect you from security risks.

Kee is a free Firefox and Chrome add-on for linking browsers to [Kee Vault](https://keevault.pm) or KeePass (latter requires using the [KeePassRPC KeePass plugin](https://github.com/kee-org/keepassrpc)).

Official website with sign-up and download links: https://www.kee.pm

Support forum: https://forum.kee.pm

# Build

**Warning:** An urgent request from Mozilla in January 2023 has, through a complex web of old dependencies, forced a significant restructure of the build system and some production code. Only Firefox is supported at this time so Chrome users will remain on version 3.9 until the new architecture can be finalised and tested for other browsers. You're not missing a lot but we'll try to get this discrepancy resolved soon.

## Requirements

* node (16 should work but only tested with 18)
* a node package manager (tested with npm 8 and 9)
* a web browser (tested with Firefox 109)
* a Supporter's subscription to [Kee Vault](https://keevault.pm) OR KeePass 2.x (+ .NET/Mono) + KeePassRPC.plgx

It's set up for Visual Studio Code but it shouldn't be too hard to work out how to develop using other IDEs.

## Instructions

1. clone the repo
1. `npm ci` (or `npm install` to get any newer library dependencies than those we used in official builds)
1. Development:
   1. Open two terminals/consoles
      1. In the 1st: `npm run dev`
      1. In the 2nd: `npm run start:firefox`
   1. the task in the 1st terminal will recompile and reload necessary parts of the addon each time you change a file but in some circumstances you'll need to press 'r' in the 2nd terminal to force a complete reload.
1. Preparing for release or Pull Request:
   1. `npm run tsc` to verify that no type errors have been introduced during recent development changes
   1. `npm run lint`

You may need to modify the vite config files or some of the build scripts if you add significant new sections to the WebExtension structure but it's unlikely and we can help you with that if necessary.

## Reproducing a build

### Introduction

Exactly reproducing the files delivered from the Firefox add-on website or Chrome extension store is not possible because the websites modify the file that we build in order to attach a digital signature. One can get very close though, to the point where a diff of the files from a given release on GitHub varies from your own local build in only three ways:

1. Line endings - some parts of the tool chain may treat line endings differently so that the end result could differ between operating systems.
2. Version number - the CI build system holds credentials that allow it to manipulate git tags on the GitHub repository and in doing so allows for automatic incrementing of build numbers, which in turn will result in a unique version number being calculated. This can only be reproduced if you download the git repo to your local system (including all tags) and develop a custom build script or modify the source files as needed - it's most likely not worth the effort but can be done if it is important to you.
3. File dates - the build output is essentially a zip file so when the newly downloaded and built files on your system are added to the zip file, they will have different dates than those that were built on the CI platform and automatically added to a GitHub Release. For this reason, even if you were to end up with the same line endings and version number, it is not possible to compare a digest (hash) of your built file and expect it to match the file built by anyone else (unless you build it at exactly the same time!)

### Requirements

Reproducible builds rely upon npm version 7 or higher.

Our builds are created by GitHub Actions using the following configuration:

* Ubuntu 22.04
* Node 18
* npm 8

### Instructions

1. download the source code (e.g. from the relevant GitHub Release page) or clone the repo for the latest (often pre-release) version
1. `npm ci && mkdir dist`
1. manipulate package.json if you want to adjust version numbers
1. `npm run build:prod && npm run pack:prod` (for stable releases) and/or `npm run build:beta && npm run pack:beta` (for beta releases) 
   * XPIs and ZIPs of each version are put into the `dist` folder

## Repo/project structure

* `/_locales` Localisation data (language translations).
* `.tx` Used by Transifex localisation scripts to help manage multiple language translation.
* `dist` Output folder for build packages (e.g. an XPI file for installation in Firefox). Created automatically by development scripts or manually if you're only building for packaging/release.
* `extension` Output folder for compiled files when developing or building for packaging/release.
* `lib` Javascript files that are directly included in the resulting extension, undergoing no further adjustment or compilation.
* `scripts` The scripts within help prepare the `extension` file structure for hot module reloading during development, as well as ensuring that various categories of files end up in the right place, with appropriate references updated.
* `src` 
   * `manifest.ts` Outputs a manifest.json file appropriate to the current build / development environment.
   * `background` Extension's main background process script.
   * `common` Modules that are used across multiple extension scopes (e.g. background script, popup script, content script, etc.) 
   * `dialogs` Standalone dialogs within the extension context (e.g. for the Network Authentication window).
   * `page` The content page script that gets injected to every web page that is not Kee Vault.
   * `panels` Small pages that are rendered as in-page panels, within an iframe, within any web page.
   * `popup` The main browser popup that clicking on the browser toolbar button will display.
   * `release-notes` Pages that are shown after an extension update or installation has occurred.
   * `settings` Page to allow user to adjust many extension settings.
   * `store` The Pinia Store definitions that are used for both Vue/Vuetify UI state storage and for automated data transfer across multiple extension execution scopes (popup, settings page, background, in-page panels, etc.)
   * `vault` The content page script that gets injected to the Kee Vault website.

## Vue devtools

It's likely that the below does not work. It might though, at least on one or two devices in the world when the stars are aligned.

We'll take a fresh look at this challenge when working on the migration to MV3.

### One time:
````
npm install -g @vue/devtools
npm install -g https-proxy-cli
````

### Each time:

`https-proxy -t http://localhost:8098 -p 8099 --keys <folder to store and re-access self-signed certs> &`
`vue-devtools`

### First time:

sudo apt-get install libnss3-tools
Manually load https://localhost:8099 in the browser, add self-signed cert to whitelist and export the cert to a local file (or just use the generated keys folder location above... not sure if that will work or not).
`certutil -d sql:$HOME/.pki/nssdb -A -t "P,," -n <path to saved cert> -i <path to saved cert>`
restart Chrome

