# Simple and secure password management

## Kee adds free, secure and easy to use password management features to your web browser which save you time and keep your private data more secure.

**Login automatically, never forget another password, stay in control of your passwords and improve their security. Powered by the world-renowned KeePass Password Safe.**

Kee is a Firefox and Chrome add-on for linking browsers to KeePass, using the [KeePassRPC KeePass plugin](https://github.com/kee-org/keepassrpc).

Official website with download instructions: https://www.kee.pm

Support forum: https://forum.kee.pm

# Build

## Requirements

* node
* npm or yarn
* a web browser and KeePass 2.x

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
