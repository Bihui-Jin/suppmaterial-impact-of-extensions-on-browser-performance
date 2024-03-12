RULERS.html.form=RULERS.html.form||{},RULERS.html.form.text=({name:a,label:b,min:c,max:d,value:e,unit:f,type:i='text',disabled:g,onChange:h})=>`
  <div
    ${h?`data-onchange="${h}"`:''}
    class="js_RULERS__form__text RULERS__form__field-container"
  >
    <label>
      ${b}
    </label>

    <div class="RULERS__form__field-wrapper">
      <input
        class="js_RULERS__form__input"
        ${a?`name="${a}"`:''}
        ${i?`type="${i}"`:''}
        ${c?`min="${c}"`:''}
        ${d?`max="${d}"`:''}
        ${e?`value="${e}"`:''}
        ${g?`disabled`:''}
      />

      ${f?`<div class="RULERS__form__field-unit">${f}</div>`:''}
    </div>
  </div>
`;