if (typeof jQuery != 'undefined'){
	jQuery("#btn-side-assistant-pick").click(function(){
		var msgPick = JSON.parse(jQuery("#socket-config").html());
		msgPick.cmd = 'makeDraftPick';
		msgPick.fpId = Number(this.innerHTML);
		chrome.runtime.sendMessage(msgPick, function(res){});
	});
} else {
	alert("The FantasyPros Chrome extension is not correctly installed. Please uninstall and re-install. If the problem persists, please visit https://support.fantasypros.com/");
}