
var AAHTMLControl;
var i = new Array;
var _htmDoc;
var responseCallBack;
var isResponseSend = false;
var IframeIndexinfo = new Map();
var frameIndex;
var SETFRAMEINDEX = "SetFrameIndex";
var GETFRAMEINDEX = "GetFrameIndex";
var CrossDomainIframeInfo = {
    "RequestMethod": undefined,
    "Framedomxpath": undefined,
    "FrameIndex": undefined
}

var actualCode = "(function () {\
            if (window._automationanywhere_recorder_alert || window._automationanywhere_recorder_alert_closed) { return; }\
            var alert = window.alert, confirm = window.confirm, prompt = window.prompt;\
			const isNative = (o) => typeof o === 'function' && ('' + o).indexOf('{ [native code] }') >= 0;\
			const createEvent = (name) => {\
			if (isNative(window.Event)) {\
				return new window.Event(name);\
			}\
			else if (isNative(document.createEvent)) {\
				const event = document.createEvent('Event');\
				event.initEvent(name, true, true);\
				return event;\
			}\
			};\
			const alertOpenEvent = createEvent('automationanywhere-recorder-alert');\
            const alertCloseEvent = createEvent('automationanywhere-recorder-alert-closed');\
            window.alert = function () {\
                window.dispatchEvent(alertOpenEvent);\
                var rvalue = alert.apply(this, arguments);\
                window.dispatchEvent(alertCloseEvent);\
                return rvalue;\
            };\
            window.confirm = function () {\
                window.dispatchEvent(alertOpenEvent);\
                var rvalue = confirm.apply(this, arguments);\
                window.dispatchEvent(alertCloseEvent);\
                return rvalue;\
            };\
            window.prompt = function () {\
                window.dispatchEvent(alertOpenEvent);\
                var rvalue = prompt.apply(this, arguments);\
                window.dispatchEvent(alertCloseEvent);\
                return rvalue;\
            };\
        }\
        )();";
window.addEventListener("automationanywhere-recorder-alert", function (event) {
    chrome.runtime.sendMessage({ type: "AlertOpen" }, function (response) { isAlertOpen = true; });
});
window.addEventListener("automationanywhere-recorder-alert-closed", function (event) {
    chrome.runtime.sendMessage({ type: "AlertClose" }, function (response) { isAlertOpen = false; });
});

var script = document.createElement('script');
script.textContent = actualCode;
(document.head || document.documentElement).appendChild(script);
script.remove();

chrome.extension.onRequest.addListener(
    function (request, sender, sendResponse) {
        sendResponse({ data: ExecuteBridgeAction(request.method, request.browser, sendResponse) });
    }
)
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        responseCallBack = sendResponse;
        if (request.framerequest) {
            var currentDocument = document;
            var frames = currentDocument.getElementsByTagName('frame');
            var match = false;
            var frameWanted = undefined;
            var htmlMapper = new HTMLMapper();

            for (var i = 0; i < frames.length; i++) {
                var selectionCriteria = undefined;
                if (request.framerequest.isJavascriptRequest) {
                    selectionCriteria = request.framerequest.selectionCriteria;
                } else {
                    selectionCriteria = request.framerequest;
                }

                var frameCriteriaMap = htmlMapper.generateElementMap(frames[i], selectionCriteria)

                for (let selectionCriteriaKey in selectionCriteria) {
                    if (frameCriteriaMap[selectionCriteriaKey] !== undefined || frameCriteriaMap[selectionCriteriaKey] === '') {
                        if (frameCriteriaMap[selectionCriteriaKey] === selectionCriteria[selectionCriteriaKey].value.string) {
                            match = true;
                        } else {
                            match = false;
                            // it is not a match, move onto the next frame
                            break;
                        }
                    } else {
                        // move onto the next criteria key
                        continue;
                    }
                }

                if (match === true) {
                    var input = {}
                    frameWanted = frames[i];
                    if (request.framerequest.isJavascriptRequest) {
                        input = {
                            frameWanted: frames[i],
                            isJavascriptRequest: true,
                            jsFunction: request.framerequest.jsFunction
                        }
                    } else {
                        input = {
                            frameWanted: frames[i]
                        }
                    }

                    try {
                        var res = ExecuteBrowserAction(input);
                        if (res === 'Action cannot be performed without DOMXPath on Cross Domain Frame') {
                            sendResponse({ errorResult: 'Action cannot be performed without DOMXPath on Cross Domain Frame' });
                        }
                        if (res != undefined) {
                            sendResponse({ result: res });
                        }
                    } catch (e) {
                        sendResponse({ errorResult: e.message });
                    }
                }

                if (i == (frames.length -1) && !match) {
                    sendResponse({ errorResult: 'Action cannot be performed' });
                }
            }

        } else if (request.crossdomainframe) {
            if (request.crossdomainframe.extract || request.crossdomainframe.jsExecution) {
                try {
                    var res = ExecuteBrowserAction(request.crossdomainframe);
                    if (res === 'Action cannot be performed') {
                        sendResponse({ errorResult: 'Action cannot be performed' });
                    }
                    if (res != undefined) {
                        sendResponse({ result: res });
                    }
                } catch (e) {
                    sendResponse({ errorResult: e.message });
                }
            }
        } else if (request.mapperXML) {
            ObjectMapper.InitializeMapperDictionary(request.mapperXML);
        }  else if (request.command) {
            if (request.command.retry) {
                if (CrossDomainIframeInfo.FrameIndex != undefined) {
                    sendResponse({ result: CrossDomainIframeInfo.FrameIndex });
                }
            } else {
                // standard javascript-execution/extract-source command
                try {
                    var res = ExecuteBrowserAction(request.command);
                    if (res === 'Action cannot be performed') {
                        sendResponse({ errorResult: 'Action cannot be performed' });
                    }
                    if (res != undefined) {
                        sendResponse({ result: res });
                    }
                } catch (e) {
                    sendResponse({ errorResult: e.message });
                }
            }
        } else if (request.frameId) {
            if (request.frameId != -1) {
                frameIndex = request.frameId;
            }
            IframeIndexinfo.clear();
        } else {
                window.addEventListener("automationanywhere-recorder-alert", function (event) {
                    if (responseCallBack) {
                        responseCallBack({ data: "<AAOABResult Result='true' Error='None'> <Table></Table></AAOABResult>" });
                    }
                });

                var script = document.createElement('script');
                script.textContent = actualCode;
                (document.head || document.documentElement).appendChild(script);
                script.remove();

                sendResponse({ data: ExecuteBridgeAction(request.method, request.browser, sendResponse) });
                responseCallBack = undefined;
        }
    }
)

chrome.runtime.sendMessage({type: "GET_MAPPER_DICTIONARY"}, function(response) {
    InitializeObjectMapper(response.mapperXML);
});

function getIFrameIndex(framedomxpath) {
    if (IframeIndexinfo.has(framedomxpath)) {
        return IframeIndexinfo.get(framedomxpath);
    }
    return undefined;
}
window.addEventListener('message', handleMessage, false);
function handleMessage(e) {
    if (typeof e.data == 'string' && e.data.includes(GETFRAMEINDEX) && frameIndex != undefined) {
        var frameinformation = JSON.parse(e.data);
        if (frameinformation != undefined) {
            frameinformation.RequestMethod = SETFRAMEINDEX;
            frameinformation.FrameIndex = frameIndex;
            var frame_jsondata = JSON.stringify(frameinformation);
            window.parent.postMessage(frame_jsondata, '*');
        }
    }
    if (typeof e.data == 'string' && e.data.includes(SETFRAMEINDEX)) {
        var frameinformation = JSON.parse(e.data);
        if (frameinformation != undefined) {
            if (!IframeIndexinfo.has(frameinformation.Framedomxpath) && frameinformation.FrameIndex != undefined) {
                IframeIndexinfo.set(frameinformation.Framedomxpath, frameinformation.FrameIndex);
            }
        }
    }
}
chrome.runtime.sendMessage({ type: "SET_FRAME_INDEX" }, function (response) {
    //this is used for calling the background script to set the frame index when content script is loading
});
