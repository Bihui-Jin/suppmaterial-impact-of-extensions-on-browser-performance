// ==UserScript==
// @name        liteika
// @include     www.ereality.ru/move/furnace/?id=*uid*
// @include     www.ereality.ru/move/furnace2/?id=*uid*
// @include     www.ereality.ru/map.php?action=internal
// @include     www.ereality.ru/map.php
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
	
	//кнопка повторного подкида в литейке
	if (myoptions.repeat_metall) {
			var script_add_buttons = "(" +
				(function() {
								
					//определение температуры
					if (typeof $('#tcurrent').html() != 'undefined') {localStorage["tcurrent"] = $('#tcurrent').html();} 
					
					//определение печи
					if (typeof $('#curfurnace').html() != 'undefined') {
					if ($('#curfurnace').html().search("Учебная")!=-1) {localStorage["curfurnace"]=1;} else if ($('#curfurnace').html().search("Рабочая")!=-1) {localStorage["curfurnace"]=2;} else if ($('#curfurnace').html().search("мастеров")!=-1) {localStorage["curfurnace"]=3;}}
					
					
					//проверка, что мы находимся именно в зале подкидов
					if ((typeof $('#tcurrent').html() != 'undefined')&&(!($('input[name="interruptfusion"]').is(':visible')))&&(!($('input[name="preenter"]').is(':visible'))))
					{
						//проверка, что мы выбирали топливо
						if (localStorage["add_metall_fuel"])
						{
							array = (localStorage["add_metall_fuel"]).split(":");
							//добавляем кнопки для подкида если количество больше 0
							if (array[2] != 0)
							$("#mactions").append('<input type="radio" value="'+array[0]+'" name="fuel" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Кинуть '+array[1]+' ('+array[2]+')" name="choosefuel" style="width: 280px;">');	
						}
						
						if ((localStorage["tcurrent"])&&(localStorage["curfurnace"]))
						{
							//Ученики
							if (localStorage["curfurnace"]==1)
							{
								if ((localStorage["tcurrent"]>=835)&&(localStorage["tcurrent"]<=965))
								{
									if ((localStorage["add_metall_ingid_111"])&&(localStorage["add_metall_ingid_112"]))
									{
									array = localStorage["add_metall_ingid_111"].split(":");	
									array2 = localStorage["add_metall_ingid_112"].split(":");
									min = Math.floor(Math.min(array[1]/2,array2[1]/2));
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="101">').append('<input type="radio" value="'+array[0]+'" name="ingredients[111]" checked="checked" hidden>').append('<input type="radio" value="'+array2[0]+'" name="ingredients[112]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить бронзу ('+min+')" name="chooseingot" style="width: 280px;">');	
									}
								}
								if ((localStorage["tcurrent"]>=1035)&&(localStorage["tcurrent"]<=1165))
								{
									if (localStorage["add_metall_ingid_113"])
									{
									array = localStorage["add_metall_ingid_113"].split(":");	
									min = Math.floor(array[1]/3);	
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="102">').append('<input type="radio" value="'+array[0]+'" name="ingredients[113]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить железо ('+min+')" name="chooseingot" style="width: 280px;">');			
									}									
								}
								if ((localStorage["tcurrent"]>=1235)&&(localStorage["tcurrent"]<=1365))
								{									
									if ((localStorage["add_metall_ingid_110"])&&(localStorage["add_metall_ingid_113"]))
									{
									array = localStorage["add_metall_ingid_110"].split(":");
									array2 = localStorage["add_metall_ingid_113"].split(":");	
									min = Math.floor(Math.min(array[1]/4,array2[1]/2));
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="103">').append('<input type="radio" value="'+array[0]+'" name="ingredients[110]" checked="checked" hidden>').append('<input type="radio" value="'+array2[0]+'" name="ingredients[113]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить чугун ('+min+')" name="chooseingot" style="width: 280px;">');	
									}
								}
							}
							//рабочие
							else if (localStorage["curfurnace"]==2)
							{
								if ((localStorage["tcurrent"]>=1535)&&(localStorage["tcurrent"]<=1665))
								{									
									if ((localStorage["add_metall_ingid_110"])&&(localStorage["add_metall_ingid_113"]))
									{
									array = localStorage["add_metall_ingid_110"].split(":");
									array2 = localStorage["add_metall_ingid_113"].split(":");	
									min = Math.floor(Math.min(array[1]/3,array2[1]/3));	
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="104">').append('<input type="radio" checked name="ingredients[110]" value="'+array[0]+'" hidden>').append('<input type="radio" checked name="ingredients[113]" value="'+localStorage["add_metall_ingid_113"]+'" hidden>').append('<input type="submit" class="butt1" value="Выплавить НПС ('+min+')" name="chooseingot" style="width: 280px;">');
									}
								}
								if ((localStorage["tcurrent"]>=1935)&&(localStorage["tcurrent"]<=2065))
								{
									if (localStorage["add_metall_ingid_114"])
									{
									array = localStorage["add_metall_ingid_114"].split(":");	
									min = Math.floor(array[1]/3);
									if (min>0)	
									$("#mactions").append('<input type="hidden" checked name="ingot" value="105">').append('<input type="radio" value="'+array[0]+'" name="ingredients[114]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить платину ('+min+')" name="chooseingot" style="width: 280px;">');	
									}									
								}
								if ((localStorage["tcurrent"]>=1735)&&(localStorage["tcurrent"]<=1865))
								{
									if (localStorage["add_metall_ingid_103"])
									{
									array = localStorage["add_metall_ingid_103"].split(":");	
									min = array[1];	
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="106">').append('<input type="radio" value="'+array[0]+'" name="ingredients[103]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить ВКС ('+min+')" name="chooseingot" style="width: 280px;">');	
									}									
								}								
							}
							//мастера
							else if (localStorage["curfurnace"]==3)
							{
								if ((localStorage["tcurrent"]>=2035)&&(localStorage["tcurrent"]<=2165))
								{
									if (localStorage["add_metall_ingid_115"])
									{
									array = localStorage["add_metall_ingid_115"].split(":");	
									min = Math.floor(array[1]/3);
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="107">').append('<input type="radio" value="'+array[0]+'" name="ingredients[115]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить мифрил ('+min+')" name="chooseingot" style="width: 280px;">');
									}
									
								}
								if ((localStorage["tcurrent"]>=2235)&&(localStorage["tcurrent"]<=2365))
								{
									if (localStorage["add_metall_ingid_116"])
									{
									array = localStorage["add_metall_ingid_116"].split(":");										
									min = Math.floor(array[1]/3);
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="108">').append('<input type="radio" value="'+array[0]+'" name="ingredients[116]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить адамант ('+min+')" name="chooseingot" style="width: 280px;">');	
									}									
								}
								if ((localStorage["tcurrent"]>=1835)&&(localStorage["tcurrent"]<=1965))
								{									
									if ((localStorage["add_metall_ingid_104"])&&(localStorage["add_metall_ingid_105"]))
									{
									array = localStorage["add_metall_ingid_104"].split(":");
									array2 = localStorage["add_metall_ingid_105"].split(":");	
									min = Math.floor(Math.min(array[1],array2[1]));
									if (min>0)
									$("#mactions").append('<input type="hidden" checked name="ingot" value="109">').append('<input type="radio" value="'+array[0]+'" name="ingredients[104]" checked="checked" hidden>').append('<input type="radio" value="'+array2[0]+'" name="ingredients[105]" checked="checked" hidden>').append('<input class="butt1" type="submit" value="Выплавить ПТС ('+min+')" name="chooseingot" style="width: 280px;">');	
									}									
								}
								
							}
						}
					}	

					//принимаем значение выбранного топлива
					$('input[name="fuel"]').click(function()
					{
						var obj= $(this);
						array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
						localStorage["add_metall_fuel"] = obj.val()+":"+array[2]+":"+array[3];
					});
					
					//уменьшаем топливо
					$('input[name="choosefuel"]').click(function()
					{
						array = (localStorage["add_metall_fuel"]).split(":");
						localStorage["add_metall_fuel"] = array[0]+":"+array[1]+":"+(array[2]-1);
					});	
					
					//уменьшаем ингредиенты
					$('input[name="chooseingot"]').click(function()
					{//Ученики
							if (localStorage["curfurnace"]==1)
							{
								if ((localStorage["tcurrent"]>=801)&&(localStorage["tcurrent"]<=999))
								{
									if ((localStorage["add_metall_ingid_111"])&&(localStorage["add_metall_ingid_112"]))
										{array = (localStorage["add_metall_ingid_111"]).split(":");
										localStorage["add_metall_ingid_111"] = array[0]+":"+(array[1]-2);
										array2 = (localStorage["add_metall_ingid_112"]).split(":");
										localStorage["add_metall_ingid_112"] = array2[0]+":"+(array2[1]-2);}
								}
								if ((localStorage["tcurrent"]>=1001)&&(localStorage["tcurrent"]<=1199))
								{
									if (localStorage["add_metall_ingid_113"])
										{array = (localStorage["add_metall_ingid_113"]).split(":");
										localStorage["add_metall_ingid_113"] = array[0]+":"+(array[1]-3);}
								
								}
								if ((localStorage["tcurrent"]>=1201)&&(localStorage["tcurrent"]<=1399))
								{									
									if ((localStorage["add_metall_ingid_110"])&&(localStorage["add_metall_ingid_113"]))
										{array = (localStorage["add_metall_ingid_110"]).split(":");
										localStorage["add_metall_ingid_110"] = array[0]+":"+(array[1]-4);
										array2 = (localStorage["add_metall_ingid_113"]).split(":");
										localStorage["add_metall_ingid_113"] = array2[0]+":"+(array2[1]-2);}

								}
							}
							//рабочие
							else if (localStorage["curfurnace"]==2)
							{
								if ((localStorage["tcurrent"]>=1501)&&(localStorage["tcurrent"]<=1699))
								{									
									if ((localStorage["add_metall_ingid_110"])&&(localStorage["add_metall_ingid_113"]))
										{array = (localStorage["add_metall_ingid_110"]).split(":");
										localStorage["add_metall_ingid_110"] = array[0]+":"+(array[1]-3);
										array2 = (localStorage["add_metall_ingid_113"]).split(":");
										localStorage["add_metall_ingid_113"] = array2[0]+":"+(array2[1]-3);}

								}
								if ((localStorage["tcurrent"]>=1901)&&(localStorage["tcurrent"]<=2099))
								{
									if (localStorage["add_metall_ingid_114"])
										{array = (localStorage["add_metall_ingid_114"]).split(":");
										localStorage["add_metall_ingid_114"] = array[0]+":"+(array[1]-3);}
								
								}
								if ((localStorage["tcurrent"]>=1701)&&(localStorage["tcurrent"]<=1899))
								{
									if (localStorage["add_metall_ingid_103"])
										{array = (localStorage["add_metall_ingid_103"]).split(":");
										localStorage["add_metall_ingid_103"] = array[0]+":"+(array[1]-1);}
								
								}								
							}
							//мастера
							else if (localStorage["curfurnace"]==3)
							{
								if ((localStorage["tcurrent"]>=2001)&&(localStorage["tcurrent"]<=2199))
								{
									if (localStorage["add_metall_ingid_115"])
										{array = (localStorage["add_metall_ingid_115"]).split(":");
										localStorage["add_metall_ingid_115"] = array[0]+":"+(array[1]-3);}

									
								}
								if ((localStorage["tcurrent"]>=2201)&&(localStorage["tcurrent"]<=2399))
								{
									if (localStorage["add_metall_ingid_116"])
										{array = (localStorage["add_metall_ingid_116"]).split(":");
										localStorage["add_metall_ingid_116"] = array[0]+":"+(array[1]-3);}
									
								}
								if ((localStorage["tcurrent"]>=1801)&&(localStorage["tcurrent"]<=1999))
								{									
									if ((localStorage["add_metall_ingid_104"])&&(localStorage["add_metall_ingid_105"]))
										{array = (localStorage["add_metall_ingid_104"]).split(":");
										localStorage["add_metall_ingid_104"] = array[0]+":"+(array[1]-1);
										array2 = (localStorage["add_metall_ingid_105"]).split(":");
										localStorage["add_metall_ingid_105"] = array2[0]+":"+(array2[1]-1);}
								
								}
								
							}
					});	
					
					if (localStorage["tcurrent"])
						{							
						//принимаем значение выбранного ингредиента
												
							$('input[name="ingredients[103]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_103"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[104]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_104"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[105]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_105"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[110]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_110"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[111]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_111"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[112]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_112"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[113]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_113"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[114]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_114"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[115]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_115"] = obj.val()+":"+array[1];
							});	
							$('input[name="ingredients[116]"]').click(function()
							{
								var obj= $(this);
								array = (obj.parent().parent().html().replace('<td align="left">',"").replace(new RegExp("<td>",'g'),"")).split("</td>");
								localStorage["add_metall_ingid_116"] = obj.val()+":"+array[1];
							});			
						}
						
						
					if ($('input[name="chooseingot"]').val() == ' Начать плавить ')
					{
						if (typeof $('input[name="ingredients[103]"]') != 'undefined') {if ($('input[name="ingredients[111]"]').is(':visible')) {$('input[name="ingredients[103]"]').click();}}
						if (typeof $('input[name="ingredients[104]"]') != 'undefined') {if ($('input[name="ingredients[104]"]').is(':visible')) {$('input[name="ingredients[104]"]').click();}}
						if (typeof $('input[name="ingredients[105]"]') != 'undefined') {if ($('input[name="ingredients[105]"]').is(':visible')) {$('input[name="ingredients[105]"]').click();}}
						if (typeof $('input[name="ingredients[110]"]') != 'undefined') {if ($('input[name="ingredients[110]"]').is(':visible')) {$('input[name="ingredients[110]"]').click();}}
						if (typeof $('input[name="ingredients[111]"]') != 'undefined') {if ($('input[name="ingredients[111]"]').is(':visible')) {$('input[name="ingredients[111]"]').click();}}
						if (typeof $('input[name="ingredients[112]"]') != 'undefined') {if ($('input[name="ingredients[112]"]').is(':visible')) {$('input[name="ingredients[112]"]').click();}}
						if (typeof $('input[name="ingredients[113]"]') != 'undefined') {if ($('input[name="ingredients[113]"]').is(':visible')) {$('input[name="ingredients[113]"]').click();}}
						if (typeof $('input[name="ingredients[114]"]') != 'undefined') {if ($('input[name="ingredients[114]"]').is(':visible')) {$('input[name="ingredients[114]"]').click();}}
						if (typeof $('input[name="ingredients[115]"]') != 'undefined') {if ($('input[name="ingredients[115]"]').is(':visible')) {$('input[name="ingredients[115]"]').click();}}
						if (typeof $('input[name="ingredients[116]"]') != 'undefined') {if ($('input[name="ingredients[116]"]').is(':visible')) {$('input[name="ingredients[116]"]').click();}}
					}
				}).toString() + ")();";
			inject_global(script_add_buttons);
	}
	
	//кнопка покупки ресурсов
	if (myoptions.metall_buy_rudpol) {
		if (typeof $('#curfurnace').html() != 'undefined') {
			if (($('#curfurnace').html().search("Учебная")!=-1) || ($('#curfurnace').html().search("Рабочая")!=-1) || ($('#curfurnace').html().search("мастеров")!=-1))
					{
				$("#buildingMenu").append("<a class='textS' href='#' onclick=\"top.core.modeSwitch('stock', {'mode': 'buy', 'categories': [40], 'shops': ['miner']});\">Купить руду</a>").append("<br>").append("<a class='textS' href='#' onclick=\"top.core.modeSwitch('stock', {'mode': 'buy', 'categories': [40], 'shops': ['sawmill2']});\">Купить полешки</a>");
	}}}
	//=========================end.

});