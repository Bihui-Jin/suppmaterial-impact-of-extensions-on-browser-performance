
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {

    if (jQuery("#socket-config").html()) {
    	var config = JSON.parse(jQuery("#socket-config").html());
    	
    	if (msg.type == 'S'){ //cannot detect team id in sleeper draft room
			msg.teamId = config.teamId;
		}
    	
    	if (config.sport == msg.sport && config.type == msg.type &&
    			config.leagueId == msg.leagueId && config.teamId == msg.teamId){  
    		if (msg.cmd == 'checkAssistant'){
		    	var msg2 = JSON.parse(JSON.stringify(msg)); 
		    	msg2.cmd = 'foundAssistant';
		    	msg2.assistantUrl = location.href;
				chrome.runtime.sendMessage(msg2, function(res){});
    		} else if (msg.cmd == 'sendSync'){
    			msg.eventType = 'syncEvent'
				var actualCode = 'ng_onSocketEvent(' + JSON.stringify(msg) + ')';
				var script = document.createElement('script');
				script.textContent = actualCode;
				(document.head||document.documentElement).appendChild(script);
				script.remove();
    		}
    	}
    	
    }    
    sendResponse('ok');
});

setTimeout(function(){
	if (jQuery("#socket-config").html()){
		var msgInit = JSON.parse(jQuery("#socket-config").html());
		msgInit.cmd = 'requestSync';
		msgInit.assistantUrl = location.href;
		chrome.runtime.sendMessage(msgInit, function(res){});
	}
}, 2000);


if (jQuery("#socket-config").html() && typeof toggleFpPanel != 'function'){
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
		
		var helpDiv = document.createElement("div");helpDiv.style.position = "fixed";helpDiv.style.bottom = "20px";helpDiv.style.left = "20px";helpDiv.style.width = "360px";helpDiv.style.minHeight = "400px";helpDiv.style.boxShadow = "0px 24px 24px rgba(0, 0, 0, 0.3), 0px 0px 24px rgba(0, 0, 0, 0.22)";helpDiv.style.background = "#FFFFFF";helpDiv.style.color = "#333333";helpDiv.style.borderRadius = "5px";helpDiv.style.zIndex = "5000000";helpDiv.style.textAlign = "center";helpDiv.style.padding = "20px";helpDiv.style.fontSize = "13px";helpDiv.style.lineHeight = "20px";helpDiv.style.fontFamily = '"Open Sans", Arial, sans-serif !important';
		var close = document.createElement('div');close.innerHTML = "<a href='javascript:void(0)' onclick='this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode)' title='close' style='color:#333333 !important'>X</a>";close.style.position = "absolute";close.style.top = "5px";close.style.right = "8px";close.style.fontSize = "16px";close.style.fontWeight = "bold";helpDiv.appendChild(close);
		var img = document.createElement('img');img.src = 'https://cdn.fantasypros.com/csw/images/fp-app.jpg';img.style.display = "block";img.style.width = "60px";img.style.height = "60px";img.style.borderRadius = "50%";img.style.margin = "0 auto";helpDiv.appendChild(img);
		var h1 = document.createElement("div");h1.innerHTML = "Oops... we've detected a problem!";h1.style.fontWeight = "bold";h1.style.fontSize = "18px";h1.style.margin = "15px 0";helpDiv.appendChild(h1);
		var instructions=document.createElement("div");instructions.appendChild(document.createTextNode("In order for the FantasyPros extension to work, go to")),instructions.appendChild(document.createElement("br"));var link=document.createElement("span");link.innerHTML="chrome://extensions/?id=gfbepnlhpkbgbkcebjnfhgjckibfdfkc",link.style.display="inline-block",link.style.background="#eee",link.style.fontSize="11px",instructions.appendChild(link),instructions.appendChild(document.createElement("br")),instructions.appendChild(document.createTextNode(" in your Chrome address bar and"));var allow=document.createElement("span");allow.innerHTML='<br/>make sure <b>"Allow in Incognito"</b><br/> and <b>"Allow access to file URLs"</b><br/> are both enabled.',instructions.appendChild(allow),helpDiv.appendChild(instructions);
		var img=document.createElement("img");img.src="https://cdn.fantasypros.com/csw/images/extension-settings@2x.png",img.style.display="block",img.style.width="312px",img.style.height="60px",img.style.margin="20px auto",helpDiv.appendChild(img);
		var instructions2 = document.createElement("div");instructions2.innerHTML = "If these settings are both already enabled,<br/>you may need to toggle them off and back on.";helpDiv.appendChild(instructions2);
		var support = document.createElement("div");support.innerHTML = "Still having problems?<br/>Please <a href='https://support.fantasypros.com/hc/en-us' target='_blank' style='text-decoration:underline;color:#0377b1'>contact our support team</a> for additional help.";support.style.marginTop = "20px";helpDiv.appendChild(support);
		document.body.appendChild(helpDiv);
	} 
} 