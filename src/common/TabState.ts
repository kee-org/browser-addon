import { FrameState } from "./FrameState";

export class TabState {
    frames: Map<number, FrameState> = new Map<number, FrameState>();
    url = "";
    framePorts: Map<number, chrome.runtime.Port> = new Map<number, chrome.runtime.Port>();
    ourIframePorts: Map<number, chrome.runtime.Port> = new Map<number, chrome.runtime.Port>();
}
