var draftRoomSport = "nfl";
var draftId;
var draftRoomTeamId = -1;
var hasSentFirstMessage = false;
var hasFoundAssistant = false;
var previousPickCount = -1;
var nominatedPlayerId = 0;
var previouslySelectedFilter;
var bodyObserver, pickObserver, selectionObserver;
var hasFoundPickObserver = false;		
		
function isDraftRoom(){
	return window.location.href.lastIndexOf("/draft/nfl/") != -1;
}
		
function checkDraftRoom(){
	hasSentFirstMessage = false;
	hasFoundAssistant = false;
	previousPickCount = -1;
	nominatedPlayerId = 0;
	previouslySelectedFilter = undefined;
	bodyObserver = undefined;
	pickObserver = undefined;
	selectionObserver = undefined;
	listObserver = undefined;
	hasFoundPickObserver = false;		

	if (isDraftRoom()){		
		var idx1 = window.location.href.lastIndexOf("/");
		var idx2 = window.location.href.indexOf("?");
		if (idx1 > 0 && idx2 > idx1){
			draftId = window.location.href.substring(idx1 + 1, idx2);
		} else if (idx1 > 0){
			draftId = window.location.href.substring(idx1 + 1);	
		}
		
		chrome.runtime.sendMessage({
			cmd : 'ckeckSleeperMock', 
			draftId: draftId
		}, function(result){
			if (result == 'real'){
				watchForChangesInBody();
			}
		});
		
	} else {
		// console.log("not a football draft room...");
	}
}

function sendMessageToAssistant(message){
			
	message.cmd = 'sendSync';
	message.sport = draftRoomSport;
	message.type = "S"; 
	message.leagueId = draftId;
	message.teamId = draftRoomTeamId;

	chrome.runtime.sendMessage(message, function(res){
		checkAssistant();
	});
	
}

function checkAssistant(){
	  hasSentFirstMessage = true;

	  if (hasFoundAssistant == false){
		  if (jQuery(".sync-status").length == 0){

			  var dwURL = "https://draftwizard.fantasypros.com/assistant/?source=sleeper_draft";
			  dwURL += "&sport=" + draftRoomSport;
			  dwURL += "&leagueId=" +  draftId;
			  dwURL += "&teamId=" +  draftRoomTeamId;
			  
			  var statusContainer = jQuery("<div class='sync-status-container sync-status-container-sleeper'>" +
					  "<a href='javascript:void(0);' onclick='this.parentNode.parentNode.removeChild(this.parentNode)' class='close' title='Hide Label'>X</a>" +
					  "<a class='sync-status sync-searching' target='_blank' href='" + dwURL + "'>Launch FP Draft Assistant...</a>" +
					  "</div>");
			  
			statusContainer.prependTo(jQuery(".draft-header .middle"));
		  }
		  var message2 = {};
		  message2.cmd = 'checkAssistant';
		  message2.sport = draftRoomSport;
		  message2.type = "S"; 
		  message2.leagueId = draftId;
		  message2.teamId = draftRoomTeamId;	
		  chrome.runtime.sendMessage(message2, function(res){});
	  }
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.cmd == 'foundAssistant' || msg.cmd == 'requestSync' || msg.cmd == 'makeDraftPick') {
    	
    	if (draftRoomSport == msg.sport && "S" == msg.type && draftId == msg.leagueId){
  		
    		if (msg.cmd == 'makeDraftPick'){
    			makeDraftPick(draftRoomSport, msg.fpId, 1);
        		return;
        	}
    		jQuery(".sync-status-container").hide();    	
        	hasFoundAssistant = true;
        	
        	if (msg.cmd == 'requestSync'){
        		checkDraftPicks(true);
        	} 

    		if ($(".side-assistant").length == 0 && msg.assistantUrl  && msg.assistantUrl.indexOf("/d/") != -1){	
				addSideAssistant(msg);
    		}
    	}
    	
    } else if (msg.cmd == 'checkDraftRoom'){
		checkDraftRoom();
	}
    sendResponse('ok');
});
	

function hideSideAssistant(){
	$("body").addClass("body-with-side-assistant-hidden");
	checkDockedAssistant();
}
function showSideAssistant(){
	$("body").removeClass("body-with-side-assistant-hidden");
	checkDockedAssistant();
}

function toggleSideAssistant(){
	$("body").toggleClass("body-with-side-assistant-hidden");
	checkDockedAssistant();
}

function checkDockedAssistant(){
	if($(window).width() >= 1630){
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
			$( ".side-assistant" ).draggable("disable");
			$( ".side-assistant" ).resizable("disable");
		}
	} else if ($( ".side-assistant").hasClass("side-assistant-docked")){
		$( ".side-assistant").removeClass("side-assistant-docked");
		$( ".side-assistant" ).
			css("right", "auto").
			css("left", "calc(100% - 420px)").
			css("top", "100px").
			css("bottom", "auto").
			css("height", "654px").
			css("width", "400px");
		$( ".side-assistant" ).draggable("enable");	
		$( ".side-assistant" ).resizable("enable");		
	}
	
	if ($( ".side-assistant").hasClass("side-assistant-docked") && $("body").hasClass("body-with-side-assistant-hidden") == false){
		$(".draft-header").css("width","calc(100% - 405px)");
		$(".draft-board").css("width","calc(100% - 405px)");
		$(".draft-board").find(".column-container").css("width","100%");
		
		$(".bottom-container").css("width","calc(100% - 405px)");
		$(".bottom-panel-wrapper").css("width","100%");
	} else {	
		$(".draft-header").css("width","100vw");
		$(".draft-board").css("width","100vw");
		$(".draft-board").find(".column-container").css("width","96vw");
		
		$(".bottom-container").css("width","100vw");
		$(".bottom-panel-wrapper").css("width","100vw");
	}
}

function addSideAssistant(msg){

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
		$("body").append("<div class='side-assistant side-assistant-sleeper'>" +
			"<div class='side-assistant-header'>" +
			"<div class='side-assistant-header-logo-div'></div>"+
			"<a href='javascript:void(0)' class='side-assistant-header-close' id='hide-assistant-link' title='Hide FantasyPros Assistant'>X</a>" + 
			"</div><iframe id='sideAssistantFrame' src='" + sideUrl + "'/></div>");
		$("body").append("<a href='javascript:void(0)' class='side-assistant-btn side-assistant-btn-sleeper' id='show-assistant-link' title='Show FantasyPros Assistant'></a>");
		$("#hide-assistant-link").click(hideSideAssistant);
		$("#show-assistant-link").click(showSideAssistant);

		$(".side-assistant").draggable({cursor: 'move',containment: "parent"});
		$(".side-assistant").resizable({minWidth: 400}); 
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
		
//		console.log("***************** at launch ");
//		console.log($("#sideAssistantFrame").parent().html());
//		console.log($("#sideAssistantFrame").attr("src"));
		setTimeout(function(){
			if ($("#sideAssistantFrame").attr("src") == '//javascript:;'){
//				console.log("side assistant iframe did not launch correctly");
    			$("<h5 style='text-align:center;padding:50px'>We are unable to display suggestions in the Sleeper draft room. This extension is not compatible with your version of Chrome" + getChromeVersion() + 
    					"<br/><br/>Please use the main Draft Assistant w/ Sync</h5>").insertBefore($("#sideAssistantFrame"));
    			hideSideAssistant();
			}

		}, 100);
	}
}

function checkDraftPicks(forceSync){	
	
	var pickMatrix = [];
	var teamMatrix = [];
	var bidLog = [];
	var isAuction = isAuctionRoom();
	$(".draft-board").find(".cell").each(function(index){	
		var cell = $(this);
		var name = cell.find(".player-name").html();
		var position = cell.find(".position").html();
		var image = cell.find(".avatar-player").attr("src");
		var pick = cell.find(".pick").html();
		if (!name){
			return;
		}
		var fpId = 0;
		if (position && position.indexOf("DEF - ") == 0){
			fpId = getDefenseId(position.substring("DEF - ".length).toLowerCase());
		} else if (image && image.lastIndexOf("player_default") != -1){
			//TODO: needs to match player without picture (rookie) based on ""initial + last name""
		} else if (image && image.lastIndexOf("/") != -1 && image.lastIndexOf(".jpg") != -1){
			var sleeperId = Number(image.substring(image.lastIndexOf("/")+1).split(".jpg")[0]);
			fpId = PLAYER_CACHE.sleeper[sleeperId];
			if (sleeperId && !fpId && forceSync){
				console.debug("unknown sleeper id at " + pick + ": #" + sleeperId + " " + name + " " + position);
			}
		} else if (forceSync){
			console.debug("Could not find sleeper id at " + pick + ": " + name + " img: " + image);
		}
		if (isAuction && pick && pick.indexOf("$") != -1){
			var cost = Number(pick.split("$")[1]);
			bidLog.push(cost);
			if (pickMatrix.length == 0){
				pickMatrix.push([]);
				teamMatrix.push([]);
			}
			pickMatrix[0].push(fpId);
			//TODO: get team name from h1.header-text
			teamMatrix[0].push("");
			
		} else if (pick && pick.indexOf(".") != -1){
			var round = Number(pick.split(".")[0]);
			var pickInRound = Number(pick.split(".")[1]);
			while (pickMatrix.length < round){
				pickMatrix.push([]);
				teamMatrix.push([]);
			}
			while (pickMatrix[round-1].length < pickInRound){
				pickMatrix[round-1].push(undefined);
				teamMatrix[round-1].push(0);
			}
			pickMatrix[round-1][pickInRound-1] = fpId;
			
			//TODO: get team name from h1.header-text
			teamMatrix[round-1][pickInRound-1] = "";
		}
	});
	var pickLog = [];
	var teamIdLog = [];
	for (var i=0; i<pickMatrix.length; i++){		
		for (var j=0; j<pickMatrix[i].length; j++){
			pickLog.push(pickMatrix[i][j]);
		}
	}	
	
	if (forceSync == false && previousPickCount == pickLog.length){
		//no new picks, no need to message the assistants
		return;
	}
	
	previousPickCount = pickLog.length
	
	var message = {
	  pickLog: pickLog,
	  teamIds: teamIdLog
	};
	
	message.teamIndexTheClock = teamIndexTheClock();
	message.completed = draftIsCompleted();
	message.clockSeconds = getClockSeconds();
	
	if (isAuctionRoom()){
		message.bidLog = bidLog;		
		message.nominee = getSelectedPlayerId();
	}
		
	sendMessageToAssistant(message);	
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

function draftIsCompleted(){
	if(isAuctionRoom()){
		return (jQuery(".auction-tab-container").length == 0);
	}
	var draftIsCompleted = $(".cell").length > 0;
	$(".cell").each(function(){
		if ($(this).find(".pick").html() && !$(this).find(".player").length){
			draftIsCompleted = false;
		}
	});
	return draftIsCompleted;
}

function getClockSeconds(){
	var time = $(".current-pick .timer-text").html();
	if (time && time.split(":").length == 2){
		var seconds = 60 * Number(time.split(":")[0]) + 
			Number(time.split(":")[1]);
		return seconds
	} else if (time && time.split(":").length == 3){
		var seconds = 3600 * Number(time.split(":")[0]) + 
			60 * Number(time.split(":")[1]) + 
			Number(time.split(":")[2]);
		return seconds
	}
	return 0;
}

function teamIndexTheClock(){
	return $(".current-pick").parents(".team-column").index();
}

function isAuctionRoom(){
	return $(".auction-user-budget-text").length > 0;
}

function checkSelectedPlayer(){
	var selectedPlayerId = getSelectedPlayerId();
	if (selectedPlayerId != nominatedPlayerId){
		nominatedPlayerId = selectedPlayerId;
		checkDraftPicks(true);
	}
	
}

function getSelectedPlayerId(){
	var infos = jQuery(".auction-tab-container .left-component .playerInfoText");
	var position, team;
	if (infos.length > 1){
		position = infos.get(0).innerHTML;
		team = infos.get(1).innerHTML; // " - CAR (13)"
		if (team.indexOf(" - ") != -1){
			team = team.split(" - ")[1];
		}
		team = team.split(" ")[0];
	} 
	var image = jQuery(".auction-tab-container .avatar-player").attr('src');
	var fpId = 0;
	if (position == "DEF"){
		fpId = getDefenseId(team.toLowerCase());
	} else if (image && image.lastIndexOf("player_default") != -1){
		//TODO: needs to match player without picture (rookie) based on ""initial + last name""
	} else if (image && image.lastIndexOf("undefined") != -1){
		//waiting for nomination
	} else if (image && image.lastIndexOf("/") != -1 && image.lastIndexOf(".jpg") != -1){
		var sleeperId = Number(image.substring(image.lastIndexOf("/")+1).split(".jpg")[0]);
		fpId = PLAYER_CACHE.sleeper[sleeperId];
	}
	return fpId;
}

function makeDraftPick(sport, fpId, attemptCount){
	
	if (attemptCount == 1){
		previouslySelectedFilter = undefined;
	}
	
	if (!PLAYER_CACHE.players[fpId]){		
		alert("Unable to draft player. Please make this selection manually.");
		return;
	}
	
	var bFound = false;
	$(".player-rank-list .name-wrapper").each(function(){
		if (bFound){
			return;
		}
		var playerId = findPlayerID($(this));
		if (fpId == playerId){
			bFound = true;
			var button = $(this).parents(".player-rank-item2").find(".draft-button");
			if (!button.length){
				alert("Cannot find Draft button");
				return;
			} else if (button.hasClass("disable")){
				alert("You are not on the clock!");
				return;
			}
			button.click();
		}
	});
	
	if (!bFound && attemptCount == 1){
		previouslySelectedFilter =  $(".roster-requirement-status2 .filter-item.selected");
		
		var foundFilter = false;
		$(".roster-requirement-status2 .filter-item").each(function(){
			if (foundFilter){
				return;
			}
			var pos = $(this).find(".name").html();
			if (pos == "DEF"){
				pos = "DST";
			}
			if (pos == PLAYER_CACHE.players[fpId].p){
				$(this).click();
				foundFilter = true;
			}
		});
		if (!foundFilter){
			// select ALL
			$(".roster-requirement-status2 .filter-item").first().click();
		}		
		
		//search by full name
		searchPlayer(PLAYER_CACHE.players[fpId].full);
		
		setTimeout(function(){
			makeDraftPick(sport, fpId, 2);
		}, 250);
		return;
	}
	
	if (!bFound && attemptCount == 2){		
		searchPlayer(PLAYER_CACHE.players[fpId].ln);
		
		//search by last name only
		setTimeout(function(){
			makeDraftPick(sport, fpId, 3);
		}, 250);
		return;
	}
	
	
	if (bFound){
		searchPlayer("");
		if (previouslySelectedFilter){
			previouslySelectedFilter.click();
		}
	} else {	
		alert("Unable to draft player. Please make this selection manually.");
	}
	
}

function searchPlayer(str){	
	var input = $(".player-search input").get(0);	
	if (input){		
		var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;	
		nativeInputValueSetter.call(input, str);
		input.dispatchEvent(new Event('input', { bubbles: true}));
	} else {
		console.log("Cannot find player search");
	}	
}

function findPlayerID(playerNameDiv){
	var playername = playerNameDiv.html().split("<div")[0];
	var playerpos = playerNameDiv.find(".position").html();
	var idx1 = playerpos.indexOf("</div>");
	var idx2 = playerpos.indexOf("<span");
	if (idx1 != -1 && idx1 < idx2){
		playerpos = playerpos.substring(idx1+"</div>".length,idx2);
	}
	var playerteam = playerNameDiv.find(".team").html();
	var array = PLAYER_CACHE.names[playername.toLowerCase()];
	if (!array){
		//not found
	} else if (array.length == 1){
		return array[0].fp;
	} else {
		var guess = guessPlayerInArray(array, playername, playerpos, playerteam);
		if (guess && guess.fp){
	//		console.debug("fpId=" + guess.fp + " guessed for " + playername + " (" + playerpos + "-" + playerteam + ")");		
			return guess.fp;				
		} else {
			console.debug(array.length + " POSSIBLE CHOICES FOR: " + playername + " (" + playerpos + "-" + playerteam + ")");
			console.debug(array);	
		}
	}
}
function guessPlayerInArray(array, playername, playerpos, playerteam){
	for (var i=0; i<array.length; i++){
		if (array[i].t.toLowerCase() == playerteam.toLowerCase()){
			return array[i];
		}
	}
	for (var i=0; i<array.length; i++){
		if (array[i].p.toLowerCase() == playerpos.toLowerCase()){
			return array[i];
		}
	}
}

function watchForDraftBoardChanges() {
	var target_observe = target_observe = $(".draft-board").get(0);
	
	if (!target_observe){
		return;
	}

    if (!pickObserver){
    	pickObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else {
				checkDraftPicks(false);
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

function watchForAuctionsChanges(){
				
	var target_observe = document.querySelector(".auction-tab-container");
	
	if (!target_observe){
		return;
	}
	
    if (!selectionObserver){
    	selectionObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else if (isAuctionRoom()){
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
			if (mutations.length == 0 || hasFoundPickObserver) {
				// do nothing
			} else if (isAuctionRoom()){
				if (jQuery(".auction-tab-container .avatar-player").length){
					hasFoundPickObserver = true;
					checkDraftPicks(true);
					watchForAuctionsChanges();	
				}
			} else if (jQuery(".draft-board").length){
				hasFoundPickObserver = true;
				checkDraftPicks(true);
				watchForDraftBoardChanges();		
			}
			if (draftIsCompleted()){
				checkDraftPicks(true); 
				this.disconnect(); 
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

checkDraftRoom();
