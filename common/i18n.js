function $STR (str) {
    let msg = chrome.i18n.getMessage(str);
    return msg || str;
}

[].forEach.call(document.querySelectorAll('[data-i18n]'), function(el) {
    el.innerHTML = $STR(el.getAttribute('data-i18n'));
  });

