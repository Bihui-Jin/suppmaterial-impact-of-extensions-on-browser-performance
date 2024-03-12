var factionCounterClass = function(usersCommonSelector, usersHolderSelector, popup, chatMsgSelector, css) {
	this.popup = popup;
	this.usersHolderSelector = usersHolderSelector;
	this.usersHolder = $(usersCommonSelector);
	this.chatMsgSelector = chatMsgSelector;
	this.css = css;
	
	this.factionMembers = {};	
	this.summTds = {};
	this.view;	
	this.hideTimer;	
	this.factionImgPath = "https://img.ereality.ru/a/";
	this.copyLinkId = "er-ext-copy-link";
	this.closeButtonId = "er-ext-close-button";
	this.factions = {
		"1": "Нейтрал",
		"2": "Игнесс",
		"3": "Раанор",
		"4": "Тарбис",
		"5": "Витарра",
		"6": "Дримнир"
	};
	
	var self = this;
	this.init = function() {
		this.prepareView();
	};
	
 	this.prepareView = function() {		
		this.view = $("<table/>");			
		this.view.append(this.getExitButton());	
		
		$.each(this.factions, function(key) {
			var tr = $("<tr/>");
			
			var imgTd = $("<td/>", {align:"center"}).append($("<img/>", {src:self.factionImgPath + key + ".gif"}));
	
			self.summTds[key] = $("<td/>", {align:"center"}).css(self.css.textStyle);
			tr.append(imgTd).append(self.summTds[key]);
			self.view.append(tr);
		});
		
		this.view.append(this.getCopyLink());
	};
	
	this.count = function() {
		$.each(this.factions, function(key) {
			self.factionMembers[key] = self.countFactionMembers(self.usersHolder, key);
		}); 
	};
	
	this.countFactionMembers = function(usersHolder, factionId) {
		return $(usersHolder).find(this.usersHolderSelector + " img[src=\"" + this.factionImgPath + factionId + ".gif\"]").length;
	};
	
	this.show = function(positionX, positionY) {
		this.count();
		
		$.each(this.factions, function(key) {
			self.summTds[key].text(self.factionMembers[key]);
		});		
		
		this.bindListeners();		
		this.popup.show(this.view).move(this.calculatePositionX(positionX), this.calculatePositionY(positionY), 0, 0);
		
		return this;
	};
	
	this.calculatePositionX = function(x) {
		return x -= this.view.width();
	};
	
	this.calculatePositionY = function(y) {
		return y -= this.view.height();
	};
	
	this.hide = function() {
		this.popup.hide();
		this.clearHideTimer();
		
		return this;
	};
	
	this.bindListeners = function() {
		this.view.find("#" + this.copyLinkId).on("click", function(){		
			self.copyToChat();
		});
		
		this.view.find("#" + this.closeButtonId).on("click", function() {
			$(this).attr("src", self.css.iconClose);
			self.hide();
		}).hover(function() {
			$(this).attr("src", self.css.iconCloseHover);
		}, function() {
			$(this).attr("src", self.css.iconClose);
		});
	};
	
	this.getCopyLink = function() {
		var link = $("<a/>", {id:this.copyLinkId, text:"Скопировать в чат"}).css(this.css.copyLink);
		return $("<tr/>").append($("<td/>", {colspan:2})).children().append(link);		
	};
	
	this.getExitButton = function() {
		return $("<tr>").append($("<td/>", {colspan:2, align:"right"}).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose})));
	};
	
	this.copyToChat = function() {
		var chatMsg = "";	
		
		$.each(self.factionMembers, function(key) {
			chatMsg += self.factions[key] + ":" + self.factionMembers[key] + " ";
		});
		
		$(this.chatMsgSelector).val(chatMsg);
	};
	
	this.hideAfter = function(hideTime) {	
		this.initHideTimer(hideTime);

		this.view.hover(function() {
			self.clearHideTimer();
		}, function() {
			self.initHideTimer(hideTime);
		});
		
		return this;
	};	
	
	this.initHideTimer = function(hideTime) {
		this.hideTimer = setTimeout(function(){
			self.hide();
		}, hideTime);
	};
	
	this.clearHideTimer = function() {
		clearTimeout(this.hideTimer);
	};
}