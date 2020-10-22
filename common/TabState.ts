import { FrameState } from "./FrameState";

export class TabState {
    frames: Map<number, FrameState> = new Map<number, FrameState>();
    url = "";
    framePorts: Map<number, browser.runtime.Port> = new Map<number, browser.runtime.Port>();
    ourIframePorts: Map<number, browser.runtime.Port> = new Map<number, browser.runtime.Port>();
}
