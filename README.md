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
1. `gulp build`
1. Development / Beta build:
   1. `gulp package:beta`
   1. then load the `build` folder as an unpacked extension in Chrome or Firefox. 
   1. XPIs and ZIPs of each version including source maps are put into the `dist` folder
1. Release build
   1. `gulp package`
   1. XPIs and ZIPs of each version are put into the `dist` folder

`gulp watch` may also work but is untested and the relatively slow build times might make it more of a hindrence than help but give it a try if you're interested.

In future we can enhance the build process to automate other things like packaging releases for different browsers.
