//Copyright (c) 2020 Automation Anywhere.
// All rights reserved.
//
// This software is the proprietary information of Automation Anywhere.
//You shall use it only in accordance with the terms of the license agreement
//you entered into with Automation Anywhere.

var protocol;
var parseXml;

var AAHTMLControl;

var wHandle;
var requestHandlerCnt = 0;

var requestHandleTimeOutId;
var isRequestSend = false;
var titleVerificationCounter = 0;

var isChromeTabLoaded = false;
var chromeWaitTime = 0;
var chromeResponseText;
var browserName;
var waitingTime = 0;
var isEdgeTabLoaded = false;
var edgeResponseText;

var isContentPageLoaded = false;
var IsFirefox = false;
var IsChrome = false;
var WriteExceptionLog = true;

var ObjectMapperXML = '';
var communicator;
var browserAction;
var chromeURLtobeIgnore = "chrome://"
var edgeURLtobeIgnore = "edge://"

connectSocketServer();

function connectSocketServer() {
    try {

        if (typeof window.DOMParser != "undefined") {
            parseXml = function (xmlStr) {
                return (new window.DOMParser()).parseFromString(xmlStr, "text/xml");
            };
        } else if (typeof window.ActiveXObject != "undefined" &&
            new window.ActiveXObject("Microsoft.XMLDOM")) {
            parseXml = function (xmlStr) {
                var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
                return xmlDoc;
            };
        } else {
            throw new Error("No XML parser found");
        }

        var browser = window.navigator.userAgent.toString();

        AALogger('HTMLExtensionSocket', 'connectSocketServer', 'browser:-' + browser);

        if (browser.indexOf("Chrome") != -1) {
            AALogger('HTMLExtensionSocket', 'connectSocketServer', `Connected with ${Browser.type} native messaging.`);
            protocol = new ExtensionNativeMessaging();
            communicator = new ExtensionCommunicator(protocol);
            communicator.PageCompleteCallBack = chromeWaitLoadComplete;
            browserAction = new ExtensionBrowserAction(protocol);
        }
        else if (browser.indexOf("Firefox") != -1) {
            AALogger('HTMLExtensionSocket', 'connectSocketServer', 'Connected with FireFox native messaging.');
            protocol = new ExtensionNativeMessaging();
            communicator = new ExtensionCommunicator(protocol);
            isChromeTabLoaded = communicator.IsTabLoaded;
            communicator.PageCompleteCallBack = firefoxWaitLoadComplete;
            browserAction = new ExtensionBrowserAction(protocol);
        }

        communicator.BindListner();
        protocol.OnMessageReceiveCallBack = processResponse;
        protocol.Connect();
    }
    catch (e) {
        AALogger('HTMLExtensionSocket', 'connectSocketServer', e.message);
    }
}

function chromeCongidration() {
    if (isRequestSend == false) {
        protocol.Send("Configuration: Service;HTML;TA-CBS-CHROME-AGENT");
        isRequestSend = true;
    }
}

function edgeCongidration() {
    if (protocol.IsRequestSent == false) {
        protocol.Send("Configuration: Service;HTML;AA-EDGE-AGENT");
        isRequestSend = true;
    }
}

function executeBrowserRequest(response) {
    try {
        var browserRequest = JSON.parse(response.data);

        if (browserRequest.getTabList) {
            browserAction.GetAllTabs();
        } else if (browserRequest.findTab) {
            if (browserRequest.findTab.tabId) {
                browserAction.ActivateTab(browserRequest);
            } else {
                browserAction.FindTab(browserRequest);
            }
        } else if (browserRequest.findTabByRegex) {
            browserAction.FindTab(browserRequest);
        } else if (browserRequest.openUrl) {
            if (browserRequest.openUrl.openInExistingTab) {
                browserAction.OpenUrlInExistingTab(browserRequest);
            } else {
                if (browserRequest.openUrl.openInNewTabWindow.openWithOption == "WINDOW") {
                    browserAction.OpenUrlInNewWindow(browserRequest);
                } else {
                    browserAction.OpenUrlInNewTab(browserRequest);
                }
            }
        } else if (browserRequest.navigateSteps) {
            if (browserRequest.navigateSteps.navDir == "FORWARD") {
                browserAction.GoForward(browserRequest);
            } else {
                browserAction.GoBack(browserRequest);
            }
        } else if (browserRequest.closeTab) {
            if (browserRequest.closeTab.closeContainingWin) {
                browserAction.CloseContainingWindow(browserRequest);
            } else {
                browserAction.CloseTab(browserRequest);
            }
        } else if (browserRequest.extractSource) {
            browserAction.ExtractPageSource(browserRequest);
        } else if (browserRequest.executeJavaScript) {
            browserAction.ExecuteJavaScript(browserRequest);
        } else if (browserRequest.waitForDocumentStatus) {
            browserAction.GetDocumentStatus(browserRequest);
        } else if (browserRequest.registerTrigger) {
            browserAction.AddTrigger(browserRequest);
        } else if (browserRequest.unregisterTrigger) {
            browserAction.RemoveTrigger(browserRequest);
        }
        else {
            browserAction.SendErrorResponse("Unsupported browser command.");
        }
    } catch (e) {
        browserAction.SendErrorResponse(e.message);
    }
}

function processResponse(response) {
    LastCommand = "None";
    if (response.data.indexOf("{") == 0) {
        executeBrowserRequest(response);
    } else {
        OnSocketDataReceive(response);
    }
}

function OnSocketDataReceive(response) {
    responseText = response.data;
    try {
        var browser = window.navigator.userAgent.toString();
        if (responseText != "") {
            if (responseText.search("ClientID:") != -1) {
                if (browser.indexOf("Edge") != -1) {
                    setTimeout(edgeCongidration, 200);
                }
                else if (browser.indexOf("Chrome") != -1) {
                    setTimeout(chromeCongidration, 200);
                }
                else if (browser.indexOf("Firefox") != -1) {
                    requestHandlerCnt = 0;
                    if (content.document.readyState == "complete" || content.document.readyState == "interactive") {
                        requestHandle();
                    }
                    else {
                        gBrowser.addEventListener("DOMContentLoaded", DocumentLoadComplete, true);
                    }
                }
                PlugInCommand = "";
            }
            else if (responseText.search("REQFORWINHANDLE:") != -1) {

                isRequestSend = false;
                if (responseText.substring(16) == "") {
                    if (requestHandlerCnt < 60) {
                        requestHandlerCnt++;
                        requestHandleTimeOutId = setTimeout(requestHandle, 500);
                    }
                }
                else {
                    wHandle = responseText.substring(16);
                    gBrowser.tabContainer.childNodes[0].setAttribute("wHandle", wHandle);
                    if (isRequestSend == false) {
                        protocol.Send("Configuration: Service;HTML;TA-CBS-FIREFOX-AGENT" + wHandle);
                        isRequestSend = true;
                    }
                }

            }
            else if (responseText.search("OPEN_URL") != -1 || responseText.search("GET_URL") != -1) {
                try {
                    if (browser.indexOf("Chrome") != -1) {
                        chrome.tabs.getSelected(null, function (tab) {
                            ExtensionTabExecutor(responseText, tab);
                        });
                    } else if (browser.indexOf("Firefox") != -1) {
                        browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                            for (let tab of tabs) {
                                ExtensionTabExecutor(responseText, tab);
                            }
                        });
                    }
                }
                catch (e) {
                    AALogger('HTMLExtensionSocket', 'OnSocketDataReceive', e.message);
                    protocol.Send("<AAOABResult Result='false' Error='None'></AAOABResult>");
                    isOpenURL = false;
                    selectedTabId = -1;
                    clearTimeout(lastTimeOutId);
                }
            }
            else if (responseText.search("PAGELOADSTATUS") != -1) {
                var pageloadStatus = "false";

                if (document.readyState == "complete" || document.readyState == "interactive")
                    pageloadStatus = "true";

                protocol.Send("<PAGELOADSTATUS>" + pageloadStatus + "</PAGELOADSTATUS>");

            }
            else {
                if (responseText.indexOf("PluginCommand") != -1 || responseText.search("APPLETRECT") != -1) {
                    if (Browser.type === 'Chrome' || Browser.type === 'Edge') {
                        if (responseText.indexOf("TYPE_MAPPING") > 0) {
                            ObjectMapperXML = responseText;
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, { mapperXML: ObjectMapperXML }, function (response) {
                                    protocol.Send("<AAOABResult Result='true'></AAOABResult>");
                                });
                            });
                        }
                        else {
                            if (responseText.indexOf(HTMlRequestAction.PLAY_OBJECT_ACTION) > 0) {
                                LastCommand = HTMlRequestAction.PLAY_OBJECT_ACTION;
                            }
                            console.log("IsAlertWindowOpen value:", IsAlertWindowOpen);
                            if(IsAlertWindowOpen == true )
                            {
                                if (responseText.indexOf("DETECT_OBJECT_NODE") > 0 ||
                                    responseText.indexOf("CAPTURE_OBJECT_NODE") > 0 )
                                {
                                    protocol.Send("<PluginObjectNode></PluginObjectNode>");
                                }
                            }


                            waitingTime = parseInt(getPlayWait(responseText));

                            isChromeTabLoaded = false;
                            chromeResponseText = responseText;
                            browserName = Browser.type;
                            chromeWaitTime = (new Date()).getTime();
                            waitingTime = chromeWaitTime + (waitingTime * 1000);
                            chromeWaitLoadComplete();
                        }
                    } else if (browser.indexOf("Firefox") != -1) {
                        if (responseText.indexOf("TYPE_MAPPING") > 0) {
                            ObjectMapperXML = responseText;
                            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, { mapperXML: ObjectMapperXML }, function (response) {
                                    protocol.Send("<AAOABResult Result='true'></AAOABResult>");
                                });
                            });
                        }
                        else {
                            waitingTime = parseInt(getPlayWait(responseText));

                            isChromeTabLoaded = false;
                            chromeResponseText = responseText;
                            browserName = "Firefox";
                            chromeWaitTime = (new Date()).getTime();
                            waitingTime = chromeWaitTime + (waitingTime * 1000);
                            firefoxWaitLoadComplete();
                        }
                    }
                }
            }
        }
    }
    catch (e) {
        AALogger('HTMLExtensionSocket', 'OnSocketDataReceive', e.message);
        protocol.Send("ERROR:" + e.message);
    }
}

function getPlayWait(responseText) {
    var xmlDoc = parseXml(responseText);
    var xmlAction = xmlDoc.getElementsByTagName("PluginCommand");
    var xmlElements = xmlDoc.getElementsByTagName("Prop");

    var actionName, playValue1, playValue2;
    for (i = 0; i < xmlElements.length; i++) {
        var PropertyName = xmlElements[i].attributes.getNamedItem("Nam").nodeValue;
        var PropertyValue = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        switch (PropertyName) {
            case "PlayWait":
                {
                    if (PropertyValue == '0') {
                        return "15";
                    }
                    return PropertyValue;
                }
        }
    }
    return "15";
}
function sendResponseToEdge(response) {
    if (response && response.data.includes('CAPTURE_OBJECT_NODE')) {
        sendCrossDomainCaptureRequest(response);
        return;
    }

    if (response && (response.data.includes('PLAY_OBJECT_ACTION') || response.data.includes('SEARCH_OBJECT'))) {
        PlayCrossDomainRequest(response);
        return;
    }
    if (communicator.IsResponseSent != true) {
        communicator.IsResponseSent = true;
        protocol.SendResponse(response);
    }
}

function DocumentLoadComplete(event) {
    var doc = event.originalTarget;
    try {
        isContentPageLoaded = true;
        event.originalTarget.defaultView.addEventListener("unload", function (event) {
            isContentPageLoaded = false;
        }, true);
        if (event.originalTarget instanceof HTMLDocument) {

            var win = event.originalTarget.defaultView;

            if (win.frameElement) {
                return;
            }
            requestHandle();
        }
    }
    catch (e) {
        AALogger('HTMLExtensionSocket', 'DocumentLoadComplete', e.message);
    }

}

function requestHandle() {
    clearTimeout(requestHandleTimeOutId);
    var title = gBrowser.contentTitle;

    if (title == "") {
        title = gBrowser.currentURI.spec;
        if (title.indexOf("#") != -1) {
            title = title.substring(0, gBrowser.currentURI.spec.indexOf("#"));
        }
    }
    if (title == "about:blank" && titleVerificationCounter < 4) {
        requestHandlerCnt++;
        titleVerificationCounter = titleVerificationCounter + 1;
        setTimeout(requestHandle, 500);
    }
    else {
        if (isRequestSend == false) {
            isRequestSend = true;
            protocol.Send("REQFORWINHANDLE:" + title + " - Mozilla Firefox");
            titleVerificationCounter = 0;

        }
    }
}

function sendCrossDomainCaptureRequest(responseText) {
    var xmlDoc = parseXml(responseText.data);
    var xmlElements = xmlDoc.getElementsByTagName("Prop");
    var src;
    var crossdomainframeindex;

    var actionName, playValue1, playValue2;
    for (i = 0; i < xmlElements.length; i++) {
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'src') {
            src = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'CrossdomainIframeIndex') {
            crossdomainframeindex = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'ParentObject') {
            ParentObject = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }

    }
    if (crossdomainframeindex != undefined) {
        sendrequesttoFrame(src, responseText.data, crossdomainframeindex, ParentObject);
    }
}

function PlayCrossDomainRequest(responseText) {

    var xmlDoc = parseXml(responseText.data);
    var xmlElements = xmlDoc.getElementsByTagName("Prop");
    var src;
    var crossdomainframeindex;
    var parentleft;
    var parenttop;
    for (i = 0; i < xmlElements.length; i++) {
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'CrossDomainFrameIndex') {
            crossdomainframeindex = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'ParentLeft') {
            parentleft = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'ParentTop') {
            parenttop = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
    }

    xmlDoc = parseXml(chromeResponseText);
    xmlElements = xmlDoc.getElementsByTagName("Prop");
    var removelement;
    for (i = 0; i < xmlElements.length; i++) {
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'FrameDOMXPath') {
            xmlElements[i].attributes.getNamedItem("Nam").nodeValue = "IsCrossDomainRequest";
            xmlElements[i].attributes.getNamedItem("Val").nodeValue = "true";
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'IEFrameSrc') {
            src = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'ParentLeft') {
            xmlElements[i].attributes.getNamedItem("Val").nodeValue = parentleft;
        }
        if (xmlElements[i].attributes.getNamedItem("Nam").nodeValue == 'ParentTop') {
            xmlElements[i].attributes.getNamedItem("Val").nodeValue = parenttop;
        }
    }
    var searchobjectrequest = GetXMLString(xmlDoc);

    if (crossdomainframeindex != undefined) {
        sendrequesttoFrame(src, searchobjectrequest, crossdomainframeindex);
    }
}

function GetXMLString(xmldoc) {

    return new XMLSerializer().serializeToString(xmldoc);
}

function sendrequesttoFrame(url, responsetext, frameindex, ParentObject) {
    chrome.tabs.getSelected(null, function (tab) {
        if (tab.status != "loading") {
            var tabId;
            var requestsend = false;
            var crossdomainFrameIndex = parseInt(frameindex);
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                tabId = tabs[0].id;
                chrome.webNavigation.getFrame({ tabId: tabId, frameId: crossdomainFrameIndex }, function (details) {
                    chrome.tabs.sendMessage(tabId, { method: responsetext, browser: browserName, "IsOABRequest": true }, { frameId: crossdomainFrameIndex }, sendResponseToEdge);
                    requestsend = true;
                    return;
                });
                if (requestsend == false && ParentObject && crossdomainFrameIndex < 0) {
                    protocol.Send(ParentObject);
                }
            });
        }
        else {
            chromeWaitTime = (new Date()).getTime();
            if (waitingTime > chromeWaitTime) {
                setTimeout(sendrequesttoFrame, 1000, responsetext, crossdomainFrameIndex, ParentObject);
            }
            else {
                protocol.Send("<AAOABResult Result='false' Error='NullObject'></AAOABResult>");
            }
        }
    });
}

function chromeWaitLoadComplete() {
    chrome.tabs.getSelected(null, function (tab) {
        if (tab.status != "loading") {
            if (tab.url.startsWith(chromeURLtobeIgnore) || tab.url.startsWith(edgeURLtobeIgnore)) {
                protocol.Send("<AAOABResult Result='false' Error='ContainScriptNotAvailable'></AAOABResult>");
                return;
            }
            isChromeTabLoaded = true;
            communicator.IsResponseSent = false;
            var tabId;
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                tabId = tabs[0].id;
                chrome.webNavigation.getAllFrames({ tabId: tabId }, function (details) {
                    for (var i = 0; i < details.length; i++) {
                        if (details[i].parentFrameId == -1) {
                            chrome.tabs.sendMessage(tabId, { method: chromeResponseText, browser: browserName, "IsOABRequest": true }, { frameId: details[i].frameId }, sendResponseToEdge);
                        }
                    }
                });
            });
        }
        else {
            chromeWaitTime = (new Date()).getTime();
            if (waitingTime > chromeWaitTime) {
                setTimeout(chromeWaitLoadComplete, 1000);
            }
            else {
                protocol.Send("<AAOABResult Result='false' Error='NullObject'></AAOABResult>");
            }
        }
    });
}

function firefoxWaitLoadComplete() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let tab = tabs[0];
        if (tab.status != "loading") {
                if (tab.url == "about:newtab") {
                    protocol.Send("<AAOABResult Result='false' Error='ContainScriptNotAvailable'></AAOABResult>");
                    return;
                }
            isChromeTabLoaded = true;
            communicator.IsResponseSent = false;
            chrome.tabs.sendMessage(tab.id, { method: chromeResponseText, browser: browserName, "IsOABRequest": true }, sendResponseToEdge);
        }
        else {
            chromeWaitTime = (new Date()).getTime();
            if (waitingTime > chromeWaitTime) {
                setTimeout(firefoxWaitLoadComplete, 1000);
            }
            else {
                protocol.Send("<AAOABResult Result='false' Error='NullObject'></AAOABResult>");
            }
        }
    });
}

function onToolbarClick() {
    var companyInfo = "Testing Anywhere Extension for Mozilla Firefox" + "\n" + "\xA9 Automation Anywhere, Inc. All Rights Reserved.";
    var prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
        .getService(Components.interfaces.nsIPromptService);

    prompts.alert(null, "Testing Anywhere", companyInfo);
}
