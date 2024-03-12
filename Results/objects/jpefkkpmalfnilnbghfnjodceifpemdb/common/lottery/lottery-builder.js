var lotteryBuilderClass = function(lottery) {
	this.lottery = lottery;
	this.autofillButton = $('<img src="' + kango.io.getResourceUrl("res/autofill.gif") + '">');

	var self = this;
	
	this.init = function() {
		self.buildListener();
		
		$('form#FieldsForm').before(self.autofillButton);
	};
	
	this.buildListener = function() {
		if ($('#ImgField15', top.frames.main.document).length > 0) {
			self.autofillButton.on('click', function() {
				self.lottery.fillSilverTicket();
			});
			
			return;
		}
		
		self.autofillButton.on('click', function() {
			self.lottery.fillGoldTicket();
		});		
	};
};