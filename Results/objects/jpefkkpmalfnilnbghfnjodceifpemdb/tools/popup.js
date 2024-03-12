var popupClass = function(popupCss) {
	this.mainHolder = $('<div></div>').css(popupCss);

	this.positionX = 0;
	this.positionY = 0;
	
	this.outWidth = 0;
	this.outHeigth = 0;
	
	this.window = $(window);
	
	this.goOverBorder = false;
	
	$('body').prepend(this.mainHolder);	
	
	this.show = function(popupBody) {
		this.hide();
		this.mainHolder.append(popupBody);
		
		this.calculatePopupSize();
		
		this.mainHolder.show();
		
		return this;
	};

	this.showPreloader = function(preloader) {
		this.hide();
		this.mainHolder.append(preloader);
		
		this.calculatePopupSize();
		
		this.mainHolder.show();
		
		return this;
	};
		
	this.hide = function() {
		this.mainHolder.hide().empty();
		return this; 
	};

	this.mhide = function() {
		this.mainHolder.hide();
		return this; 
	};
	
	this.calculatePopupSize = function() {
		this.popupWidth = this.mainHolder.width();
		this.popupHeight = this.mainHolder.height();			
	};
	
	this.move = function(x, y, positionMarginX, positionMarginY) {
		this.positionX = x + positionMarginX;
		this.positionY = y + positionMarginY;
		
		this.outWidth = this.positionX + this.popupWidth - this.window.width();
		this.outHeigth = this.positionY + this.popupHeight - this.window.height();
		
		if (this.outWidth > 0 && !self.goOverBorder) { 
			this.positionX = x - positionMarginX - this.popupWidth;
		}
		
		if (this.outHeigth > 0 && !self.goOverBorder) {
			this.positionY = y - positionMarginY - this.popupHeight;
		} 
		
		this.mainHolder.css({"margin-left": this.positionX + "px", "margin-top": this.positionY + "px"});
		return this;
	};
	
	this.setCanGoOverBorder = function(goOverBorder) {
		self.goOverBorder = goOverBorder;
	}
}

var popup = new popupClass(popupCss);

