let user = {};
let recommendedDocs = [];
let recommendationMethod;
let currentPage = null;
let isRPClosed = false;
let isSaving = false;

function handleLocalMessage(event) {
  if (event.name === 'RELOAD_RECOMMENDATION_POPOVER') {
    user = event.message.user;
    recommendedDocs = event.message.documents;
    recommendationMethod = event.message.recommendation_method;
    isRPClosed = event.message.is_rp_closed;

    doLocalization();
    resetUI();
    addEvents();

    messageToNative('GA_PAGEVIEW_RECOMMENDATION', {
      path: '/liner-' + getBrowserName() + '-extension-recommendation',
    });
    messageToNative('GA_EVENT_RECOMMENDATION', {
      category: 'extension',
      action: 'relevant_pages_shown',
      label: '',
    });

    const urls = [];
    recommendedDocs.forEach((doc) => {
      const { title, url } = doc;
      urls.push(url);
      const listOrder = urls.length - 1;

      messageToNative('LKS_EVENT', {
        type: 'view_recommendation_by_highlight',
        title,
        url,
        list_order: listOrder,
        recommendation_method: recommendationMethod,
      });
    });

    messageToNative('GET_DOCUMENTS', {
      type: 'lks',
      urls,
      scrap_cnt: 3,
    });

    currentPage = event.message.page;
  } else if (event.name === 'SHOW_RECOMMENDATION_POPOVER_SPINNER') {
    const bodyHeight = $('body').height();
    const spinnerHeight = $('.spinner').height();
    $('.spinner').css('top', bodyHeight / 2 - spinnerHeight / 2);

    if (isRPClosed === false) {
      // if (isRPClosed === false && user.premium == 1) {
      $('.spinner').show();
    } else {
      $('.toggleBtn').hide();
      $('.spinner2').show();
    }

    $('.recommendationContainer').hide();

    messageToNative('GA_EVENT_RECOMMENDATION', {
      category: 'extension',
      action: 'relevant_pages_reload',
      label: '',
    });
  } else if (event.name === 'BOOKMARK_SERVER_RESPONSE') {
    isSaving = false;
    const { page_id: pageId, index } = event.message;
    recommendedDocs[index].page_id = pageId;
  } else if (event.name === 'CANCEL_BOOKMARK_SERVER_RESPONSE') {
    isSaving = false;
    const { index } = event.message;
    recommendedDocs[index].page_id = undefined;
  } else if (event.name === 'TOGGLE_RELEVANT_PAGES') {
    isRPClosed = event.message.is_rp_closed;
    resetUI();
    addEvents();
  }
}

$(document).ready(function () {
  messageToNative('GA_PAGEVIEW', {
    path: '/liner-' + getBrowserName() + '-extension-recommendation',
  });

  // Luke - 아래 메세지를 통해서 popover 정보가 initialize됨
  // Luke - handleLocalMessage의 LOGIN_INIT으로 가며, 이렇게 하는 이유는 Firefox에서 browser.extension.getBackgroundPage()가 iframe에서 작동하지 않기 때문
  messageToNative('RELOAD_RECOMMENDATION_POPOVER', {});
});

function doLocalization() {
  $('.headerContainer .headerLabel .label').html(localize('People Also Read'));
  $('.headerContainer .headerLabel .documentCount').html(` (${recommendedDocs.length})`);

  $('.upgradeContainer .upgradeTitleLabel').html(localize('Premium Feature'));
  $('.upgradeContainer .upgradeDescLabel').html(
    localize('Get recommendations based on your last highlight.'),
  );
  $('.upgradeContainer .upgradeBtn').html(localize('Upgrade'));
}

function resetUI() {
  $('.recommendationContainer').html('');
  for (let i = 0; i < recommendedDocs.length; i++) {
    const doc = recommendedDocs[i];
    const { document_id: documentId, title, url } = doc;
    const host = url.split('://')[1].split('/')[0];
    $('.recommendationContainer').append(
      getRecommendedContentHTML(documentId, title, host, url, i),
    );
  }

  const isPremium = user.premium === 1;

  if (!isPremium && recommendedDocs.length > 1) {
    const recommendationConatinerUpgradeBtn = document.createElement('div');
    recommendationConatinerUpgradeBtn.classList.add('recommend-upgrade-btn');

    recommendationConatinerUpgradeBtn.style.position = 'absolute';
    recommendationConatinerUpgradeBtn.style.width = '90%';
    recommendationConatinerUpgradeBtn.style.left = '5%';
    recommendationConatinerUpgradeBtn.style.bottom = '15px';
    recommendationConatinerUpgradeBtn.style.backgroundColor = '#00bdb8';
    recommendationConatinerUpgradeBtn.style.borderRadius = '8px';
    recommendationConatinerUpgradeBtn.style.boxShadow = '0px 2px 4px 0px rgba(0, 0, 0, 0.2)';
    recommendationConatinerUpgradeBtn.style.cursor = 'pointer';

    recommendationConatinerUpgradeBtn.innerHTML = `
            <div class="recommend-upgrade-btn-text" style="padding: 8px; color: white; font-size: 12px; font-family: system-ui; text-align: center">
                ${localize('Upgrade and Unlock')}
            </div>
        `;

    recommendationConatinerUpgradeBtn.addEventListener('click', () => {
      window.open('https://dynamic-link.getliner.com/ems54', '_blank');
      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_be_ppl_also_read_blur_box_cta_upgrade',
        properties: {
          cta_a: 'Upgrade and Unlock',
          iteration_version: '2021_09_24',
        },
      });
    });

    const recommendationContainer = document.querySelector('.recommendationContainer');
    recommendationContainer.appendChild(recommendationConatinerUpgradeBtn);

    if (!isRPClosed) {
      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'view_be_ppl_also_read_blur_box',
        properties: {
          cta_a: 'Upgrade and Unlock',
          iteration_version: '2021_09_24',
        },
      });
    }
  }

  $('.toggleBtn').show();
  $('.spinner').hide();
  $('.spinner2').hide();
  $('.recommendationContainer').show();

  if (isRPClosed === true) {
    $('.headerContainer').addClass('open');
    $('.headerContainer .toggleBtn').removeClass('close').addClass('open');
    $('.recommendationContainer').hide();
    $('.upgradeContainer').hide();
  } else {
    $('.headerContainer').removeClass('open');
    $('.headerContainer .toggleBtn').removeClass('open').addClass('close');

    // if (user.premium == 1) {
    $('.recommendationContainer').show();
    $('.upgradeContainer').hide();
    // } else {
    //     $('.recommendationContainer').hide();
    //     $('.upgradeContainer').show();
    // }
  }
}

function getRecommendedContentHTML(documentId, title, host, url, index) {
  const isSaved = recommendedDocs[index].is_saved;

  const isPremium = user.premium === 1;
  const isBlurred = !isPremium && index >= 1;

  if (isBlurred) {
    return `
            <div class="recommendedContentContainer blurred" data-document-id="${documentId}" data-url="${url}" data-index="${index}">
                <p class="contentTitle">${title}</p>
                <p class="contentHost">${host}</p>  
                <div class="saveBtn ${
                  isSaved === true ? 'saved' : ''
                }" data-url="${url}" data-title="${title}" data-index="${index}"></div>
                <div class="recommendContentContainer-filter" style="width: 100%; height: 100%; background-color: transparent; -webkit-backdrop-filter: blur(${
                  index + 1
                }px); -moz-backdrop-filter: blur(${index + 1}px); -ms-backdrop-filter: blur(${
      index + 1
    }px); -o-backdrop-filter: blur(${index + 1}px); backdrop-filter: blur(${index + 1}px);"></div>
            </div>`;
  } else {
    return `
            <div class="recommendedContentDivider"></div>
            <div class="recommendedContentContainer" data-document-id="${documentId}" data-url="${url}" data-index="${index}">
                <p class="contentTitle">${title}</p>
                <p class="contentHost">${host}</p>  
                <div class="saveBtn ${
                  isSaved === true ? 'saved' : ''
                }" data-url="${url}" data-title="${title}" data-index="${index}"></div>
            </div>`;
  }
}

function addEvents() {
  $('.recommendedContentContainer').click(function (e) {
    e.stopPropagation();

    const isBlurred = e.target.classList.contains('recommendContentContainer-filter');
    if (isBlurred) {
      return;
    }

    const originalUrl = $(this)[0].dataset.url;
    const originalUrlObject = new URL(originalUrl);
    // const searchParams = new URLSearchParams(originalUrlObject.search);
    // searchParams.set('openLinerExtension', true);
    // const openWithLinerExtensionUrl = `${originalUrlObject.origin}${originalUrlObject.pathname}?${searchParams}`;
    const openWithLinerExtensionUrl = originalUrl;
    window.open(openWithLinerExtensionUrl);

    const urlDomain = originalUrlObject.hostname;
    const contentType =
      originalUrl.split('.pdf').length > 1 && originalUrl.split('.pdf')[1] === ''
        ? 'pdf'
        : 'web_page';

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_liner_page',
      properties: {
        url_domain: urlDomain,
        content_type: contentType,
        source_type: 'relevant',
        algorithm_id: recommendationMethod,
      },
    });

    let urlDomainSource;
    try {
      urlDomainSource = new URL(currentPage.url).hostname;
    } catch (e) {}

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_be_relevant_page_original_link',
      properties: {
        url_domain_source: urlDomainSource,
        url_domain_destination: urlDomain,
        content_type: contentType,
        algorithm_id: recommendationMethod,
      },
    });

    const title = $(this).find('.contentTitle').text();
    const listOrder = parseInt($(this)[0].dataset.index);

    messageToNative('LKS_EVENT', {
      type: 'doc_click',
      click_type: 'click',
      document: {
        title,
        url: originalUrl,
        list_order: listOrder,
        marked_by_liner: true,
      },
      access_type: 'recommend_by_highlight',
      access_method: recommendationMethod,
    });

    messageToNative('GA_EVENT_RECOMMENDATION', {
      category: 'extension',
      action: 'relevant_pages_click',
      label: '',
    });
  });

  $('.recommendedContentContainer .saveBtn').click(function (e) {
    e.stopPropagation();

    const index = $(this)[0].dataset.index;
    const title = $(this)[0].dataset.title;
    const url = $(this)[0].dataset.url;
    const keywords = recommendedDocs[index].keywords;

    if ($(this).hasClass('saved') === true) {
      if (isSaving === true) {
        return;
      }
      isSaving = true;

      const pageId = recommendedDocs[index].page_id;
      messageToNative('CANCEL_BOOKMARK', {
        page_id: pageId,
      });
      messageToNative('LKS_EVENT', {
        type: 'cancel_bookmark',
        recommendation_method: recommendationMethod,
        url,
      });
      messageToNative('GA_EVENT_RECOMMENDATION', {
        category: 'extension',
        action: 'relevant_pages_cancel_bookmark',
        label: '',
      });

      recommendedDocs[index].is_saved = false;
      $(this).removeClass('saved');
      return;
    }

    messageToNative('BOOKMARK', {
      title,
      url,
      index,
    });

    messageToNative('LKS_EVENT', {
      type: 'bookmark',
      recommendation_method: recommendationMethod,
      url,
      keywords,
    });

    messageToNative('GA_EVENT_RECOMMENDATION', {
      category: 'extension',
      action: 'relevant_pages_bookmark',
      label: '',
    });

    const urlDomain = new URL(url).hostname;
    const contentType =
      url.split('.pdf').length > 1 && url.split('.pdf')[1] === '' ? 'pdf' : 'web_page';

    let urlDomainSource;
    try {
      urlDomainSource = new URL(currentPage.url).hostname;
    } catch (e) {}

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_be_relevant_page_bookmark_button',
      properties: {
        url_domain_source: urlDomainSource,
        url_domain_destination: urlDomain,
        content_type: contentType,
        algorithm_id: recommendationMethod,
      },
    });

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'save_liner_page',
      properties: {
        url_domain: urlDomain,
        content_type: contentType,
        source_type: 'relevant',
        algorithm_id: recommendationMethod,
      },
    });

    recommendedDocs[index].is_saved = true;
    $(this).addClass('saved');
  });

  $('.toggleBtn')
    .off()
    .click(function (e) {
      e.stopPropagation();
      messageToNative('TOGGLE_RELEVANT_PAGES', {});
    });

  $('.headerContainer')
    .off()
    .click(function (e) {
      if ($(this).hasClass('open') === true) {
        e.stopPropagation();
        messageToNative('TOGGLE_RELEVANT_PAGES', {});
      }
    });

  $('.upgradeBtn').click(function (e) {
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_upgrade_flow_entry',
      properties: {
        wording: 'Upgrade',
        entry: 'be_relevant_pages',
      },
    });
  });
}
