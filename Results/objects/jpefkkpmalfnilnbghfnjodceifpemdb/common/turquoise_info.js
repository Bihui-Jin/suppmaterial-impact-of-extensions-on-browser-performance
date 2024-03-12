var turquoiseInfoClass = function(css, holder) {
	this.css = css;
    this.holder = holder;
	this.status = false;
	this.timers = false;
	this.timer_island = new Date();
    this.timer_island_Green = new Date();
	this.timerId;
	this.arrowImg;
    this.closeButton;
    this.updateButton;
    this.dataHolder;

    this.timerIslandSpan;
    this.timerIslandGreenSpan;
    this.timerTradeSpan;
    this.timerPirateSpan;

    this.timersTD;

    this.sellTrade;
    this.buyTrade;

    this.pirateItem;
    this.pirateText;

    this.anchor = $("#div_chat_msg").parent().parent();

    this.iconIslandTurqouise = kango.io.getResourceUrl("res/island_turquoise.png");
    this.iconIslandUp = kango.io.getResourceUrl("res/island_up.png");
    this.iconIslandTrade = kango.io.getResourceUrl("res/island-trade.png");
    this.iconIslandGreen = kango.io.getResourceUrl("res/island-green.png");
    this.iconIslandTobac = kango.io.getResourceUrl("res/island-tobac.png");

    var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.turquoiseImg}).on('click', function() {
			self.turquoiseInfo();
		});

		return $("<a/>", {title:"Колониальные товары"}).append(img).css(this.css.link);
	};

	this.turquoiseInfo = function() {
		if (self.status) {
			self.status = false;
			self.dataHolder.hide();
			clearInterval(self.timerId);
		} else {
			this.showInfo();
		}
		localStorage['turquoiseInfoStatus'] = self.status;
	};

	this.showInfo = function() {
		this.getTradeInfo();
		this.getInfoPirat();
		this.refresh_timers();

		if (self.timers) {
			this.arrowImg.attr("src", kango.io.getResourceUrl("res/arrow_left.gif"))
                .attr("title", "Скрыть таймеры");
			self.timersTD.show();
		} else	{
			this.arrowImg.attr("src", kango.io.getResourceUrl("res/arrow_right.gif"))
                .attr("title", "Показать таймеры");
			self.timersTD.hide();
		}
      
		self.dataHolder.show();
		self.status = true;
		self.timerId = setInterval(function() {
			self.refresh_timers();
		},40000);	
	};

	this.init = function() {
		self.holder.append(this.buildLink());

		this.initInfo();
        this.initListeners();

		if (localStorage['turquoise_timers'] == 'true') {
            self.timers = true;
        }

		if (localStorage['turquoiseInfoStatus'] == 'true') {
            this.showInfo();
        }
	}

	this.initInfo = function() {
        self.dataHolder = $("<div/>");
        self.closeButton = $("<img/>", {src:kango.io.getResourceUrl("res/icon_close.gif")})
            .css(self.css.closeButton);
        self.updateButton = $("<img/>", {title:"Обновить", src:kango.io.getResourceUrl("res/updating.gif")})
            .css(self.css.updateButton);





        self.sellTrade = $('<div/>');
        self.buyTrade = $('<div/>');

	var pirateTrade = $("<div/>").append($("<img/>", {title:"Контрабандист", src:kango.io.getResourceUrl("res/Pirate.png")}),$("<img/>", {title:"Торговый Остров", src:self.iconIslandTrade}));



        self.pirateText = $('<span/>');
        self.pirateItem = $('<img/>', {width:"10%"});

        pirateTrade.append(self.pirateItem).append(self.pirateText);

	var infoTD = $("<td>", {width:210}).append(self.sellTrade).append(self.buyTrade).append(pirateTrade).append($("<div/>").append($("<br>"),$("<a/>", {text:"Наглядная карта островов", target:"_blank", "cursor":"pointer", href:"https://er-help.ru/s/151.php"})));

        self.timerIslandSpan = $("<span/>", {title:"До обновления месторождений", id:"timer_island"});
        self.timerIslandGreenSpan = $("<span/>", {title:"До обновления месторождений", id:"timer_island_Green"});
        self.timerTradeSpan = $("<span/>", {title:"До обновления магазинов", id:"timer_trade"});
        self.timerPirateSpan = $("<span/>", {title:"До обновления контрабандиста", id:"timer_pirat"});

        self.timersTD = $("<td/>", {width:90}).css(self.css.timersTD)
            .append($("<div/>").append($("<img/>", {src:self.iconIslandTurqouise})).append($("<a/>", {text:"БЗО ", href:"https://er-help.ru/scripts/map_bzo.php", target:"_blank"})).append(self.timerIslandSpan))
			.append($("<div>").append($("<img/>", {src:self.iconIslandGreen})).append($("<a/>", {text:"ЗЛО ", href:"https://er-help.ru/scripts/map_zlo.php", target:"_blank"})).append(self.timerIslandGreenSpan))
            .append($("<div>").append($("<img/>", {src:self.iconIslandTrade})).append($("<b/>", {text:"     "})).append(self.timerTradeSpan))
            .append($("<div>").append($("<img/>", {src:kango.io.getResourceUrl("res/Pirate.png")})).append($("<b/>", {text:"     "})).append(self.timerPirateSpan));





        var table = $("<table>");
        var tr = $('<tr>');

        tr.append(infoTD).append(self.timersTD);

        self.arrowImg = $("<img>").css(self.css.arrowImg);

        table.append(tr).append(self.arrowImg);

        self.dataHolder.append(self.closeButton).append(self.updateButton).append(table);

        var backgroundCss = "-moz-linear-gradient(center top , #fff, #bbb) repeat scroll 0 0 rgba(0, 0, 0, 0)";
		if (kango.browser.getName() != "firefox") {
            backgroundCss = "-webkit-linear-gradient(top, #fff,#bbb)";
		}

        self.anchor.append(
            $('<tr/>').append(
                $('<td/>').append(
                    self.dataHolder.css(self.css.dataHolder).css({"background": backgroundCss}).hide()
                )
            )
        );
	}

    this.initListeners = function() {
        self.closeButton.hover(function() {
            self.closeButton.css("opacity", 1)
        }, function() {
            self.closeButton.css("opacity", 0.5)
        }).on("click", function() {
            self.status = false;
            self.dataHolder.hide();
            clearInterval(self.timerId);
            localStorage['turquoiseInfoStatus'] = self.status;
        });

        self.updateButton.hover(function() {
            self.updateButton.css("opacity", 1)
        }, function() {
            self.updateButton.css("opacity", 0.5)
        }).on("click", function() {
            self.showInfo();
        });





        self.arrowImg.on("click", function() {
            self.timersTD.toggle();

            if (self.timers) {
                self.arrowImg.attr("src", kango.io.getResourceUrl("res/arrow_right.gif"))
                    .attr("title", "Показать таймеры");

                self.timers = false;
            } else {
                self.arrowImg.attr("src", kango.io.getResourceUrl("res/arrow_left.gif"))
                    .attr("title", "Скрыть таймеры");

                self.timers = true;
            }

            localStorage['turquoise_timers'] = self.timers;
        }).hover(function() {
            self.arrowImg.css("opacity", 1)
        }, function() {
            self.arrowImg.css("opacity", 0.5)
        });
    }

	this.getTradeInfo = function() {
		$.ajax({
			type: "POST",
			url: "/ajax/json.php",
			data: JSON.stringify({
				"controller": "colonialShop",
				"action": "init",
				"params": {},
				"client": 1
			}),
			success: self.prepareShopDataResponse,
			dataType: "json"
		});
	}

    this.prepareShopDataResponse = function(jsondata) {
        self.sellTrade.html('');
        self.buyTrade.html('');
        var deals=0;

        for (var key in jsondata.response.data.shopItems) {
            for (var key1 in jsondata.response.data.shopItems[key]) {
                var tradeImg;
                var text;
                var tradeHolder;
                

                if (jsondata.response.data.shopItems[key][key1].buy == 0) {
                    text = " по " + jsondata.response.data.shopItems[key][key1].sale + " (" +
                    self.getPercent(jsondata.response.data.shopItems[key][key1].sale, jsondata.response.items[key1][18]) +
                    "%)";

                    tradeImg = "<img title='Магазины покупают' src="+kango.io.getResourceUrl("res/buy.gif")+">";
                    tradeHolder = self.buyTrade;
                } else {
                    text = jsondata.response.data.shopItems[key][key1].count + " ед. по " +
                    jsondata.response.data.shopItems[key][key1].buy + " (" +
                    self.getPercent(jsondata.response.data.shopItems[key][key1].buy, jsondata.response.items[key1][18]) +
                    "%)";

                    tradeImg = "<img title='Магазины продают' src="+kango.io.getResourceUrl("res/sell.gif")+">";
                    tradeHolder = self.sellTrade;
                }

				var html = tradeImg +
									"<img src=\"" + self.getIslandPic(key) + "\" title=\"" + self.getIslandTitle(key) + "\">  " +
									"<img width=\"10%\" src=\"https://img.ereality.ru/w/" + jsondata.response.items[key1][7] + "\" title=\"" + jsondata.response.items[key1][6] + "\">" +
									"<span>" + text + "</span><br>";

                tradeHolder.append(html);
                deals++;
                
            }
        }
        switch (deals) {
            case 2:
                self.dataHolder.css({top: "-122px"});break
            case 3:
                self.dataHolder.css({top: "-146px"});break
            case 4:
                self.dataHolder.css({top: "-170px"});break
            case 5:
                self.dataHolder.css({top: "-194px"});break
            case 6:
                self.dataHolder.css({top: "-218px"});break    
        }
    }

    this.getPercent = function(amount, max) {
        return Math.floor(parseFloat(amount) / parseFloat(max) * 100);
    }

    this.getIslandPic = function(islandId) {
        switch (islandId) {
            case "25":
                return self.iconIslandTurqouise;
            case "26":
                return self.iconIslandUp;
            case "27":
                return self.iconIslandTrade;
            case "28":
                return self.iconIslandGreen;    
            case "29":
                return self.iconIslandTobac;    
        }

        return '';
    }

    this.getIslandTitle = function(islandId) {
        switch (islandId) {
            case "25":
                return "Бирюзовый Остров";
            case "26":
                return "Верхний Остров";
            case "27":
                return "Торговый Остров";
            case "28":
                return "Зелёный Остров";
            case "29":
                return "Табачный Остров";        
        }

        return '';
    }

	this.getInfoPirat = function() {
		kango.xhr.send({
            url: 'https://api.ereality.ru/contrabandist.txt',
            method: 'GET',
            contentType: 'json'
        }, function(data) {
			if (data.response != null) {
				self.pirateItem.attr("src", "https://img.ereality.ru/w/" + self.getItemImg(data.response.w_id))
                    .attr("title", self.getItemTitle(data.response.w_id));
				self.pirateText.text(" куплю " + (parseInt(data.response.count_max) - parseInt(data.response.count_sold)) + " ед.");
			} else {
				self.pirateItem.attr("src", "https://img.ereality.ru/smile/p/825.gif");
				self.pirateText.text(" не работает API");
			}
		});
	}

    this.getItemTitle = function(itemId) {
        switch (itemId) {
            case "1459":
                return "Сахар";
            case "1460":
                return "Хлопок";
            case "1461":
                return "Какао";
            case "1462":
                return "Парусина";
            case "1463":
                return "Табак";
        }



        return "";
    }

    this.getItemImg = function(itemId) {
        switch (itemId) {
            case "1459":
                return "res/sugar.png";
            case "1460":
                return "res/cotton.png";
            case "1461":
                return "res/cacao.png";
            case "1462":
                return "res/sails.png";
            case "1463":
                return "res/tobac.png";
        }


        return "p/825.gif";
    }

    this.formatTimeString = function(hours, minutes) {
        if (minutes < 10) {
            minutes =  "0" + minutes;
        }

        return hours + ":" + minutes;
    }

	this.getUpdateTime = function(time) {
		var ntime = new Date();
		var hour = Math.floor((time - ntime) / 3600000);
		var minutes =  Math.floor(((time - ntime) - hour * 3600000) / 60000);

        return self.formatTimeString(hour, minutes);
	}

	this.getTimeTrade = function() {
		var minutes = (new Date()).getMinutes();
		if (minutes > 0) {
            return self.formatTimeString(0,60 - minutes);
        }
        else {
			self.getTradeInfo();
			return self.formatTimeString(0, 0);
		}
	}

	this.getTimePirate = function() {
        var serverTime = new Date(new Date().getTime() + (3 + ((new Date()).getTimezoneOffset() / 60)) * 3600 * 1000);

		if (serverTime.getMinutes() > 0) {
            return self.formatTimeString(2 - serverTime.getHours() % 3, 60 - serverTime.getMinutes());
        }
		else {
			self.getInfoPirat();
            return self.formatTimeString(3, 0);
		}
	}
	
	this.refresh_timers = function() {
        var currentTime = new Date();
        var expectedTime = Date.parse(localStorage["island_time"]);
        var expectedTimeGreen = Date.parse(localStorage["island_time_green"]);

		if (self.timer_island < currentTime || self.timer_island_Green < currentTime) {
			if ((new Date().setTime(expectedTime) > currentTime) && (new Date().setTime(expectedTimeGreen) > currentTime)) {
				self.timer_island.setTime(expectedTime);
                self.timerIslandSpan.text(self.getUpdateTime(self.timer_island));
                self.timer_island_Green.setTime(expectedTimeGreen);
                self.timerIslandGreenSpan.text(self.getUpdateTime(self.timer_island_Green));
			} else {
                kango.xhr.send({
                    url: 'https://api.ereality.ru/geologist_map_update.txt',
                    method: 'GET',
                    contentType: 'json'
                }, function(data) {
					var timer = 0;
                    var timerGreen = 0;
                    if (data.response != null) {
						timer = data.response.generation["25"];
                        timerGreen = data.response.generation["28"];
					}

					if (timer != 0) {
						self.timer_island = new Date(timer * 1000);
						localStorage["island_time"] = self.timer_island;
                        self.timerIslandSpan.text(self.getUpdateTime(self.timer_island));
					} else {
                        self.timerIslandSpan.text(self.formatTimeString(0, 0));
                    }
                    if (timerGreen != 0) {
                        self.timer_island_Green = new Date(timerGreen * 1000);
                        localStorage["island_time_green"] = self.timer_island_Green;
                        self.timerIslandGreenSpan.text(self.getUpdateTime(self.timer_island_Green));
                    } else {
                        self.timerIslandGreenSpan.text(self.formatTimeString(0, 0));
                    }
				});
			}
		} else {
            self.timerIslandSpan.text(self.getUpdateTime(self.timer_island));
            self.timerIslandGreenSpan.text(self.getUpdateTime(self.timer_island_Green));
		}

		self.timerTradeSpan.text(self.getTimeTrade());
		self.timerPirateSpan.text(self.getTimePirate());
	}
}