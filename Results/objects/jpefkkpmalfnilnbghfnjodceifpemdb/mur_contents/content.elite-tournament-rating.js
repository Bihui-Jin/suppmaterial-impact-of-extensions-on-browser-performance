// ==UserScript==
// @name    elite-rating
// @include http://ratings.ereality.ru/tournament_*.html
// @require tools/jquery.js
// @require tools.js
// @require css/popup-css.js
// @require tools/popup.js
//
// @require common/elite-tournament-rating.js
// @all-frames  true
// ==/UserScript==

function controller(extOptions) {
    if (!extOptions.options.unpaused) {
        return;
    }

    new eliteTournamentRatingClass(popup).init();
}

var loadOptions = [{
    systemName: 'options',
    defaultName: "myoptions"
}];

$(document).ready(function() {
    tools.loadOptions(loadOptions, controller);
});