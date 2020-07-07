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

function fieldMatchesType(oldField: Field, newField: Field) {
    if (oldField.type === newField.type) return true;
    return false;
}

export function reconcileFieldLists(oldFields: Field[], newFields: Field[]) {
    // Every new field is included but we try to only include old fields if
    // they aren't for the same purpose as any of the new fields

    // Future implementations could take advantage of the new Field model
    // to establish some sort of match score but for this first version we
    // just accept the first match that we find. If no good match for
    // username or password is found, we pick the first field of the
    // corresponding type

    const fields: Field[] = [];
    const matchedNewFieldIndexes: number[] = [];

    newFields.forEach((newField, newFieldIndex) => {
        if (newField.type !== "text") return;
        let matchingIndex = oldFields.findIndex(oldField => fieldMatches(oldField, newField));
        if (matchingIndex === -1) {
            matchingIndex = oldFields.findIndex(oldField => fieldMatchesType(oldField, newField));
        }
        if (matchingIndex >= 0) {
            fields.push(new Field({ ...newField, resetValue: oldFields[matchingIndex].value }));
            oldFields.splice(matchingIndex, 1);
            matchedNewFieldIndexes.push(newFieldIndex);
        }
    });

    newFields.forEach((newField, newFieldIndex) => {
        if (newField.type !== "password") return;
        let matchingIndex = oldFields.findIndex(oldField => fieldMatches(oldField, newField));
        if (matchingIndex === -1) {
            matchingIndex = oldFields.findIndex(oldField => fieldMatchesType(oldField, newField));
        }
        if (matchingIndex >= 0) {
            fields.push(new Field({ ...newField, resetValue: oldFields[matchingIndex].value }));
            oldFields.splice(matchingIndex, 1);
            matchedNewFieldIndexes.push(newFieldIndex);
        }
    });

    newFields.forEach((newField, newFieldIndex) => {
        if (matchedNewFieldIndexes.indexOf(newFieldIndex) >= 0) return;
        const matchingIndex = oldFields.findIndex(oldField => fieldMatches(oldField, newField));
        if (matchingIndex >= 0) {
            fields.push(new Field({ ...newField, resetValue: oldFields[matchingIndex].value }));
            oldFields.splice(matchingIndex, 1);
        } else {
            fields.push(newField);
        }
    });

    // Keep any old fields we've not yet matched to a new field
    oldFields.forEach(f => fields.push(f));

    return fields;
}
