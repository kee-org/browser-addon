import { FormUtils } from "./formsUtils";
import { keeLoginField, keeLoginInfo } from "../common/kfDataModel";
import { Action } from "../common/Action";
import { AddonMessage } from "../common/AddonMessage";

export class KeeFieldIcon {

    constructor (private myPort: browser.runtime.Port,
        private parentFrameId: number,
        private formUtils: FormUtils,
        private createMatchedLoginsPanelNearNode: (e: HTMLElement) => void) {}

    private fieldsWithIcons: keeLoginField[] = [];
    private passwordFields: keeLoginField[];
    private otherFields: keeLoginField[];

    public removeKeeIconFromAllFields () {
        for (const field of this.fieldsWithIcons) {
            const element: HTMLElement = field.DOMInputElement;
            if (!element) continue;
            element.removeEventListener("click", this.showMatchedLoginsPanel);
            element.removeEventListener("mousemove", this.hoverOverInput);
            element.style.setProperty("background-image", "");
            element.style.setProperty("background-repeat", "");
            element.style.setProperty("background-attachment", "");
            element.style.setProperty("background-size", "");
            element.style.setProperty("background-position", "");
        }
        this.fieldsWithIcons = [];
        this.passwordFields = null;
        this.otherFields = null;
    }

    public addKeeIconToFields (passwordFields: keeLoginField[], otherFields: keeLoginField[], logins: keeLoginInfo[]) {
        this.passwordFields = passwordFields;
        this.otherFields = otherFields;

        if (logins.length > 1) {
            this.getLabelledIcon(logins.length.toString());
        } else {
            this.afterImageLoaded(this.KEEFOX_ICON_16);
        }

    }

    private skipField (field: keeLoginField) {
        if (!this.formUtils.isATextFormFieldType(field.type) && field.type != "password") return true;
        if (!field.DOMInputElement || !field.DOMInputElement.isConnected) return true;
        if (field.DOMInputElement.maxLength > 0 && field.DOMInputElement.maxLength <= 3) return true;
        if (field.DOMInputElement.offsetWidth < 50) return true;
        return false;
    }

    private addIcon (field: keeLoginField, image: string) {
        this.fieldsWithIcons.push(field);

        const element: HTMLElement = field.DOMInputElement;
        element.addEventListener("click", e => this.showMatchedLoginsPanel(e));
        element.addEventListener("mousemove", e => this.hoverOverInput(e));

        element.style.setProperty("background-image", "url('" + image + "')", "important");
        element.style.setProperty("background-repeat", "no-repeat", "important");
        element.style.setProperty("background-attachment", "scroll", "important");
        element.style.setProperty("background-size", "16px 16px", "important");
        element.style.setProperty("background-position", "calc(100% - 4px) 50%", "important");

        const transitionConfig = window.getComputedStyle(field.DOMInputElement).getPropertyValue("transition-property");
        if (["all", "background"].some(val => transitionConfig.includes(val))) {
            field.DOMInputElement.style.setProperty("transition", "none", "important");
        }

        this.overrideBoxShadows(element);
    }

    private limitFields (fields: keeLoginField[]) {
        const orderedFields = fields.filter(f => !this.skipField(f)).sort((a, b) => {
            if (a.highestScore === b.highestScore) return 0;
            return a.highestScore < b.highestScore ? 1 : -1;
        });
        return orderedFields.slice(0, 2);
    }

    private afterImageLoaded (image: string) {
        // Put icons in only the top 2 matching password and text fields
        const fieldSet1 = this.limitFields(this.passwordFields);
        const fieldSet2 = this.limitFields(this.otherFields);
        for (const field of fieldSet1.concat(fieldSet2)) {
            this.addIcon(field, image);
        }
    }

    private overrideBoxShadows (element: HTMLElement) {
        const currentStyle = window.getComputedStyle(element);
        if (currentStyle) {
            const shadows = [];
            shadows.push(currentStyle.getPropertyValue("box-shadow"));
            shadows.push(currentStyle.getPropertyValue("-webkit-box-shadow"));
            shadows.push(currentStyle.getPropertyValue("-moz-box-shadow"));
            if (shadows.some(s => s.indexOf("inset"))) {
                element.style.setProperty("box-shadow", "initial", "important");
                element.style.setProperty("-webkit-box-shadow", "initial", "important");
                element.style.setProperty("-moz-box-shadow", "initial", "important");
            }
        }
    }

    private showMatchedLoginsPanel (e) {
        const bcrect = e.target.getBoundingClientRect();
        const leftLimit = bcrect.left + bcrect.width - 22;
        if (e.clientX > leftLimit && bcrect.top <= e.clientY && e.clientY <= bcrect.bottom) {
            if (this.parentFrameId !== 0) {
                this.myPort.postMessage({action: Action.ShowMatchedLoginsPanel} as AddonMessage);
            } else
            {
                this.createMatchedLoginsPanelNearNode(e.target);
            }
        }
    }

    private hoverOverInput (e) {
        if (e.target.disabled) return;
        const bcrect = e.target.getBoundingClientRect();
        const leftLimit = bcrect.left + bcrect.width - 22;
        if (e.clientX > leftLimit) {
            e.target.style.setProperty("cursor", "pointer", "important");
            return;
        }
        e.target.style.setProperty("cursor", "auto");
    }

    private getLabelledIcon (text: string) {
        const canvas = document.createElement("canvas");
        canvas.height = 16;
        canvas.width = 16;
        const img = document.createElement("img");
        img.addEventListener("load", e => {
            const context = canvas.getContext("2d");
            context.drawImage(img, 0, 0);
            context.fillStyle = "white";
            context.fillRect(6, 8, 10, 8);
            context.fillStyle = "red";
            context.font = "8px Arial";
            context.fillText(text, 7, 15);
            this.afterImageLoaded( canvas.toDataURL());
        });
        img.src = this.KEEFOX_ICON_16;
    }

    // eslint-disable-next-line max-len
    readonly KEEFOX_ICON_16 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAOdEVYdFRpdGxlAEtlZSBsb2dvN59B9AAAABB0RVh0QXV0aG9yAEtlZSBWYXVsdGXwy5UAAAH8SURBVDiNhZDfS1NhGMc/z3vOEHea0lgXrkisvArWTUSlF9XFIKj/waugtP+hey/M5vpFN0Eg4UVB0WARSglC0IX2AwwtzdywppYsz862875dzLmDbfTcvd/n8/0+X16JX74Sxgt9AHrYmYhVfTbZ88Z6/SeWVEC/szF1brGvVDT2JRqzVLLUCTl28Xrbtq8LwL76JtU1axLhLTm/2A/A1JFp5txOM5RPSCBgM2ypLrWQSXkID+tqd8jljLMpjvgMRFcY2P+NsPI57WxId8gN+HmwkEl5NoBUuWUsrgIqZnu7xLXol6CBmF1mudIOUDU2aQAFsPoq/RkjGYB5L4KnFXvH04p5zwHAwNP8i/TybgAAYkYBitpieL0XP2D2geH1XorarqG6xgIEP0XiycH3wHGAU+0b3D44h6sthvIJZt3OOvYulx07WTcFuxojjeSlSq3u13KYT6VIAwowewOwttoeIRSC2sx2lIqpY5KPdhx43DLg+8yIK3A/qJ111gmJrtmNvvNx4ka5ZQCA0pIGKho0QET5AAYoVUXf+4ffK6y8HMsBEyVtuQC/dQgfMRjG17J3f/w3AEArc7Oo7fD4r0OMFI6ijShRarQZK81EgHhycBro23lO5rLpC824pg0AxEjjotD0OoDdarFaiT053Lb2VhB/uePn81bcX+xXu7resl9RAAAAAElFTkSuQmCC";
}
