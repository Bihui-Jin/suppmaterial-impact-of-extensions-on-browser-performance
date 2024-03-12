/* fade in */
try {
	$("#root").animate({ opacity: 1 }, 300);
}
catch (e) { }
setTimeout(function () {
	try {
		document.getElementById("root").style.opacity = 1;
	}
	catch (e) { }
}, 350);


// set date and time
var setTime = (function theTime() {
	var time = new Date().toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit'
	});
	var date = new Date().toLocaleDateString();

	if (lang == 'en-US')
		time = new Date().toLocaleTimeString('en-US', {
			hour12: true,
			hour: '2-digit',
			minute: '2-digit'
		});

	$('.clock span').html(date);

	$('.clock strong b').html(time.split(' ')[0]);
	if (time.includes('AM')) {
		$('.clock .AM').fadeIn();
		$('.clock .PM').fadeOut();
	}
	if (time.includes('PM')) {
		$('.clock .AM').fadeOut();
		$('.clock .PM').fadeIn();
	}

	if (time.includes('00:00') || time.includes('12:00') && time.includes('AM'))
		holidaysHTML = null;

	$('#clock').css('visibility', 'visible');
	return theTime;
}());
setInterval(function () {
	setTime();
}, 1000);


// affiliates
function addAffiliateLinks() {
	// amazon
	var lnk_amazon = 'https://www.amazon.com';
	if (userCountry == "BR")
		lnk_amazon = 'https://amzn.to/3wByhwL';
	else if (userCountry == "GB")
		lnk_amazon = 'https://sovrn.co/127inhe';
	else if (userCountry == "MX")
		lnk_amazon = 'https://sovrn.co/yqinttq';
	else if (userCountry == "US")
		lnk_amazon = 'https://sovrn.co/g7hzzfa';

	if (lnk_amazon != '')
		$('a[href*="amazon.co"]').show().attr('href', lnk_amazon);

	// aliexpress
	if (isRussiaCIS || userLang == 'ru')
		$('a[href*="aliexpress.com"]:not(".grid_placeholder a")').attr('href', urlRussiaCIS);
	if (!isRussiaCIS && userLang != 'ru')
		$('a[href*="aliexpress.com"]:not(".grid_placeholder a")').attr('href', 'https://s.click.aliexpress.com/e/_AOgNL3');
}



/* USER COUNTRY */
var isRussiaCIS = false;
var CIS = 'RU|GE|AZ|AM|BY|KZ|KG|MD|TJ|TM|UZ';
var langsCIS = 'ru|ka|az|hy|be|kk|ky|tg|tk|uz';
if (lang.match(langsCIS))
	isRussiaCIS = true;
async function getUserCountry() {
	try {
		await fetch('https://ipinfo.io/country').then(function (response) {
			return response.text().then(function (text) {
				userCountry = text.replace(/[^a-zA-Z]+/g, '');
				var _CIS = false;
				if (userCountry.match(CIS))
					_CIS = true;

				chrome.storage.local.set({
					'userCountry': userCountry,
					'isRussiaCIS': _CIS
				});
			});
		});
	} catch (e) { }
}



chrome.storage.local.get(function (obj) {
	if (typeof obj.userCountry === 'undefined')
		getUserCountry();
	else if (obj.userCountry == '')
		getUserCountry();

	// match countries and set isRussiaCIS true
	else if (obj.userCountry.match(CIS)) {
		userCountry = obj.userCountry;
		isRussiaCIS = true;
	}

	else {
		userCountry = obj.userCountry;
		$('#search .links').addClass(obj.userCountry);

		addAffiliateLinks();
	}
});



// FORECAST
function getLocation() {
	if (navigator.geolocation)
		navigator.geolocation.getCurrentPosition(getForecast);
}
getLocation();

function getForecast(position) {

	// no saved condition
	if (weatherStatusHTML === null) {
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;

		var unit_symbol = 'ºC';
		if (lang == 'en-US')
			unit_symbol = 'ºF';

		$.ajax({
			type: 'GET',
			url: 'https://api.weatherapi.com/v1/forecast.json?key=ba0b4c8367cb4f2ca5442502221503&q=' + lat + ',' + lon + '&days=3&hour=12&aqi=no&alerts=no&lang=' + userLang,
			dataType: 'json',
			success: function (r) {
				var city = r.location.name;
				var temp = r.current.temp_c;
				if (lang == 'en-US')
					temp = r.current.temp_f;
				var desc = r.current.condition.text;
				var icon = r.current.condition.icon;
				if (icon.indexOf('//') == 0)
					icon = 'http:' + icon;
				if (icon.includes('64x64'))
					icon = '/icons/forecast/' + icon.split('64x64/')[1];

				$('#weather a').attr('href', 'https://www.google.com/search?client=bettertab.app&q=weather&hl=' + lang).attr('title', city + ' - ' + desc);

				$('#weather img').attr('src', icon).attr('title', city + ' - ' + desc);
				$('#weather .temp').html(temp.toString().split('.')[0] + ' ' + unit_symbol);
				$('#weather .desc').html(desc.charAt(0).toUpperCase() + desc.slice(1));

				// forecast
				$.each(r.forecast, function (data, el) {
					if (data === "forecastday") {
						for (var i in el) {
							var date_epoch = el[i].date_epoch;
							var the_date = new Date(date_epoch * 1000);
							var day = the_date.toLocaleDateString(navigator.language, { timeZone: 'UTC', weekday: 'short' });

							var max = el[i].day.maxtemp_c;
							var min = el[i].day.mintemp_c;
							if (lang == 'en-US') {
								max = el[i].day.maxtemp_f;
								min = el[i].day.mintemp_f;
							}

							var condition = el[i].day.condition.text;
							var img = el[i].day.condition.icon;
							if (img.indexOf('//') == 0)
								img = 'http:' + img;
							if (img.includes('64x64'))
								img = '/icons/forecast/' + img.split('64x64/')[1];

							$('.forecast_days').append('<div class="day"><img src="' + img + '" alt="' + condition + '" title="' + condition + '"><em class="weekday">' + day + '</em><br><em class="max">' + max.toString().split('.')[0] + 'º</em> <em class="min">' + min.toString().split('.')[0] + 'º</em></div>');
						}
					}
				});

				// save status on local storage and base.js
				var save = $('#weather').html();
				weatherStatusHTML = save.replace(/(\r\n|\t|\n|\r)/gm, "");
				chrome.storage.local.set({
					'weatherStatusHTML': weatherStatusHTML
				});
				setLastSaved();
			},
			error: function () {
				$('#weather').hide();
			},
			complete: function () {
				$('#weather .lds-ripple').remove();
			}

		});
	}

	// has saved condition
	else {
		var stat = weatherStatusHTML;
		$('#weather').html(stat);
		$('#weather .lds-ripple').remove();
	}

	$('#weather img').one('load', function () {
		$(this).css('visibility', 'visible');
	});
}



// SEARCH/URL
function isValidURL(string) {
	var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	return (res !== null)
};
$('#search input').bind("enterKey", function (e) {
	var query = $(this).val();

	if (isValidURL(query)) {
		if (query.indexOf('http') == 0)
			window.location.href = query;
		else
			window.location.href = 'http://' + query;
	} else
		window.location.href = 'https://www.google.com/search?q=' + query;
});



/* DELETE LISTS */
function addDeleteFn(type) {
	el = $('#userEvents li i');
	if (type == 'tasks')
		el = $('#tasks li i');

	el.each(function () {
		$(this).click(function () {
			var i = $(this).closest("li");
			i.animate({
				opacity: 0,
				height: 0
			}, 300, function () {
				i.remove();
				saveTasks();
				try { saveEvents(); }
				catch (e) { }
			})
		});
	});
}



/* ------------------ SPEED DIAL ------------------ */
var index;

$('.btn_add').val(txt_add);

// read speedDial
function readSpeedDial() {
	chrome.storage.sync.get(function (obj) {
		if (typeof obj.speedDial !== 'undefined')
			$('#speedDial #shorcuts').html(obj.speedDial);
		else {
			var default_list = `<li class="added donate"><i class="icon-delete"></i><a href="https://www.buymeacoffee.com/fmschuler" title="Donate"><img src="https://www.google.com/s2/favicons?domain=https://buymeacoffee.com/&sz=32"> <span>Donate</span></a></li>
								<li class="added"><i class="icon-delete"></i><a href="https://s.click.aliexpress.com/e/_AOgNL3" title="AliExpress"><img src="https://www.google.com/s2/favicons?domain=http://best.aliexpress.com&sz=32"> <span>AliExpress</span></a></li>
								<li class="added"><i class="icon-delete"></i><a href="https://amazon.com" title="Amazon"><img src="https://www.google.com/s2/favicons?domain=http://amazon.com&sz=32"> <span>Amazon</span></a></li>
								<li class="added"><i class="icon-delete"></i><a href="https://sovrn.co/2l3a65k" title="Prime Video"><img src="https://www.google.com/s2/favicons?domain=https://primevideo.com/&sz=32"> <span>Prime Video</span></a></li>
								<li class="added"><i class="icon-delete"></i><a href="https://partner.pcloud.com/r/51136" title="pCloud"><img src="https://www.google.com/s2/favicons?domain=https://pcloud.com/&sz=32"> <span>pCloud</span></a></li>
								<li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>`;
			$('#speedDial #shorcuts').html(default_list);
		}

		speedDialFunction();
	});

	try {
		$('#speedDial #shorcuts').sortable({
			handle: '.added',
			onDrop: function ($item, container, _super, event) {
				$item.removeClass(container.group.options.draggedClass).removeAttr('style');
				$('body').removeClass(container.group.options.bodyClass);
				saveSpeedDial();
			}
		});
	}
	catch (e) { }
}
readSpeedDial();

function speedDialFunction() {
	// add speedDial item
	$('#speedDial li:empty').each(function () {
		// postion ballon
		$(this).on('mouseenter', function () {
			if (!$('.add_speeddial_item').is('.slideUp')) {
				var position = $(this).position();
				$('.add_speeddial_item').css('top', position.top).css('left', position.left + 37);
			}
		});


		// open balloon
		$(this).click(function () {
			index = $('#speedDial li').index(this);
			var position = $(this).position();
			$('.add_speeddial_item').css('top', position.top).css('left', position.left + 37).delay(100).addClass('slideUp');
			setTimeout(function () {
				$('#new_speed_item_url').focus();
			}, 300);
		});

	});

	// add item
	$('.add_speeddial_item .btn_add').click(function () {
		addSpeedDialItem();
	});


	// delete item
	$('#speedDial li .icon-delete').click(function () {
		$(this).closest('li').html('').removeClass();
		saveSpeedDial();
		setTimeout(function () {
			speedDialFunction();
		}, 300);
	});


	addAffiliateLinks();
};

// add item
function addSpeedDialItem() {
	try {
		var url = $('#new_speed_item_url').val();
		var ttl = $('#new_speed_item_ttl').val();

		if (url != '' && ttl != '') {
			if (url.indexOf('http') == -1)
				url = "http://" + url;

			$('#speedDial li').eq(index).addClass('added').html('<i class="icon-delete" title="' + txt_delete + '"></i><a href="' + url + '" title="' + ttl + '"><img src="https://www.google.com/s2/favicons?domain=' + url + '&sz=32"/> <span>' + ttl + '</span></a>');

			saveSpeedDial();

			setTimeout(function () {
				clearSpeedDial();
			}, 300);
		}
	}
	catch (e) { }
}

// clear speedDial form
$('#speedDial a.close, #search input, #btn_settings').click(function (e) {
	clearSpeedDial();
});
function clearSpeedDial() {
	$('.add_speeddial_item input[type=text]').val('');
	$('.add_speeddial_item').removeClass('slideUp');
}

// save speedDial items
function saveSpeedDial() {
	var items = $('#speedDial #shorcuts').html();
	chrome.storage.sync.set({
		'speedDial': items
	});

	setTimeout(function () {
		readSpeedDial();
	}, 100);
}


// speedDial deal with enter
$('#new_speed_item_url, #new_speed_item_ttl').bind("enterKey", function (e) {
	var query = $(this).val();

	if ($(this).attr("id") == 'new_speed_item_url') {
		if (isValidURL(query)) {
			if (!query.indexOf('http') == 0)
				query = 'http://' + query;

			$('#new_speed_item_ttl').focus();
		}
	}

	if ($(this).attr("id") == 'new_speed_item_ttl') {
		if ($('#new_speed_item_url').val() != '' && $('#new_speed_item_ttl').val() != '')
			addSpeedDialItem();
	}
});

$('#new_speed_item_url').on('input', function () {
	var query = $(this).val();

	if (isValidURL(query))
		$(this).removeAttr('style');
	else
		$(this).css('border', '1px solid red').css('background', 'rgba(235, 77, 75,.6)');
});



// enter in forms
$('#search input, #new_speed_item_url, #new_speed_item_ttl').keyup(function (e) {
	if (e.keyCode == 13) {
		$(this).trigger("enterKey");
	}
});