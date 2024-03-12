var turquoiseFlagsClass = function(popup, chatMsgSelector, openImg, flagsCss, builderCss) {
    this.popup = popup;
    this.chatMsgSelector = chatMsgSelector;

    this.css = flagsCss;
    this.builderCss = builderCss;

    this.openImg = openImg;

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
        if (typeof localStorage['turquoise_flags_run'] != 'undefined') {
            self.inProcess = localStorage['turquoise_flags_run'] == 'true';
        }

        if (self.inProcess) {
            self.openImg.attr('src', self.builderCss.openLinkActiveImg);
        }

        this.prepareView();
    };

    this.prepareView = function() {
        this.view = $("<table></table>");
        this.view.append($('<tr>').append($("<td/>", {align:"right"}).append(this.getExitButton())));

        this.view.append($('<tr>').append($("<td/>", {align:"center"}).append($("<hr>"))));
        this.view.append(this.getBottomPanel());
    };

    this.show = function(positionX, positionY) {
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
		return $("<tr/>").append($("<td/>", {align:"right"})).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose}));
    };

    this.getClearLink = function() {
        return $("<img/>", {src:self.css.iconClear, id:this.clearLinkId, title:"Очистить"})
            .css(self.css.clearLink);
    }

    this.getChatNoticeLink = function() {
        var link = $("<img/>", {id:this.chatNoticeId, title:"Оповещения о проценте разведки"})
            .css(self.css.chatNoticeLink);

        if (typeof localStorage['turquoise_flags_chat_notice'] != 'undefined' && localStorage['turquoise_flags_chat_notice'] == 'true') {
            return link.attr('src', self.css.iconChatNotice);
        }

        return link.attr('src', self.css.iconChatNoticeOff);
    }

    this.getBottomPanel = function() {
        var panel = $('<tr>').append($("<td/>", {align:"right"}));
        panel.children()
            .append(this.getRunLink())
            .append(this.getCopyLink())
            .append(this.getChatNoticeLink())
            .append(this.getClearLink());

        return panel;
    }

    this.copyToChat = function() {
        var chatMsg = "";

        if (typeof localStorage['turquoise_flags'] != 'undefined') {
            var flags = JSON.parse(localStorage['turquoise_flags']);

            for (var x in flags) {
                for (var y in flags[x]) {
                    chatMsg += x + ":" + y + " - " + flags[x][y]['percent'] + "% ";
                }
            }
        }

        if (chatMsg.length > 0) {
            var response = "Вклады в разведку: " + chatMsg;
        }

        $(this.chatMsgSelector).val(response);
    };

    this.clear = function() {
        localStorage['turquoise_flags_cleared'] = true;
        localStorage['turquoise_flags_update'] = true;
        localStorage['turquoise_flags'] = JSON.stringify({});
    }

    this.run = function(runLink) {
        if (self.inProcess) {
            self.inProcess = false;
            localStorage['turquoise_flags_run'] = false;

            openImg.attr('src', self.builderCss.openLinkImg);
            runLink.attr('src', self.css.iconRun);
        }
        else {
            self.inProcess = true;
            localStorage['turquoise_flags_run'] = true;
            openImg.attr('src', self.builderCss.openLinkActiveImg);
            runLink.attr('src', self.css.iconStop);
        }
    }

    this.changeChatNotice = function(noticeLink) {
        if (typeof localStorage['turquoise_flags_chat_notice'] == 'undefined' || localStorage['turquoise_flags_chat_notice'] == 'false') {
            noticeLink.attr('src', self.css.iconChatNotice);
            localStorage['turquoise_flags_chat_notice'] = true;
        }
        else {
            noticeLink.attr('src', self.css.iconChatNoticeOff);
            localStorage['turquoise_flags_chat_notice'] = false;
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