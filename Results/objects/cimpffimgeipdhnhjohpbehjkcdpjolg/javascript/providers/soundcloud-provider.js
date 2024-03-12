var W2gProviders = ( function(my) {

		"use strict";

		//Load Youtube API and init player
		function W2gSoundcloud() {
			this.provider_name = "soundcloud";
			this.provider_type = "search";
            this.icon_path = "/static/providers/4.png";
            this.description = "Paste a link to a single Soundcloud track (no sets).";
            this.active = false;
			this.defaultSearch = "electro";
            this.hostName = "https://" + (window.location.protocol.indexOf("http") === 0 ?  window.location.hostname : "w2g.tv");
        }

		//Lookup video info through youtube API
		W2gSoundcloud.prototype.videoLookUp = function(url, callback) {

		    if(url.match(/^https:\/\/soundcloud.com/)) {
                var matches = url.match(/^https:\/\/soundcloud.com\/([a-z0-9-_]+\/(?!sets)[a-z0-9-_]+)($|\?)/);
                if (matches && matches.length >= 2) {
                    $w2g.getJSON((window._w2ghost || "") + "/badger_api/api/soundcloud/lookup?id=" + matches[1]).then(function (v) {
                        var clip = {};
                        clip.id = v.url;
                        clip.provider = this.provider_name;
                        clip.title = v.title;
                        clip.publisher = "on Soundcloud";
                        clip.publisherID = null;
                        clip.desc = "";
                        clip.price = "";
                        clip.thumb = v.imgurl;
                        clip.duration = 0;
                        clip.cc = false;
                        clip.explicit = false;
                        callback([clip], this.provider_name);
                    }.bind(this));
                } else {
                    callback([], this.provider_name);
                }
                return true;
            } else {
		        return false;
            }
		};

		W2gSoundcloud.prototype.search = function(term, count, page, callback, safe) {
            callback([], "soundcloud");
		};

		my.push(W2gSoundcloud);

		return my;

	}(W2gProviders || []));

