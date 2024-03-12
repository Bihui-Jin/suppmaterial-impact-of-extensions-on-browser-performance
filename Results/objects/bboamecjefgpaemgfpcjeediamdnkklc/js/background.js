//Allow content script just when pressing start//
chrome.runtime.onMessage.addListener(function (request, callback) {
  if (request.command == "start") {
    chrome.tabs.executeScript({
      file: "js/contentscript.js",
    });
  }
});
//Allow content script just when pressing start//
