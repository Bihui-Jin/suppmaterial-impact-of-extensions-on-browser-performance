// ==UserScript==
// @name     ErExt_ModifyMove
// @include	www.ereality.ru/move*
// @include	www.ereality.ru/map.php*modeSwitch*
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
// Добавление своих локаций на ОВЛ и ОПП 
	kango.invokeAsync('kango.storage.getItem', "systemOptions", function(options) {
		var mergedSystemOptions = mergeOptions(options, defaultConfig.systemOptions);
	
		var script = "(" +
		(function() {
                Map.OldDrawCaution = Map.drawCaution;
                
                Map.drawCaution = function() {
                    Map.OldDrawCaution();

					if (top.core.caution) {
						if (top.core.caution < 25 && top.main.Map.caution.percent >= 25 && top.core.mur_soundOptions["sound_25"].sound != "nosound") {
							top.core.playSwfSound(top.core.mur_soundOptions["sound_25"].sound);
						}
						if (top.core.caution < 50 && top.main.Map.caution.percent >= 50 && top.core.mur_soundOptions["sound_50"].sound != "nosound") {
							top.core.playSwfSound(top.core.mur_soundOptions["sound_50"].sound);
						}
						if (top.core.caution < 75 && top.main.Map.caution.percent >= 75 && top.core.mur_soundOptions["sound_75"].sound != "nosound") {
							top.core.playSwfSound(top.core.mur_soundOptions["sound_75"].sound);
						}
						if (top.core.caution < 100 && top.main.Map.caution.percent >= 100 && top.core.mur_soundOptions["sound_100"].sound != "nosound") {
							top.core.playSwfSound(top.core.mur_soundOptions["sound_100"].sound);
						}
					}
					top.core.caution = top.main.Map.caution.percent;
					return;
				}
			}).toString() + ")();";

		//копирование инфы о ботах на секторе в чат по пкм
		if (myoptions.location_bot_info) {
			script += "(" +
				(function() {
					$("li", "div.MonstersOnTheMapContainer").on("contextmenu", function() {
						$("#chat_msg", top.document).val("");
						Map.reportBots()
					})
					$("li", "div.MonstersOnTheMapContainer").each(function() {
						this.oncontextmenu = function() {
							return false
						};
					})

				}).toString() + ")();";
		}
			($(document.querySelector("head")).html().search("script")!=-1) &&  inject_global(script);
		
	});


		//Модернизация механизма изгонялок на альенах
		if (myoptions.aliensmy) {
		var script1 = "(" +
			(function() {
					$(document).ready(function() {
							div = document.getElementById("aliens_stats");

							if (div != undefined) {

							var current = $(this);
							var res = current.find('b');
								//res = div.getElementsByTagName("b");

								function getout1(name) {

									var xmlPath = '/ajax/aliens/';

									for (var $g_id in aliens_stats) {
										var users = aliens_stats[$g_id]['users'];
										for (var j = 0; j < users.length; j++) {
											if (users[j][1] == name) {
												var h_id = users[j][0]
											}
										}
									}

									xmlText = '<request action="getOut">' + '<h_id>' + h_id + '</h_id>' + '</request>';

									top.core.xmlSend(xmlPath, xmlText, function(xmldoc) {
										top.core.alertMsg($('msg', xmldoc).text());
									});
								}


								for (i = 0; i < res.length; i++) {
									var textResp = res.eq(i).text();
									if ((textResp != top.user.name)&(textResp != "0")&(textResp != "1")&(textResp != "2")&(textResp != "3")&(textResp != "4")&(textResp != "5")&(textResp != "6")&(textResp != "7")) {
										$("b:contains(" + textResp + ")").before($("<a>", {'href':'#', text:"[X]"}));
									}
								}

								links = div.getElementsByTagName("a");

								for (i = 0; i < links.length; i++) {
									links[i].addEventListener("click", function() {
										getout1($(this.nextSibling).text()); 
									});
								}
							}
						});
			}).toString() + ")();";

			($(document.querySelector("head")).html().search("script")!=-1) && inject_global(script1);
		}
//=========================end.
});