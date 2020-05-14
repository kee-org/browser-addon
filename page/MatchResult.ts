import { FilledField } from "./FilledField";
import { Entry } from "../common/model/Entry";
import { MatchedField } from "./MatchedField";

export class MatchResult {
    entries: Entry[][];
    submitTargets: HTMLElement[];
    usernameIndexArray: number[];
    passwordFieldsArray: MatchedField[][];
    otherFieldsArray: MatchedField[][];
    currentPage: number;
    allMatchingLogins: any[];
    formRelevanceScores: number[];
    UUID: string;
    mustAutoFillForm: boolean;
    cannotAutoFillForm: boolean;
    mustAutoSubmitForm: boolean;
    cannotAutoSubmitForm: boolean;
    dbFileName: string;
    doc: Document;
    forms: HTMLFormElement[];
    formReadyForSubmit: boolean;
    autofillOnSuccess: boolean;
    autosubmitOnSuccess: boolean;
    notifyUserOnSuccess: boolean;
    wrappers: any[];
    requestCount: number;
    responseCount: number;
    requestIds: any[];
    mostRelevantFormIndex?: number;
    lastFilledOther: FilledField[];
    lastFilledPasswords: FilledField[];
}
