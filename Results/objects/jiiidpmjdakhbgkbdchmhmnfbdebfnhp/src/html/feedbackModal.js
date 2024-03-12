RULERS.html.feedbackModal=()=>`
  <div id="js_RULERS_modal_header" class="RULERS__modal__header">
    <h1>${chrome.i18n.getMessage('feedback_rating_title')}</h1>
    <p>${chrome.i18n.getMessage('feedback_rating_body')}</p>
  </div>

  <div id="js_RULERS_stars" class="RULERS__rating__stars">
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
    <div class="RULERS__rating__stars__half"></div>
  </div>

  <div id="js_RULERS_originalButton" class="RULERS_button-container">
    <button class="RULERS_button_secondary js_RULERS_button_later">
      ${chrome.i18n.getMessage('feedback_button_later')}
    </button>
    <button class="hidden"></button>
  </div>

  <div id="js_RULERS_rating_positive" class="RULERS__rating__result RULERS__rating__positive">
    <h1>${chrome.i18n.getMessage('feedback_positive_title')}</h1>
    <p>${chrome.i18n.getMessage('feedback_positive_body')}</p>

    <div class="RULERS_button-container">
      <button class="RULERS_button_secondary js_RULERS_button_later">
        ${chrome.i18n.getMessage('feedback_button_later')}
      </button>

      <button id="js_RULERS_button_cta_positive" class="RULERS_button_cta">
        ${chrome.i18n.getMessage('feedback_button_give')}
        <img class="RULERS_button_icon" src="${chrome.runtime.getURL('img/icons/arrow_purple.svg')}">
      </button>
    </div>
  </div>

  <div id="js_RULERS_rating_negative" class="RULERS__rating__result RULERS__rating__negative">
    <h1>${chrome.i18n.getMessage('feedback_negative_title')}</h1>
    <p>${chrome.i18n.getMessage('feedback_negative_body')}</p>

    <textarea
      class="RULERS__rating__result__input"
      id="js_RULERS_rating_input"
      placeholder="${chrome.i18n.getMessage('feedback_negative_placeholder')}"
    ></textarea>

    <div class="RULERS_button-container">
      <button class="RULERS_button_secondary js_RULERS_button_later">
        ${chrome.i18n.getMessage('feedback_button_later')}
      </button>

      <button id="js_RULERS_button_cta_negative" class="RULERS_button_cta">
        ${chrome.i18n.getMessage('feedback_button_send')}
        <img class="RULERS_button_icon" src="${chrome.runtime.getURL('img/icons/arrow_purple.svg')}">
      </button>
    </div>
  </div>

`;