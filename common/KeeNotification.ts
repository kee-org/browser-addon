import { Button } from "./Button";
// import { AddonMessage } from "./AddonMessage";
// import { configManager } from "./ConfigManager";

// These notifications are displayed within the Kee browser action popup.
// They may persist for significant lengths of time.
// For transient system notification popups (sometimes known as growls)
// look at the background/NativeNotification class

export class KeeNotification {
    // name: string;
    // buttons: Button[];
    // id: string; //Guid
    // messages: string[];
    // priority: "High" | "Medium" | "Low";

    constructor (
        public name: string,
        public buttons: Button[],
        public id: string, //Guid
        public messages: string[],
        public priority: "High" | "Medium" | "Low"
    ) {}
}

// class KeeNotificationold {

//     // render () {
//     //     const container = document.createElement("div");
//     //     const doc = container.ownerDocument;
//     //     this.renderStandardMessages(container);
//     //     this.renderButtons(container);
//     //     this.renderCloseButton(container);
//     //     return container;
//     // }

//     // renderButtons (container: HTMLDivElement) {

//     //     let buttonContainer = null;
//     //     buttonContainer = document.createElement("div");
//     //     buttonContainer.classList.add("kee-button-actions");

//     //     for (const buttonDefinition of this.buttons)
//     //     {
//     //         let button = null;
//     //         button = document.createElement("button");
//     //         button = this.prepareNotificationButton(button, buttonDefinition);

//     //         buttonContainer.appendChild(button);
//     //     }
//     //     container.appendChild(buttonContainer);
//     //     return container;
//     // }

//     // renderCloseButton (container: HTMLDivElement) {
//     //     const button = document.createElement("span");

//     //     button.classList.add("close-button", "glyphicon", "glyphicon-remove");
//     //     button.setAttribute("title", $STR("close"));

//     //     button.addEventListener("click", () => {
//     //         this.myPort.postMessage({ removeNotification: this.id } as AddonMessage);
//     //     });

//     //     container.appendChild(button);
//     //     return container;
//     // }

//     // renderStandardMessages (container: HTMLDivElement) {
//     //     const msgDiv = document.createElement("div");
//     //     msgDiv.classList.add("flex1");
//     //     this.messages.forEach(message => {
//     //         const text = document.createElement("div");
//     //         text.textContent = message;
//     //         text.classList.add("Kee-message");
//     //         msgDiv.appendChild(text);
//     //     });
//     //     container.appendChild(msgDiv);
//     //     return container;
//     // }

//     // prepareNotificationButton (button: HTMLButtonElement, buttonDefinition: Button)
//     // {
//     //     button.textContent = buttonDefinition.label;
//     //     if (buttonDefinition.tooltip != undefined) button.setAttribute("title", buttonDefinition.tooltip);

//     //     let callback: {(): void};
//     //     //if (typeof buttonDefinition.action == "string") {
//     //         callback = this.dispatchActionResponse.bind(this, buttonDefinition.action, buttonDefinition.values);
//     //     //} else {
//     //     //    callback = buttonDefinition.action;
//     //     //}

//     //     button.addEventListener("click", callback, false); //TODO:4: keyboard nav support
//     //     if (buttonDefinition.id != null)
//     //         button.setAttribute("id", buttonDefinition.id);
//     //     // if (buttonDefinition.values != null)
//     //     // {
//     //     //     for (let pi=0; pi < buttonDefinition.values.length; pi++)
//     //     //     {
//     //     //         const key = buttonDefinition.values[pi].key;
//     //     //         const val = buttonDefinition.values[pi].value;
//     //     //         button.dataset[key] = val;
//     //     //     }
//     //     // }
//     //     return button;
//     // }

//     // dispatchActionResponse (action: ButtonAction, data: { [id: string] : string; }) {
//     //     switch (action) {
//     //         case "enableHighSecurityKPRPCConnection":
//     //             configManager.current.connSLClient = 3;
//     //             configManager.save();
//     //             break;
//     //         case "loadUrlUpgradeKee":
//     //             this.myPort.postMessage({ loadUrlUpgradeKee: true });
//     //             break;
//     //         case "disableNotifyWhenEntryUpdated":
//     //             configManager.current.notifyWhenEntryUpdated = false;
//     //             configManager.save();
//     //             break;
//     //         case "launchLoginEditorFromNotification":
//     //             this.myPort.postMessage({loginEditor: { uniqueID: data.uniqueID, DBfilename: data.fileName}} as AddonMessage);
//     //             break;
//     //     }
//     //     this.myPort.postMessage({ removeNotification: this.id } as AddonMessage);
//     // }
// }
