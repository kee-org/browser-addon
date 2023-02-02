import { Field } from "./model/Field";

export interface SubmittedData {
    url: string;
    fields: Field[];
    title: string;
    isPasswordChangeForm: boolean;
    isRegistrationForm: boolean;
}
