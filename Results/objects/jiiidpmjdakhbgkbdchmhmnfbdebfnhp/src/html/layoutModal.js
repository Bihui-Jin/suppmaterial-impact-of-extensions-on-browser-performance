RULERS.html.layoutModal=()=>`

<!-- START OF DESIGN SECTION -->
<section class="RULERS__layout-modal__design">
<h1>${chrome.i18n.getMessage("layoutmodal_design_title")}</h1>
<p>${chrome.i18n.getMessage("layoutmodal_design_description")}</p>

${RULERS.html.form.file({label:chrome.i18n.getMessage("layoutmodal_design_upload_label"),name:"design-upload",placeholder:chrome.i18n.getMessage("layoutmodal_design_upload_value"),onChange:"design.storeDesign",image:RULERS.vars.design.src,originalImageName:RULERS.vars.design.originalName})}
<div class="RULERS__layout-modal__columns">
<section>
${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_design_scale_label"),max:200,min:10,name:"design-scale",type:"number",unit:"%",value:RULERS.vars.design.scale,onChange:"design.changeScale"})}
</section>
<section>
${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_design_opacity_label"),max:100,min:0,name:"design-opacity",type:"number",unit:"%",value:RULERS.vars.design.opacity,onChange:"design.changeOpacity"})}
</section>
</div>
<div class="RULERS__layout-modal__columns">
<section>
${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_design_horizontal_offset"),max:2200,min:-2200,name:"design-xOffset",type:"number",unit:"px",value:RULERS.vars.design.xOffset||"0",onChange:"design.changeXOffset"})}
</section>
<section>
${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_design_vertical_offset"),max:2200,min:-2200,name:"design-yOffset",type:"number",unit:"px",value:RULERS.vars.design.yOffset||"0",onChange:"design.changeYOffset"})}
</section>
</div>

${RULERS.html.form.options({label:chrome.i18n.getMessage("layoutmodal_design_filter_label"),name:"design-filter",onChange:"design.changeFilter",options:[{label:chrome.i18n.getMessage("layoutmodal_design_filter_none"),value:null,active:!RULERS.vars.design.filter},{label:chrome.i18n.getMessage("layoutmodal_design_filter_grayscale"),value:"grayscale",active:"grayscale"===RULERS.vars.design.filter},{label:chrome.i18n.getMessage("layoutmodal_design_filter_difference"),value:"difference",active:"difference"===RULERS.vars.design.filter}]})}

${RULERS.html.form.options({label:chrome.i18n.getMessage("general_alignment"),name:"design-alignment",onChange:"design.changeAlignment",options:[{label:chrome.i18n.getMessage("general_alignment_left"),value:null,active:!RULERS.vars.design.alignment},{label:chrome.i18n.getMessage("general_alignment_center"),value:"center",active:"center"===RULERS.vars.design.alignment},{label:chrome.i18n.getMessage("general_alignment_right"),value:"right",active:"right"===RULERS.vars.design.alignment}]})}

</section>

<!-- START OF GRID SECTION -->
<section class="RULERS__layout-modal__grid">

<h1>${chrome.i18n.getMessage("layoutmodal_grid_title")}</h1>
<p>${chrome.i18n.getMessage("layoutmodal_grid_description")}</p>

<div class="RULERS__layout-modal__columns">

<section>

${RULERS.html.form.toggle({label:chrome.i18n.getMessage("layoutmodal_grid_columns_show"),name:"grid-column-toggle",onChange:"grid.changeHandler",value:RULERS.vars.grid["column-toggle"]})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_columns_count"),max:40,min:0,name:"grid-column-count",type:"number",value:RULERS.vars.grid["column-count"],onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_columns_width"),max:2e3,min:0,name:"grid-column-width",type:"number",unit:"px",value:RULERS.vars.grid["column-width"],onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_columns_gutter_width"),max:1e3,min:0,name:"grid-gutter-width",type:"number",unit:"px",value:RULERS.vars.grid["gutter-width"],onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_column_offset"),max:2e3,min:0,name:"grid-horizontal-offset",type:"number",unit:"px",value:RULERS.vars.grid["horizontal-offset"]||"0",onChange:"grid.changeHandler"})}

${RULERS.html.form.options({label:chrome.i18n.getMessage("general_alignment"),name:"grid-column-alignment",onChange:"grid.changeHandler",options:[{label:chrome.i18n.getMessage("general_alignment_left"),value:"left",active:!RULERS.vars.grid["column-alignment"]},{label:chrome.i18n.getMessage("general_alignment_center"),value:"center",active:"center"===RULERS.vars.grid["column-alignment"]},{label:chrome.i18n.getMessage("general_alignment_right"),value:"right",active:"right"===RULERS.vars.grid["column-alignment"]}]})}


</section>
<section>

${RULERS.html.form.toggle({label:chrome.i18n.getMessage("layoutmodal_grid_rows_show"),name:"grid-row-toggle",onChange:"grid.changeHandler",value:RULERS.vars.grid["row-toggle"]})}

${RULERS.html.form.text({disabled:!0,label:chrome.i18n.getMessage("layoutmodal_grid_rows_count"),name:"grid-row-count",value:chrome.i18n.getMessage("general_infinite"),onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_rows_height"),max:2e3,min:0,name:"grid-row-height",type:"number",unit:"px",value:RULERS.vars.grid["row-height"],onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_rows_gutter_height"),max:1e3,min:0,name:"grid-gutter-height",type:"number",unit:"px",value:RULERS.vars.grid["gutter-height"],onChange:"grid.changeHandler"})}

${RULERS.html.form.text({label:chrome.i18n.getMessage("layoutmodal_grid_rows_offset"),max:2e3,min:0,name:"grid-top-offset",type:"number",unit:"px",value:RULERS.vars.grid["top-offset"]||"0",onChange:"grid.changeHandler"})}

</section>
</div>

<div class="RULERS_button-container">
  <button class="js_RULERS__form__closeBtn RULERS_button_cta">
    ${chrome.i18n.getMessage("modal_close")}
    <img class="RULERS_button_icon" src="${chrome.runtime.getURL("img/icons/arrow_purple.svg")}">
  </button>
</div>

</section>
`;