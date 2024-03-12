var golosovalkaClass = function(css, holder) {
	this.css = css;
	var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.golosovalkaImg});
		return $("<a/>", {id:"m_golosovalka", title:"Голосовалка за профессии"}).append(img).css(this.css.link);
	};
	this.init = function() {
		holder.append(this.buildLink());
	}
}
			
