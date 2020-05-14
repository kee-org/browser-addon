import { Icon } from "./Icon";
import { utils } from "../utils";
import { GroupSummaryDto } from "./KPRPCDTOs";
import { Group } from "./Group";

export class GroupSummary {
    readonly title: string;
    readonly uuid: string;
    readonly icon: Icon;
    readonly path: string;

    constructor (g: Partial<GroupSummary>) {
        this.title = g.title || "";
        this.uuid = g.uuid || utils.newGUID();
        this.icon = g.icon || { version: 1, iconImageData: "" };
        this.path = g.path || "UNKNOWN PATH";
    }

    public static fromKPRPCGroupSummaryDTO (groupSummaryDto: GroupSummaryDto) {
        return new GroupSummary({
            title: groupSummaryDto.title,
            uuid: groupSummaryDto.uniqueID,
            icon: { version: 1, iconImageData: groupSummaryDto.iconImageData },
            path: groupSummaryDto.path
        });
    }

    public static fromGroup (group: Group) {
        return new GroupSummary({
            title: group.title,
            uuid: group.uuid,
            icon: group.icon,
            path: group.path
        });
    }
}
