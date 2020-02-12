import { FilledField } from "./FilledField";
import { PanelStub, PanelStubOptions } from "./PanelStub";
import { FormUtils } from "./formsUtils";
import { FormSaving } from "./formSaving";
import { KeeFieldIcon } from "./keeFieldIcon";
import { MatchResult } from "./MatchResult";
import { FindMatchesBehaviour } from "./findMatchesBehaviour";
import { KeeLogger, KeeLog } from "../common/Logger";
import { Config } from "../common/config";
import { keeLoginField, keeLoginInfo } from "../common/kfDataModel";
import { configManager } from "../common/ConfigManager";

declare const punycode;

// Pretend browser (WebExtensions) is chrome (we include a
// polyfill from Mozilla but it doesn't work in some cases)
declare const chrome;

class FillAndSubmitAction { fill: boolean; submit: boolean; }

class SubmitCandidate {
    distance: number;
    element: HTMLElement;
    score: number;
}

class FieldMatchScoreConfig {
    punishWrongIDAndName: boolean;
}

class VisibleFieldCache {
    password: boolean[];
    other: boolean[];
}

export class FormFilling {

    private findLoginOp: any = {};
    private matchResult: MatchResult = new MatchResult();
    private keeFieldIcon: KeeFieldIcon;

    public matchedLoginsPanelStub: PanelStub;
    private matchedLoginsPanelStubRaf: number;

    // Should really make this private and call indirectly but I'm wary of all performance overheads wrt DOM mutation observers
    public formFinderTimer: number = null;

    private distanceMap: Map<Node, number>;

    private semanticWhitelistCache;
    private semanticBlacklistCache;

    constructor (private myPort: browser.runtime.Port,
        private parentFrameId: number,
        private formUtils: FormUtils,
        private formSaving: FormSaving,
        private Logger: KeeLogger,
        private config: Config,
        private matchFinder: {(uri: string): void}) {

        this.keeFieldIcon = new KeeFieldIcon(myPort, parentFrameId, formUtils, this.createMatchedLoginsPanelNearNode.bind(this));
    }

    public executePrimaryAction () {
        if (this.matchResult.logins && this.matchResult.logins.length > 0 && this.matchResult.mostRelevantFormIndex != null && this.matchResult.mostRelevantFormIndex >= 0) {
            if (this.matchResult.logins[this.matchResult.mostRelevantFormIndex].length == 1) {
                this.fillAndSubmit(false, this.matchResult.mostRelevantFormIndex, 0);
                this.closeMatchedLoginsPanel();
            } else if (this.matchResult.logins[this.matchResult.mostRelevantFormIndex].length > 1) {
                this.closeMatchedLoginsPanel();
                this.matchedLoginsPanelStub = new PanelStub(PanelStubOptions.MatchedLogins, null, this.parentFrameId);
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
        this.matchedLoginsPanelStub = new PanelStub(PanelStubOptions.MatchedLogins, target, this.parentFrameId);
        this.matchedLoginsPanelStub.createPanel();
        this.matchedLoginsPanelStubRaf = requestAnimationFrame(() => this.updateMatchedLoginsPanelPosition());
    }

    public closeMatchedLoginsPanel () {
        if (this.matchedLoginsPanelStub) this.matchedLoginsPanelStub.closePanel();
        this.matchedLoginsPanelStub = null;
        cancelAnimationFrame(this.matchedLoginsPanelStubRaf);
    }

    public updateMatchedLoginsPanelPosition () {
        this.matchedLoginsPanelStub.updateBoundingClientRect();
        this.matchedLoginsPanelStubRaf = requestAnimationFrame(() => this.updateMatchedLoginsPanelPosition());
    }

    private calculateFieldMatchScore (formField: keeLoginField, dataField, currentPage, config: FieldMatchScoreConfig, isVisible?: boolean)
    {
        // Default score is 1 so that bad matches which are at least the correct type
        // have a chance of being selected if no good matches are found
        let score = 1;

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
        ) {
            score += 50;
        } else if (config.punishWrongIDAndName && dataField.fieldId) {
            score -= 5;
        }

        // If field names match ++++
        // (We do not treat ID and NAME as mutually exclusive because some badly written
        // websites might have duplicate IDs but different names so this combined approach
        // might allow them to work correctly)
        if (formField.name != null && formField.name != undefined
                && formField.name != "" && formField.name == dataField.name
        ) {
            score += 40;
        } else if (config.punishWrongIDAndName && dataField.name) {
            score -= 5;
        }

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

        if (isVisible === undefined && this.formUtils.isDOMElementVisible(formField.DOMInputElement || formField.DOMSelectElement))
            isVisible = true;

        score += isVisible ? 35 : 0;

        return score;
    }

    private fillMatchedFields (fieldScoreMatrix, dataFields, formFields, automated: boolean)
    {
        // We want to make sure each data field is matched to only one form field but we
        // don't know which field will be the best match and we don't want to ignore
        // less accurate matches just because they happen to appear later.

        // We have a matrix of objects representing each possible combination of data field
        // and form field and the score for that match.
        // We choose what to fill by sorting that list by score.
        // After filling a field we remove all objects from the list which are for the
        // data field we just filled in and the form field we filled in.

        // This means we always fill each form field only once, with the best match
        // selected from all data fields that haven't already been selected for another form field

        // The above algorithm could maybe be tweaked slightly in order to auto-fill
        // a "change password" form if we ever manage to make that automated

        // (score is reduced by one for each position we find in the form - this gives
        // a slight priority to fields at the top of a form which can be useful occasionally)

        fieldScoreMatrix.sort(function (a, b) {
            return b.score - a.score;
        });

        // Remember what we've filled in so we can make more accurate decisions when
        // the form is submitted later. We resist the urge the index by element ID or
        // the DOMelement itself because some websites do not specify an ID and some
        // may remove the DOMelement before we submit the form (sometimes under user
        // direction but occasionally automatically too)
        const filledFields: FilledField[] = [];

        // Keep filling in fields until we find no more with a positive score
        while (fieldScoreMatrix.length > 0 && fieldScoreMatrix[0].score > 0)
        {
            const ffi = fieldScoreMatrix[0].formFieldIndex;
            const dfi = fieldScoreMatrix[0].dataFieldIndex;
            let DOMelement;

            if (formFields[ffi].type === "select-one")
                DOMelement = formFields[ffi].DOMSelectElement;
            else
                DOMelement = formFields[ffi].DOMInputElement;

            const currentValue = this.getFormFieldCurrentValue(DOMelement, formFields[ffi].type);

            if (automated && currentValue && currentValue !== DOMelement.keeInitialDetectedValue) {
                this.Logger.info("Not filling field because it's not empty and was edited by user since last load/fill");
            } else {
                this.Logger.info("We will populate field " + ffi + " (id:" + formFields[ffi].fieldId + ")");
                this.fillASingleField(DOMelement, formFields[ffi].type, dataFields[dfi].value);
            }

            filledFields.push({
                id: formFields[ffi].fieldId,
                DOMelement: DOMelement,
                name: formFields[ffi].name,
                value: dataFields[dfi].value
            });

            fieldScoreMatrix = fieldScoreMatrix.filter(function (element, index, array) {
                return (element.dataFieldIndex != dfi && element.formFieldIndex != ffi);
            });

            fieldScoreMatrix.sort(function (a, b) {
                return b.score - a.score;
            });
        }
        return filledFields;
    }

    private getFormFieldCurrentValue (DOMelement: any, fieldType: string) {
        let currentValue = DOMelement.value;
        if (fieldType === "checkbox") {
            if (DOMelement.checked) {
                currentValue = "KEEFOX_CHECKED_FLAG_TRUE";
            } else {
                currentValue = "KEEFOX_CHECKED_FLAG_FALSE";
            }
        }
        return currentValue;
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

        domElement.keeInitialDetectedValue = value;

        domElement.dispatchEvent(new UIEvent("input", {view: window, bubbles: true, cancelable: true}));
        domElement.dispatchEvent(new UIEvent("change", {view: window, bubbles: true, cancelable: true}));
    }

    private fillManyFormFields (formFields, dataFields, currentPage, scoreConfig: FieldMatchScoreConfig, automated: boolean)
    {
        this.Logger.debug("_fillManyFormFields started");

        if (formFields == null || formFields == undefined || dataFields == null || dataFields == undefined)
            return;

        this.Logger.debug("We've received the data we need");

        this.Logger.info("Filling form fields for page "+currentPage);

        // we try to fill every form field. We try to match by id first and then name before just guessing.
        // Generally we'll only fill if the matched field is of the same type as the form field but
        // we are flexible RE text and username fields because that's an artificial difference
        // for the sake of the Kee password management software. However, usernames will be chosen above
        // text fields if all else is equal
        const fieldScoreMatrix = [];

        for (let i = 0; i < formFields.length; i++)
        {
            for (let j = 0; j < dataFields.length; j++)
            {
                const score = this.calculateFieldMatchScore(
                    formFields[i], dataFields[j], currentPage, scoreConfig);
                this.Logger.debug("Suitability of putting data field "+j+" into form field "+i
                    +" (id: "+formFields[i].fieldId + ") is " + score);
                fieldScoreMatrix.push({score: score, dataFieldIndex: j, formFieldIndex: i});
            }
        }

        return this.fillMatchedFields(fieldScoreMatrix, dataFields, formFields, automated);
    }

    private initMatchResult (behaviour: FindMatchesBehaviour)
    {
        //TODO:4: #6 create new object might cause issues with multi-page or submit behaviour? if not, this would be neater:
        // matchResult = new MatchResult();
        this.matchResult.UUID = "";
        this.matchResult.logins = [];
        this.matchResult.mostRelevantFormIndex = null;

        this.matchResult.mustAutoFillForm = false;
        this.matchResult.cannotAutoFillForm = false;
        this.matchResult.mustAutoSubmitForm = false;
        this.matchResult.cannotAutoSubmitForm = false;

        if (behaviour.UUID != undefined && behaviour.UUID != null && behaviour.UUID != "")
        {
            // Keep a record of the specific entry we are going to search for (we delete
            // the tabstate below and re-create it during form fill)
            this.matchResult.UUID = behaviour.UUID;
            this.matchResult.dbFileName = behaviour.dbFileName;

            // we want to fill the form with this data
            this.matchResult.mustAutoFillForm = true;

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
        this.semanticWhitelistCache = {};
        this.semanticBlacklistCache = {};

        // Whether or not this was invoked as a result of a DOM mutation, we won't need the timer to fire anymore
        if (this.formFinderTimer !== null) {
            clearTimeout(this.formFinderTimer);
            this.formFinderTimer = null;
        }

        if (window.document.forms.length > 50) {
            this.Logger.debug("Too many forms on this page. Assuming it is not a login page"
             + " and avoiding looking for login forms in order to avoid performance impact.");
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

        this.Logger.info("Finding matches in a document. readyState: " + window.document.readyState);

        this.initMatchResult(behaviour);
        this.matchResult.forms = forms;

        const conf = configManager.siteConfigFor(url.href);

        this.Logger.debug("findMatches processing " + forms.length + " forms");

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

            if (otherFields.length + passwordFields.length > 50) {
                this.Logger.debug("Lost interest in this form after finding too many fields");
                continue;
            }

            // We want to fill in this form if we find a password field but first
            // we check whether any whitelist or blacklist entries must override that behaviour
            let interestingForm: boolean = null;

            interestingForm = configManager.isFormInteresting(form, conf, otherFields);

            if (interestingForm === false)
            {
                this.Logger.debug("Lost interest in this form after inspecting field names and IDs");
                continue;
            }

            const noPasswordField = passwordFields == null || passwordFields.length <= 0 || passwordFields[0] == null;
            const noOtherField = usernameIndex < 0 || otherFields == null || otherFields.length <= 0 || otherFields[usernameIndex] == null;

            if (noPasswordField && (noOtherField || interestingForm !== true))
            {
                this.Logger.debug("No password field found in this form and either there are no other" +
                    " fields or no whitelisted text field or form element");
                continue;
            }

            let submitTargetNeighbour: HTMLElement;
            if (noPasswordField)
            {
                submitTargetNeighbour = otherFields[usernameIndex].DOMInputElement || otherFields[usernameIndex].DOMSelectElement;
            } else {
                submitTargetNeighbour = passwordFields[0].DOMInputElement;
            }

            this.attachSubmitHandlers(form, submitTargetNeighbour, i);

            this.matchResult.usernameIndexArray[i] = usernameIndex;
            this.matchResult.passwordFieldsArray[i] = passwordFields;
            this.matchResult.otherFieldsArray[i] = otherFields;
            this.matchResult.submitTargets[i] = submitTargetNeighbour;

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
    }

    // It's OK for this to take a few seconds - humans can't type that fast.
    // By making this async we allow the search for logins to begin earlier
    // and reduce perceived impact on page load time
    private async attachSubmitHandlers (form: HTMLFormElement, submitTargetNeighbour: HTMLElement, formNumber: number) {
        try {
            await Promise.resolve();
            const start = performance.now();
            const submitTarget = this.findSubmitButton(form, submitTargetNeighbour);
            this.formSaving.addSubmitHandler(submitTarget, form);
            KeeLog.info("Submit handlers attached asynchronously to form " + formNumber + " in " + (performance.now()-start) + "ms");
        } catch (e) {
            KeeLog.warn("Exception while adding submit handler. Message: " + e.message);
        }
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
                addEventListener: function (name: string, handler) { return; }, //TODO:4: hook up to the submit function to simulate real form submission
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
            matchResult.logins[i] = JSON.parse(crString); //TODO:4: faster clone? https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm ?

            // Nothing to do if we have no matching logins available.
            if (matchResult.logins[i].length == 0)
                continue;

            this.Logger.info("match found!");

            const formVisible = this.formUtils.isDOMElementVisible(matchResult.submitTargets[i]);
            this.Logger.debug("formVisible: " + formVisible);

            const visibleFieldCache = {
                other: matchResult.otherFieldsArray[i].map(f => this.formUtils.isDOMElementVisible(f.DOMInputElement || f.DOMSelectElement)),
                password: matchResult.passwordFieldsArray[i].map(f => this.formUtils.isDOMElementVisible(f.DOMInputElement || f.DOMSelectElement))
            };

            // determine the relevance of each login entry to this form
            // we could skip this when autofilling based on uniqueID but we would have to check for
            // matches first or else we risk no match and no alternative matching logins on the mainUI
            // and we also now consider the totality of possible matches against a field in order
            // to limit which fields we shove a Kee icon into.
            for (let v = 0; v < matchResult.logins[i].length; v++)
            {
                const features = matchResult.logins[i][v].database.sessionFeatures;
                const fieldMatchScoreConfig: FieldMatchScoreConfig = {
                    punishWrongIDAndName: features.indexOf("KPRPC_FIELD_DEFAULT_NAME_AND_ID_EMPTY") >= 0
                };
                const {score, lowFieldMatchRatio} = this.calculateRelevanceScore(matchResult.logins[i][v],
                    matchResult.passwordFieldsArray[i], matchResult.otherFieldsArray[i],
                    matchResult.currentPage, formVisible, fieldMatchScoreConfig, visibleFieldCache);

                // choosing best login form should not be affected by lowFieldMatchRatio login score
                // but when we come to fill the form we can force ourselves into a no-auto-fill behaviour.
                matchResult.logins[i][v].relevanceScore = score;
                matchResult.logins[i][v].lowFieldMatchRatio = lowFieldMatchRatio;

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

    getMostRelevantForm (formIndex?: number)
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
    }

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
            this.myPort.postMessage({ logins: matchResult.logins[matchResult.mostRelevantFormIndex] });

            // Give the user a way to choose a login interactively
            this.keeFieldIcon.addKeeIconToFields(passwordFields, otherFields, matchResult.logins[matchResult.mostRelevantFormIndex]);
        }

        // this records the login that we eventually choose as the one to fill the chosen form with
        let matchingLogin = null;
        let action: FillAndSubmitAction = { fill: false, submit: false };
        let multipleMatches = false;

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
                multipleMatches = true;

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
                //TODO:4: #6 multi-page
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
                if (!automated)//TODO:4: #6 multi-page || tabState.currentPage <= 0)
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
                    //TODO:4: #6: multi-page
                    // // always assume page 1 (very rare cases will go wrong - see github KeeFox #411 for relevant enhancement request)
                    // // Possible regression since v1.4: We used to ignore currentPage entirely for the first
                    // // page of a submission, now we might try to give preference to page 1 fields (though total
                    // // relevance score shouldn't be shifted by enough to affect otherwise well-matched fields)
                    // tabState.currentPage = 1;
                    // tabState.maximumPage = maximumPageCount;
                    // this.Logger.debug("currentPage is: " + tabState.currentPage);
                    // this.Logger.debug("maximumPage is: " + tabState.maximumPage);
                }

                // Default auto-fill behaviour depends upon whether this is automatic or
                // manual, the corresponding user "automatic" option, if there are one or many matches
                // and the user option to prevent automatic fill due to multiple matches
                const autoFillEnabled = isMatchedLoginRequest || ( (automated && multipleMatches && !this.config.autoFillFormsWithMultipleMatches)
                    ? false : this.config.autoFillForms);

                // Default auto-submit behaviour depends upon whether this is automatic or manual and the corresponding user option
                const autoSubmitEnabled = isMatchedLoginRequest ? this.config.autoSubmitMatchedForms : this.config.autoSubmitForms;

                action = { fill: autoFillEnabled, submit: autoSubmitEnabled };

                // Override fill preferences from per-entry configuration options
                // unless user explicity selected the matched login
                if (!isMatchedLoginRequest) {
                    if (matchingLogin.alwaysAutoFill) action.fill = true;
                    if (matchingLogin.neverAutoFill) action.fill = false;
                }

                // Override submit preferences from per-entry configuration options
                if (!isMatchedLoginRequest || !this.config.manualSubmitOverrideProhibited) {
                    if (matchingLogin.alwaysAutoSubmit) action.submit = true;
                    if (matchingLogin.neverAutoSubmit) action.submit = false;
                }

                if (action.fill || matchResult.mustAutoFillForm)
                {
                    this.Logger.debug("Going to auto-fill a form");

                    const features = matchingLogin.database.sessionFeatures;
                    const scoreConfig: FieldMatchScoreConfig = {
                        punishWrongIDAndName: features.indexOf("KPRPC_FIELD_DEFAULT_NAME_AND_ID_EMPTY") >= 0
                    };
                    const lastFilledPasswords = this.fillManyFormFields(passwordFields, matchingLogin.passwords,
                        -1, scoreConfig, automated);
                    const lastFilledOther = this.fillManyFormFields(otherFields, matchingLogin.otherFields,
                        -1, scoreConfig, automated);
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
        //TODO:4: #6: multi-page
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

        if (!matchResult.cannotAutoSubmitForm && (action.submit || matchResult.mustAutoSubmitForm)
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
        const candidates: SubmitCandidate[] = [];
        const DISTANCE_MAX_SCORE = 100;
        const DISTANCE_DIFFERENCE_FACTOR = 20;
        const VISIBLE_SCORE = 60;
        const CAT_BUTTONINFORM_SCORE = 60;
        const CAT_SUBMITINPUTINFORM_SCORE = 50;
        const CAT_BUTTONOUTSIDEFORM_SCORE = 40;
        const CAT_IMAGEINPUTINFORM_SCORE = 40;
        const CAT_BUTTONINPUTINFORM_SCORE = 30;
        const CAT_BUTTONROLEINFORM_SCORE = 20;
        const CAT_BUTTONROLEOUTSIDEFORM_SCORE = 10;
        let minScoreToWin = 0;
        const distanceCalc = (v, t) => this.commonAncestorDistance(v, t, distanceMap);
        const distanceMap = new Map<Node, number>();
        const fUtils = this.formUtils;

        function verifyPotentialCandidate (value: HTMLElement, score: number) {

            // abort early if we can't win even with a perfect visibility and distance score
            if (minScoreToWin > score + VISIBLE_SCORE + DISTANCE_MAX_SCORE) return;

            const isVisible = fUtils.isDOMElementVisible(value);

            // Some forms are hidden (e.g. Twitter) and simply revealed to the user at a later time
            // Therefore we should only punish based on visibility if the form submitTargetNeighbour is visible.
            if (isVisible || !fUtils.isDOMElementVisible(submitTargetNeighbour)) {
                score += VISIBLE_SCORE;
            }

            // abort early if we can't win even with a perfect visibility and distance score
            if (minScoreToWin > score + DISTANCE_MAX_SCORE) return;

            candidates.push({
                distance: distanceCalc(value, submitTargetNeighbour),
                element: value,
                score: score
            });

            minScoreToWin = score;
        }
        /*
            In Firefox Array.from...foreach is about 50% faster than the alternative in this comment below... but 20% slower in Chrome.
            const buttons = form.ownerDocument.getElementsByTagName("button");
            for (let i=0; i<buttons.length; i++) {
                const value = buttons[i];
                ...
            */
        Array.from(form.ownerDocument.getElementsByTagName("button")).forEach( value => {
            if (!value.isConnected) return;
            if (!value.type || value.type != "reset")
            {
                const semanticValues: string[] = [];
                if (value.name) semanticValues.push(value.name.toLowerCase());
                if (value.textContent) semanticValues.push(value.textContent.toLowerCase());
                if (value.value) semanticValues.push(value.value.toLowerCase());

                let score = this.scoreAdjustmentForMagicWords(semanticValues, 50, this.semanticWhitelistCache, this.semanticBlacklistCache);
                score += (value.form && value.form == form) ? CAT_BUTTONINFORM_SCORE : CAT_BUTTONOUTSIDEFORM_SCORE;

                verifyPotentialCandidate(value, score);
            }
        });

        Array.from(form.getElementsByTagName("input")).forEach( value => {
            if (!value.isConnected) return;
            if (value.type != null)
            {
                let semanticScore = 0;

                if (value.type == "submit" || value.type == "button")
                {
                    if (value.name)
                    {
                        semanticScore += this.scoreAdjustmentForMagicWords([value.name.toLowerCase()], 50, this.semanticWhitelistCache, this.semanticBlacklistCache);
                    }

                    // Names are more important but sometimes they don't exist or are random
                    // so check what is actually displayed to the user
                    if (value.value)
                    {
                        semanticScore += this.scoreAdjustmentForMagicWords([value.value.toLowerCase()], 40, this.semanticWhitelistCache, this.semanticBlacklistCache);
                    }

                    if (value.id)
                    {
                        semanticScore += this.scoreAdjustmentForMagicWords([value.id.toLowerCase()], 20, this.semanticWhitelistCache, this.semanticBlacklistCache);
                    }
                }

                if (value.type == "submit" || value.type == "button" || value.type == "image")
                {
                    let score = semanticScore;
                    score += value.type == "button" ? CAT_BUTTONINPUTINFORM_SCORE :
                        (value.type == "image" ? CAT_IMAGEINPUTINFORM_SCORE :
                            CAT_SUBMITINPUTINFORM_SCORE);
                    verifyPotentialCandidate(value, score);
                }
            }
        });

        Array.from(form.ownerDocument.querySelectorAll("[role=button]:not(button)")).forEach( (value: any) => {
            if (!value.isConnected) return;
            const semanticValues: string[] = [];

            // technical
            if (value.name) semanticValues.push(value.name.toLowerCase());
            if (value.id) semanticValues.push(value.id.toLowerCase());

            // user visible
            if (value.title) semanticValues.push(value.title.toLowerCase());
            if (value.innerText) semanticValues.push(value.innerText.toLowerCase());
            if (value.dataSet && value.dataSet.length > 0) {
                if (value.dataSet.tooltip) semanticValues.push(value.dataSet.tooltip.toLowerCase());
            }
            if (value.hasAttribute("aria-label")) semanticValues.push(value.getAttribute("aria-label").toLowerCase());

            let score = this.scoreAdjustmentForMagicWords(semanticValues, 50, this.semanticWhitelistCache, this.semanticBlacklistCache);
            score += (value.form && value.form == form) ? CAT_BUTTONROLEINFORM_SCORE : CAT_BUTTONROLEOUTSIDEFORM_SCORE;
            verifyPotentialCandidate(value, score);
        });

        if (candidates.length <= 0) return null;
        if (candidates.length === 1) return candidates[0].element;

        const submitElements = candidates.sort((a, b) => {
            if (a.distance > b.distance) return -1;
            if (a.distance < b.distance) return 1;
            return 0;
        });

        const maxDistanceDifference = submitElements[0].distance - submitElements[submitElements.length-1].distance;
        const distanceScore = Math.min(DISTANCE_MAX_SCORE, DISTANCE_DIFFERENCE_FACTOR * maxDistanceDifference);
        let distanceFactor = 1/submitElements.length;
        let lastDistance = submitElements[0].distance;
        submitElements.forEach((candidate, index, elements) => {
            if (candidate.distance < lastDistance) {
                distanceFactor = (index+1)/elements.length;
                lastDistance = candidate.distance;
            }
            candidate.score += distanceFactor*distanceScore;
        });

        //TODO:4: more accurate searching of submit buttons, etc. to avoid password resets if possible
        // maybe special cases for common HTML output patterns (e.g. javascript-only ASP.NET forms)


        let maxScore = submitElements[0].score;
        let maxScoreElement = submitElements[0].element;
        for (let i=1; i<submitElements.length; i++) {
            if (submitElements[i].score > maxScore) {
                maxScore = submitElements[i].score;
                maxScoreElement = submitElements[i].element;
            }
        }
        return maxScoreElement;
    }

    private scoreAdjustmentForMagicWords (
        semanticValues: string[],
        factor: number,
        semanticWhitelistCache,
        semanticBlacklistCache) {

        //TODO:4: other languages
        const goodWords = ["submit", "login", "enter", "log in", "signin",
            "sign in", "next", "continue"];
        const badWords = ["reset", "cancel", "back", "abort", "undo", "exit",
            "empty", "clear", "captcha", "totp", "forgot", "dismiss", "delete",
            "show", "reveal"];
        let goodScore = false;
        let badScore = false;

        for (let i=0; i < semanticValues.length; i++) {
            if (goodScore) break;
            if (!semanticValues[i]) continue;
            const semanticValue = semanticValues[i].trim();
            if (!semanticValue) continue;

            if (semanticWhitelistCache[semanticValue] === true) {
                goodScore = true;
                break;
            }
            if (semanticWhitelistCache[semanticValue] === false) {
                continue;
            }
            for (let j=0; j < goodWords.length; j++) {
                if (semanticValue.indexOf(goodWords[j]) >= 0) {
                    goodScore = true;
                    semanticWhitelistCache[semanticValue] = true;
                    break;
                } else {
                    semanticWhitelistCache[semanticValue] = false;
                }
            }
        }
        for (let i=0; i < semanticValues.length; i++) {
            if (badScore) break;
            if (!semanticValues[i]) continue;
            const semanticValue = semanticValues[i].trim();
            if (!semanticValue) continue;

            if (semanticBlacklistCache[semanticValue] === true) {
                badScore = true;
                break;
            }
            if (semanticBlacklistCache[semanticValue] === false) {
                continue;
            }
            for (let j=0; j < badWords.length; j++) {
                if (semanticValue.indexOf(badWords[j]) >= 0) {
                    badScore = true;
                    semanticBlacklistCache[semanticValue] = true;
                    break;
                } else {
                    semanticBlacklistCache[semanticValue] = false;
                }
            }
        }

        if (goodScore && badScore) return 0;
        if (badScore) return -1*factor;
        if (goodScore) return factor;
        return 0;
    }

    private commonAncestorDistance (nodeA: Node, nodeB: Node, distanceMap: Map<Node, number>)
    {
        let distance = 1;
        let found = false;
        const pendingMap: Array<Node> = [];
        let pendingMapStartDistance = 0;

        // eslint-disable-next-line no-cond-assign
        while (nodeA = nodeA.parentElement) {
            const cachedNodeDistance = distanceMap.get(nodeA);

            // If we already know how far the parent is we can return early but we may have learnt about more nodes on our way
            if (cachedNodeDistance !== undefined) {
                distance += cachedNodeDistance;
                pendingMapStartDistance = cachedNodeDistance + 1;
                found = true;
                break;
            }

            // we know we don't know how far this node is so lets implicitly store how far we have got so far
            pendingMap.push(nodeA);

            if (nodeA.contains(nodeB)) {
                found = true;
                break;
            }
            distance++;
        }

        if (found) {
            // each node that we came across on our journey can be assigned a value of how far it is from the common parent
            if (pendingMap.length > 0) {
                for (let i = pendingMapStartDistance; i < distance && pendingMap.length > 0; i++) {
                    const node = pendingMap.pop();
                    distanceMap.set(node, i);
                }
            }
            return distance;
        } else {
            // Disconnected node (I guess - probably won't ever happen)
            return 9007199254740991;
        }
    }

    // Submit a form
    private submitForm (form: HTMLFormElement, submitTargetNeighbour: HTMLElement)
    {
        const submitElement = this.findSubmitButton(form, submitTargetNeighbour);

        // Avoid searching for matching passwords upon auto-submission
        this.formSaving.removeAllSubmitHandlers();

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

        //TODO:4: maybe something like this might be useful? Dunno why a click()
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

    private calculateRelevanceScore (login: keeLoginInfo, passwordFields: keeLoginField[],
        otherFields: keeLoginField[], currentPage: number, formVisible: boolean,
        scoreConfig: FieldMatchScoreConfig, visibleFieldCache: VisibleFieldCache) {

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

        score += login.matchAccuracy;

        // Punish but don't entirely exclude matches against invisible forms
        // This is in addition to the maximum score of invisible fields being limited
        // so that forms with some visible fields but invisible username/password
        // fields (or our best guess at them anyway) are considered a less likely match
        if (!formVisible)
            score -= 20;

        // This is similar to _fillManyFormFields so might be able to reuse the results in future
        // (but need to watch for changes that invalidate the earlier calculations).

        // Require at least a type match for 2-field forms (e.g. user/pass); 1 missing
        // match for 3 or 4 field forms; etc.
        const minMatchedFieldCountRatio = 0.501;


        // Must be careful to not let radio fields cause false negatives
        // Other fields which can't ever be matched to minimum relevance
        // are discounted later so we don't consider them here
        //TODO: Why? Shouldn't we discount all radio types from total
        //counts below as for empty fields?
        // I think this is rubbish now and no longer needed but don't fully
        // understand why there was an exception in the first place so
        // leaving here for a version or two in case bugs relating to
        // radio buttons crop up
        // for (let i = 0; i < login.otherFields.length; i++)
        // {
        //     if (login.otherFields[i].type == "radio")
        //         otherFieldMatchSuccesses[i] = true;
        // }

        const [ otherRelevanceScore, otherFieldMatchSuccesses ] = this.determineRelevanceScores(
            "other", otherFields, login.otherFields, currentPage, scoreConfig, visibleFieldCache.other);
        const [ passwordRelevanceScore, passwordFieldMatchSuccesses ] = this.determineRelevanceScores(
            "password", passwordFields, login.passwords, currentPage, scoreConfig, visibleFieldCache.password);

        const totalRelevanceScore = otherRelevanceScore + passwordRelevanceScore;

        // Only consider fields that can ever match above the minimum (essentially
        // ignore empty form or entry fields). Will underestimate number of form
        // fields, resulting in increased match ratio and less accurate relevancy
        // scores for forms that contain a username/password field with no name
        // or id attributes. No idea if this will cause a problem. Seems to.
        // Mitigating by adjusting min relevancy values, etc. so can remove
        // this comment in a few versions if all is good.
        const formFieldCount = passwordFields.concat(otherFields)
            .filter(f => f.fieldId || f.name || f.value).length;
        const loginFieldCount = login.passwords.concat(login.otherFields)
            .filter(f => f.fieldId || f.name || f.value).length;

        const formMatchedFieldCount = otherFieldMatchSuccesses.filter(s => s === true).length
            + passwordFieldMatchSuccesses.filter(s => s === true).length;

        const fieldMatchRatio = formMatchedFieldCount / (Math.max(1, formFieldCount));

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

    private determineRelevanceScores (debugName: string, formFields: keeLoginField[], loginFields: keeLoginField[],
        currentPage: number, scoreConfig: FieldMatchScoreConfig, visibleFieldMap: boolean[]): [ number, boolean[] ] {

        let totalRelevanceScore = 0;
        const minFieldRelevance = 1;
        const fieldMatchSuccesses: boolean[] = [];

        for (let i = 0; i < formFields.length; i++) {
            let mostRelevantScore = 0;
            for (let j = 0; j < loginFields.length; j++) {
                const fmscore = this.calculateFieldMatchScore(formFields[i], loginFields[j], currentPage, scoreConfig, visibleFieldMap[i]);
                this.Logger.debug("Suitability of putting " + debugName + " field " + j + " into form field " + i
                    + " (id: " + formFields[i].fieldId + ") is " + fmscore);
                if (fmscore > mostRelevantScore) {
                    mostRelevantScore = fmscore;
                }
                const fmscoreForRatio = fmscore - (visibleFieldMap[i] ? 35 : 0);
                if (fmscoreForRatio >= minFieldRelevance
                    && loginFields[j].value
                    && !fieldMatchSuccesses[i]) {
                    fieldMatchSuccesses[i] = true;
                }
                if (formFields[i].highestScore == null || fmscore > formFields[i].highestScore) {
                    formFields[i].highestScore = fmscore;
                }
            }
            totalRelevanceScore += mostRelevantScore;
        }
        return [ totalRelevanceScore, fieldMatchSuccesses ];
    }

    public removeKeeIconFromAllFields () {
        this.keeFieldIcon.removeKeeIconFromAllFields();
    }

}
