var turquoiseFlagsBuilderClass = function(turquoiseBuilderCss, turquoiseFlagsCss, holder) {
    this.holder = holder;
    this.turquoiseFlag;
    this.openLink;
    this.position;
    this.css = turquoiseBuilderCss;
    this.timeToShow = 10000;
    this.openImg = $("<img/>", {src:this.css.openLinkImg});

    var self = this;

    this.init = function() {
        this.turquoiseFlag = new turquoiseFlagsClass(popup, "#chat_msg", this.openImg, turquoiseFlagsCss, turquoiseBuilderCss);
        this.turquoiseFlag.init();

        holder.append(this.buildLink());
        this.bindListeners();
    },

    this.buildLink = function() {
	this.openLink = $("<a/>", {title:"Геолог"}).css(self.css.openLink);

        return this.openLink.append(this.openImg);
    },
    this.bindListeners = function() {
        self.openLink.on('click', function() {
            self.position = self.openLink.offset();

            self.turquoiseFlag.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
        });
    }
};