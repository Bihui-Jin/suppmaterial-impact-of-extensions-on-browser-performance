// ==UserScript==
// @name        lottery
// @include     www.ereality.ru/map.php*action*mytickets
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
		$('#div_bhtml').prepend($("<a>", {'href':"https://er-help.ru/informatsiya/generator-loterei", 'target':"_blank", text:'Воспользоваться сервисом клана "Отступники"'}));
		kango.addMessageListener(messagingEnum.lotteryToContent, function(event) {
			var mes = event.data.split("%2C");
			if (mes.length == 5)
				if ($("td:contains(Номера)", $("b:contains(Серебряный хомяк)").parent()).text().search(mes.join(" ")) == -1) {
					var ticket = $("input[value*=Заполнить]:first", $("b:contains(Серебряный хомяк)").parent());
					if (ticket.length > 0) {
						var ticket_id = ticket.attr("onclick").match(/\(1, (\d{1,})/)[1];
						$.post("https://www.ereality.ru/map.php?action=fill&ltype=2&tid=" + ticket_id + "&y=undefined",
							'FieldList=' + mes.join("%2C") + '&y=',
							function(response) {
								location.reload()
							});
					}
				};
			if (mes.length == 4)
				if ($("td:contains(Номера)", $("b:contains(Золотой бизон)").parent()).text().search(mes.join(" ")) == -1) {
					var ticket = $("input[value*=Заполнить]:first", $("b:contains(Золотой бизон)").parent());
					if (ticket.length > 0) {
						var ticket_id = ticket.attr("onclick").match(/\(0, (\d{1,})/)[1];
						$.post("https://www.ereality.ru/map.php?action=fill&ltype=1&tid=" + ticket_id + "&y=undefined",
							'FieldList=' + mes.join("%2C") + '&y=',
							function(response) {
								location.reload()
							});
					}
				}

		});
	}
	//=========================end.
});