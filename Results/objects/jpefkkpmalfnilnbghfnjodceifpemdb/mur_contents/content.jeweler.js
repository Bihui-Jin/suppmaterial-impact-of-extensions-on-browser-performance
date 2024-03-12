// ==UserScript==
// @name        jeweler
// @include     www.ereality.ru/move/jeweler*
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
	//Обновка инфы для таймера Ювелирки
	
	script= "(" +
	(function(){
	 var OldjsonCallback=jeweler.workers.jsonCallback;
	 jeweler.workers.jsonCallback=function(data){
		top.core.mur_timer.jeweler2_parseinfo(data);
		top.core.mur_timer.jeweler_parseinfo(data);			
	  var myrezult=OldjsonCallback.apply(jeweler,arguments);
		 return myrezult
	 }
	 jeweler.initController();
	
	}).toString()
	+ ")();"; 

	inject_global(script);
	

	//=========================end.
});