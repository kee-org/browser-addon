/// <reference path="../common/Button.ts" />

class KeeFoxNotification {

    constructor (
            public name: string,
            public buttons: Button[],
            public id: string, //Guid
            public message: string,
            public priority: "High" | "Medium" | "Low"
        ) {}

    render () {
        const container = document.createElement("div");
        const doc = container.ownerDocument;
        this.renderStandardMessage(container);
        this.renderButtons(container);
        return container;
    }

    renderButtons (container: HTMLDivElement) {

        let buttonContainer = null;
        buttonContainer = document.createElement("div");
        buttonContainer.classList.add("keefox-button-actions");

        for (const buttonDefinition of this.buttons)
        {
            let button = null;
            button = document.createElement("button");
            button = this.prepareNotificationButton(button, buttonDefinition);

            buttonContainer.appendChild(button);
        }
        container.appendChild(buttonContainer);
        return container;
    }

    renderStandardMessage (container: HTMLDivElement) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("flex1");
        const text = document.createElement("span");
        text.textContent = this.message;
        text.classList.add("KeeFox-message");
        msgDiv.appendChild(text);
        container.firstChild.insertBefore(msgDiv, container.firstChild.firstChild);
        return container;
    }

    prepareNotificationButton (button, buttonDefinition: Button)
    {
        button.setAttribute("label", buttonDefinition.label);
        if (buttonDefinition.tooltip != undefined) button.setAttribute("title", buttonDefinition.tooltip);

        let callback: {(): void};
        //if (typeof buttonDefinition.action == "string") {
            callback = this.dispatchActionResponse.bind(this, buttonDefinition.action);
        //} else {
        //    callback = buttonDefinition.action;
        //}

        button.addEventListener("click", callback, false); //TODO:c:keyboard nav support
        if (buttonDefinition.id != null)
            button.setAttribute("id", buttonDefinition.id);
        // if (buttonDefinition.values != null)
        // {
        //     for(var pi=0; pi < buttonDefinition.values.length; pi++)
        //     {
        //         var key = buttonDefinition.values[pi].key;
        //         var val = buttonDefinition.values[pi].value;
        //         button.setUserData(key, val, null);
        //     }
        // }
        return button;
    }

    dispatchActionResponse (action: string) {
        switch (action) {
            case "unknown" : break;
            //TODO:c: what actions will we actually need to send back to the background script from a notification button click?
        }
        window["myPort"].postMessage({ removeNotification: this.id });
    }
}
