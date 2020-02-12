export default function install (Vue) {
    Vue.prototype.$i18n = browser.i18n.getMessage;
}
