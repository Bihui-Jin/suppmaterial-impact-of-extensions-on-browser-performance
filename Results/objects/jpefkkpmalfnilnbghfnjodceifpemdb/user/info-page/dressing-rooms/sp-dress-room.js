var spDressRoomClass = function(holder, buttonStyle, userName) {
	this.holder = holder;
	this.buttonStyle = buttonStyle;
	try {
	if ($(window.opener.document.getElementsByTagName("title")).eq(0).html().search(userName)!=-1) 
	this.spLink = $("<a/>", {target:"_blank", href:"https://www.ereality.ru/goto/order.ereality.ru/sp-shop/?pers=" + userName, title:"Переодевалка от Стражей Порядка"});	
	else this.spLink = $("<a/>", {target:"_blank", href:"http://order.ereality.ru/sp-shop/?pers=" + userName, title:"Переодевалка от Стражей Порядка"});
	}  catch(e) { 
		this.spLink = $("<a/", {target:"_blank", href:"http://order.ereality.ru/sp-shop/?pers=" + userName, title:"Переодевалка от Стражей Порядка"});
	}
	this.spImg = $("<img/>", {src:"https://img.ereality.ru/clan/1.gif"});
		
	var self = this;
	this.init = function() {
		self.spImg.css(self.buttonStyle);
		self.spLink.append(self.spImg);
		self.holder.append(self.spLink);
	}
}