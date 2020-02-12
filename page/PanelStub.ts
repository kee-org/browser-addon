export class PanelStubOptions {
    id: string;
    height: number;
    width: number;
    name: string;
    autoCloseTime: number;

    public static MatchedLogins: PanelStubOptions = {
        id: "KeeAddonPanelMatchedLogins",
        height: 300,
        width: 400,
        name: "matchedLogins",
        autoCloseTime: 0
    };

    public static GeneratePassword: PanelStubOptions = {
        id: "KeeAddonPanelGeneratePassword",
        height: 300,
        width: 400,
        name: "generatePassword",
        autoCloseTime: 0
    };

    public static SavePassword: PanelStubOptions = {
        id: "KeeAddonPanelSavePassword",
        height: 300,
        width: 400,
        name: "savePassword",
        autoCloseTime: 0
    };
}

export class PanelStub {

    private target: HTMLElement;
    private container: HTMLElement;
    private targetRelativeRect: ClientRect;
    private options: PanelStubOptions;
    private parentFrameId: number;

    constructor (options: PanelStubOptions, target: HTMLElement, parentFrameId: number) {
        this.target = target;
        this.options = options;
        this.parentFrameId = parentFrameId;
    }

    public createPanel () {
        this.container = document.createElement("div");
        this.container.id = this.options.id;

        this.container.style.setProperty( "display", "block", "important" );
        this.container.style.setProperty( "position", "absolute", "important" );
        this.container.style.setProperty( "z-index", "2147483647", "important" );

        if (this.target) {
            this.targetRelativeRect = this.target.getBoundingClientRect();
            this.positionPanel();
        } else {
            this.container.style.setProperty( "width", this.options.width + "px", "important" );
            this.container.style.setProperty( "height", this.options.height + "px", "important" );
            this.container.style.setProperty( "top", ((window.innerHeight-this.options.height)/2 + window.scrollY)  + "px", "important" );
            this.container.style.setProperty( "left", ((window.innerWidth-this.options.width)/2 + window.scrollX) + "px", "important" );
        }

        const iframe = document.createElement("iframe");
        iframe.style.setProperty( "width", "100%", "important" );
        iframe.style.setProperty( "height", "100%", "important" );
        iframe.style.setProperty( "border", "none", "important" );
        iframe.style.setProperty( "visibility", "visible", "important" );
        iframe.style.setProperty( "display", "block", "important" );
        iframe.style.setProperty( "position", "relative", "important" );
        iframe.setAttribute("scrolling", "no");

        iframe.src = browser.extension.getURL("panels/panels.html") + "?parentFrameId=" + this.parentFrameId + "&autoCloseTime=" + this.options.autoCloseTime + "&panel=" + this.options.name;
        this.container.appendChild(iframe);

        const bodyElements = document.getElementsByTagName("body");
        if (bodyElements && bodyElements.length > 0) {
            bodyElements[0].appendChild(this.container);
        } else {
            const framesetElements = document.getElementsByTagName("frameset");
            if (framesetElements && framesetElements.length > 0) {
                framesetElements[0].insertAdjacentElement("afterend", this.container);
            }
        }
    }

    public updateBoundingClientRect () {
        const oldRect = this.targetRelativeRect;
        this.targetRelativeRect = this.target.getBoundingClientRect();

        if (oldRect.top != this.targetRelativeRect.top || oldRect.bottom != this.targetRelativeRect.bottom
         || oldRect.left != this.targetRelativeRect.left || oldRect.right != this.targetRelativeRect.right) {
            this.positionPanel();
        }
    }

    private positionPanel () {

        const preferredContainerHeight = this.options.height;
        let containerHeight = preferredContainerHeight;
        const containerWidth = this.options.width;
        let positionAbove = false;

        const targetTop = this.targetRelativeRect.top + window.scrollY;
        const targetBottom = this.targetRelativeRect.bottom + window.scrollY;
        const preferredArrowXCoord = this.targetRelativeRect.right - 12;

        const preferredBottom = this.targetRelativeRect.bottom + preferredContainerHeight;
        if (preferredBottom > window.innerHeight) {
            const preferredTop = this.targetRelativeRect.top - preferredContainerHeight;
            if (preferredTop >= 0) {
                positionAbove = true;
            } else {
                const overflowBottom = preferredBottom - window.innerHeight;
                const overflowTop = -preferredTop;
                if (overflowBottom > overflowTop) {
                    positionAbove = true;
                    containerHeight = preferredContainerHeight - overflowTop;
                } else {
                    containerHeight = preferredContainerHeight - overflowBottom;
                }
            }
        }

        // Move as far left as possible while keeping the Kee icon above the container and not
        // going beyond the left edge of the target. We assume the Kee icon is always visible because
        // the user has had to interact with the button initially. That assumption won't always hold
        // - e.g. in very narrow screens with keyboard activation or some later window or DOM adjustments but this should
        // be an edge case that users can work around until we have more time to extend support to those scenarios.
        const targetWidth = preferredArrowXCoord - this.targetRelativeRect.left;
        let relativeLeft: number;
        if (targetWidth < containerWidth) {
            relativeLeft = Math.min(this.targetRelativeRect.left, window.innerWidth - containerWidth);
        } else {
            relativeLeft = preferredArrowXCoord - containerWidth;
        }

        const top = positionAbove ? targetTop - containerHeight: targetBottom;
        const left = relativeLeft + window.scrollX;
        this.container.style.setProperty( "width", containerWidth + "px", "important" );
        this.container.style.setProperty( "height", containerHeight + "px", "important" );
        this.container.style.setProperty( "top", top + "px", "important" );
        this.container.style.setProperty( "left", left + "px", "important" );
    }

    public closePanel () {
        const panel = document.getElementById(this.options.id);
        if (panel) panel.parentNode.removeChild(panel);
    }
}
