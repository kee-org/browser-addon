async function sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export function fetchFavicon(url): Promise<string> {
    return new Promise(function (resolve, reject) {
        if (!url) {
            resolve(undefined);
            return;
        }
        const img = new Image();
        img.onload = function (this: HTMLImageElement) {
            const canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0);
            const dataURL = canvas.toDataURL("image/png");
            resolve(dataURL.substr(22));
        };
        img.src = url;
    });
}

export async function getFaviconUrl() {
    for (let i = 0; i < 45; i++) {
        const tab = (await browser.tabs.query({ active: true, currentWindow: true }))[0];
        if (tab) {
            return tab.favIconUrl;
        }
        sleep(1000);
    }
}
