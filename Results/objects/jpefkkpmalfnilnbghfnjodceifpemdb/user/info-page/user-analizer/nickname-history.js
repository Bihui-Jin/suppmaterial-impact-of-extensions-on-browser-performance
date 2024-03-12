var NickHistorylass = function(holder, buttonStyle, userName) {
	this.holder = holder;
	this.buttonStyle = buttonStyle;
	this.NickLink = $("<a/>", {target:"_blank", href:"https://er-help.ru/index.php/informatsiya/108-niknejm-kem-byl-etot-igrok?sel=1&whois=" + userName + "&vibor=0", title:"История ника персонажа"});
this.NickImg = $("<img/>", {src:"https://img.ereality.ru/clan/292.gif"});
		
	var self = this;
	this.init = function() {
		self.NickImg.css(self.buttonStyle);
		self.NickLink.append(self.NickImg);
		self.holder.append(self.NickLink);
	}
}