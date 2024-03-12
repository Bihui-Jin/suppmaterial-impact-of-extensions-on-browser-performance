RULERS.html.form=RULERS.html.form||{},RULERS.html.form.toggle=({name:a,value:b,label:c,onChange:d})=>`
  <div
    ${d?`data-onchange="${d}"`:''}
    data-name="${a}"
    class="js_RULERS__form__toggle RULERS__form__field-container"
  >
    <input
      class="js_RULERS__form__input"
      name="${a}"
      type="checkbox"
      ${b?'checked':''}
      style="display:none"
    />
    <label>${c}</label>
    <div class="RULERS__form__field-wrapper">
      <div class="RULERS__form__field-input">
        <div class="RULERS__form__field-image">
          <img
            class="RULERS__form__field-image-check ${b?'':'RULERS__hidden'}"
            src="${chrome.runtime.getURL('img/icons/check.svg')}"
          />
        </div>
        <span class="RULERS__form__field__toggle__value-on ${b?'':'RULERS__hidden'}">
          ${chrome.i18n.getMessage('general_on')}
        </span>
        <span class="RULERS__form__field__toggle__value-off ${b?'RULERS__hidden':''}">
          ${chrome.i18n.getMessage('general_off')}
        </span>
      </div>
    </div>
  </div>
`;