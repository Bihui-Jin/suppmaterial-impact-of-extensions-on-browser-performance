$(document).ready(function () {
  logger('handler.js loaded');

  // Luke - Safari Extension이 아닌 경우 background script들이 가끔 날아가기 때문에 아래 코드가 필요함
  initAmplitude();
  addNetworkListenerAndLogin();
});

var user = {};
var highlightedPages = {}; // Luke - URL - Dictionary
var sharingContent = '';
var tags = null;
var iamCampaign = {};
var recommendedByLiner = {};

var lksRecommendationsByHighlight = [];
var lksRecommendationMethod = '';
const lksClickedPages = {};

var loginViewType = ''; // Luke - highlight, comment, save

// Luke - 아래 변수는 Safari Extension에는 없음
var disabledTabIDs = {}; // Luke - tabID - Boolean

// Luke - for lks
var sidCookie;
var prevPage = null;

var manifestData = chrome.runtime.getManifest();
var linerExtensionVersion = manifestData.version;
const advancedSearchLimit = 20;

let searchKeyword = '';
let urlOfHighlight = '';
let contentOfHighlight = '';
let videoId = '';

let clickLogInfo;

let signupPopupPageIds = [];
let signupReferrerUrl = null;
let signupReferrerPage = null;

let searchQuery = '';
let timerForGetHighlightInfo;

const newTabHandler = {
  checkIsNewTabOn: () => {
    return JSON.parse(localStorage.getItem('is_new_tab_on') ?? 'false');
  },
  turnOnNewTab: () => {
    localStorage.setItem('is_new_tab_on', 'true');
  },
  turnOffNewTab: () => {
    localStorage.setItem('is_new_tab_on', 'false');
  },
  checkIsGoogleSERPBannerShown: () => {
    const newTabHandler = JSON.parse(localStorage.getItem('new_tab_handler')) || {};
    return !!newTabHandler.isGoogleSERPBannerShown;
  },
  setIsGoogleSERPBannerShown: (isShown) => {
    const newTabHandler = JSON.parse(localStorage.getItem('new_tab_handler')) || {};
    localStorage.setItem(
      'new_tab_handler',
      JSON.stringify({ ...newTabHandler, isGoogleSERPBannerShown: isShown }),
    );
  },
  checkIsMoreLikeThisBannerShown: () => {
    const newTabHandler = JSON.parse(localStorage.getItem('new_tab_handler')) || {};
    return !!newTabHandler.isMoreLikeThisBannerShown;
  },
  setIsMoreLikeThisBannerShown: (isShown) => {
    const newTabHandler = JSON.parse(localStorage.getItem('new_tab_handler')) || {};
    localStorage.setItem(
      'new_tab_handler',
      JSON.stringify({ ...newTabHandler, isMoreLikeThisBannerShown: isShown }),
    );
  },
};

const geoLocationHandler = {
  countryCode: '',
  countryName: '',
  lastFetchedTime: 0,
};

let userOpenState = 'public';

function resetVariables() {
  getUser(function (result) {
    if (result) {
      browser.tabs.query({}, function (tabs) {
        tabs.forEach((page) => {
          const url = page.url;

          // Luke - inject user data
          messageTo(page, 'USER_INFO', user);

          // Luke - fetch and inject highlight data
          postPagesInfos(null, url, 0, function (json) {
            if (json['status'] == 'success') {
              var item = json['item'] || {};
              highlightedPages[getURLWithoutHash(item['url'])] = {
                page_id: item['pageId'],
                tags: item['tags'],
                style_items: item['styleItems'],
                share_id: item['shareId'],
                last_update_time: item['lastUpdateTime'],
                comments: [],
                new_highlights: [],
              };

              postPagesSummary(item['url'], 0, function (json) {
                if (json['status'] == 'success') {
                  var items = json['items'];
                  highlightedPages[getURLWithoutHash(item['url'])]['comments'] = items || [];
                }

                const highlightVar = highlightedPages[getURLWithoutHash(item['url'])];
                messageTo(page, 'PAGE_INFO', {
                  highlightVar,
                  highlightUrl: getUrlForHighlightInfo(url),
                  isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
                });

                // 최초
                updatePageHighlights(getURLWithoutHash(getUrlForHighlightInfo(url)), page, false, {
                  highlightVar,
                  context: 'RESET_VARIABLES',
                });
              });
            }
          });
        });
      });
      fetchTagsFromServer(function () {});
    } else {
      localStorage.removeItem('sidCookie');
      localStorage.removeItem('userId');
    }
  });
}

// Luke - content -> background로 메세지가 옴
// Luke - 아래 함수의 형태는 Safari Extension과 최대한 유사한 구조로 구현함(Safari로부터의 Porting을 쉽게 하기 위함)
function messageReceived(messageName, page, userInfo) {
  logger('message received - handler');
  logger(messageName);

  if (messageName === 'AMPLITUDE_USER_PROPERTY') {
    const { type, property, value } = userInfo;

    if (type === 'add') {
      incrementAmplitudeUserProperty(property, value);
    } else if (type === 'set') {
      setAmplitudeUserProperty(property, value);
    }

    return;
  } else if (messageName === 'AMPLITUDE_EVENT') {
    const { event_name: eventName, properties } = userInfo;
    sendAmplitudeData(eventName, properties);
  }

  const pageUrl =
    page.url !== undefined
      ? page.url.split('?openLinerExtension')[0].split('&openLinerExtension')[0].split('&t=')[0]
      : '';

  if (messageName === 'CACHE_SIGNUP_POPUP_REFERRER_INFO') {
    signupReferrerUrl = userInfo['referrer'];
    signupReferrerPage = page;
  } else if (messageName === 'GET_SIGNUP_POPUP_REFERRER_URL') {
    messageTo(page, 'GET_SIGNUP_POPUP_REFERRER_URL', {
      signupReferrerUrl,
    });
    signupReferrerUrl = null;
  } else if (messageName === 'CACHE_SIGNUP_POPUP_PAGE_ID') {
    signupPopupPageIds.push(page.id);
  } else if (messageName === 'CLOSE_POPUP_AND_RELOAD_REFERRER') {
    const isPopupPage = signupPopupPageIds.includes(page.id);
    if (!isPopupPage) return;
    signupPopupPageIds = signupPopupPageIds.filter(
      (popupPageIdElement) => popupPageIdElement !== page.id,
    );
    chrome.tabs.remove(page.id);
    chrome.tabs.reload(signupReferrerPage.id);
    resetVariables();
  } else if (messageName === 'RELOAD_REFERRER') {
    chrome.tabs.reload(signupReferrerPage.id);
    resetVariables();
  } else if (messageName === 'LKS_EVENT') {
    const eventType = userInfo['type'];
    if (eventType === 'moment_create') {
      const document = userInfo['document'] ?? {};
      const moment = userInfo['moment'] ?? {};
      lksMomentCreate(
        user.id,
        document,
        moment,
        userInfo.access_type,
        userInfo.access_method,
        function (json) {},
      );
    } else if (eventType === 'moment_comment_create') {
      lksMomentCommentCreate(
        user.id,
        userInfo['document'],
        userInfo['moment'],
        userInfo['annotation'],
        userInfo['access_type'],
        userInfo['access_method'],
        function (json) {},
      );
    } else if (eventType === 'highlight_create') {
      const document = userInfo['document'] ?? {};
      const phrase = userInfo['phrase'] ?? {};
      lksHighlightCreate(
        user.id,
        document,
        phrase,
        userInfo.access_type,
        userInfo.access_method,
        function (json) {},
      );
    } else if (eventType === 'comment_create') {
      lksCommentCreate(
        user.id,
        userInfo['document'],
        userInfo['phrase'],
        userInfo['annotation'],
        userInfo['access_type'],
        userInfo['access_method'],
        function (json) {},
      );
    } else if (eventType === 'doc_click') {
      const { document, area_type: areaType, click_type: clickType } = userInfo;

      const pushLongClickUrlToLStorage = (longClickUrl) => {
        const LONG_CLICK_URL_CAPACITY = 50;

        const longClickUrlList = JSON.parse(localStorage.getItem('long_click_url_list'));
        if (longClickUrlList === null) {
          localStorage.setItem('long_click_url_list', JSON.stringify([longClickUrl]));
        } else {
          longClickUrlList.unshift(longClickUrl);
          if (longClickUrlList.length > LONG_CLICK_URL_CAPACITY) {
            longClickUrlList.pop();
          }
          localStorage.setItem('long_click_url_list', JSON.stringify(longClickUrlList));
        }
      };

      const isGoogleDocLongClick = areaType === 'google' && clickType === 'long_click';
      if (isGoogleDocLongClick) {
        pushLongClickUrlToLStorage(document.url);
      }

      lksDocClick(
        user.id,
        clickType,
        document,
        userInfo.access_type,
        userInfo.access_method,
        function (json) {},
      );
    } else if (eventType === 'click_recommendation_by_picked_by_liner') {
      lksDocClickRecommendationByPickedByLiner(user.id, userInfo['url'], function (json) {});
    } else if (eventType === 'view_recommendation_by_highlight') {
      lksDocViewRecommendationByHighlight(
        user.id,
        userInfo['title'] ?? '',
        userInfo['url'],
        userInfo['list_order'],
        userInfo['recommendation_method'],
        function (json) {},
      );
    } else if (eventType === 'search_engine_result_page') {
      lksSERP(
        user.id,
        userInfo['platform'],
        userInfo['query'],
        userInfo['page_number'],
        userInfo['section'],
        userInfo['documents'],
        function (json) {},
      );
    } else if (eventType === 'reaction' || eventType === 'cancel_reaction') {
      const { resourceType, reactionType, document, accessType, accessMethod } = userInfo;
      lksReaction(
        user.id,
        eventType,
        resourceType,
        reactionType,
        document,
        accessType,
        accessMethod,
        () => {},
      );
    }
    return;
  } else if (messageName === 'GET_DOCUMENTS') {
    const { type: getDocumentsType = 'google_pbl' } = userInfo;

    const GOOGLE_SCANNER = 'google_scanner';
    const GOOGLE_PBL = 'google_pbl';
    const YOUTUBE_PBL = 'youtube_pbl';

    switch (getDocumentsType) {
      case GOOGLE_PBL: {
        const { urls = [], scrap_cnt = 3, reaction_type } = userInfo;
        const NUM_OF_PHRASE = 7;
        const TOP_K = 3;

        Promise.all([
          lksGetDocuments(urls, { scrap_cnt }, NUM_OF_PHRASE, TOP_K, user?.id),
          postPblPagesHighlightFeed(urls),
          postPblPagesHighlightUsers(urls, 10),
        ]).then(([documents, pblHighlights, pblHighlightUsers]) => {
          messageTo(page, 'GET_DOCUMENTS', {
            type: GOOGLE_PBL,
            urls,
            documents,
            pblHighlights,
            pblHighlightUsers,
            isBlockLiveHighlightCohort: checkIsBlockLiveHighlightCohort(),
          });

          documents.forEach((document) => {
            if (document.req_url !== undefined) {
              recommendedByLiner[document.req_url] = {
                source_type: 'picked_by_liner',
                phrases: document.phrases,
                is_from_serp: true,
              };
            }
          });
        });
        break;
      }
      case YOUTUBE_PBL: {
        const { urls = [], views, screen_type: screenType = 0 } = userInfo;
        const NUM_OF_PHRASE = 0;
        const TOP_K = Math.min(Math.floor(urls.length / 2), 20);

        if (checkIsBlockYoutubePBLCohort()) return;

        lksGetVideos(urls, views, screenType, NUM_OF_PHRASE, TOP_K, user?.id, (json) => {
          let documents = json;

          messageTo(page, 'GET_DOCUMENTS', {
            type: YOUTUBE_PBL,
            documents,
          });
        });
        break;
      }
      case GOOGLE_SCANNER: {
        try {
          const {
            urls = [],
            scrap_cnt = 1,
            doc_div_tags = [],
            search_query: searchQuery = '',
          } = userInfo;
          const TOP_K = urls.length;
          const NUM_OF_PHRASE = 7;
          const filterOption = { scrap_cnt };

          lksPostRerankDocuments(
            urls,
            filterOption,
            NUM_OF_PHRASE,
            TOP_K,
            user?.id,
            searchQuery,
          ).then((documents) => {
            messageTo(page, 'GET_DOCUMENTS', {
              type: GOOGLE_SCANNER,
              doc_div_tags,
              documents,
              is_valid_data_form: Array.isArray(documents),
            });
          });
        } catch (e) {
          console.error(e);
        }
        break;
      }
    }
  } else if (messageName === 'UPDATE_HIGHLIGHT_COUNT') {
    setHighlightCount();
  } else if (messageName === 'CLOSE_SCROLL_POINT_GUIDE') {
    localStorage.setItem('show_scroll_point_guide', false);
  } else if (messageName === 'CLOSE_RECOMMEND_LINER_BANNER') {
    localStorage.setItem('show_recommend_liner_banner', false);
  } else if (messageName === 'SAVE_TO_LINER') {
    messageTo(page, 'SAVE_PAGE', {});
  } else if (messageName === 'RELOAD_RECOMMENDATION_POPOVER') {
    let recommendationViewHeight = 41 + 73 * lksRecommendationsByHighlight.length + 8;
    // if (user.premium == 0) {
    //   recommendationViewHeight = 173;
    // }
    if (isRPClosed() === true) {
      recommendationViewHeight = 48;
    }

    messageTo(page, 'RELOAD_RECOMMENDATION_POPOVER', {
      user,
      is_rp_closed: isRPClosed(),
      documents: lksRecommendationsByHighlight,
      recommendation_method: lksRecommendationMethod,
      style: `height: ${recommendationViewHeight}px !important`,
      page: page,
    });
  } else if (messageName === 'TOGGLE_RELEVANT_PAGES') {
    let recommendationViewHeight = 48;
    if (isRPClosed() === true) {
      recommendationViewHeight = 41 + 73 * lksRecommendationsByHighlight.length + 8;
      // if (user.premium == 0) {
      //   recommendationViewHeight = 173;
      // }
    }

    localStorage.setItem('is_rp_closed', !isRPClosed());

    messageTo(page, 'TOGGLE_RELEVANT_PAGES', {
      is_rp_closed: isRPClosed(),
      style: `height: ${recommendationViewHeight}px !important`,
    });
  } else if (messageName === 'INIT_PDF_UPLOAD_BTN') {
    messageTo(page, 'INIT_PDF_UPLOAD_BTN', {
      did_see_pdf_banner: getDidSeePDFBanner(),
    });
    saveDidSeePDFBanner();
  } else if (messageName === 'UPLOAD_PDF') {
    if (user.id) {
      const pdfInfo = {
        pdfBlobUrl: userInfo['pdf_blob_url'],
        fileName: getPDFDocumentTitle(page),
      };

      postUserFilePdf(pdfInfo, function (json) {
        if (json['status'] === 'error' && json['reason'] === 'not_auth') {
          openTab(`${URI.LINER}/signup`, function () {});
        }

        messageTo(page, 'UPLOAD_PDF_COMPLETE', {
          pdf_url: json['pdfUrl'],
        });
      });

      lksDocCreate(
        user.id,
        userInfo['document'],
        userInfo['access_type'],
        userInfo['access_method'],
        function (json) {},
      );
    } else {
      // Luke - 로그인 안된 사용자
      openTab(`${URI.LINER}/signup`, function () {});
      messageTo(page, 'UPLOAD_PDF_COMPLETE', {});
    }
  } else if (messageName === 'UPLOAD_PDF_WITH_URL') {
    if (user.id) {
      const fileUrl = userInfo['url'];
      getFileSize(fileUrl, function (fileSize) {
        postUserFilePdfWithUrl(fileUrl, function (json) {
          if (json['status'] === 'error' && json['reason'] === 'not_auth') {
            openTab(`${URI.LINER}/signup`, function () {});
          }

          messageTo(page, 'UPLOAD_PDF_COMPLETE', {
            pdf_url: json['pdfUrl'],
          });
        });
      });

      lksDocCreate(
        user.id,
        userInfo['document'],
        userInfo['access_type'],
        userInfo['access_method'],
        function (json) {},
      );
    } else {
      // Luke - 로그인 안된 사용자
      openTab(`${URI.LINER}/signup`, function () {});
      messageTo(page, 'UPLOAD_PDF_COMPLETE', {});
    }
  } else if (messageName === 'POPOVER_INIT') {
    getActivePage(function (page) {
      const currentUrl = page.url
        .split('?openLinerExtension')[0]
        .split('&openLinerExtension')[0]
        .split('&t=')[0];

      const savedPage = highlightedPages[getURLWithoutHash(currentUrl)];
      const popOverInitInfo = {
        user: user,
        highlighted_pages: highlightedPages,
        page: page,
        is_eligible_for_manage_guide: isEligibleForGuide('manage'),
        is_eligible_for_manage_tooltip_guide: isEligibleForGuide('manage_tooltip'),
        do_not_show_advaned_search: getDoNotShowAdvancedSearch(),
        doNotRunPage: getDoNotRunPage(),
        doNotRunSite: getDoNotRunSite(),
      };

      if (savedPage) {
        postUserPageSaved({ pageUrl: currentUrl }).then((res) => {
          popOverInitInfo.folder = res?.savedPage.folder;
          messageTo(page, 'POPOVER_INIT', popOverInitInfo);
        });
      } else {
        messageTo(page, 'POPOVER_INIT', popOverInitInfo);
      }
    });
    return;
  } else if (messageName === 'CHANGE_POPOVER_HEIGHT') {
    messageTo(page, 'CHANGE_POPOVER_HEIGHT', {
      height: userInfo['height'],
      popover_class: userInfo['popover_class'],
    });
    return;
  } else if (messageName === 'DELETE_ALL_HIGHLIGHTS') {
    messageTo(page, 'DELETE_ALL_HIGHLIGHTS', {});
    delete highlightedPages[getURLWithoutHash(pageUrl)];
    putPage([userInfo['page_id']], 0, 2, function (json) {});
    lksDocDelete(user.id, pageUrl, function () {});
    return;
  } else if (messageName === 'IAM_INIT') {
    messageTo(page, 'IAM_INIT', {
      iam_campaign: iamCampaign,
    });
    return;
  } else if (messageName === 'SHOW_IAM') {
    // Luke - IAM Banner를 Fade In 시키는 메세지
    showIAM(page);
    return;
  } else if (messageName === 'CLOSE_IAM') {
    // Luke - IAM Banner를 Fade Out 시키는 메세지
    hideIAM(page, userInfo['remove_iam'] ?? false);

    if (iamCampaign.launch_status == 2) {
      setLatestECCloseDate();
    }

    if (userInfo['never_show_again'] === true) {
      setDoNotShowEC(iamCampaign.id);
    }

    return;
  } else if (messageName == 'LOGIN_INIT') {
    messageTo(page, 'LOGIN_INIT', {
      type: loginViewType,
    });
    return;
  } else if (messageName == 'TAG_POPOVER_INIT') {
    retry(0);

    function retry(retryCnt) {
      if (retryCnt > 200) {
        return;
      }

      try {
        messageTo(page, 'TAG_POPOVER_INIT', {
          tags,
          added_tags: highlightedPages[getURLWithoutHash(pageUrl)].tags,
        });
      } catch (e) {
        setTimeout(() => {
          retry(parseInt(retryCnt) + 1);
        }, 10);
      }
    }
    return;
  } else if (messageName == 'TAG_INPUT_CHANGE') {
    const hasTags = tags != null && tags.length > 0;
    const addedTags = highlightedPages[getURLWithoutHash(pageUrl)].tags;
    const didAddAllTags = tags.length == addedTags.length;
    const input = userInfo['input'] ?? '';
    if (input.trim() == '' && (!hasTags || didAddAllTags)) {
      messageTo(page, 'HIDE_TAG', {});
    } else {
      messageTo(page, 'SHOW_TAG', {
        top: userInfo['top'] ?? 0,
        my_tags: tags,
        added_tags: addedTags,
        input,
      });
      messageTo(page, 'TAG_INPUT_CHANGE', {
        input,
      });
      lksAutoComplete(user.id, input, undefined, 20, function (json) {
        messageTo(page, 'TAG_AUTOCOMPLETE', {
          input,
          suggestions: json,
        });
      });
    }
    return;
  } else if (messageName == 'TAG_INPUT_FOCUS') {
    const hasTags = tags != null && tags.length;
    const addedTags = highlightedPages[getURLWithoutHash(pageUrl)].tags;
    const didAddAllTags = tags.length == addedTags.length;
    if (hasTags && !didAddAllTags) {
      messageTo(page, 'SHOW_TAG', {
        top: userInfo['top'] ?? 0,
        my_tags: tags,
        added_tags: addedTags,
      });
    }
    return;
  } else if (messageName == 'HIDE_TAG') {
    messageTo(page, 'HIDE_TAG', {});
    return;
  } else if (messageName == 'ALREADY_TAGGED') {
    messageTo(page, 'ALREADY_TAGGED', {});
    return;
  } else if (messageName === 'GET_ANNOTATION') {
    const { highlightId, annotationId, slotId, core } = userInfo;
    getAnnotation(highlightId, annotationId).then((highlightInfo) => {
      messageTo(page, 'GET_ANNOTATION', { highlightId, slotId, core, ...highlightInfo });
    });
  } else if (messageName === 'POST_ANNOTATION') {
    const { savedPageId, highlightId, annotationInfo, openState, isImageHighlight } = userInfo;
    postAnnotation(highlightId, annotationInfo, (res) => {
      messageTo(page, 'POST_ANNOTATION', {
        savedPageId,
        highlightId,
        openState,
        ...res,
        isImageHighlight,
      });
    });
  } else if (messageName === 'MENTION_USER_SEARCH') {
    const { query, size } = userInfo;

    searchUser(query, size, ({ searchedUsers }) => {
      messageTo(page, 'MENTION_USER_SEARCH', searchedUsers);
    });
  } else if (messageName === 'SEARCH_TOKEN') {
    const { query, size, commentId } = userInfo;

    searchUser(query, size, ({ searchedUsers }) => {
      messageTo(page, 'SEARCH_TOKEN', { ...searchedUsers, commentId });
    });
  } else if (messageName === 'COMMENT_MENTION_USER_SEARCH') {
    const { query, size } = userInfo;

    searchUser(query, size, ({ searchedUsers }) => {
      messageTo(page, 'COMMENT_MENTION_USER_SEARCH', searchedUsers);
    });
  } else if (messageName === 'GET_HIGHLIGHT_INFO') {
    const { highlightId, isImageHighlight } = userInfo;
    if (isLoggedIn()) {
      Promise.all([getHighlightInfo(highlightId), getThreadComments(highlightId)]).then(
        ([highlightInfo, comments]) =>
          messageTo(page, 'GET_HIGHLIGHT_INFO', {
            ...highlightInfo,
            ...comments,
            isImageHighlight,
          }),
      );
    } else {
      Promise.all([getPblHighlight(highlightId), getPblHighlightComments(highlightId)]).then(
        ([highlightInfo, comments]) =>
          messageTo(page, 'GET_HIGHLIGHT_INFO', { ...highlightInfo, ...comments }),
      );
    }
  } else if (messageName === 'DELETE_THREAD') {
    const { highlightId, isImageHighlight } = userInfo;
    deleteThread(highlightId).then((res) =>
      messageTo(page, 'DELETE_THREAD', { highlightId, ...res, isImageHighlight }),
    );
  } else if (messageName === 'REPORT_THREAD') {
    const { highlightId, content } = userInfo;
    reportThread(highlightId, content).then(() => messageTo(page, 'REPORT_THREAD', { content }));
  } else if (messageName === 'POST_COMMENT') {
    const { highlightId, commentInfo } = userInfo;
    postComment(highlightId, commentInfo).then((res) => {
      messageTo(page, 'POST_COMMENT', { highlightId, ...res });
    });
  } else if (messageName === 'DELETE_COMMENT') {
    const { highlightId, commentId } = userInfo;
    deleteComment(highlightId, commentId).then((res) => {
      messageTo(page, 'DELETE_COMMENT', { commentId, ...res });
    });
  } else if (messageName === 'REPORT_COMMENT') {
    const { highlightId, commentId, content } = userInfo;
    reportComment(highlightId, commentId, content).then(() => {
      messageTo(page, 'REPORT_COMMENT', { content });
    });
  } else if (messageName === 'DELETE_REPLY') {
    const { savedPageId, highlightId, commentId, replyId } = userInfo;
    deleteReply(savedPageId, commentId, replyId).then((res) => {
      messageTo(page, 'DELETE_REPLY', { commentId, replyId, ...res });
    });
  } else if (messageName === 'POST_REPLY') {
    const { savedPageId, highlightId, commentId, replyInfo } = userInfo;
    postReply(savedPageId, commentId, replyInfo).then((res) => {
      messageTo(page, 'POST_REPLY', { highlightId, commentId, ...res });
    });
  } else if (messageName === 'REPORT_REPLY') {
    const { highlightId, commentId, replyId, content } = userInfo;
    reportReply(highlightId, commentId, replyId, content).then(() => {
      messageTo(page, 'REPORT_REPLY', { commentId, content });
    });
  } else if (messageName === 'GET_MORE_COMMENTS') {
    const { highlightId, lastCursor, size } = userInfo;
    getMoreComments(highlightId, lastCursor, size).then((res) => {
      messageTo(page, 'GET_MORE_COMMENTS', { highlightId, ...res });
    });
  } else if (messageName === 'GET_MORE_REPLIES') {
    const { savedPageId, highlightId, commentId, lastCursor, size } = userInfo;
    getMoreReplies(savedPageId, commentId, lastCursor, size).then((res) => {
      messageTo(page, 'GET_MORE_REPLIES', { highlightId, commentId, ...res });
    });
  } else if (messageName === 'CHANGE_OPEN_STATE_IN_SAVED_THREAD') {
    const { savedPageId, highlightId, currOpenState, nextOpenState } = userInfo;
    putHighlightOpenState(highlightId, nextOpenState).then(() => {
      messageTo(page, 'CHANGE_OPEN_STATE_IN_SAVED_THREAD', {
        savedPageId,
        highlightId,
        currOpenState,
        nextOpenState,
      });
    });
  } else if (messageName === 'CHANGE_OPEN_STATE_IN_INITIAL_THREAD_OR_TOOLTIP') {
    const { savedPageId, highlightId, currentOpenState, nextOpenState, areaType } = userInfo;
    putHighlightOpenState(highlightId, nextOpenState).then(() => {
      messageTo(page, 'CHANGE_OPEN_STATE_IN_INITIAL_THREAD_OR_TOOLTIP', {
        savedPageId,
        highlightId,
        currentOpenState,
        nextOpenState,
        areaType,
      });
    });
  } else if (messageName === 'EDIT_ANNOTATION') {
    const { highlightId, annotationId, annotationInfo } = userInfo;
    editAnnotation(highlightId, annotationId, annotationInfo).then((res) => {
      messageTo(page, 'EDIT_ANNOTATION', { highlightId, annotationId, ...res });
    });
  } else if (messageName === 'EDIT_COMMENT') {
    const { highlightId, commentId, commentInfo } = userInfo;
    editComment(highlightId, commentId, commentInfo).then((res) => {
      messageTo(page, 'EDIT_COMMENT', { highlightId, commentId, commentInfo, ...res });
    });
  } else if (messageName === 'EDIT_REPLY') {
    const { savedPageId, highlightId, commentId, replyId, replyInfo } = userInfo;
    editReply(savedPageId, commentId, replyId, replyInfo).then((res) => {
      messageTo(page, 'EDIT_REPLY', { highlightId, commentId, replyId, replyInfo, ...res });
    });
  } else if (messageName === 'GET_USER_PROFILE') {
    const { userId } = userInfo;
    getUserUserIdProfile(userId, function (json) {
      messageTo(page, 'GET_USER_PROFILE', json);
    });
  } else if (messageName === 'GET_HIGHLIGHT_REACTION') {
    const { savedPageId, highlightId, likeCount } = userInfo;
    getSavedPageReaction(savedPageId).then((res) => {
      const message = { ...res, savedPageId, highlightId, likeCount };
      messageTo(page, 'GET_HIGHLIGHT_REACTION', message);
    });
  } else if (messageName === 'GET_MORE_HIGHLIGHT_REACTION') {
    const { savedPageId, lastCursor } = userInfo;
    getMoreSavedPageReaction(savedPageId, lastCursor).then((res) => {
      messageTo(page, 'GET_MORE_HIGHLIGHT_REACTION', res);
    });
  } else if (messageName === 'GET_COMMENT_REACTION') {
    const { savedPageId, highlightId, commentId, likeCount } = userInfo;
    getSavedPageCommentReaction(savedPageId, commentId).then((res) => {
      const message = { ...res, savedPageId, highlightId, commentId, likeCount };
      messageTo(page, 'GET_COMMENT_REACTION', message);
    });
  } else if (messageName === 'GET_MORE_COMMENT_REACTION') {
    const { savedPageId, commentId, lastCursor } = userInfo;
    getMoreSavedPageCommentReaction(savedPageId, commentId, lastCursor).then((res) => {
      messageTo(page, 'GET_MORE_HIGHLIGHT_REACTION', res);
    });
  } else if (messageName === 'GET_REPLY_REACTION') {
    const { savedPageId, highlightId, commentId, replyId, likeCount } = userInfo;
    getSavedPageReplyReaction(savedPageId, commentId, replyId).then((res) => {
      const message = { ...res, savedPageId, highlightId, commentId, replyId, likeCount };
      messageTo(page, 'GET_REPLY_REACTION', message);
    });
  } else if (messageName === 'GET_MORE_REPLY_REACTION') {
    const { savedPageId, commentId, replyId, lastCursor } = userInfo;
    getMoreSavedPageReplyReaction(savedPageId, commentId, replyId, lastCursor).then((res) => {
      messageTo(page, 'GET_MORE_HIGHLIGHT_REACTION', res);
    });
  } else if (messageName === 'POST_HIGHLIGHT_REACTION') {
    const { savedPageId, reactionType } = userInfo;
    postSavedPageReaction(savedPageId, reactionType);
  } else if (messageName === 'DELETE_HIGHLIGHT_REACTION') {
    const { savedPageId, reactionType } = userInfo;
    deleteSavedPageReaction(savedPageId, reactionType);
  } else if (messageName === 'POST_COMMENT_REACTION') {
    const { savedPageId, commentId, reactionType } = userInfo;
    postSavedPageCommentReaction(savedPageId, commentId, reactionType);
  } else if (messageName === 'DELETE_COMMENT_REACTION') {
    const { highlightId, commentId, reactionType } = userInfo;
    deleteSavedPageCommentReaction(highlightId, commentId, reactionType);
  } else if (messageName === 'POST_REPLY_REACTION') {
    const { savedPageId, commentId, replyId, reactionType } = userInfo;
    postSavedPageReplyReaction(savedPageId, commentId, replyId, reactionType);
  } else if (messageName === 'DELETE_REPLY_REACTION') {
    const { savedPageId, commentId, replyId, reactionType } = userInfo;
    deleteSavedPageReplyReaction(savedPageId, commentId, replyId, reactionType);
  } else if (messageName === 'INITIAL_PAGE_HIGHLIGHT') {
    const { pageId, url, imageUrl, imageId, imageHighlight } = userInfo;
    if (pageId) {
      getPagePageIdHighlights(pageId, (res) => {
        const { highlights } = res;
        messageTo(page, 'PAGE_HIGHLIGHT', {
          url,
          pageId,
          highlights,
          imageUrl,
          imageId,
          imageHighlight,
          context: 'SAVE_HIGHLIGHT',
          isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
          isBlockPublicThreadCohort: checkIsBlockPublicThreadCohort(),
        });
      });
    }
  } else if (messageName === 'DELETE_USER_PROFILE_PHOTO') {
    const { photoBackgroundColor } = userInfo;
    deleteUserMeProfilePhoto(photoBackgroundColor, function (json) {
      messageTo(page, 'DELETE_USER_PROFILE_PHOTO', json);
    });
  } else if (messageName === 'GET_REFERRAL_LINK') {
    if (!user.id) return;
    getUserUserIdReferralLink(user.id, function (json) {
      const { url } = json;
      messageTo(page, 'GET_REFERRAL_LINK', { url });
    });
  } else if (messageName === 'GET_REFERRAL_USER_DATA') {
    getUserMeStatisticsReferral(function (json) {
      const { referralCount, signUpEpochSecond, isReferralUser } = json;
      messageTo(page, 'GET_REFERRAL_USER_DATA', {
        referralCount,
        signUpEpochSecond,
        isReferralUser,
      });
    });
  } else if (messageName === 'CHECK_YOUTUBE_PBL') {
    const { url, originalUrl } = userInfo;
    lksGetVideos([url], [0], 0, 0, 1, user.id ?? null, function (json) {
      const documents = json;
      if (documents.length > 0) {
        const document = documents[0];
        const isYoutubePbl = !!document.req_url;
        messageTo(page, 'CHECK_YOUTUBE_PBL', {
          isYoutubePbl,
          originalUrl,
        });
      }
    });
  } else if (messageName === 'BI_EVENT') {
    // 앰플리튜드 볼륨 문제 대처 방안. 빅쿼리로 로그 보내기 (Business Intelligence)
    const { eventType, eventProperties, url } = userInfo;
    sendBIEvent(eventType, eventProperties, url);
  } else if (messageName === 'GET_SEARCH_QUERY') {
    searchQuery = userInfo.googleSearchQuery;
  } else if (messageName === 'GET_INFO') {
    messageTo(page, 'GET_INFO', {
      searchQuery,
      user,
      countryCode: geoLocationHandler.countryCode,
      cohortNumber: getLastNumberOfLinerUUID(),
      isNewTabOn: newTabHandler.checkIsNewTabOn(),
      isNewTabMoreLikeThisBannerShown: newTabHandler.checkIsMoreLikeThisBannerShown(),
      isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
    });
    searchQuery = '';
  } else if (messageName === 'GET_INFO_AFTER_LOAD') {
    messageTo(page, 'GET_INFO_AFTER_LOAD', {
      user,
    });
  } else if (messageName === 'GET_GEO_LOCATION') {
    getGeoLocationJson(function (json) {
      const geoResult = JSON.parse(json);
      const { country_code: countryCode } = geoResult;
      messageTo(page, 'GET_GEO_LOCATION', { countryCode });
    });
  } else if (messageName === 'CHECK_MODAL_HANDLER') {
    const { name } = userInfo;
    const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};

    switch (name) {
      case 'userProfile': {
        const isProfileSetOrDismissed = modalHandler[name]?.isProfileSetOrDismissed;
        if (!isProfileSetOrDismissed) {
          getUserUserIdProfile(user.id, (json) => {
            if (json.status === 'error') return;
            messageTo(page, 'CHECK_MODAL_HANDLER', { name, userProfile: json });
          });
        }
        break;
      }
      case 'imageHighlighter': {
        const isModalShown = modalHandler[name]?.isModalShown;
        if (!isModalShown) {
          localStorage.setItem(
            'modal_handler',
            JSON.stringify({ ...modalHandler, [name]: { isModalShown: true } }),
          );
          messageTo(page, 'CHECK_MODAL_HANDLER', { name, savedPageId: userInfo.savedPageId });
        }
        break;
      }
    }
  } else if (messageName === 'UPDATE_MODAL_HANDLER') {
    const { name } = userInfo;
    const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};

    switch (name) {
      case 'userProfile': {
        localStorage.setItem(
          'modal_handler',
          JSON.stringify({ ...modalHandler, [name]: { isProfileSetOrDismissed: true } }),
        );
        break;
      }
      case 'openState': {
        localStorage.setItem(
          'modal_handler',
          JSON.stringify({
            ...modalHandler,
            [name]: { forcePublicDatetime: new Date().getTime() },
          }),
        );
        break;
      }
      case 'moreLikeThisNudge': {
        localStorage.setItem(
          'modal_handler',
          JSON.stringify({ ...modalHandler, [name]: { isShown: true } }),
        );
      }
    }
  } else if (messageName === 'INVITE_USER') {
    const { highlightId, email } = userInfo;
    inviteUserByEmail(highlightId, email).then((res) => {
      messageTo(page, 'INVITE_USER', res);
    });
  } else if (messageName === 'INIT_NEW_TAB') {
    const { isFromScanner } = userInfo;
    const isGoogleSERPBannerShown = newTabHandler.checkIsGoogleSERPBannerShown();
    const isNewTabOn = newTabHandler.checkIsNewTabOn();
    messageTo(page, 'INIT_NEW_TAB', { isGoogleSERPBannerShown, isNewTabOn, isFromScanner });
  } else if (messageName === 'TOGGLE_NEW_TAB') {
    const { isTurningNewTabOn } = userInfo;
    if (isTurningNewTabOn) {
      newTabHandler.turnOnNewTab();
    } else {
      newTabHandler.turnOffNewTab();
    }
  } else if (messageName === 'CLOSE_NEW_TAB_BANNER') {
    const { type } = userInfo;
    switch (type) {
      case 'SERP': {
        newTabHandler.setIsGoogleSERPBannerShown(true);
        break;
      }
      case 'MoreLikeThis': {
        newTabHandler.setIsMoreLikeThisBannerShown(true);
        break;
      }
    }
  } else if (messageName === 'NEW_TAB_POPOVER_REMOVE') {
    messageTo(page, 'NEW_TAB_POPOVER_REMOVE', {});
  } else if (messageName === 'GET_SNIPPET') {
    const { documents } = userInfo;
    lksGetSnippets(documents)
      .then((snippet) => {
        messageTo(page, 'GET_SNIPPET', {
          snippet,
        });
      })
      .catch(() => {
        messageTo(page, 'SNIPPET_ERROR', {});
      });
  } else if (messageName === 'GET_MORE_PBL_USERS') {
    const { url, lastCursor } = userInfo;
    postPblPageHighlightUsers(url, lastCursor).then((pblHighlightUsers) => {
      messageTo(page, 'GET_MORE_PBL_USERS', {
        pblHighlightUsers,
      });
    });
  } else if (messageName === 'GET_USER_HIGHLIGHT_OPEN_STATE') {
    getUserHighlightOpenState().then(({ openState, forcePublicApplied }) => {
      userOpenState = openState;

      messageTo(page, 'GET_USER_HIGHLIGHT_OPEN_STATE', {
        openState,
        forcePublicApplied,
      });

      if (!forcePublicApplied) return;

      const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};
      const forcePublicDatetime = modalHandler['openState']?.forcePublicDatetime;
      if (!forcePublicDatetime) return;

      const isTwoWeeksPassed =
        new Date().getTime() - JSON.parse(forcePublicDatetime) > 1000 * 60 * 60 * 24 * 14;
      if (!isTwoWeeksPassed) return;

      messageTo(page, 'CHECK_MODAL_HANDLER', {
        name: 'openState',
      });
    });
  } else if (messageName === 'POST_USER_HIGHLIGHT_OPEN_STATE') {
    const { openState } = userInfo;
    userOpenState = openState;
    postUserHighlightOpenState(openState);
  } else if (messageName === 'INIT_GCS_CONFIG') {
    getExtensionConfigFromGCP((config) => {
      messageTo(page, 'INIT_GCS_CONFIG', config);
    });
  } else if (messageName === 'GET_ON_OFF_YOUTUBE_HIGHLIGHTER_CONFIG') {
    const getIsOff = (resetTime = '23:59') => {
      const offTime = Number(localStorage.getItem('youtube_highlighter_off_time')) || 0;

      if (offTime) {
        const [resetHourString, resetMinuteString] = resetTime.split(':');
        const [resetHour, resetMinute] = [
          Number(resetHourString) || 0,
          Number(resetMinuteString) || 0,
        ];
        const resetDate = new Date();
        resetDate.setHours(Number(resetHour), Number(resetMinute) + 1, 0, 0);
        return (
          new Date(Number(offTime)).getTime() > resetDate.getTime() ||
          new Date().getTime() < resetDate.getTime()
        );
      }

      return false;
    };

    getExtensionConfigFromGCP((json) => {
      const config = {
        cohortType: null,
        resetTime: '23:59',
        isOff: getIsOff('23:59'),
        isShownInfoModal: !!JSON.parse(
          localStorage.getItem('is_shown_youtube_highlighter_onoff_info_modal') || null,
        ),
      };

      const { youtube_highlighter_onoff } = json;
      const close_conditions = youtube_highlighter_onoff?.close_conditions;
      const excluded_country = close_conditions?.excluded_country;

      const { countryCode } = geoLocationHandler;

      if (youtube_highlighter_onoff && !excluded_country?.includes(countryCode)) {
        const { open_conditions, reset_time } = youtube_highlighter_onoff;
        config.resetTime = reset_time;
        config.isOff = getIsOff(reset_time);

        Object.keys(open_conditions).some((cohort) => {
          const { last_number_of_user_id, user_id } = open_conditions[cohort];
          const isCohortUser =
            last_number_of_user_id.includes(Number(user?.id.slice(-1))) ||
            user_id.includes(user?.id);

          if (isCohortUser) {
            config.cohortType = cohort;
          }

          return isCohortUser;
        });
      }

      messageTo(page, 'GET_ON_OFF_YOUTUBE_HIGHLIGHTER_CONFIG', { config });
    });
  } else if (messageName === 'POST_YOUTUBE_HIGHLIGHTER_OFF') {
    localStorage.setItem('youtube_highlighter_off_time', userInfo?.time);
  } else if (messageName === 'POST_YOUTUBE_HIGHLIGHTER_ON') {
    localStorage.removeItem('youtube_highlighter_off_time');
  } else if (messageName === 'POST_VIEW_YOUTUBE_HIGHLIGHTER_ONOFF_INFO_MODAL') {
    localStorage.setItem('is_shown_youtube_highlighter_onoff_info_modal', 'true');
  } else if (messageName === 'GRANT_PREMIUM_REWARD') {
    const rewardGrantedDate = JSON.stringify(new Date().getTime());
    localStorage.setItem('latest_reward_granted_date', rewardGrantedDate);

    user.premium = 1;

    browser.tabs.query({}, function (tabs) {
      tabs.forEach((page) => {
        messageTo(page, 'GRANT_PREMIUM_REWARD', {});
      });
    });
  } else if (messageName === 'EMBEDDED_YOUTUBE') {
    const { context } = userInfo;
    messageTo(page, 'EMBEDDED_YOUTUBE', {
      context,
    });
  } else if (messageName === 'EMBEDDED_YOUTUBE_AUTH') {
    messageTo(page, 'EMBEDDED_YOUTUBE_AUTH', {});
  } else if (messageName === 'POST_USER_PAGE_SAVED') {
    const { pageUrl, area } = userInfo;
    postUserPageSaved({ pageUrl }).then((response) => {
      messageTo(page, 'POST_USER_PAGE_SAVED', {
        area,
        response,
      });
    });
  } else if (messageName === 'POST_USER_PAGES_SAVED') {
    const { pageUrls, datasets, area } = userInfo;
    postUserPagesSaved(pageUrls).then((savedPages) => {
      messageTo(page, 'POST_USER_PAGES_SAVED', {
        savedPages,
        datasets,
        area,
      });
    });
  } else if (messageName === 'GET_USER_FOLDERS') {
    const { area, context, datasetObj } = userInfo;
    getUserFolders().then((folders) => {
      messageTo(page, 'GET_USER_FOLDERS', {
        area,
        context,
        folders,
        datasetObj,
      });
    });
  } else if (messageName === 'POST_FOLDER') {
    const { folderName, folderEmoji, dataset } = userInfo;
    postFolder(folderName, folderEmoji).then((folder) => {
      messageTo(page, 'POST_FOLDER', {
        folder,
        dataset,
      });

      if (folder.name) {
        if (dataset.areaType === 'be_extension_popup_box') {
          messageTo(page, 'POPOVER_NEW_FOLDER_ITEM', {
            folder,
          });
        }

        putSavedPageFolder(dataset.savedPageId, folder.id);
      }
    });
  } else if (messageName === 'DELETE_USER_SAVED_PAGE') {
    const { savedPageId, highlightUrl, dataset, relatedTarget } = userInfo;
    delete highlightedPages[getURLWithoutHash(highlightUrl)];
    deleteUserSavedPage(savedPageId).then(() => {
      messageTo(page, 'DELETE_USER_SAVED_PAGE', { dataset, relatedTarget, highlightUrl });
    });
  } else if (messageName === 'GOOGLE_DELETE_USER_SAVED_PAGE') {
    const { savedPageId, dataset } = userInfo;
    deleteUserSavedPage(savedPageId).then(() => {
      messageTo(page, 'GOOGLE_DELETE_USER_SAVED_PAGE', { dataset });
    });
  } else if (messageName === 'PUT_SAVED_PAGE_FOLDER') {
    const { savedPageId, folderId, folderName, folderEmoji, area, areaType, urlDomain, index } =
      userInfo;
    putSavedPageFolder(savedPageId, folderId).then(() => {
      messageTo(page, 'PUT_SAVED_PAGE_FOLDER', {
        folderId,
        folderName,
        folderEmoji,
        area,
        areaType,
        urlDomain,
        index,
      });
    });
  } else if (messageName === 'POST_PAGES') {
    let {
      url: bookmarkUrl,
      title,
      image,
      favicon,
      area,
      index,
      relatedTarget,
      amplitude_properties,
    } = userInfo;

    postFetchPages(bookmarkUrl, title, image, favicon, 'W10=').then((res) => {
      if (res.ok) {
        highlightedPages[getURLWithoutHash(bookmarkUrl)] = {
          page_id: res['pageId'],
          tags: [],
          style_items: 'W10=',
          share_id: res['shareId'],
          comments: [],
          new_highlights: [],
        };
      }

      const { status, reason, scrapCount, activeDayCount } = res.savedPage;
      handleSaveWebPageEvent(status, reason, {
        ...amplitude_properties,
        active_page_count: scrapCount,
        active_day_count: activeDayCount,
      });

      messageTo(page, 'POST_PAGES', {
        savedPage: res.savedPage,
        area,
        index,
        url: bookmarkUrl,
        relatedTarget,
      });

      incrementAmplitudeUserProperty('scrap_count', 1);
    });
  } else if (messageName === 'LOCAL_SIGNUP') {
    const { email, name, passwd } = userInfo;
    postLocalSignup(email, name, passwd).then((signupResult) => {
      if (!signupResult) {
        messageTo(page, 'LOCAL_SIGNUP_ERROR', {
          type: 'duplicateEmail',
        });
        return;
      }
      const { status: signupResultStatus } = signupResult;
      if (signupResultStatus === 'success') {
        postAuthLocal(email, passwd, (signinResult) => {
          const { status: signinResultStatus } = signinResult;
          if (signinResultStatus === 'success') {
            chrome.tabs.reload(page.id);
            resetVariables();
          }
        });
      }
    });
  } else if (messageName === 'LOCAL_SIGNIN') {
    const { email, passwd } = userInfo;

    postAuthLocal(email, passwd, (signinResult) => {
      const signinStatus = signinResult?.status;
      if (signinStatus === 'success') {
        chrome.tabs.reload(page.id);
        resetVariables();
      } else {
        messageTo(page, 'LOCAL_SIGNIN_ERROR', {
          type: 'wrongInfo',
        });
      }
    });
  } else if (messageName === 'GET_FAVICONS') {
    const { domains, datasets } = userInfo;

    const getFaviconPromises = (domains) =>
      domains.map((domain) => {
        try {
          return getFavicon(domain, 256);
        } catch {
          return Promise.resolve();
        }
      });

    const faviconPromises = getFaviconPromises(domains);
    Promise.allSettled(faviconPromises).then((results) => {
      const faviconURLs = results.map((result) => {
        if (result.status === 'fulfilled') return result.value.url;

        return null;
      });

      messageTo(page, 'GET_FAVICONS', { faviconURLs, datasets });
    });
  } else if (messageName === 'GET_TREND_KEYWORD_RANK') {
    lksGetTrendKeywordRank(geoLocationHandler.countryCode || 'US').then((trendRankData) => {
      const {
        google_items: { region },
      } = trendRankData;

      messageTo(page, 'GET_TREND_KEYWORD_RANK', {
        ...trendRankData,
        isGlobalRank: region !== geoLocationHandler.countryCode,
        countryName: geoLocationHandler.countryName,
        isLoggedIn: isLoggedIn(),
      });
    });
  } else if (messageName === 'GET_AND_POST_SAVED_PAGE') {
    const { url, favicon, amplitude_properties } = userInfo;
    getPageByUrl(url).then((getPageByUrlRes) => {
      const { bookmarkUrl, title, image, status } = getPageByUrlRes;
      if (status >= 400) {
        messageTo(page, 'GET_AND_POST_SAVED_PAGE', {
          status,
          ...userInfo,
        });
      } else {
        postFetchPages(bookmarkUrl, title, image, favicon, 'W10=').then((res) => {
          if (res.ok) {
            highlightedPages[getURLWithoutHash(bookmarkUrl)] = {
              page_id: res['pageId'],
              tags: [],
              style_items: 'W10=',
              share_id: res['shareId'],
              comments: [],
              new_highlights: [],
            };
          }

          const { status, reason, scrapCount, activeDayCount } = res.savedPage;
          handleSaveWebPageEvent(status, reason, {
            ...amplitude_properties,
            active_page_count: scrapCount,
            active_day_count: activeDayCount,
          });

          messageTo(page, 'GET_AND_POST_SAVED_PAGE', {
            status,
            ...userInfo,
            savedPage: res.savedPage,
          });

          incrementAmplitudeUserProperty('scrap_count', 1);
        });
      }
    });
  } else if (messageName === 'GET_WEB_MESSAGE') {
    messageTo(page, 'GET_WEB_MESSAGE', {
      checkIsNewTabOn: newTabHandler.checkIsNewTabOn(),
      LINERVersion: linerExtensionVersion,
    });
  } else if (messageName === 'POST_WEB_MESSAGE') {
    const { isSwitchOn } = userInfo;
    if (isSwitchOn) {
      newTabHandler.turnOnNewTab();
    } else {
      newTabHandler.turnOffNewTab();
    }
  } else if (messageName === 'POST_SAVED_PAGE_REMIND') {
    const { savedPageId, relatedTarget, area } = userInfo;
    postSavedPageRemindMe(savedPageId).then((res) => {
      messageTo(page, 'POST_SAVED_PAGE_REMIND', {
        status: res.status,
        savedPageId,
        relatedTarget,
        area,
      });
    });
  } else if (messageName === 'DELETE_SAVED_PAGE_REMIND') {
    const { savedPageId, relatedTarget, area } = userInfo;
    deleteSavedPageRemindMe(savedPageId).then((res) => {
      messageTo(page, 'DELETE_SAVED_PAGE_REMIND', {
        status: res.status,
        savedPageId,
        relatedTarget,
        area,
      });
    });
  }

  if (messageName === 'SHOW_POPOVER') {
    // Luke - general events
    showPopover(page, `isTriggeredByHighlight=${userInfo['is_triggered_by_highlight'] === true}`);
    return;
  } else if (messageName === 'SHOW_HIGHLIGHT_STREAK_POPOVER') {
    if (checkIsHighlightStreakCohort()) showHighlightStreakPopover(page);
    return;
  } else if (messageName === 'CLOSE_POPOVER') {
    hidePopover(page);
    const doNotOpen = userInfo['do_not_show_popover'];
    if (doNotOpen !== undefined) {
      messageTo(page, 'DO_NOT_SHOW_POPOVER', {});
    }
    return;
  } else if (messageName === 'TOGGLE_ADVANCED_SEARCH') {
    // celina (settings-1)
    const doNotShowAdvancedSearch = userInfo['do_not_show_advaned_search'];
    saveDoNotShowAdvancedSearch(doNotShowAdvancedSearch);

    messageTo(page, 'TOGGLE_ADVANCED_SEARCH', {
      do_not_show_advaned_search: doNotShowAdvancedSearch,
    });
    return;
  } else if (messageName === 'TOGGLE_RUN_PAGE') {
    // celina (settings-3)
    const doNotRunPage = userInfo['set_run_page'];
    const url = userInfo['url'];
    saveDoNotRunPage(url, doNotRunPage);
    if (doNotRunPage === true) {
      setToolbarItem(page, localize('LINER'), 'saved');
    } else {
      setToolbarItem(page, localize('LINER is blocked on this website'), 'blocked');
    }
    messageTo(page, 'TOGGLE_RUN_PAGE', {
      set_run_page: doNotRunPage,
    });
    return;
  } else if (messageName === 'TOGGLE_RUN_SITE') {
    // celina (settings-4)
    const doNotRunSite = userInfo['set_run_site'];
    const url = userInfo['url'];
    saveDoNotRunSite(url, doNotRunSite);
    if (doNotRunSite === true) {
      setToolbarItem(page, localize('LINER'), 'saved');
    } else {
      setToolbarItem(page, localize('LINER is blocked on this website'), 'blocked');
    }
    messageTo(page, 'TOGGLE_RUN_SITE', {
      set_run_page: doNotRunSite,
    });
    return;
  } else if (messageName === 'NEW_TAB') {
    const { isOpenLinerNewTab = false, url = '' } = userInfo;
    if (isOpenLinerNewTab) {
      openTab('../newTab/index.html', () => {});
    } else {
      openTab(url, () => {});
    }
    return;
  } else if (messageName === 'NEW_TAB_WHILE_IN_CURRENT_TAB') {
    const { isOpenLinerNewTab = false, url = '' } = userInfo;
    if (isOpenLinerNewTab) {
      openTabWhileInCurrentTab('../newTab/index.html', () => {});
    } else {
      openTabWhileInCurrentTab(url, () => {});
    }
    return;
  } else if (messageName === 'LOGIN') {
    const cookie = userInfo['cookie'];
    if (cookie !== undefined) {
      // Luke - Chrome, Firefox, Whale은 자동으로 로그인되므로 loginWithSIDCookie는 하지 않아도 됨.
      // Luke - 하지만 user object가 세팅되어야 하기 때문에 getUser를 포함한 resetVariables는 해주어야 함
      resetVariables();
    } else {
      loginViewType = userInfo['type'];
    }
    return;
  } else if (messageName === 'CHANGE_TOOLBAR_ITEM') {
    const type = userInfo['type'] ?? 'enabled';
    if (type === 'enabled') {
      delete disabledTabIDs[page.id];
      setToolbarItem(page, localize('LINER'), 'saved');
    } else {
      disabledTabIDs[page.id] = true;
      setToolbarItem(
        page,
        userInfo['is_web_pdf']
          ? localize("Can't open LINER pop-up on the PDF file.")
          : localize('LINER is blocked on this website'),
        'blocked',
      );
    }
    return;
  } else if (messageName === 'ALERT') {
    alert(userInfo['alert_message']);
  } else if (messageName === 'CLOSE_TAB') {
    browser.tabs.remove(page.id);
  } else if (messageName === 'ALERT_NETWORK_ERROR') {
    alert(localize('No network connection. Changes were not saved.'));
    return;
  } else if (messageName === 'BRAZE_EVENT') {
    const eventName = userInfo['name'];
    if (eventName) {
      messageTo(page, 'BRAZE_EVENT', {
        event_name: eventName,
      });
    }
    return;
  } else if (messageName == 'SAVE_SHARING_CONTENT') {
    sharingContent = userInfo['content'] || '';
    return;
  } else if (messageName == 'GET_SHARING_CONTENT') {
    messageTo(page, 'GET_SHARING_CONTENT', {
      content: sharingContent,
    });
    return;
  } else if (messageName == 'COPY_TO_CLIPBOARD') {
    copyToClipBoard(userInfo['content']);
    return;
  } else if (messageName == 'CACHE_SHARE_PAGE') {
    getSharePage(userInfo['share_id']);
    return;
  } else if (messageName === 'GET_DO_SHOW_KAKAOTALK') {
    var doShowKakaoTalk = false;
    try {
      for (var i = 0; i < navigator.languages.length; i++) {
        if (
          navigator.languages[i].toLowerCase().indexOf('ko') != -1 ||
          navigator.languages[i].toLowerCase().indexOf('kr') != -1
        ) {
          doShowKakaoTalk = true;
          break;
        }
      }
    } catch (e) {}
    messageTo(page, 'SET_DO_SHOW_KAKAOTALK', {
      do_show_kakaotalk: doShowKakaoTalk,
    });
    return;
  } else if (messageName === 'INIT_FOLDER_DROPDOWN_POPOVER') {
    const currentUrl = page.url
      .split('?openLinerExtension')[0]
      .split('&openLinerExtension')[0]
      .split('&t=')[0];

    Promise.all([postUserPageSaved({ pageUrl: currentUrl }), getUserFolders()]).then(
      ([pageSavedRes, foldersRes]) => {
        messageTo(page, 'INIT_FOLDER_DROPDOWN_POPOVER', {
          savedPage: pageSavedRes.ok ? pageSavedRes.savedPage : {},
          folders: foldersRes,
        });
      },
    );
  } else if (messageName === 'SHOW_FOLDER_DROPDOWN_POPOVER') {
    messageTo(page, 'SHOW_FOLDER_DROPDOWN_POPOVER', {});
  } else if (messageName === 'CLOSE_FOLDER_DROPDOWN_POPOVER') {
    messageTo(page, 'CLOSE_FOLDER_DROPDOWN_POPOVER', {});
  } else if (messageName === 'PUT_CUR_PAGE_FOLDER_ID') {
    const { savedPageId, folderId, folderName, curFolderId, folderEmoji } = userInfo;
    putSavedPageFolder(savedPageId, folderId);
    messageTo(page, 'PUT_CUR_PAGE_FOLDER_ID', {
      folderName,
      folderEmoji,
    });
    messageTo(page, 'PUT_SAVED_PAGE_FOLDER', {
      folderName,
      folderEmoji,
      areaType: 'be_extension_popup_box',
      urlDomain: new URL(page.url).hostname,
    });
    const eventName =
      curFolderId === -1 ? 'complete_add_folder_my_page' : 'complete_edit_folder_my_page';

    const originPageURL = new URL(page.url);
    sendAmplitudeData(eventName, {
      urlDomain: originPageURL.hostname,
      area_type: 'be_extension_popup_box',
      content_type:
        originPageURL.href.split('.pdf').length > 1 && originPageURL.href.split('.pdf')[1] === ''
          ? 'pdf'
          : 'web_page',
    });
  } else if (messageName === 'SHOW_ADD_FOLDER_MODAL') {
    const { savedPageId, curFolderId } = userInfo;
    messageTo(page, 'SHOW_ADD_FOLDER_MODAL', { savedPageId, curFolderId });
  }

  browser.tabs.get(page.id, function (pageWithProperties) {
    // Luke - 이렇게 page를 업데이트해주지 않으면 이유는 모르겠으나 page.title이 page.url로 뽑혀서 나옴. browser 객체의 버그인듯
    page = pageWithProperties;
    let title = page.title ?? 'No Title';
    let url = page.url;

    if (url !== undefined) {
      url = url.split('?openLinerExtension')[0].split('&openLinerExtension')[0].split('&t=')[0];
      if (url.includes('www.youtube.com')) {
        if (title.indexOf('(') === 0) {
          title = title.substring(title.indexOf(')') + 1, title.length).trim();
        }
      }

      const pageInfo = highlightedPages[getURLWithoutHash(url)];
      let pageID;
      if (pageInfo) {
        pageID = pageInfo['page_id'];
      }
      logger('pageID - ' + pageID);

      if (messageName == 'GA_PAGEVIEW') {
        if (userInfo['path']) {
          var browserName = getBrowserName();
          var capitalName = browserName.charAt(0).toUpperCase() + browserName.slice(1);
          getGAPageView(user['id'], 'LINER ' + capitalName + ' Extension', userInfo['path']);
        } else {
          getGAPageView(user['id'], title, '/?url=' + getURLWithoutHash(url));
        }
      } else if (messageName == 'GA_EVENT') {
        var category = userInfo['category'] || '';
        var action = userInfo['action'] || '';
        var label = userInfo['label'] || '';
        getGAEvent(user['id'], category, action, label);
      } else if (messageName === 'GA_PAGEVIEW_RECOMMENDATION') {
        if (userInfo['path']) {
          var browserName = getBrowserName();
          var capitalName = browserName.charAt(0).toUpperCase() + browserName.slice(1);
          getGARecommendationPageView(
            user['id'],
            'LINER ' + capitalName + ' Extension',
            userInfo['path'],
          );
        } else {
          getGARecommendationPageView(user['id'], title, '/?url=' + getURLWithoutHash(url));
        }
      } else if (messageName === 'GA_EVENT_RECOMMENDATION') {
        var category = userInfo['category'] || '';
        var action = userInfo['action'] || '';
        var label = userInfo['label'] || '';
        getGARecommendationEvent(user['id'], category, action, label);
      } else if (messageName === 'BOOKMARK') {
        let {
          title,
          url: bookmarkUrl,
          index,
          document,
          bookmarkType,
          amplitude_properties,
        } = userInfo;
        if (title !== undefined && bookmarkUrl !== undefined) {
          bookmarkUrl = bookmarkUrl
            .split('?openLinerExtension')[0]
            .split('&openLinerExtension')[0]
            .split('&t=')[0];
          postRecommendationReact(bookmarkUrl, +user?.id ?? 0, 'scrap').then(console.log);
          const todayDateTime = getDateString(new Date());
          postPages(
            title,
            bookmarkUrl,
            '',
            'W10=',
            navigator.language,
            todayDateTime,
            function (json) {
              if (json['status'] == 'success') {
                highlightedPages[getURLWithoutHash(bookmarkUrl)] = {
                  page_id: json['pageId'],
                  tags: [],
                  style_items: 'W10=',
                  share_id: json['shareId'],
                  comments: [],
                  new_highlights: [],
                };
              }

              const { status, reason, scrapCount, activeDayCount } = json;
              handleSaveWebPageEvent(status, reason, {
                ...amplitude_properties,
                active_page_count: scrapCount,
                active_day_count: activeDayCount,
              });

              messageTo(page, 'BOOKMARK_SERVER_RESPONSE', {
                page_id: json['pageId'],
                index,
                url: bookmarkUrl,
                bookmarkType,
              });

              lksDocCreate(+user?.id ?? 0, document, null, null, () => {});

              incrementAmplitudeUserProperty('scrap_count', 1);
            },
          );
        }
      } else if (messageName === 'CANCEL_BOOKMARK') {
        const { index, page_id, bookmarkType } = userInfo;
        putPage([page_id], 0, 2, function (json) {
          messageTo(page, 'CANCEL_BOOKMARK_SERVER_RESPONSE', {
            index,
            bookmarkType,
          });
        });
      } else if (messageName == 'UPDATE_PAGE_HIGHLIGHT') {
        const { url } = userInfo;
        updatePageHighlights(getURLWithoutHash(url), page, undefined, {
          context: 'DELETE_THREAD',
        });
      } else if (messageName == 'UPDATE_STYLE') {
        const {
          style_items: styleItems = 'W10=',
          highlight_url: highlightUrl = getUrlForHighlightInfo(url),
          is_creating_highlight: isCreatingHighlight,
          is_image_highlight: isImageHighlight,
          amplitude_properties: amplitudeProperties,
          snapshot,
          styleId,
          isShowingPopover,
          isShowingHighlightStreakPopover,
        } = userInfo;

        const pageInfo = highlightedPages[getURLWithoutHash(highlightUrl)];
        const pageId = pageInfo?.page_id;
        if (pageId) {
          // Luke - 저장 된 페이지이므로 업데이트하기
          postPagesPageID(pageId, styleItems, (json) => {
            const { status, reason } = json;
            if (isImageHighlight) {
              messageTo(page, 'UPDATE_STYLE_IMAGE_HIGHLIGHT', {
                status,
                reason,
                imageUrl: userInfo.image_highlight_url,
                imageId: userInfo.image_id,
                imageHighlight: userInfo.image_highlight,
                isCreatingHighlight,
              });
            }

            if (isShowingPopover) showPopover(page, 'isTriggeredByHighlight=true');
            if (isShowingHighlightStreakPopover && checkIsHighlightStreakCohort())
              showHighlightStreakPopover(page);

            if (!isLoggedIn()) {
              logoutToLinerWhenNotAuthed(json);
              return;
            }

            if (status == 'success') {
              highlightedPages[getURLWithoutHash(highlightUrl)]['style_items'] = styleItems;
              updatePageHighlights(getURLWithoutHash(highlightUrl), page, isCreatingHighlight, {
                highlightVar: highlightedPages[getURLWithoutHash(highlightUrl)],
                imageUrl: userInfo.image_highlight_url,
                imageId: userInfo.image_id,
                imageHighlight: userInfo.image_highlight,
                context: isCreatingHighlight ? 'SAVE_HIGHLIGHT' : 'REMOVE_HIGHLIGHT',
              });

              if (!snapshot) return;

              const snapshotDecoded = deserialize(snapshot);
              savedPageHighlightSnapshot(pageId, styleId, snapshotDecoded);
            }
          });
        } else {
          // Luke - 저장이 안된 페이지이므로 저장하기
          const imageURL = userInfo.image_url ?? '';
          const todayDateTime = getDateString(new Date());
          postPages(
            title,
            getURLWithoutHash(highlightUrl),
            imageURL,
            styleItems,
            navigator.language,
            todayDateTime,
            (json) => {
              const { status, reason, scrapCount, activeDayCount } = json;
              if (isImageHighlight) {
                messageTo(page, 'UPDATE_STYLE_IMAGE_HIGHLIGHT', {
                  status,
                  reason,
                  imageUrl: userInfo.image_highlight_url,
                  imageId: userInfo.image_id,
                  imageHighlight: userInfo.image_highlight,
                  isCreatingHighlight,
                });
              }

              if (isShowingPopover) showPopover(page, 'isTriggeredByHighlight=true');
              if (isShowingHighlightStreakPopover && checkIsHighlightStreakCohort())
                showHighlightStreakPopover(page);

              handleSaveWebPageEvent(status, reason, {
                active_page_count: scrapCount,
                active_day_count: activeDayCount,
                ...amplitudeProperties,
              });

              if (!isLoggedIn()) {
                logoutToLinerWhenNotAuthed(json);
                return;
              }

              if (status === 'success') {
                const { pageId, newPageId, shareId, savedPageId } = json;

                highlightedPages[getURLWithoutHash(highlightUrl)] = {
                  page_id: pageId,
                  new_page_id: newPageId,
                  tags: [],
                  style_items: styleItems,
                  share_id: shareId,
                  comments: [],
                  new_highlights: [],
                  highlight_url: getURLWithoutHash(highlightUrl),
                };

                messageTo(page, 'PAGE_INFO_WITHOUT_HIGHLIGHT_IMPORT', {
                  ...highlightedPages[getURLWithoutHash(highlightUrl)],
                  imageUrl: userInfo.image_highlight_url,
                  imageId: userInfo.image_id,
                  imageHighlight: userInfo.image_highlight,
                });
                incrementAmplitudeUserProperty('scrap_count', 1);

                // 태그 박스 로직
                messageTo(page, 'PAGE_SAVED', {
                  user,
                  highlighted_pages: highlightedPages,
                  page,
                  is_eligible_for_manage_guide: isEligibleForGuide('manage'),
                  is_eligible_for_manage_tooltip_guide: isEligibleForGuide('manage_tooltip'),
                  do_not_show_advaned_search: getDoNotShowAdvancedSearch(),
                  doNotRunPage: getDoNotRunPage(),
                  doNotRunSite: getDoNotRunSite(),
                  savedPageId,
                });

                messageTo(page, 'UPDATE_YTB_SAVED_BTN', {
                  savedPage: json,
                });

                if (!snapshot) return;

                const snapshotDecoded = deserialize(snapshot);
                savedPageHighlightSnapshot(pageId, styleId, snapshotDecoded);
              }
            },
          );

          const { document, access_type: accessType, access_method: accessMethod } = userInfo;
          lksDocCreate(user.id, document, accessType, accessMethod, () => {});
        }
      } else if (messageName == 'UPDATE_HIGHLIGHT') {
        const {
          highlight_id: highlightId,
          slot_id: slotId,
          highlight_url: highlightUrl = getUrlForHighlightInfo(url),
        } = userInfo;

        const pageInfo = highlightedPages[getURLWithoutHash(highlightUrl)];
        const pageId = pageInfo?.page_id;
        if (!pageId || !highlightId) return;

        postPagesPageIDHighlightID(pageId, highlightId, slotId, () => {
          updatePageHighlights(getURLWithoutHash(highlightUrl), page, undefined, {
            imageId: highlightId,
            highlightVar: pageInfo,
            slotId,
            context: 'UPDATE_HIGHLIGHT_COLOR',
          });
        });
      } else if (messageName === 'SET_USER_PROFILE') {
        const { name, username, bio, userProfileImage } = userInfo;
        const isUserProfileImageChanged = !!userProfileImage;
        if (isUserProfileImageChanged) {
          const userProfileImageDeserialized = deserialize(userProfileImage);
          patchUserMeProfile(name, username, bio, function (result) {
            const isExistingUsername = result === 409;
            const isUnusableUsername = result === 422;
            if (isExistingUsername) {
              messageTo(page, 'SET_USER_PROFILE', {
                status: 'fail',
                cause: 'existing_username',
                photoUrl: null,
              });
            } else if (isUnusableUsername) {
              messageTo(page, 'SET_USER_PROFILE', {
                status: 'fail',
                cause: 'unusable_username',
                photoUrl: null,
              });
            } else {
              putUserMeProfilePhoto(userProfileImageDeserialized, function (json) {
                messageTo(page, 'SET_USER_PROFILE', {
                  status: 'success',
                  cause: null,
                  name,
                  username,
                  bio,
                  photoUrl: json.photoUrl,
                });
              });
            }
          });
        } else {
          patchUserMeProfile(name, username, bio, function (result) {
            const isExistingUsername = result === 409;
            const isUnusableUsername = result === 422;
            if (isExistingUsername) {
              messageTo(page, 'SET_USER_PROFILE', {
                status: 'fail',
                cause: 'existing_username',
                photoUrl: null,
              });
            } else if (isUnusableUsername) {
              messageTo(page, 'SET_USER_PROFILE', {
                status: 'fail',
                cause: 'unusable_username',
                photoUrl: null,
              });
            } else {
              messageTo(page, 'SET_USER_PROFILE', {
                status: 'success',
                cause: null,
                name,
                username,
                bio,
                photoUrl: null,
              });
            }
          });
        }
      } else if (messageName === 'VISIT_SERP') {
        const { currentSERP } = userInfo;
        const isTimeElapsed = checkLatestTimeMarkForSERP(currentSERP, 60 * 24);
        if (isTimeElapsed) {
          messageTo(page, 'VISIT_SERP', {
            currentSERP,
          });
        }
      } else if (messageName === 'VISIT_PAGE') {
        const pageName = userInfo['page_name'] ?? '';
        const isTimeElapsed = checkLatestTimeMarkForPageElapsed(pageName, 60 * 24);
        if (isTimeElapsed) {
          messageTo(page, 'VISIT_PAGE', {
            page_name: pageName,
          });
        }
      } else if (messageName === 'DOCUMENT_READY') {
        clearPreviousVersionModalHandlerLegacy();
        const originalUrl = url;
        const lastHost = new URL(originalUrl).hostname;
        setUninstallUrl(lastHost);

        const logTimeProperties = {
          url: originalUrl,
          url_domain: lastHost,
        };

        logTimeMark(logTimeProperties);
        getGeoLocationInfo();

        if (isLoggedIn()) {
          if (window.logBrazeEventIntall) {
            window.logBrazeEventIntall = false;
            messageTo(page, 'BRAZE_EVENT', {
              event_name: 'install_liner_be',
            });
          }
          // 페이지 로딩 시, 테마 정보 불러오고 그 때 로그아웃 체크
          Promise.all([getUserHighlightThemeCurrent(), getUserSlots()])
            .then(([themeCurrent, userSlots]) => {
              const { status } = themeCurrent;
              if (status === 'success') {
                messageTo(page, 'GET_CURRENT_THEME', themeCurrent);
                messageTo(page, 'GET_SLOT_INFO', userSlots);
              }
              logoutToLinerWhenNotAuthed(themeCurrent);
            })
            .catch(console.error);
        } else {
          messageTo(page, 'USE_DEFAULT_COLOR_SETS', {});
        }

        let linerPage = recommendedByLiner[url];
        let doHavePhraseData = linerPage !== undefined;
        if (doHavePhraseData === true) {
          messageTo(page, 'HANDLE_RECOMMENDATION_INFO', {
            source_type: linerPage['source_type'],
            is_from_serp: linerPage['is_from_serp'] ?? false,
            phrases: linerPage['phrases'],
            show_scroll_point_guide:
              JSON.parse(localStorage.getItem('show_scroll_point_guide')) ?? true,
            isBlockPopularHighlightCohort: checkIsBlockPopularHighlightCohort(),
          });
          recommendedByLiner[url]['is_from_serp'] = false;
        } else {
          lksGetDocument(url, 7, user.id ?? null, function (json) {
            const document = json;
            if (document.req_url !== undefined) {
              recommendedByLiner[document.req_url] = {
                source_type: 'picked_by_liner',
                phrases: document.phrases,
                is_from_serp: false,
              };
            }

            linerPage = recommendedByLiner[url];
            doHavePhraseData = linerPage !== undefined;
            if (doHavePhraseData === true) {
              messageTo(page, 'HANDLE_RECOMMENDATION_INFO', {
                source_type: linerPage['source_type'],
                is_from_serp: linerPage['is_from_serp'] ?? false,
                phrases: linerPage['phrases'],
                show_scroll_point_guide:
                  JSON.parse(localStorage.getItem('show_scroll_point_guide')) ?? true,
                isBlockPopularHighlightCohort: checkIsBlockPopularHighlightCohort(),
              });
              recommendedByLiner[url]['is_from_serp'] = false;
            }
          });
        }

        const {
          open_liner_extension: openLinerExtension,
          highlight_url: highlightUrl = getUrlForHighlightInfo(url),
        } = userInfo;

        postPagesInfos(null, highlightUrl, 0, (json) => {
          const { status } = json;
          if (status === 'success') {
            // Luke - 이전에 저장/하이라이팅 한 페이지
            const { id: userId } = user;
            getGAEvent(userId, 'visit', 'highlighted', getURLWithoutHash(highlightUrl));

            const { item = {} } = json;
            const { pageId, tags, styleItems, shareId, lastUpdateTime } = item;

            highlightedPages[getURLWithoutHash(highlightUrl)] = {
              page_id: pageId,
              tags,
              style_items: styleItems,
              share_id: shareId,
              last_update_time: lastUpdateTime,
              comments: [],
              new_highlights: [],
            };

            const { pageId: savedPageId } = item;
            const isYoutubeWatchPage = highlightUrl.includes('www.youtube.com/watch');
            if (isYoutubeWatchPage && checkIsYoutubeSidebarCohort()) {
              // 일단 설치 시 모든 페이지에 뜨지는 않게 한다.
              // 새 페이지 로딩 시에만 뜨도록 한다.
              getSavedPageCommunity(savedPageId).then((res) => {
                messageTo(page, 'FETCH_HIGHLIGHT_SIDEBAR', { ...res, url: highlightUrl });
              });
            }

            const highlightVar = highlightedPages[getURLWithoutHash(item['url'])];
            messageTo(page, 'PAGE_INFO', {
              highlightVar,
              highlightUrl,
              isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
            });

            messageTo(page, 'DOCUMENT_READY', {
              open_liner_extension: openLinerExtension ?? false,
              clicked_page: lksClickedPages[removeTrailingSlash(highlightUrl)],
            });

            updatePageHighlights(getURLWithoutHash(highlightUrl), page, undefined, {
              highlightVar,
              context: 'DOCUMENT_READY',
            });
          } else {
            // Luke - 이전에 저장/하이라이팅 하지 않은 페이지
            delete highlightedPages[getURLWithoutHash(highlightUrl)];

            const { id: userId } = user;
            getGAEvent(userId, 'visit', 'not_highlighted', getURLWithoutHash(highlightUrl));

            updatePageHighlights(getURLWithoutHash(highlightUrl), page, undefined, {
              context: 'DOCUMENT_READY',
            });

            messageTo(page, 'PAGE_INFO', {
              highlightUrl,
              isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
            });

            messageTo(page, 'DOCUMENT_READY', {
              open_liner_extension: openLinerExtension ?? false,
              clicked_page: lksClickedPages[removeTrailingSlash(highlightUrl)],
            });
          }

          delete lksClickedPages[removeTrailingSlash(highlightUrl)];
        });

        messageTo(page, 'ELIGIBLE_GUIDE_INFO', {
          highlight: isEligibleForGuide('highlight'),
          manage: isEligibleForGuide('manage'),
          manage_tooltip: isEligibleForGuide('manage_tooltip'),
          google_search: isEligibleForGuide('google_search'),
        });

        removeLatestECCloseDate();
      } else if (messageName === 'SET_GUIDE_FINISH') {
        const guideType = userInfo['guide_type'];
        if (guideType !== undefined) {
          setGuideFinish(guideType);
        }

        browser.tabs.query({}, function (tabs) {
          tabs.forEach((page) => {
            messageTo(page, 'ELIGIBLE_GUIDE_INFO', {
              highlight: isEligibleForGuide('highlight'),
              manage: isEligibleForGuide('manage'),
              manage_tooltip: isEligibleForGuide('manage_tooltip'),
              google_search: isEligibleForGuide('google_search'),
            });
          });
        });
      } else if (messageName === 'SET_GUIDE_LAST_SEEN_TIMESTAMP') {
        const guideType = userInfo['guide_type'];
        if (guideType !== undefined) {
          setGuideLastSeenTimestamp(guideType);
        }
      } else if (messageName === 'SHOW_MANAGE_GUIDE_TOOLTIP') {
        messageTo(page, 'SHOW_MANAGE_GUIDE_TOOLTIP', {});
      } else if (messageName === 'MORE_LIKE_THIS_AVAILABLE') {
        if (checkIsBlockExpandYourReadingCohort()) return;

        const { url, text } = userInfo;
        const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};
        const isMoreLikeThisShown = modalHandler['moreLikeThisNudge']?.isShown ?? false;

        postRecommendationValidate(url, text).then((res) => {
          messageTo(page, 'MORE_LIKE_THIS_AVAILABLE', {
            ...res,
            is_more_like_this_shown: isMoreLikeThisShown,
          });
        });
      } else if (messageName === 'MORE_LIKE_THIS_LIST') {
        const { url, title, text, anchor } = userInfo;
        postRecommendationDocumentByText(url, +user?.id ?? 0, title, text, anchor).then((res) => {
          messageTo(page, 'MORE_LIKE_THIS_LIST', res);
        });
      } else if (messageName === 'MORE_LIKE_THIS_ROLLING_LIST') {
        const { url, title, text, anchor } = userInfo;
        postRecommendationDocumentByText(url, +user?.id ?? 0, title, text, anchor).then((res) => {
          messageTo(page, 'MORE_LIKE_THIS_ROLLING_LIST', res);
        });
      } else if (messageName === 'MORE_LIKE_THIS_DEACTIVATE') {
        postRecommendationDeactivate().then(() => {
          messageTo(page, 'MORE_LIKE_THIS_DEACTIVATE', {});
        });
      } else if (messageName === 'REACT_TO_RECOMMENDATION') {
        const { url, react_type } = userInfo;
        postRecommendationReact(url, +user?.id ?? 0, react_type).then(console.log);
      } else if (messageName === 'CHANGE_PAGE_OPEN_STATE') {
        const { savedPageId, prevOpenState, openState, url, urlDomain } = userInfo;
        putSavedPageOpenState(savedPageId, openState).then(() => {
          sendAmplitudeData('complete_edit_privacy_settings_my_thread', {
            content_type: 'video',
            type: 'sidebar',
            old_thread_privacy: prevOpenState,
            thread_privacy: openState,
            thread_url: `${URI.LINER}/for-you/community?savedPage=${savedPageId}`,
            url,
            url_domain: urlDomain,
          });
        });
      } else if (messageName === 'POST_GOOGLE_PAGE_REACTION') {
        const { pageUrl, reactionType } = userInfo;
        postPblPageReaction(pageUrl, reactionType).then(console.log);
      } else if (messageName === 'DELETE_GOOGLE_PAGE_REACTION') {
        const { pageUrl, reactionType } = userInfo;
        deletePblPageReaction(pageUrl, reactionType).then(console.log);
      } else if (messageName === 'POST_GOOGLE_PAGE_REACTION_USERS') {
        const { pageUrl, reactionType } = userInfo;
        postPblPageReactionUsers(pageUrl, reactionType).then((res) => {
          messageTo(page, 'POST_GOOGLE_PAGE_REACTION_USERS', res);
        });
      } else if (messageName === 'POST_GOOGLE_PAGE_MORE_REACTION_USERS') {
        const { pageUrl, reactionType, lastCursor } = userInfo;
        postPblPageMoreReactionUsers(pageUrl, reactionType, lastCursor).then((res) => {
          messageTo(page, 'POST_GOOGLE_PAGE_MORE_REACTION_USERS', res);
        });
      } else if (messageName === 'GET_NEXT_VIDEO') {
        const { videoId } = userInfo;
        getRecommendationVideoPublic(videoId).then((res) => {
          messageTo(page, 'GET_NEXT_VIDEO', res);
        });
      } else if (messageName === 'HANDLE_SAVE_WEB_PAGE_EVENT') {
        // 새 탭을 위한 이벤트 핸들러
        const { status, reason, amplitudeProperties } = userInfo;
        handleSaveWebPageEvent(status, reason, amplitudeProperties);
      } else if (messageName === 'SAVE_LKS_DOC_INFO_FOR_GOOGLE_DOC_CLICK') {
        const { lksDocument, url, clickType, accessType, accessMethod } = userInfo;
        lksClickedPages[url] = lksDocument;
        lksClickedPages[url].click_type = clickType;
        lksClickedPages[url].access_type = accessType;
        lksClickedPages[url].access_method = accessMethod;
      } else if (
        messageName === 'CREATE_HIGHLIGHT_SIDEBAR' ||
        messageName === 'REMOVE_HIGHLIGHT_SIDEBAR'
      ) {
        if (!checkIsYoutubeSidebarCohort()) return;

        const { styleId, styleItems, url, snapshot, amplitudeProperties } = userInfo;
        const pageInfo = highlightedPages[getURLWithoutHash(url)];
        const savedPageId = pageInfo?.page_id;
        if (savedPageId) {
          postPagesPageID(savedPageId, styleItems, (json) => {
            if (!isLoggedIn()) {
              logoutToLinerWhenNotAuthed(json);
              return;
            }

            const { status } = json;
            if (status === 'success') {
              highlightedPages[getURLWithoutHash(url)]['style_items'] = styleItems;

              if (messageName === 'REMOVE_HIGHLIGHT_SIDEBAR') return;

              const snapshotDecoded = deserialize(snapshot);
              savedPageHighlightSnapshot(savedPageId, styleId, snapshotDecoded).then(() => {
                getSavedPageCommunity(savedPageId).then((res) => {
                  messageTo(page, 'FETCH_HIGHLIGHT_SIDEBAR', { ...res, url });
                });
              });
            }
          });
        } else {
          const { image_url: imageUrl } = userInfo;
          const todayDateTime = getDateString(new Date());
          postPages(
            title,
            getURLWithoutHash(url),
            imageUrl || '',
            styleItems,
            navigator.language,
            todayDateTime,
            (json) => {
              const { status, reason, scrapCount, activeDayCount } = json;

              handleSaveWebPageEvent(status, reason, {
                active_page_count: scrapCount,
                active_day_count: activeDayCount,
                ...amplitudeProperties,
              });

              if (!isLoggedIn()) {
                logoutToLinerWhenNotAuthed(json);
                return;
              }

              if (status === 'success') {
                const { pageId, newPageId, shareId } = json;

                highlightedPages[getURLWithoutHash(url)] = {
                  page_id: pageId,
                  new_page_id: newPageId,
                  tags: [],
                  style_items: styleItems,
                  share_id: shareId,
                  comments: [],
                  new_highlights: [],
                  highlight_url: getURLWithoutHash(url),
                };

                incrementAmplitudeUserProperty('scrap_count', 1);

                if (messageName === 'REMOVE_HIGHLIGHT_SIDEBAR') return;

                putSavedPageOpenState(pageId, userOpenState);

                const snapshotDecoded = deserialize(snapshot);
                savedPageHighlightSnapshot(pageId, styleId, snapshotDecoded).then(() => {
                  getSavedPageCommunity(pageId).then((res) => {
                    messageTo(page, 'FETCH_HIGHLIGHT_SIDEBAR', { ...res, url });
                  });
                });
              }
            },
          );

          const { document, access_type: accessType, access_method: accessMethod } = userInfo;
          lksDocCreate(user.id, document, accessType, accessMethod, () => {});
        }
      } else if (messageName === 'CHANGE_HIGHLIGHT_COLOR_SIDEBAR') {
        const { styleId, slotId, url } = userInfo;
        const pageInfo = highlightedPages[getURLWithoutHash(url)];
        const pageId = pageInfo?.page_id;

        postPagesPageIDHighlightID(pageId, styleId, slotId, () => {});
      } else if (messageName === 'CREATE_ANNOTATION_SIDEBAR') {
        const { highlightId, annotationInfo, url } = userInfo;
        const pageInfo = highlightedPages[getURLWithoutHash(url)];
        const pageId = pageInfo?.page_id;

        postAnnotation(highlightId, annotationInfo, () => {
          getSavedPageCommunity(pageId).then((res) => {
            messageTo(page, 'FETCH_HIGHLIGHT_SIDEBAR', { ...res, url });
          });
        });
      } else if (messageName === 'CHANGE_ANNOTATION_SIDEBAR') {
        const { highlightId, annotationId, annotationInfo } = userInfo;
        editAnnotation(highlightId, annotationId, annotationInfo);
      } else if (messageName === 'DELETE_ANNOTATION_SIDEBAR') {
        const { highlightId, annotationId } = userInfo;
        deleteAnnotation(highlightId, annotationId);
      } else if (messageName === 'MENTION_USER_SEARCH_SIDEBAR') {
        const { query, size } = userInfo;

        searchUser(query, size, ({ searchedUsers }) => {
          messageTo(page, 'MENTION_USER_SEARCH_SIDEBAR', searchedUsers);
        });
      } else if (messageName === 'UPLOAD_MISSING_SNAPSHOT_SIDEBAR') {
        const { savedPageId, styleId, snapshot } = userInfo;
        const snapshotDecoded = deserialize(snapshot);
        savedPageHighlightSnapshot(savedPageId, styleId, snapshotDecoded);
      } else if (messageName === 'OPEN_HIGHLIGHT_STREAK_POPOVER') {
        setIsRecentStreakOpened(true);
        messageTo(page, 'OPEN_HIGHLIGHT_STREAK_POPOVER', {});
      } else if (messageName === 'CLOSE_HIGHLIGHT_STREAK_POPOVER') {
        setIsRecentStreakOpened(false);
        messageTo(page, 'CLOSE_HIGHLIGHT_STREAK_POPOVER', {});
      } else if (messageName === 'GET_HIGHLIGHT_STATISTICS') {
        if (checkIsRecentStreakOpened())
          messageTo(page, 'OPEN_HIGHLIGHT_STREAK_POPOVER', {
            url,
            isInitialLoad: true,
          });

        const { startDate, endDate } = userInfo;
        getUserMeStatisticsHighlights(user.id, startDate, endDate).then((res) => {
          messageTo(page, 'GET_HIGHLIGHT_STATISTICS', { data: res, url });

          const todayStatistic = res[res.length - 1];
          if (
            checkIsRecentStreakDateOrColorChanged(todayStatistic) &&
            !checkIsRecentStreakOpened()
          ) {
            setIsRecentStreakOpened(true);
            messageTo(page, 'OPEN_HIGHLIGHT_STREAK_POPOVER', {
              url,
              isInitialLoad: true,
            });
          }

          setRecentStreakDateAndColor(todayStatistic);
        });
      }
    }
  });
}

browser.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (message) {
    messageReceived(message.name, port.sender.tab, message.message);
  });
});

function messageTo(page, name, json) {
  browser.tabs.sendMessage(page.id, {
    name: name,
    message: json,
  });
}

function getTimeMarkEligibility() {
  const now = new Date();
  const minute = 1000 * 60;
  const timeMarkEligibility = {
    '6_hour': false,
    '24_hour': false,
  };

  if (
    getLatestTimeMarkForHours(6) === -1 ||
    (now.getTime() - getLatestTimeMarkForHours(6)) / minute >= 60
  ) {
    timeMarkEligibility['6_hour'] = true;
  }

  if (
    getLatestTimeMarkForHours(24) === -1 ||
    (now.getTime() - getLatestTimeMarkForHours(24)) / minute >= 24 * 60
  ) {
    timeMarkEligibility['24_hour'] = true;
  }

  return timeMarkEligibility;
}

function getDefaultPropertiesForAmplitudeEvent() {
  let properties = {};

  const browserName = getBrowserName();
  properties.browser = browserName;

  properties.liner_service = 'be';
  properties.liner_extension_version = linerExtensionVersion;

  let os = getOS();
  if (os === 'macos') {
    os = 'mac';
  }

  properties.os = os;
  properties.is_logged_in = isLoggedIn();

  return properties;
}

function setLatestTimeMarkForHours(hours) {
  localStorage.setItem(`latest_time_mark_for_${hours}_hours`, new Date().getTime());
}

function getLatestTimeMarkForHours(hours) {
  const latestMarkedTime = parseInt(
    localStorage.getItem(`latest_time_mark_for_${hours}_hours`) ?? -1,
  );
  return latestMarkedTime;
}

function logTimeMark(properties) {
  const timeMarkEligibility = getTimeMarkEligibility();

  if (timeMarkEligibility['6_hour']) {
    sendAmplitudeData('is_be_installed_6hr_mark', properties);
    setLatestTimeMarkForHours(6);
  }

  if (timeMarkEligibility['24_hour']) {
    const { url } = properties;
    sendAmplitudeData('is_be_installed_24hr_mark', properties);
    setLatestTimeMarkForHours(24);
    sendBIEvent('is_be_installed_24hr_mark', {}, url);
  }
}

function setLatestTimeMarkForPage(page) {
  localStorage.setItem(`latest_time_mark_for_${page}`, new Date().getTime());
}

function getLatestTimeMarkForPage(page) {
  const latestTimeMarkForPage = parseInt(
    localStorage.getItem(`latest_time_mark_for_${page}`) ?? -1,
  );
  return latestTimeMarkForPage;
}

function checkLatestTimeMarkForPageElapsed(page, minute) {
  const now = new Date();
  const latestTimeMarkForPage = getLatestTimeMarkForPage(page);

  if (latestTimeMarkForPage === -1 || now.getTime() - latestTimeMarkForPage >= minute * 60 * 1000) {
    setLatestTimeMarkForPage(page);
    return true;
  }
  return false;
}

function setLatestTimeMarkForSERP(page) {
  const latestTimeMarkObjectForSERP = JSON.parse(
    localStorage.getItem('latest_time_mark_for_serp') ?? '{}',
  );
  latestTimeMarkObjectForSERP[page] = new Date().getTime();
  localStorage.setItem('latest_time_mark_for_serp', JSON.stringify(latestTimeMarkObjectForSERP));
}

function getLatestTimeMarkForSERP(page) {
  const latestTimeMarkObjectForSERP = JSON.parse(
    localStorage.getItem('latest_time_mark_for_serp') ?? '{}',
  );
  const latestTimeMarkForSERP = parseInt(latestTimeMarkObjectForSERP[page] ?? -1);
  return latestTimeMarkForSERP;
}

function checkLatestTimeMarkForSERP(page, minute) {
  const now = new Date();
  const latestTimeMarkForPage = getLatestTimeMarkForSERP(page);

  if (latestTimeMarkForPage === -1 || now.getTime() - latestTimeMarkForPage >= minute * 60 * 1000) {
    setLatestTimeMarkForSERP(page);
    return true;
  }
  return false;
}

function setAmplitudeSendRecord(eventName) {
  const amplitudeSendRecord = JSON.parse(localStorage.getItem('amplitude_send_record') ?? '{}');
  if (amplitudeSendRecord[eventName]) {
    amplitudeSendRecord[eventName] += 1;
  } else {
    amplitudeSendRecord[eventName] = 1;
  }
  localStorage.setItem('amplitude_send_record', JSON.stringify(amplitudeSendRecord));

  return amplitudeSendRecord;
}

function checkAmplitudeSendRecord(eventName, page, bannerId) {
  const amplitudeSendRecord = setAmplitudeSendRecord(eventName);
  switch (eventName) {
    case 'view_liner_ad_player_banner_be_youtube':
    case 'view_liner_ad_search_banner_be_youtube':
    case 'view_liner_ad_belt_be_youtube':
      if (amplitudeSendRecord[eventName] <= 2) {
        messageTo(page, 'CHECK_AMPLITUDE_SEND_RECORD', {
          eventName,
          bannerId,
        });
      }
  }
}

function initCopyUrlChecker() {
  window.addEventListener('copy', (e) => {
    console.log(e);
  });
}

// Luke - Safari Extension의 validateToolbarItem 함수에서 실행시키는 것들을 windows.onFocusChanged와 tabs.onActivated와 tabs.onUpdated 세 곳에서 실행해줘야 한다.
function validateToolbarItem(inPage) {
  messageTo(inPage, 'CHECK_DISABLED', {});
  if (tags == null) {
    fetchTagsFromServer(function () {});
  }

  if (prevPage && prevPage.url != inPage.url) {
    // Luke - page changed
    messageTo(inPage, 'LKS_UPDATE_DURATION', {});
  }
  prevPage = inPage;

  try {
    if (inPage.url.includes('https://getliner.com') === true) {
      // loginToLiner();
    }
  } catch (e) {}
}
// Luke - onFocusChanged 이벤트는 새 윈도우가 생성되거나(자동으로 Focus되기 때문에 이렇게 만든듯) 다른 윈도우로 Focus가 옮겨갔을 때 실행된다.
// Luke - 아예 다른 앱으로 이동(크롬을 사용하다가 Atom으로 옮겨가는 등)할 때는 windowID가 -1인 상태로 이벤트가 실행된다.
browser.windows.onFocusChanged.addListener(function (windowID) {
  if (windowID != -1) {
    getActivePage(function (activePage) {
      if (activePage) {
        validateToolbarItem(activePage);
      }
    });
  }
});
// Luke - onActivated 이벤트는 ctrl-tab이나 새 탭을 클릭하거나 새 탭을 만드는 등의 활동을 통해 실행된다.
// Luke - Window가 활성화되는 것으로는 실행되지 않는다.(이에 따라 두 개의 다른 윈도우를 왔다갔다 하는 것으로는 실행되지 않음)
browser.tabs.onActivated.addListener(function (activeInfo) {
  browser.tabs.get(activeInfo.tabId, function (tab) {
    validateToolbarItem(tab);
  });
});
browser.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    validateToolbarItem(tab);
  }
});

// Luke - toolbar item이 클릭되었을 때 저장해주는 부분
browser.browserAction.onClicked.addListener(function (tab) {
  const protocol = tab.url.split(':')[0];
  if (protocol.indexOf('http') !== -1 && disabledTabIDs[tab.id] != true) {
    messageTo(tab, 'TOGGLE_POPOVER', {
      is_triggered_by_highlight: false,
    });
  }

  const originalUrl = tab.url;
  const urlDomain = new URL(originalUrl).hostname;

  sendAmplitudeData('click_liner_logo_button_at_extension_toolbar', {
    url_domain: urlDomain,
  });
});

function isLoggedIn() {
  return user.id !== 0 && user.id !== undefined;
}

function logoutToLinerWhenNotAuthed(byResponse) {
  if (byResponse['reason'] === 'not_auth') {
    user = {};
    highlightedPages = {};

    browser.tabs.query({}, function (tabs) {
      tabs.forEach((page) => {
        messageTo(page, 'LOG_OUT', {});
      });
    });

    localStorage.removeItem('sidCookie');
    localStorage.removeItem('userId');
  }
}

function loginToLiner(type) {
  logger('log in to liner');
  getActivePage(function (page) {
    if (!page) {
      logger('page is undefined');
      return;
    }

    messageTo(page, 'LOGIN', {
      type: type || '',
    });
  });
}

var isFetchingTags = false;
function fetchTagsFromServer(callback) {
  if (isFetchingTags) {
    return;
  }
  isFetchingTags = true;
  setTimeout(function () {
    isFetchingTags = false;
  }, 6 * 1000);

  getUserTag(function (json) {
    isFetchingTags = false;
    tags = [];

    try {
      const { tags: resTags } = json.data;
      tags = removeDuplicatedTags(sortByChar(resTags));
    } catch (e) {}

    callback();
  });
}

// Luke - 이름이 Page가 아니라 Tab이어야 하지만 Safari Extension에 맞춤. Porting 할 때 헷갈리지 않게 하기 위함
function getActivePage(callback) {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      getActivePage(callback);
      return;
    }
    callback(tabs[0]);
  });
}

// Luke - 아래 함수들은 이 파일에 있는 것이 적절하지만 Safari Extension에서는 SafariExtensionViewController.swift 파일에 들어있음
function getUser(callback) {
  getUsersMe(function (json) {
    try {
      if (user.id !== json['id']) {
        // Luke - 사용자가 바뀐 경우 highlightedPages를 새로 바꾸어줌
        highlightedPages = {};
      }
    } catch (e) {}

    const prevUserID = user.id;
    user = {};

    if (json['status'] == 'success') {
      const GRANTED_HOUR = 6;
      const isGrantedPremium =
        (new Date() - new Date(+localStorage.getItem('latest_reward_granted_date'))) /
          (1000 * 60 * 60) <=
        GRANTED_HOUR
          ? 1
          : 0;

      user = {
        id: json['id'] || 0,
        email: json['email'] || '',
        name: json['name'] || '',
        username: json['username'] || '',
        premium: json['premium'] || isGrantedPremium || 0,
        image: json['profilePhotoUrl'],
        color_limit: json['color_limit'],
        highlight_limit: json['highlight_limit'],
        youtube_highlight_limit: json['youtube_highlight_limit'],
        amplitude_user_property: json['userProperties'],
        regTime: json['regTime'],
      };

      // Luke - 첫 세팅이거나, 계정이 변경된 경우
      if (user.id !== 0 && (sidCookie === undefined || prevUserID !== user.id)) {
        postAuthCookie(function (json) {
          try {
            sidCookie = json.cookie;
            localStorage.setItem('sidCookie', sidCookie);
            localStorage.setItem('userId', user.id);
          } catch (e) {}
        });
      }
      setAmplitudeUserProperties(user.amplitude_user_property);
      callback(true);
    } else {
      callback(false);
    }
  });
}

function isEligibleForCampaign(campaign) {
  if (campaign.is_re_eligible === 1) {
    if (isNaN(getLatestECCloseDate()) === true) {
      return true;
    }

    const now = new Date();
    const minute = 1000 * 60;

    if ((now.getTime() - getLatestECCloseDate()) / minute >= 30) {
      return true;
    }
  } else {
    const campaignId = campaign.id;
    if (getDoNotShowEC().includes(campaignId) === false) {
      return true;
    }
  }
  return false;
}

function setDoNotShowEC(campaignId) {
  let doNotShowEC = getDoNotShowEC();
  doNotShowEC.push(campaignId);
  localStorage.setItem('do_not_show_ec', JSON.stringify(doNotShowEC));
}

function getDoNotShowEC() {
  return JSON.parse(localStorage.getItem('do_not_show_ec')) ?? [];
}

function setLatestECCloseDate() {
  localStorage.setItem('latest_ec_close_date', new Date().getTime());
}

function removeLatestECCloseDate() {
  localStorage.removeItem('latest_ec_close_date');
}

function getLatestECCloseDate() {
  return parseInt(localStorage.getItem('latest_ec_close_date'));
}

function saveDidSeePDFBanner() {
  localStorage.setItem('did_see_pdf_banner', true);
}

function getDidSeePDFBanner() {
  return JSON.parse(localStorage.getItem('did_see_pdf_banner')) ?? false;
}

function setBEInstallTimestamp() {
  localStorage.setItem('be_install_timestamp', new Date().getTime());
}

function getBEInstallTimestamp() {
  return parseInt(localStorage.getItem('be_install_timestamp'));
}

function getHourDiff(timestamp) {
  if (isNaN(timestamp) === true) {
    return -1;
  }

  const now = new Date();
  const hour = 60 * 60 * 1000;

  return (now.getTime() - timestamp) / hour;
}

function setHighlightCount() {
  localStorage.setItem('highlight_count', parseInt(getHighlightCount()) + 1);
}

function getHighlightCount() {
  return parseInt(localStorage.getItem('highlight_count') ?? 0);
}

function getGuideFinish(guideType) {
  return JSON.parse(localStorage.getItem(`guide_${guideType}_finish`)) ?? false;
}

function setGuideFinish(guideType) {
  localStorage.setItem(`guide_${guideType}_finish`, true);
}

function isEligibleForGuide(guideType) {
  if (getGuideFinish(guideType) === true) {
    return false;
  }

  const beInstallHours = getHourDiff(getBEInstallTimestamp());
  const guideLastSeenTimestamp = getGuideLastSeenTimestamp(guideType);
  const guideLastSeenHours = getHourDiff(guideLastSeenTimestamp);
  const didVisitMyHighlights = JSON.parse(localStorage.getItem('did_visit_my_highlights') || false);

  if (guideType === 'highlight') {
    if (getHighlightCount() === 0) {
      if (beInstallHours > 0.5 && beInstallHours < 24) {
        if (guideLastSeenHours > 1 || guideLastSeenHours === -1) {
          return true;
        }
      }
    }
  } else if (guideType === 'manage') {
    if (didVisitMyHighlights === false) {
      if (beInstallHours > 24 && beInstallHours < 120) {
        if (getHighlightCount() >= 2) {
          if (guideLastSeenHours > 24 || guideLastSeenHours === -1) {
            return true;
          }
        }
      }
    }
  } else if (guideType === 'manage_tooltip') {
    if (isEligibleForGuide('manage') === true) {
      if (didVisitMyHighlights === false) {
        if (isNaN(guideLastSeenTimestamp) === true) {
          return true;
        }
      }
    }
  } else if (guideType === 'google_search') {
    // if (beInstallHours < 24*7) {
    //   if (isNaN(guideLastSeenTimestamp) === true) {
    return true;
    //   } else {
    //     if (beInstallHours > 72) {
    //       if (guideLastSeenHours > 24) {
    //         return true;
    //       }
    //     }
    //   }
    // }
  }

  return false;
}

function getAdvancedSearchCountLogTime() {
  const advancedSearchCountLogTime = localStorage.getItem('advanced_search_count_log_time');
  return advancedSearchCountLogTime === null ? 0 : new Date(advancedSearchCountLogTime);
}

function setAdvancedSearchCountLogTime() {
  localStorage.setItem(`advanced_search_count_log_time`, new Date());
}

function getRemainingAdavancedSearchCount(keyword) {
  if (user.premium === 1) {
    return advancedSearchLimit;
  }

  const doNeedRefresh =
    getAdvancedSearchCountLogTime() === 0
      ? false
      : getAdvancedSearchCountLogTime().getDate() !== new Date().getDate();
  if (doNeedRefresh === true) {
    localStorage.removeItem('used_advanced_search_keywords_for_today');
    localStorage.removeItem('used_advanced_search_cnt');
    localStorage.removeItem('advanced_search_count_log_time');
  }

  if (keyword !== undefined) {
    if (getUsedAdvancedSearchKeywordsForToday().indexOf(keyword) === -1) {
      setUsedAdvancedSearchKeywordsForToday(keyword);
      setUsedAdvancedSearchCnt();
      setAdvancedSearchCountLogTime();
    }
  }

  const usedAdvancedSearchCnt = parseInt(localStorage.getItem('used_advanced_search_cnt') ?? 0);
  const remainingAdvancedSearchCnt = advancedSearchLimit - usedAdvancedSearchCnt;

  return remainingAdvancedSearchCnt >= 0 ? remainingAdvancedSearchCnt : -1;
}

function setUsedAdvancedSearchCnt() {
  localStorage.setItem(
    'used_advanced_search_cnt',
    parseInt(localStorage.getItem('used_advanced_search_cnt') ?? 0) + 1,
  );
}

function getUsedAdvancedSearchKeywordsForToday() {
  return JSON.parse(localStorage.getItem('used_advanced_search_keywords_for_today')) ?? [];
}

function setUsedAdvancedSearchKeywordsForToday(keyword) {
  let usedKeywords = getUsedAdvancedSearchKeywordsForToday();
  if (usedKeywords.indexOf(keyword) !== -1) {
    return;
  }
  usedKeywords.push(keyword);
  localStorage.setItem('used_advanced_search_keywords_for_today', JSON.stringify(usedKeywords));
}

function getGuideLastSeenTimestamp(guideType) {
  return parseInt(localStorage.getItem(`guide_${guideType}_timestamp`));
}

function setGuideLastSeenTimestamp(guideType) {
  localStorage.setItem(`guide_${guideType}_timestamp`, new Date().getTime());
}

// celina (settings - 1)
function saveDoNotShowAdvancedSearch(doNotShowAdvancedSearch) {
  localStorage.setItem('do_not_show_advanced_search', doNotShowAdvancedSearch);
}

function getDoNotShowAdvancedSearch() {
  return JSON.parse(localStorage.getItem('do_not_show_advanced_search')) ?? false;
}

// celina (settings - 3)

function saveDoNotRunPage(url, doNotRunPage) {
  const doNotRunOnThisPage = getDoNotRunPage();
  const switchStatusOnCurrentUrl = doNotRunOnThisPage[url];

  if (switchStatusOnCurrentUrl === undefined) {
    doNotRunOnThisPage[url] = doNotRunPage;
    localStorage.setItem('doNotRunOnThisPage', JSON.stringify(doNotRunOnThisPage));
    return;
  }
}

function getDoNotRunPage() {
  return JSON.parse(localStorage.getItem('doNotRunOnThisPage')) ?? {};
}

// celina (settings - 4)

function saveDoNotRunSite(url, doNotRunSite) {
  localStorage.setItem(
    'doNotRunOnThisSite',
    JSON.stringify({
      url: url,
      do_not_run_on_this_site: doNotRunSite,
    }),
  );
}

function getDoNotRunSite() {
  return JSON.parse(localStorage.getItem('doNotRunOnThisSite')) ?? {};
}

function getPDFDocumentTitle(page) {
  if (!page) return '';

  const { url: PDFUrl, title: PDFTitle } = page;

  const titleFromPathName = getTitleFromPathName(PDFUrl);
  if (!!titleFromPathName) {
    return titleFromPathName;
  }

  if (!!PDFTitle) {
    return PDFTitle;
  }

  return 'PDF';
}

function getTitleFromPathName(PDFUrl = '') {
  try {
    const PDFPathName = decodeURIComponent(new URL(PDFUrl).pathname);

    if (checkPathNameIsEndWithPDF(PDFPathName)) {
      return getFileName(PDFPathName);
    }
  } catch {}

  return null;
}

function checkPathNameIsEndWithPDF(PDFPathName = '') {
  const regExp = /.pdf$/;

  return regExp.test(PDFPathName);
}

function getFileName(PDFPathName = '') {
  const lastPathName = PDFPathName.split('/').reverse()[0];
  const fileName = lastPathName.substring(0, lastPathName.lastIndexOf('.pdf'));

  return fileName;
}

function updatePageHighlights(
  url,
  page,
  isCreatingHighlight,
  { highlightVar, imageId, imageUrl, imageHighlight, context, slotId },
) {
  if (isLoggedIn()) {
    postPageSearch(url, function (pageSearchResult) {
      if (pageSearchResult?.pageId) {
        pageId = JSON.parse(pageSearchResult.pageId);
        getPagePageIdHighlights(pageId, function (pageHighlightsResult) {
          const { highlights } = pageHighlightsResult;
          messageTo(page, 'PAGE_HIGHLIGHT', {
            url,
            pageId,
            highlights,
            isCreatingHighlight,
            context,
            highlightVar,
            imageId,
            imageUrl,
            imageHighlight,
            slotId,
            isLoggedIn: true,
            isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
            isBlockPublicThreadCohort: checkIsBlockPublicThreadCohort(),
          });
        });
      } else {
        messageTo(page, 'PAGE_HIGHLIGHT', {});
      }
    });
  } else {
    pblPageSummary(null, url).then(({ id }) => {
      if (id) {
        pageId = JSON.parse(id);
        postPblPageHighlights(pageId, null).then(({ highlights }) => {
          messageTo(page, 'PAGE_HIGHLIGHT', {
            url,
            pageId,
            highlights,
            isCreatingHighlight,
            context,
            highlightVar,
            imageId,
            imageUrl,
            imageHighlight,
            slotId,
            isLoggedIn: false,
            isYoutubeSidebarCohort: checkIsYoutubeSidebarCohort(),
            isBlockPublicThreadCohort: checkIsBlockPublicThreadCohort(),
          });
        });
      } else {
        messageTo(page, 'PAGE_HIGHLIGHT', {});
      }
    });
  }
}

const getUrlForHighlightInfo = (url) => {
  try {
    const highlightUrl = new URL(url);

    const isYoutubeEmbedVideo =
      highlightUrl.hostname.includes('youtube.com') && highlightUrl.pathname.includes('embed');
    const isYoutubeNoCookieEmbedVideo =
      highlightUrl.hostname.includes('youtube-nocookie.com') &&
      highlightUrl.pathname.includes('/embed');

    const isYoutubeMobile = highlightUrl.hostname.includes('m.youtube.com');
    const isYoutubeDesktopWatchPage =
      highlightUrl.hostname.includes('www.youtube.com') && highlightUrl.pathname.includes('/watch');

    if (isYoutubeEmbedVideo || isYoutubeNoCookieEmbedVideo) {
      const videoId = highlightUrl.pathname.split('/embed/')[1].split('/')[0];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    if (isYoutubeMobile || isYoutubeDesktopWatchPage) {
      const urlParams = new URLSearchParams(highlightUrl.search);
      const videoId = urlParams.get('v');
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return url.split('?openLinerExtension')[0].split('&openLinerExtension')[0];
  } catch {
    return url;
  }
};

function getGeoLocationInfo() {
  const now = new Date().getTime();
  const expireTime = 1000 * 60 * 60;

  if (
    geoLocationHandler.countryCode === '' &&
    now - geoLocationHandler.lastFetchedTime > expireTime
  ) {
    getGeoLocationJson((result) => {
      try {
        const geoLocationResult = JSON.parse(result);
        const { country_code: countryCode, country_name: countryName } = geoLocationResult;
        geoLocationHandler.countryCode = countryCode;
        geoLocationHandler.countryName = countryName;
        geoLocationHandler.lastFetchedTime = now;
      } catch {}
    });
  }
}

function removeTrailingSlash(site) {
  if (site === undefined) {
    return;
  }

  return site.replace(/\/$/, '');
}

function clearPreviousVersionModalHandlerLegacy() {
  try {
    const previousModalHandlerKeys = [
      'google_bookmark',
      'ytb_bookmark_save',
      'ytb_bookmark_folder',
    ];
    previousModalHandlerKeys.forEach((key) => {
      const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};
      localStorage.setItem('modal_handler', JSON.stringify({ ...modalHandler, [key]: null }));
    });
  } catch {}
}
