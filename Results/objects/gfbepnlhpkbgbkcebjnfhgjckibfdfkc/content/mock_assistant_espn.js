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
	
	function getUrlParameter(name) {
	    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	    var results = regex.exec(location.search);
	    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	};
	
	function getLeagueId(){
		return getUrlParameter("leagueId");
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
		panelContainer.css("top", "70px").css("height", "140px");
		
		panelImport = $("<div id='fpPanelImport' class='fp-extension-panel fp-extension-premium-advice'></div>");
		panelImport.appendTo(panelContainer);
		
		var headerImport = $("<div class='fp-extension-header'></div>");
		headerImport.appendTo(panelImport);
		$("<a class='fp-extension-logo' target='_blank' href='https://www.fantasypros.com?utm_source=Chrome_Extension&utm_medium=extension&utm_campaign=extension_Import&utm_content=FP_Icon'></a>").appendTo(headerImport);
		$("<div class='fp-extension-menu'><a href='javascript:void(0)' class='fp-extension-settings' title='Open Settings'></a>" +
		"<a href='javascript:void(0)' class='fp-extension-close' title='Close Panel'></a></div>").appendTo(headerImport);
		$("<div class='fp-extension-heading'>Mock Draft Assistant</div>").appendTo(headerImport);	
		$("<div class='fp-extension-sub-heading'>Connect to your ESPN Mock Draft</div>").appendTo(headerImport);
		
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
		
		if (cookieObject && cookieObject.SWID && cookieObject.espn_s2){
	
			bodyImport.html("<div class='fp-extension-loading'></div>");
			
	
			chrome.runtime.sendMessage({
				'cmd':'createEspnMockAssistant', 
				'swid': cookieObject.SWID, 
				's2': cookieObject.espn_s2, 
				'sport': sport,
				leagueId: getLeagueId()
			}, function(import_result){ 
	
				bodyImport.html("");
				
				if (import_result.error){
					var errorDiv = $("<div class='fp-extension-summary'></div>");
					errorDiv.text(import_result.error);
					errorDiv.appendTo(bodyImport);	
				} else if (import_result.redirect){
	
			    	bodyImport.addClass("fp-extension-body-with-cta");
					var ctaDiv = $("<div class='fp-extension-btn-div'></div>");
					ctaDiv.appendTo(panelImport);
					
					var btn = $("<a class='fp-btn-primary fp-btn-x-large' target='_blank'>Launch Draft Assistant</a>");
					btn.attr("href", import_result.redirect);
					btn.appendTo(ctaDiv);
			
				}
				
			});
	
		
		} else {
			$("<div class='fp-extension-summary'>Please log in to ESPN to use the Draft Assistant</div>").appendTo(bodyImport);	
		}
	}
}