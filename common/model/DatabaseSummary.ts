import { DatabaseSummaryDto } from "./KPRPCDTOs";
import { Icon } from "./Icon";
import { GroupSummary } from "./GroupSummary";
import { Database } from "./Database";

export class DatabaseSummary {
    name: string;
    fileName: string;
    icon: Icon;
    root: GroupSummary;
    active: boolean;

    constructor (db: Partial<DatabaseSummary>) {
        this.name = db.name || "";
        this.fileName = db.fileName || "";
        this.icon = db.icon || { version: 1, iconImageData: "" };
        this.root = db.root || new GroupSummary({});
        this.active = db.active || false;
    }

    public static fromKPRPCDatabaseSummaryDTO (dto: DatabaseSummaryDto) {
        return new DatabaseSummary({
            name: dto.name,
            fileName: dto.fileName,
            icon: { version: 1, iconImageData: dto.iconImageData },
            root: GroupSummary.fromKPRPCGroupSummaryDTO(dto.root),
            active: dto.active
        });
    }

    public static fromDatabase (db: Database) {
        return new DatabaseSummary({
            name: db.name,
            fileName: db.fileName,
            icon: db.icon,
            root: GroupSummary.fromGroup(db.root)
        });
    }
}
