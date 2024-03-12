var factionContBuilderClass = function(factionContBuilderCss, factionCounterCss, holder) {
	this.factionCounter;
	this.openLink;
	this.position;
	this.timeToShow = 4000;
	
	var self = this;
	this.css = factionContBuilderCss;

	this.init = function() {
		this.factionCounter = new factionCounterClass("#div_users", "#div_users1", popup, "#chat_msg", factionCounterCss);
		this.factionCounter.init();
	
		holder.append(this.buildLink());
		this.bindListeners();		
	},
	this.buildLink = function() {
		this.openLink = $("<a/>", {title:"Количество фракционеров в локации"}).css(self.css.openLink);
		
		return this.openLink.append($("<img/>", {'src':self.css.openLinkImg}));
	},
	this.bindListeners = function() {		
		this.openLink.on('click', function() {
			self.position = $(this).offset();
			
			self.factionCounter.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
		});
	}
};