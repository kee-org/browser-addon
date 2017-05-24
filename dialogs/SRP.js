
    document.getElementById("ok").addEventListener("click", function(){
    const winId = browser.windows.WINDOW_ID_CURRENT;
    browser.runtime.sendMessage({action: "ok", password: document.getElementById("password").value });
    const removing = browser.windows.remove(winId);
});