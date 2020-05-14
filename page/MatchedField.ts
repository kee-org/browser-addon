import { Field } from "../common/model/Field";

export class MatchedField {
    field: Field;
    DOMelement: HTMLInputElement | HTMLSelectElement;
    highestScore: number;
}
