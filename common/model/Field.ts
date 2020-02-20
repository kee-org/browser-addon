import { keeLoginField, keeFormFieldType } from "../kfDataModel";
import { utils } from "../utils";
import { Locator } from "./Locator";

export type FieldType = "password" | "text" | "existing" | "boolean" | "otp" | "some-chars";

export class Field {

    // Unique ID that we can use to help UI operations and identification when there is no known name for this field.
    // Also may be useful in future for multiple-page reconfiguration or per-browser field configuration overrides?
    readonly uuid: string;

    // visual identifier for the field. May be specified by the user or inferred from
    // either default Entry data (username/password/OTP) or form field label or name attribute
    readonly name: string;

    // The value we'll fill into the form.
    // For existing determines which option to activate.
    // For boolean determines whether to activate or deactivate (to ignore, delete the field record)
    // For OTP, need to work out whether we will have to transfer the secrets and recalculate in the browser or just treat as standard value
    readonly value: string;

    // type of data this field represents. There's no 100% way to match this to the type of HTML form element but it's often logical.
    // E.g. password goes into password fields unless user explicitly re-configures that; existing would typically match something
    // like a radio button or select option already present on the HTML form; boolean would match a checkbox.
    readonly type: FieldType;

    // How we can find the correct target in the HTML. Probably will only want one so can maybe remove the array if that
    // doesn't complicate the Vue normalisation process in the coming weeks.
    readonly locators: Locator[];

    // tracks the most recent value we want to reset to in cases where the user has that possibility
    readonly resetValue: string;

    //TODO: Will only need these once we proceed with further removal of the keeLoginField class
    // The HTML form element DOM objects - transient (not sent to KeePass)
    // DOMInputElement: HTMLInputElement;
    // DOMSelectElement: HTMLSelectElement;
    // Best score for any potential entry that is being considered for selection - transient (not sent to KeePass)
    // highestScore: number;

    constructor (field: Partial<Field>) {
        this.name = field.name || "";
        this.value = field.value || "";
        this.resetValue = field.resetValue || "";
        this.uuid = field.uuid || "";
        this.type = field.type || "text";
    }

    static fromKeeLoginField (f: keeLoginField) {
        let type: FieldType = "text";
        let locatorType: string = "text";

        switch (f.type) {
            case "password": type = "password"; locatorType = "password"; break;
            case "radio": type = "existing"; locatorType = "radio"; break;
            case "checkbox": type = "boolean"; locatorType = "checkbox"; break;
            case "select-one": type = "existing"; locatorType = "select"; break;
            case "text": type = "text"; locatorType = "text"; break;
        }

        return new Field({
            name: f.name,
            uuid: utils.newGUID(),
            value: f.value,
            resetValue: f.value,
            type: type,
            locators: [new Locator({
                id: f.fieldId,
                name: f.name,
                type: locatorType
            })]
        });
    }
}
