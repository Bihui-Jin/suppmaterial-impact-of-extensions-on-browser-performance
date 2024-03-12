var dragonsScheduleClass = function(serviseSender) {
	this.serviseSender = serviseSender;
	this.dragonsHolder = $(".DragonBloodImg");
	
	var self = this;
	
	this.init = function() {	
		self.dragonsHolder.on("click", self.processClick);
	}
	
	this.processClick = function() {
		self.dragonsHolder.off("click");
		
		self.serviseSender.send({
			method: "GET",
			url: "https://api.ereality.ru/dragons_schedule.txt",
			headers: {
				"Accept":	"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
				"Accept-Encoding":	"gzip, deflate",
				"Accept-Language":	"ru-ru,ru;q=0.8,en-us;q=0.5,en;q=0.3",
				"Content-Type": "application/x-www-form-urlencoded;",
				"Referer": "https://ereality.ru"
			}
		}, self.requestCallback);
	}
	
	this.requestCallback = function(response) {
		var preparedHtml = response.replace(new RegExp("time",'g'),"<b>Врата на Остров Драконов на этой неделе открываются :</b>  ")
			.replace("dayName|", "").replace("Saturday|", "Суббота:").replace("Sunday|"," Воскресенье:").replace("Monday|", "Понедельник:").replace("Tuesday|", "Вторник:")
			.replace("Wednesday|","Среда:").replace("Thursday|","Четверг:").replace("Friday|","Пятница:").replace("Saturday|","Суббота:").replace("Sunday|","Воскресенье:");	
		  
		var fontHolder = $("<font size=\"-3\"></font>").html(preparedHtml);
		var mainHolder = $("#content").parent();
		
		mainHolder.prepend(fontHolder);
	}
}