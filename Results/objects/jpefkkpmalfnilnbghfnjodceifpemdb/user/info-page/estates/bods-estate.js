var bodsEstateClass = function() {
	this.bodEstateLink = $("<a>", {title:"Просмотр поместья от СП", target:"_blank"});
	this.bodeEstateImg = $("<img>", {src: kango.io.getResourceUrl("res/yo-bods-search.png")});
	var self = this;
	
	this.init = function(userName, estateHolder) {		
		self.bodEstateLink.attr("href", 'http://usercp.ereality.ru/services/estate?name=' + userName).append(self.bodeEstateImg);
		estateHolder.append(self.bodEstateLink);
	}
}
