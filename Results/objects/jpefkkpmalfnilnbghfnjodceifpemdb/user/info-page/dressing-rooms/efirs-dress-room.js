var efimerkaClass = function(holder, buttonStyle, userName) {
	this.holder = holder;
	this.buttonStyle = buttonStyle;
	
	this.efimerLink = $("<a/>", {target:"_blank", href:"http://охэ.com/efimerka/#" + userName, title:"Переодевалка от ОХЭ"});
	this.efimerImg = $("<img/>", {src:kango.io.getResourceUrl("res/efir.gif")})
	var self = this;
	
	this.init = function() {
		self.efimerImg.css(self.buttonStyle);
		self.efimerLink.append(self.efimerImg);
		self.holder.append(self.efimerLink);
	}
}