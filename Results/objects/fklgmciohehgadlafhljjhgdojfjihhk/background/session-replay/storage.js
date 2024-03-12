var storageAPI = {
    get: promisify(chrome.storage.sync.get, chrome.storage.sync),
    set: promisify(chrome.storage.sync.set, chrome.storage.sync)
};


function setProxyPermissionData(hostname, value) {
    try {
        return storageAPI.get([PROXY_PERMISSION_STORAGE_KEY]).then(function (items) {
            if(!items[PROXY_PERMISSION_STORAGE_KEY]) {
                items[PROXY_PERMISSION_STORAGE_KEY] = {};
            }

            if (!items[PROXY_PERMISSION_STORAGE_KEY][hostname]) {
                items[PROXY_PERMISSION_STORAGE_KEY][hostname] = {};
            }

            items[PROXY_PERMISSION_STORAGE_KEY][hostname][PROXY_PERMISSION_STATE_KEY] = value;

            var storageRecord = {};
            storageRecord[PROXY_PERMISSION_STORAGE_KEY] = items[PROXY_PERMISSION_STORAGE_KEY];
            return storageAPI.set(storageRecord).then(function () {
                return storageRecord;
            });
        });
    }
    catch(e) {
        log(e);
    }
}

// data object may contain 'notificationRequested' flag which is boolean and/or 'state', which is proxy permission state
// 'state' can be either boolean (true for Granted, false for Revoked)
// or 'timeout' (proxy notification went timeout, so another notification will be shown in the future)
// or 'pending' (awaiting user answer)
function getProxyPermissionData(hostname) {
    try {
        return storageAPI.get([PROXY_PERMISSION_STORAGE_KEY]).then(function (items) {
            return new Promise(function (resolve) {
                var proxyPermissions = items[PROXY_PERMISSION_STORAGE_KEY];
                var result;
                if(proxyPermissions) {
                    if (typeof proxyPermissions[hostname] !== 'undefined') {
                        result = proxyPermissions[hostname];
                    }
                }

                resolve(result);
            });
        });


    }
    catch(e) {
        log(e);
    }
}

function saveNotificationState(state) {
    return new Promise(function (resolve) {
        chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: NOTIFICATION_STATE_SAVE, state: state}, resolve);
        });
    })
}

function getNotificationState() {
    return new Promise(function (resolve) {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: NOTIFICATION_STATE_GET}, resolve);
        });
    });
}

chrome.runtime.onMessage.addListener(function (message,  sender,  sendResponse) {
   switch(message.type) {
       case GET_PROXY_PERMS_MT:
           getProxyPermissionData(message.hostname).then(function (result) {
               sendResponse(result);
           });
           break;
       case SET_PROXY_PERMS_MT:
           setProxyPermissionData(message.hostname, message.state).then(function () {
               sendResponse();
           });
           break;
   }
   return true;
});