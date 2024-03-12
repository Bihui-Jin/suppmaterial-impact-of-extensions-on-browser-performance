var teleportClass = function(css, holder) {
	this.css = css;
	var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.teleportImg});
		return $("<a/>", {title:"Телепорт малым свитком"}).append(img).css(this.css.link);
	};
	this.init = function() {
		holder.append(this.buildLink());
	}
}
