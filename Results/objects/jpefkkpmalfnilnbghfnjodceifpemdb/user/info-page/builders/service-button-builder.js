
var serviceButtonBuilderClass = function(configOptions, userName, serviceRequestSender, infoButtonsCss) {
	this.configOptions = configOptions;
	this.infoButtonsCss = infoButtonsCss;
	this.userName = userName;	
	this.serviceRequestSender = serviceRequestSender;
	this.divHolder = $("#content > div:contains('Статус:')");
	
	var self = this;
	
	this.init = function() {
		self.divHolder.append("<p></p>");
		
		if (self.configOptions.info) {
			new sheerUserAnalyzerClass(self.divHolder, self.infoButtonsCss, self.serviceRequestSender, self.userName).init();
		}
		/*	
		if (self.configOptions.faceshop) {		
			new yobodsDressRoomClass(self.divHolder, self.infoButtonsCss, self.userName).init();
		}
			
		if (self.configOptions.efimerka) {
			new efimerkaClass(self.divHolder, self.infoButtonsCss, self.userName).init();
		}*/

		if (self.configOptions.armory) {
			new sidzokuDressRoomClass(self.divHolder, self.infoButtonsCss, self.userName).init();
		}
		if (self.configOptions.spdressroom) {
			new spDressRoomClass(self.divHolder, self.infoButtonsCss, self.userName).init();
		}/*
		if (self.configOptions.zk) {
			new gosesUserRatingsClass(self.divHolder, self.infoButtonsCss, self.serviceRequestSender, self.userName).init();
		}*/
		
		if (self.configOptions.glamurstupki) {		
			new glamsUserAnalyzerClass(self.divHolder, self.infoButtonsCss, self.serviceRequestSender, self.userName).init();
		}
		if (self.configOptions.nickhistory) {		
			new NickHistorylass($(".charSearch").parent(), {"border": "1px solid #AAAAAA", "cursor": "pointer"}, self.userName).init();
		}
		$(".content_bg").css( "height", "+=25" );

	}
}