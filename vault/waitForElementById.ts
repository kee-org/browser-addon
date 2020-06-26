export function waitForElementById(id) {
    return new Promise(function (resolve, reject) {
        let element = document.getElementById(id);
        if (element) {
            resolve(element);
            return;
        }
        const observer = new MutationObserver(function () {
            // ignore the actual mutations - scanning the whole DOM
            // should be much faster and is definitely much simpler
            element = document.getElementById(id);
            if (element) {
                observer.disconnect();
                resolve(element);
                return;
            }
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}
