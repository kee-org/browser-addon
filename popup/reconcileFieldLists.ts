import { Field } from "../common/model/Field";
import { Locator } from "../common/model/Locator";

function locatorMatches(locator1: Locator, locator2: Locator) {
    if (locator1.type !== locator2.type) return false;
    if (locator1.id === locator2.id && locator1.name === locator2.name) return true;
    return false;
}

function fieldMatches(oldField: Field, newField: Field) {
    if (oldField.type !== newField.type) return false;
    if (oldField.value === newField.value) return true;
    if (
        oldField.locators.some(locator1 =>
            newField.locators.some(locator2 => locatorMatches(locator1, locator2))
        )
    ) {
        return true;
    }
    return false;
}

export function reconcileFieldLists(oldFields: Field[], newFields: Field[]) {
    // If field value or location can be matched against an existing field,
    // assume it is a new version of the same field. Otherwise we'll list
    // all fields from both existing and newly submitted data.
    // By convention we will treat the first field in the newFields array
    // as the new username field, regardless of which of the oldFields it
    // can be matched to, if any.

    // Future implementations could take advantage of the new Field model
    // to establish some sort of match score but for this first version we
    // just accept the first match that we find.

    const fields: Field[] = [];

    newFields.forEach(newField => {
        const matchingIndex = oldFields.findIndex(oldField => fieldMatches(oldField, newField));
        if (matchingIndex >= 0) {
            oldFields.splice(matchingIndex, 1);
        }
        fields.push(newField);
    });

    oldFields.forEach(f => fields.push(f));

    return fields;
}
