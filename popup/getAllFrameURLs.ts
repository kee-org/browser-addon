export async function getAllFrameURLs(currentTab: browser.tabs.Tab) {
    const frames = await browser.webNavigation.getAllFrames({
        tabId: currentTab.id
    });
    return frames.map(f => f.url);
}
