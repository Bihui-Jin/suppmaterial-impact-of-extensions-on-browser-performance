script_timers= "(" +
(function(){
	core.mur_timer = {};
	core.mur_timer.taverna = true;
	core.mur_timer.craftsman = true;
	core.mur_timer.craftsman2 = true;
	core.mur_timer.jeweler = true;
	core.mur_timer.jeweler2 = true;
	core.mur_timer.units_сard = true;
	core.mur_timer.tacktic = true;
	core.mur_timer.biryuza = true;
	core.mur_timer.malakhit = true;
	core.mur_timer.venetc = true;
	core.mur_timer.medal = true;
	core.mur_timer.kubok = true;
	core.mur_timer.runa = true;
	core.mur_timer.plazma = true;
	core.mur_timer.estate = true;
	core.mur_timer.pet = true;
	core.mur_timer.egg = true;
	core.mur_timer.elit_train = true;
	core.mur_timer.guildhall = true;
	core.mur_timer.ochrab = true;
	core.mur_timer.bloodiness = true;
	core.mur_timer.veteran = true;
	core.mur_timer.tracery = true;
	core.mur_timer.figure = true;
	core.mur_timer.aurhram = true;
	core.mur_timer.notification_personal_message = true;
	core.mur_timer.klan_kvest = true;
	core.mur_timer.miraur = true;
	core.mur_timer.waraur = true;
	core.mur_timer.mazzaur = true;
	core.mur_timer.always_show = false;
	core.mur_timer.taverna_update = true;
	core.mur_timer.craftsman_update = true;
	core.mur_timer.craftsman2_update = true;
	core.mur_timer.jeweler_update = true;
	core.mur_timer.jeweler2_update = true;
	core.mur_timer.tacktic_update = true;
	core.mur_timer.units_сard_update = true;
	core.mur_timer.estate_update = true;
	core.mur_timer.elit_training_update = true;
	core.mur_timer.guildhallning_update = true;
	core.mur_timer.pet_update = true;
	core.mur_timer.ochrab_update = true;
	core.mur_timer.bloodiness_update = true;
	core.mur_timer.veteran_update = true;
	core.mur_timer.tracery_update = true;
	core.mur_timer.figure_update = true;
	core.mur_timer.aurhram_update = true;
	core.mur_timer.klan_kvest_update = true;
	core.mur_timer.notification_personal_message_update = true;
	core.mur_timer.miraur_update = true;
	core.mur_timer.waraur_update = true;
	core.mur_timer.mazz_update = true;
	core.mur_timer.taverna_timer = new Date();
	core.mur_timer.craftsman_timer = new Date();
	core.mur_timer.craftsman2_timer = new Date();
	core.mur_timer.jeweler_timer = new Date();
	core.mur_timer.jeweler2_timer = new Date();
	core.mur_timer.tacktic_timer = new Date();
	core.mur_timer.units_сard_timer = new Date();
	core.mur_timer.elit_training_timer = new Date();
	core.mur_timer.guildhalling_timer = new Date();
	core.mur_timer.pet_timer = new Date();
	core.mur_timer.ochrab_timer = new Date();
	core.mur_timer.veteran_timer = new Date();
	core.mur_timer.klan_kvest_timer = new Date();
	core.mur_timer.notification_personal_message_timer = new Date();
	core.mur_timer.miraur_timer_1 = new Date();
	core.mur_timer.miraur_timer_2 = new Date();
	core.mur_timer.waraur_timer_1 = new Date();
	core.mur_timer.waraur_timer_2 = new Date();
	core.mur_timer.waraur_timer_3 = new Date();
	core.mur_timer.waraur_timer_4 = new Date();
	core.mur_timer.waraur_timer_5 = new Date();
	core.mur_timer.waraur_timer_6 = new Date();
	core.mur_timer.mazzaur_timer = new Date();
	core.mur_timer.ahram_timer = new Date();
	core.mur_timer.pet_timer_egg = new Date();
	core.mur_timer.estate_timer = new Date();
	core.mur_timer.estate_time = new Date();
	core.mur_timer.pet_cards = 0;
	core.mur_timer.pet_eggs = 0;
	core.mur_timer.estate_cards = 0;
	core.mur_timer.estate_type = 0;
	opac_extcount = opac_ext_count;
	opac_extcount2 = opac_ext_count2;
	core.mur_timer.ochrab_kol_tim=Math.max(Math.min(core.mur_timer.kol_ochrab,540),1);
	core.mur_timer.kol_set_sec_obnov_set=Math.max(Math.min(core.mur_timer.kol_sec_obnov,1800),10);
	timer_position="core.mur_timer.mytimer_position".split("|");
	core.mur_timer.flagock=0;
	
	core.mur_timer.getMyTime = function(time) {
		function format(ttime) {
			if (+ttime < 10) return "0" + ttime;
			return ttime;
		}
		var ntime = new Date();
		if (time>=ntime)
		{
			hour = parseInt((time - ntime) / 3600000);
			minutes = parseInt(((time - ntime) - hour * 3600000) / 60000);
			return hour + ":" + format(minutes);
		}
		else
		{
			hour = parseInt((ntime - time) / 3600000);
			minutes = parseInt(((ntime - time) - hour * 3600000) / 60000);
			return "-"+hour + ":" + format(minutes);
		}
		
		
	}
	
	core.mur_timer.init = function() {
		if ((core.mur_timer.taverna)) {core.mur_timer.taverna_getinfo();}
		if ((core.mur_timer.jeweler)) {core.mur_timer.jeweler_getinfo();}
		if ((core.mur_timer.jeweler2)) {core.mur_timer.jeweler2_getinfo();}
		if ((core.mur_timer.tacktic)) {core.mur_timer.tacktic_getinfo();}
		if ((core.mur_timer.units_сard)) {core.mur_timer.units_сard_getinfo();}
		if ((core.mur_timer.notification_personal_message)) {core.mur_timer.notification_personal_message_getinfo();}
		if ((core.mur_timer.craftsman)) {core.mur_timer.craftsman_getinfo();}
		if ((core.mur_timer.craftsman2)) {core.mur_timer.craftsman2_getinfo();}
		if ((core.mur_timer.estate)) {core.mur_timer.estate_getinfo();}
		if ((core.mur_timer.pet)) {core.mur_timer.pet_getinfo();}
		if ((core.mur_timer.elit_train)) { core.mur_timer.elit_training();}
		if ((core.mur_timer.guildhall)) { core.mur_timer.guildhalling();}
		if ((core.mur_timer.ochrab)||(core.mur_timer.miraur)||(core.mur_timer.waraur)||(core.mur_timer.mazzaur)||(core.mur_timer.veteran)||(core.mur_timer.bloodiness)||(core.mur_timer.tracery)||(core.mur_timer.figure)||(core.mur_timer.aurhram)) {core.mur_timer.panel_getinfo();}
		if ((core.mur_timer.klan_kvest)) {core.mur_timer.klan_kvest_getinfo();}
		
		flag = 0;
		var html = "" +
	"<div class=\"ext_countdown\" style=\" opacity : "+opac_extcount+";\" onmouseout=\"core.mur_timer.setstyle(undefined, "+opac_extcount+");\" onmouseover=\"core.mur_timer.setstyle(undefined, "+opac_extcount2 +");\">" +
		"	<img id=\"mur_closepic\" src=\"icon_close.gif\">" +
		"	<table width='100%' border='0'><tr id=\"pet_egg\"><td colspan='2'><span id=\"mur_eggs\" style=\"position:absolute\"></span></td></tr>";		
		for (i=0;i<=timer_position.length;i++)
		{
			if (timer_position[i]==1)
			{
				flag = 1;
				html = html + "	<tr><td colspan='2'><hr></td></tr>";
			}
			if (timer_position[i]==2)
			{
				flag = 1;
				html = html + "	<tr id=\"tav\" style='cursor: pointer;' title='Время до окончания работ в Таверне города'>" +
				"		<td>Таверна: </td>" +
				"		<td><span id=\"tav_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==3)
			{
				flag = 1;
				html = html + "	<tr id=\"jew\" style='cursor: pointer;' title='Время до окончания работ в Ювелирной мастерской ЗЛО'>" +
				"		<td>Ювелирка-З: </td>" +
				"		<td><span id=\"jew_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==4)
			{
				flag = 1;
				html = html + "	<tr id=\"est\" title='Время до прироста новой карты в поместье и их общее число'>" +
				"		<td>Поместье(<span id=\"countm\"></span>): </td>" +
				"		<td><span id=\"est_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==5)
			{
				flag = 1;
				html = html + "	<tr id=\"pet\" title='Время до прироста новой лицензии в питомнике и их общее число\nПри нажатии последний выбранный питомец будет отправлен в бой'>" +
				"		<td> Питомник(<span id=\"pcountm\"></span>): </td>" +
				"		<td><span id=\"pet_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==6)
			{
				flag = 1;
				html = html + "	<tr id=\"elite_trining\" style='cursor: pointer;' title='Время до тренировки на арене'>" +
				"		<td>Элитка:</td>" +
				"		<td><span id=\"elite_trining_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==7)
			{
				flag = 1;
				html = html + "	<tr id=\"mir_1\" style='cursor: pointer;' title='Время активности ауры Роста профессий\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Рост профессий:</td>" +
				"		<td><span id=\"mir_timer_1\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==8)
			{
				flag = 1;
				html = html + "	<tr id=\"mir_2\" style='cursor: pointer;' title='Аремя активности ауры Адреналинового порыва\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Адреналиновый порыв:</td>" +
				"		<td><span id=\"mir_timer_2\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==9)
			{
				flag = 1;
				html = html + "	<tr id=\"war_1\" style='cursor: pointer;' title='Время активности ауры Мощи клана\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Мощь клана:</td>" +
				"		<td><span id=\"war_timer_1\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==10)
			{
				flag = 1;
				html = html + "	<tr id=\"war_2\" style='cursor: pointer;' title='Время активности ауры Роста опыта\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Рост опыта:</td>" +
				"		<td><span id=\"war_timer_2\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==11)
			{
				flag = 1;
				html = html + "	<tr id=\"war_3\" style='cursor: pointer;' title='Время активности ауры Роста умений\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Рост умений:</td>" +
				"		<td><span id=\"war_timer_3\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==12)
			{
				flag = 1;
				html = html + "	<tr id=\"war_4\" style='cursor: pointer;' title='Время активности ауры Крови феникса\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Кровь феникса:</td>" +
				"		<td><span id=\"war_timer_4\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==13)
			{
				flag = 1;
				html = html + "	<tr id=\"och\" style='cursor: pointer;' title='Накопленные очки работы\nПри нажатии обновляет информацию об очках работы при доступной информации'>" +
				"		<td>Очки работы:</td>" +
				"		<td><span id=\"och_rab\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==14)
			{
				flag = 1;
				html = html + "	<tr id=\"vet\" title='Доступен доход с медали ветерана'>" +
				"		<td><span id=\"veter\"></span></td>" +
				"		<td></td>" +
				"	</tr>";
			}
			if (timer_position[i]==15)
			{
				flag = 1;
				html = html + "	<tr id=\"cra\" style='cursor: pointer;'>" +
				"		<td>Ремесло-ТГ:</td>" +
				"		<td><span id=\"cra_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==16)
			{
				flag = 1;
				html = html + "	<tr id=\"npm\" style='cursor: pointer;' title='Есть непрочитанные сообщения\nПри нажатии откроятся сообщения, а сам пункт будет скрыт'>" +
				"		<td>Личные сообщения</td>" +
				"		<td><span id=\"npmss\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==17)
			{
				flag = 1;
				html = html + "	<tr id=\"klkl\" style='cursor: pointer;' title='Информация о клановом квесте'>" +
				"		<td colspan='2'><span id=\"kl_kv\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==18)
			{
				flag = 1;
				html = html + "	<tr id=\"war_5\" style='cursor: pointer;' title='Оставшееся время работы ауры невидимости\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Невидимость:</td>" +
				"		<td><span id=\"war_timer_5\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==19)
			{
				flag = 1;
				html = html + "	<tr id=\"blood\" style='cursor: pointer;' title='Информация о кровожадности и поражениях на ОК'>" +
				"		<td>Кровь:</td>" +
				"		<td><span id=\"bloods\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==20)
			{
				flag = 1;
				html = html + "	<tr id=\"trac\" title='В клане закончились активные узоры'>" +
				"		<td><span id=\"tracer\"></span></td>" +
				"		<td></td>" +
				"	</tr>";
			}
			if (timer_position[i]==21)
			{
				flag = 1;
				html = html + "	<tr id=\"figu\" title='В клане закончились бонусы от статуи'>" +
				"		<td><span id=\"figur\"></span></td>" +
				"		<td></td>" +
				"	</tr>";
			}
			if (timer_position[i]==22)
			{
				flag = 1;
				html = html + "	<tr id=\"hram\" style='cursor: pointer;' title='Аура храма'>" +
				"		<td>АураХрама!</td>" +
				"		<td><span id=\"ahram\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==23)
			{	
				flag = 1;
				html = html + "	<tr  id=\"tac\" style='cursor: pointer;' title='Отображается время до окончания лечения в модуле тактики\nПри клике обновляет инфу'>" +
				"		<td >Лечение ТБ</td>" +
				"		<td><span id=\"tac_timer\"></span></td>" +
				"	</tr>";
			}
			if (timer_position[i]==24)
			{	
				flag = 1;
				html = html + "	<tr  id=\"biryuza\" style='cursor: pointer;' title='Закончился идол из бирюзы\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончился бирюзовый идол</td>" +
				"	</tr>";
			}
			if (timer_position[i]==25)
			{	
				flag = 1;
				html = html + "	<tr  id=\"malakhitovyy\" style='cursor: pointer;' title='Закончился идол малахитовый\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончился малахитовый идол</td>" +
				"	</tr>";
			}
			if (timer_position[i]==26)
			{
				flag = 1;
				html = html + "	<tr id=\"war_6\" style='cursor: pointer;' title='Оставшееся время работы ауры величия клана\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Величие клана:</td>" +
				"		<td><span id=\"war_timer_6\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==27)
			{
				flag = 1;
				html = html + "	<tr id=\"jew2\" style='cursor: pointer;' title='Время до окончания работ в Ювелирной мастерской БЗО'>" +
				"		<td>Ювелирка-Б: </td>" +
				"		<td><span id=\"jew2_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==28)
			{
				flag = 1;
				html = html + "	<tr id=\"uncard\" style='cursor: pointer;' title='Время до получения карты юнита в тактическом модуле'>" +
				"		<td colspan='2'>Карты юнитов</td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==29)
			{
				flag = 1;
				html = html + "	<tr id=\"mazz\" style='cursor: pointer;' title='Время активности мази\nПри нажатии обновляет информацию о длительности ауры при доступной информации'>" +
				"		<td>Мазюкалка:</td>" +
				"		<td><span id=\"mazz_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==30)
			{
				flag = 1;
				html = html + "	<tr id=\"guildhalling\" style='cursor: pointer;' title='Квест на островах доступен!'>" +
				"		<td colspan='2'>Гильдия го квест</td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==31)
			{
				flag = 1;
				html = html + "	<tr id=\"cra2\" style='cursor: pointer;'>" +
				"		<td>Ремесло-ЗО:</td>" +
				"		<td><span id=\"cra2_timer\"></span></td>" +
				"	</tr>" ;
			}
			if (timer_position[i]==32)
			{	
				flag = 1;
				html = html + "	<tr  id=\"pobeda_venetc\" style='cursor: pointer;' title='Закончился Венец победителя\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончился Венец победителя</td>" +
				"	</tr>";
			}
			if (timer_position[i]==33)
			{	
				flag = 1;
				html = html + "	<tr  id=\"pobeda_medal\" style='cursor: pointer;' title='Закончилась Медаль победителя\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончилась Медаль победителя</td>" +
				"	</tr>";
			}
			if (timer_position[i]==34)
			{	
				flag = 1;
				html = html + "	<tr  id=\"pobeda_kubok\" style='cursor: pointer;' title='Закончился Кубок победителя\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончился Кубок победителя</td>" +
				"	</tr>";
			}
			if (timer_position[i]==35)
			{	
				flag = 1;
				html = html + "	<tr  id=\"pobeda_runa\" style='cursor: pointer;' title='акончилась Руна победителя\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончилась Руна победителя</td>" +
				"	</tr>";
			}
			if (timer_position[i]==36)
			{	
				flag = 1;
				html = html + "	<tr  id=\"pobeda_plazma\" style='cursor: pointer;' title='Закончился Плазмотрон победителя\nПри клике обновляет инфу'>" +
				"		<td colspan='2'>Закончился Плазмотрон победителя</td>" +
				"	</tr>";
			}
		}
		html = html + "	</table>" +
		"</div>";
		var htmlcss = {
			"background": "MurTimerCss",
			"border-radius": "6px",
			"box-shadow": "0 3px 6px rgba(0, 0, 0, 0.45)",
			"color": "#1e1e1e",
			"float": "left",
			"font": "12px/15px Verdana,Arial,Geneva,Helvetica,sans-serif",
			"height": "auto",
			"padding": "6px",
			"width": "140px",
			"position": "absolute",
			"right": "300px",
			"top": "10px"
		};
		$("#div_chat_msg").parent().append($("<img/>", {id:"mur_clock_pic", src:"alarm-clock.png"}).css({
			position: "absolute",
			top: "10px",
			cursor: "pointer",
			right: "300px"
		}).hide());
		$("#div_chat_msg").parent().append($(html).css(htmlcss).hide());
		core.mur_timer.setstyle();
		$("#tav_timer").text(core.mur_timer.getMyTime(core.mur_timer.taverna_timer));
		$("#jew_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler_timer));
		$("#jew2_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler2_timer));
		$("#tac_timer").text(core.mur_timer.getMyTime(core.mur_timer.tacktic_timer));
		$("#cra_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman_timer));
		$("#cra2_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman2_timer));
		$("#countm").text(core.mur_timer.estate_cards);
		$("#est_timer").text(core.mur_timer.getMyTime(core.mur_timer.estate_timer));
		$("#pcountm").text(core.mur_timer.pet_cards);
		$("#pet_timer").text(core.mur_timer.getMyTime(core.mur_timer.pet_timer));
		$("#och_rab").text(core.mur_timer.ochrab_kol);
		$("#war_timer_1").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_1));
		$("#war_timer_2").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_2));
		$("#war_timer_3").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_3));
		$("#war_timer_4").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_4));
		$("#war_timer_5").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_5));
		$("#war_timer_6").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_6));
        $('#mir_timer_1').text(core.mur_timer.getMyTime(core.mur_timer.miraur_timer_1));
        $('#mir_timer_2').text(core.mur_timer.getMyTime(core.mur_timer.miraur_timer_2));
        $('#mazz_timer').text(core.mur_timer.getMyTime(core.mur_timer.mazzaur_timer));
        $('#ahram').text(core.mur_timer.getMyTime(core.mur_timer.ahram_timer));
		$("#tav").hide();
		$("#jew").hide();
		$("#jew2").hide();
		$("#uncard").hide();
		$("#tac").hide();
		$("#cra").hide();
		$("#cra2").hide();
		$("#npm").hide();
		$("#klkl").hide();
		$("#vet").hide();
		$("#trac").hide();
		$("#figu").hide();
		$("#hram").hide();
		$("#blood").hide();
		$("#biryuza").hide();
		$("#malakhitovyy").hide();
		$("#pobeda_venetc").hide();
		$("#pobeda_medal").hide();
		$("#pobeda_kubok").hide();
		$("#pobeda_runa").hide();
		$("#pobeda_plazma").hide();
		$("#pet_egg").hide();
		$("#mir_1").hide();
		$("#mir_2").hide();
		$("#war_1").hide();
		$("#war_2").hide();
		$("#war_3").hide();
		$("#war_4").hide();
		$("#war_5").hide();
		$("#war_6").hide();
		$("#mazz").hide();
		$("#elite_trining").hide();	
		$("#guildhalling").hide();		
		if (flag == 0) {$("#ext_countdown").hide();}
    	$("#pet").on("click", function() {
			if (localStorage["pet_id"] != undefined) {
				function m_jsonResponse(jsondata) {
					core.mur_timer.pet_cards = jsondata.response.cards;
					timer = jsondata.response.nextCard;
					core.mur_timer.pet_eggs = 0;
					$.each(jsondata.response.pets, function() { if (this.type==0) core.mur_timer.pet_eggs++});
					var time = new Date();
					if (timer==0) timer=60;
					core.mur_timer.pet_timer.setTime(time.getTime() + timer * 1000);
					core.mur_timer.main();
				}
				$.ajax({
					type: "POST",
					url: "/ajax/json.php",
					data: JSON.stringify({
						"controller": "farm",
						"action": "sendToFight",
						"params": {
							id: localStorage["pet_id"]
						}
					}),
					success: m_jsonResponse,
					dataType: "json"
				});
			}
		});
    	$("#och").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#blood").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#mir_1").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#mir_2").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_1").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_2").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_3").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_4").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_5").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#war_6").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#mazz").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#hram").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#klkl").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#biryuza").on("click", function() {
			core.mur_timer.main2();			
		});
    	$("#malakhitovyy").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#pobeda_venetc").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#pobeda_medal").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#pobeda_kubok").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#pobeda_runa").on("click", function() {
			core.mur_timer.main2();		
		});
    	$("#pobeda_plazma").on("click", function() {
			core.mur_timer.main2();		
		});
		if (core.mur_timer.always_show) {
			$("#tav").on("click", function() {
				if (core.mur_timer.taverna_timer < (new Date())) {
					$("#tav").hide();	
					core.mur_timer.taverna_update = false;
				}});
				
			$("#est").on("click", function() {
				if ((core.mur_timer.estate_cards >= 5)||(typeof core.mur_timer.estate_cards == undefined)) {
					$("#est").hide();	
					core.mur_timer.estate_update = false;
				}});
				
			$("#jew").on("click", function() {
				if (core.mur_timer.jeweler_timer < (new Date())) {
					$("#jew").hide();	
					core.mur_timer.jeweler_update = false;
				}});
				
			$("#jew2").on("click", function() {
				if (core.mur_timer.jeweler2_timer < (new Date())) {
					$("#jew2").hide();	
					core.mur_timer.jeweler2_update = false;
				}});
			$("#uncard").on("click", function() {
				core.mur_timer.units_сard_update = true;
				core.mur_timer.units_сard_getinfo();
				if (core.mur_timer.units_сard_timer < (new Date())) {
					$("#uncard").hide();	
					core.mur_timer.units_сard_timer = false;
				}});
				
			$("#tac").on("click", function() {
				core.mur_timer.tacktic_update = true;
				core.mur_timer.tacktic_getinfo();
				if (core.mur_timer.tacktic_timer < (new Date())) {
					$("#tac").hide();	
					core.mur_timer.tacktic_timer = false;
				}});
				
			$("#cra").on("click", function() {
				if (core.mur_timer.craftsman_timer < (new Date())) {
					$("#cra").hide();	
					core.mur_timer.craftsman_update = false;
				}
				core.mur_timer.craftsman_getinfo();				
			});
			
			$("#cra2").on("click", function() {
				if (core.mur_timer.craftsman2_timer < (new Date())) {
					$("#cra2").hide();	
					core.mur_timer.craftsman2_update = false;
				}
				core.mur_timer.craftsman2_getinfo();				
			});
			
			$("#elite_trining").on("click", function() {
				if (core.mur_timer.elit_training_timer < (new Date()) || $("#elite_trining_timer").text() == "0:00") {
					$("#elite_trining").hide();	
					core.mur_timer.elite_update = false;	
				}});
			
			$("#guildhalling").on("click", function() {
					if (core.mur_timer.guildhalling_timer >= (new Date())) {
						core.mur_timer.guildhall_parseinfo();
						$("#guildhalling").hide();	
						core.mur_timer.guildhall_update = false;
					}
				});	
				
			$("#vet").on("click", function() {
				var now_dt =  new Date( new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000); // GMT +3
				core.vet_timer = now_dt.getDate();
				localStorage['vet_timer']=core.vet_timer;
				$("#vet").hide();
			});
										
		}
		(!core.mur_timer.taverna) && $("#tav").remove();
		(!core.mur_timer.jeweler) && $("#jew").remove();
		(!core.mur_timer.jeweler2) && $("#jew2").remove();
		(!core.mur_timer.tacktic) && $("#tac").remove();
		(!core.mur_timer.biryuza) && $("#biryuza").remove();
		(!core.mur_timer.malakhit) && $("#malakhitovyy").remove();
		(!core.mur_timer.venetc) && $("#pobeda_venetc").remove();
		(!core.mur_timer.medal) && $("#pobeda_medal").remove();
		(!core.mur_timer.kubok) && $("#pobeda_kubok").remove();
		(!core.mur_timer.runa) && $("#pobeda_runa").remove();
		(!core.mur_timer.plazma) && $("#pobeda_plazma").remove();
		(!core.mur_timer.craftsman) && $("#cra").remove();
		(!core.mur_timer.craftsman2) && $("#cra2").remove();
		(!core.mur_timer.elit_train) && $("#elite_trining").remove();
		(!core.mur_timer.guildhall) && $("#guildhalling").remove();
		(!core.mur_timer.estate) && $("#est").remove();
		(!core.mur_timer.ochrab) && $("#och").remove();
		(!core.mur_timer.veteran) && $("#vet").remove();
		(!core.mur_timer.tracery) && $("#trac").remove();
		(!core.mur_timer.figure) && $("#figu").remove();
		(!core.mur_timer.aurhram) && $("#hram").remove();
		(!core.mur_timer.miraur) && $("#mir_1").remove();
		(!core.mur_timer.miraur) && $("#mir_2").remove();
		(!core.mur_timer.waraur) && $("#war_1").remove();
		(!core.mur_timer.waraur) && $("#war_2").remove();
		(!core.mur_timer.waraur) && $("#war_3").remove();
		(!core.mur_timer.waraur) && $("#war_4").remove();
		(!core.mur_timer.waraur) && $("#war_5").remove();
		(!core.mur_timer.waraur) && $("#war_6").remove();
		(!core.mur_timer.mazzaur) && $("#mazz").remove();
		(!core.mur_timer.pet) && $("#pet").remove();
		if (core.mur_timer.pet) {
			var old_jsonSend = json.send;
			json.send = function() {
				if (arguments[0] == "farm" && arguments[1] == "sendToFight") localStorage["pet_id"] = arguments[2].id;
				return old_jsonSend.apply(json, arguments);
			}
		};
		$("#mur_closepic").css({
			position: "absolute",
			top: "3px",
			right: "3px",
			cursor: "pointer",
			opacity: 0
		});
		$("#mur_closepic").hover(function() {
			$(this).css("opacity", 0.5)
			}, function() {
			$(this).css("opacity", 0)
		});
		$("#mur_closepic").on("click",function() {
			if (flag == 1) {
				$(".ext_countdown").hide();
				$("#mur_clock_pic").show();
			}
		});
		$("#mur_clock_pic").on("click",function() {
			if (flag == 1) {
				$("#mur_clock_pic").hide();
				$(".ext_countdown").show();
			}
		});
		
		
	}
	
	
	core.mur_timer.panel_getinfo = function() {
		
		function hero_getinfo(jsondata) {
			if (typeof jsondata.response.info!='undefined') {
				if (typeof jsondata.response.pro!='undefined') {					
					if (typeof jsondata.response.pro.workers!='undefined') {
						if (jsondata.response.pro.workers.length>0)
						{
							for (i=0;i<jsondata.response.pro.workers.length;i++)
							{
							///таверна
							if ((core.mur_timer.taverna) && (jsondata.response.pro.workers[i].place=='Таверна'))
								{						
								(core.mur_timer.taverna_update) && core.mur_timer.taverna_getinfo();
								var time = new Date();
								core.mur_timer.taverna_timer.setTime( 1000 * jsondata.response.pro.workers[i].last );
								localStorage["taverna_timer"] = core.mur_timer.taverna_timer;
								$("#tav_timer").text(core.mur_timer.getMyTime(core.mur_timer.taverna_timer));
								if (core.mur_timer.taverna_timer < (new Date()))  {if (!core.mur_timer.always_show) {$("#tav").hide();}}
									else {
										$("#tav").show();
										if (($("#tav_timer").text().search(/0\:0[0-5]/) > -1)&&($("#tav_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
											if ($("#tav").css("color") != "rgb(255, 0, 0)") {
												("sound_taverna" != "nosound") && core.playSwfSound("sound_taverna");
												$("#tav").css({
													"color": "rgb(255,0,0)",
													"font-weight": "bolder"
												});
											}
											} else {
											if ($("#tav").css("color") == "rgb(255, 0, 0)") $("#tav").css({
												"color": "rgb(0,0,0)",
												"font-weight": ""
											});
										}
									}
							}
								
							///ювелир
							if ((core.mur_timer.jeweler) && (jsondata.response.pro.workers[i].place=='Ювелирная мастерская') && (jsondata.response.pro.workers[i].map=='Зеленый Остров'))
								{						
									(core.mur_timer.jeweler_update) && core.mur_timer.jeweler_getinfo();
									var time = new Date();
									core.mur_timer.jeweler_timer.setTime(1000 * jsondata.response.pro.workers[i].last);
									localStorage["jeweler_time"] = core.mur_timer.jeweler_timer;
									$("#jew_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler_timer));
									if (core.mur_timer.jeweler_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#jew").hide();} }
									else {
										$("#jew").show();
										if (($("#jew_timer").text().search(/0\:0[0-5]/) > -1)&&($("#jew_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
											if ($("#jew").css("color") != "rgb(255, 0, 0)") {
												("sound_jeweler" != "nosound") && core.playSwfSound("sound_jeweler");
												$("#jew").css({
													"color": "rgb(255,0,0)",
													"font-weight": "bolder"
												});
											}
											} else {
											if ($("#jew").css("color") == "rgb(255, 0, 0)") $("#jew").css({
												"color": "rgb(0,0,0)",
												"font-weight": ""
											});
										}
									}
								}
							if ((core.mur_timer.jeweler2) && (jsondata.response.pro.workers[i].place=='Ювелирная мастерская') && (jsondata.response.pro.workers[i].map=='Бирюзовый Остров'))
								{		
									(core.mur_timer.jeweler2_update) && core.mur_timer.jeweler2_getinfo();
									var time = new Date();
									core.mur_timer.jeweler2_timer.setTime(1000 * jsondata.response.pro.workers[i].last);
									localStorage["jeweler2_time"] = core.mur_timer.jeweler2_timer;
									$("#jew2_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler2_timer));
									if (core.mur_timer.jeweler2_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#jew2").hide();} }
									else {
										$("#jew2").show();
										if (($("#jew2_timer").text().search(/0\:0[0-5]/) > -1)&&($("#jew2_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
											if ($("#jew2").css("color") != "rgb(255, 0, 0)") {
												("sound_jeweler2" != "nosound") && core.playSwfSound("sound_jeweler2");
												$("#jew2").css({
													"color": "rgb(255,0,0)",
													"font-weight": "bolder"
												});
											}
											} else {
											if ($("#jew2").css("color") == "rgb(255, 0, 0)") $("#jew2").css({
												"color": "rgb(0,0,0)",
												"font-weight": ""
											});
										}
									}
								}
														
								
								///ремесленник ТГ
								if (core.mur_timer.craftsman) {
									if ((core.mur_timer.craftsman) && (jsondata.response.pro.workers[i].place=='Мастерская ремесленника'))
										{						
										(core.mur_timer.craftsman_update) && core.mur_timer.craftsman_getinfo();
										var time = new Date();
										core.mur_timer.craftsman_timer.setTime(1000 * jsondata.response.pro.workers[i].last);
										localStorage["craftsman_time"] = core.mur_timer.craftsman_timer;

										$("#cra_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman_timer));
										if (core.mur_timer.craftsman_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#cra").hide();} }
										else {
											$("#cra").show();
											if (($("#cra_timer").text().search(/0\:0[0-5]/) > -1)&&($("#cra_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
												if ($("#cra").css("color") != "rgb(255, 0, 0)") {
													("sound_craftsman" != "nosound") && core.playSwfSound("sound_craftsman");
													$("#cra").css({
														"color": "rgb(255,0,0)",
														"font-weight": "bolder"
													});
												}
												} else {
												if ($("#cra").css("color") == "rgb(255, 0, 0)") $("#cra").css({
													"color": "rgb(0,0,0)",
													"font-weight": ""
												});
											}
										}
									}
								}
								
								///ремесленник ЗО
								if (core.mur_timer.craftsman2) {
									if ((core.mur_timer.craftsman2) && (jsondata.response.pro.workers[i].place=='Гильдия Ремесленников'))
										{						
										(core.mur_timer.craftsman2_update) && core.mur_timer.craftsman2_getinfo();
										var time = new Date();
										core.mur_timer.craftsman2_timer.setTime(1000 * jsondata.response.pro.workers[i].last);
										localStorage["craftsman2_time"] = core.mur_timer.craftsman_timer;

										$("#cra2_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman2_timer));
										if (core.mur_timer.craftsman2_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#cra2").hide();} }
										else {
											$("#cra2").show();
											if (($("#cra2_timer").text().search(/0\:0[0-5]/) > -1)&&($("#cra2_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
												if ($("#cra2").css("color") != "rgb(255, 0, 0)") {
													("sound_craftsman2" != "nosound") && core.playSwfSound("sound_craftsman2");
													$("#cra2").css({
														"color": "rgb(255,0,0)",
														"font-weight": "bolder"
													});
												}
												} else {
												if ($("#cra2").css("color") == "rgb(255, 0, 0)") $("#cra2").css({
													"color": "rgb(0,0,0)",
													"font-weight": ""
												});
											}
										}
									}
								}
							}
						}
					}
				}
				
				//Идолы	
				if (jsondata.response.slots.other.length>0)
				{
					infoslots = [true,true,true,true,true,true,true];
					for (i=0;i<jsondata.response.slots["other"]["length"];i++)
					{
						if (jsondata.response.slots["other"][i][6].search("Идол из бирюзы")!=-1) {infoslots[0]=false;}
						if (jsondata.response.slots["other"][i][6].search("Малахитовый идол")!=-1) {infoslots[1]=false;}
						if (jsondata.response.slots["other"][i][6].search("Венец победителя")!=-1) {infoslots[2]=false;}
						if (jsondata.response.slots["other"][i][6].search("Медаль победителя")!=-1) {infoslots[3]=false;}
						if (jsondata.response.slots["other"][i][6].search("Кубок победителя")!=-1) {infoslots[4]=false;}
						if (jsondata.response.slots["other"][i][6].search("Руна победителя")!=-1) {infoslots[5]=false;}
						if (jsondata.response.slots["other"][i][6].search("Плазмотрон победителя")!=-1) {infoslots[6]=false;}
					}
					if (infoslots[0]) {$("#biryuza").show(); } else {$("#biryuza").hide(); }
					if (infoslots[1]) {$("#malakhitovyy").show(); } else {$("#malakhitovyy").hide(); }
					if (infoslots[2]) {$("#pobeda_venetc").show(); } else {$("#pobeda_venetc").hide(); }
					if (infoslots[3]) {$("#pobeda_medal").show(); } else {$("#pobeda_medal").hide(); }
					if (infoslots[4]) {$("#pobeda_kubok").show(); } else {$("#pobeda_kubok").hide(); }
					if (infoslots[5]) {$("#pobeda_runa").show(); } else {$("#pobeda_runa").hide(); }
					if (infoslots[6]) {$("#pobeda_plazma").show(); } else {$("#pobeda_plazma").hide(); }
				}
				//alert(jsondata.response.info.subinfo.workpoints);
				
				
				////Медалька ветерана
				if ((core.mur_timer.veteran)&&(typeof jsondata.response.info.progress.veteran!='undefined')) {
					if (typeof jsondata.response.info.progress.veteran.days=='undefined') 
					{
						var now_dt = new Date( new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000); // GMT +3
						if (now_dt.getDate() != core.vet_timer)
						{
							if (jsondata.response.info.progress.veteran.nextStage>=334)
							{
								$("#vet").show(); 
								$("#vet").prop("title", "Через указанное количество дней будет повышение дохода.\nЕсли вы получите его сейчас, следующий доход будет 1го числа.\nПри нажатии на надпись она пропадёт до следующего дня.");
								$("#veter").text("Пора получать доход через "+(365-jsondata.response.info.progress.veteran.nextStage)+"дн");
							}
							else
							{
								$("#vet").show(); 
								$("#veter").text("Пора получать доход");
							}
						}
					}							
					else 
					{
						$("#vet").hide(); $("#veter").text("");
					}
				}	
				
				
				////Узор
				if (core.mur_timer.tracery) 
				{
					if (jsondata.response.info.auras.length>0)
					{
						statuya = 0;
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
							if (jsondata.response.info.auras[i]["image"]=="pattern")
							{
								statuya = jsondata.response.info.auras[i]['sub_effects']['length'];
							}
						}
						
						if (statuya < tracery_count) 
						{
							$("#trac").show(); 
							$("#tracer").text("Узоры!");							
						}							
						else 
						{
							$("#trac").hide(); $("#tracer").text("");
						}
					}
					else
					{
						$("#trac").show(); 
						$("#tracer").text("Узоры!");								
					}
				}
				
				
				////Статуи
				if (core.mur_timer.figure) {
					if (jsondata.response.info.auras.length>0)
					{
						statuya = 0;
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
							if (jsondata.response.info.auras[i]["image"]=="statue")
							{
								statuya = 1;
							}
						}
						
						if (statuya == 0) 
						{
							$("#figu").show(); 
							$("#figur").text("Статуя!");							
						}							
						else 
						{
							$("#figu").hide(); $("#figur").text("");
						}
					}
					else
					{
						$("#figu").show(); 
						$("#figur").text("Статуя!");									
					}
				}	
				
				////Аура храма
				if (core.mur_timer.aurhram) {
					if (jsondata.response.info.auras.length>0)
					{
						ahram_timers=525600;
						showaur_1 = 0;
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
							if (jsondata.response.info.auras[i]["image"]=="bless")
							{
								ahram_timers = jsondata.response.info.auras[i]["sub_effects"][0]["time"];
								showaur_1=1;
								
							}
						}
						if (showaur_1==1) {$("#hram").show();} else {$("#hram").hide();}
						
						var time = new Date();
						core.mur_timer.ahram_timer.setTime(time.getTime() + ((ahram_timers==525600)?(0):(ahram_timers)) * 60 * 1000);
						localStorage["ahram_timer"] = core.mur_timer.ahram_timer;	
					}
				}
				
				////// получение очки работы
				if (core.mur_timer.ochrab) {
					core.mur_timer.ochrab_kol = jsondata.response.info.subinfo.workpoints;
					if ((core.mur_timer.ochrab_kol>0)&&(user.place2 < 25 || user.place2 > 28 || (user.place2 > 25 && user.place2 < 28))) {$("#och_rab").text(localStorage["ochrab_kol"]); localStorage["ochrab_kol"] = core.mur_timer.ochrab_kol;}
					if ((user.place2 < 25 || user.place2 > 28 || (user.place2 > 25 && user.place2 < 28))&&(core.mur_timer.ochrab_kol>=0)) {$("#och").show(); } else {$("#och").hide();  }
					if (core.mur_timer.ochrab_kol>=core.mur_timer.ochrab_kol_tim) {
						if ($("#och").css("color") != "rgb(255, 0, 0)") {
							$("#och").css({
								"color": "rgb(255,0,0)",
								"font-weight": "bolder"
							});
						}
						} else {	
						if ($("#och").css("color") == "rgb(255, 0, 0)") $("#och").css({
							"color": "rgb(0,0,0)",
							"font-weight": ""
						});	
					}
				}				
				
				////// получение крови и поражений
				if (core.mur_timer.bloodiness) {
					if (typeof jsondata.response.info.subinfo.align!='undefined')
					{
						core.mur_timer.bloods = jsondata.response.info.subinfo.align.bloody+"/"+jsondata.response.info.subinfo.align.losses;					
						$("#bloods").text(core.mur_timer.bloods);
						$("#blood").show();
					}
					else
					{
						$("#blood").hide();
					}
				}
				////// ауры мирки
				if (core.mur_timer.miraur){	
					showaur_1=0;
					showaur_2=0;
					showaur_3=0;
					if (jsondata.response.info.auras.length>0)
					{
						miraur_name_1 = "";
						miraur_time_1 = 525600;
						miraur_name_2 = "";
						miraur_time_2 = 525600;
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
						if ((jsondata.response.info.auras[i]["image"]=="clan_mirka")||(jsondata.response.info.auras[i]["image"]=="clan_gmirka"))
							{
								for (j=0;j<jsondata.response.info["auras"][i]["sub_effects"]["length"];j++)
								{
									miraur_name = (jsondata.response.info.auras[i].sub_effects[j].title).substr(0,17);
									if (miraur_name=="Аура «Рост профес")
									{
										miraur_time_1 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_1=1;
									}
									else
									{
										miraur_time_2 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_2=1;
									}							
								}
							}
						}
						if (showaur_1==1) {$("#mir_1").show();} else {$("#mir_1").hide();}
						if (showaur_2==1) {$("#mir_2").show();} else {$("#mir_2").hide();}
						
						var time = new Date();
						core.mur_timer.miraur_timer_1.setTime(time.getTime() + ((miraur_time_1==525600)?(0):(miraur_time_1)) * 60 * 1000);
						localStorage["miraur_timer_1"] = core.mur_timer.miraur_timer_1;
						core.mur_timer.miraur_timer_2.setTime(time.getTime() + ((miraur_time_2==525600)?(0):(miraur_time_2)) * 60 * 1000);
						localStorage["miraur_timer_2"] = core.mur_timer.miraur_timer_2;
					}				
				}
				////// мазь
				if (core.mur_timer.mazzaur){	
					showaur_3=0;
					if (jsondata.response.info.auras.length>0)
					{
						mazz_name = "";
						mazz_time = 525600;
						
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
						if (jsondata.response.info.auras[i]["image"]=="hero_state_guard")
							{
								mazz_time = jsondata.response.info.auras[i].time;
								showaur_3=1;
							}
						}
						if (showaur_3==1) {$("#mazz").show();} else {$("#mazz").hide();}
						
						var time = new Date();
						core.mur_timer.mazzaur_timer.setTime(time.getTime() + ((mazz_time==525600)?(0):(mazz_time)) * 60 * 1000);
						localStorage["mazzaur_timer"] = core.mur_timer.mazzaur_timer;
					}				
				}
				////// ауры боёвки
				if (core.mur_timer.waraur) {
					showaur_1=0;
					showaur_2=0;
					showaur_3=0;
					showaur_4=0;
					showaur_5=0;
					showaur_6=0;
					if (jsondata.response.info.auras.length>0)
					{
						waraur_name_1 = "";
						waraur_time_1 = 525600;
						waraur_name_2 = "";
						waraur_time_2 = 525600;
						waraur_name_3 = "";
						waraur_time_3 = 525600;
						waraur_name_4 = "";
						waraur_time_4 = 525600;
						waraur_name_5 = "";
						waraur_time_5 = 525600;
						waraur_name_6 = "";
						waraur_time_6 = 525600;
						for (i=0;i<jsondata.response.info["auras"]["length"];i++)
						{
							if (jsondata.response.info.auras[i]["image"]=="clan")
							{
								for (j=0;j<jsondata.response.info["auras"][i]["sub_effects"]["length"];j++)
								{
									waraur_name = (jsondata.response.info.auras[i].sub_effects[j].title).substr(0,17);
									if (waraur_name=="Аура «Мощь клана»")
									{
										waraur_time_1 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_1=1;
									}
									else if (waraur_name=="Аура «Рост опыта»")
									{
										waraur_time_2 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_2=1;
									}
									else if (waraur_name=="Аура «Рост умений")
									{
										waraur_time_3 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_3=1;
									}
									else if (waraur_name=="Аура «Кровь феник")
									{
										waraur_time_4 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_4=1;
									}
									
								}
							}
							if (jsondata.response.info.auras[i]["image"]=="bottle")
							{
								for (j=0;j<jsondata.response.info["auras"][i]["sub_effects"]["length"];j++)
								{
									waraur_name = (jsondata.response.info.auras[i].sub_effects[j].title).substr(0,17);
									if (waraur_name=="Аура «Величие кла")
									{
										waraur_time_6 = jsondata.response.info.auras[i].sub_effects[j].time;
										showaur_6=1;
									}
								}
							}
						}
						
						if (jsondata.response.info.auras[0]["image"]=="abil2")
						{
							
							waraur_time_5 = jsondata.response.info.auras[0].time;
							showaur_5=1;
							
						}
						
						if (showaur_1==1) {$("#war_1").show();} else {$("#war_1").hide();}
						if (showaur_2==1) {$("#war_2").show();} else {$("#war_2").hide();}
						if (showaur_3==1) {$("#war_3").show();} else {$("#war_3").hide();}
						if (showaur_4==1) {$("#war_4").show();} else {$("#war_4").hide();}
						if (showaur_5==1) {$("#war_5").show();} else {$("#war_5").hide();}
						if (showaur_6==1) {$("#war_6").show();} else {$("#war_6").hide();}
						var time = new Date();
						core.mur_timer.waraur_timer_1.setTime(time.getTime() + ((waraur_time_1==525600)?(0):(waraur_time_1)) * 60 * 1000);
						localStorage["waraur_timer_1"] = core.mur_timer.waraur_timer_1;
						core.mur_timer.waraur_timer_2.setTime(time.getTime() + ((waraur_time_2==525600)?(0):(waraur_time_2)) * 60 * 1000);
						localStorage["waraur_timer_2"] = core.mur_timer.waraur_timer_2;
						core.mur_timer.waraur_timer_3.setTime(time.getTime() + ((waraur_time_3==525600)?(0):(waraur_time_3)) * 60 * 1000);
						localStorage["waraur_timer_3"] = core.mur_timer.waraur_timer_3;
						core.mur_timer.waraur_timer_4.setTime(time.getTime() + ((waraur_time_4==525600)?(0):(waraur_time_4)) * 60 * 1000);
						localStorage["waraur_timer_4"] = core.mur_timer.waraur_timer_4;
						core.mur_timer.waraur_timer_5.setTime(time.getTime() + ((waraur_time_5==525600)?(0):(waraur_time_5)) * 60 * 1000);
						localStorage["waraur_timer_5"] = core.mur_timer.waraur_timer_5;
						core.mur_timer.waraur_timer_6.setTime(time.getTime() + ((waraur_time_6==525600)?(0):(waraur_time_6)) * 60 * 1000);
						localStorage["waraur_timer_6"] = core.mur_timer.waraur_timer_6;
					}
				}
				$('#ext_solids').text(jsondata.response.info.subinfo.solids);
				localStorage["ext_solids_l"] = jsondata.response.info.subinfo.solids;
				$('#ext_authority').text(jsondata.response.info.subinfo.authority);
				localStorage["ext_authority_l"] = jsondata.response.info.subinfo.authority;
				$('#ext_xenoteks').text(jsondata.response.info.subinfo.xenoteks);
				localStorage["ext_xenoteks_l"] = jsondata.response.info.subinfo.xenoteks;
				$('#ext_crystals').text(jsondata.response.info.subinfo.crystals);	
				localStorage["ext_crystals_l"] = jsondata.response.info.subinfo.crystals;	
				
			}
			else
			{
				$("#och_rab").text(localStorage["ochrab_kol"]);
				if (new Date().setTime(Date.parse(localStorage["miraur_timer_1"])) < (new Date())) $("#mir_1").hide(); else {$('#mir_timer_1').text(core.mur_timer.getMyTime(Date.parse(localStorage["miraur_timer_1"]))); $("#mir_1").show();};		
				if (new Date().setTime(Date.parse(localStorage["miraur_timer_2"])) < (new Date())) $("#mir_2").hide(); else {$('#mir_timer_2').text(core.mur_timer.getMyTime(Date.parse(localStorage["miraur_timer_2"]))); $("#mir_2").show();};		
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_1"])) < (new Date())) $("#war_1").hide(); else {$("#war_timer_1").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_1"]))); $("#war_1").show(); };
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_2"])) < (new Date())) $("#war_2").hide(); else {$("#war_timer_2").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_2"]))); $("#war_2").show(); };
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_3"])) < (new Date())) $("#war_3").hide(); else {$("#war_timer_3").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_3"]))); $("#war_3").show(); };
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_4"])) < (new Date())) $("#war_4").hide(); else {$("#war_timer_4").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_4"]))); $("#war_4").show(); };
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_5"])) < (new Date())) $("#war_5").hide(); else {$("#war_timer_5").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_5"]))); $("#war_5").show(); };
				if (new Date().setTime(Date.parse(localStorage["waraur_timer_6"])) < (new Date())) $("#war_6").hide(); else {$("#war_timer_6").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_6"]))); $("#war_6").show(); };
				if (new Date().setTime(Date.parse(localStorage["mazzaur_timer"])) < (new Date())) $("#mazz").hide(); else {$('#mazz_timer').text(core.mur_timer.getMyTime(Date.parse(localStorage["mazzaur_timer"]))); $("#mazz").show();};	
				if (new Date().setTime(Date.parse(localStorage["ahram_timer"])) < (new Date())) $("#hram").hide(); else {$('#ahram').text(core.mur_timer.getMyTime(Date.parse(localStorage["ahram_timer"]))); $("#hram").show();};				
				if (new Date().setTime(Date.parse(localStorage["tac_time"])) < (new Date())) $("#tac").hide(); else {$('#tac_timer').text(core.mur_timer.getMyTime(Date.parse(localStorage["tac_time"]))); $("#tac").show();};
				if (new Date().setTime(Date.parse(localStorage["uncard_time"])) >= (new Date())) {$("#uncard").hide();} else {$("#uncard").show();};	
				
				if (new Date().setTime(Date.parse(localStorage["guildhalling_time"])) >= (new Date())) {$("#guildhalling").hide();} else {$("#guildhalling").show();};
			}
		}
		$.ajax({
			type: "POST",
			url: "/ajax/json.php",
			data: JSON.stringify({
				"controller": "hero",
				"action": "panel",
				"params": {},
				"client": 1,
			}),
			success: hero_getinfo,
			dataType: "json"
		});
		core.mur_timer.veteran_update = false;
		core.mur_timer.ochrab_update = false;
		core.mur_timer.bloodiness_update = false;
		core.mur_timer.miraur_update = false;
		core.mur_timer.waraur_update = false;
		core.mur_timer.mazz_update = false;
		
	}
	
	
	
	////// получение таверны
	core.mur_timer.taverna_getinfo = function() {
		
		function xmlResponse(xmldoc) {
			if ($("workt", xmldoc).text().length > 0) {
				num = $("workt", xmldoc).length - 1;
				timer = parseInt($("workt", xmldoc).eq(0).text());
				for (i=0;i<=num;i++) {
					timer = Math.max(timer,parseInt($("workt", xmldoc).eq(i).text()));
				}			
				var time = new Date();
				core.mur_timer.taverna_timer.setTime(time.getTime() + timer * 1000);
				localStorage["taverna_timer"] = core.mur_timer.taverna_timer;
			}
			else {
				if (new Date().setTime(Date.parse(localStorage["taverna_timer"])) > new Date()) {
					core.mur_timer.taverna_timer.setTime(Date.parse(localStorage["taverna_timer"]));
				}
			}
		}
		$.post("/ajax/taverna/", "<request action=\"getQueue\"></request>", xmlResponse);
		core.mur_timer.taverna_update = false;
	}
	///////
	
	////// получение ювелирки
	core.mur_timer.jeweler_getinfo = function() {
		
		function m_jsonResponse(jsondata) {
			if (user.place2 == 25) {
			core.mur_timer.jeweler2_parseinfo(jsondata.response);
		}
		else if (user.place2 == 28){
		core.mur_timer.jeweler_parseinfo(jsondata.response);
	}
}


$.ajax({
	type: "POST",
	url: "/ajax/json.php",
	data: JSON.stringify({
		"controller": "jeweler",
		"action": "init",
		"params": {},
		"client": 1,
	}),
	success: m_jsonResponse,
	dataType: "json"
});

core.mur_timer.jeweler_update = false;

}
////// получение БЗО
core.mur_timer.jeweler2_getinfo = function() {
	
	function m_jsonResponse(jsondata) {
		if (user.place2 == 28) {
		core.mur_timer.jeweler2_parseinfo(jsondata.response);
		}
	else if (user.place2 == 25){
	core.mur_timer.jeweler_parseinfo(jsondata.response);
}
}


$.ajax({
	type: "POST",
	url: "/ajax/json.php",
	data: JSON.stringify({
		"controller": "jeweler",
		"action": "init",
		"params": {},
		"client": 1,
	}),
	success: m_jsonResponse,
	dataType: "json"
});

core.mur_timer.jeweler2_update = false;

}

////// получение тактики
core.mur_timer.tacktic_getinfo = function() {
	
	function m_jsonResponse(jsondata) {
		core.mur_timer.tacktic_parseinfo(jsondata.response);
	}
	$.ajax({
		type: "POST",
		url: "/ajax/json.php",
		data: JSON.stringify({"controller":"tactics","action":"panel","params":{},"client":1}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.tacktic_update = false;
}

////// получение юнитов
core.mur_timer.units_сard_getinfo = function() {
	
	function m_jsonResponse(jsondata) {
		if (jsondata!=undefined)
		{
			core.mur_timer.units_сard_parseinfo(jsondata.response);
		}
	}
	$.ajax({
		type: "POST",
		url: "/ajax/json.php",
		data: JSON.stringify({"controller":"tactics","action":"panel","params":{},"client":1}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.tacktic_update = false;
	
}

//личные сообщения
core.mur_timer.notification_personal_message_getinfo = function() {
	
	
	localStorage['message'] = '';
	
	function xmlResponseV(xml) {
		readed = parseInt($('readed:first', xml).text());
		if ((readed==0)&(personal_message_v)) {
			localStorage['message']=localStorage['message']+"В "; 
			localStorage['messvkl']=0;
			$("#npm").on("click", function() {messenger.ShowForm(0); $("#npm").hide(); $("#npmss").text("");});
		}
		if (localStorage['message']!='') {$("#npm").show(); $("#npmss").text(localStorage['message']);} else {$("#npm").hide(); $("#npmss").text("");}
	}
	
	function xmlResponseS(xml) {
		readed = parseInt($('readed:first', xml).text());
		if ((readed==0)&(personal_message_s)) {
			localStorage['message']=localStorage['message']+"С "; 
			localStorage['messvkl']=2; 
			$("#npm").on("click", function() {messenger.ShowForm(2); $("#npm").hide(); $("#npmss").text("");});
		}
		if (localStorage['message']!='') {$("#npm").show(); $("#npmss").text(localStorage['message']);} else {$("#npm").hide(); $("#npmss").text("");}
	}
	
	function xmlResponseC(xml) {
		readed = parseInt($('readed:first', xml).text());
		if ((readed==0)&(personal_message_k)) {
			localStorage['message']=localStorage['message']+"К "; 
			localStorage['messvkl']=3;
			$("#npm").on("click", function() {messenger.ShowForm(3); $("#npm").hide(); $("#npmss").text("");});
		}
		if (localStorage['message']!='') {$("#npm").show(); $("#npmss").text(localStorage['message']);} else {$("#npm").hide(); $("#npmss").text("");}
	}
	
	function xmlResponseF(xml) {
		readed = parseInt($('readed:first', xml).text());
		page_count = parseInt($('page_count:first', xml).text());
		if ((readed!=1)&(page_count>0)&(personal_message_f)) {
			localStorage['message']=localStorage['message']+"Ф "; 
			localStorage['messvkl']=4;
			$("#npm").on("click", function() {messenger.ShowForm(4); $("#npm").hide(); $("#npmss").text("");});
		}
		if (localStorage['message']!='') {$("#npm").show(); $("#npmss").text(localStorage['message']);} else {$("#npm").hide(); $("#npmss").text("");}
	}
	
	
	$.post("/ajax/messenger/", "<request act=\"get_recv\"><page>1</page></request>", xmlResponseV)
	$.post("/ajax/messenger/", "<request act=\"get_system\"><page>1</page></request>", xmlResponseS)
	$.post("/ajax/messenger/", "<request act=\"get_clan\"><page>1</page></request>", xmlResponseC)
	$.post("/ajax/messenger/", "<request act=\"get_align\"><page>1</page></request>", xmlResponseF)
	
	core.mur_timer.notification_personal_message_update = false;
	
}


//клановый квест
core.mur_timer.klan_kvest_getinfo = function() {			
	localStorage['klan_kvest'] = '';
	
	function xmlResponse(xml) {
		localStorage['time_kk'] = parseInt($('time:first', xml).text());
		chas = Math.floor(localStorage['time_kk']/3600);
		minu = Math.floor((localStorage['time_kk']-chas*3600)/60);
		namekk='Клановый квест ';
		cur_kk = parseInt($('cur:first', xml).text());
		need_kk = parseInt($('need:first', xml).text());
		if ((localStorage['time_kk']==0)&(isNaN(need_kk)))
		{
			$("#kl_kv").text(namekk+'можно начать'); $("#klkl").show(); 
			klan_kvest_interval=0;
		}
		else
		{
			if ((localStorage['time_kk']>86400)||(isNaN(need_kk)))
			{
				$("#klkl").hide();
				$("#kl_kv").text("");
				
			}
			else
			{
				localStorage['klan_kvest'] = namekk+((chas==0)?(''):(chas+'ч '))+((minu==0)?(''):(minu+'м '))+' ('+cur_kk+'/'+need_kk+')';
				if (localStorage['klan_kvest']!='') 
				{
					$("#kl_kv").text(localStorage['klan_kvest']); $("#klkl").show(); 
				} 
				else 
				{
					$("#klkl").hide(); $("#kl_kv").text("");
				}
			}
		}					
	}
	
	$.post("/ajax/sanctuary/", "<request action=\"get_quest_dialog\"></request>", xmlResponse)
	
	core.mur_timer.klan_kvest_update = false;
}

////// получение ремесла ТГ
core.mur_timer.craftsman_getinfo = function() {
	function m_jsonResponse(jsondata) {
		core.mur_timer.craftsman_parseinfo(jsondata.response);
	}
	$.ajax({
		type: "POST",
		url: "/ajax/json.php",
		data: JSON.stringify({"controller":"profession/artisan","action":"init"}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.craftsman_update = false;	
}

////// получение ремесла ЗО
core.mur_timer.craftsman2_getinfo = function() {
	/*function m_jsonResponse(jsondata) {
		core.mur_timer.craftsman2_parseinfo(jsondata.response);
	}
	$.ajax({
		type: "POST",
		url: "/ajax/json.php",
		data: JSON.stringify({"controller":"profession/artisan","action":"init"}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.craftsman2_update = false;*/	
}

//ЗЛО
core.mur_timer.jeweler_parseinfo = function(jsondata) {
	if (user.place2 != 25) {
		wT = jsondata.workersLine;
		if (wT != undefined) {
			timer = 0;
			for (var key in wT) {
				timer = wT[key].timeLeft;
			}
			var time = new Date();
			core.mur_timer.jeweler_timer.setTime(time.getTime() + timer * 1000);
			localStorage["jeweler_time"] = core.mur_timer.jeweler_timer;
			} else {
			if (new Date().setTime(Date.parse(localStorage["jeweler_time"])) > new Date()) {
				core.mur_timer.jeweler_timer.setTime(Date.parse(localStorage["jeweler_time"]));
			}
			
		}
		core.mur_timer.jeweler_update = false;
	}
}

//БЗО
core.mur_timer.jeweler2_parseinfo = function(jsondata) {
	if (user.place2 != 28) {
		wT = jsondata.workersLine;
		if (wT != undefined) {
			timer = 0;
			for (var key in wT) {
				timer = wT[key].timeLeft;
			}
			var time = new Date();
			core.mur_timer.jeweler2_timer.setTime(time.getTime() + timer * 1000);
			localStorage["jeweler2_time"] = core.mur_timer.jeweler2_timer;
			} else {
			if (new Date().setTime(Date.parse(localStorage["jeweler2_time"])) > new Date()) {
				core.mur_timer.jeweler2_timer.setTime(Date.parse(localStorage["jeweler2_time"]));
			}
			
		}
		core.mur_timer.jeweler2_update = false;
	}
}


core.mur_timer.tacktic_parseinfo = function(jsondata) {	
	core.mur_timer.panel_getinfo();
	if (typeof jsondata.camp !== "undefined")
	{
		if (show_money_dust) $('#ext_dust').text(jsondata.dust);
		if (show_money_supplies) $('#ext_supplies').text(jsondata.supplies);	
		hos = jsondata.camp.hospitalState;
		if (hos) {
			timer = jsondata.camp.hospitalState.tillEnd;
			var time = new Date();
			core.mur_timer.tacktic_timer.setTime(time.getTime() + timer * 1000);
			localStorage["tac_time"] = core.mur_timer.tacktic_timer;
			} else {
			localStorage["tac_time"] =0;
			if (new Date().setTime(Date.parse(localStorage["tac_time"])) > new Date()) {
				core.mur_timer.tacktic_timer.setTime(Date.parse(localStorage["tac_time"]));
			}
			
		}
	}
	core.mur_timer.tacktic_update = false;
}



core.mur_timer.units_сard_parseinfo = function(jsondata) {	
	core.mur_timer.panel_getinfo();
	if (typeof jsondata.camp !== "undefined")
	{	
		timer = jsondata.camp.treasury.cards.cooldown;
		var time = new Date();
		core.mur_timer.units_сard_timer.setTime(time.getTime() + timer * 1000);
		localStorage["uncard_time"] = core.mur_timer.units_сard_timer;
	}
	core.mur_timer.units_сard_update = false;
}


core.mur_timer.craftsman_parseinfo = function(jsondata) {
	wT = jsondata.workersLine;
	if (wT != undefined) {
		timer = 0;
		for (var key in wT) {                                                                                               
			timer = wT[key].timeLeft;
		}
		var time = new Date();
		core.mur_timer.craftsman_timer.setTime(time.getTime() + timer * 1000);
		localStorage["craftsman_time"] = core.mur_timer.craftsman_timer;
		} else {
		if (new Date().setTime(Date.parse(localStorage["craftsman_time"])) > new Date()) {
			core.mur_timer.craftsman_timer.setTime(Date.parse(localStorage["craftsman_time"]));
		}		
	}
	core.mur_timer.craftsman_update = false;
}

core.mur_timer.pet_getinfo = function() {
	function m_jsonResponse(jsondata) {
		core.mur_timer.pet_cards = jsondata.response.cards;
		if (jsondata.response.size==0) {
			core.mur_timer.pet = false;
			return;
		}
		var timer = jsondata.response.nextCard;
		var timer_egg = jsondata.response.eggTime;
		core.mur_timer.pet_eggs = 0;
		$.each(jsondata.response.pets, function() { if (this.type==0) core.mur_timer.pet_eggs++});
		var time = new Date();
		if (timer_egg==0) timer_egg=60*24;
		if (timer==0) timer=60;
		core.mur_timer.pet_timer.setTime(time.getTime() + timer * 1000);
		core.mur_timer.pet_timer_egg.setTime(time.getTime() + timer_egg * 1000);
		
	}
	
	$.ajax({
		type: "POST",
		url: "/ajax/json.php",
		data: JSON.stringify({
			"controller": "farm",
			"action": "init",
			"params": {}
		}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.pet_update = false;
}

core.mur_timer.estate_getinfo = function() {
	function xmlResponse(xmldoc) {
		if ($("cardsTime", xmldoc).text().length > 0) {
			timer = parseInt($("cardsTime", xmldoc).text());
			core.mur_timer.estate_type = $("type:first", xmldoc).text();
			core.mur_timer.estate_cards = $("cards", xmldoc).text();
			
			var timer2 = (5 - core.mur_timer.estate_cards) * (6 - core.mur_timer.estate_type) * 3600000;
			var time = new Date();
			
			core.mur_timer.estate_timer.setTime(time.getTime() + timer * 1000);
			core.mur_timer.estate_time.setTime(core.mur_timer.estate_timer.getTime() + timer2);
			localStorage["estate_time"] = core.mur_timer.estate_time;
			localStorage["estate_type"] = core.mur_timer.estate_type;
			} else {
			if (new Date().setTime(Date.parse(localStorage["estate_time"])) > new Date()) {
				core.mur_timer.estate_type = localStorage["estate_type"];
				core.mur_timer.estate_time.setTime(Date.parse(localStorage["estate_time"]));
				var time = new Date();
				core.mur_timer.estate_cards = 5 - parseInt((core.mur_timer.estate_time - time) / (3600000 * (6 - core.mur_timer.estate_type)));
				core.mur_timer.estate_timer.setTime(core.mur_timer.estate_time.getTime() - (5 - core.mur_timer.estate_cards) * (6 - core.mur_timer.estate_type) * 3600000);
			}
		}
		if (core.mur_timer.estate_timer < (new Date()) || (core.mur_timer.estate_cards>=5)) 
		{
			if (core.mur_timer.always_show)
			{
				$("#est").show(); 
				$("#countm").text("?");
				$("#est_timer").text("?:??");	
				if ($("#est").css("color") != "rgb(255, 0, 0)") {
					("sound_est" != "nosound") && core.playSwfSound("sound_est");
					$("#est").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
			}
			else
			{
				$("#est").hide(); 
			}
		}
		else {
			if ($("#est").css("color") == "rgb(255, 0, 0)") $("#est").css({
				"color": "rgb(0,0,0)",
				"font-weight": ""
			});
		}
	}
	if (user.nowplace=="22:73" || user.nowplace=="11:69" || user.nowplace=="13:48") $.post("/ajax/estates/", "<request action=\"get_estate\"></request>", xmlResponse);
	else xmlResponse("");
	core.mur_timer.estate_update = false;
}

core.mur_timer.elit_training = function() {
    $.ajax({
        type: "POST",
        url: "/ajax/json.php",
        data: JSON.stringify({
            "controller": "tournament",
            "action": "getCampTrain",
            "params": {}
		}),
        success: function(jsondata) {
            core.mur_timer.elit_training_update = false;
			if (jsondata.response.data == undefined || !jsondata.response.data.campTrain.currentTask) {
				if (new Date().setTime(Date.parse(localStorage["elit_training_timer"])) > new Date()) {
					core.mur_timer.elit_training_timer.setTime(Date.parse(localStorage["elit_training_timer"]));
				}
				return;
			}
			
            var timer = jsondata.response.data.campTrain.currentTask.timer;
            var time = new Date();
            core.mur_timer.elit_training_timer.setTime(time.getTime() + timer * 1000);
            localStorage["elit_training_timer"] = core.mur_timer.elit_training_timer;
			
		},
        dataType: "json"
	});
}


core.mur_timer.guildhalling = function() {
	function m_jsonResponse(jsondata) {
		core.mur_timer.guildhall_parseinfo(jsondata.response);
	}
	$.ajax({
        type: "POST",
        url: "/ajax/json.php",
        data: JSON.stringify({
            "controller": "place/guildhall",
            "action": "getGuildQuests",
            "params": {}
		}),
		success: m_jsonResponse,
		dataType: "json"
	});
	core.mur_timer.guildhall_update = false;
}

core.mur_timer.guildhall_parseinfo = function(jsondata) {
	core.mur_timer.guildhall_update = false;
	if (jsondata.quests != undefined)
	{
		if (jsondata.quests.questsSelection != undefined )
		{
			$("#guildhalling").show();
		}
		else
		{
			if ((jsondata.quests.activeQuests != undefined ) || (localStorage["guildhalling_time"] == "n/n"))
			{
				$("#guildhalling").hide();
				var time = new Date();
				core.mur_timer.guildhalling_timer.setTime(time.getTime() + 2*43200000);
				localStorage["guildhalling_time"] = core.mur_timer.guildhalling_timer;
			}
			else
			{
				var time = new Date();
				core.mur_timer.guildhalling_timer.setTime(time.getTime() + jsondata.quests.timeout*1000);
				localStorage["guildhalling_time"] = core.mur_timer.guildhalling_timer;
				if (new Date().setTime(Date.parse(localStorage["guildhalling_time"])) >= (new Date())) 
					{$("#guildhalling").hide();} 
				else 
					{$("#guildhalling").show();};
			}
		}
	}
		
}


/////таверна, ювелирка, элитка, голосовалка
core.mur_timer.main = function() {
	
	$("#och_rab").text(localStorage["ochrab_kol"]);
	if (new Date().setTime(Date.parse(localStorage["miraur_timer_1"])) < (new Date())) $("#mir_1").hide(); else {$('#mir_timer_1').text(core.mur_timer.getMyTime(Date.parse(localStorage["miraur_timer_1"]))); $("#mir_1").show();};		
	if (new Date().setTime(Date.parse(localStorage["miraur_timer_2"])) < (new Date())) $("#mir_2").hide(); else {$('#mir_timer_2').text(core.mur_timer.getMyTime(Date.parse(localStorage["miraur_timer_2"]))); $("#mir_2").show();};		
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_1"])) < (new Date())) $("#war_1").hide(); else {$("#war_timer_1").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_1"]))); $("#war_1").show(); };
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_2"])) < (new Date())) $("#war_2").hide(); else {$("#war_timer_2").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_2"]))); $("#war_2").show(); };
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_3"])) < (new Date())) $("#war_3").hide(); else {$("#war_timer_3").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_3"]))); $("#war_3").show(); };
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_4"])) < (new Date())) $("#war_4").hide(); else {$("#war_timer_4").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_4"]))); $("#war_4").show(); };
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_5"])) < (new Date())) $("#war_5").hide(); else {$("#war_timer_5").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_5"]))); $("#war_5").show(); };
	if (new Date().setTime(Date.parse(localStorage["waraur_timer_6"])) < (new Date())) $("#war_6").hide(); else {$("#war_timer_6").text(core.mur_timer.getMyTime(Date.parse(localStorage["waraur_timer_6"]))); $("#war_6").show(); };
	if (new Date().setTime(Date.parse(localStorage["mazzaur_timer"])) < (new Date())) $("#mazz").hide(); else {$('#mazz_timer').text(core.mur_timer.getMyTime(Date.parse(localStorage["mazzaur_timer"]))); $("#mazz").show();};
	if (new Date().setTime(Date.parse(localStorage["ahram_timer"])) < (new Date())) $("#hram").hide(); else {$('#ahram').text(core.mur_timer.getMyTime(Date.parse(localStorage["ahram_timer"]))); $("#hram").show();};

	if (new Date().setTime(Date.parse(localStorage["guildhalling_time"])) >= (new Date())) {$("#guildhalling").hide();} else {$("#guildhalling").show();};

	if (core.mur_timer.ochrab) {if (user.place2 < 25 || user.place2 > 28 || (user.place2 > 25 && user.place2 < 28)) {$("#och").show(); if (core.mur_timer.flagock==1) {core.mur_timer.flagock=0; core.mur_timer.main2();}} else {$("#och").hide(); core.mur_timer.flagock=1; } } else {if (core.mur_timer.flagock==0) {core.mur_timer.flagock=1; core.mur_timer.main2();}}
	
	
	if (core.mur_timer.taverna) {
		(core.mur_timer.taverna_update) && core.mur_timer.taverna_getinfo();
		
		$("#tav_timer").text(core.mur_timer.getMyTime(core.mur_timer.taverna_timer));
		if (core.mur_timer.taverna_timer < (new Date()))  {if (!core.mur_timer.always_show) {$("#tav").hide();}}
		else {
			$("#tav").show();
			if (($("#tav_timer").text().search(/0\:0[0-5]/) > -1)&&($("#tav_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#tav").css("color") != "rgb(255, 0, 0)") {
					("sound_taverna" != "nosound") && core.playSwfSound("sound_taverna");
					$("#tav").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#tav").css("color") == "rgb(255, 0, 0)") $("#tav").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	
	//зло
	if (core.mur_timer.jeweler) {
		(core.mur_timer.jeweler_update) && core.mur_timer.jeweler_getinfo();
		
		$("#jew_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler_timer));
		if (core.mur_timer.jeweler_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#jew").hide();} }
		else {
			$("#jew").show();
			if (($("#jew_timer").text().search(/0\:0[0-5]/) > -1)&&($("#jew_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#jew").css("color") != "rgb(255, 0, 0)") {
					("sound_jeweler" != "nosound") && core.playSwfSound("sound_jeweler");
					$("#jew").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#jew").css("color") == "rgb(255, 0, 0)") $("#jew").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	//бзо
	if (core.mur_timer.jeweler2) {
		(core.mur_timer.jeweler2_update) && core.mur_timer.jeweler2_getinfo();
		
		$("#jew2_timer").text(core.mur_timer.getMyTime(core.mur_timer.jeweler2_timer));
		if (core.mur_timer.jeweler2_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#jew2").hide();} }
		else {
			$("#jew2").show();
			if (($("#jew2_timer").text().search(/0\:0[0-5]/) > -1)&&($("#jew2_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#jew2").css("color") != "rgb(255, 0, 0)") {
					("sound_jeweler2" != "nosound") && core.playSwfSound("sound_jeweler2");
					$("#jew2").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#jew2").css("color") == "rgb(255, 0, 0)") $("#jew2").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	
	
	if (core.mur_timer.tacktic) {
		(core.mur_timer.tacktic_update) && core.mur_timer.tacktic_getinfo();			
		$("#tac_timer").text(core.mur_timer.getMyTime(core.mur_timer.tacktic_timer));
		if (core.mur_timer.tacktic_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#tac").hide();} }
		else {
			$("#tac").show();
			if (($("#tac_timer").text().search(/0\:0[0-5]/) > -1)&&($("#tac_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#tac").css("color") != "rgb(255, 0, 0)") {
					("sound_tac" != "nosound") && core.playSwfSound("sound_tac");
					$("#tac").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#tac").css("color") == "rgb(255, 0, 0)") $("#tac").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	
	if (core.mur_timer.units_сard) {
		(core.mur_timer.units_сard_update) && core.mur_timer.units_сard_getinfo();	
		if ((core.mur_timer.units_сard_timer >= (new Date()))&& (localStorage["uncard_time"])) 
		{
			$("#uncard").hide();
			$("#uncard").css({
				"color": "rgb(0,0,0)", 
				"font-weight": ""
			}); 
		}
		else {
			$("#uncard").show();
			if ($("#uncard").css("color") != "rgb(255, 0, 0)") 
			{
				("sound_units_сard" != "nosound") && core.playSwfSound("sound_units_сard");
				$("#uncard").css({
					"color": "rgb(255,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	
	
	if (core.mur_timer.craftsman) {
		(core.mur_timer.craftsman_update) && core.mur_timer.craftsman_getinfo();
		
		$("#cra_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman_timer));
		if (core.mur_timer.craftsman_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#cra").hide();} }
		else {
			$("#cra").show();
			if (($("#cra_timer").text().search(/0\:0[0-5]/) > -1)&&($("#cra_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#cra").css("color") != "rgb(255, 0, 0)") {
					("sound_craftsman" != "nosound") && core.playSwfSound("sound_craftsman");
					$("#cra").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#cra").css("color") == "rgb(255, 0, 0)") $("#cra").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}	
	
	if (core.mur_timer.craftsman2) {
		(core.mur_timer.craftsman2_update) && core.mur_timer.craftsman2_getinfo();
		
		$("#cra2_timer").text(core.mur_timer.getMyTime(core.mur_timer.craftsman2_timer));
		if (core.mur_timer.craftsman2_timer < (new Date())) {if (!core.mur_timer.always_show) {$("#cra2").hide();} }
		else {
			$("#cra").show();
			if (($("#cra2_timer").text().search(/0\:0[0-5]/) > -1)&&($("#cra2_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#cra2").css("color") != "rgb(255, 0, 0)") {
					("sound_craftsman2" != "nosound") && core.playSwfSound("sound_craftsman2");
					$("#cra2").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#cra2").css("color") == "rgb(255, 0, 0)") $("#cra2").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	
	if (core.mur_timer.estate) {
        (core.mur_timer.estate_update) && core.mur_timer.estate_getinfo();
		
        $("#countm").text(core.mur_timer.estate_cards);
        $("#est_timer").text(core.mur_timer.getMyTime(core.mur_timer.estate_timer));
        if (core.mur_timer.estate_timer < (new Date()) || (core.mur_timer.estate_cards >= 5)) {
            core.mur_timer.estate_getinfo();
		} else $("#est").show();
	}
	
	
    if ((core.mur_timer.pet)||(core.mur_timer.egg)) {
        (core.mur_timer.pet_update) && core.mur_timer.pet_getinfo();
		
        $("#pcountm").text(core.mur_timer.pet_cards);
		if (core.mur_timer.pet_cards == 5)
		{
			if ($("#pet").css("color") != "rgb(255, 0, 0)") {
				("sound_pet" != "nosound") && core.playSwfSound("sound_pet");
				$("#pet").css({
					"color": "rgb(255,0,0)",
					"font-weight": "bolder"
				});
			}
		}
		else
		{
			$("#pet").css({
				"color": "rgb(0,0,0)",
				"font-weight": ""
			});
		}
        if (core.mur_timer.egg) {
            if (core.mur_timer.pet_timer_egg < (new Date())) core.mur_timer.pet_getinfo();
            if ($("#mur_eggs").children().length != core.mur_timer.pet_eggs) {
                $("#mur_eggs").empty();
                $("#mur_eggs").css({
                    left: -25 * core.mur_timer.pet_eggs
				});
                for (var i = 0; i < core.mur_timer.pet_eggs; i++) {
					$("#pet_egg").show();
                    $("#mur_eggs").append($("<img>", {width:"25px", src:"https://img.ereality.ru/-x-/w/egg.png"}));
					
				}
			}
		}
		if (core.mur_timer.pet) {
			if (core.mur_timer.pet_cards > 0) {
				$("#pcountm").parent().css({
					cursor: "pointer"
				});
				} else $("#pcountm").parent().css({
					cursor: ""
				});
				$("#pet_timer").text(core.mur_timer.getMyTime(core.mur_timer.pet_timer));
				if (core.mur_timer.pet_timer < (new Date()) || ((core.mur_timer.pet_cards == 0) && $("#pet_timer").text() == "0:00")) {
					$("#pet").hide();
					core.mur_timer.pet_getinfo();
				} else $("#pet").show();
		}
	}
	
    if (core.mur_timer.elit_train) {
        if (core.mur_timer.elit_training_update) {
            core.mur_timer.elit_training();
		}
		
        $("#elite_trining_timer").text(core.mur_timer.getMyTime(core.mur_timer.elit_training_timer));
		
        if (user.nowplace == "tournament") {
            core.mur_timer.elit_training();
		}
		
        if (core.mur_timer.elit_training_timer < (new Date()) || $("#elite_trining_timer").text() == "0:00") {
			if (!core.mur_timer.always_show) {$("#elite_trining").hide();}
			} 	else {
			$("#elite_trining").show();
			if (($("#elite_trining_timer").text().search(/0\:0[0-5]/) > -1)&&($("#elite_trining_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#elite_trining").css("color") != "rgb(255, 0, 0)") {
					("sound_elite_trining" != "nosound") && core.playSwfSound("sound_elite_trining");
					$("#elite_trining").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#elite_trining").css("color") == "rgb(255, 0, 0)") $("#elite_trining").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}	
	
	
	
	if (flag == 1) {
		if (((core.mur_timer.estate_timer < (new Date())) || (!core.mur_timer.estate))
			&& ((core.mur_timer.taverna_timer < (new Date())) || (!core.mur_timer.taverna)) 
			&& ((core.mur_timer.jeweler_timer < (new Date())) || (!core.mur_timer.jeweler))  
			&& ((core.mur_timer.jeweler2_timer < (new Date())) || (!core.mur_timer.jeweler2)) 
			&& ((core.mur_timer.tacktic_timer < (new Date())) || (!core.mur_timer.tacktic)) 
			&& ((core.mur_timer.units_сard_timer < (new Date())) || (!core.mur_timer.units_сard)) 
			&& ((core.mur_timer.craftsman_timer < (new Date())) || (!core.mur_timer.craftsman)) 
			&& ((core.mur_timer.craftsman2_timer < (new Date())) || (!core.mur_timer.craftsman2)) 
			&& ((core.mur_timer.elit_training_timer < (new Date())) || (!core.mur_timer.elit_train)) 
			&& ((core.mur_timer.guildhalling_timer < (new Date())) || (!core.mur_timer.guildhall)) 
			&& ((core.mur_timer.waraur_timer_1 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_2 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_3 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_4 < (new Date())) || (!core.mur_timer.waraur))  
			&& ((core.mur_timer.waraur_timer_5 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_6 < (new Date())) || (!core.mur_timer.waraur))
			&& ((core.mur_timer.miraur_timer_1 < (new Date())) || (!core.mur_timer.miraur))
			&& ((core.mur_timer.miraur_timer_2 < (new Date())) || (!core.mur_timer.miraur))
			&& ((core.mur_timer.mazzaur_timer < (new Date())) || (!core.mur_timer.mazzaur))
			&& ((core.mur_timer.ahram_timer < (new Date())) || (!core.mur_timer.aurhram))
			&& ((core.mur_timer.pet_timer_egg < (new Date())) || (!core.mur_timer.egg))
		&& ((core.mur_timer.pet_timer < (new Date())) || (!core.mur_timer.pet))) $(".ext_countdown").hide();
		else ($("#mur_clock_pic").css("display")=="none") && $(".ext_countdown").show();
	}
}




/////ауры, ОР
core.mur_timer.main2 = function() {	
	
	// Нужно ли показать кнопку голосовалки
	if ($("#m_golosovalka").length>0) {
		var now_dt = new Date( new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000+30000); // GMT +3
		if (now_dt.getDate() != core.mur_golosovalka_date) {$("#m_golosovalka").show(); ("sound_golos" != "nosound") && core.playSwfSound("sound_golos");}
	}	
	
	
	//////////////аура мирки
	if (core.mur_timer.miraur) {
		(core.mur_timer.miraur_update) && core.mur_timer.panel_getinfo();
		
		$("#mir_timer_1").text(core.mur_timer.getMyTime(core.mur_timer.miraur_timer_1));
		if (core.mur_timer.miraur_timer_1 < (new Date())) {$("#mir_1").hide();}
		else {
			$("#mir_1").show();
			if (($("#mir_timer_1").text().search(/0\:0[0-5]/) > -1)&&($("#mir_timer_1").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#mir_1").css("color") != "rgb(255, 0, 0)") {
					("sound_miraur" != "nosound") && core.playSwfSound("sound_miraur");
					$("#mir_1").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#mir_1").css("color") == "rgb(255, 0, 0)") $("#mir_1").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#mir_timer_2").text(core.mur_timer.getMyTime(core.mur_timer.miraur_timer_2));
		if (core.mur_timer.miraur_timer_2 < (new Date())) {$("#mir_2").hide();}
		else {
			$("#mir_2").show();
			if (($("#mir_timer_2").text().search(/0\:0[0-5]/) > -1)&&($("#mir_timer_2").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#mir_2").css("color") != "rgb(255, 0, 0)") {
					("sound_miraur" != "nosound") && core.playSwfSound("sound_miraur");
					$("#mir_2").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#mir_2").css("color") == "rgb(255, 0, 0)") $("mir_2").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	////////////////	
	
		
	//////////////мазь
	if (core.mur_timer.mazzaur) {
		(core.mur_timer.mazzaur_update) && core.mur_timer.panel_getinfo();
		
		$("#mazz_timer").text(core.mur_timer.getMyTime(core.mur_timer.mazzaur_timer));
		if (core.mur_timer.mazzaur_timer < (new Date())) {$("#mazz").hide();}
		else {
			$("#mazz").show();
			if (($("#mazz_timer").text().search(/0\:0[0-5]/) > -1)&&($("#mazz_timer").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#mazz").css("color") != "rgb(255, 0, 0)") {
					("sound_mazaur" != "nosound") && core.playSwfSound("sound_mazaur");
					$("#mazz").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#mazz").css("color") == "rgb(255, 0, 0)") $("#mazz").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}		
	}
	////////////////
	
	
	//////////////аура боёвки
	if (core.mur_timer.waraur) {
		(core.mur_timer.waraur_update) && core.mur_timer.panel_getinfo();
		
		$("#war_timer_1").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_1));
		if (core.mur_timer.waraur_timer_1 < (new Date())) $("#war_1").hide();
		else {
			$("#war_1").show();
			if (($("#war_timer_1").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_1").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_1").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_1").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_1").css("color") == "rgb(255, 0, 0)") $("#war_1").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#war_timer_2").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_2));
		if (core.mur_timer.waraur_timer_2 < (new Date())) $("#war_2").hide();
		else {
			$("#war_2").show();
			if (($("#war_timer_2").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_2").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_2").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_2").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_2").css("color") == "rgb(255, 0, 0)") $("#war_2").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#war_timer_3").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_3));
		if (core.mur_timer.waraur_timer_3 < (new Date())) $("#war_3").hide();
		else {
			$("#war_3").show();
			if (($("#war_timer_3").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_3").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_3").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_3").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_3").css("color") == "rgb(255, 0, 0)") $("#war_3").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#war_timer_4").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_4));
		if (core.mur_timer.waraur_timer_4 < (new Date())) $("#war_4").hide();
		else {
			$("#war_4").show();
			if (($("#war_timer_4").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_4").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_4").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_4").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_4").css("color") == "rgb(255, 0, 0)") $("#war_4").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#war_timer_5").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_5));
		if (core.mur_timer.waraur_timer_5 < (new Date())) $("#war_5").hide();
		else {
			$("#war_5").show();
			if (($("#war_timer_5").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_5").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_5").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_5").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_5").css("color") == "rgb(255, 0, 0)") $("#war_5").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
		
		$("#war_timer_6").text(core.mur_timer.getMyTime(core.mur_timer.waraur_timer_6));
		if (core.mur_timer.waraur_timer_6 < (new Date())) $("#war_6").hide();
		else {
			$("#war_6").show();
			if (($("#war_timer_6").text().search(/0\:0[0-5]/) > -1)&&($("#war_timer_6").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#war_6").css("color") != "rgb(255, 0, 0)") {
					("sound_waraur" != "nosound") && core.playSwfSound("sound_waraur");
					$("#war_6").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#war_6").css("color") == "rgb(255, 0, 0)") $("#war_6").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	////////////////	
	
	
	//////////////аура храма
	if (core.mur_timer.aurhram) {
		(core.mur_timer.aurhram_update) && core.mur_timer.panel_getinfo();
		
		$("#ahram").text(core.mur_timer.getMyTime(core.mur_timer.ahram_timer));
		if (core.mur_timer.ahram_timer < (new Date())) {$("#hram").hide();}
		else {				
			$("#hram").show();
			if (($("#ahram").text().search(/0\:0[0-5]/) > -1)&&($("#ahram").text().search(/[1-9]0\:0[0-5]/) == -1)) {
				if ($("#hram").css("color") != "rgb(255, 0, 0)") {
					("sound_aurhram" != "nosound") && core.playSwfSound("sound_aurhram");
					$("#hram").css({
						"color": "rgb(255,0,0)",
						"font-weight": "bolder"
					});
				}
				} else {
				if ($("#hram").css("color") == "rgb(255, 0, 0)") $("#hram").css({
					"color": "rgb(0,0,0)",
					"font-weight": ""
				});
			}
		}
	}
	////////////////		
	if ((core.mur_timer.ochrab)||(core.mur_timer.miraur)||(core.mur_timer.waraur)||(core.mur_timer.mazzaur)||(core.mur_timer.veteran)||(core.mur_timer.bloodiness)||(core.mur_timer.aurhram)) {
		core.mur_timer.panel_getinfo();	
	}	
	
	if ((core.mur_timer.notification_personal_message)) {
		core.mur_timer.notification_personal_message_getinfo();	
	}
	
	if ((core.mur_timer.klan_kvest)) {
		core.mur_timer.klan_kvest_getinfo();	
	}
	
	if (flag == 1) {
		if (((core.mur_timer.estate_timer < (new Date())) || (!core.mur_timer.estate))
			&& ((core.mur_timer.taverna_timer < (new Date())) || (!core.mur_timer.taverna)) 
			&& ((core.mur_timer.jeweler_timer < (new Date())) || (!core.mur_timer.jeweler))  
			&& ((core.mur_timer.jeweler2_timer < (new Date())) || (!core.mur_timer.jeweler2))  
			&& ((core.mur_timer.tacktic_timer < (new Date())) || (!core.mur_timer.tacktic))  
			&& ((core.mur_timer.units_сard_timer < (new Date())) || (!core.mur_timer.units_сard))  
			&& ((core.mur_timer.craftsman_timer < (new Date())) || (!core.mur_timer.craftsman))  
			&& ((core.mur_timer.craftsman2_timer < (new Date())) || (!core.mur_timer.craftsman2))  
			&& ((core.mur_timer.elit_training_timer < (new Date())) || (!core.mur_timer.elit_train)) 
			&& ((core.mur_timer.guildhalling_timer < (new Date())) || (!core.mur_timer.guildhall)) 
			&& ((core.mur_timer.waraur_timer_1 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_2 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_3 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_4 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_5 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.waraur_timer_6 < (new Date())) || (!core.mur_timer.waraur)) 
			&& ((core.mur_timer.miraur_timer_1 < (new Date())) || (!core.mur_timer.miraur))
			&& ((core.mur_timer.miraur_timer_2 < (new Date())) || (!core.mur_timer.miraur))
			&& ((core.mur_timer.mazzaur_timer < (new Date())) || (!core.mur_timer.mazzaur))
			&& ((core.mur_timer.ahram_timer < (new Date())) || (!core.mur_timer.miraur))
			&& ((core.mur_timer.pet_timer_egg < (new Date())) || (!core.mur_timer.egg))
		&& ((core.mur_timer.pet_timer < (new Date())) || (!core.mur_timer.pet))) $(".ext_countdown").hide();
		else ($("#mur_clock_pic").css("display")=="none") && $(".ext_countdown").show();
	}
}

core.mur_timer.setstyle = function (style, opac_ext) {
	size_small_font = t_small_font;
	size_middle_font = t_middle_font;
	size_big_font = t_big_font;
	if (!style) {
		if (localStorage["timerstylesmall"] == "1") style = "small"; 
		else if (localStorage["timerstylesmall"] == "2") style = "middle"; 
		else style = "big";
	}
	if (style == "big") {
		localStorage["timerstylesmall"] = "3";
		var css = {
			"border-radius": "6px",
			"font": size_big_font+"px/"+Math.ceil(size_big_font*1.2)+"px Verdana,Arial,Geneva,Helvetica,sans-serif",
			"padding": "6px",
			"width": t_big_width+"px",
			"opacity": opac_ext
		};
		} else if (style == "small") {
		localStorage["timerstylesmall"] = "1";
		var css = {
			"border-radius": "3px",
			"font": size_small_font+"px/"+Math.ceil(size_small_font*1.2)+"px Verdana,Arial,Geneva,Helvetica,sans-serif",
			"padding": "3px",
			"width": t_small_width+"px",
			"opacity": opac_ext
		};
		} else {
		localStorage["timerstylesmall"] = "2";
		var css = {
			"border-radius": "4px",
			"font": size_middle_font+"px/"+Math.ceil(size_middle_font*1.2)+"px Verdana,Arial,Geneva,Helvetica,sans-serif",
			"padding": "3px",
			"width": t_middle_width+"px",
			"opacity": opac_ext
		};
	}
	$(".ext_countdown").css(css);
}

core.mur_timer.init();


$(document.body.lastChild).after($("<div>", {'id':"m_mur_timer", 'class':"contextMenu", 'style':"visibility: hidden;position:absolute;"}).append($('<ul>', {'class':"textM"}).append(
$('<li>').append($("<a>", {'href':"javascript: core.mur_timer.setstyle('big',  "+opac_extcount+"); ", text:'-Большое-'}))),
$('<li>').append($("<a>", {'href':"javascript: core.mur_timer.setstyle('middle',  "+opac_extcount+");", text:'-Среднее-'})),
$('<li>').append($("<a>", {'href':"javascript: core.mur_timer.setstyle('small', "+opac_extcount+");", text:'-Маленькое-'}))
));
$(".ext_countdown").contextMenu("m_mur_timer",{});
$('body').on('click', '.result-button[data-action="finish-fight"]', function() {
	setTimeout(function () { 
		core.mur_timer.tacktic_update =true;
		core.mur_timer.units_сard_update =true;
		core.mur_timer.tacktic_getinfo();
		core.mur_timer.units_сard_getinfo();
		core.mur_timer.tacktic_parseinfo();
		core.mur_timer.units_сard_parseinfo();
		core.mur_timer.panel_getinfo();
	}, 300);
});
$('body').on('click', '.healControl[data-action="reviveAll"]', function() {
	setTimeout(function () { core.mur_timer.tacktic_update =true;
		core.mur_timer.tacktic_timer = new Date();
		localStorage["tac_time"] = core.mur_timer.tacktic_timer;
		$("#tac").hide();	
	}, 300);
});
$('body').on('click', '.treasureUse[data-action="useTreasure"]', function() {
	setTimeout(function () {
		core.mur_timer.units_сard_getinfo();
		core.mur_timer.units_сard_update =true;		
		//core.mur_timer.units_сard_timer = new Date();
		//localStorage["uncard_time"] = core.mur_timer.units_сard_timer;
		if (new Date().setTime(Date.parse(localStorage["uncard_time"])) <= (new Date()))
		{
			$("#uncard").hide();
		}
		else
		{
			$("#uncard").show();
		}
	}, 300);
});
		

setTimeout(function () {core.mur_timer.main();}, 300);
setInterval(function () {core.mur_timer.main();}, 10000);
setInterval(function () {core.mur_timer.main2();}, 600000);
if (core.mur_timer.ochrab) {
	
	
	intervalochrab = setInterval(
		function () {
			if ((core.mur_timer.ochrab_kol<360)||(localStorage["ochrab_kol"]<360)) 
			{
				if (core.mur_timer.ochrab_kol != undefined) 
				{
					$("#och_rab").text(Math.min(core.mur_timer.ochrab_kol+1)); 
					localStorage["ochrab_kol"]=core.mur_timer.ochrab_kol;
				}
				else
				{
					$("#och_rab").text(Math.round(localStorage["ochrab_kol"])+1);
					localStorage["ochrab_kol"]=Math.round(localStorage["ochrab_kol"])+1;
				}
			} 
			else 
				{
					clearInterval(intervalochrab);
				}
			}, 720000);
	}

}).toString()
+ ")();"; 