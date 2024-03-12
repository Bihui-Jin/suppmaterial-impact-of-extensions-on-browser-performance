var darkmode = 'auto';
var pagestyle = 'default';
var customBg = 'https://bettertab.app/_src-app/wallpapers/_default_wallpaper00.jpg';
var feed_ttl = '';
var feed_lng = 'en';


// READ SETTINGS
chrome.storage.sync.get(function (obj) {
	if (typeof obj.userDarkMode !== 'undefined')
		darkmode = obj.userDarkMode;

	document.documentElement.setAttribute('data-theme', darkmode);

	if (typeof obj.userPageStyle !== 'undefined')
		pagestyle = obj.userPageStyle;

	document.body.classList.add(pagestyle);

	if (typeof obj.userBackground !== 'undefined')
		customBg = obj.userBackground;

	if (pagestyle == 'search_only')
		document.body.style.backgroundImage = 'url(' + customBg + ')';

	if (typeof obj.userFeedURL !== 'undefined') {
		feed_lng = obj.userFeedLang;
		feed_ttl = obj.userFeedTitle;
		RSS_URL = obj.userFeedURL;
	}
});



function docReady(fn) {
	if (document.readyState === "complete" || document.readyState === "interactive") {
		setTimeout(fn, 1);
	} else {
		document.addEventListener("DOMContentLoaded", fn);
	}
}

docReady(function () {
	// open settings
	$('#btn_settings,#center .modify').click(function () {
		$('#modal_settings,.overlay').addClass('show').fadeIn(300);
	});



	/* ------------------ DARK MODE ------------------ */
	$("input[name=darkmode][value=" + darkmode + "]").prop('checked', true);
	$('.section.darkmode input[type=radio]').change(function () {
		darkmode = this.value;
		document.documentElement.setAttribute('data-theme', darkmode);
	});



	/* ------------------ SIDEBAR ------------------ */
	sidebarStatus(); // from mod_todo.js



	/* ------------------ PAGE STYLES ------------------ */
	function getSearchBg() {
		var val = $('.wallpaper').val();
		if (val != "") {
			customBg = val;
			$('.bgSelector a').removeClass('selected');
		}

		if (val == "" && !customBg.includes('_default_wallpaper')) {
			customBg = 'https://bettertab.app/_src-app/wallpapers/_default_wallpaper00.jpg';
			selectBgFromOptions();
		}

		if (pagestyle == 'search_only')
			document.body.style.backgroundImage = 'url(' + customBg + ')';
	}

	$('.bgSelector a').click(function () {
		$('.wallpaper').val('');
		var bg = $('img', this).attr('src');
		customBg = bg.split("url=")[1].split("&size")[0];
		selectBgFromOptions();
	});

	// search_only search_news no_events no_todo
	$("input[name=pagestyle][value=" + pagestyle + "]").prop('checked', true);
	$('.section.pagestyle input[type=radio]').change(function () {
		pagestyle = this.value;
		$('body').removeClass().addClass(pagestyle);

		_pageStyle = pagestyle;
		if ($('#feed').children('.grid-item').length == 0 && pagestyle != 'search_only')
			getRSS();
		else
			startMasonry();

		if (pagestyle == 'search_only') {
			getSearchBg();
			$('.bgSelector').fadeIn(300);
		}
		else {
			$('.bgSelector').fadeOut(300);
			document.body.style.background = '';
		}
	});

	if (customBg != '' && !customBg.includes('_default_wallpaper'))
		$('.wallpaper').val(customBg);
	$('.wallpaper').on('input', function (e) {
		getSearchBg();
	});

	function selectBgFromOptions() {
		if (customBg.includes('_default_wallpaper')) {
			var id = customBg.split('wallpapers/')[1].split('.')[0];
			$('.bgSelector a').removeClass('selected');
			$('#' + id).addClass('selected');
		}
		else
			$('.bgSelector a').removeClass('selected');

		getSearchBg();
	}
	selectBgFromOptions();




	/* ------------------ FEEDS ------------------ */
	var json_feeds = null;
	var arr_lang_options = [];

	// load json with news sources
	$.getJSON('/assets/xmlfeeds.json', function (res) {
		json_feeds = res;

		// load languages
		$.each(json_feeds, function (lang_code, el) {
			arr_lang_options.push('<option value="' + lang_code + '">' + el.lang + ' (' + lang_code + ')</option>');
		});

		arr_lang_options.sort();
		arr_lang_options.forEach(function (item, index) {
			$('#news_language').append(item);
		});

		// read user feed (saved by module on default)
		chrome.storage.sync.get(function (obj) {
			if (typeof obj.userFeedURL !== 'undefined')
				$('#news_language').val(feed_lng).change();
		});
	});



	// load list of feeds on select change
	$('#news_language').on('change', function () {
		$('#news_source').empty();
		getListFeedsFromLang($('#news_language').val());
	});


	// load feeds
	function getListFeedsFromLang(lang_) {
		$.each(json_feeds, function (lang_code, el) {

			if (lang_code == lang_) {
				for (i in el.feeds) {
					var source = el.feeds[i].source,
						url = el.feeds[i].url;

					$('#news_source').append('<option value="' + url + '">' + source + '</option>');
					$('#news_source option[value="' + RSS_URL + '"]').prop('selected', true);
				}
			}
		});
	}


	/* ------------------ CUSTOM FEED URL ------------------ */
	$('.lnk_custom_feed').click(function () {
		$('#modal_settings .feed_selector,.lnk_custom_feed').hide();
		$('#modal_settings .custom_feed').fadeIn(300);
	});
	$('.lnk_custom_feed_cancel').click(function () {
		$('#modal_settings .custom_feed').hide();
		$('#modal_settings .inputFeed').val('');
		$('#modal_settings .feed_selector,.lnk_custom_feed').fadeIn(300);
	});
	if (feed_ttl == 'custom_user_feed') {
		$('#modal_settings .inputFeed').val(RSS_URL);
		$('#modal_settings .feed_selector,.lnk_custom_feed').hide();
		$('#modal_settings .custom_feed').show();
	}


	/* ------------------ SAVE ------------------ */
	$('#modal_settings .btn_save').click(function () {
		chrome.storage.local.set({
			'userCountry': '',
			'localFeedHTML': null,
			'holidaysHTML': null,
			'weatherStatusHTML': null
		});
		setLastSaved();

		var _lng = $('#news_language').val();
		var _url = $('#news_source').val();
		var _ttl = $('#news_source option:selected').text();

		var customFeed = $('#modal_settings .inputFeed').val();
		if (customFeed.indexOf('http') == 0) {
			_lng = userLang;
			_url = customFeed;
			_ttl = 'custom_user_feed';

			// post custom feed
			try {
				$.post('https://bettertab.app/_src-app/form_user_custom_feed.php', { lang: _lng, country: userCountry, feed: _url });
			} catch (e) { }
		}


		// background
		var val = $('.wallpaper').val();
		if (val != "")
			customBg = val;


		// save settings
		chrome.storage.sync.set({
			'userFeedURL': _url,
			'userFeedLang': _lng,
			'userFeedTitle': _ttl,
			'userDarkMode': darkmode,
			'userPageStyle': pagestyle,
			'userBackground': customBg
		});


		setTimeout(function () {
			document.location.reload(true);
		}, 500);
	});


	// BUY ME A COFFEE
	var btn_buymeacoffee = translations.languages['en'].strings["btn_buymeacoffee"],
		txt_buymeacoffee = translations.languages['en'].strings["txt_buymeacoffee"];
	if (translations.languages[userLang]) {
		btn_buymeacoffee = translations.languages[userLang].strings["btn_buymeacoffee"];
		txt_buymeacoffee = translations.languages[userLang].strings["txt_buymeacoffee"];
	}
	$('#shorcuts .donate a').attr('title', txt_buymeacoffee);
	$('#shorcuts .donate span').html(btn_buymeacoffee);
	$('#footer a').attr('title', txt_buymeacoffee);
	$('.footer.links span').append('<a href="https://www.buymeacoffee.com/fmschuler" title="' + txt_buymeacoffee + '"><img src="https://img.buymeacoffee.com/button-api/?text= ' + btn_buymeacoffee + '   &slug=fmschuler&button_colour=FFDD00&font_colour=000000&font_family=Lato&outline_colour=000000&coffee_colour=ffffff" /></a>');
});


/*
chrome.storage.sync.clear();
chrome.storage.local.clear();
*/