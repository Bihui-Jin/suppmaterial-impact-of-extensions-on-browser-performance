var presents2017Class = function(css, holder) {
	this.css = css;
	var self = this;

	this.buildLink = function() {
		var img = $("<img/>", {src:this.css.presents2017Img});
		return $("<a/>", {id:"mur_presents2017",  href:"JavaScript:PV();", title:"Открыватель подарков"}).append(img).css(this.css.link);
	};
	this.init = function() {
		holder.append(this.buildLink());
	}
}
			
