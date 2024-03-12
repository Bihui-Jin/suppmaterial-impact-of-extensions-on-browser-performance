// Initially is empty as we may not have permissions to use notification API
var notificationAsyncAPI = {};

function onNotificationInteraction(hostname, result) {
    if (result !== TIMEOUT_NOTIFICATION_STATE && result !== PENDING_NOTIFICATION_STATE) {
        setProxyPermissionData(hostname, result);
    }
}

function createPermissionsNotification(hostname, proxyNotificationRequestedMap) {
    return checkNotificationPermissions()
        .then(function (notifPermissionsGranted) {
            if (!notifPermissionsGranted) {
                return;
            }

            var proxyNotifInfo = {
                notificationId: PROXY_PERM_NOTIFICATION_ID + '_' + hostname,
                notificationTimeoutId: null,
                hostname: hostname
            };
            var notificationOpts = {
                type: 'basic',
                title: 'Resource loading',
                message: 'Allow resources to be loaded for ' + hostname,
                iconUrl: 'css/icon.png',
                requireInteraction: true,
                buttons: [
                    // First button: ALLOW
                    {title: 'Allow'},
                    // Second button: DENY
                    {title: 'Deny'}
                ]
            };

            var onCloseListener = addProxyNotificastionOnClosedHandler(
                proxyNotifInfo, hostname, onNotificationInteraction
            );
            addProxyNotificationOnButtonClickedHandler(
                proxyNotifInfo, hostname, onCloseListener, onNotificationInteraction
            );


            notificationAsyncAPI.create =  typeof notificationAsyncAPI.create === 'function' ?
                notificationAsyncAPI.create :
                promisify(chrome.notifications.create, chrome.notifications);

            // Create and show notification
            return notificationAsyncAPI.create(proxyNotifInfo.notificationId, notificationOpts);
        })
        .then(function () {
            saveNotificationState(PENDING_NOTIFICATION_STATE);
            proxyNotificationRequestedMap[hostname] = false;
        })
        .catch(function (e) {
            log('[NOTIFICATION] Failed to create permission notification: ' + e.message);
        });
}

function addProxyNotificationOnButtonClickedHandler(proxyNotifInfo, hostname, onCloseListener, callback) {
    var onButtonClickListener = function (notifId, buttonIndex) {
        if (notifId !== proxyNotifInfo.notificationId) {
            return;
        }
        chrome.notifications.onButtonClicked.removeListener(onButtonClickListener);
        // ButtonIndex === 0 means Grant, otherwise Revoke
        callback(hostname, buttonIndex === 0);
        // As notification is forcefully closed on user interaction, on close listener needs to be removed beforehand
        chrome.notifications.onClosed.removeListener(onCloseListener);
        chrome.notifications.clear(notifId);
    };
    chrome.notifications.onButtonClicked.addListener(onButtonClickListener);
}

function addProxyNotificastionOnClosedHandler(proxyNotifInfo, hostname, callback) {
    var onNotificationCloseListener = function (notifId, byUser) {
        chrome.notifications.onClosed.removeListener(onNotificationCloseListener);
        if (notifId !== proxyNotifInfo.notificationId) {
            return;
        }
        if (!byUser) {
            // if notification closed not by user, then consider it as a timeout
            timeoutPermission(proxyNotifInfo.hostname).then(function () {
                callback(hostname, TIMEOUT_NOTIFICATION_STATE);
            });
        } else {
            // closing of notification by user is considered as revoking of proxy permissions
            callback(hostname, false);
        }
    };

    chrome.notifications.onClosed.addListener(onNotificationCloseListener);
    return onNotificationCloseListener();
}

function timeoutPermission(hostname) {
    return setProxyPermissionData(hostname, TIMEOUT_NOTIFICATION_STATE).then(function () {
        return saveNotificationState(TIMEOUT_NOTIFICATION_STATE);
    });
}
