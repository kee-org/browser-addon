import { utils } from "../utils";
import { Locator } from "./Locator";
import { FieldDto, FieldDto2, FieldMatcherConfig, FieldMatcherType, FieldTypeEnum, FormFieldTypeDTO } from "./KPRPCDTOs";

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

    // The KDBX field name - "." when value is stored within the KPRPC configuration
    //readonly valuePath: string;

    // type of data this field represents. There's no 100% way to match this to the type of HTML form element but it's often logical.
    // E.g. password goes into password fields unless user explicitly re-configures that; existing would typically match something
    // like a radio button or select option already present on the HTML form; boolean would match a checkbox.
    readonly type: FieldType;

    // How we can find the correct target in the HTML.
    readonly locators: Locator[];

    // tracks the most recent value we want to reset to in cases where the user has that possibility
    readonly resetValue: string;

    constructor(field: Partial<Field>) {
        this.name = field.name || "";
        this.value = field.value || "";
   //     this.valuePath = field.valuePath || ".";
        this.resetValue = field.resetValue || "";
        this.uuid = field.uuid || utils.newGUID();
        this.type = field.type || "text";
        this.locators = field.locators || [];
    }

    private static getDisplayValueInternal(
        field: Field,
        revealPasswords: boolean,
        replacementIfProtected: string
    ) {
        if (field.type === "boolean") {
            return field.value === "KEEFOX_CHECKED_FLAG_TRUE" ? $STR("enabled") : $STR("disabled");
        } else {
            return field.type === "password" && !revealPasswords
                ? replacementIfProtected
                : field.value;
        }
    }

    static getDisplayValue(field: Field, revealPasswords: boolean) {
        return Field.getDisplayValueInternal(
            field,
            revealPasswords,
            "*".repeat(field.value.length)
        );
    }

    static getDisplayName(field: Field) {
        if (field.name === "KeePass username") {
            return $STR("username");
        } else if (field.name === "KeePass password") {
            return $STR("password");
        } else {
            return field.name ? field.name : "[ " + $STR("no_name") + " ]";
        }
    }

    static getDisplayTooltip(field: Field, revealPasswords: boolean) {
        return (
            Field.getDisplayName(field) +
            ": " +
            Field.getDisplayValueInternal(field, revealPasswords, $STR("click_to_reveal_hide"))
        );
    }

    static typeFromDOMtype(domType: string): FieldType {
        // We can't know every type that may exist in future so assume:
        // 1. unknown types must be text
        // 2. we won't be asked to handle types for irrelevant elements such as buttons
        switch (domType) {
            case "password":
                return "password";
            case "radio":
                return "existing";
            case "checkbox":
                return "boolean";
            case "select-one":
                return "existing";
            default:
                return "text";
        }
    }

    static typeEnumFromDOMtype(domType: string): FieldTypeEnum {
        // We can't know every type that may exist in future so assume:
        // 1. unknown types must be text
        // 2. we won't be asked to handle types for irrelevant elements such as buttons
        switch (domType) {
            case "password":
                return FieldTypeEnum.Password;
            case "radio":
                return FieldTypeEnum.Existing;
            case "checkbox":
                return FieldTypeEnum.Toggle;
            case "select-one":
                return FieldTypeEnum.Existing;
            default:
                return FieldTypeEnum.Text;
        }
    }
    // By convention the first non-password item will be the username and the password will be either 1st or 2nd in the list
    static combineDomFieldLists(usernameIndex: number, otherFields: Field[], passwords: Field[]) {
        const fields: Field[] = [];
        if (usernameIndex >= 0 && otherFields[usernameIndex]) {
            fields.push(otherFields[usernameIndex]);
        }
        passwords.forEach(f => {
            fields.push(f);
        });
        otherFields.forEach((f, index) => {
            if (index !== usernameIndex) {
                fields.push(f);
            }
        });
        return fields;
    }

    static fromDOM(element: any, domType: string, value: string) {
        const labels = collectLabels(element);
        return new Field({
            uuid: utils.newGUID(),
            name: labels && labels.length ? labels[0] : element.name,
            locators: [
                new Locator({
                    name: element.name,
                    id: element.id,
                    type: domType,
                    labels,
                    autocompleteValues: collectAutocompleteValues(element)
                })
            ],
            value,
            type: Field.typeFromDOMtype(domType)
        });
    }

    static fromKPRPCFieldDTO(f: FieldDto) {
        let type: FieldType = "text";
        let locatorType = "text";

        switch (f.type) {
            case FormFieldTypeDTO.password:
                type = "password";
                locatorType = "password";
                break;
            case FormFieldTypeDTO.radio:
                type = "existing";
                locatorType = "radio";
                break;
            case FormFieldTypeDTO.checkbox:
                type = "boolean";
                locatorType = "checkbox";
                break;
            case FormFieldTypeDTO.select:
                type = "existing";
                locatorType = "select";
                break;
            case FormFieldTypeDTO.username:
                type = "text";
                locatorType = "text";
                break;
            case FormFieldTypeDTO.text:
                type = "text";
                locatorType = "text";
                break;
        }

        return new Field({
            name: f.displayName || f.name,
            uuid: utils.newGUID(),
            value: f.value,
            resetValue: f.value,
            type: type,
            locators: [
                new Locator({
                    id: f.id,
                    name: f.name,
                    type: locatorType
                })
            ]
        });
    }

    static fromKPRPCFieldDTO2(f: FieldDto2) {
        //TODO: Could defer this until rendering the name? Might have to?
        let displayName = f.name;
        if (f.type == FieldTypeEnum.Password && f.valuePath == "Password") {
            displayName ??= "Password";
        }
        else if (f.type == FieldTypeEnum.Text && f.valuePath == "UserName") {
            displayName ??= "Username";
        }
        const fmc = f.matcherConfigs[0] ?? FieldMatcherConfig.defaultForType(f.type);
        return new Field({
            name: displayName || f.uuid,
            uuid: f.uuid,
            value: f.resolvedValue,
            resetValue: f.resolvedValue,
            type: fieldTypeEnumToFieldType(f.type),
            locators: [
                Locator.fromFieldMatcherConfig(fmc)
            ]
        });
    }

    static toKPRPCFieldDTO(f: Field, isUsername: boolean) {
        let fft: FormFieldTypeDTO;

        switch (f.locators[0].type) {
            case "password":
                fft = FormFieldTypeDTO.password;
                break;
            case "radio":
                fft = FormFieldTypeDTO.radio;
                break;
            case "checkbox":
                fft = FormFieldTypeDTO.checkbox;
                break;
            case "select-one":
                fft = FormFieldTypeDTO.select;
                break;
            default:
                fft = isUsername ? FormFieldTypeDTO.username : FormFieldTypeDTO.text;
                break;
        }

        return {
            displayName: f.name,
            id: f.locators[0].id,
            name: f.locators[0].name,
            type: fft,
            value: f.value,
            page: -1
        } as FieldDto;
    }

    static toKPRPCFieldDTO2(f: Field, isUsername: boolean, isPassword: boolean) {
        let fft: FormFieldTypeDTO;

        switch (f.locators[0].type) {
            case "password":
                fft = FormFieldTypeDTO.password;
                break;
            case "radio":
                fft = FormFieldTypeDTO.radio;
                break;
            case "checkbox":
                fft = FormFieldTypeDTO.checkbox;
                break;
            case "select-one":
                fft = FormFieldTypeDTO.select;
                break;
            default:
                fft = isUsername ? FormFieldTypeDTO.username : FormFieldTypeDTO.text;
                break;
        }

        let valuePath = ".";
        let defaultMatcherType;
        if (isUsername) {
            valuePath = "UserName";
            defaultMatcherType = FieldMatcherType.UsernameDefaultHeuristic;
        } else if (isPassword) {
            valuePath = "Password";
            defaultMatcherType = FieldMatcherType.PasswordDefaultHeuristic;
        }

        let mc = FieldMatcherConfig.fromLocator(f.locators[0], defaultMatcherType);

        return {
            name: f.name,
            type: fieldTypeToFieldTypeEnum(f.type),
            value: f.value,
            uuid: f.uuid,
            matcherConfigs: [mc],
            valuePath: valuePath,
            page: -1
        } as FieldDto2;
    }
}

// Might be other element types but main thing is they have the labels property
function collectLabels(element: HTMLInputElement | HTMLSelectElement) {
    const labels: string[] = [];
    const labelsCount = element.labels?.length || 0;
    for (let i = 0; i < labelsCount; i++) {
        const label = element.labels[i];
        if (label?.innerText) labels.push(label.innerText);
    }
    const ariaLabel = element.getAttribute("aria-label")?.toLowerCase();
    if (ariaLabel) labels.push(ariaLabel);
    const ariaLabelIds: string[] = [];
    element
        .getAttribute("aria-labelledby")
        ?.trim()
        .split(" ")
        .forEach(id => {
            if (id) ariaLabelIds.push(id);
        });
    element
        .getAttribute("aria-describedby")
        ?.trim()
        .split(" ")
        .forEach(id => {
            if (id) ariaLabelIds.push(id);
        });
    ariaLabelIds.forEach(id => {
        const labelElement = document.getElementById(id);
        if (labelElement?.innerText) labels.push(labelElement.innerText);
    });
    return labels.length ? labels : undefined;
}

function collectAutocompleteValues(element: HTMLInputElement | HTMLSelectElement) {
    const values: string[] = [];
    element.attributes["autocomplete"]?.value
        ?.trim()
        .split(" ")
        .forEach(v => {
            if (v) values.push(v.toLowerCase());
        });
    return values.length ? values : undefined;
}
function fieldTypeEnumToFieldType(type: FieldTypeEnum): FieldType {
    switch (type) {
        case FieldTypeEnum.Existing: return "existing";
        case FieldTypeEnum.Otp: return "otp";
        case FieldTypeEnum.Password: return "password";
        case FieldTypeEnum.SomeChars: return "some-chars";
        case FieldTypeEnum.Text: return "text";
        case FieldTypeEnum.Toggle: return "boolean";
    }
}
function fieldTypeToFieldTypeEnum(type: FieldType): FieldTypeEnum {
    switch (type) {
        case "boolean": return FieldTypeEnum.Toggle;
        case "existing": return FieldTypeEnum.Existing;
        case "otp": return FieldTypeEnum.Otp;
        case "password": return FieldTypeEnum.Password;
        case "some-chars": return FieldTypeEnum.SomeChars;
        case "text": return FieldTypeEnum.Text;
    }
}
export function fieldTypeEnumToDOMTypeEstimate(type: FieldTypeEnum): string {
    // We should only need to do this as a defence against bugs elsewhere or perhaps if
    // someone uses an out of date version of some KPRPC software during the switch to V2 config
    switch (type) {
        case FieldTypeEnum.Existing: return "radio";
        case FieldTypeEnum.Password: return "password";
        case FieldTypeEnum.Toggle: return "checkbox";
        default: return "text";
    }
}

