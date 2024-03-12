const addClickBookmarkEvent = () => {
  const bookmarks = [...document.querySelectorAll('.RecommendedArticle__bookmark')];

  bookmarks.forEach((bookmark, index) => {
    bookmark.addEventListener('click', (e) => {
      e.preventDefault();
      if (sidCookie) {
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
};

const addClickArticleEvent = (algorithmId, interestCodeName) => {
  const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
  const articleLinkElem = document.querySelectorAll('.RecommendedArticle__Link');

  articleLinkElem.forEach((article) => {
    const clickInterestsArticle = () => {
      const isUserLoggedIn = !!localStorage.getItem('sidCookie');

      if (isUserLoggedIn) {
        messageToNative('REACT_TO_RECOMMENDATION', {
          url: article.href,
          react_type: 'click',
        });
      }

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_new_tab_liner_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          interest: interestCodeName,
        },
      });

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'click_liner_page',
        properties: {
          is_darkmode: isCheckThemeDark,
          algorithm_id: algorithmId,
          source_type: 'interest',
          interest: interestCodeName,
        },
      });
    };
    article.addEventListener('click', clickInterestsArticle);
  });
};
