let autoCompleteIndex = -1; // -1은 focus가 input에 있을 때
var keyword = '';

const onSubmit = (e) => {
  e.preventDefault();
  const input = document.querySelector('.LNewTabSearch__input');
  const value = input.value;
  const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');

  const isAutoCompletedQuery = !!document.querySelector('.focusAutoKeyword');

  if (value.length === 0) return;

  if (isAutoCompletedQuery) {
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'make_google_search_new_tab_page',
      properties: {
        is_darkmode: isCheckThemeDark,
        search_keyword: value,
        is_autocomplete_query: true,
      },
    });
  } else {
    messageToNative('AMPLITUDE_EVENT', {
      event_name: 'make_google_search_new_tab_page',
      properties: {
        is_darkmode: isCheckThemeDark,
        search_keyword: value,
        is_autocomplete_query: false,
      },
    });
  }

  window.location.href = `https://google.com/search?q=${encodeURIComponent(value)}`;
  return false;
};

const onKeyDownHandle = (e) => {
  const { keyCode } = e;

  const inputElem = document.querySelector('.LNewTabSearch__input');
  const typedValue = inputElem.value;
  const autoCompleteLists = [...document.querySelectorAll('.autoComplete__list')];

  const pressDown = keyCode === KEY_CODE_ARROW_DOWN;
  const pressUp = keyCode === KEY_CODE_ARROW_UP;

  if (pressDown) {
    if (autoCompleteIndex === -1 && keyword === '') {
      // focus 밖으로 focus가 이동됐을 때 기존 검색어로 돌아간다.
      keyword = typedValue;
    }
    autoCompleteIndex++;

    if (autoCompleteLists[autoCompleteIndex]) {
      inputElem.value = autoCompleteLists[autoCompleteIndex]?.innerText;
    }
  } else if (pressUp) {
    autoCompleteIndex--;
    if (autoCompleteLists[autoCompleteIndex]) {
      inputElem.value = autoCompleteLists[autoCompleteIndex]?.innerText;
    }
    if (autoCompleteIndex < 0) {
      inputElem.value = keyword;
    }
  }

  autoCompleteLists.forEach((autoCompleteElem) => {
    autoCompleteElem.classList.remove('focusAutoKeyword');
  });

  if (autoCompleteIndex < 0) {
    autoCompleteIndex = -1;
    return;
  } else if (autoCompleteIndex >= autoCompleteLists.length) {
    autoCompleteIndex = autoCompleteLists.length;
    return;
  }

  const focusedElement = autoCompleteLists[autoCompleteIndex];
  focusedElement.classList.add('focusAutoKeyword');
};

// google search autoComplete
const searchValue = () => {
  autoCompleteIndex = -1;
  const inputElem = document.querySelector('.LNewTabSearch__input');
  const typedValue = inputElem.value;

  // 자동완성 보여주기
  const desktopAutoCompleteElem = document.querySelector('.LNewTabSearch__autoComplete.desktop');
  desktopAutoCompleteElem.style.display = 'flex';

  if (typedValue.length === 0) {
    desktopAutoCompleteElem.style.display = 'none';
  }

  if (typedValue.trim() === '') {
    const autoCompleteLists = [...document.querySelectorAll('.autoComplete__list')];
    autoCompleteLists.forEach((list) => {
      list.remove();
    });
    return;
  }

  const checkLanguage = getLanguage();

  getGoogleAutoComplete(checkLanguage, typedValue).then((autoCompleteKeyword) => {
    const autoKeywordXMLData = autoCompleteKeyword;
    const xmlParser = new DOMParser();
    const searchJSONData = xmlParser.parseFromString(autoKeywordXMLData, 'text/xml');
    const autoKeywordElem = [...searchJSONData.querySelectorAll('suggestion')];
    const autoCompleteElem = document.querySelector('.LNewTabSearch__autoComplete');

    if (autoKeywordElem.length >= 1) {
      const autoCompleteLists = [...document.querySelectorAll('.autoComplete__list')];
      autoCompleteLists.forEach((list) => {
        list.remove();
      });
    }

    autoKeywordElem.reverse().forEach((autoKeywordElem) => {
      const completeKeyword = autoKeywordElem.getAttribute('data');
      autoCompleteElem.insertAdjacentHTML('afterbegin', createAutoComplete(completeKeyword));
    });

    const inputLists = document.querySelectorAll('.autoComplete__list');
    inputLists.forEach((autoSearchKeywords) => {
      // 자동검색어 클릭 시 검색 이동
      autoSearchKeywords.addEventListener('click', (e) => {
        e.preventDefault();
        const autoKeyword = e.target.textContent.trim();
        const isCheckThemeDark = document
          .getElementById('theme')
          .classList.contains('LinerDarkMode');

        messageToNative('AMPLITUDE_EVENT', {
          event_name: 'make_google_search_new_tab_page',
          properties: {
            is_darkmode: isCheckThemeDark,
            search_keyword: autoKeyword,
            is_autocomplete_query: true,
          },
        });

        window.location.href = `https://google.com/search?q=${encodeURIComponent(autoKeyword)}`;
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('mousedown', (e) => {
    const isClickInsideSearch =
      e.target.closest('.LNewTabSearch__autoComplete') || e.target.closest('.LNewTabSearch__input');
    const desktopAutoCompleteElem = document.querySelector('.LNewTabSearch__autoComplete.desktop');
    if (!!isClickInsideSearch === false) {
      desktopAutoCompleteElem.style.display = 'none';
    }
  });

  window.addEventListener('keydown', (e) => {
    const isWindowBookmarkShortcutPressed = e.ctrlKey && e.shiftKey && e.keyCode === 66;
    const isMacBookmarkShortcutPressed = e.metaKey && e.shiftKey && e.keyCode === 66;

    if (isWindowBookmarkShortcutPressed || isMacBookmarkShortcutPressed) {
      const isCheckThemeDark = document.getElementById('theme').classList.contains('LinerDarkMode');

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'press_bookmark_bar_shortcut_new_tab_page',
        properties: {
          is_darkmode: isCheckThemeDark,
        },
      });
    }
  });
});
