/// <reference path="../common/FrameState.ts" />

class TabState {
    frames: FrameState[] = [];
    url: string = "";
    framePorts: browser.runtime.Port[] = [];
    ourIframePorts: browser.runtime.Port[] = [];
}
