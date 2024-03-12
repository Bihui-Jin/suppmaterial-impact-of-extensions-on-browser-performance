 var script_battle_counter= "(" +
	(function(){
 var Old_xmlRecv = battle.xmlRecv;

 battle.xmlRecv = function(xml) {
 	Old_xmlRecv.apply(battle, [xml]);

 	if ($("msg", xml).length > 0 && $("msg", xml).text().search("фантом")==-1)  {
 		$.get($("msg", xml).text().match(/(id\d{1,})/)[0].replace(/id/, "/log") + "/page1.xml", function(response) {
 			if ($("start", response).attr("type") == 2) {
 				var hdate = $("start", response).attr("date").match(/\d{1,}-\d{1,}-(\d{1,})/)[1];
 				var htime = $("start", response).attr("time").match(/(\d\d)/)[1];
 				var money = $("msg", xml).text().match(/сер.*<b>(\d{1,}\.?\d{1,}?)</)[1];
 				var bdata = localStorage["battle_data"];
 				if (!bdata) {

 					var battle_data = {}
 					battle_data.hcount = 1;
 					battle_data.hmoney = +money;
 					battle_data.gcount = 0;
 					battle_data.gmoney = 0;
 					if (htime < 4) battle_data.hdate = hdate - 1
 					else battle_data.hdate = hdate;
 				} else {
 					var battle_data = JSON.parse(bdata);
 					if ((battle_data.hdate != hdate && htime > 4) || (battle_data.hdate != (hdate - 1) && htime < 4)) {
 						battle_data.hcount = 0;
 						battle_data.hmoney = 0;
 						battle_data.gcount = 0;
 						battle_data.gmoney = 0;
 						battle_data.hdate = hdate;
 					}
 					battle_data.hcount += 1;
 					battle_data.hmoney += +money;
 				}
 				battle_data.hmoney = Math.round(battle_data.hmoney);
 				localStorage["battle_data"] = JSON.stringify(battle_data);
 			}
 			if ($("start", response).attr("type") == 1 && $("start", response).attr("place").search("Остров Дыхания Льдов") == -1) {
 				var hdate = $("start", response).attr("date").match(/\d{1,}-\d{1,}-(\d{1,})/)[1];
 				var htime = $("start", response).attr("time").match(/(\d\d)/)[1];
 				var money = $("msg", xml).text().match(/сер.*<b>(\d{1,}\.?\d{1,}?)</)[1];
 				var bdata = localStorage["battle_data"];
 				if (!bdata) {
 					var battle_data = {}
 					battle_data.gcount = 1;
 					battle_data.gmoney = +money;
 					battle_data.hcount = 0;
 					battle_data.hmoney = 0;
 					if (htime < 4) battle_data.hdate = hdate - 1
 					else battle_data.hdate = hdate;
 				} else {
 					var battle_data = JSON.parse(bdata);
 					if ((battle_data.hdate != hdate && htime > 4) || (battle_data.hdate != (hdate - 1) && htime < 4)) {
 						battle_data.gcount = 0;
 						battle_data.gmoney = 0;
 						battle_data.hcount = 0;
 						battle_data.hmoney = 0;
 						battle_data.hdate = hdate;
 					}
 					battle_data.gcount += 1;
 					battle_data.gmoney += +money;
 				}
 				battle_data.gmoney = Math.round(battle_data.gmoney);
 				localStorage["battle_data"] = JSON.stringify(battle_data);
 			}
 		}, "xml");
 	}
 	return;
 }

 }).toString()
	+ ")();"; 