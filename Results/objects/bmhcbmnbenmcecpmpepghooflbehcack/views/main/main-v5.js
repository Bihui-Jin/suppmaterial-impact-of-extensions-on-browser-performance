let highlightedPages = null;
let currentPage = null;
let currentTab = null;
let user = null;
let isSavedPage = false;
let isTriggeredByHighlight = false;

let initialTagContainerHeight = 0;
let expandedPopoverDiff = 0;
const tagContainerTop = 72;
const normalPopoverHeight = 130;
const sharePopoverHeight = 169;
const normalPopoverHeightWithoutTagContainer = 98;

let beforeShareHeight = 0;
let beforeSettingsHeight = 0;

let isEligibleForManageGuide = false;
let isEligibleForManageTooltipGuide = false;

function handleLocalMessage(event) {
  if (event.name === 'POPOVER_INIT' || event.name === 'PAGE_SAVED') {
    user = event.message.user;

    highlightedPages = event.message.highlighted_pages;
    currentTab = event.message.page;

    const currentUrl = currentTab.url
      .split('?openLinerExtension')[0]
      .split('&openLinerExtension')[0]
      .split('&t=')[0];
    currentPage = highlightedPages[getURLWithoutHash(currentUrl)];

    isSavedPage = currentPage !== undefined;
    if (isSavedPage !== true) {
      currentPage = {};
    }

    currentPage.title = currentTab.title;
    currentPage.url = getURLWithoutHash(currentUrl);

    isEligibleForManageGuide = event.message.is_eligible_for_manage_guide;
    isEligibleForManageTooltipGuide = event.message.is_eligible_for_manage_tooltip_guide;

    doLocalization();
    setUI(event.message);
    addEvents();
    addShareEvents();
    addSettingsEvents();
  } else if (event.name === 'PUT_CUR_PAGE_FOLDER_ID') {
    const { folderName, folderEmoji } = event.message;
    changeFolderName(folderName);
    changeFolderEmoji(folderEmoji);
    closeFolderBtn();
  } else if (event.name === 'POPOVER_NEW_FOLDER_ITEM') {
    const { folder } = event.message;
    changeFolderName(folder.name);
    changeFolderEmoji(folder.emoji);
    closeFolderBtn();
  }
}

$(document).ready(function () {
  messageToNative('GA_PAGEVIEW', {
    path: '/liner-' + getBrowserName() + '-extension',
  });

  messageToNative('GA_EVENT', {
    category: 'extension',
    action: 'extension_popup_shown',
    label: '',
  });

  const params = new URLSearchParams(window.location.href.split('?')[1]);
  isTriggeredByHighlight = JSON.parse(params.get('isTriggeredByHighlight'));

  // Luke - 아래 메세지를 통해서 popover 정보가 initialize됨
  // Luke - handleLocalMessage의 POPOVER_INIT으로 가며, 이렇게 하는 이유는 Firefox에서 browser.extension.getBackgroundPage()가 iframe에서 작동하지 않기 때문
  messageToNative('POPOVER_INIT', {});

  if (isTriggeredByHighlight === true) {
    showFeedback('save', false);
  }
});

function doLocalization() {
  $('.shareBtn .label').html(localize('Share'));
  $('.goToDashboardBtn span').html(localize('Manage Highlights'));
  $('.feedbackView .deleteBtn').html(localize('Delete'));
  $('.feedbackView .cancelBtn').html(localize('Cancel'));

  $('.shareContainer .headerLabel').html(localize('Share Highlighted Page'));
  $('.shareContainer .footer .copyBtn').html(localize('Copy Link'));

  $('.saveToLinerBtn span').html(localize('Save to LINER'));

  $('.settingsContainer .headerLabel').html(localize('Options'));
  $('.settingsContainer .settingContentContainer .settingPickedByLiner').html(
    'Picked by LINER on Search',
  );
  $('.settingsContainer .settingContentContainer .settingDontRunOnThisPage').html(
    'Don’t run on this page',
  );
  $('.settingsContainer .settingContentContainer .settingDontRunOnThisSite').html(
    'Don’t run on this site',
  );
}

function setUI(message) {
  $('.webTitleLabel').text(currentTab.title);
  $('.shareContainer .shareLinkLabel').text(`${shareHost}/${currentPage.share_id ?? ''}`);

  // Luke - footer go to dashboard btn
  $('.footer .goToDashboardBtn').hover(
    function () {
      $(this).addClass('hover');
    },
    function () {
      $(this).removeClass('hover');
    },
  );

  $('.skeleton').hide();
  $('.mainContainer').show();

  if (isSavedPage === true || isTriggeredByHighlight === true) {
    $('.saveToLinerBtn').hide();
    $('.L-folderContainer').removeClass('L-folderContainer-hidden');
    const folderNameDOM = document.querySelector('.L-folderName');
    const folderEmojiDOM = document.querySelector('.L-folderEmoji');
    const isClassifiedFolder = message?.folder.status !== 'unclassified';
    folderNameDOM.textContent = isClassifiedFolder
      ? message.folder.name
      : localize('Uncategorized');

    if (message?.folder?.emoji) {
      folderEmojiDOM.textContent = message.folder.emoji;
      folderEmojiDOM.classList.remove('L-EmptyEmoji');
      folderEmojiDOM.classList.remove('L-Uncategorized');
    } else if (isClassifiedFolder && message?.folder.name) {
      folderEmojiDOM.classList.add('L-EmptyEmoji');
      folderEmojiDOM.classList.remove('L-Uncategorized');
    }

    $('.footer').removeClass('unsavedPage');

    if (isEligibleForManageGuide === true && window.myHighlightClickEmphasis === undefined) {
      window.myHighlightClickEmphasis = bodymovin.loadAnimation({
        container: document.getElementsByClassName('myHighlightsHotspot')[0],
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: {
          v: '5.5.7',
          meta: { g: 'LottieFiles AE 0.1.20', a: '', k: '', d: '', tc: '' },
          fr: 29.9700012207031,
          ip: 0,
          op: 45.0000018328876,
          w: 40,
          h: 40,
          nm: 'trigger',
          ddd: 0,
          assets: [],
          layers: [
            {
              ddd: 0,
              ind: 1,
              ty: 4,
              nm: 'Shape Layer 1',
              sr: 1,
              ks: {
                o: { a: 0, k: 50, ix: 11 },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [14.014, 13.139, 0], ix: 2 },
                a: { a: 0, k: [0, 0, 0], ix: 1 },
                s: { a: 0, k: [100, 100, 100], ix: 6 },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      d: 1,
                      ty: 'el',
                      s: { a: 0, k: [15.473, 15.473], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      nm: 'Ellipse Path 1',
                      mn: 'ADBE Vector Shape - Ellipse',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: { a: 0, k: [1, 0.796078431373, 0.466666666667, 1], ix: 4 },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [5.986, 6.861], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [100, 100], ix: 3 },
                      r: { a: 0, k: 0, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Ellipse 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 45.0000018328876,
              st: 0,
              bm: 0,
            },
            {
              ddd: 0,
              ind: 2,
              ty: 4,
              nm: 'Shape Layer 2',
              sr: 1,
              ks: {
                o: {
                  a: 1,
                  k: [
                    { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [50] },
                    { t: 30.0000012219251, s: [0] },
                  ],
                  ix: 11,
                },
                r: { a: 0, k: 0, ix: 10 },
                p: { a: 0, k: [20, 20, 0], ix: 2 },
                a: { a: 0, k: [5.986, 6.861, 0], ix: 1 },
                s: {
                  a: 1,
                  k: [
                    {
                      i: { x: [0.357, 0.357, 0.667], y: [1, 1, 1] },
                      o: { x: [0.273, 0.273, 0.333], y: [0, 0, 0] },
                      t: 0,
                      s: [100, 100, 100],
                    },
                    { t: 30.0000012219251, s: [200, 200, 100] },
                  ],
                  ix: 6,
                },
              },
              ao: 0,
              shapes: [
                {
                  ty: 'gr',
                  it: [
                    {
                      d: 1,
                      ty: 'el',
                      s: { a: 0, k: [15.473, 15.473], ix: 2 },
                      p: { a: 0, k: [0, 0], ix: 3 },
                      nm: 'Ellipse Path 1',
                      mn: 'ADBE Vector Shape - Ellipse',
                      hd: false,
                    },
                    {
                      ty: 'fl',
                      c: { a: 0, k: [1, 0.796078431373, 0.466666666667, 1], ix: 4 },
                      o: { a: 0, k: 100, ix: 5 },
                      r: 1,
                      bm: 0,
                      nm: 'Fill 1',
                      mn: 'ADBE Vector Graphic - Fill',
                      hd: false,
                    },
                    {
                      ty: 'tr',
                      p: { a: 0, k: [5.986, 6.861], ix: 2 },
                      a: { a: 0, k: [0, 0], ix: 1 },
                      s: { a: 0, k: [100, 100], ix: 3 },
                      r: { a: 0, k: 0, ix: 6 },
                      o: { a: 0, k: 100, ix: 7 },
                      sk: { a: 0, k: 0, ix: 4 },
                      sa: { a: 0, k: 0, ix: 5 },
                      nm: 'Transform',
                    },
                  ],
                  nm: 'Ellipse 1',
                  np: 3,
                  cix: 2,
                  bm: 0,
                  ix: 1,
                  mn: 'ADBE Vector Group',
                  hd: false,
                },
              ],
              ip: 0,
              op: 45.0000018328876,
              st: 0,
              bm: 0,
            },
          ],
          markers: [],
        },
      });

      setTimeout(function () {
        $('.mainContainer .footer .myHighlightsHotspot')
          .css({ right: $('.goToDashboardBtn').width() + 6 })
          .fadeIn(150);

        messageToNative('SET_GUIDE_LAST_SEEN_TIMESTAMP', {
          guide_type: 'manage',
        });

        messageToNative('AMPLITUDE_EVENT', {
          event_name: 'view_hotspot_manage_highlights_button_be_onb_guide_highlight',
          properties: {},
        });
      }, 1000);

      if (isEligibleForManageTooltipGuide === true) {
        setTimeout(function () {
          messageToNative('SHOW_MANAGE_GUIDE_TOOLTIP', {});
          messageToNative('SET_GUIDE_LAST_SEEN_TIMESTAMP', {
            guide_type: 'manage_tooltip',
          });
        }, 3000);
      }
    }
  } else {
    $('.saveToLinerBtn').show();
    $('.L-folderContainer').addClass('L-folderContainer-hidden');

    $('.footer').addClass('unsavedPage');
  }
}

function addEvents() {
  $('.linerLogoBtn').click(function (e) {
    hideFeedback();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'liner_icon',
      label: '',
    });

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_liner_logo_button',
      properties: {},
    });
  });

  $('.shareBtn').click(function (e) {
    const isDisabledBtn = $(this).parent().hasClass('unsavedPage');
    if (isDisabledBtn === true) {
      return false;
    }

    hideFeedback();

    messageToNative('SAVE_SHARING_CONTENT', {
      content: '',
    });

    beforeShareHeight = $('.mainContainer').height();

    $('.mainContainer').hide();
    messageToNative('CHANGE_POPOVER_HEIGHT', {
      height: sharePopoverHeight,
      popover_class: 'liner-popover-main',
    });
    $('.shareContainer').show();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_open',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_open',
    });
  });

  $('.settingsBtn').click(function (e) {
    hideFeedback();

    messageToNative('SAVE_SETTING_CONTENT', {
      content: '',
    });

    beforeSetHeight = $('.mainContainer').height();

    $('.mainContainer').hide();

    messageToNative('CHANGE_POPOVER_HEIGHT', {
      height: $('.settingsContainer').height(),
      popover_class: 'liner-popover-main',
    });

    $('.settingsContainer').show();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'settings_page_open',
      label: '',
    });

    messageToNative('BRAZE_EVENT', {
      name: 'settings_page_open',
    });
  });

  $('.saveToLinerBtn').click(function (e) {
    messageToNative('SAVE_TO_LINER', {});
    showFeedback('save', true);
    const folderNameDOM = document.querySelector('.L-folderName');
    const folderEmojiDOM = document.querySelector('.L-folderEmoji');
    folderNameDOM.textContent = localize('Uncategorized');
    folderEmojiDOM.classList.add('L-Uncategorized');
    folderEmojiDOM.classList.remove('L-EmptyEmoji');
    $('.L-folderContainer').removeClass('L-folderContainer-hidden');
    $('.saveToLinerBtn').hide();

    const originalUrl = currentPage.url;
    const urlDomain = new URL(originalUrl).hostname;
    const contentType =
      originalUrl.split('.pdf').length > 1 && originalUrl.split('.pdf')[1] === ''
        ? 'pdf'
        : 'web_page';

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_save_to_liner_button_at_extension_popup',
      properties: {
        url_domain: urlDomain,
        content_type: contentType,
      },
    });
  });

  $('.goToDashboardBtn')[0].href = `https://getliner.com/myhighlights/pages/${
    currentPage.page_id ?? ''
  }`;

  $('.goToDashboardBtn').click(function (e) {
    const isDisabledBtn = $(this).parent().hasClass('unsavedPage');
    if (isDisabledBtn === true) {
      return false;
    }

    hideFeedback();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'go_to_dashboard',
      label: '',
    });

    const originalUrl = currentPage.url;
    const urlDomain = new URL(originalUrl).hostname;
    const contentType =
      originalUrl.split('.pdf').length > 1 && originalUrl.split('.pdf')[1] === ''
        ? 'pdf'
        : 'web_page';

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_manage_highlights_button_at_extension_popup',
      properties: {
        tag_count: currentPage.tags !== undefined ? currentPage.tags.length : 0,
        url_domain: urlDomain,
        content_type: contentType,
      },
    });

    const isManageGuideOn = $('.mainContainer .footer .myHighlightsHotspot').is(':visible');
    if (isManageGuideOn === true) {
      $('.mainContainer .footer .myHighlightsHotspot').remove();
      messageToNative('SET_GUIDE_FINISH', {
        guide_type: 'manage',
      });

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_hotspot_manage_highlights_button_be_onb_guide_highlight',
        properties: {},
      });
    }
  });

  const folderBtn = document.querySelector('.L-folderBtn');
  const toggleFolderDropdown = (e) => {
    const { currentTarget: folderBtn } = e;
    if (folderBtn.classList.contains('L-folderDropdown__hidden')) {
      folderBtn.classList.remove('L-folderDropdown__hidden');
      folderBtn.classList.add('L-folderDropdown__shown');
      messageToNative('SHOW_FOLDER_DROPDOWN_POPOVER', {});
    } else {
      folderBtn.classList.remove('L-folderDropdown__shown');
      folderBtn.classList.add('L-folderDropdown__hidden');
      messageToNative('CLOSE_FOLDER_DROPDOWN_POPOVER', {});
    }
  };
  folderBtn.onclick = toggleFolderDropdown;

  $('.mainContainer').click(function (e) {
    if (e.target.closest('.L-folderBtn')) return;

    if (folderBtn.classList.contains('L-folderDropdown__shown')) {
      folderBtn.classList.remove('L-folderDropdown__shown');
      folderBtn.classList.add('L-folderDropdown__hidden');
      messageToNative('CLOSE_FOLDER_DROPDOWN_POPOVER', {});
    }
  });

  $('.closeBtn').click(function (e) {
    e.stopPropagation();
    messageToNative('CLOSE_POPOVER', {
      do_not_show_popover: true,
    });
  });
}

function addShareEvents() {
  $('.shareContainer .backBtn').click(function (e) {
    hideFeedback();

    $('.shareContainer').hide();

    messageToNative('CHANGE_POPOVER_HEIGHT', {
      height: beforeShareHeight,
      popover_class: 'liner-popover-main',
    });

    $('.mainContainer').show();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'close_share',
      label: '',
    });
  });

  $('.shareContainer .shareMethod').click(function (e) {
    hideFeedback();
  });

  $('.facebook').attr('href', fbShareDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`));
  $('.messenger').attr('href', fbSendDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`));
  $('.twitter').attr(
    'href',
    twitterShareDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`, currentPage.title ?? ''),
  );
  $('.linkedin').attr('href', linkedInShareDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`));
  $('.line').attr('href', lineShareDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`));
  $('.mail').attr(
    'href',
    mailDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`, currentPage.title ?? '', ''),
  );

  $('.shareMethod').click(function (e) {
    messageToNative('AMPLITUDE_USER_PROPERTY', {
      type: 'add',
      property: 'share_count',
      value: 1,
    });
  });

  $('.facebook').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_facebook',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_facebook',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'facebook',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'facebook',
        content_type: 'web_page',
      },
    });
  });

  $('.messenger').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_messenger',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_messenger',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'messenger',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'facebook_messenger',
        content_type: 'web_page',
      },
    });
  });

  $('.twitter').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_twitter',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_twitter',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'twitter',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'twitter',
        content_type: 'web_page',
      },
    });
  });

  $('.linkedin').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_linkedin',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_linkedin',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'linkedin',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'linkedin',
        content_type: 'web_page',
      },
    });
  });

  $('.line').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_line',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_line',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'line',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'line',
        content_type: 'web_page',
      },
    });
  });

  $('.kakaotalk')
    .off()
    .click(function (e) {
      try {
        e.stopPropagation();
      } catch (e) {}
      window.open(
        kakaoShareDialogUrl(`${shareHost}/${currentPage.share_id ?? ''}`, currentPage.title ?? ''),
        'PopupWin',
        'width=460,height=660',
      );
      messageToNative('GA_EVENT', {
        category: 'extension',
        action: 'share_page_kakaotalk',
        label: '',
      });
      messageToNative('BRAZE_EVENT', {
        name: 'share_page_kakaotalk',
      });
      messageToNative('LKS_EVENT', {
        type: 'doc_share',
        share_type: 'kakaotalk',
        url: currentPage.url,
      });
      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_share_my_page',
        properties: {
          shared_option: 'page_with_highlights',
          share_type: 'kakaotalk',
          content_type: 'web_page',
        },
      });
    });

  $('.mail').click(function (e) {
    try {
      e.stopPropagation();
    } catch (e) {}
    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_mail',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_mail',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'mail',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'mail',
        content_type: 'web_page',
      },
    });
  });

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

  if (!doShowKakaoTalk) {
    $('.kakaotalk').remove();
  }

  $('.shareContainer .copyBtn, .shareContainer .shareLinkLabel').click(function (e) {
    hideFeedback();

    copyToClipBoard(`${shareHost}/${currentPage.share_id ?? ''}`);
    showFeedback('copy', true);

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'share_page_copy',
      label: '',
    });
    messageToNative('BRAZE_EVENT', {
      name: 'share_page_copy',
    });
    messageToNative('LKS_EVENT', {
      type: 'doc_share',
      share_type: 'copy',
      url: currentPage.url,
    });
    messageToNative('AMPLITUDE_USER_PROPERTY', {
      type: 'add',
      property: 'share_count',
      value: 1,
    });
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_share_my_page',
      properties: {
        shared_option: 'page_with_highlights',
        share_type: 'share_url',
        content_type: 'web_page',
      },
    });
  });
}

function addSettingsEvents() {
  $('.settingsContainer .backBtn').click(function (e) {
    hideFeedback();
    $('.settingsContainer').hide();

    messageToNative('CHANGE_POPOVER_HEIGHT', {
      height: beforeSetHeight,
      popover_class: 'liner-popover-main',
    });

    $('.mainContainer').show();

    messageToNative('GA_EVENT', {
      category: 'extension',
      action: 'close_settings',
      label: '',
    });
  });

  $('.settingBtn')
    .off()
    .click(function (e) {
      e.stopPropagation();

      const isSwitchOn = $(this).find('.circleBtn').hasClass('settingOn') === true;

      if (isSwitchOn) {
        $(this).parent().find('.redSwitch').removeClass('settingRedOn');
        $(this).parent().find('.blueSwitch').removeClass('settingBtnOn').addClass('settingBtnOff');
        $(this).stop().removeClass('settingBtnOn');
        $(this).find('.circleBtn').stop().removeClass('settingOn').addClass('settingOff');

        const isSettingPickedByLiner = $(this).prev().hasClass('settingPickedByLiner') === true;
        if (isSettingPickedByLiner) {
          messageToNative('TOGGLE_ADVANCED_SEARCH', {
            do_not_show_advaned_search: false,
          });
        }
        const isSettingDontRunOnThisPage =
          $(this).prev().hasClass('settingDontRunOnThisPage') === true;
        if (isSettingDontRunOnThisPage) {
          messageToNative('TOGGLE_RUN_PAGE', {
            set_run_page: true,
            url: currentPage.url,
          });
        }
        const isSettingDontRunOnThisSite =
          $(this).prev().hasClass('settingDontRunOnThisSite') === true;
        if (isSettingDontRunOnThisSite) {
          messageToNative('TOGGLE_RUN_SITE', {
            set_run_site: true,
            url: currentPage.url,
          });
        }
      } else {
        $(this).stop().addClass('settingBtnOn');
        $(this)
          .parent()
          .find('.redSwitch')
          .removeClass('settingBtnOn')
          .addClass('settingBtnOff')
          .addClass('settingRedOn');

        $(this).parent().find('.blueSwitch').removeClass('settingBtnOff').addClass('settingBtnOn');
        $(this).find('.circleBtn').stop().removeClass('settingOff').addClass('settingOn');

        const isSettingPickedByLiner = $(this).prev().hasClass('settingPickedByLiner') === true;
        if (isSettingPickedByLiner) {
          messageToNative('TOGGLE_ADVANCED_SEARCH', {
            do_not_show_advaned_search: false,
          });
        }
        const isSettingDontRunOnThisPage =
          $(this).prev().hasClass('settingDontRunOnThisPage') === true;
        if (isSettingDontRunOnThisPage) {
          messageToNative('TOGGLE_RUN_PAGE', {
            set_run_page: false,
            url: currentPage.url,
          });
        }
        const isSettingDontRunOnThisSite =
          $(this).prev().hasClass('settingDontRunOnThisSite') === true;
        if (isSettingDontRunOnThisSite) {
          messageToNative('TOGGLE_RUN_SITE', {
            set_run_site: false,
            url: currentPage.url,
          });
        }
      }
    });
}

function hideFeedback() {
  $('.feedbackView').fadeOut(200);
  $('.feedbackView').animate(
    {
      bottom: '-10px',
    },
    200,
    function () {},
  );
}

function showFeedback(type, doAnimate) {
  if (type === 'copy') {
    $('.feedbackView').css('background-color', '#00C3CC');
    $('.feedbackView .label').text(localize('Link copied to clipboard'));
    $('.feedbackView .btn').hide();
  } else if (type === 'save') {
    $('.feedbackView').css('background-color', '#00C3CC');
    $('.feedbackView .label').text(localize('Saved'));
    $('.feedbackView .btn').hide();
  } else {
    return;
  }

  if (doAnimate === false) {
    $('.feedbackView').css('bottom', '0px');
    $('.feedbackView').show();
    if (type === 'copy' || type === 'save') {
      setTimeout(function () {
        hideFeedback();
      }, 3000);
    }
  } else {
    $('.feedbackView').css('bottom', '-32px');
    $('.feedbackView').fadeIn(100);
    $('.feedbackView').animate(
      {
        bottom: 0,
      },
      100,
      function () {
        if (type === 'copy' || type === 'save') {
          setTimeout(function () {
            hideFeedback();
          }, 3000);
        }
      },
    );
  }
}

function copyToClipBoard(content) {
  var temp = $('<input class="copyInput">');
  $('body').append(temp);
  temp.val(content).select();
  document.execCommand('copy');
  temp.remove();
}

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

const changeFolderName = (folderName) => {
  const folderNameDOM = document.querySelector('.L-folderName');
  folderNameDOM.textContent = folderName;
};

const changeFolderEmoji = (folderEmoji) => {
  const folderEmojiDOM = document.querySelector('.L-folderEmoji');

  if (folderEmoji) {
    folderEmojiDOM.textContent = folderEmoji;
    folderEmojiDOM.classList.remove('L-EmptyEmoji');
    folderEmojiDOM.classList.remove('L-Uncategorized');
  } else {
    folderEmojiDOM.textContent = '';
    folderEmojiDOM.classList.add('L-EmptyEmoji');
    folderEmojiDOM.classList.remove('L-Uncategorized');
  }
};

const closeFolderBtn = () => {
  const folderBtn = document.querySelector('.L-folderBtn');
  folderBtn.classList.remove('L-folderDropdown__shown');
  folderBtn.classList.add('L-folderDropdown__hidden');
};
