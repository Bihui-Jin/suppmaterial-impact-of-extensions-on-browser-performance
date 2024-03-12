// ==UserScript==
// @name        polyana
// @include     www.ereality.ru/map*acti*eate_demand*uid*
// @include     www.ereality.ru/map*acti*improve*uid*
// @include     www.ereality.ru/map.php*action=item_list
// @include     www.ereality.ru/map.php*action=improve_items
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
	if (myoptions.repeat_kudes) {
		if ((location.href.search("www.ereality.ru/map.php") != -1) && ((location.href.search("action=item_list") != -1) || (location.href.search("action=improve_items") != -1))) {

			var script_add_buttons = "(" +
				(function() {
					var kdata = localStorage["kudes_data"];
					Wizard.mur_kudes = function(id) {
						top.core.xmlSend(Wizard.xmlPath, kudes_data[id], Wizard.processXML);
						return;
					}
					if (kdata) {
						var kudes_data = JSON.parse(kdata);
						$.each($("div[id^=ibtn]"), function(index, elem) {
							key = elem.id.replace("ibtn", "");
							if (kudes_data[key] != undefined) {
								$(elem).after($("<input class=\"butt1\" id=\"mbtn" + key + "\" type=\"button\" onclick=\"Wizard.mur_kudes(" + key + ")\"  value=\" Повторить \">"));
							}
						});
					}
				}).toString() + ")();";
			inject_global(script_add_buttons);

		} else {

			var script_write_data = "(" +
				(function() {
					var Old_xmlSend = Wizard.xmlSend;
					Wizard.xmlSend = function() {
						Old_xmlSend.apply(Wizard);
						var kdata = localStorage["kudes_data"];
						if (!kdata) {
							var kudes_data = {}
						} else {
							var kudes_data = JSON.parse(kdata);
						}
						kudes_data[$("item", Wizard.xml).text()] = Wizard.xml;
						localStorage["kudes_data"] = JSON.stringify(kudes_data);
						return;
					}
				}).toString() + ")();";
			inject_global(script_write_data);
		}
	}
	//=========================end.

});