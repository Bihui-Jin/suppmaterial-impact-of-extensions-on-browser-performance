var glamsUserAnalyzerClass = function(divHolder, buttonsStyle, serviseSender, userName) {			
	this.divHolder = divHolder;
	this.userName = userName;
	this.buttonsStyle = buttonsStyle;
	this.serviseSender = serviseSender;
	this.glamLink = $("<a/>", {title:"Просмотр игрока от Гламурный Клуб"});
	this.glamImg = $("<img/>", {src:kango.io.getResourceUrl("res/glamurs.gif")});
		
	var self = this;

	this.init = function () {
		self.glamImg.css(self.buttonsStyle);
		self.glamLink.append(self.glamImg).on("click", self.processClick);
		
		self.divHolder.append(self.glamLink);	
	}
	this.processClick = function() {
		self.glamLink.off("click");
	
		self.serviseSender.send({
			method: "GET",
			url: "http://xn--80abg0adccjst1af.xn--p1ai/~" + (self.userName) + '&no-base=true',
			headers: {
				"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Encoding":	"gzip, deflate",
				"Accept-Language":	"ru-ru,ru;q=0.8,en-us;q=0.5,en;q=0.3",
				"Content-Type": "application/x-www-form-urlencoded;",
				"Referer": "ER-plugin" // ВАЖНО
			},
			overrideMimeType:    "text/html;charset=utf-8",
		}, self.requestCallback);
	}
	this.requestCallback = function(response) {
		var preparedHtml = '<center>' + response.substring(response.indexOf('<div class="d_right">') + 21, response.indexOf('<br class="eoi">') - 6) + '<center>';	

		var fontHolder = $("<font/>", {size:-3}).html(preparedHtml);
		var mainHolder = $("#content").parent();
		
		mainHolder.prepend(fontHolder);
		
		self.glamLink.remove();
	}
}