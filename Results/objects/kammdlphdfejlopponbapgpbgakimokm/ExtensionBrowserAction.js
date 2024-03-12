//Copyright (c) 2020 Automation Anywhere.
// All rights reserved.
//
// This software is the proprietary information of Automation Anywhere.
//You shall use it only in accordance with the terms of the license agreement
//you entered into with Automation Anywhere.

function ExtensionBrowserAction(communicator) {

    var requestTimeoutId;
    var currentRequest;
    var triggerRegistry = new Map();
    var triggerTabRegistry = new Map();
    var windowTitleJournal = new Map();
    var isTriggerListenerRegistered = false;
    var retryXpath = undefined;
    var retryTabId = undefined;
    var retries = 0;
    var frameIndexResponse = undefined;
    var frameIndexFound = false;
    var isIFrameExtractSourceRequest = false;
    var isIFrameExecuteJavascriptRequest = false;
    var retryJsFunction = undefined;
    var retrySelectionCriteria = undefined;

    this.GetAllTabs = function () {
        var tabs = new Array();

        chrome.windows.getAll({ "populate": true }, function (windows) {

            var tabsCollection = new Array();

            for (var windowIndex = 0; windowIndex < windows.length; windowIndex++) {

                for (var tabIndex = 0; tabIndex < windows[windowIndex].tabs.length; tabIndex++) {

                    tabsCollection.push(createBrowserTabObject(windows[windowIndex].tabs[tabIndex]));
                }
            }

            communicator.SendResponse(getAllTabsResponse(tabsCollection));

        });
    }

    this.ActivateTab = function (input) {
        chrome.tabs.onActivated.addListener(onTabActivated);
        beginRequestTimeout(input, sentTimeOutResponse, "activate browser tab");

        var tabId = parseInt(input.findTab.tabId, 10);

        chrome.tabs.get(tabId, function (queryTab) {
            if (chrome.runtime.lastError) {
                sendLastErrorResponse(chrome.runtime.lastError.message);
            } else if (queryTab.active === true) {
                endRequestTimeOut();
                communicator.SendResponse(findTabResponse(queryTab));
            } else {
                currentRequest = { tabId: queryTab.id };
                chrome.tabs.update(queryTab.id, { "active": true }, function (tab) {
                    if (chrome.runtime.lastError) {
                        sendLastErrorResponse(chrome.runtime.lastError.message);
                    }
                });
            }
        });
    }

    this.FindTab = function (input) {
        chrome.tabs.onActivated.addListener(onTabActivated);
        beginRequestTimeout(input, sentTimeOutResponse, "activate browser tab");

        chrome.tabs.query({}, function (tabs) {
            for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
                if (input.findTab && input.findTab.lastUsedTab) {
                    if (tabs[tabIndex].active === true) {
                        endRequestTimeOut();
                        communicator.SendResponse(findTabResponse(tabs[tabIndex]));
                        return;
                    }
                }
                else if (isTabMatch(tabs[tabIndex], input)) {

                    if (tabs[tabIndex].active === true) {
                        endRequestTimeOut();
                        communicator.SendResponse(findTabResponse(tabs[tabIndex]));
                    } else {
                        currentRequest = { tabId: tabs[tabIndex].id };
                        chrome.tabs.update(tabs[tabIndex].id, { "active": true }, function (tab) {
                            if (chrome.runtime.lastError) {
                                sendLastErrorResponse(chrome.runtime.lastError.message);
                            }
                        });
                    }

                    return;
                }
            }
            var errorMessage;
            if (input.findTab.name) {
                errorMessage = "Tab '" + input.findTab.name + "' not found";
            } else {
                errorMessage = "Tab not found with regex pattern match '" + input.findTab.nameRegex + "'";
            }

            endRequestTimeOut();

            communicator.SendResponse(getErrorResponse(errorMessage));
        });
    }

    this.OpenUrlInNewWindow = function (input) {
        chrome.tabs.onUpdated.addListener(onUpdateTab);
        beginRequestTimeout(input, sentTimeOutResponse, "load tab");

        chrome.windows.create({ "url": input.openUrl.url }, function (window) {

            try {
                if (chrome.runtime.lastError) {
                    sendLastErrorResponse(chrome.runtime.lastError.message)
                } else {
                    currentRequest = { tabId: window.tabs[0].id, callBack: openTabCallback };
                }

            } catch (e) {
                sendLastErrorResponse(e.message);
            }

        });
    }

    this.OpenUrlInNewTab = function (input) {
        chrome.tabs.onUpdated.addListener(onUpdateTab);
        beginRequestTimeout(input, sentTimeOutResponse, "load tab");

        newTabAction(input.openUrl.url, input, openTabCallback);
    }

    this.OpenUrlInExistingTab = function (input) {
        chrome.tabs.onUpdated.addListener(onUpdateTab);
        beginRequestTimeout(input, sentTimeOutResponse, "load tab");

        var tabId = parseInt(input.openUrl.openInExistingTab.browserTab.tabId, 10);

        chrome.tabs.update(tabId, { "url": input.openUrl.url, "active": true, "selected": true }, function (tab) {
            try {
                if (chrome.runtime.lastError) {
                    sendLastErrorResponse(chrome.runtime.lastError.message);
                } else {
                    currentRequest = { tabId: tab.id, callBack: openTabCallback };
                }

            } catch (e) {
                sendLastErrorResponse(e.message);
            }
        });
    }

    this.GoBack = function (input) {
        doNavigation(input, chrome.tabs.goBack);
    }

    this.GoForward = function (input) {
        doNavigation(input, chrome.tabs.goForward);
    }

    this.SendErrorResponse = function (message) {
        getErrorResponse(message);
    }

    //Fired when a navigation is committed. The document (and the resources it refers to, such as images and subframes)
    //might still be downloading, but at least part of the document has been received from the server and the browser has decided to switch to the new document.
    //we are adding tabid and url in out MAP list.
    chrome.webNavigation.onCommitted.addListener(function (data) {
        if (data.parentFrameId === -1) {
            NotCompletedPageTabs.set(data.tabId, data.url);
        }
    });

    //Fired when a navigation is about to occur.
    //we are removing tabid from map.(Open new url or change url)
    chrome.webNavigation.onBeforeNavigate.addListener(function (data) {
        if (data.parentFrameId === -1) {
            NotCompletedPageTabs.delete(data.tabId, data.url);
        }
    });

    //Fired when an Error Occurred.
    //we are chacking spacific error amd set map value
    chrome.webNavigation.onErrorOccurred.addListener(function (data) {
        if (data.parentFrameId === -1 && data.error.indexOf("net::ERR_INVALID_AUTH_CREDENTIALS") > 0) {
            NotCompletedPageTabs.set(data.tabId, data.url);
        }
        else {
            NotCompletedPageTabs.delete(data.tabId, data.url);
        }
    });

    //Fired when a tab is closed.
    //we are removing tabid from map
    chrome.tabs.onRemoved.addListener(function (tabid, removed) {
        NotCompletedPageTabs.delete(tabid);
    })

    this.GetDocumentStatus = function (message) {
        stopTimer();
        if (IsAlertWindowOpen == true) {
            communicator.SendResponse(getPageLoadResponse(true, "Complete"));
            return;
        }

        beginRequestTimeout(sentTimeOutResponse, message.timeOutMs + 100, "Could not connect browser tab within " + message.timeOutMs + " seconds.");
        chrome.tabs.getSelected(null, function (tab) {
            if (tab.url.startsWith(chromeURLtobeIgnore) || tab.url.startsWith(edgeURLtobeIgnore)) {
                communicator.SendResponse(getPageLoadResponse(true, "Complete"));
                return;
            }
            if (tab.status === "complete" && tab.id > 0) {
                if (NotCompletedPageTabs.has(tab.id) > 0) {
                    chrome.runtime.onMessage.addListener(onDocumentStatus);
                    chrome.tabs.sendMessage(tab.id, { command: message, browser: Browser.type });
                }
                else {
                    communicator.SendResponse(getPageLoadResponse(true, "Complete"));
                    return;
                }
            }
            else {
                setTimeout(timerFuncationToGetDocumentStatus, 1000, message, message.timeOutMs, documentStatusCallBack);
            }
        });
    }

    this.AddTrigger = function (message) {
        triggerRegistry.set(message.registerTrigger.uiEventId, message.registerTrigger);
        var windowTitle = getWindowTitleFromRequest(message.registerTrigger);
        // Check if any existing tab matches request window title
        chrome.tabs.query({}, function (tabs) {
            for (var tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
                if (tabs[tabIndex].title === windowTitle) {
                    var tabId = tabs[tabIndex].id;
                    console.log("executing content script on: " + windowTitle);
                    prepareEventListener(tabId, message);
                    if (triggerTabRegistry.has(message.registerTrigger.uiEventId)) {
                        triggerTabRegistry.get(message.registerTrigger.uiEventId).push(tabId);
                    } else {
                        triggerTabRegistry.set(message.registerTrigger.uiEventId, [tabId]);
                    }
                }
            }
            console.log('Trigger registered for client: ' + message.registerTrigger.uiEventId);
        });
        if (windowTitleJournal.has(windowTitle)) {
            windowTitleJournal.get(windowTitle).push(message.registerTrigger.uiEventId);
        } else {
            windowTitleJournal.set(windowTitle, [message.registerTrigger.uiEventId]);
        }
        startOnMessageListener();
        communicator.SendResponse(getTriggerResponse(message.registerTrigger.uiEventId, "register"));
    }

    this.RemoveTrigger = function (message) {
        if (triggerTabRegistry.has(message.unregisterTrigger.uiEventId)) {

            triggerTabRegistry.get(message.unregisterTrigger.uiEventId).forEach((tabId) => {
                console.log(`unregistering event for tab ${tabId}, ${JSON.stringify(message)}`)
                chrome.tabs.sendMessage(tabId, message);
            });
            removeEventFromWindowJournal(message.unregisterTrigger.uiEventId);
            triggerRegistry.delete(message.unregisterTrigger.uiEventId);
            triggerTabRegistry.delete(message.unregisterTrigger.uiEventId);
            communicator.SendResponse(getTriggerResponse(message.unregisterTrigger.uiEventId, "unregister"));
        }
    }

    // Triggers event when tab refreshes or navigates which can trigger window title change
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {

        // This will handle case where tab wasnt matching window title earlier and internal navigation changes window title to something matching
        if (tab.status === 'complete' && windowTitleJournal.has(tab.title)) {
            var uiEventIds = windowTitleJournal.get(tab.title);
            uiEventIds.forEach((uiEventId) => {
                console.log(`Registering event ${uiEventId} to tab ${tabId}`);
                var registerTrigger = triggerRegistry.get(uiEventId);
                prepareEventListener(tabId, getTriggerRegisterRequest(registerTrigger));
                if (triggerTabRegistry.has(uiEventId)) {
                    triggerTabRegistry.get(uiEventId).push(tabId);
                } else {
                    triggerTabRegistry.set(uiEventId, [tabId]);
                }
            });
        } else {
            //This will identify a register trigger window is changing window name that isnt matching now.
            triggerTabRegistry.forEach((tabIds, uiEventId) => {
                if (tabIds.includes(tabId)) {
                    var windowTitle = getWindowTitleFromRequest(triggerRegistry.get(uiEventId));
                    if (tab.status === 'complete' && tab.title !== windowTitle) {
                        console.log(`Removing trigger from Tab ${tabId}`);
                        var unregisterRequest = getTriggerUnregisterRequest(uiEventId);
                        chrome.tabs.sendMessage(tabId, unregisterRequest);
                        tabIds.pop(tabId);
                    }
                }
            });
        }
    });

    chrome.tabs.onRemoved.addListener((tabId, removed) => {
        triggerTabRegistry.forEach((tabIds, uiEventId) => {
            tabIds.pop(tabId);
            console.log(`TabId ${tabId} removed from uiEventId ${uiEventId}`);
        });
    });

    function startOnMessageListener() {
        if (!isTriggerListenerRegistered) {
            chrome.runtime.onMessage.addListener((request, sender, SendResponse) => {
                if (triggerRegistry.has(request.uiEventId)) {
                    console.log(`response callback from content script: ${JSON.stringify(request)}`);
                    communicator.SendResponse(getTriggerResponse(request.uiEventId, "event"));
                }
            });
            isTriggerListenerRegistered = true;
            console.log(`Listener registered..`);
        } else {
            console.log(`Listener already registered..`);
        }
    }

    function onDocumentStatus(messge) {
        chrome.runtime.onMessage.removeListener(onDocumentStatus);
        stopTimer();
        if (chrome.runtime.lastError) {
            sendLastErrorResponse(chrome.runtime.lastError.message);
        } else {
            communicator.SendResponse(getPageLoadResponse(messge.status, messge.pagestatus));
        }
    }

    function timerFuncationToGetDocumentStatus(message, numberOfIteration, CallBack) {
        var documentStatusCounter = numberOfIteration - 1000;
        chrome.tabs.getSelected(null, function (sourceTab) {
            if (chrome.runtime.lastError) {
                sendLastErrorResponse(chrome.runtime.lastError.message);
            }
            else if (sourceTab.status === "complete" && sourceTab.id > 0) {
                chrome.runtime.onMessage.addListener(onDocumentStatus);
                chrome.tabs.sendMessage(sourceTab.id, { command: message, browser: Browser.type });
            }
            else if (documentStatusCounter <= 0) {
                CallBack({ result: { status: false, pagestatus: 'unknown' } });
            }
            else {
                setTimeout(timerFuncationToGetDocumentStatus, 1000, message, documentStatusCounter, CallBack);
            }
        });
    }

    function sendLastErrorResponse(message) {
        endRequestTimeOut();
        unregisterAllEvents();
        communicator.SendErrorResponse(getErrorResponse(message));
    }

    function documentStatusCallBack(response) {
        stopTimer();
        if (chrome.runtime.lastError) {
            sendLastErrorResponse(chrome.runtime.lastError.message);
        } else {
            communicator.SendResponse(getPageLoadResponse(response.result.status, response.result.pagestatus));
        }
    }

    function getPageLoadResponse(result, pageStatus) {
        return { documentStatusResponse: { result: result, documentCurrentState: pageStatus.toUpperCase() } }
    }

    this.ExtractPageSource = function (tabId, input) {
        chrome.tabs.sendMessage(tabId, { command: input, browser: Browser.type }, extractPageSourceCallBack);
    }

    this.CloseTab = function (input) {
        chrome.tabs.onRemoved.addListener(onTabRemove);
        beginRequestTimeout(input, sentTimeOutResponse, "close tab");

        var tabId = parseInt(input.closeTab.tabToClose.tabId, 10);
        currentRequest = { tabId: tabId };

        chrome.tabs.remove(tabId, function () {
            if (chrome.runtime.lastError) {
                sendLastErrorResponse(chrome.runtime.lastError.message);
            }

            clearTimeout(requestTimeoutId);
        });
    }

    this.CloseContainingWindow = function (input) {
        chrome.tabs.onRemoved.addListener(onTabRemove);
        beginRequestTimeout(input, sentTimeOutResponse, "close tab");

        var tabId = parseInt(input.closeTab.tabToClose.tabId, 10);
        currentRequest = { tabId: tabId };

        chrome.tabs.get(tabId, function (tab) {
            chrome.windows.remove(tab.windowId, function () {
                if (chrome.runtime.lastError) {
                    sendLastErrorResponse(chrome.runtime.lastError.message);
                }

                clearTimeout(requestTimeoutId);
            });
        });
    }

    this.ExtractPageSource = function (input) {
        var tabId = parseInt(input.extractSource.browserTab.tabId, 10);
        retryTabId = tabId;
        beginRequestTimeout(input, sentTimeOutResponse, "extract source");
        if (isFrameOrMainframeControlTypeExtractSource(input)) {
            if (isMainframeRequestExtractSource(input)) {
                chrome.tabs.sendMessage(tabId, { command: input, browser: browserName }, extractPageSourceCallBack);
            } else {
                var hasDomXPath = isDomXPathPresent(input);
                if (hasDomXPath) {
                    validateIFrameExtractSourceRequest(input);
                    chrome.tabs.sendMessage(tabId, { command: input, browser: Browser.type }, extractPageSourceCallBack);
                } else {
                    var selectionCriteria = input.extractSource.browserTab.browserControl.selectionCriteria;
                    chrome.tabs.sendMessage(tabId, { framerequest: selectionCriteria, browser: browserName }, extractPageSourceCallBack);
                }
            }
        } else {
            chrome.tabs.sendMessage(tabId, { command: input, browser: browserName }, extractPageSourceCallBack);
        }
    }

    function extractPageSourceCallBack(response) {
        if (response && response.errorResult && response.errorResult.includes('Action cannot be performed')) {
            sendFinalResponse(response);
            return;
        }

        if (response && response.result > 0) {
            frameIndexResponse = response;
            crossDomainFrameSourceRequest()
        } else if (response && response.result) {
            sendFinalResponse(response);
            return;
        }

        if (response == undefined && retries > 0 && !frameIndexFound && isIFrameExtractSourceRequest) {
            var input = {
                retry: true,
                xpath: retryXpath
            }
            // handling an undefined response from cross domain iframe
            chrome.tabs.sendMessage(retryTabId, { command: input, browser: Browser.type }, retryResponseCallback);
        }

        if (response == undefined && !frameIndexFound && isIFrameExtractSourceRequest){
            retries++;
            setTimeout(extractPageSourceCallBack, 2000);
            if (frameIndexResponse != undefined) {
                if (frameIndexResponse.result > 0) {
                    frameIndexFound = true;
                }
            }
        } else if (frameIndexFound){
            // Frame index is already present
            crossDomainFrameSourceRequest();
            endRequestTimeOut();
        } else if (!isIFrameExtractSourceRequest){
            // standard html source extraction logic
            if (chrome.runtime.lastError) {
                communicator.SendResponse(getErrorResponse(chrome.runtime.lastError.message));
            } else if (response){
                if (response.errorResult) {
                    communicator.SendResponse(getErrorResponse(response.errorResult));
                } else {
                    communicator.SendResponse({ extractSourceResponse: { sourceContent: response.result } });
                }
            }
            endRequestTimeOut();
        }
    }

    function isDomXPathPresent(input) {
        if (input.extractSource !== undefined) {
            if (input.extractSource.browserTab.browserControl.selectionCriteria.DOMXPath == undefined) {
                return false;
            }
        } else {
            if (input.executeJavaScript.browserTab.browserControl.selectionCriteria.DOMXPath == undefined) {
                return false;
            }
        }

        return true;
    }

    function isMainframeRequestExtractSource(input) {
        if (input.extractSource && input.extractSource.browserTab
            && input.extractSource.browserTab.browserControl
            && input.extractSource.browserTab.browserControl.uiobjectControlType) {
            if (input.extractSource.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                return true;
            }
        }
        return false;
    }

    function isMainframeRequestExecuteJs(input) {
        if (input.executeJavaScript && input.executeJavaScript.browserTab
            && input.executeJavaScript.browserTab.browserControl
            && input.executeJavaScript.browserTab.browserControl.uiobjectControlType) {
            if (input.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                return true;
            }
        }
        return false;
    }

    function validateIFrameExecuteJavascriptRequest(input) {
        if (input.executeJavaScript && input.executeJavaScript.browserTab
            && input.executeJavaScript.browserTab.browserControl
            && input.executeJavaScript.browserTab.browserControl.uiobjectControlType) {
            if (input.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'IFRAME' || input.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                isIFrameExecuteJavascriptRequest = true;
                if (input.executeJavaScript.browserTab.browserControl.selectionCriteria.DOMXPath !== undefined) {
                    retryXpath = input.executeJavaScript.browserTab.browserControl.selectionCriteria.DOMXPath.value.string;
                }
            }
        }
    }

    function validateIFrameExtractSourceRequest(input) {
        if (input.extractSource && input.extractSource.browserTab
            && input.extractSource.browserTab.browserControl
            && input.extractSource.browserTab.browserControl.uiobjectControlType) {
            if (input.extractSource.browserTab.browserControl.uiobjectControlType === 'IFRAME' || input.extractSource.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                isIFrameExtractSourceRequest = true;
                retrySelectionCriteria = input.extractSource.browserTab.browserControl.selectionCriteria;
                if (input.extractSource.browserTab.browserControl.selectionCriteria.DOMXPath !== undefined) {
                    retryXpath = input.extractSource.browserTab.browserControl.selectionCriteria.DOMXPath.value.string;
                }
            }
        }
    }

    function isFrameOrMainframeControlTypeExtractSource(input) {
        if (input.extractSource && input.extractSource.browserTab
            && input.extractSource.browserTab.browserControl
            && input.extractSource.browserTab.browserControl.uiobjectControlType) {
            if (input.extractSource.browserTab.browserControl.uiobjectControlType === 'IFRAME' || input.extractSource.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                return true;
            }
        }
        return false;
    }

    function isFrameOrMainframeControlTypeExecuteJs(input) {
        if (input.executeJavaScript && input.executeJavaScript.browserTab
            && input.executeJavaScript.browserTab.browserControl
            && input.executeJavaScript.browserTab.browserControl.uiobjectControlType) {
            if (input.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'IFRAME' || input.executeJavaScript.browserTab.browserControl.uiobjectControlType === 'MAINFRAME') {
                return true;
            }
        }
        return false;
    }

    function onTabFrameResponse(response) {
        sendFinalResponse(response);
        // reset fields used for retry
        resetExecutionRetryFields('extract');
        endRequestTimeOut();
    }

    function sendFinalResponse (response) {
        if (chrome.runtime.lastError) {
            communicator.SendResponse(getErrorResponse(chrome.runtime.lastError.message));
        } else if (response){
            if (response.errorResult) {
                communicator.SendResponse(getErrorResponse(response.errorResult));
            } else {
                communicator.SendResponse({ extractSourceResponse: { sourceContent: response.result } });
            }
        }
    }

    function retryResponseCallback(response) {
        frameIndexResponse = response;

        if (frameIndexResponse.result > 0) {
            crossDomainFrameSourceRequest();
        }
    }

    function crossDomainFrameSourceRequest() {
        var input;
        if (isIFrameExecuteJavascriptRequest) {
            input = {
                jsExecution: true,
                jsFunction: retryJsFunction
            }
        } else if (isIFrameExtractSourceRequest) {
            input = {
                extract: true,
                selectionCriteria: retrySelectionCriteria
            }
        }
        if (isIFrameExtractSourceRequest) {
            chrome.webNavigation.getFrame({ tabId: retryTabId, frameId: frameIndexResponse.result }, (frame) => {
                chrome.tabs.sendMessage(retryTabId, { crossdomainframe: input, browser: browserName }, { frameId: frameIndexResponse.result }, onTabFrameResponse);
            });
        } else if (isIFrameExecuteJavascriptRequest) {
            chrome.webNavigation.getFrame({ tabId: retryTabId, frameId: frameIndexResponse.result }, (frame) => {
                chrome.tabs.sendMessage(retryTabId, { crossdomainframe: input, browser: browserName }, { frameId: frameIndexResponse.result });
            });
        }
    }

    this.ExecuteJavaScript = function (input) {
        beginRequestTimeout(input, sentTimeOutResponse, "execute java script");
        var tabId = parseInt(input.executeJavaScript.browserTab.tabId, 10);
        retryTabId = tabId;
        retryJsFunction = input.executeJavaScript.javaScriptFunction;
        chrome.runtime.onMessage.addListener(onRunTimeMessageReceive);
        if (isFrameOrMainframeControlTypeExecuteJs(input)) {
            if (isMainframeRequestExecuteJs(input)) {
                chrome.tabs.sendMessage(tabId, { command: input, browser: Browser.type });
            } else {
                if (isDomXPathPresent(input)) {
                    validateIFrameExecuteJavascriptRequest(input);
                    try {
                        if (isIFrameExecuteJavascriptRequest) {
                            chrome.tabs.sendMessage(tabId, { command: input, browser: Browser.type }, executeJavascriptCallBack);
                        } else {
                            chrome.tabs.sendMessage(tabId, { command: input, browser: Browser.type });
                        }
                    } catch (e) {
                        sendLastErrorResponse(e.message);
                    }
                } else {
                    var selectionCriteria = input.executeJavaScript.browserTab.browserControl.selectionCriteria;
                    var input = {
                        selectionCriteria: selectionCriteria,
                        isJavascriptRequest: true,
                        jsFunction: retryJsFunction,
                        xpath: undefined
                    }
                    chrome.tabs.sendMessage(tabId, { framerequest: input, browser: browserName }, executeJavascriptCallBack);
                }
            }
        } else {
            // normal js execution
            chrome.tabs.sendMessage(tabId, { command: input, browser: browserName });
        }

    }

    function executeJavascriptCallBack(response) {
        if (response && response.errorResult === 'xpath is not defined') {
            response.errorResult = 'Action cannot be performed. XPath is not defined';
            sendFinalResponse(response);
            return;
        }

        if (response && response.errorResult === 'Action cannot be performed') {
            sendFinalResponse(response);
            return;
        }
        if (retries > 0 && !frameIndexFound && isIFrameExecuteJavascriptRequest) {
            var input = {
                retry: true,
                xpath: retryXpath
            }
            // handling an undefined response from cross domain iframe
            chrome.tabs.sendMessage(retryTabId, { command: input, browser: Browser.type }, retryResponseCallback);
        }

        if (!frameIndexFound && isIFrameExecuteJavascriptRequest){
            retries++;
            setTimeout(executeJavascriptCallBack, 2000);
            if (frameIndexResponse != undefined) {
                if (frameIndexResponse.result > 0) {
                    frameIndexFound = true;
                }
            }
        } else if (frameIndexFound){
            // Frame index is already present
            crossDomainFrameSourceRequest();
            endRequestTimeOut();
        }
    }

    function onRunTimeMessageReceive(message, sender, response) {
        if (message.errorResponse) {
            sendLastErrorResponse(message.errorResponse);
        } else {
            var result;
            if (message.returnValue) {
                result = message.returnValue;
            } else {
                result = null;
            }
            var response = { executeJavaScriptResponse: { returnValue: result } };
            endRequestTimeOut();
            communicator.SendResponse(response);
            resetExecutionRetryFields('execution');
        }
    }

    function resetExecutionRetryFields(type) {
        if (type === 'execution') {
            isIFrameExecuteJavascriptRequest = false;
        } else {
            isIFrameExtractSourceRequest = false;
        }
        retryXpath = undefined;
        retryTabId = undefined;
        retries = 0;
        frameIndexResponse = undefined;
        frameIndexFound = false;
        retryJsFunction = undefined;
        retrySelectionCriteria = undefined;
    }

    function sendLastErrorResponse(message) {
        endRequestTimeOut();
        communicator.SendResponse(getErrorResponse(message));
    }

    function newTabAction(url, input, successCallback) {
        chrome.windows.getCurrent({
            "populate": true
        }, function (window) {
            chrome.tabs.create({ "active": true, "windowId": window.windowId, "url": url }, function (tab) {

                try {
                    if (chrome.runtime.lastError) {
                        clearTimeout(requestTimeoutId);
                        communicator.SendResponse(getErrorResponse(chrome.runtime.lastError.message))
                    } else {
                        currentRequest = { tabId: tab.id, callBack: successCallback, request: input };
                    }
                } catch (e) {
                    clearTimeout(requestTimeoutId);
                    communicator.SendResponse(getErrorResponse(e.message));
                }
            });
        });
    }

    function stopTimer() {
        if (requestTimeoutId) {
            clearTimeout(requestTimeoutId);
        }
    }

    function doNavigation(input, navigationApi) {
        chrome.tabs.onUpdated.addListener(onUpdateTab);
        beginRequestTimeout(input, sentTimeOutResponse, "load tab");

        var tabId = parseInt(input.navigateSteps.tab.tabId, 10);
        input.nagivationApi = navigationApi;

        chrome.tabs.get(tabId, function (queryTab) {
            if (chrome.runtime.lastError) {
                sendLastErrorResponse(chrome.runtime.lastError.message);
            } else {
                navigateTab(queryTab, input);
            }
        });
    }

    function navigateTab(tab, input) {
        var iteration = input.navigateSteps.stepCount;
        if (iteration > 0) {
            input.navigateSteps.stepCount = input.navigateSteps.stepCount - 1;
            currentRequest = { tabId: tab.id, callBack: navigateTab, request: input };
            input.nagivationApi(tab.id, function () {
                if (chrome.runtime.lastError) {
                    sendLastErrorResponse(chrome.runtime.lastError.message);
                }
            });
        } else {
            endRequestTimeOut();
            var browserResponse = new Object();
            browserResponse.navigateStepResponse = new Object();
            communicator.SendResponse(browserResponse);
        }
    }

    function getErrorResponse(message) {
        var browserResponse = new Object();
        browserResponse.errorResponse = new Object();
        browserResponse.errorResponse.errorMessage = message;
        return browserResponse;
    }

    function getOpenURLResponse(tab) {

        var browserResponse = new Object();
        browserResponse.openUrlResponse = new Object()
        browserResponse.openUrlResponse.tab = createBrowserTabObject(tab);

        return browserResponse;
    }

    function getAllTabsResponse(tabs) {
        var browserResponse = new Object();
        browserResponse.tabListResponse = new Object();
        browserResponse.tabListResponse.tabs = tabs;

        return browserResponse;
    }

    function findTabResponse(tab) {
        var browserResponse = new Object();
        browserResponse.findTabResponse = new Object();
        browserResponse.findTabResponse.tab = createBrowserTabObject(tab);

        return browserResponse;
    }

    function getCloseTabResponse() {
        var browserResponse = new Object();
        browserResponse.closeTabResponse = new Object();
        return browserResponse;
    }

    function createBrowserTabObject(tab) {

        var tabDetail = new Object();
        tabDetail.name = tab.title;
        tabDetail.url = tab.url;
        tabDetail.tabId = tab.id.toString();
        tabDetail.windowId = tab.windowId.toString();
        tabDetail.isTabActive = tab.active;

        return tabDetail;
    }

    function isTabMatch(tab, request) {
        if (request.findTabByRegex) {
            try {
                var pattern = new RegExp(request.findTabByRegex.nameRegex, request.findTabByRegex.nameRegexFlags);
                return pattern.test(tab.title);
            } catch (e) {
                return false;
            }
        } else if (request.findTab) {
            if (request.findTab.name) {
                if (request.findTab.nameCaseInsensitive) {
                    return tab.title.toLowerCase() === request.findTab.name.toLowerCase();
                }
                else {
                    return tab.title === request.findTab.name;
                }

            } else if (request.findTab.nameRegex) {
                try {
                    if (request.findTab.nameCaseInsensitive) {
                        var pattern = new RegExp(request.findTab.nameRegex, "i");
                        return pattern.test(tab.title);
                    }
                    else {
                        var pattern = new RegExp(request.findTab.nameRegex);
                        return pattern.test(tab.title);
                    }
                } catch (e) {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    function onTabActivated(activeTabInfo) {
        if (currentRequest && activeTabInfo.tabId === currentRequest.tabId) {

            endRequestTimeOut();

            chrome.tabs.get(activeTabInfo.tabId, function (queryTab) {
                communicator.SendResponse(findTabResponse(queryTab));
            });
        }
    }

    function onUpdateTab(tabId, changeInfo, tab) {
        if (currentRequest && tab.id == currentRequest.tabId) {
            if (changeInfo.status === "complete") {
                currentRequest.callBack(tab, currentRequest.request);
            }
            else if (Browser.type === "Edge" && changeInfo.status === undefined) {
                currentRequest.callBack(tab, currentRequest.request);
            }
        }
    }

    function openTabCallback(tab, input) {
        endRequestTimeOut();
        communicator.SendResponse(getOpenURLResponse(tab));
    }

    function onTabRemove(tabId, removeInfo) {
        if (currentRequest && tabId === currentRequest.tabId) {

            endRequestTimeOut();

            communicator.SendResponse(getCloseTabResponse());
        }
    }

    function sentTimeOutResponse(errorMessage) {
        unregisterAllEvents();

        communicator.SendResponse(getErrorResponse(errorMessage));
    }

    function unregisterAllEvents() {
        currentRequest = undefined;
        chrome.runtime.onMessage.removeListener(onRunTimeMessageReceive);
        chrome.tabs.onActivated.removeListener(onTabActivated);
        chrome.tabs.onUpdated.removeListener(onUpdateTab);
        chrome.tabs.onRemoved.removeListener(onTabRemove);
    }

    function beginRequestTimeout(input, callback, action) {
        var millis = Number(input && input.timeOutMs) || 15000;
        var message = 'Could not ' + action + ' within ' + Math.ceil(millis / 1000) + ' seconds';
        clearTimeout(requestTimeoutId);
        requestTimeoutId = setTimeout(callback, millis, message);
    }

    function endRequestTimeOut() {
        unregisterAllEvents();
        clearTimeout(requestTimeoutId);
    }

    function removeEventFromWindowJournal(uiEventId) {
        if (triggerRegistry.has(uiEventId)) {
            var registerTrigger = triggerRegistry.get(uiEventId);
            var windowTitle = getWindowTitleFromRequest(registerTrigger);
            windowTitleJournal.get(windowTitle).pop(uiEventId);
        }
    }

    getWindowTitleFromRequest = function (registerTrigger) {
        return registerTrigger.uiEventRequest.uiobjectWindow.window.name;
    }

    prepareEventListener = function(tabId, message) {
        chrome.tabs.sendMessage(tabId, message);
    }

    getTriggerResponse = function (uiEventId, type) {
        var browserResponse = new Object();
        browserResponse.triggerResponse = new Object();
        browserResponse.triggerResponse.uiEventId = uiEventId;
        browserResponse.triggerResponse.type = type;
        return browserResponse;
    }

    getTriggerRegisterRequest = function (triggerRequest) {
        var browserRequest = new Object();
        browserRequest.registerTrigger = triggerRequest;
        return browserRequest;
    }

    getTriggerUnregisterRequest = function(uiEventId) {
        var browserRequest = new Object();
        browserRequest.unregisterTrigger = new Object();
        browserRequest.unregisterTrigger.uiEventId = uiEventId;
        return browserRequest;
    }
}

try {
    module.exports = ExtensionBrowserAction
} catch (e) {};
