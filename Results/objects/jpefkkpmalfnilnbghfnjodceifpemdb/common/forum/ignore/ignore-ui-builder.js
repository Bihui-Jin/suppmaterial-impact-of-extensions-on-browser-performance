var IgnoreUiBuilderClass = function(ignoredUserListViewer, css, listImgID) {
    this.ignoredUserListViewer = ignoredUserListViewer;
    this.css = css;
    this.listImgID = listImgID;
    this.mainHolder = $('body');

    var self = this;

    this.init = function() {
        self.initListImg();
        self.initDelegator();
    };

    this.initListImg = function() {
        var listImg = $("<img/>", {title:"Список игнора", id:self.listImgID, src:self.css.listImg})
            .css(self.css.listImgCss);

        var listDiv = $('<div/>').css(self.css.listDivCss).append(listImg);

        $('#NickName').append(listDiv);
    };

    this.initDelegator = function() {
        self.mainHolder.delegate('#' + self.listImgID, 'click', function() {
            self.ignoredUserListViewer.toggleShow();
        });

        self.mainHolder.delegate('.erExtToIgnore', 'click', function() {
            self.ignoredUserListViewer.setIgnoredUser($(this).attr('title'));
            if (!self.ignoredUserListViewer.getIsVisible()) {
                self.ignoredUserListViewer.show();
            }
        })
    }
}