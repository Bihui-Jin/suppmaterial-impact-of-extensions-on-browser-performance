window.chrome = (function () {
  return window.msBrowser ||
    window.browser ||
    window.chrome;
})();

//var runtimeOrExtension = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';

var inoLastResult = {};
var errorAttempts = 0;
const MAX_ERRORS = 15;

function get_client_counters (force) {
  // console.log('force_counter_refresh', force)
  if (!document.getElementById('total_unread_cnt')) {
    // chrome.storage.local.set({authorized: false})
    // chrome.storage.local.remove(['counters'])
    // if(chrome.runtime && chrome.runtime.sendMessage){
    //     chrome.runtime.sendMessage(0);
    // }
    errorAttempts++;
    if(errorAttempts > MAX_ERRORS) {
      errorAttempts = 0
      console.error('possible logout')
      chrome.runtime.sendMessage({ msg: 'serverRefresh' })
    }
    return;
  }
  var result = {
    "unread_cnt": parseInt(document.getElementById('total_unread_cnt').innerHTML),
    "logged_in": parseInt(document.getElementById('logged_in_div').innerHTML),
    "unseen_cnt": parseInt(document.getElementById('total_unseen_cnt').innerHTML),
    "max_cnt": parseInt(document.getElementById('max_unread_cnt').innerHTML),
    lastUpdate: document.getElementById('total_unread_cnt').dataset.lastUpdate
  };

  errorAttempts = 0;
  // console.log('res', result)
  if (force === false && result.unread_cnt === inoLastResult.unread_cnt && result.unseen_cnt === inoLastResult.unseen_cnt) {
    return;
  }

  inoLastResult = result;
  if(result.lastUpdate !== "0") {
    chrome.storage.local.set({counters: result, authorized: true})
  }
  // if (chrome.runtime && chrome.runtime.sendMessage) {
  //   chrome.runtime.sendMessage(result)
  // }
}

let UpdateTimer = setInterval(function () {
  get_client_counters(false);
}, 1000);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'force_counter_refresh') {
    get_client_counters(true);
  }
});

if (!document.getElementById('inoreader_companion_div')) {
  var dummy = document.createElement("a");
  dummy.id = 'inoreader_companion_div';
  document.body.appendChild(dummy);
}

window.addEventListener("message", function (event) {
  if (event.source != window) {
    return;
  }
  if (event.data.request) {
    try {
      chrome.runtime.sendMessage(event.data.request);
    } catch (e) {
    }
  }
}, false);