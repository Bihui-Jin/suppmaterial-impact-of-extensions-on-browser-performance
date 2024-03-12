var battleCountBuilderClass = function(factionContBuilderCss, factionCounterCss, holder) {
	this.battleCounter;
	this.openLink;
	this.position;
	this.timeToShow = 4000;
	
	var self = this;
	this.css = battleContBuilderCss;

	this.init = function() {
		this.battleCounter = new battleCounterClass(popup, "#chat_msg", factionCounterCss);
	
		holder.append(this.buildLink());
		this.battleCounter.init();
		this.bindListeners();		
	},
	this.buildLink = function() {
		this.openLink = $("<a/>", {title:"Статистика боев"}).css(self.css.openLink);
		
		return this.openLink.append($("<img>", {'src':self.css.openLinkImg}));
	},
	this.bindListeners = function() {		
		this.openLink.on('click', function() {
			self.position = $(this).offset();
			
			self.battleCounter.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
		});
	}
};