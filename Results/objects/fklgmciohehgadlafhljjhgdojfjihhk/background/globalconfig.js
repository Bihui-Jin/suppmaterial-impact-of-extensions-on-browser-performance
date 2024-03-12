var isEdge = false;
window.globalConfiguration = {
    defaults: {
        fetchUrl: "",
        revision: -1,
        adminMode: true,
        applications: []
    },
    storageName: 'DynatraceSVRConfig',
    currentApplications: []
};

function getGlobalConfigCallback(config) {
    if (!config) {
        config = globalConfiguration.defaults;
    }
    config = config[globalConfiguration.storageName] || config;
    var fetchUrl = config.fetchUrl || localStorage.getItem("fetchUrl") || "";
    var revision = Number(config.revision || localStorage.getItem("revision")) || -1;
    var adminMode = config.adminMode;
    var applications = config.applications || [];

    if (!applications.length) {
        var stringifiedApps = localStorage.getItem('applications');
        if (stringifiedApps) {
            applications = JSON.parse(stringifiedApps);
            log("apps were loaded from localStorage successully");
        }
    }

    globalConfiguration.currentApplications = applications;

    chrome.browserAction.setPopup({popup: adminMode ? POPUP_HTML_DOC : ''});

    localStorage.setItem('fetchUrl', fetchUrl);
    localStorage.setItem('revision', String(revision));
    localStorage.setItem('adminMode', String(adminMode));
    localStorage.setItem('applications', JSON.stringify(applications));

    updateCSPDomains(applications);
    log("settings loaded from global config and stored in local storage!");

    fetchAppConfig();
}

// retrieve applications using the fetchUrl
function fetchAppConfig() {
    var fetchUrl = localStorage.getItem("fetchUrl");
    var revision = localStorage.getItem("revision");
    if (!fetchUrl || fetchUrl.indexOf("https://") !== 0) {
        log("fetchUrl is not valid, did not fetch configuration!");
        return;
    }
    fetch(fetchUrl).then(function (response) {
        return response.json().then(function (item) {
            if (item.revision <= revision) {
                log("revision is the same or out of date. no need to update. fetched: " + item.revision + ", current: " + revision);
                return;
            }
            log("updating current configuration revision " + revision + " to: " + item.revision);
            if (item.applications) {
                item.fetchUrl = fetchUrl;
                saveFetchedApps(item);
                log("Applications fetched successfully");
            } else if (item.error) {
                log("Error retrieving applications: " + item.error.code + item.error.message);
            } else {
                log("Error retrieving applications; please verify URL is correct.");
            }

        }, function (reason) {
            log(reason);
        });
    }, function (reason) {
        log(reason);
    });
}

function saveFetchedApps(item) {
    var revision = item.revision;
    var fetchUrl = item.fetchUrl;
    var applications = item.applications;
    globalConfiguration.currentApplications = applications;

    localStorage.setItem('revision', String(revision));
    localStorage.setItem('fetchUrl', fetchUrl);
    localStorage.setItem('applications', JSON.stringify(applications));
    updateCSPDomains(applications);

    return {type: SAVE_FETCHED_APPS_MT, item: "Settings saved."};
}

loadGlobalConfig();
setInterval(fetchAppConfig,600000);
