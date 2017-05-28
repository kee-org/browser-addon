
class MatchedLoginsPanelStub {

    private target: HTMLElement;
    private container: HTMLElement;
    private targetRelativeRect: ClientRect;

    constructor (target: HTMLElement) {
        this.target = target;
    }

    public createMatchedLoginsPanelNearNode () {
        this.container = document.createElement("div");
        this.container.id = "KeeFoxAddonPanelMatchedLogins";

        this.container.style.setProperty( "display", "block", "important" );
        this.container.style.setProperty( "position", "absolute", "important" );
        this.container.style.setProperty( "zIndex", "2147483647", "important" );
        this.targetRelativeRect = this.target.getBoundingClientRect();
        this.positionPanel();

        const iframe = document.createElement("iframe");
        iframe.style.setProperty( "width", "100%", "important" );
        iframe.style.setProperty( "height", "100%", "important" );
        iframe.style.setProperty( "border", "none", "important" );
        iframe.style.setProperty( "visibility", "visible", "important" );
        iframe.style.setProperty( "position", "relative", "important" );
        iframe.setAttribute("scrolling", "no");

        iframe.src = chrome.extension.getURL("panels/panels.html") + "?parentFrameId=" + frameId + "&panel=matchedLogins";
        this.container.appendChild(iframe);

        document.getElementsByTagName("body")[0].appendChild(this.container);
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

        const preferredContainerHeight = 300;
        let containerHeight = preferredContainerHeight;
        const containerWidth = 400;
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
        //TODO:c: inner iframe can't handle variable heights (or widths, but we don't even try that here)

        // Move as far left as possible while keeping the KeeFox icon above the container and not
        // going beyond the left edge of the target. We assume the KeeFox icon is always visible because
        // the user has had to interact with the button initially. That asusmption won't always hold
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

    public closeMatchedLoginsPanel () {
        const panel = document.getElementById("KeeFoxAddonPanelMatchedLogins");
        if (panel) panel.parentNode.removeChild(panel);
    }
}
