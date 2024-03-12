var locationInfoClass = function(chatId, spanLocationId, spanLocationCountId) {
	this.chat = $('#' + chatId);
	this.spanLocation = $('#' + spanLocationId);
	this.spanLocationCount = $('#' + spanLocationCountId);
	
	var self = this;
	
	this.init = function() {
		self.spanLocation.click(function() { 
			self.chat.val(self.spanLocation.text() + ' Людей: ' + self.spanLocationCount.text());
		});
	}
	
}