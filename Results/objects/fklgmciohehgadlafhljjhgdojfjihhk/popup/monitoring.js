if (window.dtrum) {
    console.log("self monitoring enabled. sending custom actions.");

    // retrieve the unique ID
    chrome.storage.sync.get('sVRId', function(items) {
        var sVRId = items.sVRId;
        if (sVRId) {
            dtrum.identifyUser(sVRId);
            console.log("found visitor id: " + sVRId);
        } else {
            console.log("visitor id was not retrieved");
        }
    });
} else {
    console.log("agent not detected on popup. self monitoring disabled.");
}
