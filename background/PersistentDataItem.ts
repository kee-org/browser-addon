class PersistentDataItem {
    itemType: "submittedData";
    submittedData?: SubmittedData;
    submittedLogin?: keeLoginInfo;
    creationDate: Date;
    accessCount: number;
    maxAccessCount: number;
}
