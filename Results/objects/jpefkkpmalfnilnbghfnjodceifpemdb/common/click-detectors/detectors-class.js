var detectorsClass = function(keyMaps, pluginOptions) {
	this.keyMap = keyMaps;	
	this.pluginOptions = pluginOptions;

	
	var self = this;
	
	this.isBattleScreenActive = function() {
		return document.getElementById("div_battle") != undefined && document.getElementById("div_battle").style.display != "none";
	}
	
	this.isMessengerFormActive= function() {
		return top.frames.document.getElementById("messengerForm") != undefined && top.frames.document.getElementById("messengerForm").style.display != "none";
	}
	
	this.isChatStringEmpty = function() {
		return (top.document.getElementById("chat_msg")==undefined || top.document.getElementById("chat_msg").value == "");
	}
	
	this.detectAttackLocationClick = function(code) {
		if (!self.pluginOptions.cemetry) {
			return;
		}
		
		if (self.isBattleScreenActive() || self.isMessengerFormActive() || !self.isChatStringEmpty()) { 
			return;
		}
		
		for (var key in self.keyMap.battleStart.keys) { 
			if (self.keyMap.battleStart.keys[key] == code) {
				for (var npc_name in self.keyMap.battleStart.npc_names) {
					if ($("#npcname").text() == self.keyMap.battleStart.npc_names[npc_name]) {
						top.document.getElementById("dialog").firstChild.firstChild.nextElementSibling.nextElementSibling.click();
						break;
					}
				}
				
				break;
			}
		}
	}
	
	this.detectBattleClick = function(code) {
		if (!self.pluginOptions.numfight || !self.isBattleScreenActive()) {
			return;
		}

		if (typeof self.keyMap.battleKeyMap[code] !== 'undefined') {
			document.getElementById(sef.keyMap.battleKeyMap[code]).click();
		}
	}
	
	this.detectCapchaClick = function(code) {
		if (!self.pluginOptions.numcapcha || top.frames.main==undefined || top.frames.main.document.getElementById("CaptchaButtons") == null) {	
			return false;
		}
			
		if (typeof self.keyMap.captchaKeyMap[code] !== 'undefined') {
			top.frames.main.document.getElementById(self.keyMap.captchaKeyMap[code]).click();
		}
	}
	
	this.detectCancelClick = function(code) {
		if (!self.pluginOptions.esc_move) {
			return;
		} 
		if (typeof self.keyMap.cancelKeyMap[code] !== 'undefined') { 
			top.frames.main.document.getElementById(self.keyMap.cancelKeyMap[code]).click();
		}
	}

	this.detectEnterClick = function(code) {
		if (!self.pluginOptions.sledopit) {
			return;
		} 
		if (self.isBattleScreenActive() || self.isMessengerFormActive() || !self.isChatStringEmpty()) { 
			return;
		}
		if ((typeof self.keyMap.attackEnterKeyMap[code] !== 'undefined') && top.frames.main.document.getElementsByClassName(self.keyMap.attackEnterKeyMap[code]).length>0) {
			try {
                var event = new UIEvent('dblclick');

                $('.monster', top.frames.main.document).eq(0).children().first()[0].dispatchEvent(event);
			}
			catch(e) {}
		}
	}
	
	
	
	this.detectUndergroundClick = function(code) {
		if (top.frames.main==undefined || top.frames.main.document.getElementById("underground") == null) {
			return;
		}

		if (self.isBattleScreenActive() || !self.isChatStringEmpty() || self.isMessengerFormActive()) {
			return;
		}
				
		if (typeof self.keyMap.undergroundKeyMap[code] !== 'undefined') {
			top.frames.main.document.getElementById(self.keyMap.undergroundKeyMap[code]).click();
		}
	}
	
	this.detectInstanceClick = function(code) {
		if (!self.pluginOptions.kbdinst || top.frames.main==undefined || top.frames.main.document.getElementById("div_inst_top") == null) {
			return;
		}
		
		if (self.isBattleScreenActive() || !self.isChatStringEmpty() || self.isMessengerFormActive()) {
			return;
		}
			
		if (typeof self.keyMap.instanceKeyMap.move[code] !== 'undefined') {
			top.frames.main.document.getElementById(self.keyMap.instanceKeyMap.move[code]).click();
		
			return;
		}
		
		if (typeof self.keyMap.instanceKeyMap.attack[code] !== 'undefined') {
			top.main.document.getElementById(self.keyMap.instanceKeyMap.attack[code]).getElementsByTagName("a")[0].click();
		}
	}
}