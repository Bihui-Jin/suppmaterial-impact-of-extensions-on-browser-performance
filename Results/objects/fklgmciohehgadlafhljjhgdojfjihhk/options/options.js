var fetchUrlField = document.getElementById("fetchUrlField");
var fetchUrlBtn = document.getElementById("fetchUrlBtn");
var saveBtn = document.getElementById("saveBtn");
var cancelBtn = document.getElementById("cancelBtn");
var copyBtn = document.getElementById("copyBtn");
var currentAppConfigText = document.getElementById("currentAppsConfigText");
var originalFetchUrl;
var originalApps;
var currentApps;
var revision = -1;

window.addEventListener("DOMContentLoaded", function() {
    var adminMode = localStorage.getItem("adminMode") == 'true';
    var fetchUrl = localStorage.getItem("fetchUrl");
    currentApps = localStorage.getItem("applications");
    fetchUrlField.value = fetchUrl;
    originalFetchUrl = fetchUrl;
    if (!adminMode) {
        fetchUrlField.disabled = true;
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    currentAppConfigText.value = currentApps;
    if (currentAppConfigText.value === "[]") {
        currentAppConfigText.value = "No applications configured.";
    }

    currentApps = JSON.parse(currentApps);
    originalApps = currentApps;
});

fetchUrlField.addEventListener("keyup", function() {
   checkConfigChanged();
});

fetchUrlField.addEventListener("paste", function() {
    setTimeout(checkConfigChanged,0);
});

fetchUrlBtn.addEventListener("click", function() {
    this.disabled = true;
    var fetchUrl = fetchUrlField.value;
    var endpoint = urlTokenCleanup(fetchUrl);
    var requestParams = {};
    if (endpoint.token !== "") {
        requestParams = {headers: {'Authorization': 'Api-Token ' + endpoint.token}};
    }
    if (endpoint.url.indexOf("https") > -1) {
        fetch(endpoint.url, requestParams).then(function (response) {
            if (response.ok) {
                return response.json().then(function (item) {
                    if (item.applications) {
                        revision = item.revision;
                        currentApps = item.applications;
                        currentAppConfigText.value = JSON.stringify(item.applications);
                        saveBtn.disabled = false;
                        cancelBtn.disabled = false;
                        updateStatus("fetchStatusBox", "Applications fetched successfully", false);
                    } else if (item.error) {
                        updateStatus("fetchStatusBox", "Error retrieving applications: " + item.error.code + item.error.message, true);
                    } else {
                        updateStatus("fetchStatusBox", "Error retrieving applications; please verify URL is correct.", true);
                    }

                }, function (reason) {
                    updateStatus("fetchStatusBox", reason, true);
                });
            } else {
                updateStatus("fetchStatusBox", response.statusText + " ["+ response.status +"]", true);
            }
        }, function (reason) {
            updateStatus("fetchStatusBox", reason, true);
        });
        progress = startFetchProgress();
    } else {
        updateStatus("fetchStatusBox", "Please enter a valid URL.", true);
        this.disabled = false;
    }
});

saveBtn.addEventListener("click", function() {
    var fetchUrl = fetchUrlField.value;

    var request = {};
    request.type = "saveFetchedApps";
    request.item = {"fetchUrl": fetchUrl, "revision": revision, "applications": currentApps};

    chrome.runtime.sendMessage(request, function(response) {
        if(!(response.type == "saveApplication" && response.item)) {
            console.log('Saving application settings failed.');
        } else {
            console.log('Applications successfully connected.');

            originalFetchUrl = fetchUrl;
            originalApps = currentApps;

            updateStatus("statusBox", "Settings saved.", false);
            saveBtn.disabled = true;
            cancelBtn.disabled = true;
        }
    });
});

cancelBtn.addEventListener("click", function() {
    fetchUrlField.value = originalFetchUrl;
    currentApps = originalApps;

    currentAppConfigText.value = localStorage.getItem("applications");
    if (currentAppConfigText.value === "[]") {
        currentAppConfigText.value = "No applications configured.";
    }
    saveBtn.disabled = true;
    cancelBtn.disabled = true;
});

copyBtn.addEventListener('click', function() {
    currentAppConfigText.disabled = false;
    currentAppConfigText.select();
    document.execCommand('copy');
    currentAppConfigText.disabled = true;
});

function updateStatus(boxId, msg, isError) {
    if (boxId.indexOf("fetch") > -1 && progress) {
        clearInterval(progress);
        progress = null;
        fetchUrlBtn.disabled = false;
    }
    var statusBox = document.getElementById(boxId);
    statusBox.style.color = isError ? "#f05146" : "#5ead35";
    statusBox.textContent = msg;
    if (!isError) {
        setTimeout(function() {
            statusBox.textContent = "";
        }, 2000);
    }
}

var progress = null;
function startFetchProgress() {
    var msg = "Fetching configuration.";
    var wait = document.getElementById("fetchStatusBox");
    wait.style.color = "#000000";
    wait.textContent = msg;
    var dots = window.setInterval( function() {
        if (wait.textContent.length > (msg.length+2)) {
            wait.textContent = msg;
        } else {
            wait.textContent += ".";
        }
    }, 250);
    return dots;
}

function checkConfigChanged() {
    saveBtn.disabled = originalFetchUrl === fetchUrlField.value;
    cancelBtn.disabled = originalFetchUrl === fetchUrlField.value;
}