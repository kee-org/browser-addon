import { KeeLogger } from "../common/Logger";
import { MatchedField } from "./MatchedField";
import { Field } from "../common/model/Field";

/*
  This contains code related to the management and manipulation of forms and form fields.
*/

export class FormUtils {
    findLoginOps = [];
    matchResults = [];
    Logger: KeeLogger;

    constructor(logger: KeeLogger) {
        this.Logger = logger;
    }

    countAllDocuments(frame: Window) {
        if (!this.isUriWeCanFill(frame.location)) return 0;

        let localDocCount = 1;

        if (frame.frames.length > 0) {
            const frames = frame.frames;
            for (let i = 0; i < frames.length; i++) {
                localDocCount += this.countAllDocuments(frames[i]);
            }
        }
        return localDocCount;
    }

    isUriWeCanFill(uri) {
        if (uri.protocol == "http:" || uri.protocol == "https:" || uri.protocol == "file:") {
            return true;
        }
        return false;
    }

    isATextFormFieldType(type) {
        if (
            type == "checkbox" ||
            type == "select-one" ||
            type == "radio" ||
            type == "password" ||
            type == "hidden" ||
            type == "submit" ||
            type == "button" ||
            type == "file" ||
            type == "image" ||
            type == "reset"
        ) {
            return false;
        } else return true;
    }

    private isAKnownUsernameString(fieldNameIn) {
        const fieldName = fieldNameIn.toLowerCase();
        if (
            fieldName == "username" ||
            fieldName == "j_username" ||
            fieldName == "user_name" ||
            fieldName == "user" ||
            fieldName == "user-name" ||
            fieldName == "login" ||
            fieldName == "vb_login_username" ||
            fieldName == "name" ||
            fieldName == "user name" ||
            fieldName == "user id" ||
            fieldName == "user-id" ||
            fieldName == "userid" ||
            fieldName == "email" ||
            fieldName == "e-mail" ||
            fieldName == "id" ||
            fieldName == "form_loginname" ||
            fieldName == "wpname" ||
            fieldName == "mail" ||
            fieldName == "loginid" ||
            fieldName == "login id" ||
            fieldName == "login_name" ||
            fieldName == "openid_identifier" ||
            fieldName == "authentication_email" ||
            fieldName == "openid" ||
            fieldName == "auth_email" ||
            fieldName == "auth_id" ||
            fieldName == "authentication_identifier" ||
            fieldName == "authentication_id" ||
            fieldName == "customer_number" ||
            fieldName == "customernumber" ||
            fieldName == "onlineid"
        ) {
            // etc. etc.
            return true;
        }
        return false;
    }

    /*
     * getFormFields
     *
     * Returns the usernameIndex and password fields found in the form.
     * Can handle complex forms by trying to figure out what the
     * relevant fields are.
     *
     * Returns: [usernameIndex, passwords, ...]
     * all arrays are standard javascript arrays
     * usernameField may be null.
     */
    public getFormFields(form, isSubmission: boolean, maximumFieldCount: number) {
        const pwFields: MatchedField[] = [];
        const otherFields: MatchedField[] = [];
        const allFields: {
            index: number;
            element: MatchedField;
            type: string;
        }[] = [];
        let firstPasswordIndex = -1;
        let firstPossibleUsernameIndex = -1;
        let usernameIndex = -1;

        // search the DOM for any form fields we might be interested in
        const totalElements = form.elements.length;
        const elementLimit = totalElements < 2000 ? totalElements : 2000;
        for (let i = 0; i < elementLimit; i++) {
            if (allFields.length > maximumFieldCount) {
                throw new Error("Too many fields");
            }
            if (
                form.elements[i].localName.toLowerCase() == "object" ||
                form.elements[i].localName.toLowerCase() == "keygen" ||
                form.elements[i].localName.toLowerCase() == "output" ||
                (form.elements[i].localName.toLowerCase() != "input" &&
                    (form.elements[i].type == undefined || form.elements[i].type == null))
            ) {
                continue; // maybe it's something un-interesting
            }

            const domType: string = form.elements[i].type.toLowerCase();

            if (domType == "fieldset") continue; // not interested in fieldsets

            if (
                domType != "password" &&
                !this.isATextFormFieldType(domType) &&
                domType != "checkbox" &&
                domType != "radio" &&
                domType != "select-one"
            ) {
                continue; // ignoring other form types
            }

            if (domType == "radio" && isSubmission && form.elements[i].checked == false) continue;
            if (domType == "password" && isSubmission && !form.elements[i].value) continue;
            if (domType == "select-one" && isSubmission && !form.elements[i].value) continue;

            this.Logger.debug(`processing field with domtype ${domType}...`);
            allFields[allFields.length] = {
                index: i,
                element: new MatchedField(),
                type: domType
            };
            let fieldValue = form.elements[i].value;
            if (domType == "checkbox") {
                if (form.elements[i].checked) fieldValue = "KEEFOX_CHECKED_FLAG_TRUE";
                else fieldValue = "KEEFOX_CHECKED_FLAG_FALSE";
            }
            const field = Field.fromDOM(form.elements[i], domType, fieldValue);
            allFields[allFields.length - 1].element.field = field;
            allFields[allFields.length - 1].element.DOMelement = form.elements[i];

            if (domType == "password" && firstPasswordIndex == -1) {
                firstPasswordIndex = allFields.length - 1;
            }

            if (
                this.isATextFormFieldType(domType) &&
                firstPossibleUsernameIndex == -1 &&
                (this.isAKnownUsernameString(form.elements[i].name) ||
                    field.locators[0].labels?.some(label => this.isAKnownUsernameString(label)))
            ) {
                firstPossibleUsernameIndex = allFields.length - 1;
            }

            if (form.elements[i].keeInitialDetectedValue == null) {
                form.elements[i].keeInitialDetectedValue = fieldValue;
            }
        }

        // Work out which DOM form element is most likely to be the username field.
        // This information is only used to display the username to the user so an inaccurate
        // choice won't impact the form detection or filling behaviour.
        //TODO:4: Extend this to inspect more than just the name of the field. E.g. max length?
        //TODO:4: For form filling (not submitting) we might want to select based upon found data in KeePass?
        if (firstPossibleUsernameIndex != -1) usernameIndex = firstPossibleUsernameIndex;
        else if (firstPasswordIndex > 0) usernameIndex = firstPasswordIndex - 1;
        this.Logger.debug("usernameIndex: " + usernameIndex);

        let otherCount = 0;
        let actualUsernameIndex = 0;

        // separate the field data into appropriate variables
        for (let i = 0; i < allFields.length; i++) {
            if (allFields[i].type == "password") pwFields[pwFields.length] = allFields[i].element;
            else if (
                this.isATextFormFieldType(allFields[i].type) ||
                allFields[i].type == "checkbox" ||
                allFields[i].type == "radio" ||
                allFields[i].type == "select-one"
            ) {
                otherFields[otherFields.length] = allFields[i].element;
                if (i == usernameIndex) actualUsernameIndex = otherCount;
                else otherCount++;
            }
        }

        this.Logger.debug("actualUsernameIndex: " + actualUsernameIndex);
        this.Logger.debug("otherFields.length:" + otherFields.length);

        return {
            actualUsernameIndex,
            pwFields,
            otherFields
        };
    }

    // A basic, slightly flawed but fast visibility test
    public isDOMElementVisible(element: HTMLElement) {
        if (!element.offsetParent && element.offsetHeight === 0 && element.offsetWidth === 0) {
            return false;
        }
        return true;
    }

    // // used for multipage stuff that we might not be able to support yet in webextensions
    // resetFormFillSession () {
    //     if (resetFormFillTimer != null) {
    //         clearTimeout(resetFormFillTimer);
    //         resetFormFillTimer = null;
    //     }
    //     tabState.currentPage = 0;
    //     tabState.maximumPage = 0;
    //     tabState.forceAutoSubmit = null;
    //     tabState.userRecentlyDemandedAutoSubmit = false;
    //     Logger.debug("Reset form-filling session (page = 0 and cancelled any forced autosubmit).");
    // };
    //var resetFormFillTimer = null;
}
