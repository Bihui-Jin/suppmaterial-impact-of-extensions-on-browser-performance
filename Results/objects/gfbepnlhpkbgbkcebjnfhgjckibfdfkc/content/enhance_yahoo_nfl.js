function preparePage(){
	enhancing_started = true;
	enhancing_done = false;
	
	if (document.URL.indexOf('keepers') != -1){
		return; // bad formatting
	}
	
    jQuery("a").each(function(index){
    	var href = jQuery(this).prop("href");
    	if (href && href.indexOf){
	    	var idx = href.indexOf("/players/");
	    	if (idx != -1){
	    		var yahooId = href.substring(idx + "/players/".length);
	    		if (yahooId.indexOf("/") == -1 && PLAYER_CACHE.yahoo[yahooId]){
	    			var fpId = PLAYER_CACHE.yahoo[yahooId];
	    			jQuery(this).addClass('fp-player-link').addClass('fp-id-' + fpId);
	    		}
	    	} else if (jQuery(this).hasClass('yfa-icon') == false){
	        	idx = href.indexOf("/teams/");
	        	if (idx != -1){
	        		var abbrev = href.substring(idx + "/teams/".length);
	        		var yahooId = convertTeamCode(abbrev);
	    			var fpId = PLAYER_CACHE.yahoo[yahooId];
	        		if (fpId){
	        			jQuery(this).addClass('fp-player-link').addClass('fp-id-' + fpId);
	        		}
	        	}
	    	}
    	}
    });
}

function getLeagueId(){
	var m = document.URL.match(/football.fantasysports.yahoo.com\/f1\/(\d+)/);
    return m && m.length > 1 ? m[1]: undefined;
}

function getLeagueType(){
    return 10; //YAHOO_OAUTH_LEAGUE
}
function getTeamId(){
	var before = "/f1/" + getLeagueId() + "/";
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
	var ssaMatch = "/f1/" + getLeagueId() + "/" + getTeamId();
	if (document.URL.indexOf(ssaMatch) == (document.URL.length - ssaMatch.length) || document.URL.indexOf(ssaMatch+"?") != -1){
		return isStartSitAssistantReady() ? 'SSA' : '';
	} else if (document.URL.indexOf("/f1/" + getLeagueId() + "/players") != -1 && document.URL.indexOf("search") == -1){
		return 'TopAv';
	} else if (document.URL.indexOf("/f1/" + getLeagueId() + "/addplayer") != -1 ||
			document.URL.indexOf("/f1/" + getLeagueId() + "/" + getTeamId() + "/viewwaiver") != -1){
		return 'WA';
	} else if (document.URL.indexOf("/f1/" + getLeagueId() + "/" + getTeamId() + "/viewtrade") != -1 ){
		return 'TA';
	} else if (document.URL.indexOf("/f1/" + getLeagueId() + "/" + getTeamId() + "/proposetrade") != -1){
		return document.URL.indexOf('stage=1') != -1 ? '' : 'TA';
	}
	return '';
}

function getAddedPlayerId(){
	var href = $("#add-player-card").find("a.name").attr("href");
	if (!href){
		return;
	}
	var idx = href.indexOf("/players/");
	if (idx != -1){
		var yahooId = href.substring(idx + "/players/".length);
		if (yahooId.indexOf("/") == -1 && PLAYER_CACHE.yahoo[yahooId]){
			return PLAYER_CACHE.yahoo[yahooId];
		}
	}
}

function getDroppedPlayerId(){
	var href = $("#drop-player-card").find("a.name").attr("href");
	if (!href){
		return;
	}
	var idx = href.indexOf("/players/");
	if (idx != -1){
		var yahooId = href.substring(idx + "/players/".length);
		if (yahooId.indexOf("/") == -1 && PLAYER_CACHE.yahoo[yahooId]){
			return PLAYER_CACHE.yahoo[yahooId];
		}
	}
}

function getTradeConfig(leagueData){

	var teamName = leagueData[2];
	var teamId = leagueData[3].split("_")[2];
	var result = {};
	var otherTeamName;
	var nextPlayerArray;
	
	var children = $("#viewtradeactions").children().length ? $("#viewtradeactions").children() : $("#proposetradeform").children();
	
	if (children.length == 0){

		$("#evaluate-players").find("section").each(function(idx){
			var href = $(this).find("h3 a").attr("href");
			if (!href){
				return;
			}
			var idx = href.lastIndexOf("/");
			if (idx != -1){
				var tId = Number(href.substring(idx + 1));
				if (teamId == tId){
					nextPlayerArray = [];
					result.tradeAway = nextPlayerArray;
				} else {
					result.otherTeamId = tId;
					nextPlayerArray = [];
					result.tradeFor = nextPlayerArray;
				}
			}

			if ($(this).find(".fp-player-link").length){
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
			var players = $(this).find(".players").html();
			if (players && players.indexOf("Draft") != -1 && players.indexOf("Pick") != -1 && players.indexOf("Round") != -1){
				result.includesDraftPicks = true;
			}
		});
		
	} else {
	
		children.each(function(){
			if ($(this).find("h2").length){
				var href = $(this).find("a").attr("href");
				if (!href){
					return;
				}
				var idx = href.lastIndexOf("/");
				if (idx != -1){
					var tId = Number(href.substring(idx + 1));
					
					if ($(this).find("span").html().indexOf("Players to Drop") != -1){						
						if (teamId == tId){
							nextPlayerArray = [];
							result.dropMine = nextPlayerArray;
						} else {
							nextPlayerArray = [];
							result.dropTheirs = nextPlayerArray;
						}
					} else if (teamId == tId){
						nextPlayerArray = [];
						result.tradeAway = nextPlayerArray;
					} else {
						otherTeamName = $(this).find("h2").html().trim();
						result.otherTeamId = tId;
						nextPlayerArray = [];
						result.tradeFor = nextPlayerArray;
					}
				}
			} else if ($(this).hasClass("tablehead")){
				var title = $(this).html().trim();
				var idx = title.indexOf(" (Players to Drop)");
				if (idx != -1){
					if (title.indexOf(teamName) != -1){
						nextPlayerArray = [];
						result.dropMine = nextPlayerArray;
					} else if (title.indexOf(otherTeamName) != -1){
						nextPlayerArray = [];
						result.dropTheirs = nextPlayerArray;
					}
				}
				
			} 
			if ($(this).find(".fp-player-link").length){
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
	
			if (($(this).find(".ysf-proposed-draft-picks").get(0) || $(this).hasClass("ysf-proposed-draft-picks")) && $(this).find("input").val()){
				result.includesDraftPicks = true;
			}
		});
		
	}
	
	return result;
}

var player_selection_observer;

function watchForPlayerSelection(callback, leagueData) {
	
	var target_observe = document.querySelector("#player-cards");
	if (!target_observe){
		return;
	}
	
    if (!player_selection_observer){
    	player_selection_observer = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else if(getAddedPlayerId() && getDroppedPlayerId()){
				callback(leagueData, getAddedPlayerId(), getDroppedPlayerId());
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	player_selection_observer.observe(target_observe, observerConfig);
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
		var pos = jQuery(this).parents("tr").find(".pos-label").html();
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

    var league_id = getLeagueId();

    var onMatchupPreviewPage = document.URL.indexOf('/matchup') != -1;
    var onFreeAgencyPage = document.URL.indexOf('/players') != -1;

    observer_target_selector = '#team-roster';
	if (onMatchupPreviewPage) {
		observer_target_selector = '#yspmaincontent';
	} else if (onFreeAgencyPage) {
		observer_target_selector = '#players-table-wrapper';
	}
    
	chrome.runtime.sendMessage({'cmd':'getFpData', leagueId: league_id, leagueType:'yahoo'}, function(fpData){  

		var abortEnhance = false;
		if (!fpData){
			abortEnhance = true;
		}  
		var selectedLis = jQuery("#full_stat_nav li.Selected a");
		if (selectedLis.length >= 2 && !onMatchupPreviewPage && !onFreeAgencyPage){
			if (selectedLis.get(0).innerHTML.trim() == 'Stats'){
				if (selectedLis.get(1).innerHTML.trim() != fpData.title.trim()){
					abortEnhance = true;
				}
			} else if (selectedLis.get(0).innerHTML.trim() == 'Projected Stats'){
				if (selectedLis.get(2).innerHTML.trim() != fpData.title.trim()){
					abortEnhance = true;
				}
			} else {
				abortEnhance = true;
			}
		}
		
		if (document.URL.indexOf('keepers') != -1){
			abortEnhance = true;
		}
		
		if (abortEnhance == false){
		    var player_table_selector = 'table[id^=statTable]';
			if (jQuery(player_table_selector).length == 0){
				player_table_selector = '#players-table .Table';
			}
		// for live yahoo tracker
		//	if (jQuery(player_table_selector).length == 0){
		//		player_table_selector = '#matchups table';
		//	}
			
		    jQuery(player_table_selector).each(function(index){

		    	jQuery(this).addClass("fp-player-table-yahoo");
		    	
				var insertBeforeCol = 0;
			    
		    	jQuery(this).find("thead").each(function(){
			    	
			    	jQuery(this).find("tr").each(function(index){
				    	var ths = jQuery(this).find("th");
	
				    	if (onMatchupPreviewPage){
					    	var th1 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Expert Consensus Rankings' style='text-align:center'>ECR</th>");
					    	var th2 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Projected Points' style='text-align:center;white-space:nowrap'>FP Proj</th>");
					    	th1.insertAfter(ths.get(1));
					    	th2.insertAfter(th1);
				    	} else if (index == 0){
							var insertBeforeTh = 0;
				    		for (var k=0; k<ths.length; k++){
				    			if (jQuery(ths.get(k)).html().indexOf('Fantasy') != -1){
				    				break;
				    			}
				    			if (jQuery(ths.get(k)).attr('colspan')){
				    				insertBeforeCol += Number(jQuery(ths.get(k)).attr('colspan'));
				    			} else {
				    				insertBeforeCol += 1;
				    			}
				    			insertBeforeTh +=1;
				    		}
					    	jQuery("<th class='fp-enhanced fp-enhanced-yahoo' colspan='" + (onMatchupPreviewPage ? 2 : 3) + 
					    			"' style='text-align:center'>" +
					    			"<a href='#' onclick='window.open(\"https://www.fantasypros.com/\")'>FantasyPros</a></th>"
					    			).insertBefore(ths.get(insertBeforeTh));
				    	} else if (index == 1){
					    	var insertBefore = 0;
				    		for (var k=0; k<ths.length; ){
				    			if (k >= insertBeforeCol){
				    				break;
				    			}
				    			if (jQuery(ths.get(k)).attr('colspan')){
				    				k += Number(jQuery(ths.get(k)).attr('colspan'));
				    			} else {
				    				k++;
				    			}
				    			insertBefore++;
				    		}
					    	var th1 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Expert Consensus Rankings' style='text-align:center'>ECR</th>");
					    	var th2 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Projected Points' style='text-align:center'>Proj</th>");
					    	th1.insertBefore(ths.get(insertBefore));
					    	th2.insertAfter(th1);
					    	if (onMatchupPreviewPage == false){
						    	var th3 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='Matchup Rating" + 
				    					"' style='text-align:center;white-space:nowrap'>Matchup</th>");
						    	th3.insertAfter(th2);
					    	}
				    	}
			    	});
			    });
	
			    jQuery(this).find("tbody").each(function(index){
			    	var totalPoints = 0;
			    	jQuery(this).find("tr").each(function(index){
				    	var tds = jQuery(this).find("td");
				    	
				    	var rank,rank_scoring,points,points_scoring,stars = 0;
				    	var fpIcons = jQuery(onMatchupPreviewPage ? tds.get(1) : this).find(".fp-icon__link");
				    	if (fpIcons.length > 0 && fpData[$(fpIcons.get(0)).attr("data-fp-id")]){
				    		rank = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank;
				    		rank_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank_scoring;
				    		points = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points;
				    		points_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points_scoring;
				    		stars = fpData[$(fpIcons.get(0)).attr("data-fp-id")].stars;
				    	} else if (onMatchupPreviewPage){
				    		if (this.innerHTML.indexOf('TOTAL') != -1){
					    		if (totalPoints > 0){
					    			jQuery("<td class='fp-enhanced fp-enhanced-yahoo' title='Total Projected Points' " +
							    			">" + parseFloat(Math.round(totalPoints * 10) / 10).toFixed(1) + "</td>").insertAfter(tds.get(1));
					    			totalPoints = 0;
					    		} else {
					    			jQuery("<td></td>").insertAfter(tds.get(1));
					    		}
					    		jQuery("<td></td>").insertAfter(tds.get(1));
				    		} else{
				    			//empty position
						    	var td1 = jQuery("<td class='Bdrstart fp-enhanced fp-enhanced-yahoo'>-</td>");
						    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-yahoo'>0.00</td>");
						    	td1.insertAfter(tds.get(1));
						    	td2.insertAfter(td1);
				    		}
				    		return;
				    	}
				    	if (!rank){
				    		rank = '-';
				    	}
				    	if (!points){
				    		points = 0;
				    	} else {
				    		totalPoints += Number(points);
				    	}
		
				    	var insertBefore = 0;
			    		for (var k=0; k<tds.length; ){
			    			if (k >= insertBeforeCol){
			    				break;
			    			}
			    			if (jQuery(tds.get(k)).attr('colspan')){
			    				k += Number(jQuery(tds.get(k)).attr('colspan'));
			    			} else {
			    				k++;
			    			}
			    			insertBefore++;
			    		}
			    		
				    	var td1 = jQuery("<td class='Bdrstart fp-enhanced fp-enhanced-yahoo' " +
				    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
				    			">" + rank + "</td>");
				    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-yahoo' title='" + 
				    			fpData.title + " Projected Points' " +
				    			">" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</td>");
				    	if (onMatchupPreviewPage){
					    	td1.insertAfter(tds.get(1));
					    	td2.insertAfter(td1);
				    	} else {
					    	td1.insertBefore(tds.get(insertBefore));
					    	td2.insertAfter(td1);
					    	var td3 = jQuery("<td class='Bdrstart fp-enhanced fp-enhanced-yahoo fp-matchup-stars' title='Matchup Rating'></td>");
					    	td3.insertAfter(td2);
					    	if (stars){
								for (var k=1; k<=5; k++){
									jQuery("<div class='fp-matchup-star " + ( k > Math.round(stars)  ? "fp-matchup-bad-star" : "") + "'></i>" ).appendTo(td3);
								}
					    	}
				    	}
				    });
			    });
			    
		    	if (onMatchupPreviewPage){
			    	jQuery(this).find("thead").each(function(){			    	
				    	jQuery(this).find("tr").each(function(index){
					    	var ths = jQuery(this).find("th");
					    	var th1 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Expert Consensus Rankings' style='text-align:center'>ECR</th>");
					    	var th2 = jQuery("<th class='fp-enhanced fp-enhanced-yahoo' title='" + fpData.title + 
					    			" Projected Points' style='text-align:center;white-space:nowrap'>FP Proj</th>");
					    	th1.insertAfter(ths.get(ths.length-3));
					    	th2.insertAfter(ths.get(ths.length-3));
				    	});
			    	});
				    jQuery(this).find("tbody").each(function(index){
				    	var totalPoints = 0;
				    	jQuery(this).find("tr").each(function(index){
					    	var tds = jQuery(this).find("td");
					    	var rank,rank_scoring,points,points_scoring, stars=0;
					    	var fpIcons = jQuery(tds.get(11)).find(".fp-icon__link");
					    	if (fpIcons.length > 0 && fpData[$(fpIcons.get(0)).attr("data-fp-id")]){
					    		rank = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank;
					    		rank_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].rank_scoring;
					    		points = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points;
					    		points_scoring = fpData[$(fpIcons.get(0)).attr("data-fp-id")].points_scoring;
					    		stars = fpData[$(fpIcons.get(0)).attr("data-fp-id")].stars;
					    	} else {
					    		if (this.innerHTML.indexOf('TOTAL') != -1){
						    		jQuery("<td></td>").insertAfter(tds.get(tds.length-3));
						    		if (totalPoints > 0){
						    			jQuery("<td class='fp-enhanced fp-enhanced-yahoo' title='Total Projected Points' " +
								    			">" + parseFloat(Math.round(totalPoints * 10) / 10).toFixed(1) + "</td>").insertAfter(tds.get(10));
						    			totalPoints = 0;
						    		} else {
						    			jQuery("<td></td>").insertAfter(tds.get(tds.length-3));
						    		}
					    		} else {
					    			//empty position
							    	var td1 = jQuery("<td class='Bdrstart fp-enhanced fp-enhanced-yahoo'>-</td>");
							    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-yahoo'>0.00</td>");
							    	td1.insertAfter(tds.get(tds.length-3));
							    	td2.insertAfter(tds.get(tds.length-3));
					    		}
					    		return;
					    	}
					    	if (!rank){
					    		rank = '-';
					    	}
					    	if (!points){
					    		points = 0;
					    	} else {
					    		totalPoints += Number(points);
					    	}
				    		
					    	var td1 = jQuery("<td class='Bdrstart fp-enhanced fp-enhanced-yahoo' " +
					    			( rank_scoring ? "title='" + rank_scoring + "'" : "" ) +
					    			">" + rank + "</td>");
					    	var td2 = jQuery("<td class='fp-enhanced fp-enhanced-yahoo' title='" + 
					    			fpData.title + " Projected Points' " +
					    			">" + parseFloat(Math.round(Number(points) * 100) / 100).toFixed(2) + "</td>");
		
					    	td1.insertAfter(tds.get(tds.length-3));
					    	td2.insertAfter(tds.get(tds.length-3));
					    });
				    });
		    	}
	
		    });
		}
		
		enhancing_started = false;
		enhancing_done = true;
		
		watchForChanges();
		
	});
	
}

function convertTeamCode(name){
	name = name.toLowerCase();
	if (name == "ari" || name.indexOf("arizona") == 0){
		return 100022;
	} else if (name == "atl" || name.indexOf("atlanta") == 0){
		return 100001;
	} else if (name == "bal" || name.indexOf("baltimore") == 0){
		return 100033;
	} else if (name == "buf" || name.indexOf("buffalo") == 0){
		return 100002;
	} else if (name == "car" || name.indexOf("carolina") == 0){
		return 100029;
	} else if (name == "chi" || name.indexOf("chicago") == 0){
		return 100003;
	} else if (name == "cin" || name.indexOf("cincinnati") == 0){
		return 100004;
	} else if (name == "cle" || name.indexOf("cleveland") == 0){
		return 100005;
	} else if (name == "dal" || name.indexOf("dallas") == 0){
		return 100006;
	} else if (name == "den" || name.indexOf("denver") == 0){
		return 100007;
	} else if (name == "det" || name.indexOf("detroit") == 0){
		return 100008;
	} else if (name == "gnb" || name.indexOf("green-bay") == 0){
		return 100009;
	} else if (name == "hou" || name.indexOf("houston") == 0){
		return 100034;
	} else if (name == "ind" || name.indexOf("indianapolis") == 0){
		return 100011;
	} else if (name == "jac" || name.indexOf("jacksonville") == 0){
		return 100030;
	} else if (name == "kan" || name.indexOf("kansas-city") == 0){
		return 100012;
	} else if (name == "mia" || name.indexOf("miami") == 0){
		return 100015;
	} else if (name == "min" || name.indexOf("minnesota") == 0){
		return 100016;
	} else if (name == "nwe" || name.indexOf("new-england") == 0){
		return 100017;
	} else if (name == "nor" || name.indexOf("new-orleans") == 0){
		return 100018;
	} else if (name == "nyj" || name.indexOf("ny-jets") == 0){
		return 100020;
	} else if (name == "nyg" || name.indexOf("ny-giants") == 0){
		return 100019;
	} else if (name == "oak" || name.indexOf("oakland") == 0 || name.indexOf("las") == 0 || name.indexOf("lv") == 0){
		return 100013;
	} else if (name == "phi" || name.indexOf("philadelphia") == 0){
		return 100021;
	} else if (name == "pit" || name.indexOf("pittsburgh") == 0){
		return 100023;
	} else if (name == "sdg" || name == "lac" || name.indexOf("la-chargers") == 0){
		return 100024;
	} else if (name == "sfo" || name.indexOf("san-francisco") == 0){
		return 100025;
	} else if (name == "sea" || name.indexOf("seattle") == 0){
		return 100026;
	} else if (name == "stl" || name == "lar" || name.indexOf("la-rams") == 0){
		return 100014;
	} else if (name == "tam" || name.indexOf("tampa-bay") == 0){
		return 100027;
	} else if (name == "ten" || name.indexOf("tennessee") == 0){
		return 100010;
	} else if (name == "was" || name.indexOf("washington") == 0){
		return 100028;
	}
	return 0;
}
