var extensionOptionsClass = function(soundSelectOptions) {
	this.soundSelectOptions = soundSelectOptions;
	this.mur_sounds = {};
	var self = this;
	
	this.init = function() {
		this.loadExtentionOption("options", defaultConfig.myoptions, function() {
			self.prepareOptionButtons();
		});

		this.loadExtentionOption("systemOptions", defaultConfig.systemOptions, function() {
			self.prepareSystemOptions();
		});

		this.loadExtentionOption("soptions", defaultConfig.soundOptions, function() {
			self.prepareSoundOptionsButtons(this.soundSelectOptions);
			});
	};
	
	this.saveOptions = function(optionKey, optionValue) {
		kango.invokeAsync('kango.storage.setItem', optionKey, optionValue);
	}

	this.prepareSystemOptions = function() {
		$.each(defaultConfig.systemOptions, function(key) {
			$('#' + key).val(defaultConfig.systemOptions[key]).on("input",function() {
				defaultConfig.systemOptions[key] = $(this).val();
				self.saveOptions("systemOptions", defaultConfig.systemOptions);
			}).val(defaultConfig.systemOptions[key]).on("change",function() {
                defaultConfig.systemOptions[key] = $(this).val();
                self.saveOptions("systemOptions", defaultConfig.systemOptions);
            });
		});
	};
	this.prepareOptionButtons = function() {
		$.each(defaultConfig.myoptions, function(key) {
			$('#' + key).prop("checked", defaultConfig.myoptions[key]).on("click", function() {
				defaultConfig.myoptions[this.id] = $(this).prop("checked");
				self.saveOptions("options", defaultConfig.myoptions);
			});
		});		
	};
	
	this.refreshSoundOptions = function() {
		var custom_sounds = $("#custom_sounds").val().split(";");
		var htmlopt = "";
		this.mur_sounds = {};
		for (var i = 0; i < custom_sounds.length; i++) {
			if (custom_sounds[i].length > 5) {
				snd = custom_sounds[i].split(")");
				soundName = snd[0].replace("(", "").replace(/\n/, "");
				soundLink = snd[1];
				this.mur_sounds[soundName] = soundLink;
				htmlopt += '<option value="' + soundName + '">' + soundName + '</option>'
			}
		}
		$.each(defaultConfig.soundOptions, function(key) {
			$('#' + key).html(self.soundSelectOptions + htmlopt).val(defaultConfig.soundOptions[key].sound);
		});
	};

	this.prepareSoundOptionsButtons = function() {
		this.refreshSoundOptions();
		$.each(defaultConfig.soundOptions, function(key) {
			if (self.mur_sounds && self.mur_sounds[defaultConfig.soundOptions[key].sound] != undefined)
				src_sound = self.mur_sounds[defaultConfig.soundOptions[key].sound];
			else
			src_sound = 'mp3/' + defaultConfig.soundOptions[key].sound + '.mp3" type="audio/mp3';
			$('#' + key).parent().append('<audio controls id="s_' + key + '" src="' + src_sound + '" type="audio/mp3" </audio>');
			$('#' + key).val(defaultConfig.soundOptions[key].sound).on("click", function() {
				defaultConfig.soundOptions[this.id].sound = $(this).val();
				if (self.mur_sounds && self.mur_sounds[$(this).val()] != undefined)
					$('#s_' + this.id).attr("src", self.mur_sounds[$(this).val()]);
				else
					$('#s_' + this.id).attr("src", 'mp3/' + $(this).val() + '.mp3');
				self.saveOptions("soptions", defaultConfig.soundOptions);
			});
			$("#custom_sounds").on("change", function() {
				self.refreshSoundOptions();
			});
		});
	};
	
	this.loadExtentionOption = function(optionKey, defaultOptions, callback) { 
		kango.invokeAsync('kango.storage.getItem', optionKey, function(value) { 
			defaultOptions = mergeOptions(value, defaultOptions);
			callback();
		});		
	}		
}

var extensionOptionsExportClass = function() {
	this.exportLink = null;	
	this.exportButton = $("#exportButton");
	
	var self = this;
	
	this.erExtOptions = [
		{systemName: 'soptions', defaultName: "soundOptions"}, 
		{systemName: 'options', defaultName: "myoptions"}, 
		{systemName: 'systemOptions', defaultName: "systemOptions"},
		{systemName: 'estateVictims', defaultName: "estateVictims"}
	];
	
	this.init = function(HelpScreens) {
		self._initExportButton();
		self._initImportButton();
		self._initExportLink();

		  $.each(HelpScreens, function(key) {
			var objForEye= $('#' + key);
			if (objForEye.prop("type") == 'text')
			objForEye = objForEye.parents().eq(1).find('.checkForTimer')
			
		   objForEye.after($("<img/>", {src:"res/eye.png", style:"cursor: pointer"}).on("click", function(event) {
			 event.preventDefault();
			 var obj = $('#modal-for-pic');
			 var img = $('<img id="dynamic">');
			 img.attr('src', HelpScreens[key]);
			 obj.find('.modal-body').html(img);
			 obj.modal('show');
		   }));
		  });


	}
	
	this._initExportButton = function() {
		self.exportButton.on('click', function() {
			tools.loadOptions(self.erExtOptions, self.exportToFile);
		});
	}
	
	this._initExportLink = function() {
		self.exportLink = $('<a download="er-ext-config.txt">').css({display: "none"});
		$('body').append(self.exportLink);
	}
	
	this.exportToFile = function(options) { 
		var optionsInJson = JSON.stringify(self.filterOptions(options));
		self._initFileDownload(optionsInJson);
	}
	
	this._initFileDownload = function(options) { 
		var hrefData = "data:text/plain;base64," + btoa(escape(options));
		self.exportLink.attr('href', hrefData);			
		
		self.exportLink[0].click();
	}	

	this.filterOptions = function(options) {
		$.each(options, function(key) { 
			if (typeof self.optionFilters[key] !== 'undefined') {
				options[key] = self.optionFilters[key](this);
			}
		});			

		return options;
	}
	
	this.optionFilters = {
		soptions: function(soundOptions) {	
			$.each(soundOptions, function(key) {
				delete soundOptions[key].detect;
			});
			
			return soundOptions;
		}
	}		
	
	this._initImportButton = function() {
		var reader = self._initFileReader();
	
		$("#files").on("change", function() {			
			reader.readAsText(this.files[0], "windows-1251");
		});
	}
	
	this._initFileReader = function() {
		var reader = new FileReader();
		
		reader.onload = function(event) {		
			try {
				var config = $.parseJSON(unescape(event.target.result));
				self.importOptions(config);
				var obj = $('#modal-for-pic');
				obj.find('.modal-body').html('Импорт настроек прошел успешно !');
				obj.modal('show');
			}
			catch (error) {
				//console.log(error);
				//alert(error);
				var obj = $('#modal-for-pic');
				obj.find('.modal-body').html('Не удалось импортировать настройки. Возможно файл поврежден.');
				obj.modal('show');
			}

		}
		
		reader.onerror = function() {
			var obj = $('#modal-for-pic');
			obj.find('.modal-body').html('Не удалось считать файл !');
			obj.modal('show');
		}
		
		return reader;
	}
	
	this.importOptions = function(options) {
		$.each(options, function(key) {				
			if (typeof self.importFunctions[key] !== 'undefined') {
				self.importFunctions[key](this);
				return;
			}
			
			self.defaultImportFunction(this, key);				
		});
	}
	
	this.defaultImportFunction = function(option, optionKey) {
		kango.invokeAsync('kango.storage.setItem', optionKey, option);
	}
	
	this.importFunctions = {
		soptions: function(soundOptions) {
			kango.invokeAsync('kango.storage.getItem', 'soptions', function(options) { 
				if (options==null) var options = defaultConfig.soundOptions;
				$.each(defaultConfig.soundOptions, function(key) {
					(soundOptions[key]!=undefined) && (options[key].sound = soundOptions[key].sound);
				});	
				kango.invokeAsync('kango.storage.setItem', 'soptions', options);
			});						
		}
	}
}

KangoAPI.onReady(function() {
	var htmlopt = '<option value="nosound">Отключено</option>'+
      '<option value="sound1">Звук  1 (sound1)</option>'+
      '<option value="sound2">Звук  2 (sound2)</option>'+
      '<option value="sound3">Звук  3 (sound3)</option>'+
      '<option value="sound4">Звук  4 (sound4)</option>'+
      '<option value="sound5">Звук  5 (sound5)</option>'+
      '<option value="alarm">Звук  6 (alarm)</option>'+
      '<option value="chat">Звук 7 (chat)</option>'+
      '<option value="fight">Звук  8 (fight)</option>'+
      '<option value="fish">Звук  9 (fish)</option>'+
      '<option value="mine">Звук 10 (mine)</option>'+
      '<option value="msg">Звук 11 (msg)</option>'+
      '<option value="trade">Звук 12 (trade)</option>'+
      '<option value="wood">Звук 13 (wood)</option>'+
      '<option value="work">Звук 14 (work)</option>';

    var HelpScreens = {
        fastex: 	"help_images/fastex.png",
		addMoney: 	"help_images/addMoney.png",
        abil_heal:  "help_images/abil_heal.png",
        battleCounter: "help_images/battleCounter.png",
        battleInfo: "help_images/battleInfo.png",
        biggest_buttons: "help_images/biggest_buttons.png",
        block_cmenu: "help_images/block_cmenu.png",
        buttons_holder: "help_images/buttons_holder.png",
        buttons_holder_oneDiv: "help_images/buttons_holder_oneDiv.png",
        contextmenus: "help_images/contextmenus.png",
        estatenamelink: "help_images/estatenamelink.png",
        estateVictims: "help_images/estateVictims.png",
        freeze_chat: "help_images/freeze_chat.png",
        global_info: "help_images/global_info.png",
        location_info: "help_images/location_info.png",
        lotereya: "help_images/lotereya.png",
        lottery_zk: "help_images/lottery_zk.png",
        map_trace: "help_images/map_trace.png",
        menu_maps: "help_images/menu_maps.png",
        monster_locations: "help_images/monster_locations.png",
        ok_hide_corpses: "help_images/ok_hide_corpses.png",
        okcount: "help_images/okcount.png",
        oplot_button: "help_images/oplot_button.png",
        questsectors: "help_images/questsectors.png",
        repeat_kudes: "help_images/repeat_kudes.png",
        repeat_metall: "help_images/repeat_metall.png",
        metall_buy_rudpol: "help_images/metall_buy_rudpol.png",
        kudes_buy_rudpol: "help_images/metall_buy_rudpol.png",
        calc_kudes_polyana: "help_images/calc_kudes_polyana.png",
        sounds_on_off: "help_images/sounds_on_off.png",
        stock_sell_offline_find: "help_images/stock_sell_offline_find.png",
        stockmy: "help_images/stockmy.png",
        stockmy_island: "help_images/stockmy_island.png",
        taverna_fast_click: "help_images/taverna_fast_click.png",
        est_name: "help_images/timer_estate.png",
        tav_name: "help_images/timer_taverna.png",
        trade_buy_full_lot: "help_images/trade_buy_full_lot.png",
        userlistactiveitems: "help_images/userlistactiveitems.png",
        aliensmy: "help_images/aliensmy.png",
        armory: "help_images/armory.png",
        bodestate: "help_images/bodestate.png",
        clan_ct_buttons: "help_images/clan_ct_buttons.png",
        forum_pages: "help_images/forum_pages.png",
        glamurstupki: "help_images/glamurstupki.png",
        info: "help_images/info.png",
        inventory: "help_images/inventory.png",
        inventorytime: "help_images/inventorytime.png",
        locatioons_opp: "help_images/locatioons_opp.png",
        locatioons_ovl: "help_images/locatioons_ovl.png",
        sidzoku: "help_images/sidzoku.png",
        zk: "help_images/zk.png",
        pet_name: "help_images/timer_pet.png",
        tab_refresh: "help_images/tab_refresh.png",
        golosovalka: "help_images/golosovalka.png",
        startup_update_notification: "help_images/startup_update_notification.png",
        mobs_filtr: "help_images/mobs_filtr.png",
        elitturnament: "help_images/elitturnament.png",
        presents: "help_images/presents.png",
        timer_egg: "help_images/timer_egg.png",
        spdressroom: "help_images/spdressroom.png",
        nickhistory: "help_images/nickhistory.png",
        uslugi_igrokov: "help_images/uslugi_igrokov.png",
        kachestvo_zatochki: "help_images/kachestvo_zatochki.png",
        sanctions: "help_images/sanctions.png",
        buy_taverna: "help_images/sanctions.png",
        lzglittle: "help_images/lzglittle.png",
        taverna_filters: "help_images/taverna_filters.png",
        Other_Cell_Icons: "help_images/Other_Cell_Icons.png",
        sets_autowear: "help_images/set-autowear.png",
        alternative_chat_send: "help_images/alternative_chat_send.png",
        forum_ignore: "help_images/forum_ignore.png",
        trade_bookmarks: "help_images/trade_bookmarks.png",
        location_bot_info: "help_images/location_bot_info.png",
        expedition_estate: "help_images/expedition_estate.png",
        turquoise_grid: "help_images/turquoise_grid.png",
        teleport: "help_images/teleport.png",
        turquoise_info: "help_images/turquoise_info.png",
        jew_name: "help_images/timer_jeweler.png",
        cra_name: "help_images/timer_jeweler.png",
        cra2_name: "help_images/timer_jeweler.png",
        fisherEnabled: "help_images/fisherEnabled.png",
        geologistEnabled: "help_images/geologistEnabled.png",
        messagesRecorder: "help_images/messagesRecorder.png",
        och_name: "help_images/timer_ochrab.png",
        elite_trining_name: "help_images/timer_elit_train.png",
        war_aur_1_name: "help_images/timer_miraur.png",
        mir_aur_1_name: "help_images/timer_miraur.png",
        mazz_aur_name: "help_images/timer_miraur.png",
        veter_name: "help_images/timer_veteran.png",
        kk_name: "help_images/timer_klan_kvest.png",
        silentBattle: "help_images/silentBattle.png",
        timer_always_show: "help_images/timer_always_show.png"
    }

	new extensionOptionsClass(htmlopt).init();
	new extensionOptionsExportClass().init(HelpScreens);
});