var hideCorpsesClass = function(css, holder) {
	this.css = css;
	this.hideCorpsesStatus = false;
	this.popup = popup;
	this.view;
	this.m_fraki;
	this.closeButtonId = 'er-ext-close-button';
	var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {
			src: this.css.glassImgOff
		}).on('mousedown', function(event) {
			if (event.which == 1) {
				self.hideCorpses($(this));
			}

			if (event.which == 3) {
				self.onRigthClick($(this));
				event.preventDefault();
			}
		}).on('contextmenu', function(event) {
			return false;
		});


		return $("<a/>", {
			title: "Только живые на ОК"
		}).append(img).css(this.css.link);
	};

	this.hideCorpses = function(glassImg) {
		if (self.hideCorpsesStatus) {
			self.hideCorpsesStatus = false;
			glassImg.attr("src", self.css.glassImgOff);
		} else {
			self.hideCorpsesStatus = true;
			glassImg.attr("src", self.css.glassImgOn);
		}
		localStorage['hideCorpsesStatus'] = self.hideCorpsesStatus;
	};

	this.prepareView = function() {
		this.view = $(`
<table>
<tr> <td align="center"> Скрыть на ОК </td></tr>
<tr> <td> <label for="fr1"><input type="checkbox" id="fr1"> <img src="https://img.ereality.ru/a/1.gif" style="cursor: pointer"> Нейтралы</label></td></tr>
<tr> <td> <label for="fr2"><input type="checkbox" id="fr2"> <img src="https://img.ereality.ru/a/2.gif" style="cursor: pointer"> Игнесс</label></td></tr>
<tr> <td> <label for="fr3"><input type="checkbox" id="fr3"> <img src="https://img.ereality.ru/a/3.gif" style="cursor: pointer"> Раанор</label></td></tr>
<tr> <td> <label for="fr4"><input type="checkbox" id="fr4"> <img src="https://img.ereality.ru/a/4.gif" style="cursor: pointer"> Тарбис</label></td></tr>
<tr> <td> <label for="fr5"><input type="checkbox" id="fr5"> <img src="https://img.ereality.ru/a/5.gif" style="cursor: pointer"> Витарра</label></td></tr>
<tr> <td> <label for="fr6"><input type="checkbox" id="fr6"> <img src="https://img.ereality.ru/a/6.gif" style="cursor: pointer"> Дримнир</label></td></tr>
</table>
		`, {
			"class": "textS",
			"cellspacing": "4px"
		}).css(self.css.table);
		this.view.prepend(this.getExitButton());
		this.m_fraki = localStorage['m_fraki'];
		if (typeof this.m_fraki != "undefined") {
			this.m_fraki = JSON.parse(this.m_fraki);
		} else {
			this.m_fraki = {
				"fr1": false,
				"fr2": false,
				"fr3": false,
				"fr4": false,
				"fr5": false,
				"fr6": false
			};
		}
		this.view.find('input').each(function() {
			this.checked = self.m_fraki[this.id];
		});


	};

	this.init = function() {
		holder.append(this.buildLink());
		if (localStorage['hideCorpsesStatus'] == 'true') this.hideCorpses($("img[src*=sun-glasses]"));
		this.prepareView();
	}

	this.calculatePositionX = function(x) {
		return x -= this.view.width();
	};

	this.calculatePositionY = function(y) {
		return y -= this.view.height();
	};

	this.hide = function() {
		this.popup.hide();
		return this;
	};

	this.getExitButton = function() {
		return $("<tr>").append($("<td/>", {
			colspan: 2,
			align: "right"
		})).append($("<img/>", {
			id: this.closeButtonId,
			src: self.css.iconClose
		}));
	};

	this.onRigthClick = function(glassImg) {
		this.popup.show(this.view).move(this.calculatePositionX(glassImg.offset().left), this.calculatePositionY(glassImg.offset().top), 0, 0);
		this.bindListeners();
	};

	this.bindListeners = function() {
		this.view.find('input').change(function() {
			self.m_fraki[this.id] = this.checked;
			localStorage['m_fraki'] = JSON.stringify(self.m_fraki);
		});
		this.view.find("#" + this.closeButtonId).on("click", function() {
			$(this).attr("src", self.css.iconClose);
			self.hide();
		}).hover(function() {
			$(this).attr("src", self.css.iconCloseHover);
		}, function() {
			$(this).attr("src", self.css.iconClose);
		});

		this.view.find('label').hover(function() {
				$(this).css({
					'color': 'rgb(100,0,100)',
					'text-shadow': 'rgba(255,0,255,0.5) 0px 3px 3px',
					'cursor': 'pointer'
				});
			},
			function() {
				$(this).css({
					'color': 'rgb(100,100,100)',
					'text-shadow': '',
					'cursor': 'none'
				});
			});
	};

}