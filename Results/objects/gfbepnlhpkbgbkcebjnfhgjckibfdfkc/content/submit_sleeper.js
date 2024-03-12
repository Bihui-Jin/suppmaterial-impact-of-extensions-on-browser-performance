
$(document).ready(function(){ 	

	var league_id = $("#sleeperLeagueId").val();
	var players = $("#sleeperPlayers").val();
	var positions = $("#sleeperPositions").val();
	if (league_id){
		

		$(".StartSitDiv").hide();
		$("#submitDiv").hide();		
		$("#loadingDiv").show();
		
		chrome.runtime.sendMessage({
			cmd : 'submitToSleeper', 
			leagueId: league_id, 
			players: players, 
			positions: positions
		}, function(result){  
			$("#loadingDiv").hide();	
			$("#outcomeDiv").show();
			if (result == 'ok'){
				$("#outcomeDiv").html("<div style='text-align: center;margin: 40px;font-size: 20px;'>Please check that your lineup is correctly set on Sleeper</div>");
			} else {
				$("#outcomeDiv").html("<div style='text-align: center;margin: 40px;font-size: 20px;'>Failure!</div>");
			}
		});
	}
	
});