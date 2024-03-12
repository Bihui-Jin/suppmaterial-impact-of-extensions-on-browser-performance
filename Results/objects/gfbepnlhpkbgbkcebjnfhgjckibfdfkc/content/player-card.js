
window.playercardGenerator = (function () {

	var $ = pickemfirst_lib;
	var USE_HTTPS = document.location.href.toLowerCase().indexOf('https') != -1;  
	var FP_LOGIN = 'https://secure.fantasypros.com/accounts/login/';
	var GB_PLAYER_AVAILABLE=1,
	    GB_PLAYER_UNAVAILABLE=2,
	    GB_PLAYER_INTEAM=3,
	    GB_LEAGUE_STARRED=4,
	    BASIC='B',
	    PREMIUM='P',
	    ADMIN='A',
	    TEAM_INDEX = 1,
	    PLAYER_ID = 0;

	var RESET_BP_STORAGE = false;

	var isInitialized=false;
	var isResearchAssistant = false; 
	var isPlayerCards = true;
	var isChromeExtension = false;

	var getFpPageOption = function(o){
		   return o && window.PLAYERCARDS_CONFIG ? window.PLAYERCARDS_CONFIG[o] : undefined;
	}; 
	
	var sport = getFpPageOption('sport') || window.pfsport || 'mlb';

	var bp_geo_pc, bp_user_loc, bp_markets, bp_events, bp_previous_events, bp_books, bp_locations, bp_schedule;
	var isBP = getFpPageOption('mode') == 'BP';
	
	var current_player_file_name = '';
	
	var sports_data = {};
	
	function getSportData(){
		return sports_data[sport];
	}
	  
	var isTopFrame = function(){        
	    return window == top;
	};

	function loadingGif(){
		var loadingGif =
			$.fromTemplate(["article",{"children":[["div",{"class":"fp-pc__loading-gif-container"}]],"id":"fp-player-card","data-js-listener":"fp-js-remove-player-card","class":"fp-player-card fp-pc fp-pc__container"}]);

		showPlayerCard(loadingGif);	

	}

	function addIframePositioning(iframeClick, contentContainer) {
		var pc_position;
//		console.log('clientY: ' + iframeClick.clientY );
//		console.log('screenY: ' + iframeClick.screenY );
//		console.log('window.outerHeight: ' + window.outerHeight );

			if ( window.outerWidth > 668) {
				if ( (iframeClick.screenY - iframeClick.clientY > 0) && (iframeClick.screenY - iframeClick.clientY < 660) ) {
					pc_position = 'top: 20px;';
				} else if ((window.outerHeight - iframeClick.screenY) < 320){
					pc_position = 'top: auto; bottom: 20px;';
				} else if ( (iframeClick.clientY > ( iframeClick.outerHeight - 660)) ) {
					pc_position = 'top: ' + iframeClick.clientY + 'px;';
				} else {
					var pc_calc = '640';
					pc_position = 'top: auto; bottom: ' + pc_calc + 'px;';
				}
				$.setStyle(contentContainer, pc_position);
				removeIterators();
			}
	}

	function removeIterators() {
		$.remove(document.getElementById('fp-pc__previous'));
		$.remove(document.getElementById('fp-pc__next'));
	}

	function emptyPlayerCard(){		
		var existingCard = document.getElementById("fp-player-card");
		if (existingCard) { 
			existingCard.parentNode.removeChild(existingCard);
		}
	}

	function buildPlayerCard(p, cardTab, iframeClick, hideIterators){

		var player_position = p.player_positions;
		if (player_position && player_position.constructor === Array){
			player_position = player_position[0];
		}
		if (!player_position){
			player_position = "";
		}
		
		var rank_ecr, rank_min, rank_max, rank_adp, rank_ecr_pos,ecr_prefix='';
		if ( p.rankings ) {			
			if (!getFpPageOption("isDraftRoom") && getSportData() && getSportData().inSeason && p.rankings.rank_ecr_ros){				
				rank_ecr = p.rankings.rank_ecr_ros ? p.rankings.rank_ecr_ros : "-";
				rank_min = p.rankings.rank_ecr_min_ros ? p.rankings.rank_ecr_min_ros : "-";
				rank_max = p.rankings.rank_ecr_max_ros ? p.rankings.rank_ecr_max_ros : "-";
				var ecr_pos = p.rankings.ecr_pos_ros || player_position;
				rank_ecr_pos = p.rankings.rank_ecr_pos_ros ? (ecr_pos + p.rankings.rank_ecr_pos_ros) : "-";
				ecr_prefix='ROS ';
			} else {				
				rank_ecr = p.rankings.rank_ecr ? p.rankings.rank_ecr : "-";
				rank_min = p.rankings.rank_ecr_min ? p.rankings.rank_ecr_min : "-";
				rank_max = p.rankings.rank_ecr_max ? p.rankings.rank_ecr_max : "-";
				var ecr_pos = p.rankings.ecr_pos || player_position;
				rank_ecr_pos = p.rankings.rank_ecr_pos ? (ecr_pos + p.rankings.rank_ecr_pos) : "-";
			}			
			rank_adp = p.rankings.rank_adp ? p.rankings.rank_adp : "-";
		} else {
			rank_ecr = "-";
			rank_min = "-";
			rank_max = "-";
			rank_adp = "-";
			rank_ecr_pos  = "-";
		}
		if (typeof rank_ecr === 'object'){
			rank_ecr = "-";
		}
		if (typeof rank_min === 'object'){
			rank_min = "-";
		}
		if (typeof rank_max === 'object'){
			rank_max = "-";
		}
		if (typeof rank_adp === 'object'){
			rank_adp = "-";
		}
		if (typeof rank_ecr_pos === 'object'){
			rank_ecr_pos = "-";
		}

		var adDiv = buildAdDiv();		
		var isFooterVisibleClass;
		if (adDiv != "") {
			footer = adDiv;				
			isFooterVisible = false;			
		} else {
			footer = buildFooter();
			isFooterVisible = footer.isFooterVisible;
		}
		
		var playerCard =
			$.fromTemplate(["article",{"children":[["div",{"children":[["button",{"children":[["img",{"src":"https://cdn.fantasypros.com/playercards/skin/prev-next-90x132.png","width":"35","height":"51","alt":""}]],"id":"fp-pc__previous","data-js-link":"prev","aria-label":"Previous player card","class":"fp-pc__card-iterator fp-pc__card-iterator--prev"}],["button",{"children":[["img",{"src":"https://cdn.fantasypros.com/playercards/skin/prev-next-90x132.png","width":"35","height":"51","alt":""}]],"id":"fp-pc__next","data-js-link":"next","aria-label":"Next player card","class":"fp-pc__card-iterator fp-pc__card-iterator--next"}]],"class":"fp-pc__card-iterators"}],["div",{"children":[["header",{"children":[["a",{"href":(addAffiliateCode(p.player_page_url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickPlayerImage')","class":"fp-pc__link fp-pc__headshot-container"}],["div",{"children":[["h1",{"children":[(p.player_name),["span",{"children":["Player Card"],"style":"display:none"}]],"id":"fp-player-card-title","class":"fp-pc__player-name"}],["div",{"children":["Latest News, Notes and Stats for ",(p.player_name)],"id":"fp-player-card-description","style":"display:none"}],["p",{"children":[["span",{"children":[(player_position)],"class":"fp-pc__player-positions"}]," - ",["span",{"children":[(p.player_team)],"class":"fp-pc__player-team"}]],"class":"fp-pc__player-details"}],["button",{"children":[["span",{"children":["X"],"data-js-listener":"fp-js-remove-player-card","aria-hidden":"true"}]],"type":"button","aria-label":"Close","data-js-listener":"fp-js-remove-player-card","class":"fp-pc__close-button"}]],"class":"fp-pc__header--demographics"}],["div",{"children":[["table",{"children":[["colgroup",{"children":[["col",{"class":"fp-pc__col"}],["col",{"class":"fp-pc__col"}],["col",{"class":"fp-pc__col"}],["col",{"class":"fp-pc__col"}]]}],["thead",{"children":[["tr",{"children":[["th",{"children":[(ecr_prefix),"ECR"],"scope":"col"}],["th",{"children":["Best"],"scope":"col"}],["th",{"children":["Worst"],"scope":"col"}],["th",{"children":["ADP"],"scope":"col","class":"fp-pc__th--adp"}]]}]],"class":"fp-pc__thead fp-pc__thead--draft"}],["tbody",{"children":[["tr",{"children":[["td",{"children":[(rank_ecr)],"class":"fp-pc__td fp-pc__td--ecr"}],["td",{"children":[(rank_min)],"class":"fp-pc__td fp-pc__td--best"}],["td",{"children":[(rank_max)],"class":"fp-pc__td fp-pc__td--worst"}],["td",{"children":[(rank_adp)],"class":"fp-pc__td fp-pc__td--adp"}]]}]],"class":"fp-pc__tbody fp-pc__tbody--draft"}]],"class":"fp-pc__table"}]],"class":"fp-pc__header--key-stats"}]],"class":"fp-pc__header"}],["div",{"children":[["div",{"children":[["ul",{"children":[["li",{"children":[["a",{"children":["Overview"],"data-js-link":"overview","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--active fp-pc__link--overview"}]],"class":"fp-pc__li"}],["li",{"children":[["a",{"children":["News"],"data-js-link":"news","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--news"}]],"class":"fp-pc__li"}],["li",{"children":[["a",{"children":["Notes"],"data-js-link":"notes","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--notes"}]],"class":"fp-pc__li"}],["li",{"children":[["a",{"children":["Stats"],"data-js-link":"stats","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--stats"}]],"class":"fp-pc__li"}],["li",{"children":[["a",{"children":["Games"],"data-js-link":"games","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--games"}]],"class":"fp-pc__li"}]],"class":"fp-pc__list fp-pc__list--nav"}]],"class":"fp-pc__nav"}],["div",{"children":[["div",{"class":"fp-pc__featured fp-pc__featured--active"}],["section",{"class":"fp-pc__tab fp-pc__tab--active fp-pc__tab--overview gb_skip"}],["section",{"class":"fp-pc__tab fp-pc__tab--news gb_skip"}],["section",{"class":"fp-pc__tab fp-pc__tab--notes gb_skip"}],["section",{"class":"fp-pc__tab fp-pc__tab--stats gb_skip"}],["section",{"class":"fp-pc__tab fp-pc__tab--games gb_skip"}],["section",{"class":"fp-pc__tab fp-pc__tab--props gb_skip"}],["section",{"children":[["ul",{"class":"fp-pc__ul-leagues"}]],"class":"fp-pc__tab fp-pc__tab--mpb-leagues gb_skip"}],["section",{"children":[["select",{"id":"bp-offers-locations-select","class":"fp-pc__tab-select"}],["div",{"class":"fp-pc__tab--bp-offers-container"}]],"class":"fp-pc__tab fp-pc__tab--bp-offers gb_skip"}]],"class":"fp-pc__tabs"}]],"class":"fp-pc__main"}],["div",{"children":[["a",{"children":[" View Full Profile ",["span",{"children":[["img",{"src":"https://cdn.fantasypros.com/playercards/skin/carat-18x28.png","width":"9","height":"14","alt":""}]],"class":"fp-pc__carat"}]],"href":(addAffiliateCode(p.player_page_url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewFullProfile')","tabindex":"0","class":"fp-pc__link"}]],"class":"fp-pc__profile-link"}],(footer)],"class":"fp-pc__content-container"}]],"id":"fp-player-card","data-js-listener":"fp-js-remove-player-card","role":"dialog","aria-labelledby":"fp-player-card-title","aria-describedby":"fp-player-card-description","class":"fp-player-card fp-pc fp-pc__container"}]);

		var headshotContainer = $.find(playerCard,'.fp-pc__headshot-container')[0];
		if (player_position == 'DEF' || player_position == 'DST'){
			var player_txt = $.fromTemplate(["div",{"children":[(p.player_team)],"class":"fp-pc__team-txt fp-pc__headshot"}]);
			headshotContainer.appendChild(player_txt);
			$.addClass(player_txt, 'nfl-' + p.player_team.toLowerCase());			
		} else {
			var player_img_250 = p.player_image_url_250 ? p.player_image_url_250 : 
				"//images.fantasypros.com/images/players/" + sport + "/missing/headshot/250x250.png";
			var alt = p.player_name;
			var player_img = $.fromTemplate(["img",{"src":(player_img_250),"alt":(alt),"class":"fp-pc__headshot"}]);
			headshotContainer.appendChild(player_img);
		}
		if (sport == 'nfl'){
			if (isBP){
				var matchup_opp = "";;
				if (p.player_bye && p.player_bye == p.week){
					matchup_opp = "BYE";
				} else if (p.matchup && p.matchup.opponent){
					if (p.matchup.location == " at "){
						matchup_opp = "@";
					} else if (p.matchup.location == " vs. "){
						matchup_opp = "vs ";
					}
					matchup_opp += p.matchup.opponent;
				}
				var playerBye =
					$.fromTemplate(["span",{"children":[(matchup_opp)],"class":"fp-pc__player-bye"}]);
				$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerBye);
			
			} else if(p.player_bye && p.player_bye != 'n/a'){
				var playerBye =
					$.fromTemplate(["span",{"children":["BYE ",(p.player_bye)],"class":"fp-pc__player-bye"}]);
				$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerBye);
			}
		} else if (sport == 'mlb'){
			if (p.bat_hand){
				var playerBat =
					$.fromTemplate(["span",{"children":["Bats: ",(p.bat_hand)],"class":"fp-pc__player-bye"}]);
				$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerBat);
			}
			if (p.throw_hand){
				var playerThrow =
					$.fromTemplate(["span",{"children":["Throws: ",(p.throw_hand)],"class":"fp-pc__player-bye"}]);
				$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerThrow);
			}
		}
		if (p.player_status && p.player_status.toLowerCase() != 'active'){
			var status_tooltip = p.status_note || p.status_type;
			var playerSatus =
				$.fromTemplate(["span",{"children":[(p.player_status)],"title":(status_tooltip),"class":"fp-pc__player-status"}]);
			$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerSatus);
		}
		
		if (isBP){

			var keyStatsDiv = $.find(playerCard,'.fp-pc__header--key-stats')[0];
			$.empty(keyStatsDiv); 
			
		} else if(!getFpPageOption("isDraftRoom") && getSportData() && getSportData().inSeason){
			
			if (sport == 'nfl'){
				var keyStatsDiv = $.find(playerCard,'.fp-pc__header--key-stats')[0];
				$.empty(keyStatsDiv); 
	
				var matchup_opp = "";;
				var matchup_time = "";
				var matchup_label = "";
				var matchup_stars = 0;
				var matchup_text = "";
				if (p.player_bye && p.player_bye == p.week){
					matchup_time = "Week " + p.week;
					matchup_opp = "BYE";
				} else if (p.matchup && p.matchup.opponent){
					if (p.matchup.location == " at "){
						matchup_opp = "@";
					} else if (p.matchup.location == " vs. "){
						matchup_opp = "vs ";
					}
					matchup_opp += p.matchup.opponent;
					
					matchup_text = p.matchup.matchup_text;
					
					if (p.matchup.scheduled_start){
						
						var d = new Date(Number(p.matchup.scheduled_start) * 1000);
						var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
						matchup_time = DAYS[d.getDay()] + ' ';
						var ampm = ' am';
						if (d.getHours() > 12){
							matchup_time += (d.getHours() - 12) + ':';
							ampm = 'pm';
						} else {
							matchup_time += d.getHours() + ':';
							if (d.getHours() == 12) {
								ampm = 'pm';
							}
						}
						if (d.getMinutes() < 10){
							matchup_time += '0';
						}
						matchup_time += d.getMinutes() + ' ' + ampm;	
					}

					if (p.matchup.matchup_stars){
						matchup_label = "Matchup";
						matchup_stars = Number(p.matchup.matchup_stars);
					}
				}
				
		    	var ecrTable =
		    		$.fromTemplate(["table",{"children":[["colgroup",{"children":[["col",{"class":"fp-pc__col"}]]}],["thead",{"children":[["tr",{"children":[["th",{"children":["ECR"],"scope":"col"}],["th",{"children":[(matchup_time)],"scope":"col"}],["th",{"children":[(matchup_label)],"scope":"col","class":"fp-pc__th--stars"}]]}]],"class":"fp-pc__thead fp-pc__thead--draft"}],["tbody",{"children":[["tr",{"children":[["td",{"children":[(rank_ecr_pos)],"class":"fp-pc__td fp-pc__td--ecr"}],["td",{"children":[(matchup_opp)],"class":"fp-pc__td fp-pc__td--matchup"}],["td",{"title":(matchup_text),"class":"fp-pc__td fp-pc__td--stars"}]]}]],"class":"fp-pc__tbody fp-pc__tbody--draft"}]],"class":"fp-pc__table"}]);
			    keyStatsDiv.appendChild(ecrTable);	
				
				var stars_td = $.find(playerCard, '.fp-pc__td--stars')[0];
				if (matchup_stars){

					if (matchup_stars >= 3.8){
						$.addClass($.find(playerCard, '.fp-pc__td--matchup')[0], 'fp-pc__td-easy');
		    		} else if (matchup_stars > 0 && matchup_stars <= 2.2){
						$.addClass($.find(playerCard, '.fp-pc__td--matchup')[0], 'fp-pc__td-hard');
		    		}
					matchup_stars = Math.round(matchup_stars);
					
					for (var k=1; k<=5; k++){
						var star_src = 'https://cdn.fantasypros.com/bookmarklet/skin/' + (k<=matchup_stars?'blue':'gray') + 'star.png'
				    	var star =
				    		$.fromTemplate(["img",{"src":(star_src)}]);
						stars_td.appendChild(star);	
					}
				}
				
				if (p.matchup && p.matchup.weather){
					buildWeatherModule(p.matchup.weather, ecrTable);
				}
				
			} else if (rank_adp == "-"){
				$.empty($.find(playerCard,'.fp-pc__th--adp')[0]); 
				$.empty($.find(playerCard,'.fp-pc__td--adp')[0]); 
				
			}
			
	    	var overviewDiv = $.find(playerCard, '.fp-pc__tab--overview')[0];	
			$.empty(overviewDiv); 
			
			var leagueCount = getSportData().privateList && getSportData().privateList.leagues ?
					getSportData().privateList.leagues.length : 0;
	    	if ((isResearchAssistant || isChromeExtension) && getSportData().privateList.requiresUpgrade) {
		    	var ownershipDiv =
		    		$.fromTemplate(["div",{"children":[["p",{"class":"fp-pc__ownership_summary"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
		    	overviewDiv.appendChild(ownershipDiv);	
		      	var ownershipSummary = $.find(playerCard,'.fp-pc__ownership_summary')[0];
		    	
		        setUpgradePopup(ownershipSummary, 
	        		'PRO',
	        		addAffiliateCode('https://secure.fantasypros.com/plans/?sport=' + getSportData().sport + '&type=mpb')); 
		        
	  	    } else if (getSportData().privateList.logged===false) {
		    	var ownershipDiv =
		    		$.fromTemplate(["div",{"children":[["p",{"class":"fp-pc__ownership_summary"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
		    	overviewDiv.appendChild(ownershipDiv);	
		      	var ownershipSummary = $.find(playerCard,'.fp-pc__ownership_summary')[0];
		      	
		        setLoggedOutPopup(ownershipSummary); 
		        
		    } else if(leagueCount===0){
		    	var ownershipDiv =
		    		$.fromTemplate(["div",{"children":[["p",{"class":"fp-pc__ownership_summary"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
		    	overviewDiv.appendChild(ownershipDiv);	
		      	var ownershipSummary = $.find(playerCard,'.fp-pc__ownership_summary')[0];
		      	
		        setNoLeaguesPopup(ownershipSummary);
		        
		    } else if (leagueCount == 1){

		    	var ownershipDiv =
		    		$.fromTemplate(["div",{"children":[["ul",{"class":"fp-pc__ul-single-league"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
		    	overviewDiv.appendChild(ownershipDiv);	
		    	

		      	var ownershipSummary = $.find(playerCard,'.fp-pc__ul-single-league')[0];
		        var leagues = getSportData().privateList.leagues;
		        ownershipSummary.appendChild(getTeamLi(leagues, leagues[0], 0, p.player_id, false));
		          
		    } else if (leagueCount > 1) {	
				renderLeagues(playerCard, p.player_id);
			}
			
		}
		
		emptyPlayerCard();
		showPlayerCard(playerCard);

		if (getFpPageOption("isDraftRoom")){
			
			if (window.playerMap && window.playerMap[p.player_id] && 
					window.playerMap[p.player_id].tag){
				var tag = window.playerMap[p.player_id].tag;
				var playerTag =
					$.fromTemplate(["span",{"children":[(tag)],"class":"fp-pc__player-tag"}]);
				$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerTag);
				if (window.playerMap[p.player_id].tagId){
					$.addClass(playerTag, 'PlayerTag' + window.playerMap[p.player_id].tagId);
				} else {
					$.addClass(playerTag, 'Player' + tag);
				}
			}

			if (getFpPageOption("showDraftButton")){
				
				if (typeof(ng_playerIsAvailable) == 'function'  && ng_playerIsAvailable(p.player_id) == false){
					// Do not display Draft button
				} else {				
					var draftButton =
						$.fromTemplate(["button",{"children":["Draft"],"type":"button","data-js-listener":"fp-js-remove-player-card","class":"fp-pc__btn fp-pc__btn--draft"}]);
					$.find(playerCard,'.fp-pc__header--key-stats')[0].appendChild(draftButton);
		
					$.listen(draftButton, 'click', function(){
				//		console.log(p.player_id);
						if (typeof(ng_onPlayerDraft) == 'function'){
							ng_onPlayerDraft({id:p.player_id},'Player Card');
						}
					});
				}
			}
		}
		
		if (!isBP && sport == 'nfl' && (player_position == 'RB' || player_position == 'WR' || player_position == 'TE')){

			var scoringToggle =
				$.fromTemplate(["div",{"children":[["button",{"children":["STD"],"type":"button","data-js-scoring":"STD","tabindex":"0","class":"fp-pc__btn fp-pc__btn--scoring fp-pc__btn--STD"}],["button",{"children":["PPR"],"type":"button","data-js-scoring":"PPR","tabindex":"0","class":"fp-pc__btn fp-pc__btn--scoring fp-pc__btn--PPR"}],["button",{"children":["HALF"],"type":"button","data-js-scoring":"HALF","tabindex":"0","class":"fp-pc__btn fp-pc__btn--scoring fp-pc__btn--HALF"}]],"class":"fp-pc_scoring-toggle"}]);
			$.find(playerCard,'.fp-pc__header--key-stats')[0].appendChild(scoringToggle);
			scoringListener();

			if (window.playercards_scoring){
				$.addClass(playerCard, 'fp-player-card-' + window.playercards_scoring);
			}
		}

		if (getFpPageOption("requestPlayerCardAd") && window.requestPlayerCardAd){
			if (playercardGenerator.lastRefreshedAd &&
					(new Date().getTime() - playercardGenerator.lastRefreshedAd) <= 2000 ){
				// do not call requestPlayerCardAd within 2 seconds of previous call
			} else {	
				window.requestPlayerCardAd(!playercardGenerator.playerCardAdRequested);
				playercardGenerator.playerCardAdRequested = true;
				playercardGenerator.lastRefreshedAd = new Date().getTime();
			}
		} else if (typeof googletag != 'undefined' && getFpPageOption("googleAdUnit")){
			googletag.cmd.push(function() { window.googletag.display(getFpPageOption("googleAdUnit")); });
			playercardGenerator.lastRefreshedAd = new Date().getTime();
		}
		

		var contentContainer = $.find(playerCard,'.fp-pc__content-container')[0];
		var tabsContainer = $.find(playerCard,'.fp-pc__tabs')[0];		
		
		if (getFpPageOption('isInIframe')) {
			$.addClass(playerCard, 'fp-pc__container--is-iframe');
			addIframePositioning(iframeClick, contentContainer);
		}

		if ( isFooterVisible ) {
			$.addClass(contentContainer, 'fp-pc__content-container--footer-visible');
			$.addClass(tabsContainer, 'fp-pc__tabs--footer-visible');
		} else if ( !isFooterVisible && adDiv != "" ) {
			$.addClass(contentContainer, 'fp-pc__content-container--ads-visible');
			$.addClass(tabsContainer, 'fp-pc__tabs--ads-visible');
		} else {
			$.addClass(contentContainer, 'fp-pc__content-container--premium-user');
			$.addClass(tabsContainer, 'fp-pc__tabs--premium-user');			
		}

		var overviewDiv = $.find(playerCard, '.fp-pc__tab--overview')[0];
		
		if (typeof FPM !== "undefined" && !getFpPageOption("isDraftRoom")){
			var minuteData = getSportData().playersWithMinuteVideoSL[p.player_id] || getSportData().playersWithMinuteVideoDFS[p.player_id];
			if (minuteData){
				var videoDiv =
					$.fromTemplate(["div",{"children":[["h2",{"children":["Latest Video"],"class":"fp-pc__heading"}],["a",{"children":["Watch Now"],"href":"javascript:void(0)","class":" fp-pc__btn--video"}],["div",{"style":"clear:both"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes"}]);
				overviewDiv.appendChild(videoDiv);
				$.listen($.find(videoDiv,'.fp-pc__btn--video')[0], 'click', function(evt){
		      	  	playMinuteVideo(evt, minuteData[1], p.player_id);
				});
				
			}
		}
		
		if (sport == 'epl' || sport == 'aaf'){
			/*
			var btn =
				$.fromTemplate(["div",{"children":[["a",{"children":[" Open Fantrax Player Page "],"style":"width:220px;margin-bottom:200px","target":"_blank","href":"https://www.fantrax.com/player/02t21/1jom94jmjk74qrxw/sean-morrison","class":" fp-pc__leagues-btn gb_unavailable"}],["div",{"style":"clear:both"}]],"class":"fp-pc__li-team"}]);
			overviewDiv.appendChild(btn);
			*/
		} else {
			renderNotes(p, overviewDiv, true);
			renderNews(p, overviewDiv, true);
		}

		var notesDiv = $.find(playerCard, '.fp-pc__tab--notes')[0];
		var newsDiv = $.find(playerCard, '.fp-pc__tab--news')[0];
		renderNotes(p, notesDiv, false);
		renderNews(p, newsDiv, false);
		
		var statDataArray = []; // needed for Stats Tab

		var projData, statData;
		for (var i=0; i<p.stats.length; i++){
			if (p.stats[i].type == 'projections' && p.stats[i].full_stats){
				if (!projData){
					projData = p.stats[i];
				} else if (getSportData() && getSportData().inSeason && 
						p.stats[i].title.indexOf("Week") != -1){
					projData = p.stats[i];
				} else if (getSportData() && getSportData().inSeason && 
						p.stats[i].title.indexOf("ROS") != -1){
					projData = p.stats[i];
				}
			}
			if (p.stats[i].type == 'stats'){
				if (p.stats[i].period == 'season'){
					statData = p.stats[i];				
				}
				statDataArray.push(p.stats[i]);
			}
		}

		var featuredDiv = $.find(playerCard, '.fp-pc__featured')[0];
		if (projData && !isBP){
			var full_title = projData.full_title || projData.title;
			var byeInfo = { player_bye: p.player_bye, week: p.week};
			var section = 
				$.fromTemplate(["section",{"children":[["h2",{"children":[(full_title)],"class":"fp-pc__heading"}],["dl",{"class":"fp-pc__list fp-pc__list--proj"}]],"class":"fp-pc__projections"}]);
			featuredDiv.appendChild(section);
			var projList = $.find(section, '.fp-pc__list--proj')[0];
			if (!p.display_proj){
				p.display_proj = [];
				for (var k in projData.full_stats){
					p.display_proj.push(k);
				}
			}
			for (var i = 0, len = p.display_proj.length; i < len; i++ ) {
				addProjBar(projData, projList, p.display_proj[i], byeInfo); 
			}
		}

		var displayStats = p.display_stats || p.default_stats;	
		if (sport == 'nba'){
			displayStats = ['PTS', 'REB', 'AST', 'BLK', 'STL', 'FG%', '3PM', 'TO'];
		}
		
		if (displayStats && statData){
			if (isBP){

				var keyStatsDiv = $.find(playerCard,'.fp-pc__header--key-stats')[0];
				$.empty(keyStatsDiv); 

		    	var statTable =
		    		$.fromTemplate(["table",{"children":[["colgroup",{"children":[["col",{"class":"fp-pc__col"}]]}],["thead",{"children":[["tr"]],"class":"fp-pc__thead fp-pc__thead--draft"}],["tbody",{"children":[["tr"]],"class":"fp-pc__tbody fp-pc__tbody--draft"}]],"class":"fp-pc__table"}]);
			    keyStatsDiv.appendChild(statTable);	

			    var line1 = $.find(statTable, '.fp-pc__thead--draft tr')[0];
			    var line2 = $.find(statTable, '.fp-pc__tbody--draft tr')[0];
			    
			    var totalGames = statData.stats && statData.stats["G"] ? Number(statData.stats["G"]) : 
			    	statData.stats && statData.stats["Games"] ? Number(statData.stats["Games"]) : 0;
			    	
			    var maxStats = sport == 'nba' ? 10 : 7;

				for (var i = 0; i < displayStats.length && i <maxStats; i++ ) {
					var statsCode = displayStats[i];
					var value = statData.stats && statData.stats[statsCode] ? statData.stats[statsCode] : '-';
					
					if (statsCode == "Season"){
						continue;
					}
					
					if (totalGames > 0 && statsCode != "G" && statsCode != "Games" && statsCode.indexOf('/') == -1  && statsCode.indexOf('%') == -1 && sport != 'nba'){
						statsCode += "/G";
						value = Number(value) / totalGames;
						value = value.toFixed(value >= 100 ? 0 : 1);
					} else if (statsCode == "G"){
						statsCode =  "Games";
					}

					var th = document.createElement("th");
					th.innerHTML = statsCode;
					line1.appendChild(th);
					var td = document.createElement("td");
					td.innerHTML = value;
					$.addClass(td, 'fp-pc__td');
					$.addClass(td, 'fp-pc__td--ecr');
					line2.appendChild(td);			
				}
					
				
				
			} else {
				var full_title = statData.full_title || statData.title;	
				var section = 
					$.fromTemplate(["section",{"children":[["h2",{"children":[(full_title)],"class":"fp-pc__heading"}],["dl",{"class":"fp-pc__list fp-pc__list--stats"}]],"class":"fp-pc__statistics"}]);
				featuredDiv.appendChild(section);
				var statsList = $.find(section, '.fp-pc__list--stats')[0];
				
				for (var i = 0, len = displayStats.length; i < len; i++ ) {
					addStatCell(statData.stats, statsList, displayStats[i]);
				}
			}
		}

		if (p.props && p.props.length){
			renderProps(playerCard, p);
		}
		
		if (isBP){
			$.addClass(playerCard, 'bp-player-card');
			$.remove(featuredDiv);
			$.remove($.find(playerCard, '.fp-pc__profile-link')[0]);
			$.remove($.find(playerCard, '.fp-pc__link--notes')[0].parentNode);
			
			fetchPlayerOffers(playerCard, p);
			fetchPlayerPicks(playerCard, p);

			var poweredBy = $.fromTemplate(["div",{"children":[" Powered by ",["a",{"children":[["img",{"src":" https://www.bettingpros.com/assets/images/logo-blue@3x.png"}]],"href":"https://www.bettingpros.com/","target":"_blank"}]],"class":"powered-by-bp"}]); 
	    	contentContainer.appendChild(poweredBy);
		}

		if (sport == 'mlb' || (isBP && sport == 'nba')){
			var statsTab = $.find(playerCard, '.fp-pc__tab--stats')[0];
			buildStatsTab(p.full_stats_headers, statDataArray, statsTab, p.player_stats_url);
	
			var gameLogTab = $.find(playerCard, '.fp-pc__tab--games')[0];
			var games_url = p.player_games_url ? p.player_games_url : p.player_page_url;
			buildGameLogTab(p.recent_games_headers, p.recent_games_stats, gameLogTab, games_url);
		} else if (sport == 'nfl'){
			var stats_headers = p.full_stats_headers || displayStats;
			var stats_url = p.player_stats_url || p.player_page_url;
			var statsTab = $.find(playerCard, '.fp-pc__tab--stats')[0];

			var yearlyStats = [];
			for (var i=0; i < statDataArray.length; i++){
				if (statDataArray[i].period == 'season'){
					yearlyStats.push(statDataArray[i]);
				}
			}
			
			buildStatsTab(stats_headers, yearlyStats, statsTab, stats_url);
		//	$.remove($.find(playerCard, '.fp-pc__link--stats')[0].parentNode);
			
			var weekly_stat_headers = p.weekly_stat_headers || displayStats;
			
			var gameLogTab = $.find(playerCard, '.fp-pc__tab--games')[0];
			if (isBP){
				buildBettingProsGameLogTab(playerCard, weekly_stat_headers, p.schedule, p.points, gameLogTab, player_position, "Season-to-Date Game Log");
				if (p.schedule_previous_season){

					var seasonSelect = $.fromTemplate(["select",{"id":"bp-season-select","class":"fp-pc__tab-select"}]);
					gameLogTab.prepend(seasonSelect);

				    var opt1 = document.createElement('option');
				    opt1.value = 0;
				    opt1.selected = true;
				    opt1.innerHTML = "Season-to-Date";
				    seasonSelect.appendChild(opt1);
				    
				    var opt2 = document.createElement('option');
				    opt2.value = 1;
				    opt2.selected = false;
				    opt2.innerHTML = "Previous Season";
				    seasonSelect.appendChild(opt2);				    
					
					buildBettingProsGameLogTab(playerCard, weekly_stat_headers, p.schedule_previous_season , p.points, gameLogTab, player_position, "Previous Season Game Log");
					
					var checkSeason = function(){
						var tables = $.find(playerCard, '.fp-pc__container--game-log');
						if (seasonSelect.value == 0){
							if (tables.length > 0){
								tables[0].style.display = "block";
							}
							if (tables.length > 1){
								tables[1].style.display = "none";
							}
						} else {
							if (tables.length > 0){
								tables[0].style.display = "none";
							}
							if (tables.length > 1){
								tables[1].style.display = "block";
							}
						}
					};
					$.listen(seasonSelect, 'change', checkSeason);					
					checkSeason();
					
				}
			} else {
				buildScheduleTab(weekly_stat_headers, p.schedule, p.points, gameLogTab, player_position);
			}

		} else if (sport == 'epl' || sport == 'aaf'){
			$.remove($.find(playerCard, '.fp-pc__link--news')[0]);
			$.remove($.find(playerCard, '.fp-pc__link--notes')[0]);
			$.remove($.find(playerCard, '.fp-pc__link--stats')[0].parentNode);
			$.remove($.find(playerCard, '.fp-pc__link--games')[0].parentNode);
		} else if (sport == 'nba'){
			$.remove($.find(playerCard, '.fp-pc__link--stats')[0].parentNode);

			var gameLogTab = $.find(playerCard, '.fp-pc__tab--games')[0];
			var games_url = p.player_games_url ? p.player_games_url : p.player_page_url;
			buildGameLogTab(p.recent_games_headers, p.recent_games_stats, gameLogTab, games_url, true);
		}
		
		navLinkListener();
		iteratorListener();
		$.listen(document, 'keydown', tabHandler);
		
		if (cardTab && $.find(playerCard, '.fp-pc__link--' + cardTab)[0]){
			$.find(playerCard, '.fp-pc__link--' + cardTab)[0].click();
		} else if (isResearchAssistant || isChromeExtension){
			if ($.find(playerCard, '.fp-pc__link--mpb-leagues').length){
				$.find(playerCard, '.fp-pc__link--mpb-leagues')[0].click();
			}
		}

		if (hideIterators || getFpPageOption("isVueJS")){
			//previous and next links need fp-icon__link classes, which are removed because of conflicts with vue.js
			removeIterators();
		}

		setTimeout(function(){
			
			resetFocusableElements();
		    playercardGenerator.focusedElBeforeOpen = playercardGenerator.focusedElBeforeOpen || document.activeElement;
		    
		    
			if ($.find(playerCard,'.fp-pc_scoring-toggle').length){
				if (playerCard.className.indexOf("fp-player-card-PPR") != -1){
					$.find(playerCard,'.fp-pc__btn--PPR')[0].focus();
				} else if (playerCard.className.indexOf("fp-player-card-HALF") != -1){
					$.find(playerCard,'.fp-pc__btn--HALF')[0].focus();
				} else {
					$.find(playerCard,'.fp-pc__btn--STD')[0].focus();
				}
			} else if ($.find(playerCard,'.fp-pc__link--active').length){
				$.find(playerCard,'.fp-pc__link--active')[0].focus();
			} else if(playercardGenerator.focusableEls.length){
			    playercardGenerator.focusableEls[0].focus();
		    }
		}, 1);
	}
	
	function buildWeatherModule(weatherData, ecrTable){	
		if (!weatherData.icon_url){
			return;
		}
		var theadRow = $.find(ecrTable, '.fp-pc__thead--draft tr')[0];
		addTheadCell("WEATHER", theadRow, 'fp-pc__th--weather');

		var tbodyRow = $.find(ecrTable, '.fp-pc__tbody--draft tr')[0];
		var td = document.createElement('td');
		td.setAttribute('scope', 'col');
		$.addClass(td, 'fp-pc__td');
		$.addClass(td, 'fp-pc__td--weather');
		if (weatherData.weather_text){
			td.setAttribute('title', weatherData.weather_text);
		}		
		if (weatherData.temp && weatherData.temp.length > 3){
			td.innerHTML = "<img class='fp-pc__img--weather-with-text' src='" + weatherData.icon_url + "'>" + weatherData.temp;
		} else {
			td.innerHTML = "<img class='fp-pc__img--weather-no-text' src='" + weatherData.icon_url + "'>";
		}
		tbodyRow.appendChild(td); 
		 
	}
	
	function resetFocusableElements(){		
		var focusableEls = document.getElementById('fp-player-card').querySelectorAll(
				'.fp-pc__close-button, ' +
				'.fp-pc_scoring-toggle [tabindex="0"], ' + 
				'.fp-pc__nav [tabindex="0"], ' + 
				'.fp-pc__tabs .fp-pc__tab--active a, ' + 
				'.fp-pc__profile-link a, ' +
				'.fp-pc__card-iterator'
			);
	    playercardGenerator.focusableEls = Array.prototype.slice.call(focusableEls);
	}
	  
	var setLoggedOutPopup = function(parentNode) {
	    var loginLink;
	    
	    var idx = document.location.href.indexOf("fp_llt_time=");
	    var showThirdPartyCookiesWarning = false;
	    if (idx != -1 && document.domain.indexOf("fantasypros") == -1){
	    	var lastLoggedin = document.location.href.substring(idx + "fp_llt_time=".length);
	    	idx = lastLoggedin.indexOf("&");
	    	if (idx != -1){
	        	lastLoggedin = lastLoggedin.substring(0,idx);
	    	}
	    	idx = lastLoggedin.indexOf("#");
	    	if (idx != -1){
	        	lastLoggedin = lastLoggedin.substring(0,idx);
	    	}
	    	if (lastLoggedin && Number(lastLoggedin) > 0){
		    	var minutes = (new Date().getTime() - Number(lastLoggedin)) / 1000 / 60; 
		    //	console.log(minutes);
		    	showThirdPartyCookiesWarning = minutes < 2;
	    	}
	    }
	    
	    var uritarget =  showThirdPartyCookiesWarning ? 
	    		"https://secure.fantasypros.com/thirdpartycookies/" : FP_LOGIN;
	    uritarget = addAffiliateCode(uritarget);
	    var idx = document.location.href.indexOf("fp_llt_time=");
	  	var next = idx == -1 ? document.location.href : document.location.href.substring(0,idx);
		idx = next.indexOf("#");
		if (idx != -1){
			next = next.substring(0,idx);
		}
		next += next.indexOf("?") == -1 ? "?" : "&";
	  	next += "fp_llt_time=" + new Date().getTime();
	  	uritarget += "&next=" + encodeURIComponent(next);
	    
	    if (showThirdPartyCookiesWarning){
	      loginLink =
	        $.fromTemplate(["div",{"children":[["span",{"children":["Your browser blocks third party cookies"],"class":"gb_promptlabel"}],["a",{"children":[" Fix This "],"target":"_blank","title":"Learn about Third Party Cookies","href":(uritarget),"class":"gb_leaguelink gb_importlink"}]],"class":"fp-pc__availability-summary"}]);
		        
	    } else { 
	    	loginLink = 
	        $.fromTemplate(["div",{"children":[["span",{"children":[" Unlock more Player Card features "],"class":"gb_promptlabel"}],["a",{"children":["Log in"],"href":(uritarget),"onclick":"playercardGenerator.clearAll();","class":"gb_leaguelink gb_importlink"}]],"class":"fp-pc__availability-summary"}]);
	    }
	    parentNode.appendChild(loginLink);
	};	
	
	var setNoLeaguesPopup = function(parentNode) {

		var uritarget = addAffiliateCode('http://www.fantasypros.com/' + getSportData().sport + '/myplaybook/edit.php');
	    parentNode.appendChild(
	      $.fromTemplate(["div",{"children":[["span",{"children":[" Get customized advice "],"class":"gb_promptlabel"}],["a",{"children":[" Import Team "],"href":(uritarget),"onclick":"playercardGenerator.clearAll();","class":"gb_leaguelink gb_importlink"}]],"class":"fp-pc__availability-summary"}]));  
	};
	
	var setUpgradePopup = function(parentNode, product, link) {
    	parentNode.appendChild(
	      $.fromTemplate(["div",{"children":[["span",{"children":[" See player availability in your league(s) "],"class":"gb_promptlabel"}],["a",{"children":[" Upgrade to ",(product)],"href":(link),"target":"_blank","class":"gb_leaguelink gb_importlink"}]],"class":"fp-pc__availability-summary"}]));  
	};

	Object.size = function(obj) {
		var size = 0, key;
		for ( key in obj ) {
			if ( obj.hasOwnProperty(key) ) size++;
		}
		return size;
	};

	function buildStatsTab(headers, statsArray, container, more_url){	

		if (sport == 'nba'){
			if (!headers){
				headers = ['Season', 'Games',
					'3PM',
					'AST',
					'BLK',
					'FG%',
					'PTS',
					'REB',
					'STL',
					'TO'
				];
			} else if (headers[0] != 'Season'){
				var new_headers = ["Season", "Games"];
				for (var i=0; i<headers.length;i++){
					new_headers.push(headers[i]);
				}
				headers = new_headers;
			}
		}		
		
		if (!headers || !statsArray){
			return;
		}
		var columns = headers.length;	
		if (isBP && columns>0 && headers[columns-1].toLowerCase().indexOf("finish") != -1){
			columns--;
		}
			
		var statsTable =
			$.fromTemplate(["div",{"children":[["table",{"children":[["thead",{"children":[["tr",{"class":"fp-pc__tr fp-pc__tr--thead"}]],"class":"fp-pc__thead fp-pc__thead--stats"}],["tfoot",{"children":[["tr",{"children":[["td",{"children":[["a",{"children":[" View All Stats "],"href":(addAffiliateCode(more_url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewAllStats')","class":"fp-pc__link"}]],"colspan":(columns)}]],"class":"fp-pc__tr"}]],"class":"fp-pc__tfoot"}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--stats"}]],"class":"fp-pc__table"}]],"class":"fp-pc__stats fp-pc__container--stats"}]);
		container.appendChild(statsTable);

		if (isBP){
			var h =
				$.fromTemplate(["h2",{"children":["Career Stats"],"class":"fp-pc__heading"}]);
			statsTable.prepend(h);
		}

		var totals = {};
		var theadRow = $.find(statsTable, '.fp-pc__thead .fp-pc__tr')[0];
		for ( var i = 0; i < columns; i++ ){
			headers[i] = headers[i] == "Games" ? "G" : headers[i];
			totals[headers[i]] = 0;
			addTheadCell(headers[i], theadRow, 'fp-pc__th--stats');
		}

		var tbody = $.find(statsTable, '.fp-pc__tbody')[0];
		if (statsArray.length != 0) {
			for ( var i = 0; i < statsArray.length; i++ ) {			
				var seasonStats = statsArray[i].stats;
				var values = [];

				for ( var j = 0; j < columns; j++ ) {
					var header = headers[j];
					header = (header == "Season") ? "season" : header;
					if (header == "season" && !seasonStats[header] && seasonStats["Season"]){
						header = "Season";
					}
					header = (header == "Games") ? "G" : header;
					if (header == "G" && !seasonStats[header] && seasonStats["Games"]){
						header = "Games";
					}
					values.push(seasonStats[header]);
					totals[headers[j]] = totals[headers[j]] + Number(seasonStats[header]);
				}
				addTbodyRow(values, tbody);
			}

			if (isBP && sport != 'nba'){
				var trFoot = $.find(statsTable, ".fp-pc__tfoot .fp-pc__tr")[0];
				$.empty(trFoot);
				addTheadCell("Totals", trFoot, 'fp-pc__th--stats');
				for ( var i = 1; i < columns; i++ ){
					var header = headers[i];
					if (header == "G" && !totals[header]){
						header = "Games";
					}
					addTheadCell(header.indexOf("%") == -1 && totals[header] ? totals[header].toLocaleString() : '', trFoot, 'fp-pc__th--stats');
				}
			} else if (!more_url){
				var trFoot = $.find(statsTable, ".fp-pc__tfoot .fp-pc__tr")[0];
				$.empty(trFoot);
			}
		} else {			
			addTbodyRow("There are no statistics for this player.", tbody, columns);			
		}
	}

	function buildGameLogTab(headers, stats, container, more_url, is_compact){
		if ( headers && stats ) {
			
			var columns = headers.length;			
			var gameLogTable =
				$.fromTemplate(["div",{"children":[["table",{"children":[["thead",{"children":[["tr",{"class":"fp-pc__tr fp-pc__tr--thead"}]],"class":"fp-pc__thead fp-pc__thead--game-log"}],["tfoot",{"children":[["tr",{"children":[["td",{"children":[["a",{"children":[" View All Game Logs "],"href":(addAffiliateCode(more_url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewAllGameLogs')","class":"fp-pc__link"}]],"colspan":(columns)}]],"class":"fp-pc__tr"}]],"class":"fp-pc__tfoot"}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--game-log"}]],"class":"fp-pc__table"}]],"class":"fp-pc__game-log fp-pc__container--game-log"}]);			
			container.appendChild(gameLogTable);

			if (is_compact){
				$.addClass(gameLogTable, 'fp-pc__game-log-compact');
			}
			
			var theadRow = $.find(gameLogTable, '.fp-pc__thead .fp-pc__tr')[0];
			for ( var i = 0; i < columns; i++ ){				
				addTheadCell(headers[i], theadRow, 'fp-pc__th--game-log');
			}

			var tbody = $.find(gameLogTable, '.fp-pc__tbody')[0];
			if ( stats[0] ) {							
				for ( var i = 0, len = stats.length; i < len; i++ ) {
					addTbodyRow(stats[i], tbody);
				}
			} else {
				addTbodyRow("There are no recent game logs for this player.", tbody, columns);
			}
		}
	}
	
	function buildBettingProsGameLogTab(playerCard, headers, schedule, points, container, player_position, tableHeading){

		var hasStats = false;
		if (schedule && schedule.length) {
			for ( var i = 0, len = schedule.length; i < len; i++ ) {
				if (schedule[i].stats && schedule[i].stats.length){
					hasStats = true;
				}
			}
		}
		  
		if (hasStats == false){
			$.remove($.find(playerCard, '.fp-pc__link--games')[0]);
			return;
		}
		
		$.find(playerCard, '.fp-pc__link--games')[0].innerHTML = "Game Log";
	  
		var gameLogTable =
			$.fromTemplate(["div",{"children":[["h2",{"children":[(tableHeading)],"class":"fp-pc__heading"}],["table",{"children":[["thead",{"children":[["tr",{"class":"fp-pc__tr fp-pc__tr--thead"}]],"class":"fp-pc__thead fp-pc__thead--game-log"}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--game-log"}],["thead",{"children":[["tr",{"class":"fp-pc__tr fp-pc__tr--thead"}]],"class":"fp-pc__thead fp-pc__tfoot--game-log"}]],"class":"fp-pc__table"}]],"class":"fp-pc__game-log fp-pc__container--game-log"}]);			
		container.appendChild(gameLogTable);

		var theadRow = $.find(gameLogTable, '.fp-pc__thead .fp-pc__tr')[0];
		addTheadCell("", theadRow, 'fp-pc__th--game-log');
		addTheadCell("Opp.", theadRow, 'fp-pc__th--game-log');
		addTheadCell("Score", theadRow, 'fp-pc__th--game-log');

		var totals = {};
		for ( var i = 0; i < headers.length; i++ ){
			if (headers[i].indexOf("/") == -1){
				totals[headers[i]] = 0;
			} else {
				totals[headers[i].split("/")[0]] = 0;
				totals[headers[i].split("/")[1]] = 0;
			}
			addTheadCell(headers[i], theadRow, 'fp-pc__th--stats');
		}
		
		var tbody = $.find(gameLogTable, '.fp-pc__tbody')[0];
		for ( var i = 0, len = schedule.length; i < len; i++ ) {

			if (schedule[i].scheduled_datetime && schedule[i].stats){
				var tr = document.createElement('tr');
				$.addClass(tr, 'fp-pc__tr');
				tbody.appendChild(tr);
	
				addCell(tr, "Week " + schedule[i].week);
				var opp = schedule[i].opponent;
				if (opp.indexOf('at ') != -1){
					opp = '@' + opp.split('at ')[1];
				} else if (opp.indexOf('vs. ') != -1){
					opp = opp.split('vs. ')[1];
				}
				addCell(tr, opp);
				
				var score = "";
				if (schedule[i].result){
					score += schedule[i].result + ", ";
				}
				if (schedule[i].score){
					score += schedule[i].score;
				}

				if (schedule[i].event_id && bp_schedule && bp_schedule[sport] && bp_schedule[sport][schedule[i].event_id]){
					score = "<a target='_blank' href='https://www.bettingpros.com" + bp_schedule[sport][schedule[i].event_id] + "'>" + score + "</a>";
				}
				
				addCell(tr, score);

				for (var j = 0; j < headers.length; j++ ) {
					if (j < schedule[i].stats.length){
						addCell(tr, schedule[i].stats[j]);
						if (headers[j].indexOf("/") == -1){
							totals[headers[j]] = totals[headers[j]] + Number(schedule[i].stats[j]);
						} else if (schedule[i].stats[j].indexOf("/") != -1){
							totals[headers[j].split("/")[0]] = totals[headers[j].split("/")[0]] + Number(schedule[i].stats[j].split("/")[0]);
							totals[headers[j].split("/")[1]] = totals[headers[j].split("/")[1]] + Number(schedule[i].stats[j].split("/")[1]);
						}
					} else {
						addCell(tr, "");
					}
				}
			}
		}

		var tfootRow = $.find(gameLogTable, '.fp-pc__tfoot--game-log .fp-pc__tr')[0];
		$.addClass(tr, 'fp-pc__tr');
		$.addClass(tr, 'fp-pc__tr--thead');
		addTheadCell("Totals", tfootRow, 'fp-pc__th--game-log');
		addTheadCell("", tfootRow, 'fp-pc__th--game-log');
		addTheadCell("", tfootRow, 'fp-pc__th--game-log');
		for (var j = 0; j < headers.length; j++ ) {
			var tot = "";
			if (headers[j].indexOf("/") == -1){
				tot = totals[headers[j]].toLocaleString();
			} else {
				tot = totals[headers[j].split("/")[0]].toLocaleString() + "/" + totals[headers[j].split("/")[1]].toLocaleString();
			}
			addTheadCell(tot, tfootRow, 'fp-pc__th--game-log');
		}
		
	}
	
	function buildScheduleTab(headers, schedule, points, container, player_position){

	  if (headers.length > 5 && headers[headers.length-1] == "Fum"){
		  headers.length = headers.length-1; //make space for the Finish column: https://github.com/fantasypros/mainsite/issues/3178
	  }
		
	  if (schedule && schedule.length) {	
		var gameLogTable =
			$.fromTemplate(["div",{"children":[["table",{"children":[["thead",{"children":[["tr",{"class":"fp-pc__tr fp-pc__tr--thead"}]],"class":"fp-pc__thead fp-pc__thead--game-log"}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--game-log"}]],"class":"fp-pc__table"}]],"class":"fp-pc__game-log fp-pc__container--game-log"}]);			
		container.appendChild(gameLogTable);
		
		var hasStats = false;
		var hasFinish = false;
		for ( var i = 0, len = schedule.length; i < len; i++ ) {
			if (schedule[i].stats && schedule[i].stats.length){
				hasStats = true;
			}
		}
		
		if (hasStats){
			$.addClass(gameLogTable, 'fp-pc__game-log-compact');			
		}
		
		var theadRow = $.find(gameLogTable, '.fp-pc__thead .fp-pc__tr')[0];
		addTheadCell("WK", theadRow, 'fp-pc__th--game-log');
		addTheadCell("Opp.", theadRow, 'fp-pc__th--game-log');
		if (hasStats == false){
			addTheadCell("Time", theadRow, 'fp-pc__th--game-log');
		}	

		var points_scoring = 'points';
		var rank_scoring = 'points_rank';
		if (window.playercards_scoring == 'PPR'){
			points_scoring = 'points_ppr';
			rank_scoring = 'points_ppr_rank';
		} else if (window.playercards_scoring == 'HALF'){
			points_scoring = 'points_half';
			rank_scoring = 'points_half_rank';
		}
		
		if (hasStats){
			for ( var i = 0; i < headers.length; i++ ){
				addTheadCell(headers[i], theadRow, 'fp-pc__th--stats');
			}
			if (points){
				addTheadCell("FP", theadRow, 'fp-pc__th--stats');

				for (var i = 0; i < schedule.length; i++) {
					if (schedule[i].scheduled_datetime && schedule[i].stats && points[""+schedule[i].week] &&
							(typeof points[""+schedule[i].week][rank_scoring] !== 'undefined')) {
						hasFinish = true;
						addTheadCell(player_position + " Finish", theadRow, 'fp-pc__th--stats');
						break;
					}
				}
			}
		}
		
		var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		
		var tbody = $.find(gameLogTable, '.fp-pc__tbody')[0];
		for ( var i = 0, len = schedule.length; i < len; i++ ) {
			var tr = document.createElement('tr');
			$.addClass(tr, 'fp-pc__tr');
			tbody.appendChild(tr);

			addCell(tr, schedule[i].week);
			if (schedule[i].scheduled_datetime){
				var opp = schedule[i].opponent;
				if (opp.indexOf('at ') != -1){
					opp = '@' + opp.split('at ')[1];
				} else if (opp.indexOf('vs. ') != -1){
					opp = opp.split('vs. ')[1];
				}
				var cl='';
				if (schedule[i].matchup_stars){
					var stars = Number(schedule[i].matchup_stars);
					if (stars >= 3.8){
						cl = 'fp-pc__td-easy';
		    		} else if (stars > 0 && stars <= 2.2){
		    			cl = 'fp-pc__td-hard';
		    		}
				}
				addCell(tr, opp, cl);

				if (hasStats == false){
					var d = new Date(Number(schedule[i].scheduled_start) * 1000);
					var datestring = DAYS[d.getDay()] + ' ' + (d.getMonth()+1) + '/' + d.getDate() + ' at ';
					var ampm = ' am';
					if (d.getHours() > 12){
						datestring += (d.getHours() - 12) + ':';
						ampm = 'pm';
					} else {
						datestring += d.getHours() + ':';
						if (d.getHours() == 12) {
							ampm = 'pm';
						}
					}
					if (d.getMinutes() < 10){
						datestring += '0';
					}
					datestring += d.getMinutes() + ' ' + ampm;				
					addCell(tr, datestring, 'fp-pc__td-align-left');
				}

				if (hasStats) {	
					if (schedule[i].stats) {
						for (var j = 0; j < headers.length; j++ ) {
							addCell(tr, j < schedule[i].stats.length ? schedule[i].stats[j] : "");
						}
						if (points && points[""+schedule[i].week] && (typeof points[""+schedule[i].week][points_scoring] !== 'undefined')){
							addCell(tr, Math.round(Number(points[""+schedule[i].week][points_scoring])), 'fp-pc__td-points');
						} else if (points){
							addCell(tr, "");
						}
						if (hasFinish){
							if (points && points[""+schedule[i].week] && (typeof points[""+schedule[i].week][rank_scoring] !== 'undefined')){
								var finish = Math.round(Number(points[""+schedule[i].week][rank_scoring]));
								/*
								var j = finish % 10, k = finish % 100;
							    if (j == 1 && k != 11) {
							    	finish += "st";
							    } else if (j == 2 && k != 12) {
							    	finish += "nd";
							    } else if (j == 3 && k != 13) {
							    	finish += "rd";
							    } else {
							    	finish += "th";
							    }*/
								addCell(tr, finish, '');
							} else if (points){
								addCell(tr, "");
							}
						}
					} else {
						for (var j = 0; j < headers.length; j++ ) {
							addCell(tr, "");
						}
						if (points){
							addCell(tr, "");
						}
						if (hasFinish){
							addCell(tr, "");
						}							
					}
				}

			} else { //bye week
				var td = addCell(tr, schedule[i].opponent);
				td.setAttribute('colspan', hasFinish ? headers.length + 4 : hasStats ? headers.length + 3 : 2);
			}
		}
	  }
	}

	function addTheadCell(header, theadRow, thClass){
		var th = document.createElement('th');
		th.setAttribute('scope', 'col');
		$.addClass(th, 'fp-pc__th');
		$.addClass(th, thClass);				
		th.innerHTML = header;
		theadRow.appendChild(th); 
	}

	function addTbodyRow(stats, tbody, columns) {	
		columns =  (columns == undefined) ? "" : columns;

		var tr = document.createElement('tr');
		$.addClass(tr, 'fp-pc__tr');
		tbody.appendChild(tr);

		var len = columns == "" ? stats.length : 1;
		for ( var i = 0; i < len; i++ ) {
			var td = document.createElement('td');
			$.addClass(td, 'fp-pc__td');									
			if (columns == "") {
				td.innerHTML = stats[i];
			} else {
				$.addClass(td, 'fp-pc__td--only-child');
				td.innerHTML = stats;
				td.setAttribute('colspan', columns);
			}
			tr.appendChild(td);
		}
		
	}
	
	function addCell(tr, content, additionalClass) {	
		var td = document.createElement('td');
		$.addClass(td, 'fp-pc__td');	
		if (additionalClass){
			$.addClass(td, additionalClass);	
		}
		if (typeof content !== 'undefined'){
			td.innerHTML = content;
		} else {
			td.innerHTML = '';
		}
		tr.appendChild(td);	
		return td;
	}
	
	function buildAdDiv() {
		var adDiv = "";
	  var adUnit = getFpPageOption("googleAdUnit");
	  if (adUnit){
      adDiv =
        $.fromTemplate(["div",{"children":[["div",{"id":(adUnit),"style":"height:50px; width:320px;margin:0px auto 20px;overflow:hidden"}]],"class":"pf_popup_ad"}]);
     }
     return adDiv;
	}
	
	function sendPageView(player_page_url){
		//	player_page_url":"https:\/\/www.fantasypros.com\/mlb\/players\/bryce-harper.php
		current_player_file_name = player_page_url;
		var idx = current_player_file_name.indexOf("/players/");
		if (idx != -1){
			current_player_file_name = current_player_file_name.substring(idx + "/players/".length);
		}
		idx = current_player_file_name.indexOf(".php");
		if (idx != -1){
			current_player_file_name = current_player_file_name.substring(0, idx);
		}
		
		if (typeof ga != 'undefined' && getFpPageOption("googleTracker")){
			var page = location.pathname + "/" + current_player_file_name;
			ga(getFpPageOption("googleTracker") + '.set', 'page', page);
			ga(getFpPageOption("googleTracker") + '.send', 'pageview');
		}
		
	}
	
	function sendEvent(action){
		
		if (typeof ga != 'undefined' && getFpPageOption("googleTracker") && action){
			var eventLabel = sport;
			if (current_player_file_name){
				eventLabel += " - " + current_player_file_name;
			}
			ga(getFpPageOption("googleTracker") + '.send', 'event', 'PlayerCard_v2', action, eventLabel);
		}
		
	}

	function buildFooter(){
		var footer = "";
		footer.isFooterVisible = false;
		if ( !getFpPageOption("isDraftRoom") ) {
			 footer =
				$.fromTemplate(["footer",{"children":[["small",{"children":[["span",{"children":["Powered by "],"class":"fp-pc__text"}],["a",{"children":[["img",{"width":"100","height":"13.5","src":"https://cdn.fantasypros.com/playercards/skin/fantasypros-logo-600x81.png","alt":"FantasyPros home","class":"fp-pc__fp-logo"}]],"href":(addAffiliateCode('https://www.fantasypros.com')),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickPoweredBy')","class":"fp-pc__link fp-pc__link--footer"}]],"class":"fp-pc__small"}]],"class":"fp-pc__footer"}])
				footer.isFooterVisible = true;
		}
			return footer;
	}

	function addProjBar(projData, list, projCode, byeInfo) {		
		var value = projData.stats[projCode];
		if (!projData.full_stats[projCode]){
		//	console.log("missing full stats for:" + projCode);
			return;
		}

		var rank = projData.full_stats[projCode].rank;
		var tier = projData.full_stats[projCode].tier;

		if (isNaN(value) && isNaN(value.replace(/,/g, ""))){
			return;
		}

		var rankDD =
				$.fromTemplate(["span",{"class":"fp-pc__proj-rank"}]);
		rank = (rank != "NR") ? ("#" + rank) : rank;

		if (value == 0 && rank == "NR" && byeInfo.player_bye != byeInfo.week){ // For free agents, practice squad players, and other non-bye week players without rankings 
			value = "-";
		} else if (byeInfo.week == byeInfo.player_bye) { // For players who are on bye this week
			value = "BYE";
		} else { // For all non-bye week players who have projections
			rankDD =
				$.fromTemplate(["span",{"children":[" (",["span",{"children":[(rank)],"class":"fp-pc__proj-rank"}],")"],"class":"fp-pc__proj-rank-container"}]);
		}

		var proj = 
			$.fromTemplate(["div",{"children":[["dt",{"children":[(projCode)],"class":"fp-pc__label fp-pc__label--proj"}]],"class":"fp-pc__proj-div"}]);

		var valueDD =
			$.fromTemplate(["dd",{"children":[(value)],"class":"fp-pc__value fp-pc__value--proj"}]);

		valueDD.appendChild(rankDD);
		proj.appendChild(valueDD);
		list.appendChild(proj);
		var tierClass = defineTier(tier);

		var tierSpan = $.find(proj, '.fp-pc__proj-rank')[0];
		$.addClass(tierSpan, tierClass);

		var graph = buildGraph(projData.full_stats[projCode]);
		proj.appendChild(graph);

	}

	function defineTier(tier){
		if ( tier == 1 ) {
			tierClass = "fp-pc__proj-rank--top-tier";
		} else if ( tier == -1 ) {
			tierClass = "fp-pc__proj-rank--bottom-tier";
		} else {
			tierClass = "fp-pc__proj-rank--middle-tier";
		}
		return tierClass;
	}

	function buildGraph(projData) {		
		var rank = projData.rank;
		var total_ranked = projData.total_ranked;
		var pct, rankMessage;

		if (rank != "NR") {
			pct = ( total_ranked - rank ) / total_ranked;
			pct = Math.round(pct * 100);
			rankMessage = "This player ranks higher than " + pct + "% of other players in this category.";
		} else {
			pct = 0;
			rankMessage = "This player is not ranked in this category.";
		}
		
		var graph = 
			$.fromTemplate(["dd",{"children":[["span",{"class":"fp-pc__proj-graph--fill"}],["span",{"children":[(pct),"%"],"class":"fp-pc__proj-graph--pct"}]],"title":(rankMessage),"class":"fp-pc__proj-graph"}]);

		var fill = $.find(graph, '.fp-pc__proj-graph--fill')[0];
		fill.style.cssText = "width: " + pct + "%;";

		return graph;
	}

	function addStatCell(statData, list, statsCode){		
		var value = statData && statData[statsCode] ? statData[statsCode] : '-';
		statsCode = statsCode == "G" ? "Games" : statsCode;

		var stats =
			$.fromTemplate(["div",{"children":[["dt",{"children":[(statsCode)],"class":"fp-pc__label fp-pc__label--stats"}],["dd",{"children":[(value)],"class":"fp-pc__value fp-pc__value--stats"}]],"class":"fp-pc__stats-div"}]);

		list.appendChild(stats);

	}

	function renderNews(jsonData, container, isOverview){		
		var news_array = jsonData;
		
		if ( news_array.news && news_array.news.length > 0 ) {
			news_array = news_array.news;			
		}

		var newsCount = 0;

		if ( news_array && news_array.length > 0 ) {
			$.each(
				news_array,
				function(news,index){

				if ( isOverview && newsCount > 0 ){
					return;
				}

				var news_quote = cleanNews(news.quote);				
				var news_title = cleanNews( news.title ? news.title : "Note from " + news.expert_name );
				var datetime = news.published;
				var time = convertTimestamp(news);			

				if (news.author){
					news.author_name = news.author;
				}

				news.author_url = news.author_url || 'https://www.fantasypros.com';
				news.role_name = news.role_name || '';
				news.role_url = news.role_url || 'https://www.fantasypros.com';

				var newsItem;
				if ( isOverview ) {
					newsItem =
						$.fromTemplate(["article",{"class":"fp-pc__tab-div fp-pc__tab-div--overview fp-pc__tab-div--overview--news gb_skip"}]);
				} else {									
					newsItem =
						$.fromTemplate(["article",{"class":"fp-pc__tab-div fp-pc__tab-div--news gb_skip"}]);
					}

				container.appendChild(newsItem);

				if ( isOverview && news_array.length > 1 && isBP) {
					var moreLink = 
						$.fromTemplate(["a",{"children":[" View More News "],"data-js-link":"news","onclick":"playercardGenerator.sendGoogleEvent('clickOverviewMoreNews')","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--more"}])

					container.prepend(moreLink);
				} 
				
				var articleHeadings;
				if ( isOverview ) {
					articleHeadings =
						$.fromTemplate(["div",{"children":[["h2",{"children":["Recent News"],"class":"fp-pc__heading"}],["h3",{"children":[["a",{"children":[(news_title)],"href":(addAffiliateCode(news.url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickNews')","class":"fp-pc__heading-link fp-pc__heading-link--headline"}]],"class":"fp-pc__news-title"}]],"class":"fp-pc__article-header"}]);
				} else {
					articleHeadings =
						$.fromTemplate(["div",{"children":[["h2",{"children":[["a",{"children":[(news_title)],"href":(addAffiliateCode(news.url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickNews')","class":"fp-pc__heading-link"}]],"class":"fp-pc__heading fp-pc__news-title"}]],"class":"fp-pc__article-header"}]);
				}

				newsItem.appendChild(articleHeadings);




						var newsQuote;
						if ( news.source && news.source != 'source' && news.source != 'Source' ) {
							if (news.source_url) {
								newsQuote =
									$.fromTemplate(["p",{"children":[(news_quote),["span",{"children":[" (",["a",{"children":[(news.source)],"href":(addAffiliateCode(news.source_url)),"target":"_blank","class":"fp-pc__link"}],")"],"class":"fp-pc__source"}]],"class":"fp-pc__article-content fp-pc__article-content--news"}]);
							} else {
								newsQuote =
									$.fromTemplate(["p",{"children":[(news_quote),["span",{"children":[" (",(news.source),")"],"class":"fp-pc__source"}]],"class":"fp-pc__article-content fp-pc__article-content--news"}]);
							}
						} else {
							newsQuote = 
								$.fromTemplate(["p",{"children":[(news_quote)],"class":"fp-pc__article-content fp-pc__article-content--news"}]);
						}

						newsItem.appendChild(newsQuote);

						var news_analysis = cleanNews(news.content);
						var impact_label = isBP ? "Impact" : "Fantasy Impact";
						var fantasyImpact =
							$.fromTemplate(["div",{"children":[["h3",{"children":[(impact_label),":"],"class":"fp-pc__heading fp-pc__heading--fantasy-impact"}],["p",{"children":[(news_analysis)],"class":"fp-pc__article-content fp-pc__article-content--news"}]],"class":"fp-pc__fantasy-impact"}]);

						newsItem.appendChild(fantasyImpact);

						var tagline =
							$.fromTemplate(["address",{"children":[["a",{"children":[(news.author_name)],"href":(addAffiliateCode(news.author_url)),"rel":"author","target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickNewsAuthor')","class":"fp-pc__author"}],", ",["a",{"children":[(news.role_name)],"href":(addAffiliateCode(news.role_url)),"target":"_blank","class":"fp-pc__role"}],["time",{"children":[(time)],"datetime":(datetime),"class":"fp-pc__time"}]],"class":"fp-pc__tagline"}]);

						newsItem.appendChild(tagline);
						
						if (!news.role_name){
							$.remove($.find(tagline,".fp-pc__role")[0]);
						}
						
						newsCount++;

						if ( isOverview && news_array.length > 1 && !isBP) {
							var moreLink = 
								$.fromTemplate(["a",{"children":[" More News "],"data-js-link":"news","onclick":"playercardGenerator.sendGoogleEvent('clickOverviewMoreNews')","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--more fp-pc__link--news"}])

							$.find(newsItem, '.fp-pc__tagline')[0].appendChild(moreLink);
						}

			})

			if ( !isOverview ) {
				var hasNews = true;
				var playerNewsLinks = buildMoreNewsLinks(jsonData, hasNews);
				$.find(document, '.fp-pc__tab--news')[0].appendChild(playerNewsLinks);
			}

		} else {
			
			if ( isOverview ) {
				var news_heading = "Recent News";				
			} else {
				var hasNews = false;
				var playerNewsLinks = buildMoreNewsLinks(jsonData, hasNews);
			}
			
			var noRecentNews =
				$.fromTemplate(["div",{"children":[["p",{"children":["There is no recent news for this player."],"class":"fp-pc__article-content fp-pc__article-content--news"}],(playerNewsLinks)],"class":"fp-pc__tab-div fp-pc__tab-div--news gb_skip"}]);

				if ( news_heading ) {
					var heading =
						$.fromTemplate(["h2",{"children":[(news_heading)],"class":"fp-pc__heading"}]);

					noRecentNews.insertBefore(heading, $.find(noRecentNews, '.fp-pc__article-content--news')[0]);
				}

			container.appendChild(noRecentNews);			
		}
	}

	function buildMoreNewsLinks(jsonData, hasNews){
		var playerNewsLinks;
		if (isBP){

			var url = "https://www.bettingpros.com/" + sport + "/news/";
			var sport_uppercase = sport.toUpperCase();
			
			playerNewsLinks =
				$.fromTemplate(["div",{"children":[["a",{"children":[" View all ",(sport_uppercase)," news "],"href":(addAffiliateCode(url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewAllBPNews')","class":"fp-pc__link fp-pc__link--all-news"}]],"class":"fp-pc__more-links"}]);
			
			if (jsonData.player_team && jsonData.player_team != 'FA'){
				url = "https://www.bettingpros.com/" + sport + "/news/futures/?team_id=" + jsonData.player_team;
				var thisTeamLink =
					$.fromTemplate(["a",{"children":[" View More ",(jsonData.player_team)," news "],"href":(addAffiliateCode(url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewMoreTeamNews')","class":"fp-pc__link fp-pc__link--more-news"}]);
				
				var allPlayersLink = $.find(playerNewsLinks, '.fp-pc__link--all-news')[0];
				playerNewsLinks.insertBefore(thisTeamLink, allPlayersLink);
			}
				
		} else {
			var url = "https://www.fantasypros.com/" + sport + "/player-news.php";		
	
			playerNewsLinks =
				$.fromTemplate(["div",{"children":[["a",{"children":[" View all recent player news "],"href":(addAffiliateCode(url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewAllRecentPlayerNews')","class":"fp-pc__link fp-pc__link--all-news"}]],"class":"fp-pc__more-links"}]);
	
				if ( hasNews ) {
					var thisPlayersLink =
						$.fromTemplate(["a",{"children":[" View More ",(jsonData.player_name)," news "],"href":(addAffiliateCode(jsonData.player_news_url)),"target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickViewMorePlayerNews')","class":"fp-pc__link fp-pc__link--more-news"}]);
					
					var allPlayersLink = $.find(playerNewsLinks, '.fp-pc__link--all-news')[0];
					playerNewsLinks.insertBefore(thisPlayersLink, allPlayersLink);
				}
		}

		return playerNewsLinks;
	}

	function renderNotes(jsonData, container, isOverview){
		
		if (isBP){
			return;
		}
		
		var notes_array = [];
		if ( jsonData.notes && jsonData.notes_sort ) {
			for ( var i = 0; i < jsonData.notes_sort.length; i++ ) {
				notes_array.push(jsonData.notes[jsonData.notes_sort[i]]);				
			}
		}

		var notesCount = 0;

		if ( notes_array && notes_array.length > 0 ) {
			$.each(
				notes_array,
				function(note, index){
					if ( isOverview && notesCount > 0 ){
						return;
					}

					var note_content = cleanNews(note.note);
					var note_expert_name = cleanNews(note.expert_name);
					var note_source_name = cleanNews(note.source_name);
					var datetime = note.published;					
					var time = convertTimestamp(note);
					var source_url = note.source_url || 'https://www.fantasypros.com';

					var noteItem;

					if ( isOverview ) {
						noteItem =
							$.fromTemplate(["article",{"class":"fp-pc__tab-div fp-pc__tab-div--overview fp-pc__tab-div--overview--notes gb_skip"}]);
					} else {
						noteItem =
							$.fromTemplate(["article",{"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
					}

					container.appendChild(noteItem);

					if ( isOverview ) {
						var heading =
							$.fromTemplate(["h2",{"children":["Expert Note"],"class":"fp-pc__heading"}]);

              noteItem.appendChild(heading);
					}


					var noteBody =
						$.fromTemplate(["div",{"children":[["p",{"children":[(note_content)],"class":"fp-pc__article-content fp-pc__article-content--note"}],["address",{"children":[["a",{"children":[(note_expert_name)],"href":(addAffiliateCode(source_url)),"rel":"author","target":"_blank","onclick":"playercardGenerator.sendGoogleEvent('clickNotesAuthor')","class":"fp-pc__author"}]," - ",["time",{"children":[(time)],"datetime":(datetime),"class":"fp-pc__time"}]],"class":"fp-pc__tagline"}]],"class":"fp-pc__jhtml-div"}]);

					noteItem.appendChild(noteBody);

				
					notesCount++;

					if ( isOverview && notes_array.length > 1 ) {
						var moreLink = 
							$.fromTemplate(["a",{"children":["More Notes"],"data-js-link":"notes","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--more fp-pc__link--notes"}])

						$.find(noteItem, '.fp-pc__tagline')[0].appendChild(moreLink);
					}

				}				
			)
		} else {
			
			var notes_heading = "";
			if ( isOverview ) {
				notes_heading = "Expert Notes";				
			}

			var noRecentNotes =
				$.fromTemplate(["div",{"children":[["h2",{"children":[(notes_heading)],"class":"fp-pc__heading"}],["p",{"children":["There are currently no notes for this player."],"class":"fp-pc__article-content fp-pc__article-content--note"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);

			container.appendChild(noRecentNotes);	

		}
	}
		
					
	function convertTimestamp(content){
    var time = "";
    var published = content.published_timestamp ? content.published_timestamp : content.published;

    var minutes = (new Date().getTime()/1000 - Number(published)) / 60;
    if (minutes < 2){
    	time = "moments ago";
    } else if (minutes < 60){
    	time = parseInt(minutes) + " minutes ago";
    } else if (minutes < 60 * 24){
    	time = parseInt(minutes/60) + " hours ago";
    } else if (minutes < 60 * 24 * 2){
    	time = "yesterday";
    } else if (minutes/60 /24 /30 > 10){
    	return; //do not display news that are older than 10 months
    } else if (minutes/60 /24 /30 > 2){
    	time = parseInt(minutes/60 /24 /30) + " months ago";
    } else if (minutes/60 /24 /7 > 2){
    	time = parseInt(minutes/60 /24 /7) + " weeks ago";
    } else {
    	time = parseInt(minutes/60 /24) + " days ago";
    }    
    return time;
	}

  function cleanNews(content){ 
	  if (!content){
		  return "";
	  }
	  content = content.replace(/\n/g , "");
	  content = content
      	.replace(/&lt;/g, "<")
      	.replace(/&gt;/g, ">")
      	.replace(/&amp;/g, "&")
      	.replace(/&nbsp;/g, " ")
				.replace(/&hellip;/g, "...")
				.replace(/&rsquo;/g, "'")
				.replace(/&lsquo;/g, "'")
				.replace(/&raquo;/g, "\"")
				.replace(/&laquo;/g, "\"")
				.replace(/&hellip;/g, "...");
	  
	  var idx1 = content.indexOf("http://");
	  while (idx1 != -1){
		  var idx2 = content.indexOf(" ",idx1);
		  if (idx2 > idx1){
			  content = content.substring(0,idx1) + content.substring(idx2 + 1);
		  } else {
			  content = content.substring(0,idx1);
		  }
		  idx1 = content.indexOf("http://");
	  }
	  
      return content
  }
  
  function readCookie(name) {
	name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
	var regex = new RegExp('(?:^|;)\\s?' + name + '=(.*?)(?:;|$)', 'i'),
	    match = document.cookie.match(regex);
	return match && unescape(match[1]);
  }
  
  function createCookie(name, value, days) {
	if (!days) {
		days = 7;
	}
	var date = new Date();
	date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
	var expires = '; expires=' + date.toGMTString();
	var domain = '; domain=.fantasypros.com';
	if (name.indexOf("bp_") == 0){
		domain = '; domain=.bettingpros.com';
	}
	var host_split = location.host.split('.');
	if (host_split[host_split.length - 1] == 'dev') {
		domain = '; domain=.fp.dev';
	}
	if (host_split[host_split.length - 1] == 'test') {
		domain = '; domain=.fp.test';
	}
	if (location.host.indexOf('localhost') == 0) {
		domain = '; domain=localhost';
	}
	document.cookie = name + '=' + value + expires + domain + '; path=/';
  }
  
  function setWithExpiry(key, value, days) {
		const now = new Date();
		const item = {
			value: value,
			expiry: now.getTime() + (days * 24 * 3600 * 1000),
		}
		localStorage.setItem(key, JSON.stringify(item))
  }
  
  function getWithExpiry(key) {
		const itemStr = localStorage.getItem(key)
		// if the item doesn't exist, return null
		if (!itemStr) {
			return null
		}
		const item = JSON.parse(itemStr)
		const now = new Date()
		// compare the expiry time of the item with the current time
		if (now.getTime() > item.expiry) {
			// If the item is expired, delete the item from storage
			// and return null
			localStorage.removeItem(key)
			return null
		}
		return item.value
   }

  function checkUserLocation() {
	  if (!bp_geo_pc && getWithExpiry('bp_geo_pc') && !RESET_BP_STORAGE) {
		  bp_geo_pc = getWithExpiry('bp_geo_pc');
	  }
	  if (bp_user_loc){
		  return; //already set
	  } 
	  if (getWithExpiry('bp_user_loc') && !RESET_BP_STORAGE) {
		  bp_user_loc = getWithExpiry('bp_user_loc');
      } else {
          fetch('https://api.fantasypros.com/v2/defloc?cors=1').then(response => response.json()).then(res => {
        	  if (RESET_BP_STORAGE){
        		  console.log(res);
        	  }
              let location = res.defloc;
              if (['NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'MB', 'SK', 'AB', 'BC', 'YT', 'NT', 'NU'].includes(res.defloc)) {
                  location = 'CAN';
              }
              if (['AG', 'BN', 'BS', 'CH', 'CI', 'CL', 'CP', 'CS', 'DF', 'DG', 'GE', 'GJ', 'HD', 'JA', 'MC', 'MR', 'MX', 'NA', 'NL', 'OA', 'PU', 'QE', 'QI', 'SI', 'SL', 'SO', 'TA', 'TB', 'TL', 'VC', 'YU', 'ZA'].includes(res.defloc)) {
                  location = 'MX';
              }
              if (res.defloc === 'NONE') {
                  location = 'INT';
              }
              bp_user_loc = location;
              setWithExpiry('bp_user_loc', bp_user_loc, 1000);
          });
      }
  }

  function checkBettingProsSchedule(){

	  bp_schedule = bp_schedule || {};
	  if (bp_schedule[sport]){
		  return; //already set
	  } 
	  
	  var keyName = 'bp_schedule_' + sport;	  
	  bp_schedule[sport] = getWithExpiry(keyName);
	  if (bp_schedule[sport]){
		  //found in local storage
      } else {
			var params = {
				url: 'https://partners.fantasypros.com/api/v1/bp-team-schedules.php?sport=' + sport.toUpperCase(),
				data: {
					sport : sport.toUpperCase()
				},
				type: "jsonp",
				callback: function(res){
		    	  if (RESET_BP_STORAGE){
	        		  console.log(res);
	        	  }
		    	  bp_schedule[sport] = {};
		          if (res.games){	   
		        	  for (const gameId in res.games) {
		        		  var game = res.games[gameId];
		        		  if (game.event_id && game.link){
		        			  bp_schedule[sport][game.event_id] = game.link;
		        		  }
		        	  }
		          }

		    	  setWithExpiry(keyName, bp_schedule[sport], 30);
				}
			};						
			fetchData(params);
	  }
  }

  function checkBettingProsLocations(){

	  if (bp_locations){
		  return; //already set
	  } 
	  if (getWithExpiry('bp_locations') && !RESET_BP_STORAGE) {
		  bp_locations = getWithExpiry('bp_locations');
      } else {	
	      fetch('https://api.bettingpros.com/v3/locations',
	    		  {'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh', 'fp-request-cors' : 'http://localhost:3000'}}).then(response => response.json()).then(res => {
	    	  if (RESET_BP_STORAGE){
        		  console.log(res);
        	  }
			  bp_locations = [];
	          if (res.locations){	       	  
	        	  for (var i=0; i<res.locations.length; i++){
	        		  var loc= res.locations[i];
        			  bp_locations.push({
        				  abbrev: loc.abbreviation,
	        			  name: loc.label,
	        			  legal: loc.legal.status == 'full' || loc.legal.status == 'online'
	        		  });
	        	  }
	          }
	          setWithExpiry('bp_locations', bp_locations, 30);
		  });
	  }
  }
  
  function checkBettingProsMarkets(){
	  
	  bp_markets = bp_markets || {};
	  if (bp_markets[sport]){
		  return; //already set
	  } 
	  var keyName = 'bp_markets_' + sport;
	  if (getWithExpiry(keyName) && !RESET_BP_STORAGE) {
		  bp_markets[sport] = getWithExpiry(keyName);
      } else {	
	      fetch('https://api.bettingpros.com/v3/markets?sport=' + sport.toUpperCase() + '&market_category=player-props',
	    		  {'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh'}}).then(response => response.json()).then(res => {
        	  if (RESET_BP_STORAGE){
        		  console.log(res);
        	  }
        	  bp_markets[sport] = [];
	          if (res.markets){	        	  
	        	  for (var i=0; i<res.markets.length; i++){
	        		  var m = res.markets[i];
	        		  if (m.active && m.meta){
	        			  bp_markets[sport].push({
		        			  id: m.id,
		        			  name: m.meta.label
		        		  });
	        		  }
	        	  }
	          }
              setWithExpiry(keyName, bp_markets[sport], 7);
		  });
	  }
  }

  function createEvents(eventsArray){

	  var result = [];
      if (eventsArray){	        	  
    	  for (var i=0; i<eventsArray.length; i++){
    		  var e = eventsArray[i];
    		  var time = "";
    		  var d ;
	          try {
				d = new Date(e.scheduled.replace(/\s+/g, 'T') + 'Z');
	          }catch(ex){}
			  var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
			  if (d && DAYS[d.getDay()]){
				time = DAYS[d.getDay()] + ' ';
				time += (1+d.getMonth()) + '/' + d.getDate() + ' ';
				var ampm = ' am';
				if (d.getHours() > 12){
					time += (d.getHours() - 12) + ':';
					ampm = 'pm';
				} else {
					time += d.getHours() + ':';
					if (d.getHours() == 12) {
						ampm = 'pm';
					}
				}
				if (d.getMinutes() < 10){
					time += '0';
				}
				time += d.getMinutes() + ' ' + ampm;
			  }
	          
	          if (e.broadcasts && e.broadcasts.length && e.broadcasts[0].network){
				time += ' - ' + e.broadcasts[0].network;
	          }
	          
	          result.push({
    			  id: e.id,
    			  name: e.visitor + ' @ ' + e.home,
    			  time: time,
    			  link: 'https://www.bettingpros.com' + e.link
    		  });
    	  }
      }
      return result;
  }

      function checkBettingProsEvents(){
    	  bp_events = bp_events || {};
    	  if (bp_events[sport]){
    		  return; //already set
    	  } 
    	  var keyName = 'bp_events_' + sport;
    	  bp_events[sport] = getWithExpiry(keyName);
    	  if (bp_events[sport]){
    		  //found in local storage
          } else {	
    	      fetch('https://api.bettingpros.com/v3/events?sport=' + sport.toUpperCase(),
    	    		  {'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh'}}).then(response => response.json()).then(res => {
            	  if (RESET_BP_STORAGE){
            		  console.log(res);
            	  }
            	  bp_events[sport] = createEvents(res.events);
		    	  setWithExpiry(keyName, bp_events[sport], 1);
    		  });
    	  }
      }
      
      function checkBettingProsPreviousEvents(param, callback){
    	  bp_previous_events = bp_previous_events || {};
    	  if (bp_previous_events[sport]){
    		  callback();
    		  return; //already set
    	  } 
    	  var keyName = 'bp_previous_events_' + sport;
    	  bp_previous_events[sport] = getWithExpiry(keyName);
    	  if (bp_previous_events[sport]){
    		  callback();
    		  //found in local storage
          } else {	
    	      fetch('https://api.bettingpros.com/v3/events?sport=' + sport.toUpperCase() + '&' + param,
    	    		  {'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh'}}).then(response => response.json()).then(res => {
            	  if (RESET_BP_STORAGE){
            		  console.log(res);
            	  }
            	  bp_previous_events[sport] = createEvents(res.events);
		    	  setWithExpiry(keyName, bp_previous_events[sport], 1);
        		  callback();
    		  });
    	  }
      }
          
      function checkBettingProsBooks(){

    	  if (bp_books){
    		  return; //already set
    	  } 
    	  if (getWithExpiry('bp_books') && !RESET_BP_STORAGE) {
    		  bp_books = getWithExpiry('bp_books');
          } else {	
    	      fetch('https://api.bettingpros.com/v3/books',
    	    		  {'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh', 'fp-request-cors' : 'http://localhost:3000'}}).then(response => response.json()).then(res => {
    	    	  if (RESET_BP_STORAGE){
            		  console.log(res);
            	  }
            	  bp_books = [];
    	          if (res.books){	        	  
    	        	  for (var i=0; i<res.books.length; i++){
    	        		  var b = res.books[i];
    	        		  bp_books.push({
		        			  id: b.id,
		        			  name: b.name,
		        			  img: b.image_url,
		        			  img_sq: b.image_square_url,
		        			  link: b.affiliate && b.affiliate.url ? b.affiliate.url : b.link
		        		  });
    	        	  }
    	          }
                  setWithExpiry('bp_books', bp_books, 7);
    		  });
    	  }
      }

      
  var renderProps = function(playerCard, p){
	  
	if (!sport){
		console.log("sport is " + sport);
		return;
	}
	
	var tabName = isBP ? "Picks" : "Props"
	  
	var propsLi = $.fromTemplate(["li",{"children":[["a",{"children":[(tabName)],"data-js-link":"props","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--props"}]],"class":"fp-pc__li"}]);
	$.find(playerCard,'.fp-pc__list--nav')[0].appendChild(propsLi);

    var propsTab = $.find(playerCard, '.fp-pc__tab--props')[0];

    var cs_link = "https://www.bettingpros.com/" + sport + "/picks/prop-bets/";
    cs_link += "?utm_source=fantasypros.com&utm_medium=referral&utm_campaign=playercard";
    
    var header = $.fromTemplate(["div",{"children":[["a",{"children":["View Prop Bets Cheat Sheet"],"href":(cs_link),"target":"_blank","class":"prop-cheat-sheet"}]],"class":"prop-header"}]); 
	propsTab.appendChild(header);
	
	if (!isBP){
		var poweredBy = $.fromTemplate(["div",{"children":[" Powered by ",["a",{"children":[["img",{"src":" https://www.bettingpros.com/assets/images/logo-blue@3x.png"}]],"href":"https://www.bettingpros.com/","target":"_blank"}]],"class":"prop-bp"}]); 
    	header.appendChild(poweredBy);
	}
	
	if (!p.props){
		return;
	}
	
    for (var i=0; i<p.props.length; i++){
    	var prop = p.props[i];
    	if (!prop.label || !prop.sources || !prop.sources.length){
    		continue;
    	}
    	
    	var prop_link = prop.url || cs_link;
    	if (prop_link.indexOf("utm_source") == -1){
    		prop_link += prop_link.indexOf("utm_source") == -1 ? "?" : "&";
    		prop_link += "utm_source=fantasypros.com&utm_medium=referral&utm_campaign=playercard";
    	}
        var propDiv= $.fromTemplate(["div",{"children":[["a",{"children":["View Analysis"],"href":(prop_link),"target":"_blank","class":"prop-link"}],["h4",{"children":[(prop.label)]}],["table",{"children":[["thead",{"children":[["tr",{"children":[["th",{"children":["Source"],"class":"fp-pc__th prop-source"}],["th",{"children":["Projection"],"class":"fp-pc__th prop-proj"}],["th",{"children":["Diff"],"class":"fp-pc__th prop-diff"}],["th",{"children":["Pick"],"class":"fp-pc__th prop-pick"}],["th",{"children":["Prob"],"class":"fp-pc__th prop-diff"}]]}]]}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--prop"}]],"class":"fp-pc__table fp-pc__table-prop"}]],"class":"fp-pc__prop"}]); 		  	
		propsTab.appendChild(propDiv);

	    var propTable = $.find(propDiv, '.fp-pc__tbody--prop')[0];

	    for (var j=0; j<prop.sources.length; j++){
	    	var source = prop.sources[j];
	    	var sourceTr = $.fromTemplate(["tr",{"children":[["td",{"children":[(source.name)],"class":"fp-pc__td prop-source"}],["td",{"children":[(source.projection)],"class":"fp-pc__td prop-proj"}],["td",{"children":[(source.diff)],"class":"fp-pc__td prop-diff"}],["td",{"children":[["a",{"children":[(source.pick)],"href":(prop_link),"target":"_blank"}]],"class":"fp-pc__td prop-pick"}],["td",{"children":[(source.cover)],"class":"fp-pc__td prop-diff"}]]}]); 
			propTable.appendChild(sourceTr);
	    }
    }
	
  };
  
  var getMarket = function(id){
	  if (bp_markets && bp_markets[sport]){
		  for (var i=0; i<bp_markets[sport].length; i++){
			  if (bp_markets[sport][i].id == id){
				  return bp_markets[sport][i];
			  }
		  }
	  }
  };
  
  var getEvent = function(id){
	  if (bp_events && bp_events[sport]){
		  for (var i=0; i<bp_events[sport].length; i++){
			  if (bp_events[sport][i].id == id){
				  return bp_events[sport][i];
			  }
		  }
	  }
	  if (bp_previous_events && bp_previous_events[sport]){
		  for (var i=0; i<bp_previous_events[sport].length; i++){
			  if (bp_previous_events[sport][i].id == id){
				  return bp_previous_events[sport][i];
			  }
		  }
	  }
  };
  
  var getBook = function(id){
	  if (bp_books){
		  for (var i=0; i<bp_books.length; i++){
			  if (bp_books[i].id == id){
				  return bp_books[i];
			  }
		  }
	  }
  };
  
  var checkLocation = function(abbrev){
	  if (abbrev){
		  return abbrev;
	  }
	  if (bp_locations){
		  for (var i=0; i<bp_locations.length; i++){
			  if (bp_locations[i].abbrev == bp_user_loc){
				  return bp_locations[i].legal ? bp_locations[i].abbrev : "ALL";
			  }
		  }
	  }
	  return "ALL";
  };

  var isLegalLocation = function(abbrev){
	  if (bp_locations){
		  for (var i=0; i<bp_locations.length; i++){
			  if (bp_locations[i].abbrev == abbrev){
				  return bp_locations[i].legal;
			  }
		  }
	  }
	  return true;
  };
  

  var fetchPlayerOffers = function(playerCard, player, usePreviousWeek){
	if (bp_markets[sport]){
		var event_id = "";
		if (usePreviousWeek){
			if (bp_previous_events && bp_previous_events[sport]){
				for (var i=0; i<bp_previous_events[sport].length; i++){
					if (bp_previous_events[sport][i].name.indexOf(player.player_team) != -1){
						if (event_id.length){
							event_id += ":";
						}
						event_id += bp_previous_events[sport][i].id;
					}
				}				
			}
		} else if (bp_events && bp_events[sport]){
			for (var i=0; i<bp_events[sport].length; i++){
				if (bp_events[sport][i].name.indexOf(player.player_team) != -1){
					if (event_id.length){
						event_id += ":";
					}
					event_id += bp_events[sport][i].id;
				}
			}
		}
		
		var market_id = "";
		for (var i=0; i<bp_markets[sport].length; i++){
			if (market_id.length){
				market_id += ":";
			}
			market_id += bp_markets[sport][i].id;
		}

		if (event_id.length && market_id.length){
			
			var offersContainer = $.find(playerCard,'.fp-pc__tab--bp-offers-container')[0];
		    $.empty(offersContainer);
			var loadingGif =
				$.fromTemplate(["div",{"class":"fp-pc__loading-gif-container"}]);
		    offersContainer.appendChild(loadingGif);
		    
	    	fetch('https://api.bettingpros.com/v3/offers?sport=' + sport.toUpperCase() + '&event_id=' + event_id + 
	    			'&market_id=' + market_id + '&player_id=' + player.player_id + '&location=' + checkLocation(bp_geo_pc),
	    		{'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh'}}).then(response => response.json()).then(res => {
	    			if (res.offers && res.offers.length){
	    				renderOffers(playerCard, res.offers, player);			    				
	    			} else if (sport == 'nfl' && !usePreviousWeek && player.week > 1){
	    				checkBettingProsPreviousEvents("week=" + (player.week-1), function(){
	    					fetchPlayerOffers(playerCard, player, true);
	    				});
	    			}
	    	});	    				
		} else if (sport == 'nfl' && !usePreviousWeek && player.week > 1){
			checkBettingProsPreviousEvents("week=" + (player.week-1), function(){
				fetchPlayerOffers(playerCard, player, true);
			});
		}
	}
  };

  var fetchPlayerPicks = function(playerCard, player, usePreviousWeek){
	  
	if (bp_events && bp_markets[sport]){
		var event_id = "";
		if (usePreviousWeek){
			if (bp_previous_events && bp_previous_events[sport]){
				for (var i=0; i<bp_previous_events[sport].length; i++){
					if (bp_previous_events[sport][i].name.indexOf(player.player_team) != -1){
						if (event_id.length){
							event_id += ":";
						}
						event_id += bp_previous_events[sport][i].id;
					}
				}				
			}
		} else if (bp_events && bp_events[sport]){
			for (var i=0; i<bp_events[sport].length; i++){
				if (bp_events[sport][i].name.indexOf(player.player_team) != -1){
					if (event_id.length){
						event_id += ":";
					}
					event_id += bp_events[sport][i].id;
				}
			}
		}

		var market_id = "";
		for (var i=0; i<bp_markets[sport].length; i++){
			if (market_id.length){
				market_id += ":";
			}
			market_id += bp_markets[sport][i].id;
		}

		if (event_id.length && market_id.length){

			var propsTab = $.find(playerCard, '.fp-pc__tab--props')[0];
			var propsContainer = $.find(propsTab, '.fp-pc__tab--bp-props-container')[0];
			if (propsContainer){
			    $.empty(propsContainer);
				var loadingGif =
					$.fromTemplate(["div",{"class":"fp-pc__loading-gif-container"}]);
			    	propsContainer.appendChild(loadingGif);
			}
			
	    	fetch('https://api.bettingpros.com/v3/pbcs?sport=' + sport.toUpperCase() + '&event_id=' + event_id + 
	    			'&market_id=' + market_id + '&player_id=' + player.player_id + '&location=' + checkLocation(bp_geo_pc),
	    		{'headers': { 'x-api-key': 'CHi8Hy5CEE4khd46XNYL23dCFX96oUdw6qOt1Dnh', 'fp-request-cors' : 'http://localhost:3000'}}).then(response => response.json()).then(res => {
	    			// console.log(res);
	    			if (res.markets && res.markets.length){
	    				renderPicks(playerCard, res.markets, player);				    				
	    			} else if (sport == 'nfl' && !usePreviousWeek && player.week > 1){
	    				checkBettingProsPreviousEvents("week=" + (player.week-1), function(){
	    					fetchPlayerPicks(playerCard, player, true);
	    				});	    				
	    			}
	    	});			    				
		} else if (sport == 'nfl' && !usePreviousWeek && player.week > 1){
			checkBettingProsPreviousEvents("week=" + (player.week-1), function(){
				fetchPlayerPicks(playerCard, player, true);
			});	    				
		}
	}
  };
  
  var renderPicks = function(playerCard, markets, player){

	  var propsTab = $.find(playerCard, '.fp-pc__tab--props')[0];
	  var propsContainer = $.find(propsTab, '.fp-pc__tab--bp-props-container')[0];
	  
	  if (propsContainer){
		  $.empty(propsContainer);		  
	  } else {	  
		  $.empty(propsTab);
		  
		  	var topPart = 
		  		$.fromTemplate(["div",{"children":[["select",{"id":"bp-picks-locations-select","class":"fp-pc__tab-select"}],["a",{"children":["View All Props"],"href":"/","target":"_blank","class":"fp-pc__tab--bp-props-link fp-pc__tab--bp-props-view-all"}],["div",{"class":"fp-pc__tab--bp-props-divider"}],["a",{"href":"/","target":"_blank","class":"fp-pc__tab--bp-props-link fp-pc__tab--bp-props-event"}]],"class":"fp-pc__tab--bp-props-top"}]);
			propsTab.appendChild(topPart);
		  
			var locationSelect2 = $.find(propsTab, '.fp-pc__tab-select')[0];
			
		    var optAll = document.createElement('option');
		    optAll.value = "ALL";
		    optAll.selected = !bp_geo_pc || (bp_geo_pc == "ALL");
		    optAll.innerHTML = "All Locations";
		    locationSelect2.appendChild(optAll);
		    
			for (var i = 0; i< bp_locations.length; i++){
			    var opt = document.createElement('option');
			    opt.value = bp_locations[i].abbrev;
			    opt.selected = bp_locations[i].abbrev == bp_geo_pc;
			    opt.innerHTML = bp_locations[i].name;
			    locationSelect2.appendChild(opt);
			}

			propsContainer = $.fromTemplate(["div",{"class":"fp-pc__tab--bp-props-container"}]);
			propsTab.appendChild(propsContainer);

			$.listen(locationSelect2, 'change', function(){		    
				bp_geo_pc = locationSelect2.value;
				if (document.getElementById("bp-offers-locations-select")){
					document.getElementById("bp-offers-locations-select").value = locationSelect2.value;
					fetchPlayerOffers(playerCard, player);
				}
			    fetchPlayerPicks(playerCard, player);
                setWithExpiry('bp_geo_pc', bp_geo_pc, 1000);
			});
	  }
	  

	  var prevArticle = $.find(playerCard,'.fp-pc__tab-div--overview--props')[0];  
	  if (prevArticle){
		  $.remove(prevArticle);
	  }
	  
	  markets.sort(function compareFn(m1, m2) {
		  if (m1.offers && m1.offers.length){
			  if (m2.offers && m2.offers.length){
				  return m2.offers[0].diff - m1.offers[0].diff;
			  } else {
				  return -1;
			  }
		  } else if (m2.offers && m2.offers.length){
			  return 1;
		  } else {
			  return 0;
		  }
	  });

	  var propArticle;
	  var propCount = 0;
	  for (var i=0; i<markets.length; i++){
		  var market = markets[i];
		  if (market.offers && market.offers.length){
			  var offer = market.offers[0];
			  var book = getBook(offer.best);
			  
			  if (book){
				  
				  propCount++;

				  if (propCount == 1){
					  
					var offerLink = "https://www.bettingpros.com" + offer.link;
					var slugs = offerLink.split("/");
					if (slugs.length > 5 && slugs[slugs.length-1].length == 0){
						var last = slugs[slugs.length-2];
						if (offerLink.endsWith(last+'/')){
							offerLink = offerLink.substring(0, offerLink.length - last.length -1);
						}						
					}
					  
					$.find(propsTab, '.fp-pc__tab--bp-props-view-all')[0].setAttribute('href', addAffiliateCode(offerLink));
					
					var event = getEvent(offer.event_id);
					var eventLink = $.find(propsTab, '.fp-pc__tab--bp-props-event')[0];
					if (event){
						eventLink.setAttribute('href', addAffiliateCode(event.link));
						eventLink.innerHTML = event.name + " - " + event.time;
						
						if ($.find(playerCard,'.fp-pc__player-details .fp-pc__player-bye').length == 0){
							var playerBye =
								$.fromTemplate(["span",{"children":[(event.name)],"class":"fp-pc__player-bye"}]);
							$.find(playerCard,'.fp-pc__player-details')[0].appendChild(playerBye);
						}
					} 
					
					propArticle =
						$.fromTemplate(["article",{"children":[["div",{"children":[["h2",{"children":["Picks"],"class":"fp-pc__heading"}]],"class":"fp-pc__article-header"}]],"class":"fp-pc__tab-div fp-pc__tab-div--overview fp-pc__tab-div--overview--props gb_skip"}]);
					$.find(playerCard,'.fp-pc__tab--overview')[0].appendChild(propArticle);   
				  } else if (propCount == 2){
						var moreLink = 
							$.fromTemplate(["a",{"children":[" View More Picks "],"data-js-link":"props","onclick":"playercardGenerator.sendGoogleEvent('clickOverviewMorePicks')","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--more fp-pc__link--props"}])
				
						propArticle.prepend(moreLink);

						$.listen(moreLink, 'click', function(){	
							onNavLinkClick(this);
						});
				  }

			        var propDiv= $.fromTemplate(["div",{"children":[["a",{"children":["Place Bet"],"href":(book.link),"target":"_blank","class":"prop-link"}],["img",{"src":(book.img_sq),"alt":(book.name)}],["h4",{"children":["Over/Under ",(offer.line)," ",(market.market_full_label),"?"]}],["table",{"children":[["thead",{"children":[["tr",{"children":[["th",{"children":["Source"],"class":"fp-pc__th prop-source"}],["th",{"children":["Projection"],"class":"fp-pc__th prop-proj"}],["th",{"children":["Line"],"class":"fp-pc__th prop-proj"}],["th",{"children":["Diff"],"class":"fp-pc__th prop-diff"}],["th",{"children":["Pick"],"class":"fp-pc__th prop-pick"}]]}]]}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--prop"}]],"class":"fp-pc__table fp-pc__table-prop"}]],"class":"fp-pc__prop"}]); 		  	
					propsContainer.appendChild(propDiv);
					
					if (!book.img_sq){
						$.remove($.find(propDiv,'img')[0]);
					}
					
					if (offer.bet_analyzer_link){
						var href = "https://www.bettingpros.com" + offer.bet_analyzer_link;
						var betAnalyzerLink = $.fromTemplate(["a",{"children":["View Analysis"],"href":(addAffiliateCode(href)),"target":"_blank","class":"prop-link"}]);
						propDiv.prepend(betAnalyzerLink);
					}

					var propTable = $.find(propDiv, '.fp-pc__tbody--prop')[0];
					
				    var propTable2;
					if (propArticle && propCount == 1){
						propArticle.appendChild(propDiv.cloneNode(true));
						propTable2 = $.find(propArticle, '.fp-pc__tbody--prop')[0];
						$.remove($.find(propArticle, '.prop-link')[0]);
					}
					
					if (!isLegalLocation(bp_geo_pc)){
						$.remove($.find(propDiv, '.prop-link')[0]);
					}

					var proj = offer.projection.toFixed(1) + " " + market.market_suffix;
					var diff = offer.diff ? ( (offer.diff > 0 ? '+' : '') + offer.diff.toFixed(1)) : '-';
					var offerLink = "https://www.bettingpros.com" + offer.link;
			    	var sourceTr = $.fromTemplate(["tr",{"children":[["td",{"children":["Projections"],"class":"fp-pc__td prop-source"}],["td",{"children":[(proj)],"class":"fp-pc__td prop-proj"}],["td",{"children":[(offer.line)," (",(offer.cost),")"],"class":"fp-pc__td prop-proj"}],["td",{"children":[(diff)],"class":"fp-pc__td prop-diff"}],["td",{"children":[["a",{"children":[(offer.recommendation)],"href":(addAffiliateCode(offerLink)),"target":"_blank"}]],"class":"fp-pc__td prop-pick"}]]}]); 
					propTable.appendChild(sourceTr);

					if (propTable2 && propCount == 1){
						propTable2.appendChild(sourceTr.cloneNode(true));
					}
			  }
		  }
	  }
	  
	  if (propCount > 0 && $.find(playerCard,'.fp-pc__li .fp-pc__link--props').length == 0){
			var propsLi = $.fromTemplate(["li",{"children":[["a",{"children":[" Picks "],"data-js-link":"props","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--props"}]],"class":"fp-pc__li"}]);
			$.find(playerCard,'.fp-pc__list--nav')[0].appendChild(propsLi);

			$.listen($.find(propsLi,'.fp-pc__link--nav')[0], 'click', function(){	
				onNavLinkClick(this);
			});
	  }

  }  
  
  var renderOffers = function(playerCard, offers, player){
	
	var offersContainer = $.find(playerCard,'.fp-pc__tab--bp-offers-container')[0];
	  
	if ($.find(playerCard,'.fp-pc__link--bp-offers').length == 0){
		var offersLi = $.fromTemplate(["li",{"children":[["a",{"children":["Prop Odds"],"data-js-link":"bp-offers","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--bp-offers"}]],"class":"fp-pc__li"}]);
		$.insertAfter(offersLi, $.find(playerCard,'.fp-pc__link--games')[0].parentNode);
	
		$.listen($.find(offersLi,'.fp-pc__link--nav')[0], 'click', function(){	
			onNavLinkClick(this);
		});
		
		var locationSelect = document.getElementById("bp-offers-locations-select");

		if (locationSelect){
		    var optAll = document.createElement('option');
		    optAll.value = "ALL";
		    optAll.selected = !bp_geo_pc || (bp_geo_pc == "ALL");
		    optAll.innerHTML = "All Locations";
		    locationSelect.appendChild(optAll);
		    
			for (var i = 0; i< bp_locations.length; i++){
			    var opt = document.createElement('option');
			    opt.value = bp_locations[i].abbrev;
			    opt.selected = bp_locations[i].abbrev == bp_geo_pc;
			    opt.innerHTML = bp_locations[i].name;
			    locationSelect.appendChild(opt);
			}
	
			$.listen(locationSelect, 'change', function(){			    
				bp_geo_pc = locationSelect.value;
				if (document.getElementById("bp-picks-locations-select")){
					document.getElementById("bp-picks-locations-select").value = locationSelect.value;
				    fetchPlayerPicks(playerCard, player);
				}
				fetchPlayerOffers(playerCard, player);
                setWithExpiry('bp_geo_pc', bp_geo_pc, 1000);
			});
		}
	}
	
    $.empty(offersContainer);
	
	for (var i=0; i< offers.length; i++){
		var market = getMarket(offers[i].market_id);
		var event = getEvent(offers[i].event_id);

		if (!market){
			console.log("cannot find market for: ");
			console.log(offers[i]);
		} else if (!event){
			console.log("cannot find event for:");
			console.log(offers[i]);
		} else if (offers[i].active){
			var marketDiv =
				$.fromTemplate(["table",{"children":[["thead",{"children":[["tr",{"children":[["th",{"children":[["div",{"children":[["a",{"children":[" View Matchup "],"href":(addAffiliateCode(event.link)),"target":"_blank","class":"fp-pc__a--market-link"}],["div",{"children":[(market.name)],"class":"fp-pc__div--market-name"}],["div",{"children":[(event.time)],"class":"fp-pc__div--market-details"}]],"class":"fp-pc__div--market-container"}]],"class":"fp-pc__th fp-pc__th--market"}]]}],["tr",{"children":[["th",{"class":"fp-pc__td fp-pc__th-selection-label"}]]}]],"class":"fp-pc__thead fp-pc__thead--selections"}],["tbody",{"class":"fp-pc__tbody fp-pc__tbody--selections"}]],"class":"fp-pc__table"}]);
			offersContainer.appendChild(marketDiv);

			var bookArray = [];
			var bookAdded = {};
			for (var j=0; j<offers[i].selections.length; j++){
				var selection = offers[i].selections[j];
				for (var k=0; k<selection.books.length; k++){
					var bookData = selection.books[k];
					var book = getBook(bookData.id);
					if (book && !bookAdded[bookData.id]){
						bookArray.push(book);
						bookAdded[bookData.id] = true;

						var th = document.createElement('th');
						$.addClass(th,'fp-pc__th');
						$.find(marketDiv,'.fp-pc__thead--selections tr')[1].appendChild(th);
						var bookDiv =
							$.fromTemplate(["img",{"src":(book.img),"alt":(book.name)}]);
						th.appendChild(bookDiv);
					}
				}
			}
			
			$.find(marketDiv,'.fp-pc__th--market')[0].colSpan = 1 + bookArray.length;
			
			for (var j=0; j<offers[i].selections.length; j++){
				var selection = offers[i].selections[j];
				var label = selection.label; //(selection.label.toLowerCase() != 'under' && selection.label.toLowerCase() != 'over') ? player.lastname : selection.label;
				var selectionTr =
					$.fromTemplate(["tr",{"children":[["td",{"children":[(label)],"class":"fp-pc__td fp-pc__td-selection-label"}]]}]);
				$.find(marketDiv,'.fp-pc__tbody--selections')[0].appendChild(selectionTr);
				/*
				if (selection.label.toLowerCase() != 'under' && selection.label.toLowerCase() != 'over'){
					$.remove($.find(selectionTr,'.fp-pc__td-selection-label')[0]);
					var ths = $.find(marketDiv,'.fp-pc__thead--selections .fp-pc__th-selection-label');
					if (ths.length){
						$.remove(ths[0]);
					}
				}*/
				
				for (var k=0; k<bookArray.length; k++){
					var td = document.createElement('td');
					$.addClass(td,'fp-pc__td');
					selectionTr.appendChild(td);
					var book = bookArray[k];
					for (var kk=0; kk<selection.books.length; kk++){
						var bookData = selection.books[kk];
						if (book.id == bookData.id && bookData.lines.length > 0){
							var line = bookData.lines[0];
							var main = line.line;
							var details = (Number(line.cost) > 100 ? '+' : '' ) + line.cost;
							if (selection.label == 'Over'){
								main = 'o' + main;
							} else if (selection.label == 'Under'){
								main = 'u' + main;
							} else if (main == "1"){
								main = details;
								details = "";
							}
				
							var bookDiv =
								$.fromTemplate(["div",{"children":[["div",{"children":[(main)],"class":"fp-pc__div--line-main"}],["div",{"children":[(details)],"class":"fp-pc__div--line-details"}]],"class":"fp-pc__div--line"}]);
							td.appendChild(bookDiv);
							
							if (line.best){
								$.addClass(bookDiv, "fp-pc__div--line-best");
							}

							if (line.link){
								var link = line.link.trim();
								if (link.indexOf("http") != 0){
									link = (link.indexOf("/") == 0 ? "https://www.bettingpros.com" : "https://www.bettingpros.com/") + link;
									link = addAffiliateCode(link);
								}
								var betDiv =
									$.fromTemplate(["div",{"children":[["a",{"children":[" Place Bet "],"href":(link),"target":"_blank"}]],"class":"fp-pc__div--place-bet"}]);
								td.appendChild(betDiv);
							}
						}
					}
				}
			}
		}
	}
	
  };
  
  var renderLeagues = function(playerCard, player_id){

	var leagueLi = $.fromTemplate(["li",{"children":[["a",{"children":["Leagues"],"data-js-link":"mpb-leagues","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--mpb-leagues"}]],"class":"fp-pc__li"}]);
	$.find(playerCard,'.fp-pc__list--nav')[0].appendChild(leagueLi);

    var leagues = getSportData().privateList.leagues;
	var overviewDiv = $.find(playerCard, '.fp-pc__tab--overview')[0];	
	var ownershipDiv =
		$.fromTemplate(["div",{"children":[["h2",{"children":["My Leagues"],"class":"fp-pc__heading"}],["p",{"class":"fp-pc__ownership_summary"}]],"class":"fp-pc__tab-div fp-pc__tab-div--notes gb_skip"}]);
	overviewDiv.appendChild(ownershipDiv);	

	var viewLeagues = 
		$.fromTemplate(["address",{"children":[["a",{"children":["View Leagues"],"data-js-link":"mpb-leagues","tabindex":"0","class":"fp-pc__link fp-pc__link--nav fp-pc__link--more fp-pc__link--notes"}]],"class":"fp-pc__tagline"}])

	ownershipDiv.appendChild(viewLeagues);

	var leagueSummary = $.find(playerCard,'.fp-pc__ownership_summary')[0];
	var availCount = 0;
	var inteamCount = 0;
	var takenCount = 0;
    var leagues = getSportData().privateList.leagues;
	  
	$.each(
		leagues,
	    function(l, index){
	      var av=getAvailabilityByPlayerIdForLeague(player_id,index);
	      if (av === GB_PLAYER_AVAILABLE){
	    	  availCount++;
	      } else if (av === GB_PLAYER_INTEAM){
	    	  inteamCount++;
	      } else {
	    	  takenCount++;
	      }
		}
	);

	if (availCount > 0){
		var summarry = "Available in " + availCount + " of " + leagues.length + " leagues. ";
		var lineSummary = $.fromTemplate(["span",{"children":[(summarry)],"class":"fp-pc__article-content"}]);
		leagueSummary.appendChild(lineSummary);	
	}
	if (inteamCount > 0){
		var summarry = "Rostered by you in " + inteamCount + " league";
	    if (inteamCount > 1){
	    	summarry += "s";            	  
	    }
		summarry += ".";
		var lineSummary = $.fromTemplate(["span",{"children":[(summarry)],"class":"fp-pc__article-content"}]);
		leagueSummary.appendChild(lineSummary);	
		if (availCount > 0){
			$.addClass(leagueSummary, "two-lines");
		}
	}
	if (availCount == 0 && inteamCount == 0){
		var summarry = "Taken in all your leagues.";
		var lineSummary = $.fromTemplate(["span",{"children":[(summarry)],"class":"fp-pc__article-content"}]);
		leagueSummary.appendChild(lineSummary);	
	} 
	  
      var countEven=0;
      var doc = document;
      var teamlist = $.find(playerCard, '.fp-pc__ul-leagues')[0];
      
      var bLeagueStarred = leagues.length > 1;

      $.each(
        leagues,
        function(l, index){    
          teamlist.appendChild(getTeamLi(leagues, l, index, player_id, bLeagueStarred));
      });
  };
  
  function getTeamLi(leagues, l, index, player_id, bLeagueStarred){
      var av=getAvailabilityByPlayerIdForLeague(player_id,index);
      var extraClass="gb_unavailable";
      if(av === GB_PLAYER_AVAILABLE){
          extraClass = "gb_available";
      }else if(av === GB_PLAYER_INTEAM){
          extraClass = "gb_inteam";
      }
      var refresh_date = 'Last Sync: ' +(new Date(parseInt(l[5],10)).toLocaleString());
      var url="https://mpb" + getSportData().sport + ".fantasypros.com/forwardLeague?"+"leagueInfo="+l[3]+"&playerInfo="+player_id+"_"+av+"&sport="+getSportData().sport;
      var teamLi= $.fromTemplate(["li",{"title":(refresh_date),"class":"fp-pc__li-team"}]);

      if (!bLeagueStarred){
          $.addClass(teamLi, "gb_noStar");
      }
      if ( index === 0){
          $.addClass(teamLi, "first-row");
      }
      
      var team_name = l[2];
      var user_team_league = l[1];
      var av_msg = av === GB_PLAYER_UNAVAILABLE ? 
              getAvailabilityLabelByPlayerIdForLeague(player_id, index):
            	  av === GB_PLAYER_INTEAM ? "On your team" : "";
      var av_btn = null;       	
      var av_label = null;       	
      if(av === GB_PLAYER_AVAILABLE){
    	  av_label= $.fromTemplate(["div",{"children":[" Available "],"class":"fp-pc__status-label gb_available"}]);
    	  av_btn = $.fromTemplate(["a",{"children":[" Add "],"target":"_blank","title":"Add this player to your team","href":(url),"onclick":"playercardGenerator.sendGoogleEvent('clickUserLeague')","class":"fp-pc__leagues-btn gb_available"}]);
	      
      }  else if(av === GB_PLAYER_INTEAM){
    	  av_label= $.fromTemplate(["div",{"children":[" Rostered "],"class":"fp-pc__status-label gb_inteam"}]);
    	  av_btn = $.fromTemplate(["a",{"children":[" Drop "],"target":"_blank","title":"Go to your team page","href":(url),"onclick":"playercardGenerator.sendGoogleEvent('clickUserLeague')","class":"fp-pc__leagues-btn gb_inteam"}]);
	  	      
      } else { //taken
    	  av_label= $.fromTemplate(["div",{"children":[" Taken "],"class":"fp-pc__status-label gb_unavailable"}]);
    	  av_msg = "Rostered by: " + av_msg;
          av_btn = $.fromTemplate(["a",{"children":[" Trade "],"target":"_blank","title":"Trade for this player","href":(url),"onclick":"playercardGenerator.sendGoogleEvent('clickUserLeague')","class":"fp-pc__leagues-btn gb_unavailable"}]);
      }

      teamLi.appendChild(
        $.fromTemplate(["jx:frag",{"children":[(av_btn),["div",{"children":[["img",{"alt":( l[0] + ' logo'),"src":('https://cdn.fantasypros.com/playercards/images/sites/'+l[0].toLowerCase()+'.png'),"class":"fp-pc__fantasy-site-logo"}],["span",{"children":[(user_team_league)],"class":"fp-pc__league-name"}]],"class":"gb_overflow"}],["div",{"children":[(team_name)],"class":"fp-pc__team-name gb_overflow"}],["div",{"children":[(av_label),(av_msg)],"class":"fp-pc__league-status gb_overflow"}]]}])
      );
      
      if (index == leagues.length-1){
          $.addClass(teamLi, "gb_lastline");
      }
      
      if (bLeagueStarred) {
      	var instructions = 'http://www.fantasypros.com/' + getSportData().sport + '/myplaybook/';
      	instructions += isPlayerCards ? 'research-assistant-setup.php' : 'player-cards-setup.php';
        
        var starImg = 
            $.fromTemplate(["a",{"children":[["img",{"src":('https://cdn.fantasypros.com/bookmarklet/skin/star'+(l[GB_LEAGUE_STARRED]?'gold':'void')+'.png'),"class":"gb_clickable"}]],"href":(instructions),"title":"click here to set your favorite leagues","class":"fp-pc__star"}]);
	          
        $.insertAfter(starImg,
          $.find(teamLi, '.fp-pc__league-name')[0]
        );
      } 
      
      return teamLi;
  }
  
  
  function isPremium(){
  	return false;
  }

	function styleInjuryRisk(injuryRisk, injuryData){
		var riskLabel = $.find(injuryRisk, '.fp-pc__meter-label')[0];
		var arrow = $.find(injuryRisk, '.fp-pc__arrow')[0];
		var meterLow = $.find(injuryRisk, '.fp-pc__meter--low')[0];
		var meterElevated = $.find(injuryRisk, '.fp-pc__meter--elevated')[0];
		var meterHigh = $.find(injuryRisk, '.fp-pc__meter--high')[0];

		riskLabel.style.cssText = "padding-left: " + injuryData.overall_injury_risk + "%";
		arrow.innerHTML = "&#x25BC;";
		arrow.style.cssText = "padding-left: " + injuryData.overall_injury_risk + "%";
		meterLow.style.cssText = injuryData.overall_injury_risk <= 10 ? '' : 'opacity: .3';
		meterElevated.style.cssText = injuryData.overall_injury_risk > 10  && injuryData.overall_injury_risk <= 20 ? '' : 'opacity: .3';
		meterHigh.style.cssText = injuryData.overall_injury_risk > 20 ? '' : 'opacity: .3';
	}

  function getAffiliateCode(){
	  var c = getFpPageOption("affiliateCode");
	  return c ? c : "cards";
  };

  function addAffiliateCode(url){
	  if (!url){
		  return "#";
	  }
	  var idxP = url.indexOf("#");
	  var base = idxP == -1 ? url : url.substring(0,idxP);
	  if (base.indexOf("fantasypros.com") == -1 && base.indexOf("bettingpros.com") == -1){
		  return url;
	  }
	  if (base.indexOf("?") == -1){
		  base += "?";
	  } else if (base.length > 0 && base[base.length-1] != "?"){
		  base += "&";
	  }
	  base += "partner=" + getAffiliateCode();
	  if (idxP > 0){
		  base += url.substring(idxP);
	  }
	  
	  var hostName = window.location.hostname || '';
	  var utm_source = '';
	  if (isBP){
		  utm_source = "playercard_bp";
	  } else if (hostName.indexOf("fantasypros") != -1){
			if (getFpPageOption("isDraftRoom") || hostName.indexOf("draftwizard") != -1 || hostName.indexOf("dw") != -1){
				utm_source = "playercard_dw";
			} else {
				utm_source = "playercard_fp"
			}
	  } else if (hostName.indexOf(".") != -1){
		  utm_source = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
	  }
	  if (utm_source){
		  base += "&utm_source=" + utm_source;
		  base += "&utm_medium=";
		  if (isResearchAssistant){
			  base += "researchassistant";
		  } else if (isChromeExtension){
			  base += "chromeextension";
		  } else {
			  base += "playercards";
		  }
		  if (current_player_file_name){
			  base += "&utm_content=" + current_player_file_name;
		  }
	  }
	  
	  return base;
  }; 

	function showPlayerCard(playerCard) {		
		document.body.appendChild(playerCard); // Add player card to document				
		$.addClass(document.body, 'fp-overlay-visible'); // Add .fp-overlay-visible to body when a player card is visible				
		removePlayerCardListener(playerCard);		
	}

	function scoringListener(){		
		var btns = document.getElementsByClassName('fp-pc__btn--scoring');
		for ( var i = 0, len = btns.length; i < len; i++ ) {
			$.listen(btns[i], 'click', function(){
				if (window.playercards_scoring != this.dataset.jsScoring){
					window.playercards_scoring = this.dataset.jsScoring;

					var cardTab;
					var links = document.getElementsByClassName('fp-pc__link--nav');
					for ( var i = 0, len = links.length; i < len; i++ ) {
						if (links[i].className.indexOf("fp-pc__link--active") != -1){
							cardTab = links[i].dataset.jsLink;
							break;
						}
					}
					loadPlayerCard(playercardGenerator.cardPlayerId, playercardGenerator.cardIndex, cardTab);
				}
			});
		}
	}
	
	function onNavLinkClick(elt){					
		navLinkHandler(elt.dataset.jsLink, 'tab');
		navLinkHandler(elt.dataset.jsLink, 'link');					
		refreshAdHandler();
		sendEvent('clickTab ' + elt.dataset.jsLink);
		playercardGenerator.cardTab = elt.dataset.jsLink;
		resetFocusableElements();
	}
	
	function navLinkListener(){		
		var links = document.getElementsByClassName('fp-pc__link--nav');
		for ( var i = 0, len = links.length; i < len; i++ ) {
			$.listen(links[i], 'click', function(){	
				onNavLinkClick(this);
			});
		}
	}

	function navLinkHandler(jsLink, elem){
		var activeClass = "fp-pc__" + elem + "--active";
		$.removeClass( document.querySelector('.' + activeClass), activeClass );

		var selector = ".fp-pc__" + elem + "--" + jsLink;
		$.addClass( document.querySelector(selector), activeClass );

		var featured = document.querySelector('.fp-pc__featured');
		if (featured){
			if ( jsLink != 'overview' ){
				$.removeClass(featured, 'fp-pc__featured--active' );
			} else {
				$.addClass(featured, 'fp-pc__featured--active');
			}
		}
	}

	function refreshAdHandler(){	
		
		if (getFpPageOption("requestPlayerCardAd") && window.requestPlayerCardAd){
			
			if (playercardGenerator.lastRefreshedAd &&
					(new Date().getTime() - playercardGenerator.lastRefreshedAd) <= 2000 ){
				// do not call requestPlayerCardAd within 2 seconds of previous call
			} else {				
				window.requestPlayerCardAd(!playercardGenerator.playerCardAdRequested);
				playercardGenerator.lastRefreshedAd = new Date().getTime();
			}
			
		} else if (!playercardGenerator.lastRefreshedAd){
			//first time the player card is opened on this page
			playercardGenerator.lastRefreshedAd = new Date().getTime();
		} else if (getFpPageOption("refreshAds") && window.playercards_ad_slot &&
			(new Date().getTime() - playercardGenerator.lastRefreshedAd) > 2000 ){
			//do not refresh the ad if it's been refreshed in the previous 2 seconds
			googletag.pubads().refresh([window.playercards_ad_slot]);
			playercardGenerator.lastRefreshedAd = new Date().getTime();
		}
	}

	function iteratorListener(){
		var iterators = document.getElementsByClassName('fp-pc__card-iterator');
		for ( var i = 0, len = iterators.length; i < len; i++ ) {
			$.listen(iterators[i], 'click', function(){
				iteratorHandler(this.dataset.jsLink);
			});

			$.listen(document, 'keyup', iteratorKeyHandler);
		}
	}
	
	function tabHandler(e){		
		var evt = e || window.event;
		var key = window.event ? evt.keyCode : evt.which; 
		if ( key == 9 ) { // TAB
			for (var k=0; k<playercardGenerator.focusableEls.length; k++){
				if ( document.activeElement === playercardGenerator.focusableEls[k] ) {
					if ( e.shiftKey ) {
						if (k > 0){
							k--;
						} else {
							k = playercardGenerator.focusableEls.length -1;
						}
					} else {
						if (k < playercardGenerator.focusableEls.length -1){
							k++;
						} else {
							k = 0;
						}
					}
					e.preventDefault();
					playercardGenerator.focusableEls[k].focus();
					break;
				}				
			}
		} else if ( key == 13 ) { // ENTER
			if (e.target && e.target.getAttribute('data-js-link')){
				e.target.click();
			}
		}
	}

	function iteratorKeyHandler(e){		
		var evt = e || window.event;
		var key = window.event ? evt.keyCode : evt.which;
		
		if ( key === 39 ){ // 39 or evt.key == "ArrowRight"
			iteratorHandler("next");
		} else if ( key == 37 ) { // 37 or evt.key == "ArrowLeft"
			iteratorHandler("prev");
		}
	}

	function iteratorHandler(direction){
		// The value of jsLink will either be "prev" or "next"
		var icons = $.find(document.body, '.fp-icon__link');
		for (var i=0; i<icons.length; i++){
			if (icons[i].getAttribute('data-fp-index') == playercardGenerator.cardIndex){
				var fpId = icons[i].getAttribute('data-fp-id');
				var j = i;
				if (direction == 'prev'){
					while (j > 0){
						j--;
						if ($.find(icons[j], '.fp-icon__icon').length == 0 && 
								icons[j].className.indexOf("fp-no-icon") == -1){
							continue;
						}
						if (icons[j].getAttribute('data-fp-id') != fpId){
							icons[j].click();
							return;
						}
					}
					j = icons.length; // loop once
					while (j > i+1){
						j--;
						if ($.find(icons[j], '.fp-icon__icon').length == 0 && 
								icons[j].className.indexOf("fp-no-icon") == -1){
							continue;
						}
						if (icons[j].getAttribute('data-fp-id') != fpId){
							icons[j].click();
							return;
						}
					}
				} else {
					while (j < icons.length -1){
						j++;
	//					console.log(icons[j]);
						if ($.find(icons[j], '.fp-icon__icon').length == 0 && 
								icons[j].className.indexOf("fp-no-icon") == -1){
							continue;
						}
						if (icons[j].getAttribute('data-fp-id') != fpId){
							icons[j].click();
							return;
						}
					}
					j = -1; // loop once
					while (j < i-1){
						j++;
						if ($.find(icons[j], '.fp-icon__icon').length == 0 && 
								icons[j].className.indexOf("fp-no-icon") == -1){
							continue;
						}
						if (icons[j].getAttribute('data-fp-id') != fpId){
							icons[j].click();
							return;
						}
					}
				}
				break;
			}
		}
		if (direction == 'prev'){
			sendEvent('clickPrevCard');
		} else {
			sendEvent('clickNextCard');
		}
	}	

	function removePlayerCardListener(playerCard){				
		// listen for a click or keyup when the player card is displayed.
  	$.listen(playerCard, 'click', removePlayerCardHandler);
  	$.listen(document, 'keyup', removePlayerCardHandler);
	}

	function removePlayerCardHandler(e){	
		if (!document.getElementById('fp-player-card')){
			return;// no player card to remove
		}
		
		var evt = e || window.event;
		var key = window.event ? evt.keyCode : evt.which;
		
		if (key == 9 || key == 16){
			return; //TAB and SHIFT
		}
		
		// close the card if the clicked element contains the appropriate dataset.jsListener or escape key was clicked
		if (evt.forceClose || key == 27 || 
				(evt && evt.target && evt.target.dataset.jsListener && evt.target.dataset.jsListener.toLowerCase() == 'fp-js-remove-player-card')){			
			$.remove(document.getElementById('fp-player-card'));			
			$.removeClass(document.body, 'fp-overlay-visible');
			if (document.body.className == "") document.body.removeAttribute('class');

			// remove keyup listeners
			$.removeListener(document, 'keyup', removePlayerCardHandler);
			$.removeListener(document, 'keyup', iteratorKeyHandler);
			$.removeListener(document, 'keydown', tabHandler);	
			
			if (playercardGenerator.focusedElBeforeOpen){
				playercardGenerator.focusedElBeforeOpen.focus();
				playercardGenerator.focusedElBeforeOpen = undefined;
			}
		}
	}

	function buildLinkIcon(fpLink, fpId){		
		// Check for fpId so that initial controllers.js call doesn't create a notes icon
		if ( !isNaN(fpId) ) {		
			// Create the notes icon container div and add class .fp-icon__container
			var container = document.createElement('div');
			container.className = "fp-icon__container";	

			var anchor = document.createElement('a');
			anchor.href = "javascript:void(0)";
			anchor.className = 'fp-icon__link fp-id-' + fpId;				
			anchor.title = "Open Player Card";			
			if (fpLink.getAttribute('fp-player-name')){			
				anchor.title = "Open Player Card for " + fpLink.getAttribute('fp-player-name');
			}			
			anchor.dataset.fpId = fpId;
		//	console.log('Check buildLinkIcon anchor.dataset.fpIcon');
		//	anchor.dataset.fpIcon = "Add JSON here so it matches https://www.fantasypros.com/nfl/rankings/qb.php";
			anchor.innerHTML = '<span class="fp-icon__icon"></span>';				
			container.appendChild(anchor);	
			
			// Add as sibling to fpLink
			fpLink.parentNode.insertBefore(container, fpLink.nextSibling);
		}
	}

	function showDisambiguationPopup(pfData){
		var disambiguationPopup =
			$.fromTemplate(["article",{"children":[["div",{"children":[["div",{"children":[" Select a Player ",["button",{"children":[["span",{"children":["X"],"data-js-listener":"fp-js-remove-player-card","aria-hidden":"true"}]],"type":"button","aria-label":"Close","data-js-listener":"fp-js-remove-player-card","class":"fp-pc__close-button"}]],"class":"fp-pc__disambiguation-header"}],["ul",{"class":"fp-pc__disambiguation-list"}]],"class":"fp-pc__disambiguation-container"}]],"id":"fp-player-card","data-js-listener":"fp-js-remove-player-card","class":"fp-player-card fp-pc fp-pc__container"}]);

		var ul = $.find(disambiguationPopup, '.fp-pc__disambiguation-list')[0];
		
		for (var i=0; i<pfData.matches.length; i++){
			var p = pfData.matches[i];
			var team = getSportData().publicList.Dictionary[p.id[1]];
			var pos = getSportData().publicList.Dictionary[p.id[2]];
			var fpId = p.id[PLAYER_ID];
			
			var playerLabel = $.capitalize(p.firstname)+' '+$.capitalize(p.lastname);
			var playerPosTeam = getSportData().publicList.Dictionary[p.id[1]] +
				' - ' + getSportData().publicList.Dictionary[p.id[2]];
			var player_img_250 = "https://images.fantasypros.com/images/mlb/players/250x250/" + fpId + ".jpg"
			var playerLi = $.fromTemplate(["li",{"children":[["img",{"src":(player_img_250),"onerror":"this.src='https://images.fantasypros.com/images/photo_missing_square.jpg'"}],["div",{"class":"fp-pc__spacer"}],["a",{"children":[(playerLabel)],"href":"javascript:void(0)","class":"fp-pc__player-select"}],["br"],["span",{"children":[(playerPosTeam)],"class":"fp-pc__pos-team"}],["a",{"children":[["span",{"class":"fp-icon__icon"}]],"class":"fpIcon fp-icon__link"}],["div",{"style":"clear:both"}]],"data-js-fpid":(fpId)}]);
			ul.appendChild(playerLi);
			playerLi.addEventListener('click', function(){
				loadPlayerCard(this.dataset.jsFpid, 0);
			});

			addIconClasses($.find(playerLi, '.fp-icon__link')[0], {'id':[fpId]}, true);
		}	
			
		emptyPlayerCard();
		showPlayerCard(disambiguationPopup);
	};
	
	function loadPlayerCard(fpId, cardIndex, cardTab, iframeClick, hideIterators){
		cardTab = cardTab || playercardGenerator.cardTab;
		if (getFpPageOption("isInIframe") && window.top != window.self){
			top.postMessage("PLAYERCARD;" + cardTab + ";" + fpId, '*');
			return;
		}	  
		if (typeof iframeClick != 'undefined') { 
			iframeClick = iframeClick;
		} else {
			var iframeClick = {
				isInIframe: false,
				clientY: null,
				screenY: null,
				outerHeight: null
			}
		}

		emptyPlayerCard();
		loadingGif();
		playercardGenerator.cardPlayerId = fpId;
		playercardGenerator.cardIndex = cardIndex;

		if (sport == 'epl' || sport == 'aaf'){

			for (var lastname in getSportData().publicList){
			  var playersWithLastName=getSportData().publicList[lastname];
			  for (var firstname in playersWithLastName){
				  for (var k =0; k < playersWithLastName[firstname].length; k++){
					  var p = playersWithLastName[firstname][k];
					  if (p && p.length >= 3 && p[PLAYER_ID] == fpId){

						  buildPlayerCard({
								  player_id: fpId,
								  player_name: $.capitalize(firstname)+' '+$.capitalize(lastname),
								  player_team: getSportData().publicList.Dictionary[p[2]],
								  player_positions: getSportData().publicList.Dictionary[p[1]],
								  player_page_url:"",
								  stats:[]
						      }, cardTab, iframeClick, hideIterators);
						  return;
					  }
				  }
			  }
			}
			return;
		}
		
		var queryParams = {
			player: fpId
		}
		if (sport == 'nfl'){
			queryParams.week = 'current';
			if (typeof getFpPageOption("week") != 'undefined'){
				queryParams.week = getFpPageOption("week");
			}
			window.playercards_scoring = window.playercards_scoring || getFpPageOption("scoring") || 'STD';
			queryParams.scoring = window.playercards_scoring;
		} else if (sport == 'nba' && getFpPageOption("scoring")){
			queryParams.scoring = getFpPageOption("scoring");
		}
		
		var params = {
				url: "https://partners.fantasypros.com/api/v1/"+ 
					//"http://fuentes.fantasypros.com/api/v1/" +
					sport +"-player.php?api_key=2efb16f8f36d0897c3e188b67e3292d5",
				data: queryParams,
				type: "jsonp",
				callback: function(json){
					if (json.player_page_url){
						sendPageView(json.player_page_url);
					}
					buildPlayerCard(json, cardTab, iframeClick, hideIterators);
					sendEvent('view');
				}
			};						
		fetchData(params);
	}
	
	function playerLinkListener(sport) {
		var fpLinks = $.find(document, '.fp-icon__link');
		var index = 0;
		fpLinks.forEach(function(fpLink){	
			var fpId = fpLink.getAttribute('data-fp-id');
			if (fpId){
				addIconClasses(fpLink, {'id':[fpId]}, true);
				
				fpLink.dataset.fpIndex = index++;
				fpLink.addEventListener('click', function(evt){

					var iframeClick = {}
					if (!getFpPageOption("isInIframe")) {
						iframeClick.isInIframe = false;
						iframeClick.clientY = null;
						iframeClick.screenY = null;
						iframeClick.outerHeight = null;
					} else {
						iframeClick.isInIframe = true;
						iframeClick.clientY = evt.clientY;
						iframeClick.screenY = evt.screenY;
						iframeClick.outerHeight = window.outerHeight;
					}
					
					loadPlayerCard(fpId, this.getAttribute('data-fp-index'), undefined, iframeClick);
					$.kill(evt);
					return false;
				});	
			} else if (fpLink.getAttribute('data-pf-icon')){
				fpLink.addEventListener('click', function(evt){	
					showDisambiguationPopup(JSON.parse(fpLink.getAttribute('data-pf-icon')));
					$.kill(evt);
					return false;
				});
			}
			if (getFpPageOption("isVueJS") && fpLink.className.indexOf("fp-no-icon") != -1){
				//extra class conflicts with vue.js
				$.removeClass(fpLink, 'fp-icon__link');
			}
		});	
	}
	
	function getPlayerIconsIE() {
	    var mynodes = $.find(document.body, 'a.fp-player-link');
	    mynodes.snapshotLength=mynodes.length;
	    mynodes.snapshotItem=function(i){
	        return mynodes[i];
	    }
	    return mynodes;
	}

	function checkPlayerIcons() {
		
		var result = typeof(XPathResult) !== 'undefined' ? 
			document.evaluate('//a[contains(@class,"fp-player-link")]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null) : 
				getPlayerIconsIE();
			
		var hostName = window.location.hostname || '';
		if (result.snapshotLength == 0 || (hostName.indexOf("pff") != -1 && result.snapshotLength == 1)){
			if (getFpPageOption("parseFullText") || isResearchAssistant || isChromeExtension){
				parseFullText();
			}
		} else {
			
		    for (var i = 0; i < result.snapshotLength; i++ ) {
		    	var fpLink=result.snapshotItem(i);
		    	var idx1 = fpLink.className.indexOf("fp-id-");
		      if (idx1 == -1){
		          continue;
		      }
		      var fpId = fpLink.className.substring(idx1 + "fp-id-".length);
		      var idx2 = fpId.indexOf(" ");
		      if (idx2 != -1){
		          fpId = fpId.substring(0,idx2);
		      }
		      
		      if (fpLink.hasAttribute('data-fp-id') && fpId == fpLink.getAttribute('data-fp-id')){
		    	  //this link has already been processed	    	  
		    	  continue;
		      }    
		            
		      fpLink.setAttribute('data-fp-id', fpId);

		      if (fpLink.className.indexOf("fp-no-icon") == -1){
			      buildLinkIcon(fpLink, fpId);
		      } else if (fpLink.className.indexOf("fp-icon__link") == -1){
		    	  fpLink.href = "javascript:void(0)";			
		    	  fpLink.title = "Open Player Card";	
		    	  if (fpLink.getAttribute('fp-player-name')){			
		    		  fpLink.title = "Open Player Card for " + fpLink.getAttribute('fp-player-name');
		    	  }			
		    	  fpLink.dataset.fpId = fpId;
		    	  fpLink.className += " fp-icon__link";
		      }
		    }
		}
		
		playerLinkListener(sport);
	}

	var idcounter = 0; // id of htmlelements
	
	var showMsg = function(array_msg) {
		  if (isPlayerCards){
			  return; //Do not show messages for player cards
		  }
		  
	      if(!isTopFrame()){
	          return;
	      }
	      
	      var body = document.body;
	      var msgBox = $.get('gb_msg_box');
	      if(!msgBox){
	          msgBox = $.N('div', {id:'gb_msg_box', 'class':'gb_skip'});
	          if(body.childNodes.length>0){
	              body.insertBefore(
	                  msgBox,
	                  body.firstChild    
	              );
	          }else{
	              body.appendChild(msgBox);
	          }
	      }
	      $.empty(msgBox);
	      /*
	      msgBox.appendChild(
	        $.N('img', {
	          src: GB_FANTASTREAK_FILELOC+'skin/P1.png'
	        })
	      );
	      */
	      msg_content = $.N('div', {'class': 'gb_msg_content'});
	      $.each(array_msg, function(s) {
	        var block = $.N('div');
	        if (typeof s === 'string') {
	          block.appendChild(document.createTextNode(s));
	        } else {
	          block.appendChild(s);
	        }
	        msg_content.appendChild(block);
	      });
	      msgBox.appendChild(msg_content);
	}

	var hideMsg = function(){
	      if(!isTopFrame()){
	        return;
	      }
	      var msgBox = $.get('gb_msg_box');
	      if(msgBox){
	    	  $.remove(msgBox);
	      }
	};
	
	/* html element to omit */
	var except = ',html,head,style,option,title,link,meta,script,object,iframe,form,button,select,table,tr,hr,textarea,input,';

	if (getFpPageOption("excludeTags")){
		except += getFpPageOption("excludeTags") + ",";
	}
	var getRootNode = function() {
		return document.body;
	};
	/** returns all the text nodes in the document **/
	var getDocumentTextNodes=function(){
	      var doc=document;
	      return doc.evaluate(".//*[ false=contains('"+except+"' , concat(',',concat(translate(name(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'),',')) )]/text()", getRootNode(), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
	};
	
	var getDocumentTextNodes_IE=function(){
	      var doc=document;
	      var domcontainers= $.find(getRootNode(), '*!'+except.substr(1,except.length-2));
	      var result=[];
	      $.each(domcontainers, function(container) {
	          var txtnodes= $.each(
                  container.childNodes,
                  function(nd){    
                      if(nd.nodeType===3){
                          result.push(nd);
                      }
                  }
              );
	      });
	      result.snapshotLength=result.length;
	      result.snapshotItem=function(i){
	          return result[i];
	      }
	      return result;
	};
	  
	var getNodeText=function(node){
	    return $.getNodeText(node);
	};
	  
	var setNodeText=function(node,txt){
	      if(typeof node.textContent !== "undefined"){
	          node.textContent=txt;
	          return;
	      }
	      if(typeof node.nodeValue !== "undefined"){
	          node.nodeValue=txt;
	          if (node.nodeValue == null) {
	            node.innerText = txt;
	          }
	          return;
	      }
	};

	var addSkip=function(el){
	    $.addClass(el, 'gb_skip');
	};
	/* gets the values of an object */
	var toQuickString = function(obj) {
	      var res='';
	      for(var nm in obj){
	          try {
	              res+=nm+'['+(typeof obj[nm])+']:'+obj[nm]+'\n';
	          }catch(ex){
	          }
	          
	      }
	      return res;
	};
	/* creates the regular expression to match the player's last names */
	var doRegExp=function(){
	      if(!getSportData().rExp){
	          getSportData().rExp = new RegExp('\\b('+getSportData().publicList.L+')\\b','gi');
	      }
	      return getSportData().rExp;
	};
	var getPlayerInitials = function(firstnames) {
	    var initials=[];
	    var iniHash={};
	    $.each(
	        firstnames.split('|'),
	        function(f){
	          var initial=f.charAt(0);
	          if(!iniHash[initial]){
	            iniHash[initial]=true;
	            initials.push(initial);
	          }
	        }
	    );
	    return initials;
	}
	  
	var trimRight = function(s) {
	    if (s.trimRight) {
	      return s.trimRight();
	    }else{
	      return s.replace(/^\s+/, '');
	    }
	};
	  
	var trimLeft = function(s) {
	    if(s.trimLeft){
	      return s.trimLeft();
	    }else{
	      return s.replace(/\s+$/, '');
	    }
	};
	var trim=$.trim;
	
	/** lastname:mandatory, firstname:optional
	 * returns an array of players corresponding to the provided lastname/firstname
	 **/    
	var getPlayer=function(lastname,firstname){
	    try{
	      if (lastname && lastname.indexOf("\\'") != -1){
	    	  lastname = lastname.replace("\\'", "'");
	      }
	      if (firstname && firstname.indexOf("\\'") != -1){
	    	  firstname = firstname.replace("\\'", "'");
	      }
	      var playersWithLastName=getSportData().publicList[lastname];
	      var arrResult=[];
	      
	      if(firstname && (playersWithLastName[firstname]!=null)){
	          $.each(
	            playersWithLastName[firstname],
	            function(id){
	              arrResult.push({
	                  "firstname": firstname,
	                  "lastname": lastname,
	                  "id":id
	              });
	          });
	      }else{
	          var addedplayerids=[];
	          if(firstname){
	              var fName=firstname.replace('.','');
	              for(var p in playersWithLastName){
	                  if(playersWithLastName[p] instanceof Array){
	                      if($.index(p, fName) === 0) {
	                          $.each(
	                            playersWithLastName[p],
	                            function(id){
	                              if($.index(addedplayerids, id[PLAYER_ID]) === -1){
	                                  addedplayerids.push(id[PLAYER_ID]);
	                                  arrResult.push({
	                                      "firstname": p,
	                                      "lastname": lastname,
	                                      "id":id
	                                  });
	                              }
	                          });
	                      }
	                  }
	              }            
	          }else{
	              for(var p in playersWithLastName){
	                  if(playersWithLastName[p] instanceof Array){
	                      $.each(
	                        playersWithLastName[p],
	                        function(id){
	                          if($.index(addedplayerids, id[PLAYER_ID]) === -1){
	                              addedplayerids.push(id[PLAYER_ID]);
	                              arrResult.push({
	                                  "firstname": p,
	                                  "lastname": lastname,
	                                  "id":id
	                              });
	                          }
	                      });
	                  }
	              }
	          }
	      
	      }
	      return arrResult;
	      }catch(e){
	          /*alertjs(e);
	          alert(lastname+' '+firstname);*/
	      }
	}

	/* for a player id, returns a global availability status */  
	var getAvailabilityByPlayerId=function(pid){
	      var pStat=getSportData().privateList.playersStatuses[pid];
	      if(!pStat){
	          return GB_PLAYER_AVAILABLE;
	      }
	      var leagues=getSportData().privateList.leagues;
	      
	      var bLeagueStarred = $.some(leagues, function(league){
	          return league[GB_LEAGUE_STARRED];
	      });
	      
	      var res=GB_PLAYER_UNAVAILABLE;
	      $.some(pStat, function(status, index){
	          if(bLeagueStarred && !leagues[index][GB_LEAGUE_STARRED]){
	              return false;
	          }
	          if(status===GB_PLAYER_INTEAM){
	              res=GB_PLAYER_INTEAM;
	              return false;
	          }
	          if(status===GB_PLAYER_AVAILABLE){
	              res=GB_PLAYER_AVAILABLE;
	              return true;
	          }
	          return false;
	      });
	      return res;
	};
	  
	var getAvailabilityByPlayerIdForLeague=function(pid, leagueindex){
	      var pStat=getSportData().privateList.playersStatuses[pid];
	      if(!pStat){
	          return GB_PLAYER_AVAILABLE;
	      }
	      var res=GB_PLAYER_UNAVAILABLE;
	      var status=pStat[leagueindex];
	      if(status===GB_PLAYER_INTEAM){
	              res=GB_PLAYER_INTEAM;
	      }
	      if(status===GB_PLAYER_AVAILABLE){
	          res=GB_PLAYER_AVAILABLE;
	      }
	      return res;
	};
	  
	var getAvailabilityLabelByPlayerIdForLeague = function(pid, leagueindex) {
	      var pStat=getSportData().privateList.playersStatuses[pid];
	      return getSportData().privateList.Dictionary[pStat[leagueindex]];
	  
	};
	  
	/* for an array of players, returns a global availability status */
	var getPlayersAvailability=function(arrPlayers){
	      var isAvailable=GB_PLAYER_UNAVAILABLE;
	      $.some(arrPlayers, function(p){
	              var av=getAvailabilityByPlayerId(p.id[PLAYER_ID]);
	              if(av===GB_PLAYER_INTEAM){
	                  isAvailable=GB_PLAYER_INTEAM;
	                  return false;
	              }
	              if(av===GB_PLAYER_AVAILABLE){
	                  isAvailable=GB_PLAYER_AVAILABLE;
	                  return true;
	              }
	              return false;
	          }           
	      );
	      return isAvailable;
	  };  
	  
	/* for an array of players, returns a global availability status */
	var getPlayersMultiAvailability=function(arrPlayers){
	    var res = {};
	    $.each(arrPlayers, function(p){
	        var av=getAvailabilityByPlayerId(p.id[PLAYER_ID]);
	        if(av===GB_PLAYER_INTEAM){
	          res['inteam'] = 1;
	        } else if(av===GB_PLAYER_AVAILABLE){
	          res['available'] = 1;
	        } else {
	          res['unavailable'] = 1;
	        }
	    });
	    return res;
	};
	
	var addIconClasses = function(icon, playerData, firstName){
		
		if (getFpPageOption("isVueJS") && icon.className.indexOf("fp-no-icon") != -1){
			// extra classes conflict with Vue.js
		} else {
		
	        if (getSportData() && getSportData().privateList){
	            var _btnClassName = '';
		        if (getSportData().privateList.logged===false){
		            _btnClassName="gb_loggedout";
		            if(!firstName){
		                _btnClassName+="_small";
		            }
		        } else if (getSportData().privateList.leagues == undefined || getSportData().privateList.leagues.length == 0){
		            _btnClassName="gb_unavailable";
		            if(!firstName){
		                _btnClassName+="_small";
		            }
		        } else {
		            var isAPlayerAvailable=getPlayersAvailability([playerData]);
		            if(isAPlayerAvailable===GB_PLAYER_INTEAM){
		                _btnClassName="gb_inteam";
		            }else if(isAPlayerAvailable===GB_PLAYER_AVAILABLE){
		                _btnClassName="gb_available";
		            }else{
		                _btnClassName="gb_unavailable";
		            }
		            if(!firstName){
		                _btnClassName+="_small";
		            }
		        }
		        $.addClass(icon, _btnClassName);  
	        }
	        
	        if (isChromeExtension){
	      	  $.addClass(icon, 'fpResearchAssistantIcon'); 
	      	  $.addClass(icon, 'fpExtensionIcon'); 
	        } else if (isPlayerCards){
	      	  $.addClass(icon, getFpPageOption("useBigIcons") ? 'fp-news-icon-big' : 'fp-news-icon');
	        } else { //if (isResearchAssistant){
	      	  $.addClass(icon, 'fp-research-icon'); 
	        }
	        
	        if (getSportData() && getSportData().playersWithRecentNews){
		        var playersWithRecentNews = getSportData().playersWithRecentNews;
		  	  	var fpId = playerData.id[PLAYER_ID];
		        if (playersWithRecentNews[fpId]){
		      	  $.addClass(icon, 'gb_recent'); 
		        }
	        }
		}


  	  	var youTubeData = undefined;
  	  	var minuteData = undefined;
  	  	var jwData = undefined;
  	  	var stnData = undefined;
        if (getFpPageOption("showVideoIcons")){                    	  
      	  if (getFpPageOption("showVideoIcons") === true || 
      			  getFpPageOption("showVideoIcons") == 'SL' || 
      			  getFpPageOption("showVideoIcons") == 'BOTH'){
      		if (getSportData().playersWithJWVideoSL && getSportData().playersWithJWVideoSL[fpId]){
      			jwData = getSportData().playersWithJWVideoSL[fpId];
    		  } else if (getSportData().playersWithMinuteVideoSL && getSportData().playersWithMinuteVideoSL[fpId]){
      			minuteData = getSportData().playersWithMinuteVideoSL[fpId];
    		  } else if (getSportData().playersWithYouTubeVideoSL && getSportData().playersWithYouTubeVideoSL[fpId]){
      			youTubeData = getSportData().playersWithYouTubeVideoSL[fpId];
    		  } else if (getSportData().playersWithSendToNewsVideoSL && getSportData().playersWithSendToNewsVideoSL[fpId]){
    			stnData = getSportData().playersWithSendToNewsVideoSL[fpId];
      		  }
      	  }
      	  if (!youTubeData && !minuteData && !jwData && !stnData && (getFpPageOption("showVideoIcons") == 'DFS' || 
      			  getFpPageOption("showVideoIcons") == 'BOTH')){
      		if (getSportData().playersWithJWVideoDFS && getSportData().playersWithJWVideoDFS[fpId]){
      			jwData = getSportData().playersWithJWVideoDFS[fpId];
    		  } else if (getSportData().playersWithMinuteVideoDFS && getSportData().playersWithMinuteVideoDFS[fpId]){
      			minuteData = getSportData().playersWithMinuteVideoDFS[fpId];
    		  } else if (getSportData().playersWithYouTubeVideoDFS && getSportData().playersWithYouTubeVideoDFS[fpId]){
      			youTubeData = getSportData().playersWithYouTubeVideoDFS[fpId];
    		  } else if (getSportData().playersWithSendToNewsVideoDFS && getSportData().playersWithSendToNewsVideoDFS[fpId]){
      			stnData = getSportData().playersWithSendToNewsVideoDFS[fpId];
      		  }
      	  }
        }
        
        if (jwData){
			var videoIcon = document.createElement('a');
			videoIcon.href = "javascript:void(0)";
			videoIcon.className = 'fp-icon__link fp-id-' + fpId;	
			videoIcon.title = icon.title.replace("Open Player Card","Open Video Clip");
			videoIcon.dataset.fpId = fpId;
			videoIcon.innerHTML = '<span class="fp-icon__video"></span>';
            $.insertAfter(videoIcon, icon);

            videoIcon.addEventListener('click', function(evt){	
            	playJWVideo(evt, jwData[1], fpId, jwData[4], jwData[5]);
	    	    $.kill(evt);
			});
        	
        } else if (minuteData){
			var videoIcon = document.createElement('a');
			videoIcon.href = "javascript:void(0)";
			videoIcon.className = 'fp-icon__link fp-id-' + fpId;	
			videoIcon.title = icon.title.replace("Open Player Card","Open Video Clip");
			videoIcon.dataset.fpId = fpId;
			videoIcon.innerHTML = '<span class="fp-icon__video"></span>';
            $.insertAfter(videoIcon, icon);

            videoIcon.addEventListener('click', function(evt){	
	      	  	playMinuteVideo(evt, minuteData[1], fpId);
	    	    $.kill(evt);
			});
  	  	} else if (youTubeData){
			var videoIcon = document.createElement('a');
			videoIcon.href = "javascript:void(0)";
			videoIcon.className = 'fp-icon__link fp-id-' + fpId;	
			videoIcon.title = icon.title.replace("Open Player Card","Open Video Clip");
			videoIcon.dataset.fpId = fpId;
			videoIcon.innerHTML = '<span class="fp-icon__video"></span>';
            $.insertAfter(videoIcon, icon);

            videoIcon.addEventListener('click', function(evt){	
	      	  	playVideo(evt, youTubeData[1], fpId);
	    	    $.kill(evt);
			});
  	  	} else if (stnData){
			var videoIcon = document.createElement('a');
			videoIcon.href = "javascript:void(0)";
			videoIcon.className = 'fp-icon__link fp-id-' + fpId;	
			videoIcon.title = icon.title.replace("Open Player Card","Open Video Clip");
			videoIcon.dataset.fpId = fpId;
			videoIcon.innerHTML = '<span class="fp-icon__video"></span>';
            $.insertAfter(videoIcon, icon);

            videoIcon.addEventListener('click', function(evt){	
	      	  	playSendToNewsVideo(evt, stnData[1], fpId, stnData[4], stnData[5]);
	    	    $.kill(evt);
			});
  	  	}
        
  	    var podcastData = undefined;
        if (getSportData() && getFpPageOption("showPodcastIcons")){                    	  
    	  if (getFpPageOption("showPodcastIcons") === true || 
    			  getFpPageOption("showPodcastIcons") == 'SL' || 
    			  getFpPageOption("showPodcastIcons") == 'BOTH'){
    		  if (getSportData().playersWithRecentPodcastSL && getSportData().playersWithRecentPodcastSL[fpId]){
    			  podcastData = getSportData().playersWithRecentPodcastSL[fpId];
    		  }
    	  }
    	  if (!podcastData && (getFpPageOption("showPodcastIcons") == 'DFS' || 
    			  getFpPageOption("showPodcastIcons") == 'BOTH')){
    		  if (getSportData().playersWithRecentPodcastDFS && getSportData().playersWithRecentPodcastDFS[fpId]){
    			  podcastData = getSportData().playersWithRecentPodcastDFS[fpId];
    		  }
    	  }
        }

        if (podcastData){
			var podcastIcon = document.createElement('a');
			podcastIcon.href = "javascript:void(0)";
			podcastIcon.className = 'fp-icon__link fp-id-' + fpId;				
			podcastIcon.title = icon.title.replace("Open Player Card","Listen to Podcast Clip");
			podcastIcon.dataset.fpId = fpId;
			podcastIcon.innerHTML = '<span class="fp-icon__podcast"></span>';
            $.insertAfter(podcastIcon, icon);
            
            podcastIcon.addEventListener('click', function(evt){	
	      	  	playPodcast(evt, podcastData[1], fpId);
	    	    $.kill(evt);
			});
        }
	}
	
	/* set the flag color depending on player's availability then attach callback */
	var attachPopup=function(playerLink, lastName, firstName){
          var icon = playerLink.lastChild;          

          if (isChromeExtension){
        	  $.addClass(icon, 'fpResearchAssistantIcon'); 
        	  $.addClass(icon, 'fpExtensionIcon'); 
          } else if (isPlayerCards){
        	  $.addClass(icon, getFpPageOption("useBigIcons") ? 'fp-news-icon-big' : 'fp-news-icon');
          } else { //if (isResearchAssistant){
        	  $.addClass(icon, 'fp-research-icon'); 
          }
          
          firstName=(firstName)?trim(firstName.toLowerCase()):null;
          var doc=document;
          var arrplayers=getPlayer(lastName,firstName);

          if (arrplayers && arrplayers.length == 1){
        	  var fpId = arrplayers[0].id[PLAYER_ID];
        	  icon.dataset.fpId = fpId;
          } else {
	          var _btnClassName = '';
	          if (getSportData().privateList.logged===false){
	              _btnClassName="gb_loggedout";
	              if(!firstName){
	                  _btnClassName+="_small";
	              }
	          } else if (getSportData().privateList.leagues == undefined || getSportData().privateList.leagues.length == 0){
	              _btnClassName="gb_unavailable";
	              if(!firstName){
	                  _btnClassName+="_small";
	              }
	          } else if (arrplayers.length > 1 && firstName) {
	            var arr_avail = getPlayersMultiAvailability(arrplayers);
	            var arr_classes = ['gb'];
	            $.each(['available','inteam','unavailable'], function (type) {
	              if (arr_avail[type]) {
	                arr_classes.push(type);
	              }
	            });
	            _btnClassName = arr_classes.join('_');
	          } else {
	              var isAPlayerAvailable=getPlayersAvailability(arrplayers);
	              if(isAPlayerAvailable===GB_PLAYER_INTEAM){
	                  _btnClassName="gb_inteam";
	              }else if(isAPlayerAvailable===GB_PLAYER_AVAILABLE){
	                  _btnClassName="gb_available";
	              }else{
	                  _btnClassName="gb_unavailable";
	              }
	              if(!firstName){
	                  _btnClassName+="_small";
	              }
	          }
	          $.addClass(icon, _btnClassName);   
	          
	          var currentSport=getSportData().sport;

	          if(!firstName){
	              firstName=null;
	          }
	          
	          lastName = lastName.replace('\'', '\\\'');
	          if (firstName) {
	            firstName = firstName.replace('\'', '\\\'');
	          }
	          icon.setAttribute('data-pf-icon', JSON.stringify({
	            sport: currentSport,
	            lastname: lastName,
	            firstname: firstName,
	            matches: arrplayers
	          }));
	          icon.setAttribute("id","gb_icon"+(idcounter++));
          }
	      return playerLink;
	};
	  
	function parseFullText() {

        // search all nodes for players...
	  	var doc = document;
        var textNodes = typeof(XPathResult) !== 'undefined' ? getDocumentTextNodes() : getDocumentTextNodes_IE();
        var rExpression = doRegExp();
        
        var bFound;
        var matches = [];
        function doMatch(match){
            if("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(match.charAt(0))>-1){
                bFound=true;
                matches.push(
                  $.fromTemplate(["div",{"children":[["div",{"children":[(match)],"class":"greaseBallCenter gb_skip"}],["a",{"children":[["span",{"class":"fp-icon__icon"}]],"href":"javascript:void(0)","title":"View Player Card","data-pf-player":(match.toLowerCase()),"class":"fpIcon fp-icon__link gb_skip"}]],"class":"fp-player-match gb_skip"}])
                );
                return '___pfmatch___';
            }
            else{
                return match;
            }
        };
        
        for(var i=0;i<textNodes.snapshotLength;i++){   
            var myTextNode=textNodes.snapshotItem(i);
            if (myTextNode.parentNode){
                if((myTextNode.parentNode.className && myTextNode.parentNode.className.indexOf && 
                		myTextNode.parentNode.className.indexOf("gb_skip")>-1) || 
              		  (myTextNode.parentNode.parentNode && myTextNode.parentNode.parentNode.className && 
              				myTextNode.parentNode.parentNode.className.indexOf &&
              			myTextNode.parentNode.parentNode.className.indexOf("gb_skip")>-1) ){
                    continue;
                }
                if (getFpPageOption("excludeTags")){
              	  var excludeTags = "," + getFpPageOption("excludeTags").toLowerCase() + ",";
              	  var ignoreTag = false;
              	  var node = myTextNode;
              	  while (node.parentNode && node.parentNode.tagName){
	                	  if (excludeTags.indexOf(','+node.parentNode.tagName.toLowerCase()+',') != -1){
	                		  ignoreTag = true;
	                		  break;
	                	  }
	                	  node = node.parentNode;
              	  }
              	  if (ignoreTag){
              		  continue;
              	  }
                }
            }
            bFound=false;
            matches = [];
            var replacement=getNodeText(myTextNode).replace(rExpression, doMatch);
            if (bFound) { // Found a player last name.
              var myspan = doc.createElement('span');
              myspan.className="gb_scannedText";
              addSkip(myspan);
              $.empty(myspan);
              var frag = document.createDocumentFragment();
              $.each(replacement.split('___pfmatch___'), function(txt, index) {
                frag.appendChild(document.createTextNode(txt));
                var pf_node = matches[index];
                if (pf_node) {
                  frag.appendChild(pf_node);
                }
              });
              myspan.appendChild(frag);
              if (myTextNode.parentNode){
                  myTextNode.parentNode.insertBefore(myspan,myTextNode);
                  myTextNode.parentNode.removeChild(myTextNode);
              }
              
              // search the added links
              var playerLinks;
              if (typeof(XPathResult) !== 'undefined'){
            	  playerLinks = doc.evaluate('div[contains(@class,"fp-player-match")]', myspan, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
              } else {
                  var mynodes = $.find(myspan, 'div.fp-player-match');
                  mynodes.snapshotLength=mynodes.length;
                  mynodes.snapshotItem=function(i){
                      return mynodes[i];
                  }
                  playerLinks = mynodes;
              }

              for(var j=0;j<playerLinks.snapshotLength;j++){
              
                  var playerLink=playerLinks.snapshotItem(j);
                  if(!playerLink.parentNode){
                      continue; // TODO : figure out if this is still necessary.
                  }
                  var lastName=playerLink.lastChild.getAttribute('data-pf-player');
                  if(lastName===""){
                      continue; // TODO: figure out if this is still necessary.
                  }
                  
                  var playersWithLastName=getSportData().publicList[lastName];
                  var bFoundFirst=false;
                  
                  if (playersWithLastName.noFirstName) {
                    lastName = playersWithLastName.noFirstName.last;
                    bFoundFirst = playersWithLastName.noFirstName.first;
                  }

                  if (!bFoundFirst && playerLink.nextSibling){
                     if (!playersWithLastName.regExAfter) {
                        var initials = getPlayerInitials(playersWithLastName.F);
                       playersWithLastName.regExAfter = 
                          new RegExp('^\\s*,*\\s*('+playersWithLastName.F.replace(new RegExp('\\.',"g"),'\\.')+'|('+initials.join('\\.|')+'\\.))((,|\\s)+|\\b)', 'i');
                     }
                      var nextSib=playerLink.nextSibling;
                      var nextSibContent=trim(getNodeText(nextSib)).replace(String.fromCharCode(160),'');
                      var mightNeedCleaning=null;
                      if(nextSibContent===""||nextSibContent===","){
                          mightNeedCleaning=nextSib;
                          if(nextSib.nextSibling){
                              nextSib=nextSib.nextSibling;
                          }
                      }
                      
                      if(nextSib.className && nextSib.className.indexOf("fp-player-match")>-1){
                          var txtNd=nextSib.firstChild.firstChild;
                          var newTxt=(" "+getNodeText(txtNd)).replace(playersWithLastName.regExAfter,function(firstname){
                              var fnm=trim(firstname.replace(',', '')); // todo:be less lazy and do reg ex for this.
                              if("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(fnm.charAt(0))>-1){
                                  setNodeText(playerLink.firstChild, getNodeText(playerLink.firstChild) + ' ' + trimLeft(fnm));
                                  bFoundFirst=fnm;
                                  return '';
                              }else{
                                  return firstname;
                              }
                          });
                          setNodeText(txtNd,newTxt);
                          
                          if(bFoundFirst) {
                              nextSib.parentNode.removeChild(nextSib);
                              if(mightNeedCleaning){
                                  setNodeText(mightNeedCleaning,' ');
                              }
                          }
                      }else{
                          var newTxt = (getNodeText(nextSib)+' ').replace(playersWithLastName.regExAfter,function(firstname){
                              var fnm=trim(firstname.replace(',',''));

                              if("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(fnm.charAt(0))>-1){
                                  setNodeText(playerLink.firstChild, getNodeText(playerLink.firstChild) + ' ' + fnm);
                                  bFoundFirst=fnm;
                                  return '';
                              }else{
                                  return firstname;
                              }
                          });
                          setNodeText(nextSib,newTxt);
                      }                    
                    }
                    if (!bFoundFirst && playerLink.previousSibling) {
                        if(!playersWithLastName.regExBefore){
                            var initials = getPlayerInitials(playersWithLastName.F);
                            playersWithLastName.regExBefore = 
                              new RegExp('\\b('+playersWithLastName.F+'|'+initials.join('|')+')(\\s|\\.|,)*$', 'i');
                        }
                        
                        var prevSib=playerLink.previousSibling;
                        var prevSibTxt=trim(getNodeText(prevSib)).replace(String.fromCharCode(160),'');;
                        if(prevSibTxt===""||prevSibTxt===","){
                            if(prevSib.previousSibling){
                                prevSib=prevSib.previousSibling;
                            }
                        }
                        if(prevSib.className && prevSib.className.indexOf("fp-player-match")>-1){
                            (getNodeText(prevSib.firstChild.firstChild)+' ').replace(playersWithLastName.regExBefore,function(firstname){
                                if("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(firstname.charAt(0))>-1){
                                    setNodeText(playerLink.firstChild.firstChild, trimRight(firstname)+' '+trimLeft(getNodeText(playerLink.firstChild)) );
                                    bFoundFirst=firstname;
                                    return '';
                                }else{
                                    return firstname;
                                }
                            });
                            
                            if(bFoundFirst){
                                prevSib.parentNode.removeChild(prevSib);
                            }
                        }else{
                            
                            var newTxt = (' '+getNodeText(prevSib)+' ').replace(playersWithLastName.regExBefore,function(firstname){
                                var fname=trim(firstname);
                                if("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".indexOf(fname.charAt(0))>-1){
                                    setNodeText(playerLink.firstChild.firstChild, trimRight(fname)+' '+trimLeft(getNodeText(playerLink.firstChild)) );
                                    bFoundFirst=fname;
                                    return '';
                                }else{
                                    return firstname;
                                }
                            });
                            setNodeText(prevSib,newTxt);
                        }
                    }
                    
                    playerLink = attachPopup(playerLink, lastName, bFoundFirst);
                    // RFS === Require First Name
                    if(bFoundFirst == false){
                  	  var requireFirstName = (playersWithLastName.RFS===1);
                  	  if (getSportData().privateList && 
                  			  (getSportData().privateList.logged===false || getSportData().privateList.rfn)){
                  		  requireFirstName = true;
                  	  }
                  	  if (isPlayerCards && getFpPageOption("parseFullText")){
                  		  requireFirstName = true;
                  	  }
                  	  if (requireFirstName){
                          var lnk = $.find(playerLink, 'a.fp-icon__link')[0];
                          lnk && $.remove(lnk);
                          var alrt = $.find(playerLink,'img.gb_inner_icon')[0];
                          alrt && $.remove(alrt);
                  	  }
                    }
                }
            }
        }
        /*
        if (isTopFrame()) {
          setTimeout(function() {
            var nds = $.find(document, 'div.fp-player-match'), 
                msg = [];
            if (nds.length == 0) {
              msg = [(isChromeExtension ? 'FantasyPros' : 'Research Assistant') + ' did not find any player.'];
            }
            if (!msg.length) return;
            showMsg(msg);
            setTimeout(function(){hideMsg();}, 4000);
          }, 50);
        }*/
        
	}

	var checkPodcastPlayer = function(){

	      if (document.getElementById('pf_media_player') || typeof SC === 'undefined'){
	    	  return;
	      }
	      
		  var media_player = document.createElement('div');
		  media_player.id = 'pf_media_player';
		  media_player.style.zIndex = "999999";
		  media_player.style.display = "none";
		  media_player.style.position = "fixed";
		  media_player.style.right = "0";
		  media_player.style.bottom = "0";
		  media_player.style.width = "400px";
		  media_player.style.height = "130px";
		  media_player.style.border = "3px solid #091d40";
		  media_player.innerHTML =  '<a href="javascript:void(0)" id="pf_media_player_close" title="Close Podcast Clip" onclick="SC.Widget(\'sc-widget\').pause();document.getElementById(\'pf_media_player\').style.display=\'none\';' +
		  	'if(playercardGenerator.focusedElBeforeOpen){playercardGenerator.focusedElBeforeOpen.focus();playercardGenerator.focusedElBeforeOpen=undefined;}" ' +
		  	'style="background:#091d40;color:white;font-weight:bold;font-size:11px;line-height:16px;width:15px;height:16px;position:absolute;top:-2px;right:-2px;text-decoration:none;text-align:center">X</a>' +
		  	'<a target="_blank" href="' + (getSportData().sport == 'nfl' ? 
		  		'https://dts.podtrac.com/redirect.mp3/itunes.apple.com/us/podcast/fantasypros-football-podcast/id1138942145?mt=2' :
		  			'https://dts.podtrac.com/redirect.mp3/itunes.apple.com/us/podcast/fantasypros-baseball-podcast/id1099324246?mt=2') +
		  	'" onclick="if(typeof ga === \'function\'){ga(\'send\', \'event\', \'iTunes\', \'Click Embedded Podcast\', location.pathname);}"  title="Listen on iTunes"' + 
		  	'style="background:#091d40;color:white;font-weight:normal;font-size:11px;width:auto;position:absolute;bottom:0px;right:0px;text-align:center;padding:0px 10px;line-height: 16px;">Listen on iTunes &raquo;</a>' +
		  	'<iframe id="sc-widget" src="https://w.soundcloud.com/player/?' + 
		  	'" width="100%" height="100%" scrolling="no" frameborder="no" allow="autoplay"></iframe>';
	      document.body.appendChild(media_player);  
	};


	var getPublicDefinition=function(id){
	    return getSportData().publicList.Dictionary[id];
	};
	  
	var printPlayerBasicInfo=function(p){
	    return $.capitalize(p.firstname)+' '+$.capitalize(p.lastname)+', '+getPublicDefinition(p.id[TEAM_INDEX])+' '+getPublicDefinition(p.id[2])
	}
	
	var sendClickEvent=function(fpId, category, details){
      if(typeof ga === 'function'){
    	  
    	  var playerName = fpId;
		  var found = false;
		  for (var lastname in getSportData().publicList){
			  var playersWithLastName=getSportData().publicList[lastname];
			  for (var firstname in playersWithLastName){
				  for (var k =0; k < playersWithLastName[firstname].length; k++){
					  if (playersWithLastName[firstname][k] &&
							  playersWithLastName[firstname][k].length >= 3 &&
							  playersWithLastName[firstname][k][PLAYER_ID] == fpId){
						  
						  playerName = printPlayerBasicInfo({
					          "firstname": firstname,
					          "lastname":  lastname,
					          "id": playersWithLastName[firstname][k]
					      });
					      found = true;
					      break;
					  }
				  }
				  if (found){
					  break;
				  }
			  }
			  if (found){
				  break;
			  }
		  }
    	  ga('send', 'event', category, details, playerName);
      }
	}

	var stopOtherMedia=function(active){
		if (active != 'Podcast' && typeof SC !== "undefined" && document.getElementById('pf_media_player')){
			SC.Widget('sc-widget').pause();
			document.getElementById('pf_media_player').style.display='none';
		}
		if (active != 'YouTube' && typeof FPV !== "undefined"){
			if (typeof FPV.stop === "function" ){
				FPV.stop();
			} else {
		        $.each(
		            $.find(document.body, '.fp-player-video-container'), 
		            function(nd) {
		          	  nd.parentNode.removeChild(nd);
		            }
		        );
			}
		}
		if (active != 'MinuteMedia' && typeof FPM !== "undefined" && typeof FPM.stop === "function"){
			FPM.stop();
		}
		if (active != 'JW' && typeof FPJW !== "undefined" && typeof FPJW.stop === "function"){
			FPJW.stop();
		}
		if (active != 'SendToNews' && typeof STN !== "undefined" && typeof STN.stop === "function"){
			STN.stop();
		}
	}
	
	var playPodcast=function(e, podcast, fpId){
		  if (getFpPageOption("isInIframe")){
			  top.postMessage("PODCAST;" + podcast + ";" + fpId, '*');
			  return;
		  }	  
		  checkPodcastPlayer();
		  
	      var media_player =  document.getElementById('pf_media_player');
	      if (media_player && typeof SC !== 'undefined'){
	    	  
	    	  stopOtherMedia('Podcast');
	    	  
	    	  media_player.style.display = "block";
		      var widget = SC.Widget("sc-widget");
		      widget.load(podcast,{callback : function(){
		    	  widget.play();
		    	  var idx1 = podcast.indexOf("t=");
		    	  if (idx1 >=0){
		    		  var time = podcast.substring(idx1 + 2).split(":");
		    		  if (time.length == 2){
		    	    	  widget.bind (SC.Widget.Events.PLAY,function(){
		    	    		  var seconds = 60*Number(time[0]) + Number(time[1]);
		    	    		  widget.seekTo(seconds*1000);
		    	    	  });
		    		  } else if (time.length == 3){
		    	    	  widget.bind (SC.Widget.Events.PLAY,function(){
		    	    		  var seconds = 3600*Number(time[0]) + 60*Number(time[1]) + Number(time[2]);
		    	    		  widget.seekTo(seconds*1000);
		    	    	  });
		    		  }
		    	  }
		      }});

			  playercardGenerator.focusedElBeforeOpen = document.activeElement;
		      document.getElementById('pf_media_player_close').focus();

	    	  var folders = podcast.split("#")[0].split("/");
	    	  var episode = folders[folders.length - 1];
	    	  if (episode.length == 0 && folders.length >= 2){
	    		  episode = folders[folders.length - 2];
	    	  }
	    	  if (episode.length == 0){
	    		  episode = podcast.split("#")[0];
	    	  }
	    	  
	    	  sendClickEvent(fpId, 'Podcast', episode);
		  }
	};

	var playVideo=function(e, youtubeId, fpId){
		  if (getFpPageOption("isInIframe")){
			  top.postMessage("VIDEO;" + youtubeId + ";" + fpId, '*');
			  return;
		  }	

    	  stopOtherMedia('YouTube');

		  if (typeof FPV !== "undefined" ){			  
			  FPV.toggle(youtubeId, fpId, e);
	    	  sendClickEvent(fpId, 'YouTube', youtubeId);
		  }
	};
	
	var playMinuteVideo=function(e, mmId, fpId){
		  if (getFpPageOption("isInIframe")){
			  top.postMessage("MINUTE;" + mmId + ";" + fpId, '*');
			  return;
		  }	 

    	  stopOtherMedia('MinuteMedia');

		  if (typeof FPM !== "undefined" ){			  
			  FPM.toggle(mmId, fpId, e);
	    	  sendClickEvent(fpId, 'MinuteMedia', mmId);
		  } else {
			  console.log("FPM is undefined!!!");
		  }
	};
	
	var playJWVideo=function(e, jwId, fpId, start, end) {
		
		  if (getFpPageOption("isInIframe")){
			  top.postMessage("JW;" + jwId + ";" + fpId + ";" + start + ";" + end, '*');
			  return;
		  }	 

    	  stopOtherMedia('JW');

		  if (typeof FPJW !== "undefined" ){			  
			  FPJW.toggle(jwId, fpId, start, end, e);
	    	  sendClickEvent(fpId, 'JW Video', jwId);		      
		  } else {
			  console.log("FPJW is undefined!!!");
		  }
		
	};
	
	var playSendToNewsVideo=function(e, stnId, fpId, start, end) {
		
		  if (getFpPageOption("isInIframe")){
			  top.postMessage("STN;" + stnId + ";" + fpId + ";" + start + ";" + end, '*');
			  return;
		  }	 

    	  stopOtherMedia('SendToNews');

		  if (typeof STN !== "undefined" ){
			  STN.toggle(stnId, fpId, start, end, e);
	    	  sendClickEvent(fpId, 'SendToNews', stnId);	
		  } else {
			  console.log("STN is undefined!!!");
		  }
		
	};
	
	function fetchData(params){
		if (!isChromeExtension){
			params.url += '&callback=?';
		}
	    $.asyncp(params);  
	};
		  
	function fetchData_Chrome(params){
		var url = params.url;
	    if(params.data){
	      for (var something in params.data){
	        if (typeof params.data[something] !== 'function'){
	          url+= '&' + something + '=' + encodeURIComponent(params.data[something]);
	        }
	      }
	    }
	    chrome.runtime.sendMessage({'cmd':'queryPickemFirst', 'url':url, 'bCache':params.bCache}, params.callback || $.noop);
	};
	
	function retrieveData(oParam){
		
		oParam = oParam || {};

        showMsg(['Loading League Data from My Playbook']);
        
		var fpURL = 'https://partners.fantasypros.com/api/c1/research-assistant.php?sport=' + sport +
			(oParam.askForNew?('&refresh=Y'):'') + (USE_HTTPS ? '&https=Y' : '')+
			(isResearchAssistant || isChromeExtension?'&checkPremium=Y':'');
		
		if (sport == 'epl'){
			fpURL = 'https://mpbnfl.fantasypros.com/researchAssistant?sport=epl';
			if (window.pf_fantrax_data){
				fpURL += "&fantraxData=" + JSON.stringify(window.pf_fantrax_data);
			}
		}if (sport == 'aaf'){
			fpURL = 'https://mpbmlb.fantasypros.com/researchAssistant?sport=aaf';
			if (window.pf_altf_data){
				fpURL += "&altfData=" + window.pf_altf_data;
			}
		} 
					
		var params = {
			url: fpURL,
			data: {},
			type: "jsonp",
			callback: function(data){	
			  if (!data){
				  
			  } else if(data.xhrwarn) {
		//	    showMsg([
		//	      'Loading League Data from My Playbook', 
		//	      'Retrying ('+data.xhrwarn+')...'
		//	    ]); 
			    return;
			  } else if (data.xhrfailed) {
		//	    showXhrFailed();
			  } else if(data.error){
		//	    hideMsg();
		//	    loadURL(MPB_ERROR_URL+"?error="+encodeURIComponent(data.error),true);
			  } else{
			    setSportData(data);
		/*	    
			    if (data.bRefresh) {
			      data.bRefresh = false;
			      playercardGenerator.refreshData({oSport:getSportData()});
			      return;
			    }
		*/
			    hideMsg();
			    if(oParam.fCallBack){
			        oParam.fCallBack();
			    }
			  }
			}
		};
		fetchData(params);		
	}
			
	var setSportData  = function(data) {
	    data.priv = data.priv || {playersStatuses:{}, leagues:[]};
	    data.priv.time = data.priv.time || $.now();
	    
	    var current_sport = {'sport' : sport};
	    sports_data[sport] = current_sport;
	    
	    current_sport.privateList=data.priv;
	    current_sport.privateList.logged = data.logged || sport == 'epl' || sport == 'aaf';
	    current_sport.privateList.requiresUpgrade = data.requiresUpgrade;
	    current_sport.userStatus=data.priv.userStatus;
	    current_sport.user_is=data.priv.user_is;
	    current_sport.Dictionary=data.priv.Dictionary;
	    current_sport.tabs = data.tabs;
	    
	    current_sport.publicList=data.pub;
	    

	    current_sport.playersWithNews = {};
	    if (data.pub.N){
		    for (var i=0; i<data.pub.N.length; i++){
		    	current_sport.playersWithNews[data.pub.N[i][PLAYER_ID]] = data.pub.N[i];
		    }
	    }

	    if (sport == 'epl' || sport == 'aaf'){
	    	current_sport.inSeason = true;
		} else if (isChromeExtension || isResearchAssistant){
	    	current_sport.inSeason = true;
	    } else if (data.pub.M){
		    current_sport.inSeason = data.pub.M == 'in-season';
	    }
	    current_sport.playersWithRecentNews = {};
	    if (data.pub.RN){
		    for (var i=0; i<data.pub.RN.length; i++){
		    	current_sport.playersWithRecentNews[data.pub.RN[i][PLAYER_ID]] = data.pub.RN[i];
		    }
	    }
	    current_sport.playersWithRecentPodcastSL = {};
	    current_sport.playersWithRecentPodcastDFS = {};
	    if (data.pub.RP){
		    for (var i=0; i<data.pub.RP.length; i++){
		    	if (data.pub.RP[i][3] == 'SL' || data.pub.RP[i][3] == 'BOTH'){
			    	current_sport.playersWithRecentPodcastSL[data.pub.RP[i][PLAYER_ID]] = data.pub.RP[i];
		    	}
		    	if (data.pub.RP[i][3] == 'DFS' || data.pub.RP[i][3] == 'BOTH'){
			    	current_sport.playersWithRecentPodcastDFS[data.pub.RP[i][PLAYER_ID]] = data.pub.RP[i];
		    	}
		    }
	    }
	    current_sport.playersWithYouTubeVideoSL = {};
	    current_sport.playersWithYouTubeVideoDFS = {};
	    current_sport.playersWithMinuteVideoSL = {};
	    current_sport.playersWithMinuteVideoDFS = {};
	    current_sport.playersWithJWVideoSL = {};
	    current_sport.playersWithJWVideoDFS = {};
	    current_sport.playersWithSendToNewsVideoSL = {};
	    current_sport.playersWithSendToNewsVideoDFS = {};
	    if (data.pub.RV){
		    for (var i=0; i<data.pub.RV.length; i++){
		    	if (data.pub.RV[i][3] == 'SL' || data.pub.RV[i][3] == 'BOTH'){
			    	current_sport.playersWithYouTubeVideoSL[data.pub.RV[i][PLAYER_ID]] = data.pub.RV[i];
		    	}
		    	if (data.pub.RV[i][3] == 'DFS' || data.pub.RV[i][3] == 'BOTH'){
			    	current_sport.playersWithYouTubeVideoDFS[data.pub.RV[i][PLAYER_ID]] = data.pub.RV[i];
		    	}
		    }
	    }
	    if (data.pub.RM){
		    for (var i=0; i<data.pub.RM.length; i++){
		    	if (data.pub.RM[i][3] == 'SL' || data.pub.RM[i][3] == 'BOTH'){
			    	current_sport.playersWithMinuteVideoSL[data.pub.RM[i][PLAYER_ID]] = data.pub.RM[i];
		    	}
		    	if (data.pub.RM[i][3] == 'DFS' || data.pub.RM[i][3] == 'BOTH'){
			    	current_sport.playersWithMinuteVideoDFS[data.pub.RM[i][PLAYER_ID]] = data.pub.RM[i];
		    	}
		    }
	    }
	    if (data.pub.RJ){
		    for (var i=0; i<data.pub.RJ.length; i++){
		    	if (data.pub.RJ[i][3] == 'SL' || data.pub.RJ[i][3] == 'BOTH'){
			    	current_sport.playersWithJWVideoSL[data.pub.RJ[i][PLAYER_ID]] = data.pub.RJ[i];
		    	}
		    	if (data.pub.RJ[i][3] == 'DFS' || data.pub.RJ[i][3] == 'BOTH'){
			    	current_sport.playersWithJWVideoDFS[data.pub.RJ[i][PLAYER_ID]] = data.pub.RJ[i];
		    	}
		    }
	    }
	    if (data.pub.RS){
		    for (var i=0; i<data.pub.RS.length; i++){
		    	if (data.pub.RS[i][3] == 'SL' || data.pub.RS[i][3] == 'BOTH'){
			    	current_sport.playersWithSendToNewsVideoSL[data.pub.RS[i][PLAYER_ID]] = data.pub.RS[i];
		    	}
		    	if (data.pub.RS[i][3] == 'DFS' || data.pub.RS[i][3] == 'BOTH'){
			    	current_sport.playersWithSendToNewsVideoDFS[data.pub.RS[i][PLAYER_ID]] = data.pub.RS[i];
		    	}
		    }
	    }
	    
	    if (current_sport.sport==='nfl') {
	      var public_list = current_sport.publicList;
	      if (public_list.packers && public_list.packers['green bay']) {
	          public_list.L = 'green bay packers|' + public_list.L;
	        public_list["green bay packers"] = {
	          'noFirstName': {
	            'last': 'packers',
	            'first': 'green bay'
	          }
	        }
	      }
	    }  
	}
	
	var checkFileIncludes = function(){
		if (getFpPageOption("isDraftRoom")){
			//css already included via jsp
			return;
		}

        var doc=document;
        var head = doc.getElementsByTagName("head")[0],
            style = doc.getElementById("researchAssistant-style");
        if (!style && !isChromeExtension && head){
            
            style = doc.createElement("link");
            style.id = "researchAssistant-style";
            style.type = "text/css";
            style.rel = "stylesheet";
            style.href = (getFpPageOption("useLocalSkin") ? "../src/stylesheets/" : "https://cdn.fantasypros.com/playercards/v3/") +
            	(isBP ? "player-cards-bp.css" : "player-cards.css");
          	  
            head.appendChild(style);
        }			
	}
			  
	return {
		initPlayerCards : function(){
			if (isInitialized){
				return;
			}
			isResearchAssistant = false; 
			isPlayerCards = true;
			isChromeExtension = false;
			
			isInitialized = true;
			playercardGenerator.run();
		},
		initBookmarklet: function(){
			if (isInitialized){
				return;
			}
			isResearchAssistant = true; 
			isPlayerCards = false;
			isChromeExtension = false;
			
			isInitialized = true;
			playercardGenerator.run();
		},
	    initChrome : function() {
			if (isInitialized){
				return;
			}
			isResearchAssistant = false; 
			isPlayerCards = false;
			isChromeExtension = true;
	          
	        fetchData=fetchData_Chrome;
	        /*
	          getPlayerLinks=getPlayerLinks_IE;
	          getFpPlayerLinks=getFpPlayerLinks_IE;
	          dispatchClearCache = dispatchClearCacheViaChrome;
	          GB_FANTASTREAK_FILELOC=
	              chrome.extension.getURL("content/greaseball-mini.js").
	              split("content/greaseball-mini.js")[0];

	          document.addEventListener("PickemFirstPopupEvent", onCurrentPageMessage, false, true);
	          chrome.extension.onRequest.addListener(
	              function(request, sender) {
	                  if(request.message==="flush"){
	                      playercardGenerator.clearCache();
	                      playercardGenerator.cleanContent();
	                  }
	              }
	          ); 
	          */
	          
	        isInitialized = true;
	    },
		cleanContent : function(){
	          try {
                var doc=document;

                $.each(
                  $.find(doc.body, '.fp-icon__link'), 
                  function(nd) {
                	  //to remove all event listener...
                	  var clone = nd.cloneNode();
                	  while (nd.firstChild) {
                	    clone.appendChild(nd.firstChild);
                	  }
                	  nd.parentNode.replaceChild(clone, nd);
                  }
                );
        		if (getFpPageOption("isVueJS")){
        			// fp-icon__link were removed to avoid conflict with vue.js
	                $.each(
	    	          $.find(doc.body, '.fp-no-icon'), 
	                  function(nd) {
	                	  //to remove all event listener...
	                	  var clone = nd.cloneNode();
	                	  while (nd.firstChild) {
	                	    clone.appendChild(nd.lastChild);
	                	  }
	                	  nd.parentNode.replaceChild(clone, nd);
	                  }
	                );
        		}
                $.each(
                  $.find(doc.body, '.fp-player-link'), 
                  function(nd) {
                	  nd.removeAttribute("data-fp-id");
                  }
                );
                $.each(
                  $.find(doc.body, '.fp-icon__podcast'), 
                  function(nd) {$.remove(nd.parentNode);}
                );
                $.each(
                  $.find(doc.body, '.fp-icon__video'), 
                  function(nd) {$.remove(nd.parentNode);}
                );                
                $.each(
                  $.find(doc.body, '.fp-icon__container'), 
                  function(nd) {$.remove(nd);}
                );
                $.each(
                  $.find(doc.body, 'a.fpIcon'), 
                  function(nd) {$.remove(nd);}
                );
                $.each(
                  $.find(doc.body, '.gb_skip'),
                  function(nd) {$.removeClass(nd, 'gb_skip');}
                );
                
                $.each($.find(doc.body, 'div.fp-player-match'), function(node) {
                    var txt=trim(getNodeText(node.firstChild)), prevTxt, nxtTxt;

                    if(node.previousSibling && node.previousSibling.nodeType==3 ){
                      prevTxt = getNodeText(node.previousSibling);
                      if (prevTxt.length && '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(prevTxt.charAt(prevTxt.length-1).toLowerCase())>-1) {
                        prevTxt = prevTxt + ' ';
                      }
                      setNodeText(node.previousSibling, prevTxt+txt);
                      if(node.nextSibling && node.nextSibling.nodeType==3){
                        nxtTxt = getNodeText(node.nextSibling);
                        if (nxtTxt.length && '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(nxtTxt.charAt(0).toLowerCase())>-1) {
                          nxtTxt = ' ' + nxtTxt;
                        }
                        setNodeText(node.previousSibling, 
                                        getNodeText(node.previousSibling)+
                                        nxtTxt
                                    );
                        $.remove(node.nextSibling);
                        }
                    }else{
                        if(node.nextSibling && node.nextSibling.nodeType==3){
                            nxtTxt = getNodeText(node.nextSibling);
                            if (nxtTxt.length && '0123456789abcdefghijklmnopqrstuvwxyz'.indexOf(nxtTxt.charAt(0).toLowerCase())>-1) {
                              nxtTxt = ' ' + nxtTxt;
                            }
                          setNodeText(node.nextSibling, txt+nxtTxt);
                        }else{
                          $.insertBefore(document.createTextNode(txt), node);
                        }
                    }
                    $.remove(node);
                });
                $.each($.find(doc.body, 'span.gb_scannedText'), function(node) {
                  while (node.firstChild) {
                    $.insertBefore(node.firstChild, node);
                  }
                  $.remove(node);
                });
                return;
            }catch(e){
            };
		},
		clearAll : function(){
		    if(isInitialized){
				/* TODO: implement this...
		        this.clearCache();
		        */
		        this.cleanContent();
		    }
		},
		resetSportData : function(sp){
			sports_data[sp] = undefined;
		},
		setDefaultSport: function(sp, newLeagues){
			sport = sp
	        if (newLeagues && getSportData() && getSportData().privateList){
	        	getSportData().privateList.leagues = newLeagues;
	        }
		},
		openPlayerCard: function(param) {
			loadPlayerCard(param.fpId, 0, param.tab, undefined, true);
	    },
		openPodcast: function(evt, param) {
			playPodcast(evt, param.podcast, param.fpId);
			$.kill(evt);
	    },
	    openVideo: function(evt, youtubeId, fpId) {
	    	playVideo(evt, youtubeId, fpId);
	    	$.kill(evt);
	    },
	    openMinuteVideo: function(evt, mmId, fpId) {
	    	playMinuteVideo(evt, mmId, fpId);
	    	$.kill(evt);
	    },
	    openJWVideo: function(evt, jwId, fpId, start, end) {
	    	playJWVideo(evt, jwId, fpId, start, end);
	    	$.kill(evt);
	    },
	    openSendToNewsVideo: function(evt, stnId, fpId, start, end) {
	    	playSendToNewsVideo(evt, stnId, fpId, start, end);
	    	$.kill(evt);
	    },
		refreshData: function(){
			/*
	          var sp=getSportData() || oParam.oSport;
	          if (dispatchClearCache){
	              dispatchClearCache();
	          }
	       */
			playercardGenerator.run();
		},
		sendGoogleEvent: function(action){
			sendEvent(action);
		},
		run : function(){

			//in case player cards icon are already on the page
			playercardGenerator.cleanContent();

			if (isBP){
				setSportData({pub:{}});
				checkUserLocation();
				checkBettingProsLocations();
				checkBettingProsMarkets();
				checkBettingProsEvents();
				checkBettingProsBooks();
				if (sport == 'nfl'){
					checkBettingProsSchedule();
				}
			}
			
			checkFileIncludes();

			if (!getFpPageOption("isDraftRoom") && !getSportData()){
				retrieveData({'fCallBack':playercardGenerator.run});
				return;
			}
			
			checkPlayerIcons();

	        if (playercardGenerator.afterrun) {
	            playercardGenerator.afterrun();
	        }
		}
	};
})();
