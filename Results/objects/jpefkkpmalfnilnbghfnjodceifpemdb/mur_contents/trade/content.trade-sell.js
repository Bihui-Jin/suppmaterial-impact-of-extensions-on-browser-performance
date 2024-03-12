// ==UserScript==
// @name        trade-sell
// @include     www.ereality.ru/map*n=useritems*
// @include     www.ereality.ru/map*e=useritems*
// @include 	www.ereality.ru/map*action=sell
// @include 	www.ereality.ru/map*mode=sell
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
//=====================================================================

	var script="";

	

	if (myoptions.taverna_filters && (location.href.search("mode=sell") != -1) && top.document.getElementById("span_location").text == "Таверна") {
		var m_filters = ["Жизни", "Энергия", "Мана", "Точность", "Уворот", "Сокрушение", "Стойкость", "ОД"];


		top.main.$("#div_bhtml").before($("<center/>"),$("<b>", { text:"Фильтры"}))
		var container = ($("<center></center>"))
		$.each(m_filters, function(index, val) {
			var htmlelements = $("<input>", {class:"butt1", type:"button", value:val}).on("click", function() {
				top.main.$("table").filter(".textM").hide();
				top.main.$("td:contains(" + val + ")").parent().parent().parent().show();
			});
			container.append(htmlelements);
		});
		var htmlelements = $("<input/>", {class:"butt1", type:"button", value:"    X    "}).on("click", function() {
			top.main.$("table").show();
		});
		container.append(htmlelements);
		top.main.$("#div_bhtml").before(container);
	}

	
	if (myoptions.stock_sell_offline_find && !(location.href.search("mode=sell") != -1 && document.getElementById("npc366") != undefined)) {
		script += " (" +
			(function() {
				$.each($("table[id^=tbl] td[colspan=4] b"), function(index, elem) {
					var item_name = $(this).text();

					if (item_name != "Сломано") {
						var link = ($('<a/>', {title:"Искать на бирже", target:"_blank"}).append($("<img>", {style:"display:inline",  src:"search.png"})))
                            .attr('href', 'http://usercp.ereality.ru/services/stock/search?search=' + encodeURIComponent(item_name.replace("(", "").replace(")", "")));

						$(elem).after(link);
					}
				});
			}).toString() + ")();";

	}
		(script != "") && inject_global(script.replace("search.png",kango.io.getResourceUrl("res/yo-bods-search.png")));


//=========================end.
});