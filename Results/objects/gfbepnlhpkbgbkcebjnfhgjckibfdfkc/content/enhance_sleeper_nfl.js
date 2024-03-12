var MAX_ATTEMPT = 30;
var DELAY_AFTER_CLICK = 750;
var previousURL = location.href;
var blockPremiumAdvice = false;

function ready(callback){
    if (document.readyState!='loading') {
    	callback();
    } else if (document.addEventListener) {
    	document.addEventListener('DOMContentLoaded', callback);
    }
}

ready(function(){ 	
	if (typeof checkPremiumAdvice == 'function'){
		checkPremiumAdvice();		
	}
	listenToTabChanges();
});

function listenToTabChanges(){	
	if (jQuery(".center-tab-selector .item-tab").length == 0){
		setTimeout(listenToTabChanges, 250);
	} else {
		jQuery(".center-tab-selector .item-tab").click(function(){
			if (blockPremiumAdvice == false){
				userDataFilled = false;
				$("#fpExtensionPanelContainer").remove();
				checkPremiumAdvice();
			}
		});	
	}
}

function getLeagueId(){
	var leagueId = location.href.split("/leagues/")[1];
	if (leagueId.indexOf("/") != -1){
		leagueId = leagueId.split("/")[0];
	}
	return leagueId;
}

function getLeagueType(){
    return 30; //SLEEPERBOT_LEAGUE
}
function getTeamId(){
	return 'ANY';
}

function getPremiumAdviceMode(){
	var selectedTab = $(".center-tab-selector .selector-title.selected").html();	
	if (selectedTab && selectedTab.toUpperCase() == 'TEAM'){
		return isStartSitAssistantReady() ? 'SSA' : ''; 
	} else if (selectedTab && selectedTab.toUpperCase() == 'PLAYERS'){
		return 'TopAv';
	}
	return '';
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.cmd == 'reloadAdvice') {
    	if (msg.url != previousURL){
    		previousURL = msg.url;
    		$(".fp-extension-premium-advice").remove();
			$("#fpPanelMain").show();
			if (blockPremiumAdvice == false){
	    		userDataFilled = false;
	    		fillUserData();
			}
			listenToTabChanges();
    	}
	} else if (msg.cmd == 'submitToSleeper') {
		blockPremiumAdvice = true;
		
		var leagueData = []; 
		var starterIds = []; 
		var playersToStart = []; 
		var playersToSit = []; //not used in code below
		
		var players = msg.players.split(",");
		var positions = msg.positions.split(",");
		for (var i=0; i<players.length; i++){
			starterIds.push(Number(players[i]));
			playersToStart.push({
				fpId: Number(players[i]),
				position: (i<positions.length ? positions[i] : "Unknown")
			});
		}
		
		$(".center-tab-selector > div:nth-child(2)").click();
		changeTabAndSubmitLineup(leagueData, starterIds, playersToStart, playersToSit, 0);
    } 
    sendResponse('ok');
});

function changeTabAndSubmitLineup(leagueData, starterIds, playersToStart, playersToSit, retries){
	
	if (retries > 10){
		onSubmitLineupFailure(leagueData, starterIds, "Could not open tab");
		return;
	}
	/*
	console.log("#" + retries + " changeTabAndSubmitLineup...");
	console.log("tabs: " + $(".center-tab-selector > div:nth-child(2)").length);
	console.log("slots: " + jQuery(".league-slot-position-square").length);	 
	*/
	
	if($(".center-tab-selector > div:nth-child(2)").length == 0 || jQuery(".league-slot-position-square").length == 0){
		setTimeout(function(){
			changeTabAndSubmitLineup(leagueData, starterIds, playersToStart, playersToSit, retries+1);
		}, DELAY_AFTER_CLICK);		
		return;
	}
	
	submitLineup(leagueData, starterIds, playersToStart, playersToSit);
}


function submitLineup(leagueData, starterIds, playersToStart, playersToSit){
	var startersMap = {};
	for (var i=0; i<playersToStart.length; i++){
		startersMap[playersToStart[i].fpId]= playersToStart[i];
	}
	movePlayers(leagueData, starterIds, startersMap, playersToStart, 1);
}

function movePlayers(leagueData, starterIds, startersMap, playersToStart, count){
	
	if (count > MAX_ATTEMPT){
		onSubmitLineupFailure(leagueData, starterIds, "Could not find valid lineup after " + MAX_ATTEMPT + " attempts");
		return;
	}
	
	if (jQuery(".league-slot-position-square").length == 0){
		onSubmitLineupFailure(leagueData, starterIds, "Could not move players");
		return;
	}
	
	var foundMove = false;
	
	//STEP 1: bench all non-starters
	jQuery(".league-slot-position-square").each(function(){
		if (foundMove){
			return;
		}
		var slot = getSlot(this);
		if (slot == 'bn' || slot == 'ir' || slot == 'tx'){
			return;
		}
		
		var name = jQuery(this).parents(".team-roster-item").find(".player-name").html();
		var fpId = getFpIdFromDiv(jQuery(this).parents(".team-roster-item"), name);	

		if (fpId && jQuery.inArray(fpId, starterIds) == -1){
			console.log("BENCHING " + name);
			foundMove = true;

			jQuery(this).click();
			
			setTimeout(function(){
				var foundSwitch = false;
				
				jQuery(".team-roster-item.valid").each(function(){
					
					if (foundSwitch){
						return;
					}

					var button = jQuery(this).find(".league-slot-position-square");
					if (button.length == 0){
						return;
					}

					var slot2 = getSlot(button.get(0));
					if (slot2 == 'bn' && jQuery(this).find(".cell-player-meta").html() == 'Empty'){
						foundSwitch = true;
						button.click();
						console.log("BENCHED " + name);
					}
				});
				
				if (foundSwitch){
					setTimeout(function(){
						movePlayers(leagueData, starterIds, startersMap, playersToStart, ++count);
					}, DELAY_AFTER_CLICK);
				} else {
					onSubmitLineupFailure(leagueData, starterIds, "Could not bench " + name);
				}
				
			}, DELAY_AFTER_CLICK);
			
		}
	});

	if (foundMove){
		return;
	}
	
	//Step 2: move players to empty slots
	jQuery(".league-slot-position-square").each(function(){
		if (foundMove){
			return;
		}
		var slot = getSlot(this);
		if (slot == 'bn' || slot == 'ir' || slot == 'tx'){
			return;
		}
		if (jQuery(this).parents(".team-roster-item").find(".cell-player-meta").html() == 'Empty'){

			console.log("FILLING " + slot);
			foundMove = true;

			jQuery(this).click();
			
			setTimeout(function(){
				var foundSwitch = false;
				
				jQuery(".team-roster-item.valid").each(function(){
					
					if (foundSwitch){
						return;
					}

					var button = jQuery(this).find(".league-slot-position-square");
					if (button.length == 0){
						return;
					}

					var slot2 = getSlot(button.get(0));
					if (slot == slot2){
						return;
					}
					var name2 = jQuery(this).find(".player-name-with-position span").html();
					var fpId2 = getFpIdFromDiv(jQuery(this), name2);
					if (startersMap[fpId2] && slot.toLowerCase() == startersMap[fpId2].position.toLowerCase()){
						console.log("CLICK " + name2 + " who was " + slot2);
						button.click();
						foundSwitch = true;
					}
					
				});
				
				if (foundSwitch){
					setTimeout(function(){
						movePlayers(leagueData, starterIds, startersMap, playersToStart, ++count);
					}, DELAY_AFTER_CLICK);
				} else {
					onSubmitLineupFailure(leagueData, starterIds, "Could not fill " + slot.toUpperCase());
				}
				
			}, DELAY_AFTER_CLICK);
		}
		
	});

	if (foundMove){
		return;
	}

	//Step 3: switch starters between slots
	for (var i=0; i<playersToStart.length; i++){

		jQuery(".league-slot-position-square").each(function(){
			if (foundMove){
				return;
			}
			var slot = getSlot(this);
			var name = jQuery(this).parents(".team-roster-item").find(".player-name").html();
			var fpId = getFpIdFromDiv(jQuery(this).parents(".team-roster-item"), name);
			if (fpId == playersToStart[i].fpId){
				if (slot.toLowerCase() != playersToStart[i].position.toLowerCase()){
					console.log("MOVING " + name + " from " + slot + " to " + playersToStart[i].position);
					foundMove = true;

					jQuery(this).click();
					
					setTimeout(function(){
						var foundSwitch = false;
						
						jQuery(".team-roster-item.valid").each(function(){
							
							if (foundSwitch){
								return;
							}

							var button = jQuery(this).find(".league-slot-position-square");
							if (button.length == 0){
								return;
							}

							var slot2 = getSlot(button.get(0));
							if (slot2.toLowerCase() == playersToStart[i].position.toLowerCase()){
								var name2 = jQuery(this).find(".player-name-with-position span").html();
								var fpId2 = getFpIdFromDiv(jQuery(this), name2);
								if (!fpId2 || (startersMap[fpId2] && startersMap[fpId2].position.toLowerCase() == slot.toLowerCase())){
									console.log("SWITCHED " + name + " with " + name2);
									button.click();
									foundSwitch = true;
								}
							}
							
						});
						
						if (foundSwitch){
							setTimeout(function(){
								movePlayers(leagueData, starterIds, startersMap, playersToStart, ++count);
							}, DELAY_AFTER_CLICK);
						} else {
							onSubmitLineupFailure(leagueData, starterIds, "Could not move " + name + " from " + slot.toUpperCase() + " to " + playersToStart[i].position);
						}
						
					}, DELAY_AFTER_CLICK);
				}
			}
		});
		
		if (foundMove){
			return;
		}
	}
	

	onSubmitLineupSuccess(leagueData, starterIds);	
}

function getFpIdFromDiv(elt, name){
	if (elt.find(".cell-player-meta").html() == 'Empty'){
		return;
	}
		
	var background = elt.find(".avatar-player").attr("src");
	var sbId,fpId;
	if (background){
		if (background.indexOf("/thumb/") != -1){
			sbId = background.substring(background.indexOf("/thumb/") + "/thumb/".length).split(".")[0];
		} else if (background.indexOf("/team_logos/nfl/") != -1){
			var teamCode = background.substring(background.indexOf("/team_logos/nfl/") + "/team_logos/nfl/".length).split(".")[0];
			return getDefenseId(teamCode);
		} else {
			console.log("Unknown background: " + background);
		}
	} else {
		console.log("Missing background: " + elt.html());
	}
	if (sbId && PLAYER_CACHE.sleeper[sbId]){
		fpId = PLAYER_CACHE.sleeper[sbId];
	}	
	if (sbId && !fpId){
		console.log("Unknown Sleeper id #" + sbId + " for " + name);
	}
	return fpId;
}
	
function onSubmitLineupSuccess(leagueData, starterIds){
	
	if ($("#fpPanelSSA").length == 0){		
		showStartSitAdvice(leagueData, undefined, true);
	} else {	
		$("#fpPanelSSA").find(".fp-extension-loading").remove();
		$("#fpPanelSSA").find(".fp-extension-body").remove();
		$("#fpPanelSSA").find(".fp-extension-btn-div").remove();
	}
		
	var bodySSA = $("<div class='fp-extension-body'></div>");
	bodySSA.appendTo($("#fpPanelSSA"));
	
	var section = $("<div class='fp-extension-section'></div>");
	section.appendTo(bodySSA);	

	var list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);

	$("<div class='fp-extension-check-circle'></div>").appendTo(list);
	$("<div class='fp-extension-upgrade-header'>Lineup Saved</div>").appendTo(list);

	if (leagueData.length == 0){
		// starter data coming form extension message
		$("#fpExtensionPanelContainer").show();
  		$(".fp-extension-premium-advice").show();
		$("#fpPanelMain").hide();
	} else {
		var desc = $("<div class='fp-extension-upgrade-desc' style='margin-top: 10px'></div>");
		desc.appendTo(list);
		var link = $("<a href='javascript:void(0)'>Refresh Advice</a>");
		link.appendTo(desc);
		link.click(function(){
			$("#fpPanelSSA").find(".fp-extension-body").remove();
			$("<div class='fp-extension-loading'></div>").appendTo($("#fpPanelSSA"));
			fetchSSA(leagueData, true);
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Refresh Advice Click', 'label': 'Premium'});
		});
	}
	
	$("<div style='height:20px'></div>").appendTo(list);

    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Submit Lineup Success', 'label': 'Premium'});    

	blockPremiumAdvice = false;
	
}



function onSubmitLineupFailure(leagueData, starterIds, message){
	
	if ($("#fpPanelSSA").length == 0){		
		showStartSitAdvice(leagueData, undefined, true);
	} else {	
		$("#fpPanelSSA").find(".fp-extension-loading").remove();
		$("#fpPanelSSA").find(".fp-extension-body").remove();
	}
	
	var bodySSA = $("<div class='fp-extension-body'></div>");
	bodySSA.appendTo($("#fpPanelSSA"));
	
	var section = $("<div class='fp-extension-section'></div>");
	section.appendTo(bodySSA);	

	var list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);

	$("<div class='fp-extension-failure'></div>").appendTo(list);
	$("<div class='fp-extension-upgrade-header'>Unable to Submit Lineup</div>").appendTo(list);
	if (message){
		$("<div class='fp-extension-upgrade-desc'>" + message + "</div>").appendTo(list);
	}

	if (leagueData.length == 0){
		// starter data coming form extension message
		$("#fpExtensionPanelContainer").show();
  		$(".fp-extension-premium-advice").show();
		$("#fpPanelMain").hide();
	} else {
		var desc = $("<div class='fp-extension-upgrade-desc' style='margin-top: 10px'></div>");
		desc.appendTo(list);
		var link = $("<a href='javascript:void(0)'>Refresh Advice</a>");
		link.appendTo(desc);
		link.click(function(){
			$("#fpPanelSSA").find(".fp-extension-body").remove();
			$("<div class='fp-extension-loading'></div>").appendTo($("#fpPanelSSA"));
			fetchSSA(leagueData, true);
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Refresh Advice Click', 'label': 'Premium'});
		});
	}
	
	$("<div style='height:20px'></div>").appendTo(list);
	
    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Submit Lineup Failure', 'label': 'Premium'});
    
	blockPremiumAdvice = false;	
}

function getSlot(btn){
	var slot = btn.className.split("league-slot-position-square ")[1];
	if (slot.indexOf("disabled") != -1){
		slot = slot.replace("disabled","").trim();
	}
	if (slot == 'super_flex'){
		slot = "qb/wr/rb/te";
	} else if (slot == 'idp_flex'){
		slot = "idp";
	} else if (slot == 'def'){
		slot = "dst";
	} else if (slot == 'flex'){
		var flexes = []
		jQuery(btn).find("div").each(function(){
			var f = this.className;
			if (f.indexOf("disabled") != -1){
				f = f.replace("disabled","").trim();
			}
			flexes.push(f);
		});
		if (flexes.length){
			slot = flexes.join("/");
		}
	}
	return slot;
}

function getCurrentLineup(){
	var result = [];

	jQuery(".league-slot-position-square").each(function(){
		var slot = getSlot(this);
		var name = jQuery(this).parents(".team-roster-item").find(".player-name").html();
		var fpId = getFpIdFromDiv(jQuery(this).parents(".team-roster-item"), name);
		if (fpId){
			result.push(slot + ":" + fpId);
		}
	});
	return result;
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
	if (abbrev == "lar" || abbrev == "la") {
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
