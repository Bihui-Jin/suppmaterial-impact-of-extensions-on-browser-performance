
function preparePage(){
	enhancing_started = true;
	enhancing_done = false;
	
    jQuery(".content").find("a.playerName").each(function(index){
    	var href = jQuery(this).prop("href");
    	if (href && href.indexOf){
	    	var idx1 = href.indexOf("playerId=");
	    	if (idx1 != -1){
	    		var nflId = href.substring(idx1 + "playerId=".length);
	        	if (nflId && PLAYER_CACHE.nfl[nflId]){
					var fpId = PLAYER_CACHE.nfl[nflId];
					jQuery(this).addClass('fp-player-link').addClass('fp-id-' + fpId);
		    	} 
	    	}
    	}
    });
}

function getLeagueId(){
    var league_id = document.URL.match(/fantasy.nfl.com\/league\/(\d+)/)[1];  
    return league_id;
}

function getLeagueType(){
    return 5; //NFLDOTCOM_LEAGUE
}
function getTeamId(){
	var before = "/league/" + getLeagueId() + "/team/";
    var idx1 = document.URL.indexOf(before);
	if (idx1 > 0){
		var str = document.URL.substring(idx1 + before.length);
		if (str){
			str = str.split("/")[0];
			str = str.split("?")[0];
			if (str){
				return Number(str);
			}
		}
	}
	return -1;	
}

function getPremiumAdviceMode(){
	var ssaMatch = "/league/" + getLeagueId() + "/team/" + getTeamId();
	var topAvailableMatch = "/league/" + getLeagueId() + "/players";
	var waMatch = "/league/" + getLeagueId() + "/team/" + getTeamId() + "/addplayerreview";
	if (document.URL.indexOf(ssaMatch) == (document.URL.length - ssaMatch.length)){
		return isStartSitAssistantReady() ? 'SSA' : '';
	} else if (document.URL.indexOf("confirmPage=teamRosterEditConfirm") != -1){
		ssaMatch = "/league/" + getLeagueId() + "/team/" + getTeamId() + "?";
		if (document.URL.indexOf(ssaMatch) != -1){
			return isStartSitAssistantReady() ? 'SSA' : '';
		}
	} else if (document.URL.indexOf(topAvailableMatch) == (document.URL.length - topAvailableMatch.length)){
		return 'TopAv';
	} else if (document.URL.indexOf(waMatch) != -1){
		return 'WA';
	} else if (document.URL.indexOf("/league/" + getLeagueId() + "/team/" + getTeamId() + "/trade") != -1){
		return 'TA';
	}
	return '';
}

function getRequests() {
    var s1 = location.search.substring(1, location.search.length).split('&'),
        r = {}, s2, i;
    for (i = 0; i < s1.length; i += 1) {
        s2 = s1[i].split('=');
        r[decodeURIComponent(s2[0])] = decodeURIComponent(s2[1]);
    }
    return r;
};

function getAddedPlayerId(){
	var nflId = getRequests()["addPlayerId"];
	if (nflId){
		return PLAYER_CACHE.nfl[nflId];
	}
}

function getDroppedPlayerId(){
	var nflId = getRequests()["dropPlayerId"] || getRequests()["dropPlayerId[]"];
	if (nflId){
		return PLAYER_CACHE.nfl[nflId];
	}
}

function getUrlParameter(params, name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(params);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function getPlayersArray(params, name) {
	var result = [];
	var splits = params.split("&");
	for (var i=0; i<splits.length; i++){
		var nflId = getUrlParameter("?" + splits[i], name);
		if (nflId && PLAYER_CACHE.nfl[nflId]){
			result.push(PLAYER_CACHE.nfl[nflId]);
		}
	}
    return result;
};

function getTradeConfig(leagueData){
	var result = {};
	result.otherTeamId = getUrlParameter(location.search, "tradeeTeamId");
	
	if (result.otherTeamId){
		var qs = location.search.replace(/%5B%5D/g,"");	
		result.tradeFor = getPlayersArray(qs, "tradeePlayerId");
		result.tradeAway = getPlayersArray(qs, "traderPlayerId");
		result.dropMine = getPlayersArray(qs, "traderDropPlayerId");
		result.dropTheirs = getPlayersArray(qs, "tradeeDropPlayerId");
	} else {
		$("#teamTrade").find(".tableWrap").each(function(){
			if ($(this).find("h4 .teamName").length){
		    	var href = $(this).find("h4 .teamName").prop("href");
				var idx = href.lastIndexOf("/");
				if (idx != -1){
					var tId = Number(href.substring(idx + 1));
					result.otherTeamId = tId;
				}
			}
			
			var nextPlayerArray = []
			$(this).find(".fp-player-link").each(function(){
				var idx = this.className.indexOf("fp-id-");
				if (idx == -1){
					return;
				}
				var fpId = Number(this.className.substring(idx + "fp-id-".length).split(" ")[0]);
				if (isNaN(fpId)){
					return;
				}
				nextPlayerArray.push(fpId);
			});
			
			if (nextPlayerArray.length){
				var h4 = $(this).find("h4").html();
				if (!h4){
					return;
				} else if (h4.indexOf("wants to trade") != -1){
					result.tradeAway = nextPlayerArray;
				} else if (h4.indexOf("You have proposed to trade for") != -1){
					result.tradeFor = nextPlayerArray;
				} else if (h4.indexOf("In exchange for") != -1){
					if (result.tradeFor){
						result.tradeAway = nextPlayerArray;
					} else {
						result.tradeFor = nextPlayerArray;
					}
				} else if (h4.indexOf("will be dropped from your team") != -1){
					result.dropMine = nextPlayerArray;
				}
				
			}
			
		});
	}
	
	return result;
	
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
		var selects = jQuery(this).parents("tr").find(".teamPositionEdit").find("select");
		if (selects.get(0) && selects.get(0).options.length > 0 && selects.get(0).selectedIndex != -1){
			var selection = selects.get(0).options[selects.get(0).selectedIndex];
			if (selection && selection.text){
				result.push(selection.text + ":" + fpId);
			}
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
	
    observer_target_selector = '#teamHome';
    if (jQuery(observer_target_selector).length == 0){
        observer_target_selector = '#playersHomeList';    	
    }
    if (jQuery(observer_target_selector).length == 0){
        observer_target_selector = '#teamMatchupPreview';    	
    }

    var league_id = getLeagueId();    
    var onMatchupPage = document.URL.indexOf('/gamecenter') != -1;
    
	chrome.runtime.sendMessage({'cmd':'getFpData', leagueId: league_id, leagueType:'ndc'}, function(fpData){   

		var abortEnhance = false;
		if (!fpData){
			abortEnhance = true;
		} 
		
		var selection = jQuery(".statCategoryNav .selected .text").html();
		if (!selection){
			selection = jQuery(".teamMatchupTypeNav .selected span").html();
		}
		 
		if (!selection){
			abortEnhance = true;			
		} else if (selection.indexOf('Stats') == -1  && 
				selection.indexOf('Projections') == -1  && 
				selection.indexOf('Box Score') == -1){
			abortEnhance = true;
		}

		if (abortEnhance == false){

			var onProjectionsTab = selection.indexOf('Projections') != -1;
		    var player_table_selector = '.tableType-player';
	
		    jQuery(player_table_selector).each(function(tableIndex){
		    	
			    jQuery(this).addClass("fp-player-table-ndc");
			    
			    jQuery(this).find("thead tr").each(function(rowIndex){
			    	var ths = jQuery(this).find("th");
			    	if (rowIndex == 0){
			    		var th = jQuery("<th class='fp-enhanced-ndc' colspan='" + (onProjectionsTab || onMatchupPage ? 2 : 3) + "'><span>" +
								"<a href='https://www.fantasypros.com/' target='_blank'>FantasyPros</a></span></th>");
					    if (onMatchupPage){
					    	th.insertAfter(ths.get(3));
					    } else {
					    	th.appendTo(this);
					    }
			    	} else if (rowIndex == 1){
			    		var th1 = jQuery("<th class='stat fp-enhanced-ndc' style='width:43px' title='" + fpData.title + 
						    			" Expert Consensus Rankings'><span>ECR</span></th>");
			    		var th2 = jQuery("<th class='stat fp-enhanced-ndc' style='width:43px' title='" + fpData.title + 
						    			" Projected Points' ><span>Proj</span></th>");
					    if (onMatchupPage){
					    	th1.insertAfter(ths.get(3));
					    	th2.insertAfter(th1);
					    } else {
					    	th1.appendTo(this);
						    th2.appendTo(this);
						    if (onProjectionsTab == false){
							    jQuery("<th class='stat fp-enhanced-ndc' style='width:60px;white-space: nowrap' title='Matchup Rating'><span>Matchup</span></th>").appendTo(this);
						    }
					    }
			    	}
			    });
	
			    jQuery(this).find("tbody tr").each(function(rowIndex){
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
			    	
			    	var td1 = jQuery("<td class='stat fp-enhanced fp-enhanced-ndc' " +
			    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
			    			"><span class='playerStat'>" + rank + "</span></td>");
			    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-ndc' title='" + 
			    			fpData.title + " Projected Points' " +
			    			"><span class='playerStat'>" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</span></td>");
				    if (onMatchupPage){
				    	td1.insertAfter(tds.get(3));
				    	td2.insertAfter(td1);
				    } else {
				    	td1.appendTo(this);
				    	td2.appendTo(this);
					    if (onProjectionsTab == false){
					    	var td3 = jQuery("<td class='fp-enhanced fp-enhanced-ndc fp-matchup-stars' title='Matchup Rating'></td>");
					    	td3.appendTo(this);
					    	if (stars){
								for (var k=1; k<=5; k++){
									jQuery("<div class='fp-matchup-star " + ( k > Math.round(stars)  ? "fp-matchup-bad-star" : "") + "'></i>" ).appendTo(td3);
								}
					    	}
					    }
				    }
			    });
		    });
		}
		
		enhancing_started = false;
		enhancing_done = true;
		
		watchForChanges();
	});
	
}
