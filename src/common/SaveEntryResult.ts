export class SaveEntryResult {
    result: "created" | "updated" | "error" | null;
    receivedAt: Date;
    fileName: string;
    uuid: string;
}
