// ==UserScript==
// @name     ErExt_Common
// @include www.ereality.ru/core/*
// @require tools/jquery.js
// @require tools.js
// @require css/popup-css.js
// @require tools/popup.js
// @require tools/messaging-enum.js
//
// @require css/common-css.js
// @require common/buttons_holder.js
// @require common/monster-locations/monster-locations.js
// @require common/monster-locations/monster-locations-builder.js
// @require common/faction-counter/faction-counter.js
// @require common/faction-counter/faction-count-builder.js
//
// @require common/battle-counter/battle-counter.js
// @require common/battle-counter/battle-count-builder.js
//
// @require css/items-builder-css.js
// @require user/active-items/items-builder.js
// @require user/active-items/user-list-active-items.js
//
// @require common/fisher/fisher-builder.js
// @require common/fisher/fisher-counter.js
//
// @require common/turquoise/turquoise_flags_builder.js
// @require common/turquoise/turquoise_flags.js
//
// @require common/message-recorder/message-recorder-builder.js
// @require common/message-recorder/message-recorder.js
//
// @require common/silent-battles/silent-battles.js
// @require common/silent-battles/silent-battles-builder.js
//
// @require common/context-blocker/context-blocker.js
//
// @require common/OK-hide-corpses.js
//
// @require common/freeze_chat.js
//
// @require common/golosovalka.js
//
// @require common/turquoise_info.js
//
// @require common/abilki-heal.js
//
// @require common/mobs-filtr.js
//
// @require common/elit-inn.js
//
// @require common/teleport.js
//
// @require common/teleport2.js
//
// @require common/sounds-on-off.js
//
// @require common/trace-map/trace-map.js
//
// @require common/location-info/location-info.js
//
// @require common/presents2017.js
// ==/UserScript==

kango.invokeAsync('kango.storage.getItem', "options", function(options) {
	var mergedOptions = mergeOptions(options, defaultConfig.myoptions);

    var mergedSystemOptions = mergeOptions(kango.storage.getItem('kango.storage.getItem'), defaultConfig.systemOptions);

	// check if plug-in on pause
	if (!mergedOptions.unpaused) {
		return;
	}

	// Индекс кучки параметром перекидываю в доступные настройки
	var systemOptions = mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);
	mergedOptions.kol_ochrab = systemOptions.kol_ochrab;
	mergedOptions.opac_ext_count2 = systemOptions.opac_ext_count2;
	mergedOptions.opac_ext_count = systemOptions.opac_ext_count;
	mergedOptions.t_big_font = systemOptions.t_big_font;
	mergedOptions.t_middle_font = systemOptions.t_middle_font;
	mergedOptions.t_small_font = systemOptions.t_small_font;
	mergedOptions.t_big_width = systemOptions.t_big_width;
	mergedOptions.t_middle_width = systemOptions.t_middle_width;
	mergedOptions.t_small_width = systemOptions.t_small_width;
	mergedOptions.timers_position = systemOptions.timers_position;
	mergedOptions.tav_name = systemOptions.tav_name;
	mergedOptions.jew_name = systemOptions.jew_name;
	mergedOptions.jew2_name = systemOptions.jew2_name;
	mergedOptions.units_сard = systemOptions.units_сard;
	mergedOptions.tac_name = systemOptions.tac_name;
	mergedOptions.biryuza_name = systemOptions.biryuza_name;
	mergedOptions.malakhitovyy_name = systemOptions.malakhitovyy_name;
	mergedOptions.pobeda_venetc_name = systemOptions.pobeda_venetc_name;
	mergedOptions.pobeda_medal_name = systemOptions.pobeda_medal_name;
	mergedOptions.pobeda_kubok_name = systemOptions.pobeda_kubok_name;	
	mergedOptions.pobeda_runa_name = systemOptions.pobeda_runa_name;
	mergedOptions.pobeda_plazma_name = systemOptions.pobeda_plazma_name;
	mergedOptions.est_name = systemOptions.est_name;
	mergedOptions.pet_name = systemOptions.pet_name;
	mergedOptions.elite_trining_name = systemOptions.elite_trining_name;
	mergedOptions.guildhalling_name = systemOptions.guildhalling_name;
	mergedOptions.mir_aur_1_name = systemOptions.mir_aur_1_name;
	mergedOptions.mir_aur_2_name = systemOptions.mir_aur_2_name;
	mergedOptions.war_aur_1_name = systemOptions.war_aur_1_name;
	mergedOptions.war_aur_2_name = systemOptions.war_aur_2_name;
	mergedOptions.war_aur_3_name = systemOptions.war_aur_3_name;
	mergedOptions.war_aur_4_name = systemOptions.war_aur_4_name;
	mergedOptions.war_aur_5_name = systemOptions.war_aur_5_name;
	mergedOptions.war_aur_6_name = systemOptions.war_aur_6_name;
	mergedOptions.mazz_aur_name = systemOptions.mazz_aur_name;
	mergedOptions.och_name = systemOptions.och_name;
	mergedOptions.veter_name = systemOptions.veter_name;
	mergedOptions.cra_name = systemOptions.cra_name;
	mergedOptions.cra2_name = systemOptions.cra2_name;
	mergedOptions.bloodiness_name = systemOptions.bloodiness_name;
	mergedOptions.tracery_name = systemOptions.tracery_name;
	mergedOptions.tracery_count = systemOptions.tracery_count;
	mergedOptions.figure_name = systemOptions.figure_name;
	mergedOptions.aura_name = systemOptions.aura_name;
	mergedOptions.priv_name = systemOptions.priv_name;
	mergedOptions.personal_message_v = systemOptions.personal_message_v;
	mergedOptions.personal_message_k = systemOptions.personal_message_k;
	mergedOptions.personal_message_s = systemOptions.personal_message_s;
	mergedOptions.personal_message_f = systemOptions.personal_message_f;
	mergedOptions.kk_name = systemOptions.kk_name;
	
	

    var battleHolder = $('<span></span>');
    var peaceHolder = $('<span></span>');
	if (mergedOptions.buttons_holder) {
        var position = $("#div_users").find("a#span_sort").parent();

        position.prepend(button_holder_init(battleHolder, 0));

        if (mergedOptions.buttons_holder_oneDiv) {
            peaceHolder = battleHolder;
        }
        else {
            position.prepend(button_holder_init(peaceHolder, 25));
        }
    }
	else {
        battleHolder = peaceHolder;
        $("#div_users").children().first().after($("<div>", {class:"wrap", style:"z-index: 95;"}).append(battleHolder));
    }	
	
	arr=systemOptions.button_position.split("|");
	
	if (!mergedOptions.buttons_holder)
	{
		if ((arr.length>=16)&(!mergedOptions.biggest_buttons))
		{
			$("#div_users1").css({"overflow-x": "scroll"});
		}
	}

	for (i=0;i<=arr.length;i++)
	{
		if (arr[i]==1){
			// Голосовалка за профессии
				var golosovalka = new golosovalkaClass(golosovalkaCss, peaceHolder);
				golosovalka.init();
		}
		
		if (arr[i]==2){
			// Телепорт малым свитком
				var teleport = new teleportClass(teleportCss, peaceHolder);
				teleport.init();
		}

			// Открывашка подарков 2017
		if (arr[i]==19){
			var date = new Date();
			if ((date.getMonth()>=0)&(date.getMonth()<3))
				{
					var presents2017 = new presents2017Class(presents2017Css, peaceHolder);
					presents2017.init();
					var date = new Date();
				}
			}
			
		if (arr[i]==3){
			// Колониальные товары
				var turquoiseInfoBuilder = new turquoiseInfoClass(turquoiseCss, peaceHolder);
				turquoiseInfoBuilder.init();
		}
		
		
		if (arr[i]==4){
			// Отключение/включение звуков в игре
				var sounds = new soundsClass(soundsCss, peaceHolder, popup);
				sounds.init();
		}

		if (arr[i]==5){
			// Заморозка чата
				var freezeChat = new freezeChatClass(freezeChatCss, peaceHolder);
				freezeChat.init();
		}
		
		if (arr[i]==6){
			// Запись сообщений / Логгер ЛЧ
				var messageRecorder = new messageRecorderBuilderClass(messageRecorderBuilderCss, messageRecorderCss, peaceHolder, {
						width: mergedSystemOptions.private_chat_logger_width,
						height: mergedSystemOptions.private_chat_logger_height
					},
					mergedSystemOptions.private_chat_logger_order_asc
				);

				messageRecorder.init();
		}
		
		
		if (arr[i]==7){
			// Тихая разведка
				new turquoiseFlagsBuilderClass(turquoiseBuilderCss, turquoiseFlagsCss, peaceHolder).init();
		}
		
		
		if (arr[i]==8){
			// Тихая рыбалка
				new fisherBuilderClass(fisherCss, fishCounterCss, peaceHolder).init();
		}
		
		if (arr[i]==9){
			// battle modules
			// Восстановлениие здоровья персонажа за счет абилок
				var abilHeal = new abilHealClass(abilHealCss, battleHolder);
				abilHeal.init();
		}
		
		
		if (arr[i]==10){
			// Показывать только живых на локе Острова Крови
				var hideCorpses = new hideCorpsesClass(hideCorpsesCss, battleHolder);
				hideCorpses.init();
		}
		
		
		if (arr[i]==11){
			// init block context menu
				var contextBlocker = new contextBlockerClass(contextBlockerCss, battleHolder);
				contextBlocker.init();
		}
		
		
		if (arr[i]==12){
			// init trace map След
				var traceMap = new traceMapClass(traceCss, battleHolder, popup);
				traceMap.init();
		}

		
		if (arr[i]==13){
			// init faction countПодсчет игроков на локации			
				var factionContBuilder = new factionContBuilderClass(factionContBuilderCss, factionCounterCss, battleHolder);
				factionContBuilder.init();
		}
		
		
		if (arr[i]==14){
			// init battle countПодсчет прибыли хаотических и групповых боев
				var battleCountBuilder = new battleCountBuilderClass(factionContBuilderCss, factionCounterCss, battleHolder);
				battleCountBuilder.init();
		}
		

		if (arr[i]==15){
			// init silent battles Тихие бои
				new silentBattleBuilderClass(silentBattlesBuilderCss, silentBattlesCss, battleHolder).init();
		}

		if (arr[i]==16){
			// init monster locationsАреалы обитания монстров
				var monsterLocationBuilder = new monsterLocationBuilderClass(monsterLocationBuilderCss, factionCounterCss, battleHolder);
				monsterLocationBuilder.init();
		}
		
		if (arr[i]==17){
			// фильтр мобов	
				var mobsfiltr = new mobsfiltrClass(mobsfiltrCss, peaceHolder, popup);
				mobsfiltr.init();
		}
		
		if (arr[i]==18){
			// кнопка элитки
				var elitinn = new elitinnClass(elitinnCss, peaceHolder, popup, mergedOptions.anotherEliteTournamentMessage);
				elitinn.init();
		}
		
		if (arr[i]==20){
			// Телепорт абилками
				var teleport2 = new teleportClass2(teleportCss2, peaceHolder, popup);
				teleport2.init();
		}
	}



    // init user list active items
    if (mergedOptions.userlistactiveitems) {
        kango.invokeAsync('kango.storage.getItem', "systemOptions", function(options) {
            var mergedSystemOptions = mergeOptions(options, defaultConfig.systemOptions);
            kango.dispatchMessage(messagingEnum.userActiveItemsStart, {
                host: mergedSystemOptions.background_scripts_host
            });
            var usersListActiveItems = new usersListActiveItemsClass("#div_users", "a[class=b]", messagingEnum, popup);
            usersListActiveItems.init();
            var activeItemsInBattle = new usersListActiveItemsClass("#div_battle", "span[class*=bp]", messagingEnum, popup);
            activeItemsInBattle.init();

        });
    }

    // init location info
	if (myoptions.location_info) {
		new locationInfoClass('chat_msg', 'span_location', 'span_location_count').init();
	}
	
	// Увеличенные кнопки дополнения
	if (mergedOptions.biggest_buttons) {
        var wrap = $(".wrap");

		$("img", wrap).css({
			"background-color": "#d7d7d7",
			"border": "1px solid #AAAAAA",
			"cursor": "pointer",
			"height": "13px",
			"margin-left": "3px",
			"padding": "5px"
		});

        wrap.css({
			"background-color": "",
			"border": "",
			"padding": ""
		});

		if (!mergedOptions.buttons_holder) {
            wrap.css({
                "position": "absolute",
                "margin-left": "15px",
                "right": "30px",
                "top": "-30px"
            });
        }
	}
});




