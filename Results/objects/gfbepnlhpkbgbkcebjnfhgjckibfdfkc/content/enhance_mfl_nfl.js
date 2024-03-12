
function preparePage(){
    jQuery("a").each(function(index){
    	var href = jQuery(this).prop("href");
    	if (href && href.indexOf){
	    	var idx1 = href.indexOf("/player?");
	    	var idx2 = href.indexOf("&P=");
	    	if (idx1 != -1 && idx2 > idx1){
	    		var mflId = href.substring(idx2 + "&P=".length);
	    		while (mflId.length > 0 && mflId[0] == '0'){
	    			mflId = mflId.substring(1);
	    		}
	    		if (PLAYER_CACHE.mfl[mflId]){
	    			var fpId = PLAYER_CACHE.mfl[mflId];
	    			jQuery(this).addClass('fp-player-link').addClass('fp-id-' + fpId);
	    		}
	    	} 
    	}
    });
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function getLeagueId(){
	var league_id = '';
	if (document.URL.indexOf('L=') != -1){
		league_id = document.URL.match(/L=(\d+)/)[1];
	} else if (document.URL.indexOf('/home/') != -1){
		league_id = document.URL.split('/home/')[1].split('#')[0].split('/')[0].split('?')[0];
	}
	return league_id;
}

function getLeagueType(){
    return 7; //MY_FANTASY_LEAGUE
}
function getTeamId(){
	if (document.URL.indexOf("/lineup?") != -1){
		return 'ANY';
	}
	return getUrlParameter("F") ? Number(getUrlParameter("F")) : 0;
}

function getPremiumAdviceMode(){
	/*
	if (document.URL.indexOf("/options?") != -1 && getUrlParameter("O") == '07'){
		return isStartSitAssistantReady() ? 'SSA' : '';
	}
	*/
	if (document.URL.indexOf("/lineup?") != -1){
		return isStartSitAssistantReady() ? 'SSA' : '';
	} else if (document.URL.indexOf("/add_drop?") != -1){
		return 'TopAv';
	}
	return '';
}

function getCurrentLineup(){
	var result = [];
	if (document.URL.indexOf("/lineup?") != -1){
		$(".fp-player-link").each(function(){
			var idx = this.className.indexOf("fp-id-");
			if (idx == -1){
				return;
			}
			var fpId = Number(this.className.substring(idx + "fp-id-".length).split(" ")[0]);
			if (isNaN(fpId)){
				return;
			}
			var cb = jQuery(this).parents("td").find(":checkbox");
			if (cb.get(0)){
				var pos = cb.get(0).checked ? "starter" : "BN"
				result.push(pos + ":" + fpId);
			}
		});
	}
	return result;
}

function enhancePage(){
	
	if (typeof checkPremiumAdvice == 'function'){
		checkPremiumAdvice();
	}
	
	var server = document.URL.split('myfantasyleague.com/')[0] + 'myfantasyleague.com/' +
			document.URL.split('myfantasyleague.com/')[1].split('/')[0] + '/';
	var league_id = getLeagueId();
	
	chrome.runtime.sendMessage({'cmd':'getFpData', leagueId: league_id, leagueType:'mfl', server : server}, function(fpData){    
	    var player_table_selector = 'table.report';

	    jQuery(player_table_selector).each(function(tableIndex){
		    var isPlayerTable = false;
		    var rowspan = 0;
		    jQuery(this).find("tr").each(function(rowIndex){
		    	if (rowIndex == 0){
			    	var ths = jQuery(this).find("th");
			    	if (ths.length > 0 && ths.get(0).innerHTML == 'Player'){
				    	isPlayerTable = true;
				    	var th1 = jQuery("<th class='fp-enhanced fp-enhanced-mfl' title='" + fpData.title + 
				    			" Expert Consensus Rankings' style='text-align:center'>ECR</th>");
				    	var th2 = jQuery("<th class='fp-enhanced fp-enhanced-mfl' title='" + fpData.title + 
		    					" Projected Points' style='text-align:center'>Proj</th>");
				    	var th3 = jQuery("<th class='fp-enhanced fp-enhanced-mfl' title='Matchup Rating' style='text-align:center'>Matchup</th>");
				    	th1.insertAfter(ths.get(0));
				    	th2.insertAfter(th1);
				    	th3.insertAfter(th2);
			    	}
		    	} else if (jQuery(this).hasClass("grand_total")){
	    			jQuery("<td class='' colspan='3'></td>").insertAfter(jQuery(this).find("td").get(0));
		    	} else if (isPlayerTable){
			    	var rank,rank_scoring,points,points_scoring,stars = 0;
			    	var fpIcons = jQuery(this).find(".fp-icon__link");
			    	if (fpIcons.length > 0 && fpData[$(fpIcons.get(0)).attr("data-fp-id")]){
			    		rank = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank;
			    		rank_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank_scoring;
			    		points = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points;
			    		points_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points_scoring;
			    		stars = fpData[$(fpIcons.get(0)).attr("data-fp-id")].stars;
			    	}
			    	if (!rank){
			    		rank = '-';
			    	}
			    	if (!points){
			    		points = 0;
			    	}
			    	var tds = jQuery(this).find("td");
			    	
			    	if (tds.length > 0){
			    		if (rowspan <= 0){
					    	var td1 = jQuery("<td class='fp-enhanced fp-enhanced-mfl' " +
					    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
					    			">" + rank + "</td>");
					    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-mfl' title='" + 
					    			fpData.title + " Projected Points' " +
					    			">" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</td>");
					    	var td3 = jQuery("<td class='fp-enhanced fp-enhanced-mfl fp-matchup-stars' title='Matchup Rating'></td>");
					    	if (stars){
								for (var k=1; k<=5; k++){
									jQuery("<div class='fp-matchup-star " + ( k > Math.round(stars)  ? "fp-matchup-bad-star" : "") + "'></i>" ).appendTo(td3);
								}
					    	}
			    			td1.insertAfter(tds.get(0));
					    	td2.insertAfter(td1);
					    	td3.insertAfter(td2);
			    		} else {
			    			jQuery("<td class='fp-enhanced fp-enhanced-mfl' colspan='3'></td>").insertBefore(tds.get(0));
			    		}

			    		if (rowspan <= 0 && $(tds.get(0)).attr("rowspan")){
			    			rowspan = $(tds.get(0)).attr("rowspan");
			    		}
			    		if (rowspan > 0){
			    			rowspan--;
			    		}
			    		
			    	} else {
				    	var ths = jQuery(this).find("th");
				    	if (ths.length > 0 && jQuery(ths.get(0)).attr('colspan')){
				    		jQuery(ths.get(0)).attr('colspan', 3 + jQuery(ths.get(0)).attr('colspan'));
				    	}
			    	}
		    	}
		    });
		    if (isPlayerTable){
		    	jQuery(this).addClass("fp-player-table-mfl");
		    }
	    });
	});
	
}
