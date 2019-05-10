class KeeVaultLaunchChecker {

    // 404 until we have fixed a time
    private checkDataURL = "https://www.kee.pm/kee-vault-launch-config.json";

    private timer;

    constructor () {
        if (Date.now() > 1564652440000) {
            // Do nothing after August - definitely will either have
            // launched by then or can update this cut off point
            return;
        }
        // Initial check shortly after browser has started up
        this.timer = setTimeout(() => this.checkForConfig(), 30000);
    }

    private async checkForConfig () {
        clearTimeout(this.timer);
        try {
            const result = await fetch(this.checkDataURL);
            if (result && result.ok) {
                const config = await result.json();
                if (config && config.start && config.end) {
                    configManager.current.keeVaultLaunchStart = config.start;
                    configManager.current.keeVaultLaunchEnd = config.end;
                    configManager.save();
                }
            }
        } catch (e) {
            KeeLog.debug("Config check attempt failed. Maybe user is offline?");
        }

        // Only once an hour after browser is running
        this.timer = setTimeout(() => this.checkForConfig(), 3600000);
    }
}
