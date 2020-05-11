import { SaveState } from "../common/SaveState";
import { Entry, mapToFields } from "../common/model/Entry";
import { reconcileFieldLists } from "./reconcileFieldLists";

export function supplementEntryState (entry: Entry, saveState: SaveState, urls?: string[]) {
    const sd = saveState.submittedData;
    const submittedFields = sd ? mapToFields(sd.usernameIndex, sd.otherFields, sd.passwordFields) : [];
    const newFields = reconcileFieldLists(JSON.parse(JSON.stringify(entry.fields)), submittedFields);
    const overwrite = (sd ? {
        URLs: urls ?? [sd.url],
        fields: newFields,
        title: sd.title
    //TODO: e.iconImageData
    } : {}) as Entry;
    return Object.assign(Object.assign({}, entry), overwrite);
}
