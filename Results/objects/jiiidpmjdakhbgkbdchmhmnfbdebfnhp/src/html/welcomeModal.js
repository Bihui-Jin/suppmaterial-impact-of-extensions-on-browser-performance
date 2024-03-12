RULERS.html.welcomeModal=a=>{return`
    <h1>${chrome.i18n.getMessage("welcomemodal_title")}</h1>

    ${((...a)=>{5>a.length&&(a=[...a,...a]);let b=`<div id="RULERS_slideshow">`;return a.forEach(a=>{b+=`
        <div class="slide">
          <p>${chrome.i18n.getMessage(`welcomemodal_slide_${a}`)}</p>
          <div class="imageWrapper"><img src="${chrome.runtime.getURL(`img/screenshots/${a}.png`)}"/></div>
        </div>
      `}),b+=`</div>`,b})("design","distance","darkmode","grid")}

    <p>${chrome.i18n.getMessage("welcomemodal_description",[a])}</p>

    <div class="RULERS_button-container">
    
      <button class="RULERS_button_secondary">${chrome.i18n.getMessage("welcomemodal_button_moreinfo")}</button>
  
      <button class="RULERS_button_cta">
        ${chrome.i18n.getMessage("modal_close")}
        <img class="RULERS_button_icon" src="${chrome.runtime.getURL("img/icons/arrow_purple.svg")}">
      </button>

    </div>
  `};