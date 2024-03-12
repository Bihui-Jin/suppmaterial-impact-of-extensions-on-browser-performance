var GAMES_NUM = 8;

function loadPlayerInfo(playerInfo) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://lichess.org/@/' + playerInfo.playerName + '/all');
    //xhr.open('GET', 'https://lichess.org/@/dmieter/all');
    xhr.onload = function () {
        //console.log(xhr.responseText);
        parsePlayerForm(xhr.responseText, playerInfo);
        updatePlayerTable(playerInfo);
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

/** Setting table header like:  dmieter(2000)    +1=2-7    1837? */
function updateTableHeaderRow(playerInfo) {
    const tableHeaderRow = document.getElementById('header-row');

    /** Name */
    const nametd = document.createElement('th');
    nametd.classList.add('left');
	nametd.textContent = playerInfo.playerName;

    /** Performance string */
    const performancetd = document.createElement('th');
    performancetd.style = 'width: 20%;';
    performancetd.colSpan = 2;
    performancetd.textContent = playerInfo.performanceString;

    /** Performance rating */
    const liveperformancetd = document.createElement('th');
    performancetd.style = 'width: 20%;';
    liveperformancetd.classList.add('right');
    liveperformancetd.textContent = playerInfo.performanceRating + '?';

    tableHeaderRow.innerHTML = '';
    tableHeaderRow.appendChild(nametd);
    tableHeaderRow.appendChild(performancetd);
    tableHeaderRow.appendChild(liveperformancetd);
}

function updateTableHeaderStr(playerInfo, strSuffix) {
    const tableHeader = document.getElementById('header');
	tableHeader.textContent = playerInfo.playerName + strSuffix;
}

function updatePlayerTable(playerInfo) {

    console.log(playerInfo);

    updateTableHeaderRow(playerInfo);

    const playerTable = document.getElementById('player-form');

    for (let i = 0; i < GAMES_NUM; i++) {
        if (playerInfo.playerForm.length > i) {
            const row = document.createElement('tr');
            addPlayerRow(playerInfo.playerForm, row, i);
            playerTable.appendChild(row);
        }
    }
}

function calculatePlayerStats(playerInfo) {
    const tableHeader = document.getElementById('header');
    tableHeader.textContent = playerInfo.playerName + ' (' + playerInfo.rating + ')';

    let gamesNum = 0;
    let winCnt = 0;
    let drawCnt = 0;
    let loseCnt = 0;
    let opponentsRating = 0;

    for (let i = 0; i < playerInfo.playerForm.length; i++) {
        const game = playerInfo.playerForm[i];

        //if (game.gameInfo.opening.length > 0) { // game started
		if (game.change.length > 0) { // rating game finished
            gamesNum++;
            opponentsRating += parseInt(game.rating);

            if ('win' === game.result) {
                winCnt++;
            } else if ('loss' === game.result) {
                loseCnt++;
            } else {
                drawCnt++;
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

    playerInfo.performanceString = '+'+winCnt+'='+drawCnt+'-'+loseCnt;
    playerInfo.performanceRating = performanceRating;
}

function addPlayerRow(playerData, row, gameNum) {

    let game = playerData[gameNum]

    /** name */
    const col1 = document.createElement('td');
    col1.textContent = game.name + ' (' + game.rating + ')';
	col1.onclick = function() { redirectToLichessProfile(game.name); };
	col1.onmouseover = function() { this.style.backgroundColor = "#f0f0f0" };
	col1.onmouseout = function() { this.style.backgroundColor = "#ffffff" };
	col1.style="cursor: pointer;";
    row.appendChild(col1);

    /** color */
    const col2 = document.createElement('td');
    const colspan = document.createElement('span');
    colspan.classList.add('filled-circle-' + game.color);
    col2.appendChild(colspan);
    row.appendChild(col2);

    /** rating change */
    const col4 = document.createElement('td');
    if (game.change.length > 0) {
        col4.textContent = game.change;
    } else {
        col4.textContent = "-";
    }
    row.appendChild(col4);

    /** additional info **/
    const col5 = document.createElement('td');
    col5.setAttribute('style', 'white-space: pre;');

    const typeEl = document.createElement('span');
    typeEl.textContent = cutString(game.gameInfo.timeControl + ' ' + game.gameInfo.variant, 15);
	//typeEl.classList.add('small');
    col5.appendChild(typeEl);

    const brEl1 = document.createElement('br');
    col5.appendChild(brEl1);

    const openingEl = document.createElement('span');
    openingEl.classList.add('small');
    openingEl.textContent = cutString(game.gameInfo.opening, 22);
    col5.appendChild(openingEl);
	
	col5.onclick = function() { redirectToLichessGame(game.gameInfo.url); };
	col5.onmouseover = function() { this.style.backgroundColor = "#f0f0f0" };
	col5.onmouseout = function() { this.style.backgroundColor = "#ffffff" };
	col5.style="cursor: pointer;";

    row.appendChild(col5);

    /** win/lose style */
    if ('win' === game.result) {
        col1.classList.add('win');
    } else if ('loss' === game.result) {
        col1.classList.add('lose');
    }

}

function redirectToLichess() {
    chrome.tabs.update({url: "https://lichess.org"});
}

function redirectToLichessProfile(name) {
    chrome.tabs.create({url: "https://lichess.org/@/" + name, active: false});
}

function redirectToLichessGame(gameUrl) {
    chrome.tabs.create({url: "https://lichess.org/" + gameUrl, active: false});
}

function parseGameUrl(fullUrlString) {
    const parts = fullUrlString.split("/");
    return parts[3];
}

function processOpponent(gameUrl, playerName, rating){
    console.log(playerName);
    let playerInfo = {"gameUrl": gameUrl, "playerName": playerName, "rating": rating};
    updateTableHeaderStr(playerInfo, " Loading...");
    loadPlayerInfo(playerInfo);
}


document.addEventListener('DOMContentLoaded', function () {

    document.getElementById("lichessLink").addEventListener("click", redirectToLichess);

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {

        let gameUrl = parseGameUrl(tabs[0].url);
        console.log("Game URL is " + gameUrl);

        chrome.tabs.sendMessage(tabs[0].id, {}, function (response) {
            if (response != undefined) {
                if(response.playerName != undefined) {
                    processOpponent(gameUrl, response.playerName, response.rating);
                }
            }
        });

    });

});
