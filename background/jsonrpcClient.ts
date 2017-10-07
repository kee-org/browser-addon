/*
jsonrpcClient provides a JSON-RPC client and method proxies for
communication between Kee and a KeePassRPC server.
*/

/// <reference path="kprpcClient.ts" />

class jsonrpcClient {
    private kprpcClient: kprpcClient;

    constructor () {
        this.kprpcClient = new kprpcClient();
    }

    startup () {
        this.kprpcClient.startup();
    }

    //***************************************
    // Functions below can be thought of as proxies to the RPC
    // methods exposed in the KeePassRPC server.
    // See KeePassRPCService.cs for more detail
    //***************************************

    launchGroupEditor (uniqueID, dbFileName)
    {
        // fire and forget
        this.kprpcClient.request(this, "LaunchGroupEditor", [uniqueID, dbFileName], null, ++this.kprpcClient.requestId);
        return;
    }

    launchLoginEditor (uniqueID, dbFileName)
    {
        // fire and forget
        this.kprpcClient.request(this, "LaunchLoginEditor", [uniqueID, dbFileName], null, ++this.kprpcClient.requestId);
        return;
    }

    changeDB (fileName, closeCurrent)
    {
        // fire and forget
        this.kprpcClient.request(this, "ChangeDatabase", [fileName, closeCurrent], null, ++this.kprpcClient.requestId);
        return;
    }

    changeLocation (locationId)
    {
        // fire and forget
        this.kprpcClient.request(this, "ChangeLocation", [locationId], null, ++this.kprpcClient.requestId);
        return;
    }

    getMRUdatabases ()
    {
        this.kprpcClient.request(this, "GetCurrentKFConfig", null, function rpc_callback (resultWrapper) {
            if ("result" in resultWrapper && resultWrapper.result !== false)
            {
                // if (resultWrapper.result !== null)
                //     kee_win.mainUI.setMRUdatabasesCallback(resultWrapper.result);

            }
        }, ++this.kprpcClient.requestId);
    }

    addLogin (login, parentUUID, dbFileName)
    {
        const jslogin = login.asEntry();
        // fire and forget
        this.kprpcClient.request(this, "AddLogin", [jslogin, parentUUID, dbFileName], null, ++this.kprpcClient.requestId);
        return;
    }

    updateLogin (login, oldLoginUUID, urlMergeMode, dbFileName) {
        const jslogin = login.asEntry();
        // fire and forget
        this.kprpcClient.request(this, "UpdateLogin", [jslogin, oldLoginUUID, urlMergeMode, dbFileName], null, ++this.kprpcClient.requestId);
        return;
    }

    findLogins (fullURL: string, formSubmitURL, httpRealm, uniqueID, dbFileName, freeText, username, callback, callbackData)
    {
        // returns ID of async JSON-RPC request so calling functions can track if desired
        let lst = "LSTall";
        if (httpRealm == undefined || httpRealm == null || httpRealm == "")
            lst = "LSTnoRealms";
        else if (formSubmitURL == undefined || formSubmitURL == null || formSubmitURL == "")
            lst = "LSTnoForms";

        if (dbFileName == undefined || dbFileName == null || dbFileName == "")
        {
            if (!configManager.current.searchAllOpenDBs)
                dbFileName = kee.appState.KeePassDatabases[kee.appState.ActiveKeePassDatabaseIndex].fileName;
            else
                dbFileName = "";
        }

        const urls = [];
        urls.push(fullURL);

        // Google treat youtube.com and google.com as the same property when authenticating
        if (fullURL.search(/$https\:\/\/accounts\.youtube\.com\/?/) >= 0)
            urls.push("https://accounts.google.com");

        const newId = ++this.kprpcClient.requestId;
        // slight chance IDs may be sent out of order but at least this way
        // they are consistent for any given request/response cycle
        this.kprpcClient.request(this, "FindLogins", [urls, formSubmitURL, httpRealm, lst, false, uniqueID, dbFileName, freeText, username], callback, newId, callbackData);
        return newId;
    }

    getAllDatabases ()
    {
        const result = this.kprpcClient.request(this, "GetAllDatabases", null, function rpc_callback (resultWrapper) {
            if ("result" in resultWrapper && resultWrapper.result !== false)
            {
                if (resultWrapper.result !== null)
                    kee.updateKeePassDatabases(resultWrapper.result);
            }
        }, ++this.kprpcClient.requestId);
        return;
    }

    getApplicationMetadata ()
    {
        const result = this.kprpcClient.request(this, "GetApplicationMetadata", null, function rpc_callback (resultWrapper) {
            if ("result" in resultWrapper && resultWrapper.result !== false)
            {
                if (resultWrapper.result !== null)
                {
                    let netRuntimeVersion = "";
                    if (resultWrapper.result.isMono)
                        netRuntimeVersion = "Mono " + resultWrapper.result.monoVersion;
                    else
                        netRuntimeVersion = ".NET " + resultWrapper.result.nETversion;
                }

            }
        }, ++this.kprpcClient.requestId);

        return;
    }

    getPasswordProfiles (callback) {
        const result = this.kprpcClient.request(this, "GetPasswordProfiles", null, function rpc_callback (resultWrapper) {
            if ("result" in resultWrapper && resultWrapper.result !== false) {
                if (resultWrapper.result !== null)
                    callback(resultWrapper.result);
            }
        }, ++this.kprpcClient.requestId);

        return;
    }

    generatePassword (profileName, url, callback)
    {
        this.kprpcClient.request(this, "GeneratePassword", [profileName, url], function rpc_callback (resultWrapper) {
            if ("result" in resultWrapper && resultWrapper.result !== false) {
                if (resultWrapper.result !== null)
                    callback(resultWrapper.result);
            }
        }, ++this.kprpcClient.requestId);
    }
}
