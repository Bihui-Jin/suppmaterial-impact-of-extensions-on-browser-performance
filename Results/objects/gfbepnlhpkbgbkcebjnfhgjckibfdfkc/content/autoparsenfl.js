function ready(callback){
    if (document.readyState!='loading') {
    	callback();
    } else if (document.addEventListener) {
    	document.addEventListener('DOMContentLoaded', callback);
    }
}

ready(function(){
	if (window.location.href.indexOf("draftclient") != -1){
		//do not add icons to NFL.com draft room
	} else {
		chrome.runtime.sendMessage({'cmd':'checkBlackList', 'site': document.location.href}, function(result){  
			if (result){
				parsePage('nfl');
			}
		});
	}
});