var fisherBuilderClass = function(fisherCss, fishCounterCss, holder) {
    this.holder = holder;
    this.fishCounter;
    this.openLink;
    this.position;
    this.css = fisherCss;
    this.timeToShow = 10000;
this.openImg = $("<img/>", {src:this.css.openLinkImg});

    var self = this;

    this.init = function() {
        this.fishCounter = new fishCounterClass(popup, "#chat_msg", this.openImg, fishCounterCss, fisherCss);
        this.fishCounter.init();

        holder.append(this.buildLink());
        this.bindListeners();
    },
    this.buildLink = function() {
        this.openLink = $("<a/>", {title:"Рыбак"}).css(self.css.openLink);

        return this.openLink.append(this.openImg);
    },
    this.bindListeners = function() {
        self.openLink.on('click', function() {
            self.position = self.openLink.offset();

            self.fishCounter.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
        });
    }
};