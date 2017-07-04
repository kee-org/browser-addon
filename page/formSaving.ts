/// <reference path="../common/Logger.ts" />

class FormSaving {

    private Logger: KeeFoxLogger;

    constructor (logger: KeeFoxLogger) {
        this.Logger = logger;
    }

    // This won't always be called before all event handlers on the web page so on
    // some sites we will store invalid data (in cases where the login scripts
    // mangle the contents of the fields before submitting them).
    //TODO:c: Possibly could slightly reduce incidence of this problem by listening
    // to every click on the document body or tracking all input events but performance?
    public submitHandler (e: Event, form: HTMLFormElement) {
        this.Logger.debug("submitHandler called");
    }
}
