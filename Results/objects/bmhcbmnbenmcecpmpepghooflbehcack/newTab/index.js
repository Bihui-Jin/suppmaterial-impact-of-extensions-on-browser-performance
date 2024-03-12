var browser = getBrowser();
var sidCookie = localStorage.getItem('sidCookie');

// Luke - 이름이 Page가 아니라 Tab이어야 하지만 Safari Extension에 맞춤. Porting 할 때 헷갈리지 않게 하기 위함
const getActivePage = (callback) => {
  browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) {
      getActivePage(callback);
      return;
    }
    callback(tabs[0]);
  });
};

const isNewTabOn = JSON.parse(localStorage.getItem('is_new_tab_on') ?? 'false');
const isUserLoggedIn = !!localStorage.getItem('sidCookie');

const initialThemeState = localStorage.getItem('liner-color-theme');

const observerForInitialLoad = new MutationObserver((mutations) => {
  mutations.forEach((mutationRecord) => {
    [...mutationRecord.addedNodes].forEach((node) => {
      const BODY_ELEM = document.querySelector('.LNewTabBg');

      if (node.classList?.contains('LNewTabSwitch')) {
        window.addEventListener('scroll', () => {
          if (window.scrollY >= 28 || window.pageYOffset >= 28) {
            node.style.display = 'none';
          } else {
            node.style.display = 'flex';
          }
        });
      }

      if (node.id === 'theme') {
        BODY_ELEM.classList.remove('LinerDarkMode');
        if (initialThemeState === 'light' || initialThemeState === null) {
          node.classList.remove('LinerDarkMode');
          BODY_ELEM.classList.remove('LinerDarkMode');
        } else {
          node.classList.add('LinerDarkMode');
          BODY_ELEM.classList.add('LinerDarkMode');
        }
      }

      if (node.classList?.contains('LNewTabHeader__colorThemeBtn')) {
        if (initialThemeState === 'light') {
          node.classList.remove('dark-mode-toggle');
        } else {
          node.classList.add('dark-mode-toggle');
        }
      }

      if (node.classList?.contains('darkModeImg')) {
        if (initialThemeState === 'light') {
          node.style.display = 'none';
        } else {
          node.style.display = 'block';
        }
      }

      if (node.classList?.contains('lightModeImg')) {
        if (initialThemeState === 'light') {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      }

      if (node.classList?.contains('MyHighlightsImg')) {
        if (initialThemeState === 'light') {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      }

      if (node.classList?.contains('communityImg')) {
        if (initialThemeState === 'light') {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      }

      if (node.classList?.contains('MyHighlightsImg') && node.classList?.contains('darkMode')) {
        if (initialThemeState === 'light') {
          node.style.display = 'none';
        } else {
          node.style.display = 'block';
        }
      }

      if (node.classList?.contains('communityImg') && node.classList?.contains('darkMode')) {
        if (initialThemeState === 'light') {
          node.style.display = 'none';
        } else {
          node.style.display = 'block';
        }
      }

      if (
        node.classList?.contains('MoreBtn__desktop__img') &&
        node.classList?.contains('darkMode')
      ) {
        if (initialThemeState === 'dark') {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      } else if (
        node.classList?.contains('MoreBtn__desktop__img') &&
        node.classList?.contains('lightMode')
      ) {
        if (initialThemeState === 'light') {
          node.style.display = 'block';
        } else {
          node.style.display = 'none';
        }
      }

      // Localization
      if (node.classList?.contains('LinerNewTabText')) {
        node.textContent = localize('LinerNewTabText');
      }
      if (node.classList?.contains('NewTabSwitchText')) {
        node.textContent = localize('NewTabSwitchText');
      }
      if (node.classList?.contains('moreRecommendationText')) {
        node.textContent = localize('moreRecommendationText');
      }
      if (node.classList?.contains('discoverHighlightingText')) {
        node.textContent = localize('discoverHighlightingText');
      }

      if (node.classList?.contains('searchPlaceholderText')) {
        node.placeholder = localize('searchPlaceholderText');
      }

      if (node.classList?.contains('LNewTabHeader__signUpBtn')) {
        if (sidCookie) {
          node.remove();
        }
      }
    });
  });
});

observerForInitialLoad.observe(document, {
  childList: true,
  subtree: true,
});

const AMP_VIEW_BELT_BANNER_NEW_TAB_PAGE = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'view_belt_banner_new_tab_page',
    properties: {},
  });
};

const AMP_CLICK_CLOSE_BUTTON_BELT_BANNER_NEW_TAB_PAGE = () => {
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'click_close_button_belt_banner_new_tab_page',
    properties: {},
  });
};

const checkIsValidHttpUrl = (string) => {
  var res = string.match(
    /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g,
  );
  return res !== null;
};

const renderNewTabBelt = () => {
  const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};
  const isNewTabBeltClosed = modalHandler['newTabBelt']?.isNewTabBeltClosed;
  if (isNewTabBeltClosed) return;

  const header = document.querySelector('.LNewTabHeader');
  if (header) {
    header.insertAdjacentHTML('beforebegin', createNewTabBelt());
    AMP_VIEW_BELT_BANNER_NEW_TAB_PAGE();
    addClickEventToNewTabBeltCloseBtn();
  }
};

const addClickEventToNewTabBeltCloseBtn = () => {
  const newTabBelt = document.querySelector('.LNewTabBelt');
  const newTabBeltCloseBtn = newTabBelt.querySelector('.LNewTabBelt__closeBtn');
  newTabBeltCloseBtn.addEventListener(
    'click',
    () => {
      const modalHandler = JSON.parse(localStorage.getItem('modal_handler')) || {};
      localStorage.setItem(
        'modal_handler',
        JSON.stringify({ ...modalHandler, ['newTabBelt']: { isNewTabBeltClosed: true } }),
      );
      newTabBelt.remove();
      AMP_CLICK_CLOSE_BUTTON_BELT_BANNER_NEW_TAB_PAGE();
    },
    {
      once: true,
    },
  );
};

const shuffleArray = (array) => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

const getEscapedString = (string) => {
  if (typeof string !== 'string') return string;
  return string
    ?.replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

document.addEventListener('DOMContentLoaded', () => {
  const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
  messageToNative('AMPLITUDE_EVENT', {
    event_name: 'view_be_new_tab_page',
    properties: {
      is_darkmode: isCheckThemeDark,
    },
  });

  // User Login
  sidCookie = localStorage.getItem('sidCookie');

  // href
  const PATH_COMMUNITY = 'https://getliner.com/for-you/community';
  const PATH_COMMUNITY_SIGNUP = 'https://getliner.com/signup?redirectUrl=/for-you/community';
  const PATH_FOR_YOU = 'https://getliner.com/for-you/articles';
  const PATH_FOR_YOU_SIGNUP = 'https://getliner.com/signup?redirectUrl=/for-you/articles';
  const PATH_FOR_YOU_RECOMMENDATIONS = 'https://getliner.com/for-you/articles';
  const PATH_FOR_YOU_RECOMMENDATIONS_SIGNUP =
    'https://getliner.com/signup?redirectUrl=/for-you/articles';

  // DarkMode
  const lightModeIcon = document.querySelector('.lightModeImg');
  const lightModeMoreIcon = document.querySelector('.MoreBtn__desktop__img.lightMode');
  const lightMyHighlightsIcon = document.querySelector('.MyHighlightsImg');
  const lightCommunityIcon = document.querySelector('.communityImg');

  const darkModeIcon = document.querySelector('.darkModeImg');
  const darkModeMoreIcon = document.querySelector('.MoreBtn__desktop__img.darkMode');
  const darkMyHighlightsIcon = document.querySelector('.MyHighlightsImg.darkMode');
  const darkCommunityIcon = document.querySelector('.communityImg.darkMode');
  const themeToggleBtn = document.querySelector('.LNewTabHeader__colorThemeBtn');
  const theme = document.getElementById('theme');
  const myHighlightsElem = document.querySelector('.Shortcut.myHighlights');
  const forYouElem = document.querySelector('.Shortcut.forYou');
  const moreBtnDesktop = document.querySelector('.MoreBtn__desktop');
  const moreBtnMobile = document.querySelector('.moreBtn__mobile.moreRecommendationText');

  // Element
  const BODY_ELEM = document.querySelector('.LNewTabBg');
  const isNewTabGuideShown = localStorage.getItem('isNewTabGuideShown') ?? false;
  const newTabSwitch = document.querySelector('.LNewTabSwitch');
  const newTabInfoBox = document.querySelector('.LNewTabSwitch__bubble');
  const toggleBgElem = document.querySelector('.LNewTabSwitch__toggle');
  const toggleDotElem = document.querySelector('.LNewTabSwitch__toggleCircle');
  const signupBtn = document.querySelector('.LNewTabHeader__signUpBtn');
  const form = document.querySelector('.LNewTabSearch__form');
  const inputElem = document.querySelector('.LNewTabSearch__input');
  // interest Elem
  const interestElem = document.querySelector('.LNewTabInterest');
  const mInterestMoreBtn = document.querySelector('.LNewTabInterest__moreBtn');
  const interestListWrapElem = document.querySelector('.LNewTabInterest__list');
  //
  const skeletonElem = document.querySelector('.LNewTab__Skeleton');
  const articleHeader = document.querySelector('.LNewTabRecommended__title');
  const forYouButton = document.querySelector('.LNewTabInterest__item');

  // title localization
  document.title = localize('New Tab');

  if (!isNewTabGuideShown) {
    newTabInfoBox.style.display = 'block';
    localStorage.setItem('isNewTabGuideShown', true);
  }

  // renderNewTabBelt();

  if (signupBtn) {
    signupBtn.addEventListener('click', () => {
      messageToNative('NEW_TAB', {
        url: 'https://getliner.com/signup',
      });
    });
  }

  myHighlightsElem.addEventListener('click', () => {
    const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_my_highlights_main_button_new_tab_page',
      properties: {
        is_darkmode: isCheckThemeDark,
      },
    });
  });

  forYouElem.addEventListener('click', () => {
    if (isUserLoggedIn) {
      window.location.href = PATH_COMMUNITY;
    } else {
      window.location.href = PATH_COMMUNITY_SIGNUP;
    }

    const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_community_button_new_tab_page',
      properties: {
        is_darkmode: isCheckThemeDark,
      },
    });
  });

  moreBtnDesktop.addEventListener('click', () => {
    if (isUserLoggedIn) {
      window.location.href = PATH_FOR_YOU;
    } else {
      window.location.href = PATH_FOR_YOU_SIGNUP;
    }
  });

  moreBtnMobile.addEventListener('click', () => {
    if (isUserLoggedIn) {
      window.location.href = PATH_FOR_YOU_RECOMMENDATIONS;
    } else {
      window.location.href = PATH_FOR_YOU_RECOMMENDATIONS_SIGNUP;
    }
  });

  const hideIcon = (elem) => {
    elem.style.display = 'none';
  };

  const showIcon = (elem) => {
    elem.style.display = 'block';
  };

  if (localStorage.getItem('liner-color-theme') === null) {
    localStorage.setItem('liner-color-theme', 'light');
    theme.classList.remove('LinerDarkMode');
    hideIcon(darkModeIcon);
    hideIcon(darkModeMoreIcon);
    hideIcon(darkMyHighlightsIcon);
    hideIcon(darkCommunityIcon);

    showIcon(lightModeIcon);
    showIcon(lightModeMoreIcon);
    showIcon(lightMyHighlightsIcon);
    showIcon(lightCommunityIcon);
  }

  themeToggleBtn.addEventListener('click', () => {
    const currentThemeState = localStorage.getItem('liner-color-theme') ?? 'light';
    const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');

    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_darkmode_button_new_tab_page',
      properties: {
        is_darkmode: !isCheckThemeDark,
      },
    });
    const shortcutFaviconImg = document.querySelectorAll('.Shortcut__faviconImg.add');

    if (currentThemeState === 'light') {
      localStorage.setItem('liner-color-theme', 'dark');

      theme.classList.add('LinerDarkMode');
      BODY_ELEM.classList.add('LinerDarkMode');
      hideIcon(lightModeIcon);
      hideIcon(lightModeMoreIcon);
      hideIcon(lightMyHighlightsIcon);
      hideIcon(lightCommunityIcon);

      showIcon(darkModeIcon);
      showIcon(darkModeMoreIcon);
      showIcon(darkMyHighlightsIcon);
      showIcon(darkCommunityIcon);
      shortcutFaviconImg.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzNCAzMS42NjY3IDE4LjMzMzQgMzAuOTE2NyAxOC4zMzM0IDMwVjIxLjY2NjdIMTBDOS4wODMzNyAyMS42NjY3IDguMzMzMzcgMjAuOTE2NyA4LjMzMzM3IDIwQzguMzMzMzcgMTkuMDgzNCA5LjA4MzM3IDE4LjMzMzQgMTAgMTguMzMzNEgxOC4zMzM0VjEwQzE4LjMzMzQgOS4wODMzNyAxOS4wODM0IDguMzMzMzcgMjAgOC4zMzMzN0MyMC45MTY3IDguMzMzMzcgMjEuNjY2NyA5LjA4MzM3IDIxLjY2NjcgMTBWMTguMzMzNEgzMEMzMC45MTY3IDE4LjMzMzQgMzEuNjY2NyAxOS4wODM0IDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0iI0MyQzZDRSIvPgo8L3N2Zz4K`;

      const shortcutElement = document.querySelectorAll('.Shortcut__favicon');
      shortcutElement.forEach((shortcut) => {
        shortcut.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.08)';
      });
    } else {
      localStorage.setItem('liner-color-theme', 'light');

      theme.classList.remove('LinerDarkMode');
      BODY_ELEM.classList.remove('LinerDarkMode');
      hideIcon(darkModeIcon);
      hideIcon(darkModeMoreIcon);
      hideIcon(darkMyHighlightsIcon);
      hideIcon(darkCommunityIcon);

      showIcon(lightModeIcon);
      showIcon(lightModeMoreIcon);
      showIcon(lightMyHighlightsIcon);
      showIcon(lightCommunityIcon);
      shortcutFaviconImg.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzMyAzMS42NjY3IDE4LjMzMzMgMzAuOTE2NyAxOC4zMzMzIDMwVjIxLjY2NjdIMTBDOS4wODMzNCAyMS42NjY3IDguMzMzMzQgMjAuOTE2NyA4LjMzMzM0IDIwQzguMzMzMzQgMTkuMDgzMyA5LjA4MzM0IDE4LjMzMzMgMTAgMTguMzMzM0gxOC4zMzMzVjEwQzE4LjMzMzMgOS4wODMzNCAxOS4wODMzIDguMzMzMzQgMjAgOC4zMzMzNEMyMC45MTY3IDguMzMzMzQgMjEuNjY2NyA5LjA4MzM0IDIxLjY2NjcgMTBWMTguMzMzM0gzMEMzMC45MTY3IDE4LjMzMzMgMzEuNjY2NyAxOS4wODMzIDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==`;
    }
  });

  // google search

  form.addEventListener('submit', onSubmit);
  inputElem.addEventListener('input', searchValue);
  inputElem.addEventListener('keydown', onKeyDownHandle);

  // 스위치

  newTabSwitch.style.display = 'flex';

  if (!isNewTabOn) {
    toggleBgElem.classList.remove('toggleOnBg');
    toggleDotElem.classList.remove('toggleOnDot');
    toggleBgElem.classList.add('toggleOffBg');
    toggleDotElem.classList.add('toggleOffDot');
  } else {
    toggleBgElem.classList.remove('toggleOffBg');
    toggleDotElem.classList.remove('toggleOffDot');
    toggleBgElem.classList.add('toggleOnBg');
    toggleDotElem.classList.add('toggleOnDot');
  }

  toggleBgElem.addEventListener('click', () => {
    const isNewTabOn = JSON.parse(localStorage.getItem('is_new_tab_on') ?? 'false');
    newTabInfoBox.style.display = 'none';

    const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
    if (isNewTabOn) {
      localStorage.setItem('is_new_tab_on', 'false');
      toggleBgElem.classList.remove('toggleOnBg');
      toggleDotElem.classList.remove('toggleOnDot');
      toggleBgElem.classList.add('toggleOffBg');
      toggleDotElem.classList.add('toggleOffDot');
      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_activation_toggle_new_tab_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          status_change: 'on_to_off',
        },
      });
    } else {
      localStorage.setItem('is_new_tab_on', 'true');
      toggleBgElem.classList.remove('toggleOffBg');
      toggleDotElem.classList.remove('toggleOffDot');
      toggleBgElem.classList.add('toggleOnBg');
      toggleDotElem.classList.add('toggleOnDot');
      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_activation_toggle_new_tab_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          status_change: 'off_to_on',
        },
      });
    }
  });

  // 즐겨찾기 - shortcut
  const shortcutOriginal =
    JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
  renderNewShortcut();

  // Edit Icon
  const shortcutFaviconElem = document.querySelectorAll('.Shortcut__favicon');
  shortcutFaviconElem.forEach((editIcon, index) => {
    editIcon.insertAdjacentHTML('afterend', createShortcutEditBtn(index));
  });

  // 즐겨찾기 - add버튼 클릭했을 때
  addEventsToShortcut();
  addEventToEditBtns();

  // 관심사 선택 - interest tag
  const onClickInterestBtn = () => {
    const isInterestWrapOpened = interestElem.classList.contains('open');
    if (isInterestWrapOpened) {
      // open 상태
      interestElem.classList.remove('open');
      interestElem.classList.add('close');
    } else {
      // closed 상태
      interestElem.classList.remove('close');
      interestElem.classList.add('open');
    }
  };
  mInterestMoreBtn.addEventListener('click', onClickInterestBtn);

  // 추천 - recommendations
  const recommendedArticle = () => {
    if (sidCookie) {
      Promise.all([
        getRecommendDocuments(NUM_OF_CONTENTS_LOADED),
        getTrendDocuments(NUM_OF_CONTENTS_LOADED),
      ]).then(([recommendDocument, trendDocument]) => {
        logViewAndHideSkeleton();

        const arrRecommendedItems = shuffleArray(recommendDocument?.items || []);
        const arrTrendItems = shuffleArray(trendDocument?.items || []);

        const addAlgorithmRecommended = arrRecommendedItems
          .filter((item) => item.image_url !== null)
          .map((recommendedItems) => ({
            ...recommendedItems,
            algorithm_id: recommendDocument?.method,
          }));

        const addAlgorithmTrend = arrTrendItems
          .filter((item) => item.image_url !== null)
          .map((trendItems) => ({
            ...trendItems,
            algorithm_id: trendDocument?.method,
          }));

        const contentItems = [...addAlgorithmRecommended, ...addAlgorithmTrend].slice(
          0,
          MAX_NUM_OF_CONTENTS_SHOWN,
        );
        renderAndAddEventToRecommended(contentItems, true);
      });
    } else {
      const longClickUrlList = JSON.parse(localStorage.getItem('long_click_url_list')) ?? [];

      Promise.all([
        // 해당 함수는 배열의 원소가 없으면 API를 호출하지 않음.
        lksPostRecommendationDocumentHistory(longClickUrlList),
        getPublicTrendDocuments(NUM_OF_CONTENTS_LOADED),
      ]).then(([recommendDocumentByLongClick, trendDocument]) => {
        logViewAndHideSkeleton();

        const arrRecommendedHistoryItems = shuffleArray(recommendDocumentByLongClick?.items || []);
        const arrTrendItems = shuffleArray(trendDocument?.items || []);

        const addAlgorithmRecommendedHistory = arrRecommendedHistoryItems
          .filter((item) => item.image_url !== null)
          .map((recommendedItems) => ({
            ...recommendedItems,
            algorithm_id: recommendDocumentByLongClick?.method,
          }));

        const addAlgorithmTrend = arrTrendItems
          .filter((item) => item.image_url !== null)
          .map((trendItems) => ({
            ...trendItems,
            algorithm_id: trendDocument?.method,
          }));

        const contentItems = [...addAlgorithmRecommendedHistory, ...addAlgorithmTrend].slice(
          0,
          MAX_NUM_OF_CONTENTS_SHOWN,
        );

        renderAndAddEventToRecommended(contentItems, false);
      });
    }
  };
  recommendedArticle();

  // 관심사 - forYou
  const AMP_CLICK_INTEREST_NEW_TAB_PAGE = (interestName) => {
    const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'click_interest_new_tab_page',
      properties: {
        is_darkmode: isCheckThemeDark,
        interest: interestName,
      },
    });
  };

  const clickForUBtn = (e) => {
    skeletonElem.style.display = 'flex';

    const interestItems = document.querySelectorAll('.LNewTabInterest__item');

    interestItems.forEach((interestItem) => {
      interestItem.classList.remove('select');
    });
    forYouButton.classList.add('select');

    const articleItems = [...document.querySelectorAll('.Recommended__list > article')];
    articleItems.forEach((articleItem) => {
      articleItem.remove();
    });

    articleHeader.textContent = localize('discoverHighlightingText');
    recommendedArticle();
    AMP_CLICK_INTEREST_NEW_TAB_PAGE('For You');
    return;
  };
  forYouButton.addEventListener('click', clickForUBtn);

  const unselectAllInterestItemsAndSelectCurrentInterest = (currentInterestItem) => {
    const interestItems = document.querySelectorAll('.LNewTabInterest__item');

    interestItems.forEach((interestItem) => {
      interestItem.classList.remove('select');
    });
    currentInterestItem.classList.add('select');
  };

  const changeNewTabRecommendedTitle = (currentInterestItem) => {
    const contentTitle = document.querySelector('.LNewTabRecommended__title');
    contentTitle.textContent = currentInterestItem.textContent;
  };

  const closeInterestWrapAndScrollToCurrentInterest = (currentInterestItem) => {
    const isInterestWrapOpened = interestElem.classList.contains('open');
    if (isInterestWrapOpened) {
      interestElem.classList.remove('open');
      interestElem.classList.add('close');

      interestListWrapElem.scrollTo(currentInterestItem.offsetLeft, 0);
    }
  };

  getInterests().then((interests) => {
    const userLanguage = getLanguage();

    interests.forEach((interest) => {
      const { id: interestId, codeName, imageUrl, localization } = interest;
      const interestName = localization[userLanguage] ?? codeName;

      interestListWrapElem.insertAdjacentHTML(
        'beforeend',
        createInterestItem(imageUrl, interestName),
      );

      const currentInterestItem = interestListWrapElem.lastElementChild;

      const onClickInterestItem = () => {
        AMP_CLICK_INTEREST_NEW_TAB_PAGE(interestName);

        unselectAllInterestItemsAndSelectCurrentInterest(currentInterestItem);
        changeNewTabRecommendedTitle(currentInterestItem);
        closeInterestWrapAndScrollToCurrentInterest(currentInterestItem);

        // 아티클 create & render
        if (isUserLoggedIn) {
          const userId = localStorage.getItem('userId');
          getUserInterestsArticle(userId, interestId).then((interestArticleData) => {
            if (!interestArticleData) {
              return;
            }
            const { items: interestArticleDataItems, method: algorithmId } = interestArticleData;
            const interestContentItems = interestArticleDataItems.filter(
              (interestArticles) => !!interestArticles.title,
            );

            interestContentItems.slice(0, 13).forEach((content) => {
              const { url, title, description } = content;
              const contentTitle = getEscapedString(title) || '';
              const contentDescription = getEscapedString(description) || '';
              const contentUrl = URLToolkit.buildAbsoluteURL(url, '')
                .split('//')[1]
                .replace('www.', '')
                .split('/')[0];

              const recommendedList = document.querySelector('.Recommended__list');
              if (recommendedList) {
                recommendedList.insertAdjacentHTML(
                  'beforeend',
                  createInterestsArticle(
                    content,
                    contentTitle,
                    contentDescription,
                    contentUrl,
                    codeName,
                  ),
                );
              }
            });

            skeletonElem.style.display = 'none';

            addClickBookmarkEvent();
            addClickArticleEvent(codeName, algorithmId);
          });
        } else {
          const browserLangs = window.navigator.language;
          getNonUserInterestsArticle(interestId, browserLangs).then((interestArticleData) => {
            if (!interestArticleData) {
              return;
            }
            const { items: interestArticleDataItems, method: algorithmId } = interestArticleData;
            const interestContentItems = interestArticleDataItems.filter(
              (interestArticles) => !!interestArticles.title,
            );

            interestContentItems.slice(0, 13).forEach((content) => {
              const { url, title, description } = content;
              const contentTitle = getEscapedString(title) || '';
              const contentDescription = getEscapedString(description) || '';
              const contentUrl = URLToolkit.buildAbsoluteURL(url, '')
                .split('//')[1]
                .replace('www.', '')
                .split('/')[0];

              const recommendedList = document.querySelector('.Recommended__list');
              if (recommendedList) {
                recommendedList.insertAdjacentHTML(
                  'beforeend',
                  createInterestsArticle(
                    content,
                    contentTitle,
                    contentDescription,
                    contentUrl,
                    codeName,
                  ),
                );
              }
            });

            skeletonElem.style.display = 'none';

            addClickBookmarkEvent();
            addClickArticleEvent(codeName, algorithmId);
          });
        }

        const articleWrapElem = [...document.querySelectorAll('.Recommended__list > article')];
        articleWrapElem.forEach((articles) => {
          articles.remove();
        });
        skeletonElem.style.display = 'flex';
      };

      currentInterestItem.addEventListener('click', onClickInterestItem);
    });
  });
});
