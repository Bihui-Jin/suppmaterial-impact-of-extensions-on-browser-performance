var freezeChatClass = function(css, holder) {
	this.css = css;
	this.freezeChatStatus = false;
	var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.freezeChatImgOff}).on('click', function() {
			self.freezeChat($(this));
		});

		return $("<a/>", {title:"Заморозка чата"}).append(img).css(this.css.link);
	};

	this.freezeChat = function(freezeChatImg) {
		if (self.freezeChatStatus) {
			self.freezeChatStatus = false;
			freezeChatImg.attr("src", self.css.freezeChatImgOff);
		} else {
			self.freezeChatStatus = true;
			freezeChatImg.attr("src", self.css.freezeChatImgOn);
		}
		localStorage['freezeChatStatus'] = self.freezeChatStatus;
	};

	this.init = function() {
		holder.append(this.buildLink());
		if (localStorage['freezeChatStatus'] == 'true') this.freezeChat($("img[src*=stop-chat]"));
	}
}
			
