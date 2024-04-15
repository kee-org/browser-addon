import { Entry } from "./Entry";
import { Icon } from "./Icon";
import { utils } from "../utils";
import { EntrySummaryDto, LightEntryDto2 } from "./KPRPCDTOs";

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
    isPreferredMatch?: boolean;

    constructor(e: Partial<EntrySummary>) {
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
        this.isPreferredMatch = e.isPreferredMatch;
    }

    public static fromEntry(entry: Entry) {
        return new EntrySummary({
            icon: entry.icon,
            usernameValue: Entry.getUsernameField(entry)?.value,
            usernameName: Entry.getUsernameField(entry)?.name,
            title: entry.title,
            uRLs: entry.URLs,
            url: entry?.URLs[0],
            uuid: entry.uuid,
            dbFileName: entry.database.fileName,
            fullDetails: entry,
            isPreferredMatch: entry.isPreferredMatch
        });
    }

    public static fromKPRPCEntrySummaryDTO(
        entrySummaryDto: EntrySummaryDto,
        path: string,
        dbFileName: string
    ) {
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

    public static fromKPRPCLightEntryDto2(
        lightEntryDto2: LightEntryDto2,
        path: string,
        dbFileName: string
    ) {
        return new EntrySummary({
            icon: { version: 1, iconImageData: lightEntryDto2.icon.base64 },
            usernameValue: lightEntryDto2.usernameValue,
            usernameName: lightEntryDto2.usernameName,
            path,
            title: lightEntryDto2.title,
            uRLs: lightEntryDto2.urls,
            url: lightEntryDto2?.urls[0],
            uuid: lightEntryDto2.uniqueID,
            dbFileName
        });
    }
}
