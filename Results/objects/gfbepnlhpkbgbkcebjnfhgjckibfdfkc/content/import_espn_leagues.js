if (window.location.href.indexOf("import_fp") != -1){

	var sport = window.location.href.indexOf('flb') > 0 || window.location.href.indexOf('baseball') > 0  ? 'mlb' :
		window.location.href.indexOf('ffl') > 0 || window.location.href.indexOf('football') > 0  ? 'nfl':
			window.location.href.indexOf('fba') > 0 || window.location.href.indexOf('basketball') > 0 ? 'nba' : '';
			
	var sport_long = window.location.href.indexOf('flb') > 0 || window.location.href.indexOf('baseball') > 0  ? 'baseball' :
		window.location.href.indexOf('ffl') > 0 || window.location.href.indexOf('football') > 0  ? 'football':
			window.location.href.indexOf('fba') > 0 || window.location.href.indexOf('basketball') > 0 ? 'basketball' : '';

	var cookieObject = Object.fromEntries(document.cookie.split('; ').map(c => {
	    const [ key, ...v ] = c.split('=');
	    return [ key, v.join('=') ];
	}));
	

	var force = '';
	if (window.location.href.indexOf("import_fp_") != -1){
		force = window.location.href.split("import_fp_")[1];
	}
	
	if (typeof toggleFpPanel != 'function'){
		var isChromium = window.chrome;
		var winNav = window.navigator;
		var vendorName = winNav.vendor;
		var isOpera = typeof window.opr !== "undefined";
		var isIEedge = winNav.userAgent.indexOf("Edge") > -1;
		var isIOSChrome = winNav.userAgent.match("CriOS");

		if (!isIOSChrome &&
		  isChromium !== null &&
		  typeof isChromium !== "undefined" &&
		  vendorName === "Google Inc." &&
		  isOpera === false &&
		  isIEedge === false
		) {  // is Google Chrome
			
			var helpDiv = document.createElement("div");helpDiv.style.position = "fixed";helpDiv.style.top = "10%";helpDiv.style.left = "50%";helpDiv.style.width = "400px";helpDiv.style.marginLeft = "-200px";helpDiv.style.minHeight = "400px";helpDiv.style.boxShadow = "0px 24px 24px rgba(0, 0, 0, 0.3), 0px 0px 24px rgba(0, 0, 0, 0.22)";helpDiv.style.background = "#FFFFFF";helpDiv.style.color = "#333333";helpDiv.style.borderRadius = "5px";helpDiv.style.zIndex = "5000000";helpDiv.style.textAlign = "center";helpDiv.style.padding = "20px";helpDiv.style.fontSize = "14px";helpDiv.style.lineHeight = "20px";helpDiv.style.fontFamily = '"Open Sans", Arial, sans-serif !important';
			var close = document.createElement('div');close.innerHTML = "<a href='javascript:void(0)' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)' title='close' style='color:#333333 !important'>X</a>";close.style.position = "absolute";close.style.top = "5px";close.style.right = "8px";close.style.fontSize = "16px";close.style.fontWeight = "bold";helpDiv.appendChild(close);
			var img = document.createElement('img');img.src = 'https://cdn.fantasypros.com/csw/images/fp-app.jpg';img.style.display = "block";img.style.width = "60px";img.style.height = "60px";img.style.borderRadius = "50%";img.style.margin = "0 auto";helpDiv.appendChild(img);
			var h1 = document.createElement("div");h1.innerHTML = "Oops... we've detected a problem!";h1.style.fontWeight = "bold";h1.style.fontSize = "18px";h1.style.margin = "15px 0";helpDiv.appendChild(h1);
			var instructions=document.createElement("div");instructions.appendChild(document.createTextNode("In order for the FantasyPros extension to work, go to")),instructions.appendChild(document.createElement("br"));var link=document.createElement("span");link.innerHTML="chrome://extensions/?id=gfbepnlhpkbgbkcebjnfhgjckibfdfkc",link.style.display="inline-block",link.style.background="#eee",link.style.fontSize="13px",instructions.appendChild(link),instructions.appendChild(document.createElement("br")),instructions.appendChild(document.createTextNode(" in your Chrome address bar and"));var allow=document.createElement("span");allow.innerHTML='<br/>make sure <b>"Allow in Incognito"</b><br/> and <b>"Allow access to file URLs"</b><br/> are both enabled.',instructions.appendChild(allow),helpDiv.appendChild(instructions);
			var img=document.createElement("img");img.src="https://cdn.fantasypros.com/csw/images/extension-settings@2x.png",img.style.display="block",img.style.width="312px",img.style.height="60px",img.style.margin="20px auto",helpDiv.appendChild(img);
			var instructions2 = document.createElement("div");instructions2.innerHTML = "If these settings are both already enabled,<br/>you may need to toggle them off and back on.";helpDiv.appendChild(instructions2);
			var support = document.createElement("div");support.innerHTML = "Still having problems?<br/>Please <a href='https://support.fantasypros.com/hc/en-us' target='_blank' style='text-decoration:underline;color:#0377b1'>contact our support team</a> for additional help.";support.style.marginTop = "20px";helpDiv.appendChild(support);
			document.body.appendChild(helpDiv);
		} 
	} else {
	
		toggleFpPanel();
		
		$("#fpPanelMain").hide();
		$("#fpPanelSettings").hide();
		
		
		var panelContainer = $("#fpExtensionPanelContainer");
		panelContainer.css("top", "70px").css("max-height", "calc(100% - 90px)");
		if ($(window).width() >= 1400){		
			panelContainer.css("right", "calc(50% - 180px)");	//center it on the page	
		} else {
			panelContainer.css("right", "auto").css("left", "15px");	//align left
		}
		
		panelImport = $("<div id='fpPanelImport' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelImport.appendTo(panelContainer);
		
		var headerImport = $("<div class='fp-extension-header'></div>");
		headerImport.appendTo(panelImport);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Import&utm_content=FP_Icon'></a>").appendTo(headerImport);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerImport);
		$("<div class='fp-extension-heading'>Sync ESPN Leagues</div>").appendTo(headerImport);	
		$("<div class='fp-extension-sub-heading'>Link to your FantasyPros Account</div>").appendTo(headerImport);
		
		headerImport.find(".fp-extension-logo").click(function(){
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Import View', 'action' : 'FP Icon Click'});
		});
		headerImport.find(".fp-extension-settings").click(function(){
			$(".fp-extension-premium-advice").hide();
			$("#fpPanelMain").hide();
			$("#fpPanelSettings").show();
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Import View', 'action' : 'Click Settings'});
		});
		headerImport.find(".fp-extension-close").click(function(){
			$("#fpExtensionPanelContainer").hide();
			chrome.runtime.sendMessage({'cmd':'setBadgeText', 'text': ''});
			chrome.runtime.sendMessage({'cmd' :'sendGAEvent', 'category': 'Import View', 'action' : 'Hide Extension Panel'});
		});
		
		
		var bodyImport = $("<div class='fp-extension-body'></div>");
		bodyImport.appendTo(panelImport);
		
		var thirdpartyCookiesCheck = $("<iframe src='https://draftwizard.fantasypros.com/configure/thirdPartyCookiesCheck.jsp' style='border:none;' width='100%' height='130px' scrolling='no'></iframe>");
		thirdpartyCookiesCheck.appendTo(panelImport);
		
		if (cookieObject && cookieObject.SWID && cookieObject.espn_s2){
			//$("<div class='fp-extension-summary'>SWID: " + cookieObject.SWID + "</div>").appendTo(bodyImport);	
			//$("<div class='fp-extension-summary' style='overflow:hidden'>" + cookieObject.espn_s2 + "</div>").appendTo(bodyImport);	
		
			bodyImport.html("<div class='fp-extension-loading'></div>");
			
			chrome.runtime.sendMessage({'cmd':'getEspnLeagues', 'swid': cookieObject.SWID, 'sport': sport, 'force': force}, function(result){ 
		
				bodyImport.html("");
				if (result.error){
					var errorDiv = $("<div class='fp-extension-summary fp-extension-error'></div>");
					errorDiv.text(result.error);
					errorDiv.appendTo(bodyImport);	
		    	} else if (!result.userKey){
		    		$("<div class='fp-extension-summary fp-extension-error'>Please log in to FantasyPros to sync your leagues</div>").appendTo(bodyImport);	
		    	} else if (result.new_leagues.length){
		    		thirdpartyCookiesCheck.remove();
		        	if (result.imported_leagues.length){
		        		$("<div class='fp-extension-summary'>You have already imported " + result.imported_leagues.length + " ESPN leagues</div>").appendTo(bodyImport);
		        	}
		        	
		    		$("<div class='fp-extension-section' id='fpImportSection'></div>").appendTo(bodyImport);    		
		        	var section = $("#fpImportSection");
		        	
			    	$("<div class='fp-extension-section-heading'>New ESPN Leagues</div>").appendTo(section);
			    	var list = $("<div class='fp-extension-section-list'></div>");
			    	list.appendTo(section);
			    	var scroll = $("<div class='fp-extension-section-list-scroll' style='max-height: 360px;'></div>");
			    	scroll.appendTo(list);
			    	
					var leagueMax = 100;
					if (!result.pro){
						leagueMax = 1;
					} else if (!result.mvp){
						leagueMax = 2;
					} else if (!result.hof){
						leagueMax = 10;
					}
					
			    	var leaguesData = result.new_leagues;
			    	
			    	for (var i=0; i< leaguesData.length; i++){
			    		if (i > 0){
			    			$("<div class='fp-extension-section-list-divider'></div>").appendTo(scroll);
			    		}
			    		var league = leaguesData[i];
			    		var item = $("<div class='fp-extension-section-list-item fp-extension-league'></div>");
			    		item.appendTo(scroll);
			
			        	$("<div class='fp-item-icon'><input type='checkbox' " + 
			        			(i < leagueMax - result.importCount ? "checked" : "") + 
			        			" style='display:block' lid='" + league.leagueId + "' tid='" + league.teamId + "'></div>").appendTo(item);
			
			    		$("<div class='fp-item-league'>" + league.leagueName + "</div>").appendTo(item);
			    		$("<div class='fp-item-team'>" + league.teamName + "</div>").appendTo(item);
			    		$("<div style='clear:both'></div>").appendTo(item);
			    		
			    		item.find("input").click(function(){
			    	//		console.log($(this).attr('lid'));
			    		});
			    	}			    	
			
			    	bodyImport.addClass("fp-extension-body-with-cta");
					var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
					ctaDiv.appendTo(panelImport);
					
					var btn = $("<a class='fp-btn-primary fp-btn-x-large' href='javascript:void(0)'>Sync Selected Leagues</a>");
					btn.appendTo(ctaDiv);
									
					btn.click(function(){
						var selectedItems = [];
						list.find("input").each(function(){
							if (this.checked){
								selectedItems.push($(this).attr('lid') + "_" + $(this).attr('tid'));
							}
						});
	
						if (selectedItems.length + result.importCount > leagueMax){
	
							var msg = "This would put you above the league limit of " + leagueMax + ". ";
	
							if (!result.pro){
								msg += "Please upgrade to FantasyPros Premium.";
							} else if (!result.mvp){
								msg += "Please upgrade to FantasyPros MVP.";
							} else if (!result.hof){
								msg += "Please upgrade to FantasyPros HOF.";
							}
							
							alert(msg);
							
						} else if (selectedItems.length){
		
							var selection = [];
					    	for (var i=0; i< leaguesData.length; i++){
					    		var league = leaguesData[i];
					    		if ($.inArray(league.leagueId + "_" + league.teamId, selectedItems) != -1){
					    			selection.push(league);
					    		}
					    	}
		
							bodyImport.html("<div class='fp-extension-loading'></div>");
					    	bodyImport.removeClass("fp-extension-body-with-cta");
					    	ctaDiv.remove();
	
							chrome.runtime.sendMessage({
								'cmd':'importEspnLeagues', 
								'swid': cookieObject.SWID, 
								's2': cookieObject.espn_s2, 
								'sport': sport, 
								'selection' : selection,
								'userKey': result.userKey
							}, function(import_result){ 
		
								bodyImport.html("");
								
								if (import_result.status == 'ok' && import_result.newLeagues.length){
									
									var redirect = "https://www.fantasypros.com/myleagues/league-sync/sync/success/?sport=" + sport;
									// redirect += "&type=1"; //not needed now, but will be when we add other sites
									redirect += "&newLeagues=";
							    	for (var i=0; i < import_result.newLeagues.length; i++){
										if (i>0){
											redirect += ",";
										}
										redirect += import_result.newLeagues[i];
									}									
									location.href = redirect;
									/*
	
						    		$("<div class='fp-extension-section' id='fpImportedSection'></div>").appendTo(bodyImport);    		
						        	var section = $("#fpImportedSection");
						        	
							    	$("<div class='fp-extension-section-heading fp-extension-section-heading-big'>Congrats! Sync Successful</div>").appendTo(section);
							    	$("<div class='fp-extension-section-subheading'>Use the quick links below to access your league</div>").appendTo(section);
							    	
							    	var list = $("<div class='fp-extension-section-list'></div>");
							    	list.appendTo(section);
							    	var scroll = $("<div class='fp-extension-section-list-scroll'  style='max-height: 400px;'></div>");
							    	scroll.appendTo(list);	
							    	
									$("<div class='fp-extension-section-list-header'>" +
											"<div class='fp-extension-section-list-header-left'>LEAGUE</div>" +
											"<div class='fp-extension-section-list-header-right'>QUICK LINKS</div>" +
											"<div style='clear:both'></div></div>").appendTo(scroll);
	
							    	for (var i=0; i< selection.length && i < import_result.newLeagues.length; i++){
							    		$("<div class='fp-extension-section-list-divider'></div>").appendTo(scroll);
							    		var league = selection[i];
							    		var item = $("<div class='fp-extension-section-list-item fp-extension-league'></div>");
							    		item.appendTo(scroll);
							    		$("<div class='fp-item-quicks-links'>" + 
							    				"<a class='' href='https://draftwizard.fantasypros.com/configure/viewDraft.jsp?sport=" + sport + "&key=" + import_result.newLeagues[i] + "'>Draft Wizard</a>" +
							    				"<br/>" +
							    				"<a class='' href='https://www.fantasypros.com/" + sport + "/myplaybook/?key=" + import_result.newLeagues[i] + "'>My Playbook</a>" +						    				
							    			"</div>").appendTo(item);
										
							    		$("<div class='fp-item-league' style='width:200px'>" + league.leagueName + "</div>").appendTo(item);
							    		$("<div class='fp-item-team' style='width:200px'>" + league.teamName + "</div>").appendTo(item);
	
							    	}
							    	
						    		var importItem = $("<div class='fp-sync-another-site'> " +
						    				"<a href='https://www.fantasypros.com/myleagues/league-sync/?sport=" + sport.toUpperCase() + 
						    				"&utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_MAIN&utm_content=import_league_CTA' target='_blank'>+ Sync with another site</a></div>");
						    		importItem.appendTo(section);

			    					if (sport == 'nfl'){
								    	$("<div class='fp-extension-section-promo'>Sponsored By<a href='https://www.millerlite.com/buybeeronline' target='_blank' class='promo-logo'>" +
								    		"<img src='//cdn.fantasypros.com/assets/images/miller-lite/Miller-Lite-Logo.png'></a></div>").appendTo(section);
						    		}
						    		*/	
								} else if (import_result.error){
									alert(import_result.error);
								} else {
									alert("unknown error");
								}
							});
							
						} else {
							alert("Please select at least one league");
						}
					});
		
		    	} else if (result.imported_leagues.length > 1){
		    		thirdpartyCookiesCheck.remove();
		    		$("<div class='fp-extension-summary'>You have already imported all " + result.imported_leagues.length + " ESPN leagues</div>").appendTo(bodyImport);
		    	} else if (result.imported_leagues.length == 1){
		    		thirdpartyCookiesCheck.remove();
		    		$("<div class='fp-extension-summary'>You have already imported your ESPN league</div>").appendTo(bodyImport);
		    	} else {
		    		thirdpartyCookiesCheck.remove();
		    		$("<div class='fp-extension-summary'>There is no fantasy " + sport_long + " league in your ESPN account</div>").appendTo(bodyImport);
		    	}
			});
		} else {
			$("<div class='fp-extension-summary fp-extension-error'>Please log in to ESPN to sync your leagues</div>").appendTo(bodyImport);	
		}
	}

}

