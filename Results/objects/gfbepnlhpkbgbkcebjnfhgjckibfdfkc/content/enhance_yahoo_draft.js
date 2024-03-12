
var draftRoomLeagueId = location.href.split("/")[5];
var draftRoomTeamId = location.href.split("/")[6].split("?")[0];
var draftRoomSport = window.location.href.indexOf('baseball') > 0 ? 'mlb' :
	window.location.href.indexOf('football') > 0 ? 'nfl':
		window.location.href.indexOf('basketball') > 0 ? 'nba' : '';
		
function insertPlayerIcons(){	
}

var teamArray;

function checkTeams(){
	
	if (teamArray && teamArray.length){
		return teamArray;
	}
	
	teamArray = [];
	var selects = jQuery(".ys-team-change");

	var selectedTab;
	if (selects.length == 0){
		
		var teamsTab = $(".Col2b ul li:nth-child(2) a");
		
		if (teamsTab.length){		
			selectedTab = $(".Col2b ul li.Selected a");
			teamsTab[0].click();
			selects = jQuery(".ys-team-change");
		} else {
			//March 2021: Col2b is no longer a column
			teamsTab = $("ul.NavTabs li:nth-child(2) a");
			if (teamsTab.length){		
				selectedTab = $("ul.NavTabs li.Selected a");
				teamsTab[0].click();
				selects = jQuery(".ys-team-change");
			} else {
				console.log("Cannot find Teams tab");
			}
		}
	}
	
	if (selects.length){
		for (var i=0; i<selects[0].options.length; i++){
			teamArray.push({
				id: selects[0].options[i].value,
				name: selects[0].options[i].text
			})
		}
	}
	
	if (selectedTab && selectedTab[0]){
		selectedTab[0].click();
	}
	
	return teamArray;
}

function getSelectedPlayerId(){
	var yahooId = jQuery("#ys-auction-draft-controls").find(".ys-player").attr("data-id");
	if (yahooId && PLAYER_CACHE.yahoo[yahooId]){
		return PLAYER_CACHE.yahoo[yahooId];
	}
	return -1;
}

function isAuctionRoom(){
	return jQuery("#ys-auction-draft-controls").length > 0;
}


var nominatedPlayerId = -1;

function checkSelectedPlayer(){
	var selectedPlayerId = getSelectedPlayerId();
	if (selectedPlayerId != nominatedPlayerId){
		nominatedPlayerId = selectedPlayerId;
		checkDraftPicks();
	}
	
}

function checkDraftPicks(){	
	
// to get current pick on the clock:
//	console.log("Change: " + $(".ys-order-current .ys-pick-number").html());
	
	var selectedTab;
	if (jQuery("#results-by-round").length == 0){

		var resultsTab = $(".Col2b ul li:nth-child(3) a");
		
		if (resultsTab.length){		
			selectedTab = $(".Col2b ul li.Selected a");
			resultsTab[0].click();
		} else {
			//March 2021: Col2b is no longer a column
			resultsTab = $("ul.NavTabs li:nth-child(3) a");
			if (resultsTab.length){	
				selectedTab = $("ul.NavTabs li.Selected a");
				resultsTab[0].click();
			} else {
				console.log("Cannot find Results tab");
			}
		}
	}
	
	var count = 0;
	var pickLog = [];
	var teamNameLog = [];
	var teamIdLog = [];
	var bidLog = [];
	var keepersLog = [];
	
	var rows = jQuery("#results-by-round tr");
	for (var i = rows.length - 1; i >= 0; i--){

		var yahooId = jQuery(rows.get(i)).find(".ys-player").attr("data-id");
		if (yahooId){
			var fpId = -1;
    		if (PLAYER_CACHE.yahoo[yahooId]){
    			fpId = PLAYER_CACHE.yahoo[yahooId];
    		} else {
    			console.log("Unknown Yahoo id: " + yahooId);
    			console.log(jQuery(rows.get(i)).find(".ys-player").html());
    		}
    		
    		var teamCell = jQuery(rows.get(i)).find(".ys-team");
    		var teamName = teamCell.html();
    		if (teamName.indexOf("> ") > 0){
    			teamName = teamName.substring(teamName.indexOf("> ") + 2);
    		}
			
			if (isAuctionRoom()){
				var bid = 0;
				var c = teamCell.next().next();
				if (c && c.html()&& c.html().length > 1 && c.html()[0] == '$'){
					bid = Number(c.html().substring(1));
				}
				bidLog.push(bid);
			} else { // account for keepers
	    		var overall = Number(jQuery(rows.get(i)).find("td").html());    	
	    		while (pickLog.length + 1 < overall){
	    			pickLog.push(-1);
	    		}   		
	    		while (teamNameLog.length + 1 < overall){
	    			teamNameLog.push("");
	    		}  		
	    		while (keepersLog.length + 1 < overall){
	    			keepersLog.push(false);
	    		}
			}

    		pickLog.push(fpId);
			teamNameLog.push(teamName);
			
			if (jQuery(rows.get(i)).find(".ys-keeper").length){
				keepersLog.push(true);
			} else {
				keepersLog.push(false);
			}
		}
	}	
	
	if (selectedTab && selectedTab[0]){
		selectedTab[0].click();
	}
	
	var teams = [];
	if (teamNameLog.length > 0){

		teams = checkTeams();
		var teamMap = {};
		for (var i=0; i<teams.length; i++){
			teamMap[teams[i].name] = teams[i].id;
		}
		
		for (var k=0; k<teamNameLog.length; k++){
			teamIdLog.push(teamMap[teamNameLog[k]] || 0);
		}
	}	
	
	var message = {
	  pickLog: pickLog,
	  teamIds: teamIdLog,
//	  teamNames: teamNameLog, this puts the node server over the request size limit (HTTP error 413)
	  teams: teams,
	  keepers: keepersLog
	};
	
	if (isAuctionRoom()){
		message.bidLog = bidLog;		
		message.nominee = getSelectedPlayerId();
	}
	
	//add 500ms delay to make sure the clock is updated before we send the event...
	setTimeout(function(){	
		message.userIsOnTheClock = userIsOnTheClock();
		message.teamOnTheClock = teamOnTheClock();
		message.completed = draftIsCompleted();
		message.clockSeconds = getClockSeconds();
		sendMessageToAssistant(message);	
	}, 500);
	
}

function getClockSeconds(){	
	var time = jQuery(".ys-time").html() || jQuery(".ys-auction-clock").html();
	if (time && time.indexOf(":") != -1){
		var seconds = 60 * Number(time.split(":")[0]) + 
			Number(time.split(":")[1]);
		return seconds
	}
	return -1;
}

function userIsOnTheClock(){
	if (jQuery(".ys-urgent-notification").html() && 
			jQuery(".ys-urgent-notification").html().indexOf("your turn to draft") != -1){
		return true;
	}
	return jQuery(".ys-your-turn").length > 0;
}

function teamOnTheClock(){
	return jQuery(".ys-order-current").find("div").find("div").last().html();
}

function draftIsCompleted(){
	var h3 = jQuery(".ys-notification").html();
	if (h3 && h3.indexOf("Draft Complete") != -1){
		$(".sync-status-container").hide()
		$(".sync-status").hide();
		return true;
	}
	return false;
}

var hasSentFirstMessage = false;
var hasFoundAssistant = false;

function sendMessageToAssistant(message){
			
	message.cmd = 'sendSync';
	message.sport = draftRoomSport;
	message.type = "Y"; //Yahoo
	message.leagueId = draftRoomLeagueId;
	message.teamId = draftRoomTeamId;

	if (false){ //Yahoo is now also blocking our AJAX calls
		// has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
		jQuery.ajax({
		  type: "POST",
		  url: "https://draftsync.fantasypros.com/ping", //"http://localhost:3004/ping",
		  data: message,
		  error: function(request, textStatus, errorThrown){
			  console.log(textStatus);
			  //websocket request may have failed. July 2020: getting a parseerror even though socket is correctlys ent and received
			  chrome.runtime.sendMessage(message, function(res){});
			  checkAssistant()
		  },
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

	  if (hasFoundAssistant == false){
		  if (jQuery(".sync-status").length == 0){

			  var dwURL = "https://draftwizard.fantasypros.com/assistant/?source=yahoo_draft";
		//Could not find a way to detect whether the yahooo draft room is for a mock or real draft
		//	  if (title && title.indexOf(" Mock") != -1){
		//		  dwURL = "https://draftwizard.fantasypros.com/assistant/startYahooMock.jsp?";
		//	  }
			  dwURL += "&sport=" + draftRoomSport;
			  dwURL += "&leagueId=" +  draftRoomLeagueId;
			  dwURL += "&teamId=" +  draftRoomTeamId;
			  
			  var statusContainer = jQuery("<div class='sync-status-container'>" +
					  "<a href='javascript:void(0);' onclick='this.parentNode.parentNode.removeChild(this.parentNode)' class='close' title='Hide Label'>X</a>" +
					  "<a class='sync-status sync-searching' target='_blank' href='" + dwURL + "'>Launch FP Draft Assistant...</a>" +
					  "</div>");
			  
			  if (jQuery(".Col1b").length){
				  statusContainer.prependTo(jQuery(".Col1b"))
			  } else if (jQuery("#countdown").length){
				  //March 2021: Col1b is no longer a column
				  statusContainer.prependTo(jQuery("#countdown").parent().next());
			  } else if (jQuery("#ys-auction-draft-controls").length){
				  statusContainer.prependTo(jQuery("#ys-auction-draft-controls").parent().next());
			  } else {
				  console.log("Cannot find left column");
			  }
		  }
		  var message2 = {};
		  message2.cmd = 'checkAssistant';
		  message2.sport = draftRoomSport;
		  message2.type = "Y"; //Yahoo
		  message2.leagueId = draftRoomLeagueId;
		  message2.teamId = draftRoomTeamId;	
		  chrome.runtime.sendMessage(message2, function(res){});
	  }
}


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
		$('#draft > div').each(function () { 
			if ($(this).css('right') == '0px'){
				$(this).css('right', '405px');
			} else if ($(this).css('inset') && $(this).css('inset').split(" ").length == 4 && $(this).css('inset').split(" ")[1] == '240px'){
				$(this).css('inset', $(this).css('inset').replace(/240px/g, '645px'));
			}
		});
	} else {
		$('#draft > div').each(function () { 
			if ($(this).css('right') == '405px'){
				$(this).css('right', '0px');
			} else if ($(this).css('inset') && $(this).css('inset').split(" ").length == 4 && $(this).css('inset').split(" ")[1] == '645px'){
				$(this).css('inset', $(this).css('inset').replace(/645px/g, '240px'));
			}
			
		});
	}
}

function makeDraftPick(sport, fpId, attemptCount){
	
	var bFound = false;	
	
	jQuery("#player-listing").find("tr.ys-player").each(function(index){
		var yahooId = jQuery(this).attr("data-id");
		if (PLAYER_CACHE.yahoo[yahooId] == fpId && !bFound){
			jQuery(this).click();
			bFound = true;
		}
	});
	
	if (bFound){
		setTimeout(function(){	
			var btn = jQuery("#player-details").find("button.ys-draft-player");
			if (btn.html() && btn.html().indexOf("Draft") != -1){
				btn.click();
			}
		}, 100);

		if ($("#position-filter").val() != "pos_type=All"){
			var select = jQuery("#position-filter").get(0);
			var nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
			if (select && nativeSelectValueSetter){
				nativeSelectValueSetter.call(select, "pos_type=All");
				select.dispatchEvent(new Event('change', { bubbles: true}));
			}
		}
		
	} else if (attemptCount == 1){	
		var playersTab = $(".Col2b ul li:nth-child(1) a");
			
		if (playersTab.length == 0){
			//March 2021: Col2b is no longer a column
			playersTab = $("ul.NavTabs li:nth-child(1) a");
		}

		if (playersTab.length > 0){
			playersTab[0].click();
		} else {
			console.log("Cannot find Players tab");
		}
		
		if ($("#position-filter").val() != "pos_type=All"){
			var select = jQuery("#position-filter").get(0);
			var nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
			if (select && nativeSelectValueSetter){
				nativeSelectValueSetter.call(select, "pos_type=All");
				select.dispatchEvent(new Event('change', { bubbles: true}));
			}
		}
		
		$("#ys-search-cancel").click();		
		
		setTimeout(function(){	
			makeDraftPick(draftRoomSport, fpId, 2);
		}, 100);
		
	} else if (attemptCount == 2){
		
		var selectValue;
		if (PLAYER_CACHE.players[fpId].p == "QB" || PLAYER_CACHE.players[fpId].p == "WR" || PLAYER_CACHE.players[fpId].p == "RB" || PLAYER_CACHE.players[fpId].p == "TE"){
			selectValue = "pos=" + PLAYER_CACHE.players[fpId].p;
		} else if (PLAYER_CACHE.players[fpId].p == "DST"){
			selectValue = "pos=DEF";
		} else if (PLAYER_CACHE.players[fpId].p == "K"){
			selectValue = "pos=K";
		}

		if (selectValue && $("#position-filter").val() != selectValue){
			var select = jQuery("#position-filter").get(0);
			var nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
			if (select && nativeSelectValueSetter){
				nativeSelectValueSetter.call(select, selectValue);
				select.dispatchEvent(new Event('change', { bubbles: true}));
			}
		}
		
		setTimeout(function(){	
			makeDraftPick(draftRoomSport, fpId, 3);
		}, 100);
		
	} else if (attemptCount == 3){
		alert("Unable to draft player. Please make this selection manually.");

		if ($("#position-filter").val() != "pos_type=All"){
			var select = jQuery("#position-filter").get(0);
			var nativeSelectValueSetter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set;
			if (select && nativeSelectValueSetter){
				nativeSelectValueSetter.call(select, "pos_type=All");
				select.dispatchEvent(new Event('change', { bubbles: true}));
			}
		}
	}
	
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.cmd == 'foundAssistant' || msg.cmd == 'requestSync' || msg.cmd == 'makeDraftPick') {
    	
    	if (draftRoomSport == msg.sport && "Y" == msg.type && draftRoomLeagueId == msg.leagueId){
        	
        	if (draftRoomTeamId != msg.teamId){
        		// this happened during an FP Insiders draft in 2019 where the team ids did not match between the Yahoo league page and the Yahoo Draft Room
        		console.log("Changing draftRoomTeamId from " + draftRoomTeamId +  " to " + msg.teamId);
        		draftRoomTeamId = msg.teamId;
        	}
    		
    		if (msg.cmd == 'makeDraftPick'){
    			makeDraftPick(draftRoomSport, msg.fpId, 1);
        		return;
        	}
    		// temporarily remove that label because of overlap
    		jQuery(".sync-status-container").hide();    		
     //   	jQuery(".sync-status").html("Synced with Draft Assistant");
     //   	jQuery(".sync-status").removeClass("sync-searching");
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
        		$("body").append("<div class='side-assistant side-assistant-yahoo'>" +
        			"<div class='side-assistant-header'>" +
        			"<img src='https://cdn.fantasypros.com/assets/images/logos/dw-logo.svg' class='side-assistant-header-logo' alt='FantasyPros.com'>"+
        			"<a href='javascript:void(0)' class='side-assistant-header-close' id='hide-assistant-link' title='Hide FantasyPros Assistant'>X</a>" + 
        			"</div><iframe id='sideAssistantFrame' src='" + sideUrl + "'/></div>");
        		$("body").append("<a href='javascript:void(0)' class='side-assistant-btn side-assistant-btn-yahoo' id='show-assistant-link' title='Show FantasyPros Assistant'></a>");
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
    		}
    	}
    	
    }    
    sendResponse('ok');
});

var bodyObserver, pickObserver, selectionObserver, listObserver;

function watchForPickChanges() {
	var target_observe = target_observe = $("#countdown .Ta-start").get(0);
	
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

function watchForAuctionsChanges(){
	var target_observe = document.querySelector(".Col1a");
	if (!target_observe){
		//March 2021: Col1a is no longer a column
		target_observe = document.getElementById("ys-auction-draft-controls");
	}
	
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

var hasFoundPickObserver = false;

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
				if (jQuery(".Col1a").length || jQuery("#ys-auction-draft-controls").length){
					hasFoundPickObserver = true;
					checkDraftPicks();
					watchForAuctionsChanges();	
				}
			} else if (jQuery("#countdown .Ta-start").length){
				hasFoundPickObserver = true;
				checkDraftPicks();
				watchForPickChanges();		
			}
			if (draftIsCompleted()){
				checkDraftPicks(); 
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

watchForChangesInBody();


