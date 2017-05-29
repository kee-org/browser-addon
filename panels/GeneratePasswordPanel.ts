/// <reference path="../common/Logger.ts" />
/// <reference path="../common/AppState.ts" />
/// <reference path="../common/TabState.ts" />
/// <reference path="../common/AddonMessage.ts" />

class GeneratePasswordPanel {

    public createNearNode (node: HTMLElement) {
        const container = document.createElement("div");
        container.id = "KeeFox-Passwordblah";
        const list = document.createElement("ul");
        //TODO:c: generate, etc.
        container.appendChild(list);
        node.parentNode.insertBefore(container, node.nextSibling);
    }

}
