import { Action } from "../common/Action";

export class GeneratePasswordPanel {
    constructor (private myPort: browser.runtime.Port,
        private closePanel: () => void) {}

    public createNearNode (node: HTMLElement, passwordProfiles: string[]) {
        const container = document.createElement("div");
        container.id = "GeneratePasswordContainer";
        // Disabled due to https://github.com/kee-org/browser-addon/issues/68
        //const text = document.createElement("div");
        //text.innerText = $STR("generatePassword_copied") + " " + $STR("PasswordProfilesExplanation_label");
        //container.appendChild(text);

        const text = document.createElement("div");
        text.innerText = $STR("generatePassword_instructions");
        container.appendChild(text);
        const list = document.createElement("ul");
        list.classList.add("passwordProfileList");
        this.setPasswordProfiles(list, passwordProfiles);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);

        return container;
    }

    private setPasswordProfiles (list: HTMLUListElement, passwordProfiles: string[]) {

        for (let i = 0; i < passwordProfiles.length; i++)
        {
            const displayName = passwordProfiles[i];

            const profileItem = document.createElement("li");
            profileItem.textContent = displayName;
            profileItem.tabIndex = i == 0 ? 0 : -1;
            profileItem.addEventListener("keydown", e => this.keyboardNavHandler(e), false);
            profileItem.addEventListener("mouseup", function (event) {
                if (event.button == 0 || event.button == 1)
                {
                    event.stopPropagation();
                    this.dispatchEvent(new Event("keeCommand"));
                }
            }, false);
            profileItem.addEventListener("keeCommand", event => {
                this.myPort.postMessage({ action: Action.GeneratePassword, passwordProfile: (event.currentTarget as any).textContent });
            }, false);

            list.appendChild(profileItem);
        }
    }

    private keyboardNavHandler (event: KeyboardEvent) {
        const target = event.target as HTMLLIElement;

        switch (event.keyCode) {
            case 13: // enter
                event.preventDefault();
                event.stopPropagation();
                target.dispatchEvent(new Event("keeCommand"));
                break;
            case 40: // down
                event.preventDefault();
                event.stopPropagation();
                if (target.nextElementSibling) {
                    (target.nextElementSibling as HTMLLIElement).focus();
                }
                break;
            case 38: // up
                event.preventDefault();
                event.stopPropagation();
                if (target.previousElementSibling) {
                    (target.previousElementSibling as HTMLLIElement).focus();
                }
                break;
            case 27: // esc
                event.preventDefault();
                event.stopPropagation();
                this.closePanel();
                break;
        }
    }
}
