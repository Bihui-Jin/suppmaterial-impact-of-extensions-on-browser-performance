// ==UserScript==
// @name        trade-transfer
// @include     www.ereality.ru/ldh/*mode=61&*
// @require 	tools/jquery.js
// @require     tools.js
// @all-frames  true
// ==/UserScript==
	

var TradeTransferClass = function() {
	this.tableTRs = $('table:last').find('tr');
	
	var self = this;
	
	this.init = function() {
		this.initAdditionTr(this.count());	
	}
	
	this.count = function() {
		var total = 0;
		var price = 0;
		var basePrise = 0;

		self.tableTRs.slice(2, self.tableTRs.length - 1).each(function(i) {
			var current = $(this);
			total += Number(current.find('td:eq(5)').text());
			price += Number(current.find('td:eq(6)>span').text());
			basePrise += Number(current.find('td:eq(7)>span').text());
		});	
		
		return {
			"total": total,
			"price": price,
			"basePrise": basePrise
		};
	};
	
	this.initAdditionTr = function(numbers) {
		var tr = $('<tr/>', {bgcolor:"#BBBBBB"})
			.append($('<td/>', {text:"Итого:"}),
			$('<td/>'),
			$('<td/>', {width:200}),
			$('<td/>', {width:70}),
			$('<td/>', {width:60}),
			$('<td/>', {align:"right", style:"color:rgb(0, 0, 204)", text:numbers.total}),
			$('<td/>', {align:"right", style:"color:rgb(0, 0, 204)", width:70, text:numbers.price}),
			$('<td/>', {align:"right", style:"color:rgb(0, 0, 204)", width:70, text:numbers.basePrise}),
			$('<td/>'),
			$('<td/>', {width:70})
			);
			
		self.tableTRs.slice(2, self.tableTRs.length - 1).last()
			.after(tr);
	}
	
}	

$(document).ready(function() {
	new TradeTransferClass().init();
});
