let pageUrl = '';
let srcUrl = '';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: 'Picwatermark',
    contexts: ['image'],
    onclick: clickMenuCallback,
  });
});

function clickMenuCallback(info) {
  chrome.tabs.create(
    {
      url: chrome.extension.getURL('index.html'),
      active: false,
    },
    (tab) => {
      chrome.windows.create({
        tabId: tab.id,
        type: 'popup',
        height: 800,
        width: 700,
        focused: true,
      });
    }
  );
  pageUrl = info.pageUrl
  srcUrl = info.srcUrl
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.appReady) {
    sendResponse({
      pictureUrl: srcUrl,
      pageUrl: pageUrl,
    });
  }
});
