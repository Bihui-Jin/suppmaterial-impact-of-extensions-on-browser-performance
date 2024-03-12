function ready(callback){
    if (document.readyState!='loading') {
    	callback();
    } else if (document.addEventListener) {
    	document.addEventListener('DOMContentLoaded', callback);
    }
}

ready(function(){ 	
	parsePage('mlb');
});
