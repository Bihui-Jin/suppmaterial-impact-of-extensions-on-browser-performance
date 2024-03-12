// ==UserScript==
// @name        uid-search
// @include     www.ereality.ru/ldh/*mode=90&*
// @require 	tools/jquery.js
// @require     tools.js
// @all-frames  true
// ==/UserScript==



var CrossSessions2Class = function() {
	this.ovTimeOut = 5 * 60;
	
	this.table = $('table:last');
	this.trs = this.table.find('tr');
	this.trsRows = this.trs.slice(1, this.trs.length - 1);
	
	this.userNames = [];
	this.sessions = {};
	this.trsCollection = $();
	
	var self = this;
	
	this.init = function() {
		self.prepareSessions();
		self.prepareOVTrCollection();
		
		self.prepareRadioPanel();
	};
	
	this.prepareSessions = function() {
		var userNameRegExp = new RegExp('(.*) \\[.+\\]', 'i');
		var sessionTimeRegExp = new RegExp('(.*) - (.*) \\(.+\\)', 'i');
		var dateFormatRegExp = new RegExp('(.*)-(.*)-(.*) (.*):(.*):(.*)', 'i');
		
		self.trsRows.each(function() {
			var userName = $(this).find('td:eq(3)').text().match(userNameRegExp)[1];
			var sessionsTime = $(this).find('td:eq(4)').text().match(sessionTimeRegExp);
			
			if (typeof self.sessions[userName] == 'undefined') {
				self.sessions[userName] = [];
				self.userNames.push(userName);
			}

			self.sessions[userName].push({
				'sessionStart': self.getDateTimeStamp(sessionsTime[1].match(dateFormatRegExp)),
				'sessionEnd': self.getDateTimeStamp(sessionsTime[2].match(dateFormatRegExp)),
				'tr': this
			});
		});		
	};
	
	this.getDateTimeStamp = function(dateArray) {
		var date =  new Date();
		
		date.setYear(dateArray[1]);
		date.setMonth(dateArray[2]);
		date.setDate(dateArray[3]);
		date.setHours(dateArray[4]);
		date.setMinutes(dateArray[5]);
		date.setSeconds(dateArray[6]);
			
		return date.getTime() / 1000;
	};
	
	this.prepareOVTrCollection = function() { 
		for (fSessions in self.sessions[self.userNames[0]]) {
			for (SSessions in self.sessions[self.userNames[1]]) {
				if (self.sessions[self.userNames[1]][SSessions]["sessionStart"] > self.sessions[self.userNames[0]][fSessions]["sessionEnd"] 
					|| self.sessions[self.userNames[1]][SSessions]["sessionEnd"] < self.sessions[self.userNames[0]][fSessions]["sessionStart"]) {
						if (self.sessions[self.userNames[0]][fSessions]["sessionEnd"] < self.sessions[self.userNames[1]][SSessions]["sessionStart"]) {
							break;
						}
				}
				else {
					var crossTime = 0;
					if (self.sessions[self.userNames[0]][fSessions]["sessionStart"] > self.sessions[self.userNames[1]][SSessions]["sessionStart"]) {				
						crossTime = self.sessions[self.userNames[1]][SSessions]["sessionEnd"] - self.sessions[self.userNames[0]][fSessions]["sessionStart"];
					}
					else {
						crossTime = self.sessions[self.userNames[0]][fSessions]["sessionEnd"] - self.sessions[self.userNames[1]][SSessions]["sessionStart"];
					}

					if (crossTime > self.ovTimeOut && 
						self.sessions[self.userNames[0]][fSessions]["sessionEnd"] - self.sessions[self.userNames[0]][fSessions]["sessionStart"] > self.ovTimeOut
						&& self.sessions[self.userNames[1]][SSessions]["sessionEnd"] - self.sessions[self.userNames[1]][SSessions]["sessionStart"]) {
							self.trsCollection = self.trsCollection.add(self.sessions[self.userNames[1]][SSessions]["tr"]).add(self.sessions[self.userNames[0]][fSessions]["tr"]);
					}
				}
			}
		}		
	};
	
	this.prepareRadioPanel = function() {
		var checkboxContainer = $("<div/>").append($("<b/>",{text:"Показывать:"})).append("<br/>");
		//var checkboxContainer = $('<div><b>Показывать:</b><br></div>');

		var allRadio = $("<span/>").append($("<label/>",{text:"Все"}).append($("<input/>",{type:"radio", name:"ext_redio", checked:"checked"}))).append("<br/>");
		var ovRadio = $("<span/>").append($("<label/>",{text:"ОВ"}).append($("<input/>",{type:"radio", name:"ext_redio", checked:"checked"})));
		/*var allRadio = $('<span><label>Все<input type="radio" name="ext_redio" checked/></label></span><br>');
		var ovRadio = $('<span><label>ОВ<input type="radio" name="ext_redio"/></label></span>');*/

		checkboxContainer.append(allRadio).append(ovRadio);
		self.table.before($("<br/><hr>")).before(checkboxContainer).before($("<br/><hr>"));

		allRadio.on('change', function() {
			self.trs.show();
		});

		ovRadio.on('change', function() {
			self.trsRows.hide();

			self.trsCollection.show();
		});
		
	}
}

$(document).ready(function() {
	new CrossSessions2Class().init();
	
});
