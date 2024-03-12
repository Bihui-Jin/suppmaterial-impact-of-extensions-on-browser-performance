window.PLAYERCARDS_CONFIG = {'affiliateCode':'fpros_ce','showPodcastIcons':false};

var userDataFilled = false;
var disableDetectOptions = false;

var isSafariExtension = false;


if (window.location.href.indexOf("fantasypros") != -1 || window.location.href.indexOf("localhost") != -1){
	if (!document.getElementById("fpCE_version") && !document.body.getAttribute("contenteditable")){
		var fpCE = document.createElement("div");
		fpCE.id = "fpCE_version";
		fpCE.innerHTML = chrome.runtime.getManifest().version;
		document.body.appendChild(fpCE);
		fpCE.setAttribute("style","display:none");
	}
}


chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (msg.cmd == 'parsePage') {
    	parsePage(msg.sport, msg.leagues);
    } else if (msg.cmd == 'toggleFpPanel' && window.top == window.self){
    	if (typeof isDraftRoom == 'function' && isDraftRoom() == false){
    		toggleFpPanel(); // happens on Sleeper where enhance_sleeper_draft.js is loaded on all pages
		} else if (typeof toggleSideAssistant == 'function'){
    		toggleSideAssistant();
    	} else {
    		toggleFpPanel();
    	}
    }
    sendResponse('ok');
    
    disableDetectOptions = false;
});

function parsePage(sport, leagues){

	if (typeof(playercardGenerator) != "undefined"){
		playercardGenerator.cleanContent();
		if (document.getElementsByClassName("fp-enhanced").length > 0){
    		playercardGenerator.afterrun = undefined;
		} else if (typeof preparePage == 'function' && typeof enhancePage == 'function'){
			preparePage();
    		playercardGenerator.afterrun = enhancePage;
		}
		playercardGenerator.initChrome();
		playercardGenerator.setDefaultSport(sport, leagues);
		playercardGenerator.run();
	} else {
		console.log("playercardGenerator is not defined");
	}
}

if (document.URL.indexOf('fantasypros.com') != -1){
	var tests = ['/accounts/profile/', '/accounts/login/', 'loggedout', 'loggedin', 
		'research-assistant-setup.php', 'player-cards-setup.php', 'refresh=Y', 
		'myplaybook/edit.php', '/myleagues/league-sync/'];
	for (var i=0; i<tests.length; i++){
		if (document.URL.indexOf(tests[i]) != -1){
		    chrome.runtime.sendMessage({'cmd' :'clearCache'}, function(result){  
		    });
			break;
		}
	}
}

var enhancing_started = false;
var enhancing_done = false;
var observer_target_selector;
var observer;

function watchForChanges() {
	if (!observer_target_selector){
		return;
	}

	var target_observe = document.querySelector(observer_target_selector);
	if (!target_observe){
		return;
	}
	
    if (!observer){
		observer = new MutationObserver(function(mutations) {
			if (mutations.length == 0) {
				// do nothing
			} else if (enhancing_started && !enhancing_done) {
				// do nothing
			} else if ($(".fp-enhanced").length > 0) {
				// do nothing
			} else {
				this.disconnect();

				if ($(observer_target_selector + " .fp-icon__link").length == 0) {
					parsePage('nfl');
				} else {
					enhancePage(true);
				}
			}
		});
    }

	var observerConfig = {
	    childList: true,
	    characterData: true,
	    subtree: true
	}
	observer.observe(target_observe, observerConfig);
}

function toggleFpPanel(forceShow){
	var panelContainer = $("#fpExtensionPanelContainer");
	
	if (panelContainer.get(0)){
		if (panelContainer.is(":visible") && !forceShow){
			panelContainer.hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
 		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Toolbar Icon', 'action' : 'Hide Extension Panel'});
		} else {
			panelContainer.show();
			if (userDataFilled == false){
				
				$("#fpPanelMain").show();
				$("#fpPanelSettings").hide();
				fillUserData();
			}
 		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Toolbar Icon', 'action' : 'Show Extension Panel'});
		}
		return;
	}
	createFpPanel().show();
	chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Toolbar Icon', 'action' : 'Show Extension Panel'});
}

function createFpPanel(){
	
	var panelContainer = $("#fpExtensionPanelContainer");
	if (panelContainer.length){
		return panelContainer;
	}

	panelContainer = $("<div id='fpExtensionPanelContainer' style='display:none'></div>");
	panelContainer.appendTo(document.body);
	
	var panel = $("<div id='fpPanelMain' class='fp-extension-panel'></div>");
	panel.appendTo(panelContainer);
	
	var header = $("<div class='fp-extension-header'></div>");
	header.appendTo(panel);
	$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Default&utm_content=FP_Icon'></a>").appendTo(header);
	$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
			"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(header);
	$("<div class='fp-extension-heading'>FantasyPros</div>").appendTo(header);
	$("<div class='fp-extension-sub-heading'>Win your fantasy football league</div>").appendTo(header);

	header.find(".fp-extension-logo").click(function(){
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'FP Icon Click'});
	});
	header.find(".fp-extension-settings").click(function(){
		$("#fpPanelMain").hide();
		$("#fpPanelSettings").show();
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Click Settings'});
	});

	header.find(".fp-extension-close").click(function(){
		$("#fpExtensionPanelContainer").hide();
		chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Hide Extension Panel'});
	});

	var panelBody = $("<div class='fp-extension-body'></div>");
	panelBody.appendTo(panel);	
	$("<div class='fp-extension-section' id='fpArticleSection'></div>").appendTo(panelBody);
	
	var section = $("<div class='fp-extension-section'></div>");
	section.appendTo(panelBody);
	$("<div class='fp-extension-section-heading'>Add Player Cards to Page</div>").appendTo(section);
	var list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);
	var sports = ['nfl', 'mlb', 'nba'];
	for (var i=0; i<sports.length; i++){
		if (i > 0){
			$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
		}
		var item = $("<div class='fp-extension-section-list-item'></div>");
		item.appendTo(list);
		$("<div class='fp-item-icon fp-item-icon-" + sports[i] + "'></div>").appendTo(item);
		$("<div class='fp-item-sport'>" + sports[i].toUpperCase() + "</div>").appendTo(item);
		var link = $("<a class='fp-item-link' href='javascript:void(0)' fp-sport='" + sports[i] + "'>Add</a>");
		link.appendTo(item);
		link.click(function(){
			chrome.runtime.sendMessage({'cmd':'parseAllPages', 'sport':$(this).attr("fp-sport")});	        
	    	$("#fpExtensionPanelContainer").hide();
 		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : ('Add ' + $(this).attr("fp-sport").toUpperCase() + ' Player Cards Click')});
		});
		$("<div style='clear:both'></div>").appendTo(item);
	}

	$("<div class='fp-extension-section' id='fpFavoriteSection' style='display:none'></div>").appendTo(panelBody);
	$("<div class='fp-extension-section' id='fpUpgradeSection' style='display:none'></div>").appendTo(panelBody);
	
	fillUserData();
	
	var panelSettings = $("<div id='fpPanelSettings' class='fp-extension-panel'></div>");
	panelSettings.appendTo(panelContainer);
	panelSettings.hide();
	
	var headerSettings = $("<div class='fp-extension-header'></div>");
	headerSettings.appendTo(panelSettings);
	$("<a href='javascript:void(0)' class='fp-extension-back' title='Back'></a>").appendTo(headerSettings);
	$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerSettings);
	$("<div class='fp-extension-heading'>Settings</div>").appendTo(headerSettings);	
	$("<div class='fp-extension-sub-heading'>Configure your extension</div>").appendTo(headerSettings);
	
	var settingsBody = $("<div class='fp-extension-body'></div>");
	settingsBody.appendTo(panelSettings);
	$("<div class='fp-extension-section' id='fpUserSection'></div>").appendTo(settingsBody);
	$("<div class='fp-extension-section' id='fpAdviceSection'></div>").appendTo(settingsBody);
	$("<div class='fp-extension-section' id='fpPreferenceSection'></div>").appendTo(settingsBody);
	$("<div class='fp-extension-section' id='fpLeaguesSection'></div>").appendTo(settingsBody);
	
	headerSettings.find(".fp-extension-back").click(function(){
		if ($(".fp-extension-premium-advice").get(0)){
			$(".fp-extension-premium-advice").show();
			$("#fpPanelMain").hide();
		} else {
			$("#fpPanelMain").show();
		}
		$("#fpPanelSettings").hide();
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : 'Click Back Button'});
	});
	
	headerSettings.find(".fp-extension-close").click(function(){
		$("#fpExtensionPanelContainer").hide();
		chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : 'Hide Extension Panel'});
	});

	
	var panelExclude = $("<div id='fpPanelExclude' class='fp-extension-panel'></div>");
	panelExclude.appendTo(panelContainer);
	panelExclude.hide();
	
	var headerExclude = $("<div class='fp-extension-header'></div>");
	headerExclude.appendTo(panelExclude);
	$("<a href='javascript:void(0)' class='fp-extension-back' title='Back'></a>").appendTo(headerExclude);
	$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerExclude);
	$("<div class='fp-extension-heading'>Excluded websites</div>").appendTo(headerExclude);	
	$("<div class='fp-extension-sub-heading'>Configure sites that should not display advice</div>").appendTo(headerExclude);

	
	headerExclude.find(".fp-extension-back").click(function(){
		$("#fpPanelSettings").show();
		panelExclude.hide();
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Exclusions View', 'action' : 'Click Back Button'});
	});
	
	headerExclude.find(".fp-extension-close").click(function(){
		$("#fpExtensionPanelContainer").hide();
		chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Exclusions View', 'action' : 'Hide Extension Panel'});
	});

	var excludeBody = $("<div class='fp-extension-body'></div>");
	excludeBody.appendTo(panelExclude);
	
	$("<div class='fp-extension-instructions'>" +
		"To prevent the FantasyPros Chrome Extension from adding data to certain pages, " +
		"enter the page URL below and click the add button to add the page to your excluded sites." +
		"</div>").appendTo(excludeBody);

	var form = $("<form id='excludeForm'><input type='text' id='exclusionInput' class='fp-extension-input-text' placeholder='example.com'/>" +
		"<div class='fp-extension-add-button' title='Add to excluded websites'></div>" +
		"</form>");
	form.appendTo(excludeBody);
	
	form.submit(function( event ) {
	  event.preventDefault();
	  excludeSite();
	});	
	
	excludeBody.find(".fp-extension-add-button").click(function() {
		excludeSite();
	});	
	
	$("#exclusionInput").on("change paste keyup", function() {
		  if ($("#exclusionInput").val().length > 5){
			  form.addClass("fp-valid");
		  } else {
			  form.removeClass("fp-valid");
		  }
	});

	var excludedSection = $("<div class='fp-extension-section' id='fpExcludedSection'></div>");
	$("<div class='fp-extension-section-heading'>Your excluded sites/pages</div>").appendTo(excludedSection);
	excludedSection.appendTo(excludeBody);
	list = $("<div class='fp-extension-section-list' id='exclusionList'></div>");
	list.appendTo(excludedSection);
	

	chrome.runtime.sendMessage({'cmd' :'getBlackList'}, function(result){  
		fillExclusionList(result);
	});
	
	var preferenceSection = $("#fpPreferenceSection");
	$("<div class='fp-extension-section-heading'>Preferences</div>").appendTo(preferenceSection);
	list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(preferenceSection);
	var linkItem = $("<a class='fp-extension-section-list-item fp-extension-section-link' href='javascript:void(0)'></a>");
	linkItem.appendTo(list);
	$("<div class='fp-item-checkbox-label'>Excluded Websites<div class='fp-angle-right'></div></div>").appendTo(linkItem);
	
	linkItem.click(function(){
		panelExclude.show();
		panelSettings.hide();
		$("#fpPanelMain").hide();
	});
	
	return panelContainer;
}

function addSportPreferences(sport, userPref){

	var list = $("#fpPreferenceSection").find(".fp-extension-section-list").get(0);
	if (!list){
		return;
	}
	
	if (sport == 'nfl'){

		$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
		
		item = $("<div class='fp-extension-section-list-item fp-extension-section-flag-item'></div>");
		item.appendTo(list);
		$("<div class='fp-item-toggle " + (userPref && userPref.dst ? "toggle-on" : "") + "' id='cbHighlightDST'></div>").appendTo(item);
		$("<div class='fp-item-checkbox-label'>Detect DST</div>").appendTo(item);
		
		$("#cbHighlightDST").click(function(){
			if (disableDetectOptions){
				return; //to prevent a second click too soon
			} else {
			    disableDetectOptions = true; 
			}
			$("#cbHighlightDST").toggleClass("toggle-on");
		    if (typeof(playercardGenerator) != "undefined"){
				playercardGenerator.resetSportData('nfl');
			}

			chrome.runtime.sendMessage({
				'cmd' :'setFootballPreferences', 
				'def': $("#cbHighlightDST").hasClass("toggle-on") ? 1 : 0, 
				'idp' : $("#cbHighlightIDP").hasClass("toggle-on") ? 1 : 0
			});
			
			var eventAction = 'Detect DST ';
			eventAction += $("#cbHighlightDST").hasClass("toggle-on") ? 'On' : 'Off';			
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : eventAction, 'label': ''});	
		});
		
		$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
		
		var item = $("<div class='fp-extension-section-list-item fp-extension-section-flag-item'></div>");
		item.appendTo(list);
		$("<div class='fp-item-toggle " + (userPref && userPref.idp ? "toggle-on" : "") + "' id='cbHighlightIDP'></div>").appendTo(item);
		$("<div class='fp-item-checkbox-label'>Detect IDP</div>").appendTo(item);
		
		$("#cbHighlightIDP").click(function(){
			if (disableDetectOptions){
				return; //to prevent a second click too soon
			} else {
			    disableDetectOptions = true; 
			}
			$("#cbHighlightIDP").toggleClass("toggle-on");

		    if (typeof(playercardGenerator) != "undefined"){
				playercardGenerator.resetSportData('nfl');
			}
		    
			chrome.runtime.sendMessage({
				'cmd' :'setFootballPreferences', 
				'def': $("#cbHighlightDST").hasClass("toggle-on") ? 1 : 0, 
				'idp' : $("#cbHighlightIDP").hasClass("toggle-on") ? 1 : 0
			});

			var eventAction = 'Detect IDP ';
			eventAction += $("#cbHighlightIDP").hasClass("toggle-on") ? 'On' : 'Off';		
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : eventAction, 'label': ''});	

		});
	}

}


function requiresUpgrade(adviceMode){
	if (adviceMode == 'SSA' || adviceMode == 'WA' || adviceMode == 'TA'){
		return true;
	} else if (adviceMode == 'TopAv'){
		return false;
	}
	return false;
}

function fillUserData(){
	
	if (userDataFilled){
		return;
	}
	
	$("#fpFavoriteSection").html("");
	$("#fpUserSection").html("");
	$("#fpUpgradeSection").html("");
	$("#fpAdviceSection").html("");
	$("#fpLeaguesSection").html("");	
	$(".fp-extension-settings").show();
	$("#exclusionList").html("");
	
    chrome.runtime.sendMessage({'cmd' :'queryResearchAssistant'}, function(result){   
    	if (!result || userDataFilled){
    		return;
    	}
    	
    	addSportPreferences(result.sport,result.priv);
    	
    	var adviceMode = typeof getPremiumAdviceMode == 'function' ? getPremiumAdviceMode() : '';

    	var jsonLeagues = result.level && result.priv ? result.priv.leagues : result.leagues;
    	var inactiveLeagues = result.level && result.priv ? result.priv.inactive_leagues : result.inactive_leagues;
    	
    	if (!result.username && !result.level){
    		//log in prompt
        	$(".fp-extension-settings").hide();  
        	$("#fpFavoriteSection").hide();            	
    		$("#fpArticleSection").html("").hide();
        	
        	var section = $("#fpUpgradeSection");
        	section.show();
        	var list = $("<div class='fp-extension-section-list'></div>");
        	list.appendTo(section);

    		$("<div class='fp-extension-trophy'></div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-header'>Create Your FREE Account</div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-desc'>Create a FantasyPros account and import your<br/>league to access these league-winning features.</div>").appendTo(list);
    		var list2 = $("<div class='fp-extension-upgrade-list fp-extension-register-list'></div>");
    		list2.appendTo(list);
    		$("<div class='fp-extension-bullet'>Personalized, expert advice for your team</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>See the top available players in your league</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Projections, news, and notes for your players</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Power rankings, playoff odds, and more</div>").appendTo(list2);
    		
    		$("<div class='fp-btn-container'>" +
    				"<a class='fp-btn-primary' href='https://secure.fantasypros.com/accounts/register/?&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Import&utm_content=create_free_account_CTA' target='_blank'>Create Free Account</a>" +
    				"<div class='fp-btn-sub'>Already have an account? " +
    				"<a class='fp-btn-sub-link' href='https://secure.fantasypros.com/accounts/login/?&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Import&utm_content=log_in_here_LINK' target='_blank'>Log in Here<a>" +
    				"</div></div>").appendTo(list);
    		list.find(".fp-btn-primary").click(function(){
			    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Create Free Account Click', 'label': 'Unregistered'});
			});
    		list.find(".fp-btn-sub-link").click(function(){
			    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Log in Here Click', 'label': 'Unregistered'});
			});
    		
    	} else if (requiresUpgrade(adviceMode) && !result.level){
    		// upgrade prompt for premium advice
        	$(".fp-extension-settings").hide();  
        	$("#fpFavoriteSection").hide();            	
    		$("#fpArticleSection").html("").hide();
        	
        	var section = $("#fpUpgradeSection");
        	if (isSafariExtension){
        		section.hide();
        	} else {
        		section.show();
        	}
        	var list = $("<div class='fp-extension-section-list'></div>");
        	list.appendTo(section);

    		if ($("#fpExtensionPanelContainer").is(":visible") == false){
    			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': '1'});
    		}
    		var upgradeText = "This is a Premium Feature";
    		var upgradeDesc = "Upgrade to a FantasyPros premium subscription<br/>today for our best, league-winning features.";
    		if (getPremiumAdviceMode() == 'SSA'){
    			upgradeText = "Start/Sit Advice is a Premium Feature";
    		} else if (getPremiumAdviceMode() == 'WA'){
    			upgradeText = "Waiver Analysis is a Premium Feature";
    		} else if (getPremiumAdviceMode() == 'TA'){
    			upgradeText = "Trade Analysis is a Premium Feature";
    		}
    		
    		$("<div class='fp-extension-trophy'></div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-header'>" + upgradeText + "</div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-desc'>" + upgradeDesc + "</div>").appendTo(list);
    		var list2 = $("<div class='fp-extension-upgrade-list'></div>");
    		list2.appendTo(list);
    		$("<div class='fp-extension-bullet'>Import and manage multiple teams</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Premium start/sit, waiver and trade advice</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Set lineups automatically w/ Auto-Pilot</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Advice from the most accurate experts</div>").appendTo(list2);
    		
    		if (getPremiumAdviceMode() == 'SSA'){
        		$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://secure.fantasypros.com/plans/?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_SSA&utm_content=Upgrade_Today_CTA' target='_blank'>Upgrade Today</a></div>").appendTo(list);
    		} else if (getPremiumAdviceMode() == 'WA'){
        		$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://secure.fantasypros.com/plans/?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_WA&utm_content=Upgrade_Today_CTA' target='_blank'>Upgrade Today</a></div>").appendTo(list);
    		} else if (getPremiumAdviceMode() == 'TA'){
        		$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://secure.fantasypros.com/plans/?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_TA&utm_content=Upgrade_Today_CTA' target='_blank'>Upgrade Today</a></div>").appendTo(list);
    		}

    		list.find(".fp-btn-primary").click(function(){
			    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Upgrade Today Click', 'label': 'Basic'});
			});
    		
    	} else if (!adviceMode && !result.level){
    		// upgrade prompt for regular use
        	$(".fp-extension-settings").hide();  
        	$("#fpFavoriteSection").hide();            	
    		$("#fpArticleSection").html("").hide();
        	
        	var section = $("#fpUpgradeSection");
        	if (isSafariExtension){
        		section.hide();
        	} else {
        		section.show();
        	}
        	var list = $("<div class='fp-extension-section-list'></div>");
        	list.appendTo(section);

    		$("<div class='fp-extension-trophy'></div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-header'>Your FantasyPros extension is active</div>").appendTo(list);
    		$("<div class='fp-extension-upgrade-desc'>But you're missing out on some of our<br/>best, league-winning features!</div>").appendTo(list);
    		var list2 = $("<div class='fp-extension-upgrade-list'></div>");
    		list2.appendTo(list);
    		$("<div class='fp-extension-bullet'>Import and manage multiple teams</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Premium start/sit, waiver and trade advice</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Set lineups automatically w/ Auto-Pilot</div>").appendTo(list2);
    		$("<div class='fp-extension-bullet'>Advice from the most accurate experts</div>").appendTo(list2);
    		
    		$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://secure.fantasypros.com/plans/?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Default&utm_content=Upgrade_Today_CTA' target='_blank'>Upgrade Today</a></div>").appendTo(list);

    		list.find(".fp-btn-primary").click(function(){
			    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Upgrade Today Click', 'label': 'Basic'});
			});
    		
    	} else if (adviceMode && !result.level){
    		// e.g. Top Available for basic users
    		
    		if (result.sport == 'nfl'){
    			//check if we are still in-season
	    	    chrome.runtime.sendMessage({'cmd' :'getWeekNFL'}, function(week){  
	    	    	if (week > 0 && week <=17){
	        			checkPremiumAdviceForLeagues(jsonLeagues, inactiveLeagues);
	    	    	}
	    	    });
    		} else {
    			checkPremiumAdviceForLeagues(jsonLeagues, inactiveLeagues);
    		}
    		
        } else if (result.level && jsonLeagues && jsonLeagues.length > 0){

    		if (result.sport == 'nfl'){
    			//check if we are still in-season
	    	    chrome.runtime.sendMessage({'cmd' :'getWeekNFL'}, function(week){  
	    	    	if (week > 0 && week <=17){
	        			checkPremiumAdviceForLeagues(jsonLeagues, inactiveLeagues);
	    	    	}
	    	    });
    		} else {
    			checkPremiumAdviceForLeagues(jsonLeagues, inactiveLeagues);
    		}
        	
        	var section = $("#fpFavoriteSection");
        	section.show();
        	$("<div class='fp-extension-section-heading'>" +
        			(result.priv.leagues.length > 1 ? "Favorite League" : "League") + "</div>").appendTo(section);
        	var list = $("<div class='fp-extension-section-list'></div>");
        	list.appendTo(section);
        	
        	var hasFav = false;
        	for (var i=0; i< result.priv.leagues.length; i++){
        		var league = result.priv.leagues[i];

            	if (league[4] || result.priv.leagues.length == 1){
	        		var item = $("<div class='fp-extension-section-list-item fp-extension-league'></div>");
	        		item.appendTo(list);
	            	if (league[4]){
	            		$("<div class='fp-item-icon fp-item-icon-star'></div>").appendTo(item);
	            	}
	            	if (result.priv.leagues.length > 1){
		        		var link = $("<a class='fp-item-link' href='javascript:void(0)'>Edit</a>");
		        		link.appendTo(item);
		        		link.click(function(){
		        			$("#fpPanelMain").hide();
		        			$("#fpPanelSettings").show();
		        			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Edit League Click', 'label': 'Premium'});
		        		});
	            	}
	        		$("<div class='fp-item-league'></div>").text(league[1]).appendTo(item);
	        		$("<div class='fp-item-team'></div>").text(league[2]).appendTo(item);
	        		$("<div style='clear:both'></div>").appendTo(item);
	        		hasFav = true;
	        		break;
            	}
        	}
        	if (hasFav == false){
        		//set favorite league ?
        		var item = $("<div class='fp-extension-section-list-item'></div>");
        		item.appendTo(list);
            	if (result.priv.leagues.length > 1){
	        		var link = $("<a class='fp-item-link' href='javascript:void(0)'>Edit</a>");
	        		link.appendTo(item);
	        		link.click(function(){
	        			$("#fpPanelMain").hide();
	        			$("#fpPanelSettings").show();		
	        			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Edit League Click', 'label': 'Premium'});
	        		});
            	}
        		$("<div class='fp-item-league-summary'><div class='fp-item-icon fp-item-icon-starvoid'></div>No favorite league set.</div>").appendTo(item);
        		$("<div style='clear:both'></div>").appendTo(item);
        	}

			$("<div class='fp-extension-section-list-divider import-item-divider'></div>").appendTo(list);
    		var importItem = $("<div class='fp-extension-section-list-item import-item'> " +
    				"<a target='_blank'>+ Import Another League</a></div>");
    		importItem.find("a").attr("href","https://www.fantasypros.com/myleagues/league-sync/?sport=" + result.sport.toUpperCase() + 
    				"&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_MAIN&utm_content=import_league_CTA");
    		importItem.appendTo(list);

    		importItem.find("a").click(function(){
    		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Import Another League Click', 'label': 'Premium'});
    		});

        	section = $("#fpLeaguesSection");
        	$("<div class='fp-extension-section-heading'>Your Imported Leagues</div>").appendTo(section);
        	list = $("<div class='fp-extension-section-list'></div>");
        	list.appendTo(section);
        	var scroll = $("<div class='fp-extension-section-list-scroll'></div>");
        	scroll.appendTo(list);
        	
        	for (var i=0; i< result.priv.leagues.length; i++){
        		if (i > 0){
        			$("<div class='fp-extension-section-list-divider'></div>").appendTo(scroll);
        		}
        		var league = result.priv.leagues[i];

        		var item = $("<div class='fp-extension-section-list-item fp-extension-league'></div>");
        		item.appendTo(scroll);
            	if (league[4]){
            		var star = $("<div class='fp-item-icon fp-item-icon-star' title='Remove as Favorite'></div>");
            		star.attr("fp-key", league[6]);
            		star.appendTo(item);
            		star.click(function(){
            			chrome.runtime.sendMessage({cmd: "removeFavorite",'leagueKey':$(this).attr('fp-key')}, function (response) {
            				$("#fpExtensionPanelContainer").hide(); // close the popup 
            				userDataFilled = false;
            			});

             		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : 'Remove Favorite League', 'label': 'Premium'}   );
            		});
            	} else {
            		var starvoid = $("<div class='fp-item-icon fp-item-icon-starvoid' title='Set as Favorite'></div>");
            		starvoid.attr("fp-key", league[6]);
            		starvoid.appendTo(item);
            		starvoid.click(function(){
            			chrome.runtime.sendMessage({cmd: "setFavorite",'leagueKey':$(this).attr('fp-key')}, function (response) {
            				$("#fpExtensionPanelContainer").hide(); // close the popup 
            				userDataFilled = false;
            			});

             		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : 'Change Favorite League', 'label': 'Premium'}   );
            		});
            	}
        		$("<div class='fp-item-league'></div>").text(league[1]).appendTo(item);
        		$("<div class='fp-item-team'></div>").text(league[2]).appendTo(item);
        		$("<div style='clear:both'></div>").appendTo(item);
        	}
			$("<div class='fp-extension-section-list-divider import-item-divider'></div>").appendTo(list);        	
    		importItem = $("<div class='fp-extension-section-list-item import-item'> " +
    				"<a target='_blank'>+ Import Another League</a></div>");
    		importItem.find("a").attr("href","https://www.fantasypros.com/myleagues/league-sync/?sport=" + result.sport.toUpperCase() + 
				"&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_MAIN&utm_content=import_league_CTA");
    		importItem.appendTo(list);
    		
    		importItem.find("a").click(function(){
    		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : 'Import Another League Click', 'label': 'Premium'});
    		});
    	}

    	if (result.username){
        	var section2 = $("#fpUserSection");
    		$("<div class='fp-extension-section-heading'>Your Account</div>").appendTo(section2);
    		var list = $("<div class='fp-extension-section-list'></div>");
    		list.appendTo(section2);

    		var item = $("<div class='fp-extension-section-list-item'></div>");
    		item.appendTo(list);
    		var usernameDiv = $("<div class='fp-item-username'></div>");
    		usernameDiv.text(result.username);
    		usernameDiv.appendTo(item);
            if (result.level){
	    		var level = $("<div class='fp-subscription-level'></div>");
	    		level.text("Level: " + result.level.toUpperCase());
	    		level.appendTo(item);

	    		if ($("#fpArticleSection").length && $("#fpArticleSection").html().length == 0){
	    			
    	        	var section3 = $("#fpArticleSection");
    	        	section3.show();
    	    		$("<div class='fp-extension-section-heading'>Featured Article</div>").appendTo(section3);

		    	    chrome.runtime.sendMessage({'cmd' :'queryHomePageArticle'}, function(result){ 
		    	    	section3.html("");
		    	    	if (result && result.featured && result.featured.length > 0){
		    	    		var article = result.featured[0];
		    	    		
		    	    		var articleUrl = article.url;
		    	    		if (articleUrl.indexOf("?") == -1){
		    	    			articleUrl += "?";
		    	    		} else {
		    	    			articleUrl += "&";
		    	    		}
		    	    		articleUrl += "utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=featured_article";
		    	    		
		    	    		var readMore = $("<a class='fp-extension-read-more' target='_blank'>Read More</a>");
		    	    		readMore.attr("href", articleUrl);
		    	    		readMore.appendTo(section3);
		    	    		$("<div class='fp-extension-section-heading'>Featured Article</div>").appendTo(section3);
		    	    		var link = $("<a class='fp-extension-article' target='_blank'><img src='" + article.image + "'></a>");
		    	    		link.attr("href", articleUrl);
		    	    		link.appendTo(section3);
		    	    		$("<div class='fp-extension-article-title'>" + article.title  + "</div>").appendTo(link);
		    	      		
		            		link.click(function(){
		             		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Featured Article Click', 'label': 'Premium'});
		            		});

		    	    	} else {
		    	        	section3.hide();
		    	    	}
		    	    });
		    	    
	    		}
            } else if (isSafariExtension == false){
        		var link = $("<a class='fp-item-link' href='https://secure.fantasypros.com/plans/?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_MAIN&utm_content=Upgrade_Account_CTA' target='_blank'>Upgrade Account</a>");
        		link.appendTo(item);        		
        		link.click(function(){
         		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Upgrade Account Click', 'label': 'Basic'});
        		});
            }
    		$("<div style='clear:both'></div>").appendTo(item);
    	}
    	var adviceSection = $("#fpAdviceSection");
		$("<div class='fp-extension-section-heading'>Premium Advice</div>").appendTo(adviceSection);
		var list = $("<div class='fp-extension-section-list'></div>");
		list.appendTo(adviceSection);
		var item = $("<div class='fp-extension-section-list-item'></div>");
		item.appendTo(list);
		$("<div class='fp-item-toggle' id='cbPremiumAdvice'></div>").appendTo(item);
		$("<div class='fp-item-checkbox-label'>Display Advice Automatically</div>").appendTo(item);

		chrome.storage.sync.get({
		    displayAdvice: true
		  }, function(items) {
			  if (items.displayAdvice){
				  $("#cbPremiumAdvice").addClass("toggle-on");
			  }
		  });
		
		$("#cbPremiumAdvice").click(function(){
			$("#cbPremiumAdvice").toggleClass("toggle-on");
			
			chrome.storage.sync.set({
				 displayAdvice: $("#cbPremiumAdvice").hasClass("toggle-on")
			}, function() {});
			
			var eventAction = 'Premium Advice Toggle ';
			eventAction += $("#cbPremiumAdvice").hasClass("toggle-on") ? 'On' : 'Off';
			
 		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Settings View', 'action' : eventAction, 'label': 'Premium'});

		});
		
		userDataFilled = true;
    });
    
}

function showStartSitAdvice(leagueData, json, forceShow){
	
	if (forceShow){
		$("#fpExtensionPanelContainer").show();
	}
	$("#fpPanelMain").hide();
	$("#fpPanelSettings").hide();
	
	var panelSSA;
	if ($("#fpPanelSSA").get(0)){
		panelSSA = $("#fpPanelSSA");
		panelSSA.show();
		panelSSA.find(".fp-extension-body").remove();
		panelSSA.find(".fp-extension-btn-div").remove();
	} else {
		var panelContainer = $("#fpExtensionPanelContainer");
		panelSSA = $("<div id='fpPanelSSA' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelSSA.appendTo(panelContainer);
		
		var headerSSA = $("<div class='fp-extension-header'></div>");
		headerSSA.appendTo(panelSSA);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_SSA&utm_content=FP_Icon'></a>").appendTo(headerSSA);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerSSA);
		$("<div class='fp-extension-heading'>Start/Sit Assistant</div>").appendTo(headerSSA);	
		$("<div class='fp-extension-sub-heading'>Set your optimal lineup instantly</div>").appendTo(headerSSA);

		headerSSA.find(".fp-extension-logo").click(function(){
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'FP Icon Click'});
		});
		headerSSA.find(".fp-extension-settings").click(function(){
			$(".fp-extension-premium-advice").hide();
			$("#fpPanelMain").hide();
			$("#fpPanelSettings").show();
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Click Settings'});
		});
		headerSSA.find(".fp-extension-close").click(function(){
			$("#fpExtensionPanelContainer").hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Hide Extension Panel'});
		});
	}

	var bodySSA = $("<div class='fp-extension-body'></div>");
	bodySSA.appendTo(panelSSA);
	
	if (!leagueData || !json){
		return;
	}
	
	var expertCount = json.expertCount;
	if (!expertCount || expertCount < 2){
		
		var summary = $("<div class='fp-extension-summary'>We don't have enough expert rankings to calculate your optimized lineup. Please check back later.</div>");
		summary.appendTo(bodySSA);	
		
	} else if (json.hasChangesToSubmit){

		chrome.storage.sync.get({
		    displayAdvice: true
		  }, function(items) {
			  if (items.displayAdvice){
				  $("#fpExtensionPanelContainer").show();
				  chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'View Start/Sit Assistant Panel'});
			  } else if ($("#fpExtensionPanelContainer").is(":visible") == false){
				  chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': '1'});
			  }
		  });
		
		var summary = $("<div class='fp-extension-summary'>Based on a poll of <b>" + expertCount +
				" experts</b> we’ve detected the following optimizations to your lineup.</div>");
		summary.appendTo(bodySSA);	

		var hasStart = false;
		var section = $("<div class='fp-extension-section'></div>");
		section.appendTo(bodySSA);	
	
		$("<div class='fp-extension-section-heading'>Start These Players</div>").appendTo(section);
		var list = $("<div class='fp-extension-section-list'></div>");
		list.appendTo(section);		
		$("<div class='fp-extension-section-list-header'>" +
				"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
				"<div class='fp-extension-section-list-header-right'>EXPERT%</div>" +
				"<div style='clear:both'></div></div>").appendTo(list);
		var playerCount = 0;
		var starterIds = [];
		for (var i=0; i<json.playersToStart.length; i++){
			// {position: "QB", fpId: 9509, percent: 94, currentStarter: true, locked: false}
			var jsPlayer = json.playersToStart[i];
			starterIds.push(jsPlayer.fpId);
			
			if (jsPlayer.currentStarter || jsPlayer.locked){
				continue;
			}
			
			if (!PLAYER_CACHE || !PLAYER_CACHE.players || !PLAYER_CACHE.players[jsPlayer.fpId]){
				continue;
			}
			
			var playerData = PLAYER_CACHE.players[jsPlayer.fpId];
			if (playerCount > 0){
				$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
			}
			playerCount++;
			createPlayerCard(jsPlayer, playerData).appendTo(list);
			hasStart = true;
		}
		if (hasStart == false){
			section.remove();
		}

		var hasSit = false;
		section = $("<div class='fp-extension-section'></div>");
		section.appendTo(bodySSA);	
		$("<div class='fp-extension-section-heading'>Sit These Players</div>").appendTo(section);
		list = $("<div class='fp-extension-section-list'></div>");
		list.appendTo(section);		
		$("<div class='fp-extension-section-list-header'>" +
				"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
				"<div class='fp-extension-section-list-header-right'>EXPERT%</div>" +
				"<div style='clear:both'></div></div>").appendTo(list);
		playerCount = 0;
		for (var i=0; i<json.playersToSit.length; i++){
			var jsPlayer = json.playersToSit[i];
			
			if (jsPlayer.currentStarter == false || jsPlayer.locked){
				continue;
			}

			if (!PLAYER_CACHE || !PLAYER_CACHE.players || !PLAYER_CACHE.players[jsPlayer.fpId]){
				continue;
			}

			var playerData = PLAYER_CACHE.players[jsPlayer.fpId];
			if (playerCount > 0){
				$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
			}
			playerCount++;
			createPlayerCard(jsPlayer, playerData).appendTo(list);
			hasSit = true;
		}
		if (hasSit == false){
			section.remove();
		}
		
		if (json.flexChanges && json.flexChanges.length){
			section = $("<div class='fp-extension-section'></div>");
			section.appendTo(bodySSA);	
			if (hasStart || hasSit){
				$("<div class='fp-extension-section-heading'>Other Optimizations</div>").appendTo(section);
			}
			list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(section);		
			
			for (var k=0; k<json.flexChanges.length; k++){
				if (k > 0){
					$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
				}
				var item = $("<div class='fp-extension-section-list-item fp-item-player'></div>");
				var desc = $("<div class='fp-item-player-desc' style='color:#333333'></div>");
				$("<span>&bull; </span>").appendTo(desc);
				var remainingText = json.flexChanges[k];
				while (remainingText.indexOf("<b>") != -1){
					var idx1 = remainingText.indexOf("<b>");
					var idx2 = remainingText.indexOf("</b>");
					$("<span></span>").text(remainingText.substring(0,idx1)).appendTo(desc);
					if (idx2 > idx1){
						$("<b></b>").text(remainingText.substring(idx1+3,idx2)).appendTo(desc);
						remainingText = remainingText.substring(idx2+4);
					} else {
						$("<b></b>").text(remainingText.substring(idx1+3)).appendTo(desc);
						remainingText = '';
					}					
				}
				if (remainingText){
					$("<span></span>").text(remainingText).appendTo(desc);
				}
				desc.appendTo(item);
				item.appendTo(list);
			}
		}		
		
		bodySSA.addClass("fp-extension-body-with-cta");
		var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
		ctaDiv.appendTo(panelSSA);
		
		var btn = $("<a class='fp-btn-primary fp-btn-x-large' href='javascript:void(0)'>Set Optimal Lineup</a>");
		btn.appendTo(ctaDiv);
		
		btn.click(function(){
			$("#fpPanelSSA").find(".fp-extension-body").remove();
			$("#fpPanelSSA").find(".fp-extension-btn-div").remove();

			$("<div class='fp-extension-loading'></div>").appendTo($("#fpPanelSSA"));
			
			if (typeof submitLineup == 'function'){
				submitLineup(leagueData, starterIds, json.playersToStart, json.playersToSit);
			} else {
							
				var url = "https://mpbnfl.fantasypros.com/submitLineup?key=" + leagueData[6] + "&players=" + starterIds.join(",");
			    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache': false}, 
			    	function(result){
				    	if (result.error){
				    		$("#fpPanelSSA").find(".fp-extension-loading").remove();
				    		
				    		var bodySSA = $("<div class='fp-extension-body'></div>");
				    		bodySSA.appendTo($("#fpPanelSSA"));
				    		
				    		var section = $("<div class='fp-extension-section'></div>");
				    		section.appendTo(bodySSA);	
	
				        	var list = $("<div class='fp-extension-section-list'></div>");
				        	list.appendTo(section);
	
				    		$("<div class='fp-extension-failure'></div>").appendTo(list);
				    		$("<div class='fp-extension-upgrade-header'>Unable to Submit Lineup</div>").appendTo(list);
				    		if (result.message){
				    			var messageDiv = $("<div class='fp-extension-upgrade-desc' style='font-weight:600'></div>");
				    			messageDiv.text(result.message.replace(/ errors/g,""));
				    			messageDiv.appendTo(list);
				    		}
				    		if (result.details){
				    			var detailsDiv = $("<div class='fp-extension-upgrade-desc'></div>");
				    			detailsDiv.text(result.details);
				    			detailsDiv.appendTo(list);
				    		}
	
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
				    		
				    		$("<div style='height:20px'></div>").appendTo(list);
			    		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Submit Lineup Failure', 'label': 'Premium'});
					    } else {
			    		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Submit Lineup Success', 'label': 'Premium'});
					    	location.reload();
					    }
			    	}
			    );	
	    	}		
		    
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Set Optimal Lineup Click', 'label': 'Premium'});
		});
		
		
	} else {

		var section = $("<div class='fp-extension-section'></div>");
		section.appendTo(bodySSA);	

    	var list = $("<div class='fp-extension-section-list'></div>");
    	list.appendTo(section);

		$("<div class='fp-extension-check-circle'></div>").appendTo(list);
		$("<div class='fp-extension-upgrade-header'>Lineup Optimized!</div>").appendTo(list);
		$("<div class='fp-extension-upgrade-desc'>Your optimal lineup is set for " +
				"<b>" + leagueData[2] + "</b> in <b>" + leagueData[1] + "</b>.</div>").appendTo(list);
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
		$("<div style='height:20px'></div>").appendTo(list);
		

		chrome.storage.sync.get({
		    hasRated: false
		  }, function(items) {
			  if (items.hasRated){
				if (json.allowSubmitLineup && !json.autoPilotOn){
					var sectionAP = $("<div class='fp-extension-section fp-extension-auto-pilot'></div>");
					sectionAP.appendTo(bodySSA);	
					$("<div class='fp-extension-upgrade-header'>Psst, next time let us do the work...</div>").appendTo(sectionAP);	
					$("<div class='fp-extension-upgrade-desc'><b>Auto-Pilot</b> can replace inactive players and set your optimal lineup for you before each game.</div>").appendTo(sectionAP);	
					var btnContainer = $("<div class='fp-btn-container'><a class='fp-btn-primary' target='_blank'>Check out Auto-Pilot</a></div>");
					btnContainer.find("a").attr("href", "https://www.fantasypros.com/nfl/myplaybook/auto-pilot.php?key=" + leagueData[6]);
					btnContainer.appendTo(sectionAP);
					sectionAP.find(".fp-btn-primary").click(function(){
					    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Check Out Auto-Pilot Click', 'label': 'Premium'});
					});
				}
				
			  } else {

					var sectionRate = $("<div class='fp-extension-section'></div>");
					sectionRate.appendTo(bodySSA);	
					
			    	var listRate = $("<div class='fp-extension-section-list'></div>");
			    	listRate.appendTo(sectionRate);
			    	
					$("<div class='fp-extension-upgrade-header'><br/>Rate Our Extension!</div>").appendTo(listRate);	
					var starContainer = $("<div class='fp-extension-upgrade-desc' style='text-align:center'></div>");
					starContainer.appendTo(listRate);
					for (var k=0; k<5; k++){
		        		$("<div class='fp-item-icon fp-item-icon-star' style='margin-right:2px;float:none;display:inline-block'></div>").appendTo(starContainer);
					}
		    		$("<div style='clear:both;height:5px;'></div>").appendTo(starContainer);
					$("<div class='fp-extension-upgrade-desc'>Are you finding the FantasyPros extension helpful?<br/>Please take a second to <b>rate us</b> and <b>leave a review</b>!</div>").appendTo(listRate);	
					
					if (window.navigator.userAgent.match('Firefox')){
						$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://addons.mozilla.org/en-US/firefox/addon/fantasypros/' " +
								"target='_blank'>Yep, Let's Do It!</a></div>").appendTo(listRate);
					} else {
						$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://chrome.google.com/webstore/detail/fantasypros-win-your-fant/gfbepnlhpkbgbkcebjnfhgjckibfdfkc' " +
								"target='_blank'>Yep, Let's Do It!</a></div>").appendTo(listRate);
					}
					
					listRate.find(".fp-btn-primary").click(function(){
						chrome.storage.sync.set({hasRated: true});
					    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Start Sit View', 'action' : 'Rate Extension', 'label': 'Premium'});
					});
				}
		  });
		
		
		 
	}
}

function createPlayerCard(jsPlayer, playerData, mode){
	mode = mode || 'SSA';
	var item = $("<div class='fp-extension-section-list-item fp-item-player'></div>");
	if (playerData.p == 'DST'){
		$("<div class='fp-item-player-picture team-logo--circle'></div>").text(playerData.t.toUpperCase()).addClass("nfl-" + playerData.t.toLowerCase()).appendTo(item);
	} else {
		var img = $("<img class='fp-item-player-picture' onerror='this.onerror=null;this.src=\"https://images.fantasypros.com/images/photo_missing_square.jpg\";'>");
		img.attr("src","https://images.fantasypros.com/images/players/nfl/" + jsPlayer.fpId + "/headshot/100x100.png");
		img.appendTo(item);
	}
	if (mode == 'WA'){
		$("<div class='fp-item-player-ecr' style='margin-right: -15px;'></div>").text(jsPlayer.ecrROS || 'NR').appendTo(item);
		$("<div class='fp-item-player-ecr'></div>").text(jsPlayer.ecrWeekly || 'NR').appendTo(item);
	} else if (mode == 'SSA'){
		var perc = $("<div class='fp-item-player-percent'></div>");
		if (jsPlayer.percent > 90){
			perc.addClass("fp-green-col");
		} 
		perc.text(jsPlayer.percent + "%");
		perc.appendTo(item);
	} else if (mode == 'TA'){
		$("<div class='fp-item-player-ecr'></div>").text(jsPlayer.ecr || 'NR').appendTo(item);
	} else if (mode == 'TopAv'){
		var addDiv = $("<div class='fp-item-player-add'></div>");
		addDiv.appendTo(item);
		var addLink = $("<a target='_blank' title='Add Player'></a>");
		addLink.attr("href", jsPlayer.addLink);
		addLink.appendTo(addDiv);
		addLink.click(function(){
		    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'Click Add', 'label': 'Top ' + playerData.p});
		});
		$("<div class='fp-item-player-ecr'></div>").text(jsPlayer.ecr).appendTo(item);
	} 
	var playernameDiv = $("<div class='fp-item-player-name'><a target='_blank'></a></div>");
	playernameDiv.find("a").attr("href","http://www.fantasypros.com/nfl/players/?playersearch=" + jsPlayer.fpId).text(playerData.full);
	playernameDiv.appendTo(item);
	$("<div class='fp-item-player-desc'></div>").text(playerData.p + " - " + playerData.t).appendTo(item);
	$("<div style='clear:both'></div>").appendTo(item);
	
	return item;
}

function checkPremiumAdvice(){
	if (window.location.href.indexOf("/export?") != -1){
		//do not insert panel on MFL XML pages
		return;
	}
	//called at the beginning of enhancePage()
	createFpPanel();
}

function isStartSitAssistantReady(){
	// Don't Pop-up Advice Automatically Between Mon. Night - Wed. Morning
	var currentDateTimeEasternTimeZone = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
	var day = currentDateTimeEasternTimeZone.getDay();
    var hours = currentDateTimeEasternTimeZone.getHours();
    if (day == 1){ //Monday
    	return hours < 21;
    } else if (day == 2){ //Tuesday
    	return false;
    } else if (day == 3){ //Wednesday
    	return hours >= 6;
    }

	return true;
}

function checkPremiumAdviceForLeagues(jsonLeagues, inactiveLeagues){

	if (typeof getPremiumAdviceMode != 'function' || !getPremiumAdviceMode()){
		return;
	}
	var leagueForPremiumAdvice = undefined;
	var foundLeague = false;
	var leagueBase = getLeagueType() + "_" + getLeagueId() + "_"; 
	var leagueDesc = leagueBase + getTeamId();

	jsonLeagues = jsonLeagues || [];
	for (var i=0; i< jsonLeagues.length; i++){
		var isMatch = jsonLeagues[i][3].indexOf(leagueBase) == 0;
		if (!isMatch && getLeagueType() == 10 && jsonLeagues[i][3].indexOf("10_") == 0){
			//for Yahoo we build: 10_170153_ but RA contains 10_414.l.170153_1
			var idx = jsonLeagues[i][3].indexOf(".l." + getLeagueId() + "_");
			if (idx != -1){
				isMatch = true;
				leagueBase = jsonLeagues[i][3].substring(0, idx + (".l." + getLeagueId() + "_").length);
				leagueDesc = leagueBase + getTeamId();
			}
		}
		if (isMatch){
			foundLeague = true;
			if (getPremiumAdviceMode() == 'TopAv' || getPremiumAdviceMode() == 'WA' ||  getPremiumAdviceMode() == 'TA' || 
					getTeamId() == 'ANY' || jsonLeagues[i][3] == leagueDesc || true){
				leagueForPremiumAdvice = jsonLeagues[i];
			}
			break;
		}
	}

	var foundInactiveLeague = false;
	if (!foundLeague && inactiveLeagues){
		for (var i=0; i< inactiveLeagues.length; i++){
			var isMatch = inactiveLeagues[i][3].indexOf(leagueBase) == 0;
			if (!isMatch && getLeagueType() == 10 && inactiveLeagues[i][3].indexOf("10_") == 0){
				//for Yahoo we build: 10_170153_ but RA contains 10_414.l.170153_1
				isMatch = inactiveLeagues[i][3].indexOf(".l." + getLeagueId() + "_") != -1;
			}
			if (isMatch){
				foundInactiveLeague = true;
				break;
			}
		}
	}

	var panelContainer = $("#fpExtensionPanelContainer");

	if (leagueForPremiumAdvice){
		if (getPremiumAdviceMode() == 'SSA'){
			fetchSSA(leagueForPremiumAdvice);
		} else if (getPremiumAdviceMode() == 'TopAv'){
			fetchTopAvailable(leagueForPremiumAdvice);
		} else if (getPremiumAdviceMode() == 'TA'){
			if (typeof watchForTradeSelection == 'function' ){
				watchForTradeSelection(fetchTA, leagueForPremiumAdvice);
			}
			var tradeConfig = getTradeConfig(leagueForPremiumAdvice);
			if (tradeConfig.tradeAway && tradeConfig.tradeAway.length &&
					tradeConfig.tradeFor && tradeConfig.tradeFor.length){
				fetchTA(leagueForPremiumAdvice, tradeConfig);
			}
		} else if (getPremiumAdviceMode() == 'WA'){
			if (typeof watchForPlayerSelection == 'function' ){
				watchForPlayerSelection(fetchWA, leagueForPremiumAdvice);
			}
			if (getAddedPlayerId() && getDroppedPlayerId()){
				fetchWA(leagueForPremiumAdvice, getAddedPlayerId(), getDroppedPlayerId());
			}
		}
	} else if (foundInactiveLeague) {
		//league has not drafted yet...
	} else if (foundLeague == false && typeof(panelContainer) != "undefined"){
		panelContainer.show();
		$("#fpPanelMain").show();
		$("#fpPanelSettings").hide();
		
		var importSection = $("#fpImportSection");
		if (importSection.length == 0){
			var panelBody = $("#fpPanelMain").find(".fp-extension-body");
			importSection = $("<div class='fp-extension-section' id='fpImportSection'></div>");
			importSection.prependTo(panelBody);

			if (getPremiumAdviceMode() == 'SSA'){
				$("<div class='fp-extension-section-heading'>Start/Sit Assistant</div>").appendTo(importSection);
			} else if (getPremiumAdviceMode() == 'TopAv'){
				$("<div class='fp-extension-section-heading'>Top Available</div>").appendTo(importSection);
			} else if (getPremiumAdviceMode() == 'WA'){
				$("<div class='fp-extension-section-heading'>Waiver Assistant</div>").appendTo(importSection);
			} else if (getPremiumAdviceMode() == 'TA'){
				$("<div class='fp-extension-section-heading'>Trade Analyzer</div>").appendTo(importSection);
			} 
			var list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(importSection);
			if (getPremiumAdviceMode() == 'SSA'){
				$("<div class='fp-extension-upgrade-desc' style='padding-top:15px'>Import this league for expert start/sit advice!</div>").appendTo(list);
				$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://www.fantasypros.com/myleagues/league-sync/?sport=NFL&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_SSA&utm_content=import_league_CTA' target='_blank'>Import to My Playbook</a></div>").appendTo(list);
			} else if (getPremiumAdviceMode() == 'TopAv'){
				$("<div class='fp-extension-upgrade-desc' style='padding-top:15px'>Import this league to see the top available players!</div>").appendTo(list);
				$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://www.fantasypros.com/myleagues/league-sync/?sport=NFL&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_TopAvA&utm_content=import_league_CTA' target='_blank'>Import to My Playbook</a></div>").appendTo(list);
			} else if (getPremiumAdviceMode() == 'WA'){
				$("<div class='fp-extension-upgrade-desc' style='padding-top:15px'>Import this league for expert waiver advice!</div>").appendTo(list);
				$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://www.fantasypros.com/myleagues/league-sync/?sport=NFL&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_WA&utm_content=import_league_CTA' target='_blank'>Import to My Playbook</a></div>").appendTo(list);
			} else if (getPremiumAdviceMode() == 'TA'){
				$("<div class='fp-extension-upgrade-desc' style='padding-top:15px'>Import this league for expert trade advice!</div>").appendTo(list);
				$("<div class='fp-btn-container'><a class='fp-btn-primary' href='https://www.fantasypros.com/myleagues/league-sync/?sport=NFL&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_TA&utm_content=import_league_CTA' target='_blank'>Import to My Playbook</a></div>").appendTo(list);
			}
    		
    		list.find(".fp-btn-primary").click(function(){
			    chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Default View', 'action' : 'Import to MPB Click', 'label': 'Premium'});
			});
   		
		}
	}
}

function fetchSSA(leagueData, forceRefresh){
    
	var url = "https://mpbnfl.fantasypros.com/api/getLeagueAdviceJSON?key=" + leagueData[6];	
	if (typeof getCurrentLineup == 'function'){
		var lineup = getCurrentLineup();
		if (lineup.length > 0){
			url += "&current=" + getCurrentLineup().join(",");
		}
	}
	if (forceRefresh){
		url += "&refresh=Y";
	}
    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache': false}, 
    	function(result){
    		$(".fp-extension-loading").remove();
	    	if (result && result.start_sit_advice){
	    		showStartSitAdvice(leagueData, result.start_sit_advice, forceRefresh);
	    	}
	    }
    );
}

function fetchWA(leagueData, addedPlayerId, droppedPlayerId, forceRefresh){
	
	if (!leagueData || !addedPlayerId || !droppedPlayerId){
		return;
	}

	var url = "https://mpbnfl.fantasypros.com/api/getLeagueTradeJSON?key=" + leagueData[6];
	url += "&team1Adds=" + addedPlayerId;
	url += "&team1Drops=" + droppedPlayerId;
	if (forceRefresh){
		url += "&refresh=Y";
	}

    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache': false}, 
    	function(result){
    		$(".fp-extension-loading").remove();
	    	if (result && result.weekly && result.ros){
	    		showWaiverAdvice(leagueData, result, addedPlayerId, droppedPlayerId);
	    	}
	    }
    );
}

function fetchTA(leagueData, tradeConfig, forceRefresh){

	if (!leagueData || !tradeConfig){
		return;
	}

	var url = "https://mpbnfl.fantasypros.com/api/getLeagueTradeJSON?key=" + leagueData[6];
	if (tradeConfig.otherTeamId){
		url += "&team2Id=" + tradeConfig.otherTeamId;
	} else if (tradeConfig.otherTeamName){
		url += "&team2Name=" + encodeURI(tradeConfig.otherTeamName);
	}
	if (tradeConfig.tradeFor){
		url += "&team1Gets=" + tradeConfig.tradeFor.join(",");
	}
	if (tradeConfig.tradeAway){
		url += "&team2Gets=" + tradeConfig.tradeAway.join(",");
	}
	if (tradeConfig.dropMine){
		url += "&team1Drops=" + tradeConfig.dropMine.join(",");
	}
	if (tradeConfig.dropTheirs){
		url += "&team2Drops=" + tradeConfig.dropTheirs.join(",");
	}
	if (forceRefresh){
		url += "&refresh=Y";
	}
	
    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache': false}, 
    	function(result){
    		$(".fp-extension-loading").remove();
    		if (!tradeConfig.otherTeamId){
    			tradeConfig.otherTeamId = result.team2Id;
    		}
	    	if (result && result.weekly && result.ros){
	    		showTradeAdvice(leagueData, result, tradeConfig);
	    	}
	    }
    );
}

function showTopAvailable(leagueData, jsonPeriods){

	chrome.storage.sync.get({
	    displayAdvice: true
	  }, function(items) {
		  if (items.displayAdvice){
			  $("#fpExtensionPanelContainer").show();
			  chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'View Top Available Panel'});
		  } else if ($("#fpExtensionPanelContainer").is(":visible") == false){
			  chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': '1'});
		  }
	  });
	
	$("#fpPanelMain").hide();
	$("#fpPanelSettings").hide();
	
	var panelTopAv;
	if ($("#fpPanelTopAv").get(0)){
		panelTopAv = $("#fpPanelTopAv");
		panelTopAv.show();
		panelTopAv.find(".fp-extension-body").remove();
	} else {
		var panelContainer = $("#fpExtensionPanelContainer");
		panelTopAv = $("<div id='fpPanelTopAv' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelTopAv.appendTo(panelContainer);
		
		var headerTopAv = $("<div class='fp-extension-header'></div>");
		headerTopAv.appendTo(panelTopAv);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_TopAv&utm_content=FP_Icon'></a>").appendTo(headerTopAv);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerTopAv);
		$("<div class='fp-extension-heading'>Top Available</div>").appendTo(headerTopAv);	
		$("<div class='fp-extension-sub-heading'>See the top available players in your league</div>").appendTo(headerTopAv);

		headerTopAv.find(".fp-extension-logo").click(function(){
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'FP Icon Click'});
		});
		headerTopAv.find(".fp-extension-settings").click(function(){
			$(".fp-extension-premium-advice").hide();
			$("#fpPanelMain").hide();
			$("#fpPanelSettings").show();
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'Click Settings'});
		});
		headerTopAv.find(".fp-extension-close").click(function(){
			$("#fpExtensionPanelContainer").hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'Hide Extension Panel'});
		});
	}

	var bodyTopAv = $("<div class='fp-extension-body'></div>");
	bodyTopAv.appendTo(panelTopAv);
	
	if (jsonPeriods.length > 1){
		var select = $("<select class='fp-extension-selector'></select>");
		select.appendTo(bodyTopAv);
		for (var k=0; k< jsonPeriods.length; k++){
			$("<option value='" + k + "'></option>").text(jsonPeriods[k].period).appendTo(select);
		}
		select.change(function(evt){
			var selection = Number(evt.target.value);
			$(".fp-extension-period").each(function (idx){
				if (selection == idx){
					$(this).show();
				} else {
					$(this).hide();
				}
			});

			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'Click ' + evt.target.options[evt.target.selectedIndex].text});
		});
	}

	for (var k=0; k< jsonPeriods.length; k++){
		var periodDiv = $("<div class='fp-extension-period'></div>");
		periodDiv.appendTo(bodyTopAv);
		if (k != 0){
			periodDiv.hide();
		}
		
		for (var i=0; i< jsonPeriods[k].rankings.length; i++){
			
			var section = $("<div class='fp-extension-section'></div>");
			section.appendTo(periodDiv);	
		
			$("<div class='fp-extension-section-heading'></div>").text("Top " + jsonPeriods[k].rankings[i].position + "s").appendTo(section);
			var list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(section);		
			$("<div class='fp-extension-section-list-header'>" +
					"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
					"<div class='fp-extension-section-list-header-right-small'>ADD</div>" +
					"<div class='fp-extension-section-list-header-right-small'>ECR</div>" +
					"<div style='clear:both'></div></div>").appendTo(list);
			var playerCount = 0;
			for (var j=0; j<jsonPeriods[k].rankings[i].free_agents.length; j++){
				var playerData = jsonPeriods[k].rankings[i].free_agents[j];
				if (playerCount > 0){
					$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
				}
				playerCount++;
				createPlayerCard(playerData, playerData, 'TopAv').appendTo(list);
			}
		}
	}
	
	bodyTopAv.addClass("fp-extension-body-with-cta");
	var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
	ctaDiv.appendTo(panelTopAv);
	
	var btn = $("<a class='fp-btn-primary fp-btn-x-large' target='_blank'>View More Details</a>");
	btn.attr("href", "https://www.fantasypros.com/nfl/myplaybook/available-players.php?key=" + leagueData[6]);
	btn.click(function(){
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Top Available View', 'action' : 'Click View More Detail'});
	});
	btn.appendTo(ctaDiv);
}

function fetchTopAvailable(leagueData, forceRefresh){
	var url = "https://mpbnfl.fantasypros.com/api/getLeagueAdviceJSON?top_available=Y&key=" + leagueData[6];	
	if (forceRefresh){
		url += "&refresh=Y";
	}
    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache': !forceRefresh}, 
    	function(result){
    		$(".fp-extension-loading").remove();
	    	if (result && result.top_available){
	    		showTopAvailable(leagueData, result.top_available);
	    	}
	    }
    );
}


function showWaiverAdvice(leagueData, json, addedPlayerId, droppedPlayerId){

	chrome.storage.sync.get({
	    displayAdvice: true
	  }, function(items) {
		  if (items.displayAdvice){
			  $("#fpExtensionPanelContainer").show();
			  chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Waiver View', 'action' : 'View Waiver Panel'});
		  } else if ($("#fpExtensionPanelContainer").is(":visible") == false){
			  chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': '1'});
		  }
	  });
	
	$("#fpPanelMain").hide();
	$("#fpPanelSettings").hide();
	
	var panelWA;
	if ($("#fpPanelWA").get(0)){
		panelWA = $("#fpPanelWA");
		panelWA.show();
		panelWA.find(".fp-extension-body").remove();
		panelWA.find(".fp-extension-btn-div").remove();
	} else {
		var panelContainer = $("#fpExtensionPanelContainer");
		panelWA = $("<div id='fpPanelWA' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelWA.appendTo(panelContainer);
		
		var headerWA = $("<div class='fp-extension-header'></div>");
		headerWA.appendTo(panelWA);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_WA&utm_content=FP_Icon'></a>").appendTo(headerWA);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerWA);
		$("<div class='fp-extension-heading'>Waiver Assistant</div>").appendTo(headerWA);	
		$("<div class='fp-extension-sub-heading'>Find out which players to add and drop</div>").appendTo(headerWA);

		headerWA.find(".fp-extension-logo").click(function(){
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Waiver View', 'action' : 'FP Icon Click'});
		});
		headerWA.find(".fp-extension-settings").click(function(){
			$(".fp-extension-premium-advice").hide();
			$("#fpPanelMain").hide();
			$("#fpPanelSettings").show();
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Waiver View', 'action' : 'Click Settings'});
		});
		headerWA.find(".fp-extension-close").click(function(){
			$("#fpExtensionPanelContainer").hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Waiver View', 'action' : 'Hide Extension Panel'});
		});
	}

	var bodyWA = $("<div class='fp-extension-body'></div>");
	bodyWA.appendTo(panelWA);

	var section = $("<div class='fp-extension-section'></div>");
	section.appendTo(bodyWA);
	$("<div class='fp-extension-section-heading'>Summary</div>").appendTo(section);	
	var list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);

	var impactWeekly = undefined;
	var impactROS = undefined;
	if (json.weekly && json.weekly.powerRankings && json.weekly.powerRankings.after){
		for (var i=0; i<json.weekly.powerRankings.after.length; i++){
			var team = json.weekly.powerRankings.after[i];
			if (typeof(team.change_percent) != "undefined"){
				impactWeekly = team.change_percent;
				break;
			}
		}
	}
	if (json.ros && json.ros.powerRankings && json.ros.powerRankings.after){
		for (var i=0; i<json.ros.powerRankings.after.length; i++){
			var team = json.ros.powerRankings.after[i];
			if (typeof(team.change_percent) != "undefined"){
				impactROS = team.change_percent;
				break;
			}
		}
	}

	if (typeof(impactWeekly) != "undefined"){
		var formatted = parseFloat(Math.round(impactWeekly * 10) / 10).toFixed(1)
		var item = $("<div class='fp-extension-section-list-item fp-item-impact'></div>");
		item.appendTo(list);
		$("<div class='fp-item-player-percent " + (impactWeekly > 0 ? "fp-green-col" : impactWeekly < 0 ? "fp-red-col" : "") + "'>" + 
				(impactWeekly >= 0 ? '+' : '') + formatted + "%</div>").appendTo(item);
		$("<div class='fp-item-league'>" + json.weekly.title + "</div>").appendTo(item);
		$("<div class='fp-item-team'>Starting Lineup</div>").appendTo(item);
		$("<div style='clear:both'></div>").appendTo(item);
	}

	if (typeof(impactROS) != "undefined"){
		if (typeof(impactWeekly) != "undefined"){
			$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
		}
		var formatted = parseFloat(Math.round(impactROS * 10) / 10).toFixed(1)
		var item = $("<div class='fp-extension-section-list-item fp-item-impact'></div>");
		item.appendTo(list);
		$("<div class='fp-item-player-percent " + (impactROS > 0 ? "fp-green-col" : impactROS < 0 ? "fp-red-col" : "") + "'>" + 
				(impactROS >= 0 ? '+' : '') + formatted + "%</div>").appendTo(item);
		$("<div class='fp-item-league'>" + json.ros.title + "</div>").appendTo(item);
		$("<div class='fp-item-team'>Power Rankings</div>").appendTo(item);
		$("<div style='clear:both'></div>").appendTo(item);
	}
	
	section = $("<div class='fp-extension-section'></div>");
	section.appendTo(bodyWA);	
	$("<div class='fp-extension-section-heading'>Adding</div>").appendTo(section);
	list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);		
	$("<div class='fp-extension-section-list-header'>" +
			"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
			"<div class='fp-extension-section-list-header-right-small'>ROS</div>" +
			"<div class='fp-extension-section-list-header-right-small'>" + json.weekly.title + "</div>" +
			"<div style='clear:both'></div></div>").appendTo(list);
	createPlayerCard(
			{'fpId':addedPlayerId, 'ecrROS':json.ros.playerValues.team1Adds[0].ecr, 'ecrWeekly':json.weekly.playerValues.team1Adds[0].ecr}, 
			PLAYER_CACHE.players[addedPlayerId], 
			'WA'
		).appendTo(list);
	
	section = $("<div class='fp-extension-section'></div>");
	section.appendTo(bodyWA);	
	$("<div class='fp-extension-section-heading'>Dropping</div>").appendTo(section);
	list = $("<div class='fp-extension-section-list'></div>");
	list.appendTo(section);		
	$("<div class='fp-extension-section-list-header'>" +
			"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
			"<div class='fp-extension-section-list-header-right-small'>ROS</div>" +
			"<div class='fp-extension-section-list-header-right-small'>" + json.weekly.title + "</div>" +
			"<div style='clear:both'></div></div>").appendTo(list);
	
	createPlayerCard(
			{'fpId':droppedPlayerId, 'ecrROS':json.ros.playerValues.team1Drops[0].ecr, 'ecrWeekly':json.weekly.playerValues.team1Drops[0].ecr}, 
			PLAYER_CACHE.players[droppedPlayerId], 
			'WA'
		).appendTo(list);

	bodyWA.addClass("fp-extension-body-with-cta");
	var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
	ctaDiv.appendTo(panelWA);
	
	var btn = $("<a class='fp-btn-primary fp-btn-x-large' target='_blank'>View Detailed Analysis</a>");
	btn.attr("href", "https://www.fantasypros.com/nfl/myplaybook/waiver-wire-assistant.php?key=" + leagueData[6] + "&waiver=1&team1Adds=" + addedPlayerId + "&team1Drops=" + droppedPlayerId);
	btn.click(function(){
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Waiver View', 'action' : 'Click View Detailed Analysis'});
	});
	btn.appendTo(ctaDiv);

}


function showTradeAdvice(leagueData, json, tradeConfig){

	chrome.storage.sync.get({
	    displayAdvice: true
	  }, function(items) {
		  if (items.displayAdvice){
			  $("#fpExtensionPanelContainer").show();
			  chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'View Trade Panel'});
		  } else if ($("#fpExtensionPanelContainer").is(":visible") == false){
			  chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': '1'});
		  }
	  });
	
	$("#fpPanelMain").hide();
	$("#fpPanelSettings").hide();
	
	var panelTA;
	if ($("#fpPanelTA").get(0)){
		panelTA = $("#fpPanelTA");
		panelTA.show();
		panelTA.find(".fp-extension-body").remove();
		panelTA.find(".fp-extension-btn-div").remove();
	} else {
		var panelContainer = $("#fpExtensionPanelContainer");
		panelTA = $("<div id='fpPanelTA' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelTA.appendTo(panelContainer);
		
		var headerTA = $("<div class='fp-extension-header'></div>");
		headerTA.appendTo(panelTA);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_TA&utm_content=FP_Icon'></a>").appendTo(headerTA);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerTA);
		$("<div class='fp-extension-heading'>Trade Analyzer</div>").appendTo(headerTA);	
		$("<div class='fp-extension-sub-heading'>Evaluate any trade offer in seconds</div>").appendTo(headerTA);

		headerTA.find(".fp-extension-logo").click(function(){
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'FP Icon Click'});
		});
		headerTA.find(".fp-extension-settings").click(function(){
			$(".fp-extension-premium-advice").hide();
			$("#fpPanelMain").hide();
			$("#fpPanelSettings").show();
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'Click Settings'});
		});
		headerTA.find(".fp-extension-close").click(function(){
			$("#fpExtensionPanelContainer").hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'Hide Extension Panel'});
		});
	}

	var bodyTA = $("<div class='fp-extension-body'></div>");
	bodyTA.appendTo(panelTA);

	if (tradeConfig.includesDraftPicks){
		var section = $("<div class='fp-extension-section'></div>");
		section.appendTo(bodyTA);
		var list = $("<div class='fp-extension-section-list'></div>");
		list.appendTo(section);	

		var item = $("<div class='fp-extension-section-list-item fp-item-player'></div>");
		$("<div class='fp-item-player-desc' style='color:#333333'><b>Please Note:</b> Advice in the Trade Analyzer does not take into account future draft picks.</div>").appendTo(item);
		item.appendTo(list);
	}	

	var select = $("<select class='fp-extension-selector'></select>");
	select.appendTo(bodyTA);
	
	var periods = ["ros","weekly","dynasty"];
	for (var k=0; k < periods.length; k++){
		var analysis = json[periods[k]];
		if (analysis && analysis.title){
			$("<option value='" + periods[k] + "'>" + analysis.title + "</option>").appendTo(select);
		}
	}

	select.change(function(evt){
		$(".fp-extension-period").each(function (idx){
			$(this).hide();
		});
		$("#fp-extension-period-" + evt.target.value).show();
		
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'Click ' + evt.target.options[evt.target.selectedIndex].text});
	});
	
	var periods = ["ros","weekly","dynasty"];
	for (var k=0; k < periods.length; k++){
		var analysis = json[periods[k]];
		if (analysis && analysis.powerRankings && analysis.powerRankings.after){

			var periodDiv = $("<div class='fp-extension-period' id='fp-extension-period-" + periods[k] + "'></div>");
			periodDiv.appendTo(bodyTA);
			if (k != 0){
				periodDiv.hide();
			}
	
			var section = $("<div class='fp-extension-section'></div>");
			section.appendTo(periodDiv);
			$("<div class='fp-extension-section-heading'>Summary</div>").appendTo(section);	
			var list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(section);
			
			var impactMine = 0;
			var impactTheirs = 0;
			var theirTeamName = "Their Team";
			for (var i=0; i<analysis.powerRankings.after.length; i++){
				var team = analysis.powerRankings.after[i];
				if (team.teamId == tradeConfig.otherTeamId){
					impactTheirs = team.change_percent;
					theirTeamName = team.teamName;
				} else if (team.teamId == getTeamId()){
					impactMine = team.change_percent;
				}
			}
	
			var formatted = parseFloat(Math.round(impactMine * 10) / 10).toFixed(1)
			var item = $("<div class='fp-extension-section-list-item fp-item-impact'></div>");
			item.appendTo(list);
			$("<div class='fp-item-player-percent " + (impactMine > 0 ? "fp-green-col" : impactMine < 0 ? "fp-red-col" : "") + "'>" + 
					(impactMine >= 0 ? '+' : '') + formatted + "%</div>").appendTo(item);
			$("<div class='fp-item-league'>" + leagueData[2] + "</div>").appendTo(item);
			$("<div class='fp-item-team'>Power Rankings</div>").appendTo(item);
			$("<div style='clear:both'></div>").appendTo(item);

			$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
			
			var formatted = parseFloat(Math.round(impactTheirs * 10) / 10).toFixed(1)
			var item = $("<div class='fp-extension-section-list-item fp-item-impact'></div>");
			item.appendTo(list);
			$("<div class='fp-item-player-percent " + (impactTheirs > 0 ? "fp-green-col" : impactTheirs < 0 ? "fp-red-col" : "") + "'>" + 
					(impactTheirs >= 0 ? '+' : '') + formatted + "%</div>").appendTo(item);
			$("<div class='fp-item-league'>" + theirTeamName + "</div>").appendTo(item);
			$("<div class='fp-item-team'>Power Rankings</div>").appendTo(item);
			$("<div style='clear:both'></div>").appendTo(item);

			
			section = $("<div class='fp-extension-section'></div>");
			section.appendTo(periodDiv);	
			$("<div class='fp-extension-section-heading'>You Get</div>").appendTo(section);
			list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(section);		
			$("<div class='fp-extension-section-list-header'>" +
					"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
					"<div class='fp-extension-section-list-header-right-small' style='margin-right:15px'>ECR</div>" +
					"<div style='clear:both'></div></div>").appendTo(list);
			
			for (var j=0; j < analysis.playerValues.team1Gets.length; j++){
				if (j > 0){
					$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
				}
				var fpId = analysis.playerValues.team1Gets[j].id;
				createPlayerCard(
						{'fpId':fpId, 'ecr': analysis.playerValues.team1Gets[j].ecr}, 
						PLAYER_CACHE.players[fpId], 
						'TA'
					).appendTo(list);
			}
			
			section = $("<div class='fp-extension-section'></div>");
			section.appendTo(periodDiv);	
			$("<div class='fp-extension-section-heading'>They Get</div>").appendTo(section);
			list = $("<div class='fp-extension-section-list'></div>");
			list.appendTo(section);		
			$("<div class='fp-extension-section-list-header'>" +
					"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
					"<div class='fp-extension-section-list-header-right-small' style='margin-right:15px'>ECR</div>" +
					"<div style='clear:both'></div></div>").appendTo(list);
						
			for (var j=0; j < analysis.playerValues.team2Gets.length; j++){
				if (j > 0){
					$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
				}
				var fpId = analysis.playerValues.team2Gets[j].id;
				createPlayerCard(
						{'fpId':fpId, 'ecr': analysis.playerValues.team2Gets[j].ecr}, 
						PLAYER_CACHE.players[fpId], 
						'TA'
					).appendTo(list);
			}
			
			if (analysis.playerValues.team1Drops && analysis.playerValues.team1Drops.length){				
				section = $("<div class='fp-extension-section'></div>");
				section.appendTo(periodDiv);	
				$("<div class='fp-extension-section-heading'>You Drop</div>").appendTo(section);
				list = $("<div class='fp-extension-section-list'></div>");
				list.appendTo(section);		
				$("<div class='fp-extension-section-list-header'>" +
						"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
						"<div class='fp-extension-section-list-header-right-small' style='margin-right:15px'>ECR</div>" +
						"<div style='clear:both'></div></div>").appendTo(list);
							
				for (var j=0; j < analysis.playerValues.team1Drops.length; j++){
					if (j > 0){
						$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
					}
					var fpId = analysis.playerValues.team1Drops[j].id;
					createPlayerCard(
							{'fpId':fpId, 'ecr': analysis.playerValues.team1Drops[j].ecr}, 
							PLAYER_CACHE.players[fpId], 
							'TA'
						).appendTo(list);
				}
			}

			if (analysis.playerValues.team2Drops && analysis.playerValues.team2Drops.length){				
				section = $("<div class='fp-extension-section'></div>");
				section.appendTo(periodDiv);	
				$("<div class='fp-extension-section-heading'>They Drop</div>").appendTo(section);
				list = $("<div class='fp-extension-section-list'></div>");
				list.appendTo(section);		
				$("<div class='fp-extension-section-list-header'>" +
						"<div class='fp-extension-section-list-header-left'>PLAYER</div>" +
						"<div class='fp-extension-section-list-header-right-small' style='margin-right:15px'>ECR</div>" +
						"<div style='clear:both'></div></div>").appendTo(list);
							
				for (var j=0; j < analysis.playerValues.team2Drops.length; j++){
					if (j > 0){
						$("<div class='fp-extension-section-list-divider'></div>").appendTo(list);
					}
					var fpId = analysis.playerValues.team2Drops[j].id;
					createPlayerCard(
							{'fpId':fpId, 'ecr': analysis.playerValues.team2Drops[j].ecr}, 
							PLAYER_CACHE.players[fpId], 
							'TA'
						).appendTo(list);
				}
			}
			
		}
	}
	
	bodyTA.addClass("fp-extension-body-with-cta");
	var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
	ctaDiv.appendTo(panelTA);
	var btn = $("<a class='fp-btn-primary fp-btn-x-large' target='_blank'>View Detailed Analysis</a>");
	btn.attr("href", "https://www.fantasypros.com/nfl/myplaybook/trade-analyzer.php?" + 
			"key=" + leagueData[6] + 
			"&team2Id=" + tradeConfig.otherTeamId +
			"&team2Gets=" + tradeConfig.tradeAway.join(",") +
			"&team1Gets=" + tradeConfig.tradeFor.join(",") +
			"&period=ros" + 
			"&team1Adds=" +
			"&team1Drops=" + (tradeConfig.dropMine ? tradeConfig.dropMine.join(",") : "") +
			"&team2Adds=" + 
			"&team2Drops=" + (tradeConfig.dropTheirs ? tradeConfig.dropTheirs.join(",") : "")
	);
	btn.click(function(){
		chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Trade View', 'action' : 'Click View Detailed Analysis'});
	});
	btn.appendTo(ctaDiv);

}

function excludeSite(){
	if($("#exclusionInput").val()){

		chrome.runtime.sendMessage({'cmd':'addToBlackList', 'site':$("#exclusionInput").val()}, function(result){   
			fillExclusionList(result);
		});
		
		$("#exclusionInput").val("");
		$("#excludeForm").removeClass("fp-valid");
	}
}

function fillExclusionList(result){	
	$("#exclusionList").html("");
    for (var i=0; i<result.length; i++){
    	var site = result[i];

		var item = $("<div class='fp-extension-section-list-item fp-extension-excluded-site'></div>");
		item.appendTo($("#exclusionList"));
    	var span = $("<span></span>");
    	span.text(site);
    	span.appendTo(item);
		
		var trashIcon = $("<div class='fp-extension-trash-button' title='Remove from excluded sites'></div>");
		trashIcon.appendTo(item);
		
		trashIcon.click(function(){
			chrome.runtime.sendMessage({'cmd':'removeFromBlackList', 'site':$(this).parent().find("span").html()}, function(result){   
				fillExclusionList(result);
			});
		});

		$("<div class='fp-extension-section-list-divider'></div>").appendTo($("#exclusionList"));		
    }	
}
