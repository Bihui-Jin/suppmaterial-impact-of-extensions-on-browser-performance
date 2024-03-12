var jquery_regex_repl = jquery_regex_repl || /(<(\b(img|head|link)\b)(([^>]*\/>)|([^\7]*(<\/\2[^>]*>)))|(<\bimg\b)[^>]*>|(\b(background|style)\b=\s*"[^"]*"))/g;

function getYahooBaseUrl(sport){
	return sport == 'mlb' ? "https://baseball.fantasysports.yahoo.com/b1/" :
 		sport == 'nba' ? "https://basketball.fantasysports.yahoo.com/nba/" :
 			'https://football.fantasysports.yahoo.com/f1/';
}

function getYahooMyLeaguesUrl(sport){
	return getYahooBaseUrl(sport) + 'myleagues';
}

function getYahooRostersUrl(sport, leagueId){
	var url_rosters = getYahooBaseUrl(sport) + leagueId;
	if (sport == 'mlb' || sport == 'nba'){
		url_rosters += "/startingrosters";
	} else {
		url_rosters += "/starters";
	}
	return url_rosters;
}	

function getYahooStandingsUrl(sport, leagueId){
	return getYahooBaseUrl(sport) + leagueId + '?module=standings&lhst=stand&ajaxrequest=1';
}

function getYahooSetttingsUrl(sport, leagueId){
	return getYahooBaseUrl(sport) + leagueId + '/settings';
}

function getYahooDraftUrl(sport, leagueId){
	return getYahooBaseUrl(sport) + leagueId + '/draftresults';
}

function getYahooTeamScheduleUrl(sport, leagueId, teamId){
	return getYahooBaseUrl(sport) + leagueId + '/?module=standings&lhst=sched&sctype=team&scmid=' + teamId + '&ajaxrequest=1';
}

function getYahooTransactionsUrl(sport, leagueId){
	return getYahooBaseUrl(sport) + leagueId + '/transactions?transactionsfilter=all&ajaxrequest=1';
}

function getYahooMaptchupsUrl(sport, leagueId){
	return getYahooBaseUrl(sport) + leagueId + '?module=matchups&lhst=matchups&ajaxrequest=1';
}

function getYahooRedzoneUrl(sport, leagueId){
	return "https://pub-api.fantasysports.yahoo.com/fantasy/v3/redzone/"  + sport + "?league_id=" + leagueId + "&format=json";
}

function parseYahooMyLeagues(result_yahoo){
	var leagues = [];

 	// result_yahoo = result_yahoo.replace(jquery_regex_repl,'');
    var page = jQuery(result_yahoo);
    var league_table = jQuery('#Bd table', page);
    league_table.find("tbody tr").each(function(){
    	var links = $(this).find("a");
    	if (links.length >= 2){
    		var league_link = links.get(0).getAttribute("href");
    		var league_name = links.get(0).innerHTML;

    		var team_link = links.get(1).getAttribute("href");
    		var team_name = links.get(1).innerHTML;

    		var league_idx3 = league_link.lastIndexOf("/");
    		var league_id = league_link.substring(league_idx3 + 1); 
    		var team_idx3 = team_link.lastIndexOf("/");
    		var team_id = team_link.substring(team_idx3 + 1);  

    		var leagueData = {
    			url: league_link,
    		//	season: extractUrlParameter(entry.entryURL,'seasonId'),
    			leagueId: league_id,
    			teamId: team_id,
    			leagueName: league_name,
    			teamName: team_name
    		};
    		
    		leagues.push(leagueData);
    	}
    });	
    return leagues;
}

function parseYahooLeagueSettings(data) {	
	data = data.replace(jquery_regex_repl,'');
    var $ld = jQuery(data);
    var league_settings = {};
    league_settings['siteType'] = 'yahoo';

    var settings_table = jQuery('#settings-table tbody td', $ld);
    var getSettings = function(setting_name) {
        var settingText = settings_table.filter(function() { return this.childNodes[0] && this.childNodes[0].nodeValue && this.childNodes[0].nodeValue.indexOf(setting_name) != -1; });
        if (settingText && settingText.length > 0) {
			var value = settingText.next().first().text().trim();
			if (value.indexOf("\n") != -1){
				value = value.split("\n")[0];
			}
            return value;
        }
        return "";
    };

    league_settings.leagueName = getSettings('League Name:');
    league_settings.draftType = getSettings('Draft Type:');
    league_settings.draftTime = getSettings('Draft Time:');
    league_settings.keepers = getSettings('Keeper Settings:');
    league_settings.scoringType = getSettings('Scoring Type:');
    league_settings.playoffs = getSettings('Playoffs:');
    league_settings.positions = getSettings('Positions:').replaceAll(' ','');
    
    var stat_table = jQuery('#settings-stat-mod-table tbody td', $ld);
    var getValue = function(setting_name) {
        var settingVals = [];
        //TODO fix this for multiple same values
        var settingText = stat_table.filter(function() { return this.childNodes[0].nodeValue === setting_name; });
        if (settingText && settingText.length > 0) {
            var pointText = settingText.next().first().text();
            var settingList = pointText.split(';');
            var bonusDict = {};

            jQuery.each(settingList, function( sindex, svalue ) {
                svalue = svalue.trim();
                var settingStat;
                if (svalue.indexOf('yards per point') > -1) {
                    settingStat = 1.0 / parseFloat(svalue.split(' ')[0]);
                    settingVals.push(settingStat);
                }
                else if (svalue.indexOf('points at ') > -1) {
                    var bonusSettingList = svalue.split(' ');
                    var bonusPts = parseFloat(bonusSettingList[0]);
                    var bonusYds = parseFloat(bonusSettingList[3]);
                    bonusDict[bonusYds] = bonusPts;
                }
                else {
                    settingStat = parseFloat(svalue);
                    settingVals.push(settingStat);
                }
            });

            settingVals.push(bonusDict);
        }
        return settingVals;
    };
    
    var passSettings = getValue('Passing Yards');
    league_settings['pass_yds'] = passSettings[0] || 0;
    league_settings['pass_bonus'] = {};
    var passSettingsDict = passSettings[1];
    for (var k in passSettingsDict) {
        if (passSettingsDict.hasOwnProperty(k)) {
            league_settings['pass_bonus'][k] = passSettingsDict[k];
        }
    }
    league_settings['pass_tds'] = getValue('Passing Touchdowns')[0] || 0;
    league_settings['pass_ints'] = getValue('Interceptions')[0] || 0;
    league_settings['pass_cmp'] = getValue('Completions')[0] || 0;
    league_settings['pass_icmp'] =	getValue('Incomplete Passes')[0] || 0;
    league_settings['pass_att'] = getValue('Passing Attempts')[0] || 0;
    league_settings['pass_firstdown'] = getValue('Passing 1st Downs')[0] || 0;

    var rushSettings = getValue('Rushing Yards');
    league_settings['rush_yds'] = rushSettings[0] || 0;
    league_settings['rush_bonus'] = {};
    var rushSettingsDict = rushSettings[1];
    for (k in rushSettingsDict) {
        if (rushSettingsDict.hasOwnProperty(k)) {
            league_settings['rush_bonus'][k] = rushSettingsDict[k];
        }
    }
    league_settings['rush_att'] = getValue('Rushing Attempts')[0] || 0;
    league_settings['rush_tds'] = getValue('Rushing Touchdowns')[0] || 0;
    league_settings['rush_firstdown'] = getValue('Rushing 1st Downs')[0] || 0;

    var recSettings = getValue('Receiving Yards');
    league_settings['rec_yds'] = recSettings[0] || 0;
    league_settings['rec_bonus'] = {};
    var recSettingsDict = recSettings[1];
    for (k in recSettingsDict) {
        if (recSettingsDict.hasOwnProperty(k)) {
            league_settings['rec_bonus'][k] = recSettingsDict[k];
        }
    }
    league_settings['rec_att'] = getValue('Receptions')[0] || 0;
    league_settings['rec_tds'] = getValue('Receiving Touchdowns')[0] || 0;
    league_settings['rec_firstdown'] = getValue('Receiving 1st Downs')[0] || 0;

    league_settings['scoring'] = league_settings['rec_att'] >= 1 ? 'PPR' :
        league_settings['rec_att'] >= 0.5 ? 'HALF' : 'STD';

    //Kicking
    league_settings['xpt'] = getValue('Point After Attempt Made')[0] || 0;
    league_settings['fga'] = 0;
    league_settings['fg'] =
        (0.6 * ((getValue('Field Goals 0-19 Yards')[0] || 0) +
            (getValue('Field Goals 20-29 Yards')[0] || 0) +
            (getValue('Field Goals 30-39 Yards')[0] || 0)) / 3.0
        ) +
        (0.3 * (getValue('Field Goals 40-49 Yards')[0] || 0)) +
        (0.1 * (getValue('Field Goals 50+ Yards')[0] || 0));
    league_settings['fgm'] =
        (0.6 * ((getValue('Field Goals Missed 0-19 Yards')[0] || 0) +
            (getValue('Field Goals Missed 20-29 Yards')[0] || 0) +
            (getValue('Field Goals Missed 30-39 Yards')[0] || 0)) / 3.0
        ) +
        (0.3 * (getValue('Field Goals Missed 40-49 Yards')[0] || 0)) +
        (0.1 * (getValue('Field Goals Missed 50+ Yards')[0] || 0));

    //Misc
    league_settings['ret_td'] = getValue('Return Touchdowns')[0] || 0;
    league_settings['tpc'] = getValue('2-Point Conversions')[0] || 0;
    league_settings['fumbles'] = getValue('Fumbles Lost')[0] || getValue('Fumbles')[0] || 0;

    //IDP
    league_settings['ff'] = getValue('Fumble Force')[0] || 0;
    league_settings['tka'] = getValue('Tackle Assist')[0] || 0;
    league_settings['tks'] = getValue('Tackle Solo')[0] || 0;
    league_settings['pd'] = getValue('Pass Defended')[0] || 0;

    //Def
    league_settings['int'] = getValue('Interception')[0] || 0;
    league_settings['deftd'] = getValue('Touchdown')[0] || getValue('Defensive Touchdown')[0] || 0;
    league_settings['fr'] = getValue('Fumble Recovery')[0] || 0;
    league_settings['sk'] = getValue('Sack')[0] || 0;
    league_settings['sf'] = getValue('Safety')[0] || 0;

    league_settings['pa'] = 0;
    league_settings['pa0'] = getValue('Points Allowed 0 points')[0] || 0;
    league_settings['pa1'] = getValue('Points Allowed 1-6 points')[0] || 0;
    league_settings['pa7'] = getValue('Points Allowed 7-13 points')[0] || 0;
    league_settings['pa14'] = getValue('Points Allowed 14-20 points')[0] || 0;
    league_settings['pa21'] = getValue('Points Allowed 21-27 points')[0] || 0;
    league_settings['pa28'] = getValue('Points Allowed 28-34 points')[0] || 0;
    league_settings['pa35'] = getValue('Points Allowed 35+ points')[0] || 0;

    league_settings['ya'] = 0;
    league_settings['ya100'] = getValue('Defensive Yards Allowed 0-99')[0] || 0;
    league_settings['ya199'] = getValue('Defensive Yards Allowed 100-199')[0] || 0;
    league_settings['ya299'] = getValue('Defensive Yards Allowed 200-299')[0] || 0;
    league_settings['ya399'] = getValue('Defensive Yards Allowed 300-399')[0] || 0;
    league_settings['ya499'] = getValue('Defensive Yards Allowed 400-499')[0] || 0;
    league_settings['ya500'] = getValue('Defensive Yards Allowed 500+')[0] || 0;

    return league_settings;
}

function parseYahooLeagueRosters(data) {
	var page = jQuery(data);
	var league_teams = [];
	jQuery('.Bd > div', page).each(function(){
	   var links = $(this).find("p a");
	   if (links.length){
		   var teamName = links[0].innerHTML;
		   var teamLink = links[0].getAttribute("href");
	       var team_idx3 = teamLink.lastIndexOf("/");
		   var team_id = teamLink.substring(team_idx3 + 1);  
		   
		   var team = {
				id: team_id,
				name: teamName,
				players: []
		   }
		   league_teams.push(team);
		   $(this).find("a.name").each(function(){
			    var yahooId = getYahooId(this.getAttribute("href"));
			    if (yahooId){
					team.players.push(yahooId);
				}
		   });
	   }
   }); 
   return league_teams; 	
}

function parseYahooLeagueStandings(data) {
	var league_standings = [];
	if (data && data.content){ 
	    var section = jQuery(data.content);
		section.find("#leaguestandings table tr").each(function(){
			var imgs = jQuery(this).find("img");
			var links = jQuery(this).find("a");
			var tds = jQuery(this).find("td");
			if (links.length > 0 && tds.length > 2){
        		var team_link = links.get(0).getAttribute("href");
        		var team_idx3 = team_link.lastIndexOf("/");
        		var teamId = team_link.substring(team_idx3 + 1); 

        		var splits = tds.get(2).innerHTML.split("-");
        		if (splits.length > 1){
        			var row = {
        				teamId: teamId,
        				wins: Number(splits[0]),
        				losses: Number(splits[1])
        			}
            		if (splits.length > 2){
            			row.ties = Number(splits[2]);
            		}
            		if(imgs.length > 0){
            			row.logo = imgs.attr("src");
					}
        			league_standings.push(row);
        		}
			}	
		});
	}
	return league_standings;
}

function parseYahooLeagueDraft(data, teams) {
	
	var page = jQuery(data);
			
	var teamMap = {};
	if (teams){
		for (var i=0; i<teams.length; i++){
			teamMap[teams[i].name] = teams[i].id;
			if (teams[i].name.indexOf("&amp;") != -1){
    			teamMap[teams[i].name.replaceAll("&amp;","&")] = teams[i].id;
			}
		}
	}
    
    var draft_data = {}    
	var picks = [];
	var budgets = [];
	
	if ($("#auction-settings", page).length){
		draft_data.isAuction = true;
		draft_data.budgets = true;
		$("#yspmaincontent table tbody tr", page).each(function(){
			var tds = $(this).find("td");
			if (tds.length > 1){
				var str_team = tds.get(1).innerHTML;
				var budget = {
					teamName : str_team,
					teamId: teamMap[str_team]
				};
				if (tds.length > 3 && tds.get(3).innerHTML[0] == '$'){
					budget.initial = Number(tds.get(3).innerHTML.substring(1));
				}
				if (tds.length > 5 && tds.get(5).innerHTML[0] == '$'){
					budget.remaining = Number(tds.get(5).innerHTML.substring(1));
				}
				budgets.push(budget);
				
				$(this).find("a").each(function(){
				    var yahooId = getYahooId(this.getAttribute("href"));
				    if (yahooId){
						var pick = {
							round: 1,
							pick: picks.length +1,
							teamName : str_team,
    						teamId: teamMap[str_team],
    						yahooId: yahooId
						}				    	
						if ($(this).parent().html().indexOf("keeper") != -1){
							pick.keeper = true;
						}
						if ($(this).parent().next().html() && $(this).parent().next().html()[0] == '$'){
							pick.cost = Number($(this).parent().next().html().substring(1));
						}
						picks.push(pick);
					}
				});
			}
		});
	} else {
		draft_data.isAuction = false;
		$("#yspmaincontent table", page).each(function(){
			var str_round = $(this).find("thead th").html();
			if (str_round.indexOf("Round ") != 0){
				return;
			}
			var round = Number(str_round.substring("Round ".length));
			$(this).find("tbody tr").each(function(){
				var str_pick = $(this).find(".first").html();
				var str_team = $(this).find(".last").attr("title");
				var pick = {
					round: round,
					pick: Number(str_pick.split(".")[0]),
					teamName: str_team,
					teamId: teamMap[str_team]
				}
				if ($(this).find(".player a").length){
				    var yahooId = getYahooId($(this).find(".player a").attr("href"));
				    if (yahooId){
						pick.yahooId = yahooId;
					}
				}
				if ($(this).find(".player").html().indexOf("keeper") != -1){
					pick.keeper = true;
				}
				picks.push(pick);
			});
		});
	}

	if (picks.length){
		draft_data.picks = picks;
	}
	if (budgets.length){
		draft_data.budgets = budgets;
	}
	return draft_data;
}
	
function parseYahooLeagueTransactions(data) {
	var league_transacations = [];
	if (data && data.content){ 
	    var section = jQuery(data.content);	
		section.find("table tr").each(function(){
			
			var spans = jQuery(this).find(".Ta-c span");
			var player_links = jQuery(this).find(".No-pstart a");
			var team_links = jQuery(this).find(".Ta-end a");			
			var action = jQuery(this).find("td.Fz-xxs").html() || spans.attr("title");
			
			if (action && player_links.length > 0 && team_links.length > 0){
        		var team_link = team_links.get(0).getAttribute("href");
        		var team_idx3 = team_link.lastIndexOf("/");
        		var teamId = team_link.substring(team_idx3 + 1); 
        		
        		var transaction = {
					date: jQuery(this).find(".F-timestamp").html(),
    				items: [ {
	    				teamId: teamId,
	    				teamName: team_links.get(0).innerHTML,
	    				action: action,
	    				players: []
	    			}]
				}
    			
    			for (var k=0; k<player_links.length; k++){	
					var item = transaction.items[0];
					if (k > 0 && k<spans.length){
						item = {
		    				teamId: teamId,
		    				teamName: team_links.get(0).innerHTML,
		    				action: spans.get(k).getAttribute("title"),
		    				players: []
						}
						transaction.items.push(item);
					}	
	
				    var yahooId = getYahooId(player_links.get(k).getAttribute("href"));
				    if (yahooId){
			    		item.players.push(yahooId);
			    	}
				}	
				
				var prevTransaction = league_transacations.length > 0 ? league_transacations[league_transacations.length-1] : undefined;
				if (action.indexOf("Traded") != -1 && prevTransaction && 
						transaction.items.length == 1 && prevTransaction.items.length == 1 &&
						action == prevTransaction.items[0].action && transaction.date == prevTransaction.date){
					prevTransaction.items.push(transaction.items[0]);
				} else {    			
    				league_transacations.push(transaction);
    			}
			}	
		});
	}
	return league_transacations;
}

function parseYahooLeagueMatchups(data) {
	var league_matchups = [];
	if (data && data.content){ 
	    var section = jQuery(data.content);
	    section.find("li").each(function(){
			var li = jQuery(this);
			var link = li.attr("data-target"); // "/b1/5282/matchup?week=6&mid1=1&mid2=3"
			var scores = li.find(".Fz-lg.Ptop-lg");
			var matchup = {
				link: link,
				week: extractUrlParameter(link,'week'),
				team1: extractUrlParameter(link,'mid1'),
				team2: extractUrlParameter(link,'mid2'),
				score1: scores.length > 0 ? Number(scores.get(0).innerHTML) : 0,
				score2: scores.length > 1 ? Number(scores.get(1).innerHTML) : 0
			}
			league_matchups.push(matchup);
		});
	}
	return league_matchups;
}
	
function syncYahooLeague(sport, leagueData, callback, source){
	
	if (source && source.split("-").length > 2){ 
		var params = source.split("-");
		// expected source format: product-platform-tool-trigger
		var product = params[0]; 	//dw, mpb, gml
		var platform = params[1]; 	//web, ios, android
		var tool = params[2];		//import, app, start_sit_assistant, league_analyzer, waiver_assistant, trade_analyzer ...
		var trigger = params.length > 3 ? params[3] : ''; //launch, user_refresh
		if (tool == 'import'){
			leagueData.needsRosters = true;
			leagueData.needsSettings = true;
			if (product != 'mpb'){
				leagueData.needsDraft = true;
			}
		}
		
		if (product == 'mpb'){
			if (trigger == 'user_refresh' || !leagueData.lastSync){
				leagueData.needsRosters = true;
			} else {
				var minutesSince = (new Date().getTime() - leagueData.lastSync) / 1000 / 60;
				if (minutesSince > 60){	
					leagueData.needsRosters = true;
				}
			}
		}
		
		if (tool == 'app' || tool == 'dashboard'){ 
			// stadings are displayed on the mobile app's home screen
			leagueData.needsStandings = true;
		}
		if (tool == 'league_analyzer'){
			if (trigger == 'user_refresh'){
				leagueData.needsStandings = true;
				leagueData.needsSchedule = true;
			}
		}
		if (tool == 'settings'){
			if (trigger == 'user_refresh'){
				leagueData.needsSettings = true;
				leagueData.needsDraft = true;
			}
		}
		if (tool == 'transactions'){
			if (trigger == 'user_refresh'){
				leagueData.needsTransaction = true;
			}
		}
	}
	
	if (leagueData.redzone){
		//redzone data was already retrieved by the mobile apps
		leagueData.needsRosters = false;
		leagueData.needsMatchups = false;
		leagueData.needsRedzone = false;
		leagueData.needsStandings = false;
	} else if (leagueData.needsRedzone){
		//redzone data will cover these 3 use cases:
		leagueData.needsRosters = false;
		leagueData.needsMatchups = false;	
		leagueData.needsStandings = false;	
	}
		
	if (leagueData.needsRosters){
		leagueData.teams = [];
		leagueData.needsRosters = undefined;
		
	    jQuery.get(getYahooRostersUrl(sport, leagueData.leagueId), function(result_yahoo) {
		   leagueData.hasChanges = true;
           leagueData.teams = parseYahooLeagueRosters(result_yahoo);
           
		   for (var k=0; k<leagueData.teams.length; k++){
			   if (leagueData.teams[k].id == leagueData.teamId){
				   leagueData.teamName = leagueData.teams[k].name;
			   }
		   }
		   
           syncYahooLeague(sport, leagueData, callback);
	    });
	    return false;
	}
       
	if (leagueData.needsStandings){
		leagueData.standings = [];
		leagueData.needsStandings = undefined;
		
    	jQuery.get(getYahooStandingsUrl(sport, leagueData.leagueId), function(d) { 
			leagueData.hasChanges = true;
			leagueData.standings = parseYahooLeagueStandings(d);
            syncYahooLeague(sport, leagueData, callback);

 	    });
 	    return false;
	}
    	   
	if (leagueData.needsSchedule) { 
		leagueData.schedule = [];
		leagueData.needsSchedule = undefined;
		// need to make one call per team
		syncYahooTeamSchedule(sport, leagueData, 0, callback);		
 	    return false;
	}
    	   
	if (leagueData.needsSettings) { 
		leagueData.settings = {};
		leagueData.needsSettings = undefined;
		jQuery.get(getYahooSetttingsUrl(sport, leagueData.leagueId), function(d) {
			leagueData.hasChanges = true;
		    leagueData.settings = parseYahooLeagueSettings(d);
		    leagueData.leagueName = leagueData.settings.leagueName;
		    
            syncYahooLeague(sport, leagueData, callback);
		});
 	    return false;
	}
	
	if (leagueData.needsDraft){
		leagueData.draft = {};
		leagueData.needsDraft = undefined;
    	jQuery.get(getYahooDraftUrl(sport, leagueData.leagueId), function(result_yahoo) {  
			leagueData.hasChanges = true; 
			leagueData.draft =  parseYahooLeagueDraft(result_yahoo, leagueData.teams);
            syncYahooLeague(sport, leagueData, callback);
 	    });
 	    return false;
	}   
       
	if (leagueData.needsTransactions){
		leagueData.transactions = [];
		leagueData.needsTransactions = undefined;
		
    	jQuery.get(getYahooTransactionsUrl(sport, leagueData.leagueId), function(d) { 
			leagueData.hasChanges = true;
			leagueData.transactions = parseYahooLeagueTransactions(d);
            syncYahooLeague(sport, leagueData, callback);

 	    });
 	    return false;
	}     
       
	if (leagueData.needsMatchups){
		leagueData.matchups = [];
		leagueData.needsMatchups = undefined;
		
    	jQuery.get(getYahooMaptchupsUrl(sport, leagueData.leagueId), function(d) { 
			leagueData.hasChanges = true;
			leagueData.matchups = parseYahooLeagueMatchups(d);
			
		//	syncYahooTeamMatchup(sport, leagueData, 0, callback);
		
            syncYahooLeague(sport, leagueData, callback);

 	    });
 	    return false;
	}   
		
	if (leagueData.needsRedzone){
		leagueData.redzone = {};
		leagueData.needsRedzone = undefined;
		
    	jQuery.get(getYahooRedzoneUrl(sport, leagueData.leagueId), function(d) { 
	
			if (d && d.service){
				leagueData.hasChanges = true;
				leagueData.redzone = d.service;
			}
		
            syncYahooLeague(sport, leagueData, callback);

 	    });
	}         	
    
    if (callback){
 	   callback();
    }
    
    return true;
}

function syncYahooTeamSchedule(sport, leagueData, teamIdx, callback){
	
	if (!leagueData.teams || teamIdx >= leagueData.teams.length){	
        syncYahooLeague(sport, leagueData, callback);
    	return false;
	}
	
 	var teamId = leagueData.teams[teamIdx].id;

    jQuery.get(getYahooTeamScheduleUrl(sport, leagueData.leagueId, teamId), function(d) {
    	if (d && d.content){ 
    	    var section = jQuery(d.content);

    		var teamName = section.find(".Bg-shade2 span").html();
    	    var tables = section.find("#schedule table");
    	    if (tables.length > 1){
				leagueData.hasChanges = true;
    	    	jQuery(tables.get(1)).find("tbody tr").each(function(){

    	    		var tds = jQuery(this).find("td");
    	    		if (tds.length > 2){
    	    			var week = Number(tds.get(0).innerHTML);
    	    			var weekObj;
    	    			for (var k=0; k<leagueData.schedule.length;k++){
							if (leagueData.schedule[k].week == week){
								weekObj = leagueData.schedule[k];
								break;
							}
						}
    	    			if (!weekObj){
	    	    			weekObj = {
	    	    				matchups:[],
	    	    				week: week
	    	    			};
	    	    			leagueData.schedule.push(weekObj);    
    	    			}	    	    			
    	    			
    	    			var links = jQuery(tds.get(1)).find("a");
    	    			if (links.length > 1){	    	    				
                    		var team_link = links.get(1).getAttribute("href");
                    		var team_idx3 = team_link.lastIndexOf("/");
                    		var oppId = team_link.substring(team_idx3 + 1); 
                    		var oppName = links.get(1).innerHTML;
    	    				
    	    				var found = false;
	    	    			for (var k=0; k<weekObj.matchups.length;k++){
								if (weekObj.matchups[k].team1Id == oppId && weekObj.matchups[k].team2Id == teamId){
									found = true;
									break;
								}
							}
    	    				
    	    				if (!found){	    	    				
	    	    				var matchup = {
	    	    					    "week": week,
	    	    					    "team1Id": teamId,
	    	    					    "team1Name": teamName,
	    	    					    "team2Id": oppId,
	    	    					    "team2Name": oppName
	    	    					  //  , "team1Score": 0, "team2Score": 0
	    	    					   };
	    	    				weekObj.matchups.push(matchup);
    	    				}
    	    			}
    	    		}
    	    	});
    	    }
    	}
        syncYahooTeamSchedule(sport, leagueData, teamIdx+1, callback);
    });
}

/*
function syncYahooTeamMatchup(sport, leagueData, matchupIdx, callback){
	
	if (!leagueData.matchups || matchupIdx >= leagueData.matchups.length){	
        syncYahooLeague(sport, leagueData, callback);
    	return false;
	}
	
 	var matchup = leagueData.matchups[matchupIdx]; 	
    var matchup_url = getYahooBaseUrl(sport);
    var idxY = matchup_url.indexOf("yahoo.com");
    if (idxY != -1){
		matchup_url = matchup_url.substring(0, idxY + "yahoo.com".length);
	}
	matchup_url += matchup.link;
 	
 	matchup.positions = [];
 	matchup.players1 = [];
 	matchup.players2 = [];
 	
	jQuery.get(matchup_url, function(data) { 
		leagueData.hasChanges = true;

		var page = jQuery(data);
		
		//TODO: parse page
		
        syncYahooTeamMatchup(sport, leagueData, matchupIdx+1, callback);

    });
 
 }
*/

function getYahooId(href){
	var idx = href.indexOf("/players/");
	if (idx != -1){
		var yahooId = href.substring(idx + "/players/".length);
		if (yahooId.indexOf("/") == -1){
			return Number(yahooId);
		}
	} else {
    	idx = href.indexOf("/teams/");
    	if (idx != -1){
    		var abbrev = href.substring(idx + "/teams/".length);
    		return convertYahooTeamCode(abbrev);
    	}
	}
}

function convertYahooTeamCode(name){
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

