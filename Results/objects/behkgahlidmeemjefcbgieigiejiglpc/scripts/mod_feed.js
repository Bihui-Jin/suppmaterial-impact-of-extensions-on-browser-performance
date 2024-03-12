var w_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;


function startMasonry() {
	$('#feed').masonry({
		itemSelector: '.grid-item',
		gutter: 20
	})

	addAffiliateLinks();

	$('.lds-ripple.feed').remove();
}



/* ------------------ XML FEED ------------------ */
_pageStyle = 'default'; // allow be changed by settings.js
var feedTitle = '';
var arr_all_lang_sources = [];
var json_feeds = null;
var modType = 'module';


// get feed list
$.getJSON('/assets/xmlfeeds.json', function (res) {
	json_feeds = res;

	// load languages
	$.each(json_feeds, function (lang_code, el) {
		arr_all_lang_sources.push(lang_code);
	});

	// load feed by language
	chrome.storage.sync.get(function (obj) {
		if (typeof obj.userFeedURL === 'undefined') {
			// default feed
			if (arr_all_lang_sources.includes(userLang))
				getFeedsByLang(userLang);
			else
				getFeedsByLang('en');
		}
		else {
			// user selected feed
			RSS_URL = obj.userFeedURL;
			feedTitle = obj.userFeedTitle;
			_pageStyle = obj.userPageStyle;
			getRSS(RSS_URL);
		}
	});

});


// get default feed by language
function getFeedsByLang(lang_) {

	$.each(json_feeds, function (lang_code, el) {
		if (lang_code == lang_) {
			RSS_URL = el.feeds[0].url;
			feedTitle = el.feeds[0].source;
		}
	});

	// save user feed
	saveUserFeedOptions(lang_, RSS_URL, feedTitle);

	getRSS(RSS_URL);

}

function saveUserFeedOptions(lng_, url_, ttl_) {
	chrome.storage.sync.set({
		'userFeedURL': url_,
		'userFeedLang': lng_,
		'userFeedTitle': ttl_
	});
}


// save feed
function saveFeedAsVar() {
	try {
		var save = $('#center').html();
		save = save.replace(/(\r\n|\t|\n|\r)/gm, "");
		localFeedHTML = save;
		chrome.storage.local.set({
			'localFeedHTML': save
		});
		setLastSaved();
	} catch (e) { }
}


// parser
var fileTypes = '.gif|.jpg|.jpeg|.png';
function getRSS() {
	if (_pageStyle != 'search_only') {

		// get feed online
		if (localFeedHTML === null) {
			try {
				if (feedTitle != '' && feedTitle != 'custom_user_feed')
					$('#center h2 span').html(feedTitle.split(' - ')[1] + '<span class="country">' + feedTitle.split(' - ')[0] + '</span>');

				var source = '';
				var source_link = '';
				var source_logo = '';

				if (RSS_URL.includes('news.google'))
					modType = 'list';

				if (!RSS_URL.includes('https://rss.app/'))
					RSS_URL = 'https://bettertab.app/_src-app/external_xml_feed.php?url=' + RSS_URL;

				$.ajax(RSS_URL, {
					accepts: {
						xml: "application/rss+xml"
					},
					dataType: "xml",
					success: function (data) {
						try {
							source = $("channel > title", data).text();
							source_link = $("channel > link", data).text();
							source_logo = $("channel > image > url", data).text();
							if (source_logo && source_logo.indexOf('http') == 0)
								$('#center h2 em').append('<a href="' + source_link + '" title="' + source + '"><img src="' + source_logo + '" height="20"/></a>');

							if (feedTitle == '' || feedTitle == 'custom_user_feed')
								$('#center h2 span').html($('#modal_settings .section.news h3').text());
						} catch (e) { }


						// small resolutions
						var n_items = 40;
						if (w_width < 1680 && _pageStyle == 'default')
							n_items = 20;

						$(data)
							.find("item").slice(0, n_items)
							.each(function (index) {
								const el = $(this);


								var full_desc = null;
								var clear_desc = null;
								var desc_show_hide = 'hide';
								if (!RSS_URL.includes('news.google'))
									try {
										full_desc = $("description", el).text();
										var d = full_desc.replace(/(<([^>]+)>)/ig, "");
										clear_desc = d.substr(0, 100);
										if (clear_desc && !clear_desc.includes(']]>'))
											desc_show_hide = 'show';
									} catch (e) {
										desc_show_hide = 'hide';
									}
								else {
									modType = 'list';
									desc_show_hide = 'hide';
								}


								var show_hide = 'hide';
								var img_url = '';
								var image = '';
								try {
									if ($("media\\:content", el).length)
										img_url = $("media\\:content", el).attr("url");

									else if (img_url == '' && $("media\\:thumbnail", el).length)
										img_url = $("media\\:thumbnail", el).eq(0).attr("url");

									else if (img_url == '' && $("enclosure", el).length)
										img_url = $("enclosure", el).attr("url");

									else if (img_url == '' && $("mediaurl", el).length)
										img_url = $("mediaurl", el).text();

									else if (img_url == '' && full_desc.includes('<img ')) {
										var descAsHTML = '<span>' + full_desc.replace('<![CDATA[', '').replace(']]>', '') + '</span>';
										var htmlObj = $(descAsHTML);
										img_url = htmlObj.find('img').attr('src');
									}

									else if (img_url == '' && $("image", el).length)
										img_url = $("image", el).text();

									if (!img_url.match(fileTypes) || img_url.indexOf('placeholder') > 0)
										img_url = '';

									if (img_url.startsWith('http'))
										show_hide = 'show';

									var crop_ = '280x158c';
									if (index == 2 || index == 9 || index == 18) crop_ = '280x280c';
									if (index == 0 || index == 7 || index == 10 || index == 14) crop_ = '280x360c';

									if (w_width < 1280)
										crop_ = '280x158c';

									img_url = img_url.replace('https://www.washingtonpost.com/wp-apps/imrs.php?src=', '');
									if (img_url.indexOf('http') == 0)
										image = '<img src="https://bettertab.app/_src-app/resize/index.php?url=' + img_url + '&size=' + crop_ + '" data-src="' + img_url + '" alt="">';
								} catch (e) {
									show_hide = 'hide';
								}


								try {
									var s = $("source", el).text();
									if (s) source = s;
								} catch (e) { }

								try {
									var s = $("dc\\:creator", el).text();
									if (s) source = s;
								} catch (e) { }

								var pubDate = '';
								try {
									var p = $("pubDate", el).text();
									if (p) {
										var today = new Date(p);
										var pd = today.toLocaleDateString(navigator.language);
										if (pd != 'Invalid Date')
											pubDate = pd;
									}
								} catch (e) { }

								var hidemod = '';
								var ttl = $("title", el).text();
								if (ttl.indexOf('�') > 0)
									hidemod = 'hide';

								const template = `<div class="grid-item feed ` + modType + ` ` + hidemod + `">
														<a href="${el.find("link").text()}">
																<span class="pic ` + show_hide + `">
																	<div class="lds-ripple"><div></div><div></div></div>
																	` + image + `
																</span>
															<h4>`+ ttl + `</h4>
														</a>
														<p class="` + desc_show_hide + `">` + clear_desc + `...</p>
														<small>` + pubDate + `<br>` + source.split(' - ')[0].split(' > ')[0] + `</small>
													</div><div class="grid-item feed ` + modType + ` grid_placeholder"/>`;

								$('#feed').append(template);


								$('#feed img').one('error', function () {
									$(this).addClass('error').attr('src', $(this).attr('data-src'));
									$(this).prev('.lds-ripple').remove();
									startMasonry();
								});


								// place ad
								getPubliEditorial();

							});
					}
				}).always(function () {
					startMasonry();
					$('#feed img.error').one('error', function () {
						$(this).parent().remove();
						startMasonry();
					});

					$('#feed img').on('load', function () {
						var width = $(this).prop("naturalWidth");
						if (width <= 160)
							$(this).parents('.grid-item').addClass('small_img');

						$(this).prev('.lds-ripple').remove();
						startMasonry();
					});


					$('#feed').addClass('visible');
					setTimeout(function () { startMasonry(); }, 100);
					setTimeout(function () { startMasonry(); }, 500);
					setTimeout(function () {
						startMasonry();

						// SAVE FEED AS VARIABLE
						saveFeedAsVar();
					}, 1500);
				});
			} catch (e) {
				startMasonry();
			}
		}


		// get feed as variable
		else {
			var stat = localFeedHTML;
			$('#center').html(stat);
			$('#feed,#feed .grid-item').removeAttr('style');
			getPubliEditorial();

			$('.lds-ripple.feed').remove();

			startMasonry();
			$('#feed img').one('error', function () {
				$(this).addClass('error').attr('src', $(this).attr('data-src'));
				$(this).prev('.lds-ripple').remove();
				startMasonry();
			});

			$('#feed img').on('load', function () {
				var width = $(this).prop("naturalWidth");
				if (width <= 160)
					$(this).parent().addClass('small_img');

				$(this).prev('.lds-ripple').remove();
				startMasonry();
			});

			$('#center .modify').click(function () {
				$('#modal_settings,.overlay').addClass('show').fadeIn(300);
			});


			setTimeout(function () {
				if ($('#feed').is(':empty')) {
					localFeedHTML = null;
					getRSS();
				}
			}, 300);
		}
	}
}


adsShowed = false;
function getPubliEditorial() {
	if (!adsShowed && modType == 'module') {
		adsShowed = true;

		// get ads
		try {
			$.ajax({
				type: 'GET',
				url: 'https://bettertab.app/_src-app/_json_banners.js',
				dataType: 'json',
				success: function (res) {
					var position = Math.floor(Math.random() * (4 - 0) + 0);

					var lan = 'en';
					if (res.hasOwnProperty(userLang))
						lan = userLang;

					for (i in res[lan]) {
						var show_ad = res[lan][i].show;
						var country = res[lan][i].country;
						var lnk = res[lan][i].lnk;
						var img = res[lan][i].img;
						var crp = res[lan][i].crp;
						var ttl = res[lan][i].ttl;
						var txt = res[lan][i].txt;
						var adv = res[lan][i].adv;

						if (show_ad && parseInt(i) >= 1)
							position = parseInt(position) + 1 + parseInt(i);


						if (show_ad && country == userCountry || show_ad && country == 'all') {
							var code = `<a href="` + lnk + `">
												<span class="pic">
													<div class="lds-ripple"><div></div><div></div></div>
													<img src="https://bettertab.app/_src-app/resize/index.php?url=` + img + `&size=` + crp + `" data-src="` + img + `" alt="` + ttl + `">
												</span>
											<h4>`+ ttl + `</h4>
										</a>
										<p>` + txt + `</p>
										<small>` + adv + ` - <strong>Ad<strong></small>`;

							$('#feed .grid_placeholder').eq(position).show().html(code);

							$('#feed img').on('load', function () {
								$(this).prev('.lds-ripple').remove();
								startMasonry();
							});
							$('#feed img').one('error', function () {
								$(this).addClass('error').attr('src', $(this).attr('data-src'));
								$(this).prev('.lds-ripple').remove();
								startMasonry();
							});
						}
					}
				}
			});
		}
		catch (e) { }

	}
}

