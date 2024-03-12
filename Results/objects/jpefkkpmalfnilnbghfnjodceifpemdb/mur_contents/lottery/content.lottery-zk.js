// ==UserScript==
// @name        lottery
// @include     er-help.ru/informatsiya/generator-loterei
// @require     tools/messaging-enum.js
// @require     tools.js
// @require 	tools/jquery.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
	if (myoptions.lottery_zk) {
		$('#resultDiv').delegate($(".bilet"), "click", function(evt) { 
			var bilet = $(evt.target).parent().parent().parent().parent().parent().html();
			if (bilet.search(/bilet/) == 18) kango.dispatchMessage(messagingEnum.lotteryToBackground, bilet.match(/class="d(\d{1,})/g).join('%2C').replace(/class="d/g, ""));
		});
	}
	//=========================end.
});