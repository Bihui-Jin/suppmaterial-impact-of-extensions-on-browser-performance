/* ----------------------- READ SETTINGS AND GENERAL VAR ----------------------- */
lang = navigator.userLanguage || navigator.language;
userLang = lang.substr(0, 2);

userCountry = '';
isRussiaCIS = false;
urlRussiaCIS = 'https://alitems.co/g/1e8d114494780233a1c916525dc3e8';

weatherStatusHTML = null;
localFeedHTML = null;
holidaysHTML = null;

RSS_URL = '';

isSideBarOpen = false;



// read SYNC STORAGE
chrome.storage.sync.get(function (obj) {
    if (typeof obj.userFeedURL !== 'undefined')
        RSS_URL = obj.userFeedURL;
    else
        RSS_URL = 'https://rss.app/feeds/oIflLx4G27cStvCj.xml';
});



// read LOCAL STORAGE
chrome.storage.local.get(function (obj) {
    // russia CIS
    if (typeof obj.isRussiaCIS !== 'undefined')
        isRussiaCIS = obj.isRussiaCIS;

    // userCountry
    if (typeof obj.userCountry !== 'undefined')
        userCountry = obj.userCountry;

    // get holidays
    if (typeof obj.holidaysHTML !== 'undefined')
        holidaysHTML = obj.holidaysHTML;

    // get weather
    if (typeof obj.weatherStatusHTML !== 'undefined')
        weatherStatusHTML = obj.weatherStatusHTML;

    // get feeds
    if (typeof obj.localFeedHTML !== 'undefined')
        localFeedHTML = obj.localFeedHTML;

    // LAST THING TO DO
    // get last saved and reset variables
    if (typeof obj.lastSaved !== 'undefined') {
        var currentDate = new Date();
        var saved = Date.parse(obj.lastSaved);

        if (currentDate >= saved) {
            weatherStatusHTML = null;
            localFeedHTML = null;
            holidaysHTML = null;
        }
    }
});



// set last saved date (by 20 minutes)
// function called only to set date, by weather, feeds or calendar
function setLastSaved() {
    var minutesToAdd = 20;
    var currentDate = new Date();
    var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

    chrome.storage.local.set({
        'lastSaved': futureDate.toString()
    });
}



/* COLOR SCHEME */
try {
	var c = 'light';
	if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
		c = 'dark';

	chrome.storage.local.set({
		'colorScheme': c
	});
	chrome.action.setIcon({
		path: {
			'16': '/icons/16-' + c + '_theme.png',
			'32': '/icons/32-' + c + '_theme.png'
		}
	})
}
catch (e) { }