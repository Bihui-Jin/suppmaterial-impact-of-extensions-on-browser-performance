var estateUiBuilderClass = function(estateVictimsListViewer, css, listImgID, addToListImg, victimNameHolderID) {
	this.estateVictimsListViewer = estateVictimsListViewer;
	this.css = css;
	this.listImgID = listImgID;
	this.addToListImg = addToListImg;
	this.victimNameHolderID = victimNameHolderID;
	this.mainHolder = $('body');
	
	var self = this;
	
	this.init = function() {
		self.initListImg();
		self.initDelegator();
	};
	
	this.initListImg = function() {
		var listImg = $("<img/>", {title:"Список жертв", id:self.listImgID, class:"estateTooltip", src:self.css.listImg})
			.css(self.css.listImgCss);

		var listDiv = $('<div></div>').css(self.css.listDivCss).append(listImg);
		
		$('#estateTopBar').append(listDiv);	
	};
	
	this.initDelegator = function() {
		self.mainHolder.delegate('#' + self.listImgID, 'click', function() {
			self.estateVictimsListViewer.toggleShow();
		});
		
		self.mainHolder.delegate('#' + self.addToListImg, 'click', function() {
			if (!self.estateVictimsListViewer.getIsVisible()) {
				self.estateVictimsListViewer.show();
			}
			
			self.estateVictimsListViewer.setVictimName($(this).prev().text());
		});
		
	}				
}