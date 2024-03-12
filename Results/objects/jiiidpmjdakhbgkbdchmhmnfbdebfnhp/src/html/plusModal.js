RULERS.html.plusModal=a=>`
  <h1>${chrome.i18n.getMessage("plusmodal_title")}</h1>

  <div id="RULERS_slideshow">

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_infopanel")}</p>
      <div class="imageWrapper">
        <img class="alignRight" src="${chrome.runtime.getURL("img/screenshots/infopanel.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_distance")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/distance.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_design")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/design.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_grid")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/grid.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_infopanel")}</p>
      <div class="imageWrapper">
        <img class="alignRight" src="${chrome.runtime.getURL("img/screenshots/infopanel.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_distance")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/distance.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_design")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/design.png")}"/>
      </div>
    </div>

    <div class="slide">
      <p>${chrome.i18n.getMessage("plusmodal_slide_grid")}</p>
      <div class="imageWrapper">
        <img src="${chrome.runtime.getURL("img/screenshots/grid.png")}"/>
      </div>
    </div>

  </div>

  <p>${chrome.i18n.getMessage("plusmodal_description",[a])}</p>

  <div class="RULERS_button-container">

    <button class="RULERS_button_secondary">
      ${chrome.i18n.getMessage("plusmodal_button_no")}
    </button>

    <button class="RULERS_button_cta">
      ${chrome.i18n.getMessage("plusmodal_button_buy")}
      <img class="RULERS_button_icon" src="${chrome.runtime.getURL("img/icons/arrow_purple.svg")}">
    </button>

  </div>
    `;