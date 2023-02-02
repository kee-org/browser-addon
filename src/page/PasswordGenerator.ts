import { PanelStub, PanelStubOptions } from "./PanelStub";

//const panelOptions = PanelStubOptions.GeneratePasswordLegacy;
const panelOptions = PanelStubOptions.GeneratePassword;

export class PasswordGenerator {
    public generatePasswordPanelStub: PanelStub;
    private generatePasswordPanelStubRaf: number;

    constructor(private parentFrameId: number) {}

    public createGeneratePasswordPanel() {
        this.closeGeneratePasswordPanel();
        this.generatePasswordPanelStub = new PanelStub(panelOptions, null, this.parentFrameId);
        this.generatePasswordPanelStub.createPanel();
    }

    public createGeneratePasswordPanelNearNode(target: HTMLElement) {
        this.closeGeneratePasswordPanel();
        this.generatePasswordPanelStub = new PanelStub(panelOptions, target, this.parentFrameId);
        this.generatePasswordPanelStub.createPanel();
        this.generatePasswordPanelStubRaf = requestAnimationFrame(() =>
            this.updateGeneratePasswordPanelPosition()
        );
    }

    public closeGeneratePasswordPanel() {
        if (this.generatePasswordPanelStub) this.generatePasswordPanelStub.closePanel();
        this.generatePasswordPanelStub = null;
        cancelAnimationFrame(this.generatePasswordPanelStubRaf);
    }

    public updateGeneratePasswordPanelPosition() {
        this.generatePasswordPanelStub.updateBoundingClientRect();
        this.generatePasswordPanelStubRaf = requestAnimationFrame(() =>
            this.updateGeneratePasswordPanelPosition()
        );
    }
}
