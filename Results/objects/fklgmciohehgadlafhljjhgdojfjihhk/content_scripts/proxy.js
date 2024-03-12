self.addEventListener("message", function (event) {
    if (event.source !== window || !event.data) {
        return;
    }

    switch(event.data.type) {
        case SR_PROXY_MT:
            chrome.runtime.sendMessage({type: SR_PROXY_MT, url: event.data.url, grabHeaders: event.data.grabHeaders || []}, function (response) {
                event.ports[0].postMessage(event.data.grabHeaders ? response: response.body);
            });
            break;
        case SR_RENDERER_INITIALIZED_MT:
            // Notification permission warning can only be shown on user gesture (click in particular)
            var listener = function () {
                chrome.runtime.sendMessage({type: SR_RENDERER_INITIALIZED_MT, hostname: event.data.hostname});
                self.removeEventListener('click', listener);
            };
            self.addEventListener('click', listener);
            break;
        case SR_PROXY_PERMISSIONS_MT:
            chrome.runtime.sendMessage({type: SR_PROXY_PERMISSIONS_MT, hostname: event.data.hostname}, function (response) {
                event.ports[0].postMessage(response);
            });
            break;
        default:
            return;
    }
});

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        try {
            // To be sure not to process message in iframes
            if (window === window.top) {
                if (message.type === GET_ACTIVE_TAB_INFO_MT) {
                    getPageInfo().then(function (result) {
                        result.hostname = window.location.hostname;
                        sendResponse(result);
                    });
                }else if (message.type === SR_CAPTURE_RESOURCES) {
                    captureResources();
                } else if (message.type === NOTIFICATION_STATE_SAVE) {
                    window.sessionStorage.setItem('sr_notif_state', message.state);
                    sendResponse();
                } else if (message.type === NOTIFICATION_STATE_GET) {
                    // there is no reason to clear sessionStorage timeout value  as it will be removed on session end, that's why there is no "removeTimeoutFromSessionStorage" message
                    sendResponse(window.sessionStorage.getItem('sr_notif_state'));
                }
            }
            return true;
        } catch(e) {
        }
    }
);

var script = document.createElement("script");
script.textContent = "window.__dt_sr_proxy_supported = true;";
document.documentElement.appendChild(script);
document.documentElement.removeChild(script);
