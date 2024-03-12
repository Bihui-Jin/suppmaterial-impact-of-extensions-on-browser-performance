var sidzokuDressRoomClass = function(holder, buttonStyle, userName) {
	this.holder = holder;
	this.buttonStyle = buttonStyle;
	try {
	if ($(window.opener.document.getElementsByTagName("title")).eq(0).html().search(userName)!=-1) 
	this.SidzokuLink = $("<a/>", {target:"_blank", href:"https://www.ereality.ru/goto/sidzoku.ru/armory#" + userName, title:"Переодевалка от Sidzoku"});	
	else this.SidzokuLink = $("<a/>", {target:"_blank", href:"http://armory.sidzoku.ru/?h_name=" + userName, title:"Переодевалка от Sidzoku"});
	}  catch(e) { 
	this.SidzokuLink = $("<a/>", {target:"_blank", href:"http://armory.sidzoku.ru/?h_name=" + userName, title:"Переодевалка от Sidzoku"});
	}
	
	this.SidzokuImg = $("<img/>", {src:kango.io.getResourceUrl("res/sidzoku.gif")});
		
	var self = this;
	this.init = function() {
		self.SidzokuImg.css(self.buttonStyle);
		self.SidzokuLink.append(self.SidzokuImg);
		self.holder.append(self.SidzokuLink);
	}
}