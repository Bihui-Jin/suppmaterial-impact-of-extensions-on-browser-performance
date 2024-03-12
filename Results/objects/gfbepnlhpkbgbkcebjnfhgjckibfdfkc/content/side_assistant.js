
var msgRequest = document.getElementById("socket-config") ? JSON.parse(document.getElementById("socket-config").innerHTML): {};

var lastMessage = {pickLog:[]};

if (msgRequest.type == 'E' || msgRequest.type == 'Y' || msgRequest.type == 'S'){
	//sockets are blocked by ESPN cross-origin policy, so the side assistant needs to poll the local storage 
	// and now Yahoo too
	msgRequest.cmd = 'getLastAssistantMessage';

	setInterval(
		function(){ 
	
		    chrome.runtime.sendMessage(msgRequest, function(msg){  
	    		if (msg.cmd == 'checkAssistant'){
			    	var msg2 = JSON.parse(JSON.stringify(msg)); 
			    	msg2.cmd = 'foundAssistant';
			    	msg2.assistantUrl = location.href;
					chrome.runtime.sendMessage(msg2, function(res){});
	    		} else if (msg.cmd == 'sendSync'){
	    			
	    			var hasChange = lastMessage.nominee != msg.nominee || 
					    			lastMessage.completed != msg.completed || 
									lastMessage.userIsOnTheClock != msg.userIsOnTheClock;
	    			if (lastMessage.pickLog && msg.pickLog){
	    				hasChange = hasChange || lastMessage.pickLog.length != msg.pickLog.length;
	    			} else if (msg.pickLog){
	    				hasChange = true;
	    			}
	    			
	    			if (hasChange){
				    	lastMessage = msg;
		    			msg.eventType = 'syncEvent'
						var actualCode = 'ng_onSocketEvent(' + JSON.stringify(msg) + ')';
						var script = document.createElement('script');
						script.textContent = actualCode;
						(document.head||document.documentElement).appendChild(script);
						script.remove();
	    			}
	    		}
	    		
		    });
		    
		}, 500);
}