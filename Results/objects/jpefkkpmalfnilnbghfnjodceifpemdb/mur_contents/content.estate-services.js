// ==UserScript==
// @name     estate-services
// @include order.ereality.ru/viewpage.php*page_id=43&name*
// @include http://sidzoku.ru/landlord*
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==

function controller(extOptions) {
	if (!extOptions.options.unpaused) {
		return;
	}

	function lot_replace() {
		$.each($("a[href*='/viewpage.php?page_id=42'"), function(key, val) {
			$(val).attr("href", encodeURI($(val).attr("href").replace(/.*=/, "http://usercp.ereality.ru/services/stock/search?search=")));
		})
	}

	if (extOptions.options.estate_services) {
		setTimeout(lot_replace, 500);
		$("input[value=Показать]").on("click", function() {
			setTimeout(function() {lot_replace();}, 500);
		})
		$("img[src=\"img/btn_search_char.png\"]").on("click", function() {
			setTimeout(function() {lot_replace();}, 500);
		})
	}

}

var loadOptions = [{
	systemName: 'options',
	defaultName: "myoptions"
}];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});