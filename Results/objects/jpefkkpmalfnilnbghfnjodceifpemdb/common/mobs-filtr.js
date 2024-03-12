var mobsfiltrClass = function(css, holder, popup) {
	this.css = css;
	this.popup = popup;
	this.mobsfiltrStatus = true;
	this.view;
	var self = this;	
	this.closeButtonId = "er-ext-close-button";
	
	
	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.mobsfiltrImgOn}).on('click',  function() {
			self.onLeftClick($(this));return false; 
		});

		return $("<a/>", {title:"Фильтр ботов"}).append(img).css(this.css.link);
	};

	this.mobsfiltr = function(mobsfiltrImg) {
		if (self.mobsfiltrStatus) {
			self.mobsfiltrStatus = false;
			mobsfiltrImg.attr("src", self.css.mobsfiltrImgOff);
		} else {
			self.mobsfiltrStatus = true;
			mobsfiltrImg.attr("src", self.css.mobsfiltrImgOn);
		}
		localStorage['mobsfiltrStatus'] = self.mobsfiltrStatus;
	};

	this.init = function() {
		holder.append(this.buildLink());
		if (localStorage['mobsfiltrStatus'] == 'false') this.mobsfiltr($("img[src*=mobfil]"));
		this.prepareView();
	}

	this.onLeftClick = function(mobsfiltrImg) {
		this.popup.show(this.view).move(this.calculatePositionX(mobsfiltrImg.offset().left), this.calculatePositionY(mobsfiltrImg.offset().top), 0, 0);
		this.bindListeners();
	};

	this.prepareView = function() {
		this.view = $("<table/>", {class:"textS", cellspacing:"4px"}).css(self.css.table);
		this.view.append(this.getExitButton());	
		this.view.append($("<tr>").append($("<td/>", {align:"left", "text":"Видимость мобов"})));	
		this.view.append(this.getLvlControl());
		this.view.append(this.getSaveButton());
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
	
	this.getLvlControl = function() {
		return $("<tr>").append($("<td/>", {align:"right"}).append($("<input/>", {id:"botFilter_0", "type":"text", width:50, min:0, max:25}),$("<br/>"),$("<input/>", {id:"botFilter_1", "type":"text", width:50, min:0, max:25})));
	};
	
	this.getSaveButton = function() {
		return $("<tr>").append($("<td/>", {align:"left"}).append($("<input/>", {id:"botFilter_sve", value:"Установить", "type":"button", "onclick":"botFilter_0=document.getElementById('botFilter_0').value; botFilter_1=document.getElementById('botFilter_1').value; $.ajax({url:'/options.php?action=interface&open_mode=7', type: 'POST', data:'botFilter0='+botFilter_0+'&botFilter1='+botFilter_1, dataType: 'html'}); self.chat.html(0, '3', '0', self.clock.timeStr(), 'Оповещение плагина', self.user.name,  '666666', 'Видимость ботов установлена с '+Math.min(Math.max(Math.min(botFilter_0,botFilter_1),0),25)+' по '+Math.min(Math.max(Math.max(botFilter_0,botFilter_1),0),25)+'!'); self.chat.scrollDown();"})));
	};
}
			
