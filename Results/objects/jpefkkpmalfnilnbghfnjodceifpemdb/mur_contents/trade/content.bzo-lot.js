// ==UserScript==
// @name        bzo-lot
// @author      Murlemur
// @include     https://www.ereality.ru/map.php*modeSwitch*
// @include     https://www.ereality.ru/move/jeweler*
// @require     tools.js
// @grant       none
// @all-frames  true
// ==/UserScript==

//================================================================Begin
kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);
	
	if ((!myoptions.unpaused)||(!myoptions.stockmy_island)) {
		return;
	}
else {
//=====================================================================

 var scr= document.createElement("script");
 scr.text= "(" +

(function() {
    'use strict';

    //Выставление лота на биржу бирюзы
			top.core.addlotB = function(id, price ) {
				top.json.send("jewelerStock", "addLot", {
                    id: id,
                    price: price
                });
			};

			top.core.addbuttonsB = function() {
				var myprice = $("#myprice");
				var mybuttons = $("input[id^=mbtn]");
				if (mybuttons.length == 0) {
					$.each($("div.sellItem"), function(index, elem) {
						var key = elem.getAttribute("data-id");

						if ((myprice.length > 0) && (myprice.val() > 0)) {
                            $(".itemBodyButtons",elem).append($("<input>", {"class":"butt2", "id":"mbtn" + key, "type":"button", "onclick":"top.core.addlotB(" + key + "," + myprice.val() + ")", "value":"Выставить по " + $("#myprice").val()}));
						}
					});
				} else {
					$.each(mybuttons, function(index, elem) {
						var key = elem.id.replace("mbtn", "");

						if ((myprice.length > 0) && (myprice.val() > 0)) {
							elem.attributes["onclick"].value = "top.core.addlotB(" + key + "," + myprice.val() + ");";
							elem.value = "Выставить по " + myprice.val();
						}
					});

				}
				return;
			};


			var htmlelements = '<table class="textM" align="center">' +
				'<tbody>' +
				'<td>' +
				'<table class="textM" align="center">' +
				'<tbody>' +
				'<td align="left">Цена продажи : </td>' +
				'<td align="left">' +
				'<input id="myprice" class="field" type="text" value="" name="myprice"  maxlength="7" size="7">' +
				'</td>' +
				'</tbody>' +
				'</table>' +
				'</td>' +
				'<td>' +
				'<a title="Добавить/обновить кнопки" class="refresh" href="javascript: top.core.addbuttonsB();"> </a>' +
				'</td>' +
				'</td>' +
				'</tbody>' +
				'</table>';

			$(".tab-lot").prepend($(htmlelements));

	
 }).toString()
	+ ")();";
window.onload = setTimeout(function() { document.body.appendChild(scr);}, 150);
}

//================================================================end.
});