if (window.location.href.indexOf("fix_fp_") != -1){
	
	var leagueKey = window.location.href.split("fix_fp_")[1];

	var cookieObject = Object.fromEntries(document.cookie.split('; ').map(c => {
	    const [ key, ...v ] = c.split('=');
	    return [ key, v.join('=') ];
	}));
	
	var sport = window.location.href.indexOf('flb') > 0 || window.location.href.indexOf('baseball') > 0  ? 'mlb' :
		window.location.href.indexOf('ffl') > 0 || window.location.href.indexOf('football') > 0  ? 'nfl':
			window.location.href.indexOf('fba') > 0 || window.location.href.indexOf('basketball') > 0 ? 'nba' : '';

	if (cookieObject && cookieObject.SWID && cookieObject.espn_s2){

		chrome.runtime.sendMessage({
			'cmd':'fixEspnLeague', 
			'swid': cookieObject.SWID, 
			's2': cookieObject.espn_s2, 
			'sport': sport, 
			'leagueKey': leagueKey
		}, function(result){ 
			if (!result){
				alert("Unknown Error while connecting to FantasyPros");
			} else if (result.error){
				alert(result.error);
			} else if (result.redirect_url){
				window.location.href = result.redirect_url;
			}
		});
		
	} else {
		alert("Please log in to your ESPN account to fix the FantasyPros credentials");
	}
}
