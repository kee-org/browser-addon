import { EntrySummary } from "./EntrySummary";
import { Icon } from "./Icon";
import { utils } from "../utils";
import { GroupDto, GroupDto2 } from "./KPRPCDTOs";

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

    public static fromKPRPCGroupDTO2(groupDto: GroupDto2, dbFileName: string) {
        return new Group({
            title: groupDto.title,
            uuid: groupDto.uniqueID,
            icon: { version: 1, iconImageData: groupDto.icon.base64 },
            path: groupDto.path,
            entrySummaries: groupDto.childLightEntries.map(childLightEntry =>
                EntrySummary.fromKPRPCLightEntryDto2(childLightEntry, groupDto.path, dbFileName)
            ),
            groups: groupDto.childGroups.map(childGroup =>
                this.fromKPRPCGroupDTO2(childGroup, dbFileName)
            )
        });
    }

    public static containsId(group: Group, id: string) {
        if (group.uuid === id) return true;
        if (group.groups && group.groups.some(g => Group.containsId(g, id))) return true;
        return false;
    }
    public static matchingId(group: Group, id: string): Group | null {
        if (group.uuid === id) {
            return group;
        }

        for (const childGroup of group.groups) {
            const matchingChildGroup = Group.matchingId(childGroup, id);
            if (matchingChildGroup) {
                return matchingChildGroup;
            }
        }

        return null;
    }

}
