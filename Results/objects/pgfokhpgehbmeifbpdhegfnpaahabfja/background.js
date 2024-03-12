
article_list = []

async function getFinalResult(url) {
  let lastUrl = await fetch(url);
  let raw_data = await lastUrl.json();
  return raw_data
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function XRequest(url) {
	var xhr = new XMLHttpRequest()
	xhr.open('GET', url, true)
 	return xhr
}

async function getMyIP() {
  let response = await fetch('https://api.ipify.org/?format=json');
  let raw_data = await response.json();
  let nwsrMyIP = await raw_data.ip
  return nwsrMyIP
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if(!request.includes('mediabiasfactcheck.com') && !request.includes('forms.gle')) {
		if(request.includes('NwsrTracker')) {

			var xhr = new XMLHttpRequest()
			xhr.onreadystatechange = function() {
			    if (xhr.readyState === 4){
					var NewTrackerResp = xhr.response
					var NwsrTrackerArray = request.split('__')
					var NwsrTrackerAction = NwsrTrackerArray[1]
					var NwsrTrackerURL = NwsrTrackerArray[2]
					var NwsrTrackerDomain = NwsrTrackerArray[3]
					var NwsrTrackerDatetime = NwsrTrackerArray[4]
					var NewTrackerRespLength = String(NewTrackerResp).length
					var NwsrTrackerIP = String(NewTrackerResp).substring(7, NewTrackerRespLength-2)
					var NwsrTrackerID = NwsrTrackerIP+'_'+NwsrTrackerAction+'_'+NwsrTrackerDomain+'_'+NwsrTrackerURL+'_'+NwsrTrackerDatetime
					// console.log(NwsrTrackerID)
		      		sendResponse('Ok');

		      		var xhr2 = new XMLHttpRequest();
			        xhr2.open("POST", 'https://vbfzhdccxczwbluqmhtv.supabase.co/rest/v1/usagetracker?apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDAzMjI5NCwiZXhwIjoxOTQ5NjA4Mjk0fQ.5AJhHMk5HgNvqiBm9w_vCBezpCt8b3JDi-z3seAnhrc');
			        xhr2.setRequestHeader('Content-Type', "application/x-www-form-urlencoded; charset=UTF-8");
			        xhr2.send('id='+NwsrTrackerID+'&userid='+NwsrTrackerIP+'&action='+NwsrTrackerAction+'&domain='+NwsrTrackerDomain+'&url='+NwsrTrackerURL+'&datetime='+NwsrTrackerDatetime);
			    }
			};
			xhr.open('GET', 'https://api.ipify.org/?format=json', true);
			xhr.send(null);
		}
		else if( !(article_list.includes(request)) ) {

	        var domain = new URL(request).hostname.replace(/www./g,'').replace(/maps./g,'').replace(/support./g,'').replace(/myactivity./g,'').replace(/myaccount./g,'').replace(/accounts./g,'').replace(/policy./g,'').replace(/policies./g,'').replace('l.facebook','facebook').replace('m.theepochtimes','theepochtimes').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn')
	        if (domain == 'facebook.com'){
	         	var article_link = request.split('https://l.facebook.com/l.php?u=')[1].replaceAll('%3A',':').replaceAll('%2F','/').replaceAll('%3F','?').replaceAll('%3D','=').replaceAll('%26','&').replaceAll('%26','&').replace('https://','').replace('http://','')
	        	// console.log(article_link)

				var xhr = new XMLHttpRequest()
				xhr.onreadystatechange = function() {
				    if (xhr.readyState === 4){
						var NewURL = xhr.responseURL
						// console.log(NewURL)
						var original_link_clean = request
			      		sendResponse([original_link_clean, NewURL]);
				    }
				};
				xhr.open('GET', 'https://'+article_link, true);
				xhr.send(null);

	        }
	        else if (domain.includes('news.google')) {
	         	var article_link = request.replace('www.','').replace('https://','').replace('http://','').replace('bbc.com','bbc.co.uk').replace('eu.usatoday','usatoday').replace('edition.cnn','cnn')

				var xhr = new XMLHttpRequest()
				xhr.onreadystatechange = function() {
				    if (xhr.readyState === 4){
						TextResult = xhr.responseText
						TextResultIndex = TextResult.search("a href")+8
						TextResultSubs = TextResult.substring(TextResultIndex)
						TextResultIndexFinal = TextResultSubs.search('"')
						var NewURL = TextResultSubs.substring(0, TextResultIndexFinal)
						// console.log(NewURL)
						var original_link_clean = request.replace('https://news.google.com', '.')
			      		sendResponse([original_link_clean, NewURL]);
				    }
				};
				xhr.open('GET', 'https://'+article_link, true);
				xhr.send(null);
	        }
	        else if (domain == 't.co') {
	         	var article_link = request.replace('https://','').replace('http://','')
	        	// console.log(article_link)

				var xhr = new XMLHttpRequest()
				xhr.onreadystatechange = function() {
				    if (xhr.readyState === 4){
						var TextResult = xhr.responseText
						TextResultIndex = TextResult.search("URL=")+4
						TextResultSubs = TextResult.substring(TextResultIndex)
						TextResultIndexFinal = TextResultSubs.search('"')
						var NewURLV1 = TextResultSubs.substring(0, TextResultIndexFinal)
						var NewURLV1 = NewURLV1.split("?")[0]

					    var xhr2 = new XMLHttpRequest()
						xhr2.onreadystatechange = function() {
						    if (xhr2.readyState === 4){
								var NewURL = xhr2.responseURL
								// console.log(NewURL)
								var original_link_clean = request
					      		sendResponse([original_link_clean, NewURL]);
						    }
						};
						xhr2.open('GET', NewURLV1, true);
						xhr2.send(null);
				    }
				};
				xhr.open('GET', 'https://'+article_link, true);
				xhr.send(null);

	        }
	        else {
	         	var article_link = request.replace('https://','').replace('http://','')
	        	// console.log(article_link)

				var xhr = new XMLHttpRequest()
				xhr.onreadystatechange = function() {
				    if (xhr.readyState === 4){
						var NewURL = xhr.responseURL
						// console.log(NewURL)
						var original_link_clean = request
			      		sendResponse([original_link_clean, NewURL]);
				    }
				};
				xhr.open('GET', 'https://'+article_link, true);
				xhr.send(null);

	        }
	    }

		article_list.push(request);
	    return true;
	  }
	});

