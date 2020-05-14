import { Entry } from "./Entry";
import { Icon } from "./Icon";
import { utils } from "../utils";
import { EntrySummaryDto } from "./KPRPCDTOs";

export class EntrySummary {
    icon: Icon;
    usernameValue: string;
    usernameName: string;
    path: string;
    title: string;
    uRLs: string[];
    url: string;
    uuid: string;
    dbFileName: string;
    relevanceScore: number;
    fullDetails?: Entry; //TODO:4: remove circular reference by maintaining independent Entry lookup by uuid?

    constructor (e: Partial<EntrySummary>) {
        this.icon = e.icon || { version: 1, iconImageData: "" };
        this.usernameValue = e.usernameValue || "<no username>";
        this.usernameName = e.usernameName || "<no username>";
        this.path = e.path || "UNKNOWN PATH";
        this.title = e.title || "";
        this.uRLs = e.uRLs || [];
        this.url = e?.url || "";
        this.uuid = e.uuid || utils.newGUID();
        this.dbFileName = e.dbFileName || "";
        this.relevanceScore = e.relevanceScore;
        this.fullDetails = e.fullDetails;
    }

    public static fromEntry (entry: Entry) {
        return new EntrySummary({
            icon: entry.icon,
            usernameValue: Entry.getUsernameField(entry).value,
            usernameName: Entry.getUsernameField(entry).name,
            title: entry.title,
            uRLs: entry.URLs,
            url: entry?.URLs[0],
            uuid: entry.uuid,
            dbFileName: entry.database.fileName,
            fullDetails: entry
        });
    }

    public static fromKPRPCEntrySummaryDTO (entrySummaryDto: EntrySummaryDto, path: string, dbFileName: string) {
        return new EntrySummary({
            icon: { version: 1, iconImageData: entrySummaryDto.iconImageData },
            usernameValue: entrySummaryDto.usernameValue,
            usernameName: entrySummaryDto.usernameName,
            path,
            title: entrySummaryDto.title,
            uRLs: entrySummaryDto.uRLs,
            url: entrySummaryDto?.uRLs[0],
            uuid: entrySummaryDto.uniqueID,
            dbFileName
        });
    }
}

