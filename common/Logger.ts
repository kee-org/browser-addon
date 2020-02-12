/*
  There are four cumulative log levels.

  Error = 1
  Warn = 2
  Info = 3
  Debug = 4

  The default level (Warn) will be set as part of the installation process.

  If Debug level is selected, a PersistentLogger object in the background
  process will store the log entries in localStorage on a regular basis. But
  only if you edit the code to enable this feature because it is very resource-hungry

*/

export class KeeLogger {
    private outputStarted = false;
    private config = {logLevel: 2};

    attachConfig (config: {logLevel: number}) {
        this.debug("Logging system config updated at " + Date());
        this.config = config;
    }

    private formatMessage (message)
    {
        if (!message)
            return "";

        if (!this.outputStarted) {
            message = "* " + message;
            this.outputStarted = true;
        }

        return message;
    }

    debug (message: string)
    {
        if (this.config.logLevel >= 4)
        {
            message = this.formatMessage(message);
            if (message.length > 0) {
                console.debug(message);
                this.config.logLevel >= 4 && this.send(4, message);
            }
        }
    }

    info (message: string)
    {
        if (this.config.logLevel >= 3)
        {
            message = this.formatMessage(message);
            if (message.length > 0) {
                console.info(message);
                this.config.logLevel >= 4 && this.send(3, message);
            }
        }
    }

    warn (message: string)
    {
        if (this.config.logLevel >= 2)
        {
            message = this.formatMessage(message);
            if (message.length > 0) {
                console.warn(message);
                this.config.logLevel >= 4 && this.send(2, message);
            }
        }
    }

    error (message: string)
    {
        if (this.config.logLevel >= 1)
        {
            message = this.formatMessage(message);
            if (message.length > 0) {
                console.error(message);
                this.config.logLevel >= 4 && this.send(1, message);
            }
        }
    }

    send (logLevel: 1|2|3|4, message: string) {
        // Do nothing.
        // For advanced debugging, especially across browser restarts,
        // enable the code below and the relevant PersistentLogger lines
        // in background.ts
        // const logEntry = {logLevel, timestamp: Date.now(), message};
        // if (window.KeePersistentLogger) {
        //     // Will only be true in the background process
        //     window.KeePersistentLogger.emit(logEntry);
        // } else {
        //     browser.runtime.sendMessage(logEntry);
        // }
    }

    stackTrace () {
        console.groupCollapsed("%c Stack Trace", "color:cream; font-style: normal;");
        console.debug(new Error().stack);
        console.groupEnd();
    }

}

export const KeeLog = new KeeLogger();
