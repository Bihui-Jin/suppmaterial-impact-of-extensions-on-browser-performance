var W2gProviders = ( function(my) {

		"use strict";

		//Load Facebook API and init player
		function W2gFacebook() {
			this.provider_name = "facebook";
			this.provider_type = "search";
            this.icon_path = "/static/providers/8.png";
            this.active = false;
			this.description = "Paste a direkt link to a public video on Facebook. (https://fb.watch/[videoID] or https://www.facebook.com/[user]/videos/[videoID])";
		}

		W2gFacebook.prototype.videoLookUp = function(url, callback) {
			if (url.match(/^(http|https):\/\/\S+\.facebook.com\/\S+\/videos\/\S+$/) || url.match(/^(http|https):\/\/\S+\.facebook.com\/watch\S+$/) || url.match(/^((http|https):)?\/\/fb\.watch\/.+/)) {
                var info = {};
                info.id = url;
                info.provider = this.provider_name;
                info.title = "Facebook Video";
                info.publisher = "--";
                info.publisherID = null;
                info.desc = "";
                info.price = "";
                info.thumb = this.icon_path;
                info.cc = false;
                info.duration = 0;
                info.explicit = false;
                callback([info], "facebook");
				return true;
			} else {
			    return false;
            }
		};

		//Search for video through facebook API
		W2gFacebook.prototype.search = function(term, count, page, callback) {
			callback([], "facebook");
		};

		my.push(W2gFacebook);

		return my;

	}(W2gProviders || []));
