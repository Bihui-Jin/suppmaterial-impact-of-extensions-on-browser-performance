var itemsBuilderClass = function(builderCss) {
	this.builderCss = builderCss;
	this.imgStore = "https://img.ereality.ru/34x-/w/";
	this.itemsHolder = $("<table></table>");
	
	var self = this;
	
	this.build = function(items) {
		this.itemsHolder.children().remove();
		
		var tr = $("<tr>");
		this.itemsHolder.append(tr);
		
		if (items.length == 0) {
			tr.append(this.buildEmptyItems());
			return this.itemsHolder;
		}		
		
		$.each(items, function(index) {
			var item = self.buildItem(this);
			
			var td = $("<td></td>").css(self.builderCss.td);
			td.append(item.img).append(item.text)
			
			tr.append(td);
		});
		
		return this.itemsHolder;
	};
	
	this.buildEmptyItems = function() {
		return $("<td>").append($("<img/>", {src:kango.io.getResourceUrl("res/no_items.gif")}));
	};
	
	this.buildItem = function(item) {
	
		var imgDiv = '<div style="height:34px">'+'<img style="display: block; margin-left:auto; margin-right:auto; margin-top:auto; margin-bottom:auto;" src='+(this.imgStore + item.w_image)+'>' +'</div>'
		
		var textDiv = '<div style="font-family:Verdana,Arial,Helvetica,Tahoma,Verdana,sans-serif; font-size:9pt; text-align: center;">'+item.w_name + ' ' + item.w_cursolid  + '/' + item.w_maxsolid +'</div>';	
		
		return {img: imgDiv, text: textDiv};

	};
}
var itemsBuilder = new itemsBuilderClass(itemsBuilderCss);
// this script makes a request to a file located on the way to register in "background_scripts_host", Processing occurs on the server api character, return data, and then displays the character data. example: help_images\userlistactiveitems
//Загрузка инфы о свитках и инвентаре во время боя