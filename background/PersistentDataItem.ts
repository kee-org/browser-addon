/// <reference path="../common/SubmittedData.ts" />
/// <reference path="../common/kfDataModel.ts" />

class PersistentDataItem {
    itemType: "submittedData";
    submittedData?: SubmittedData;
    submittedLogin?: keeFoxLoginInfo;
    creationDate: Date;
    accessCount: number;
    maxAccessCount: number;
}
