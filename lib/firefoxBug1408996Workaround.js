// https://bugzilla.mozilla.org/show_bug.cgi?id=1408996

// We have to cache various libraries because Firefox can randomly remove them from the window object.

// This workaround can be removed once Firefox 68 ESR is our minimum supported version

let __punycode = punycode || window.punycode;
let __publicSuffixList = publicSuffixList || window.publicSuffixList;
let __pslData = pslData || window.pslData;
