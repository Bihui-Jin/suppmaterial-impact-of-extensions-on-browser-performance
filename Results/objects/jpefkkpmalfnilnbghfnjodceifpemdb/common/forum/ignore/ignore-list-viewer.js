var IgnoreListViewerClass = function(ignoreList, popup, css, anchorID, systemOptions) {
    this.ignoreList = ignoreList;
    this.popup = popup;
    this.css = css;
    this.anchor = $('#' + anchorID);

    this.isVisible = false;
    this.popupPositionX = 0;
    this.popupPositionY = 0;

    this.mainHolder = $('<table/>');
    this.ignoredUsersHolder = $('<table/>').css(this.css.ignoreHolder);
    this.globalHolder = $(document);

    this.dragNdropHolder = null;
    this.ignoreNameInput = null;
    this.ignoreCommentInput = null;
    this.ignoreAddButton = null;
    this.closeButton = null;

    this.ignoredUsersAmount = null;

    this.inMove = false;

    var self = this;

    this.init = function() {
        self.initForm();
        self.popup.setCanGoOverBorder(false);
        self.initPopupPosition();
    }

    this.initForm = function() {
        self.mainHolder.append(self.buildTop())
            .append(self.buildMiddle())
            .append(self.buildBottom());
    };

    this.initPopupPosition = function() {
        if (systemOptions.forumIgnore.popupPositionX != -1) {
            self.popupPositionX = systemOptions.forumIgnore.popupPositionX;
            self.popupPositionY = systemOptions.forumIgnore.popupPositionY;

            return;
        }

        var position = self.anchor.offset();

        self.popupPositionX = position.left + self.anchor.width() + 25;
        self.popupPositionY = position.top - 5;
    };

    this.initListeners = function() {
        self.closeButton.on('click', function() {
            self.closeButton.attr('src', self.css.closeButtonImg);
            self.hide();
        }).hover(function() {
            self.closeButton.attr('src', self.css.closeButtonHoverImg);
        }, function() {
            self.closeButton.attr('src', self.css.closeButtonImg);
        });

        self.ignoreAddButton.on('click', function() {
            self.processAddIgnoreClick(self.ignoreNameInput, self.ignoreCommentInput);
        });

        self.initDragNDrop(self.globalHolder, self.dragNdropHolder);
    };

    this.buildTop = function() {
        var ignoredUsersAmountHolder = $('<span/>').css(self.css.amountHolder);

        self.ignoredUsersAmount = $(('<span/>'),{text:self.ignoreList.getCurrentIgnoredUsersAmount()});

        ignoredUsersAmountHolder.append($('<span/>', {text:"Игнор: "})).append(self.ignoredUsersAmount).append($('<span/>', {text: "из " + self.ignoreList.getMaxIgnoredUsersAmount()}));
        self.closeButton = $('<img/>', {src:self.css.closeButtonImg}).css(self.css.closeButton);

        var topTr = $('<tr/>').css(self.css.topLine);
        self.dragNdropHolder = topTr;

        var topTd = $('<td/>', {colspan:2, align:"right"})
            .append(ignoredUsersAmountHolder)
            .append(self.closeButton);

        return topTr.append(topTd);
    };

    this.savePopupPosition = function() {
        systemOptions.forumIgnore.popupPositionX = self.popupPositionX;
        systemOptions.forumIgnore.popupPositionY = self.popupPositionY;

        kango.invokeAsync('kango.storage.setItem', 'systemOptions', systemOptions);
    };

    this.buildMiddle = function() {
        var bottomTd = $('<td/>', {colspan:2, align:"center"}).append(self.ignoredUsersHolder);

        return $('<tr/>').append(bottomTd);
    };

    this.buildBottom = function() {
        self.ignoreNameInput = $('<input/>', {type:"text", title:"Имя жертвы"}).css(self.css.ignoreNameInput);
        self.ignoreCommentInput = $('<input/>', {type:"text", title:"Комментарий"}).css(self.css.ignoreCommentInput);

        self.ignoreAddButton = $("<img/>", {title:"Добавить", src:self.css.addIgnoreButtonImg}).css(self.css.ignoreAddButton);

        var bottomTr = $('<tr/>');
        var leftTd = $('<td/>', {align:"right"}).append(self.ignoreNameInput).append($('<br>')).append(self.ignoreCommentInput);
        var rightTd = $('<td/>').append(self.ignoreAddButton);

        return bottomTr.append(leftTd).append(rightTd);
    };

    this.processAddIgnoreClick = function(ignoreNameInput, commentInput) {
        var ignoredUserName = ignoreNameInput.val().trim();
        var comment = commentInput.val();
        if (self.ignoreList.addIgnoredUser(ignoredUserName, comment)) {
            self.ignoredUsersHolder.append(
                self.buildIgnoreListItem(ignoredUserName, comment)
            );

            self.ignoredUsersAmount = $(('<span/>'),{text:self.ignoreList.getCurrentIgnoredUsersAmount()});
            ignoreNameInput.val('');
            commentInput.val('');
        }
    };

    this.initDragNDrop = function(globalHolder, eventTarget) {
        var xDelta = 0;
        var yDelta = 0;

        globalHolder.on('mousemove', function(event) {
            if (!self.inMove) {
                return;
            }

            self.popupPositionX = event.pageX + xDelta;
            self.popupPositionY = event.pageY + yDelta;

            if (self.popupPositionY < 0) {
                self.popupPositionY = 0;
            }

            if (self.popupPositionY > 500) {
                self.popupPositionY = 500;
            }

            self.popup.move(self.popupPositionX, self.popupPositionY, 0, 0);
        }).on('mouseup', function() {
            self.inMove = false;
            self.savePopupPosition();
        });

        eventTarget.on('mousedown', function() {
            self.inMove = true;

            xDelta = self.popupPositionX - event.pageX;
            yDelta = self.popupPositionY - event.pageY;
        });
    };

    this.processDeleteIgnoreClick = function (ignoreName, button) {
        self.ignoreList.removeIgnoredUser(ignoreName);
        $(button).parent().parent().remove();

        self.ignoredUsersAmount.html(self.ignoreList.getCurrentIgnoredUsersAmount());
    };

    this.buildIgnoreListItem = function(ignoreName, comment) {
        var ignoreTr = $('<tr/>');

        var deleteButton = $("<img/>", {title:"Удалить", src:self.css.deleteButtonImg}).css(self.css.deleteButton).on('click', function() {
            self.processDeleteIgnoreClick(ignoreName, this);
        });

        var ignoreNameLink = $('<a/>', {href:"#", text:ignoreName}).css(self.css.ignoreNameLink);
        var ignoreCommentDiv = $('<div/>', {text:comment}).css(self.css.ignoreCommentDiv);

        var ignoreNameTd = $('<td/>').append(ignoreNameLink).append(ignoreCommentDiv);
        var deleteTd = $('<td/>').append(deleteButton);

        ignoreTr.append(ignoreNameTd)
            .append(deleteTd);

        return ignoreTr;
    };

    this.show = function() {
        $.each(self.ignoreList.getIgnoreList(),  function(key) {
            self.ignoredUsersHolder.append(self.buildIgnoreListItem(key, this.comment));
        });

        self.initListeners();
        self.popup.show(self.mainHolder).move(self.popupPositionX, self.popupPositionY, 0, 0);

        self.isVisible = true;
    };

    this.hide = function() {
        self.ignoredUsersHolder.empty();
        self.popup.hide();
        self.isVisible = false;
    };

    this.toggleShow = function() {
        if (self.isVisible) {
            self.hide();
            return;
        }

        self.show();
    };

    this.getIsVisible = function() {
        return self.isVisible;
    };

    this.setIgnoredUser = function(ignoredUser) {
        self.ignoreNameInput.val(ignoredUser);
    };
}