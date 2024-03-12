var cspRules = ["default-src", "script-src", "connect-src"];
var cspDomains = [];
var geturls = /https?:\/\/(.*?)[\/|"|\|]/g;

// add the dynatracelabs origin to csp rules on request headers if they exist
chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
        if (!cspDomains.length) {
            return;
        }

        var cspHeader = "content-security-policy";

        for (var i = 0; i < details.responseHeaders.length; i++) {
            if (details.responseHeaders[i].name.toLowerCase() === cspHeader) {
                var csp = details.responseHeaders[i].value;
                if (csp) {
                    details.responseHeaders[i].value = addCSPValues(csp);
                }
            }
        }
        return { responseHeaders: details.responseHeaders };
    },

    {
        urls: ['<all_urls>'],
        types: [
            "main_frame",
            "sub_frame",
            "stylesheet",
            "script",
            "image",
            "font",
            "object",
            "xmlhttprequest",
            "ping",
            "other"
        ]
    },

    [ 'blocking', 'responseHeaders']
);

function addCSPValues(csp) {
    var domainString = cspDomains.join(" ");
    var ruleSets = csp.split(";");

    for(var i = 0; i < cspRules.length; i++) {
        var rule = cspRules[i];

        for (var j = 0; j < ruleSets.length; j++) {
            var ruleSet = ruleSets[j];

            if (ruleSet.indexOf(rule) > -1) {
                ruleSets[j] = ruleSet + " " + domainString;
            }
        }
    }

    return ruleSets.join(";");
}

function updateCSPDomains(apps) {
    var urls = [];
    for(var i = 0; i < apps.length; i++) {
        var script = apps[i].jsAgentScript || apps[i].jsagentScript;
        if (script) {
            try {
                urls = geturls.exec(script);
                while (urls) {
                    var domain = urls[1]; // get the capturing group
                    if (domain.indexOf(".") !== domain.lastIndexOf(".")) { // multiple dots, thus just go up to the first subdomain level
                        var indx = domain.lastIndexOf(".");
                        domain = domain.substring(domain.lastIndexOf(".",indx-1)+1);
                    }
                    if (cspDomains.indexOf("*."+domain) === -1) {
                        cspDomains.push("*."+domain);
                    }
                    urls = geturls.exec(script);
                }
            } catch(e) {
                log("urls could not be parsed:\n" + e + "\nlogging script tag...\n");
                log(script);
            }
        }
    }
}