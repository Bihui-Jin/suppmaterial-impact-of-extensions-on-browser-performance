var injectLinerCoreCSS = true;
var injectLinerJQuery = true;
var injectLinerShareJS = true;
var injectLinerLocalizeJS = true;
var isProductionMode = true;

var browser = getBrowser();
function getBrowser() {
  try {
    if (window.safari && !window.safari.id) {
      return window.safari;
    }

    if (window.whale) {
      return window.whale;
    }

    return chrome;
  } catch (e) {}
  return null;
}

var browserPort = getBrowserPort();
function getBrowserPort() {
  try {
    return browser.runtime.connect();
  } catch (e) {}
  return null;
}

// Luke - Common message handler for all browsers
// Luke - event는 name과 message로 구성됨
// Luke - Safari와 그 외 Extension에서 사용하는 이벤트가 서로 살짝 달라서 한 곳엔 있고 한 곳엔 없을 수 있는데, 하나의 파일을 함께 사용할 것이기 때문에 한 쪽의 Extension에 이벤트가 없다고 하여 삭제하면 안됨.
// Luke - 양쪽에서 모두 사용하지 않는 것을 반드시 확인해야함
// Luke - ex) name: USER_INFO, message: { key : value }
function handleGlobalMessage(event) {
  if (event.name == 'POPOVER_RELOAD') {
    window.location.reload();
  }
}

function messageToNative(name, json) {
  if (window.safari && !window.safari.id) {
    safari.extension.dispatchMessage(name, json);
  } else if (window.location.origin === 'https://gcpstorage.getliner.com') {
    parent.postMessage(JSON.stringify({ name: name, message: json }), '*');
  } else {
    try {
      browserPort.postMessage({ name: name, message: json });
    } catch (e) {}
  }
}

if (browser) {
  browser.runtime.onMessage.addListener(function (event, sender, sendResponse) {
    handleGlobalMessage(event);
    try {
      handleLocalMessage ? handleLocalMessage(event) : null;
    } catch (e) {}
  });
} else if (window.location.origin === 'https://gcpstorage.getliner.com') {
  window.addEventListener(
    'message',
    function (event) {
      handleGlobalMessage(JSON.parse(event.data));
      try {
        handleLocalMessage ? handleLocalMessage(JSON.parse(event.data)) : null;
      } catch (e) {}
    },
    false,
  );
}

function getBrowserName() {
  // Luke - Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15
  // Luke - Chrome: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
  // Luke - Firefox: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0
  // Luke - Whale: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Whale/1.5.72.6 Safari/537.36
  // Luke - Opera: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.168 Safari/537.36 OPR/51.0.2830.40
  // Luke - Edge: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14931
  // Luke - Edge 2: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43

  try {
    if (navigator.userAgent.indexOf('Firefox') != -1) {
      // Luke - this is firfox browser
      return 'firefox';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      if (navigator.userAgent.indexOf('Whale') != -1) {
        // Luke - this is whale browser
        return 'whale';
      } else if (navigator.userAgent.indexOf('OPR') != -1) {
        // Luke - this is opera browser
        return 'opera';
      } else if (
        navigator.userAgent.indexOf('Edge') != -1 ||
        navigator.userAgent.indexOf('Edg') != -1
      ) {
        // Luke - this is edge browser
        return 'edge';
      } else {
        // Luke - this is chrome browser
        return 'chrome';
      }
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      // Luke - this is safari browser
      return 'safari';
    }
  } catch (e) {}
  return 'others';
}

function getURLWithoutHash(url) {
  return url.split('#')[0];
}
