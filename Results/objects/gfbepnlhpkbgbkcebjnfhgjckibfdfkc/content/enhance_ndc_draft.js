var allowDragResize = false;

function getUrlParameter (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

var draftLeagueId = getUrlParameter("mockLeagueId") || getUrlParameter("leagueId");
var draftTeamId = getUrlParameter("teamId");

if (!draftLeagueId){
	// https://fantasy.nfl.com/league/2282474/draftclient
	var idx1 = window.location.href.indexOf("/league/");
	var idx2 = window.location.href.indexOf("/draftclient");
	if (idx1 > 0 && idx2 > 0){
		draftLeagueId = window.location.href.substring(idx1 + "/league/".length, idx2);
	}
}


function getCurrentPickDiv(){

	var div = jQuery(".r-iphfwy");

	if (div.length == 0){	
		div = jQuery("div[aria-label='Enable or disable']").parent().parent().parent().next().next().find("> div:first-child > div:first-child > div:first-child > div:first-child");
	}
	
	return div;	
}


function getBannerDiv(){
	return jQuery("div[aria-label='Enable or disable']").parent().parent().parent().next().find("> div");
}

function getPickLog(){
	var picks = [];
	var playerNames = getCurrentPickDiv().parent().parent().parent().next().find("> div:first-child > div:first-child > div:nth-child(2) > div:first-child > div > div:first-child > div:nth-child(3) > div:first-child");
	playerNames.each(function(index){		
		picks.push(jQuery(this).html());
	});
	return picks;
}

function checkTeamId(){
	if (!draftTeamId){
		draftTeamId = jQuery("#draftOrder").find("li.isLoginTeam").attr("data-team-id");
	}
}


function checkTeams(){
	var teams = [];
	
	var selects = jQuery("div[aria-label='Team dropdown'] select");
	if (selects.length){
		for (var i=0; i<selects[0].options.length; i++){
			teams.push({
				id: selects[0].options[i].value,
				name: selects[0].options[i].text
			})
		}
	}
	return teams;
}

function getSelectedPlayerId(){

	var statusDiv = getCurrentPickDiv().parent().parent().parent().next().find("> div:first-child > div:first-child > div:first-child");
	var playerName = statusDiv.find("> div:nth-child(3) > div:first-child").html(); //D. Henry
	var playerInfo = statusDiv.find("> div:nth-child(3) > div:nth-child(2)").html(); //TEN - RB (Avg. $33)
	if (playerInfo && playerInfo.split(" ").length > 2){
		var playerTeam = playerInfo.split(" ")[0].toLowerCase();
		var playerPos = playerInfo.split(" ")[2].toLowerCase();
		
		for (var i=0; i<NFL_PLAYER_DATA.players.length; i++){
			var p = NFL_PLAYER_DATA.players[i];
			if (p.p.toLowerCase() == playerPos && 
					p.t.toLowerCase() == playerTeam && 
					p.fn[0] == playerName.toLowerCase()[0] && 
					playerName.toLowerCase().indexOf(p.ln) != -1){
				return p.fp;
			}
		}		
	}
	if (playerName){
		console.log("Canot match player: " + playerName + " " + playerInfo);
	}
	return -1;
}

function isAuctionRoom(){
	return jQuery("div[aria-label='Nomination']").length > 0;
}


var nominatedPlayerId = -1;

function checkSelectedPlayer(){
	
	if (isAuctionRoom()){
		var selectedPlayerId = getSelectedPlayerId();
		if (selectedPlayerId  > 0 && selectedPlayerId != nominatedPlayerId){
	//		console.log("Selection changed from " + nominatedPlayerId + " to " + selectedPlayerId);
			nominatedPlayerId = selectedPlayerId;
			
			sendMessageToAssistant({
				nominee : nominatedPlayerId,
				clockSeconds : getClockSeconds(),
				completed: draftIsCompleted()
			});
		}
	} else if (userIsOnTheClock() || draftIsCompleted()){
		// make sure we notify the assistants
		sendMessageToAssistant({
			userIsOnTheClock : userIsOnTheClock(),
			completed: draftIsCompleted()
		});
	}
}

var sendMessageTask;

function checkDraftPicks(){	

	/*
	
	var count = 0;
	var pickLog = [];
	var teamNameLog = [];
	var teamIdLog = [];
	var bidLog = [];
	var hasBids = false;
	
	var teams = checkTeams();
	var teamMap = {};
	for (var i=0; i<teams.length; i++){
		teamMap[teams[i].name] = teams[i].id;
	}

	jQuery("#draftResults li").each(function(index){
		if ($(this).html() && $(this).html().startsWith("Round ")){
			return;
		}
		
		var playerSpan = $(this).find("span.p");
		var nflId = playerSpan.attr("data-id");
		
		if (!nflId){
			return;
		}
		
		var fpId = -1;
		if (PLAYER_CACHE.nfl[nflId]){
			fpId = PLAYER_CACHE.nfl[nflId];
		} else {
			console.log("Unknown nflId=" + nflId + " for " + playerSpan.html());
		}
		
		var teamName = $(this).find("em").html();
		if (!teamName){
			teamName = "Uknown Team";
		}
		var idx = teamName.indexOf("(");
		if (idx > 0){
			teamName = teamName.substring(idx+1);
			idx = teamName.lastIndexOf(")");
			if (idx > 0){
				teamName = teamName.substring(0,idx);
			}
		}
		//	console.log(fpId + " by " + teamName);
		
		teamNameLog.unshift(teamName);

		var teamId = teamMap[teamName];
		if (!teamId){
			//the HMTL select will trim some white spaces
			for (var tn in teamMap) {
			    if (teamMap.hasOwnProperty(tn)){
			    	if (tn.replace(/ /g, '') == teamName.replace(/ /g, '')){
			    		teamId = teamMap[tn];
			    		break;
			    	}
			    }
			}
		}
		teamIdLog.unshift(teamId);
		
		pickLog.unshift(fpId);

		var bid = 0;	
		var auctionCost = $(this).find(".auctionCost span").html();
		if (auctionCost && auctionCost.length > 1 && auctionCost[0] == '$'){
			bid = Number(auctionCost.substring(1));
			bidLog.unshift(bid);	
			hasBids = true;
		}
	});
	
	
	var message = {
	  pickLog: pickLog,
	  teamIds: teamIdLog,
//	  teamNames: teamNameLog, this puts the node server over the request size limit (HTTP error 413)
	  teams: teams
	};
	
	if (hasBids){
		message.bidLog = bidLog;		
		message.nominee = getSelectedPlayerId()
	}
	
	*/
	

	var message = {
		teams: checkTeams(),
		pickDesc: getCurrentPickDiv().html()
	}

	if (message.pickDesc && message.pickDesc.split(" ").length == 4){
		var pickLog = []
		var currentPick = Number(message.pickDesc.split(" ")[1]) * (message.teams.length-1) + Number(message.pickDesc.split(" ")[3]);
		for (var i = 1; i < currentPick; i++){
			pickLog.push(i);
		}
		message.pickLog = pickLog; // the socket client is only ready the number of picks, not their content.		
	}
	
	if (sendMessageTask){
		clearTimeout(sendMessageTask);
	}
	
	//add 500ms delay to make sure the client is updated before we send the event...
	sendMessageTask = setTimeout(function(){
		message.userIsOnTheClock = userIsOnTheClock();
	//	message.teamOnTheClock = teamOnTheClock();
		message.completed = draftIsCompleted();
		message.clockSeconds = getClockSeconds();
		sendMessageToAssistant(message);
		
		checkSelectedPlayer();
		watchForChangesInPlayerArea();
	}, 500);
}

function getClockSeconds(){
	var clock = getCurrentPickDiv().next().html();
	var seconds = -1;
	if (clock && clock.split(":").length == 2){
		var seconds = 60 * Number(clock.split(":")[0]) + 
			Number(clock.split(":")[1]);
	}
	return seconds;
}

function userIsOnTheClock(){
	var ticker = getCurrentPickDiv().parent().parent().parent().parent().prev().html();
	return ticker && ticker.indexOf("You are on the clock") != -1;
}

function teamOnTheClock(){
	return getCurrentPickDiv().parent().parent().parent().next().find("> div:first-child > div:first-child > div:first-child > div:nth-child(2) > div:nth-child(2) > div:first-child").html();
}

function draftIsCompleted(){
	return getBannerDiv().html() && getBannerDiv().html().indexOf("ended") != -1;
}

var hasSentFirstMessage = false;
var hasFoundAssistant = false;

function sendMessageToAssistant(message){

	checkTeamId();	
	var sport = 'nfl';
	
	message.cmd = 'sendSync';
	message.sport = sport;
	message.type = "N"; //NFL.com
	message.leagueId = draftLeagueId;
	message.teamId = draftTeamId;	

//	console.log(message);
	
	if (false){ //let's retire the websocket server
		jQuery.ajax({
		  type: "POST",
		  url: "https://draftsync.fantasypros.com/ping", //"http://localhost:3004/ping",
		  data: message,
		  success: function(data){
			  checkAssistant();
		  }
		});
	} else { //use chrome
		chrome.runtime.sendMessage(message, function(res){
			 checkAssistant();
		});
	}
	
}

function checkAssistant(){
	  hasSentFirstMessage = true;

	  if (getUrlParameter("mockLeagueId")){
		  // no assistant for nfl.com mock drafts
	  } else if (hasFoundAssistant == false){
		  if (jQuery(".sync-status").length == 0){

			  var dwURL = "https://draftwizard.fantasypros.com/assistant/?source=ndc_draft";
			  dwURL += "&sport=" + sport;
			  dwURL += "&leagueId=" +  draftLeagueId;
			  dwURL += "&teamId=" +  draftTeamId;
			  
			  jQuery("#header").append("<a class='sync-status sync-status-ndc sync-searching' target='_blank' href='" + dwURL +
						"'>Launch FantasyPros Draft Assistant...</a>");
		  }
		  var message2 = {};
		  message2.cmd = 'checkAssistant';
		  message2.sport = sport;
		  message2.type = "N"; //NFL.com
		  message2.leagueId = draftLeagueId;
		  message2.teamId = draftTeamId;
		  
		  chrome.runtime.sendMessage(message2, function(res){});
	  }
}



function hideSideAssistant(){
	$("body").addClass("body-with-side-assistant-hidden");
}
function showSideAssistant(){
	$("body").removeClass("body-with-side-assistant-hidden");
}

function toggleSideAssistant(){
	$("body").toggleClass("body-with-side-assistant-hidden");
}

function checkDockedAssistant(){
	if($(window).width() >= 1500){
		if ($( ".side-assistant").hasClass("side-assistant-docked") == false){
			//force dock
			$( ".side-assistant").addClass("side-assistant-docked");
			$( ".side-assistant" ).
 				css("left", "auto").
				css("right", "0").
				css("top", "0").
				css("bottom", "0").
				css("height", "100%").
				css("width", "405px");
			
			if (allowDragResize){
				$( ".side-assistant" ).draggable("disable");
				$( ".side-assistant" ).resizable("disable");
			}
		}
	} else if ($( ".side-assistant").hasClass("side-assistant-docked")){
		$( ".side-assistant").removeClass("side-assistant-docked");
		$( ".side-assistant" ).
			css("right", "auto").
			css("left", "calc(100% - 420px)").
			css("top", "48px").
			css("bottom", "auto").
			css("height", "654px").
			css("width", "400px");
		
		if (allowDragResize){
			$( ".side-assistant" ).draggable("enable");	
			$( ".side-assistant" ).resizable("enable");		
		}
	}
}

function makeDraftPick(sport, fpId){

	var bFound = false;
	
	jQuery("#player-list-body").find("li").each(function(index){
		var nflId = jQuery(this).attr("data-id");
		if (PLAYER_CACHE.nfl[nflId] == fpId && !bFound){
			jQuery(this).click();
			bFound = true;
		}
	});
	
	if (bFound){
		setTimeout(function(){	
			jQuery("#player").find(".draft.btn").click();
		}, 100);
	} else {
		alert("We could not find this player on the page.");
	}
	
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	
    if (msg.cmd == 'foundAssistant' || msg.cmd == 'requestSync' || msg.cmd == 'makeDraftPick') {

    	checkTeamId();	
    	var sport = 'nfl';
    			
    	if (sport == msg.sport && "N" == msg.type &&
    			draftLeagueId == msg.leagueId && draftTeamId == msg.teamId){
    		
    		if (msg.cmd == 'makeDraftPick'){
    			makeDraftPick(sport, msg.fpId);
        		return;
        	}
    		
        	jQuery(".sync-status").html("Synced with Draft Assistant");
        	jQuery(".sync-status").removeClass("sync-searching");
        	hasFoundAssistant = true;
        	
        	if (msg.cmd == 'requestSync'){
        		checkDraftPicks();
        	} 

    		if ($(".side-assistant").length == 0 && msg.assistantUrl  && msg.assistantUrl.indexOf("/d/") != -1){
    			
    			var sideUrl = msg.assistantUrl;
    			if (msg.assistantUrl.indexOf("rdr.jsp") != -1){
    				sideUrl = msg.assistantUrl.replace(/rdr\.jsp/g, 'side.jsp');
    			} else if (msg.assistantUrl.indexOf("classic.jsp") != -1){
    				sideUrl = msg.assistantUrl.replace(/classic\.jsp/g, 'side.jsp');
    			} else if (msg.assistantUrl.indexOf("auction.jsp") != -1){
    				sideUrl = msg.assistantUrl.replace(/auction\.jsp/g, 'side.jsp');
    			} else if (msg.assistantUrl.indexOf(".jsp") == -1){
        			var idx = msg.assistantUrl.indexOf("/d/");
    				sideUrl = msg.assistantUrl.substring(0,idx + "/d/".length) + "side.jsp" +
        				msg.assistantUrl.substring(idx + "/d/".length)
    			}
    			
        		$("body").addClass("body-with-side-assistant");
        		$("body").append("<div class='side-assistant side-assistant-ndc'>" +
        			"<div class='side-assistant-header'>" +
        			"<img src='https://cdn.fantasypros.com/assets/images/logos/dw-logo.svg' class='side-assistant-header-logo' alt='FantasyPros.com'>"+
        			"<a href='javascript:void(0)' class='side-assistant-header-close' id='hide-assistant-link' title='Hide FantasyPros Assistant'>X</a>" + 
        			"</div><iframe id='sideAssistantFrame' src='" + sideUrl + "'/></div>");
        		$("body").append("<a href='javascript:void(0)' class='side-assistant-btn side-assistant-btn-ndc' id='show-assistant-link' title='Show FantasyPros Assistant'></a>");
        		$("#hide-assistant-link").click(hideSideAssistant);
        		$("#show-assistant-link").click(showSideAssistant);

        		if (allowDragResize){
	        		$(".side-assistant").draggable({cursor: 'move',containment: "parent"});
	        		$(".side-assistant").resizable({minWidth: 400}); 
        		}
        		$(window).resize(checkDockedAssistant);
        		checkDockedAssistant();        		
        		
        		if (navigator.brave && navigator.brave.isBrave){
					navigator.brave.isBrave().then(value => { 
						if (value){ 
	            			$("<div id='fpBraveWarning' style='text-align:center;padding: 10px;font-size: 13px;background: #f1f1d4; color:black'>" +
	            				"Please make Sure that your Brave Shields are DOWN<br/>in order to use FantasyPros' Side Assistant</div>").insertBefore($("#sideAssistantFrame"));
						}
					});
				}
    		}
    	}
    	
    }    
    sendResponse('ok');
});

var bodyObserver, pickObserver, selectionObserver, listObserver;

function watchForChangesInDraftResults() {

	var elts = getCurrentPickDiv();
	if (elts.length == 0){
		return;
	}
	var target_observe = elts[0];
	if (!target_observe){
		return;
	}
	
    if (!pickObserver){
    	pickObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else {				
				checkDraftPicks();	
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	pickObserver.observe(target_observe, observerConfig);
}

function watchForChangesInPlayerArea(){

	var statusDiv = getCurrentPickDiv().parent().parent().parent().next().find("> div:first-child > div:first-child");

	if (statusDiv.length == 0){
		return;
	}
	var target_observe = statusDiv[0];
	
    if (!selectionObserver){
    	selectionObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else {
				checkSelectedPlayer();
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	selectionObserver.observe(target_observe, observerConfig);
	
}

function watchForChangesInBody() {

	var target_observe = document.querySelector("body");
	if (!target_observe){
		return;
	}
	
    if (!bodyObserver){
    	bodyObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else {
				if (getCurrentPickDiv().length){
					this.disconnect();
					checkDraftPicks();
				//	console.log("switch to watchForChangesInDraftResults!");
					watchForChangesInDraftResults();
					watchForChangesInPlayerArea();
					/*
				} else if (checkTeams().length && hasSentFirstMessage == false){
					checkDraftPicks();*/
				}
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	bodyObserver.observe(target_observe, observerConfig);
}

watchForChangesInBody();
