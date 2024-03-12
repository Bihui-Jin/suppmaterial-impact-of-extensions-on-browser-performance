function checkInstall() {
    if (location.hash && location.hash.indexOf("#install/saasvendors") > -1) {
        window.removeEventListener("hashchange", checkInstall);

        var extensionId = chrome.runtime.id;
        window.saasVendorExtensionRunId = extensionId;

        var script = document.createElement("script");
        script.textContent = "window.saasVendorExtensionRunId = '" + extensionId + "'";

        var span = document.createElement("span");
        span.id = extensionId;
        span.style.display = "none";
        document.body.appendChild(script);
        document.body.appendChild(span);
    }
}

window.addEventListener("DOMContentLoaded", checkInstall);
window.addEventListener("hashchange", checkInstall);