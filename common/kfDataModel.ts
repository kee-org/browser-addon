/*
  keeFoxLoginInfo:
  This was loosly based on the LoginInfo object that Mozilla provided with Firefox 3.0
  but it has been heavily modified to support some of the extra features
  that KeeFox can support compared to the built-in Firefox login manager.

  keeFoxLoginField:
  Represents an individual form field

  keeFoxFormFieldType:
  enumeration of form field type (e.g. text, checkbox, password, etc.)
*/

/// <reference path="uriUtils.ts" />

let keeFoxFormFieldType =
    {
        radio: "FFTradio",
        username: "FFTusername",
        text: "FFTtext",
        password: "FFTpassword",
        select: "FFTselect",
        checkbox: "FFTcheckbox"
    };

class keeFoxLoginInfo {

    // array of URL strings (normally just one is needed
    // but a given login can be associated with more than one site
    // or with multiple pages on that site)
    URLs: string[];

    // How accurate is the best URL match for this login (only set if login
    // was supplied in response to certain search requests). Higher = closer match
    matchAccuracy: number;

    // The "action" parameter of the form (for multi-page
    // logins, this is always the first page)
    //formActionURL;

    // The realm of a HTTP athentication request
    httpRealm: string;

    // The index of the otherField which we will treat as the username in KeePass
    usernameIndex: number;

    // array of kfLoginField objects representing all passwords
    // on this (potentially multi-page) form
    passwords: keeFoxLoginField[];

    // The KeePass entry's uniqueID (if known)
    uniqueID: string;

    // The title of the KeePass entry (auto-generated from the page title by default)
    title: string;

    // array of kfLoginField objects representing all non-passwords
    // on this (potentially multi-page) form
    otherFields: keeFoxLoginField[];

    // How relevant this login entry is to the current form in
    // the browser - transient (not stored in KeePass)
    relevanceScore: number;

    // The total number of pages the login entry will fill (usually 1; transient)
    maximumPage: number;

    // A base64 encoding of the icon for this entry. It will always be a
    // PNG when populated from KeePass but could be other formats when first
    // loading a favicon from a website. (Hopefully this will be an easy exception
    // to deal with but if not we can add a mime type field to this object too)
    iconImageData: string;

    parentGroup;

    priority: number;

    alwaysAutoFill: boolean;
    alwaysAutoSubmit: boolean;
    neverAutoFill: boolean;
    neverAutoSubmit: boolean;
    database;

    lowFieldMatchRatio: any;
    formIndex: number;
    loginIndex: number;
    frameKey: any;

    constructor () {
        this.alwaysAutoFill = false;
        this.alwaysAutoSubmit = false;
        this.neverAutoFill = false;
        this.neverAutoSubmit = false;
    }


    asJSONifiable () {
        return this.toJSON();
    }

    toJSON () {
        const intermediateObject: any = {};
        intermediateObject.URLs = this.URLs;
        intermediateObject.matchAccuracy = this.matchAccuracy;
        intermediateObject.httpRealm = this.httpRealm;
        intermediateObject.usernameIndex = this.usernameIndex;
        intermediateObject.passwords = this.passwords;
        intermediateObject.uniqueID = this.uniqueID;
        intermediateObject.title = this.title;
        intermediateObject.otherFields = this.otherFields; //this.otherFields.map(function(item) { return item.toJSONifiable(); });
        intermediateObject.relevanceScore = this.relevanceScore;
        intermediateObject.maximumPage = this.maximumPage;
        intermediateObject.iconImageData = this.iconImageData;
        intermediateObject.parentGroup = this.parentGroup;
        intermediateObject.priority = this.priority;
        intermediateObject.alwaysAutoFill = this.alwaysAutoFill;
        intermediateObject.alwaysAutoSubmit = this.alwaysAutoSubmit;
        intermediateObject.neverAutoFill = this.neverAutoFill;
        intermediateObject.neverAutoSubmit = this.neverAutoSubmit;
        intermediateObject.database = this.database;

        //var json = JSON.stringify(intermediateObject);
        return intermediateObject;
    }

    fromJSON (json) {
        const intermediateObject = JSON.parse(json);
        this.URLs = intermediateObject.URLs;
        this.matchAccuracy = intermediateObject.matchAccuracy;
        this.httpRealm = intermediateObject.httpRealm;
        this.usernameIndex = intermediateObject.usernameIndex;
        this.passwords = intermediateObject.passwords
            .filter(function (element, index, array) { return (element != null); })
            .map(function (item) { const newField = new keeFoxLoginField(); newField.fromJSONifiable(item); return newField; });
        this.uniqueID = intermediateObject.uniqueID;
        this.title = intermediateObject.title;
        this.otherFields = intermediateObject.otherFields
            .filter(function (element, index, array) { return (element != null); })
            .map(function (item) { const newField = new keeFoxLoginField(); newField.fromJSONifiable(item); return newField; });
        this.relevanceScore = intermediateObject.relevanceScore;
        this.maximumPage = intermediateObject.maximumPage;
        this.iconImageData = intermediateObject.iconImageData;
        this.parentGroup = intermediateObject.parentGroup;
        this.priority = intermediateObject.priority;
        this.alwaysAutoFill = intermediateObject.alwaysAutoFill;
        this.alwaysAutoSubmit = intermediateObject.alwaysAutoSubmit;
        this.neverAutoFill = intermediateObject.neverAutoFill;
        this.neverAutoSubmit = intermediateObject.neverAutoSubmit;
        this.database = intermediateObject.database;
    }

    // assists with serialisation of this object to a string
    // (for attachment to the current tab session)
    // currently used only for recording potentially half-finished new entries after
    // user has submitted a form, hence not all info. needs to be persisted
    toSource () {
        //const formActionURLParam = (this.formActionURL == null) ? "null" : ("'" + this.formActionURL + "'");
        const httpRealmParam = (this.httpRealm == null) ? "null" : ("'" + this.httpRealm + "'");
        const uniqueIDParam = (this.uniqueID == null) ? "null" : ("'" + this.uniqueID + "'");
        const titleParam = (this.title == null) ? "null" : ("'" + this.title + "'");

        return "( deserialisedOutputURLs , " + httpRealmParam + " , " + this.usernameIndex
            + " , deserialisedOutputPasswords , " + uniqueIDParam + " , " + titleParam + " , deserialisedOutputOtherFields , " + this.maximumPage + " )";
    }

    init (aURLs, unusedParameter, aHttpRealm,
        aUsernameIndex, aPasswords,
        aUniqueID, aTitle, otherFieldsArray, aMaximumPage) {

        this.otherFields = otherFieldsArray;
        this.URLs = aURLs;
        this.httpRealm = aHttpRealm;
        this.usernameIndex = aUsernameIndex;
        this.passwords = aPasswords;
        this.uniqueID = aUniqueID;
        this.title = aTitle;
        this.maximumPage = aMaximumPage;
        this.iconImageData = "";
        this.priority = 0;
        this.alwaysAutoFill = false;
        this.alwaysAutoSubmit = false;
        this.neverAutoFill = false;
        this.neverAutoSubmit = false;
        this.matchAccuracy = 0;
    }

    initFromEntry (entry) {
        const passwords = [];
        const otherFields = [];
        let usernameIndex = 0;
        let maximumPage = 1;

        for (let j = 0; j < entry.formFieldList.length; j++) {
            const kpff = entry.formFieldList[j];
            if (kpff.type == keeFoxFormFieldType.password) {
                if (kpff.page > maximumPage)
                    maximumPage = kpff.page;

                const newField = new keeFoxLoginField();
                newField.init(kpff.name, kpff.value, kpff.id, "password", kpff.page);
                passwords.push(newField);

            } else if (kpff.type == keeFoxFormFieldType.text || kpff.type == keeFoxFormFieldType.username
                || kpff.type == keeFoxFormFieldType.select || kpff.type == keeFoxFormFieldType.radio
                || kpff.type == keeFoxFormFieldType.checkbox) {
                const otherLength = otherFields.length;
                let type = "unknown";

                switch (kpff.type) {
                    case keeFoxFormFieldType.username: usernameIndex = otherLength; type = "text"; break;
                    case keeFoxFormFieldType.text: type = "text"; break;
                    case keeFoxFormFieldType.radio: type = "radio"; break;
                    case keeFoxFormFieldType.checkbox: type = "checkbox"; break;
                    case keeFoxFormFieldType.select: type = "select-one"; break;
                }

                if (kpff.page > maximumPage)
                    maximumPage = kpff.page;

                const newField = new keeFoxLoginField();
                newField.init(kpff.name, kpff.value, kpff.id, type, kpff.page);
                otherFields.push(newField);
            }
        }

        this.init(entry.uRLs, null, entry.hTTPRealm, usernameIndex,
            passwords, entry.uniqueID, entry.title, otherFields, maximumPage);
        this.parentGroup = entry.parent;
        this.iconImageData = entry.iconImageData;
        this.alwaysAutoFill = entry.alwaysAutoFill;
        this.alwaysAutoSubmit = entry.alwaysAutoSubmit;
        this.neverAutoFill = entry.neverAutoFill;
        this.neverAutoSubmit = entry.neverAutoSubmit;
        this.priority = entry.priority;
        this.database = entry.db;
        this.matchAccuracy = entry.matchAccuracy;
    }

    private allURLsMatch (URLs, ignoreURIPathsAndSchemes, ignoreURIPaths) {
        if (this.URLs.length != URLs.length)
            return false;
        for (let i = 0; i < URLs.length; i++) {
            const url1 = URLs[i];
            for (let j = 0; j < this.URLs.length; j++) {
                const url2 = this.URLs[j];
                if (!ignoreURIPathsAndSchemes && getURISchemeHostAndPort(url1) != getURISchemeHostAndPort(url2))
                    return false;
                else if (ignoreURIPathsAndSchemes && !ignoreURIPaths && getURIHostAndPort(url1) != getURIHostAndPort(url2))
                    return false;
                else if (!ignoreURIPathsAndSchemes && !ignoreURIPaths && getURIExcludingQS(url1) != getURIExcludingQS(url2))
                    return false;
            }
        }
        return true;
    }

    private allPasswordsMatch (passwords) {
        let matches = 0;
        if (this.passwords.length != passwords.length)
            return false;

        for (let i = 0; i < this.passwords.length; i++)
            for (let j = 0; j < passwords.length; j++)
                if (passwords[j].value == this.passwords[i].value) {
                    matches++;
                    break; // leave only the inner loop
                }

        if (matches != passwords.length)
            return false;

        return true;
    }

    private usernamesMatch (login: keeFoxLoginInfo) {
        if (this.otherFields.length != login.otherFields.length)
            return false;

        let loginUsername: string = null;
        if (login.usernameIndex >= 0 && login.otherFields != null && login.otherFields.length > login.usernameIndex) {
            const temp = login.otherFields[login.usernameIndex];
            loginUsername = temp.value;
        }

        let thisUsername: string = null;
        if (this.usernameIndex >= 0 && this.otherFields != null && this.otherFields.length > this.usernameIndex) {
            const temp = this.otherFields[this.usernameIndex];
            thisUsername = temp.value;
        }

        if (thisUsername != loginUsername)
            return false;

        return true;
    }


    allURLsContainedIn (URLs, ignoreURIPathsAndSchemes, ignoreURIPaths) {
        let matches = 0;

        for (let i = 0; i < this.URLs.length; i++) {
            const url1 = this.URLs[i];
            for (let j = 0; j < URLs.length; j++) {
                const url2 = URLs[j];
                if (!ignoreURIPathsAndSchemes && url1.indexOf("://") > 0 &&
                    getURISchemeHostAndPort(url1) != getURISchemeHostAndPort(url2))
                { continue; }
                else if (!ignoreURIPathsAndSchemes && url1.indexOf("://") <= 0
                    && getURIHostAndPort(url1) != getURIHostAndPort(url2))
                { continue; }
                else if (ignoreURIPathsAndSchemes && !ignoreURIPaths && getURIHostAndPort(url1) != getURIHostAndPort(url2))
                { continue; }
                else if (!ignoreURIPathsAndSchemes && !ignoreURIPaths && getURIExcludingQS(url1) != getURIExcludingQS(url2))
                { continue; }
                else
                { matches++; break; }
            }
        }

        if (matches >= this.URLs.length)
            return true;

        return false;
    }

    private allPasswordsContainedIn (passwords) {
        let matches = 0;

        for (let i = 0; i < this.passwords.length; i++)
            for (let j = 0; j < passwords.length; j++)
                if (passwords[j].value == this.passwords[i].value) {
                    matches++;
                    break; // leave only the inner loop
                }

        if (matches >= this.passwords.length)
            return true;

        return false;
    }

    private allOtherFieldsContainedIn (login) {
        let matches = 0;

        for (let i = 0; i < this.otherFields.length; i++)
            for (let j = 0; j < login.otherFields.length; j++)
                if (login.otherFields[j].value == this.otherFields[i].value) {
                    matches++;
                    break; // leave only the inner loop
                }

        if (matches >= this.otherFields.length)
            return true;

        return false;
    }

    // determines if this matches another supplied login object, with a number
    // of controllable definitions of "match" to support various use cases
    matches (aLogin, ignorePasswords, ignoreURIPaths,
        ignoreURIPathsAndSchemes, ignoreUsernames, uriUtils) {
        if (!this.allURLsMatch(aLogin.URLs, ignoreURIPathsAndSchemes, ignoreURIPaths))
            return false;

        if (this.httpRealm != aLogin.httpRealm && !(this.httpRealm == "" || aLogin.httpRealm == ""))
            return false;

        if (!ignoreUsernames && !this.usernamesMatch(aLogin))
            return false;

        if (!ignorePasswords && !this.allPasswordsMatch(aLogin.passwords))
            return false;

        return true;
    }

    // determines if this login is contained within a supplied login object, with a number
    // of controllable definitions of "containedIn" to support various use cases
    containedIn (aLogin, ignorePasswords, ignoreURIPaths,
        ignoreURIPathsAndSchemes, ignoreUsernames) {
        if (!this.allURLsContainedIn(aLogin.URLs, ignoreURIPathsAndSchemes, ignoreURIPaths))
            return false;

        if (this.httpRealm != aLogin.httpRealm && !(this.httpRealm == "" || aLogin.httpRealm == ""))
            return false;

        if (!ignoreUsernames && !this.allOtherFieldsContainedIn(aLogin))
            return false;

        if (!ignorePasswords && !this.allPasswordsContainedIn(aLogin.passwords))
            return false;

        return true;
    }

    // merge another login into this one. Only certain fields are merged
    // - URLs, passwords and usernames
    mergeWith (previousStageLogin) {

        if (previousStageLogin.URLs != undefined && previousStageLogin.URLs != null
            && previousStageLogin.URLs.length > 0) {
            if (this.URLs == undefined || this.URLs == null)
                this.URLs = [];

            for (let i = 0; i < previousStageLogin.URLs.length; i++) {
                const URL = previousStageLogin.URLs[i];
                this.URLs.push(URL);
            }
        }

        if (previousStageLogin.passwords != undefined && previousStageLogin.passwords != null
            && previousStageLogin.passwords.length > 0) {
            if (this.passwords == undefined || this.passwords == null)
                this.passwords = [];

            for (let i = 0; i < previousStageLogin.passwords.length; i++) {
                const passField = previousStageLogin.passwords[i];
                this.passwords.push(passField);
            }
        }

        if (previousStageLogin.otherFields != undefined && previousStageLogin.otherFields != null
            && previousStageLogin.otherFields.length > 0) {
            if (this.otherFields == undefined || this.otherFields == null)
                this.otherFields = [];

            for (let i = 0; i < previousStageLogin.otherFields.length; i++) {
                const otherField = previousStageLogin.otherFields[i];
                this.otherFields.push(otherField);
            }
        }

        this.maximumPage = Math.max(this.maximumPage, previousStageLogin.maximumPage);
    }

    asEntry () {
        const entry: any = {};

        entry.db = this.database;
        entry.parent = this.parentGroup;
        entry.iconImageData = this.iconImageData;
        entry.alwaysAutoFill = this.alwaysAutoFill;
        entry.alwaysAutoSubmit = this.alwaysAutoSubmit;
        entry.neverAutoFill = this.neverAutoFill;
        entry.neverAutoSubmit = this.neverAutoSubmit;
        entry.priority = this.priority;
        entry.uRLs = this.URLs;
        entry.matchAccuracy = this.matchAccuracy;
        entry.hTTPRealm = this.httpRealm;
        entry.uniqueID = this.uniqueID;
        entry.title = this.title;
        entry.formFieldList = [];
        for (const password of this.passwords)
            entry.formFieldList.push(password.asFormField(false));
        for (let i = 0; i < this.otherFields.length; i++)
            if (this.usernameIndex == i)
                entry.formFieldList.push(this.otherFields[i].asFormField(true));
            else
                entry.formFieldList.push(this.otherFields[i].asFormField(false));

        return entry;
    }

}


class keeFoxLoginField {

    // "name" attribute on the HTML form element
    name: string;

    // "value" attribute on the HTML form element
    value: string;

    // "id" attribute on the HTML form element
    fieldId: string;

    // The HTML form element DOM objects - transient (not sent to KeePass)
    DOMInputElement: HTMLInputElement;
    DOMSelectElement: HTMLSelectElement;

    // "type" attribute on the HTML form element
    type: "password" | "text" | "radio" | "select-one" | "checkbox";

    formFieldPage: number;

    // on which page of a login procedure this field can be found
    constructor () {
        this.formFieldPage = -1;
    }

    toJSON () {
        const intermediateObject: any = {};
        intermediateObject.name = this.name;
        intermediateObject.value = this.value;
        intermediateObject.fieldId = this.fieldId;
        //intermediateObject.DOMInputElement = this.DOMInputElement;
        //intermediateObject.DOMSelectElement = this.DOMSelectElement;
        intermediateObject.type = this.type;
        intermediateObject.formFieldPage = this.formFieldPage;

        //var json = JSON.stringify(intermediateObject);
        //return json;
        return intermediateObject;
    }

    fromJSONifiable (intermediateObject) {
        this.name = intermediateObject.name;
        this.value = intermediateObject.value;
        this.fieldId = intermediateObject.fieldId;
        this.type = intermediateObject.type;
        this.formFieldPage = intermediateObject.formFieldPage;
    }

    // assists with deserialisation of this object to a string
    // (for attachment to the current tab session)
    toSource () {
        const fieldIdParam = (this.fieldId == null) ? "null" : ("'" + this.fieldId + "'");
        const fieldNameParam = (this.name == null) ? "null" : ("'" + this.name.replace("'", "\\'") + "'");
        const fieldValueParam = (this.value == null) ? "null" : ("'" + this.value.replace("'", "\\'") + "'");

        return "( " + fieldNameParam + ", " + fieldValueParam + " , " + fieldIdParam + " , '" + this.type + "' , " + this.formFieldPage + " )";
    }

    init (aName, aValue, aID, aType, aFormFieldPage) {
        this.name = aName;
        this.value = aValue;
        if (aID == null || aID == undefined)
            this.fieldId = "";
        else
            this.fieldId = aID;
        this.type = aType;
        this.formFieldPage = aFormFieldPage;
    }

    asFormField (isUsername: boolean) {
        const formField: any = {};

        formField.name = this.name;
        formField.value = this.value;
        formField.id = this.fieldId;
        formField.page = this.formFieldPage;

        switch (this.type) {
            case "password": formField.type = keeFoxFormFieldType.password; break;
            case "radio": formField.type = keeFoxFormFieldType.radio; break;
            case "checkbox": formField.type = keeFoxFormFieldType.checkbox; break;
            case "select-one": formField.type = keeFoxFormFieldType.select; break;
            default: formField.type = isUsername ? keeFoxFormFieldType.username : keeFoxFormFieldType.text; break;
        }

        return formField;
    }
}
