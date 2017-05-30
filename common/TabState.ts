/// <reference path="../common/FrameState.ts" />

class TabState {
    mapInjectedIframes: number[] = [];
    frames: FrameState[] = [];
    url: string = "";
    framePorts: browser.runtime.Port[] = [];
    ourIframePorts: browser.runtime.Port[] = [];
}
