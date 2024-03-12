var forumPostReplaceClass = function(tdHolder, replace) {
    this.replace = replace;
    this.td = tdHolder;
    this.nickNameLink = this.td.find('a[class=txt]');
    this.nickNameHolder = this.nickNameLink.parent();
    this.checkBox = this.nickNameHolder.find('input[type=checkbox]');
    this.tdParent = this.td.parent();
    this.addInfo = this.tdParent.find('.AdditInfo');
    this.avatar = this.tdParent.find('#Avatar');
    this.background = this.avatar.css('background');
    this.postDiv = this.tdParent.next().find(".PostText div").eq(0);
    this.footer = this.tdParent.next().next().find(".tdPostFooter");
    this.footerText = this.footer.find("td:eq(0)");
    this.footerCopy = this.footer.find("a:contains('Цитата')");

    this.newNickNameHolder = null;
    this.newPostDiv = null;
    this.showPostButton = null;

    var self = this;

    this.init = function() {
        self.initNewElements();

        self.hide();
    }

    this.initNewElements = function() {
        self.newNickNameHolder = $('<td/>').append(
            $('<a/>', {'class':"txt", 'href':"javascript:addtxt(\'[b]'" + self.replace.name + "'[/b], \')"}).append($('<b/>',{text: self.replace.name}))
        );

        self.nickNameHolder.parent().prepend(self.newNickNameHolder);

        self.newPostDiv = $('<div/>').text(self.replace.comment);
        self.tdParent.next().find(".PostText").prepend(self.newPostDiv);

        self.showPostButton = $("<div/>").append("<a/>",{text:"Отобразить"})
            .css({"margin-top": "80px", "font-weight": "bold","text-align": "center", "cursor": "pointer"})
            .on('click', self.show);

        self.tdParent.find('.tdPostAvatar').append(self.showPostButton);
    }

    this.hide = function() {
        self.newNickNameHolder.prepend(self.checkBox);

        self.nickNameHolder.hide();
        self.addInfo.hide();

        self.avatar.css({
            "background": "url(" + kango.io.getResourceUrl(self.replace.img) + ") no-repeat",
            "background-position": "0px 0;"
        });

        self.postDiv.hide();
        self.footerText.hide();
        self.footerCopy.hide();
    }

    this.show = function() {
        self.nickNameHolder.show();
        self.nickNameHolder.prepend(self.checkBox);
        self.newNickNameHolder.hide();

        self.avatar.css({"background": self.background});
        self.addInfo.show();

        self.postDiv.show();
        self.newPostDiv.hide();

        self.footerText.show();
        self.footerCopy.show();

        self.showPostButton.hide();
    }
}