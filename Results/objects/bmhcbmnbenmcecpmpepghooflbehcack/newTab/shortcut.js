const renderEditModal = () => {
  const shortcutSite = document.querySelector('.LNewTabShortcut__site');
  shortcutSite.insertAdjacentHTML('afterend', createEditModal());
};

const eraseEditModal = () => {
  const editModal = document.querySelector('.EditShortCut__modal__wrap');
  editModal?.remove();
};

const addEventsToShortcut = () => {
  const shortcutElem = document.querySelectorAll('.Shortcut__favicon');
  shortcutElem.forEach((shortcutBtn, index) => {
    // 즐겨찾기 버튼 클릭했을 때

    // 공통
    shortcutBtn.addEventListener('mouseenter', (e) => {
      shortcutBtn.style.transform = 'translate(0, -2px)';
      const editIcon = e.target.nextElementSibling;
      editIcon.addEventListener('mouseenter', (e) => {
        shortcutBtn.style.transform = 'translate(0, -2px)';
      });
    });

    shortcutBtn.addEventListener('mouseleave', (e) => {
      shortcutBtn.style.transform = 'translate(0, 0)';
      const editIcon = e.target.nextElementSibling;
      editIcon.addEventListener('mouseleave', (e) => {
        shortcutBtn.style.transform = 'translate(0, 0)';
      });
    });

    shortcutBtn.addEventListener('mouseenter', (e) => {
      const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
      if (isCheckThemeDark) {
        shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.32)';
        shortcutBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';

        const editIcon = e.target.nextElementSibling;
        editIcon.addEventListener('mouseenter', (e) => {
          shortcutBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        });
      } else {
        shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.16)';

        const editIcon = e.target.nextElementSibling;
        editIcon.addEventListener('mouseenter', (e) => {
          shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.16)';
        });
      }
    });

    shortcutBtn.addEventListener('mouseleave', (e) => {
      const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');
      if (isCheckThemeDark) {
        shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.2)';
        shortcutBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';

        const editIcon = e.target.nextElementSibling;
        editIcon.addEventListener('mouseleave', (e) => {
          shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.2)';
          shortcutBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
      } else {
        shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.08)';
        const editIcon = e.target.nextElementSibling;
        editIcon.addEventListener('mouseleave', (e) => {
          shortcutBtn.style.boxShadow = '0px 2px 20px rgba(0, 0, 0, 0.08)';
        });
      }
    });

    shortcutBtn.addEventListener('click', () => {
      const isNewShortcutBtn = shortcutBtn.classList.contains('add');
      if (isNewShortcutBtn) {
        renderEditModal();

        const isCheckThemeDark = document
          .getElementById('theme')
          .classList.contains('LinerDarkMode');
        messageToNative('AMPLITUDE_EVENT', {
          event_name: 'click_empty_favorite_url_new_tab_page',
          properties: {
            is_darkmode: isCheckThemeDark,
          },
        });

        // 로컬스토리지 가져오기
        const shortcutLocal =
          JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
        const shortcutInfo = shortcutLocal[index];

        // 닫기 버튼
        const modalCloseBtn = document.querySelector('.EditShortCut__modal__closeBtn');
        const modalCancelBtn = document.querySelector('.EditShortCut__modal__cancelBtn');
        modalCloseBtn.addEventListener('click', (e) => {
          e.preventDefault();
          eraseEditModal();
        });

        modalCancelBtn.addEventListener('click', (e) => {
          e.preventDefault();
          eraseEditModal();
        });

        // 입력 공간 (input)
        let urlInputUrl = document.querySelector('.EditShortCut__modal__input.url');
        let urlInputName = document.querySelector('.EditShortCut__modal__input.name');

        urlInputUrl.focus();

        // 즐겨찾기 URL
        const urlShortcutInputElem = document.querySelector('.EditShortCut__modal__input.url');
        urlShortcutInputElem.addEventListener('input', () => {
          const urlInputText = urlShortcutInputElem.value;
          let urlLength = urlInputText.length;
          const isPassedUrlForm = urlInputText.includes('www.') && urlInputText.includes('.com');
        });

        // 즐겨찾기 이름
        const nameShortcutInputElem = document.querySelector('.EditShortCut__modal__input.name');
        nameShortcutInputElem.addEventListener('input', () => {
          let nameInputText = nameShortcutInputElem.value;
          const nameLength = nameInputText.length;
          const countBoxElem = document.querySelector('.EditShortCut__modal__countBox');
          // const countElem = document.querySelector('.EditShortCut__modal__count');
          const errorMsgLength = document.querySelector(
            '.EditShortCut__modal__ErrorMsg.lengthName',
          );
        });

        urlInputUrl.addEventListener('input', () => {
          modalConfirmBtn.classList.add('success');
          const errorMsgURLForm = document.querySelector(
            '.EditShortCut__modal__ErrorMsg.urlFormat',
          );
          errorMsgURLForm.style.visibility = 'hidden';

          const urlInput = document.querySelector('.EditShortCut__modal__inputBox');
          urlInput.firstElementChild.classList.remove('error');
        });

        // 확인 버튼
        const modalConfirmBtn = document.querySelector('.EditShortCut__modal__submitBtn');
        modalConfirmBtn.addEventListener('click', (e) => {
          e.preventDefault();

          const isActiveConfirmBtn = modalConfirmBtn.classList.contains('success');

          let urlInputValue = document.querySelector('.EditShortCut__modal__input.url').value;
          const nameInputValue = document.querySelector('.EditShortCut__modal__input.name').value;

          const urlStartsWithHttpOrHttps =
            urlInputValue.startsWith('http://') || urlInputValue.startsWith('https://');
          if (!urlStartsWithHttpOrHttps) {
            urlInputValue = `https://${urlInputValue}`;
            modalConfirmBtn.classList.remove('success');
          }

          const isValidHttpUrl = checkIsValidHttpUrl(urlInputValue);
          if (!isValidHttpUrl) {
            const errorMsgURLForm = document.querySelector(
              '.EditShortCut__modal__ErrorMsg.urlFormat',
            );
            errorMsgURLForm.style.visibility = 'visible';

            const urlInput = document.querySelector('.EditShortCut__modal__inputBox');
            urlInput.firstElementChild.classList.add('error');
            return;
          }

          const shortcutOriginal =
            JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
          shortcutOriginal[index].url = urlInputValue;
          shortcutOriginal[index].name = nameInputValue;

          localStorage.setItem('linerShortcut', JSON.stringify(shortcutOriginal));

          eraseEditModal();

          const shortcuts = [...document.querySelectorAll('.Shortcut__list')];
          const selectedShortcut = shortcuts[index];

          const shortcutName = selectedShortcut.querySelector('.Shortcut__name');
          const shortcutFaviconBtn = selectedShortcut.querySelector('.Shortcut__favicon');
          const shortcutFaviconImg = selectedShortcut.querySelector('.Shortcut__faviconImg');

          shortcutName.textContent = nameInputValue;
          shortcutFaviconImg.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlInputValue}&size=256`;

          selectedShortcut.classList.remove('add');
          shortcutFaviconBtn.classList.remove('add');
          shortcutFaviconImg.classList.remove('add');
          shortcutName.classList.remove('add');

          messageToNative('AMPLITUDE_EVENT', {
            event_name: 'save_favorite_url_new_tab_page',
            properties: {
              is_darkmode: isCheckThemeDark,
              name: nameInputValue,
              url: new URL(urlInputValue).href,
              url_domain: new URL(urlInputValue).hostname,
            },
          });
        });
      } else {
        const shortcutOriginal =
          JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
        window.location.href = shortcutOriginal[index].url;

        const isCheckThemeDark = document
          .getElementById('theme')
          .classList.contains('LinerDarkMode');
        messageToNative('AMPLITUDE_EVENT', {
          event_name: 'click_favorite_url_new_tab_page',
          properties: {
            is_darkmode: isCheckThemeDark,
            name: shortcutOriginal[index].name,
            url_domain: new URL(shortcutOriginal[index].url).hostname,
            url: new URL(shortcutOriginal[index].url).href,
          },
        });
      }
    });
  });
};

const renderNewShortcut = () => {
  const shortcutOriginal =
    JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;

  shortcutOriginal.forEach((shortcut, index) => {
    const shortcutElem = document.querySelector('.LNewTabShortcut__site');
    shortcutElem.insertAdjacentHTML('beforeend', createShortcut(shortcut));

    const faviconElem = document.querySelectorAll('.Shortcut__favicon')[index];
    const faviconImgElem = document.querySelectorAll('.Shortcut__faviconImg')[index];
    const shortcutName = document.querySelectorAll('.Shortcut__name')[index];
    const shortcutList = document.querySelectorAll('.Shortcut__list')[index];

    if (shortcut.url === '' && shortcut.name === '') {
      const isLightMode = localStorage.getItem('liner-color-theme') === 'light';
      const addIconSrc = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzMyAzMS42NjY3IDE4LjMzMzMgMzAuOTE2NyAxOC4zMzMzIDMwVjIxLjY2NjdIMTBDOS4wODMzNCAyMS42NjY3IDguMzMzMzQgMjAuOTE2NyA4LjMzMzM0IDIwQzguMzMzMzQgMTkuMDgzMyA5LjA4MzM0IDE4LjMzMzMgMTAgMTguMzMzM0gxOC4zMzMzVjEwQzE4LjMzMzMgOS4wODMzNCAxOS4wODMzIDguMzMzMzQgMjAgOC4zMzMzNEMyMC45MTY3IDguMzMzMzQgMjEuNjY2NyA5LjA4MzM0IDIxLjY2NjcgMTBWMTguMzMzM0gzMEMzMC45MTY3IDE4LjMzMzMgMzEuNjY2NyAxOS4wODMzIDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==`;
      const addDarkIconSrc = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzNCAzMS42NjY3IDE4LjMzMzQgMzAuOTE2NyAxOC4zMzM0IDMwVjIxLjY2NjdIMTBDOS4wODMzNyAyMS42NjY3IDguMzMzMzcgMjAuOTE2NyA4LjMzMzM3IDIwQzguMzMzMzcgMTkuMDgzNCA5LjA4MzM3IDE4LjMzMzQgMTAgMTguMzMzNEgxOC4zMzM0VjEwQzE4LjMzMzQgOS4wODMzNyAxOS4wODM0IDguMzMzMzcgMjAgOC4zMzMzN0MyMC45MTY3IDguMzMzMzcgMjEuNjY2NyA5LjA4MzM3IDIxLjY2NjcgMTBWMTguMzMzNEgzMEMzMC45MTY3IDE4LjMzMzQgMzEuNjY2NyAxOS4wODM0IDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0iI0MyQzZDRSIvPgo8L3N2Zz4K`;

      faviconElem.classList.add('add');
      faviconImgElem.classList.add('add');
      shortcutName.classList.add('add');
      shortcutName.textContent = '';
      shortcutList.classList.add('add');

      if (isLightMode) {
        faviconImgElem.src = addIconSrc;
      } else {
        faviconImgElem.src = addDarkIconSrc;
      }
    }
  });
};

const addEventToEditBtns = () => {
  const editBtnElem = document.querySelectorAll('.Shortcut__editBtn');
  editBtnElem.forEach((editBtn, index) => {
    editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // const editModalWrap = document.querySelector('.EditShortCut__modal__wrap');
      // const infoShortcut = shortcutOriginal[index];

      renderEditModal();

      const shortcutLocal =
        JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
      const shortcutInfo = shortcutLocal[index];
      let urlInputUrl = document.querySelector('.EditShortCut__modal__input.url');
      let urlInputName = document.querySelector('.EditShortCut__modal__input.name');
      urlInputUrl.focus();

      urlInputUrl.value = shortcutInfo.url;
      urlInputName.value = shortcutInfo.name;

      // 삭제 버튼
      const modalBtnWrap = document.querySelector('.EditShortCut__modal__btnBox');
      const deleteShortcut = document.querySelector('.EditShortCut__modal__deleteBtn');
      if (urlInputUrl.value.length > 1) {
        modalBtnWrap.style.justifyContent = 'space-between';
        deleteShortcut.style.display = 'flex';
      } else {
        modalBtnWrap.style.justifyContent = 'flex-end';
        deleteShortcut.style.display = 'none';
      }

      deleteShortcut.addEventListener('click', () => {
        const shortcutOriginal =
          JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
        shortcutOriginal[index].url = '';
        shortcutOriginal[index].name = '';
        localStorage.setItem('linerShortcut', JSON.stringify(shortcutOriginal));

        const shortcuts = [...document.querySelectorAll('.Shortcut__list')];
        const selectedShortcut = shortcuts[index];

        const shortcutName = selectedShortcut.querySelector('.Shortcut__name');
        const shortcutFaviconBtn = selectedShortcut.querySelector('.Shortcut__favicon');
        const shortcutFaviconImg = selectedShortcut.querySelector('.Shortcut__faviconImg');

        shortcutName.textContent = '';

        const isLightMode = localStorage.getItem('liner-color-theme') === 'light';
        if (isLightMode) {
          shortcutFaviconImg.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzMyAzMS42NjY3IDE4LjMzMzMgMzAuOTE2NyAxOC4zMzMzIDMwVjIxLjY2NjdIMTBDOS4wODMzNCAyMS42NjY3IDguMzMzMzQgMjAuOTE2NyA4LjMzMzM0IDIwQzguMzMzMzQgMTkuMDgzMyA5LjA4MzM0IDE4LjMzMzMgMTAgMTguMzMzM0gxOC4zMzMzVjEwQzE4LjMzMzMgOS4wODMzNCAxOS4wODMzIDguMzMzMzQgMjAgOC4zMzMzNEMyMC45MTY3IDguMzMzMzQgMjEuNjY2NyA5LjA4MzM0IDIxLjY2NjcgMTBWMTguMzMzM0gzMEMzMC45MTY3IDE4LjMzMzMgMzEuNjY2NyAxOS4wODMzIDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+Cg==`;
        } else {
          shortcutFaviconImg.src = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTMwIDIxLjY2NjdIMjEuNjY2N1YzMEMyMS42NjY3IDMwLjkxNjcgMjAuOTE2NyAzMS42NjY3IDIwIDMxLjY2NjdDMTkuMDgzNCAzMS42NjY3IDE4LjMzMzQgMzAuOTE2NyAxOC4zMzM0IDMwVjIxLjY2NjdIMTBDOS4wODMzNyAyMS42NjY3IDguMzMzMzcgMjAuOTE2NyA4LjMzMzM3IDIwQzguMzMzMzcgMTkuMDgzNCA5LjA4MzM3IDE4LjMzMzQgMTAgMTguMzMzNEgxOC4zMzM0VjEwQzE4LjMzMzQgOS4wODMzNyAxOS4wODM0IDguMzMzMzcgMjAgOC4zMzMzN0MyMC45MTY3IDguMzMzMzcgMjEuNjY2NyA5LjA4MzM3IDIxLjY2NjcgMTBWMTguMzMzNEgzMEMzMC45MTY3IDE4LjMzMzQgMzEuNjY2NyAxOS4wODM0IDMxLjY2NjcgMjBDMzEuNjY2NyAyMC45MTY3IDMwLjkxNjcgMjEuNjY2NyAzMCAyMS42NjY3WiIgZmlsbD0iI0MyQzZDRSIvPgo8L3N2Zz4K`;
        }

        selectedShortcut.classList.add('add');
        shortcutFaviconBtn.classList.add('add');
        shortcutFaviconImg.classList.add('add');
        shortcutName.classList.add('add');

        eraseEditModal();
      });

      // 모달 input 조건 - url
      urlInputUrl.addEventListener('input', () => {
        modalConfirmBtn.classList.add('success');
        const errorMsgURLForm = document.querySelector('.EditShortCut__modal__ErrorMsg.urlFormat');
        errorMsgURLForm.style.visibility = 'hidden';

        const urlInput = document.querySelector('.EditShortCut__modal__inputBox');
        urlInput.firstElementChild.classList.remove('error');
      });

      // 모달 input 조건 - name
      urlInputName.addEventListener('input', () => {
        const nameValue = urlInputName.value;
        const nameLength = urlInputName.value.length;
        // const countElem = document.querySelector('.EditShortCut__modal__count');
        // countElem.textContent = nameLength;
      });

      // 모달 닫기 버튼
      const modalCloseBtn = document.querySelector('.EditShortCut__modal__closeBtn');
      const modalCancelBtn = document.querySelector('.EditShortCut__modal__cancelBtn');
      modalCloseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        eraseEditModal();
      });
      modalCancelBtn.addEventListener('click', (e) => {
        e.preventDefault();
        eraseEditModal();
      });

      // 모달 확인 버튼
      const modalConfirmBtn = document.querySelector('.EditShortCut__modal__submitBtn');
      modalConfirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let urlInputValue = document.querySelector('.EditShortCut__modal__input.url').value;
        let nameInputValue = document.querySelector('.EditShortCut__modal__input.name').value;

        // 에러 메세지
        const urlLength = urlInputValue.length;
        const nameLength = nameInputValue.length;

        const urlStartsWithHttpOrHttps =
          urlInputValue.startsWith('http://') || urlInputValue.startsWith('https://');
        if (!urlStartsWithHttpOrHttps) {
          urlInputValue = `https://${urlInputValue}`;
          modalConfirmBtn.classList.remove('success');
        }

        const isValidHttpUrl = checkIsValidHttpUrl(urlInputValue);
        if (!isValidHttpUrl) {
          const errorMsgURLForm = document.querySelector(
            '.EditShortCut__modal__ErrorMsg.urlFormat',
          );
          errorMsgURLForm.style.visibility = 'visible';

          const urlInput = document.querySelector('.EditShortCut__modal__inputBox');
          urlInput.firstElementChild.classList.add('error');

          return;
        }

        const shortcutOriginal =
          JSON.parse(localStorage.getItem('linerShortcut')) ?? defaultShortcutOriginal;
        shortcutOriginal[index].url = urlInputValue;
        shortcutOriginal[index].name = nameInputValue;

        localStorage.setItem('linerShortcut', JSON.stringify(shortcutOriginal));

        const shortcuts = [...document.querySelectorAll('.Shortcut__list')];
        const selectedShortcut = shortcuts[index];

        const shortcutName = selectedShortcut.querySelector('.Shortcut__name');
        const shortcutFaviconImg = selectedShortcut.querySelector('.Shortcut__faviconImg');

        shortcutName.textContent = nameInputValue;
        shortcutFaviconImg.src = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${urlInputValue}&size=256`;

        eraseEditModal();
      });
    });
  });
};
