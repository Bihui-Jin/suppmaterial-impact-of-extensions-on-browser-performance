// ==UserScript==
// @name        aukcion
// @include     www.ereality.ru/move/pg_auc*
// @include     https://www.ereality.ru/map.php?js=modeSwitch*
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
	myoptions = mergeOptions(value, defaultConfig.myoptions);

	if (!myoptions.unpaused) {
		return;
	}
	
	if (myoptions.set_count_aukc) {
		$("a[data-id='warehouse']").on("click", function(){
			setTimeout(function() 
			{
				if (!($("#forceDivide").hasClass("option-button actionControl active") || $("#forceDivide").hasClass("option-button active actionControl")))
				{
					$("#forceDivide").click();
				}
			}, 150);
		});
	}
	

});