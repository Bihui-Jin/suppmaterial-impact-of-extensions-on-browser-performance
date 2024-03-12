RULERS.html.form=RULERS.html.form||{},RULERS.html.form.file=({name:a,label:b,placeholder:c,onChange:d,image:e,originalImageName:f})=>`
  <div
    ${d?`data-onchange="${d}"`:""}
    class="js_RULERS__form__file RULERS__form__field-container"
  >
    <input
      class="js_RULERS__form__input"
      name="${a}"
      type="file"
      style="display:none"
      value="${e?e:""}"
    />
    <label>${b}</label>
    <div class="RULERS__form__field-wrapper">
      <div class="RULERS__form__field-input RULERS__form__field-input--with-button">
        <img
          class="js_RULERS_design_upload_image RULERS__form__field-image ${e?"":"RULERS__hidden"}"
          src="${e||""}"
        />
        <span
          class="js_RULERS_design_upload_text"
          data-placeholder="${c}"
        >
          ${f?f:c}
        </span>
      </div>
      <button class="RULERS__form__field-button">
          <img
            class="RULERS__form__field-button__icon"
            data-delete="${chrome.runtime.getURL("img/icons/remove.svg")}"
            data-upload="${chrome.runtime.getURL("img/icons/upload.svg")}"
            src="${e?chrome.runtime.getURL("img/icons/remove.svg"):chrome.runtime.getURL("img/icons/upload.svg")}"
          />
      </button>
    </div >
  </div >
  `;