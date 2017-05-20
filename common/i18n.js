[].forEach.call(document.querySelectorAll('[data-i18n]'), function(el) {
    el.innerHTML = $STR(el.getAttribute('data-i18n'));
  });
