// ==UserScript==
// @name        Underground_Map
// @include     https://er-help.ru/scripts/map_shaxt*
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
	if (myoptions.underground_map) {
		kango.addMessageListener(messagingEnum.UndergroundToContent, function(event) {
			var mes = event.data.split(":");
			if (mes.length == 3) {
				$("#koorx").val(mes[0]);
				$("#koory").val(mes[1]);
				if ($("#sec_z" + mes[2]).prop("checked")) $("#idsh").click();
				else  {
					$("#sec_z" + mes[2]).prop("checked",true);
					$("#sec_z" + mes[2]).click();
				}
			};
		});
	}
	//=========================end.
});