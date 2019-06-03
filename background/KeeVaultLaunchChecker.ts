export class KeeVaultLaunchChecker {

    // 404 until we have fixed a time
    private checkDataURL = "https://www.kee.pm/kee-vault-launch-config.json";

    private timer;

    // Only every 4 hours after browser is running
    // Unless end date has already passed in which case we will do once per
    // day, just in case we have to reschedule at the last minute
    private checkEvery = 14400000;

    constructor () {
        const now = Date.now();

        if (now > 1564652440000) {
            // Do nothing after August - definitely will either have
            // launched by then or can update this cut off point
            return;
        }
        if (configManager.current.keeVaultLaunchMessageDismissed) return;

        if (configManager.current.keeVaultLaunchEnd != null && configManager.current.keeVaultLaunchEnd < now) {
            this.checkEvery = 86400000;
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


        this.timer = setTimeout(() => this.checkForConfig(), this.checkEvery);
    }
}
