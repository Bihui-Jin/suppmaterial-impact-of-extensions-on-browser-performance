var categoryAuthorNameIgnoreClass = function(tools, preset) {
    this.preset = preset;
    this.tools = tools;
    this.subForum = $('.SubForum');
    this.replace;

    var self = this;

    this.init = function() {
        this.initReplace();
        this.hideIgnored();
    }

    this.hideIgnored = function() {
        self.subForum.find('.tdLastMessage span').each(function() {
            var span = $(this);
            var contents = span.contents();

            var regExp = new RegExp('Автор: (.+) .+', 'i');
            var authorName = contents.eq(0).text().match(regExp)[1].trim();

            if (self.tools.isIgnored(authorName)) {
                var timeText = contents.eq(3).text();

                span.html("Автор: " + self.replace.name + " <br/>").append(timeText);
            }
        });
    }

    this.initReplace = function() {
        self.replace = self.tools.getPreset(self.preset);
    }
}