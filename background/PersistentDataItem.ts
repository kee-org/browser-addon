import { SubmittedData } from "../common/SubmittedData";
import { keeLoginInfo } from "../common/kfDataModel";

export class PersistentDataItem {
    itemType: "submittedData";
    submittedData?: SubmittedData;
    submittedLogin?: keeLoginInfo;
    creationDate: Date;
    accessCount: number;
    maxAccessCount: number;
}
