// ==UserScript==7
// @name        zatochka_button
// @include     www.ereality.ru/move/wizglade*
// @include     www.ereality.ru/move/smith*
// @include     www.ereality.ru/map.php?sc=7
// @include     www.ereality.ru/map.php?sc=8
// @include     www.ereality.ru/map.php?sc=9
// @include     www.ereality.ru/map.php?js=tikerTick*
// @require     tools.js
// @all-frames  true
// ==/UserScript==

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);
	systemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);
	
	if (!myoptions.unpaused) {
		return;
	}

	// Ссылка поиск услуг
	if (myoptions.uslugi_igrokov) {
		var loka =  top.document.getElementById('span_location');
		if (typeof $(loka).html() != 'undefined') {
			if (($(loka).html().search("Полянка")!=-1) || ($(loka).html().search("Кузница")!=-1)) 
			$("#buildingMenu").append($("<a/>", {target:"_blank", href:"https://er-help.ru/index.php/informatsiya/55", text:"Поиск услуг"}));
			
		}
	}	

	// Качество заточки
	if (myoptions.kachestvo_zatochki) {
		if ($("div [id^='ibtn']").length)
		{
			el = $("div [id^='ibtn']");
			for (j=0;j<el.length;j++)
			{
				params = new Array ("Мин. удар: ", "Макс. удар: ", "Сокрушение: ", "Стойкость: ","Уворот: ","Точность: ","Пробой блока: ","Пробой брони: ","Жизни: ","Мана: ","Сила: ","Ловкость: ","Интуиция: ","Мудрость: ","Интеллект: ","Защита головы: ","Защита корпуса: ","Защита рук: ","Защита пояса: ","Защита ног: ","Здоровье: ");
				dannie = (el.eq(j).parent().parent().parent().html()).replace(new RegExp('<font color="#009900">','g'),"").replace(new RegExp('</font>','g'),"").replace(new RegExp('%','g'),"").replace(new RegExp(/\+/,'g'),"");
				pos = dannie.indexOf("<b>");
				znachenie = dannie.substr(pos);				
				name_weapons = znachenie.substr(3,znachenie.indexOf("</b>")-3);
				name_weapons = (name_weapons.indexOf("[")!=-1)?(name_weapons.substr(0,name_weapons.indexOf("["))):(name_weapons);
				name_weapons = (name_weapons.indexOf("(")!=-1)?(name_weapons.substr(0,name_weapons.indexOf("("))):(name_weapons);
				pos = dannie.indexOf("Уровень: ");
				znachenie = dannie.substr(pos);	
				levl = znachenie.substr(("Уровень: ").length+3,znachenie.indexOf("</b>")-(("Уровень: ").length+3));		
				pos = dannie.indexOf("Бонусных апов: ");
				if (pos!=-1) {levl=Number(levl)+Number(dannie.substr(dannie.indexOf("Бонусных апов: ")+18,1));};
				str = "375-0-0-1-"+levl+"-0-6-0";
				for (i=0;i<params.length;i++)
				{
					pos = dannie.indexOf(params[i]);
					if (pos==-1)
					{
						str = str+"-0";
					}
					else
					{
						znachenie = dannie.substr(pos);
						str = str+"-"+znachenie.substr(params[i].length+3,znachenie.indexOf("</b>")-(params[i].length+3));
					}

				}

				el.eq(j).after($("<a/>", {target:"_blank", href:"https://er-help.ru/scripts/orujeinik.php?load="+str+"-"+name_weapons, title:"Посмотреть заточку"}).append($("<img>", {src: kango.io.getResourceUrl("res/yo-bods-search.png"), title:"Посмотреть заточку"})));
			}
		}
		else if ($("#tbl0").length)
		{
			params = new Array ("Мин. удар: ", "Макс. удар: ", "Сокрушение: ", "Стойкость: ","Уворот: ","Точность: ","Пробой блока: ","Пробой брони: ","Жизни: ","Мана: ","Сила: ","Ловкость: ","Интуиция: ","Мудрость: ","Интеллект: ","Защита головы: ","Защита корпуса: ","Защита рук: ","Защита пояса: ","Защита ног: ","Здоровье: ");
			divka = $("#tbl0:first");
			dannie = (divka.parent().html()).replace(new RegExp('<font color="#009900">','g'),"").replace(new RegExp('</font>','g'),"").replace(new RegExp('%','g'),"").replace(new RegExp(/\+/,'g'),"");
			pos = dannie.indexOf("<b>");
			znachenie = dannie.substr(pos);
			name_weapons = znachenie.substr(3,znachenie.indexOf("</b>")-3);
			name_weapons = (name_weapons.indexOf("[")!=-1)?(name_weapons.substr(0,name_weapons.indexOf("["))):(name_weapons);
			name_weapons = (name_weapons.indexOf("(")!=-1)?(name_weapons.substr(0,name_weapons.indexOf("("))):(name_weapons);
			pos = dannie.indexOf("Уровень: ");
			znachenie = dannie.substr(pos);		
			levl = znachenie.substr(("Уровень: ").length+3,znachenie.indexOf("</b>")-(("Уровень: ").length+3));
			pos = dannie.indexOf("Бонусных апов: ");
			if (pos!=-1) {levl=Number(levl)+Number(dannie.substr(dannie.indexOf("Бонусных апов: ")+18,1));};	
			str = "375-0-0-1-"+levl+"-0-6-0";
			for (i=0;i<params.length;i++)
			{
				pos = dannie.lastIndexOf(params[i]);
				if (pos==-1)
				{
					str = str+"-0";
				}
				else
				{
					znachenie = dannie.substr(pos);
					str = str+"-"+znachenie.substr(params[i].length+3,znachenie.indexOf("</b>")-(params[i].length+3));
				}

			}
			divka.parent().append($("<input>", {type:"button", title:"Посмотреть заточку", class:"butt1", value:" Посмотреть заточку "}).click(function(){window.open("https://er-help.ru/scripts/orujeinik.php?load="+str+"-"+name_weapons,"_blank");}));
		}
	}
});
