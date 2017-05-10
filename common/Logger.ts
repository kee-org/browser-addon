/*
  There are four cumulative log levels.

  Off = 0
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
class KeeFoxLogger {
    constructor (config: {logLevel: number, logSensitiveData: boolean})
    {
        this.config = config;
        this.configureFromPreferences();

        this.info("Logging system initialised at " + Date());
        if (this.logSensitiveData)
            this.warn("WARNING: KeeFox Sensitive logging ENABLED. See: https://github.com/luckyrat/KeeFox/wiki/en-|-Options-|-Logging-|-Sensitive");
    }

    levelError: boolean;
    levelWarn: boolean;
    levelInfo: boolean;
    levelDebug: boolean;
    methodConsole: boolean;
    logSensitiveData: boolean;
    config: {logLevel: number, logSensitiveData: boolean};

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

            if (!this.logSensitiveData && message.length <= 0)
                return "";
            if (this.logSensitiveData)
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
    };

    debug (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.levelDebug)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.debug(message);
        }
    };

    info (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.levelInfo)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.info(message);
        }
    };

    warn (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.levelWarn)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.warn(message);
        }
    };

    error (data: LogMessage | string, sensitiveMessage = "", replace = false)
    {
        if (typeof data == "string")
            data = { m: data, sm: sensitiveMessage, r: replace };

        if (this.levelError)
        {
            const message = this.getMessage(data);
            if (message.length > 0) console.error(message);
        }
    };

    //TODO:c:security call this also (in all pages + background) when settings are changed
    configureFromPreferences ()
    {
        const prefLevel = this.config.logLevel;
        this.levelDebug = false;
        this.levelInfo = false;
        this.levelWarn = false;
        this.levelError = false;

        switch (prefLevel)
        {
            case 4: this.levelDebug = true;
            case 3: this.levelInfo = true;
            case 2: this.levelWarn = true;
            case 1: this.levelError = true;
        }

        this.logSensitiveData = this.config.logSensitiveData;
    };

};

// Logging before we have been able to get the current configuration from the background process has to follow some fixed default configuration
//TODO:c: before release, reduce default to Warn
let KeeFoxLog = new KeeFoxLogger({logLevel: 4, logSensitiveData: false});
