
chrome.storage.sync.get([PROXY_PERMISSION_STORAGE_KEY], function (stored) {
    if (stored[PROXY_PERMISSION_STORAGE_KEY]) {
        var migrated = false;
        var storedPerms = stored[PROXY_PERMISSION_STORAGE_KEY];
        for (var key in storedPerms) {
            if (storedPerms.hasOwnProperty(key) && typeof storedPerms[key] === "boolean") {
                var migration = {};
                migration[PROXY_PERMISSION_STATE_KEY] = storedPerms[key];
                storedPerms[key] = migration;
                migrated = true;
            }
        }

        if (migrated) {
            chrome.storage.sync.set(stored);
        }
    }
});