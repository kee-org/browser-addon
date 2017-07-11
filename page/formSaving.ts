/// <reference path="../common/Logger.ts" />

interface SubmitHandlerAttachment {
    target: HTMLElement;
    handler: (e: Event) => void;
    form: HTMLFormElement;
}

class FormSaving {

    private Logger: KeeFoxLogger;
    private formUtils: FormUtils;
    private config: Config;
    private SubmitHandlerAttachments: SubmitHandlerAttachment[] = [];
    private savePasswordPanelStub: PanelStub;
    private savePasswordPanelStubRaf: number;

    constructor (logger: KeeFoxLogger, formUtils: FormUtils, config: Config) {
        this.Logger = logger;
        this.formUtils = formUtils;
        this.config = config;
    }

    public addSubmitHandler (target: HTMLElement, formToSubmit: HTMLFormElement) {
        const handler = (e: Event) => this.submitHandler(e, formToSubmit);
        this.SubmitHandlerAttachments.push({ target: target, form: formToSubmit, handler: handler });
        target.addEventListener("click", handler);
        formToSubmit.addEventListener("submit", handler);
    }

    public removeAllSubmitHandlers () {
        this.SubmitHandlerAttachments.forEach(
            attachment => {
                attachment.target.removeEventListener("click", attachment.handler);
                attachment.form.removeEventListener("submit", attachment.handler);
            });
        this.SubmitHandlerAttachments = [];
    }

    public createSavePasswordPanel () {
        this.closeSavePasswordPanel();
        this.savePasswordPanelStub = new PanelStub(PanelStubOptions.SavePassword, null);
        this.savePasswordPanelStub.createPanel();
    }

    public closeSavePasswordPanel () {
        if (this.savePasswordPanelStub) this.savePasswordPanelStub.closePanel();
        this.savePasswordPanelStub = null;
        cancelAnimationFrame(this.savePasswordPanelStubRaf);
    }

    public updateSavePasswordPanelPosition () {
        formSaving.savePasswordPanelStub.updateBoundingClientRect();
        formSaving.savePasswordPanelStubRaf = requestAnimationFrame(formSaving.updateSavePasswordPanelPosition);
    }

    // This won't always be called before all event handlers on the web page so on
    // some sites we will store invalid data (in cases where the login scripts
    // mangle the contents of the fields before submitting them).
    //TODO:c: Possibly could slightly reduce incidence of this problem by listening
    // to every click on the document body or tracking all input events but performance?
    private submitHandler (e: Event, form: HTMLFormElement) {
        this.Logger.debug("submitHandler called");

        // Until the next time we have searched for forms in this page,
        // don't respond to any form submission related events
        formSaving.removeAllSubmitHandlers();

        //TODO:c: form submission
        //let KeeFoxTriggeredThePendingFormSubmission = tabState.KeeFoxTriggeredThePendingFormSubmission;
        //tabState.KeeFoxTriggeredThePendingFormSubmission = false;

        //TODO:c: form submission & multi-page
        /*
        // Increment our page count now that the form has been submitted.
        tabState.currentPage++;
        Logger.debug("currentPage of next page load will be: " + tabState.currentPage);

        // If we have just submitted the last expected page in this form, we'll reset our page count
        // tracker on the assumption that this current submission is unrelated to the previous form
        // fill. Site failures might lead to problems here but probably not big ones very often.
        if (tabState.currentPage > tabState.maximumPage)
        {
            resetFormFillSession();
        }

        // do nothing if KeeFox auto-submitted the form
        if (KeeFoxTriggeredThePendingFormSubmission)
            return;
        */

        const doc = form.ownerDocument;

        this.Logger.debug({ m: "", sm: "URL: " + doc.URL, r: true });
        let isPasswordChangeForm = false;
        let isRegistrationForm = false;

        //TODO:c: form submission
        // under no circumstances will we cancel the form
        // submit so we can set this value now to help us
        // track when pages are being navigated without form
        // submissions and hence aid automatic cancellation
        // of multi-page login forms
        //tabState.formSubmitTrackerCount = 1;
        //tabState.pageLoadSinceSubmitTrackerCount = 0;

        //TODO:c: multi-page
        /*
        var currentPage = tabState.recordFormCurrentPage;
        var savePageCountToTab = true;

        // If this tab has not already recorded the page count, we continue ignoring it.
        // User can start the count by selecting "multi-page login" on the notification bar
        // User cancels (removes TabValue) by cancelling or saving from the notification bar
        // Also cancelled automatically if form count goes beyond 10 (in case user
        // ignores notification bar and starts filling in search forms or something)
        if (currentPage == undefined || currentPage == null || currentPage.length <= 0 || currentPage <= 0)
        {
            currentPage = 1;
        } else if (currentPage >= 10)
        {
            tabState.recordFormCurrentPage = -1;
            tabState.recordFormCurrentStateJSON = null;
            currentPage = 1;
            savePageCountToTab = false;
        }
        */

        // Get the appropriate fields from the form.
        const passwordFields = [];

        // there must be at least one password or otherField
        const { actualUsernameIndex: usernameIndex, pwFields: passwords, otherFields } =
            this.formUtils.getFormFields(form, true); //TODO:c: currentPage

        const conf = configManager.siteConfigFor(doc.URL);

        if (passwords.length > 1) // could be password change form or multi-password login form or sign up form
        {
            // naive duplicate finder - more than sufficient for the number of passwords per domain
            let twoPasswordsMatchIndex=-1;
            for (let i=0; i<passwords.length && twoPasswordsMatchIndex == -1; i++)
                for (let j=i+1; j<passwords.length && twoPasswordsMatchIndex == -1; j++)
                    if (passwords[j].value==passwords[i].value) twoPasswordsMatchIndex=j;

            if (twoPasswordsMatchIndex == -1) // either mis-typed password change form, single password change box form or multi-password login/signup, assuming latter.
            {
                this.Logger.debug("multiple passwords found (with no identical values)");

                for (let i=0; i < passwords.length; i++)
                    passwordFields.push(passwords[i]);

                //TODO:3: try to distingish between multi-password login/signup and typo. maybe: if username exists and matches existing password it is a typo, else multi-password
                //return;
            } else // it's probably a password change form, but may be a sign-up form
            {
                // we need to ignore any fields that were presented to the
                // user as either "old password" or "retype new password"

                this.Logger.debug("Looks like a password change form or new registration form has been submitted");
                // there may be more than one pair of matches - though, we're plucking for the first one
                // we know the index of one matching password

                // if there are only two passwords we already know that they match
                if (passwords.length == 2)
                {
                    passwordFields.push(passwords[0]);
                    //TODO:3: it is also reasonably likely that this indicates a
                    // sign-up form rather than a password change form. decide
                    // which here and flag which one it is for now, we just assume
                    // it's a sign-up form becuase that is more useful for the user in many cases
                    isPasswordChangeForm = false;
                    isRegistrationForm = true;
                } else
                {
                    // Here we assume that any form with 3 passwords on it
                    // is much more likely to be a change password form than
                    // a sign-up form (obviously there will be exceptions but
                    // this is the best we can do for now)
                    // BUT: have not yet implemented reliable password change feature...
                    isPasswordChangeForm = false;
                    isRegistrationForm = false;

                    passwordFields.push(passwords[twoPasswordsMatchIndex]);
                }
            }
        } else if (passwords != null && passwords[0] != null && passwords[0] != undefined)
        {
            passwordFields.push(passwords[0]);
        }
        // at this point, at least one passwordField has been chosen and an
        // oldPasswordField has been chosen if applicable.
        // we have also determined whether this form fill is likely to
        // be a new registration form or password change form

        const submittedData = {
            url: doc.URL,
            usernameIndex,
            passwordFields,
            title: doc.title,
            otherFields,
            //currentPage,
            isPasswordChangeForm,
            isRegistrationForm
            //,savePageCountToTab
        };

        myPort.postMessage({submittedData} as AddonMessage);
    }
}
