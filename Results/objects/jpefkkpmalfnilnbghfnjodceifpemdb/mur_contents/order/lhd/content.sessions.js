// ==UserScript==
// @name        sessions
// @include     www.ereality.ru/ldh/*mode=2&*
// @require 	tools/jquery.js
// @require     tools.js
// @all-frames  true
// ==/UserScript==


var SessionsClass = function() {
	this.ip = {
		'map': {},
		'set': $()
	};
	
	this.uid = {
		'map': {},
		'set': $()
	};
	
	this.trs = $('table:last').find('tr');
	this.trsRows = this.trs.slice(1, this.trs.length - 1);
	
	var self = this;
	
	this.init = function() {
		self.prepareSets();
		self.prepareRadioPanel();
	}
	
	this.prepareSets = function() {
		self.trsRows.each(function(i) {
			var current = $(this);
			var uid = current.find('td:eq(1)>a').text();
			var ip = current.find('td:eq(2)>a').text();
			
			if (typeof self.ip['map'][ip] == "undefined") {
				self.ip['map'][ip] = true;
				self.ip['set'] = self.ip['set'].add(this);
			}
			
			if (typeof self.uid["map"][uid] == "undefined") {
				self.uid['map'][uid] = true; 
				self.uid['set'] = self.uid['set'].add(this);
			}	
		});
	};
	
	this.prepareRadioPanel = function() {
		var checkboxContainer = $("<div/>").append($("<b/>",{text:"Показывать:"})).append("<br/>");
		//var checkboxContainer = $("<div/>").append($("<b/>",{text:"Показывать:"})).append("<br/>");

		var allRadio = $("<span/>").append($("<label/>",{text:"Все"}).append($("<input/>",{type:"radio", name:"ext_redio", checked:"checked"}))).append("<br/>");
		var ovRadio = $("<span/>").append($("<label/>",{text:"Уникальные IP"}).append($("<input/>",{type:"radio", name:"ext_redio", checked:"checked"}))).append("<br/>");
		var ovRadio = $("<span/>").append($("<label/>",{text:"Уникальные UID"}).append($("<input/>",{type:"radio", name:"ext_redio", checked:"checked"}))).append("<br/>");
		/*var allRadio = $('<span><label>Все<input type="radio" name="ext_redio" checked/></label></span><br>');
		var ipRadio = $('<span><label>Уникальные IP <input type="radio" name="ext_redio"/></label></span><br>');
		var uidRadio = $('<span><label>Уникальные UID<input type="radio" name="ext_redio"/></label></span><br>');*/

		checkboxContainer.append(allRadio).append(ipRadio).append(uidRadio);
		$('form[name="FD"]').after(checkboxContainer).after($("<br/><hr>"));

		allRadio.on('change', function() {
			self.trsRows.show();
		});
		ipRadio.on('change', function() {
			self.trsRows.hide();

			self.ip["set"].show();
		});
		uidRadio.on('change', function() {
			self.trsRows.hide();

			self.uid["set"].show();
		});
		
	}
}

$(document).ready(function() {
	new SessionsClass().init();
});


