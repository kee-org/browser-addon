// Make punycode available and tidy up after moduleHack.js

window.punycode = module.exports;
module = undefined;
