var monsterLocationBuilderClass = function(monsterLocationBuilderCss, factionCounterCss, holder) {
	this.monsterLocation;
	this.openLink;
	this.position;
	this.timeToShow = 4000;
	
	var self = this;
	this.css = monsterLocationBuilderCss;

	this.init = function() {
		var popupMonsters = new popupClass(popupCss);
		this.monsterLocation = new monsterLocationClass(popupMonsters, factionCounterCss);
	
		holder.append(this.buildLink());
		this.monsterLocation.init();
		this.bindListeners();		
	},
	this.buildLink = function() {
		this.openLink = $("<a/>", {title:"Ареалы обитания монстров"}).css(self.css.openLink);
		
		return this.openLink.append($("<img/>", {src:self.css.openLinkImg}));
	},
	this.bindListeners = function() {		
		this.openLink.on('click', function() {
			self.position = $(this).offset();
			var popupwindow = self.monsterLocation.hide().show(self.position.left, self.position.top);
			(typeof(popupwindow)!="undefined") && popupwindow.hideAfter(self.timeToShow);
		});
	}
};