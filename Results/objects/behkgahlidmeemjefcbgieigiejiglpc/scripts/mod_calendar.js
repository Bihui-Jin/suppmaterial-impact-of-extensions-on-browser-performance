/* ------------------ EVENTS ------------------ */
var API_KEY = 'AIzaSyCL0kemuCYrNwXSukQBR2vwwqrev_dmlI8';

// today date fixing timezone
let the_date = new Date();
const offset = the_date.getTimezoneOffset();
the_date = new Date(the_date.getTime() - (offset * 60 * 1000));
date_today = the_date.toISOString().split('T')[0];


var TODAY = the_date.toISOString(); // 2022-03-15T00:00:00.000Z


var CALENDAR = userLang + '.' + 'usa%23holiday@group.v.calendar.google.com';
var json;


function showLocalCalendar() {
	$.getJSON('/assets/calendars.json', function (data) {
		json = data;

		// find calendar in json
		try {
			function getAccountByCountryCode(code) {
				return json.filter(
					function (json) {
						return json.country == code
					}
				);
			}

			var found = getAccountByCountryCode(userCountry);
			CALENDAR = userLang + '.' + found[0].account;
		} catch (e) { }

		// show the calendar (english by default)
		if (holidaysHTML === null)
			getCalendarEvents();
		else {
			var stat = holidaysHTML;
			$('#events').html(stat);
			$('#left .lds-ripple').remove();
		}
	});
}


// show calendar by country
// reload just once after getting
chrome.storage.local.get(function (obj) {
	if (typeof obj.userCountry !== 'undefined') {
		userCountry = obj.userCountry;
		showLocalCalendar();
	}
	else {
		if (typeof obj.doNotReload === 'undefined') {
			chrome.storage.local.set({
				'doNotReload': 'yes'
			});

			setTimeout(function () {
				document.location.reload(true);
			}, 1500);
		}
	}
});



// GET PUBLIC CALENDAR EVENTS
function getCalendarEvents() {
	var URL = 'https://www.googleapis.com/calendar/v3/calendars/' + CALENDAR + '/events?key=' + API_KEY + '&maxResults=5&orderBy=startTime&showDeleted=false&singleEvents=true&timeMin=' + TODAY;

	// get events
	$.ajax({
		type: 'GET',
		url: URL,
		dataType: 'json',
		success: function (r) {
			$('#left .lds-ripple').remove();
			$.each(r, function (data, el) {
				$('#left .info').html(r.summary);

				if (data === "items") {
					for (var i in el) {
						var ttl = el[i].summary;
						var lnk = el[i].htmlLink;

						var time = el[i].start.date;

						var today_tomorrow = '',
							today_tomorrow_text = '';

						var today_plus_one = new Date();
						today_plus_one.setDate(the_date.getDate() + 1); // today + 1 day

						var tomorrow = new Date(time);
						tomorrow.setDate(tomorrow.getDate() + 1); // + 1 day based on var time

						if (today_plus_one.toDateString() == tomorrow.toDateString()) {
							today_tomorrow = 'tomorrow';
							today_tomorrow_text = txt_tomorrow;
						}
						else if (time == date_today) {
							today_tomorrow = 'today';
							today_tomorrow_text = txt_today;
						}

						$('#events').append('<li class="' + today_tomorrow + '"><a href="' + lnk + '"><strong>' + ttl + '</strong></a><p class="small">' + today_tomorrow_text + '</p><p>' + time + '</p></li>');
					}
				}
			});


			// save events in background
			var save = $('#events').html();
			holidaysHTML = save.replace(/(\r\n|\t|\n|\r)/gm, "");
			chrome.storage.local.set({
				'holidaysHTML': holidaysHTML
			});
			setLastSaved();
		}
	});
}



/* ------------------------- USER EVENTS ------------------------- */
// read saved events
function readEvents() {
	chrome.storage.sync.get(function (obj) {
		if (typeof obj.userEvents !== 'undefined') {
			$('#userEvents').html(obj.userEvents);
			setTodayTomorrow();
			addDeleteFn('events');
		}
	});
}
readEvents();


// today_tomorrow
function setTodayTomorrow() {
	$('#userEvents li').each(function () {
		var $el = $(this),
			time = $el.find('p').text();

		var today_tomorrow = '',
			today_tomorrow_text = '';

		var today_plus_one = new Date();
		today_plus_one.setDate(the_date.getDate() + 1); // today + 1 day

		var tomorrow = new Date(time);
		tomorrow.setDate(tomorrow.getDate() + 1); // + 1 day based on var time

		if (today_plus_one.toDateString() == tomorrow.toDateString()) {
			today_tomorrow = 'tomorrow';
			today_tomorrow_text = txt_tomorrow;
			$el.addClass(today_tomorrow);
			$el.find('strong').after('<p class="small">' + today_tomorrow_text + '</p>');
		}
		else if (time == date_today) {
			today_tomorrow = 'today';
			today_tomorrow_text = txt_today;
			$el.addClass(today_tomorrow);
			$el.find('strong').after('<p class="small">' + today_tomorrow_text + '</p>');
		}
		else {
			$el.removeClass(today_tomorrow);
			$el.find('.small').remove();
		}

	});
}


function saveEvents() {
	setTimeout(function () {
		$('#userEvents li').each(function () {
			$(this).removeClass();
			$(this).find('.small').remove();
		});

		var items = $('#userEvents').html();
		chrome.storage.sync.set({
			'userEvents': items
		});

		setTodayTomorrow();
	}, 100);
}


function sortEventsByDate() {
	var arr_events = [];

	$('#userEvents li').each(function () {
		var obj = {},
			$el = $(this),
			time = $el.find('p').text(),
			date = new Date($.trim(time)),
			timestamp = date.getTime(); // Unix timestamp
		obj.html = $el[0].outerHTML; // The whole HTML string of an element
		obj.time = timestamp;

		arr_events.push(obj);
	});

	// Sort the array using the timestamp
	arr_events.sort(function (a, b) {
		return a.time > b.time;
	});

	// rewrite list in order
	$('#userEvents').html('');
	arr_events.forEach(function (item, index) {
		$('#userEvents').append(item.html);
	});

	// save the new order
	saveEvents();
}



function addEvent() {
	readEvents();
	var date = $('.calendar_picker').val();;
	var query = $('.newEvent').val();

	var regex = /(<([^>]+)>)/ig;
	query = query.replace(regex, "");

	if (query != "") {
		var item = '<li><strong>' + query + '</strong><p>' + date + '</p> <i class="icon-delete" title="' + txt_delete + '"></i></li>';

		// save events list
		chrome.storage.sync.get(function (obj) {
			// no events
			if (typeof obj.userEvents === 'undefined') {
				$('#userEvents').append(item);

				chrome.storage.sync.set({
					'userEvents': item
				});
			} else
				$('#userEvents').append(item);

			sortEventsByDate();
			addDeleteFn('events');
		});

		// clear inputs
		$('.newEvent,.calendar_picker').val('').removeClass('clear');
	}
}


function addEventIfOk() {
	var date = $('.calendar_picker').val();
	if (date == '')
		$('.calendar_picker').trigger('click');
	else
		addEvent();
}

$('.newEvent').bind("enterKey", function (e) {
	addEventIfOk();
});

$('.addEvent a').click(function () {
	addEventIfOk();
});

$('.newEvent').keyup(function (e) {
	if (e.keyCode == 13) {
		$(this).trigger("enterKey");
	}
});


// localized months
var tmonths = [];
var tdays = [];
var getMonth = function (idx) {
	var objDate = new Date();
	objDate.setDate(1);
	objDate.setMonth(idx - 1);
	var month = objDate.toLocaleString(navigator.language, { month: "long" });
	return month;
}
for (let i = 1; i < 13; i++) {
	tmonths.push(getMonth(i));
}

// localized days
function getWeekDays(locale) {
	var baseDate = new Date(Date.UTC(2017, 0, 2)); // random monday
	var weekDays = [];
	for (i = 0; i < 7; i++) {
		weekDays.push(baseDate.toLocaleDateString(locale, { weekday: 'long' }));
		baseDate.setDate(baseDate.getDate() + 1);
	}
	return weekDays;
}
var weekDays = getWeekDays(navigator.language);

// start datepicker
try {
	$('.addEvent .calendar_picker').Zebra_DatePicker({
		months: tmonths,
		days: weekDays,
		show_icon: false,
		direction: true,
		onSelect: function (view, elements) {
			$('.addEvent .calendar_picker').addClass('clear');
		},
		onClear: function (view, elements) {
			$('.addEvent .calendar_picker').removeClass('clear');
		}
	});
} catch (e) { }