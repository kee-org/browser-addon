import { SaveState } from "../common/SaveState";
import { Entry, mapToFields } from "../common/model/Entry";

export function supplementEntryState (entry: Entry, saveState: SaveState) {
    const sd = saveState.submittedData;
    const overwrite = (sd ? {
        URLs: [sd.url],
        fields: mapToFields(sd.usernameIndex, sd.otherFields, sd.passwordFields),
        title: sd.title
    //TODO: e.iconImageData
    } : {}) as Entry;
    return Object.assign(Object.assign({}, entry), overwrite);
}
