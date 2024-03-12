var port = undefined;
var IsClientRunning = false;

function ExtensionNativeMessaging() {
    this.IsRequestSent = false;
    this.OnMessageReceiveCallBack = function (message) { };
    this.AgentData = null;
    this.Connect = function () {
        port = chrome.runtime.connectNative(Browser.nativeMessagingId);
        IsClientRunning = true;
        port.onMessage.addListener(this.OnMessageReceiveCallBack);
        port.onDisconnect.addListener(onDisconnected);
        setTimeout(function () {
            if (IsClientRunning == false) {
                port.onMessage.removeListener(this.OnMessageReceiveCallBack);
                port.onDisconnect.removeListener(onDisconnected);
            }
            else {
                reloadContentScript();
            }
        }, 1000);
    }
    function onConnect() {
        IsClientRunning = true;
        console.log("Socket connected");
    }
    function onDisconnected() {
        IsClientRunning = false;
        console.log("Socket onDisconnected");
        port.onMessage.removeListener(this.OnMessageReceiveCallBack);
        port.onDisconnect.removeListener(onDisconnected);
        setTimeout(function () { chrome.runtime.reload(); }, 15000);
    }

    this.Send = function (message) {
        port.postMessage({ data: message });
    }

    this.SendResponse = function (response) {
        port.postMessage(response);
    }
    function reloadContentScript() {
        let params = {
        };
        chrome.tabs.query(params, function gotTabs(tabs) {

            for (let index = 0; index < tabs.length; index++) {
                var contentjsFiles = chrome.runtime.getManifest().content_scripts[0].js;
                for (let file = 0; file < contentjsFiles.length; file++) {
                    chrome.tabs.executeScript(tabs[index].id, {
                            file: contentjsFiles[file]
                        },
                        result => {

                            const lastErr = chrome.runtime.lastError;
                            if (lastErr) {
                                //console.error('tab: ' + tabs[index].id + ' lastError: ' + JSON.stringify(lastErr));
                            }
                        })
                }
            }
        });
    }
}

try {
    module.exports = ExtensionNativeMessaging
} catch (e) { };
