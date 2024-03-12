// ==UserScript==
// @name     ErExt_Altar
// @include www.ereality.ru/map.php*mode=altar*
//
// @require tools/jquery.js
// @require tools.js
//
// @all-frames  true
// ==/UserScript==

function controller(extOptions) {		
	if (!extOptions.options.unpaused) {
		return;
	}
	
	// altar refresh by enter
	$('a[href^="/map.php?mode=altar"]').focus();
}

var loadOptions = [
	{systemName: 'options', defaultName: "myoptions"} 
];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});