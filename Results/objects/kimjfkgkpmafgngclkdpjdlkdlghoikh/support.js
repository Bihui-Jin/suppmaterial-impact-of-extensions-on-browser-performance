var bgPage = chrome.extension.getBackgroundPage()

// Loads stored extension data on activation
$(window).load(function() {
	chrome.storage.sync.get('favouriteTeam', function (result) {
		if (!result.favouriteTeam) {
			$('.borderBar').css({'border-bottom':'2px solid' + bgPage.teams[0][3]})
		} else {
			for (var i = bgPage.teams.length - 1; i >= 0; i--) {
				if (result.favouriteTeam === bgPage.teams[i][0]) {
					$('.borderBar').css({'border-bottom':'2px solid' + bgPage.teams[i][3]})
				}
			}
		}
	})
})

// Adjusts colour of links on hover
$('.fader').hover(function() {
	$(this).css({'color':$('.borderBar').css('border-bottom-color')})
}, function() {
	$(this).css({'color':'#fff'})}
)
