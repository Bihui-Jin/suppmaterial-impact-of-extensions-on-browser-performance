var silentBattleBuilderClass = function(silentBattleBuilderCss, silentBattleCss, holder) {
    this.holder = holder;
    this.silentBattles;
    this.openLink;
    this.position;
    this.css = silentBattleBuilderCss;
    this.timeToShow = 10000;
    this.openImg = $("<img/>", {src:this.css.openLinkImg});

    var self = this;

    this.init = function() {
        this.silentBattles = new silentBattlesClass(popup, "#chat_msg", this.openImg, silentBattleCss, silentBattleBuilderCss);
        this.silentBattles.init();

        holder.append(this.buildLink());
        this.bindListeners();
    },
    this.buildLink = function() {
        this.openLink = $("<a/>", {title:"Тихие бои"}).css(self.css.openLink);

        return this.openLink.append(this.openImg);
    },

    this.bindListeners = function() {
        self.openLink.on('click', function() {
            self.position = self.openLink.offset();

            self.silentBattles.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
        });
    }
};