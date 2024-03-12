var GAMES_NUM = 8;
let playerInfo = {};
getOpponentInfo();

function processOpponent(playerName, rating){
    console.log(playerName);
    playerInfo = {"playerName": playerName, "rating": rating};
    loadPlayerInfo(playerInfo);
}


function loadPlayerInfo(playerInfo) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lichess.org/@/' + playerInfo.playerName + '/all');
    //xhr.open('GET', 'https://lichess.org/@/dmieter/all');
    xhr.onload = function () {
        //console.log(xhr.responseText);
        parsePlayerForm(xhr.responseText, playerInfo);
		updateOpponentInfo();
    };
    xhr.send();
}

function parsePlayerForm(htmlText, playerInfo) {
    let result = [];

    let el = document.createElement('html');
    el.innerHTML = htmlText;

    const games = el.getElementsByClassName('game-row');

    for (let i = 0; i < GAMES_NUM; i++) {
        if (games.length > i) {
            result.push(parseGame(games[i], playerInfo.playerName));
        }
    }

    playerInfo.playerForm = result;
    calculatePlayerStats(playerInfo);
}

function parseGame(game, currentPlayerName) {

	const playerWhiteEl = game.getElementsByClassName('player white')[0];
    const playerBlackEl = game.getElementsByClassName('player black')[0];

    let resultPlayer = {};

    const playerWhite = parsePlayer(playerWhiteEl);
    const playerBlack = parsePlayer(playerBlackEl);

    if (playerWhite.name != currentPlayerName) {
        resultPlayer = playerWhite;
        resultPlayer.color = 'black';
        resultPlayer.change = playerBlack.change;
    } else {
        resultPlayer = playerBlack;
        resultPlayer.color = 'white';
        resultPlayer.change = playerWhite.change;
    }

    resultPlayer.result = parseResult(game);
    resultPlayer.gameInfo = parseGameInfo(game);

    return resultPlayer;
}

function parseGameInfo(game) {
    const gameInfo = {};

	const gameHrefEl = game.getElementsByClassName('game-row__overlay')[0];
	const hrefSPlit = gameHrefEl.href.split("/");
	if(hrefSPlit.length > 3) {
		gameInfo.url = hrefSPlit[3]+'#1000';  // getting only game Url + go to ending position
	}

    const divGameInfo = game.getElementsByClassName('game-row__infos')[0];

    /** Time Control */
    const divHeader = divGameInfo.getElementsByClassName("header__text");
    if (divHeader.length > 0) {
        const headerDetails = divHeader[0].getElementsByTagName("strong")[0];
		gameInfo.description = headerDetails.textContent;
		
		headerSplit = headerDetails.textContent.split(" ");
        gameInfo.timeControl = headerDetails.textContent.split(" ")[0];
		gameInfo.variant = headerDetails.textContent.split(" ")[2];
    } else {
		gameInfo.description = "";
        gameInfo.timeControl = "";
		gameInfo.variant = "";
    }

    /** Openning */
	gameInfo.opening = "";
    const divOpenning = divGameInfo.getElementsByClassName("opening");
    if (divOpenning.length > 0) {
		const openningNameStrong = divOpenning[0].getElementsByTagName("strong");
		if(openningNameStrong.length > 0) {
			gameInfo.opening = openningNameStrong[0].textContent;
		}
    }

    return gameInfo;
}

function cutString(string, size) {
	if (string.length > 22) {
		return string.substring(0, 22) + "...";
	}
	
	return string;
}

function parseResult(game) {
    const resultEl = game.getElementsByClassName('result')[0];
    const spanEl = resultEl.getElementsByTagName('span');
    if (spanEl.length > 0) {
        return spanEl[0].className;
    }
}

function parsePlayer(player) {
    let result = {};

    let playerLink = player.getElementsByClassName('user-link')[0];
    result.name = playerLink.textContent;
    result.rating = player.textContent;

    let bad = player.getElementsByTagName('bad');
    let good = player.getElementsByTagName('good');
    let span = player.getElementsByTagName('span');

    if (bad.length > 0) {
        result.change = bad[0].textContent;
    } else if (good.length > 0) {
        result.change = good[0].textContent;
    } else if (span.length > 0) {
        result.change = span[0].textContent;
    } else {
        result.change = '';
    }

    result.rating = result.rating.replace(result.name, '').replace(result.change, '').trim();

    return result;
}

function calculatePlayerStats(playerInfo) {
    
    let gamesNum = 0;
    let winCnt = 0;
    let drawCnt = 0;
    let loseCnt = 0;
    let opponentsRating = 0;
	let resultString = "";

    for (let i = 0; i < playerInfo.playerForm.length; i++) {
        const game = playerInfo.playerForm[i];

        //if (game.gameInfo.opening.length > 0) { // game started
		if (game.change.length > 0) { // rating game finished
            gamesNum++;
            opponentsRating += parseInt(game.rating);

            if ('win' === game.result) {
                winCnt++;
				resultString += 'W';
            } else if ('loss' === game.result) {
                loseCnt++;
				resultString += 'L';
            } else {
                drawCnt++;
				resultString += 'D';
            }
        }
    }

    let performanceRating = '';
    if(gamesNum > 0){
        const relativeScore = (winCnt + 0.5 * drawCnt)/gamesNum;
        performanceRating = Math.round(opponentsRating/gamesNum + relativeScore * 800 - 400);
        if(performanceRating < 0) {
            performanceRating = 0;
        }
    }

    //playerInfo.performanceString = '+'+winCnt+'='+drawCnt+'-'+loseCnt;
	playerInfo.performanceString = resultString.slice(0, 4).split('').reverse().join('');
    playerInfo.performanceRating = performanceRating;
}

function updateOpponentInfo() {
	let topPlayer = document.getElementsByClassName("ruser-top");
	if(topPlayer.length > 0) {
		
		topElement = topPlayer.item(0);
		playerElement = topPlayer.item(0).getElementsByTagName("a").item(0);
		ratingElement = topPlayer.item(0).getElementsByTagName("rating").item(0);
		streakElement = topPlayer.item(0).getElementsByClassName("streak");
		performanceElement = topPlayer.item(0).getElementsByClassName("performance");
		
		if(streakElement.length > 0) {
			streakElement = streakElement[0];
		} else {
			streakElement = document.createElement('a');
			streakElement.classList.add('streak');
		}
		
		
		if(performanceElement.length > 0) {
			performanceElement = performanceElement[0];
		} else {
			performanceElement = document.createElement('span');
			performanceElement.classList.add('performance');
		}
		
		streakElement.textContent = playerInfo.performanceString;
		performanceElement.textContent = " (" + playerInfo.performanceRating + "?) ";
		
		playerElement.insertAdjacentElement('afterend', streakElement);
		ratingElement.insertAdjacentElement('afterend', performanceElement);
		
	}
}
  
function getOpponentInfo() {
	 
	 let playerName = undefined;
	 let rating = undefined;
	  
	// 1. Find top player
	let topPlayer = document.getElementsByClassName("ruser-top");
	if(topPlayer.length > 0) {
		
		playerElement = topPlayer.item(0).getElementsByTagName("a").item(0);
		ratinglement = topPlayer.item(0).getElementsByTagName("rating").item(0);
		
		playerName = playerElement.text;
		playerName = playerName.split(' ').pop(); // clean up IM, GM, etc.
		rating = ratinglement.textContent;
		
		if(playerInfo.playerName == undefined) {
			processOpponent(playerName, rating);
		}

		console.log(playerName);
	} else {
	
		// 2. Find first user link
		
		let playersDiv = document.getElementsByClassName("crosstable__users");
		if(playersDiv.length > 0) {
		
			let players = playersDiv[0].getElementsByClassName("user-link");
			
			if(players.length > 1) {
				
				let whiteboard = document.getElementsByClassName("orientation-white");
				let blackboard = document.getElementsByClassName("orientation-black");
				
				if(whiteboard.length > 0) {
					playerName = players.item(0).text;
				} else if(blackboard.length > 0) {
					playerName = players.item(1).text;
				} else {
					playerName = 'color not found';
				}
				
				playerName = playerName.split(' ').pop();
				console.log(playerName);
			}
		}
	}
	
    return {playerName: playerName, rating: rating};

}

function getAndUpdateOpponentInfo() {
	var topPlayer = getOpponentInfo();
	processOpponent(topPlayer.playerName, topPlayer.rating);
}

chrome.runtime.onMessage.addListener(
  
    function(request, sender, sendResponse) {
		if(playerInfo.playerName != undefined){
			sendResponse(playerInfo);
		} else {
			sendResponse(getOpponentInfo());
		}
});

var buttonFlip = document.getElementsByClassName("fbt flip");
buttonFlip[0].addEventListener("click", getAndUpdateOpponentInfo);	

