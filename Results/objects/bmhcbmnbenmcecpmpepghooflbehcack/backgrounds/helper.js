$(document).ready(function () {
  logger('helper.js loaded');
});

var isProductionMode = true; // todo: production에 올릴 때는 true로 바꾸기
var browser = getBrowser();
var contentScriptArray = ['/liner-core.be.js'];
var logBrazeEventIntall = false;

browser.runtime.onInstalled.addListener(function (details) {
  checkIsProductionModeAndInjectJavascript();

  if (details.reason == 'install') {
    logBrazeEventIntall = true;
    setLinerVersion(browser.runtime.getManifest().version);
    getGAEvent(user['id'], 'extension', 'install', browser.runtime.getManifest().version);

    openTab(
      `https://getliner.com/home?showBEGuide=true&isBEInstalledLanding=true&BEVersion=${
        browser.runtime.getManifest().version
      }`,
      function () {},
    );

    $(document).ready(function () {
      setBEInstallTimestamp();
      createShortcutLocalStorage();
    });
  } else if (details.reason == 'update') {
    if (getLinerVersion() != '' && getLinerVersion() != browser.runtime.getManifest().version) {
      setLinerVersion(browser.runtime.getManifest().version);
      getGAEvent(user['id'], 'extension', 'update', browser.runtime.getManifest().version);
    }
  }
});

function addNetworkListenerAndLogin() {
  const isOnline = navigator.onLine;

  // 온라인이거나 지원하지 않는 브라우저
  if (isOnline || isOnline === undefined) {
    resetVariables();
  }

  window.addEventListener('online', () => {
    resetVariables();
  });
}

const createShortcutLocalStorage = () => {
  const shortcutOriginal = [
    {
      name: 'Google',
      url: 'https://www.google.com',
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
    },
    {
      name: 'Medium',
      url: 'https://medium.com',
    },
    {
      name: '',
      url: '',
    },
    {
      name: '',
      url: '',
    },
  ];
  localStorage.setItem('linerShortcut', JSON.stringify(shortcutOriginal));
};

const checkIsNewTabPage = (url, pendingUrl) => {
  const isChromeNewTabPage = url === 'chrome://newtab/' || url === 'chrome://new-tab-page/';
  const isEdgeNewTabPage = url === 'edge://newtab/';

  const isLoadingChromeNewTabPage = pendingUrl && pendingUrl === 'chrome://newtab/';
  const isLoadingEdgeNewTabPage = pendingUrl && pendingUrl === 'edge://newtab/';

  return (
    isChromeNewTabPage || isEdgeNewTabPage || isLoadingChromeNewTabPage || isLoadingEdgeNewTabPage
  );
};

browser.tabs.onActivated.addListener((activeInfo) => {
  browser.tabs.get(activeInfo.tabId, (tab) => {
    setTimeout(() => {
      const { id, url, pendingUrl } = tab;
      if (checkIsNewTabPage(url, pendingUrl)) {
        const isNewTabOn = newTabHandler.checkIsNewTabOn();

        if (isNewTabOn) {
          chrome.tabs.update(id, { url: '../newTab/index.html' });
        }
      }
    }, 10);
  });
});

function checkIsDevMode() {
  return !('update_url' in chrome.runtime.getManifest());
}

function getBrowserName() {
  // Luke - Safari: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15
  // Luke - Chrome: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36
  // Luke - Firefox: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:67.0) Gecko/20100101 Firefox/67.0
  // Luke - Whale: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Whale/1.5.72.6 Safari/537.36
  // Luke - Opera: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.168 Safari/537.36 OPR/51.0.2830.40
  // Luke - Edge: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14931
  // Luke - Edge 2: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.74 Safari/537.36 Edg/79.0.309.43
  // Mark - Samsung: Mozilla/5.0 (Linux; Android 11; SAMSUNG SM-G981N/KSU1EUH1) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/15.0 Chrome/90.0.4430.210 Mobile Safari/537.36

  try {
    if (navigator.userAgent.indexOf('SamsungBrowser') != -1) {
      // Mark - this is samsung browser
      return 'samsung';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
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
  } catch (e) {
    logger(e);
  }
  return 'others';
}

function checkIsProductionModeAndInjectJavascript() {
  if (checkIsDevMode()) return;
  injectContentScripts();
}

function injectContentScripts() {
  browser.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      contentScriptArray.forEach((contentScript) => {
        executeJSFile(tab, contentScript, () => {});
      });
    });
  });
}

browser.runtime.setUninstallURL('https://getliner.com/uninstall/browser-extension');

function setUninstallUrl(lastHost) {
  browser.runtime.setUninstallURL(
    `https://getliner.com/uninstall/browser-extension?domain=${lastHost}`,
  );
}

function executeScript(page, script, callback) {
  browser.tabs.executeScript(
    page.id,
    {
      code: script,
    },
    function (result) {
      callback(result);
    },
  );
}

function executeCSSFile(page, file, callback) {
  browser.tabs.insertCSS(
    page.id,
    {
      file: file,
    },
    function (result) {
      callback(result);
    },
  );
}

function executeJSFile(page, file, callback) {
  browser.tabs.executeScript(page.id, {
    file: file,
  });
}

function logger(content) {
  if (!window.isProductionMode) {
    console.log(content);
  }
}

function setLinerVersion(value) {
  localStorage.setItem('liner_version', value);
}

function getLinerVersion() {
  var linerVersion = localStorage['liner_version'];
  if (linerVersion) {
    return linerVersion;
  }
  return '';
}

function browserId() {
  const browserId = localStorage.getItem('browser_id') ?? createBrowserId();
  localStorage.setItem('browser_id', browserId);
  return browserId;
}

function createBrowserId() {
  var d = new Date().getTime();
  var uid = `browser-${new Date().getTime()}-x`.replace(/[x]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uid;
}

function getUid() {
  var uid = localStorage.getItem('uid') ?? createDeviceID();
  localStorage.setItem('uid', uid);
  return uid;
}

function createDeviceID() {
  var d = new Date().getTime();
  var uid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uid;
}

function openTab(url, callback) {
  chrome.tabs.create({ url }, function (tab) {
    callback();
  });
}

function openTabWhileInCurrentTab(url, callback) {
  chrome.tabs.create({ url, active: false }, function (tab) {
    callback();
  });
}

function getURLWithoutHash(url) {
  return url.split('#')[0];
}

function getBrowser() {
  if (window.safari && !window.safari.id) {
    logger('initialize as safari extension');
    return window.safari;
  }

  if (window.whale) {
    logger('intialize as whale extension');
    return window.whale;
  }

  logger('initialize as chrome/firefox/opera/edge extension');
  return chrome;
}

function setToolbarItem(page, title, iconType) {
  browser.browserAction.setTitle({
    tabId: page.id,
    title: title,
  });

  browser.browserAction.setIcon({
    tabId: page.id,
    path: {
      16: '/images/icon/icon-' + iconType + '-16.png',
      32: '/images/icon/icon-' + iconType + '-32.png',
      48: '/images/icon/icon-' + iconType + '-48.png',
      128: '/images/icon/icon-' + iconType + '-128.png',
    },
  });
}

function copyToClipBoard(content) {
  var temp = $('<textarea class="copyInput">');
  $('body').append(temp);
  temp.val(content).select();
  document.execCommand('copy');
  temp.remove();
}

function getFileSize(url, callback) {
  var fileSize = 0;
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false); // false = Synchronous
  http.send(null); // it will stop here until this http request is complete
  if (http.status === 200) {
    fileSize = http.getResponseHeader('content-length');
  }
  callback(parseInt(fileSize));
}

function getOS() {
  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'macos';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'ios';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'windows';
  } else if (/Android/.test(userAgent)) {
    os = 'aos';
  } else if (!os && /Linux/.test(platform)) {
    os = 'linux';
  }
  return os;
}

function getLKSBaseParams() {
  let device_type = 'pc';
  const device_os = getOS();
  if (device_os === 'ios' || device_os === 'android') {
    device_type = 'mobile';
  }

  return {
    device_type,
    device_os,
    user_agent: getBrowserName() === 'others' ? undefined : getBrowserName(),
    occurred_at: parseInt(new Date().getTime() / 1000),
    ip: publicIP,
  };
}

function getBigQueryLogBaseParams() {
  return {
    user_id: user.id ? parseInt(user.id) : null,
    liner_uuid: getLinerUUID(),
    event_time: parseInt(new Date().getTime() / 1000),
    liner_dbe_version: getLinerVersion(),
    liner_service: 'dbe',
    os: getOS(),
    browser: getBrowserName() === 'others' ? null : getBrowserName(),
    ip: publicIP,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

const sortByChar = (tags) => {
  const sortedTags = tags
    .slice()
    .sort((a, b) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0));
  return sortedTags;
};

const removeDuplicatedTags = (tags) => {
  let tagTitles = [];
  let duplicateRemovedTags = [];
  tags.forEach((tag) => {
    if (tagTitles.indexOf(tag.title) == -1) {
      tagTitles.push(tag.title);
      duplicateRemovedTags.push(tag);
    }
  });
  return duplicateRemovedTags;
};

function getUniqueRecommendedDocs(documents, currentPageTitle) {
  try {
    let uniqueRecDocs = [];
    for (var i = 0; i < documents.length; i++) {
      let isUnique = true;

      if (similarity(documents[i].title, currentPageTitle) > 0.9) {
        isUnique = false;
      } else if (
        currentPageTitle.indexOf(documents[i].title) !== -1 ||
        documents[i].title.indexOf(currentPageTitle) !== -1
      ) {
        isUnique = false;
      } else {
        for (var j = 0; j < uniqueRecDocs.length; j++) {
          if (
            uniqueRecDocs[j].url === documents[i].url ||
            documents[i].title.indexOf(uniqueRecDocs[j].title) !== -1
          ) {
            isUnique = false;
            break;
          }
        }
      }

      if (isUnique === true) {
        uniqueRecDocs.push(documents[i]);
      }
    }
    return uniqueRecDocs;
  } catch (e) {}
  return documents;
}

function isRPClosed() {
  if (localStorage.getItem('is_rp_closed') !== null) {
    return JSON.parse(localStorage.getItem('is_rp_closed'));
  }

  // if (user.premium === 1) {
  localStorage.setItem('is_rp_closed', false);
  return false;
  // }

  // localStorage.setItem('is_rp_closed', true);
  // return true;
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function deserialize(src) {
  switch (src.cls) {
    case 'FormData': {
      const fd = new FormData();
      for (const [key, items] of src.value) {
        for (const item of items) {
          fd.append(key, deserialize(item));
        }
      }
      return fd;
    }
    case 'Blob':
    case 'File': {
      const { type, name, lastModified } = src;
      const binStr = atob(src.value);
      const arr = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) arr[i] = binStr.charCodeAt(i);
      const data = [arr.buffer];
      return src.cls === 'File'
        ? new File(data, name, { type, lastModified })
        : new Blob(data, { type });
    }
    case 'json':
      return JSON.parse(src.value);
  }
}

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}

function getLinerUUID() {
  const linerUUID = localStorage.getItem('linerUUID');
  if (linerUUID) {
    return linerUUID;
  } else {
    const newLinerUUID = uuidv4();
    localStorage.setItem('linerUUID', newLinerUUID);
    return newLinerUUID;
  }
}

async function getPageByUrl(url) {
  let status;
  const response = await fetch(url).then((res) => {
    status = res.status;
    return res.text();
  });
  const parser = new DOMParser();
  const document = parser.parseFromString(response, 'text/html');
  const results = {
    status,
    bookmarkUrl: url,
    title:
      document.title ||
      document.querySelector('head title')?.textContent ||
      document.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      'No Title',
    image:
      document.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      document.images?.[0]?.src ||
      '',
  };

  return results;
}

function getLastNumberOfLinerUUID() {
  const linerUUID = getLinerUUID();
  const lastCharacterOfLinerUUID = linerUUID.slice(-1);
  const lastNumberOfLinerUUID = parseInt(lastCharacterOfLinerUUID, 16) % 10;

  return lastNumberOfLinerUUID;
}

function handleSaveWebPageEvent(status, reason, eventProperties = {}) {
  if (status === 'success') {
    sendAmplitudeData('save_web_page', eventProperties);
    return;
  }

  if (status === 'error' && reason === 'not_auth') {
    sendAmplitudeData('save_web_page', eventProperties);
  }
}

function checkIsLINERCohort() {
  const isLoggedIn = Object.keys(user).length > 0;
  if (!isLoggedIn) return false;

  return user.email.includes('@linercorp.com') || user.email.includes('@getliner.com');
}

function checkIsYoutubeSidebarCohort() {
  const isLoggedIn = Object.keys(user).length > 0;
  if (isLoggedIn) {
    if (checkIsLINERCohort()) return true;

    const isCountryNotSetOrKorean =
      geoLocationHandler.countryCode === '' || geoLocationHandler.countryCode === 'KR';
    if (isCountryNotSetOrKorean) return false;

    const isUserIdEndsWith0to3 =
      user.id.slice(-1) === '0' ||
      user.id.slice(-1) === '1' ||
      user.id.slice(-1) === '2' ||
      user.id.slice(-1) === '3';
    if (isUserIdEndsWith0to3) return true;
  }
  return false;
}

function getLastNumberOfUserId() {
  const isLoggedIn = Object.keys(user).length > 0;
  if (!isLoggedIn) return null;

  return +user.id.slice(-1);
}

function checkIsInLINEREmailList() {
  const isLoggedIn = Object.keys(user).length > 0;
  if (!isLoggedIn) return false;

  const LINEREmailList = [
    'asukj7962@gmail.com',
    'btd@yonsei.ac.kr',
    'osehyum@gmail.com',
    'njhfilm@gmail.com',
    'anavelia7@gmail.com',
    'wcm1016@gmail.com',
    'seomira0514@gmail.com',
    'test6@dave.com',
    'test1@mark.com',
    'test2@mark.com',
    'test6@mark.com',
    'mmii17@naver.com',
    'mmiin17@korea.ac.kr',
    'mmiin17@gmail.com',
  ];

  return LINEREmailList.includes(user.email);
}

function checkIsBlockLiveHighlightCohort() {
  if (checkIsLINERCohort() || checkIsInLINEREmailList()) return false;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 0 || lastNumberOfUserId === 1;
}

function checkIsBlockPublicThreadCohort() {
  if (checkIsLINERCohort() || checkIsInLINEREmailList()) return false;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 2 || lastNumberOfUserId === 3;
}

function checkIsBlockPopularHighlightCohort() {
  if (checkIsLINERCohort() || checkIsInLINEREmailList()) return false;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 4 || lastNumberOfUserId === 5;
}

function checkIsBlockExpandYourReadingCohort() {
  if (checkIsLINERCohort() || checkIsInLINEREmailList()) return false;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 6 || lastNumberOfUserId === 7;
}

function checkIsBlockYoutubePBLCohort() {
  if (checkIsLINERCohort() || checkIsInLINEREmailList()) return false;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 8;
}

function checkIsHighlightStreakCohort() {
  if (checkIsInLINEREmailList()) return true;
  const lastNumberOfUserId = getLastNumberOfUserId();
  return lastNumberOfUserId === 4 || lastNumberOfUserId === 5;
}

function getDateString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
}

const getTodayIndexFromDayOfWeek = (dayOfWeek) => {
  switch (dayOfWeek) {
    case 'saturday': {
      return NUM_OF_DAYS - 1;
    }
    case 'friday': {
      return NUM_OF_DAYS - 2;
    }
    case 'thursday': {
      return NUM_OF_DAYS - 3;
    }
    case 'wednesday': {
      return NUM_OF_DAYS - 4;
    }
    case 'tuesday': {
      return NUM_OF_DAYS - 5;
    }
    case 'monday': {
      return NUM_OF_DAYS - 6;
    }
  }
};

function getDayType(videoHighlightPageCount, textHighlightPageCount) {
  if (videoHighlightPageCount === 0 && textHighlightPageCount === 0) return 'empty';
  if (videoHighlightPageCount === 0) return 'text';
  if (textHighlightPageCount === 0) return 'video';
  return 'both';
}

function getDayTypeAndTotalCountFromHighlightStat(statistic) {
  const { videoHighlightPageCount, textHighlightPageCount } = statistic;
  return {
    type: getDayType(videoHighlightPageCount, textHighlightPageCount),
    totalCount: videoHighlightPageCount + textHighlightPageCount,
  };
}

function getDayColorFromHighlightStat(statistic) {
  const { type, totalCount } = getDayTypeAndTotalCountFromHighlightStat(statistic);
  if (type === 'empty') return '#F2F3F7';
  if (type === 'text') {
    if (totalCount < 3) return 'rgba(79, 213, 255, 0.4)';
    if (totalCount < 7) return 'rgba(79, 213, 255, 0.6)';
    return 'rgba(79, 213, 255, 1)';
  }
  if (type === 'video') {
    if (totalCount < 3) return 'rgba(255, 229, 0, 0.4)';
    if (totalCount < 7) return 'rgba(255, 229, 0, 0.6)';
    return 'rgba(255, 229, 0, 1)';
  }
  if (type === 'both') {
    if (totalCount < 3) return 'rgba(63, 236, 174, 0.4)';
    if (totalCount < 7) return 'rgba(63, 236, 174, 0.6)';
    return 'rgba(63, 236, 174, 1)';
  }
}

const recentHighlightStreakHandler = () => {
  let date = '';
  let color = '';
  let isOpened = true;

  return {
    getRecentStreakDateAndColor: () => ({ date, color }),
    setRecentStreakDateAndColor: (statistic) => {
      const { date: recentDate } = statistic;
      const recentColor = getDayColorFromHighlightStat(statistic);
      date = recentDate;
      color = recentColor;
    },
    checkIsRecentStreakDateOrColorChanged: (statistic) => {
      const { date: recentDate } = statistic;
      const recentColor = getDayColorFromHighlightStat(statistic);

      return recentDate !== date || recentColor !== color;
    },
    checkIsRecentStreakOpened: () => isOpened,
    setIsRecentStreakOpened: (isOpenedValue) => {
      isOpened = isOpenedValue;
    },
  };
};

const {
  getRecentStreakDateAndColor,
  setRecentStreakDateAndColor,
  checkIsRecentStreakDateOrColorChanged,
  checkIsRecentStreakOpened,
  setIsRecentStreakOpened,
} = recentHighlightStreakHandler();
