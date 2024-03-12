var forumPostIgnoreClass = function (tools, preset, elenkatorActive) {
    this.preset = preset;
    this.tools = tools;
    this.tablePost = $('.TablePost');
    this.replace;
    this.elenktoActive = elenkatorActive;

    var self = this;

    this.init = function () {
        self.initReplace();

        self.filterUserPost();
        self.filterUserQuotes();
        self.filterUserAddress();
        self.filterModeratorAnswer();
    }

    this.filterUserPost = function () {
        self.tablePost.find('.tdPostAuthor').each(function () {
            var td = $(this);
            var nickNameLink = td.find('a[class=txt]');
            var nick = nickNameLink.text().trim();

            if (self.tools.isIgnored(nick)) {
                new forumPostReplaceClass(td, self.replace).init();
            }
            else {
                td.parent().find('.AdditInfo')
                    .append('<br/>')
                    .append(
                         $('<a/>', {class:"erExtToIgnore", title:nick, text:"В игнор"})
                             .css({"cursor": "pointer", "font-weight": "bold"})
                    );
            }
        });
    }

    this.filterUserQuotes = function () {
        self.tablePost.find('.QuoteAuthor').each(function () {
            var quoteAuthor = $(this);
            if (self.tools.isIgnored(quoteAuthor.find('strong').text().trim())) {
                quoteAuthor.html("Цитируя"+$(("<strong>"), {text:self.replace.name + ":"}));

                quoteAuthor.next().text(self.replace.comment);
            }
        });
    }

    this.filterUserAddress = function () {
        self.tablePost.find('.PostText').each(function () {
            var nameHolder = $(this).find('div:eq(0)').find('b');

            if (self.tools.isIgnored(nameHolder.text().trim())) {
                nameHolder.text(self.replace.name);
            }
        });
    }

    this.filterModeratorAnswer = function() {
        self.tablePost.find('.ModeratorAnswer .RedColor').each(function() {
            var span = $(this);
            var userName = span.text().slice(0, span.text().length - 1);

            if (self.tools.isIgnored(userName)) {
                span.html($(("<strong>"), {text:self.replace.name + ":"}));
            }
        });
    }

    this.initReplace = function() {
        self.replace = self.tools.getPreset(self.preset);
    }
}
