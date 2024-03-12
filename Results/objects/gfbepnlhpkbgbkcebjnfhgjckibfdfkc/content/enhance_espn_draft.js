var hasSentFirstMessage = false;
var hasFoundAssistant = false;

var checkCompletedInterval = setInterval(function(){ 
	//check every 10 seconds if the draft has completed.
	if (draftIsCompleted()){
	//	console.log("checkCompletedInterval forces sync after draft completion");
		checkDraftPicks();
	}
}, 10000);


var draftRoomSport = window.location.href.indexOf('flb') > 0 || window.location.href.indexOf('baseball') > 0  ? 'mlb' :
	window.location.href.indexOf('ffl') > 0 || window.location.href.indexOf('football') > 0  ? 'nfl':
		window.location.href.indexOf('fba') > 0 || window.location.href.indexOf('basketball') > 0 ? 'nba' : '';
		
function guessPlayerInArray(array, playername, playerpos, playerteam){
	for (var i=0; i<array.length; i++){
		if (array[i].t.toLowerCase() == playerteam.toLowerCase() && array[i].p.toLowerCase() == playerpos.toLowerCase()){
			return array[i];
		}
	}
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
function insertPlayerIcons(){
}


function getDefenseId(playername, playerteam){

	if (playername.toLowerCase().indexOf("cardinals") != -1) {
		return 8000;
	}
	if (playername.toLowerCase().indexOf("falcons") != -1) {
		return 8010;
	}
	if (playername.toLowerCase().indexOf("ravens") != -1) {
		return 8020;
	}
	if (playername.toLowerCase().indexOf("bills") != -1) {
		return 8030;
	}
	if (playername.toLowerCase().indexOf("panthers") != -1) {
		return 8040;
	}
	if (playername.toLowerCase().indexOf("bears") != -1) {
		return 8050;
	}
	if (playername.toLowerCase().indexOf("bengals") != -1) {
		return 8060;
	}
	if (playername.toLowerCase().indexOf("browns") != -1) {
		return 8070;
	}
	if (playername.toLowerCase().indexOf("cowboys") != -1) {
		return 8080;
	}
	if (playername.toLowerCase().indexOf("broncos") != -1) {
		return 8090;
	}
	if (playername.toLowerCase().indexOf("lions") != -1) {
		return 8100;
	}
	if (playername.toLowerCase().indexOf("packers") != -1) {
		return 8110;
	}
	if (playername.toLowerCase().indexOf("texans") != -1) {
		return 8120;
	}
	if (playername.toLowerCase().indexOf("colts") != -1) {
		return 8130;
	}
	if (playername.toLowerCase().indexOf("jaguars") != -1) {
		return 8140;
	}
	if (playername.toLowerCase().indexOf("chiefs") != -1) {
		return 8150;
	}
	if (playername.toLowerCase().indexOf("dolphins") != -1) {
		return 8160;
	}
	if (playername.toLowerCase().indexOf("vikings") != -1) {
		return 8170;
	}
	if (playername.toLowerCase().indexOf("patriots") != -1) {
		return 8180;
	}
	if (playername.toLowerCase().indexOf("saints") != -1) {
		return 8190;
	}
	if (playername.toLowerCase().indexOf("jets") != -1) {
		return 8210;
	}
	if (playername.toLowerCase().indexOf("giants") != -1) {
		return 8200;
	}
	if (playername.toLowerCase().indexOf("raiders") != -1) {
		return 8220;
	}
	if (playername.toLowerCase().indexOf("eagles") != -1) {
		return 8230;
	}
	if (playername.toLowerCase().indexOf("steelers") != -1) {
		return 8240;
	}
	if (playername.toLowerCase().indexOf("chargers") != -1) {
		return 8250;
	}
	if (playername.toLowerCase().indexOf("49ers") != -1) {
		return 8270;
	}
	if (playername.toLowerCase().indexOf("seahawks") != -1) {
		return 8260;
	}
	if (playername.toLowerCase().indexOf("rams") != -1) {
		return 8280;
	}
	if (playername.toLowerCase().indexOf("buccaneers") != -1) {
		return 8290;
	}
	if (playername.toLowerCase().indexOf("titans") != -1) {
		return 8300;
	}
	if (playername.toLowerCase().indexOf("commanders") != -1 || playername.toLowerCase().indexOf("washington") != -1 || playername.toLowerCase().indexOf("football team") != -1) {
		return 8310;
	}	
	return -1;	
}

function findPlayerId(playerDiv, pick){
	
	var playername = playerDiv.find(".playerinfo__playername").html();
	
	if (playerDiv.find(".playerinfo__playername").find(".player-news").length > 0){
		playername = playerDiv.find(".playerinfo__playername").find(".player-news").html();
	}
	
	if (!playername){
		return;
	}
	var suffixes = [" jr.", " sr.", " ii", " iii", " iv", " v"];
	for (var j=0; j<suffixes.length; j++){
		var idx =  playername.toLowerCase().indexOf(suffixes[j]);
		if (idx != -1 && (idx == playername.length - suffixes[j].length)){
			playername = playername.substring(0, idx);
		}
	}
	
	var playerteam = playerDiv.find(".playerinfo__playerteam").html();
	if (playerteam == 'Wsh'){
		playerteam = 'Was';
	}
	var playerpos = playerDiv.find(".playerinfo__playerpos").html();

	if (playername == 'Shohei Ohtani'){
		return 7354;
	}
	
	if (playername.indexOf('D/ST') != -1){
		return getDefenseId(playername, playerteam);
	} else if (PLAYER_CACHE.names[playername.toLowerCase()]){
		var array = PLAYER_CACHE.names[playername.toLowerCase()];
		if (array.length == 1){
		//	console.log(pick + ". fpId=" + array[0].fp);
			return array[0].fp;
		} else {
			var guess = guessPlayerInArray(array, playername, playerpos, playerteam);
			if (guess && guess.fp){
		//		console.debug(pick + ". fpId=" + guess.fp + " guessed for " + playername + " (" + playerpos + "-" + playerteam + ")");		
				return guess.fp;				
			} else {
				console.debug(pick + ". " + array.length + " POSSIBLE CHOICES FOR: " + playername + " (" + playerpos + "-" + playerteam + ")");
				console.debug(array);	
			}
		}
	} else {
		console.debug(pick + ". UNKNOWN PLAYER: " + playername + " (" + playerpos + "-" + playerteam + ")");
	}
	return -1;	
}


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

function checkTeams(){
	var teams = [];
	var selects = jQuery(".draft-column .roster .dropdown__select");
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

	var action = jQuery(".pickArea .bid-player__button").html();
	if (action && action.toLowerCase().indexOf("nominate") != -1){
		return -1; //player is not yet nominated
	}
	var selectedPlayerId = -1;
	jQuery(".pickArea .player-selected__player-info-container").each(function(index){
		var id = findPlayerId(jQuery(this), "selected");
		if (id > 0){
			selectedPlayerId = id;
		}
	});
	return selectedPlayerId;	
}

function isAuctionRoom(){
	var result = false;
	jQuery(".tabs__link").each(function(index){
		if (jQuery(this).html().indexOf("Budgets") != -1){
			result = true;
		}
	});
	return result;
}


var nominatedPlayerId = -1;

function checkSelectedPlayer(){
	if (isAuctionRoom()){
		var selectedPlayerId = getSelectedPlayerId();
		if (selectedPlayerId != nominatedPlayerId){
			checkDraftPicks(); // maybe a player was just sold...
		}
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

var lastTabChange = 0;
var checkDraftPickTimer;

function checkDraftPicks(secondTry){	
		
	if (!secondTry){
		if (checkDraftPickTimer){
		//	console.log("already waiting for checkDraftPicks...");
			return;
		}

		var msSince = new Date().getTime() - lastTabChange;
		var minDelay = hasSentFirstMessage ? 3000 : 10000;
		if (msSince < minDelay){
		//	console.log("Avoid flickering after " + msSince + "ms");

			checkDraftPickTimer = setTimeout(function(){
				checkDraftPickTimer = undefined;
				checkDraftPicks();	
			}, 3000);
			
			return;
		}
		
		var selectedTab = jQuery(".tabs__list__item--active button");		
		if (selectedTab.html() != 'Pick History' && selectedTab.html() != 'Auction Summary' && selectedTab.html() != 'Draft Summary'){
			jQuery(".tabs__list__item:nth-child(2)").find("button").click();
			lastTabChange = new Date().getTime();
			checkDraftPickTimer = setTimeout(function(){
				checkDraftPickTimer = undefined;
				checkDraftPicks(true);	
				selectedTab.click();	
			}, 1000);
	
			return;
		}
	}
	
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
	
	jQuery(".pick-history-tables").each(function(index){
		jQuery(this).find(".player-details").each(function(index){
			count++;
		
			var cell = jQuery(this).parents(".public_fixedDataTableCell_main");	
			var teamName = cell.next().find(".public_fixedDataTableCell_cellContent").html();
			if (cell.next().find(".fw-bold").length > 0){
				teamName = cell.next().find(".fw-bold").html();
			}
			
			var pick = cell.prev().find(".public_fixedDataTableCell_cellContent").html();

			teamNameLog.push(teamName);
			var teamId = teamMap[teamName];
			if (!teamId){
				//the HMTL select will trim some white spaces
				for (var tn in teamMap) {
				    if (teamMap.hasOwnProperty(tn) && teamName){
				    	if (tn.replace(/ /g, '') == teamName.replace(/ /g, '')){
				    		teamId = teamMap[tn];
				    		break;
				    	}
				    }
				}
			}
			teamIdLog.push(teamId);
			pickLog.push(findPlayerId(jQuery(this), pick));
			
			var bid = 0;
			var nextCell = cell;
			while (nextCell.length){
				var c = nextCell.find(".public_fixedDataTableCell_cellContent");
				if (c && c.html().length > 1 && c.html()[0] == '$'){
					bid = Number(c.html().substring(1));
					hasBids = true;
					break;
				}
				nextCell = nextCell.next();
			}
			bidLog.push(bid);			
			
		});
	});

	var missingPicks = 0;
	
	jQuery(".pick-message__container").each(function(){
		
		/*
		<div class="jsx-2093861861 pick__message-content flex items-end">
			<div class="jsx-3743397412 player-headshot self-baseline" style="height: 35px; width: 48px;">
				<img height="35" width="48" alt="" class="jsx-3743397412" src="https://a.espncdn.com/i/headshots/nfl/players/full/3121410.png">
				<img height="35" src="https://a.espncdn.com/combiner/i?img=/games/lm-static/ffl/images/nomug.png&amp;w=96&amp;h=70&amp;cb=1" width="48" alt="" class="jsx-3743397412 fallback">
			</div>
			<div class="jsx-2093861861 pick__message-information self-center clr-gray-04 dib n9">
				<span class="playerinfo__playername">Parris Campbell</span> / <span class="playerinfo__playerteam">Ind</span> 
				<span class="playerinfo__playerpos ttu">WR</span>
				<div class="jsx-2093861861 pick-info clr-gray-05 truncate">R14, P3<span class="jsx-2093861861"> - Team Weinstein</span></div>
			</div>
		</div>
		*/

		var playerName = jQuery(this).find(".playerinfo__playername").html();
		if (playerName){
			var fpId = 0;
			if (playerName.indexOf('D/ST') != -1){
				fpId = getDefenseId(playerName, jQuery(this).find(".playerinfo__playerpos").html());
			} else {
				var imgsrc = jQuery(this).find("img").attr("src");
				if (imgsrc){
					var idx1 = imgsrc.lastIndexOf("/");
					var idx2 = imgsrc.lastIndexOf(".png");
					if (idx1 > 0 && idx2 > idx1){
						var espnId = Number(imgsrc.substring(idx1+1, idx2));
				    	if (espnId && PLAYER_CACHE.espn[espnId]){
							fpId = PLAYER_CACHE.espn[espnId];
						} else {
							console.log("unknown espnId=" + espnId + " for " + playerName);
				    	}
					} else {
						console.log("cannot find player id in " + imgsrc + " for " + playerName);
					}
				}
				if (fpId <= 0){
					// trying to match with name and pos...
					fpId = findPlayerId(jQuery(this), "message");
				}
				
			}

			var teamId = 0;
			var teamName = jQuery(this).find(".pick-info span").html();
			if (teamName){
				if (teamName.indexOf(" - ") == 0){
					teamName = teamName.substring(3);
				}
				var teamId = teamMap[teamName];
				if (!teamId){
					//the HMTL select will trim some white spaces
					for (var tn in teamMap) {
					    if (teamMap.hasOwnProperty(tn) && teamName){
					    	if (tn.replace(/ /g, '') == teamName.replace(/ /g, '')){
					    		teamId = teamMap[tn];
					    		break;
					    	}
					    }
					}
				}
			}
			
			if (fpId <= 0){
				console.log("Invalid player");
				console.log(jQuery(this).html());
				if (missingPicks > 0 && teamId){
					// once a pick is missing all the following ones should be missing too
					// which means any unknown player should be logged as a missing pick
					
					console.log("Inserting EMPTY PICK for " + teamName);
					
					teamNameLog.push(teamName);
					teamIdLog.push(teamId);
					pickLog.push(fpId);
					bidLog.push(bid);
					
					missingPicks++;
				}
			} else {
				var bid = 0;
				
				var pickInfo = jQuery(this).find(".pick-info").html();
				if (pickInfo && pickInfo[0] == '$'){
					var idx3 = pickInfo.indexOf("<span");
					if (idx3 > 0){
						bid = Number(pickInfo.substring(1,idx3));
						hasBids = true;
					}
				}
				
				if ($.inArray(fpId, pickLog)== -1){
					// console.log("MISSING FROM PICK LOG: " + playerName + ", " + jQuery(this).find(".pick-info").html());					
					// R15, P8<span class="jsx-2093861861"> - Team Swett</span>
					teamNameLog.push(teamName);
					teamIdLog.push(teamId);
					pickLog.push(fpId);
					bidLog.push(bid);
					
					missingPicks++;
				}
			}

		} else {
			console.log("Invalid player data");
			console.log(jQuery(this).html());
		}
		
	});
	
	if (missingPicks > 0){
//		console.log("Number of picks missing from pick-history-tables:" + missingPicks);
	}
	
	var message = {
	  pickLog: pickLog,
	  teamIds: teamIdLog,
//	  teamNames: teamNameLog, this puts the node server over the request size limit (HTTP error 413)
	  teams: teams
	};

	message.userIsOnTheClock = userIsOnTheClock();
	message.completed = draftIsCompleted();
	
	if (hasBids){
		message.bidLog = bidLog;		
		message.nominee = getSelectedPlayerId()
	}
	//add 500ms delay to make sure the clock is updated before we send the event...
	setTimeout(function(){
		message.clockSeconds = getClockSeconds();
		sendMessageToAssistant(message);	
	}, 500);
}

function getClockSeconds(){
	var digits = jQuery(".clock__digits .clock__digit");
	if (digits.length >= 4){
		var seconds = 600 * Number(digits.get(0).innerHTML) + 
			60 * Number(digits.get(1).innerHTML) + 
			10 * Number(digits.get(2).innerHTML) + 
			Number(digits.get(3).innerHTML);
		return seconds
	}
	return -1;
}

function userIsOnTheClock(){
	var h3 = jQuery(".pickArea h3").html();
	if (h3 && h3.indexOf("You are on the clock!") != -1){
		return true;
	}
	return false;
}

function draftIsCompleted(){
	var h3 = jQuery(".pickArea h3").html();
	if (h3 && h3.indexOf("Your Draft is Complete") != -1){
		$(".sync-status").hide();
		return true;
	} else {
		var h1 = jQuery("h1.sharing__draft-complete").html();
		if (h1 && h1.indexOf("Your draft is complete") != -1){
			$(".sync-status").hide();
			return true;
		}
	}	
	return false;
}

function sendMessageToAssistant(message){
	message.cmd = 'sendSync';
	message.sport = draftRoomSport;
	message.type = "E"; //ESPN
	message.leagueId = getUrlParameter("leagueId");
	message.teamId = getUrlParameter("teamId");	
	
	if (false){ //ESPN is now blocking our AJAX calls via "Cross-Origin Read Blocking (CORB)" forcing us to use chrome messages.
		jQuery.ajax({
		  type: "POST",
		  url: "https://draftsync.fantasypros.com/ping", //"http://localhost:3004/ping",
		  data: message,
		  success: function(data){
			  hasSentFirstMessage = true;

			  if (hasFoundAssistant == false){
				  var title = jQuery("h1").html();
				  
				  var dwURL = "https://draftwizard.fantasypros.com/assistant/?source=espn_draft";
				  if (title && title.indexOf(" Mock") != -1){
					  dwURL = "https://draftwizard.fantasypros.com/assistant/startEspnMock.jsp?";
				  }
				  dwURL += "&sport=" + draftRoomSport;
				  dwURL += "&leagueId=" +  getUrlParameter("leagueId");
				  dwURL += "&teamId=" +  getUrlParameter("teamId");
				  
				  if (jQuery(".sync-status").length == 0){
					  jQuery("h1").html(title + "<a class='sync-status sync-searching' target='_blank' href='" + dwURL +
						"'>Launch FantasyPros Draft Assistant...</a>");
				  }
				  var message2 = {};
				  message2.cmd = 'checkAssistant';
				  message2.sport = draftRoomSport;
				  message2.type = "E"; //ESPN
				  message2.leagueId = getUrlParameter("leagueId");
				  message2.teamId = getUrlParameter("teamId");	
				  chrome.runtime.sendMessage(message2, function(res){});
			  }
		  }
		});
	} else { //use chrome

		chrome.runtime.sendMessage(message, function(res){

			  hasSentFirstMessage = true;

			  if (hasFoundAssistant == false){
				  var title = jQuery("h1").html();
				  if (false && jQuery(".sync-status").length == 0){
					  jQuery("h1").html(title + "<span class='sync-status sync-searching'>" +
							  "Searching for FP Assistant...</span>");
				  }
				  var message2 = {};
				  message2.cmd = 'checkAssistant';
				  message2.sport = draftRoomSport;
				  message2.type = "E"; //ESPN
				  message2.leagueId = getUrlParameter("leagueId");
				  message2.teamId = getUrlParameter("teamId");	
				  chrome.runtime.sendMessage(message2, function(res){});
			  }
		});
		
	}
	
	if (message.completed && message.pickLog && message.pickLog.length > 0){
		clearInterval(checkCompletedInterval);
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
			$( ".side-assistant" ).draggable("disable");
			$( ".side-assistant" ).resizable("disable");
		}
	} else if ($( ".side-assistant").hasClass("side-assistant-docked")){
		$( ".side-assistant").removeClass("side-assistant-docked");
		$( ".side-assistant" ).
			css("right", "auto").
			css("left", "calc(100% - 420px)").
			css("top", "200px").
			css("bottom", "auto").
			css("height", "654px").
			css("width", "400px");
		$( ".side-assistant" ).draggable("enable");	
		$( ".side-assistant" ).resizable("enable");		
	}
}

function makeDraftPick(sport, fpId){
	
	var found = checkDisplayedPlayers(fpId);	
	
	if (found == false){
	//	console.log("Could not find fpId=" + fpId);

		jQuery(".tabs__list__item:nth-child(1)").find("button").click();
		
		var array = sport == 'mlb' ? MLB_PLAYER_DATA.players :
			sport == 'nba' ? NBA_PLAYER_DATA.players :
				sport == 'nfl' ? NFL_PLAYER_DATA.players : [];
		
		for (var i=0; i<array.length; i++){
			if (array[i].fp == fpId){				
				var input = jQuery(".playersSearch input.form__control").get(0);
				if (input){					
					var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
					
					var fullName = array[i].full;
					if (fullName == "Mohamed Bamba"){
						fullName = "Mo Bamba";
					} else if (fullName == "Washington Football Team"){
						fullName = "Washington D/ST";
					} else if (fullName == "Ronald Jones II"){
						fullName = "Ronald Jones";
					} else if (fullName == "Brian Robinson Jr."){
						fullName = "Brian Robinson";
					}
					
					nativeInputValueSetter.call(input, fullName);
					input.dispatchEvent(new Event('input', { bubbles: true}));
					
					checkSearchResults();
					found = checkDisplayedPlayers(fpId);

					if (found == false){
						console.log("No match with '" + fullName + "'");
						var lastName = array[i].ln;
						
						if (lastName.endsWith(" Jr") || lastName.endsWith(" Sr")){
							lastName = lastName.substring(0, lastName.length - " Jr".length);
						} else if (lastName.endsWith(" Jr.") || lastName.endsWith(" Sr.")){
							lastName = lastName.substring(0, lastName.length - " Jr.".length);
						} else if (lastName.endsWith(" III")){
							lastName = lastName.substring(0, lastName.length - " III".length);
						} else if (lastName.endsWith(" IV")){
							lastName = lastName.substring(0, lastName.length - " IV".length);
						} else if (lastName.endsWith(" V")){
							lastName = lastName.substring(0, lastName.length - " V".length);
						}
						
						//try searching by last name only
						// example "Yulieski Gurriel" on DW and "Yuli Gurriel" on ESPN
						nativeInputValueSetter.call(input, lastName);
						input.dispatchEvent(new Event('input', { bubbles: true}));
						
						checkSearchResults();
						found = checkDisplayedPlayers(fpId);
						
						if (found == false){
							console.log("No match with '" + lastName + "' either");
						}
					}
					
					if (found){
						nativeInputValueSetter.call(input, '');
						input.dispatchEvent(new Event('input', { bubbles: true}));
					} else {
						
						//let's retry after 500ms, maybe the search was slow...
						nativeInputValueSetter.call(input, fullName);
						input.dispatchEvent(new Event('input', { bubbles: true}));

						setTimeout(function(){
							checkSearchResults();
							found = checkDisplayedPlayers(fpId);
							
							if (found){
								nativeInputValueSetter.call(input, '');
								input.dispatchEvent(new Event('input', { bubbles: true}));
							} else {
								console.log("No match with '" + fullName + "' after 500ms");
								alert("Cannot draft player because names do not match: " + fullName);	
							}
						}, 500);
												
					}
				}
				break;
			}
		}
		
	}
}


function checkDisplayedPlayers(fpId){
	var found = false;
	jQuery(".draft-players .player-details").each(function(){
		var pid = findPlayerId(jQuery(this), '');
		if (fpId == pid && found == false){
			var btn = jQuery(this).parents(".public_fixedDataTableCell_main").next().find(".btn");
			if (btn.length == 0){ 
				btn = jQuery(this).parents(".public_fixedDataTableCell_main").next().find(".action-btn");
			}
			if (btn.length){
	//			console.log(btn.html() + " fpId=" + fpId);
				if (btn.hasClass('btn--dequeue') == false && btn.hasClass('Button--dequeue') == false){
					btn.get(0).click();
				}
				found = true;
			}
		}
	});
	return found;
}

function checkSearchResults(){
	var found = false;
	jQuery(".player--search--matches button").each(function(){
		if (found == false){
			var name = jQuery(this).attr("data-player-search-playername");
			this.click();
			found = true;
		}
	});
	return found;
}

/*
function selectPlayerFilters(position, team){
	console.log("SELECT " + position + " and " + team);
	jQuery(".filters select").each(function(){
		if (this.options.length > 1 && this.options[0].text == 'All Pos.'){
		//	console.log(this.options);
			for (var i=0; i<this.options.length; i++){
				console.log(this.options[i].text);
				if (this.options[i].text == position){
					console.log("selecting " + this.options[i].value);
					this.options[i].selected = true;
					
					this.focus();
					this.blur();
					break;
				}
			}
		}
		if (this.options.length > 1 && this.options[0].text == 'All Pos.'){
		//	console.log(this.options);
			for (var i=0; i<this.options.length; i++){
				console.log(this.options[i].text);
				if (this.options[i].text == position){
					console.log("selecting " + this.options[i].value);
					this.options[i].selected = true;
					break;
				}
			}
		}
	});
	 
}
*/
function getChromeVersion () {
    var pieces = navigator.userAgent.match(/Chrom(?:e|ium)\/([0-9]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)/);
    if (pieces == null || pieces.length != 5) {
        return "";
    }
    pieces = pieces.map(piece => parseInt(piece, 10));
    return " (" + pieces[1] + "." + pieces[2] + "." + pieces[3] + "." + pieces[4] + ").";
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.cmd == 'foundAssistant' || msg.cmd == 'requestSync' || msg.cmd == 'makeDraftPick') {
    			
    	if (draftRoomSport == msg.sport && "E" == msg.type &&
    			getUrlParameter("leagueId") == msg.leagueId && getUrlParameter("teamId") == msg.teamId){
    		
    		if (msg.cmd == 'makeDraftPick'){
    			makeDraftPick(draftRoomSport, msg.fpId);
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
        		$("body").append("<div class='side-assistant side-assistant-espn'>" +
        			"<div class='side-assistant-header'>" +
        			"<div class='side-assistant-header-logo-div'></div>"+
        			"<a href='javascript:void(0)' class='side-assistant-header-close' id='hide-assistant-link' title='Hide FantasyPros Assistant'>X</a>" + 
        			"</div><iframe id='sideAssistantFrame' src='" + sideUrl + "'/></div>");
        		$("body").append("<a href='javascript:void(0)' class='side-assistant-btn' id='show-assistant-link' title='Show FantasyPros Assistant'></a>");
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
            			$("<h5 style='text-align:center;padding:50px'>We are unable to display suggestions in the ESPN draft room. This extension is not compatible with your version of Chrome" + getChromeVersion() + 
            					"<br/><br/>Please use the main Draft Assistant w/ Sync</h5>").insertBefore($("#sideAssistantFrame"));
            			hideSideAssistant();
        			}

        		}, 100);
    		}
    	}
    	
    }    
    sendResponse('ok');
});

var bodyObserver, pickObserver, selectionObserver, listObserver;

function watchForChangesInPickModule() {

	var target_observe = document.querySelector(".current-pick-module-container");
	if (!target_observe){
		return;
	}
	
    if (!pickObserver){
    	pickObserver = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else {
	//			console.log("change in .current-pick-module-container");
				checkDraftPicks();
	//			insertPlayerIcons();
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

function watchForChangesInPlayerTable() {
/*
	var target_observe = document.querySelector(".players-table");
	if (!target_observe){
		return;
	}
	
    if (!listObserver){
    	listObserver = new MutationObserver(function(mutations) {
    		console.log("Mutation in players-table!");
			if (mutations.length == 0) {
				// do nothing
			} else {
				insertPlayerIcons();
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	listObserver.observe(target_observe, observerConfig);
*/
}

function watchForChangesInPickArea(){
	
	var target_observe = document.querySelector(".pickArea");
	if (!target_observe){
		return;
	}
	
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
				if (jQuery(".current-pick-module-container").length){
					this.disconnect();
					checkDraftPicks();
		//			console.log("switch to watchForChangesInPickModule!");
					watchForChangesInPickModule();
				} else if (checkTeams().length && hasSentFirstMessage == false){
		//			console.log("still no pick-history-tables...");
					checkDraftPicks();
				}
				
				if (!selectionObserver && jQuery(".pickArea").length){
					checkSelectedPlayer();
					watchForChangesInPickArea();
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
