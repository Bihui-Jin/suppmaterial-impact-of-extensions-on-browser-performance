function loadGlobalConfig() {
    //load from chrome storage managed
    chrome.storage.managed.get(globalConfiguration.defaults, getGlobalConfigCallback);
}
