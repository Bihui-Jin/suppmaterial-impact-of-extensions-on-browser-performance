RULERS.html.storageFullModal=a=>`

<h1>${chrome.i18n.getMessage("storagefull_modal_title")}</h1>
<p>${chrome.i18n.getMessage("storagefull_modal_body")}</p>

<table>
  <tr>
    <th class="site">Website</th>
    <th class="file">File name</th>
    <th class="size">Size</th>
    <th class="delete"></th>
  </tr>
  ${a.map(a=>`
    <tr>
      <td class="site" title="${a.pageUrl}">
        ${a.pageUrl.replace("www.","")}
      </td>
      <td class="file" title="${a.originalName}">
        ${a.originalName}
      </td>
      <td class="size">
        ${a.readableFileSize}
      </td>
      <td class="delete" title="Delete this file">
        <button 
          data-url="${a.pageUrl}"
          class="js_RULERS__delete"
        >
        </button>
      </td>
    </tr>
  `).join("")}
</table>

<div class="RULERS_important" id="js_RULERS__warning">
  Clean up at least <span id="js_RULERS__space">0.0 KB</span>
</div>

<p>
  If you choose to ignore this warning, your design will not be stored. You will
  have to add it again next time.
</p>

<div class="RULERS_button-container">
  <button class="RULERS_button_secondary" id="js_RULERS__button_ignore">
    ${chrome.i18n.getMessage("modal_ignore")}
  </button>

  <button class="js_RULERS__form__closeBtn RULERS_button_cta" disabled id="js_RULERS__continue_btn">
    ${chrome.i18n.getMessage("general_continue")}
    <img class="RULERS_button_icon" src="${chrome.runtime.getURL("img/icons/arrow_purple.svg")}">
  </button>
</div>

`;