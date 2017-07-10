/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/FrameState.ts" />
/// <reference path="../common/AddonMessage.ts" />

class GeneratePasswordPanel {

    public createNearNode (node: HTMLElement, passwordProfiles: any[]) {
        const container = document.createElement("div");
        container.id = "GeneratePasswordContainer";
        container.innerText = $STR("generatePassword_copied") + " " + $STR("PasswordProfilesExplanation_label");
        const list = document.createElement("ul");
        this.setPasswordProfiles(list, passwordProfiles);
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);
    }

    private setPasswordProfiles (list: HTMLUListElement, passwordProfiles: string[]) {

            for (let i = 0; i < passwordProfiles.length; i++)
            {
                const displayName = passwordProfiles[i];

                const profileItem = document.createElement("li");
                profileItem.textContent = displayName;
                //profileItem.addEventListener("keydown", this.keyboardNavHandler, false);
                profileItem.addEventListener("mouseup", function (event) {
                    if (event.button == 0 || event.button == 1)
                    {
                        event.stopPropagation();
                        this.dispatchEvent(new Event("keefoxCommand"));
                    }
                }, false);
                profileItem.addEventListener("keefoxCommand", function (event) {
                    myPort.postMessage({ action: "generatePassword", passwordProfile: this.textContent });
                }, false);

                list.appendChild(profileItem);
            }

        // Try to focus on the first item in the newly displayed sub section
        const matches = list.getElementsByTagName("li");
        if (!matches)
            return;
        const firstMatch = matches[0];
        if (firstMatch)
            firstMatch.focus();
    }

}
