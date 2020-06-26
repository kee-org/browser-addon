import { SaveState } from "../common/SaveState";
import { Entry } from "../common/model/Entry";
import { reconcileFieldLists } from "./reconcileFieldLists";

export function supplementEntryState(entry: Entry, saveState: SaveState, urls?: string[]) {
    const sd = saveState.submittedData;
    const submittedFields = sd ? sd.fields : [];
    const newFields = reconcileFieldLists(
        JSON.parse(JSON.stringify(entry.fields)),
        submittedFields
    );
    const overwriteWithSubmittedData = (sd
        ? {
              URLs: [sd.url],
              fields: newFields,
              title: sd.title
          }
        : {}) as Entry;
    const overwriteWithURLs = (urls
        ? {
              URLs: urls
          }
        : {}) as Entry;
    return Object.assign({}, entry, overwriteWithSubmittedData, overwriteWithURLs);
}
