var soundsClass = function(css, holder, popup) {
	this.css = css;
	this.popup = popup;
	this.soundsStatus = true;
	this.view;
	this.coreAudio;
	var self = this;
	this.closeButtonId = "er-ext-close-button";

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.soundsImgOn}).on('click', function() {
			self.sounds($(this));
		}).on('contextmenu', function() {
			self.onRigthClick($(this));return false; 
		});

		return $("<a/>", {title:"Выкл/вкл звуков"}).append(img).css(this.css.link);
	};

	this.sounds = function(soundsImg) {
		if (self.soundsStatus) {
			self.soundsStatus = false;
			soundsImg.attr("src", self.css.soundsImgOff);
		} else {
			self.soundsStatus = true;
			soundsImg.attr("src", self.css.soundsImgOn);
		}
		localStorage['soundsStatus'] = self.soundsStatus;
	};

	this.init = function() {
		holder.append(this.buildLink());
		if (localStorage['soundsStatus'] == 'false') this.sounds($("img[src*=sound-o]"));
		this.prepareView();
		setTimeout(function() {
				if ($("#coreAudio").length) {
				self.coreAudio = $("#coreAudio")[0];
				if (localStorage['soundsVolume']==undefined) {self.coreAudio.volume=1} 
					else {self.coreAudio.volume=+localStorage['soundsVolume']}
			}
	}, 300);

}

	this.onRigthClick = function(soundsImg) {
		this.popup.show(this.view).move(this.calculatePositionX(soundsImg.offset().left), this.calculatePositionY(soundsImg.offset().top), 0, 0);
		this.bindListeners();
	};

	this.prepareView = function() {
		this.view = $("<table/>", {class:"textS", cellspacing:"4px"}).css(self.css.table);
		this.view.append(this.getExitButton());	
		this.view.append(this.getVolumeControl());
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
		$("#mur_vol", self.view).val(self.coreAudio.volume);
		$("#mur_vol", self.view).on("change", function() {
			self.coreAudio.volume = this.value;
			if (self.soundsStatus) {
				self.coreAudio.src = "mp3/trade.mp3";
				self.coreAudio.play();
			}
			localStorage['soundsVolume']=this.value;
		});

	};
	
	this.hide = function() {
		this.popup.hide();
		
		return this;
	};
	
	this.getExitButton = function() {
		return $("<tr/>").append($("<td/>", {colspan:2, align:"right"}).append($("<img/>", {"id":this.closeButtonId, "src":self.css.iconClose})));
	};

	this.getVolumeControl = function() {
		return $("<tr>").append($("<td/>", {align:"left"})).append($("<input/>", {id:"mur_vol", "type":"range",  "orient":"vertical", min:0, max:1, value:1, step:"0.1", style:"-webkit-appearance: slider-vertical;height:70px;width:20px"}));
	};

}
			
