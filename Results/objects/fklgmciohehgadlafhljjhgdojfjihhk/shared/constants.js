var SHOULD_INJECT_MT = 'shouldInject';
var GET_INJECTION_INFO_MT = 'getInjectionInfo';
var INJECTION_INFO_MT = 'injectionInfo';
var SAVE_FETCHED_APPS_MT = 'saveFetchedApps';
var LOG_MT = 'log';
var SR_PROXY_MT = 'sr-proxy';
var SR_RENDERER_INITIALIZED_MT = 'srRendererInitialized';
var SR_PROXY_PERMISSIONS_MT = 'srProxyPermissions';
var GET_PROXY_PERMS_MT = 'getProxyPermission';
var SET_PROXY_PERMS_MT = 'setProxyPermission';
var GET_ACTIVE_TAB_INFO_MT = 'getActiveTabInfo';
var NOTIFICATION_STATE_SAVE = 'saveNotificationState';
var NOTIFICATION_STATE_GET = 'getNotificationState';
var SR_CAPTURE_RESOURCES = 'captureResources'

var PROXY_PERM_NOTIFICATION_ID = 'proxyPermissions';

var PENDING_NOTIFICATION_STATE = 'pending';
var TIMEOUT_NOTIFICATION_STATE = 'timeout';

var PROXY_PERMISSION_STORAGE_KEY = 'pRPr';
var PROXY_PERMISSION_STATE_KEY = 'state';

var PROXY_PERMISSION_MESSAGE_TYPES = [ GET_PROXY_PERMS_MT, SET_PROXY_PERMS_MT ];

var POPUP_HTML_DOC = "popup/popup.html";

var TOKEN_RX = /[?&]Api-Token=([^&]+).*/i;

/**
 * Takes the user input config URL and extracts the token as per TOKEN_RX.
 * Return object will contain 'url' stripped of token, and 'token' if found.
 * @param url
 * @returns {{url: string, token: string}}
 */
function urlTokenCleanup(url) {
    var result = {
        url: url,
        token: ""
    };
    if (TOKEN_RX.test(url)) {
        result.url = url.replace(TOKEN_RX, "");
        result.token = url.match(TOKEN_RX)[1];
    }
    return result;
}