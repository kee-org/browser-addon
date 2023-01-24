export class PersistentLogger {
    private _interval: number;
    private entries = [];
    private enabled = true;

    constructor() {
        browser.runtime.onMessage.addListener(message => {
            this.emit(message);
        });
    }

    init(enabled: boolean) {
        this.enabled = enabled;
        if (enabled) {
            this._interval = window.setInterval(async () => {
                if (this.entries.length) {
                    const newLogs = this.entries.slice();
                    let currentLogs = [];
                    this.entries = [];
                    const result = await browser.storage.local.get("logs");
                    if (result && result["logs"] && result["logs"].length > 0) {
                        currentLogs = result["logs"];
                    }
                    currentLogs = currentLogs.concat(newLogs);
                    const preTrimTotal = currentLogs.length;
                    currentLogs = currentLogs.slice(-5000);
                    await browser.storage.local.set({ logs: currentLogs });
                    console.log(
                        `${newLogs.length} new (${currentLogs.length} total) logs flushed. ${
                            preTrimTotal - currentLogs.length
                        } logs expired.`
                    );
                } else {
                    console.log("0 logs flushed");
                }
            }, 5000);
        } else {
            this.entries = [];
        }
    }

    emit(logEntry) {
        if (this.enabled) {
            this.entries.push(logEntry);
        }
    }
}
