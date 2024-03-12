var sidzokuEstateClass = function() {
	this.sidzokuEstateLink = $("<a/>", {title:"Калькулятор помещика от Sidzoku", target:"_blank"});	
	this.sidzokuEstateImg = $("<img/>", {src:kango.io.getResourceUrl("res/sidzoku.gif")});
	var self = this;
	
	this.init = function(userName, estateHolder) {
		self.sidzokuEstateLink.attr("href", 'http://sidzoku.ru/landlord/?name=' + userName).append(self.sidzokuEstateImg);
		estateHolder.append(self.sidzokuEstateLink);	
	}
}