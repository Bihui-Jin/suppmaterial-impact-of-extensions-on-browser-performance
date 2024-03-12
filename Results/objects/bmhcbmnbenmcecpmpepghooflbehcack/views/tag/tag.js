const maxTagContainerHeight = 152;
let myTags = [];
let suggestions = [];
let lastInput = '';
let addedTags = [];

function handleLocalMessage(event) {
  if (event.name == 'TAG_POPOVER_INIT') {
    myTags = event.message.tags;
    addedTags = event.message.added_tags;

    doLocalization();
    resetUI();
    addEvents();
  } else if (event.name == 'TAG_INPUT_CHANGE') {
    $('.errorContainer').hide();
    const newInput = event.message.input.trim().toLowerCase();
    lastInput = newInput;
    if (newInput == '') {
      suggestions = [];
      resetSuggestedTagsUI(newInput);
    }
    resetMyTagsUI(newInput);
    resetCreateTagBtn(newInput);
    resetTagContainerHeight(newInput);
  } else if (event.name == 'TAG_AUTOCOMPLETE') {
    const newInput = event.message.input.trim().toLowerCase();
    suggestions = event.message.suggestions.items
      .filter((suggestedTag) => {
        let isNotInMyTags = true;
        myTags.forEach((myTag) => {
          if (myTag.title == suggestedTag) {
            isNotInMyTags = false;
          }
        });
        addedTags.forEach((addedTag) => {
          if (addedTag.title == suggestedTag) {
            isNotInMyTags = false;
          }
        });
        return isNotInMyTags;
      })
      .slice(0, 5);

    if (suggestions.length == 0) {
      $('.suggestedTagContainer').hide();

      if (isInMyTags(newInput) && isMyTagsEmpty()) {
        $('.errorContainer').show();
      }
    } else {
      $('.suggestedTagContainer').show();
      resetSuggestedTagsUI(newInput);
    }
    resetTagContainerHeight(newInput);
  } else if (event.name == 'SHOW_TAG') {
    doLocalization();
    myTags = event.message.my_tags;
    addedTags = event.message.added_tags;
    const input = event.message.input;
    resetTagContainerHeight(input);
  } else if (event.name == 'HIDE_TAG') {
    resetUI();
  } else if (event.name == 'ADD_TAG_TO_PAGE') {
    const { tags, added_tag: addedTagObj, source } = event.message;
    myTags = tags;
    addedTags.push(addedTagObj);
    suggestions = [];
    resetUI();
  } else if (event.name == 'ALREADY_TAGGED') {
    const isErrorContainerVisible = $('.errorContainer').is(':visible');
    if (!isErrorContainerVisible) {
      $('.errorContainer').show();
      setTimeout(function () {
        $('.errorContainer').hide();
      }, 3000);
    }
  } else if (event.name == 'DELETE_TAG_FROM_PAGE') {
    const { deleted_tag_id: deletedTagId, new_tags: newAddedTags } = event.message;
    addedTags = newAddedTags;
  }
}

function isInMyTags(tagTitle) {
  const isInMyTags = myTags.some((myTag) => {
    if (myTag.title == tagTitle.trim()) {
      return true;
    }
  });
  return isInMyTags;
}

function resetCreateTagBtn(searchKeyword) {
  if (searchKeyword != '' && !isInMyTags(searchKeyword)) {
    $('.createTagBtn').html(
      localize('Create #tagname').replace(
        '#tagname',
        `<span data-tag-title="${searchKeyword}">${searchKeyword}</span>`,
      ),
    );
    $('.createTagContainer').show();
  } else {
    $('.createTagContainer').hide();
  }

  addCreateTagClickEvent();
}

function isMyTagsEmpty() {
  return $('.myTagContainer .tags').html().trim() == '';
}

function isSuggestionsEmpty() {
  return $('.suggestedTagContainer .tags').html().trim() == '';
}

function checkMyTagsAndSuggestionsEmpty() {
  return isMyTagsEmpty() && isSuggestionsEmpty();
}

function resetTagContainerHeight(searchKeyword) {
  if (searchKeyword == undefined && checkMyTagsAndSuggestionsEmpty()) {
    messageToNative('HIDE_TAG', {});
    return;
  }

  if (searchKeyword != undefined && checkMyTagsAndSuggestionsEmpty()) {
    resetUI(searchKeyword);
    return;
  }

  let tagContainerHeight = getTagContainerContentHeight();
  if (tagContainerHeight > maxTagContainerHeight) {
    tagContainerHeight = maxTagContainerHeight;
  }
  if (tagContainerHeight == 0) {
    setTimeout(function () {
      resetTagContainerHeight(searchKeyword);
    }, 50);
    return;
  }
  const tagIframePadding = 0;
  messageToNative('CHANGE_POPOVER_HEIGHT', {
    height: tagContainerHeight + tagIframePadding,
    popover_class: 'liner-popover-tag',
  });
}

function getTagContainerContentHeight() {
  return (
    $('.myTagContainer')[0].scrollHeight +
    $('.suggestedTagContainer')[0].scrollHeight +
    $('.createTagContainer')[0].scrollHeight
  );
}

$(document).ready(function () {
  messageToNative('GA_PAGEVIEW', {
    path: '/liner-' + getBrowserName() + '-extension-tag',
  });

  // Luke - 아래 메세지를 통해서 popover 정보가 initialize됨
  // Luke - handleLocalMessage의 LOGIN_INIT으로 가며, 이렇게 하는 이유는 Firefox에서 browser.extension.getBackgroundPage()가 iframe에서 작동하지 않기 때문
  messageToNative('TAG_POPOVER_INIT', {});
});

function doLocalization() {
  $('.myTagContainer .titleLabel').html(localize('My Tags'));
  $('.suggestedTagContainer .titleLabel').html(localize('Suggestions'));
  $('.errorContainer .errorLabel').html(localize('Already tagged'));
}

function resetUI(searchKeyword) {
  $('.errorContainer').hide();
  resetMyTagsUI(searchKeyword);
  $('.suggestedTagContainer').hide();
  if (!searchKeyword) {
    $('.createTagContainer').hide();
  }
  window.scrollTo(0, 0);
}

function addEvents() {
  addTagClickEvent();
  addCreateTagClickEvent();
}

function addCreateTagClickEvent() {
  $('.createTagBtn')
    .off()
    .click(function (e) {
      const tagTitle = $('.createTagBtn span')[0].dataset.tagTitle;
      messageToNative('ADD_TAG_TO_PAGE', {
        tag_title: tagTitle,
        source: 'create_btn',
      });
    });
}

function addTagClickEvent() {
  $('.tag')
    .off()
    .click(function (e) {
      const tagTitle = $(this)[0].dataset.tagTitle;
      const tagId = $(this)[0].dataset.tagId;
      const isSuggestedTag = tagId == 0 ? true : false;

      messageToNative('ADD_TAG_TO_PAGE', {
        tag_title: tagTitle,
        source: isSuggestedTag ? 'suggestion' : 'my_tag',
      });

      messageToNative('AMPLITUDE_EVENT', {
        event_name: 'select_autocomplete_tag',
        properties: {
          source_type: isSuggestedTag ? 'recommended' : 'my_tag',
        },
      });
    });
}

function resetMyTagsUI(searchKeyword) {
  $('.myTagContainer .tags').html('');
  $('.myTagContainer').show();

  if (searchKeyword && searchKeyword != '') {
    myTags.forEach((myTag) => {
      let isNotAddedTag = true;
      addedTags.forEach((addedTag) => {
        if (addedTag.title == myTag.title) {
          isNotAddedTag = false;
        }
      });
      if (isNotAddedTag) {
        $('.myTagContainer .tags').append(getBoldTagHTML(myTag, searchKeyword));
      }
    });
  } else {
    myTags.forEach((myTag) => {
      let isNotAddedTag = true;
      addedTags.forEach((addedTag) => {
        if (addedTag.title == myTag.title) {
          isNotAddedTag = false;
        }
      });

      if (isNotAddedTag) {
        $('.myTagContainer .tags').append(
          `<div class="tag" data-tag-id="${myTag.id}" data-tag-title="${myTag.title}">${myTag.title}</div>`,
        );
      }
    });
  }

  if (isMyTagsEmpty()) {
    $('.myTagContainer').hide();
  }

  addTagClickEvent();
}

function resetSuggestedTagsUI(searchKeyword) {
  $('.suggestedTagContainer .tags').html('');

  if (searchKeyword && searchKeyword != '') {
    suggestions.forEach((suggestion) => {
      const tagObject = {
        id: 0,
        title: suggestion,
      };

      let isNotAddedTag = true;
      addedTags.forEach((addedTag) => {
        if (addedTag.title == tagObject.title) {
          isNotAddedTag = false;
        }
      });
      if (isNotAddedTag) {
        $('.suggestedTagContainer .tags').append(getBoldTagHTML(tagObject, searchKeyword));
      }
    });
  }

  if (isSuggestionsEmpty()) {
    $('.suggestedTagContainer').hide();
  }

  addTagClickEvent();
}

function getBoldTagHTML(tagObject, searchKeyword) {
  const tagTitle = tagObject.title;
  const tagId = tagObject.id;
  const keyword = searchKeyword.trim();

  if (keyword != '' && tagTitle.indexOf(keyword) == 0) {
    // Luke - keyword match
    return `<div class="tag" data-tag-id="${tagId}" data-tag-title="${tagTitle}">${tagTitle.slice(
      0,
      keyword.length,
    )}<span style="font-weight: bold;">${tagTitle.slice(
      keyword.length,
      tagTitle.length,
    )}</span></div>`;
  }
  return '';
}
