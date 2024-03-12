function saveConfig(url, item) {
    var request = {};
    request.type = "saveFetchedApps";
    request.item = {"fetchUrl": url, "revision": item.revision, "applications": item.applications};

    chrome.runtime.sendMessage(request, function (response) {
        if (!(response.type == "saveFetchedApps" && response.item)) {
            updateStatus('Saving application settings failed.', true);
        } else {
            updateStatus('Applications successfully connected.', false);
        }
    });
}

// attempt to fetch applications using the provided url
function fetchApplications() {
    var url = document.getElementById("fetchUrlField").value;
    var endpoint = urlTokenCleanup(url);
    var requestParams = {};
    if (endpoint.token !== "") {
        requestParams = {headers: {'Authorization': 'Api-Token ' + endpoint.token}};
    }
    if (endpoint.url.indexOf("https") > -1) {
        fetch(endpoint.url, requestParams).then(function (response) {
            if (response.ok) {
                return response.json().then(function (item) {
                    saveConfig(url, item);
                }, function (reason) {
                    updateStatus(reason, true);
                });
            } else {
                updateStatus(response.statusText + " ["+ response.status +"]", true);
            }
        }, function (reason) {
            updateStatus(reason, true);
        });
        progress = startFetchProgress();
    } else {
        updateStatus("Please enter a valid URL.", true);
    }
}

// display messages based on the url connection status
function updateStatus(msg, isError) {
    if (progress) {
        clearInterval(progress);
        progress = null;
    }
    var statusBox = document.getElementById("connectStatusBox");
    statusBox.style.color = isError ? "#f05146" : "#5ead35";
    statusBox.textContent = msg;
    if (!isError) {
        setTimeout(function () {
            statusBox.textContent = "";
        }, 2000);
    }
}

// indicate progress in fetching the configuration
var progress = null;

function startFetchProgress() {
    var msg = "Fetching configuration.";
    var wait = document.getElementById("connectStatusBox");
    wait.style.color = "#000000";
    wait.textContent = msg;
    var dots = window.setInterval(function () {
        if (wait.textContent.length > (msg.length + 2)) {
            wait.textContent = msg;
        } else {
            wait.textContent += ".";
        }
    }, 250);
    return dots;
}

var allowProxyBtnId = 'allowProxyBtn';
var denyProxyBtnId = 'denyProxyBtn';
var allowText = 'Allow';
var allowedText = 'Allowed';
var denyText = 'Deny';
var deniedText = 'Denied';
var revokeText = 'Revoke';

/**
 * Renders the Session Replay resource capture button for the current recorded page.
 */
function showResourceCaptureSection() {
    var fetchApps = document.getElementById('fetchApps');
    var button = '<button id="captureResourcesButton" class="btn btn--primary">Capture</button>';
    var html = '<div id="proxyPermissions"><h3>Session Replay resource capture</h3>' + button + '</div>';

    fetchApps.insertAdjacentHTML('afterend', html);
    document.getElementById('captureResourcesButton').onclick = function captureResources() {
        chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {type: SR_CAPTURE_RESOURCES});
        });
    }
}

/**
 * Renders the Session Replay resource proxy permission for the current player origin.
 *
 * @param {{state: boolean | string} | undefined} permission
 */
function showProxyPermissionSection(permission) {
    var fetchApps = document.getElementById('fetchApps');
    var html = '<div id="proxyPermissions"><h3>Session Replay resource loading</h3>' +
        '<p>for ' + currentHostName + '</p></div>';

    fetchApps.insertAdjacentHTML('afterend', html);
    renderProxyPermissionButtons(permission);
}

/**
 * Renders the proxy permission buttons for a hostname, given the current 
 * permission status. This changes the wording and state of buttons.
 *
 * @param {{state: boolean | string} | undefined} permission
 */
function renderProxyPermissionButtons(permission) {
    var proxyDiv = document.getElementById('proxyPermissions');

    // Append new buttons
    if (!isPermissionAssertive(permission)) {
        proxyDiv.insertAdjacentHTML('beforeend',
            generatePermissionButtonMarkup(allowText, allowProxyBtnId, true) +
            generatePermissionButtonMarkup(denyText, denyProxyBtnId, false)
        );
    } else if (permission.state) {
        proxyDiv.insertAdjacentHTML('beforeend',
            generatePermissionButtonMarkup(allowedText, allowProxyBtnId, true, true) +
            generatePermissionButtonMarkup(revokeText, denyProxyBtnId, false)
        );
    } else {
        proxyDiv.insertAdjacentHTML('beforeend',
            generatePermissionButtonMarkup(allowText, allowProxyBtnId, true) +
            generatePermissionButtonMarkup(deniedText, denyProxyBtnId, false, true)
        );
    }
    bindPermissionButtonClick(allowProxyBtnId, true);
    bindPermissionButtonClick(denyProxyBtnId, false);
}

/**
 * Updates proxy permission buttons text & state, based on a popup button click
 *
 * @param {{state: boolean}} permission
 */
function updateProxyPermissionButtons(permission) {
    var existingAllowButton = document.getElementById(allowProxyBtnId);
    var existingDenyButton = document.getElementById(denyProxyBtnId);
    if (permission.state) {
        existingAllowButton.innerText = allowedText;
        existingAllowButton.toggleAttribute('disabled', true);
        existingDenyButton.innerText = revokeText;
        existingDenyButton.toggleAttribute('disabled', false);
    } else {
        existingAllowButton.innerText = allowText;
        existingAllowButton.toggleAttribute('disabled', false);
        existingDenyButton.innerText = deniedText;
        existingDenyButton.toggleAttribute('disabled', true);
    }
}

/**
 * Stores a proxy permission change, and re-renders the buttons accordingly.
 *
 * @param {boolean} isGranted
 */
function changeProxyPermission(isGranted) {
    setProxyPermissionsToStorage(currentHostName, isGranted, function () {
        updateProxyPermissionButtons({state: isGranted});
    });
}

/**
 * Generates the markup for a proxy permission button
 *
 * @param {string} text Text to show in the button
 * @param {string} id HTML id attribute value
 * @param {boolean} isPrimary Is it a 'primary' or 'secondary' button?
 * @param {boolean} isDisabled Is the button disabled?
 * @returns {string} HTML markup for the button
 */
function generatePermissionButtonMarkup(text, id, isPrimary, isDisabled) {
    return '<button id="'+id+'" class="btn btn--'+(isPrimary ? 'primary' : 'secondary')+'"'+
        (isDisabled ? ' disabled' : '')+'>'+text+'</button>';
}

/**
 * Binds the element specified by 'id' to changePermission(), passing the 'value'.
 *
 * @param {string} id The element ID to bind
 * @param {boolean} value Argument passed to changeProxyPermission()
 */
function bindPermissionButtonClick(id, value) {
    var button = document.getElementById(id);
    if (button) {
        button.onclick = changeProxyPermission.bind(undefined, value);
    }
}

/**
 * Asserts if a given permission state is either asserting yes or no, whatever
 * the user answer was.
 *
 * @param {*} permission
 * @returns {boolean} Permission is assertive and got a user answer
 */
function isPermissionAssertive(permission) {
    return permission && PROXY_PERMISSION_STATE_KEY in permission && !['timeout', 'pending'].includes(permission[PROXY_PERMISSION_STATE_KEY]);
}

/**
 * Tells if the active tab is a Session Replay page, and its host origin.
 *
 * @param {(resp: {hostname: string; isReplayPage: boolean;}) => void} callback
 */
function getActiveTabInfo(callback) {
    chrome.tabs.query({ active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {type: GET_ACTIVE_TAB_INFO_MT}, function (response) {
            if (chrome.runtime.lastError || !response) {
                callback();
                return;
            }

            callback(response.hostname, response);
        });
    });
}

function getProxyPermissionsFromStorage(hostname, callback) {
    chrome.runtime.sendMessage({type: GET_PROXY_PERMS_MT, hostname: hostname}, callback);
}

function setProxyPermissionsToStorage(hostname, state, callback) {
    chrome.runtime.sendMessage({type: SET_PROXY_PERMS_MT, hostname: hostname, state: state}, callback);
}

var currentHostName;

try {
    getActiveTabInfo(function (hostname, response) {
        if (!hostname) {
            return;
        }
        currentHostName = hostname;
        if (response.isReplayPage) {
            getProxyPermissionsFromStorage(hostname, showProxyPermissionSection);
        }
        if (response.isRecording) {
            showResourceCaptureSection();
        }
    });
} catch(e) {
}

// restore the fetchUrlField with the configured URL
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("fetchUrlField").value = localStorage.getItem("fetchUrl");
    document.getElementById("connectAppsBtn").onclick = fetchApplications;
});
