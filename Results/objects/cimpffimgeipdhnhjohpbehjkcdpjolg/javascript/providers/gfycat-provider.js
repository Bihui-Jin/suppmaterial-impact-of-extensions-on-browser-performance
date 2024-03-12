var W2gProviders = ( function(my) {

		"use strict";

		//Load Youtube API and init player
		function W2gGfycat() {
			this.provider_name = "gfycat";
			this.provider_type = "search";
            this.icon_path = "/static/providers/6.png";
            this.description = "Search OR Paste a link to a Gifycat video";
            this.active = false;
			this.nextToken = null;
			this.timeStamp = 0;
			this.currentKey = "";
		}

		W2gGfycat.prototype.videoLookUp = function(url, callback) {

		    var matches = url.match(/^https:\/\/gfycat.com\/(\w+)/);

			if (matches && matches.length === 2) {
				$w2g.getJSON("https://api.gfycat.com/v1/gfycats/" + matches[1].toLowerCase()).then(function(data) {
				    if(data) {
                        var info = {},
                            v = data.gfyItem;
                        info.id = "https://gfycat.com/" + v.gfyName;
                        info.title = v.title || "Untitled";
                        info.publisher = v.userName;
                        if (v.userName !== "anonymous") {
                            info.publisherID = v.userName;
                        } else {
                            info.publisherID = null;
                        }
                        info.desc = "";
                        info.price = "";
                        info.thumb = v.gif100px;
                        info.cc = false;
                        info.duration = 0;
                        info.explicit = false;
                        callback([info], "gfycat");
                    } else {
                        callback([], "gfycat");
                    }
				}.bind(this));
				return true;
			} else {
			    return false;
            }
		};

		W2gGfycat.prototype.search = function(term, count, page, callback) {

			if (page === 1) {
				this.nextToken = null;
			}

			function parseResponse(data) {
			    if(data) {
                    var results = [],
                        clip;

                    this.nextToken = data.cursor;
                    data.gfycats.forEach(function (v, i) {
                        clip = {};
                        clip.id = "https://gfycat.com/" + v.gfyName;
                        clip.title = v.title || "Untitled";
                        clip.publisher = v.userName;
                        if (v.userName !== "anonymous") {
                            clip.publisherID = v.userName;
                        } else {
                            clip.publisherID = null;
                        }
                        clip.date = new Date(v.createDate * 1000).toDateString();
                        clip.desc = "";
                        clip.price = "";
                        clip.thumb = v.max1mbGif;
                        results.push(clip);
                    });
                    callback(results, "gfycat");
                } else {
                    callback([], "gfycat");
                }
			}

			if (term.indexOf("publisher:") === 0) {
				$w2g.getJSON("https://api.gfycat.com/v1/users/" + term.split(":")[1] + "/gfycats" + "?count=" + count + (this.nextToken ? "&cursor=" + this.nextToken : "")).then(parseResponse.bind(this));
			} else if (term !== "") {
                $w2g.getJSON("https://api.gfycat.com/v1/gfycats/search?search_text=" + term + "&count=" + count + (this.nextToken ? "&cursor=" + this.nextToken : "")).then(parseResponse.bind(this));
			} else {
                $w2g.getJSON("https://api.gfycat.com/v1/gfycats/trending" + "?count=" + count + (this.nextToken ? "&cursor=" + this.nextToken : "")).then(parseResponse.bind(this));
			}

		};

		my.push(W2gGfycat);

		return my;

	}(W2gProviders || []));
