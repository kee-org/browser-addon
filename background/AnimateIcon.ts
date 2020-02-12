import { KeeLog } from "../common/Logger";

export class AnimateIcon {

    private timer: number = null;
    private timeStarted: number;
    private duration: number;
    private cache: ImageData[] = [];
    private loadingImage= false;

    public start (duration: number, smooth: boolean) {
        if (this.loadingImage) {
            return;
        }
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
        const interval = smooth ? 17 : 100; // 59fps / 10fps
        this.timeStarted = Date.now();
        this.duration = smooth ? duration : 1600;
        if (!smooth) {
            this.timer = setInterval(() => this.drawLowFramerate(), interval);
            return;
        }
        if (this.cache.length > 0) {
            // Note: requestAnimationFrame doesn't work in background pages!
            this.timer = setInterval(() => this.draw(), interval);
            return;
        } else {
            const canvas = document.createElement("canvas");
            canvas.height = this.IMG_SIZE;
            canvas.width = this.IMG_SIZE;
            const context = canvas.getContext("2d");
            const img = document.createElement("img");
            img.addEventListener("load", e => {
                // Potentially could render the first frame earlier while we prep the rest, if
                // there is actually ever an unacceptable delay in starting the animation
                this.buildCache(context, img);
                // Note: requestAnimationFrame doesn't work in background pages!
                this.timer = setInterval(() => this.draw(), interval);
                this.loadingImage = false;
            });
            this.loadingImage = true;
            img.src = this.KEE_ICON_48;
        }
    }

    private buildCache (context: CanvasRenderingContext2D, img: HTMLImageElement) {
        const start = Date.now();
        const HALF_IMG_SIZE = this.IMG_SIZE/2;
        for (let i=0; i <= this.IMG_SIZE; i++) {
            context.clearRect(0, 0, this.IMG_SIZE, this.IMG_SIZE);

            const radius = 13*this.IMG_SIZE/16 - i/2;
            const gradient = context.createRadialGradient(HALF_IMG_SIZE, HALF_IMG_SIZE, HALF_IMG_SIZE/8, HALF_IMG_SIZE, HALF_IMG_SIZE, radius);
            gradient.addColorStop(0, "rgb(255, 255, 165, 1)");
            gradient.addColorStop(.6, "rgb(255, 255, 0, 1)");
            gradient.addColorStop(1, "rgb(255, 255, 165, 0)");
            context.fillStyle = gradient;
            context.fillRect(0, 0, 48, 48);

            const left = HALF_IMG_SIZE - i/2;
            context.drawImage(img, left, 0, i, this.IMG_SIZE);
            const imageData = context.getImageData(0, 0, this.IMG_SIZE, this.IMG_SIZE);
            this.cache[i] = imageData;
        }
        KeeLog.debug("Animated icon cache build time: " + (Date.now() - start));
    }

    private drawLowFramerate () {
        const timeElapsed = Date.now() - this.timeStarted;
        if (timeElapsed > this.duration) {
            clearInterval(this.timer);
            this.timer = null;
            browser.browserAction.setIcon({path: "common/images/48.png" });
            return;
        }
        const cycleProgress = timeElapsed / this.duration;
        if ((cycleProgress * 16) % 4 < 2) {
            browser.browserAction.setIcon({path: "common/images/highlight-48.png" });
        } else {
            browser.browserAction.setIcon({path: "common/images/48.png" });
        }
    }

    private draw () {
        const timeElapsed = Date.now() - this.timeStarted;
        if (timeElapsed > this.duration) {
            clearInterval(this.timer);
            this.timer = null;
            browser.browserAction.setIcon({path: "common/images/48.png" });
            return;
        }
        const cycleProgress = timeElapsed / this.duration;
        const width = Math.abs(this.IMG_SIZE*Math.cos(Math.PI*2*cycleProgress));
        const imageData = this.cache[Math.round(width)];
        browser.browserAction.setIcon({
            imageData: imageData
        });
    }

    // eslint-disable-next-line max-len
    readonly KEE_ICON_48 = "data:image/png;base64,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";
    readonly IMG_SIZE = 48;
}
