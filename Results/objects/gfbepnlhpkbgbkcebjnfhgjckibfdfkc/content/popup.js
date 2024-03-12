
function parsePage(sport) {
    chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
        var thisTab = tabs[0];
        chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':sport}, function (response) {
            this.close(); // close the popup 
        });
    });
}

function setFavorite(leagueKey) {
  chrome.runtime.sendMessage({cmd: "setFavorite",'leagueKey':leagueKey}, function (response) {
      this.close(); // close the popup 
  });
}

$(document).ready(function () {
    document.getElementById('parse-nfl').addEventListener('click', function(){
    	parsePage('nfl');
    });
    document.getElementById('parse-mlb').addEventListener('click', function(){
    	parsePage('mlb');
    });
    document.getElementById('parse-nba').addEventListener('click', function(){
    	parsePage('nba');
    });

    chrome.runtime.sendMessage({'cmd' :'queryResearchAssistant'}, function(result){   

    	if (result && result.priv && result.priv.leagues.length > 1){
    		var titleLi = $("<li class='menu-title'>Set Favorite League</li>");
        	$("ul").append(titleLi);
        	var hasFav = false;
        	for (var i=0; i< result.priv.leagues.length; i++){
        		var league = result.priv.leagues[i];
     /*   		["MyFantasyLeague",
        		 "FP Insiders",
        		 "Bragging Bell (Alain)",
        		 "7_49617_2",
        		 true,
        		 1508352257642,
        		 "0zjoa_ZZ7ALKnLjezCGvjesn1P9-syIeqNCw_525UXXiON2QkgnTX3gYFNxZWH2h15MSIyc2KB20fdQ8ohs1Vw~~"]
        		 */
        		var li = $("<li leaguekey='" + league[6] + "' class='menu-action switch-league' title='Set league as favorite'>" +
        				"<div class='star " + (league[4] ? "fav" : "" ) + "'></div>" +
            			league[1] + "</li>");
            	$("ul").append(li);
            	li.click(function(elt){
            		var li = $(elt.target);
            		while (!li.attr('leaguekey')){
            			li = li.parent();
            		}
            		if (li && li.attr('leaguekey')){
	            		setFavorite(li.attr('leaguekey'));
	        			$(".star").removeClass("fav");
	        			$(this).find(".star").addClass("fav");
            		}
            	});
            	if (league[4]){
            		hasFav = true;
            	}
        	}
        	if (hasFav){
        		var clearLink = $("<a class='menu-clear' title='Clear Favorite League'>clear</a>");
        		titleLi.append(clearLink);
        		clearLink.click(function(elt){
        			$(".star").removeClass("fav");
            		setFavorite('none');
            	});
        	}

        	window.setTimeout(function() { 
        		  jQuery('#workaround-307912').show(); 
        	 }, 70);
    	}
    });
})