var bgPage = chrome.extension.getBackgroundPage()

// Loads stored extension data on activation
$(window).load(function() {
	chrome.storage.sync.get(['favouriteTeam', 'homeTeam', 'timeFormat', 'hideScores', 'hideFavourite', 'hideDays', 'refreshScores', 'gameDayData'], function (result) {
		for (var i = Object.keys(result).length - 1; i >= 0; i--) {
			document.getElementById(Object.keys(result)[i]).value = Object.values(result)[i]
		}
		teamChange()
		hideFavourite()
	})
})

// Updates page styling on favourite team update
function teamChange() {
	for (var i = bgPage.teams.length - 1; i >= 0; i--) {
		if (document.getElementById('favouriteTeam').value === bgPage.teams[i][0]) {
			document.getElementById('teamBanner').src = '/images/NFL/' + bgPage.teams[i][0] + '.svg'
			$('body').css('background', bgPage.teams[i][2])
			$('.borderBar').css({'border-bottom':'2px solid' + bgPage.teams[i][3]})
		}
	}
}

// Enables/Disables features based on selected options
function hideFavourite() {
	if (document.getElementById('hideScores').value === 'Disabled') {
		$('#hideFavourite').css({'opacity':'0.7', 'pointer-events':'none'})
	} else {
		$('#hideFavourite').css({'opacity':'1', 'pointer-events':'auto'})
	}
}

// Updates stored extension data
$('select').change(function() {
	chrome.storage.sync.set({[this.id]:this.value})
	if (this.id === 'hideScores') {
		hideFavourite()
	} else if (this.id === 'favouriteTeam') {
		setTimeout(teamChange, 1000)
	}
})

// Adjusts colour of links on hover
$('.fader').hover(function() {
	$(this).css({'color':$('.borderBar').css('border-bottom-color')})
}, function() {
	$(this).css({'color':'#fff'})}
)
