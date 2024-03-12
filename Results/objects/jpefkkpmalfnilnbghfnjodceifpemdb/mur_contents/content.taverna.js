// ==UserScript==
// @name        taverna
// @include     www.ereality.ru/map*mode=craft
// @include     www.ereality.ru/map*mode=workers
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
		myoptions = mergeOptions(value, defaultConfig.myoptions);
		var systemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);
			buy_taverna_count = systemOptions.buy_taverna_count;

		if (!myoptions.unpaused) {
			return;
		}
		//===================================================================== 
		if (myoptions.taverna_fast_click) {
		script = "(" +
			(function() {

			taverna.my_craft = function(idRecipe, count1, count2, count3, cid1, cid2, cid3) {
				var action = "";
				if (taverna.timeEndWorkers > taverna.curTime) action="fillQueue" 
				else action="startCraft";	
				var xmlText = '<request action="'+action+'"><idRecipe>' + idRecipe +
				 '</idRecipe><component id="'+cid1+'">'   + count1 +
				  '</component><component id="'+cid2+'">' + count2 + 
				  '</component><component id="'+cid3+'">' + count3 + 
				  '</component></request>';
				top.core.xmlSend(taverna.xmlPath, xmlText, taverna.processResponse);
				return;
			}
				
			taverna.pro_fish=100;
			taverna.my_init = function() {
					if (taverna.page=="FishSoup") {					
						$("img[src*=fish_01]")[0].onclick = function() {taverna.my_craft(0, 5, 0, 0, 21, 22, 23)};
						$("img[src*=fish_02]")[0].onclick = function() {taverna.my_craft(0, 0, 5, 0, 21, 22, 23)};
						$("img[src*=fish_03]")[0].onclick = function() {taverna.my_craft(0, 0, 0, 5, 21, 22, 23)};
						if (taverna.pro_fish>=25) {
						$("img[src*=fish_01]")[1].onclick = function() {taverna.my_craft(1, 9, 0, 0, 21, 22, 23)};
						$("img[src*=fish_02]")[1].onclick = function() {taverna.my_craft(1, 0, 9, 0, 21, 22, 23)};
						$("img[src*=fish_03]")[1].onclick = function() {taverna.my_craft(1, 0, 0, 9, 21, 22, 23)};
						}
						if (taverna.pro_fish>=75) {
						$("img[src*=fish_01]")[2].onclick = function() {taverna.my_craft(2, 15, 0, 0, 21, 22, 23)};
						$("img[src*=fish_02]")[2].onclick = function() {taverna.my_craft(2, 0, 15, 0, 21, 22, 23)};
						$("img[src*=fish_03]")[2].onclick = function() {taverna.my_craft(2, 0, 0, 15, 21, 22, 23)};
						}
				} else {
					if (taverna.page=="CrabSticks") {	
						$("img[src*=crab_01]")[0].onclick = function() {taverna.my_craft(3, 9, 0, 0, 27, 28, 29)};
						$("img[src*=crab_01]")[1].onclick = function() {taverna.my_craft(3, 0, 9, 0, 27, 28, 29)};
						$("img[src*=crab_01]")[2].onclick = function() {taverna.my_craft(3, 0, 0, 9, 27, 28, 29)};
						if (taverna.pro_fish>=25) {
						$("img[src*=crab_02]")[0].onclick = function() {taverna.my_craft(4, 9, 0, 0, 30, 31, 32)};
						$("img[src*=crab_02]")[1].onclick = function() {taverna.my_craft(4, 0, 9, 0, 30, 31, 32)};
						}
						if (taverna.pro_fish>=50) {
						$("img[src*=crab_03]")[0].onclick = function() {taverna.my_craft(5, 9, 0, 0, 33, 34, 35)};
						$("img[src*=crab_03]")[1].onclick = function() {taverna.my_craft(5, 0, 9, 0, 33, 34, 35)};
						$("img[src*=crab_03]")[2].onclick = function() {taverna.my_craft(5, 0, 0, 9, 33, 34, 35)};
						}
					}
					}
				return;
			}

		var old_getCrabSticksHTML = taverna.getCrabSticksHTML;
		taverna.getCrabSticksHTML = function() {
			old_getCrabSticksHTML();
			taverna.my_init();
		}
		var old_getFishSoupHTML = taverna.getFishSoupHTML;
		taverna.getFishSoupHTML = function() {
			old_getFishSoupHTML();
			taverna.my_init();
		}
		window.setTimeout(function() { taverna.my_init()} , 50);
				
		}).toString() + ")();";
		}		
				
		if (myoptions.buy_taverna) {
		script = "(" +
			(function() {
		window.setTimeout(function buy_taverna(){ 
			$("a[href^='javascript:taverna']").click(function () {setTimeout(function () {buy_taverna();},100);});
			if (taverna.page=="FishSoup") {						
				$("img[src$='https://img.ereality.ru/w/fish_01.png']").first().parent().append("<input id='buy_taverna_1_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Текели-ли'>").append("<input id='buy_taverna_1_but' type='button' value='+' title='Купить Текели-ли'>");	
				$("#buy_taverna_1_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":21,"count":'+Number($("#buy_taverna_1_col").val())+'},"client":1}',function() {$("td[idcomponent='21']").html(Number($("#buy_taverna_1_col").val())+Number($("td[idcomponent='21']").html()));},"json");})
				
				$("img[src$='https://img.ereality.ru/w/fish_02.png']").first().parent().append("<input id='buy_taverna_2_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Иннсмаута'>").append("<input id='buy_taverna_2_but' type='button' value='+' title='Купить Иннсмаут'>");	
				$("#buy_taverna_2_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":22,"count":'+Number($("#buy_taverna_2_col").val())+'},"client":1}',function() {$("td[idcomponent='22']").html(Number($("#buy_taverna_2_col").val())+Number($("td[idcomponent='22']").html()));},"json");})	
				
				$("img[src$='https://img.ereality.ru/w/fish_03.png']").first().parent().append("<input id='buy_taverna_3_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Сеймуреллы'>").append("<input id='buy_taverna_3_but' type='button' value='+' title='Купить Сеймуреллу'>");	
				$("#buy_taverna_3_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":23,"count":'+Number($("#buy_taverna_3_col").val())+'},"client":1}',function() {$("td[idcomponent='23']").html(Number($("#buy_taverna_3_col").val())+Number($("td[idcomponent='23']").html()));},"json");})					
			}
			else {
			if (taverna.page=="CrabSticks") {					
				$("img[src$='https://img.ereality.ru/w/crab_01.png']").eq(0).parent().append("<input id='buy_taverna_4_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Лобстер 1'>").append("<input id='buy_taverna_4_but' type='button' value='+' title='Купить Лобстер 1'>");	
				$("#buy_taverna_4_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":27,"count":'+Number($("#buy_taverna_4_col").val())+'},"client":1}',function() {$("td[idcomponent='27']").html(Number($("#buy_taverna_4_col").val())+Number($("td[idcomponent='27']").html()));},"json");})
				
				$("img[src$='https://img.ereality.ru/w/crab_01.png']").eq(1).parent().append("<input id='buy_taverna_5_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Лобстер 2'>").append("<input id='buy_taverna_5_but' type='button' value='+' title='Купить Лобстер 2'>");	
				$("#buy_taverna_5_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":28,"count":'+Number($("#buy_taverna_5_col").val())+'},"client":1}',function() {$("td[idcomponent='28']").html(Number($("#buy_taverna_5_col").val())+Number($("td[idcomponent='28']").html()));},"json");})	
				
				$("img[src$='https://img.ereality.ru/w/crab_01.png']").eq(2).parent().append("<input id='buy_taverna_6_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Лобстер 3'>").append("<input id='buy_taverna_6_but' type='button' value='+' title='Купить Лобстер 3'>");	
				$("#buy_taverna_6_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":29,"count":'+Number($("#buy_taverna_6_col").val())+'},"client":1}',function() {$("td[idcomponent='29']").html(Number($("#buy_taverna_6_col").val())+Number($("td[idcomponent='29']").html()));},"json");})	
				
								
				$("img[src$='https://img.ereality.ru/w/crab_02.png']").eq(0).parent().append("<input id='buy_taverna_7_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Краб 1'>").append("<input id='buy_taverna_7_but' type='button' value='+' title='Купить Краб 1'>");	
				$("#buy_taverna_7_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":30,"count":'+Number($("#buy_taverna_7_col").val())+'},"client":1}',function() {$("td[idcomponent='30']").html(Number($("#buy_taverna_7_col").val())+Number($("td[idcomponent='30']").html()));},"json");})
				
				$("img[src$='https://img.ereality.ru/w/crab_02.png']").eq(1).parent().append("<input id='buy_taverna_8_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Краб 2'>").append("<input id='buy_taverna_8_but' type='button' value='+' title='Купить Краб 2'>");	
				$("#buy_taverna_8_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":31,"count":'+Number($("#buy_taverna_8_col").val())+'},"client":1}',function() {$("td[idcomponent='31']").html(Number($("#buy_taverna_8_col").val())+Number($("td[idcomponent='31']").html()));},"json");})	
				
				
								
				$("img[src$='https://img.ereality.ru/w/crab_03.png']").eq(0).parent().append("<input id='buy_taverna_9_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Хищник 1'>").append("<input id='buy_taverna_9_but' type='button' value='+' title='Купить Хищник 1'>");	
				$("#buy_taverna_9_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":33,"count":'+Number($("#buy_taverna_9_col").val())+'},"client":1}',function() {$("td[idcomponent='33']").html(Number($("#buy_taverna_9_col").val())+Number($("td[idcomponent='33']").html()));},"json");})
				
				$("img[src$='https://img.ereality.ru/w/crab_03.png']").eq(1).parent().append("<input id='buy_taverna_10_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Хищник 2'>").append("<input id='buy_taverna_10_but' type='button' value='+' title='Купить Хищник 2'>");	
				$("#buy_taverna_10_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":34,"count":'+Number($("#buy_taverna_10_col").val())+'},"client":1}',function() {$("td[idcomponent='34']").html(Number($("#buy_taverna_10_col").val())+Number($("td[idcomponent='34']").html()));},"json");})	
				
				$("img[src$='https://img.ereality.ru/w/crab_03.png']").eq(2).parent().append("<input id='buy_taverna_11_col' type='text' style='width:25px;' value='buy_taverna_count' title='Количество Хищник 3'>").append("<input id='buy_taverna_11_but' type='button' value='+' title='Купить Хищник 3'>");	
				$("#buy_taverna_11_but").click(function () {$.post("https://www.ereality.ru/ajax/json.php",'{"controller":"stock","action":"buy","params":{"id":35,"count":'+Number($("#buy_taverna_11_col").val())+'},"client":1}',function() {$("td[idcomponent='35']").html(Number($("#buy_taverna_11_col").val())+Number($("td[idcomponent='35']").html()));},"json");})	
				
			}}
		} , 50);
		}).toString().replace(/buy_taverna_count/gi,buy_taverna_count) + ")();";
}
	//Обновка инфы для таймера таверны

		script= script+ "(" +
	(function(){
	var OldprocessResponse=taverna.processResponse;
	taverna.processResponse=function(xml){
		var myrezult=OldprocessResponse.apply(taverna,arguments);
		top.core.mur_timer.taverna_update = true;
	    return myrezult
	}
	
	}).toString()
	+ ")();"; 

	inject_global(script);
	

	//=========================end.
});