var removeOverride;

function setOverride() {
    var setOverrideScript = document.createElement('script');
    setOverrideScript.innerText = "window.dT_ = 'override';";
    document.documentElement.appendChild(setOverrideScript);
    document.documentElement.removeChild(setOverrideScript);

    removeOverride = function (head) {
        document.querySelectorAll('script').forEach(function (script) {
            var matchingTemplate = ["ruxitagent", "dtagent"].find(function (template) {
                return (script.src || script.innerText || '').includes(template);
            });
            if (matchingTemplate) {
                script.parentNode.removeChild(script);
            }
        });
        var clearOverrideScript = document.createElement('script');
        clearOverrideScript.innerText = "window.dT_ = void 0;";
        head.appendChild(clearOverrideScript);
        head.removeChild(clearOverrideScript);
    }
}

if (location.search.indexOf('__dt__override=true') !== -1 || sessionStorage['__dt__override']) {
    sessionStorage['__dt__override'] = true;
    setOverride();
}