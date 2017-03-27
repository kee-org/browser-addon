WebExtensions (Mozilla Firefox) / Google Chrome (Chromium) browsers add-on for linking browsers to the KeePassRPC KeePass plugin.

Build requirements:

* node
* npm or yarn
* the usual hundreds of node modules installed by the above

It's all set up for Visual Studio Code but it shouldn't be too hard to work out how to build it using other IDEs.

It's not well tested but you should be able to just clone the repo and `npm install` followed by `gulp watch` and then load the root folder as an unpacked extension in Chrome.

In future we can enhance the build process to automate other things like packaging releases for different browsers but we're a long way from having a releasable version yet anyway.
