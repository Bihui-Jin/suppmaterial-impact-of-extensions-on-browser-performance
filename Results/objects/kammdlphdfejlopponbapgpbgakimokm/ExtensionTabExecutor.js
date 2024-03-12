var isOpenURL = false;
var selectedTabId = -1;
var waitFor = 20000;
var lastTimeOutId;
var IsAlertWindowOpen = false;
var NotCompletedPageTabs = new Map();

function ExtensionTabExecutor(responseText, tab) {

    isOpenURL = true;
    var xmlDoc = parseXml(responseText);
    var xmlAction = xmlDoc.getElementsByTagName("PluginCommand");
    var xmlElements = xmlDoc.getElementsByTagName("Prop");
    var actionName, playValue1, playValue2;
    for (i = 0; i < xmlElements.length; i++) {
        var PropertyName = xmlElements[i].attributes.getNamedItem("Nam").nodeValue;
        var PropertyValue = xmlElements[i].attributes.getNamedItem("Val").nodeValue;
        switch (PropertyName) {
            case HTMLPropertyEnum.ActionToPlay:
                actionName = PropertyValue;
                break;
            case HTMLPropertyEnum.PlayValue1:
                playValue1 = PropertyValue;
                break;
            case HTMLPropertyEnum.PlayValue2:
                playValue2 = PropertyValue;
                break;
        }
    }

    switch (actionName) {
        case HTMLBrowserAction.CheckPageExists:
            checkPageExists(playValue1, playValue2);
            break;
        case HTMLBrowserAction.NavigateURL:
            navigateURL(playValue1);
            break;
        case HTMLBrowserAction.NewWindow:
            newWindow(playValue1);
            break;
        case HTMLBrowserAction.Close:
            close(playValue1);
            break;
        case HTMLBrowserAction.NewTab:
            newTab(playValue1);
            break;
        case HTMLBrowserAction.GetCurrentTab:
            getCurrentTab(tab);
            break;
        case HTMLBrowserAction.GetURL:
            getURL();
            break;
    }

}

function getURL()
{
    chrome.tabs.getSelected(null, function (tab) {
        var tabId = tab.id;
        var tabUrl = tab.url;
        ws.send("<AAOABResult Result='true' Error='None'><Vals><Val>" + new HTMLCommon(null).ReplaceSpacialCharecter(tabUrl) + "</Val></Vals></AAOABResult>");
        //alert(tabUrl);
    });
}

function getCurrentTab(tab)
{
    if (tab.status == "complete") {
        selectedTabId = tab.id;
        sendPageComplete();
    }
    else
    {
        selectedTabId = tab.id;
        lastTimeOutId = setTimeout(sendResponseIfPageNotLoaded, waitFor);
    }
}

function checkPageExists(url, searchFor) {
    var isUrl = false;

    if (searchFor.substring(0,3) == 'URL') {
        searchFor = searchFor.substring(4);
        isUrl = true;
    }
    else {
        searchFor = searchFor.substring(6);
    }

    var isFound = false;

    chrome.windows.getAll({ "populate": true }, function (windows) {

        selectedTabId = -1;

        for (var i = 0; i < windows.length; i++) {
            for (var j = 0; j < windows[i].tabs.length; j++) {
                if (isUrl) {

                    var currentUrl = removeSlash(windows[i].tabs[j].url);
                    searchFor = removeSlash(searchFor);

                    if (currentUrl == searchFor) {
                        isFound = true;
                        selectedTabId = windows[i].tabs[j].id;
                        break;
                    }
                }
                else {
                    if (windows[i].tabs[j].title == searchFor) {
                        isFound = true;
                        selectedTabId = windows[i].tabs[j].id;
                        break;
                    }
                }

            }
        }
        if (isFound == false) {
            chrome.windows.create({ url: url },function (window) {
                selectedTabId = window.tabs[0].id;
                lastTimeOutId = setTimeout(sendResponseIfPageNotLoaded, waitFor);
            });

        }
        else {

            sendPageComplete();
        }

    });
}

function removeSlash(url){

    if(url.charAt(url.length-1) == '/'){
        url =  url.substring(0,url.length-1);
    }

    return url;
}

function newWindow(url) {
    chrome.windows.create({ url: url },function (window) {
        selectedTabId = window.tabs[0].id;
        lastTimeOutId = setTimeout(sendResponseIfPageNotLoaded, waitFor);
    });
}

function newTab(url)
{
    chrome.windows.getAll({ "populate": true }, function (windows) {

        chrome.tabs.create({ url: url },function(tab){
            selectedTabId = tab.id;
            lastTimeOutId = setTimeout(sendResponseIfPageNotLoaded, waitFor);
        });
    });
}

function navigateURL(url) {
    chrome.windows.getAll({ "populate": true }, function (windows) {
        chrome.tabs.update(windows[0].tabs[0].id, { url: url });
        selectedTabId = windows[0].tabs[0].id;
        lastTimeOutId = setTimeout(sendResponseIfPageNotLoaded, waitFor);
    });
}

function close(tabID) {
    try {

        ws.send("<AAOABResult Result='true' Error='None'></AAOABResult>");
        chrome.tabs.remove(parseInt(tabID));

    }
    catch (e) {
        AALogger('ExtensionTabExecutor', 'close', e.message);
    }
}

function sendResponseIfPageNotLoaded() {

    if (isOpenURL == true && selectedTabId != -1 && (lastTimeOutId != null || lastTimeOutId != 0))
    {
        sendPageComplete();
        clearTimeout(lastTimeOutId);
    }
}

chrome.webNavigation.onErrorOccurred.addListener(function (data) {
    if (data.frameId == 0 && isOpenURL == true && data.tabId == selectedTabId)
    {
        sendPageComplete();
        clearTimeout(lastTimeOutId);
    }

});

chrome.webNavigation.onCompleted.addListener(function (data) {
    if (data.frameId == 0 && isOpenURL == true && data.tabId == selectedTabId) {
        sendPageComplete();
        clearTimeout(lastTimeOutId);
    }

});

function sendPageComplete() {
    chrome.tabs.get(selectedTabId, function (tab) {
        ws.send("<AAOABResult Result='true' Error='None'><Vals><Val>" + selectedTabId + "</Val><Val>" + new HTMLCommon(null).ReplaceSpacialCharecter(tab.title) + "</Val></Vals></AAOABResult>");
        isOpenURL = false;
        selectedTabId = -1;

    });
}

chrome.browserAction.onClicked.addListener(function () {
    var companyInfo = `Automation 360 Extension for ${Browser.type}` + "\n" + "\xA9 Automation Anywhere, Inc. All Rights Reserved."
    alert(companyInfo);
});

var windowAvatarQueue = new WindowAvatarQueue();
var isWindowAvatarSending = false;
var LastCommand = "None";
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (sender.tab) {
            if (request.type == "GET_MAPPER_DICTIONARY") {
                sendResponse({ mapperXML: ObjectMapperXML });
            } else if (request.type == "AVATAR" && !String.IsNullOrEmpty(request.data)) {
                windowAvatarQueue.Enqueue(request.data);
            }
            else if (request.type == "AlertOpen") {
                IsAlertWindowOpen = true;
                console.log("AlertOpen event received");
                if (LastCommand == HTMlRequestAction.PLAY_OBJECT_ACTION) {
                    sendResponse({ data: "<AAOABResult Result='true' Error='None'> <Table></Table></AAOABResult>" });
                }
            }
            else if (request.type == "AlertClose") {
                console.log("AlertClose event received");
                IsAlertWindowOpen = false;
            }
            else if (request.type == "SET_FRAME_INDEX") {                
                setIFrameIndex();
            }
        }
    });

function sendWindowAvatar() {

    var bufferSize = 6144; //    8192;
    var sentBytes = 0;
    var avatar = String.Empty;

    function sendData() {
        if (!String.IsNullOrEmpty(avatar)) {
            if ((sentBytes + bufferSize) < avatar.length) {
                //ws.send(avatar.substring(sentBytes, sentBytes + bufferSize));
                sendContent(avatar.substring(sentBytes, sentBytes + bufferSize));
                sentBytes = sentBytes + bufferSize;
                setTimeout(sendData, 150);
            }
            else {
                //ws.send(avatar.substring(sentBytes));
                sendContent(avatar.substring(sentBytes));
                avatar = String.Empty;
                sentBytes = 0;
                sendNextWindowAvatarData();
            }
        }
    }

    function sendContent(data) {
        if (!String.IsNullOrEmpty(data)) {
            ws.send(data);
        }
    }

    function sendNextWindowAvatarData() {
        if (windowAvatarQueue.Count() > 0) {
            avatar = windowAvatarQueue.Dequeue();
            setTimeout(sendData, 150);
        } else {
            isWindowAvatarSending = false;
        }
    }

    sendNextWindowAvatarData();
}

function WindowAvatarQueue() {

    var list = [];
    this.IsAvatarQueueProcessed = false;

    this.Enqueue = function (item) {

        list.push(item);

        if (!isWindowAvatarSending) {
            isWindowAvatarSending = true;
            setTimeout(sendWindowAvatar, 150);
        }
    }

    this.Dequeue = function () {
        if (list.length <= 0)
            return null;

        var queueItem = list[0];

        list.splice(0, 1);
        return queueItem;
    }

    this.Count = function () {
        return list.length;
    }
};

function setIFrameIndex() {
    chrome.tabs.getSelected(null, function (tab) {
        var tabId;
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            tabId = tabs[0].id;
            chrome.webNavigation.getAllFrames({ tabId: tabId }, function (details) {
                for (var i = 0; i < details.length; i++) {
                    if (details[i].parentFrameId != -1) {
                        chrome.tabs.sendMessage(tabId, { "frameId": details[i].frameId }, { frameId: details[i].frameId });
                    }
                    else {
                        chrome.tabs.sendMessage(tabId, { "frameId": details[i].parentFrameId }, { frameId: details[i].frameId });
                    }
                }
            });
        });
    });
};
