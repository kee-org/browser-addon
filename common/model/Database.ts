import { SessionType } from "./SessionType";
import { DatabaseDto } from "./KPRPCDTOs";
import { Icon } from "./Icon";
import { Group } from "./Group";

export class Database {
    name: string;
    fileName: string;
    icon: Icon;
    root: Group;
    active: boolean;
    sessionType: SessionType;
    sessionFeatures: string[];

    constructor (db: Partial<Database>) {
        this.name = db.name || "";
        this.fileName = db.fileName || "";
        this.icon = db.icon || { version: 1, iconImageData: "" };
        this.root = db.root || new Group({});
        this.active = db.active || false;
        this.sessionType = db.sessionType || SessionType.Event;
        this.sessionFeatures = db.sessionFeatures || [""];
    }

    public static fromKPRPCDatabaseDTO (dto: DatabaseDto, sessionType: SessionType, sessionFeatures: string[]) {
        return new Database({
            name: dto.name,
            fileName: dto.fileName,
            icon: { version: 1, iconImageData: dto.iconImageData },
            root: Group.fromKPRPCGroupDTO(dto.root, dto.fileName),
            active: dto.active,
            sessionType,
            sessionFeatures
        });
    }
}
