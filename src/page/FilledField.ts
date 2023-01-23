// This is a similar concept to the MatchedField class but represents
// the actual value filled into the associated field in the DOM

export class FilledField {
    id: string;
    DOMelement: HTMLInputElement | HTMLSelectElement;
    name: string;
    value: string;
}
