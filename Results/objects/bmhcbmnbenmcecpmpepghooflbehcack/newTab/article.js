const logViewAndHideSkeleton = () => {
  const skeletonElem = document.querySelector('.LNewTab__Skeleton');
  const skeletonInterestElem = document.querySelector('.Skelton__interestWrap');
  skeletonElem.style.display = 'none';
  skeletonInterestElem.style.display = 'none';
};

const renderAndAddEventToRecommended = (contentItems, isLoggedIn) => {
  const recommendedListElem = document.querySelector('.Recommended__list');
  recommendedListElem.addEventListener(
    'error',
    (e) => {
      const isLightMode = localStorage.getItem('liner-color-theme') === 'light';
      if (e.target.classList.contains('RecommendedArticle__Thumbnail')) {
        e.target.src = RANDOM_THUMBNAIL[getRandomCount()];
      } else {
        e.target.src = isLightMode ? DEFAULT_FAVICON_LIGHT : DEFAULT_FAVICON_DARK;
      }
    },
    { capture: true },
  );

  recommendedListElem.addEventListener(
    'load',
    (e) => {
      const isTargetThumbnail = e.target.classList.contains('RecommendedArticle__Thumbnail');
      const isTargetFavicon = e.target.classList.contains('RecommendedArticle__favicon');
      if (isTargetThumbnail || isTargetFavicon) {
        e.target.style.display = 'block';
      }
    },
    { capture: true },
  );

  contentItems.map((content) => {
    const { url, title, description } = content;
    const contentTitle = getEscapedString(title) || '';
    const contentDescription = getEscapedString(description) || '';
    const contentUrl = URLToolkit.buildAbsoluteURL(url, '')
      .split('//')[1]
      .replace('www.', '')
      .split('/')[0];

    if (recommendedListElem) {
      recommendedListElem.insertAdjacentHTML(
        'beforeend',
        createRecommendedArticle(content, contentTitle, contentDescription, contentUrl),
      );
    }
  });

  const bookmarks = document.querySelectorAll('.RecommendedArticle__bookmark');

  bookmarks.forEach((bookmark, index) => {
    bookmark.addEventListener('click', (e) => {
      e.preventDefault();
      if (isLoggedIn) {
        const {
          dataset: { pageId },
        } = bookmark;
        if (pageId) {
          //취소
          putPage([pageId], 0, 2, function () {
            bookmark.removeAttribute('data-page-id');

            const emptyBookmarkIcon = bookmark.children[0];
            const DarkBookmarkIcon = bookmark.children[1];
            const FillBookmarkIcon = bookmark.children[2];
            // 클릭 시 아이콘 Fill
            FillBookmarkIcon.style.display = 'none';
            emptyBookmarkIcon.style.display = 'block';
          });
        } else {
          // 클릭
          const url = bookmark.nextElementSibling.href;
          const title = bookmark.parentElement.querySelector('h1').textContent.trim();
          const bookmarkDocument = {
            title,
            url,
            list_order: index,
            marked_by_liner: false,
          };
          const todayDateTime = getDateString(new Date());

          postPages(title, url, '', 'W10=', navigator.language, todayDateTime, function (json) {
            const { status, reason, pageId, scrapCount, activeDayCount } = json;

            const getUrlDomain = () => {
              try {
                return new URL(url).hostname;
              } catch {
                return null;
              }
            };

            const amplitudeProperties = {
              url_domain: getUrlDomain(),
              content_type: 'web_page',
              area_type: 'liner_new_tab',
              active_page_count: scrapCount,
              active_day_count: activeDayCount,
            };

            messageToNative('HANDLE_SAVE_WEB_PAGE_EVENT', {
              status,
              reason,
              amplitudeProperties,
            });

            const isAuthError = status === 'error' && reason === 'not_auth';
            if (isAuthError) {
              messageToNative('NEW_TAB', {
                url: 'https://getliner.com/signup',
              });
              return;
            }

            if (status === 'success') {
              try {
                const userId = localStorage.getItem('userId');
                lksDocCreate(+userId ?? 0, bookmarkDocument, null, null, () => {});
              } catch {}

              messageToNative('REACT_TO_RECOMMENDATION', {
                url,
                react_type: 'scrap',
              });

              bookmark.dataset.pageId = pageId;

              const emptyBookmarkIcon = bookmark.children[0];
              const DarkBookmarkIcon = bookmark.children[1];
              const FillBookmarkIcon = bookmark.children[2];
              // 클릭 시 아이콘 Fill
              FillBookmarkIcon.style.display = 'block';
              emptyBookmarkIcon.style.display = 'none';
            }
          });
        }
      } else {
        messageToNative('NEW_TAB', {
          url: 'https://getliner.com/signup',
        });
      }
    });
  });

  const items = document.querySelectorAll('.RecommendedArticle__Link');
  items.forEach((item) => {
    const algorithmId = item.dataset.algorithmId;
    const trendArticle = algorithmId.includes('TB');
    const checkAlgorithm = trendArticle ? 'trend' : 'recommended';

    item.addEventListener('click', function (e) {
      const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');

      if (isUserLoggedIn) {
        messageToNative('REACT_TO_RECOMMENDATION', {
          url: item.href,
          react_type: 'click',
        });
      }

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_new_tab_liner_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          interest: 'For You',
        },
      });

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_liner_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          algorithm_id: algorithmId,
          source_type: checkAlgorithm,
          interest: 'For You',
        },
      });
    });
  });
};
