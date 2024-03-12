var fishCounterClass = function(popup, chatMsgSelector, openImg, counterCss, builderCss) {
    this.popup = popup;
    this.chatMsgSelector = chatMsgSelector;

    this.css = counterCss;
    this.builderCss = builderCss;

    this.openImg = openImg;

    this.fishesData = {};
    this.summTds = {};
    this.tabsView = {};
    this.tabsHeaderView = {};
    this.view;
    this.hideTimer;
    this.tabHolder;

    this.copyLinkId = "er-ext-copy-link";
    this.closeButtonId = "er-ext-close-button";
    this.clearLinkId = "er-ext-clear-link";
    this.runLinkId = "er-ext-run-link";
    this.chatNoticeId = "er-ext-chat-notice-link";

    this.inProcess = false;

    this.tabs = {
        'fish': {
            'title': 'Рыба',
            'default': true
        },
        'crab': {
            'title': 'Крабы',
            'default': false
        }
    };
    this.fishes = {
        'Текели-ли': {
            'title': 'Текели-ли',
            'img': 'fish_01.png',
            'tab': 'fish'
        },
        'Иннсмаут': {
            'title': 'Иннсмаут',
            'img': 'fish_02.png',
            'tab': 'fish'
        },
        'Сеймурелла': {
            'title': 'Сеймурелла',
            'img': 'fish_03.png',
            'tab': 'fish'
        },
        'Лобстер 1': {
            'title': 'Лобстер 1',
            'img': 'crab_01.png',
            'tab': 'crab'
        },
        'Лобстер 2': {
            'title': 'Лобстер 2',
            'img': 'crab_01.png',
            'tab': 'crab'
        },
        'Лобстер 3': {
            'title': 'Лобстер 3',
            'img': 'crab_01.png',
            'tab': 'crab'
        },
        'Краб 1': {
            'title': 'Краб 1',
            'img': 'crab_02.png',
            'tab': 'crab'
        },
        'Краб 2': {
            'title': 'Краб 2',
            'img': 'crab_02.png',
            'tab': 'crab'
        },
        'Хищник 1': {
            'title': 'Хищник 1',
            'img': 'crab_03.png',
            'tab': 'crab'
        },
        'Хищник 2': {
            'title': 'Хищник 2',
            'img': 'crab_03.png',
            'tab': 'crab'
        },
        'Хищник 3': {
            'title': 'Хищник 3',
            'img': 'crab_03.png',
            'tab': 'crab'
        },
        'Рыбка соскочила..': {
            'title': 'Рыбка соскочила..',
            'tab': 'fish'
        },
        'Клетка пуста': {
            'title': 'Клетка пуста',
            'tab': 'crab'
        },
        'Рыба Опыта': {
            'title': 'Опыта',
            'tab': 'fish'
        },
        'Рыба Подходов': {
            'title': 'Подходов',
            'tab': 'fish'
        },
        'Крабы Опыта': {
            'title': 'Опыта',
            'tab': 'crab'
        },
        'Крабы Подходов': {
            'title': 'Подходов',
            'tab': 'crab'
        }
    };

    var self = this;
    this.init = function() {
        if (typeof localStorage['fisherRun'] != 'undefined' && localStorage['fisherRun']) {
            self.inProcess = localStorage['fisherRun'] == 'true';
        }

        if (self.inProcess) {
            self.openImg.attr('src', self.builderCss.openLinkActiveImg);
        }

        this.prepareView();
    };

    this.prepareView = function() {
        this.view = $("<table/>");
        this.view.append(this.getExitButton());

        this.view.append(self.prepareViewTabHeader());
        this.view.append($('<tr/>').append($('<td/>', {align:"center", colspan:3}).append($("<hr>"))));

        this.view.append(
            $("<tr/>").append(self.prepareTabsView())
        )

        this.view.append($('<tr/>').append($('<td/>', {align:"center", colspan:3}).append($("<hr>"))));
        this.view.append(this.getBottomPanel());
    };

    this.prepareViewTabHeader = function() {
        self.tabHolder = $('<td/>', {align:"center", colspan:3}).css(self.css.textStyle);

        $.each(self.tabs, function(key) {
            var link = $('<a/>', {href:"#", "data-tab":key, text:this.title}).css(self.css.tabLink);

            if (typeof localStorage['fishes_active_tab'] != 'undefined') {
                if (localStorage['fishes_active_tab'] == key) {
                    link.css(self.css.tabHeaderBold);
                }
            } else if(self.tabs[key].default) {
                link.css(self.css.tabHeaderBold);
            }

            self.tabsHeaderView[key] = link;
            self.tabHolder.append(link);
        });

        return $('<tr/>').append(self.tabHolder);
    }

    this.prepareTabsView = function() {
        var tabsHolder = $('<table/>');

        $.each(self.tabs, function(tabKey) {
            self.tabsView[tabKey] = $('<tr/>');
            tabsHolder.append(self.tabsView[tabKey]);

            if (typeof localStorage['fishes_active_tab'] != 'undefined') {
                if(localStorage['fishes_active_tab'] == tabKey) {
                    self.tabsView[tabKey].show();
                }
                else {
                    self.tabsView[tabKey].hide();
                }
            } else if(self.tabs[tabKey].default) {
                self.tabsView[tabKey].show();
            } else {
                self.tabsView[tabKey].hide();
            }
        });

        $.each(self.fishes, function(key) {
            var tr = $("<tr/>");

            var fishImgTD = $("<td/>", {align:"center"});

            if (typeof this.img != 'undefined') {
                fishImgTD.append($('<img/>', {height:"20", width:"28", src:"https://img.ereality.ru/52x-/w/" + this.img}));
            }

            var fishNameTD = $("<td/>", {align:"center", text:this.title}).css(self.css.textStyle);

            self.summTds[key] = $("<td/>", {align:"center", text:0}).css(self.css.textStyle);
            tr.append(fishImgTD).append(fishNameTD).append(self.summTds[key]);
            self.tabsView[this.tab].append(tr);
        });

        return tabsHolder;
    }

    this.count = function() {
        self.fishesData = {};

        var fishes = localStorage['fishes'];

        if (typeof fishes != 'undefined') {
            fishes = JSON.parse(fishes);
        }
        else {
            fishes = [];
        }

        for (var key in fishes) {
            self.fishesData[key] = fishes[key];
        }
    };

    this.show = function(positionX, positionY) {
        this.count();

        $.each(this.fishes, function(key) {
            if (typeof self.fishesData[key] != "undefined") {
                self.summTds[key].text(self.fishesData[key]);
            }
        });

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

        self.tabHolder.find('a').on('click', function() {
            self.changeTab(this.getAttribute('data-tab'));
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
        return $("<img/>", {src:self.css.iconCopy, id:this.copyLinkId , title:"Скопировать в чат"})
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
		return $("<tr/>").append($("<td/>", {colspan:3, align:"right"}).append($("<img/>", {id:this.closeButtonId, src:self.css.iconClose})));
    };

    this.getClearLink = function() {
        return $("<img/>", {src:self.css.iconClear, id:this.clearLinkId, title:"Очистить"})
            .css(self.css.clearLink);
    }

    this.getChatNoticeLink = function() {
        var link = $("<img/>", {id:this.chatNoticeId, title:"Оповещения о росте профы и состоянии инструмента"})
            .css(self.css.chatNoticeLink);

        if (typeof localStorage['fisher_chat_notice'] != 'undefined' && localStorage['fisher_chat_notice'] == 'true') {
            return link.attr('src', self.css.iconChatNotice);
        }

        return link.attr('src', self.css.iconChatNoticeOff);
    }

    this.getBottomPanel = function() {
        var panel = $('<tr>').append($("<td/>", {align:"right", colspan:3}));
        panel.children()
            .append(this.getRunLink())
            .append(this.getCopyLink())
            .append(this.getChatNoticeLink())
            .append(this.getClearLink());

        return panel;
    }

    this.copyToChat = function() {
        var chatMsg = "";

        $.each(self.fishes, function(key) {
            if (typeof self.fishesData[key] != "undefined" && self.fishesData[key] != 0) {
                chatMsg += key + ": " + self.fishesData[key] + " ";
            }
        });

        $(this.chatMsgSelector).val(chatMsg);
    };

    this.changeTab = function(tabKey) {
        $.each(self.tabsView, function(key) {
            if (key == tabKey) {
                self.tabsHeaderView[key].css(self.css.tabHeaderBold);
                this.show();
                localStorage['fishes_active_tab'] = key;
            } else {
                self.tabsHeaderView[key].css(self.css.tabHeaderNormal);
                this.hide();
            }
        });
    }

    this.clear = function() {
        localStorage['fishes'] = JSON.stringify({});

        for (var i in  self.summTds) {
            self.summTds[i].text(0);
        }
    }

    this.run = function(runLink) {
        if (self.inProcess) {
            self.inProcess = false;
            localStorage['fisherRun'] = false;

            openImg.attr('src', self.builderCss.openLinkImg);
            runLink.attr('src', self.css.iconRun);
        }
        else {
            self.inProcess = true;
            localStorage['fisherRun'] = true;
            openImg.attr('src', self.builderCss.openLinkActiveImg);
            runLink.attr('src', self.css.iconStop);
        }
    }

    this.changeChatNotice = function(noticeLink) {
        if (typeof localStorage['fisher_chat_notice'] == 'undefined' || localStorage['fisher_chat_notice'] == 'false') {
            noticeLink.attr('src', self.css.iconChatNotice);
            localStorage['fisher_chat_notice'] = true;
        }
        else {
            noticeLink.attr('src', self.css.iconChatNoticeOff);
            localStorage['fisher_chat_notice'] = false;
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