chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a '.youtube.com/watch?' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: '.youtube.com/watch?' },
            css: ["video"]
          }),

        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  // If the page URL is changed, let the content js know about it
  if (changeInfo.url) {
    let request = {}
    request.type = 'ChangeUrl';
    request.url = changeInfo.url;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      request.url = changeInfo.url;
      chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
      });  
    });
  }
}); 

chrome.commands.onCommand.addListener(function(command) {
  if (command == 'clear-signin-info') {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let request = {};
      request.type = 'ClearStorage';
      chrome.tabs.sendMessage(tabs[0].id, request, function(response) {
      });  
    });
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      try {
        if (isValidAuthenticationRequest(request)) {
            return authenticationRequestHandler(request, sender, sendResponse);
        }
        else if (isValidAnalyticsRequest(request)) {
          return analyticsRequestHandler(request, sender, sendResponse);
        }
        else {
          return false;
        }
      }
      catch(err) {
          console.log("Error in processing request in background script: ", err)
          console.log(". . .request details: ", request)
      };
  
});
