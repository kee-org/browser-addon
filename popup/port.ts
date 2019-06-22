export let myPort: browser.runtime.Port;

export const portMixin = {
    methods: {
        postMessage: function (msg) {
            myPort.postMessage(msg);
        }
    }
};

export function startupPort (name: string) {
    myPort = browser.runtime.connect({ name });
}

export function shutdownPort () {
    myPort = null;
}
