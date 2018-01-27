/// <reference path="keeFieldIcon.ts" />
/// <reference path="PanelStub.ts" />
/// <reference path="formSaving.ts" />

class MatchResult {
    logins: keeLoginInfo[][];
    submitTargets: HTMLElement[];
    usernameIndexArray: number[];
    passwordFieldsArray: keeLoginField[][];
    otherFieldsArray: keeLoginField[][];
    currentPage: number;
    allMatchingLogins: any[];
    formRelevanceScores: number[];
    UUID: string;
    wantToAutoFillForm: boolean;
    mustAutoFillForm: boolean;
    cannotAutoFillForm: boolean;
    wantToAutoSubmitForm: boolean;
    mustAutoSubmitForm: boolean;
    cannotAutoSubmitForm: boolean;
    wantToAutoFillFormWithMultipleMatches: boolean;
    overWriteFieldsAutomatically: boolean;
    dbFileName: string;
    doc: Document;
    forms: HTMLFormElement[];
    formReadyForSubmit: boolean;
    autofillOnSuccess: boolean;
    autosubmitOnSuccess: boolean;
    notifyUserOnSuccess: boolean;
    wrappers: any[];
    requestCount: number;
    responseCount: number;
    requestIds: any[];
    mostRelevantFormIndex?: number;
    lastFilledOther: SubmittedField[];
    lastFilledPasswords: SubmittedField[];
}

class SubmittedField {
    id: string;
    DOMelement: HTMLInputElement | HTMLSelectElement;
    name: string;
    value: string;
}

enum SubmitCategory {
    Unknown,
    ButtonInForm,
    SubmitInputInForm,
    ButtonOutsideForm,
    ImageInputInForm,
    ButtonInputInForm,
    ButtonRoleInForm,
    ButtonRoleOutsideForm
}

class SubmitCandidate {
    distance: number;
    category: SubmitCategory;
    element: HTMLElement;
    semanticScore: number;
    score: number;
    visible: boolean;
}

class FormFilling {

    private Logger: KeeLogger;
    private config: Config;
    private findLoginOp: any = {};
    private matchResult: MatchResult = new MatchResult();

    private matchFinder: {(uri: string): void};
    private formUtils: FormUtils;
    private formSaving: FormSaving;

    private keeFieldIcon: KeeFieldIcon;

    public matchedLoginsPanelStub: PanelStub;
    private matchedLoginsPanelStubRaf: number;

    // Should really make this private and call indirectly but I'm wary of all performance overheads wrt DOM mutation observers
    public formFinderTimer: number = null;

    constructor (formUtils: FormUtils,
        formSaving: FormSaving,
        logger: KeeLogger,
        config: Config,
        matchFinder: {(uri: string): void}) {

        this.formUtils = formUtils;
        this.formSaving = formSaving;
        this.Logger = logger;
        this.config = config;
        this.matchFinder = matchFinder;
        this.keeFieldIcon = new KeeFieldIcon();
    }

    public executePrimaryAction () {
        if (this.matchResult.logins && this.matchResult.logins.length > 0 && this.matchResult.mostRelevantFormIndex != null && this.matchResult.mostRelevantFormIndex >= 0) {
            if (this.matchResult.logins[this.matchResult.mostRelevantFormIndex].length == 1) {
                this.fillAndSubmit(false, this.matchResult.mostRelevantFormIndex, 0);
                this.closeMatchedLoginsPanel();
            } else if (this.matchResult.logins[this.matchResult.mostRelevantFormIndex].length > 1) {
                this.closeMatchedLoginsPanel();
                this.matchedLoginsPanelStub = new PanelStub(PanelStubOptions.MatchedLogins, null);
                this.matchedLoginsPanelStub.createPanel();
            }
        }
    }

    public createMatchedLoginsPanelInCenter (specificFrameId: number) {
        this.closeMatchedLoginsPanel();
        this.matchedLoginsPanelStub = new PanelStub(PanelStubOptions.MatchedLogins, null, specificFrameId);
        this.matchedLoginsPanelStub.createPanel();
    }

    public createMatchedLoginsPanelNearNode (target: HTMLElement) {
        this.closeMatchedLoginsPanel();
        this.matchedLoginsPanelStub = new PanelStub(PanelStubOptions.MatchedLogins, target);
        this.matchedLoginsPanelStub.createPanel();
        this.matchedLoginsPanelStubRaf = requestAnimationFrame(formFilling.updateMatchedLoginsPanelPosition);
    }

    public closeMatchedLoginsPanel () {
        if (this.matchedLoginsPanelStub) this.matchedLoginsPanelStub.closePanel();
        this.matchedLoginsPanelStub = null;
        cancelAnimationFrame(this.matchedLoginsPanelStubRaf);
    }

    public updateMatchedLoginsPanelPosition () {
        formFilling.matchedLoginsPanelStub.updateBoundingClientRect();
        formFilling.matchedLoginsPanelStubRaf = requestAnimationFrame(formFilling.updateMatchedLoginsPanelPosition);
    }

    private calculateFieldMatchScore (formField: keeLoginField, dataField, currentPage, overWriteFieldsAutomatically)
    {
        // Default score is 1 so that bad matches which are at least the correct type
        // have a chance of being selected if no good matches are found
        let score = 1;

        // If field is already filled in and can't be overwritten we make the score 0
        if ((this.formUtils.isATextFormFieldType(formField.type) || formField.type == "password") &&
            (formField.value.length > 0 && !overWriteFieldsAutomatically)
        )
            return 0;

        // Do not allow any match if field types are significantly mismatched (e.g. checkbox vs text field)
        if ( !( this.formUtils.isATextFormFieldType(formField.type) && (dataField.type == "username" || dataField.type == "text") )
            && !(formField.type == "password" && dataField.type == "password")
            && !(formField.type == "radio" && dataField.type == "radio")
            && !(formField.type == "checkbox" && dataField.type == "checkbox")
            && !(formField.type == "select-one" && dataField.type == "select-one")
            )
            return 0;

        // If field IDs match +++++
        if (formField.fieldId != null && formField.fieldId != undefined
            && formField.fieldId != "" && formField.fieldId == dataField.fieldId
            )
            score += 50;

        // If field names match ++++
        // (We do not treat ID and NAME as mutually exclusive because some badly written
        // websites might have duplicate IDs but different names so this combined approach
        // might allow them to work correctly)
        if (formField.name != null && formField.name != undefined
                && formField.name != "" && formField.name == dataField.name
            )
            score += 40;

        // Radio buttons have their values set by the website and hence can provide
        // a useful cue when both id and name matching fails
        if (formField.type == "radio" && formField.value != null && formField.value != undefined
                && formField.value != "" && formField.value == dataField.value
            )
            score += 30;

        // Although there is a formField.formFieldPage property, it is not accurate
        // so we just compare against the supplied currentPage
        // If page # matches exactly ++
        if (currentPage > 0 && dataField.formFieldPage == currentPage)
            score += 20;

        // If page # is wrong --
        else if (currentPage > 0 && dataField.formFieldPage != currentPage)
            score -= 19; // 20 would cause a tie for an otherwise good name match

        // If page # is unestablished (<=0)
        //else do nothing

        if (formUtils.isDOMElementVisible(formField.DOMInputElement || formField.DOMSelectElement))
            score += 25;

        return score;
    }

    private fillMatchedFields (fields, dataFields, formFields)
    {
        // We want to make sure each data field is matched to only one form field but we
        // don't know which field will be the best match and we don't want to ignore
        // less accurate matches just becuase they happen to appear later.

        // We have a list of objects representing each possible combination of data field
        // and form field and the score for that match.
        // We choose what to fill by sorting that list by score.
        // After filling a field we remove all objects from the list which are for the
        // data field we just filled in and the form field we filled in.

        // This means we always fill each form field only once, with the best match
        // selected from all data fields that haven't already been selected for another form field

        // The above algorithm could maybe be tweaked slightly in order to auto-fill
        // a "change password" form if we ever manage to make that automated

        // (score is reduced by one for each position we find in the form - this gives
        // a slight priority to fields at the top of a form which can be useful occassionaly)

        fields.sort(function (a, b) {
            return b.score - a.score;
        });

        // Remember what we've filled in so we can make more accurate decisions when
        // the form is submitted later. We resist the urge the index by element ID or
        // the DOMelement itself because some websites do not specify an ID and some
        // may remove the DOMelement before we submit the form (sometimes under user
        // direction but ocasionally automaticaly too)
        const submittedFields: SubmittedField[] = [];

        // Keep filling in fields until we find no more with a positive score
        while (fields.length > 0 && fields[0].score > 0)
        {
            const ffi = fields[0].formFieldIndex;
            const dfi = fields[0].dataFieldIndex;
            let DOMelement;

            if (formFields[ffi].type == "select-one")
                DOMelement = formFields[ffi].DOMSelectElement;
            else
                DOMelement = formFields[ffi].DOMInputElement;

            this.Logger.info("We will populate field " + ffi + " (id:" + formFields[ffi].fieldId + ")", " with: " + dataFields[dfi].value);

            this.fillASingleField(DOMelement, formFields[ffi].type, dataFields[dfi].value);

            submittedFields.push({
                id: formFields[ffi].fieldId,
                DOMelement: DOMelement,
                name: formFields[ffi].name,
                value: dataFields[dfi].value
            });

            fields = fields.filter(function (element, index, array) {
                return (element.dataFieldIndex != dfi && element.formFieldIndex != ffi);
            });

            fields.sort(function (a, b) {
                return b.score - a.score;
            });
        }
        return submittedFields;
    }

    private fillASingleField (domElement, fieldType, value)
    {
        if (fieldType == "select-one")
        {
            domElement.value = value;
        } else if (fieldType == "checkbox")
        {
            if (value == "KEEFOX_CHECKED_FLAG_TRUE")
                domElement.checked = true;
            else
                domElement.checked = false;
        } else if (fieldType == "radio")
        {
            domElement.checked = true;
        } else
        {
            domElement.value = value;
        }

        domElement.dispatchEvent(new UIEvent("input", {view: window, bubbles: true, cancelable: true}));
        domElement.dispatchEvent(new UIEvent("change", {view: window, bubbles: true, cancelable: true}));
    }

    private fillManyFormFields (formFields, dataFields, currentPage, overWriteFieldsAutomatically)
    {
        this.Logger.debug("_fillManyFormFields started");

        if (formFields == null || formFields == undefined || dataFields == null || dataFields == undefined)
            return;

        this.Logger.debug("We've received the data we need");

        this.Logger.info("Filling form fields for page "+currentPage);

        if (overWriteFieldsAutomatically)
            this.Logger.info("Auto-overwriting fields");
        else
            this.Logger.info("Not auto-overwriting fields");

        // we try to fill every form field. We try to match by id first and then name before just guessing.
        // Generally we'll only fill if the matched field is of the same type as the form field but
        // we are flexible RE text and username fields because that's an artificial difference
        // for the sake of the Kee password management software. However, usernames will be chosen above
        // text fields if all else is equal
        const fields = [];

        for (let i = 0; i < formFields.length; i++)
        {
            for (let j = 0; j < dataFields.length; j++)
            {
                const score = this.calculateFieldMatchScore(
                    formFields[i], dataFields[j], currentPage, overWriteFieldsAutomatically);
                this.Logger.debug("Suitability of putting data field "+j+" into form field "+i
                    +" (id: "+formFields[i].fieldId + ") is " + score);
                fields.push({score: score, dataFieldIndex: j, formFieldIndex: i});
            }
        }

        return this.fillMatchedFields (fields, dataFields, formFields);
    }

    private initMatchResult (behaviour: FindMatchesBehaviour)
    {
        //TODO:#6: create new object might cause issues with multi-page or submit behaviour? if not, this would be neater:
        // matchResult = new MatchResult();
        this.matchResult.UUID = "";
        this.matchResult.logins = [];
        this.matchResult.mostRelevantFormIndex = null;

        // auto fill the form by default unless a preference or tab variable tells us otherwise
        this.matchResult.wantToAutoFillForm = this.config.autoFillForms;
        this.matchResult.mustAutoFillForm = false;
        this.matchResult.cannotAutoFillForm = false;

        // do not auto submit the form by default unless a preference or tab variable tells us otherwise
        this.matchResult.wantToAutoSubmitForm = this.config.autoSubmitForms;
        this.matchResult.mustAutoSubmitForm = false;
        this.matchResult.cannotAutoSubmitForm = false;

        // Allow user to override automatic behaviour if multiple logins match this URL
        this.matchResult.wantToAutoFillFormWithMultipleMatches = this.config.autoFillFormsWithMultipleMatches;

        // overwrite existing username by default unless a preference or tab variable tells us otherwise
        this.matchResult.overWriteFieldsAutomatically = this.config.overWriteFieldsAutomatically;

        if (behaviour.UUID != undefined && behaviour.UUID != null && behaviour.UUID != "")
        {
            // Keep a record of the specific entry we are going to search for (we delete
            // the tabstate below and re-create it during form fill)
            this.matchResult.UUID = behaviour.UUID;
            this.matchResult.dbFileName = behaviour.dbFileName;

            // we want to fill the form with this data
            this.matchResult.mustAutoFillForm = true;
            this.matchResult.overWriteFieldsAutomatically = true;

            if (behaviour.mustAutoSubmitForm)
                this.matchResult.mustAutoSubmitForm = true;
        }

        this.matchResult.doc = window.document;

        this.matchResult.formReadyForSubmit = false; // tracks whether we actually auto-fill on this page
        this.matchResult.autofillOnSuccess = behaviour.autofillOnSuccess;
        this.matchResult.autosubmitOnSuccess = behaviour.autosubmitOnSuccess;
        this.matchResult.notifyUserOnSuccess = behaviour.notifyUserOnSuccess;
        this.matchResult.wrappers = [];
        this.matchResult.allMatchingLogins = [];
        this.matchResult.formRelevanceScores = [];
        this.matchResult.submitTargets = [];
        this.matchResult.usernameIndexArray = [];
        this.matchResult.passwordFieldsArray = [];
        this.matchResult.otherFieldsArray = [];
        this.matchResult.requestCount = 0;
        this.matchResult.responseCount = 0;
        this.matchResult.requestIds = []; // the JSONRPC request Ids that reference this matchResult object (to allow deletion after async callback processing)

    }

    /* Expects this data object:
    {
        autofillOnSuccess: true, // This won't override other configuration options if true but if false it will.
        autosubmitOnSuccess: true, // This won't override other configuration options if true but if false it will.
        notifyUserOnSuccess: true, // e.g. used when periodic form polling finds a form after the page has loaded.
        ... others
    }
    */
    public findMatchesInThisFrame (behaviour: FindMatchesBehaviour = {})
    {
        const perfTest = performance.now();
        // Whether or not this was invoked as a result of a DOM mutation, we won't need the timer to fire anymore
        if (this.formFinderTimer !== null) {
            clearTimeout(this.formFinderTimer);
            this.formFinderTimer = null;
        }

        // Can't append to a HTMLCollection but all we really use it for is iteration
        // and length so converting to an array sometimes will cause no issues
        let forms = new Array<HTMLFormElement>();
        for (let i=0; i < window.document.forms.length; i++) {
            forms.push(window.document.forms.item(i));
        }

        // Forcing a scan for orphaned fields on all pages. May need to change
        // this if real world performance is too slow.
        const pseudoForm = this.scanForOrphanedFields(window.document);
        if (pseudoForm) {
            forms = Array.prototype.slice.call(forms);
            forms.push(pseudoForm);
        }

        if (!forms || forms.length == 0)
        {
            this.Logger.info("No forms found on this page.");
            return;
        }

        const url = new URL(window.document.URL);
        url.hostname = punycode.toUnicode(url.hostname);

        this.Logger.info("Finding matches in a document. readyState: " + window.document.readyState,
            "docURI: " + url.href);

        this.initMatchResult(behaviour);
        this.matchResult.forms = forms;

        //TODO:3: Some of the init has been moved below the no forms return statement.
        // should be safe but possible cause of bugs if I have recalled some early
        // algorithm details incorrectly. Remove comment in >= 2.0

        const conf = configManager.siteConfigFor(url.href);

        this.Logger.debug("findMatches processing " + forms.length + " forms", " on " + url.href);

        let searchSentToKeePass = false;

        // For every form, including any pseudo forms we created earlier
        for (let i = 0; i < forms.length; i++)
        {
            const form = forms[i];
            this.matchResult.logins[i] = [];

            // the overall relevance of this form is the maximum of it's
            // matching entries (so we fill the most relevant form)
            this.matchResult.formRelevanceScores[i] = 0;

            this.Logger.debug("about to get form fields");
            const { actualUsernameIndex: usernameIndex, pwFields: passwordFields, otherFields } =
                this.formUtils.getFormFields(form, false);

            // We want to fill in this form if we find a password field but first
            // we check whether any whitelist or blacklist entries must override that behaviour
            let interestingForm: boolean = null;

            interestingForm = configManager.isFormInteresting(form, conf, otherFields);

            if (interestingForm === false)
            {
                this.Logger.debug("Lost interest in this form after inspecting field names and IDs");
                continue;
            }

            let submitTargetNeighbour: HTMLElement;
            if (passwordFields == null || passwordFields.length <= 0 || passwordFields[0] == null)
            {
                this.Logger.debug("no password field found in this form");
                // so we now only want to fill in the form if it has been whitelisted
                if (interestingForm !== true)
                    continue;
                submitTargetNeighbour = otherFields[usernameIndex].DOMInputElement || otherFields[usernameIndex].DOMSelectElement;
            } else {
                submitTargetNeighbour = passwordFields[0].DOMInputElement;
            }

            const submitTarget = this.findSubmitButton(form, submitTargetNeighbour);
            if (!submitTarget) {
                this.Logger.debug("No submission possibility found in this form");
            }
            this.formSaving.addSubmitHandler(submitTarget, form);

            this.matchResult.submitTargets[i] = submitTarget;
            this.matchResult.usernameIndexArray[i] = usernameIndex;
            this.matchResult.passwordFieldsArray[i] = passwordFields;
            this.matchResult.otherFieldsArray[i] = otherFields;

            // The logins returned from KeePass for every form will be identical (based on tab/frame URL)
            if (!searchSentToKeePass)
            {
                this.findLoginOp.forms = forms;
                this.findLoginOp.formIndexes = [i];
                this.findLoginOp.wrappedBy = this.matchResult;
                this.matchResult.wrappers[i] = this.findLoginOp;
                this.matchResult.requestCount++;

                // Search for matching logins for the relevant URL. This request is asynchronous.
                this.matchFinder(url.href);
                searchSentToKeePass = true;
            } else {
                this.Logger.debug("form[" + i + "]: reusing logins from last form.");
                this.findLoginOp.formIndexes.push(i);
            }

        }  // end of form for loop

        console.warn(performance.now() - perfTest);
    }

    private scanForOrphanedFields (doc)
    {
        const t = (new Date()).getTime();
        const orphanedFields = [];
        let pseudoForm = null;

        // much faster than querySelectorAll
        const items = doc.getElementsByTagName("input");
        for (const tag of items)
        {
            if (!tag.form)
                orphanedFields.push(tag);
        }

        if (orphanedFields.length > 0)
        {
            pseudoForm = {
                elements: orphanedFields,
                id: "Kee-pseudo-form",
                name: "Kee-pseudo-form",
                ownerDocument: doc,
                getElementsByTagName: function () { return this.elements; }, // Only use is for listing input elements
                querySelectorAll: function () { return []; }, // Only use is for listing button elements
                submit: function () { return; }, // Not possible to submit a pseudo form unless a button with custom JS has already been found
                offsetParent: true, // This tricks element visibility checks into treating this as visible to the user
                addEventListener: function (name: string, handler) { return; }, //TODO:3: hook up to the submit function to simulate real form submission
                removeEventListener: function (name: string, handler) { return; }
            };
        }

        const tn = (new Date()).getTime();
        this.Logger.debug("scanForOrphanedFields took: " + (tn-t));

        return pseudoForm;
    }

    public findLoginsResultHandler (result)
    {
        let foundLogins = null;
        const convertedResult = [];
        let isError = false;

        try
        {
            if (result)
            {
                foundLogins = result;

                for (const i in foundLogins)
                {
                    const kfl = new keeLoginInfo();
                    kfl.initFromEntry(foundLogins[i]);

                    // Only consider logins that have some kind of form data to fill in
                    if ((kfl.passwords != null && kfl.passwords.length > 0)
                        || (kfl.otherFields != null && kfl.otherFields.length > 0))
                        convertedResult.push(kfl);
                }
            } else
            {
                isError = true;
            }
        } catch (e) {
            isError = true;
        }

        if (isError)
        {
            return;
        }

        this.matchResult = this.getRelevanceOfLoginMatchesAgainstAllForms(convertedResult, this.findLoginOp, this.matchResult);

        this.fillAndSubmit(true);
    }

    getRelevanceOfLoginMatchesAgainstAllForms (convertedResult, findLoginOp, matchResult: MatchResult)
    {
        const crString = JSON.stringify(convertedResult);
        let firstMatchProcessed = false;

        for (let i=0; i < findLoginOp.forms.length; i++)
        {
            // Skip any form that we don't want to match against this set of logins
            if (findLoginOp.formIndexes.indexOf(i) == -1)
                continue;

            // if there is more than one form, we have to work with clones of the login result so
            // that we can manipulate the relevancy scores, etc. independently for each
            // form and login combination. We could be more efficient for the common case of 1 form
            // by avoiding the clone then but keeping the same behaviour gives us a higher chance
            // of noticing bugs.
            matchResult.logins[i] = JSON.parse(crString); //TODO:3: faster clone? https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ?

            // Nothing to do if we have no matching logins available.
            if (matchResult.logins[i].length == 0)
                continue;

            this.Logger.info("match found!");

            // determine the relevance of each login entry to this form
            // we could skip this when autofilling based on uniqueID but we would have to check for
            // matches first or else we risk no match and no alternative matching logins on the mainUI
            for (let v = 0; v < matchResult.logins[i].length; v++)
            {
                const relScore = this.calculateRelevanceScore(matchResult.logins[i][v],
                        findLoginOp.forms[i], matchResult.usernameIndexArray[i],
                        matchResult.passwordFieldsArray[i], matchResult.currentPage,
                        matchResult.otherFieldsArray[i]);

                // choosing best login form should not be affected by lowFieldMatchRatio login score
                // but when we come to fill the form we can force ourselves into a no-auto-fill behaviour.
                matchResult.logins[i][v].relevanceScore = relScore.score;
                matchResult.logins[i][v].lowFieldMatchRatio = relScore.lowFieldMatchRatio;

                // also set the form ID and login ID on the internal login object so
                // it will persist when later passed to the UI and we can ultimately
                // find the same login object when processing a matched login
                matchResult.logins[i][v].formIndex = i;
                matchResult.logins[i][v].loginIndex = v;
                matchResult.logins[i][v].frameKey = findLoginOp.frameArrayKey;

                // Remember the best form for each login
                if (!firstMatchProcessed || matchResult.logins[i][v].relevanceScore > matchResult.allMatchingLogins[v].relevanceScore)
                {
                    this.Logger.debug("Higher relevance score found for login " + v + " with formIndex "
                        + matchResult.logins[i][v].formIndex + " (" + findLoginOp.forms[i].id + ")");
                    matchResult.allMatchingLogins[v] = matchResult.logins[i][v];
                }
            }
            firstMatchProcessed = true;

            // Find the best login for this form
            matchResult.logins[i].forEach(function (c) {
                if (c.relevanceScore > matchResult.formRelevanceScores[i])
                    matchResult.formRelevanceScores[i] = c.relevanceScore;
            } );

            this.Logger.debug("Relevance of form " + i + " (" + findLoginOp.forms[i].id + ") is " + matchResult.formRelevanceScores[i]);
        }
        return matchResult;
    }

    getMostRelevantForm = function (formIndex?: number)
    {
        const findMatchesResult = this.matchResult;

        // There may be no results for this frame (e.g. no forms found, search failed, etc.)
        if (!findMatchesResult)
            return {
                bestFormIndex: 0,
                bestRelevanceScore: 0,
                bestFindMatchesResult: undefined
            };

        let mostRelevantFormIndex = 0;

        if (formIndex >= 0)
            mostRelevantFormIndex = formIndex;
        else
            findMatchesResult.formRelevanceScores.forEach((c, index) => {
                this.Logger.debug("Relevance of form is " + c);
                if (c > findMatchesResult.formRelevanceScores[mostRelevantFormIndex])
                    mostRelevantFormIndex = index;
            } );

        this.Logger.debug("The most relevant form is #" + mostRelevantFormIndex);
        return {
            bestFormIndex: mostRelevantFormIndex,
            bestRelevanceScore: findMatchesResult.formRelevanceScores[mostRelevantFormIndex],
            bestFindMatchesResult: findMatchesResult
        };
    };

    // automated could be on page load or resulting from other non-user-interaction.
    // It's possible to fill and submit a login with a specific uniqueID but
    // that process is now centered on the findMatches function. This function just
    // takes the results of that (which may include a specific login to fill and submit to a specific form)
    fillAndSubmit (automated, formIndex?, loginIndex?)
    {
        this.Logger.debug("fillAndSubmit started. automated: " + automated
            + ", formIndex: " + formIndex + ", loginIndex: " + loginIndex);

        const matchResult = this.matchResult;
        let submitTargetNeighbour;

        // Give up if we have no results for this frame (i.e. there were no forms to fill)
        if (!matchResult)
            return;

        // We do some things differently if we're being manually asked to fill and
        // submit a specific matched login
        const isMatchedLoginRequest = !automated
            && ((matchResult.mostRelevantFormIndex !== null && matchResult.mostRelevantFormIndex >= 0) || typeof(formIndex) != "undefined")
            && typeof(loginIndex) != "undefined";

        if (!isMatchedLoginRequest) {
            matchResult.mostRelevantFormIndex = this.getMostRelevantForm().bestFormIndex;
        }

        // Supplied formID overrides any that we just automatically calculated above
        if (formIndex !== null && formIndex >= 0)
            matchResult.mostRelevantFormIndex = formIndex;

        // from now on we concentrate on just the most relevant form and the fields we found earlier
        const form = matchResult.forms[matchResult.mostRelevantFormIndex];
        const passwordFields = matchResult.passwordFieldsArray[matchResult.mostRelevantFormIndex];
        const usernameIndex = matchResult.usernameIndexArray[matchResult.mostRelevantFormIndex];
        const otherFields = matchResult.otherFieldsArray[matchResult.mostRelevantFormIndex];

        if (!isMatchedLoginRequest && matchResult.logins[matchResult.mostRelevantFormIndex].length > 0) {
            myPort.postMessage({ logins: matchResult.logins[matchResult.mostRelevantFormIndex] });

            // Give the user a way to choose a login interactively
            this.keeFieldIcon.addKeeIconToFields(passwordFields, otherFields, matchResult.logins[matchResult.mostRelevantFormIndex]);
        }

        // this records the login that we eventually choose as the one to fill the chosen form with
        let matchingLogin = null;

        // If we started this fill/submit attempt from certain contexts, we will have
        // been told to ensure we do not perform auto-fill or submit and we'll instead
        // just tell the UI to notify the user about any matches we found. Although
        // we ignore this rule if the user initiated the fill/submit.
        matchResult.cannotAutoFillForm = false;
        matchResult.cannotAutoSubmitForm = false;

        if (automated && matchResult.autofillOnSuccess === false)
            matchResult.cannotAutoFillForm = true;
        if (automated && matchResult.autosubmitOnSuccess === false)
            matchResult.cannotAutoSubmitForm = true;

        // No point looking at login specific preferences if we are not allowed to auto-fill
        if (!matchResult.cannotAutoFillForm)
        {
            this.Logger.debug("We are allowed to auto-fill this form.");

            // If we've been instructed to fill a specific login, we need to select that
            // login and clear any previously set information about an auto-filled login
            // so it can be set correctly later
            if (loginIndex >= 0)
            {
                matchingLogin = matchResult.logins[matchResult.mostRelevantFormIndex][loginIndex];
                matchResult.UUID = null;
                matchResult.dbFileName = null;
            }

            let checkMatchingLoginRelevanceThreshold = false;
            if (matchingLogin == null && matchResult.logins[matchResult.mostRelevantFormIndex].length == 1) {
                matchingLogin = matchResult.logins[matchResult.mostRelevantFormIndex][0];
                checkMatchingLoginRelevanceThreshold = true;
            } else if (matchResult.UUID != undefined && matchResult.UUID != null && matchResult.UUID != "") {
                // Skip the relevance tests if we have been told to use a specific UUID
                this.Logger.debug("We've been told to use a login with this UUID: " + matchResult.UUID);
                for (let count = 0; count < matchResult.logins[matchResult.mostRelevantFormIndex].length; count++)
                    if (matchResult.logins[matchResult.mostRelevantFormIndex][count].uniqueID == matchResult.UUID)
                    {
                        matchingLogin = matchResult.logins[matchResult.mostRelevantFormIndex][count];
                        break;
                    }
                if (matchingLogin == null)
                    this.Logger.warn("Could not find the required KeePass entry. Maybe the website redirected you to a different domain or hostname?");

            } else if (matchingLogin == null && (!matchResult.logins[matchResult.mostRelevantFormIndex] || !matchResult.logins[matchResult.mostRelevantFormIndex].length)) {
                this.Logger.debug("No logins for form.");
            } else if (matchingLogin == null) {
                this.Logger.debug("Multiple logins for form, so estimating most relevant.");
                let mostRelevantLoginIndex = 0;

                for (let count = 0; count < matchResult.logins[matchResult.mostRelevantFormIndex].length; count++)
                    if (matchResult.logins[matchResult.mostRelevantFormIndex][count].relevanceScore > matchResult.logins[matchResult.mostRelevantFormIndex][mostRelevantLoginIndex].relevanceScore)
                        mostRelevantLoginIndex = count;

                this.Logger.debug("We think login " + mostRelevantLoginIndex + " is most relevant.");
                matchingLogin = matchResult.logins[matchResult.mostRelevantFormIndex][mostRelevantLoginIndex];

                // If user has specified, prevent automatic fill due to multiple matches
                if (automated && !matchResult.wantToAutoFillFormWithMultipleMatches)
                    matchResult.wantToAutoFillForm = false; //false by default

                checkMatchingLoginRelevanceThreshold = true;
            }

            if (automated && checkMatchingLoginRelevanceThreshold && matchingLogin != null)
            {
                if (matchingLogin.relevanceScore < 1)
                {
                    this.Logger.info("Our selected login is not relevant enough to exceed our threshold so will not be auto-filled.");
                    matchingLogin = null;
                } else if (matchingLogin.lowFieldMatchRatio)
                {
                    this.Logger.info("Our selected login has a low field match ratio so will not be auto-filled.");
                    matchingLogin = null;
                }
            }

            if (matchingLogin != null)
            {
                //TODO:#6 multi-page
                // // record / update the info attached to this tab regarding
                // // the number of pages of forms we want to fill in
                // // NB: we do this even if we know this is a single form
                // // submission becauase then if the user gets dumped
                // // back to the form (password error?) then we know not
                // // to auto-submit again (to avoid getting stuck in a loop)

                // if (tabState.currentPage > tabState.maximumPage)
                // {
                //     // I don't think this should ever happen because it's reset onFormSubmit
                //     // before this page has loaded.

                //     tabState.currentPage = 0;
                //     tabState.maximumPage = 0;
                //     tabState.forceAutoSubmit = null;
                //     matchResult.cannotAutoSubmitForm = true;
                //     this.Logger.info("Exceeded expected number of pages during this form-filling session. Not auto-submiting this form.");
                // }

                // If the user manually requested this to be filled in or the current page is unknown
                if (!automated)//TODO:#6 multi-page || tabState.currentPage <= 0)
                {
                    let maximumPageCount = 1;
                    for (let i = 0; i < matchingLogin.passwords.length; i++)
                    {
                        const passField = matchingLogin.passwords[i];
                        if (passField.formFieldPage > maximumPageCount)
                            maximumPageCount = passField.formFieldPage;
                    }
                    for (let i = 0; i < matchingLogin.otherFields.length; i++)
                    {
                        const otherField = matchingLogin.otherFields[i];
                        if (otherField.formFieldPage > maximumPageCount)
                            maximumPageCount = otherField.formFieldPage;
                    }
                    //TODO:#6: multi-page
                    // // always assume page 1 (very rare cases will go wrong - see github KeeFox #411 for relevant enhancement request)
                    // // Possible regression since v1.4: We used to ignore currentPage entirely for the first
                    // // page of a submission, now we might try to give preference to page 1 fields (though total
                    // // relevance score shouldn't be shifted by enough to affect otherwise well-matched fields)
                    // tabState.currentPage = 1;
                    // tabState.maximumPage = maximumPageCount;
                    // this.Logger.debug("currentPage is: " + tabState.currentPage);
                    // this.Logger.debug("maximumPage is: " + tabState.maximumPage);
                }

                // update fill and submit preferences from per-entry configuration options
                if (matchingLogin.alwaysAutoFill)
                    matchResult.wantToAutoFillForm = true;
                if (matchingLogin.neverAutoFill)
                    matchResult.wantToAutoFillForm = false;
                if (matchingLogin.alwaysAutoSubmit)
                    matchResult.wantToAutoSubmitForm = true;
                if (matchingLogin.neverAutoSubmit)
                    matchResult.wantToAutoSubmitForm = false;

                // If this is a matched login request from the user, we ignore the per-entry
                // configuration options...
                if (isMatchedLoginRequest)
                {
                    matchResult.wantToAutoFillForm = true;
                    matchResult.wantToAutoSubmitForm = this.config.autoSubmitMatchedForms;
                }

                if (matchResult.wantToAutoFillForm || matchResult.mustAutoFillForm)
                {
                    this.Logger.debug("Going to auto-fill a form");
                    const lastFilledPasswords = this.fillManyFormFields(passwordFields, matchingLogin.passwords,
                        -1, matchResult.overWriteFieldsAutomatically || !automated);
                    const lastFilledOther = this.fillManyFormFields(otherFields, matchingLogin.otherFields,
                        -1, matchResult.overWriteFieldsAutomatically || !automated);
                    matchResult.formReadyForSubmit = true;
                    matchResult.lastFilledPasswords = lastFilledPasswords;
                    matchResult.lastFilledOther = lastFilledOther;
                    if (lastFilledPasswords && lastFilledPasswords.length > 0) {
                        submitTargetNeighbour = lastFilledPasswords[0].DOMelement;
                    } else if (lastFilledOther && lastFilledOther.length > 0) {
                        submitTargetNeighbour = lastFilledOther[0].DOMelement;
                    }
                    this.formSaving.updateMatchResult(matchResult);
                }
            }
        }

        // We only do this if any forms were auto-filled successfully
        if (matchResult.formReadyForSubmit)
        {
            // if we didn't already define a uniqueID, we set it up now
            if (matchResult.UUID == undefined || matchResult.UUID == null || matchResult.UUID == "")
            {
                this.Logger.debug("Syncing UUID to: " + matchingLogin.uniqueID);
                matchResult.UUID = matchingLogin.uniqueID;
                matchResult.dbFileName = matchingLogin.database.fileName;
            }
        }

        // If this form fill is the non-final page of a multi-page login process we record the
        // UUID and dbFilename. We also enable auto-submit in some circumstances
        //TODO:#6: multi-page
        // if (matchResult.UUID != undefined && matchResult.UUID != null && matchResult.UUID != "")
        // {
        //     if (tabState.currentPage > 0 && tabState.currentPage < tabState.maximumPage)
        //     {
        //         if (matchResult.UUID)
        //         {
        //             this.Logger.debug("Setting UUID to: " + matchResult.UUID);
        //             tabState.UUID = matchResult.UUID;
        //         }
        //         if (matchResult.dbFileName)
        //         {
        //             this.Logger.debug("Setting dbFileName to: " + matchResult.dbFileName);
        //             tabState.dbFileName = matchResult.dbFileName;
        //         }

        //         // We force auto submit for all multi-page logins that have been triggered
        //         // by a one-click or matched login user selection, provided that operation
        //         // has not already been marked complete by the onFormSubmitHandler in formsSaveTab.js
        //         if (tabState.userRecentlyDemandedAutoSubmit)
        //         {
        //             tabState.forceAutoSubmit = true;
        //             this.Logger.debug("Set forceAutoSubmit to: true");
        //         }
        //     }
        // }

        if (!matchResult.cannotAutoSubmitForm && (matchResult.wantToAutoSubmitForm || matchResult.mustAutoSubmitForm)
            && matchResult.formReadyForSubmit)
        {
            this.Logger.info("Auto-submitting form...");
            this.submitForm(form, submitTargetNeighbour);
        } else if (isMatchedLoginRequest)
        {
            this.Logger.debug("Matched login request is not being auto-submitted.");
        } else
        {

            if (this.matchResult.allMatchingLogins.length > 0)
            {
                if (automated)
                {
                    this.Logger.debug("Automatic form fill complete.");
                } else
                {
                    this.Logger.debug("Manual form fill complete.");
                }
            } else
            {
                this.Logger.info("Nothing to fill.");
            }
        }
    }

    private findSubmitButton (form: HTMLFormElement, submitTargetNeighbour: HTMLElement)
    {
        // this.depth = 0;
        // this.depthCount = 0;
        // this.distTotal = 0;
        // this.performanceAlgorithm1 = { count: 0, total: 0 };
        // this.performanceAlgorithm2 = { count: 0, total: 0 };
        // this.performanceAlgorithm3 = { count: 0, total: 0 };

        const candidates: SubmitCandidate[] = [];

        //TODO: Improve performance by re-ordering adjustment types and bailing out
        // early once we reach a point that we know the element can't "win"

        Array.from(form.ownerDocument.getElementsByTagName("button")).forEach( value => {
            if (!value.type || value.type != "reset")
            {
                const semanticValues: string[] = [];
                if (value.name !== undefined && value.name !== null)
                {
                    semanticValues.push(value.name.toLowerCase());
                }
                if (value.textContent !== undefined && value.textContent !== null)
                {
                    semanticValues.push(value.textContent.toLowerCase());
                }
                if (value.value !== undefined && value.value !== null)
                {
                    semanticValues.push(value.value.toLowerCase());
                }

                const semanticScore = this.scoreAdjustmentForMagicWords(semanticValues, 50);

                candidates.push({
                    distance: this.commonParentDistance(value, submitTargetNeighbour),
                    category: (value.form && value.form == form) ? SubmitCategory.ButtonInForm : SubmitCategory.ButtonOutsideForm,
                    element: value,
                    score: 0,
                    semanticScore: semanticScore,
                    visible: formUtils.isDOMElementVisible(value)
                });
            }
        });

        Array.from(form.getElementsByTagName("input")).forEach( value => {
            if (value.type != null)
            {
                let semanticScore = 0;

                if (value.type == "submit" || value.type == "button")
                {
                    if (value.name !== undefined && value.name !== null)
                    {
                        semanticScore += this.scoreAdjustmentForMagicWords([value.name.toLowerCase()], 50);
                    }

                    // Names are more important but sometimes they don't exist or are random
                    // so check what is actually displayed to the user
                    if (value.value !== undefined && value.value !== null)
                    {
                        semanticScore += this.scoreAdjustmentForMagicWords([value.value.toLowerCase()], 40);
                    }
                }

                if (value.type == "submit" || value.type == "button" || value.type == "image")
                {

                    candidates.push({
                        distance: this.commonParentDistance(value, submitTargetNeighbour),
                        category: value.type == "button" ? SubmitCategory.ButtonInputInForm :
                                    (value.type == "image" ? SubmitCategory.ImageInputInForm :
                                    SubmitCategory.SubmitInputInForm),
                        element: value,
                        score: 0,
                        semanticScore,
                        visible: formUtils.isDOMElementVisible(value)
                    });
                }
            }
        });

        Array.from(form.ownerDocument.querySelectorAll("[role=button]")).forEach( (value: any) => {
            const semanticValues: string[] = [];
            if (value.name !== undefined && value.name !== null)
            {
                semanticValues.push(value.name.toLowerCase());
            }
            if (value.id !== undefined && value.id !== null)
            {
                semanticValues.push(value.id.toLowerCase());
            }

            const semanticScore = this.scoreAdjustmentForMagicWords(semanticValues, 50);

            candidates.push({
                distance: this.commonParentDistance(value, submitTargetNeighbour),
                category: (value.form && value.form == form) ? SubmitCategory.ButtonRoleInForm : SubmitCategory.ButtonRoleOutsideForm,
                element: value,
                score: 0,
                semanticScore,
                visible: formUtils.isDOMElementVisible(value)
            });
        });

        // this is backwards! Shoudl be:
        // const submitElements = candidates.sort((a, b) => {
        //     if (a.distance > b.distance) return -1;
        //     if (a.distance < b.distance) return 1;
        //     return 0;
        // });
        const submitElements = candidates.sort((a, b) => {
            if (a.distance > b.distance) return 1;
            if (a.distance < b.distance) return -1;
            return 0;
        });

        //console.dir(submitElements);

        submitElements.forEach((candidate, index, elements) => {
            candidate.score = index/elements.length*100;
            switch (candidate.category) {
                case SubmitCategory.ButtonInForm: candidate.score += 60; break;
                case SubmitCategory.SubmitInputInForm: candidate.score += 50; break;
                case SubmitCategory.ButtonOutsideForm: candidate.score += 40; break;
                case SubmitCategory.ImageInputInForm: candidate.score += 40; break;
                case SubmitCategory.ButtonInputInForm: candidate.score += 30; break;
                case SubmitCategory.ButtonRoleInForm: candidate.score += 20; break;
                case SubmitCategory.ButtonRoleOutsideForm: candidate.score += 10; break;
            }
            candidate.score += candidate.semanticScore;
            candidate.score += candidate.visible ? 0 : -60;
        });

        //TODO:3: more accurate searching of submit buttons, etc. to avoid password resets if possible
        // maybe special cases for common HTML output patterns (e.g. javascript-only ASP.NET forms)

        if (submitElements.length <= 0) return null;

        return submitElements.sort((a, b) => {
            if (a.score < b.score) return 1;
            if (a.score > b.score) return -1;
            return 0;
        })[0].element;

        // console.log(this.depth/this.depthCount);
        // console.log(this.distTotal/this.depthCount);

        // KeeLog.warn("Distance algorithm 1: "
        // + this.performanceAlgorithm1.total/this.performanceAlgorithm1.count
        // + " (avg); " + this.performanceAlgorithm1.count + " (count)");
        // KeeLog.warn("Distance algorithm 2: "
        // + this.performanceAlgorithm2.total/this.performanceAlgorithm2.count
        // + " (avg); " + this.performanceAlgorithm2.count + " (count)");
        // KeeLog.warn("Distance algorithm 3: "
        // + this.performanceAlgorithm3.total/this.performanceAlgorithm3.count
        // + " (avg); " + this.performanceAlgorithm3.count + " (count)");

        //console.dir(sorted);
        //return sorted[0].element;
    }

    private scoreAdjustmentForMagicWords (semanticValues: string[], factor: number) {
        const goodWords = ["submit", "login", "enter", "log in", "signin", "sign in", "next"]; //TODO:3: other languages
        const badWords = ["reset", "cancel", "back", "abort", "undo", "exit", "empty", "clear", "captcha", "totp", "forgot"]; //TODO:3: other languages
        let goodScore = false;
        let badScore = false;

        for (let i=0; i < semanticValues.length; i++) {
            if (goodScore) break;
            for (let j=0; j < goodWords.length; j++) {
                if (semanticValues[i] == goodWords[j]) {
                    goodScore = true;
                    break;
                }
            }
        }
        for (let i=0; i < semanticValues.length; i++) {
            if (badScore) break;
            for (let j=0; j < badWords.length; j++) {
                if (semanticValues[i] == badWords[j]) {
                    badScore = true;
                    break;
                }
            }
        }

        if (goodScore && badScore) return 0;
        if (badScore) return -1*factor;
        if (goodScore) return factor;
        return 0;
    }

    // private depth = 0;
    // private depthCount = 0;
    // private distTotal = 0;

    // private performanceAlgorithm1: { count: number; total: number; };
    // private performanceAlgorithm2: { count: number; total: number; };
    // private performanceAlgorithm3: { count: number; total: number; };

    private commonParentDistance (nodeA: Node, nodeB: Node)
    {
        let distance;
        // const rand = Math.random();
        // if (rand < 0.333333) {
            // const start = performance.now();
            // distance = this.commonParentDistance1(nodeA, nodeB);
            // const end = performance.now();
            // this.performanceAlgorithm1.count++;
            // this.performanceAlgorithm1.total += end - start;
        // } else if (rand > 0.666666) {
        //    const start = performance.now();
            // distance = this.commonParentDistance2(nodeB, this.elementParents(nodeA));
            // const end = performance.now();
            // this.performanceAlgorithm2.count++;
            // this.performanceAlgorithm2.total += end - start;
        // } else {
        //     const start = performance.now();
              const parents = this.elementParents(nodeA);
              const depth = parents.length;
              distance = depth <= 5 ? this.commonParentDistance1(nodeA, nodeB) : this.commonParentDistance2(nodeB, parents);
        //     const end = performance.now();
        //     this.performanceAlgorithm3.count++;
        //     this.performanceAlgorithm3.total += end - start;
        // }
        return distance;
    }

    private elementParents (nodeA) {
        const parents: Node[] = [nodeA];
        let node = nodeA.parentElement;
        while (node = node.parentElement)
        {
            parents.push(node);
        }
        return parents;
    }

    private commonParentDistance1 (nodeA: Node, nodeB: Node)
    {
        //return 1;
        // let distance = 0;
        // while (nodeA = nodeA.parentElement)
        // {
        //     if (nodeA.contains(nodeB)) return distance;
        //     //if (!!(nodeA.compareDocumentPosition(nodeB) & 16)) return distance; // slower. abort.
        //     distance++;
        // }

        // return 9007199254740991;
        let distance = 0;


        while (nodeA = nodeA.parentElement) {
            if (nodeA.contains(nodeB)) return distance;
            distance++;
        }

        return 9007199254740991;
    }

    private commonParentDistance2 (nodeB: Node, parents: Node[]) {
        const distance = this.nodeContains2(parents, nodeB, 0, parents.length-1);
        if (distance < 0) return 9007199254740991;
        return distance;
    }

    private nodeContains2 (array, node, start, end) {
        if (start === end) {
            const arr = array.slice(start, end+1);
            if (arr[0] == node) return start;
            else return -1;
        } else {
            const midpoint = start+Math.floor((end-start)/2);
            const firstHalf = this.nodeContains2(array, node, start, midpoint);
            const secondHalf = this.nodeContains2(array, node, midpoint+1, end);
            if (firstHalf != -1) {
                return firstHalf;
            }
            if (secondHalf != -1) {
                return secondHalf;
            }
            return -1;
        }
    }

    // Submit a form
    private submitForm (form: HTMLFormElement, submitTargetNeighbour: HTMLElement)
    {
        const submitElement = this.findSubmitButton(form, submitTargetNeighbour);

        // Avoid searching for matching passwords upon auto-submission
        formSaving.removeAllSubmitHandlers();

        // If we've found a button to click, use that; if not, just submit the form.
        if (submitElement != null)
        {
            this.Logger.debug("Submiting using element: " + (submitElement as any).name + ": " + submitElement.id);
            submitElement.click();
        }
        else
        {
            this.Logger.debug("Submiting using form");
            form.submit();
        }

        //TODO:3: maybe something like this might be useful? Dunno why a click()
        // above wouldn't be sufficient but maybe some custom event raising might be handy...
        /*
        function simulateClick() {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window,
            0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var cb = document.getElementById("checkbox");
        var canceled = !cb.dispatchEvent(evt);
        if(canceled) {
            // A handler called preventDefault
            alert("canceled");
        } else {
            // None of the handlers called preventDefault
            alert("not canceled");
        }
        }
        */
    }

    private calculateRelevanceScore (login, form,
        usernameIndex, passwordFields, currentPage, otherFields) {

        let score = 0;
        let lowFieldMatchRatio = false;

        // entry priorities provide a large score such that no other combination of relevance
        // can override them but there will still be differences in relevance for the same
        // entry when compared against different forms
        if (login.priority > 0)
            score = 1000000000 - login.priority * 1000;

        // Kee 1.5+ no longer considers action URLs in relevance weighting. Since the only
        // login entries of interest are already pre-matched by KeePass, this should have been
        // adding negligable accuracy to the form matching.

        // New values will be a little different (e.g. 50 vs 42 for an exact URL
        // match) but that shouldn't be a problem.
        score += login.matchAccuracy;

        // This is similar to _fillManyFormFields so might be able to reuse the results in future
        // (but need to watch for changes that invalidate the earlier calculations).
        let totalRelevanceScore = 0;

        let formMatchedFieldCount = 0;
        let radioCount = 0;
        const minFieldRelevance = 1;

        // Require at least a type match for 2-field forms (e.g. user/pass); 1 missing
        // match for 3 or 4 field forms; etc.
        const minMatchedFieldCountRatio = 0.501;

        let entryFieldIsMatched = [];

        for (let i = 0; i < otherFields.length; i++)
        {
            let mostRelevantScore = 0;
            let mostRelevantIndex = -1;

            for (let j = 0; j < login.otherFields.length; j++)
            {
                const fmscore = this.calculateFieldMatchScore(
                    otherFields[i], login.otherFields[j], currentPage, true);
                this.Logger.debug("Suitability of putting other field "+j+" into form field "+i
                    +" (id: "+otherFields[i].fieldId + ") is " + fmscore);
                if (fmscore > mostRelevantScore)
                {
                    mostRelevantScore = fmscore;
                    mostRelevantIndex = j;
                }
            }

            if (mostRelevantScore >= minFieldRelevance)
            {
                if (!entryFieldIsMatched[mostRelevantIndex])
                    formMatchedFieldCount++;
                entryFieldIsMatched[mostRelevantIndex] = true;
            }

            // Must be careful to not let radio fields cause false negatives
            if (otherFields[i].type == "radio")
                radioCount++;

            totalRelevanceScore += mostRelevantScore;
        }

        entryFieldIsMatched = [];
        for (let i = 0; i < passwordFields.length; i++)
        {
            let mostRelevantScore = 0;
            let mostRelevantIndex = -1;

            for (let j = 0; j < login.passwords.length; j++)
            {
                const fmscore = this.calculateFieldMatchScore(
                    passwordFields[i], login.passwords[j], currentPage, true);
                this.Logger.debug("Suitability of putting password field "+j+" into form field "+i
                    +" (id: "+passwordFields[i].fieldId + ") is " + fmscore);
                if (fmscore > mostRelevantScore)
                {
                    mostRelevantScore = fmscore;
                    mostRelevantIndex = j;
                }
            }
            if (mostRelevantScore >= minFieldRelevance)
            {
                if (!entryFieldIsMatched[mostRelevantIndex])
                    formMatchedFieldCount++;
                entryFieldIsMatched[mostRelevantIndex] = true;
            }

            totalRelevanceScore += mostRelevantScore;
        }

        const formFieldCount = passwordFields.length + otherFields.length;
        const loginFieldCount = login.passwords.length + login.otherFields.length;
        const fieldMatchRatio = formMatchedFieldCount / (Math.max(1, formFieldCount - radioCount));

        this.Logger.debug("formFieldCount: " + formFieldCount + ", loginFieldCount: " + loginFieldCount
            + ", formMatchedFieldCount: " + formMatchedFieldCount + ", fieldMatchRatio: " + fieldMatchRatio);

        if (fieldMatchRatio < minMatchedFieldCountRatio)
        {
            this.Logger.info(login.uniqueID + " will be forced to not auto-fill because the form field match ratio (" + fieldMatchRatio + ") is not high enough.");
            lowFieldMatchRatio = true;
        }

        const averageFieldRelevance = totalRelevanceScore / Math.max(formFieldCount, loginFieldCount);
        const adjustedRelevance = averageFieldRelevance / (Math.abs(formFieldCount - loginFieldCount) + 1);

        score += adjustedRelevance;

        this.Logger.info("Relevance for " + login.uniqueID + " is: " + score);
        return {score: score, lowFieldMatchRatio: lowFieldMatchRatio};
    }

    public removeKeeIconFromAllFields () {
        this.keeFieldIcon.removeKeeIconFromAllFields();
    }

}
