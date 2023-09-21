import { KeeLog } from "~/common/Logger";
import { isFirefox, isForbiddenUrl } from "~/env";

const vaultURLs = ["https://app-dev.kee.pm:8087", "https://app-beta.kee.pm", "https://app.kee.pm", "https://keevault.pm"];

// Firefox fetch files from cache instead of reloading changes from disk,
// hmr will not work as Chromium based browser
chrome.webNavigation.onCommitted.addListener(({ tabId, frameId, url }) => {

    if (frameId !== 0) { return; }

  if (isForbiddenUrl(url))
    {return;}

const scriptType = vaultURLs.some(v => url.startsWith(v)) ? "vault" : "page";

  // inject the latest scripts
  chrome.tabs.executeScript(tabId, {
    file: `${isFirefox ? "" : "."}/dist/${scriptType}/index.global.js`,
    allFrames: scriptType == "page",
    runAt: "document_end"
  }).catch(error => KeeLog.error("Failed to inject content script", error));
});
