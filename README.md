# Simple and secure password management

## Kee automatically fills login forms to save you time and protect you from security risks.

Kee is a free Firefox and Chrome add-on for linking browsers to [Kee Vault](https://keevault.pm) or KeePass (latter requires using the [KeePassRPC KeePass plugin](https://github.com/kee-org/keepassrpc)).

Official website with sign-up and download links: https://www.kee.pm

Support forum: https://forum.kee.pm

# Build

## Requirements

* node
* npm or yarn
* a web browser
* a Supporter's subscription to [Kee Vault](https://keevault.pm) OR KeePass 2.x (+ .NET/Mono)

It's all set up for Visual Studio Code but it shouldn't be too hard to work out how to develop using other IDEs.

## Instructions

1. clone the repo
1. `npm install`
1. Development:
   1. `npm start`
   1. then load the relevant folder into your development browser
      1. Chrome:
         1. chrome://extensions/
         1. Load unpacked extension...
         1. `'build/debug/chrome/'`
      1. Firefox:
         1. about:debugging#addons
         1. Load temporary add-on
         1. `'build/debug/firefox/'`
   1. Make your changes to the source code; the file watcher will recompile necessary parts of the addon
   1. When you're ready to test your changes, reload the extension/addon from the browser interface (this is only necessary sometimes; a lot of changes will apply automatically but it may not be obvious when a reload operation is required so play it safe until you understand the add-on architecture)
   1. NB: source maps are included only in the debug folders
1. Packaging for distribution
   1. Historically this has been done manually but we think that TravisCI should now handle this for us
   1. Manipulate manifest.json as required
   1. `npm run package:debug` and/or `npm run package:prod`
   1. XPIs and ZIPs of each version are put into the `dist` folder
   1. NB: source maps are included only in the debug package

`gulp` comes with various other tasks but you shouldn't need to worry about those unless you are adding new modules/folders to the addon.

## Reproducing a build

Exactly reproducing the files delivered from the Firefox add-on website or Chrome extension store is not possible because the websites modify the file that we build in order to attach a digital signature. One can get very close though, to the point where a diff of the files from a given release on GitHub varies from your own local build in only three ways:

1. Line endings - some parts of the tool chain may treat line endings differently so that the end result could differ between operating systems.
2. Version number - the CI build system holds credentials that allow it to manipulate git tags on the GitHub repository and in doing so allows for automatic incrementing of build numbers, which in turn will result in a unique version number being calculated. This can only be reproduced if you download the git repo to your local system (including all tags) and develop a custom build script or modify the source files as needed - it's most likely not worth the effort but can be done if it is important to you.
3. File dates - the build output is essentially a zip file so when the newly downloaded and built files on your system are added to the zip file, they will have different dates than those that were built on the CI platform and automatically added to a GitHub Release. For this reason, even if you were to end up with the same line endings and version number, it is not possible to compare a digest (hash) of your built file and expect it to match the file built by anyone else (unless you build it at exactly the same time!)

Reproducible builds rely upon npm version 5.7 or higher (released end of Feb 2018) so ensure you have the latest update first.

You can then:

1. download the source code (e.g. from the relevant GitHub Release page) or clone the repo for the latest (often pre-release) version
1. `npm ci`
1. manipulate manifest.json if you want to adjust version numbers
1. `npm run package:debug` (for beta releases) and/or `npm run package:prod` (for stable releases)
   1. XPIs and ZIPs of each version are put into the `dist` folder
   1. NB: source maps are included only in the debug package


## Vue devtools

### One time:
````
npm install -g @vue/devtools
npm install -g https-proxy-cli
````

### Each time:

`https-proxy -t http://localhost:8098 -p 8099`

### First time:

Manually load https://localhost:8099 in the browser and add self-signed cert to whitelist.
