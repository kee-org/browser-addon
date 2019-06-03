export function fetchFavicon (url): Promise<string> {
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
            resolve(dataURL);
        };
        img.src = url;
    });
}
