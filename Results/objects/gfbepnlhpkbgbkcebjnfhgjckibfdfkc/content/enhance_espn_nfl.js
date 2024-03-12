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

function preparePage(){
	enhancing_started = true;
	enhancing_done = false;
    jQuery(".players-table__sortable").find(".player-headshot").each(function(index){
    	
    	var imgsrc = $(this).find("img").data("src"); // https://a.espncdn.com/i/headshots/nfl/players/full/3915416.png
    	if (!imgsrc){
    		return;
    	}
		var idx1 = imgsrc.lastIndexOf("/");
		var idx2 = imgsrc.indexOf(".png");
		if (idx1 != -1 && idx2 > idx1){
			var espnId = imgsrc.substring(idx1+1,idx2);
			var fpId;
	    	if (espnId && PLAYER_CACHE.espn[espnId]){
				fpId = PLAYER_CACHE.espn[espnId];
	    	} else if (espnId.length == 2 || espnId.length == 3){
	    		fpId = getDefenseId(espnId);
	    	}
	    	if (fpId && $(".fp-id-" + fpId).length == 0){
	    		$("<a class='fp-player-link fp-id-" + fpId + "'></a>").appendTo($(this).next().find(".player-column__athlete"));
	    	}
		}
    });

    jQuery(".move-action-btn").on("click",function(){
		playercardGenerator.cleanContent();
    });
}

function getDefenseId(abbrev){

	if (abbrev == "ari") {
		return 8000;
	}
	if (abbrev == "atl") {
		return 8010;
	}
	if (abbrev == "bal") {
		return 8020;
	}
	if (abbrev == "buf") {
		return 8030;
	}
	if (abbrev == "car") {
		return 8040;
	}
	if (abbrev == "chi") {
		return 8050;
	}
	if (abbrev == "cin") {
		return 8060;
	}
	if (abbrev == "cle") {
		return 8070;
	}
	if (abbrev == "dal") {
		return 8080;
	}
	if (abbrev == "den") {
		return 8090;
	}
	if (abbrev == "det") {
		return 8100;
	}
	if (abbrev == "gb") {
		return 8110;
	}
	if (abbrev == "hou") {
		return 8120;
	}
	if (abbrev == "ind") {
		return 8130;
	}
	if (abbrev == "jax") {
		return 8140;
	}
	if (abbrev == "kc") {
		return 8150;
	}
	if (abbrev == "mia") {
		return 8160;
	}
	if (abbrev == "min") {
		return 8170;
	}
	if (abbrev == "ne") {
		return 8180;
	}
	if (abbrev == "no") {
		return 8190;
	}
	if (abbrev == "nyj") {
		return 8210;
	}
	if (abbrev == "nyg") {
		return 8200;
	}
	if (abbrev == "oak" || abbrev == "lv") {
		return 8220;
	}
	if (abbrev == "phi") {
		return 8230;
	}
	if (abbrev == "pit") {
		return 8240;
	}
	if (abbrev == "lac") {
		return 8250;
	}
	if (abbrev == "sf") {
		return 8270;
	}
	if (abbrev == "sea") {
		return 8260;
	}
	if (abbrev == "lar") {
		return 8280;
	}
	if (abbrev == "tb") {
		return 8290;
	}
	if (abbrev == "ten") {
		return 8300;
	}
	if (abbrev == "was") {
		return 8310;
	}	
	return 0;	
}


var previousURL = location.href;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.cmd == 'reloadAdvice') {
    	if (msg.url != previousURL){
    		previousURL = msg.url;
    		$(".fp-extension-premium-advice").remove();
			$("#fpPanelMain").show();
    		userDataFilled = false;
    		fillUserData();


    		if (msg.url.indexOf("players/add") != -1 ||
    				msg.url.indexOf("watchlist") != -1 ||
    				msg.url.indexOf("leaders") != -1 ||
    				msg.url.indexOf("livedraftresults") != -1 ||
    				msg.url.indexOf("addeddropped") != -1){
    			//do not add player icon, it messes up ESPN player tables
    			return;
    		}
			parsePage('nfl');
    	}
    } 
    sendResponse('ok');
});

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function getLeagueId(){
	return getUrlParameter("leagueId");
}

function getLeagueType(){
    return 1; //ESPN_LEAGUE
}
function getTeamId(){
	if (document.URL.indexOf("/team/trade?") != -1){
		return getUrlParameter("fromTeamId");
	}
	return getUrlParameter("teamId") || getUrlParameter("fromTeamId");
}

function getPremiumAdviceMode(){
	if (document.URL.indexOf("/team?") != -1){
		return isStartSitAssistantReady() ? 'SSA' : '';
	} else if (document.URL.indexOf("/players/add?") != -1){
		return 'TopAv';
	} else if (document.URL.indexOf("/rosterfix?") != -1){
		return 'WA';
	} else if (document.URL.indexOf("/tradereview?") != -1){
		return 'TA';
	} else if (document.URL.indexOf("/team/trade?") != -1){
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
	var espnId = getUrlParameter("players");
	if (espnId){
		return PLAYER_CACHE.espn[espnId];
	}
}

function getDroppedPlayerId(){
	var selection = [];
	jQuery(".drop-action-btn.isActive").each(function(){
		var fpId = $(this).parents("td").prev().find(".fpExtensionIcon").attr("data-fp-id");
		if (fpId){
			selection.push(Number(fpId));
		}
	});
	if (selection.length == 1){
		return selection[0];
	}
}


function watchForTradeSelection(callback, leagueData) {
	
	if (jQuery(".form__control--checkbox").length == 0){
		setTimeout(function(){
			watchForTradeSelection(callback, leagueData);
		}, 500)
		return;
	}
	
	jQuery(".form__control--checkbox").click(function(evt){
		setTimeout(function(){
			var tradeConfig = getTradeConfig(leagueData);
			if (tradeConfig.tradeAway && tradeConfig.tradeAway.length &&
					tradeConfig.tradeFor && tradeConfig.tradeFor.length){
				callback(leagueData, tradeConfig);
			}
		}, 200);
	});
	
}

function getTradeConfig(leagueData){

	var teamName = leagueData[2];
	var teamId = leagueData[3].split("_")[2]
	var result = {};
	
	var children = $(".tradeReview-page div div").children();	
	
	if ($(".trade-team-details").length == 2){
		result.tradeFor = [];
		result.tradeAway = [];
		result.otherTeamId = getUrlParameter("teamId");
		
		
		$(".trade-team-details").each(function(){
			var isTradeFor = $(this).hasClass("incoming");
			$(this).find(".team-transaction-item-player img").each(function(){
				var imgUrl = $(this).attr("src");
				var idx1 = imgUrl.indexOf("/full/");
				var idx2 = imgUrl.indexOf(".png");
				if (idx1 != -1 && idx2 > idx1){
					var espnId = Number(imgUrl.substring(idx1 + "/full/".length, idx2));					
					var fpId;
			    	if (espnId && PLAYER_CACHE.espn[espnId]){
						fpId = PLAYER_CACHE.espn[espnId];
			    	} else if (espnId.length == 2 || espnId.length == 3){
			    		fpId = getDefenseId(espnId);
			    	}
					if (fpId){
						if (isTradeFor){
							result.tradeFor.push(fpId);
						} else {
							result.tradeAway.push(fpId);
						}
					}
				}
				
			});
		});		
	
	} else if (children.length > 0){
		var nextPlayerArray;	
		children.each(function(){
			if ($(this).html().indexOf("Trade proposal from") != -1 && $(this).find(".mh3").html()){
				result.otherTeamName = $(this).find(".mh3").html();
			} else if ($(this).html().indexOf("Incoming Players") != -1){
				nextPlayerArray = [];
				result.tradeFor = nextPlayerArray;
			} else if ($(this).html().indexOf("Trade Away") != -1){
				nextPlayerArray = [];
				result.tradeAway = nextPlayerArray;
			} else if ($(this).find(".fp-player-link").length){
				if (nextPlayerArray){
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
					nextPlayerArray = undefined;
				}
			} 
		});
	} else {
		result.tradeFor = [];
		var players = getUrlParameter("players").split(',');
		for (var k=0; k<players.length; k++){
			var espnId = Number(players[k]);
			var fpId;
	    	if (espnId && PLAYER_CACHE.espn[espnId]){
				fpId = PLAYER_CACHE.espn[espnId];
	    	} else if (espnId.length == 2 || espnId.length == 3){
	    		fpId = getDefenseId(espnId);
	    	}
			if (fpId){
				result.tradeFor.push(fpId);
			}
		}
		result.tradeAway = [];
		$(".roster-action-btn.isActive").each(function(){
			var fpId = $(this).parents("td").prev().find(".fpExtensionIcon").attr("data-fp-id");
			if (fpId){
				result.tradeAway.push(Number(fpId));
			}
		});		
	}
	
	return result;
}

function watchForPlayerSelection(callback, leagueData) {
	if (jQuery(".drop-action-btn").length == 0){
		setTimeout(function(){
			watchForPlayerSelection(callback, leagueData);
		}, 500)
		return;
	} else {		
		playercardGenerator.run();
	}
	jQuery(".drop-action-btn").each(function(){
		jQuery(this).click(function(){
			setTimeout(function(){
				callback(leagueData, getAddedPlayerId(), getDroppedPlayerId());
			}, 50)
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
		var pos = jQuery(this).parents("tr").find(".playerSlot").html();
		if (pos){
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
	
	/*
	if (location.href.indexOf("players/add") == -1 &&
			location.href.indexOf("watchlist") == -1){
	    observer_target_selector = '.layout.is-full';
	}
    */
	
	var league_id = getLeagueId();

	chrome.runtime.sendMessage({'cmd':'getFpData', leagueId: league_id, leagueType:'espn'}, function(fpData){  

		var abortEnhance = false;
		if (!fpData){
			abortEnhance = true;
		}  

		var selection = jQuery(".tabs__list__item--active").html();
		if (!selection){
			abortEnhance = true;			
		} else if (selection.indexOf('Overview') == -1  && selection.indexOf('Projections') == -1){
			abortEnhance = true;
		}

		if (false && //Sep 4th, 2019: disable player table injection 
				abortEnhance == false){
			var onProjectionsTab = selection.indexOf('Projections') != -1;
		    var player_table_selector = '.players-table .Table2__table';
		    jQuery(player_table_selector).each(function(tableIndex){
			    var isPlayerTable = false;
			    jQuery(this).find("tr").each(function(rowIndex){
			    	if (rowIndex == 0){
				    	var ths = jQuery(this).find("th");
				    	if (ths.length == 0){
				    		//not a player table
				    	} else if (ths.get(0).innerHTML.indexOf('PLAYERS') != -1 ||
				    			ths.get(0).innerHTML.indexOf('STARTERS') != -1 ||
				    			ths.get(0).innerHTML.indexOf('BENCH') != -1 ){
					    	isPlayerTable = true;
						    jQuery("<td class='sectionLeadingSpacer'></td>").appendTo(this);
						    jQuery("<th class='fp-enhanced-espn' colspan='" + (onProjectionsTab ? 2 : 3)+
						    		"'><a href='https://www.fantasypros.com/' target='_blank'>FantasyPros</a></th>").appendTo(this);
				    	}
			    	} else if (isPlayerTable && rowIndex == 1){
					    jQuery("<td class='sectionLeadingSpacer'></td>").appendTo(this);
					    jQuery("<td class='playertableData' style='text-align: center;' title='" + fpData.title + 
					    			" Expert Consensus Rankings'>ECR</td>").appendTo(this);
					    jQuery("<td class='playertableData' style='text-align: center;' title='" + fpData.title + 
					    			" Projected Points' >PROJ</td>").appendTo(this);
					    if (onProjectionsTab == false){
						    jQuery("<td class='playertableData' style='text-align: center;' title='Matchup Rating'>MATCHUP</td>").appendTo(this);
					    }
			    	} else if (isPlayerTable && jQuery(this).find("td.bg-clr-gray-08").length > 0){
			    		// separate starters vs bench
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
					    	var ths = jQuery(this).find("th");
					    	var tds = jQuery(this).find("td");
					    	if (ths.length == 0){
					    		if (tds.length > 0 && tds.get(0).innerHTML.indexOf('SLOT') != -1){
					    			
								    jQuery("<td class='sectionLeadingSpacer'></td>").appendTo(this);
								    jQuery("<td class='playertableData' style='text-align: center;' title='" + fpData.title + 
					    				" Expert Consensus Rankings' >ECR</td>").appendTo(this);
								    jQuery("<td class='playertableData' style='text-align: center;' title='" + fpData.title + 
					    				" Projected Points' >PROJ</td>").appendTo(this);
								    if (onProjectionsTab == false){
									    jQuery("<td class='playertableData' style='text-align: center;' title='Matchup Rating'>MATCHUP</td>").appendTo(this);
								    }
								    return;
					    		}
					    	} else if (ths.get(0).innerHTML.indexOf('PLAYERS') != -1 ||
					    			ths.get(0).innerHTML.indexOf('STARTERS') != -1 ||
					    			ths.get(0).innerHTML.indexOf('BENCH') != -1 ){
							    jQuery("<td class='sectionLeadingSpacer'></td>").appendTo(this);
							    jQuery("<th class='fp-enhanced-espn' colspan='" + (onProjectionsTab ? 2 : 3)+
						    		"'><a href='https://www.fantasypros.com/' target='_blank'>FantasyPros</a></th>").appendTo(this);
							    return;
					    	} 
					    	rank = '-';
				    	}
				    	if (!points){
				    		points = 0;
				    	}
				    	
				    	var td1 = jQuery("<td class='fp-enhanced fp-enhanced-espn' " +
				    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
				    			">" + rank + "</td>");
				    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-espn' title='" + 
				    			fpData.title + " Projected Points' " +
				    			">" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</td>");
					    jQuery("<td class='sectionLeadingSpacer'></td>").appendTo(this);
				    	td1.appendTo(this);
				    	td2.appendTo(this);
				    	
					    if (onProjectionsTab == false){	
					    	var td3 = jQuery("<td class='fp-enhanced fp-enhanced-espn fp-matchup-stars' title='Matchup Rating'></td>");
					    	td3.appendTo(this);
					    	if (stars){
								for (var k=1; k<=5; k++){
									jQuery("<div class='fp-matchup-star " + ( k > Math.round(stars)  ? "fp-matchup-bad-star" : "") + "'></i>" ).appendTo(td3);
								}
					    	}
					    }
			    	}
			    });
			    if (isPlayerTable){
			    	jQuery(this).addClass("fp-player-table-espn");
			    }
		    });
		}
		
		enhancing_started = false;
		enhancing_done = true;
		
		watchForChanges();
	});
	
}

function watchForPlayerChanges(){
	if (location.href.indexOf("players/add") != -1 ||
			location.href.indexOf("watchlist") != -1 ||
			location.href.indexOf("draftrecap") != -1 ||
			location.href.indexOf("boxscore") != -1||
			location.href.indexOf("waiverreport") != -1||
			location.href.indexOf("offerreport") != -1){
		return;
	}
	var target_observe = document.querySelector(".is-full");
	if (target_observe){
		var espn_observer = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else if (enhancing_started && !enhancing_done) {
				// do nothing
			} else if ($(".fp-enhanced").length > 0) {
				// do nothing
			} else {
				this.disconnect();
				if ($(".is-full .fp-icon__link").length == 0) {
					parsePage('nfl');
				} else {
					enhancePage(true);
				}
			}
		});
		var observerConfig = {
			    childList: true,
			    characterData: true,
			    subtree: true
			}
		espn_observer.observe(target_observe, observerConfig);
	}
}

watchForPlayerChanges();


