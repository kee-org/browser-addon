/*
  There are four cumulative log levels.

  Error = 1
  Warn = 2
  Info = 3
  Debug = 4

  The default level (Warn) will be set as part of the installation process.
*/

interface LogMessage {
    m: string;
    sm: string;
    r: boolean;
}

// constructor
class KeeLogger {
    constructor ()
    {
        this.config = {logLevel: 4, logSensitiveData: false};
        this.debug("Logging system initialised at " + Date());
        this.config = {logLevel: 2, logSensitiveData: false};
        if (this.config.logSensitiveData)
            this.warn("WARNING: Kee Sensitive logging ENABLED. See: https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive");
    }

    config: {logLevel: number, logSensitiveData: boolean};


    attachConfig (config: {logLevel: number, logSensitiveData: boolean}) {
        this.debug("Logging system config updated at " + Date());
        this.config = config;
        if (config.logSensitiveData)
            this.warn("WARNING: Kee Sensitive logging ENABLED. See: https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive");
    }

    private getMessage (data)
    {
        if (!data)
            return "";

        if (typeof data == "string")
        {
            return data;
        }
        else
        {
            const message = data.m;
            const sensitiveMessage = data.sm;
            const replace = data.r;

            if (!message)
                return data;

            if (!this.config.logSensitiveData && message.length <= 0)
                return "";
            if (this.config.logSensitiveData)
            {
                if (replace)
                    return "!! " + sensitiveMessage;
                else
                    return "!! " + message + sensitiveMessage;
            } else
            {
                return message;
            }
        }
    }

    debug (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.config.logLevel >= 4)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.debug(message);
        }
    }

    info (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.config.logLevel >= 3)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.info(message);
        }
    }

    warn (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.config.logLevel >= 2)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.warn(message);
        }
    }

    error (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.config.logLevel >= 1)
        {
            const message = this.getMessage(data);
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
