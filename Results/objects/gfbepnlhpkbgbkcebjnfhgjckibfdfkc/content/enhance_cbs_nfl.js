function enhanceLink(link){
	var href = jQuery(link).prop("href"); 
	if (href && href.indexOf){
    	var idx1 = href.indexOf("/playerpage/");
    	if (idx1 != -1){
    		var cbsId = href.substring(idx1 + "/playerpage/".length);
        	if (cbsId && PLAYER_CACHE.cbs[cbsId]){
				var fpId = PLAYER_CACHE.cbs[cbsId];
				jQuery(link).addClass('fp-player-link').addClass('fp-id-' + fpId);
	    	} 
    	}    
	}
}

function preparePage(){
	enhancing_started = true;
	enhancing_done = false;

	if (document.URL.indexOf("roster-grid") != -1){	
		jQuery("a.playerLink").each(function(linkIndex){
			enhanceLink(this);
		});
	} else {
	    jQuery(".data td").each(function(index){
	    	var playerLinks = jQuery(this).find("a.playerLink")
	    	if (playerLinks.length > 0){
	    		enhanceLink(playerLinks.get(0));
	    	}
	    });
	}
}

function getLeagueId(){
	return location.href.split("cbssports.com")[0].split("//")[1].split(".")[0];
}

function getLeagueType(){
    return 3; //CBS_LEAGUE
}
function getTeamId(){
	var str = $("#teamPageSelect").val();
	if (!str){
		return 0;
	}
	if (str.indexOf("/teams/") == 0){
		str = str.substring("/teams/".length);
	}
	return Number(str);
}

function getPremiumAdviceMode(){
	if (document.URL.indexOf(getLeagueId() + ".football.cbssports.com/teams") != -1){
		return isStartSitAssistantReady() ? 'SSA' : '';
	} else if (document.URL.indexOf(getLeagueId() + ".football.cbssports.com/stats/stats-main") != -1 ||
			document.URL.indexOf(getLeagueId() + ".football.cbssports.com/players/rankings") != -1){
		if (document.URL.indexOf("default_add=") == -1){
			return 'TopAv';
		} else {
			return 'WA';
		}
	}
	return '';
}

function getAddedPlayerId(){
	var href = $(".to-playerRow").find("a.playerLink").attr("href");
	if (href && href.indexOf){
    	var idx1 = href.indexOf("/playerpage/");
    	if (idx1 != -1){
    		var cbsId = href.substring(idx1 + "/playerpage/".length);
			return PLAYER_CACHE.cbs[cbsId];
    	}    
	}
}

function getDroppedPlayerId(){
	var href = $(".from-playerRow").find("a.playerLink").attr("href");
	if (href && href.indexOf){
    	var idx1 = href.indexOf("/playerpage/");
    	if (idx1 != -1){
    		var cbsId = href.substring(idx1 + "/playerpage/".length);
			return PLAYER_CACHE.cbs[cbsId];
    	}    
	}	
}

function watchForPlayerSelection(callback, leagueData) {

	jQuery(".editCell a").each(function(){
		jQuery(this).click(function(){
			setTimeout(function(){ 
				callback(leagueData, getAddedPlayerId(), getDroppedPlayerId()); 
			}, 500);
			
		});
	});
	
}

function getCurrentLineup(){
	var result = [];
	$(".fp-player-link").each(function(){
		var idx = this.className.indexOf("fp-id-");
		if (idx == -1){
			return;
		}
		var fpId = Number(this.className.substring(idx + "fp-id-".length).split(" ")[0]);
		if (isNaN(fpId)){
			return;
		}
		var pos = jQuery(this).parents("tr").find(".playerPosition").html();		
		if (pos){
			if (pos.indexOf("changePos") != -1){
				pos = "BN";
			}
			result.push(pos + ":" + fpId);
		}
	});
	return result;
}

function enhancePage(){
	enhancing_started = true;
	enhancing_done = false;
	
	if (typeof checkPremiumAdvice == 'function'){
		checkPremiumAdvice();
	}

    observer_target_selector = '#lineup_views';
    if (jQuery(observer_target_selector).length == 0){
        observer_target_selector = '#sortableStats';    	
    }	
	
    var league_id = getLeagueId();    

	chrome.runtime.sendMessage({'cmd':'getFpData', leagueId: league_id, leagueType:'cbs'}, function(fpData){  

		var abortEnhance = false;
		if (!fpData){
			abortEnhance = true;
		} 
		
		var selection = jQuery(".fantasyHeaderNav .active a").html();
		if (!selection){
			selection = jQuery(".fantasyHeaderNav .optsel").html();
		}
		 
		if (!selection){
			abortEnhance = true;			
		} else if (selection.indexOf('Overview') == -1  && 
				selection.indexOf('Projections') == -1 ){
			abortEnhance = true;
		}

		if (abortEnhance == false){
		
		    var player_table_selector = 'table.data';
	
		    jQuery(player_table_selector).each(function(tableIndex){
		    	
			    jQuery(this).addClass("fp-player-table-cbs");
			    
			    jQuery(this).find("thead tr").each(function(rowIndex){
			    	if (rowIndex == 0){
						jQuery("<td colspan='4'></td>").appendTo(this);
			    	} else if (rowIndex == 1){
						jQuery("<th class='fp-enhanced fp-enhanced-cbs' colspan='3'><div>" +
							"<a href='https://www.fantasypros.com/' target='_blank'>FantasyPros</a></div></th>").appendTo(this);
			    	} else if (rowIndex == 2){
					    jQuery("<th class='fp-enhanced fp-enhanced-cbs' title='" + fpData.title + 
						    			" Expert Consensus Rankings'><span>ECR</span></th>").appendTo(this);
					    jQuery("<th class='fp-enhanced fp-enhanced-cbs' title='" + fpData.title + 
						    			" Projected Points' ><span>Proj</span></th>").appendTo(this);
					    jQuery("<th class='fp-enhanced fp-enhanced-cbs' title='Matchup Rating'><span>MATCHUP</span></th>").appendTo(this);
			    	}
			    });
	
			    jQuery(this).find("tbody tr").each(function(rowIndex){
			    	var rank,rank_scoring,points,points_scoring,stars = 0;
			    	var fpIcons = jQuery(this).find(".fp-icon__link");
			    	if (fpIcons.length > 0){
			    		if (fpData[$(fpIcons.get(0)).attr("data-fp-id")]){
				    		rank = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank;
				    		rank_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank_scoring;
				    		points = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points;
				    		points_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points_scoring;
				    		stars = fpData[$(fpIcons.get(0)).attr("data-fp-id")].stars;
			    		}
				    	if (!rank){
					    	rank = 'NR';
				    	}
				    	if (!points){
				    		points = 0;
				    	}
				    	
				    	var td1 = jQuery("<td class='stat fp-enhanced fp-enhanced-cbs' " +
				    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
				    			"><span class='playerStat'>" + rank + "</span></td>");
				    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-cbs' title='" + 
				    			fpData.title + " Projected Points' " +
				    			"><span class='playerStat'>" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</span></td>");
				    	var td3 = jQuery("<td class='fp-enhanced fp-enhanced-cbs fp-matchup-stars' title='Matchup Rating'></td>");
				    	if (stars){
							for (var k=1; k<=5; k++){
								jQuery("<div class='fp-matchup-star " + ( k > Math.round(stars)  ? "fp-matchup-bad-star" : "") + "'></i>" ).appendTo(td3);
							}
				    	}
				    	td1.appendTo(this);
				    	td2.appendTo(this);
				    	td3.appendTo(this);
			    	} else {
			    		 jQuery("<td></td>").appendTo(this);
			    		 jQuery("<td></td>").appendTo(this);
			    		 jQuery("<td></td>").appendTo(this);
			    	}
			    });
		    });
		}
		
		enhancing_started = false;
		enhancing_done = true;
		
		watchForChanges();
	});
}
