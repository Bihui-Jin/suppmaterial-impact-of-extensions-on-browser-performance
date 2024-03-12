// ==UserScript==
// @name        ErExt_info
// @include     www.ereality.ru/~*
// @include     www.ereality.ru/info*
// @require  	tools/jquery.js
// @require     tools.js
// @require 	css/info-buttons-css.js
// @require		user/info-page/tools/service-request-sender.js
//
// @require 	user/info-page/estates/bods-estate.js
// @require 	user/info-page/estates/sidzoku-estate.js
//
// @require		user/info-page/dressing-rooms/yobods-dress-room.js
// @require		user/info-page/dressing-rooms/sp-dress-room.js
// @require 	user/info-page/dressing-rooms/efirs-dress-room.js
// @require 	user/info-page/dressing-rooms/sidzoku-dress-room.js
// @require 	user/info-page/user-analizer/sheer-user-analyzer.js
// @require 	user/info-page/user-analizer/glam-user-analyzer.js
// @require 	user/info-page/user-analizer/nickname-history.js
// @require 	user/info-page/ratings/goses-user-ratings.js
// @require 	user/info-page/schedule/dragons-schedule.js
//
// @require 	user/info-page/builders/estates-builder.js
// @require		user/info-page/builders/service-button-builder.js
// @require		user/info-page/context-menus/info-context-menus.js 
// @require		user/info-page/builders/context-menus-builder.js 
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(options) {
	var mergedOptions = mergeOptions(options, defaultConfig.myoptions);

	// check if plug-in on pause
	if (!mergedOptions.unpaused) {
		return;
	}

	function init_info() {
		var userName = $("#char_frm input[name=echar]").val();
		if (userName==undefined) {
			setTimeout(function() {init_info();},20);
			return;
		}
		var serviceRequestSender = new serviceRequestSenderClass();

		// init service buttons
		new serviceButtonBuilderClass(mergedOptions, userName, serviceRequestSender, infoButtonsCss).init();

		$(".slotsInfoNew").after($("<br />"));

		// init estates 
		new estatesBuilderClass(mergedOptions, userName).init();

		// init context menus
		if (mergedOptions.contextmenus) {
			new ContexMenusBuilderClass(ContextMenus, userName).init();
		}

	}
	init_info();
});