var sVRId = null;

createNewVisitorId = function() {
    var visitorId = Date.now() + "";
    visitorId += createRandomString(45 - visitorId.length);
    return visitorId;
}

checkAndSetUniqueUserId = function() {
    chrome.storage.sync.get('sVRId', function(items) {
        var userId = items.sVRId;
        if (userId) {
            sVRId = userId;
        } else {
            userId = createNewVisitorId();
            chrome.storage.sync.set({sVRId: userId}, function() {
                log("setting user id: " + userId);
                sVRId = userId;
            });
        }
    });
}

checkAndSetUniqueUserId();