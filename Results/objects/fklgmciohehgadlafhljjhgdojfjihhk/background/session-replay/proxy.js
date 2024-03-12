var proxyNotificationRequestedMap = {};


function fetchResource(url, grabHeaders, callback) {
    fetch(url, {credentials: "omit"})
        .then(function (response) {
            var headers = Array.from(response.headers.entries()).filter(function (pair) {
                return grabHeaders.includes(pair[0]);
            });
            return response.arrayBuffer().then(function (body) {
                return {
                    body: Array.prototype.slice.call(new Uint8Array(body)),
                    headers: headers
                };
            });
        })
        .catch(function () {
            return { body: [], headers: [] };
        })
        .then(callback);
    return true;
}

function getProxyPermissions(hostname) {
    var permissionState;
    return getProxyPermissionData(hostname)
        .then(function (result) {
            permissionState = result;
            return checkNotificationPermissions();
        })
        .then(function (notificationPermission) {
            return new Promise(function (resolve) {
                if (!permissionState && notificationPermission) {
                    requestProxyPermissionNotification(hostname);
                    resolve(false);
                } else if (permissionState && permissionState[PROXY_PERMISSION_STATE_KEY] !== 'timeout' && permissionState[PROXY_PERMISSION_STATE_KEY] !== 'pending') {
                    // state permission already exists, just return it
                    resolve(permissionState[PROXY_PERMISSION_STATE_KEY]);
                } else if (!permissionState || permissionState[PROXY_PERMISSION_STATE_KEY] === 'timeout' || permissionState[PROXY_PERMISSION_STATE_KEY] === 'pending') {
                    // If chrome storage contains 'timeout' or 'pending' state but sessionStorage doesn't, then show notification again
                    getNotificationState().then(function (result) {
                        // there is no pending or timeout notification
                        if (!result) {
                            requestProxyPermissionNotification(hostname);
                        }
                    });
                    resolve(false);
                }
            });
        })
        .catch(function (e) {
            log('[BG PROXY] failed to get proxy permissions: ' + e.message);
        });
}

function requestProxyPermissionNotification(hostname) {
    return getNotificationState()
        .then(function (notificationState) {
            if (proxyNotificationRequestedMap[hostname] || notificationState === PENDING_NOTIFICATION_STATE) {
                return Promise.resolve();
            }

            proxyNotificationRequestedMap[hostname] = true;
            return createPermissionsNotification(hostname, proxyNotificationRequestedMap);
        })
        .catch(function (e) {
            log('[BG PROXY] failed to request proxy permission notification: ' + e.message);
        });
}
