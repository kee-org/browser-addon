/*
  There are four cumulative log levels.

  Error = 1
  Warn = 2
  Info = 3
  Debug = 4

  The default level (Warn) will be set as part of the installation process.
*/

// constructor
class KeeLogger {
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
            if (message.length > 0) console.debug(message);
        }
    }

    info (message: string)
    {
        if (this.config.logLevel >= 3)
        {
            message = this.formatMessage(message);
            if (message.length > 0) console.info(message);
        }
    }

    warn (message: string)
    {
        if (this.config.logLevel >= 2)
        {
            message = this.formatMessage(message);
            if (message.length > 0) console.warn(message);
        }
    }

    error (message: string)
    {
        if (this.config.logLevel >= 1)
        {
            message = this.formatMessage(message);
            if (message.length > 0) console.error(message);
        }
    }

    stackTrace () {
        console.groupCollapsed("%c Stack Trace", "color:cream; font-style: normal;");
        console.debug(new Error().stack);
        console.groupEnd();
    }

}

let KeeLog = new KeeLogger();
