/// <reference path="../common/Button.ts" />

class KeeFoxNotification {

    constructor (
            public name: string,
            public buttons: Button[],
            public id: string, //Guid
            public message: string,
            public priority: "High" | "Medium" | "Low",
            public allowMultiple: boolean
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
        container.appendChild(msgDiv);
        return container;
    }

    prepareNotificationButton (button: HTMLButtonElement, buttonDefinition: Button)
    {
        button.innerHTML = buttonDefinition.label;
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
            case "enableHighSecurityKPRPCConnection":
                configManager.current.connSLClient = 3;
                configManager.save();
                break;
            case "unknown" : break;
        }
        window["myPort"].postMessage({ removeNotification: this.id });
    }
}
