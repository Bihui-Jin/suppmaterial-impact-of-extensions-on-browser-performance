var sheerUserAnalyzerClass = function(divHolder, buttonsStyle, serviseSender, userName) {
	this.divHolder = divHolder;
	this.userName = userName;
	this.buttonsStyle = buttonsStyle;
	this.serviseSender = serviseSender;
	this.sheerLink = $("<a/>", {title:"Просмотр игрока от Sheer Power"});
	this.sheerImg = $("<img/>", {src:kango.io.getResourceUrl("res/sheer.gif")});	
	
	var self = this;
	this.init = function() {
		self.sheerImg.css(self.buttonsStyle);
		self.sheerLink.append(self.sheerImg).on('click', self.processClick);
		
		self.divHolder.append(self.sheerLink);
	}
	this.processClick = function() {
		self.sheerLink.off("click");
		
		self.serviseSender.send({
			method: "POST",
			url: "http://sp.erclans.ru/evgeska_prof.php?calc=heroesinfo",
			data: {'prof': CP1251urlencode(self.userName), 'submit': 'просмотреть'},
			headers: {
				"Accept":	"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Encoding":	"gzip, deflate",
				"Accept-Language":	"ru-ru,ru;q=0.8,en-us;q=0.5,en;q=0.3",
				"Content-Type": "application/x-www-form-urlencoded;",
				"Referer": "http://sp.erclans.ru/evgeska_prof.php?calc=heroesinfo"
				},
			overrideMimeType:    "text/html;charset=windows-1251",
		}, self.requestCallback);
	}
	this.requestCallback = function(response) {
		var preparedHtml = response.substring(response.indexOf('<table width="95%" border="1" bgcolor="D7D7D7">'), response.lastIndexOf('<br><br><div align="center">'))
			.replace(new RegExp("evgeska/images/",'g'), "http://sp.erclans.ru/evgeska/images/");	
		
		var fontHolder = $("<font/>", {size:-3}).html(preparedHtml);
		var mainHolder = $("#content").parent();
		
		mainHolder.prepend(fontHolder);
		
		self.sheerLink.remove();		
	}
	
}			