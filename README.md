WebExtensions (Mozilla Firefox) / Google Chrome (Chromium) add-on for linking browsers to the KeePassRPC KeePass plugin.

Official website with download instructions: https://www.kee.pm

Support forum: https://forum.kee.pm

Build requirements:

* node
* npm or yarn
* the usual hundreds of node modules installed by the above

It's all set up for Visual Studio Code but it shouldn't be too hard to work out how to build it using other IDEs.

It's not well tested but you should be able to just clone the repo and `npm install` followed by `gulp build; gulp package:beta` and then load the build folder as an unpacked extension in Chrome or Firefox. `gulp watch` may also work but is untested and the relatively slow build times might make it more of a hindrence than help but give it a try if you're interested.

In future we can enhance the build process to automate other things like packaging releases for different browsers.
