$(document).ready(function () {
  logger('endpoints.js loaded');
});

const URI = {
  LINER: 'https://getliner.com',
};

const SERVER = {
  API: 'https://getliner.com',
  SHARE: 'https://share.getliner.com',
  IAM: 'https://iam.getliner.com',
  LKS: 'https://lks.getliner.com',
  SLACK: 'https://slack.com',
  ADS: 'https://ads.getliner.com',
  GEO_LOCATION: 'https://geolocation-db.com',
  IPIFY: 'https://api.ipify.org',
  GA: 'https://www.google-analytics.com',
  GCP_CONFIG: 'https://static.getliner.com/liner-service-bucket/config/be',
  AUTO_COMPLETE_GOOGLE: 'https://suggestqueries.google.com/complete',
};

let publicIP;
let pipCounter = 0;

function http(server, endpoint, proto, params, callback) {
  if (pipCounter % 15 == 0) {
    pipCounter = 1;
    http(SERVER.IPIFY, '', 'GET', { format: 'json' }, function (json) {
      try {
        publicIP = json.ip;
      } catch (e) {
        publicIP = undefined;
      }
    });
  } else {
    pipCounter += 1;
  }

  $.ajax({
    type: proto.toUpperCase(),
    url: `${server}${endpoint}`,
    data: params,
    success: function (json) {
      callback(json);
    },
    error: function (xhr, status, error) {
      callback(xhr.responseJSON);
    },
  });
}

function httpWithStatus(server, endpoint, proto, params, callback) {
  if (pipCounter % 15 == 0) {
    pipCounter = 1;
    http(SERVER.IPIFY, '', 'GET', { format: 'json' }, function (json) {
      try {
        publicIP = json.ip;
      } catch (e) {
        publicIP = undefined;
      }
    });
  } else {
    pipCounter += 1;
  }

  $.ajax({
    type: proto.toUpperCase(),
    url: `${server}${endpoint}`,
    data: params,
    success: function (json) {
      callback(json);
    },
    error: function (xhr, status, error) {
      callback(xhr.status);
    },
  });
}

function httpFormData(server, endpoint, proto, data, callback) {
  if (pipCounter % 15 == 0) {
    pipCounter = 1;
    http(SERVER.IPIFY, '', 'GET', { format: 'json' }, function (json) {
      try {
        publicIP = json.ip;
      } catch (e) {
        publicIP = undefined;
      }
    });
  } else {
    pipCounter += 1;
  }

  fetch(`${server}${endpoint}`, {
    method: proto.toUpperCase(),
    body: data,
    headers: {},
  })
    .then((res) => res.json())
    .then((json) => callback(json));
}

function httpLKSWithoutSidCookie(endpoint, proto, params, callback) {
  $.ajax({
    type: proto.toUpperCase(),
    url: `${SERVER.LKS}${endpoint}`,
    data: proto.toUpperCase() == 'POST' ? JSON.stringify(params) : params,
    success: function (json) {
      callback(json);
    },
    error: function (xhr, status, error) {
      callback(xhr.responseJSON);
    },
  });
}

function httpAdsWithoutSidCookie(endpoint, proto, params, callback) {
  $.ajax({
    type: proto.toUpperCase(),
    url: `${SERVER.ADS}${endpoint}`,
    data: proto.toUpperCase() == 'POST' ? JSON.stringify(params) : params,
    success: function (json) {
      callback(json);
    },
    error: function (xhr, status, error) {
      callback(xhr.responseJSON);
    },
  });
}

function httpLKS(endpoint, proto, params, callback) {
  if (sidCookie !== undefined || params.override_login === true) {
    $.ajax({
      type: proto.toUpperCase(),
      url: `${SERVER.LKS}${endpoint}`,
      headers: {
        Authorization: `Bearer ${sidCookie ?? ''}`,
      },
      data: proto.toUpperCase() == 'POST' ? JSON.stringify(params) : params,
      success: function (json) {
        callback(json);
      },
      error: function (xhr, status, error) {
        callback(xhr.responseJSON);
      },
    });
    return;
  }
  callback({});
}

// liner knowledge system endpoints
async function lksGetDocuments(urls, filterOption, numOfPhrase, topK, userId) {
  const response = await fetch(`${SERVER.LKS}/documents?top_k=${topK ?? urls.length}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      filter_option: filterOption,
      num_of_phrase: numOfPhrase,
      user_id: userId,
    }),
  });
  return await response.json();
}

function lksGetDocument(url, numOfPhrase, userId, callback) {
  const params = {
    url,
    num_of_phrase: numOfPhrase,
    user_id: userId,
  };

  httpLKSWithoutSidCookie(`/document`, 'POST', params, function (json) {
    callback(json);
  });
}

async function lksGetScannerResults(urls, filterOption, numOfPhrase, topK, userId, searchQuery) {
  const response = await fetch(`${SERVER.LKS}/scan/documents?top_k=${topK ?? urls.length}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      filter_option: filterOption,
      num_of_phrase: numOfPhrase,
      user_id: userId,
      search_query: searchQuery,
    }),
  });
  return await response.json();
}

async function lksPostRerankDocuments(urls, filterOption, numOfPhrase, topK, userId, searchQuery) {
  const response = await fetch(`${SERVER.LKS}/rerank/documents?top_k=${topK ?? urls.length}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      urls,
      filter_option: filterOption,
      num_of_phrase: numOfPhrase,
      user_id: userId,
      search_query: searchQuery,
    }),
  });
  return await response.json();
}

function lksGetVideos(urls, views, screen_type, numOfPhrase, topK, userId, callback) {
  const params = {
    urls,
    views,
    screen_type: screen_type,
    num_of_phrase: numOfPhrase,
    user_id: userId,
  };

  httpLKSWithoutSidCookie(`/videos?top_k=${topK ?? urls.length}`, 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocViewRecommendationByHighlight(
  userId,
  title,
  url,
  listOrder,
  recommendationMethod,
  callback,
) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'view';
  params.resource_type = 'document';
  params.detail_info = {
    document: {
      title,
      url,
      list_order: listOrder,
    },
  };
  params.access_type = 'recommend_by_highlight';
  params.access_method = recommendationMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocClick(userId, clickType, document, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = clickType;
  params.resource_type = 'document';
  params.detail_info = {
    document,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocClickRecommendationByPickedByLiner(userId, url, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'click';
  params.resource_type = 'document';
  params.resource_info = {
    url,
  };
  params.access_type = 'picked_by_liner';

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocCreate(userId, document, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'document';
  params.detail_info = {
    document,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocDelete(userId, url, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'delete';
  params.resource_type = 'document';
  params.resource_info = {
    url: url,
  };

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksMomentCreate(userId, document, moment, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'moment';
  params.detail_info = {
    document,
    moment,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksHighlightCreate(userId, document, phrase, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'phrase';
  params.detail_info = {
    document,
    phrase,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksMomentCommentCreate(
  userId,
  document,
  moment,
  annotation,
  accessType,
  accessMethod,
  callback,
) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'moment_annotation';
  params.detail_info = {
    document,
    moment,
    annotation,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksCommentCreate(
  userId,
  document,
  phrase,
  annotation,
  accessType,
  accessMethod,
  callback,
) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'annotation';
  params.detail_info = {
    document,
    phrase,
    annotation,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksTagCreate(userId, tagTitle, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'create';
  params.resource_type = 'tag';
  params.resource_info = {
    title: tagTitle,
  };

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksTagAdd(userId, document, tag, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'add';
  params.resource_type = 'tag';
  params.detail_info = {
    document,
    tag,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksSERP(userId, platform, query, pageNumber, section, documents, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = 'search';
  params.resource_type = 'document';
  params.detail_info = {
    platform,
    query,
    page_num: pageNumber,
    section,
    documents,
  };

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksDocRate(userId, actionType, document, accessType, accessMethod, callback) {
  const params = getLKSBaseParams();
  params.user_id = parseInt(userId);
  params.action_type = actionType;
  params.resource_type = 'document';
  params.detail_info = {
    document,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksReaction(
  userId,
  actionType,
  resourceType,
  reactionType,
  document,
  accessType,
  accessMethod,
  callback,
) {
  const params = getLKSBaseParams();
  params.user_id = +userId;
  params.action_type = actionType;
  params.resource_type = resourceType;
  params.detail_info = {
    reaction_type: reactionType,
    document,
  };
  params.access_type = accessType;
  params.access_method = accessMethod;

  httpLKS('/log/user', 'POST', params, function (json) {
    callback(json);
  });
}

function lksAutoComplete(userId, startsWith, anchor, size, callback) {
  const params = {
    user_id: parseInt(userId),
    starts_with: startsWith,
    anchor,
    size,
  };

  httpLKS('/autocomplete', 'GET', params, function (json) {
    callback(json);
  });
}

// get prioritized eligible campaign list
function getEligibleCampaigns(userId, callback) {
  const params = {
    user_id: userId,
  };
  http(SERVER.IAM, '/campaigns', 'GET', params, function (json) {
    callback(json);
  });
}

// cache share page on server
function getSharePage(shareId) {
  http(SERVER.SHARE, '/' + shareId, 'GET', {}, function (json) {});
}

// user endpoints
function getUsersMe(callback) {
  let getUsersMeCounter = 0;

  const tryGetUsersMe = () => {
    http(SERVER.API, '/users/me', 'GET', {}, function (json) {
      const { status, reason } = json;
      if (status === 'success') {
        callback(json);
      } else if (reason !== 'not_auth') {
        if (getUsersMeCounter < 3) {
          getUsersMeCounter += 1;
          setTimeout(() => {
            tryGetUsersMe();
          }, 500);
        } else {
          callback(json);
        }
      } else {
        callback(json);
      }
    });
  };

  tryGetUsersMe();
}

// auth endpoints
function postAuthCookie(callback) {
  http(SERVER.API, '/auth/cookie', 'GET', {}, function (json) {
    callback(json);
  });
}

function postAuthLocal(email, password, callback) {
  const params = {
    email: email,
    passwd: password,
  };

  http(SERVER.API, '/auth/local', 'POST', params, function (json) {
    callback(json);
  });
}

function getAuthFacebook(accessToken, callback) {
  const params = {
    access_token: accessToken,
  };

  http(SERVER.API, '/auth/facebook', 'GET', params, function (json) {
    callback(json);
  });
}

function getAuthTwitter(oauthToken, oauthTokenSecret, userID, callback) {
  const params = {
    oauth_token: oauthToken,
    oauth_token_secret: oauthTokenSecret,
    user_id: userID,
  };

  http(SERVER.API, '/auth/twitter', 'GET', params, function (json) {
    callback(json);
  });
}

function postAuthGoogle(code, callback) {
  const params = {
    code: code,
  };

  http(SERVER.API, '/auth/google', 'POST', params, function (json) {
    callback(json);
  });
}

function deleteAuth(callback) {
  http(SERVER.API, '/auth', 'DELETE', {}, function (json) {
    callback(json);
  });
}

// index endpoints
function getCheckServer(platform, info, appVersion, callback) {
  const params = {
    device: platform,
    info: info,
    app_version: appVersion,
  };

  http(SERVER.API, '/checkServer', 'GET', params, function (json) {
    callback(json);
  });
}

function postLinerVersion(platform, version, callback) {
  const params = {
    platform: platform,
    version: version,
  };

  http(SERVER.API, '/liner-version', 'POST', params, function (json) {
    callback(json);
  });
}

// page endpoints
function postPagesInfos(pageID, originalURL, status, callback) {
  let params = {};
  if (pageID != null) {
    params = {
      page_id: pageID,
    };
  } else {
    params = {
      original_url: originalURL.split('?openLinerExtension')[0].split('&openLinerExtension')[0],
      status: status,
    };
  }

  http(SERVER.API, '/pages/infos', 'POST', params, function (json) {
    callback(json);
  });
}

function postPagesSummary(originalURL, status, callback) {
  const params = {
    original_url: originalURL.split('?openLinerExtension')[0].split('&openLinerExtension')[0],
    status: status,
  };

  http(SERVER.API, '/pages/summary', 'POST', params, function (json) {
    callback(json);
  });
}

function postPagesAnnotations(originalURL, styleItemID, content, callback) {
  const params = {
    original_url: originalURL.split('?openLinerExtension')[0].split('&openLinerExtension')[0],
    style_item_id: styleItemID,
    content: content,
  };

  http(SERVER.API, '/pages/annotations', 'POST', params, function (json) {
    callback(json);
  });
}

// Luke - 페이지 최초 저장 할 때 부르는 함수
function postPages(title, url, imageURL, styleItems, lang, localDate, callback) {
  const params = {
    title,
    url,
    image: imageURL,
    engineVersion: '0.2.0',
    styleItems,
    lang,
    localDate,
  };

  http(SERVER.API, '/pages', 'POST', params, function (json) {
    callback(json);
  });
}

function postPagesPageID(pageID, styleItems, callback) {
  const params = {
    style_items: styleItems,
  };

  http(SERVER.API, '/pages/' + pageID, 'POST', params, function (json) {
    callback(json);
  });
}

function postPagesPageIDHighlightID(pageId, highlightId, slotId, callback) {
  const params = {
    slotId,
  };

  http(SERVER.API, '/pages/' + pageId + '/' + highlightId, 'POST', params, function (json) {
    callback(json);
  });
}

function putPage(pageIDs, originalStatus, newStatus, callback) {
  const params = {
    page_ids: pageIDs,
    original_status: originalStatus,
    new_status: newStatus,
  };

  http(SERVER.API, '/pages', 'PUT', params, function (json) {
    callback(json);
  });
}

// pdf endpoints
function postUserFilePdfWithUrl(fileUrl, callback) {
  const params = {
    fileUrl: fileUrl,
  };

  http(SERVER.API, '/user/file/pdf/withUrl', 'POST', params, function (json) {
    callback(json);
  });
}

async function postUserFilePdf(pdfInfo, callback) {
  const { pdfBlobUrl, fileName } = pdfInfo;
  let pdfBlob = await fetch(pdfBlobUrl).then((r) => r.blob());
  var formData = new FormData();
  formData.append('file', pdfBlob, fileName); // 파일 한 개만 허용

  $.ajax({
    type: 'POST',
    url: `${SERVER.API}/user/file/pdf`,
    data: formData,
    processData: false,
    contentType: false,
    success: function (json) {
      callback(json);
    },
    error: function (xhr, status, error) {
      callback(xhr.responseJSON);
    },
  });
}

// tag endpoints
function getUserTag(callback) {
  http(SERVER.API, '/user/tag', 'GET', {}, function (json) {
    callback(json);
  });
}

function postPageSaveSaveIdTag(saveId, tagTitle, callback) {
  const params = {
    tagTitle,
  };
  http(SERVER.API, `/page/save/${saveId}/tag`, 'POST', params, function (json) {
    callback(json);
  });
}

function deletePageSaveSaveIdTag(saveId, tagId, callback) {
  const params = {
    tagId,
  };
  http(SERVER.API, `/page/save/${saveId}/tag`, 'DELETE', params, function (json) {
    callback(json);
  });
}

function postSlackApiOauthAccess(
  slackClientId,
  slackClientSecret,
  tempCode,
  slackRedirectUri,
  callback,
) {
  const params = {
    client_id: slackClientId,
    client_secret: slackClientSecret,
    code: tempCode,
    redirect_uri: slackRedirectUri,
  };

  http(SERVER.SLACK, '/api/oauth.v2.access', 'POST', params, function (json) {
    callback(json);
  });
}

function postSlackApiChatPostMessage(accessToken, text, channel, callback) {
  const params = {
    token: accessToken,
    text: text,
    channel: channel,
    as_user: true,
  };

  http(SERVER.SLACK, '/api/chat.postMessage', 'POST', params, function (json) {
    callback(json);
  });
}

async function getUserHighlightThemeCurrent() {
  const response = await fetch(`${SERVER.API}/user/highlight/theme/current`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function getUserSlots() {
  const response = await fetch(`${SERVER.API}/user/slots`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

function getQualificationForUser(language, platform, callback) {
  http(
    SERVER.API,
    `/user/qualification/features?language=${language}&platform=${platform}`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

// Community
function postPageSearch(pageUrl, callback) {
  const params = {
    pageUrl,
  };

  http(SERVER.API, '/page/search', 'POST', params, function (json) {
    callback(json);
  });
}

function getPagePageIdHighlights(pageId, callback) {
  http(SERVER.API, `/page/${pageId}/highlights`, 'GET', {}, function (json) {
    callback(json);
  });
}

function patchUserMeProfile(name, username, bio, callback) {
  httpWithStatus(
    SERVER.API,
    '/user/me/profile',
    'PATCH',
    {
      name,
      username,
      bio,
    },
    function (json) {
      callback(json);
    },
  );
}

function putUserMeProfilePhoto(file, callback) {
  httpFormData(SERVER.API, '/user/me/profile/photo', 'PUT', file, function (json) {
    callback(json);
  });
}

// GA Endoints
function getGAPageView(userID, title, path) {
  const params = {
    v: 1,
    tid: 'UA-126096459-23',
    cid: userID ?? getUid(),
    t: 'pageview',
    dp: path,
    dt: title,
    ul: navigator.language,
  };

  logger(params);
  http(SERVER.GA, '/collect', 'GET', params, function (json) {});
}

function getGAEvent(userID, category, action, label) {
  const params = {
    v: 1,
    tid: 'UA-126096459-23',
    cid: userID ?? getUid(),
    t: 'event',
    ec: category,
    ea: action,
    el: label,
    ul: navigator.language,
  };

  logger(params);
  http(SERVER.GA, '/collect', 'GET', params, function (json) {});
}

// GA Recommendation Endpoints
function getGARecommendationPageView(userID, title, path) {
  const params = {
    v: 1,
    tid: 'UA-126096459-23',
    cid: userID ?? getUid(),
    t: 'pageview',
    dp: path,
    dt: title,
    ul: navigator.language,
  };

  logger(params);
  http(SERVER.GA, '/collect', 'GET', params, function (json) {});
}

function getGARecommendationEvent(userID, category, action, label) {
  const params = {
    v: 1,
    tid: 'UA-126096459-23',
    cid: userID ?? getUid(),
    t: 'event',
    ec: category,
    ea: action,
    el: label,
    ul: navigator.language,
  };

  logger(params);
  http(SERVER.GA, '/collect', 'GET', params, function (json) {});
}

function initAmplitude() {
  try {
    const amplitudeKey = 'ac91207b66aa64e62645c137841d7062'; // Luke - prod
    // const amplitudeKey = '5f4b790d5adfccc2cc21048da620a586'; // Luke - test
    amplitude.getInstance().init(amplitudeKey, { includeReferrer: true, includeUtm: true });
  } catch (e) {}
}

function setAmplitudeUserId() {
  try {
    if (user.id !== undefined && user.id > 0) {
      amplitude.getInstance().setUserId(user.id);
    }
  } catch (e) {}
}

function setAmplitudeUserDevice(installationToken) {
  try {
    setAmplitudeUserId();
    amplitude.getInstance().setDeviceId(installationToken);
  } catch (e) {}
}

function setAmplitudeUserProperties(properties) {
  try {
    setAmplitudeUserId();
    amplitude.getInstance().setUserProperties(properties);
  } catch (e) {}
}

function setAmplitudeUserProperty(property, value) {
  try {
    setAmplitudeUserId();
    var identify = new amplitude.Identify().set(property, value);
    amplitude.getInstance().identify(identify);
  } catch (e) {}
}

function incrementAmplitudeUserProperty(property, count) {
  try {
    setAmplitudeUserId();
    var identify = new amplitude.Identify().add(property, count);
    amplitude.getInstance().identify(identify);
  } catch (e) {}
}

function sendAmplitudeData(eventName, props = {}) {
  try {
    setAmplitudeUserId();
    const defaultProps = {
      browser: getBrowserName(),
      liner_service: 'be',
      liner_extension_version: linerExtensionVersion,
      os: getOS() === 'macos' ? 'mac' : getOS(),
      is_logged_in: isLoggedIn(),
      network_settings: (
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection
      )?.effectiveType,
    };

    const eventProperties = {
      ...defaultProps,
      ...props,
    };

    amplitude.getInstance().logEvent(eventName, eventProperties);
  } catch (e) {}
}

function postAnnotation(highlightId, annotationInfo, callback) {
  fetch(`${SERVER.API}/v3/highlight/${highlightId}/annotation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(annotationInfo),
  })
    .then((response) => response.json())
    .then(callback);
}

function editAnnotation(highlightId, annotationId, annotationInfo) {
  return fetch(`${SERVER.API}/v3/highlight/${highlightId}/annotation/${annotationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(annotationInfo),
  });
}

function postComment(highlightId, commentInfo) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentInfo),
  }).then((response) => response.json());
}

function postReply(savedPageId, commentId, commentInfo) {
  return fetch(`${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentInfo),
  }).then((response) => response.json());
}

function searchUser(query, size, callback) {
  fetch(`${SERVER.API}/mention-user/search?query=${query}&size=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(callback);
}

function getHighlightInfo(highlightId) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/community`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

function getAnnotation(highlightId, annotationId) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/annotation/${annotationId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

function getThreadComments(highlightId) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => response.json());
}

function deleteAnnotation(highlightId, annotationId) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/annotation/${annotationId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function deleteThread(highlightId) {
  // 하이라이트까지 삭제
  return fetch(`${SERVER.API}/highlight/${highlightId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function reportThread(highlightId, content, callback) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
}

async function reportComment(highlightId, commentId, content) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/comment/${commentId}/report`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
}

async function reportReply(highlightId, commentId, replyId, content) {
  return fetch(
    `${SERVER.API}/highlight/${highlightId}/comment/${commentId}/reply/${replyId}/report`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    },
  );
}

function deleteComment(highlightId, commentId) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/comment/${commentId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function deleteReply(savedPageId, commentId, replyId) {
  return fetch(`${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function getMoreComments(highlightId, lastCursor, size) {
  return fetch(
    `${SERVER.API}/highlight/${highlightId}/comments?lastCursor=${lastCursor}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((response) => response.json());
}

function getMoreReplies(savedPageId, commentId, lastCursor, size) {
  return fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/replies?lastCursor=${lastCursor}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((response) => response.json());
}

function editComment(highlightId, commentId, commentInfo) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/comment/${commentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commentInfo),
  });
}

function editReply(savedPageId, commentId, replyId, replyInfo) {
  return fetch(`${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(replyInfo),
  });
}

function inviteUserByEmail(highlightId, email) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/email-invitation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  }).then((response) => response.json());
}

function getUserUserIdProfile(userId, callback) {
  http(SERVER.API, `/user/${userId}/profile`, 'GET', {}, function (json) {
    callback(json);
  });
}

function deleteUserMeProfilePhoto(photoBackgroundColor, callback) {
  const params = {
    photoBackgroundColor,
  };
  http(SERVER.API, `/user/me/profile/photo`, 'DELETE', params, function (json) {
    callback(json);
  });
}

function getUserUserIdReferralLink(userId, callback) {
  http(SERVER.API, `/user/${userId}/referral-link`, 'GET', {}, function (json) {
    callback(json);
  });
}

function getUserMeStatisticsReferral(callback) {
  http(SERVER.API, '/user/me/statistics/referral', 'GET', {}, function (json) {
    callback(json);
  });
}

function sendBIEvent(eventType, eventProperties, url) {
  const params = getBigQueryLogBaseParams();
  params.event_type = eventType;
  params.event_properties =
    typeof eventProperties === 'string' ? JSON.parse(eventProperties) : eventProperties;
  params.url = url;

  httpLKSWithoutSidCookie('/log/bi', 'POST', params, () => {});
}

function getGeoLocationJson(callback) {
  http(SERVER.GEO_LOCATION, '/json/', 'GET', {}, function (json) {
    callback(json);
  });
}

function getExtensionConfigFromGCP(callback) {
  http(SERVER.GCP_CONFIG, '/config.json', 'GET', {}, (json) => {
    callback(json);
  });
}

// Reaction
function getHighlightReaction(highlightId, callback) {
  http(SERVER.API, `/highlight/${highlightId}/reaction`, 'GET', {}, function (json) {
    callback(json);
  });
}

async function lksGetSnippets(documents) {
  const response = await fetch(`${SERVER.LKS}/snippet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ documents }),
  });
  return await response.json();
}

function getMoreHighlightReaction(highlightId, lastCursor, callback) {
  http(
    SERVER.API,
    `/highlight/${highlightId}/reaction?lastCursor=${lastCursor}`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

function getCommentReaction(highlightId, commentId, callback) {
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reaction`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

function getMoreCommentReaction(highlightId, commentId, lastCursor, callback) {
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reaction?lastCursor=${lastCursor}`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

function getReplyReaction(highlightId, commentId, replyId, callback) {
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reply/${replyId}/reaction`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

function getMoreReplyReaction(highlightId, commentId, replyId, lastCursor, callback) {
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reply/${replyId}/reaction`,
    'GET',
    {},
    function (json) {
      callback(json);
    },
  );
}

function postHighlightReaction(highlightId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(SERVER.API, `/highlight/${highlightId}/reaction`, 'POST', params, function (json) {
    callback(json);
  });
}

function deleteHighlightReaction(highlightId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(SERVER.API, `/highlight/${highlightId}/reaction`, 'DELETE', params, function (json) {
    callback(json);
  });
}

function postCommentReaction(highlightId, commentId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reaction`,
    'POST',
    params,
    function (json) {
      callback(json);
    },
  );
}

function deleteCommentReaction(highlightId, commentId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reaction`,
    'DELETE',
    params,
    function (json) {
      callback(json);
    },
  );
}

function postReplyReaction(highlightId, commentId, replyId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reply/${replyId}/reaction`,
    'POST',
    params,
    function (json) {
      callback(json);
    },
  );
}

function deleteReplyReaction(highlightId, commentId, replyId, reactionType, callback) {
  const params = {
    reactionType,
  };
  http(
    SERVER.API,
    `/highlight/${highlightId}/comment/${commentId}/reply/${replyId}/reaction`,
    'DELETE',
    params,
    function (json) {
      callback(json);
    },
  );
}

async function postPblPagesHighlightFeed(pageUrls) {
  const response = await fetch(`${SERVER.API}/pbl/pages/highlight/feed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrls }),
  });
  return await response.json();
}

async function postPblPageHighlightUsers(pageUrl, lastCursor) {
  const response = await fetch(`${SERVER.API}/pbl/page/highlight-users?last-cursor=${lastCursor}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrl }),
  });
  return await response.json();
}

async function postPblPagesHighlightUsers(pageUrls, size) {
  const response = await fetch(`${SERVER.API}/pbl/pages/highlight-users?size=${size}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrls }),
  });
  return await response.json();
}

async function getUserHighlightOpenState() {
  const response = await fetch(`${SERVER.API}/user/highlight/open-state`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function postUserHighlightOpenState(openState) {
  fetch(`${SERVER.API}/user/highlight/open-state`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ openState }),
  });
}

function putHighlightOpenState(highlightId, openState) {
  return fetch(`${SERVER.API}/highlight/${highlightId}/open-state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ openState }),
  });
}

async function pblPageSummary(pageId, pageUrl) {
  const response = await fetch(`${SERVER.API}/pbl/page/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageId, pageUrl }),
  });
  return await response.json();
}

async function postPblPageHighlights(pageId, pageUrl) {
  const response = await fetch(`${SERVER.API}/pbl/page/highlights`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageId, pageUrl }),
  });
  return await response.json();
}

async function getPblHighlight(highlightId) {
  const response = await fetch(`${SERVER.API}/pbl/highlight/${highlightId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function getPblHighlightComments(highlightId) {
  const response = await fetch(`${SERVER.API}/pbl/highlight/${highlightId}/comments`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function postUserPageSaved({ pageUrl, pageId }) {
  const response = await fetch(`${SERVER.API}/user/page/saved`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrl, pageId }),
  });
  const savedPage = await response.json();
  return { savedPage, ok: response.ok };
}

async function postUserPagesSaved(pageUrls) {
  const response = await fetch(`${SERVER.API}/user/pages/saved`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrls }),
  });
  return await response.json();
}

async function postRecommendationValidate(url, text) {
  const response = await fetch(`${SERVER.LKS}/recommendation/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, text, liner_uuid: getLinerUUID(), device_type: 'be' }),
  });
  return await response.json();
}

async function postRecommendationDeactivate() {
  const response = await fetch(`${SERVER.LKS}/recommendation/document/bytext/deactivate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ liner_uuid: getLinerUUID() }),
  });
  return await response.json();
}

async function getUserFolders() {
  const response = await fetch(`${SERVER.API}/user/me/folders?sort-by=used-time`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function postFolder(folderName, folderEmoji) {
  const response = await fetch(`${SERVER.API}/user/me/folder`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: folderName, emoji: folderEmoji }),
  });
  return await response.json();
}

function deleteUserSavedPage(savedPageId) {
  return fetch(`${SERVER.API}/user/me/saved-page/${savedPageId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function putSavedPageFolder(savedPageId, folderId) {
  const response = await fetch(`${SERVER.API}/user/me/saved-page/${savedPageId}/folder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ folderId }),
  });
  return await response.json();
}

async function postFetchPages(url, title, image, favicon, styleItems) {
  const response = await fetch(`${SERVER.API}/pages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, title, image, favicon, styleItems }),
  });

  const savedPage = await response.json();
  return { savedPage, ok: response.ok };
}

async function postLocalSignup(email, name, passwd) {
  const response = await fetch(`${SERVER.API}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name, passwd }),
  });

  if (response.status === 409) {
    return false;
  }

  return await response.json();
}

async function postRecommendationDocumentByText(url, user_id, title, text, anchor = '0-0-0') {
  const response = await fetch(
    `${SERVER.LKS}/recommendation/document/bytext?anchor=${anchor}&size=5`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, user_id, title, text }),
    },
  );

  return await response.json();
}

async function getPublicTrendDocuments(size = 30) {
  const response = await fetch(
    `${SERVER.LKS}/trend/document/public?lang=${navigator.language}&size=${size}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function postRecommendationReact(url, user_id, react_type) {
  const response = await fetch(`${SERVER.LKS}/recommendation/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, user_id, react_type }),
  });

  return await response.json();
}

async function getTrendDocuments(size = 30) {
  const response = await fetch(`${SERVER.LKS}/trend/document?size=${size}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sidCookie ?? ''}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function getRecommendDocuments(size = 30) {
  const response = await fetch(`${SERVER.LKS}/recommendation/document?size=${size}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${sidCookie ?? ''}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function getGoogleAutoComplete(hl = 'en', query = '') {
  const response = await fetch(
    `${SERVER.AUTO_COMPLETE_GOOGLE}/search?output=toolbar&hl=${hl}&q=${query}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.text();
}

// highlight bundle - open state

async function putSavedPageOpenState(savedPageId, openState) {
  await fetch(`${SERVER.API}/saved-page/${savedPageId}/open-state`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ openState }),
  });
}

// highlight bundle - reaction

async function getSavedPageReaction(savedPageId) {
  const response = await fetch(`${SERVER.API}/saved-page/${savedPageId}/reaction`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

async function getMoreSavedPageReaction(savedPageId, lastCursor) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/reaction?lastCursor=${lastCursor}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function postSavedPageReaction(savedPageId, reactionType) {
  fetch(`${SERVER.API}/saved-page/${savedPageId}/reaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reactionType }),
  });
}

async function deleteSavedPageReaction(savedPageId, reactionType) {
  fetch(`${SERVER.API}/saved-page/${savedPageId}/reaction`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reactionType }),
  });
}

async function getSavedPageCommentReaction(savedPageId, commentId) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reaction`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function getMoreSavedPageCommentReaction(savedPageId, commentId, lastCursor) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reaction?lastCursor=${lastCursor}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function postSavedPageCommentReaction(savedPageId, commentId, reactionType) {
  fetch(`${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reactionType }),
  });
}

async function deleteSavedPageCommentReaction(savedPageId, commentId, reactionType) {
  fetch(`${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reaction`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reactionType }),
  });
}

async function getSavedPageReplyReaction(savedPageId, commentId, replyId) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}/reaction`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function getMoreSavedPageReplyReaction(savedPageId, commentId, replyId, lastCursor) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}/reaction?lastCursor=${lastCursor}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return await response.json();
}

async function postSavedPageReplyReaction(savedPageId, commentId, replyId, reactionType) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}/reaction`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reactionType }),
    },
  );

  return await response.json();
}

async function deleteSavedPageReplyReaction(savedPageId, commentId, replyId, reactionType) {
  const response = await fetch(
    `${SERVER.API}/saved-page/${savedPageId}/comment/${commentId}/reply/${replyId}/reaction`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reactionType }),
    },
  );

  return await response.json();
}

async function lksPostRecommendationDocumentHistory(urls) {
  if (urls.length === 0) return [];
  const response = await fetch(`${SERVER.LKS}/recommendation/document/history/public`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ history: urls }),
  });
  return await response.json();
}

function getFavicon(domain, size) {
  return fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function postPblPageReaction(pageUrl, reactionType) {
  return fetch(`${SERVER.API}/pbl/page/reaction`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrl, reactionType }),
  });
}

function deletePblPageReaction(pageUrl, reactionType) {
  return fetch(`${SERVER.API}/pbl/page/reaction`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrl, reactionType }),
  });
}

async function postPblPageReactionUsers(pageUrl, reactionType, size = 10) {
  const response = await fetch(`${SERVER.API}/pbl/page/reaction-users?size=${size}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrl, reactionType }),
  });

  return await response.json();
}

async function postPblPageMoreReactionUsers(pageUrl, reactionType, lastCursor, size = 10) {
  const response = await fetch(
    `${SERVER.API}/pbl/page/reaction-users?size=${size}&last-cursor=${lastCursor}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageUrl, reactionType }),
    },
  );

  return await response.json();
}

async function postPblPagesReactionUsers(pageUrls, reactionType, size = 10) {
  const response = await fetch(`${SERVER.API}/pbl/pages/reaction-users?size=${size}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageUrls, reactionType }),
  });

  return await response.json();
}

async function getInterests() {
  const response = await fetch(`${SERVER.API}/interests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function getUserInterestsArticle(user_id, interest_id, size = 36, anchor = '0-0-0') {
  const response = await fetch(
    `${SERVER.LKS}/interest/document/public?` +
      new URLSearchParams({
        user_id,
        interest_id,
        size,
        anchor: '0-0-0',
      }),
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
      },
    },
  );
  return await response.json();
}

async function getNonUserInterestsArticle(interest_id, lang, size = 36, anchor = '0-0-0') {
  const response = await fetch(
    `${SERVER.LKS}/interest/document/public?` +
      new URLSearchParams({
        interest_id,
        lang,
        size,
        anchor: '0-0-0',
      }),
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
      },
    },
  );
  return await response.json();
}

async function getRecommendationVideoPublic(videoId) {
  const response = await fetch(
    `${SERVER.LKS}/recommendation/video/public?` +
      new URLSearchParams({
        video_id: videoId,
      }),
    {
      method: 'GET',
      headers: {
        'content-Type': 'application/json',
      },
    },
  );
  return await response.json();
}

async function lksGetTrendKeywordRank(region) {
  const response = await fetch(`${SERVER.LKS}/trend/keyword/public?region=${region}&size=10`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function postSavedPageRemindMe(savedPageId) {
  return await fetch(`${SERVER.API}/page/save/${savedPageId}/remind/me`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function deleteSavedPageRemindMe(savedPageId) {
  return await fetch(`${SERVER.API}/page/save/${savedPageId}/remind/me`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

async function getSavedPageCommunity(savedPageId) {
  const response = await fetch(`${SERVER.API}/saved-page/${savedPageId}/community`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return await response.json();
}

async function savedPageHighlightSnapshot(savedPageId, styleId, snapshot) {
  return await fetch(`${SERVER.API}/page/save/${savedPageId}/highlights/${styleId}/snapshot`, {
    method: 'POST',
    headers: {},
    body: snapshot,
  });
}

async function getUserMeStatisticsHighlights(userId, startDate, endDate) {
  const response = await fetch(
    `${SERVER.API}/user/${userId}/statistics/highlights?start-date=${startDate}&end-date=${endDate}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return await response.json();
}
