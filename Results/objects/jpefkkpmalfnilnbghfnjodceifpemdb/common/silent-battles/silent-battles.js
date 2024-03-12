var silentBattlesClass = function(popup, chatMsgSelector, openImg, counterCss, builderCss) {
    this.popup = popup;
    this.chatMsgSelector = chatMsgSelector;

    this.css = counterCss;
    this.builderCss = builderCss;

    this.openImg = openImg;

    this.infoTds = {};

    this.battleData = {};

    this.infoMap = {
        'hits': 'Урон',
        'experience': 'Опыт',
        'silver': 'Серебро',
        'piastr': 'Пиастры',
        'hunter': 'Охотник',
        'kaptan': 'Капитан',
        'pvp': 'PvP',
        'gold': 'Золото',
        'mooh': 'Полемарх',
        'plazm': 'Эктоплазма'
    }

    this.lastBattleTd;


    this.view;
    this.hideTimer;
    this.tabHolder;

    this.copyLinkId = "er-ext-copy-link";
    this.closeButtonId = "er-ext-close-button";
    this.clearLinkId = "er-ext-clear-link";
    this.runLinkId = "er-ext-run-link";
    this.chatNoticeId = "er-ext-chat-notice-link";

    this.inProcess = false;

    var self = this;
    this.init = function() {
        if (typeof localStorage['silentBattleRun'] != 'undefined' && localStorage['silentBattleRun']) {
            self.inProcess = localStorage['silentBattleRun'] == 'true';
        }

        if (self.inProcess) {
            self.openImg.attr('src', self.builderCss.openLinkActiveImg);
        }

        this.prepareView();
    };

    this.prepareView = function() {
        this.view = $("<table/>");
        this.view.append($('<tr>').append($("<td/>", {align:"right", colspan:2}).append($(this.getExitButton()))));
        this.view.append($('<tr>').append($("<td/>", {align:"center", colspan:2}).append($("<hr/>"))));

        for(var i in self.infoMap) {
            var tr = $('<tr/>').css(self.css.textStyle);
            var infoTd = $('<td/>', {text:0});

            tr.append('<td>' + self.infoMap[i] + '</td>')
                .append(infoTd);

            self.infoTds[i] = infoTd;

            this.view.append(tr);
        }

        this.lastBattleTd = $('<td/>', {align:"center", colspan:2});
        this.view.append($('<tr/>').append(this.lastBattleTd));

        this.view.append($('<tr>').append($("<td/>", {align:"center", colspan:2}).append($("<hr/>"))));
        this.view.append(this.getBottomPanel());
    };


    this.show = function(positionX, positionY) {
        if (typeof localStorage['nBattleData'] != 'undefined') {
            self.battleData = JSON.parse(localStorage['nBattleData']);

            for (var i in self.battleData) {
                if (typeof self.infoTds[i] != 'undefined') {
                    self.infoTds[i].html(self.battleData[i]);
                }
            }


            if (typeof self.battleData['link'] != 'undefined') {
                var link = $('<a/>', {target:"_blank", text:"Крайний бой"}).attr('href', self.battleData['link'])
                    .css(self.css.textStyle).css({'cursor': 'pointer'});

                self.lastBattleTd.html('').append(link);
            }
        }

        this.bindListeners();

        this.popup.show(this.view).move(this.calculatePositionX(positionX), this.calculatePositionY(positionY), 0, 0);

        return this;
    };

    this.calculatePositionX = function(x) {
        return x -= this.view.width();
    };

    this.calculatePositionY = function(y) {
        return y -= this.view.height();
    };

    this.hide = function() {
        this.popup.hide();
        this.clearHideTimer();

        return this;
    };

    this.bindListeners = function() {
        this.view.find("#" + this.copyLinkId).on("click", function(){
            self.copyToChat();
        });

        self.view.find("#" + this.clearLinkId).on("click", function(){
            self.clear();
        });

        self.view.find('#' + this.runLinkId).on("click",  function() {
            self.run($(this));
        });

        self.view.find('#' + this.chatNoticeId).on("click",  function() {
            self.changeChatNotice($(this));
        });

        this.view.find("#" + this.closeButtonId).on("click", function() {
            $(this).attr("src", self.css.iconClose);
            self.hide();
        }).hover(function() {
            $(this).attr("src", self.css.iconCloseHover);
        }, function() {
            $(this).attr("src", self.css.iconClose);
        });
    };

    this.getCopyLink = function() {
        return $("<img/>", {src:self.css.iconCopy, id:this.copyLinkId, title:"Скопировать в чат"})
            .css(self.css.copyLink);
    };

    this.getRunLink = function() {
        var link = $("<img/>", {id:this.runLinkId, title:"Запустить/Остановить"})
            .css(self.css.runLink);

        if (self.inProcess) {
            return link.attr('src', self.css.iconStop);
        }

        return link.attr('src', self.css.iconRun);
    };

    this.getExitButton = function() {
        return $("<tr>").append($("<td/>", {colspan:2, align:"right"})).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose}));
    };

    this.getClearLink = function() {
        return $("<img/>", {src:self.css.iconClear, id:this.clearLinkId, title:"Очистить"})
            .css(self.css.clearLink);
    }

    this.getChatNoticeLink = function() {
        var link = $("<img/>", {id:this.chatNoticeId, title:"Оповещения результате боя"})
            .css(self.css.chatNoticeLink);

        if (typeof localStorage['silentBattleRunChatNotice'] != 'undefined' && localStorage['silentBattleRunChatNotice'] == 'true') {
            return link.attr('src', self.css.iconChatNotice);
        }

        return link.attr('src', self.css.iconChatNoticeOff);
    }

    this.getBottomPanel = function() {
        var panel = $('<tr/>').append($("<td/>", {align:"right", colspan:2}));
        panel.children()
            .append(this.getRunLink())
            .append(this.getCopyLink())
            .append(this.getChatNoticeLink())
            .append(this.getClearLink());

        return panel;
    }

    this.copyToChat = function() {
        var chatMsg = "";

        for (var i in self.battleData) {
            if (typeof self.infoMap[i] != 'undefined') {
                chatMsg += self.infoMap[i] + ": " + self.battleData[i] + " ";
            }
        }

        $(this.chatMsgSelector).val(chatMsg);
    };

    this.clear = function() {
        localStorage['nBattleData'] = JSON.stringify({});

        for (var i in self.infoTds) {
            self.infoTds[i].html(0);
        }
    }

    this.run = function(runLink) {
        if (self.inProcess) {
            self.inProcess = false;
            localStorage['silentBattleRun'] = false;

            openImg.attr('src', self.builderCss.openLinkImg);
            runLink.attr('src', self.css.iconRun);
        }
        else {
            self.inProcess = true;
            localStorage['silentBattleRun'] = true;
            openImg.attr('src', self.builderCss.openLinkActiveImg);
            runLink.attr('src', self.css.iconStop);
        }
    }

    this.changeChatNotice = function(noticeLink) {
        if (typeof localStorage['silentBattleRunChatNotice'] == 'undefined' || localStorage['silentBattleRunChatNotice'] == 'false') {
            noticeLink.attr('src', self.css.iconChatNotice);
            localStorage['silentBattleRunChatNotice'] = true;
        }
        else {
            noticeLink.attr('src', self.css.iconChatNoticeOff);
            localStorage['silentBattleRunChatNotice'] = false;
        }
    }

    this.hideAfter = function(hideTime) {
        this.initHideTimer(hideTime);

        this.view.hover(function() {
            self.clearHideTimer();
        }, function() {
            self.initHideTimer(hideTime);
        });

        return this;
    };

    this.initHideTimer = function(hideTime) {
        this.hideTimer = setTimeout(function(){
            self.hide();
        }, hideTime);
    };

    this.clearHideTimer = function() {
        clearTimeout(this.hideTimer);
    };
}