import { SubmittedData } from "../common/SubmittedData";

export class PersistentDataItem {
    itemType: "submittedData";
    submittedData?: SubmittedData;
    creationDate: Date;
    accessCount: number;
    maxAccessCount: number;
}
