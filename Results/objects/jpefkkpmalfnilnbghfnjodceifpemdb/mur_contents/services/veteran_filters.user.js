// ==UserScript==
// @name         veteran filters
// @author       MurLemur
// @include      https://www.ereality.ru/move/museum*
// @require  	tools/jquery.js
// @require     tools.js
// @all-frames  true
// ==/UserScript==
function controller(extOptions) {
	if (!extOptions.options.unpaused) {
		return;
	}
	
if (extOptions.options.veteran_filters)
{	
	function veteran_filters() {
		
		if (top.document.getElementById("span_location").text == "Музей") {
			$(".museumShopMenuActive").append($('<div align="left" style="margin-left: 95px;"><br>'+
			 '<input id="fmag" name="filtermuseum" type="radio" value="Воин"><label for="fmag">Маг</label><br>'+
			 '<input id="fvoin" name="filtermuseum" type="radio" value="Маг"><label for="fvoin">Воин</label><br>'+
			 '<input id="fall" name="filtermuseum" type="radio" value="Все" checked><label for="fall">Все</label><br>'+
			'</div>'));
			$("#fmag").on("click", function(){filtrformus();});
			$("#fvoin").on("click", function(){filtrformus();});
			$("#fall").on("click", function(){filtrformus();});
			$("a[data-action='museum.changeTab']").on("click", function(){filtrformus();});

			
			function filtrformus(){
				setTimeout(function () {
					namemuseum = $("input[name=filtermuseum]:checked").val();
					el = $("div.itemBodyNeed");
					if (namemuseum=="Все")
					{
						for (i = 0;i<el.length;i++)
						{
								el.eq(i).parent().parent().show();
						}
					}
					else
					{
						for (i = 0;i<el.length;i++)
						{
							if ((el.eq(i).html()).indexOf(namemuseum)!=-1)
							{
								el.eq(i).parent().parent().hide();
							}
							else
							{
								el.eq(i).parent().parent().show();
							}
						}
					}
				$("a[data-action='museum.changeTab']").on("click",function(){filtrformus();});
				},100);
			}
		}
	}
	window.onload = setTimeout(veteran_filters, 50);
	}
};

var loadOptions = [{
	systemName: 'options',
	defaultName: "myoptions"
},{
	systemName: 'options2',
	defaultName: "systemOptions"
}];

$(document).ready(function() {
	tools.loadOptions(loadOptions, controller);
});