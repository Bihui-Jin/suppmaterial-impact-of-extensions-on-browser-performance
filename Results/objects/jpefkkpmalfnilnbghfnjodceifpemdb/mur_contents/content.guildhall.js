// ==UserScript==
// @name        guildhall
// @include     www.ereality.ru/move/pguild-*
// @require     tools.js
// @all-frames  true
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(value) {
		myoptions = mergeOptions(value, defaultConfig.myoptions);

		
	//	if (!myoptions.unpaused) {
	//		return;
	//	}
		//===================================================================== 
	
	script= "(" +
	(function(){
	  $.ajax({
        type: "POST",
        url: "/ajax/json.php",
        data: JSON.stringify({
            "controller": "place/guildhall",
            "action": "getGuildQuests",
            "params": {}
		}),
        success: function(jsondata) {

                top.core.mur_timer.guildhall_parseinfo(jsondata.response);
		},
        dataType: "json"
	});
	
	}).toString()
	+ ")();"; 

	inject_global(script);
	

	//=========================end.
});