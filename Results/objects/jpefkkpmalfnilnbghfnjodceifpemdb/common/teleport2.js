var teleportClass2 = function(css, holder, popup) {

	this.css = css;
	this.popup = popup;
	this.view;
	var self = this;	
	this.closeButtonId = "er-ext-close-button";
	
	
	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.teleportImg2}).on('click',  function() {
			self.onLeftClick($(this));return false; 
		});
		return $("<a/>", {title:"Телепорт абилками"}).append(img).css(this.css.link);
	};


	this.init = function() {
		holder.append(this.buildLink());
		this.prepareView();
	}

	this.onLeftClick = function(elitinnImg) {
		this.popup.show(this.view).move(this.calculatePositionX(elitinnImg.offset().left), this.calculatePositionY(elitinnImg.offset().top), 0, 0);
		this.bindListeners();
	};

	this.prepareView = function() {
		this.view = $("<table/>", {class:"textS", cellspacing:"4px"}).css(self.css.table);
		this.view.append(this.getExitButton());	
		this.view.append($("<tr>").append($("<td/>", {align:"left", "colspan":"2", "text":"Локация для телепорта абилками"})));	
		this.view.append($("<tr>").append($("<td/>", {align:"left"}).append($("<select>",{id:'selectteleportlocationovl'}).append($("<option>",{"value":"0", "text":"Врата Туманного города"})).append($("<option>",{"value":"1", "text":"Храм Листа"})).append($("<option>",{"value":"2", "text":"Телепорт Листа №1"})).append($("<option>",{"value":"3", "text":"Телепорт Листа №2"})).append($("<option>",{"value":"4", "text":"Телепорт Листа №3"})).append($("<option>",{"value":"5", "text":"Кладбище"})).append($("<option>",{"value":"6", "text":"Усганоли Хоунихи"})).append($("<option>",{"value":"7", "text":"Кэна ка Кхотсо"})).append($("<option>",{"value":"8", "text":"Тереба-о-Бисса"})).append($("<option>",{"value":"9", "text":"Тала Иголиига"})).append($("<option>",{"value":"10", "text":"Аскиру Чуратай"})).append($("<option>",{"value":"11", "text":"Центральная лесопилка"})).append($("<option>",{"value":"12", "text":"Южные опилки"})).append($("<option>",{"value":"13", "text":"Северные опилки"})).append($("<option>",{"value":"14", "text":"Литейная"})).append($("<option>",{"value":"15", "text":"Литейная 2"})).append($("<option>",{"value":"16", "text":"Полянка кудесников"})).append($("<option>",{"value":"17", "text":"Солидная Лавка"})).append($("<option>",{"value":"18", "text":"Турнирная арена"})).append($("<option>",{"value":"19", "text":"Хижина отшельника"})).append($("<option>",{"value":"20", "text":"Последний Оплот"})).append($("<option>",{"value":"21", "text":"Гильдии Мастерства"})).append($("<option>",{"value":"22", "text":"Порт"})).append($("<option>",{"value":"23", "text":"Большое поместье"})).append($("<option>",{"value":"24", "text":"Среднее поместье"})).append($("<option>",{"value":"25", "text":"Малое поместье"})).append($("<option>",{"value":"26", "text":"Пристанище следопыта"})))).append($("<td/>", {align:"left"}).append($("<input>",{"type":"button", "value":"ОВЛ"}).on('click',function(){
				$.get("https://www.ereality.ru/clan.php?action=use_abil&i=8&pl=1&id="+$("#selectteleportlocationovl").val(), function() {});}))));
		this.view.append($("<tr>").append($("<td/>", {align:"left"}).append($("<select>",{id:'selectteleportlocationopp'}).append($("<option>",{"value":"0", "text":"Телепорт Песка №1"})).append($("<option>",{"value":"1", "text":"Телепорт Песка №2"})).append($("<option>",{"value":"2", "text":"Телепорт Песка №3"})).append($("<option>",{"value":"3", "text":"Храм Песка"})).append($("<option>",{"value":"4", "text":"Лесопилка Карлыча"})).append($("<option>",{"value":"5", "text":"Кузница"})).append($("<option>",{"value":"6", "text":"Заброшенный завод"})).append($("<option>",{"value":"7", "text":"Живительный Источник"})).append($("<option>",{"value":"8", "text":"Живительный Источник №2"})).append($("<option>",{"value":"9", "text":"Живительный Источник №3"})).append($("<option>",{"value":"10", "text":"Живительный Источник №4"})).append($("<option>",{"value":"11", "text":"Гильдии Выбора"})).append($("<option>",{"value":"12", "text":"Лаборатория Ксенологов"})).append($("<option>",{"value":"13", "text":"Диспетчерский Центр"})))).append($("<input>",{"type":"button", "value":"ОПП"}).on('click',function(){
				$.get("https://www.ereality.ru/clan.php?action=use_abil&i=8&pl=3&id="+$("#selectteleportlocationopp").val(), function() {});})));
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
		return $("<tr>").append($("<td/>", {"colspan":"2", align:"right"}).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose})));
	};	
}
			
