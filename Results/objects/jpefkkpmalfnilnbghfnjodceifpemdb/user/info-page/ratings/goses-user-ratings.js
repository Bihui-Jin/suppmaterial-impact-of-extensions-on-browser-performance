var gosesUserRatingsClass = function(divHolder, buttonsStyle, serviseSender, userName) {
	this.divHolder = divHolder;
	this.buttonsStyle = buttonsStyle;
	this.serviseSender = serviseSender;
	this.userName = userName;
	this.gosLink = $("<a/>", {title:"Рейтинги персонажа"});
	this.gosImg = $("<img/>", {src:kango.io.getResourceUrl("res/goses.gif")});
	
	var self = this;
	this.init = function() {
		self.gosImg.css(self.buttonsStyle);	
		self.gosLink.append(self.gosImg).on("click", self.processClick);
		self.divHolder.append(self.gosLink);
	}
	
	this.processClick = function() {
		self.gosLink.off("click");
		self.serviseSender.send({
			method: "POST",
			url: "http://gosov.net/ajax/pers_info.ajax.php",
			data: {'sort_item': '', 'sort_type': '', 'page': '', 'pers': self.userName},
			headers: {
				"Accept":	"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Encoding":	"gzip, deflate",
				"Accept-Language":	"ru-ru,ru;q=0.8,en-us;q=0.5,en;q=0.3",
				"Content-Type": "application/x-www-form-urlencoded;",
				"Referer": "http://gosov.net/pers_info.html"
			}
		}, self.requestCallback);
	}
	
	this.requestCallback = function(response) {
		 var preparedHtml = response.substring(response.lastIndexOf('<table'), response.lastIndexOf('</span></td>'))
			.replace(new RegExp("/templates/GoldenClub/images",'g'), "http://gosov.net/templates/GoldenClub/images");	
		
		var fontHolder = $("<font/>", {size:-3}).html(preparedHtml);
		var mainHolder = $("#content").parent();
		
		mainHolder.prepend(fontHolder);
		
		self.gosLink.remove();
	}
}