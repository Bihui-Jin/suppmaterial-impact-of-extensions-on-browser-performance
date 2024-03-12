RULERS.html.form=RULERS.html.form||{},RULERS.html.form.options=({name:a,label:b,options:c,onChange:d})=>`
  <div
    ${d?`data-onchange="${d}"`:''}
    class="js_RULERS__form__options RULERS__form__field-container"
    data-name="${a}"
  >
    <label>${b}</label>
    <div class="RULERS__form__field-wrapper">
      <div class="RULERS__form__field-options">
      ${c.map(({value:a,label:b,active:c})=>`
        <button
          class="RULERS__form__field-option ${c?`active`:''}"
          ${a?`data-value="${a}"`:''}
        >
          ${b}
        </button>
      `).join('')}
      </div>
    </div>
  </div>
`;