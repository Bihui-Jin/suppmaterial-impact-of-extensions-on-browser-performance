//Copyright (c) 2020 Automation Anywhere.
// All rights reserved.
//
// This software is the proprietary information of Automation Anywhere.
//You shall use it only in accordance with the terms of the license agreement
//you entered into with Automation Anywhere.
var times = 0;

function ExecuteBrowserAction(inputString) {
    if (inputString.frameWanted) {
        if (inputString.isJavascriptRequest) {
            // means no xpath, js, either cross domain or same domain
            return executeJavaScriptInFrame(inputString.jsFunction, inputString.frameWanted)
        } else {
            return extractPageSourceFromFrame(inputString.frameWanted);
        }
    } else if (inputString.extractSource && inputString.extractSource.browserTab
        && inputString.extractSource.browserTab.browserControl
        && inputString.extractSource.browserTab.browserControl.uiobjectControlType) {
        if (inputString.extractSource.browserTab.browserControl.uiobjectControlType === 'IFRAME' || inputString.extractSource.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
            if (inputString.extractSource.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                return executeExtractSource();
            }
            return extractSourceByXPath(inputString.extractSource.browserTab.browserControl.selectionCriteria)
        }
    } else if (inputString.extractSource || inputString.extract) {
        return executeExtractSource();
    } else if (inputString.jsExecution){
        executeJavaScript(inputString.jsFunction);
    } else if (inputString.executeJavaScript && inputString.executeJavaScript.browserTab) {
        if (inputString.executeJavaScript.browserTab.browserControl && inputString.executeJavaScript.browserTab.browserControl.uiobjectControlType && inputString.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
            executeJavaScript(inputString.executeJavaScript.javaScriptFunction)
        } else if (inputString.executeJavaScript.browserTab.browserControl && inputString.executeJavaScript.browserTab.browserControl.uiobjectControlType && inputString.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'IFRAME'){
            executeJavaScriptInIframeWithXPath(inputString.executeJavaScript.javaScriptFunction, inputString.executeJavaScript.browserTab.browserControl.selectionCriteria.DOMXPath.value.string)
        } else {
            executeJavaScript(inputString.executeJavaScript.javaScriptFunction);
        }

    } else if (inputString.waitForDocumentStatus) {
        timerFuncationToGetDocumentStatus(inputString.waitForDocumentStatus.documentStatus.toLowerCase(), inputString.timeOutMs);
    }
    else {
        throw "Invalid input";
    }
}

function extractPageSourceFromFrame(frame) {
    var outerHtml = undefined;
    try {
        outerHtml = frame.contentWindow.document.body.outerHTML;
    } catch (e) {
        if (e.message.includes('Blocked a frame with origin')) {
            return 'Action cannot be performed without DOMXPath on Cross Domain Frame'
        }
    }
    return outerHtml;
}

function timerFuncationToGetDocumentStatus(documentStatus, numberOfIteration) {
    var documentStatusCounter = numberOfIteration - 1000;
    if (documentStatus === document.readyState)
    {
        chrome.runtime.sendMessage({ status: true, pagestatus: document.readyState });
        return;
    }
    if (documentStatusCounter <= 0) {
        chrome.runtime.sendMessage({ status: false, pagestatus: 'unknown' });
    }
    else {
        setTimeout(timerFuncationToGetDocumentStatus, 1000, documentStatus, documentStatusCounter);
    }
}

function executeJavaScriptInFrame(jsFunction, frame) {
    var frameObj = undefined;
    try {
        // Happy path: standard same-domain iframe
        window.addEventListener("automationanywhere-recorder-ExecuteJs", onExecuteJavaScript);
        frameObj = frame.contentWindow.document;
        // this is used to trigger an exception for cross domain iframes
        var a = frameObj.body.outerHTML;
        var script = frameObj.createElement('script');
        script.textContent = getCode(jsFunction);
        (frameObj.head || frameObj.documentElement).appendChild(script);
        script.remove();
    } catch (e) {
        if (e.message.includes('Blocked a frame with origin')) {
            // Logic to handle Cross Domain iframes
            CrossDomainIframeInfo.RequestMethod = GETFRAMEINDEX;
            CrossDomainIframeInfo.Framedomxpath = xpath;
            var iframe_jsondata = JSON.stringify(CrossDomainIframeInfo);
            if (times == 0) {
                frameObj.contentWindow.postMessage(iframe_jsondata, "*");
            }
            times++;
            var res = waitForFrameIndex();
            return res;
        }
    }
}

function executeJavaScriptInIframeWithXPath(jsFunction, xpath) {
    var frameObj = undefined;
    try {
        // Happy path: standard same-domain iframe
        window.addEventListener("automationanywhere-recorder-ExecuteJs", onExecuteJavaScript);
        frameObj = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // this is used to trigger an exception for cross domain iframes
        var a = frameObj.contentWindow.document.body.outerHTML;
        var actualDoc = frameObj.contentWindow.document;
        var script = actualDoc.createElement('script');
        script.textContent = getCode(jsFunction);
        (actualDoc.head || actualDoc.documentElement).appendChild(script);
        script.remove();
    } catch (e) {
        if (e.message.includes('Blocked a frame with origin')) {
            // Logic to handle Cross Domain iframes
            CrossDomainIframeInfo.RequestMethod = GETFRAMEINDEX;
            CrossDomainIframeInfo.Framedomxpath = xpath;
            var iframe_jsondata = JSON.stringify(CrossDomainIframeInfo);
            if (times == 0) {
                frameObj.contentWindow.postMessage(iframe_jsondata, "*");
            }
            times++;
            var res = waitForFrameIndex();
            return res;
        }
    }
}

function executeJavaScript(jsFunction) {
    try {
        window.addEventListener("automationanywhere-recorder-ExecuteJs", onExecuteJavaScript);
        var script = document.createElement('script');
        script.textContent = getCode(jsFunction);
        (document.head || document.documentElement).appendChild(script);
        script.remove();
    } catch (e) {
        console.log(e)
        chrome.runtime.sendMessage({ errorResponse: e.message });
    }
}

function getCode(jsFunction) {
    var code = "(function () { \
        var scriptResponse; \
        try { \
            var returnResult = " + jsFunction + "; \
            if (returnResult && typeof returnResult === 'object' && typeof returnResult.then === 'function') { \
                returnResult.then(function(result) {\
                    scriptResponse = { returnValue: result }; \
                    window.dispatchEvent(new CustomEvent('automationanywhere-recorder-ExecuteJs', { detail: scriptResponse }));\
                });\
                return;\
            } else { \
                scriptResponse = { returnValue: returnResult }; \
            } \
        } catch (e) {\
            scriptResponse = { errorResponse: e.message }; \
        }\
        var customEvent = new CustomEvent('automationanywhere-recorder-ExecuteJs', { detail: scriptResponse });\
        window.dispatchEvent(customEvent);\
    })();";
    return code;
}

function extractSourceByXPath(selectionCriteria) {
    var frameObj = undefined;
    var frameOuterHtml = undefined;
    var match = false;
    var htmlMapper = new HTMLMapper();

    try {
        // Happy path: standard same-domain iframe
        frameObj = document.evaluate(selectionCriteria.DOMXPath.value.string, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        frameOuterHtml = frameObj.contentWindow.document.body.outerHTML;

        // check criteria
        var frameCriteriaMap = htmlMapper.generateElementMap(frameObj, selectionCriteria);
        for (let selectionCriteriaKey in selectionCriteria) {
            if (frameCriteriaMap[selectionCriteriaKey] !== undefined) {
                if (frameCriteriaMap[selectionCriteriaKey] === selectionCriteria[selectionCriteriaKey].value.string) {
                    match = true;
                } else {
                    match = false;
                    // it is not a match, move onto the next frame
                    break;
                }
            } else {
                // move onto the next criteria key - skipping
                continue;
            }
        }

        if (match === false) {
            return 'Action cannot be performed'
        }

    } catch (e) {
        if (e.message.includes('Blocked a frame with origin')) {
            // Logic to handle Cross Domain iframes
            CrossDomainIframeInfo.RequestMethod = GETFRAMEINDEX;
            CrossDomainIframeInfo.Framedomxpath = selectionCriteria.DOMXPath.value.string;
            var iframe_jsondata = JSON.stringify(CrossDomainIframeInfo);
            if (times == 0) {
                frameObj.contentWindow.postMessage(iframe_jsondata, "*");
            }
            times++;
            var res = waitForFrameIndex();
            return res;
        }
    }

    return frameOuterHtml;
}
function waitForFrameIndex() {
    var iFrameIndex = getIFrameIndex(CrossDomainIframeInfo.Framedomxpath);
    if (iFrameIndex != undefined) {
        CrossDomainIframeInfo.FrameIndex = iFrameIndex;
        times = 0;
        return CrossDomainIframeInfo.FrameIndex;
    } else {
        setTimeout(waitForFrameIndex, 2000);
    }
}

function executeExtractSource() {
    return document.documentElement.outerHTML;
}

function onExecuteJavaScript(event) {
    if (event.detail === null) {
        chrome.runtime.sendMessage({ returnValue: null });
    } else {
        chrome.runtime.sendMessage(event.detail);
    }
    window.removeEventListener("automationanywhere-recorder-ExecuteJs", onExecuteJavaScript);
}
"";
