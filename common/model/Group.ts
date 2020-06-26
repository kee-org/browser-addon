import { EntrySummary } from "./EntrySummary";
import { Icon } from "./Icon";
import { utils } from "../utils";
import { GroupDto } from "./KPRPCDTOs";

export class Group {
    readonly title: string;
    readonly uuid: string;
    readonly icon: Icon;
    readonly path: string;
    readonly entrySummaries: EntrySummary[];
    readonly groups: Group[];
    //childEntries: Entry[] - this is only needed if we ever request GetAllDatabases(true) but Kee currently has no need for this KPRPC feature

    constructor(g: Partial<Group>) {
        this.title = g.title || "";
        this.uuid = g.uuid || utils.newGUID();
        this.icon = g.icon || { version: 1, iconImageData: "" };
        this.path = g.path || "UNKNOWN PATH";
        this.entrySummaries = g.entrySummaries || [];
        this.groups = g.groups || [];
    }

    public static fromKPRPCGroupDTO(groupDto: GroupDto, dbFileName: string) {
        return new Group({
            title: groupDto.title,
            uuid: groupDto.uniqueID,
            icon: { version: 1, iconImageData: groupDto.iconImageData },
            path: groupDto.path,
            entrySummaries: groupDto.childLightEntries.map(childLightEntry =>
                EntrySummary.fromKPRPCEntrySummaryDTO(childLightEntry, groupDto.path, dbFileName)
            ),
            groups: groupDto.childGroups.map(childGroup =>
                this.fromKPRPCGroupDTO(childGroup, dbFileName)
            )
        });
    }
}
