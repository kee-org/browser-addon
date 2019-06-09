
//TODO: stub postMessage so Vue actions can still complete before this port is connected (unlikely to happen but might)
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
