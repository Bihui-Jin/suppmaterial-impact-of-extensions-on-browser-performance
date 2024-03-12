var elitinnClass = function(css, holder, popup, anotherEliteTournamentMessage) {

	this.css = css;
	this.popup = popup;
	this.elitinnStatus = true;
	this.view;
	var self = this;	
	this.closeButtonId = "er-ext-close-button";
	
	
	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.elitinnImgOn}).on('click',  function() {
			self.onLeftClick($(this));return false; 
		});

		return $("<a/>", {title:"Участвовать в элитке"}).append(img).css(this.css.link);
	};

	this.elitinn = function(elitinnImg) {
		if (self.elitinnStatus) {
			self.elitinnStatus = false;
			elitinnImg.attr("src", self.css.elitinnImgOff);
		} else {
			self.elitinnStatus = true;
			elitinnImg.attr("src", self.css.elitinnImgOn);
		}
		localStorage['elitinnStatus'] = self.elitinnStatus;
	};

	this.init = function() {
		holder.append(this.buildLink());
		if (localStorage['elitinnStatus'] == 'false') this.elitinn($("img[src*=elitin]"));
		this.prepareView();
	}

	this.onLeftClick = function(elitinnImg) {
		this.popup.show(this.view).move(this.calculatePositionX(elitinnImg.offset().left), this.calculatePositionY(elitinnImg.offset().top), 0, 0);
		this.bindListeners();
	};

	this.prepareView = function() {
		this.view = $("<table/>", {class:"textS", cellspacing:"4px"}).css(self.css.table);
		this.view.append(this.getExitButton());	
		this.view.append($("<tr>").append($("<td/>", {align:"left", "text":"Бои элитного турнира"})));	
		this.view.append(this.goElitInn());
		this.view.append(this.goElitOut());
		this.view.append($("<td/>", {align:"left"}).append($("<a/>", {href:"https://er-help.ru/index.php/informatsiya/elitnyj-turnir-rejtingi", text:'Статистика турнира', 'target':'_blank'})));
	};
	

	this.calculatePositionX = function(x) {
		return x -= this.view.width();
	};
	
	this.calculatePositionY = function(y) {
		return y -= this.view.height();
	};
		
	this.bindListeners = function() {
		this.view.find("#" + this.closeButtonId).on("click", function() {
			$(this).attr("src", self.css.iconClose);
			self.hide();
		}).hover(function() {
			$(this).attr("src", self.css.iconCloseHover);
		}, function() {
			$(this).attr("src", self.css.iconClose);
		});

	};
	
	this.hide = function() {
		this.popup.hide();
		
		return this;
	};
	
	this.getExitButton = function() {
		return $("<tr>").append($("<td/>", {align:"right"}).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose})));
	};	
		
	this.goElitInn = function() {
	return $("<tr>").append($("<td/>", {align:"left"}).append($("<input/>", {id:"botFilter_sve", value:"Вступить в заявку", "type":"button", "onclick":"$.ajax({url:'/ajax/json.php', type: 'POST', data: JSON.stringify({'controller': 'tournamentDemand',	'action': 'join'}), success: function (jsondata) {(typeof jsondata.response.core.messages === 'undefined')?(((typeof jsondata.response.core.errors === 'undefined')?(messageElitInn='Не известный статуст сообщения'):(messageElitInn=jsondata.response.core.errors[0]))):(messageElitInn = ("+anotherEliteTournamentMessage+"==true)?(((jsondata.response.core.messages[0]).indexOf('Бой начнется')>-1)?('Вы вступили в заявку! Ждём подтверждение соперника'):('Вы вступили в заявку! Копим монеты')):(jsondata.response.core.messages[0])); var timenow = new Date(new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000); $('#div_chat_msg').append($('<span>', {text:((timenow.toLocaleTimeString('ru-RU').length==7)?('0'+timenow.toLocaleTimeString('ru-RU')):(timenow.toLocaleTimeString('ru-RU'))), class:'time3', id:'t_0'})).append($('<span>', {text:' Оповещение плагина: ', class:'nick', id:'n_0'})).append($('<span>', {text:messageElitInn})).append($('<br>')); $('#div_chat_msg').scrollTop($('#div_chat_msg').prop('scrollHeight'));}, dataType: 'json'})"})));
	};
		
	this.goElitOut = function() {
		return $("<tr>").append($("<td/>", {align:"left"}).append($("<input/>", {id:"elitturnbutton_out", value:"Покинуть заявку", "type":"button", "onclick":"$.ajax({url:'/ajax/json.php', type: 'POST', data: JSON.stringify({'controller': 'tournamentDemand',	'action': 'leave'}), success: function (jsondata) {(typeof jsondata.response.core.messages === 'undefined')?(messageElitOut='Вы не были в заявке!'):(messageElitOut = jsondata.response.core.messages[0]); var timenow = new Date(new Date().getTime() +(3 +((new Date()).getTimezoneOffset()/60)) * 3600 * 1000);  $('#div_chat_msg').append($('<span>', {text:((timenow.toLocaleTimeString('ru-RU').length==7)?('0'+timenow.toLocaleTimeString('ru-RU')):(timenow.toLocaleTimeString('ru-RU'))), class:'time3', id:'t_0'})).append($('<span>', {text:' Оповещение плагина: ', class:'nick', id:'n_0'})).append($('<span>', {text:messageElitOut})).append($('<br>')); $('#div_chat_msg').scrollTop($('#div_chat_msg').prop('scrollHeight'));}, dataType: 'json'});"})));
	};
}
			
