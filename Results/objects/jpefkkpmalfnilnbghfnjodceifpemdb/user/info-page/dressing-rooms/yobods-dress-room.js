var yobodsDressRoomClass = function(holder, buttonStyle, userName) {
	this.holder = holder;
	this.buttonStyle = buttonStyle;
	this.bodLink = $("<a/>", {target:"_blank", href:"http://yo-bod.com/faceshop/#" + userName, title:"Переодевалка от Blade of Darkness"});
	this.bodImg = $("<img/>", {src:kango.io.getResourceUrl("res/yo-bods.gif")});
		
	var self = this;
	this.init = function() {
		self.bodImg.css(self.buttonStyle);
		self.bodLink.append(self.bodImg);
		self.holder.append(self.bodLink);
	}
}