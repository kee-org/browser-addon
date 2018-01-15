Thanks for considering contributing code improvements to Kee!

To ensure your Pull Request can be approved successfully and quickly, make sure you have read https://github.com/kee-org/browser-addon/blob/master/CONTRIBUTING.md first and then the following list of further guidelines:

* Do not change any localisation files except for the source (English). `_locales/en/messages.json` should be changed as needed, but no other files in the `_locales` folder.
* Follow the style configuration in the `.editorconfig` file. Most modern editors will automatically do this for you. Some, but not all, of this configuration can be enforced by tslint at build time.
* Look at the result of the TravisCI build which will run after you create the PR and address any errors that cause the check to fail.
