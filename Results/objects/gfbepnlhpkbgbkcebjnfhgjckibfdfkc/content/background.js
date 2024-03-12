
chrome.runtime.onInstalled.addListener(function(details){

    if (details.reason == "install"){
        jQuery.get("https://partners.fantasypros.com/api/c1/user-info.php", function(result) {
            if (result && result.username){
         //   	console.log(result.username);
            } else {
                chrome.tabs.create({url: "https://secure.fantasypros.com/accounts/register/?utm_source=Chrome_Extension&next=https://www.fantasypros.com/nfl/myplaybook"});
            }
        });
    } else if (details.reason == "update"){
  //      var thisVersion = chrome.runtime.getManifest().version;
  //      console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});


chrome.runtime.setUninstallURL("https://mpbnfl.fantasypros.com/extension/uninstalled.jsp");

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (!changeInfo.url){
		return;
	}
    if (changeInfo.url.indexOf("https://fantasy.espn.com/football/") != -1 || 
    		changeInfo.url.indexOf("https://sleeper.app/leagues/") != -1 || 
    		changeInfo.url.indexOf("https://sleeper.com/leagues/") != -1 ) {
        chrome.tabs.sendMessage( tabId, {
        	cmd: 'reloadAdvice',
            url: changeInfo.url
          })
    }
    if (changeInfo.url.indexOf("https://sleeper.com/draft/nfl/") != -1 || 
    		changeInfo.url.indexOf("https://sleeper.com/draft/nfl/") != -1){
        chrome.tabs.sendMessage( tabId, {
        	cmd: 'checkDraftRoom',
            url: changeInfo.url
          })
	}
  }
);

var YEAR_NFL = 0, WEEK_NFL = -1;
var FP_PLAYER_DATA;
var ONE_HOUR = 3600 * 1000;
var currentSport = "nfl";
var lastResearchAssistantKey = "https://partners.fantasypros.com/api/c1/research-assistant.php?sport=nfl&https=Y&checkPremium=Y";

chrome.browserAction.onClicked.addListener(function(tab) { 
    chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
        var thisTab = tabs[0];
        if (thisTab && thisTab.id){
            chrome.tabs.sendMessage(thisTab.id, {cmd: "toggleFpPanel"}, function (response) {
            });
        }
    });
});

chrome.commands.onCommand.addListener(function(command) {
    if (command == 'insert-nfl-player-icons'){
        chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
            var thisTab = tabs[0];
            if (thisTab && thisTab.id){
	            chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':'nfl'}, function (response) {
	            });
            }
        });
    } else if (command == 'insert-mlb-player-icons'){
        chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
            var thisTab = tabs[0];
            if (thisTab && thisTab.id){
	            chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':'mlb'}, function (response) {
	            });
            }
        });
    } else if (command == 'insert-nba-player-icons'){
        chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
            var thisTab = tabs[0];
            if (thisTab && thisTab.id){
	            chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':'nba'}, function (response) {
	            });
            }
        });
    }
  });

function queryPickemFirst(key, useCache, callback) {
	
    chrome.storage.local.get(key, function(d) {
        if (key.indexOf('/researchAssistant?') != -1 || key.indexOf('/research-assistant.php?') != -1){
        	lastResearchAssistantKey = key;
        	var idx = lastResearchAssistantKey.indexOf("sport=");
        	if (idx != -1){
            	currentSport = lastResearchAssistantKey.substring(idx + "sport=".length).split("&")[0];
        	}
        }
        if (useCache && d && d[key] && d[key].query_ts) {
        	var minuteSince = (new Date().getTime() - d[key].query_ts) / 60 / 1000;
        	//console.log(key + ":  " + minuteSince + " minutes ago");
        	if (minuteSince > 10){
        		//too old, do not use value from cache
        	} else if (key.indexOf('/researchAssistant?') != -1 || key.indexOf('/research-assistant.php?') != -1){
            	if (d[key].pub){
                    callback(d[key]);
                    return;
            	}
            } else {
                callback(d[key]);
                return;
            }
        } 
        var urlToFetch = key;
        if (key.indexOf("?") != -1 && key.indexOf("cdn.fantasypros.com") == -1){
        	urlToFetch += "&ts=" + new Date().getTime();
        }
        
        jQuery.get(urlToFetch, function(json) {
            var fpData = {};
            if (typeof(json) == 'string'){
            	if (json.length > 5){
            		var idx1 = json.indexOf('({');
            		var idx2 = json.lastIndexOf('})');
            		if (idx1 != -1 && idx2 > idx1){
            			json = json.substring(idx1 + 1, idx2 + 1);
            		}
            	}
        		fpData[key] = JSON.parse(json);
            } else {
            	fpData[key] = json;
            }
            fpData[key].query_ts = new Date().getTime();
            chrome.storage.local.set(fpData, function() {
                callback(fpData[key]);
            });
        });
    });
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
    	
        switch (request.cmd) {
        case 'sendGAEvent':
        		if (typeof sendGAEvent == 'function'){ 
        			sendGAEvent(request.category, request.action, request.label);
        		} else {
        			// do not track on Firefox
        		}
	            break;

            case 'clearCache':
                chrome.storage.local.get(null, function(items) {
                    var allKeys = Object.keys(items);
                    var keysToClear = [];
                    if (allKeys){
                    	for (var i=0; i<allKeys.length; i++){
                    		if (allKeys[i] != 'site_black_list'){
                    			keysToClear.push(allKeys[i]);
                    		}
                    	}
                    }  
                    console.log(keysToClear);                  
                    chrome.storage.local.remove(keysToClear, function() {});
                });
                break;
            case 'queryResearchAssistant':
            	if (lastResearchAssistantKey){
                	if (lastResearchAssistantKey.indexOf("https=Y") == -1){
                		lastResearchAssistantKey += "&https=Y"; //to make sure cookies are sent and username is returned
                	}
	                queryPickemFirst(lastResearchAssistantKey, true, function(result) {
	                	result.sport = currentSport;
	                    sendResponse(result);
	                    if (typeof _gaEventLabel != 'undefined'){
		                    if (result.level){
		                    	_gaEventLabel = 'Premium';
		                    } else if (result.username){
		                    	_gaEventLabel = 'Basic';
		                    } else {
		                    	_gaEventLabel = 'Unregistered';
		                    }
	                    }
	                });
	                return true;
            	}
            case 'queryHomePageArticle':
                queryPickemFirst("https://partners.fantasypros.com/api/v1/articles-featured.php", true, function(result) {
                    sendResponse(result);
                });
                return true;
            case 'getPlayerData':
                queryPickemFirst("https://cdn.fantasypros.com/json/playerData?sport=" + request.sport , true, function(result) {
                    if (request.sport == 'nfl' && typeof updatePlayerCache == 'function'){
                    	updatePlayerCache(result);
                    }
                    sendResponse(result);
                });
                return true;
            case 'setFavorite':
            case 'removeFavorite':
            	if (lastResearchAssistantKey){
	                queryPickemFirst(lastResearchAssistantKey, true, function(result) {

	                	if (result && result.priv && result.priv.leagues){
	                    	for (var i=0; i< result.priv.leagues.length; i++){
	                    		var league = result.priv.leagues[i];
	                    		if (request.cmd == 'setFavorite'){
	                    			league[4] = league[6] == request.leagueKey;
	                    		} else if (request.cmd == 'removeFavorite'){
	                    			league[4] = false;
	                    		}
	                    	}
	                	}

	                    var fpData = {};
	                    fpData[lastResearchAssistantKey] = result;
	                    chrome.storage.local.set(fpData, function() {
	                        chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
	                            var thisTab = tabs[0];
	                            if (thisTab && thisTab.id){
	                            	chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':currentSport,'leagues':result.priv.leagues}, function (response) {
	                            	});
	                            }
	                        });
	                    });
	                    
	                });
            	}
            	if (currentSport && request.leagueKey){
	            	var urlSwitch = "https://mpb" + currentSport + ".fantasypros.com/json/editLeague?key=" +
	            		request.leagueKey + "&favorite=" + (request.cmd == 'removeFavorite' ? "false" : "true");
	                jQuery.get(urlSwitch);
            	}
            	break;
            case 'setFootballPreferences':
            	var urlSwitch = "https://mpbnfl.fantasypros.com/switchBookmarletOption?";
            	urlSwitch += "&idp=" + request.idp;
            	urlSwitch += "&def=" + request.def;
                jQuery.get(urlSwitch, function(result) {
	                queryPickemFirst(lastResearchAssistantKey, false, function(result2) {
	                    chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
	                        var thisTab = tabs[0];
	                        chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':'nfl'});
	                    });
	                });
                });
    	
            	break;
            case 'parseAllPages':
                chrome.tabs.query({ active:true, currentWindow:true }, function(tabs) {
                    var thisTab = tabs[0];
                    chrome.tabs.sendMessage(thisTab.id, {cmd: "parsePage",'sport':request.sport});
                });
            	break;
            case 'queryPickemFirst':
                queryPickemFirst(request.url, request.bCache, function(result) {
                    //console.log(result);
                    sendResponse(result);
                });
                //sendResponse({xhrwarn:true});
                return true;
            case 'getFpData':
                loadLeagueSettings(request.leagueType, request.leagueId, request.server, function(leagueSettings) {
                    leagueSettings = leagueSettings || {};
                    var scoring = leagueSettings['scoring'] || 'STD';
                    if (FP_PLAYER_DATA && FP_PLAYER_DATA[scoring] && FP_PLAYER_DATA.timestamp &&
                    		FP_PLAYER_DATA.timestamp > (new Date().getTime() - ONE_HOUR)) {
                        sendResponse(FP_PLAYER_DATA[scoring]);
                    } else {
                        loadRankings(function(result) {
                            sendResponse(FP_PLAYER_DATA[scoring]);
                        });
                    }
                });
                return true;
            case 'getWeekNFL':
            	if (WEEK_NFL >= 0){
	                sendResponse(WEEK_NFL);
            	} else {
                    loadRankings(function(result) {
                        sendResponse(WEEK_NFL);
                    });
            	}
                return true;
            case 'sendSync':
            case 'checkAssistant':
            	var servers = ["http://localhost:3000/d*", "http://localhost:8080/d*", "http://*.fantasypros.com/d*", "https://*.fantasypros.com/d*"]
            	for (var i=0; i<servers.length; i++){
	            	chrome.tabs.query({
		                url: servers[i]
		            }, function(result) {
		                for (var i=0; i<result.length; i++){
		                    chrome.tabs.sendMessage(
	                    		result[i].id, 
	                    		request,
	                            function(response){}
		                    );
		                }
		            });
            	}
                var msgKey = 'last_msg_' + request.type + request.sport + request.leagueId;
                var fpData = {};
                fpData[msgKey] = request;
                chrome.storage.local.set(fpData, function() {
                //    console.log("saved");
                });            	
            	break;
            case 'getLastAssistantMessage':
                var msgKey = 'last_msg_' + request.type + request.sport + request.leagueId;
                chrome.storage.local.get(msgKey, function(data) {
    	            sendResponse(data[msgKey]);
                });               
                return true;
            case 'foundAssistant':
            case 'requestSync':
            case 'makeDraftPick':
            	var servers = ["http://fantasy.espn.com/*/draft*","https://fantasy.espn.com/*/draft*", 
            		"https://*.fantasysports.yahoo.com/draftclient/*", "https://*.fantasysports.yahoo.com/betadraftclient/*",
            		"https://fantasy.nfl.com/draftcenter/draftclient*", "https://fantasy.nfl.com/league/*/draftclient*", "https://fantasy.nfl.com/draftclient*",
            		"https://sleeper.com/draft/*"
            		]
            	for (var i=0; i<servers.length; i++){
	            	chrome.tabs.query({
		                url: servers[i]
		            }, function(result) {
		                for (var i=0; i<result.length; i++){
		                    chrome.tabs.sendMessage(
	                    		result[i].id, 
	                    		request,
	                            function(response){}
		                    );
		                }
		            });
            	}
            	break;
            case 'setBadgeText':                
            	chrome.browserAction.setBadgeBackgroundColor({ color: [20, 188, 64, 255] });
            	chrome.browserAction.setBadgeText({text: request.text});
                break;
            case 'getBlackList':
                chrome.storage.local.get('site_black_list', function(data) {
    	            sendResponse(data.site_black_list || []);
                });                
                return true;
            case 'addToBlackList':
                chrome.storage.local.get('site_black_list', function(data) {
                	var array = data.site_black_list || [];
                	array.push(request.site);              
                    var fpData = {};
                    fpData.site_black_list = array;
                    chrome.storage.local.set(fpData, function() {
        	            sendResponse(array);
                    });    
                });           
                return true;
            case 'removeFromBlackList':
                chrome.storage.local.get('site_black_list', function(data) {
                	var array = data.site_black_list || [];
                	var array_new = [];
                	for (var i=0; i<array.length; i++){
                		if (array[i] != request.site){
                			array_new.push(array[i])
                		}
                	}          
                    var fpData = {};
                    fpData.site_black_list = array_new;
                    chrome.storage.local.set(fpData, function() {
        	            sendResponse(array_new);
                    });    
                });           
                return true;
            case 'checkBlackList':
                chrome.storage.local.get('site_black_list', function(data) {
                	var array = data.site_black_list || [];
                	for (var i=0; i<array.length; i++){
                		if (array[i] && request.site.indexOf(array[i]) != -1){
                	        sendResponse(false);
                		}
                	}  
        	        sendResponse(true);
                });           
                return true;
            case 'getYahooLeagues': 
                var url_yahoo = getYahooMyLeaguesUrl(request.sport);
            	var url_dw = "https://draftwizard.fantasypros.com/json/userDrafts?sport=" + request.sport;

            	if (request.useLocalServer){
            		url_dw = "http://localhost:8080/json/userDrafts?sport=" + request.sport;
            	} else if (request.useTestServer){
            		url_dw = "https://dwtest.fantasypros.com/json/userDrafts?sport=" + request.sport;
            	}
            	
            	if (request.force){
            		url_dw += "&force=" + request.force;
            	}
        		
                jQuery.get(url_yahoo, function(result_yahoo) {

                	$.ajax({
                		url: url_dw,
                		error: function (error) {
    	        	        sendResponse({"error" : "Cannot connect to FantasyPros servers"});
	                	}, 
	                	success: function(result_dw){

	                		var result = {
	                			imported_leagues:[],
	                			new_leagues:[],
	                			userKey: result_dw.userKey,
	                			pro: result_dw.pro,
	                			mvp: result_dw.mvp,
	                			hof: result_dw.hof,
	                			importCount: result_dw.importCount
	                		}
	                		
	                		var leagues = parseYahooMyLeagues(result_yahoo);
	                		for (var j=0; j<leagues.length; j++){		
	            	    		var alreadyImported = false;

	            	    		for (var k=0; k<result_dw.drafts.length; k++){
	            	    			var imp = result_dw.drafts[k];		
	            	    			if (imp.leagueType == 'Yahoo' && imp.leagueId == leagues[j].leagueId && imp.userTeamId == leagues[j].teamId){
	            	    				alreadyImported = true;
	            	    				break;
	            	    			}
	            	    		}

	            	    		if (alreadyImported){
	            	    			result.imported_leagues.push(leagues[j]);
	            	    		} else {
	            	    			result.new_leagues.push(leagues[j]);
	            	    		}
							}

		        	        sendResponse(result);
	                    }	
	                });
                });
                return true;
            case 'importYahooLeagues': 
            	var url_fp = "https://mpb" + request.sport + ".fantasypros.com/api/addLeagueJSON";
            	if (request.useLocalServer){
            		url_fp = "http://localhost:8080/api/addLeagueJSON";
            	} else if (request.useTestServer){
            		url_fp = "https://mpb" + request.sport + "test.fantasypros.com/api/addLeagueJSON";
            	}
            	
            	var functionStack = [];
            	functionStack.push(function(){
                	$.ajax({
              		  	type: "POST",
                		url: url_fp, 
                		data: {
                			step: 'import',
                			horse: true,
                			forceKey: request.userKey,
                			sport: request.sport,
                			type : 2, //Yahoo
                			selection: JSON.stringify(request.selection)            			
                		},
                		success: function(result_fp){
                			sendResponse(result_fp);
                		}
                	});
            	});

        		var idx = 0;
            	for (var k=0; k<request.selection.length; k++){
            		functionStack.unshift(function(){
            			request.selection[idx].needsRosters = true;
            			request.selection[idx].needsSettings = true;
            			request.selection[idx].needsDraft = true;
            			syncYahooLeague(request.sport, request.selection[idx], functionStack[idx+1]);
            			idx++;
            		});
            	}
            	
            	functionStack[0]();

                return true;
            case 'syncYahooLeague': 
            	
            	var leagueData = {
            		key: request.key,
            		leagueId: request.leagueId,
            		teamId: request.teamId,
            		needsRosters: request.needsRosters,
            		needsStandings: request.needsStandings,
            		needsSchedule: request.needsSchedule,
            		needsSettings: request.needsSettings,
            		needsDraft: request.needsDraft,
            		needsTransactions: request.needsTransactions,
            		needsMatchups: request.needsMatchups,
            		needsRedzone: request.needsRedzone
            	}
        		syncYahooLeague(request.sport, leagueData, function(){

					if (leagueData.hasChanges){
	                	var url_fp = "https://mpb" + request.sport + ".fantasypros.com/api/updateLeagueJSON";
	                	if (request.useLocalServer){
	                		url_fp = "http://localhost:8080/api/updateLeagueJSON";
	                	} else if (request.useTestServer){
	                		url_fp = "https://mpb" + request.sport + "test.fantasypros.com/api/updateLeagueJSON";
	                	}
	
	                	$.ajax({
	              		  	type: "POST",
	                		url: url_fp, 
	                		data: {
	                			key: request.key,
	                			data: JSON.stringify(leagueData)            			
	                		},
	                		success: function(result_fp){
	                			sendResponse(result_fp);
	                		}
	                	});						
					} else {
						sendResponse({"no_changes" : true});
					}
        		}, request.source);
            	
                return true;
                
            case 'syncYahooDraft':    

            	var leagueData = {
            		key: request.key,
            		leagueId: request.leagueId,
            		needsRosters: true,
            		needsDraft: true
            	}
            	
        		syncYahooLeague(request.sport, leagueData, function(){                	
                	var url_fp = "https://draftwizard.fantasypros.com/api/updateLeagueJSON";
                	if (request.useLocalServer){
                		url_fp = "http://localhost:8080/api/updateLeagueJSON";
                	} else if (request.useTestServer){
                		url_fp = "https://dwtest.fantasypros.com/api/updateLeagueJSON";
                	}

                	$.ajax({
              		  	type: "POST",
                		url: url_fp, 
                		data: {
                			key: request.key,
                			data: JSON.stringify(leagueData)            			
                		},
                		success: function(result_fp){
                			sendResponse(result_fp);
                		}
                	});
        		});
                return true;
                
            case 'getEspnLeagues': 
            	var url_espn = "http://fan.api.espn.go.com/apis/v2/fans/%7B" + request.swid.substring(1,request.swid.length-1) + 
            		"%7D?displayEvents=true&displayNow=true&displayRecs=true&recLimit=5&source=ESPN.com+-+FAM";
            	var url_dw = "https://draftwizard.fantasypros.com/json/userDrafts?sport=" + request.sport;
            	if (request.force){
            		url_dw += "&force=" + request.force;
            	}
            	$.ajax({url: url_espn, 
            		error: function (error) {
	        	        sendResponse({"error" : "Cannot find any " + request.sport + " leagues.<br/>Please check that you are correctly logged in to ESPN."});
                	}, success: function(result_espn){
            //	    console.log(result_espn);

                	$.ajax({
                		url: url_dw,
                		error: function (error) {
    	        	        sendResponse({"error" : "Cannot connect to FantasyPros servers"});
	                	}, 
	                	success: function(result_dw){
	
	            		var result = {
	            			imported_leagues:[],
	            			new_leagues:[],
	            			userKey: result_dw.userKey,
	            			pro: result_dw.pro,
	            			mvp: result_dw.mvp,
	            			hof: result_dw.hof,
	            			importCount: result_dw.importCount
	            		}
	            	    if (result_espn.preferences){
	            	    	for (var i=0; i<result_espn.preferences.length; i++){
	            	    		var pref = result_espn.preferences[i];
	            	    	//	console.log(pref);
	        					if (!pref.metaData) {
	        						continue;
	        					}	           	    		
	            	    		var meta = pref.metaData;
	        					if (!meta.entry) {
	        						continue;
	        					}
	            	    		var entry = meta.entry;
	        					if (!entry.name || !entry.entryURL) {
	        						continue;
	        					}
	            	    		var entryName = entry.name.toLowerCase();
	            	    		
	            	    		if (entryName.indexOf("fantasy") == -1){
	            	    			continue;
	            	    		}
	            	    		if (request.sport == 'mlb' && entryName.indexOf("baseball") == -1){
	            	    			continue;
	            	    		}
	            	    		if (request.sport == 'nfl' && entryName.indexOf("football") == -1){
	            	    			continue;
	            	    		}
	            	    		if (request.sport == 'nba' && entryName.indexOf("basketball") == -1){
	            	    			continue;
	            	    		}
	            	    		
	
	        					var leagueName = "";
	        					if (entry.groups && entry.groups.length > 0) {
	        						leagueName = entry.groups[0].groupName;
	        					}
	
	        					var teamName = "";
	        					if (entry.entryLocation) {
	        						teamName = entry.entryLocation + " ";
	        					}
	        					if (entry.entryNickname) {
	        						teamName += entry.entryNickname;
	        					}
	        					var leagueId = extractUrlParameter(entry.entryURL,'leagueId');
	        					var teamId = extractUrlParameter(entry.entryURL,'teamId');
	
	            	    		var leagueData = {
	            	    			url: entry.entryURL,
	            	    			season: extractUrlParameter(entry.entryURL,'seasonId'),
	            	    			leagueId: leagueId,
	            	    			teamId: teamId,
	            	    			leagueName: leagueName,
	            	    			teamName: teamName
	            	    		};
	            	    		
	            	    		var alreadyImported = false;
	            	    		for (var k=0; k<result_dw.drafts.length; k++){
	            	    			var imp = result_dw.drafts[k];
	            	    			if (imp.leagueType == 'ESPN' && imp.leagueId == leagueId && imp.userTeamId == teamId){
	            	    				alreadyImported = true;
	            	    				break;
	            	    			}
	            	    		}
	            	    		if (alreadyImported){
	            	    			result.imported_leagues.push(leagueData);
	            	    		} else {
	            	    			result.new_leagues.push(leagueData);
	            	    		}
	
	            	    	}
	
	            	    } 
	        	        sendResponse(result);
              	  	}});
        					
        			/*		
        					
        					String entryURL = entry.getString("entryURL");
        					String seasonId = ParsingUtils.extractParameterValue(entryURL, "seasonId");
        					String lid = ParsingUtils.extractParameterValue(entryURL, "leagueId");
        					int tid = Integer.valueOf(ParsingUtils.extractParameterValue(entryURL, "teamId"));
        					*/
            	    
            	    /* EspnApiLeague league = new EspnApiLeague(sport,lid);
        					if (entry.has("groups") && entry.getJSONArray("groups").length() > 0) {
        						league.setName(entry.getJSONArray("groups").getJSONObject(0).getString("groupName"));
        					}
        					league.setUserTeamId(tid);
        					league.setUserTeamName(teamName);
        					league.setLoginInfo(usr, pwd, cookies.getCookiesAsString());
        					league.espnUserId = swid;
        					result.add(league);
        			*/
        			
            	  }});
                return true;
            case 'importEspnLeagues': 
            	var url_fp = "https://mpb" + request.sport + ".fantasypros.com/api/addLeagueJSON";
            	$.ajax({
          		  	type: "POST",
            		url: url_fp, 
            		data: {
            			step: 'import',
            			forceKey: request.userKey,
            			sport: request.sport,
            			swid: request.swid,
            			s2: request.s2,
            			type : 1, //ESPN
            			selection: JSON.stringify(request.selection)            			
            		},
            		success: function(result_fp){
            			sendResponse(result_fp);
            		}
            	});

                return true;
            case 'fixEspnLeague': 
            	var url_fp = "https://mpb" + request.sport + ".fantasypros.com/json/fixSyncIssues";
            	$.ajax({
          		  	type: "POST",
            		url: url_fp, 
            		data: {
            			step : 'setCookies',
            			key: request.leagueKey,
            			sport: request.sport,
            			swid: request.swid,
            			s2: request.s2
            		},
            		success: function(result_fp){
            			sendResponse(result_fp);
            		}
            	});

                return true;
            case 'createEspnMockAssistant':
            	var url_fp = "https://draftwizard.fantasypros.com/mockDraftEspn";
            //	url_fp = "http://localhost:8080/mockDraftEspn"
            	$.ajax({
          		  	type: "POST",
            		url: url_fp, 
            		data: {
            			action: 'createEspnMock',
            			source: 'extension',
            			sport: request.sport,
            			swid: request.swid,
            			s2: request.s2,
            			leagueId: request.leagueId           			
            		},
            		success: function(result_fp){
            			sendResponse(result_fp);
            		}
            	});
            	
                return true;
            case 'submitToSleeper':
            	var leagueUrl = "https://sleeper.com/leagues/" + request.leagueId + "/team";
            	chrome.tabs.query({
	                url: leagueUrl
	            }, function(result) {	            	
	            	var existingTabIds = {};	            	
	                for (var i=0; i<result.length; i++){
	                	existingTabIds[result[i].id] = true;
	                }

                    chrome.tabs.create({url: leagueUrl});
                    
                	chrome.tabs.query({
    	                url: leagueUrl
    	            }, function(result) {
    	                for (var i=0; i<result.length; i++){
    	                	if (existingTabIds[result[i].id]){
    	                		//pre-existing tab, do not send
    	                	} else {    	                		
    	                		setTimeout(function(){
    	    	                    chrome.tabs.sendMessage(
    	                        		result[i].id, 
    	                        		request,
    	                                function(response){
    	                        			sendResponse('ok');
    	                        		}
    	    	                    );
    	                		},2000)
	    	                    break;
    	                	}
    	                }
    	            });
	            });

                return true;
            case 'ckeckSleeperMock':
            	$.ajax({url: "https://api.sleeper.com/v1/draft/" + request.draftId, 
            		error: function (error) {
	        	        sendResponse("");
                	}, success: function(result){
						if (result.metadata && result.metadata.type == 'league_mock'){
							sendResponse('league_mock');
						} else if (result.league_id == null){
							sendResponse('mock');
						} else { 
							sendResponse('real');
						}
					}
	            });

                return true;
            default:
                // helps debug when request directive doesn't match
                console.log('Unmatched request from script to background.js from ' + sender);
                console.log(request);
        }

        sendResponse({}); // sending back empty response to sender
    }
);

function loadRankings(callback) {
    var fpUrl = 'http://partners.fantasypros.com/api/v1/nfl-super.php?api_key=a54492ec1c61213953a8e4cad9ec6c83';

    queryPickemFirst(fpUrl, true, function(result) {

    	YEAR_NFL = result.year;
    	WEEK_NFL = result.week;
    	
    	FP_PLAYER_DATA = { 'timestamp': new Date().getTime() };

    	FP_PLAYER_DATA.STD = {'title' : (result.week > 0 ? 'Week ' + result.week + ' ' : result.season + ' Season')};
    	FP_PLAYER_DATA.PPR = {'title' : (result.week > 0 ? 'Week ' + result.week + ' ' : result.season + ' Season')};
    	FP_PLAYER_DATA.HALF = {'title' : (result.week > 0 ? 'Week ' + result.week + ' ' : result.season + ' Season')};
    	
    	if (result.rankings){
    		for (var pid in result.rankings.STD) {
    			if (result.rankings.STD.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.STD[String(pid)] = {'rank' : result.rankings.STD[pid][0], 'rank_scoring' : 'STD'};
    				FP_PLAYER_DATA.PPR[String(pid)] = {'rank' : result.rankings.STD[pid][0], 'rank_scoring' : 'STD'};
    				FP_PLAYER_DATA.HALF[String(pid)] = {'rank' : result.rankings.STD[pid][0], 'rank_scoring' : 'STD'};
    			}
    		}
    		for (var pid in result.rankings.PPR) {
    			if (result.rankings.PPR.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.PPR[String(pid)] = {'rank' : result.rankings.PPR[pid][0], 'rank_scoring' : 'PPR'};
    			}
    		}
    		for (var pid in result.rankings.HALF) {
    			if (result.rankings.HALF.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.HALF[String(pid)] = {'rank' : result.rankings.HALF[pid][0], 'rank_scoring' : 'HALF PPR'};
    			}
    		} 		
    	}
    	if (result.points){
    		for (var pid in result.points.STD) {
    			if (result.points.STD.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.STD[String(pid)] = FP_PLAYER_DATA.STD[String(pid)] || {};
    				FP_PLAYER_DATA.PPR[String(pid)] = FP_PLAYER_DATA.PPR[String(pid)] || {};
    				FP_PLAYER_DATA.HALF[String(pid)] = FP_PLAYER_DATA.HALF[String(pid)] || {};

    				FP_PLAYER_DATA.STD[String(pid)].points = result.points.STD[pid];
    				FP_PLAYER_DATA.STD[String(pid)].points_scoring = 'STD';
    				FP_PLAYER_DATA.PPR[String(pid)].points = result.points.STD[pid];
    				FP_PLAYER_DATA.PPR[String(pid)].points_scoring = 'STD';
    				FP_PLAYER_DATA.HALF[String(pid)].points = result.points.STD[pid];
    				FP_PLAYER_DATA.HALF[String(pid)].points_scoring = 'STD';
    			}
    		}
    		for (var pid in result.points.PPR) {
    			if (result.points.PPR.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.PPR[String(pid)] = FP_PLAYER_DATA.PPR[String(pid)] || {};    				
    				FP_PLAYER_DATA.PPR[String(pid)].points = result.points.PPR[pid];
    				FP_PLAYER_DATA.PPR[String(pid)].points_scoring = 'PPR';
    			}
    		}
    		for (var pid in result.points.HALF) {
    			if (result.points.HALF.hasOwnProperty(pid)) {
    				FP_PLAYER_DATA.HALF[String(pid)] = FP_PLAYER_DATA.HALF[String(pid)] || {};    				
    				FP_PLAYER_DATA.HALF[String(pid)].points = result.points.HALF[pid];
    				FP_PLAYER_DATA.HALF[String(pid)].points_scoring = 'HALF PPR';
    			}
    		} 		
    	}

    	if (result.matchup && result.matchup.opponent && result.matchup.stars && NFL_PLAYER_DATA){
	    	for (var i=0; i<NFL_PLAYER_DATA.players.length; i++){
	    		var p = NFL_PLAYER_DATA.players[i];	    		
				var pid = p.fp;
				var pos = p.p;
				var team = p.t;
				
				var opp = result.matchup.opponent[team] || '';
				var splits = opp.split(' ');
				if (splits.length > 0){
					// removing at and vs. "DAL":" at SF","MIN":" vs. BAL"
					opp = splits[splits.length - 1];
				}
				var stars = 0;
				if (pos.indexOf('QB') != -1 && result.matchup.points.QB){
					stars = result.matchup.stars.QB[opp];
				} else if (pos.indexOf('RB') != -1 && result.matchup.points.RB){
					stars = result.matchup.stars.RB[opp];
				} else if (pos.indexOf('WR') != -1 && result.matchup.points.WR){
					stars = result.matchup.stars.WR[opp];
				} else if (pos.indexOf('TE') != -1 && result.matchup.points.TE){
					stars = result.matchup.stars.TE[opp];
				} else if ((pos.indexOf('DST') != -1 || pos.indexOf('DEF') != -1)  && result.matchup.points.DST){
					stars = result.matchup.stars.DST[opp];
				} else if (pos.indexOf('K') != -1 && result.matchup.points.K){
					stars = result.matchup.stars.K[opp];
				}
				
				if (stars){
    				FP_PLAYER_DATA.STD[String(pid)] = FP_PLAYER_DATA.STD[String(pid)] || {};
    				FP_PLAYER_DATA.PPR[String(pid)] = FP_PLAYER_DATA.PPR[String(pid)] || {};
    				FP_PLAYER_DATA.HALF[String(pid)] = FP_PLAYER_DATA.HALF[String(pid)] || {};

    				FP_PLAYER_DATA.STD[String(pid)].stars = stars;
    				FP_PLAYER_DATA.PPR[String(pid)].stars = stars;
    				FP_PLAYER_DATA.HALF[String(pid)].stars = stars;
				}
	    	}
    	}
    	
		callback('done');
    });
}

var jquery_regex_repl = /(<(\b(img|head|link)\b)(([^>]*\/>)|([^\7]*(<\/\2[^>]*>)))|(<\bimg\b)[^>]*>|(\b(background|style)\b=\s*"[^"]*"))/g;

function loadLeagueSettings(leagueType, leagueId, server, callback) {
	if (!leagueType || !leagueId){
		callback({});
		return;
	}
    var key = 'league_settings_' + leagueType + leagueId;
    chrome.storage.local.get(key, function(ls) {
    	
        if (ls && ls[key] && ls[key]['scoring'] && ls[key]['time_fetched']) {
        	var minuteSince = (new Date().getTime() - ls[key]['time_fetched']) / 60 / 1000;
        	// console.log(key + ":  " + minuteSince + " minutes ago");
        	if (minuteSince < 60){
                callback(ls[key]);
                return;
        	}
        } 

        if (leagueType == 'yahoo') {
            var league_settings_url = 'https://football.fantasysports.yahoo.com/f1/' + leagueId + '/settings';
            jQuery.get(league_settings_url, function(d) {
                d = d.replace(jquery_regex_repl,'');
                var leagueSettings = parseYahooLeagueSettings(d);
                leagueSettings.time_fetched = new Date().getTime();
                var fpData = {};
                fpData[key] = leagueSettings;
                chrome.storage.local.set(fpData, function() {
                    callback(leagueSettings);
                });
            });
        } else if (leagueType == 'espn') {
        	var league_settings_url = 'http://games.espn.com/ffl/leaguesetup/sections/scoring?leagueId=' + leagueId;
            jQuery.get(league_settings_url, function(d) {
                d = d.replace(jquery_regex_repl,'');
                var leagueSettings = parseEspnLeagueSettings(d);
                leagueSettings.time_fetched = new Date().getTime();
                var fpData = {};
                fpData[key] = leagueSettings;
                chrome.storage.local.set(fpData, function() {
                    callback(leagueSettings);
                });
            });
        } else if (leagueType == 'ndc') {
        	var league_settings_url = 'http://fantasy.nfl.com/league/' + leagueId + '/settings';
            jQuery.get(league_settings_url, function(d) {
                d = d.replace(jquery_regex_repl,'');
                var leagueSettings = parseNdcLeagueSettings(d);
                leagueSettings.time_fetched = new Date().getTime();
                var fpData = {};
                fpData[key] = leagueSettings;
                chrome.storage.local.set(fpData, function() {
                    callback(leagueSettings);
                });
            });
        } else if (leagueType == 'cbs') {
        	var league_settings_url = 'http://' + leagueId + '.football.cbssports.com/rules';
            jQuery.get(league_settings_url, function(d) {
                d = d.replace(jquery_regex_repl,'');
                var leagueSettings = parseCbsLeagueSettings(d);
                leagueSettings.time_fetched = new Date().getTime();
                var fpData = {};
                fpData[key] = leagueSettings;
                chrome.storage.local.set(fpData, function() {
                    callback(leagueSettings);
                });
            });
        } else if (leagueType == 'mfl') {
        	if (server && leagueId){
	        	var league_settings_url = server + 'options?L=' + leagueId + '&O=09';
	            jQuery.get(league_settings_url, function(d) {
	                d = d.replace(jquery_regex_repl,'');
	                var leagueSettings = parseMflLeagueSettings(d);
	                leagueSettings.time_fetched = new Date().getTime();
	                var fpData = {};
	                fpData[key] = leagueSettings;
	                chrome.storage.local.set(fpData, function() {
	                    callback(leagueSettings);
	                });
	            });
        	}  else {
                callback();
            }
        } else {
            callback();
        }
    });
}



function parseEspnLeagueSettings(league_data) {

    var $ld = jQuery(league_data);
    league_settings = {};
    league_settings['siteType'] = 'espn';

    var getValue = function(setting_name) {
        //TODO fix this for the right section
        return parseFloat($ld.find("td:contains('" + setting_name + "')").next().first().text());
    };

    league_settings['pass_yds'] =
        getValue('Passing Yards (PY)') ||
        getValue('(PY5)') / 5.0 ||
        getValue('(PY10)') / 10.0 ||
        getValue('(PY20)') / 20.0 ||
        getValue('(PY25)') / 25.0 ||
        getValue('(PY50)') / 50.0 ||
        getValue('(PY100)') / 100.0 || 0;

    league_settings['pass_tds'] = getValue('TD Pass (PTD)') || 0;
    league_settings['pass_ints'] = getValue('Interceptions Thrown (INT)') || 0;
    league_settings['pass_cmp'] = getValue('Each Pass Completed (PC)') ||
        getValue('(PC5)') / 5.0 ||
        getValue('(PC10)') / 10.0 || 0;
    league_settings['pass_icmp'] =
         getValue('Each Incomplete Pass (INC)') ||
        getValue('(IP5)') / 5.0 ||
        getValue('(IP10)') / 10.0 || 0;
    league_settings['pass_att'] = getValue('Each Pass Attempted (PA)') || 0;
    league_settings['pass_300_bonus'] = getValue('300-399 yard passing game (P300)') || 0;
    league_settings['pass_400_bonus'] = getValue('400+ yard passing game (P400)') || 0;

    league_settings['rush_yds'] = getValue('Rushing Yards (RY)') ||
        getValue('(RY5)') / 5.0 ||
        getValue('Every 10 rushing yards (RY10)') / 10.0 ||
        getValue('(RY20)') / 20.0 ||
        getValue('(RY25)') / 25.0 ||
        getValue('(RY50)') / 50.0 ||
        getValue('(RY100)') / 100.0 || 0;
    league_settings['rush_att'] = getValue('Rushing Attempts (RA)') ||
        getValue('(RA5)') / 5.0 ||
        getValue('(RA10)') / 10.0 || 0;
    league_settings['rush_tds'] = getValue('TD Rush (RTD)') || 0;
    league_settings['rush_100_bonus'] = getValue('100-199 yard rushing game (RY100)') || 0;
    league_settings['rush_200_bonus'] = getValue('200+ yard rushing game (RY200)') || 0;

    league_settings['rec_yds'] =
        getValue('Receiving Yards (REY)') ||
        getValue('Every 5 receiving yards (REY5)') / 5.0 ||
        getValue('(REY10)') / 10.0 ||
        getValue('(REY20)') / 20.0 ||
        getValue('(REY25)') / 25.0 ||
        getValue('(REY50)') / 50.0 ||
        getValue('(REY50)') / 100.0 || 0;
    league_settings['rec_att'] =
        getValue('Each reception (REC)') ||
        getValue('(REC5)') / 5.0 ||
        getValue('(REC10)') / 10.0 || 0;
    league_settings['rec_tds'] = getValue('TD Reception (RETD)') || 0;
    league_settings['rec_100_bonus'] = getValue('100-199 yard receiving game (REY100)') || 0;
    league_settings['rec_200_bonus'] = getValue('200+ yard receiving game (REY200)') || 0;
    //Receiving Target (RET)

    league_settings['scoring'] = league_settings['rec_att'] >= 1 ? 'PPR' :
        league_settings['rec_att'] >= 0.5 ? 'HALF' : 'STD';

    league_settings['xpt'] = getValue('Each PAT Made (PAT)') || 0;
    league_settings['fga'] =
        (getValue('Total FG Attempted (FGA)') || 0) +
        (0.6 * (getValue('FG Attempted (0-39 yards) (FGA9)') || 0)) +
        (0.3 * (getValue('FG Attempted (40-49 yards) (FGA40)') || 0)) +
        (0.1 * (getValue('FG Attempted (50+ yards) (FGA50)') || 0));
    league_settings['fg'] =
        (getValue('Total FG Made (FG)') || 0) +
        (0.6 * (getValue('FG Made (0-39 yards) (FG0)') || 0)) +
        (0.3 * (getValue('FG Made (40-49 yards) (FG40)') || 0)) +
        (0.1 * (getValue('FG Made (50+ yards) (FG50)') || 0));
    league_settings['fgm'] = 
        (getValue('Total FG Missed (FGM)') || 0) +
        (0.6 * (getValue('FG Missed (0-39 yards) (FGM0)') || 0)) +
        (0.3 * (getValue('FG Missed (40-49 yards) (FGM40)') || 0)) +
        (0.1 * (getValue('FG Missed (50+ yards) (FGM50)') || 0));
    //Each PAT Attempted (PATA)
    
    league_settings['fumbles'] = getValue('Total Fumbles Lost (FUML)') || 0;

    //TODO Total tackle here.
    // http://games.espn.com/ffl/leaguesetup/settings?leagueId=609328
    league_settings['ff'] = getValue('Each Fumble Forced (FF)') || 0;
    league_settings['tka'] = getValue('Assisted Tackles (TKA)') || 0;
    league_settings['tks'] = getValue('Solo Tackles (TKS)') || 0;
    league_settings['pd'] = getValue('Passes Defensed (PD)') || 0;

    league_settings['int'] = getValue('Each Interception (INT)') || 0;
    league_settings['deftd'] = getValue('Interception Return TD (INTTD)') || 0;
    league_settings['fr'] = getValue('Each Fumble Recovered (FR)') || 0;
    league_settings['sf'] = getValue('Each Safety (SF)') || 0;
    league_settings['sk'] =
        getValue('Each Sack (SK)') ||
        getValue('1/2 Sack (HALFSK)') * 2 || 0;

    league_settings['pa'] = getValue('Points Allowed (PA)') || 0;
    league_settings['pa0'] = getValue('0 points allowed (PA0)') || 0;
    league_settings['pa1'] = getValue('1-6 points allowed (PA1)') || 0;
    league_settings['pa7'] = getValue('7-13 points allowed (PA7)') || 0;
    league_settings['pa14'] = getValue('14-17 points allowed (PA14)') || 0;
    league_settings['pa18'] = getValue('18-21 points allowed (PA18)') || 0;
    league_settings['pa22'] = getValue('22-27 points allowed (PA22)') || 0;
    league_settings['pa28'] = getValue('28-34 points allowed (PA28)') || 0;
    league_settings['pa35'] = getValue('35-45 points allowed (PA35)') || 0;
    league_settings['pa46'] = getValue('46+ points allowed (PA46)') || 0;

    league_settings['ya'] = getValue('Yards Allowed (YA)') || 0;
    league_settings['ya100'] = getValue('Less than 100 total yards allowed (YA100)') || 0;
    league_settings['ya199'] = getValue('100-199 total yards allowed (YA199)') || 0;
    league_settings['ya299'] = getValue('200-299 total yards allowed (YA299)') || 0;
    league_settings['ya349'] = getValue('300-349 total yards allowed (YA349)') || 0;
    league_settings['ya399'] = getValue('350-399 total yards allowed (YA399)') || 0;
    league_settings['ya449'] = getValue('400-449 total yards allowed (YA449)') || 0;
    league_settings['ya499'] = getValue('450-499 total yards allowed (YA499)') || 0;
    league_settings['ya549'] = getValue('500-549 total yards allowed (YA549)') || 0;
    league_settings['ya550'] = getValue('550+ total yards allowed (YA550)') || 0;
    
    return league_settings;
}

function parseNdcLeagueSettings(league_data) {
    var $ld = jQuery(league_data);
    var league_settings = {};
    league_settings['siteType'] = 'ndc';

    var getValue = function(setting_name) {
    	var value = 0;
    	var text = $ld.find("em:contains('" + setting_name + "')").next().first().text();
    	if (text && text.indexOf(" point") != -1){
    		value = parseFloat(text.split(" point")[0]);
    		if (text.indexOf(" per ") != -1){
    			value = value / parseFloat(text.split(" per ")[1].split(" ")[0]);
    		}
    	}
        return value;
    };

    league_settings['pass_tds'] = getValue('Passing Touchdowns') || 0;
    league_settings['pass_ints'] = getValue('Interceptions Thrown') || 0;
    league_settings['pass_yds'] = getValue('Passing Yards') || 0;
    
    league_settings['rush_tds'] = getValue('Rushing Touchdown') || 0;
    league_settings['rush_yds'] = getValue('Rushing Yards') || 0;
    
    league_settings['rec_att'] = getValue('Receptions') || 0;
    league_settings['rec_tds'] = getValue('Receiving Touchdowns') || 0;
    league_settings['rec_yds'] = getValue('Receiving Yards') || 0;

    league_settings['fumbles'] = getValue('Fumbles Lost') || 0;
    
    league_settings['scoring'] = league_settings['rec_att'] >= 1 ? 'PPR' :
        league_settings['rec_att'] >= 0.5 ? 'HALF' : 'STD';
        
        /*
        Fumble Recovered for TD:6 points
        2-Point Conversions:2 points
        
        Kicking
        PAT Made:1 point
        FG Made 0-19:3 points
        FG Made 20-29:3 points
        FG Made 30-39:3 points
        FG Made 40-49:3 points
        FG Made 50+:5 points
        Defense / Special Teams
        Sacks:1 point
        Interceptions:2 points
        Fumbles Recovered:2 points
        Safeties:2 points
        Touchdowns:6 points
        Kickoff and Punt Return Touchdowns:6 points
        Points Allowed 0:10 points
        Points Allowed 1-6:7 points
        Points Allowed 7-13:4 points
        Points Allowed 14-20:1 point
        Points Allowed 21-27:0 points
        Points Allowed 28-34:-1 point
        Points Allowed 35+:-4 points
        */
        
    return league_settings;
}

function parseCbsLeagueSettings(league_data) {
    var $ld = jQuery(league_data);
    var league_settings = {};
    league_settings['siteType'] = 'cbs';

    var getValue = function(setting_name) {
    	var value = 0;
    	var text = $ld.find("td:contains('" + setting_name + "')").next().text();
    	if (text && text.indexOf(" point") != -1){
    		var params = text.split(" point")[0].split(" ");
    		value = parseFloat(params[params.length - 1]);
    		if (text.indexOf(" for every ") != -1){
    			value = value / parseFloat(text.split(" for every ")[1].split(" ")[0]); 
    		}
    	}
        return value;
    };

    league_settings['pass_tds'] = getValue('Passing TD') || 0;
    league_settings['pass_ints'] = getValue('Passing Interception') || 0;
    league_settings['pass_yds'] = getValue('Passing Yards') || 0;
    
    league_settings['rush_tds'] = getValue('Rushing TD') || 0;
    league_settings['rush_yds'] = getValue('Rushing Yards') || 0;
    
    league_settings['rec_att'] = getValue('Reception') || 0;
    league_settings['rec_tds'] = getValue('Receiving TD') || 0;
    league_settings['rec_yds'] = getValue('Receiving Yards') || 0;

    league_settings['fumbles'] = getValue('Fumble Lost') || 0;
    
    league_settings['scoring'] = league_settings['rec_att'] >= 1 ? 'PPR' :
        league_settings['rec_att'] >= 0.5 ? 'HALF' : 'STD';
        
    return league_settings;
}

function parseMflLeagueSettings(league_data) {
    var $ld = jQuery(league_data);
    var league_settings = {};
    league_settings['siteType'] = 'mfl';

    var getValue = function(setting_name) {
    	var value = 0;
    	var text = $ld.find("td:contains('" + setting_name + "')").next().next().text();
    	if (text && text.indexOf(" point") != -1){
    		value = parseFloat(text.split(" point")[0]);
    	}
        return value;
    };    
    
    league_settings['pass_tds'] = getValue('Passing TDs') || 0;
    league_settings['pass_ints'] = getValue('Pass Interceptions Thrown') || 0;
    league_settings['pass_yds'] = getValue('Passing Yards') || 0;
    
    league_settings['rush_tds'] = getValue('Rushing TDs') || 0;
    league_settings['rush_yds'] = getValue('Rushing Yards') || 0;
    
    league_settings['rec_att'] = getValue('Receptions') || 0;
    league_settings['rec_tds'] = getValue('Receiving TDs') || 0;
    league_settings['rec_yds'] = getValue('Receiving Yards') || 0;

    league_settings['fumbles'] = getValue('Fumbles Lost') || 0;
    
    league_settings['scoring'] = league_settings['rec_att'] >= 1 ? 'PPR' :
        league_settings['rec_att'] >= 0.5 ? 'HALF' : 'STD';
        
    return league_settings;
}

function extractUrlParameter(sPageURL, sParam) {
	if (sPageURL.indexOf("?") == -1){
		return;
	}
    var parameters = sPageURL.split("?")[1],
        sURLVariables = parameters.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};	
