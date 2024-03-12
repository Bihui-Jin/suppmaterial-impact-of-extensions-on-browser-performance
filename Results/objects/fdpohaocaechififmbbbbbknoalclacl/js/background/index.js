chrome.runtime.onInstalled.addListener((function(e){if("install"===e.reason){const e=chrome.extension.getURL("/welcome.html");chrome.tabs.create({url:e})}}));
//# sourceMappingURL=index.js.map
