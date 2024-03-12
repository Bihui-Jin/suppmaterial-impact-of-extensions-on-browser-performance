var bgPage = chrome.extension.getBackgroundPage()
var gameData = [], arrayDays = []
var generateGames = 0
var localDisplay

//// Core Startup Functionality
// Run startup functions onload
$(window).load(function() {
	extensionLoad()
	buildDropdowns()
	setTimeout(extensionScale, 50)
})

// Scales extension only when in a tabbed view
function extensionScale() {
	if (window.location.hash == '#window') {
		// Scales based on window height
		$('body').css({transform: 'scale(' + (window.innerHeight / 575) + ')',
									 'transform-origin': 'center 0',
								 	 margin: '40px auto 0'})

		// Rescales if the new width is greater than window width
	 	sizeWidth = $('body').width() * (window.innerHeight / 575)
	 	if (sizeWidth > window.innerWidth) {
	 		$('body').css({transform: 'scale(' + (window.innerWidth / sizeWidth) + ')',
	 									 'transform-origin': 'center 0',
	 								 	 margin: '40px auto 0'})
	 	}
	}
}

// Obtain updated game data or load cached data
function extensionLoad() {
	chrome.storage.sync.get(['refreshScores', 'cacheData'], function (result) {
		if (navigator.onLine) {
			getUpdatedData()
		} else {
			$('#networkError').delay('1000').slideToggle('slow')
			$('#networkError').delay('3000').slideToggle('slow')

				if (result.cacheData) {
					gameData = result.cacheData
					getDateCheck()
				}
		}
	})
}

// Retrieves updated Game Data
function getUpdatedData() {
	gameData = []
	fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard')
	.then(res => res.json())
	.then((data) => {
		for (var i = 0; i < data.events.length; i++) {
			gameSchedule = data.events[i].competitions[0]
			ID = gameSchedule.id
			ISO = new Date(gameSchedule.startDate).getTime()
			season = data.season.year
			seasonType = data.season.type
			seasonLabel = ""
			week = data.week.number
			homeID = gameSchedule.competitors[0].id
			homeAbbr = gameSchedule.competitors[0].team.abbreviation
			homeNickname = gameSchedule.competitors[0].team.shortDisplayName
			homeName = gameSchedule.competitors[0].team.displayName
			homeRecord = ''
			visitorID = gameSchedule.competitors[1].id
			visitorAbbr = gameSchedule.competitors[1].team.abbreviation
			visitorNickname = gameSchedule.competitors[1].team.shortDisplayName
			visitorName = gameSchedule.competitors[1].team.displayName
			visitorRecord = ''
			stadium = gameSchedule.venue.fullName
			broadcaster = ''
			phase = ''
			time = ''
			redzone = ''
			possession = ''
			homeScore = ''
			visitorScore = ''

			if (gameSchedule.broadcasts.length > 0) {
				broadcaster = gameSchedule.broadcasts[0].names[0]
			}

			if (gameSchedule.competitors[0].records && gameSchedule.competitors[1].records) {
				homeRecord = '(' + gameSchedule.competitors[0].records[0].summary + ')'
				visitorRecord = '(' + gameSchedule.competitors[1].records[0].summary + ')'
			}

			score = gameSchedule.status
			if (score.type.state != 'pre') {
				homeScore = parseInt(gameSchedule.competitors[0].score)
				visitorScore = parseInt(gameSchedule.competitors[1].score)

				if (score.type.detail.includes('Quarter')) {
					phase = 'Q' + score.period
					time = ' - ' + score.displayClock
				} else if (score.period == 5 && !score.type.detail.includes('OT')){
					phase = 'OT'
					time = ' - ' + score.displayClock
				} else if (score.type.detail.includes('Final/OT')) {
					phase = score.type.description + ' Overtime'
				} else if (score.type.description.includes('Postponed') || score.type.description.includes('Canceled')) {
					phase = score.type.description
					homeScore = ''
					visitorScore = ''
				} else {
					phase = score.type.description
				}

				if (gameSchedule.situation != null) {
					redzone = gameSchedule.situation.isRedZone
					possession = gameSchedule.situation.lastPlay.team.id
				}
			}

			switch(seasonType) {
				case 1:
					seasonLabel = "pre"
					week = week - 1
					break;

				case 2:
					seasonLabel = "reg"
					break;

				case 3:
					seasonLabel = "post"
					if (week = 5) {
						week = week - 1
					}
					break;

				case 4:
					seasonLabel = "off"
					break;
			}

			gameCenterNFL = `https://www.nfl.com/games/${visitorNickname}-at-${homeNickname}-${season}-${seasonLabel}-${week}`
			gameCenterESPN = `https://www.espn.com.au/nfl/game/_/gameId/${ID}`
			homeLink = `https://www.nfl.com/teams/profile?team=${homeAbbr}`
			visitorLink = `https://www.nfl.com/teams/profile?team=${visitorAbbr}`
			gameData.push([ID, ISO, season, seasonLabel, week, homeAbbr, homeNickname, homeName, visitorAbbr, visitorNickname, visitorName, stadium, phase, time, redzone, possession, homeScore, visitorScore, gameCenterNFL, homeLink, visitorLink, homeID, visitorID, homeRecord, visitorRecord, broadcaster, gameCenterESPN])
		}
		gameData.sort((a, b) => a[1] - b[1] || a[5].localeCompare(b[5]))
		chrome.storage.sync.set({'cacheData':gameData})

		// Determines if game data refreshes are required
		chrome.storage.sync.get('refreshScores', function (result) {
			if (generateGames === 0) {
				generateGames = 1
				getDateCheck()
				if (result.refreshScores !== 'Disabled') {
					setTimeout(getUpdatedData, 1000 * 60)
				}
			} else if (generateGames === 1) {
				refreshGames()
			}
		})
	})
	.catch(err => { throw err })
}

// Refresh games module
function refreshGames() {
	for (var i = gameData.length - 1; i >= 0; i--) {
		// Determines phase for game data and restores element styling for active games
		localDate = new Date(gameData[i][1])
		if (!gameData[i][12]) {
			gameData[i][12] = localDate.toString().substring(16,21)
		} else {
			$('.' + leftTeam + i).add('.' + rightTeam + i).css('width', '')
		}

		// Updates game data details
		$('.phase' + i).text(gameData[i][12] + gameData[i][13])
		$('.homeTeam' + i).text(gameData[i][16])
		$('.visitorTeam' + i).text(gameData[i][17])
	}
	getGameData()
	setTimeout(getUpdatedData, 1000 * 60)
}

// Gets and sets game days array
function getDateCheck() {
	arrayDays = []
	chrome.storage.sync.get('timeFormat', function (result) {
		timeFormat = result.timeFormat
		for (var i = 0; i < gameData.length; i++) {
			localDate = new Date(gameData[i][1])
			for (var j = 0; j <= bgPage.weekDays.length - 1; j++) {
				if (localDate.getDay() == bgPage.weekDays[j][0]) {
					arrayDays.push([bgPage.weekDays[j][1]])
				}
			}

			if (!gameData[i][12]) {
				if (timeFormat == '24-Hour Format') {
					localDisplay = localDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
				} else {
					localDisplay = localDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
				}
				gameData[i][12] = localDisplay
			}
		}
	})

	// Sets title based on current historical game data lookup
	titleName = ['Hall of Fame Week', 'Wild Card Weekend', 'Divisional Playoffs', 'Conference Championships', 'Pro Bowl', `${'Super Bowl ' + bgPage.lookupSuperBowl[(new Date()).getFullYear() - 2009]}`, 'Off Season']
	if (gameData[0][3] == 'pre') {
		$('#seasonDetail').text(titleName[gameData[0][4] - 1])
	} else if (gameData[0][3] == 'post') {
		$('#seasonDetail').text(titleName[gameData[0][4] + 1])
	} else if (gameData[0][3] == 'off') {
		$('#seasonDetail').text(titleName[gameData[0][4] + 5])
	} else {
		$('#seasonDetail').text('Week ' + gameData[0][4])
	}
	setupGames()
}

// Generates the HTML structure
function setupGames() {
	var dayCurrently
	chrome.storage.sync.get(['homeTeam', 'gameDayData'], function (result) {
		for (var i = 0; i < gameData.length; i++) {
			// Checks home/visitor team format preference
			if (result.homeTeam === 'Right-Hand Side') {
				leftTeam = 'visitorTeam'
				leftFlag = gameData[i][10] + '\n' + gameData[i][24]
				leftScore = gameData[i][17]
				leftLink = gameData[i][20]
				rightTeam = 'homeTeam'
				rightFlag = gameData[i][7] + '\n' + gameData[i][23]
				rightScore = gameData[i][16]
				rightLink = gameData[i][19]
			} else {
				leftTeam = 'homeTeam'
				leftFlag = gameData[i][7] + '\n' + gameData[i][23]
				leftScore = gameData[i][16]
				leftLink = gameData[i][19]
				rightTeam = 'visitorTeam'
				rightFlag = gameData[i][10] + '\n' + gameData[i][24]
				rightScore = gameData[i][17]
				rightLink = gameData[i][20]
			}

			if (gameData[i][25] == '') {
				gameDayText = gameData[i][11]
			} else {
				gameDayText = gameData[i][11] + '\n(' + gameData[i][25] + ')'
			}

			if (result.gameDayData === 'ESPN.com') {
				gameDayData = gameData[i][26]
			} else {
				gameDayData = gameData[i][18]
			}

			// Creates the HTML block elements
			if (dayCurrently === arrayDays[i][0]) {
				var setupBlock = `<div class="scoreBox ${gameData[i][0]}">
														<span class="flex-score"><a href="${leftLink}"" target="_blank" title="${leftFlag}"><img id="${leftTeam + 'Banner' + i}"></a></span>
														<span class="flex-detail ${'scoreHide' + i}">Show Score</span>
														<span class="flex-score ${leftTeam + i} ${'scoreShow' + i}">${leftScore}</span>
														<span class="flex-detail ${'scoreShow' + i}"><a class="${'phase' + i}" href="${gameDayData}"" target="_blank" title="${gameDayText}">${gameData[i][12] + gameData[i][13]}</a></span>
														<span class="flex-score ${rightTeam + i} ${'scoreShow' + i}">${rightScore}</span>
														<span class="flex-score"><a href="${rightLink}"" target="_blank" title="${rightFlag}"><img id="${rightTeam + 'Banner' + i}"></a></span>
													</div>`
				$('#container' + arrayDays[i]).append(setupBlock)
			} else {
				dayCurrently = arrayDays[i][0]
				var setupBlock = `<div class="titleSpacer">
														<button class="container${arrayDays[i]}" id="gameWeek">${arrayDays[i]}</button>
													</div>
													<div id="container${arrayDays[i]}">
														<div class="scoreBox ${gameData[i][0]}">
															<span class="flex-score"><a href="${leftLink}"" target="_blank" title="${leftFlag}"><img id="${leftTeam + 'Banner' + i}"></a></span>
															<span class="flex-detail ${'scoreHide' + i}">Show Score</span>
															<span class="flex-score ${leftTeam + i} ${'scoreShow' + i}">${leftScore}</span>
															<span class="flex-detail ${'scoreShow' + i}"><a class="${'phase' + i}" href="${gameDayData}"" target="_blank" title="${gameDayText}">${gameData[i][12] + gameData[i][13]}</a></span>
															<span class="flex-score ${rightTeam + i} ${'scoreShow' + i}">${rightScore}</span>
															<span class="flex-score"><a href="${rightLink}"" target="_blank" title="${rightFlag}"><img id="${rightTeam + 'Banner' + i}"></a></span>
														</div>
													</div>`
				$('#gameData').append(setupBlock)
			}

			// Hides score blocks when empty
			if (gameData[i][12].includes(':')) {
				$('.' + leftTeam + i).add('.' + rightTeam + i).css('width', '0px')
			}
		}
		getGameData()
		getCurrentDay()
		scoreDisplay()
	})
}

// Sets game details
function getGameData() {
	for (var i = gameData.length - 1; i >= 0; i--) {
		for (var j = bgPage.teams.length - 1; j >= 0; j--) {
			// TEMP - Pro Bowl Team Logo Fix
			if (gameData[i][7] == 'AFC' || gameData[i][7]== 'NFC') {
				gameData[i][7] = gameData[i][7] + ' Pro Bowl Team'
			}
			if (gameData[i][10] == 'AFC' || gameData[i][10]== 'NFC') {
				gameData[i][10] = gameData[i][10] + ' Pro Bowl Team'
			}

			// Sets team flags
			if (gameData[i][7] == bgPage.teams[j][0]) {
				document.getElementById('homeTeamBanner' + i).src = '/images/NFL/' + bgPage.teams[j][0] + '.svg'
			} else if (gameData[i][10] == bgPage.teams[j][0]) {
				document.getElementById('visitorTeamBanner' + i).src = '/images/NFL/' + bgPage.teams[j][0] + '.svg'
			}
		}

		// Checks which team is in possession
		if (gameData[i][15] === gameData[i][21]) {
			$('.homeTeam' + i).css({'box-shadow':'0 7px 6px -6px rgba(255, 0, 0, 1)'})
			$('.visitorTeam' + i).css({'box-shadow':''})
		} else if (gameData[i][15] === gameData[i][22]) {
			$('.homeTeam' + i).css({'box-shadow':''})
			$('.visitorTeam' + i).css({'box-shadow':'0 7px 6px -6px rgba(255, 0, 0, 1)'})
		} else {
			$('.homeTeam' + i).css({'box-shadow':''})
			$('.visitorTeam' + i).css({'box-shadow':''})
		}

		// Checks which team is winning
		if (gameData[i][16] > gameData[i][17]) {
			$('.homeTeam' + i).css({'font-weight':'bold'})
			$('.visitorTeam' + i).css({'font-weight':''})
		} else if (gameData[i][16] < gameData[i][17]) {
			$('.homeTeam' + i).css({'font-weight':''})
			$('.visitorTeam' + i).css({'font-weight':'bold'})
		} else {
			$('.homeTeam' + i).css({'font-weight':''})
			$('.visitorTeam' + i).css({'font-weight':''})
		}

		// Checks if the game is in the Redzone
		if (gameData[i][14] === true) {
			$('.' + gameData[i][0]).css({'background-color':'rgba(255, 0, 0, 0.1)'})
		} else {
			$('.' + gameData[i][0]).css({'background-color':''})
		}
	}
}

// Opens container for todays games
function getCurrentDay() {
	var today = new Date()
	chrome.storage.sync.get('hideDays', function (result) {
		for (var i = bgPage.weekDays.length - 1; i >= 0; i--) {
			if (result.hideDays === 'Disabled' || today.getDay() == bgPage.weekDays[i][0]) {
				$('#container' + bgPage.weekDays[i][1]).css({'display':'block'})
			}
		}
	})
}

// Toggles display of game scores on load
function scoreDisplay() {
	var selectedTeam
	chrome.storage.sync.get(['favouriteTeam', 'hideScores', 'hideFavourite'], function (result) {
		selectedTeam = result.favouriteTeam
		for (var i = gameData.length - 1; i >= 0; i--) {
			if (result.hideScores === 'Disabled' || gameData[i][12].includes(':') || (result.hideFavourite != 'Disabled' && selectedTeam != gameData[i][7] && selectedTeam != gameData[i][10])) {
				$('.scoreHide' + i).css({'display':'none'})
				$('.scoreShow' + i).css({'display':'block'})
			}
		}
	})
}

// Toggles display of game scores on click
$(document).on('click', '[class*="scoreHide"]', function(){
	var $this = $(this).attr('class').substring(21,23)
	$('.scoreHide' + $this).add('.scoreShow' + $this).toggle()
})

// Toggles display of day container
$(document).on('click', '[class^="container"]', function(){
	$('#' + $(this).attr('class')).toggle()
})

// Show historical data search options on click
$('#optionsSearch').click(function() {
	$('#searchBar').slideToggle('slow')
	$('.onclick-menu').blur()
})

// Expands the extension fullscreen in a new tab
$('#optionsFullscreen').click(function() {
	chrome.tabs.create({url: chrome.extension.getURL('popup.html#window')})
	$('.onclick-menu').blur()
})

// Show extension options on click
$('#optionsMenu').click(function() {
	chrome.runtime.openOptionsPage ? chrome.runtime.openOptionsPage() : window.open(chrome.runtime.getURL('options.html'))
	$('.onclick-menu').blur()
})

// Performs a 'Title Case' conversion for strings
function titleCase(str) {
	strNew = str.replace('_',' ')
  return strNew.toLowerCase().split(' ').map(function(word) {
    return (word.charAt(0).toUpperCase() + word.slice(1))
  }).join(' ')
}

////	Game Data Search Functionality
// Build search dropdowns
function buildDropdowns() {
	var optionCurrently
	for (var i = 0; i < bgPage.lookupData.length; i++) {
		for (var j = 0; j < bgPage.lookupData[i].length; j++) {
			if (i == 0) { val = '' }
			else if (i == 1) { val = bgPage.lookupDropSeason[j] }
			else if (i == 2) { val = bgPage.lookupDropType[j] }

			if (optionCurrently === bgPage.lookupTitles[i]) {
				var setupOption = `<option data-group="${val}" value="${j}">${bgPage.lookupData[i][j]}</option>`
				$('#' + bgPage.lookupTitles[i]).append(setupOption)
			} else {
				optionCurrently = bgPage.lookupTitles[i]
				var setupOption = `<select id="${bgPage.lookupTitles[i]}">
														<option data-group="" value="${j}">${bgPage.lookupData[i][j]}</option>
													</select>`
				$('#searchBar').append(setupOption)
			}
		}
	}
	$('#searchBar').append(`<a id="optionsGo" target="_blank" title="Search"><img src="/images/FA/play-solid.svg"></a>
													<a id="optionsRestore" target="_blank" title="Restore"><img src="/images/FA/sync-alt-solid.svg"></a>`)
}

// Dynamically adjusts dropdowns based on available data
$(document).on('change', '#lookupSeason, #lookupType', function(){
	if ($(this).attr('id') == 'lookupSeason') {
		val = $('#lookupSeason option:selected').text()
		sub = $('#lookupType')
		$('#lookupWeek').val(0)
		$('#lookupWeek').add('#optionsGo').css({'opacity':'0.7', 'pointer-events':'none'})
	} else if ($(this).attr('id') == 'lookupType') {
		val = $('#lookupType option:selected').text()
		sub = $('#lookupWeek')
		$('#optionsGo').css({'opacity':'0.7', 'pointer-events':'none'})
	}

  if (val == '') {
		sub.css({'opacity':'0.7', 'pointer-events':'none'})
  } else {
		sub.css({'opacity':'1', 'pointer-events':'auto'})
		sub.find('option').not(':first').hide()
    $('option', sub).filter(function(){
      if ($(this).attr('data-group').includes(val)) {
      	$(this).show()
      }
    })
  }
  sub.val(0)
})

$(document).on('change', '#lookupWeek', function(){
	if ($('#lookupWeek option:selected').text() != '') {
		$('#optionsGo').css({'opacity':'1', 'pointer-events':'auto'})
	}
})

// Run search parameters on click
$(document).on('click', '#optionsGo', function(){
	if (navigator.onLine) {
		chrome.storage.sync.get('cacheData', function (result) {
			if (result.cacheData) {
				gameData = result.cacheData
			}
			getSearchData()
		})
	} else {
		$('#networkError').delay('1000').slideToggle('slow')
		$('#networkError').delay('3000').slideToggle('slow')
	}
})

// Action on restore options click
$(document).on('click', '#optionsRestore', function(){
	$('#searchBar').slideToggle('slow')
	$('#gameData').empty()
	$('#optionsGo').css({'opacity':'0.7', 'pointer-events':'none'})
	$('#optionsRestore').css({'opacity':'0.7', 'pointer-events':'none'})

	for (var i = bgPage.lookupTitles.length - 1; i >= 0; i--) {
		if (i != 0) {
			$('#' + bgPage.lookupTitles[i]).css({'opacity':'0.7', 'pointer-events':'none'})
		}
		$('#' + bgPage.lookupTitles[i]).val(0)
	}

	extensionLoad()
	generateGames = 0
})

// Obtain historical search data
function getSearchData() {
	lookupSeason = $('#lookupSeason option:selected').text()
	lookupType = $('#lookupType option:selected').text()
	lookupWeek = document.getElementById('lookupWeek').value - 1

	if (gameData[0][2] == lookupSeason && gameData[0][3] == lookupType && gameData[0][4] == lookupWeek) {
		$('#gameData').empty()
		extensionLoad()
		generateGames = 0
	} else {
		generateGames = 2
		gameData = []
		fetch(`https://static.nfl.com/ajax/scorestrip?season=${lookupSeason}&seasonType=${lookupType}&week=${lookupWeek}`)
	  .then(response => response.text())
	  .then(str => (new window.DOMParser()).parseFromString(str, 'text/xml'))
	  .then((data) => {
			xml = toArray($(eval(data)).find('g'))
			if (xml.length === 0) {
				$('#searchError').delay('1000').slideToggle('slow')
				$('#searchError').delay('3000').slideToggle('slow')
			} else {
				$('#gameData').empty()
				$('#optionsRestore').css({'opacity':'1', 'pointer-events':'auto'})

				// Sets title based on current historical game data lookup
				if (lookupWeek == 0 && lookupSeason > 2003) { $('#seasonDetail').text('Hall of Fame Week') }
				else if (lookupWeek == 18) { $('#seasonDetail').text('Wild Card Weekend') }
				else if (lookupWeek == 19) { $('#seasonDetail').text('Divisional Playoffs') }
				else if (lookupWeek == 20) { $('#seasonDetail').text('Conference Championships') }
				else if (lookupWeek == 21) { $('#seasonDetail').text('Pro Bowl') }
				else if (lookupWeek == 22) { $('#seasonDetail').text('Super Bowl ' + bgPage.lookupSuperBowl[lookupSeason - 2009]) }
				else { $('#seasonDetail').text(lookupSeason + ' - ' + lookupType + ' - Week ' + lookupWeek) }

				for (var i = xml.length - 1; i >= 0; i--) {
					ID = xml[i].attributes[0].nodeValue
					homeAbbr = xml[i].attributes[6].nodeValue
					visitorAbbr = xml[i].attributes[9].nodeValue

					// Adjusts abbreviations for historical teams
					if (lookupSeason < 1984) { if (homeAbbr == 'BAL') { homeAbbr = 'BAL2' }
																		 else if (visitorAbbr == 'BAL') { visitorAbbr = 'BAL2' } }
					if (lookupSeason < 1997) { if (homeAbbr == 'HOU') { homeAbbr = 'HOU2' }
																		 else if (visitorAbbr == 'HOU') { visitorAbbr = 'HOU2' } }
					if (lookupSeason < 2020) { if (homeAbbr == 'LA') { homeAbbr = 'LA2' }
																		 else if (visitorAbbr == 'LA') { visitorAbbr = 'LA2' } }
					if (lookupSeason < 1999) { if (homeAbbr == 'TEN') { homeAbbr = 'TEN2' }
																		 else if (visitorAbbr == 'TEN') { visitorAbbr = 'TEN2' } }
					if (lookupSeason > 1987) { if (homeAbbr == 'STL') { homeAbbr = 'STL2' }
																		 else if (visitorAbbr == 'STL') { visitorAbbr = 'STL2' } }
					if (lookupSeason > 2020) { if (homeAbbr == 'WSH') { homeAbbr = 'WAS' }
																		 else if (visitorAbbr == 'WSH') { visitorAbbr = 'WAS' } }
					if (lookupSeason > 2021) { if (homeAbbr == 'WSH') { homeAbbr = 'WSH2' }
																		 else if (visitorAbbr == 'WSH') { visitorAbbr = 'WSH2' } }

					// Determines historical game data scores
					if (xml[i].attributes[8].nodeValue) {
						homeScore = parseInt(xml[i].attributes[8].nodeValue)
						visitorScore = parseInt(xml[i].attributes[11].nodeValue)
					} else {
						homeScore = ''
						visitorScore = ''
					}

					// Determines historical game data titles
					score = xml[i].attributes[4].nodeValue
					if (score === 'F') { phase = 'Final' }
					else if (score === 'FO') { phase = 'Final Overtime' }
					else if (score === 'P' && (homeScore !== '' || visitorScore !== '')) { phase = 'Suspended' }
					else { phase = xml[i].attributes[3].nodeValue + ' ET' }
					gameData.push([ID, lookupSeason, lookupType, lookupWeek, homeAbbr, visitorAbbr, phase, homeScore, visitorScore])
				}
				gameData = gameData.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
				getGameHistory()
			}
		})
		.catch(err => { throw err })
	}
}

function getGameHistory() {
	// Date check and setup
	arrayDays = []
	var dayCurrently, itemCurrently
	for (var i = 0; i < gameData.length; i++) {
		dateID = gameData[i][0].toString()
		dateYear = dateID.substring(0,4)
		dateMonth = dateID.substring(4,6)
		dateDay = dateID.substring(6,8)
		date = new Date(dateYear, dateMonth - 1, dateDay)
		for (var j = 0; j <= bgPage.weekDays.length - 1; j++) {
			if (date.getDay() == bgPage.weekDays[j][0]) {
				arrayDays.push([bgPage.weekDays[j][1]])
			}
		}
	}

	// Creates historical game data items
	chrome.storage.sync.get('homeTeam', function (result) {
		for (var i = 0; i < gameData.length; i++) {
			// Checks home/visitor team format preference
			if (result.homeTeam == 'Right-Hand Side') {
				leftTeam = 'visitorTeam'
				leftScore = gameData[i][8]
				rightTeam = 'homeTeam'
				rightScore = gameData[i][7]
			} else {
				leftTeam = 'homeTeam'
				leftScore = gameData[i][7]
				rightTeam = 'visitorTeam'
				rightScore = gameData[i][8]
			}

			// Creates the HTML block elements
			if (dayCurrently === arrayDays[i][0]) {
				var setupBlock = `<div class="scoreBox ${(gameData[i][0])}">
														<span class="flex-score"><img id="${(leftTeam + 'Banner' + i)}"></span>
														<span class="flex-score ${(leftTeam + i)}">${(leftScore)}</span>
														<span class="flex-detail">${gameData[i][6]}</span>
														<span class="flex-score ${(rightTeam + i)}">${(rightScore)}</span>
														<span class="flex-score"><img id="${(rightTeam + 'Banner' + i)}"></span>
													</div>`
				$('#container' + arrayDays[i] + itemCurrently).append(setupBlock)
			} else {
				dayCurrently = arrayDays[i][0]
				itemCurrently = i
				var setupBlock = `<div class="titleSpacer">
														<button class="container${(arrayDays[i] + i)}" id="gameWeek">${(arrayDays[i])}</button>
													</div>
													<div id="container${(arrayDays[i] + i)}">
														<div class="scoreBox ${(gameData[i][0])}">
															<span class="flex-score"><img id="${(leftTeam + 'Banner' + i)}"></span>
															<span class="flex-score ${(leftTeam + i)}">${(leftScore)}</span>
															<span class="flex-detail">${gameData[i][6]}</span>
															<span class="flex-score ${(rightTeam + i)}">${(rightScore)}</span>
															<span class="flex-score"><img id="${(rightTeam + 'Banner' + i)}"></span>
														</div>
													</div>`
				$('#gameData').append(setupBlock)
			}
		}

		for (var i = 0; i < gameData.length; i++) {
			// Checks for which team has won
			if (gameData[i][7] > gameData[i][8]) {
				$('.homeTeam' + i).css({'font-weight':'bold'})
			} else if (gameData[i][7] < gameData[i][8]) {
				$('.visitorTeam' + i).css({'font-weight':'bold'})
			}

			// Sets team flags
			for (var j = bgPage.teams.length - 1; j >= 0; j--) {
				if (gameData[i][4] == bgPage.teams[j][1]) {
					document.getElementById('homeTeamBanner' + i).src = '/images/NFL/' + bgPage.teams[j][0] + '.svg'
					document.getElementById('homeTeamBanner' + i).title = bgPage.teams[j][0].replace(/[0-9]/g, '')
				} else if (gameData[i][5] == bgPage.teams[j][1]) {
					document.getElementById('visitorTeamBanner' + i).src = '/images/NFL/' + bgPage.teams[j][0] + '.svg'
					document.getElementById('visitorTeamBanner' + i).title = bgPage.teams[j][0].replace(/[0-9]/g, '')
				}
			}
		}
		// Opens game containers
		$('div[id*="container"]').css({'display':'block'})
	})
}

// Converts historical game data into readable array
function toArray(obj) {
  var array = []
  for (var i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}
