// ==UserScript==
// @name     ErExt_clan
// @include www.ereality.ru/clan.php
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==

function controller(extOptions) {
	if (!extOptions.options.unpaused) {
		return;
	}


	if (extOptions.options.clan_ct_buttons) {
		var kt_players = [];
		var kt_nikname_array = (extOptions.options2.kt_nikname_array).split("|"); 
		$.each($("a:contains(»)"), function(key, val) {
			kt_sending = true;
			if (extOptions.options.kt_nikname_array_chk)
			{					
				kt_nik = ($(val).parent().parent().html()).replace(' style="color:#0000CC"','');
				kt_nik=kt_nik.substr(kt_nik.indexOf("</b> <b>")+7);
				kt_nik=kt_nik.substr(1,kt_nik.indexOf("</b>")-1);
				if (kt_nikname_array.indexOf(kt_nik)!=-1) 
				{
					kt_sending = false;
				}
				else
				{
					kt_text = $(val).parent().parent().next().next().html();
					for (i=extOptions.options2.kt_count_approach;i<=21;i++)
					{
						if (((kt_text).indexOf('<span style="color: #AA0000">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color: #007700">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color:#AA0000">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color:#007700">'+i+'</span>') != -1))
						{
							kt_sending = false;
						}
					}
				}
			}
			else
			{
				kt_text = $(val).parent().parent().next().next().html();
				for (i=extOptions.options2.kt_count_approach;i<=21;i++)
				{
					if (((kt_text).indexOf('<span style="color: #AA0000">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color: #007700">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color:#AA0000">'+i+'</span>') != -1)||((kt_text).indexOf('<span style="color:#007700">'+i+'</span>') != -1))
					{
						kt_sending = false;
					}
				}
			}
			if (kt_sending) 
			{
				kt_players.push(val)
			};
			
		})

		for (i = 0; i < Math.ceil(kt_players.length / 9); i++) {
			$("td:contains(Местоположение)").parent().next().children().append($("<button>", {id:'kt', style:"width:35px; cursor:pointer", text: i}))
		}

		$("#kt*").on("click", function() {
			$("#chat_msg",top.document).val(":102:  КТ !!! "+extOptions.options2.kt_message_text);
			var num = +$(this).text();
			for (k = num * 9; k < Math.min(num * 9 + 9, kt_players.length); k++) {
				kt_players[k].click();
			}
			$("#img_ch_f1",top.document).click();

		})
	}
}

var loadOptions = [{
	systemName: 'options',
	defaultName: "myoptions"
},{
	systemName: 'options2',
	defaultName: "systemOptions"
}];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});