// ==UserScript==
// @name        lottery
// @include     www.ereality.ru/map.php*action*fill*
// @require     tools.js
// @require 	tools/jquery.js
//
// @require common/lottery/lottery.js
// @require common/lottery/lottery-builder.js
//
// @all-frames  true
// ==/UserScript==

function controller(extOptions) {		
	if (!extOptions.options.unpaused) {
		return;
	}
	
	// init lottery
	if (extOptions.options.lotereya) {
		var lotteryBuilder = new lotteryBuilderClass(new lotteryClass());
		lotteryBuilder.init();
	}
}

var loadOptions = [
	{systemName: 'options', defaultName: "myoptions"} 
];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});