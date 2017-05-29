/// <reference path="PanelStub.ts" />

class PasswordGenerator {

    public generatePasswordPanelStub: PanelStub;
    private generatePasswordPanelStubRaf: number;

    constructor () {
    }

    public createGeneratePasswordPanel () {
        this.closeGeneratePasswordPanel();
        this.generatePasswordPanelStub = new PanelStub(PanelStubOptions.GeneratePassword, null);
        this.generatePasswordPanelStub.createPanel();
    }

    public createGeneratePasswordPanelNearNode (target: HTMLElement) {
        this.closeGeneratePasswordPanel();
        this.generatePasswordPanelStub = new PanelStub(PanelStubOptions.GeneratePassword, target);
        this.generatePasswordPanelStub.createPanel();
        this.generatePasswordPanelStubRaf = requestAnimationFrame(passwordGenerator.updateGeneratePasswordPanelPosition);
    }

    public closeGeneratePasswordPanel () {
        if (this.generatePasswordPanelStub) this.generatePasswordPanelStub.closePanel();
        this.generatePasswordPanelStub = null;
        cancelAnimationFrame(this.generatePasswordPanelStubRaf);
    }

    public updateGeneratePasswordPanelPosition () {
        passwordGenerator.generatePasswordPanelStub.updateBoundingClientRect();
        passwordGenerator.generatePasswordPanelStubRaf = requestAnimationFrame(passwordGenerator.updateGeneratePasswordPanelPosition);
    }
}
