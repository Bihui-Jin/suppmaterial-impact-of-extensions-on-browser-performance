// ==UserScript==
// @name        kudes_button
// @include     www.ereality.ru/map.php?action=demands
// @include     https://www.ereality.ru/map.php?action=create_demand*
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
	
	//кнопка покупки ресурсов
	if (myoptions.kudes_buy_rudpol) {
		var loka =  top.document.getElementById('span_location');
		if (typeof $(loka).html() != 'undefined') {
			if ($(loka).html().search("Полянка")!=-1)
			$("#buildingMenu").append("<br>").append("<a class='textS' href='#' onclick=\"top.core.modeSwitch('stock', {'mode': 'buy', 'categories': [40], 'shops': ['wizard']});\">Купить экстракты</a>");
		}
	}
	
	
	//кнопка покупки ресурсов
	if (myoptions.calc_kudes_polyana) {
		var loka =  top.document.getElementById('span_location');
		if (typeof $(loka).html() != 'undefined') {
			if ($(loka).html().search("Полянка")!=-1)
				//сила|ловкость|интуиция|мудрость|интеллект|ОД|жизни|мана|сокрушение|уворот|точность|стойкость|пр.брони|пр.блока|доп.урон|защита|c.огню|c.воде|c.воздуху|c.земле|дивный			
		extrakt=systemOptions.calc_kudes_prise.split("|");
			$("img[src$='https://img.ereality.ru/d2009/kud/kat/easy.png']").each(function(index, element){
				dannie = $(element).parent().parent().html();
				lvl = (dannie.substr(dannie.indexOf("https://img.ereality.ru/d2009/kud/kat/easy.png")));
				lvl = Number(lvl.substr(lvl.indexOf("[")+1,lvl.indexOf("]")-lvl.indexOf("[")-1));
				cena = Number(extrakt[20]);
				if (dannie.indexOf("kud/20x20/sila.png")!=-1) {cena = cena + (Number(extrakt[0])*5);}
				if (dannie.indexOf("kud/20x20/lovkost.png")!=-1) {cena = cena + (Number(extrakt[1])*5);}
				if (dannie.indexOf("kud/20x20/inta.png")!=-1) {cena = cena + (Number(extrakt[2])*5);}
				if (dannie.indexOf("kud/20x20/mudrost.png")!=-1) {cena = cena + (Number(extrakt[3])*5);}
				if (dannie.indexOf("kud/20x20/intellekt.png")!=-1) {cena = cena + (Number(extrakt[4])*5);}
				if (dannie.indexOf("kud/20x20/od.png")!=-1) {cena = cena + (Number(extrakt[5])*lvl*10);}
				if (dannie.indexOf("kud/20x20/jizn.png")!=-1) {cena = cena + (Number(extrakt[6])*lvl*10);}
				if (dannie.indexOf("kud/20x20/mana.png")!=-1) {cena = cena + (Number(extrakt[7])*lvl*10);}
				if (dannie.indexOf("kud/20x20/sokrushenie.png")!=-1) {cena = cena + (Number(extrakt[8])*lvl*5);}
				if (dannie.indexOf("kud/20x20/uvorot.png")!=-1) {cena = cena + (Number(extrakt[9])*lvl*5);}
				if (dannie.indexOf("kud/20x20/tochnost.png")!=-1) {cena = cena + (Number(extrakt[10])*lvl*5);}
				if (dannie.indexOf("kud/20x20/stoykost.png")!=-1) {cena = cena + (Number(extrakt[11])*lvl*5);}
				if (dannie.indexOf("kud/20x20/proboy_broni.png")!=-1) {cena = cena + Math.round((Number(extrakt[12])*lvl*3)*10)/10;}
				if (dannie.indexOf("kud/20x20/proboy_bloka.png")!=-1) {cena = cena + Math.round((Number(extrakt[13])*lvl*3)*10)/10;}
				if (dannie.indexOf("kud/20x20/dop_uron.png")!=-1) {cena = cena + (Number(extrakt[14])*15);}
				if (dannie.indexOf("kud/20x20/zashita.png")!=-1) {cena = cena + (Number(extrakt[15])*lvl*2);}
				if (dannie.indexOf("kud/20x20/sop_ogon.png")!=-1) {cena = cena + (Number(extrakt[16])*(lvl));}
				if (dannie.indexOf("kud/20x20/sop_voda.png")!=-1) {cena = cena + (Number(extrakt[17])*(lvl));}
				if (dannie.indexOf("kud/20x20/sop_vozduh.png")!=-1) {cena = cena + (Number(extrakt[18])*(lvl));}
				if (dannie.indexOf("kud/20x20/sop_zemlya.png")!=-1) {cena = cena + (Number(extrakt[19])*(lvl));}
				$(element).parent().append(cena);
			});
			$("img[src$='https://img.ereality.ru/d2009/kud/kat/normal.png']").each(function(index, element){
				dannie = $(element).parent().parent().html();
				lvl = (dannie.substr(dannie.indexOf("https://img.ereality.ru/d2009/kud/kat/normal.png")));
				lvl = Number(lvl.substr(lvl.indexOf("[")+1,lvl.indexOf("]")-lvl.indexOf("[")-1));
				cena = Number(extrakt[20])*2;
				if (dannie.indexOf("kud/20x20/sila.png")!=-1) {cena = cena + (Number(extrakt[0]));}
				if (dannie.indexOf("kud/20x20/lovkost.png")!=-1) {cena = cena + (Number(extrakt[1]));}
				if (dannie.indexOf("kud/20x20/inta.png")!=-1) {cena = cena + (Number(extrakt[2]));}
				if (dannie.indexOf("kud/20x20/mudrost.png")!=-1) {cena = cena + (Number(extrakt[3]));}
				if (dannie.indexOf("kud/20x20/intellekt.png")!=-1) {cena = cena + (Number(extrakt[4]));}
				if (dannie.indexOf("kud/20x20/od.png")!=-1) {cena = cena + (Number(extrakt[5])*lvl*2);}
				if (dannie.indexOf("kud/20x20/jizn.png")!=-1) {cena = cena + (Number(extrakt[6])*lvl*2);}
				if (dannie.indexOf("kud/20x20/mana.png")!=-1) {cena = cena + (Number(extrakt[7])*lvl*2);}
				if (dannie.indexOf("kud/20x20/sokrushenie.png")!=-1) {cena = cena + (Number(extrakt[8])*lvl);} 
				if (dannie.indexOf("kud/20x20/uvorot.png")!=-1) {cena = cena + (Number(extrakt[9])*lvl);}
				if (dannie.indexOf("kud/20x20/tochnost.png")!=-1) {cena = cena + (Number(extrakt[10])*lvl);}
				if (dannie.indexOf("kud/20x20/stoykost.png")!=-1) {cena = cena + (Number(extrakt[11])*lvl);}
				if (dannie.indexOf("kud/20x20/proboy_broni.png")!=-1) {cena = cena + Math.round((Number(extrakt[12])*lvl*2/3)*10)/10;}
				if (dannie.indexOf("kud/20x20/proboy_bloka.png")!=-1) {cena = cena + Math.round((Number(extrakt[13])*lvl*2/3)*10)/10;}
				if (dannie.indexOf("kud/20x20/dop_uron.png")!=-1) {cena = cena + (Number(extrakt[14])*3);}
				if (dannie.indexOf("kud/20x20/zashita.png")!=-1) {cena = cena + (Number(extrakt[15])*lvl/2);}
				if (dannie.indexOf("kud/20x20/sop_ogon.png")!=-1) {cena = cena + (Number(extrakt[16])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_voda.png")!=-1) {cena = cena + (Number(extrakt[17])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_vozduh.png")!=-1) {cena = cena + (Number(extrakt[18])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_zemlya.png")!=-1) {cena = cena + (Number(extrakt[19])*(lvl-9));}
				$(element).parent().append(cena);

			});
			$("img[src$='https://img.ereality.ru/d2009/kud/kat/hard.png']").each(function(index, element){
				dannie = $(element).parent().parent().html();
				lvl = (dannie.substr(dannie.indexOf("https://img.ereality.ru/d2009/kud/kat/hard.png")));
				lvl = Number(lvl.substr(lvl.indexOf("[")+1,lvl.indexOf("]")-lvl.indexOf("[")-1));
				cena = Number(extrakt[20])*3;
				if (dannie.indexOf("kud/20x20/sila.png")!=-1) {cena = cena + (Number(extrakt[0]));}
				if (dannie.indexOf("kud/20x20/lovkost.png")!=-1) {cena = cena + (Number(extrakt[1]));}
				if (dannie.indexOf("kud/20x20/inta.png")!=-1) {cena = cena + (Number(extrakt[2]));}
				if (dannie.indexOf("kud/20x20/mudrost.png")!=-1) {cena = cena + (Number(extrakt[3]));}
				if (dannie.indexOf("kud/20x20/intellekt.png")!=-1) {cena = cena + (Number(extrakt[4]));}
				if (dannie.indexOf("kud/20x20/od.png")!=-1) {cena = cena + (Number(extrakt[5])*lvl*2);}
				if (dannie.indexOf("kud/20x20/jizn.png")!=-1) {cena = cena + (Number(extrakt[6])*lvl*2);}
				if (dannie.indexOf("kud/20x20/mana.png")!=-1) {cena = cena + (Number(extrakt[7])*lvl*2);}
				if (dannie.indexOf("kud/20x20/sokrushenie.png")!=-1) {cena = cena + (Number(extrakt[8])*lvl);}
				if (dannie.indexOf("kud/20x20/uvorot.png")!=-1) {cena = cena + (Number(extrakt[9])*lvl);}
				if (dannie.indexOf("kud/20x20/tochnost.png")!=-1) {cena = cena + (Number(extrakt[10])*lvl);}
				if (dannie.indexOf("kud/20x20/stoykost.png")!=-1) {cena = cena + (Number(extrakt[11])*lvl);}
				if (dannie.indexOf("kud/20x20/proboy_broni.png")!=-1) {cena = cena + Math.round((Number(extrakt[12])*lvl*2/3)*10)/10;}
				if (dannie.indexOf("kud/20x20/proboy_bloka.png")!=-1) {cena = cena + Math.round((Number(extrakt[13])*lvl*2/3)*10)/10;}
				if (dannie.indexOf("kud/20x20/dop_uron.png")!=-1) {cena = cena + (Number(extrakt[14])*3);}
				if (dannie.indexOf("kud/20x20/zashita.png")!=-1) {cena = cena + (Number(extrakt[15])*lvl/2);}
				if (dannie.indexOf("kud/20x20/sop_ogon.png")!=-1) {cena = cena + (Number(extrakt[16])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_voda.png")!=-1) {cena = cena + (Number(extrakt[17])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_vozduh.png")!=-1) {cena = cena + (Number(extrakt[18])*(lvl-9));}
				if (dannie.indexOf("kud/20x20/sop_zemlya.png")!=-1) {cena = cena + (Number(extrakt[19])*(lvl-9));}
				$(element).parent().append(cena);
			});
			
			//привет. не нужно улучшать, тестирую плагин
		}
	}
	
			
	
	//кнопка покупки ресурсов
	if (myoptions.ss_kudes_stav) {//сила|ловкость|интуиция|мудрость|интеллект|ОД|жизни|мана|сокрушение|уворот|точность|стойкость|пр.брони|пр.блока|доп.урон|защита|c.огню|c.воде|c.воздуху|c.земле|дивный			
	//20|35|29|12|15|1|0.7|0.9|1|2.7|1.3|1.3|2.3|2|12|1.8|2.5|2.5|3|2.5|60
		extrakt=systemOptions.calc_kudes_prise.split("|");
		$("#param_w_add_str").attr("title",(Number(extrakt[0])*($("#param_w_add_str").text()).substr(7))).append(" ("+Math.round(Number(extrakt[0])*($("#param_w_add_str").text()).substr(7)*10)/10+"с.)");
		$("#param_w_add_dex").attr("title",(Number(extrakt[1])*($("#param_w_add_dex").text()).substr(10))).append(" ("+Math.round(Number(extrakt[1])*($("#param_w_add_dex").text()).substr(10)*10)/10+"с.)");
		$("#param_w_add_luk").attr("title",(Number(extrakt[2])*($("#param_w_add_luk").text()).substr(11))).append(" ("+Math.round(Number(extrakt[2])*($("#param_w_add_luk").text()).substr(11)*10)/10+"с.)");
		$("#param_w_add_sta").attr("title",(Number(extrakt[3])*($("#param_w_add_sta").text()).substr(11))).append(" ("+Math.round(Number(extrakt[3])*($("#param_w_add_sta").text()).substr(11)*10)/10+"с.)");
		$("#param_w_add_int").attr("title",(Number(extrakt[4])*($("#param_w_add_int").text()).substr(12))).append(" ("+Math.round(Number(extrakt[4])*($("#param_w_add_int").text()).substr(12)*10)/10+"с.)");
		$("#param_w_add_od").attr("title",(Number(extrakt[5])*($("#param_w_add_od").text()).substr(5))).append(" ("+Math.round(Number(extrakt[5])*($("#param_w_add_od").text()).substr(5)*10)/10+"с.)"); 
		$("#param_w_add_hp").attr("title",(Number(extrakt[6])*($("#param_w_add_hp").text()).substr(8))).append(" ("+Math.round(Number(extrakt[6])*($("#param_w_add_hp").text()).substr(8)*10)/10+"с.)");
		$("#param_w_add_ma").attr("title",(Number(extrakt[7])*($("#param_w_add_ma").text()).substr(7))).append(" ("+Math.round(Number(extrakt[7])*($("#param_w_add_ma").text()).substr(7)*10)/10+"с.)");		
		$("#param_w_add_kr").attr("title",(Number(extrakt[8])*($("#param_w_add_kr").text()).substr(13))).append(" ("+Math.round(Number(extrakt[8])*($("#param_w_add_kr").text()).substr(13)*10)/10+"с.)");
		$("#param_w_add_uv").attr("title",(Number(extrakt[9])*($("#param_w_add_uv").text()).substr(9))).append(" ("+Math.round(Number(extrakt[9])*($("#param_w_add_uv").text()).substr(9)*10)/10+"с.)");
		$("#param_w_add_anuv").attr("title",(Number(extrakt[10])*($("#param_w_add_anuv").text()).substr(11))).append(" ("+Math.round(Number(extrakt[10])*($("#param_w_add_anuv").text()).substr(11)*10)/10+"с.)");
		$("#param_w_add_ankr").attr("title",(Number(extrakt[11])*($("#param_w_add_ankr").text()).substr(12))).append(" ("+Math.round(Number(extrakt[11])*($("#param_w_add_ankr").text()).substr(12)*10)/10+"с.)");
		$("#param_w_add_anar").attr("title",(Number(extrakt[12])*($("#param_w_add_anar").text()).substr(15))).append(" ("+Math.round(Number(extrakt[12])*($("#param_w_add_anar").text()).substr(15)*10)/10+"с.)");
		$("#param_w_add_anbl").attr("title",(Number(extrakt[13])*($("#param_w_add_anbl").text()).substr(15))).append(" ("+Math.round(Number(extrakt[13])*($("#param_w_add_anbl").text()).substr(15)*10)/10+"с.)");
		$("#param_w_add_dam").attr("title",(Number(extrakt[14])*($("#param_w_add_dam").text()).substr(12))).append(" ("+Math.round(Number(extrakt[14])*($("#param_w_add_dam").text()).substr(12)*10)/10+"с.)");		
		$("#param_w_add_bl_1").attr("title",(Number(extrakt[15])*($("#param_w_add_bl_1").text()).substr(16))).append(" ("+Math.round(Number(extrakt[15])*($("#param_w_add_bl_1").text()).substr(16)*10)/10+"с.)");
		$("#param_w_add_bl_2").attr("title",(Number(extrakt[15])*($("#param_w_add_bl_2").text()).substr(17))).append(" ("+Math.round(Number(extrakt[15])*($("#param_w_add_bl_2").text()).substr(17)*10)/10+"с.)");
		$("#param_w_add_bl_3").attr("title",(Number(extrakt[15])*($("#param_w_add_bl_3").text()).substr(13))).append(" ("+Math.round(Number(extrakt[15])*($("#param_w_add_bl_3").text()).substr(13)*10)/10+"с.)");
		$("#param_w_add_bl_4").attr("title",(Number(extrakt[15])*($("#param_w_add_bl_4").text()).substr(15))).append(" ("+Math.round(Number(extrakt[15])*($("#param_w_add_bl_4").text()).substr(15)*10)/10+"с.)");
		$("#param_w_add_bl_5").attr("title",(Number(extrakt[15])*($("#param_w_add_bl_5").text()).substr(13))).append(" ("+Math.round(Number(extrakt[15])*($("#param_w_add_bl_5").text()).substr(13)*10)/10+"с.)");		
		$("#param_w_add_resist2").attr("title",(Number(extrakt[16])*($("#param_w_add_resist2").text()).substr(19))).append(" ("+Math.round(Number(extrakt[16])*($("#param_w_add_resist2").text()).substr(19)*10)/10+"с.)");	
		$("#param_w_add_resist3").attr("title",(Number(extrakt[17])*($("#param_w_add_resist3").text()).substr(19))).append(" ("+Math.round(Number(extrakt[17])*($("#param_w_add_resist3").text()).substr(19)*10)/10+"с.)");	
		$("#param_w_add_resist5").attr("title",(Number(extrakt[18])*($("#param_w_add_resist5").text()).substr(22))).append(" ("+Math.round(Number(extrakt[18])*($("#param_w_add_resist5").text()).substr(22)*10)/10+"с.)");	
		$("#param_w_add_resist4").attr("title",(Number(extrakt[19])*($("#param_w_add_resist4").text()).substr(20))).append(" ("+Math.round(Number(extrakt[19])*($("#param_w_add_resist4").text()).substr(20)*10)/10+"с.)");
		$("span").on("click", function () {cena_kudesa_na_polyane();});
		function cena_kudesa_na_polyane ()
		{
			cena = Number(systemOptions.ss_kudes_stav_count);
			$("span[style$='cursor: pointer; color: rgb(0, 0, 204);']").each(function (){
				if ($(this).text()=="Простое") {cena = cena+extrakt[20]*1;}
				else if ($(this).text()=="Среднее") {cena = cena+extrakt[20]*2;}
				else if ($(this).text()=="Сложное") {cena = cena+extrakt[20]*3;}
				else {cena = cena + Number($(this).attr("title"));}				
			});
			$("#demand_price").val(cena);
		}
	}
	
});
