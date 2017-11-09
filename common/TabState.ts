/// <reference path="../common/FrameState.ts" />

class TabState {
    frames: Map<number, FrameState> = new Map<number, FrameState>();
    url: string = "";
    framePorts: Map<number, browser.runtime.Port> = new Map<number, browser.runtime.Port>();
    ourIframePorts: Map<number, browser.runtime.Port> = new Map<number, browser.runtime.Port>();
}
