import { SubmittedData } from "./SubmittedData";
import { Entry } from "./model/Entry";

export class SaveState {
    originalEntry?: Entry;
    newEntry: Entry = new Entry({});
    submittedData?: SubmittedData;
    lastActiveAt?: Date;
}
