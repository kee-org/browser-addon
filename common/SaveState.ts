import { SubmittedData } from "./SubmittedData";
import { Entry } from "./model/Entry";

export class SaveState {
    originalEntry?: Entry;
    newEntry: Entry = new Entry({});
    titleResetValue: string;
    submittedData?: SubmittedData;
    lastActiveAt?: Date;
}
