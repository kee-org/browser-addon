import { keeLoginInfo } from "./kfDataModel";
import { SubmittedData } from "./SubmittedData";

export class SaveState {
    originalEntry?: keeLoginInfo;
    newEntry?: keeLoginInfo;
    submittedData?: SubmittedData;
    startedAt?: Date;
}
