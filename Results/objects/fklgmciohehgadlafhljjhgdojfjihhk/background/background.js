shouldInject = function(url) {
    var apps = globalConfiguration.currentApplications;
	var doInject = false;
    var jsagentScript = null;
	for(var i = 0; i < apps.length; i++) {
        jsagentScript = apps[i].jsAgentScript;
        var regex = createRegex(apps[i].urlRegex);
        if (jsagentScript && (regex == null || regex.test(url))) {
            doInject = true;
            log("injecting on: " + url + " with regex: " + regex);
            break;
        }
	}
	if (!doInject) {
        log("not injecting on: " + url);
	}

	return {type: SHOULD_INJECT_MT, shouldInject: doInject, jsagentScript: jsagentScript, userId: sVRId};
}

var wasInjected = null;
var resetProxyIconTimerId = null;
var pendingFetchAmount = 0;
var proxyIconWasSetAt = 0;

switchIcon = function(isActive) {
    if (pendingFetchAmount) {
        return;
    }

    if (isActive) {
        chrome.browserAction.setIcon(isEdge ? {path: {"30": "css/icon-32.png"}} : {path: {"32": "../css/icon-32.png"}});
    } else {
        chrome.browserAction.setIcon(isEdge ? {path: {"30": "css/icon-gray-32.png"}} : {path: {"32": "../css/icon-gray-32.png"}});
    }
}

injectionInfo = function(info) {
	wasInjected = info.injected;
    switchIcon(wasInjected);
	return {type: INJECTION_INFO_MT, item: "Status changed."};
}

resetIcon = function() {
    if (pendingFetchAmount) {
        return;
    }
    var timeFromProxyIconSet = Date.now() - proxyIconWasSetAt;
    if (timeFromProxyIconSet < 2000) {
        setTimeout(resetIcon, 2000 - timeFromProxyIconSet);
        return;
    }
    switchIcon(wasInjected);
}

startResourceFetching = function(url, grabHeaders, sendResponse) {
    clearTimeout(resetProxyIconTimerId);
    if (pendingFetchAmount === 0) {
        chrome.browserAction.setIcon({path: {"30": "css/icon-proxy-32.png", "32": "../css/icon-proxy-32.png", "128": "../css/icon-proxy-128.png"}});
        proxyIconWasSetAt = Date.now();
    }
    pendingFetchAmount++;
    return fetchResource(url, grabHeaders, function (fetchedData) {
        pendingFetchAmount--;
        resetIcon();
        sendResponse(fetchedData);
    });
}

// manage communication for the extension
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		var requestType = request.type;
        var response = null;

		switch(requestType) {
			case SHOULD_INJECT_MT:
                response = shouldInject(request.url);
                break;
			case INJECTION_INFO_MT:
                response = injectionInfo(request.item);
                break;
			case SAVE_FETCHED_APPS_MT:
                response = saveFetchedApps(request.item);
                break;
			case LOG_MT:
                log(request.message);
                break;
            case SR_PROXY_MT:
                if (sender.tab) {
                    getProxyPermissionData(new URL(sender.tab.url).hostname).then(function (result) {
                        if (result && result[PROXY_PERMISSION_STATE_KEY] === true) {
                            startResourceFetching(request.url, request.grabHeaders, sendResponse);
                        } else {
                            sendResponse(null);
                        }
                    });

                    return true;
                }

                sendResponse(null);
                break;
            case SR_RENDERER_INITIALIZED_MT:
                getNotificationPermissions().then(function (notifPermissionsGranted) {
                    // if notification permissions weren't provided, then proxy permissions considered revoked
                    if (!notifPermissionsGranted) {
                        setProxyPermissionData(request.hostname, notifPermissionsGranted);
                    }
                });
                break;
            case SR_PROXY_PERMISSIONS_MT:
                getProxyPermissions(request.hostname).then(function (isGranted) {
                        sendResponse(isGranted);
                });
                break;
			default:
				if (PROXY_PERMISSION_MESSAGE_TYPES.indexOf(request.type) === -1) {
                    log("invalid request type: " + request.type);
				}
		}

		if (response) {
			sendResponse(response);
		}
	}
);

chrome.tabs.onActivated.addListener(function(tab) {
	chrome.tabs.sendMessage(tab.tabId,{type: GET_INJECTION_INFO_MT});
});
