var messageRecorderBuilderClass = function(messageRecorderBuilderCss, messageRecorderCss, holder, size, orderAsc) {
    this.holder = holder;
    this.messageRecorder;
    this.openLink;
    this.position;
    this.css = messageRecorderBuilderCss;
    this.timeToShow = 10000;
    this.openImg = $("<img/>", {src:this.css.openLinkImg});

    var self = this;

    this.init = function() {
        this.messageRecorder = new messageRecorderClass(
            popup,
            "#chat_msg",
            this.openImg,
            messageRecorderCss,
            messageRecorderBuilderCss,
            size,
            orderAsc
        );

        this.messageRecorder.init();

        holder.append(this.buildLink());
        this.bindListeners();
    },
    this.buildLink = function() {
        this.openLink = $("<a/>", {title:"Логгер ЛЧ"}).css(self.css.openLink);

        return this.openLink.append(this.openImg);
    },
    this.bindListeners = function() {
        self.openLink.on('click', function() {
            self.position = self.openLink.offset();

            self.messageRecorder.hide().show(self.position.left, self.position.top).hideAfter(self.timeToShow);
        });
    }
};