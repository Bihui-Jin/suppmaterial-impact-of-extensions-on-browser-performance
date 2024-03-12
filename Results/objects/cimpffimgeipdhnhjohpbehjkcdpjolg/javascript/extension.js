(function() {

		"use strict";

		var w2gLogin,
		    w2gRooms,
		    w2gShare,
    		w2gApps;

		window._w2ghost = "https://w2g.tv";
		window.w2g = {};

		$w2g.domReady().then(function() {

			if(window.location.href.indexOf("?popout=true") !== -1){
				document.querySelector("body").classList.add("w2g-popout");
			}

            document.querySelector("#search-bar-input").focus();

			w2gShare = new W2gShare(".w2g-share");
			w2gRooms = new W2gRooms(".w2g-rooms");
			w2gLogin = new W2gLogin(".w2g-login");
			w2gApps = new W2gApps(".w2g-apps");

			browser.tabs.query({
				active : true,
				currentWindow : true
			}).then(function(tabs) {
				if (tabs[0] && tabs[0].url && tabs[0].url.indexOf("http") === 0 && tabs[0].url.indexOf(window._w2ghost) !== 0) {
					w2gShare.load(tabs[0].url);
				}
			});

			w2gLogin._addHandler("auth", function(prop, val) {
				if (val === true) {
					$w2g.show(".auth-required");
					w2gRooms.fetchRooms();
				} else {
                    $w2g.hide(".auth-required");
				}
				w2gShare.auth = val;
				w2gApps.auth = val;
			});
						
			w2gShare._addHandler("found", function(prop, val) {
				if (val === true) {
					w2gRooms.shareID = w2gShare.id;
					w2gRooms.shareTitle = w2gShare.title;
					w2gRooms.shareThumb = w2gShare.thumb;
				} else {
					w2gRooms.shareID = "";
					w2gRooms.shareTitle = "";
					w2gRooms.shareThumb = "";
				}
			});

			document.querySelector("#content").addEventListener("click", function(){
                w2gApps.showApps = false;
            });

			w2gApps._addHandler("showApps", function(prop, val){
				if(val){
					document.body.classList.add("apps-active");
				} else {
                    document.body.classList.remove("apps-active");
                    document.querySelector("#search-bar-input").focus();
				}
			});

            w2gApps._addHandler("play", function (ctx, args) {
            	w2gShare.share({"id" : args[1].id, "title" : args[1].title, "thumb" : args[1].thumb});
            });

            w2gApps._addHandler("share", function (ctx, args) {
                w2gShare.found = false;
                w2gShare.id = args[1].id;
                w2gShare.title = args[1].title;
                w2gShare.thumb = args[1].thumb;
                w2gShare.found = true;
            });

            w2gApps._addHandler("showResults", function(){
            	if(w2gApps.showResults){
					document.body.classList.add("search-active");
				} else {
					document.body.classList.remove("search-active");
				}
			});

			w2gApps._addHandler("click", function(ctx, args){
				setTimeout(function(){
					document.querySelector("#search-bar-input").focus();
				}, 100);
			});

            w2gLogin.check();

			//Web Request Overwrite
			var wrCallback = function(details) {
				if(window.location.href.indexOf(details.initiator || details.originUrl) === 0) {
					details.requestHeaders.push({
						name: 'Referer',
						value: 'https://w2g.tv'
					});
				}
				return {
					requestHeaders : details.requestHeaders
				};
			};
			var wrFilter = {
				urls : ["<all_urls>"]
			};

			if(navigator.userAgent.indexOf("Firefox") !== -1){
                var wrOpts = ['blocking', 'requestHeaders'];
			} else {
                var wrOpts = ['blocking', 'requestHeaders', 'extraHeaders'];
			}

			browser.webRequest.onBeforeSendHeaders.addListener(wrCallback, wrFilter, wrOpts);

		});

	}());

