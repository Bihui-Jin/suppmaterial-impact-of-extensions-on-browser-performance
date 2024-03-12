// ==UserScript==
// @name     ErExt_oplot
// @include www.ereality.ru/map*mode=items_give
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==
		
function controller(extOptions) {		
	if (!extOptions.options.unpaused) {
		return;
	}
	

	if (extOptions.options.oplot_button) {
		$("input[value*=выбранные]").before($("<input class=\"butt1\" type=\"button\" onclick=\"$('input[type=checkbox]').prop('checked',true)\" value=\"Выбрать все вещи\"><br>")); 
	}
}

var loadOptions = [
	{systemName: 'options', defaultName: "myoptions"} 
];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});