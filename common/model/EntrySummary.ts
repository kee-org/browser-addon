import { Entry } from "./Entry";

export class EntrySummary {
    iconImageData: string;
    usernameValue: string;
    usernameName: string;
    path: string;
    title: string;
    uRLs: string[];
    url: string;
    uniqueID: string;
    dbFileName: string;
    relevanceScore: number;
    fullDetails?: Entry;
}
