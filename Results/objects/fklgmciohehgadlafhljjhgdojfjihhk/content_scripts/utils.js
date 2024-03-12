function injectScriptElementIntoDOM(headElement, script) {
    if (!headElement || !script) {
        return;
    }

    if(headElement.firstChild) {
        headElement.insertBefore(script, headElement.firstChild);
    } else {
        headElement.appendChild(script);
    }
}

function captureResources() {
    var script = document.createElement('script');

    script.textContent = 'dT_ && dT_.srrcdm && dT_.srrcdm();';
    (document.head||document.documentElement).appendChild(script);
    script.remove();
}

function getPageInfo() {
    return isReplayPage().then(function (isReplay) {
        const isRecording = (window.localStorage.getItem('dtsrE') || '').indexOf('enabled') !== -1;

        return {
            isReplayPage: isReplay,
            isRecording: isRecording
        };
    })
}

function isReplayPage() {
    if (!window.MessageChannel) {
        return Promise.resolve(false);
    }

    const messageChannel = new MessageChannel();
    window.postMessage({
        type: 'srIsReplayPage',
        hostname: window.location.hostname
    }, location.origin, [messageChannel.port2]);

    return Promise.race([
        new Promise(function (resolve) { messageChannel.port1.onmessage = function (message) {resolve(message.data)} }),
        new Promise(function (resolve) { setTimeout(function () {resolve(false)}, 1000) })
    ]);
}
