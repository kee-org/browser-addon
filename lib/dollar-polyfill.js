function $ (selector, el) {
     if (!el) {el = document;}
     return el.querySelector(selector);
}
function $$ (selector, el) {
     if (!el) {el = document;}
     return el.querySelectorAll(selector);
}

function $STR (str) {
    let msg = browser.i18n.getMessage(str);
    return msg || str;
}

function $STRF (str, subs) {
    let msg = browser.i18n.getMessage(str, subs);
    return msg || str;
}
