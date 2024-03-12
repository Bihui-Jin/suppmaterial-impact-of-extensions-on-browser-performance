var permissions = {
    contains: promisify(chrome.permissions.contains, chrome.permissions),
    request: promisify(chrome.permissions.request, chrome.permissions)
};

function checkNotificationPermissions() {
    // Check if we have permissions to show rich notifications
    return permissions.contains({permissions: ['notifications']});
}

function requestNotificationPermissions() {
    return permissions.request({permissions: ['notifications']});
}

function getNotificationPermissions() {
    // Check if we have permissions to show rich notifications (re-think if it makes any sense)
    return checkNotificationPermissions().then(function (notifPermissionsGranted) {
        // If not, request notification permissions form the user
        if (!notifPermissionsGranted) {
            return requestNotificationPermissions();
        } else {
            return Promise.resolve(notifPermissionsGranted);
        }
    });
}

chrome.runtime.onMessage.addListener(function (message, a, sendResponse) {
    if (message.type === 'getNotificationPermissions') {
        getNotificationPermissions()
            .then(function (result) {
                sendResponse(result);
            })
            .catch(function (e) {
                log('ERR', e.message);
            });
    }
    return true;
});

