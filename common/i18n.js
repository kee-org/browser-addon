[].forEach.call(document.querySelectorAll('[data-i18n]'), function(el) {
    el.textContent = $STR(el.getAttribute('data-i18n'));
  });
