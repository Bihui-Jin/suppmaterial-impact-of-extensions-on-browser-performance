chrome.action.onClicked.addListener((e=>{const t=e.id;if(void 0!==t){const e=chrome.runtime.getURL("index.html");chrome.scripting.executeScript({target:{tabId:t},func:function(e){window.iFrameUrl=e},args:[e]}),chrome.scripting.executeScript({target:{tabId:t},files:["scraper.js"]})}}));