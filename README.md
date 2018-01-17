WebExtensions (Mozilla Firefox) / Google Chrome (Chromium) add-on for linking browsers to the KeePassRPC KeePass plugin.

Official website with download instructions: https://www.kee.pm

Support forum: https://forum.kee.pm

# Build instructions

## Requirements

* node
* npm or yarn
* the usual hundreds of node modules installed by the above

It's all set up for Visual Studio Code but it shouldn't be too hard to work out how to develop using other IDEs.

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
