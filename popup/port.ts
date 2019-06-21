export let myPort: browser.runtime.Port;

export const portMixin = {
    methods: {
        postMessage: function (msg) {
            myPort.postMessage(msg);
        }
    }
};

export function startupPort () {
    myPort = browser.runtime.connect({ name: "browserPopup" });
}
