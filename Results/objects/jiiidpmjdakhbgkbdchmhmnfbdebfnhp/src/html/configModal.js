RULERS.html.configModal=()=>{const a=a=>{if(!a)return"";return a&&!RULERS.plus.isPlus()?"RULERS__plus-only":a&&RULERS.plus.isPlus()?"":void 0};return`

<!-- START OF SETTINGS SECTION -->
<section class="RULERS__config-modal__settings">
  <h1>${chrome.i18n.getMessage("settings_header")}</h1>

  <div class="RULERS__config-modal__columns">
    <section>
      ${RULERS.html.form.text({label:chrome.i18n.getMessage("settings_ruler_width"),max:200,min:10,name:"config-ruler-width",type:"number",unit:"px",value:RULERS.settings.rulerWidth,onChange:"config.changeRulerWidth"})}
    </section>
    <section>
      ${RULERS.html.form.text({label:chrome.i18n.getMessage("settings_font_size"),max:2*(RULERS.settings.rulerWidth/3),min:4,name:"config-font-size",type:"number",unit:"px",value:RULERS.settings.fontSize,onChange:"config.changeFontSize"})}
    </section>
  </div>

  <div class="RULERS__config-modal__columns">
    <section>
      ${RULERS.html.form.text({label:chrome.i18n.getMessage("settings_line_gap"),max:800,min:1,name:"config-line-gap",type:"number",unit:"px",value:RULERS.settings.gridSize,onChange:"config.changeGridSize"})}
    </section>
    <section>
      ${RULERS.html.form.text({label:chrome.i18n.getMessage("settings_big_line"),max:800,min:1,name:"config-big-line",type:"number",unit:chrome.i18n.getMessage("settings_lines"),value:RULERS.settings.largeLine,onChange:"config.changeLargeLine"})}
    </section>
  </div>

  ${RULERS.html.form.options({label:chrome.i18n.getMessage("settings_theme"),name:"config-theme",onChange:"config.changeTheme",options:[{label:chrome.i18n.getMessage("settings_theme_light"),value:"light",active:"light"===RULERS.settings.theme},{label:chrome.i18n.getMessage("settings_theme_automatic"),value:null,active:!RULERS.settings.theme},{label:chrome.i18n.getMessage("settings_theme_dark"),value:"dark",active:"dark"===RULERS.settings.theme}]})}


  ${RULERS.html.form.toggle({label:chrome.i18n.getMessage("settings_only_block_level"),name:"config-block-level",onChange:"config.changeBlockLevel",value:RULERS.settings.onlyBlockElements})}

  <div class="${a(!0)}">
    ${RULERS.html.form.toggle({label:chrome.i18n.getMessage("config_show_design_on_top"),name:"show-design-on-top",onChange:"config.changeShowDesignOnTop",value:RULERS.settings.showDesignOnTop})}
  </div>

</section>

<!-- START OF SHORTCUTS SECTION -->
<section class="RULERS__config-modal__shortcuts">

<div>
  <h1>${chrome.i18n.getMessage("config_shortcut_title")}</h1>
  <p>${chrome.i18n.getMessage("config_shortcut_description")}</p>

    <div class="RULERS__config-modal__shortcut-container">
      <div class="RULERS__config-modal__shortcut__key-container">
        <div class="RULERS__config-modal__shortcut__key">alt</div>
        <div class="RULERS__config-modal__shortcut__key">i</div>
      </div>
      <div class="RULERS__config-modal__shortcut__description">
        ${chrome.i18n.getMessage("config_shortcut_extension")}
      </div>
    </div>
    
    ${(()=>{let b="";return Object.entries(RULERS.keyboard.shortcuts).forEach(([c,d])=>{b+=`
          <div class="RULERS__config-modal__shortcut-container ${a(d.plusFeature)}">
            <div class="RULERS__config-modal__shortcut__key-container">
              <div class="RULERS__config-modal__shortcut__key">${c}</div>
            </div>
            <div class="RULERS__config-modal__shortcut__description">
              ${chrome.i18n.getMessage(d.i18nName)}
            </div>
          </div>
        `}),b})()}
  </div>
  
  <div class="RULERS_button-container"></div>
</section>

`};