import { SessionType } from "./SessionType";

export class Database {
    name: string;
    fileName: string;
    iconImageData: string;
    root: any;
    active: boolean;
    sessionType: SessionType;
    sessionFeatures: string[];
}
