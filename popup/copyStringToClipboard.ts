export function copyStringToClipboard (value) {
    const copyFrom = document.createElement("textarea");
    copyFrom.textContent = value;
    const body = document.getElementsByTagName("body")[0];
    body.appendChild(copyFrom);
    copyFrom.select();
    document.execCommand("copy");
    body.removeChild(copyFrom);
}
