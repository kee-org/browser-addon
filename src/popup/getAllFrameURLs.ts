export async function getAllFrameURLs(currentTab: chrome.tabs.Tab) {
    const frames = await chrome.webNavigation.getAllFrames({
        tabId: currentTab.id
    });
    return frames.map(f => f.url);
}
