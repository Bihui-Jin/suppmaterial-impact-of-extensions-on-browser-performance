// ==UserScript==
// @name     ErExt_ModifyCoreFunc
// @include     www.ereality.ru/core/*
// @include     *ereality.ru*
// @require     tools.js
// @require     scripts/core_map_trace.js
// @require     scripts/core_monster_locations.js
// @require     common/elit-inn.js
// @require     scripts/core_buttons.js
// @require     scripts/core_battle_counter.js
// @require     scripts/core_inventory.js
// @require     scripts/core_inventorytime.js
// @require     scripts/core_golosovalka.js
// @require     scripts/core_set_autowear.js
// @require     scripts/core_presents2017.js
// @require     scripts/core_dialogsTP.js
// @require     common/core_jeweler.js
// @require     scripts/core_timers.js
// @all-frames  false
// ==/UserScript==

kango.invokeAsync('kango.storage.getItem',"soptions", function(value) {
	defaultConfig.soundOptions = mergeOptions(value, defaultConfig.soundOptions);
});
//================================================================Begin

kango.invokeAsync('kango.storage.getItem',"options",function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
//=====================================================================  

	//передача версии плагина
	window.versionER = kango.getExtensionInfo().version;
	
	

  	
var trace_img_src=kango.io.getResourceUrl("res/sec_red.png");
var custom_sounds="";
var mergedSystemOptions = {};

	kango.invokeAsync('kango.storage.getItem', "systemOptions", function(options) {
		mergedSystemOptions = mergeOptions(options, defaultConfig.systemOptions);
		
		if (mergedSystemOptions.trace_img_src!="") {if (mergedSystemOptions.trace_img_src.search("res/")==0) {trace_img_src=kango.io.getResourceUrl(mergedSystemOptions.trace_img_src);} else  {trace_img_src=mergedSystemOptions.trace_img_src;} }
		if (mergedSystemOptions.custom_sounds!="") custom_sounds=mergedSystemOptions.custom_sounds;
		window.setTimeout(function() { pfunction(); }, 100);			
	});
	

function pfunction(){

 script="";

 script += "(" +
			(function() {
				 core.mur_soundOptions = soundOptionsReplace;
		}).toString() + ")();";

script = script.replace("soundOptionsReplace", '(' + JSON.stringify(defaultConfig.soundOptions) + ')');

 if ((myoptions.questsectors)||(myoptions.chatsectors)) {
	script +=  "(" +
	(function(){
		chat.myshowSec = function (xcord,ycord){
		var sectorX = top.frames.main.document.getElementById("searchX");
		if (sectorX!=null) {
			sectorY = top.frames.main.document.getElementById("searchY");
		}
		else {
			sectorX = top.frames.main.document.getElementById("sx2");
			sectorY = top.frames.main.document.getElementById("sy2");
		}
	sectorX.value=xcord;
	sectorY.value=ycord;
	if( window.KeyEvent ) {// Для FF
		var o = document.createEvent('KeyEvents');
		o.initKeyEvent( 'keyup', true, true, window, false, false, false, false, 13, 0 );
		}
	else {// Для остальных браузеров
		var o = document.createEvent('UIEvents');
		o.initUIEvent( 'keyup', true, true, window, 1 );
		  o.keyCode = 13; // Указываем дополнительный параметр, так как initUIEvent его не принимает
		}	
	sectorY.dispatchEvent(o);
	}
	}).toString()
	+ ")();"; 
}
	var erExtImages = {
		globalEventImage: kango.io.getResourceUrl("res/global.jpg")
	};
	




	var formatSmilesString = (function() {	
		var soundOptions = soundOptionsReplace;
		var erExtOptions = optionsReplace;
		var erExtImages = erExtImagesReplace;
		var erExtSystemOptions = erExtSystemOptionsReplace;
		
		// @TODO refactor it
		function modifySectors(_text) {

			if ((_text.search("опыта")==-1)&&(_text.search("Вы подобрали")==-1)&&(_text.search("http")==-1)&&(_text.search("www.")==-1)&&(_text.search("aliens")==-1)
			&&(_text.search(/ подарил.? Вам /)==-1)) {
				if ((_text.search("Ауры")!=-1)||(_text.search("ептикон")!=-1)||(_text.search("за убийство")!=-1)||(_text.search("Людей:")!=-1)) {
					_text=_text.replace(/(\d{1,3})[: \.](\d{1,3})/ig,"<a class=\"textM\" href=\"javascript:(function(){chat.myshowSec($1,$2);})();\">$&</a>"); 
					}
				else if (_text.search(" сер.")!=-1) 	{
					 _text=_text.replace(/(\d{1,3})[: \-\/](\d{1,3})/ig,"<a class=\"textM\" href=\"javascript:(function(){chat.myshowSec($1,$2);})();\">$&</a>");
						}
				else {		
					_text=_text.replace(/(\d{1,3})[: \.\-\/](\d{1,3})/ig,"<a class=\"textM\" href=\"javascript:(function(){chat.myshowSec($1,$2);})();\">$&</a>");
				}			
			}
			
			return _text;
		};
		
		function detectForSound(string, detect, sound) {
			
			if ((sound == "nosound")||(detect == "")) {
				return false;
			}

			if (string.toLowerCase().search(new RegExp(detect.toLowerCase()), 'g') != -1) {
				core.playSwfSound(sound);
				
				return true;
			}
			
			return false;
		}; 
		
		//Подправляем ссыллки на форум, что-бы было с автологином,
		var forumRegExp = new RegExp("http://forum.ereality.ru", 'g');
		function modifyForumLink(string) {
			return string.replace(forumRegExp, "http://www.ereality.ru/goto/forum.ereality.ru");
		};
		
		function eventMessage (string)
		{	
			if (string.search("Охота на аленей") != -1)
			{				
					return string.replace("Охота на аленей", "Охота на аленей (Награждается 50%)");
			}
			if (string.search("Охота на Острове Крови") != -1)
			{				
					return string.replace("Охота на Острове Крови", "Охота на Острове Крови (Награждается 33%)");
			}
			if (string.search("Охота на людей") != -1)
			{				
					return string.replace("Охота на людей", "Охота на людей (Награждается 50%)");
			}
			if (string.search("Нападение Ктулху") != -1)
			{				
					return string.replace("Нападение Ктулху", "Нападение Ктулху (Награждается 33%)");
			}
			if (string.search("Шахтерский подвиг") != -1)
			{				
					return string.replace("Шахтерский подвиг", "Шахтерский подвиг (Награждается 33%)");
			}
			if (string.search("Трапперский забег") != -1)
			{				
					return string.replace("Трапперский забег", "Трапперский забег (Награждается 50%)");
			}
			if (string.search("Здесь куют металл") != -1)
			{				
					return string.replace("Здесь куют металл", "Здесь куют металл (Награждается 50%)");
			}
			if ((string.search("В очередь!") != -1)||(string.search("В очередь</b>") != -1))
			{				
					return string.replace("В очередь", "В очередь (Награждается 33%)");
			}
			if (string.search("Вторжение демонов") != -1)
			{				
					return string.replace("Вторжение демонов", "Вторжение демонов (Награждается 33%)");
			}
			if (string.search("Нападения бандитов") != -1)
			{				
					return string.replace("Нападения бандитов", "Нападения бандитов (Награждается 33%)");
			}
			if (string.search("Испытание боем") != -1)
			{				
					return string.replace("Испытание боем", "Испытание боем (Награждается 33%)");
			}
			if (string.search("Час подарков") != -1)
			{				
					return string.replace("Час подарков", "Час подарков (Награждается 33%)");
			}
			if (string.search("Победные хаоты") != -1)
			{				
					return string.replace("Победные хаоты", "Победные хаоты (Награждается 33%)");
			}
			if (string.search("Атака маленьких драконов") != -1)
			{				
					return string.replace("Атака маленьких драконов", "Атака маленьких драконов (Награждается 50%)");
			}
			if (string.search("Охота на") != -1)
			{				
					return string.replace("Охота на", "(Награждается 25%) Охота на");
			}
			return string;
		}

		
		var ringOfRendomRegExp = new RegExp('.+ собра.+ Кольцо Рандома!' , 'g');
		function filterRingOfRendomNotification(_text) {
			if(_text.search(ringOfRendomRegExp) != -1) {
				return true;
			}
			
			return  false;
		}
		
		var filterBoiZaArtiRegExp = new RegExp('Участвуйте в хаотических боях и получайте золото и бесплатные артефакты каждый день' , 'g');
		function filterBoiZaArtiNotification(_text) {
			if(_text.search(filterBoiZaArtiRegExp) != -1) {
				return true;
			}
			
			return  false;
		}		
		
		function filtersilence_caretaker(_text) {
			arr_silence = (erExtSystemOptions.silence_caretaker_regular).split('|');
			for (i=0;i<arr_silence.length;i++)
			{
				var filtersilence_caretakerRegExp = new RegExp(arr_silence[i], 'g');
				if((_text.search(filtersilence_caretakerRegExp) != -1)&(arr_silence[i]!='')) {
					return true;
				}
			}
			
			return  false;
		}
		
		
		var filterGildQusetComRegExp = new RegExp('Выполнено задание гильдии! Получено:' , 'g');
		function filterGildQusetComfication(_text) {
			if(_text.search(filterGildQusetComRegExp) != -1) {
				var time = new Date();
				core.mur_timer.guildhalling_timer = new Date();
				core.mur_timer.guildhalling_timer.setTime(time.getTime() + 129600000);
				localStorage["guildhalling_time"] = core.mur_timer.guildhalling_timer;
			}
		}
		
		
		var goldenHorseShoeRegExp = new RegExp('Поздравляем победителя Золотой Подковы! .+ бесплатно получи.+ купон на .+ золота, купив .+ золота.' , 'g');
		function filterGoldenHorseShoeNotification(_text) {
			if(_text.search(goldenHorseShoeRegExp) != -1) {
				return true;
			}
			
			return  false;
		}
		
		var eliteTournamentStartRegExp = new RegExp('(?:Э|э)литн[а-я]* {1}(?:Т|т)урнир[а-я]*' , 'g');
		var eliteTournamentStartRegExpIsklu = new RegExp('Ваша заявка на поединок в рамках элитного турнира принята*' , 'g');
		function filterEliteTournamentNotification(_text) {
			if(_text.search(eliteTournamentStartRegExp) != -1) {
			if(_text.search(eliteTournamentStartRegExp) == -1) {
				return true;
			}
			}
			
			return  false;
		}
		
		function filterBrokenItemNotifications(_text) {
			if (_text.search('Вещи в критическом состоянии:') == -1) {
				return false;
			}

			if (_text == brokenItems.text && new Date().getTime() - brokenItems.time < brokenItems.messageDelay) {
				return true;
			}
			
			brokenItems.time = new Date().getTime();
			brokenItems.text = _text;
			
			return false;
		}
		
		function filterJailEmptyNotification(_text) {
			if (_text.search('Тюрьма пуста!') == -1) {
				return false;
			}

			if (new Date().getTime() - OKMessages.emptyJail.time > OKMessages.emptyJail.messageDelay) {
				OKMessages.emptyJail.time = new Date().getTime();
			
				return false;
			}
			
			return true;
		}
		
		function filterOneTeamIsStrongerMessage(_text) { 
			if (_text.search('Нельзя вмешаться за более сильную команду, если она сильнее второй в ') == -1) {
				return false;
			}

			if (new Date().getTime() - OKMessages.oneTeamStronger.time > OKMessages.oneTeamStronger.messageDelay) {
				OKMessages.oneTeamStronger.time = new Date().getTime();
			
				return false;
			}
			
			return true;		
		} 

        function filterWaitBattleEndMessage(_text) {
            if (_text.search('Дождитесь завершения боя') == -1) {
                return false;
            }

            if (new Date().getTime() - OKMessages.waitEndBattle.time > OKMessages.waitEndBattle.messageDelay) {
                OKMessages.waitEndBattle.time = new Date().getTime();

                return false;
            }

            return true;
        }

        function filterOneSideFactionsMessage(_text) {
            if (_text.search('Фракция может принимать участие в бою только на одной стороне') == -1) {
                return false;
            }

            if (new Date().getTime() - OKMessages.oneSideFaction.time > OKMessages.oneSideFaction.messageDelay) {
                OKMessages.oneSideFaction.time = new Date().getTime();

                return false;
            }

            return true;
        }

		function filterBattleIsClosedMessage(_text) {
			if (_text.search('Вы не можете вмешаться в закрытый бой') == -1) {
				return false;
			}

			if (new Date().getTime() - OKMessages.battleIsClosed.time > OKMessages.battleIsClosed.messageDelay) {
				OKMessages.battleIsClosed.time = new Date().getTime();
			
				return false;
			}
			
			return true;			
		}

        function filterEmptyIslandEnemies(_text) {
            if (_text.search('На острове нет подходящих противников.') == -1) {
                return false;
            }

            if (new Date().getTime() - OKMessages.EmptyIslandEnemies.time > OKMessages.EmptyIslandEnemies.messageDelay) {
                OKMessages.EmptyIslandEnemies.time = new Date().getTime();

                return false;
            }

            return true;
        }
		
        function filterAltarRequireBlood(_text) {
            if (_text.search('Нужно больше крови!  Победите хотя бы в одном обычном бою на Острове Крови, чтобы Портал Коварства открыл для вас свои врата!') == -1) {
                return false;
            }

            if (new Date().getTime() - OKMessages.AltarRequireBlood.time > OKMessages.AltarRequireBlood.messageDelay) {
                OKMessages.AltarRequireBlood.time = new Date().getTime();

                return false;
            }

            return true;
        }
		
		
        function filterMessageBZA(_text) {
            if (_text.search('Спасибо за ожидание в заявке в течение .+секунд! Ваш лимит серебра за ожидание в заявке на сегодня исчерпан, он обнулится после полуночи!') == -1) {
                return false;
            }

            if (new Date().getTime() - OKMessages.MessageBZA.time > OKMessages.MessageBZA.messageDelay) {
                OKMessages.MessageBZA.time = new Date().getTime();

                return false;
            }

            return true;
        }
		
		var filterOkMessageRegExp = /\[([0-9]+)\/[0-9]+\] :102: Сектор \(.+:.+\)\. Бой [0-9]+ \([0-9]+-[0-9]+\) против [0-9]+ \([0-9]+-[0-9]+\)\. Ауры -{0,}[0-9]+% и -{0,}[0-9]+%\..{0,}/;
		function filterOkHelpMessage(_text) { 
			var match = filterOkMessageRegExp.exec(_text);				
			if (match != null) {
				if (Number.parseInt(match[1], 10)  >= Number.parseInt(erExtSystemOptions.okHelpMessageMinLevel, 10)) {
					return false;
				}
				
				return true;
			}
			
			return false;
		}

		function filterCT(_text,_tn) {
			var now_dt = new Date(new Date().getTime() + (3 + ((new Date()).getTimezoneOffset() / 60)) * 3600 * 1000); // GMT +3
				if (_text.search(":102:  КТ !!!") >= 0 && now_dt.getHours() >= erExtSystemOptions.minCTtime && now_dt.getHours() < erExtSystemOptions.maxCTtime && _tn.search(user.name) != -1) {
					return true;
				}

				return false;
		}
		
		function filterERAF(_text) {
				if (_text.search("ERАФ") >= 0) {
					return true;
				}

				return false;
		}		
		
		
		function modifyClanTournamentMessage(_text) {			
			$.each(clanTournament, function() {
				var regEx = new RegExp(this.detect, 'g');
				if (_text.search(regEx) > -1) {				
					_text = _text.replace(regEx, this.replace);
				}
			});
			
			return _text;
		}
		
		function modifyPrivateSmiles(_text) {
			var pSmiles = {};
			var matches = _text.match(new RegExp('"%PS%([0-9]+)', 'g'));
			
			if (matches == null) { 
				return _text;
			}
			
			$.each(matches, function() {
				var smileID = this.substr(5);

				if ($.inArray(parseInt(smileID), chat.psmile) > -1 && pSmiles[smileID] == null) {
					pSmiles[smileID] = true;
					

					_text = _text.replace(new RegExp('<img src="%PS%' +  smileID + '.gif">', 'g') , '<img class="smile" src="%PS%' +  smileID + '.gif" name="sp' + smileID + '">');
				}
			});				

			return _text;
		}	
		

		$("#div_chat_msg").html($("#div_chat_msg").html().replace(/ emoji"/g, '" width="20"'));
		
		
		var oldChatHTML = chat.html;
		var oldPrintMessage = messenger.PrintMessage;
		var keeperName = 'Смотритель';
        var reminderName = 'Напоминание';
        var autoAnswerName = 'Автоответчик';
		var pluginName = 'Оповещение плагина';		
		var zoGuild1 = 'Гильдия Плотников';
		var zoGuild2 = 'Гильдия Лесорубов';
		var zoGuild3 = 'Гильдия Шахтёров';
		var zoGuild4 = 'Гильдия Трапперов';
		var zoGuild5 = 'Гильдия Ремесленников';
		

		var brokenItems = {
			time: 0,
			text: '',
			messageDelay: 5 * 60 * 1000 // 5 minutes
		};
		
		var OKMessages = {
			emptyJail: {
				time: 0,
				messageDelay: 60 * 1000 // 1 minute
			},
			oneTeamStronger: {
				time: 0,
				messageDelay: 60 * 1000 // 1 minute
			},
			battleIsClosed: {
				time: 0,
				messageDelay: 60 * 1000 // 1 minute
			},
            waitEndBattle: {
                time: 0,
                messageDelay: 60 * 1000 // 1 minute
            },
            oneSideFaction: {
                time: 0,
                messageDelay: 60 * 1000 // 1 minute
            },
            EmptyIslandEnemies: {
                time: 0,
                messageDelay: 60 * 1000 // 1 minute
            },
            AltarRequireBlood: {
                time: 0,
                messageDelay: 60 * 1000 // 1 minute
            }
		}
		
		var clanTournament = [
			{detect: "<b>(.+)</b> взял флаг на секторе <b>(.+)</b>!", replace: "<b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> взял флаг на секторе <b>$2</b>! "},
			{detect: "На <b>(.+)</b> напали на  <b>(.+)</b>!", replace: "На <b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> напали на  <b>$2</b>!"},
			{detect: "<b>(.+)</b> доставил флаг!", replace: "<b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> доставил флаг!"},
			{detect: "<b>(.+)</b> попал в яму на секторе <b>(.+)</b>!", replace: "<b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> попал в яму на секторе <b>$2</b>!"},
			{detect: "<b>(.+)</b> покинул яму!", replace: "<b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> покинул яму!"},
			{detect: "<b>(.+)</b> покинул остров!", replace: "<b><span class=\"nick1\" id=\"\" style=\"cursor:pointer\" name=\"6:$1\">$1</span></b> покинул остров!"},
			
		]
		
		if (soundOptions["sound_random_event"].sound != "nosound") {
			var oldStartReaction = quests.StartReaction;
			
			var randomEventsDetectImages = [
				'spring.png',
				'snake.png',
				'purse.png',
				'goblins.png',
				'scarecrow.png',
				'trap.png',
				'woodcutter.png',
				'double_the_fall.png',
				'meditation.png',
				'cache.png',
				'driada_npc.png',
				'derevo.png',
				'ax.png',
				'evil_fish.png',
				'krokod_npc.png',
				'worms.png',
				'goldfish.png',
				'big_fish.png',
				'shoe.png'					
			];		
			
			quests.StartReaction = function(xmldoc) {
				oldStartReaction.apply(quests, [xmldoc]);

				if ($("actions", xmldoc).text() != '') {
					return;
				}
				
				var image = $("npc_image", xmldoc).text();
				
				$.each(randomEventsDetectImages, function() {
					if (this == image) {
						core.playSwfSound(soundOptions["sound_random_event"].sound);
						return;
					}
				});
			}
		}

        var fishRegExp = {
            'Крабы': new RegExp('(?:<b>)?Вы достали из корзины (?:<b>)?(.+?)<\/b>, получено опыта: <b>(.+?)<\/b>, текущая прочность инструмента: <b>(.+?)<\/b>(?:, )?((?:<b>)?Рыбак: (?:<b>)?.+<\/b> \(.+\)(?:<\/b>)?)?'),
            'Рыба': new RegExp('(?:<b>)?Вы поймали (?:<b>)?(.+?)<\/b>, получено опыта: <b>(.+?)<\/b>, текущая прочность инструмента: <b>(.+?)<\/b>(?:, )?(Рыбак: (?:<b>)?.+<\/b> \(.+\)(?:<\/b>)?)?'),
            '0': new RegExp('(Рыбка соскочила..)'),
            '1': new RegExp('(Клетка пуста)')
        };

		function erExtDetectFish(sys, _t, _id, _time, _nick, _tn, _color, _text) {
            for (var key in fishRegExp) {
                var match = _text.match(fishRegExp[key]);

                if (match) {
                    var fish = match[1];
                    var exp = 0;

                    if (match[2]) {
                        exp = parseInt(match[2]);
                    }

                    var fishes = localStorage['fishes'];
                    if (typeof fishes != "undefined") {
                        fishes = JSON.parse(fishes);
                    }
                    else {
                        fishes = {};
                    }

                    if (typeof fishes[fish] != "undefined") {
                        fishes[fish]++;
                    }
                    else {
                        fishes[fish] = 1;
                    }

                    if (typeof fishes[key + ' Опыта'] != "undefined") {
                        fishes[key + ' Опыта'] += exp;
                        fishes[key + ' Подходов']++;
                    }
                    else {
                        fishes[key + ' Опыта'] = exp;
                        fishes[key + ' Подходов'] = 1;
                    }

                    localStorage['fishes'] = JSON.stringify(fishes);


                    if (typeof localStorage['fisher_chat_notice'] == 'undefined' || localStorage['fisher_chat_notice'] != 'true') {
                        return true;
                    }

                    var msg = '';
                    if (match[3]) {
                        var exponent = match[3].length - 2;
                        var durable = parseInt(match[3]);

                        if (exponent < 1) {
                            exponent = 1;
                        }

                        if (durable < 21 || durable % (5 * Math.pow(10, exponent)) == 0) {
                            msg = 'Прочность инструмента для рыбалки: <b> ' + match[3] + '</b>';
                        }
                    }

                    if (match[4]) {
                        if (msg.length > 0) {
                            msg += '. ';
                        }

                        msg += match[4];
                    }

                    if (msg.length > 0) {
                        oldChatHTML.apply(chat, [sys, _t, _id, _time, _nick, _tn, _color, msg]);
                        chat.scrollDown();
                    }

                    return true;
                }
            }

            return false;
        }

        var turquoiseExploreRegExp = {
            '1': new RegExp('Вы внесли вклад ([0-9]+)% в разведку сектора (?:([0-9]+):([0-9]+)).* Ваш вклад: [0-9]*%, текущий прогресс разведки: ([0-9]+)%')
        }

        function erExtTurquoiseExplore(_text) {
            for (var key in turquoiseExploreRegExp) {
                var match = _text.match(turquoiseExploreRegExp[key]);

                if (match) {
                    var percent = parseInt(match[1]);
                    var positionX = match[2];
                    var positionY = match[3];
                    var totalPercent = match[4];

                    var turquoiseFlags = localStorage['turquoise_flags'];
                    if (typeof turquoiseFlags != "undefined") {
                        turquoiseFlags = JSON.parse(turquoiseFlags);
                    }
                    else {
                        turquoiseFlags = {};
                    }

                    if (typeof turquoiseFlags[positionX] == "undefined") {
                        turquoiseFlags[positionX] = {};
                    }

                    if (typeof turquoiseFlags[positionX][positionY] == "undefined") {
                        turquoiseFlags[positionX][positionY] = {
                            'percent': 0,
                            'totalPercent': 0
                        };
                    }

                    turquoiseFlags[positionX][positionY]['percent'] += percent;
                    turquoiseFlags[positionX][positionY]['totalPercent'] = totalPercent;

                    localStorage['turquoise_flags'] = JSON.stringify(turquoiseFlags);
                    localStorage['turquoise_flags_update'] = true;

                    return typeof localStorage['turquoise_flags_chat_notice'] == 'undefined'
                        || localStorage['turquoise_flags_chat_notice'] != 'true';
                }
            }

            return false;
        }

        function erExtMessageRecorder(sys, _t, _id, _time, _nick, _tn, _color, _text) {
            var recordedMessages = localStorage['recordedMessages'];

            if (typeof recordedMessages != "undefined") {
                recordedMessages = JSON.parse(recordedMessages);
            }
            else {
                recordedMessages = [];
            }

            _text = _text.replace(/"%PS%/gi,'"' + img_path + "smile/p/");

            recordedMessages.push({
                time: _time,
                author: _nick,
                toNames: _tn,
                message: chat.formatSmilies(_text, 3),
                color: _color,
                isReaded: false
            });

            var maxMessages = parseInt(erExtSystemOptions.private_chat_logger_max_messages);
            if (maxMessages > 300) {
                maxMessages = 300;
            }

            if (recordedMessages.length > maxMessages) {
                recordedMessages.shift();
            }

            localStorage['recordedMessages'] = JSON.stringify(recordedMessages);
        }

        //var erExtBattleLogRegExp = /(?:Бой завершен.)*(?:<a (href)="(.+?)".*>Бой завершен<\/a>.)*(?: (Нанесено урона) <b>([0-9]+)<\/b>)*(?:, (получено опыта) <b>([0-9]+)<\/b>)*(?: (Получено <b>([0-9]+)<\/b> опыта))*(?:, (PvP баллов) <b>([0-9]+)<\/b>)*(?:, (золота) <b>([0-9]*\.?[0-9])*<\/b>)*(?:, (серебра) <b>([0-9]+\.?[0-9]*)<\/b>)*(?:, (Охотник): <b>\+([0-9]*)<\/b>, [0-9]* \([0-9]*\.?[0-9]*%\))*(?: (Рейтинг полемарха +): \+([0-9]*), [0-9]* \([0-9]*\.?[0-9]*%\))*/;
		var erExtBattleLogRegExp = /(?:Бой завершен.)*(?:<a (href)="(.+?)".*>Бой завершен<\/a>.)*(?: (Нанесено урона) <b>([0-9]+)<\/b>)*(?:, (получено опыта) <b>([0-9]+)<\/b>)*(?: (Получено <b>([0-9]+)<\/b> опыта))*(?:, (PvP баллов) <b>([0-9]+)<\/b>)*(?:, (серебра) <b>([0-9]+\.?[0-9]*)<\/b>)*(?:, (золота) <b>([0-9]*\.?[0-9]*)*<\/b>)*(?:, (Охотник): <b>\+([0-9]*)<\/b>, [0-9]* \([0-9]*\.?[0-9]*%\))*(?:, (Капитан): <b>\+([0-9]*)<\/b>, [0-9]* \([0-9]*\.?[0-9]*%\))*(?:, (пиастров) <b>([0-9]+\.?[0-9]*)<\/b>)*(?:, (рейтинг полемарха): <b>\+([0-9]*)<\/b>)*(?:(Вы получили) ([0-9]+))*/;
		//var erExtBattleLogRegExp = /(?:Бой завершен.)*(?:<a (href)="(.+?)".*>Бой завершен</a>.)*(?: (Нанесено урона) <b>([0-9]+)</b>)*(?:, (получено опыта) <b>([0-9]+)</b>)*(?: (Получено <b>([0-9]+)</b> опыта))*(?:, (PvP баллов) <b>([0-9]+)</b>)*(?:, (золота) <b>([0-9]*.?[0-9]*)*</b>)*(?:, (серебра) <b>([0-9]+.?[0-9]*)</b>)*(?:, (Охотник): <b>+([0-9]*)</b>, [0-9]* ([0-9]*.?[0-9]*%))*(?:, (рейтинг полемарха): <b>+([0-9]*)</b>)*/;//(Вы получили) ([0-9]+) ед\. эктоплазмы)
        var erExtBattleLogIndexRegExp = / <b>[0-9]+<\/b>/;
		//chat.html(0, 1, 0, "01:00:22", "Смотритель", "SaintDragon", "666666", "Вы получили 1 ед. эктоплазмы.");
		
        var erExtBattleDataMap = {
            'Нанесено урона': {
                'label': 'hits',
                'show': false,
                'type': 'digit',
                'showLabel': 'Урон'
            },
            'получено опыта': {
                'label':  'experience',
                'show': false,
                'type': 'digit',
                'showLabel': 'Опыт'
            },
            'Получено опыта': {
                'label':  'experience',
                'show': false,
                'type': 'digit',
                'showLabel': 'Опыт'
            },
            'PvP баллов': {
                'label': 'pvp',
                'show': true,
                'type': 'digit',
                'showLabel': 'PvP'
            },
            'золота': {
                'label': 'gold',
                'show': true,
                'type': 'digit',
                'showLabel': 'Золота'
            },
            'серебра': {
                'label': 'silver',
                'show': true,
                'type': 'digit',
                'showLabel': 'Серебра'
            },
            'пиастров': {
                'label': 'piastr',
                'show': true,
                'type': 'digit',
                'showLabel': 'Пиастры'
            },
            'Охотник': {
                'label': 'hunter',
                'show': true,
                'type': 'digit',
                'showLabel': 'Охотник'
            },
            'Капитан': {
                'label': 'kaptan',
                'show': true,
                'type': 'digit',
                'showLabel': 'Капитан'
            },
            'href': {
                'label': 'link',
                'show': false,
                'type': 'text',
                'showLabel': 'Охотник'
            },
            'рейтинг полемарха': {
                'label': 'mooh',
                'show': true,
                'type': 'digit',
                'showLabel': 'Полемарх'
            },
            'Вы получили ед. эктоплазмы.': {
                'label': 'plazm',
                'show': true,
                'type': 'digit',
                'showLabel': 'Эктоплазма'
            },
            'Вы получили': {
                'label': 'inoe',
                'show': true,
                'type': 'digit',
                'showLabel': 'Иное'
            }
        };

        function erExtBattleLogDetect(sys, _t, _id, _time, _nick, _tn, _color, _text) {
            var match = _text.match(erExtBattleLogRegExp);

			if ((match["input"]=="Вы получили 1 ед. эктоплазмы.")||(match["input"]=="Вы получили 1 ед. эктоплазмы за убийство фантома."))
			{
				match = ["Вы получили ед. эктоплазмы. 1", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Вы получили ед. эктоплазмы.", "1"];
				match["index"]= 0; 
				match["input"]= "Вы получили 1 ед. эктоплазмы."; 
				match["groups"]=undefined;
			}
			else if ((match["input"]=="Вы получили 2 ед. эктоплазмы.")||(match["input"]=="Вы получили 2 ед. эктоплазмы за убийство фантома."))
			{
				match = ["Вы получили ед. эктоплазмы. 2", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Вы получили ед. эктоплазмы.", "2"];
				match["index"]= 0; 
				match["input"]= "Вы получили 2 ед. эктоплазмы."; 
				match["groups"]=undefined;
			}
			else if ((match["input"]=="Вы получили 4 ед. эктоплазмы.")||(match["input"]=="Вы получили 4 ед. эктоплазмы за убийство фантома."))
			{
				match = ["Вы получили ед. эктоплазмы. 4", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, "Вы получили ед. эктоплазмы.", "4"];
				match["index"]= 0; 
				match["input"]= "Вы получили 4 ед. эктоплазмы."; 
				match["groups"]=undefined;
			}
			else if (match["input"].indexOf("Вы получили")!=-1)
			{
				match = ["", undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];
				match["index"]= 0; 
				match["groups"]=undefined;
			}

			if (match[0].length > 0) {
				var battleData = {};
				for (var i in match) {
					var index = parseInt(i);

					if (index == i && index > 0 && index % 2 != 0 && match[index] !== undefined) {
						var mapIndex = match[index].replace(erExtBattleLogIndexRegExp, '');
						battleData[mapIndex] = match[index + 1];
					}
				}

				var savedBattleData = localStorage['nBattleData'];

				if (typeof savedBattleData != "undefined") {
					savedBattleData = JSON.parse(savedBattleData);
				}
				else {
					savedBattleData = {};
				}

				for (var i in battleData) {
					if (erExtBattleDataMap[i]['type'] == 'digit') {
						if (typeof savedBattleData[erExtBattleDataMap[i]['label']] == 'undefined') {
							savedBattleData[erExtBattleDataMap[i]['label']] = 0;
						}

						var toSave = savedBattleData[erExtBattleDataMap[i]['label']] + parseFloat(battleData[i]);
						savedBattleData[erExtBattleDataMap[i]['label']] = Math.round(toSave * 100) / 100;
					}

					if (erExtBattleDataMap[i]['type'] == 'text') {
						savedBattleData[erExtBattleDataMap[i]['label']] = battleData[i];
					}
				}

				localStorage['nBattleData'] = JSON.stringify(savedBattleData);

				if (typeof localStorage['silentBattleRunChatNotice'] != 'undefined' &&
					localStorage['silentBattleRunChatNotice'] == 'true') {

					var msg = "";

					for (var i in battleData) {
						if (erExtBattleDataMap[i]['show']) {
							msg += erExtBattleDataMap[i]['showLabel'] + ": " + battleData[i] + " ";
						}
					}

					if (msg.length > 0) {
						oldChatHTML.apply(chat, [sys, _t, _id, _time, _nick, _tn, _color, 'Получено - ' + msg]);
						chat.scrollDown();
					}
				}

				return true;
			}
            return false;
        }

		chat.chatMsgColor = erExtSystemOptions.chatMsgColor.slice(1);
		
		chat.html = function(sys, _t, _id, _time, _nick, _tn, _color, _text) {
			//console.log(sys, _t, _id, _time, _nick, _tn, _color, _text);
			//chat.html(0, 4, 0, "01:00:22", "Смотритель", "SaintDragon", "666666", "Любая фраза для <b>теста</b>");

			if (_t == CHAT_FLAG_ALIGN) {
				if (erExtOptions.okHelpMessageFilterEnabled && filterOkHelpMessage(_text)) {
					return;
				}
			}

			if (_t == CHAT_FLAG_PRIVATE) {
				if (erExtOptions.CTFilterEnabled && filterCT(_text,_tn)) {
					return;
				}
			}
			
			if (_t == 3) {
				if ((erExtOptions.ERAFFilterEnabled && filterERAF(_text))) {
					return;
				}
			}

			if (erExtOptions.chatOtherUsersMessageColor && _nick != keeperName && _nick != user.name && _nick != reminderName) {
				_color = chat.chatMsgColor;
			}
			
			if (_nick == keeperName) {
				if (_t == CHAT_FLAG_CLAN) {
					if (erExtOptions.sp_chat_shut_up && _text.match(/<u><b color="#AA0000">(.*?)<\/b><\/u>/g)) {
						var exp = /<u><b color="#AA0000">(.*?)<\/b><\/u>/ig;
						_text = _text.replace(exp, '<a href="javascript:$(\'#div_sp_panel input[name=h_name]\').val(\'$1\');chat.showShutPanel();">[Зашить $1]</a>');
						if (soundOptions["sound_sp_shut_up"].sound!='nosound')
						{
							core.playSwfSound(soundOptions["sound_sp_shut_up"].sound);
						}
					}					
					if ( _text.match(/<u><b color="#AA0000">(.*?)<\/b><\/u>/g)) {
						if (soundOptions["sound_sp_shut_up"].sound!='nosound')
						{
							core.playSwfSound(soundOptions["sound_sp_shut_up"].sound);
						}
					}
				}
				
				if (_t == CHAT_FLAG_BATTLELOG) {
					if (erExtOptions.clickable_nicks_on_clan_tournament) {
						_text = modifyClanTournamentMessage(_text);
					}
				}

				if (_t == CHAT_FLAG_PRIVATE || _t == CHAT_FLAG_GROUP) {
					if (erExtOptions.damaged_items_notification_filter && filterBrokenItemNotifications(_text)) {
						return;
					}

                    if (typeof localStorage['fisherRun'] != 'undefined'
                        && localStorage['fisherRun'] == 'true' && erExtDetectFish(sys, _t, _id, _time, _nick, _tn, _color, _text)) {
                        return;
                    }

                    if (typeof localStorage['turquoise_flags_run'] != 'undefined'
                        && localStorage['turquoise_flags_run'] == 'true'  && erExtTurquoiseExplore(_text)) {
                        return;
                    }

                    if (typeof localStorage['silentBattleRun'] != 'undefined' &&
                        localStorage['silentBattleRun'] == 'true' && erExtBattleLogDetect(sys, _t, _id, _time, _nick, _tn, _color, _text)) {
                        return;
                    }

					if (erExtOptions.filterEmptyJailNotfication && filterJailEmptyNotification(_text)) {
						return;
					}

					if (erExtOptions.filterOneTeamIsStrongerMessage && filterOneTeamIsStrongerMessage(_text)) {
						return;
					}

                    if (erExtOptions.filterOneSideFactionsMessage && filterOneSideFactionsMessage(_text)) {
                        return;
                    }
					
                    if (erExtOptions.filterEmptyIslandEnemies && filterEmptyIslandEnemies(_text)) {
                        return;
                    }
					
                    if (erExtOptions.filterAltarRequireBlood && filterAltarRequireBlood(_text)) {
                        return;
                    }

					if (erExtOptions.filterBattleIsClosedMessage && filterBattleIsClosedMessage(_text)) {
						return;
					}

					if (erExtOptions.filterRingOfRendomMessage && filterRingOfRendomNotification(_text)) {
						return;
					}

					if (erExtOptions.filterGoldenHorseShoeMessage && filterGoldenHorseShoeNotification(_text)) {
						return;
					}

					if (erExtOptions.filterEliteTournamentMessage && filterEliteTournamentNotification(_text)) {
						return;
					}

                    if (erExtOptions.filterWaitBattleEndMessage && filterWaitBattleEndMessage(_text)) {
                        return;
                    }
					
					if (erExtOptions.filterBoiZaArtiMessage && filterBoiZaArtiNotification(_text)) {
						return;
					}
					
					filterGildQusetComfication(_text); //инфа о квесте гильдии 
					
					if (erExtOptions.silence_caretaker && (erExtSystemOptions.silence_caretaker_regular!='') && filtersilence_caretaker(_text)) {
						return;
					}

				}

                $.each(soundOptions, function(key) {
                    if (detectForSound(_text, soundOptions[key].detect, soundOptions[key].sound)) {
                        return;
                    }
                });
			} else {
                if (erExtOptions.chatLightMessage) {
                    if (_nick == user.name) {
                        var mid = _id;
                    }
                    else if (_tn.search(user.name) != -1) {
                        _text = "<span style=\"background-color: " + erExtSystemOptions.chatBgColor + "\">" + _text + "</span>";
                        var mid = 0;
                    }
                }

                if (_t == CHAT_FLAG_PRIVATE) {
                    if (typeof localStorage['message_recorder_run'] != 'undefined' && localStorage['message_recorder_run'] == 'true'
                        && _nick != user.name && _nick != reminderName && _nick != autoAnswerName && _nick != pluginName && _nick != zoGuild1 && _nick != zoGuild2 && _nick != zoGuild3 && _nick != zoGuild4 && _nick != zoGuild5) {
                        erExtMessageRecorder(sys, _t, _id, _time, _nick, _tn, _color, _text);
                    }
                }
            }

			if (erExtOptions.forumgoto) {
				_text = modifyForumLink(_text);
			}

			if (erExtOptions.eventRateGiving) {
				if (_nick == keeperName)
				{
					_text = eventMessage(_text);
				}
			}
			
            if (erExtOptions.chatsectors) {
                _text = modifySectors(_text);
            }

            if (erExtOptions.clickablePSmiles) {
                _text = modifyPrivateSmiles(_text);
            }

			

			oldChatHTML.apply(chat, [sys, _t, _id, _time, _nick, _tn, _color, _text]);
			if (erExtOptions.chatLightMessage && mid && mid != 0) $("#n_" + mid).css("background-color", erExtSystemOptions.chatBgColor);
		}
		
		if (erExtOptions.chat_holiday)
		{
			var date = new Date();
			if (date.getMonth()==11)
			{
				if (date.getDate()==6)
				{
					self.chat.html(0, 3, 0, "00:00:00", "Клан ОТСТУПНИКИ", user.name, "000000", "Клан <img src='https://img.ereality.ru/clan/292.gif'><b>Отступники</b> поздравляет Вас с Днём Рождения проекта! :113: Хорошего рандома, добрых монстров и успехов в реале!:373:");
				}
			}
			else
			{
				if (date.getMonth()==0)
				{
					if (date.getDate()==1)
					{
						self.chat.html(0, 3, 0, "00:00:00", "Клан ОТСТУПНИКИ", user.name, "000000", "Клан <img src='https://img.ereality.ru/clan/292.gif'><b>Отступники</b> поздравляет Вас с Новым годом! <img src='https://img.ereality.ru/smile/p/42.gif'>Весёлого настроения, вкусных мандаринов, исполнения желаний и бесконечного счастья!<img src='https://img.ereality.ru/smile/p/108.gif'>");
					}
				}
				else				
					if (date.getMonth()==3)
					{
						if (date.getDate()==1)
						{
							self.chat.html(0, 1, 0, ((date.getUTCHours()+3>9)?(date.getUTCHours()+3):("0"+(date.getUTCHours()+3)))+":"+((date.getMinutes()>9)?(date.getMinutes()):("0"+date.getMinutes()))+":"+((date.getSeconds()>9)?(date.getSeconds()):("0"+date.getSeconds())), "Смотритель", user.name, "000000", "Поздравляем с получением 30 уровня! :100: Теперь Вам доступны новые модули: ПЖА и ПСЖ!");
						}
					}
					/*else				
						if (date.getMonth()==4)
						{
							if ((date.getDay()== "4 4 117")
							{
								ranchsw = Math.floor(Math.random() * (7 - 0 + 1));								
								stwarmessage = ""+((ranchsw==0)?("Да пребудет с тобой сила, юный падаван."):(((ranchsw==1)?("Давным-давно, в далекой-далекой галактике..."):(((ranchsw==2)?("Кто глупее: дурак, или тот, кто за ним следует?"):(((ranchsw==3)?("Заболел я. Старым и слабым стал. Когда 900 лет тебе будет, не сможешь хорошо выглядеть, а?"):(((ranchsw==4)?("Вы теперя должны идти за мной, хорошо? Моя вас предупреждать. Гунганы чужаков не любить. Не ждите теплый приема."):(((ranchsw==5)?("Страх приведет к темной стороне. Страх рождает гнев; гнев рождает ненависть; ненависть — залог страданий. Я сильный страх в тебе ощущаю."):(((ranchsw==6)?("Одно можно утверждать с уверенностью: скоро мы все сильно похудеем."):("-Что-то ты маловат для штурмовика. -Я тут не при чём это всё Laras"))))))))))))));
								ranchsw = Math.floor(Math.random() * (7 - 0 + 1));
								stwarpers = ""+((ranchsw==0)?("Мастер Йода"):(((ranchsw==1)?("R2-D2"):(((ranchsw==2)?("Оби-Ван Кеноби"):(((ranchsw==3)?("Мастер Йода"):(((ranchsw==4)?("Джа-Джа Бинкс"):(((ranchsw==5)?("Мастер Йода"):(((ranchsw==6)?("Хан Соло"):("Палпатин"))))))))))))));
								self.chat.html(0, 1, 0, ((date.getUTCHours()+3>9)?(date.getUTCHours()+3):("0"+(date.getUTCHours()+3)))+":"+((date.getMinutes()>9)?(date.getMinutes()):("0"+date.getMinutes()))+":"+((date.getSeconds()>9)?(date.getSeconds()):("0"+date.getSeconds())), stwarpers, user.name, "000000", stwarmessage);
							}
						}*/
			}
			
		}
		
		

		// антикликер		
		
		var erSendNikVersion = function() {
			$.ajax({
				type: "POST",
				url: "/ajax/json.php",
				data: JSON.stringify({
					"controller": "extension",
					"action": "introduce",
					"params": {
						"name": "erhelpext",
						"version": "versionER"
					}
				}),
				dataType: "json"
			});
		}
		
		//избранные смайлы
		if (erExtOptions.smile_izbron)
		{
			if (erExtSystemOptions.smile_position=="")
			{
				tab_smile = "Для добавления смайлов зайдите в системные настрйки";
			}
			else
			{
				smile_position = ((erExtSystemOptions.smile_position).replace(new RegExp(" ",'g'),'').replace(new RegExp("::",'g'),'|').replace(new RegExp(":",'g'),''));
				smile_position = smile_position.split('|');
				lg = Math.ceil(smile_position.length/5);
				tab_smile = ($('<table>', {'width':'100%', 'cellspacing':'1', 'cellpadding':'1', 'border':'0', 'bgcolor':'#BBBBBB'}));
				for (j=0;j<lg;j++) 
				{
					i=j*5;
					tab_smile2=($('<td>', {'bgcolor':'#DDDDDD', 'width':'20%'}).append($('<img>',{'border':0, 'class':'smile2', 'name':'s'+smile_position[i], 'alt':':'+smile_position[i]+':', 'src':'https://img.ereality.ru/smile/'+(smile_position[i]).replace('p','p/')+'.gif'})));
					for (i=j*5+1;i<j*5+5;i++)
					{
						if (i<smile_position.length)
						{
							tab_smile2 = tab_smile2.add($('<td>', {'bgcolor':'#DDDDDD', 'width':'20%'}).append($('<img>',{'border':0, 'class':'smile2', 'name':'s'+smile_position[i], 'alt':':'+smile_position[i]+':', 'src':'https://img.ereality.ru/smile/'+(smile_position[i]).replace('p','p/')+'.gif'})))
						}
					}
					tab_smile.append($('<tr>', {'align':'center'}).append(tab_smile2));
				}
			}
			$("#td_smilies_btn").parent().before($('<tr>').append($('<td>', {'id':'td_smiliesPl', 'valign':'top', 'style':'display:none;'}).append(tab_smile)));
			$("#smile_btn5").before($("<input>", {'value':'Избранное', 'type':'button', 'class':'butt1', 'id':'smile_btnPl'}));
		}

				

		var erExtSPToolsClass = function() {
			this.menuChatULCss = {
				"margin": "0px",
				"color": "rgb(0, 0, 0)",
				"display": "block",
				"cursor": "pointer",
				"padding": "3px",
				"border": "1px solid rgb(221, 221, 221)",
				"background-color": "transparent"
			};
			
			this.erExtSpPanel = $('#div_sp_panel');
			this.erExtSpPanelHeroInput = this.erExtSpPanel.find('input[name=h_name]');
			this.erExtSpPanelNameQreas = this.erExtSpPanel.find('select[name=qreas]'); 
			this.erExtSpPanelNameRes = this.erExtSpPanel.find('input[name=reas]');
			this.erExtSpPanelMin = this.erExtSpPanel.find('select[name=min]');
			this.erExtSpPanelMinOptions = this.erExtSpPanelMin.find('option').slice(1);
			this.erExtSpPanelWarnButton = $('<button type="button"><span class="ui-button-text">Предупредить</span></button>');
			this.erExtSpPanelRez = $('<input id="rez" type="checkbox">').css({"vertical-align": "bottom", "margin": "0px", "margin-left": "3px", "margin-right": "3px"});
			this.erExtSpPanelGiveLink = $('<button type="button"><span class="ui-button-text">Ссылка</span></button>');
			this.erExtSpPanelLinkSelect = $('<select><option value="">Выберите ссылку</option></select>');
            this.erExtSpPanelWarnReasons = $('<select><option value="">Выберите причину</option></select>');
            this.erExtSpPanelHeroInfo = $('<img src="https://img.ereality.ru/inf.gif" border="0" class="inf">');
			this.qreasTimeMap = {};
			
			var self = this;
			
			this.init = function() {
				self.initMenuChatUl();
				self.initSPMenuChat();
				
				if (erExtOptions.sp_extendable_shutup) {
					self.initSpPanel();			
				}
			};
			
			this.initMenuChatUl = function() {
				var chatUl = $('#menuChat ul');

				if (erExtOptions.sp_context_shutup) {
					chatUl.append($('<li id="shutup">Зашить рот</li>').css(self.menuChatULCss));
				}
				
				if (erExtOptions.sp_context_private_file) {
					chatUl.append($('<li id="sp_ld">Личное дело</li>').css(self.menuChatULCss));
				}
				
				if (erExtOptions.sp_context_warn) {	
					chatUl.append($('<li id="warn">Предупредить</li>').css(self.menuChatULCss));
				}
				
				if (erExtOptions.sp_context_link) {	
					chatUl.append($('<li id="link">Ссылка</li>').css(self.menuChatULCss));
				}
			};
			
			this.initSpPanel = function() { 
				chat.shut_dialog.dialog({height:190, width: 320});
				self.erExtSpPanel.find('select[name=min]').parent().append($('<label>Рец.</label>').prepend(self.erExtSpPanelRez));			
				var panelButtonsSet = self.erExtSpPanel.parent().find('.ui-dialog-buttonset').find('.ui-button-text:contains(\'Личные дела\')').parent().parent();
				
				panelButtonsSet.append('<br/>').append(self.erExtSpPanelWarnButton);
                if (erExtOptions.sp_shut_up_panel_links_giver) {
                    panelButtonsSet.append(self.erExtSpPanelGiveLink);
                }
				
				if (erExtOptions.sp_shut_up_panel_background_color) {
					self.erExtSpPanel.css({"background-color": erExtSystemOptions.shutUpBgColor});
					panelButtonsSet.parent().css({"background-color": erExtSystemOptions.shutUpBgColor});
				}

                self.erExtSpPanelHeroInput.parent().append(self.erExtSpPanelHeroInfo);

				self.initInitLinksRow();
				self.initQreasTimeMap();

                self.initWarningsRow();
				self.initSpPanalListeners();
			};

			this.initWarningsRow = function() {
                self.erExtSpPanelMin.parent().parent()
                    .after(
                        $('<tr><td align="right"><b>Предупреждение</b>:&nbsp;</td></tr>')
                            .append($('<td></td>').append(self.erExtSpPanelWarnReasons))
                    );

                $.each(erExtSystemOptions.sp_shut_up_warnings.split(";"), function() {
                    if (this.length > 0) {
                        var data = this.split('|');

                        if (data[1].length > 0 && data[0].length > 0) {
                            if (data[0].length > 22) {
                                data_text = data[0].slice(0, 22) + "..." ;
                            }
							else
							{data_text = data[0];}

                            self.erExtSpPanelWarnReasons.append($('<option></option>', {'title':data[0], 'value':data[1], text:data_text}));
                        }
                    }
                });
            }

			this.initInitLinksRow = function() {
				self.erExtSpPanel.find('[name=fshut] table').append($('<tr><td align="right"><b>Ссылки:&nbsp</b></td></tr>').append($('<td></td>').append(self.erExtSpPanelLinkSelect)));
			
				$.each(erExtSystemOptions.sp_shut_up_links.split(";"), function() {
					if (this.length > 0) {
						var data = this.split('|');
						
						if (data[1].length > 0 && data[0].length > 0) {
							self.erExtSpPanelLinkSelect.append($('<option></option>', {'title':data[0], 'value':data[1], text:data[0]}));
						}
					} 
				});
			}
			this.initQreasTimeMap = function() {				
				$.each(erExtSystemOptions.sp_qreas_time_map.split(';'), function() {
					var data = this.split(':');
					var qreasId = data[0].trim();
					
					if (qreasId.length > 0 && data[1].length > 0) {
						var times = data[1].split(',');
						
						if (times.length < 1) {
							return;
						}
						
						self.qreasTimeMap[qreasId] = {};						
						for (i in times) {
							var time = times[i].trim();
							
							if (time.length > 0) {
								self.qreasTimeMap[qreasId][time] = true;
							}								
						}
					}
				});
			}
			
			this.initSpPanalListeners = function() {
                self.erExtSpPanelHeroInfo.on("click", function() {
                    var userName = self.erExtSpPanelHeroInput.val();

                    if (userName == "") {
                        return;
                    }

                    window.open('https://www.ereality.ru/~' + userName, '_blank');
                });

				self.erExtSpPanelNameQreas.change(function() {
					self.erExtSpPanelMin.val(0);
					self.erExtSpPanelRez.removeAttr('checked');
					self.erExtSpPanelMinOptions.removeAttr('disabled');
					
					var qreasId = self.erExtSpPanelNameQreas.val();
					if (typeof self.qreasTimeMap[qreasId] != 'undefined') {
						self.erExtSpPanelMinOptions.each(function() {
							var option = $(this);
							
							if (typeof self.qreasTimeMap[qreasId][option.val()] == 'undefined') {
								option.attr('disabled', 'disabled');
							}
						});
					}
				});
				
				self.erExtSpPanelWarnButton.on("click", function() {
					var userName = self.erExtSpPanelHeroInput.val();
					var reason = self.erExtSpPanelWarnReasons.val();
					
					if (userName == "" || reason == "") {
						return;
					}
					
					chat.send("/ch/", {
						action: "post",
						p_type: CHAT_FLAG_PRIVATE,
						p_text: urlencode('[' + userName + '] Предупреждение по ст.' + reason + ' http://forum.ereality.ru/topic183171/page1.html')
					});
					
					chat.send("/ch/", {
						action: "post",
						p_type: CHAT_FLAG_CLAN,
						p_text: urlencode('[' + userName + '] Игрок был предупрежден по ст. ' + reason)
					});
					
				});

                self.erExtSpPanelRez.on("change", function () {
                    if (self.erExtSpPanelNameQreas.val() > -1) {
                        self.erExtSpPanelNameRes.val(self.erExtSpPanelNameQreas.find('option:selected').text() + ' [Рецидив]');
                        self.erExtSpPanelNameQreas.val(-1);
                    }
                });


                if (erExtOptions.sp_shut_up_panel_links_giver) {
                    self.erExtSpPanelGiveLink.on('click', function () {
                        var userName = self.erExtSpPanelHeroInput.val();
                        var link = self.erExtSpPanelLinkSelect.val();
                        var title = self.erExtSpPanelLinkSelect.find(":selected").text();

                        if (userName == "" || link == "") {
                            return;
                        }

                        chat.send("/ch/", {
                            action: "post",
                            p_type: chat.flag,
                            p_text: urlencode('[' + userName + '] ' +((erExtOptions.sp_shut_up_panel_only_links)?(''):(title+': '))+ link)
                        });
                    });
                }
			};	

			this.initSPMenuChat = function() {
				core.wndChat.contextMenu("menuChat", {
					onContextMenu: function(e) {
						var targ = $(e.target);
						self.menu_target = targ;
						var id = targ.attr("id");
						return id && "n_" == id.substr(0, 2) ? !0 : !1
					},
					onShowMenu: function(e, menu) {
						return user.bless_uid < 1 && $("#bless", menu).remove(), menu
					},
					
					bindings: {
						"barter": function() {
							return barter.StartBarter(self.menu_target.text()), !0
						},
						"private": function() {
							return chat.msgPrivate(self.menu_target.text()), !0
						},
						"info": function() {
							return core.infoByName(self.menu_target.text()), !0
						},
						"bless": function() {
							return core.blessFrmShow(user.bless_uid, self.menu_target.text()), !0
						},
						"ignor": function() {
							return chat.ignorAdd(self.menu_target.text()), !0
						},
						"sp_ld": function() {
							window.open('https://www.ereality.ru/ldh/?h_name=' + self.menu_target.text(), '_blank');
							return true;
						},
						'shutup': function() {
							self.erExtSpPanelHeroInput.val(self.menu_target.text());
							
							chat.showShutPanel();
							return true;
						},
						'warn': function() {
							self.erExtSpPanelHeroInput.val(self.menu_target.text());
							chat.showShutPanel();

							return true;
						},
						'link': function() {
							self.erExtSpPanelHeroInput.val(self.menu_target.text());
							chat.showShutPanel();

							return true;
						}
					}
				});
			};
		}
		
		var chatModifierClass = function() {
			this.messageDelay = 2000; // 2 seconds
			this.erExtIntIds = {
				"-1": null,
				"1": null
			};
			this.oldChatSend = chat.send;
			this.erExtCurrIntId = 1;
			this.erExtLastMsgTime = new Date().getTime();
			
			var self = this;
						
			this.init = function() {
				chat.erExt = {
					msgQueue: []
				}
				
				chat.send = self.chatSend;
			};
			
			this.chatSend = function($path, $params) {
				if ($params.action == "post") {				
					if (chat.erExt.msgQueue.length > 0) {
						chat.erExt.msgQueue.push({
							"path": $path,
							"params": $params
						});
					}
					else {
						var time = new Date().getTime();
						if (time - self.erExtLastMsgTime > self.messageDelay + 100) {
							self.erExtLastMsgTime = time;
							self.oldChatSend.apply(chat, [$path, $params]);
						} 
						else {
							self.erExtCurrIntId *= -1;
							
							chat.erExt.msgQueue.push({
								"path": $path,
								"params": $params
							});
							
							self.erExtIntIds[self.erExtCurrIntId] = self.startChatCheker(self.erExtCurrIntId);
						}					
					}
				}
				else {
					self.oldChatSend.apply(chat, [$path, $params]);
				}
			};
			
			this.startChatCheker = function (intervalID) {				
				return setInterval(function() {
					self.erExtChecker(intervalID);
				}, self.messageDelay);
			};
			
			this.erExtChecker =	function (intervalID) {
				if (chat.erExt.msgQueue.length > 0) {
					var msg = chat.erExt.msgQueue.shift();
					
					if (chat.erExt.msgQueue.length == 0) {
						clearInterval(self.erExtIntIds[intervalID]);						
					}
					
					self.oldChatSend.apply(chat, [msg.path, msg.params]);					
					self.erExtLastMsgTime = new Date().getTime();
				}				
			};
		}
		
		var chatTradeFlooderClass = function() {
			this.phrases = [];
			this.phrasesKey = 0;
			
			var self = this;
			
			this.init = function() {
				self.preparePhrases();
				self.initPraseKey();
				self.runTimer();
			}
			this.initPraseKey = function() {
				var key = localStorage["chat_trade_flooder_key"];
				
				if (typeof key == "undefined") {
					key = 0;
				}
				
				self.key = key;
			}
			
			this.runTimer = function() {
				if (self.phrases.length == 0) {
					return;
				}

				setInterval(function() {
					chat.send("/ch/", {
						action: "post",
						p_type: CHAT_FLAG_TRADE,
						p_text: self.getPrase()
					});
				}, 1000 * 60 * 10);
			}
			
			this.getPrase = function() {
				if (typeof self.phrases[self.phrasesKey] == "undefined") {
					self.phrasesKey = 0;
				}
				
				var prase = self.phrases[self.phrasesKey];				
				self.phrasesKey++;
				
				localStorage["chat_trade_flooder_key"] = self.phrasesKey;
				
				return prase;
			}
			
			this.preparePhrases = function() {
				var phrases = erExtSystemOptions.trade_flooder_phrases.split("|");
				
				for (i in phrases) {
					var phrase = phrases[i].trim().slice(0, 244);
					if (phrase.length > 0)
					{
						phrase = "ERАФ "+phrase;
						self.phrases.push(phrase);
					}
				}
			}
		}
		
		$(document).ready(function() {
			setTimeout(function() {
                var isSp = parseInt(user.c_id, 10) <= 10 && parseInt(user.c_id, 10) > 0;

                if (erExtOptions.alternative_chat_send ||
                    erExtOptions.trade_flooder_active ||
                    (isSp && erExtOptions.sp_extendable_shutup)) {
                    new chatModifierClass().init();
                }

				if (isSp && erExtOptions.sp_extendable_shutup) {
					new erExtSPToolsClass().init();
				}

                if (erExtOptions.trade_flooder_active) {
                    new chatTradeFlooderClass().init();
                }	


				setTimeout(function() {erSendNikVersion(); localStorage['NikVersion']='versionER';}, 30000);


			}, 1500);
		});

		if (erExtOptions.forumgoto) {			
			messenger.PrintMessage = function (Message, PrintReply, isClanOrAlign) { 
				Message['text'] = modifyForumLink(Message['text']);
				Message['caption'] = modifyForumLink(Message['caption']);
				
				oldPrintMessage.apply(messenger, [Message, PrintReply, isClanOrAlign]);
			}
		}	
		
		if (erExtOptions.eventRateGiving) {			
			messenger.PrintMessage = function (Message, PrintReply, isClanOrAlign) { 
				Message['text'] = eventMessage(Message['text']);
				//Message['caption'] = modifyForumLink(Message['caption']);
				
				oldPrintMessage.apply(messenger, [Message, PrintReply, isClanOrAlign]);
			}
		}	
		
		if (erExtOptions.fastex) {
			var oldTemplatesRender = templates.render;
			var exitLink = $("<a>", {title:"Выход из игры", href:"https://www.ereality.ru/exit.php", onfocus:"this.blur();", text:"[X]"});
			
			$(".NickName center").prepend(exitLink);
			
			templates.render = function(templateId, data, onRender) { 
				var renderedTamplate = oldTemplatesRender.apply(templates, [templateId, data, onRender]);

				if (templateId != "main/header.template-HealthBlock") {
					return renderedTamplate;
				}

				return renderedTamplate.replace('<span class="NickName"><center>', '<span class="NickName"><center>' + exitLink[0].outerHTML);
			}
		}
		
	/*	if (erExtOptions.fastex) {
			var oldTemplatesRender3 = templates.render;
			var hillpiratesclick = function () {
				console.log(123);
				$("#hillpirates").on("click", function()
				{
					alert("hill");
					console.log("hill");
				});
				console.log($("#hillpirates").lenght);
			};
/*			action: "mapShipCrewMembersHealUp"
client: 1
controller: "map"
params: {id: 620704}
id: 620704

			html = '<input type="button" value="Хилл" id="hillpirates" name="hillpirates" onclick="hillpiratesclick">';
			templates.render = function(templateId, data, onRender) { 
				var renderedTamplate = oldTemplatesRender3.apply(templates, [templateId, data, onRender]);

				if (templateId != "main/map.template-Map") {
					return renderedTamplate;
				}

				return renderedTamplate.replace('<div class="heroShips-block-row">Трюм:', '<div class="heroShips-block-row">'+html+'Трюм:');
			}
		}*/

		if (erExtOptions.addMoney) {
		  var oldTemplatesRender2 = templates.render;
	    
		    templates.render = function(templateId, data, onRender) { 
				var renderedTamplate = oldTemplatesRender2.apply(templates, [templateId, data, onRender]);

				if (templateId != "main/header.template-MoneyBlock") {
					return renderedTamplate;
				}
			br = 0; br2=0;
			if((erExtOptions.show_money_piastres) && (!(user.place2 >= 24 && user.place2 <= 30))) {br=br+1;} 
			if(erExtOptions.show_money_dust) {br=br+1;} 
			if(erExtOptions.show_money_supplies) {br=br+1;} 
			if(erExtOptions.show_money_authority) {br=br+1;} 
			//if(erExtOptions.show_money_solids) {br=br+1;} 
			if(erExtOptions.show_money_xenoteks) {br=br+1;} 
			if(erExtOptions.show_money_crystals) {br=br+1;}
		  html2 = "<div class='SGW fontSize_11px bold color_111 Tahoma' style='text-align:center; bottom:"+(br>5?8:0)+"px;'>";
		  html2 = html2 + "<div style='text-align:center;'>";
			//пиастры
			if ((erExtOptions.show_money_piastres)&&(typeof user.money.piastres != 'undefined')) if (!(user.place2 >= 24 && user.place2 <= 30)) {html2 = html2 + "<span id='ext_piastres' title='Пиастры "+user.money.piastres+"' class='mainTooltip Pad' style='margin-right: 10px;background: url(res/piastres.png) no-repeat;    display: inline-block;padding-left: 19px; line-height: 16px;'>"+user.money.piastres+"</span>"; br2=br2+1;} else  {html2 = html2 + "<span id='ext_piastres' title='Серебро "+user.money.silver+"' class='mainTooltip Pad' style='margin-right: 10px;background: url(res/SilverIcon.png) no-repeat;    display: inline-block;padding-left: 19px; line-height: 16px;'>"+user.money.silver+"</span>"; br2=br2+1; }
			//ангельская пыль
			if ((erExtOptions.show_money_dust)&&(typeof user.money.dust != 'undefined')) {html2 = html2 + "<span id='ext_dust' title='Пыль ангелов "+user.money.dust+"' class='mainTooltip Pad' style='margin-right: 10px;    background: url(res/dust.png) no-repeat;display: inline-block;padding-left: 19px; line-height: 16px;'>"+user.money.dust+"</span>"; br2=br2+1;}
			//запасы
			if ((erExtOptions.show_money_supplies)&&(typeof user.money.supplies != 'undefined')) {html2 = html2 + "<span id='ext_supplies' title='Запасы "+user.money.supplies+"' class='mainTooltip Pad' style='margin-right: 10px;    background: url(res/supplies.png) no-repeat;display: inline-block;padding-left: 21px; line-height: 16px;'>"+user.money.supplies+"</span>"; br2=br2+1;}
			if ((br>5)&&(br2==3)) {html2 = html2 + "<br>"};
			//авторитет
			if ((erExtOptions.show_money_authority)&&(typeof localStorage["ext_authority_l"] != 'undefined')) {html2 = html2 + "<span id='ext_authority' title='Авторитет "+localStorage["ext_authority_l"]+"' class='mainTooltip Pad' style='margin-right: 10px;    background: url(res/authority.png) no-repeat;display: inline-block;padding-left: 19px; line-height: 16x;'>"+localStorage["ext_authority_l"]+"</span>"; br2=br2+1;}
			if ((br>5)&&(br2==3)) {html2 = html2 + "<br>"};
			//солиды
			/*if ((erExtOptions.show_money_solids)&&(typeof localStorage["ext_solids_l"] != 'undefined')) {html2 = html2 + "<span id='ext_solids' title='Солиды "+localStorage["ext_solids_l"]+"' class='mainTooltip Pad' style='margin-right: 10px;background: url(res/solids.png) no-repeat;    display: inline-block;padding-left: 19px; line-height: 16px;'>"+localStorage["ext_solids_l"]+"</span>"; br2=br2+1;}
			if ((br>5)&&(br2==3)) {html2 = html2 + "<br>"};*/
			//ксенотеки
			if ((erExtOptions.show_money_xenoteks)&&(typeof localStorage["ext_xenoteks_l"] != 'undefined')) {html2 = html2 + "<span id='ext_xenoteks' title='Ксенотеки "+localStorage["ext_xenoteks_l"]+"' class='mainTooltip Pad' style='margin-right: 10px;    background: url(res/xenoteks.png) no-repeat;display: inline-block;padding-left: 19px; line-height: 16px;'>"+localStorage["ext_xenoteks_l"]+"</span>"; br2=br2+1;}
			//кристаллы
			if ((erExtOptions.show_money_crystals)&&(typeof localStorage["ext_crystals_l"] != 'undefined')) {html2 = html2 + "<span id='ext_crystals' title='Кристаллы упорства "+localStorage["ext_crystals_l"]+"' class='mainTooltip Pad' style='margin-right: 10px;    background: url(res/crystals.png) no-repeat;display: inline-block;padding-left: 19px; line-height: 16px;'>"+localStorage["ext_crystals_l"]+"</span>"; br2=br2+1;}
		      html2 = html2 + "</div>";
		  html2 = html2 + "</div>";
		    $('.TopBar_right').append($(html2));
				return renderedTamplate.replace('<div class="tacticalMoney">',html2 + '<div class="tacticalMoney">');
			}			
		}
		
		
		
		// Инфа о глобальных событиях
		if (erExtOptions.global_info) {			
			var globalTd = $("<td></td>").css({width: "20px"})
				.on("click", function() {
					//$.post("https://www.ereality.ru/ajax/global_event/", '<request action="showNextPvpEvents" />', function (response) {
					$.post("https://www.ereality.ru/ajax/global_event/", '<request action="showNextGlobalEvents" />', function (response) {
						window.chat.msgSystem(keeperName, $("msg", response).text())	
					});
				});

			var globalImg = $("<img>").attr("src", erExtImages.globalEventImage).css({cursor: "pointer", width: "20px", height: "30px"});
			var globalLink = $("<a href=\"#\" title=\"Глобальные события\"></a>");
			globalTd.append(globalLink.append(globalImg));
			$("img[src*='ch1_13.jpg']").attr("onclick","window.open(\"/event/global/\")");
				
			
			
			$("#td_dyn").after(globalTd);
		}
		
		//события ОК
		var OK_events = {"1":"Дальнозоркость",
             "2":"Внезапное воодушевление",
             "3":"Кровавая лотерея",
             "4":"Старые дрожжи",
             "5":"Сила в единстве",
             "6":"В мире животных",
             "8":"БлагоТворительность",
             "9":"Шутка Мидаса",
             "10":"Охотники за головами",
             "11":"Свидетели избиения",
             "12":"Кровожадное воображение",
             "13":"Любовный треугольник",
             "14":"Кровожадное противостояние",
             "15":"Кладоискатели ОКлайн",
             "16":"Ищи-свищи",
             "17":"Час открытых боёв",
             "18":"Тет-а-тет",
             "19":"ОК Шрёдингера",
             "20":"Ограниченное предложение",
             "21":"Горячая десятка",
             "22":"Портал 2",
             "23":"Жажда скорости",
             "24":"Септопад" };
		var OK_events_descr = {"1":"В боях нельзя применять свитки",
					 "2":"На час 25% персонажей на острове получают ауру “Внезапный удар”, 25%  - ауру “Воодушевление",
					 "3":"В боях происходят случайные события (как в хаотических боях)",
					 "4":"Сила свитков и зелий в боях в 2 раза выше",
					 "5":"Значение аур “Загнанный в угол”, “Командный дух” и “Страх одиночества” увеличивается в 2 раза",
					 "6":"Длительность работы питомца в бою в 2 раза больше",
					 "8":"Можно благословлять персонажей на ОК, находящихся в бою",
					 "9":"С шансом 25% при убийстве персонажа можно получить 0.5 золота, но не более 3 золота за событие",
					 "10":"За каждое убийство персонаж получает награду серебром",
					 "11":"За участие в бою на ОК дают 1 пвп балл",
					 "12":"Кровожадное воображение - За каждое убийство игрок получает на 2 пвп балла больше",
					 "13":"ПВП-опыт, получаемый тремя случайными фракциями за убийства увеличивается на 3",
					 "14":"ПВП-опыт, получаемый двумя случайными фракциями за убийства увеличивается на 4",
					 "15":"На ОК появились 3 видимых всем сундука",
					 "16":"На Острове Крови появились 5 скрытых индивидуальных сундуков",
					 "17":"Все бои открытые без возможности изменения",
					 "18":"Все бои закрытые без возможности изменения",
					 "19":"Тип боя определяется в момент нападения случайно, без возможности изменения",
					 "20":"В бой могут вмешиваться только те персонажи, чей уровень не превышает максимальный уровень персонажа в этом бою",
					 "21":"В бою может быть не более 10 персонажей (живых или мёртвых)",
					 "22":"На ОК появляется ещё 2 независимых портала коварства",
					 "23":"Время перемещения на ок становится равным 1 секунде по прямой и 2 секундам по диагонали",
					 "24":"Во время события каждые 5 минут на ок появляется септикон" };          
					 
		function unixHour(k) {var serverTime = new Date() 
			var serverTime = new Date();
			var serverTimeHours = new Date(serverTime.getFullYear(),serverTime.getMonth(),serverTime.getDate(),serverTime.getHours()+k);
			return Math.round(serverTimeHours.getTime() / 1000);
		}
		 
		function createEventPic(number) {
			return `<img src="https://img.ereality.ru/align/calendar/${number}.png" style="margin-top:3px;width: 30px;cursor:pointer;" class="pluginbuildingMainTooltip">`;
		}
		 
		var pluginupdateBuildingMainTooltip = function() {
				$(".pluginbuildingMainTooltip").each((index,elem)=>{ind=elem.src.replace(/\D+/g,"");elem.title=`${OK_events[ind]} - ${OK_events_descr[ind]}`});
				$(".pluginbuildingMainTooltip").on("click",()=>{ind=event.target.src.replace(/\D+/g,"");$("#chat_msg").val(OK_events_descr[ind]);});
				$(".pluginbuildingMainTooltip[title]").tooltip2({
					track: !0,
					delay: 0,
					showURL: !1,
					showBody: " - ",
					top: 5,
					left: 8,
					width: "auto"
				})
			}
		 
					 
		var oldscrollDown = chat.scrollDown;
		chat.scrollDown = function() {
			oldscrollDown.apply(chat,arguments);
			pluginupdateBuildingMainTooltip();
		}
		 
		function getOkEvents() {
		$.get("https://api.ereality.ru/pvp_events_schedule.txt", function (response) {
			var resp = response.schedule;
			if (resp[unixHour(0)]!=undefined) {
				var event1 = resp[unixHour(0)].map((value) => {
				return createEventPic(value)}).join("")
			} else var event1 = " Нет событий "
			if (resp[unixHour(1)]!=undefined) {
				var event2 = resp[unixHour(1)].map((value) => {
				return createEventPic(value)}).join("")
			} else var event2 = " Нет событий "
			window.chat.msgSystem("Оповещение плагина","<span style='color: #FF0000'><b>События на ОК: </b></span><span style='color: #009900'><b>Сейчас: </b></span> "+ event1+"   <span style='color: #3366FF'><b>В следующем часу : </b></span> "+event2+"   <a style='color: #000000' href='http://order.ereality.ru/zhen4ek/calendar_ok.php' target='_blank'> Календарь ОК</a>");
			Now_Dat = new Date(new Date().getTime() + (3 + ((new Date()).getTimezoneOffset() / 60)) * 3600 * 1000);
			Start_Dat = new Date(2017, 7, 22, 0, 0, 0, 0);
			boi_sob = new Array ("<b title='Эффект от зелий в бою в 4 раза выше. Эффект от свитков в бою в 3 раза выше'>Старые дрожжи</b>","<b title='Сила призывных ботов зависит от прокачки заклинателя призывающего и равна половине силы бота, как если бы бот был призван из храма фракции'>Большой брат</b>","<b title='При смерти персонажа в бою на его место призывается 3 случайных бота (из тех, которых можно призвать) уровня умершего персонажа. Если умерший персонаж 22 уровня, то при его убийстве будут призваны боты 21 уровня. Ботов нельзя изгнать и они будут биться, пока не умрут'>Атака клонов</b>","","<b title='Продолжительность действия эффектов от питомца в хаоте в 2 раза больше. Использование питомца в хаоте не расходует сытость'>В мире животных</b>","<b title='Каждый раунд в хаоте минимум на одного персонажа накладывается эффект случайного события. Сила хаотических событий увеличивается в 2 раза'>Мгновенная лотерея</b>","<b title='В хаоты можно вмешиваться, как в текущие поединки на ОК (через бои-текущие. хаот виден на весь сервер, а не только на определённом секторе). Вмешаться могут только персы, подходящие по уровню. Нельзя вмешаться за команду, чья численность превышает численность врагов. Макс.кол-во персов в бою (живых и мёртвых) не может быть >10'>Последний герой</b>","","<b title='При старте хаота все персонажи получают ауру или антиауру, увеличивающую или уменьшающую параметры и модификаторы (по аналогии с боями на ОК) со случайным значением от -30% до 30%, с шагом в 2%. Значение ауры отдельное для каждого персонажа'>Пан или пропал</b>","<b title='Каждый 10-й раунд в бою моментально умирает 1 случайный живой персонаж (или призывной бот). При этом все его оставшиеся ХП идут в расчёт призового фонда'>Русская рулетка</b>","<b title='Каждый умерший персонаж через 2 раунда возрождается с полным ЖМЭ. Возродиться можно 1 раз за бой'>Доктор хаос</b>","","<b title='Эффект от зелий в бою в 4 раза выше. Эффект от свитков в бою в 3 раза выше'>Старые дрожжи</b>");
			mir_sob = new Array ("<b title='Если счётчик хаотов меньше 16, то за проигрыш персонаж получает 0 серебра, но счётчик при этом не прибавляется. Если счётчик больше 15, то расчёт серебра происходит по обычным правилам. В этот день в боях нельзя сдаться'>Не бей лежачего</b>","<b title='Счётчик хаотов до порезки равен 30'>Продолжение банкета</b>","","<b title='За убитого противника 1 случайный персонаж (не важно, жив он или мёртв) из команды убийцы получает золото, равное (ур.убитого/30). Это значит, что если в вашей команде кто-то убил персонажа, то у вас есть шанс получить золото, даже если команда проиграла или сами вы никого не убили.  Не дают золото, если счётчик хаотов больше 15 (другой персонаж для получения золота при этом не выбирается)'>Шутка Мидаса</b>","<b title='Призовой фонд хаота увеличивается в 2 раза. Максимальный выигрыш за хаот увеличивается в 2 раз'>Двойной угар</b>","","<b title='За победу в хаоте  дают 6 ОР (помимо серы). Не дают, если счётчик хаотов больше 15. Выше 360 ОР подняться не могут даже при получении их за хаот'>Слёзы колонизатора</b>","<b title='За победу в хаоте персонаж получает пвп-баллы и пвп-опыт, в размере (сумма рангов всех персонажей хаота/кол-во участников хаота). Пвп-баллы не идут в норму автоизгнания. Пвп дают даже внефракционным персам. Не дают пвп баллы, если счётчик хаотов больше 15'>Кровожадное воображение</b>","","<b title='За убийство любого персонажа (без влияния побед и поражений) персонаж получает серебро в размере ур.убитого^2 , но не более, чем (ур.персонажа^2)*10 за сутки'>Охотники за головами</b>","<b title='Если счётчик хаотов меньше 16, то за проигрыш персонаж получает 0 серебра, но счётчик при этом не прибавляется. Если счётчик больше 15, то расчёт серебра происходит по обычным правилам. В этот день в боях нельзя сдаться'>Не бей лежачего</b>","","<b title='Счётчик хаотов до порезки равен 30'>Продолжение банкета</b>","<b title='За убитого противника 1 случайный персонаж (не важно, жив он или мёртв) из команды убийцы получает золото, равное (ур.убитого/30). Это значит, что если в вашей команде кто-то убил персонажа, то у вас есть шанс получить золото, даже если команда проиграла или сами вы никого не убили.  Не дают золото, если счётчик хаотов больше 15 (другой персонаж для получения золота при этом не выбирается)'>Шутка Мидаса</b>","","<b title='Призовой фонд хаота увеличивается в 2 раза. Максимальный выигрыш за хаот увеличивается в 2 раз'>Двойной угар</b>","<b title='За победу в хаоте  дают 6 ОР (помимо серы). Не дают, если счётчик хаотов больше 15. Выше 360 ОР подняться не могут даже при получении их за хаот'>Слёзы колонизатора</b>","","<b title='За победу в хаоте персонаж получает пвп-баллы и пвп-опыт, в размере (сумма рангов всех персонажей хаота/кол-во участников хаота). Пвп-баллы не идут в норму автоизгнания. Пвп дают даже внефракционным персам. Не дают пвп баллы, если счётчик хаотов больше 15'>Кровожадное воображение</b>","<b title='За убийство любого персонажа (без влияния побед и поражений) персонаж получает серебро в размере ур.убитого^2 , но не более, чем (ур.персонажа^2)*10 за сутки'>Охотники за головами</b>","","<b title='Если счётчик хаотов меньше 16, то за проигрыш персонаж получает 0 серебра, но счётчик при этом не прибавляется. Если счётчик больше 15, то расчёт серебра происходит по обычным правилам. В этот день в боях нельзя сдаться'>Не бей лежачего</b>");
			boi_id = Math.floor((Now_Dat - Start_Dat)/(1000*24*60*60))%12;
			mir_id = Math.floor((Now_Dat - Start_Dat)/(1000*24*60*60))%21;
			if (boi_sob[boi_id]=="") {if (mir_sob[mir_id]=="") {sob_seg = 'нет событий';} else {sob_seg = mir_sob[mir_id];} } else {if (mir_sob[mir_id]=="") {sob_seg = boi_sob[boi_id];} else {sob_seg = boi_sob[boi_id] + " и "+ mir_sob[mir_id];} }
			if (boi_sob[boi_id+1]=="") {if (mir_sob[mir_id+1]=="") {sob_zavt = 'нет событий';} else {sob_zavt = mir_sob[mir_id+1];} } else {if (mir_sob[mir_id+1]=="") {sob_zavt = boi_sob[boi_id+1];} else {sob_zavt = boi_sob[boi_id+1] + " и "+ mir_sob[mir_id+1];} }
			window.chat.msgSystem("Оповещение плагина","<span style='color: #FF0000'><b>Хаотические события: </b></span><span style='color: #009900'><b>Сегодня: </b></span> "+ sob_seg+"   <span style='color: #3366FF'><b>Завтра: </b></span> "+ sob_zavt);
		},"json");
		}
		 
		$('[title="Глобальные события"]').on("click",getOkEvents);
		
		if (erExtOptions.userlistactiveitems || soundOptions["sound_zavod"].sound != "nosound") {
			var oldBuildPlayersTable = battle.buildPlayersTable;
			var oldBattleLoad = battle.load;
			
			battle.load = function() {
				oldBattleLoad.apply(battle,arguments);
				
				battle.FirstFactorySound = true;
			}
			
			battle.buildPlayersTable = function() {
				oldBuildPlayersTable.apply(battle);
				
					if (erExtOptions.userlistactiveitems) {
						$.each($("#div_battle span[class*=bp]"), function(num, val) {
							(val.id!="")&&val.setAttribute("name", battle.players[val.id.substr(1)].name);
						})
					}

				if (soundOptions["sound_zavod"].sound != "nosound" && users.oSpanLocation.text().search("Цех ") == 0 && battle.FirstFactorySound) {
					battle.FirstFactorySound = false;
					core.playSwfSound(soundOptions["sound_zavod"].sound);
				}
			}
		}


        var OldBattleXmlProc = battle.xmlProc;

        battle.xmlProc = function (XML) {
            OldBattleXmlProc.apply(battle, [XML]);

            try {
                var responseLogs = $(XML.getElementsByTagName("response")).find('logs');

                if (responseLogs.attr('uid') == battle.round) {
                    responseLogs.find('skip').each(function () {
                        var p1 = $(this).attr('p1').split(';');

                        if (p1[0] == user.name && core.mur_soundOptions['sound_battle_skip_turn']['sound'] != 'nosound') {
                            core.playSwfSound(core.mur_soundOptions['sound_battle_skip_turn']['sound']);
                        }
                    });

                    responseLogs.find('idle').each(function() {
                        var p1 = $(this).attr('p1').split(';');

                        if (p1[0] == user.name) {
                            responseLogs.find('auto').each(function() {
                                var p1 = $(this).attr('p1').split(';');

                                if (p1[0] == user.name && core.mur_soundOptions['sound_battle_auto_end_turn']['sound'] != 'nosound') {
                                    core.playSwfSound(core.mur_soundOptions['sound_battle_auto_end_turn']['sound']);
                                }
                            });
                        }
                    })
                }
            } catch (e) {
            }

        }
		
	}).toString();
	
	formatSmilesString = formatSmilesString.replace("soundOptionsReplace", '(' + JSON.stringify(defaultConfig.soundOptions) + ')').replace(new RegExp("versionER",'g'), window.versionER)
		.replace("optionsReplace", '(' + JSON.stringify(myoptions) + ')')
		.replace("erExtImagesReplace", '(' + JSON.stringify(erExtImages) + ')')
		.replace("erExtSystemOptionsReplace", '(' + JSON.stringify(mergedSystemOptions) + ')')
		.replace("res/piastres.png", kango.io.getResourceUrl('res/piastres.png'))
		.replace("res/SilverIcon.png", kango.io.getResourceUrl('res/SilverIcon.png'))
		.replace("res/dust.png", kango.io.getResourceUrl('res/dust.png'))
		.replace("res/supplies.png", kango.io.getResourceUrl('res/supplies.png'))
		.replace("res/solids.png", kango.io.getResourceUrl('res/solids.png'))
		.replace("res/authority.png", kango.io.getResourceUrl('res/authority.png'))
		.replace("res/xenoteks.png", kango.io.getResourceUrl('res/xenoteks.png'))
		.replace("res/crystals.png", kango.io.getResourceUrl('res/crystals.png'));		
	
	script += "(" + formatSmilesString + ")();";



	 //Добавляем функцию для смайликов
	 if (myoptions.first_smile_izbron)
		{
		 script += "(" +
			(function() {
					
						$('#btn_smile').click(function(){ $('#td_smilies1').hide(); setTimeout(function(){ $('#smile_btnPl').click(); },1)});
				

			}).toString() + ")();";	
		}
		else
		{
		 script += "(" +
			(function() {
						$('#btn_smile').click(function(){$('#td_smiliesPl').hide(); });
			}).toString() + ")();";
		}

			
		script += "(" +
			(function() {					

					$('#td_smilies_btn input').click(function()
					{
						var obj= $(this);
						var idtd = obj.attr('id').split('smile_btn')[1];
						$('#div_smilies td[id^=td_smilies]').not('#td_smilies_btn').hide();
						$("#td_smilies"+idtd).prop("style","height: 550px; display: table-cell;");
					});					

			}).toString() + ")();";
	   //////


	//Добавляем кликабельность секторов в Дневнике Квестов
	if (myoptions.questsectors) {
		script= script+ "(" +
		(function(){
		var zxzx4=questDiary.onRecvXML;
		questDiary.onRecvXML=function(){
		var res = arguments[0].getElementsByTagName("quest");
		for(i=0; i<res.length; ++i) 
		{
			res[i].textContent =res[i].textContent.replace(/(\d{1,3})[:\-](\d{1,3})/ig,"<a href=\"javascript:(function(){chat.myshowSec($1,$2);})();\">$&</a>");
		}
		zxzx4.apply(questDiary,arguments);
		return ;
		}
		}).toString()
		+ ")();"; 
	}


		// ПКМ по локации вызывает меню с картами ОВЛ и ОПП
		if (myoptions.menu_maps) {
			if (myoptions.menu_maps_goto)
			{
				script += "(" +
					(function() {
					$(document.body.lastChild).after($("<div>", {'id':"m_mur_mapsmenu", 'class':"contextMenu", 'style':"visibility: hidden;position:absolute;"}).append($('<ul>', {'class':"textM"}).append(
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/sidzoku.ru/maps/ovl/", 'target':"_blank", text:'Карта ОВЛ'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/sidzoku.ru/maps/opp/", 'target':"_blank", text:'Карта ОПП'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/sidzoku.ru/maps/ok/", 'target':"_blank", text:'Карта ОК'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/maps/ok/", 'target':"_blank", text:'Карта ОК'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/boat-trips/map/turquoise-island", 'target':"_blank", text:'Карта БЗО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/boat-trips/map/green-island", 'target':"_blank", text:'Карта ЗЛО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/underground/map", 'target':"_blank", text:'Карта шахт'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/maps/newIsland/", 'target':"_blank", text:'Затерянные острова'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/infoGuild/", 'target':"_blank", text:'Гильдии МП3'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/er-help.ru/scripts/map_bzo.php", 'target':"_blank", text:'Карта БЗО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))),
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/er-help.ru/scripts/map_zlo.php", 'target':"_blank", text:'Карта ЗЛО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))),
					$('<li>').append($("<a>", {'href':"https://www.ereality.ru/goto/er-help.ru/scripts/map_shaxt.php", 'target':"_blank", text:'Карта шахт'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))))));
					$("#a_users_loc").contextMenu("m_mur_mapsmenu", {});
				}).toString() + ")();";
			}
			else		
				{
				script += "(" +
					(function() {
					$(document.body.lastChild).after($("<div>", {'id':"m_mur_mapsmenu", 'class':"contextMenu", 'style':"visibility: hidden;position:absolute;"}).append($('<ul>', {'class':"textM"}).append(
					$('<li>').append($("<a>", {'href':"http://sidzoku.ru/maps/ovl/", 'target':"_blank", text:'Карта ОВЛ'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"http://sidzoku.ru/maps/opp/", 'target':"_blank", text:'Карта ОПП'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"http://sidzoku.ru/maps/ok/", 'target':"_blank", text:'Карта ОК'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/73.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/maps/ok/", 'target':"_blank", text:'Карта ОК'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/boat-trips/map/turquoise-island", 'target':"_blank", text:'Карта БЗО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/boat-trips/map/green-island", 'target':"_blank", text:'Карта ЗЛО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://usercp.ereality.ru/services/underground/map", 'target':"_blank", text:'Карта шахт'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/maps/newIsland/", 'target':"_blank", text:'Затерянные острова'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"http://order.ereality.ru/services/infoGuild/", 'target':"_blank", text:'Гильдии МП3'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/1.gif"}))),
					$('<li>').append($("<a>", {'href':"https://er-help.ru/scripts/map_bzo.php", 'target':"_blank", text:'Карта БЗО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))),
					$('<li>').append($("<a>", {'href':"https://er-help.ru/scripts/map_zlo.php", 'target':"_blank", text:'Карта ЗЛО'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))),
					$('<li>').append($("<a>", {'href':"https://er-help.ru/scripts/map_shaxt.php", 'target':"_blank", text:'Карта шахт'}).prepend($("<img>", {'src':"https://img.ereality.ru/clan/292.gif"}))))));
					$("#a_users_loc").contextMenu("m_mur_mapsmenu", {});
				}).toString() + ")();";
			}
		}

// Информация о бое (Ауры,Урон,Убийства)
		if (myoptions.battleInfo) {
			script += "(" +
				(function() {
				var Old_buildPlayersTable = battle.buildPlayersTable;

				battle.buildPlayersTable = function() {
					Old_buildPlayersTable.apply(battle);
					if ($("#mur_battle_info").length == 0) {
						var html = "" +
							"<div  class=\"textS\" id=\"mur_battle_info\" style=\"color: #646464\"  align=\"center\">" +
							" <strong><span id=\"mur_auras\"></span><span id=\"mur_dmg\"></span><span id=\"mur_kill\"></span></strong>" +
							"</div>";
						$(".fight_contr").append($(html));
					}
					if (battle.team > 1) {
						var aura1 = battle.current_pvp_auras[1];
						var aura2 = battle.current_pvp_auras[0];
					} else {
						var aura1 = battle.current_pvp_auras[0];
						var aura2 = battle.current_pvp_auras[1];
					}
					if (battle.type == 4) {
						$("#mur_auras").text("    Ауры: " + aura1 + "%  " + aura2 + "%  ");
					} else {
						$("#mur_auras").text("");
					}
					$("#mur_dmg").text("   Урон: " + $("#span_stat_dc").text() + "   ");
					$("#mur_kill").text("   Убито: " + $("#span_stat_kc").text() + "   ");
					return;
				}
			}).toString() + ")();";
		}
		

// Хоткеи ALT+12345QWE
if (myoptions.keyalt) {
		script= script+ "(" +
	(function(){
		var zxzx8=core.onKeyUp;
		var HSets = []; // Список сохраненных комплектов
		$.post("/ajax/json.php",
				'{"controller":"hero","action":"panel","params":{"argv":{"inventory":true}},"client":1}',
				function(response) {
				console.log(response.response);
						for(prop in response.response.sets) if (response.response.sets.hasOwnProperty(prop)) {						
							HSets.push(prop);
						 }
				},
				"json");
	core.onKeyUp=function(event){
			event = (window.event || event);
			if ((event.keyCode == 112)&&(battle.bstatus==0)) {    // F1 
						$.each(battle.items, function(num, val) {
							if ((val.img == "draftroll.png") || (val.img == "summonscroll.jpg") || (val.img == "ejectroll.png")) battle.selectItem(battle.items[num].uid)
						})
			}
			if ((event.keyCode == 113)&&(battle.bstatus==0)) {    // F2 
						$.each(battle.items, function(num, val) {
							if ((val.img == "draftroll.png") || (val.img == "summonscroll.jpg") || (val.img == "ejectroll.png")) battle.selectItem(battle.items[num].uid)
						})
			}
			if ((event.keyCode == 115)&&(battle.bstatus==0)) {    // F4
				 $("#autobattle")[0].click();
			}
			if (event.keyCode == 27) core.trigger('move')
			if (event.keyCode == 13) core.isEnterPressed = false;	
			if (event.altKey) {
		 	if ((event.keyCode==49)&&(HSets[0]!=undefined)) {inventory.actionUpSet({"setId":HSets[0]})} //1
		 	if ((event.keyCode==50)&&(HSets[1]!=undefined)) {inventory.actionUpSet({"setId":HSets[1]})} //2
		 	if ((event.keyCode==51)&&(HSets[2]!=undefined)) {inventory.actionUpSet({"setId":HSets[2]})} //3
		 	if ((event.keyCode==52)&&(HSets[3]!=undefined)) {inventory.actionUpSet({"setId":HSets[3]})} //4
		 	if ((event.keyCode==53)&&(HSets[4]!=undefined)) {inventory.actionUpSet({"setId":HSets[4]})}	//5
		 	if (event.keyCode==81)  {if (questDiary.closed) questDiary.show(); else questDiary.close()  }    //q	
		 	if (event.keyCode==87) {if (($("#messengerForm").length==0)||($("#messengerForm")[0].style.display=="none")) messenger.ShowForm(); else $("#messengerCloseButton").click() }	//w	
		 	if (event.keyCode==82) {if (main.$("b:contains(Книга призыва монстров)").length==0) {core.modeSwitch('map');frames['main'].location='/summon_book.php';} else core.trigger('move')}	//r	
		 	if (event.keyCode==69) {if (($("span:contains(Контакты)").length==0)||($("span:contains(Контакты)")[0].parentNode.parentNode.style.display!="block")) core.mod('contacts','open'); else  $("span:contains(Контакты)")[0].nextElementSibling.click()} //e


		 }	
		 var myrezult=zxzx8.apply(core,arguments);
	     return myrezult}
	     		core.mEnter = false;
				var zxzx9 = core.onKeyDown;
				core.onKeyDown = function(event) {
					event = (window.event || event);
					if (event.keyCode == 13) {
						if (core.mEnter && !core.isEnterPressed) {
							setTimeout(function() {								
								(battle.bstatus == 0) && battle.refresh('user_force2')								
							}, 250)
						}
						core.isEnterPressed = true;
					}
					var myrezult = zxzx9.apply(core, arguments);
					return myrezult
				}
	  $(document).unbind('keydown').unbind('keyup');
	  $(document).keydown(core.onKeyDown).keyup(core.onKeyUp);
	  }).toString()
	+ ")();"; 
}

		// Эффект "залипающего" энтера в бою
		if (myoptions.pressedEnter) {
			script += "(" +
				(
	  function() {
	     		core.mEnter = false;
				var zxzx9 = core.onKeyDown;
				core.onKeyDown = function(event) {
					event = (window.event || event);
					if (event.keyCode == 13) {
						if (core.mEnter && !core.isEnterPressed) {
							setTimeout(function() {								
								(battle.bstatus == 0) && battle.refresh('user_force2')								
							}, 250)
						}
						core.isEnterPressed = true;
					}
					var myrezult = zxzx9.apply(core, arguments);
					return myrezult
				}
	  $(document).unbind('keydown').unbind('keyup');
	  $(document).keydown(core.onKeyDown).keyup(core.onKeyUp);
					core.mEnter = true;	
					$(window).bind('blur', function() {core.isEnterPressed=false;});
					var buildPlayersTableOld = battle.buildPlayersTable;
					battle.buildPlayersTable = function() {
						buildPlayersTableOld.apply(battle);
						if ((core.isEnterPressed && document.getElementById("chat_msg").value == "")&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
							battle.make_turn();
						}

						return;
					}
				}).toString() + ")();";
		}
	/*	mess_caption
		mess_hname
		cpdText
		cpdName
		pr_text
		addr_name*/
		
	/*			
		if (myoptions.refresh_loc) {
			//Костыль для отлавливания клавиш в фрейме
			script = script + "(" +
				(function() {
					$('#main').load(function() {
						var iframe = $('#main').contents();
						iframe.keydown(function(event) { //отлавливаем нажатие клавиш
							// По к/К/R/r обновлять список игроков на локе

							if ((event.keyCode == 82 || event.key == "R" || event.key == "r" || event.key == "к" || event.key == "К") && (document.getElementById("chat_msg").value == "")&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
								users.load();
							}


						});
					});

				}).toString() + ")();";
		}*/
		// По к/К/R/r обновлять список игроков на локе
		if (myoptions.refresh_loc) {
			script = script + "(" +
				(function() {
					var old_onKeyUp = core.onKeyDown;
					core.onKeyDown = function(event) {
						event = (window.event || event);
						if ((event.keyCode == 82 || event.key == "R" || event.key == "r" || event.key == "к" || event.key == "К") && (document.getElementById("chat_msg").value == "") && !$("#chat_msg").is( ":focus" ) && !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
							users.load();
						}
						var myrezult = old_onKeyUp.apply(core, arguments);
						return myrezult
					}
					$(document).unbind('keyup');
					$(document).keyup(core.onKeyDown);
				}).toString() + ")();";
		}
/*
		if (myoptions.use_abills_hp) {
			//Костыль для отлавливания клавиш в фрейме
			script = script + "(" +
				(function() {
					$('#main').load(function() {
						var iframe = $('#main').contents();
						iframe.keydown(function(event) { //отлавливаем нажатие клавиш
							// По нажатию на h/H/р/Р востанавливать HP за счет абил

							if ((event.keyCode == 72 || event.key == "H" || event.key == "h" || event.key == "р" || event.key == "Р") && (document.getElementById("chat_msg").value == "") && !$("#chat_msg").is( ":focus" ) && !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
								$.get("https://www.ereality.ru/clan.php?action=use_abil&i=18&h=1", function(response) {
									var textResp = $("b", response).eq(0).text();
									if (textResp == "Вы успешно использовали восстановление!") {
										top.core.alertMsg(textResp);
										top.user.setHME(top.user.hp, top.user.hp, top.user.hp, top.user.ma, top.user.ma, top.user.ma, top.user.en, top.user.en, top.user.en);
									} else
										top.core.alertError(textResp);
								});
							}


						});
					});

				}).toString() + ")();";
		}*/

		// По нажатию на h/H/р/Р востанавливать HP за счет абил
		if (myoptions.use_abills_hp) {
			script = script + "(" +
				(function() {
					var old_onKeyUp = core.onKeyDown;
					core.onKeyDown = function(event) {
						event = (window.event || event);
						if ((event.keyCode == 72 || event.key == "H" || event.key == "h" || event.key == "р" || event.key == "Р") && (document.getElementById("chat_msg").value == "")&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
							$.get("https://www.ereality.ru/clan.php?action=use_abil&i=18&h=1", function(response) {
								var textResp = $("b", response).eq(0).text();
								if (textResp == "Вы успешно использовали восстановление!") {
									top.core.alertMsg(textResp);
									top.user.setHME(top.user.hp, top.user.hp, top.user.hp, top.user.ma, top.user.ma, top.user.ma, top.user.en, top.user.en, top.user.en);
								} else
									top.core.alertError(textResp);
							});
						}
						var myrezult = old_onKeyUp.apply(core, arguments);
						return myrezult
					}
					$(document).unbind('keyup');
					$(document).keyup(core.onKeyDown);
				}).toString() + ")();";
		}

		// По "ё" перемещение в бою в первый ряд
		if (myoptions.battle_move) {
			script = script + "(" +
				(function() {
					var old_onKeyUp = core.onKeyDown;
					core.onKeyDown = function(event) {
						event = (window.event || event);
							if ((event.keyCode == 192 || event.keyCode == 0 || event.key=="ё" || event.key=="Ё" || event.key=="`" || event.key=="~") && (battle.bstatus == 0) && (document.getElementById("chat_msg").value == "" )&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) {
							$.each(battle.players, function(index, val) {
								if (val.id == user.id) {
									if (val.y == 1) battle.make_move({
										'x': val.x,
										'y': 0
									});
								}
							})
						}
					var myrezult = old_onKeyUp.apply(core, arguments);
					return myrezult
				}
				$(document).unbind('keyup'); $(document).keyup(core.onKeyDown);
			}).toString() + ")();";
	}
	
	/*//нижняя полоса прокрутки инструментов
	if (typeof $("#bottomScroll")!='undefined')
	{
		alert ($("#bottomScroll").html());
	}*/

	//При не пустой строке чата не завершать бой энтером и уже пробелом , поидее )
	if (myoptions.keyenter) {
		script+=  "(" +
	(function(){
	var zxzx6=core.onKeyDown;
	core.onKeyDown=function(event){
	event=(window.event||event);
	if ((event.keyCode==13 || event.keyCode==32)&&(battle.bstatus==0)&&(document.getElementById("chat_msg").value != "" )&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) { return}
	else
		{var myrezult=zxzx6.apply(core,arguments);
	     return myrezult}
	}
	var zxzx7=core.onKeyUp;
	core.onKeyUp=function(event){
	event=(window.event||event);
	if ((event.keyCode==13 || event.keyCode==32)&&(battle.bstatus==0)&&(document.getElementById("chat_msg").value != "" )&& !$("#chat_msg").is( ":focus" )&& !$("#mess_text").is( ":focus" )&& !$("#mess_caption").is( ":focus" )&& !$("#mess_hname").is( ":focus" )&& !$("#cpdText").is( ":focus" )&& !$("#cpdName").is( ":focus" )&& !$("#pr_text").is( ":focus" )&& !$("#addr_name").is( ":focus" )) { return}
	else
		{var myrezult=zxzx7.apply(core,arguments);
	     return myrezult}
	}
	$(document).unbind('keydown').unbind('keyup');
	$(document).keydown(core.onKeyDown).keyup(core.onKeyUp);
	}).toString()
	+ ")();"; 
}

		// След
			script += script_map_trace.replace("sec_red.png", trace_img_src)
						.replace(/sec_avto/g, kango.io.getResourceUrl("res/sec_avto.png"))
						.replace('teamStepsOnReplace', myoptions.teammate_trace);
		//////

		// Ареалы монстров
			script += script_monster_locations.replace("monster_fon.png", ((mergedSystemOptions.monster_fon).length>0)?(((mergedSystemOptions.monster_fon).search("res/")>=0)?(kango.io.getResourceUrl(mergedSystemOptions.monster_fon)):(mergedSystemOptions.monster_fon)):(kango.io.getResourceUrl('res/infliction_layer_blue.png')));
		/////

		// Подсчет заработка в групповых и хаотических боях
			script += script_battle_counter;
		///

		// Голосовалка за проф праздники
			script += script_golosovalka.replace(/golosovalka_pic/g, kango.io.getResourceUrl("res/yes.png"));
		

		// Корректировка высоты дива когда мелкие горизонтальные кнопки.
		if (!myoptions.buttons_holder && !myoptions.biggest_buttons) {
			script += script_correct_buttons;
		}

		// Кнопка для объединения всех ресурсов в инвентаре
		if (myoptions.inventory) {
			script += script_inventory.replace("inv_union.png", kango.io.getResourceUrl("res/inv_union.png")).replace("inv_union_bg.png", kango.io.getResourceUrl("res/inv_union_bg.png"));
		}
		
		// Кнопка для объединения всех ресурсов в инвентаре
		/*if (myoptions.inventorytime) {
			script += script_inventorytime.replace("inv_union.png", kango.io.getResourceUrl("res/inv_union.png")).replace("inv_union_bg.png", kango.io.getResourceUrl("res/inv_union_bg.png"));
		}*/

		// Автосмена комплектов
        if (myoptions.sets_autowear) {
            script += script_set_autowear;
	   }			
		
		// Телепорт
       // if (myoptions.sets_autowear) {
       //     script += script_dialogTP;
       // }	
		

       // Открывашка новогодних подарков 2017
		
			script += script_presents2017.replace("closeButton_pic", kango.io.getResourceUrl("res/icon_close.gif")).replace("ng_presents2", mergedSystemOptions.ng_presents2);
		

		// Работа со звуковыми оповещениями
	if ((myoptions.no_flash)||(!myoptions.no_flash)) {

	}

		
		// На ОК показывать только тех кто жив
			script += "(" +
				(function() {
				if ($("img[src*=sun-glasses-on]").length == 1) core.hideCorpses = true;
				else core.hideCorpses = false;
				$("img[src*=sun-glasses]").on('click', function() {
					setTimeout(
						function() {
							if ($("img[src*=sun-glasses-on]").length == 1) core.hideCorpses = true;
							else core.hideCorpses = false;
						}, 100);
				});
				var old_dataRecv = users.dataRecv;
				users.dataRecv = function(data) {
					if (user.place2 == 8 && core.hideCorpses) {
						if (typeof localStorage["m_fraki"] != "undefined") {
						core.m_fraki = JSON.parse(localStorage["m_fraki"]);
						} else {
						core.m_fraki = {
						"fr2": false,
						"fr3": false,
						"fr4": false,
						"fr5": false,
						"fr6": false
						};
						}
						var new_data = [];
						var temp_data = data.split("\n");
						new_data.push(temp_data[0]);
						new_data.push(temp_data[1]);
						for (var i = 2; i < temp_data.length; i++) {
							(temp_data[i].split("#")[16] == 0 && core.m_fraki["fr"+temp_data[i].split("#")[5]] == false || temp_data[i].split("#")[16] == undefined) && new_data.push(temp_data[i]);
						}
						old_dataRecv.apply(users, [new_data.join("\n")]);
					} else old_dataRecv.apply(users, [data]);
				}
			}).toString() + ")();";
		//////

		// Заморозка чата
			script += "(" +
				(function() {
				if ($("img[src*=stop-chat-on]").length == 1) core.freezeChat = true;
				else core.freezeChat = false;
				$("img[src*=stop-chat]").on('click', function() {
					setTimeout(
						function() {
							if ($("img[src*=stop-chat-on]").length == 1) core.freezeChat = true;
							else core.freezeChat = false;
						}, 100);
				});
				var old_scrollDown = chat.scrollDown;
				chat.scrollDown = function(data) {
					if (!core.freezeChat) old_scrollDown.apply(chat);
				}
			}).toString() + ")();";
		////

		// Выключение/включение звуков игры
			script += "(" +
				(function() {
				core.sounds_on_off = false;
				if ($("img[src*=sound-off]").length != 1) core.sounds_on_off = true;
				else core.sounds_on_off = false;
				$("img[src*=sound-o]").on('click', function() {
					setTimeout(
						function() {
							core.sounds_on_off = false;
							if ($("img[src*=sound-on]").length == 1) core.sounds_on_off = true;
							else core.sounds_on_off = false;
						}, 300);
				});
				var old_playSwfSound = core.playSwfSound;
				core.playSwfSound = function() {
					if (core.sounds_on_off) old_playSwfSound.apply(core,arguments);
			}
		}).toString() + ")();";
		///


		
	// Восстановление жизней персонажа за абилки
		script += "(" +
			(function() {
			$("img[src*=medkit]").on('click', function() {
				$.get("https://www.ereality.ru/clan.php?action=use_abil&i=18&h=1", function(response) {
					var textResp = $("b", response).eq(0).text();
					if (textResp == "Вы успешно использовали восстановление!") {
						top.core.alertMsg(textResp);
						top.user.setHME(top.user.hp, top.user.hp, top.user.hp, top.user.ma, top.user.ma, top.user.ma, top.user.en, top.user.en, top.user.en);
					} else
						top.core.alertError(textResp);
				});
			});

		}).toString() + ")();";
	////

		// Телепорт малым свитком
			script += "(" +
				(function() {
					json.old_teleport_jsonRecv = json.jsonRecv;
					json.jsonRecv = function(data) {
						json.old_teleport_jsonRecv.apply(json, [data]);
						if (data.controller == "inventory" && data.action == "use" && data.response.core != undefined && data.response.core.messages[0].search("Вы успешно телепортировались на локацию") > -1) {
							if ($(".InvSearch").length==0) {core.trigger("move")};
							if (core.mur_old_category != inventory.cache.inputData.inventory.category) {
								$.post("https://www.ereality.ru/ajax/json.php",
									'{"controller":"hero","action":"inventoryCategory","params":{"mode":' + core.mur_old_category + '},"client":1}',
									function(response) {
										heroPanel.updateHeroInv(response.response);
									},
									"json");
							}
						}
						return;
					}
					fast_teleport = function() {
						$.each(inventory.items, function(index, value) {
							if (value.w_id == 3033 && value.uid[0] != "g") {
								json.jsonSend({
									"controller": "inventory",
									"action": "use",
									"params": {
										"uid": value.uid
									},
									"client": 1
								});
								return false;
							}
						})
					}
					inv_teleport = function() {
						core.mur_old_category = inventory.cache.inputData.inventory.category;
						if ($.isEmptyObject(inventory.items) || !(inventory.cache.inputData.inventory.category == 0 || inventory.cache.inputData.inventory.category == 6)) {
							$.post("https://www.ereality.ru/ajax/json.php",
								'{"controller":"hero","action":"inventoryCategory","params":{"mode":0},"client":1}',
								function(response) {
									heroPanel.updateHeroInv(response.response);
									setTimeout(function() {fast_teleport();},200);
								},
								"json");
						} else fast_teleport();
					}	

					$("img[src*=m_teleport]").on('click', function() {
						if (inventory.cache.inputData.inventory==undefined) {
							$.post("https://www.ereality.ru/ajax/json.php",
								'{"controller":"hero","action":"panel","params":{"argv":{"inventory":true}},"client":1}',
								function(response) {
									heroPanel.updateHeroInv(response.response);
									setTimeout(function() {inv_teleport();},200);
								},
								"json");
						} else inv_teleport();
					});

				}).toString() + ")();";
		/////
		
		
		/*// Телепорт малым свитком с графикой
			script += "(" +
			
				(function() {		
				//	main.Map.useMapTeleport = function () {
						var data = {
								controller: "map",
								action: "mapUseTeleport",
								params: {
									client: 1
								}
							};
							$.ajax({
								type: "POST",
								url: "/ajax/json.php",
								dataType: "json",
								data: JSON.stringify(data),
								success: function (data) {
									var result = data.response;
									if (top.core.isset(result.places) && result.places.length) {
										dialogsTP.TemplateTeleport("Телепорт", result.map, result.uid, result.places);
									} else top.core.alertError(data.response.core.errors[0])
								}
							});
				//	}
		}).toString() + ")();";*/


		// Таймеры таверны и поместья
		
			myoptions.timer_egg && (script_timers = script_timers.replace("core.mur_timer.egg = false", "core.mur_timer.egg = true"));
			myoptions.timer_ochrab && (script_timers = script_timers.replace("core.mur_timer.kol_ochrab", myoptions.kol_ochrab));
			(script_timers = script_timers.replace("core.mur_timer.mytimer_position", myoptions.timers_position));
			(script_timers = script_timers.replace("Таверна", myoptions.tav_name));
			(script_timers = script_timers.replace("Ювелирка-З", myoptions.jew_name));
			(script_timers = script_timers.replace("Ювелирка-Б", myoptions.jew2_name));
			(script_timers = script_timers.replace("Карты юнитов", myoptions.units_сard));
			(script_timers = script_timers.replace("Лечение ТБ", myoptions.tac_name));
			(script_timers = script_timers.replace("Закончился бирюзовый идол", myoptions.biryuza_name));
			(script_timers = script_timers.replace("Закончился малахитовый идол", myoptions.malakhitovyy_name));
			(script_timers = script_timers.replace("Закончился Венец победителя", myoptions.pobeda_venetc_name));
			(script_timers = script_timers.replace("Закончилась Медаль победителя", myoptions.pobeda_medal_name));
			(script_timers = script_timers.replace("Закончился Кубок победителя", myoptions.pobeda_kubok_name));
			(script_timers = script_timers.replace("Закончилась Руна победителя", myoptions.pobeda_runa_name));
			(script_timers = script_timers.replace("Закончился Плазмотрон победителя", myoptions.pobeda_plazma_name));
			(script_timers = script_timers.replace("Ремесло-ТГ", myoptions.cra_name));
			(script_timers = script_timers.replace("Ремесло-ЗО", myoptions.cra2_name));
			(script_timers = script_timers.replace("Личные сообщения", myoptions.priv_name));
			(script_timers = script_timers.replace("personal_message_v", myoptions.personal_message_v));
			(script_timers = script_timers.replace("personal_message_s", myoptions.personal_message_s));
			(script_timers = script_timers.replace("personal_message_k", myoptions.personal_message_k));
			(script_timers = script_timers.replace("personal_message_f", myoptions.personal_message_f));
			(script_timers = script_timers.replace("Клановый квест", myoptions.kk_name));
			(script_timers = script_timers.replace("Поместье", myoptions.est_name));
			(script_timers = script_timers.replace("Питомник", myoptions.pet_name));
			(script_timers = script_timers.replace("Элитка", myoptions.elite_trining_name));
			(script_timers = script_timers.replace("Гильдия го квест", myoptions.guildhalling_name));
			(script_timers = script_timers.replace("Рост профессий", myoptions.mir_aur_1_name));
			(script_timers = script_timers.replace("Адреналиновый порыв", myoptions.mir_aur_2_name));
			(script_timers = script_timers.replace("Мощь клана", myoptions.war_aur_1_name));
			(script_timers = script_timers.replace("Рост опыта", myoptions.war_aur_2_name));
			(script_timers = script_timers.replace("Рост умений", myoptions.war_aur_3_name));
			(script_timers = script_timers.replace("Кровь феникса", myoptions.war_aur_4_name));
			(script_timers = script_timers.replace("Невидимость", myoptions.war_aur_5_name));
			(script_timers = script_timers.replace("Величие клана", myoptions.war_aur_6_name));
			(script_timers = script_timers.replace("Мазюкалка", myoptions.mazz_aur_name));
			(script_timers = script_timers.replace("Кровожадность", myoptions.bloodiness_name));
			(script_timers = script_timers.replace("Очки работы", myoptions.och_name));
			(script_timers = script_timers.replace("Пора получать доход", myoptions.veter_name));
			(script_timers = script_timers.replace("Узоры!", myoptions.tracery_name));
			(script_timers = script_timers.replace("Статуя!", myoptions.figure_name));
			(script_timers = script_timers.replace("АураХрама!", myoptions.aura_name));
			(script_timers = script_timers.replace("tracery_count", myoptions.tracery_count));
			(script_timers = script_timers.replace("opac_ext_count2", myoptions.opac_ext_count2/100));
			(script_timers = script_timers.replace("opac_ext_count", myoptions.opac_ext_count/100));
			(script_timers = script_timers.replace("t_big_width",  myoptions.t_big_width));
			(script_timers = script_timers.replace("t_middle_width",  myoptions.t_middle_width));
			(script_timers = script_timers.replace("t_small_width",  myoptions.t_small_width));
			(script_timers = script_timers.replace("t_big_font",  myoptions.t_big_font));
			(script_timers = script_timers.replace("t_middle_font",  myoptions.t_middle_font));
			(script_timers = script_timers.replace("t_small_font",  myoptions.t_small_font));
			(script_timers = script_timers.replace("show_money_piastres",  myoptions.show_money_piastres));
			(script_timers = script_timers.replace("show_money_dust",  myoptions.show_money_dust));
			(script_timers = script_timers.replace("show_money_supplies",  myoptions.show_money_supplies));
			(script_timers = script_timers.replace("show_money_authority",  myoptions.show_money_authority));
			(script_timers = script_timers.replace("show_money_xenoteks",  myoptions.show_money_xenoteks));
			(script_timers = script_timers.replace("show_money_crystals",  myoptions.show_money_crystals));
			myoptions.timer_always_show && (script_timers = script_timers.replace("core.mur_timer.always_show = false", "core.mur_timer.always_show = true"));
			if (kango.browser.getName() != "firefox") {
				script_timers = script_timers.replace("MurTimerCss","-webkit-linear-gradient(top, #fff,#bbb)");
			} else {
				script_timers = script_timers.replace("MurTimerCss","-moz-linear-gradient(center top , #fff, #bbb) repeat scroll 0 0 rgba(0, 0, 0, 0)");
			}
			script += script_timers.replace(/sound_taverna/g,defaultConfig.soundOptions["sound_taverna"].sound).replace(/sound_elite_trining/g,defaultConfig.soundOptions["sound_elite_trining"].sound).replace(/sound_est/g,defaultConfig.soundOptions["sound_est"].sound).replace(/sound_pet/g,defaultConfig.soundOptions["sound_pet"].sound).replace("alarm-clock.png", kango.io.getResourceUrl("res/alarm-clock.png")).replace("icon_close.gif", kango.io.getResourceUrl("res/icon_close.gif")).replace(/sound_jeweler2/g,defaultConfig.soundOptions["sound_jeweler2"].sound).replace(/sound_jeweler/g,defaultConfig.soundOptions["sound_jeweler"].sound).replace(/sound_craftsman/g,defaultConfig.soundOptions["sound_craftsman"].sound).replace(/sound_craftsman2/g,defaultConfig.soundOptions["sound_craftsman2"].sound).replace(/sound_aurhram/g,defaultConfig.soundOptions["sound_aurhram"].sound).replace(/sound_miraur/g,defaultConfig.soundOptions["sound_miraur"].sound).replace(/sound_golos/g,defaultConfig.soundOptions["sound_golos"].sound).replace(/sound_waraur/g,defaultConfig.soundOptions["sound_waraur"].sound).replace(/sound_tac/g,defaultConfig.soundOptions["sound_tac"].sound).replace(/sound_units_сard/g,defaultConfig.soundOptions["sound_units_сard"].sound).replace(/sound_mazaur/g,defaultConfig.soundOptions["sound_mazaur"].sound);
		

		inject_global(script);
	}

 //=========================end.

 });


