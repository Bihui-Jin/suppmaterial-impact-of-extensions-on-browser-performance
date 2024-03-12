var W2gProviders = ( function(my) {

		"use strict";

		//Load Youtube API and init player
		function W2gTwitch() {
			this.provider_name = "twitch";
			this.provider_type = "search";
            this.icon_path = "/static/providers/7.png";
            this.active = false;
			this.defaultSearch = "featured";
			this.description = "Paste a link to a Twitch stream video or clip.";
			this.currentKey = null;

            this.getKey = function() {
                return new Promise(function (resolve, reject) {
                    if(!this.currentKey) {
                        $w2g.getJSON((window._w2ghost || "") + "/static/tokens/twitch.json").then(function(data) {
                            this.currentKey = data.access_token;
                            resolve(this.currentKey);
                        }.bind(this)).catch(function() {
                            reject("no key");
                        });
                    } else {
                        resolve(this.currentKey);
                    }
                }.bind(this));
            }
		}

		//Lookup video info through youtube API
		W2gTwitch.prototype.videoLookUp = function(url, callback) {

			var clip, data, matches;

			if (url.match(/^https?:\/\/([a-z]+\.)?twitch\.tv\/.+/)) {

                    matches = url.match(/^https?:\/\/(?:[a-z]+\.)?twitch\.tv\/.+\/clip\/([a-zA-Z0-9_\-]+)/) || url.match(/^https?:\/\/clips\.twitch\.tv\/([a-zA-Z0-9_\-]+)$/);

                    if (matches && matches.length === 2) {
                        this.getKey().then( function(access_token) {
                           $w2g.getJSON("https://api.twitch.tv/helix/clips?id=" + matches[1], "GET", {'Client-ID': 'jcrgthxmtvgmyk50ftscbxgc4a732cm', 'Authorization': 'Bearer ' + access_token}).then(function (d) {
                               if(d.data.length > 0) {
                                   data = d.data[0];
                                   clip = {};
                                   clip.id = data.url;
                                   clip.provider = this.provider_name;
                                   clip.title = data.title;
                                   clip.publisher = data.broadcaster_name;
                                   clip.publisherID = data.broadcaster_id;
                                   clip.desc = "";
                                   clip.price = "";
                                   clip.thumb = data.thumbnail_url;
                                   clip.duration = 0;
                                   clip.cc = false;
                                   clip.explicit = false;
                                   callback([clip], this.provider_name);
                               } else {
                                   callback([], this.provider_name);
                               }
                            }.bind(this)).catch(function(){
                               callback([], this.provider_name);
                           }.bind(this));
                        }.bind(this));
                        return true;
                    }

                    matches = url.match(/^https?:\/\/(?:[a-z]+\.)?twitch\.tv\/videos\/([0-9]+)/);

                    if (matches && matches.length === 2) {
                        this.getKey().then( function(access_token) {
                            $w2g.getJSON("https://api.twitch.tv/helix/videos?id=" + matches[1], "GET", {'Client-ID': 'jcrgthxmtvgmyk50ftscbxgc4a732cm', 'Authorization': 'Bearer ' + access_token}).then(function (d) {
                                if(d.data.length > 0) {
                                    data = d.data[0];
                                    clip = {};
                                    clip.id = data.url;
                                    clip.provider = this.provider_name;
                                    clip.title = data.title;
                                    clip.publisher = data.user_name;
                                    clip.publisherID = data.user_id;
                                    clip.desc = "";
                                    clip.price = "";
                                    clip.thumb = data.thumbnail_url.replace("%{width}x%{height}", "800x450");
                                    clip.duration = 0;
                                    clip.cc = false;
                                    clip.explicit = false;
                                    callback([clip], this.provider_name);
                                } else {
                                    callback([], this.provider_name);
                                }
                            }.bind(this)).catch(function(){
                                callback([], this.provider_name);
                            }.bind(this));
                        }.bind(this));
                        return true;
                    }

                    matches = url.match(/^https?:\/\/(?:[a-z]+\.)?twitch\.tv\/(\w+)/);

                    if (matches && matches.length === 2) {
                        this.getKey().then( function(access_token) {
                            $w2g.getJSON("https://api.twitch.tv/helix/streams?user_login=" + matches[1], "GET", {'Client-ID': 'jcrgthxmtvgmyk50ftscbxgc4a732cm', 'Authorization': 'Bearer ' + access_token}).then(function (d) {
                                if(d.data.length > 0) {
                                    data = d.data[0];
                                    clip = {};
                                    clip.id = url;
                                    clip.provider = this.provider_name;
                                    clip.title = data.title;
                                    clip.publisher = data.user_name;
                                    clip.publisherID = data.user_id;
                                    clip.desc = "";
                                    clip.price = "";
                                    clip.thumb = data.thumbnail_url.replace("{width}x{height}", "800x450");
                                    clip.duration = 0;
                                    clip.cc = false;
                                    clip.explicit = false;
                                    callback([clip], this.provider_name);
                                } else {
                                    callback([], this.provider_name);
                                }
                            }.bind(this)).catch(function(){
                                callback([], this.provider_name);
                            }.bind(this));
                        }.bind(this));
                        return true;
                    }
                    return false;

			} else {
				return false;
			}

		};

		W2gTwitch.prototype.search = function(term, count, page, callback) {

            var results = [],
                clip;

                if (term.indexOf("publisher:") === 0) {
                    this.getKey().then( function(access_token) {
                        $w2g.getJSON("https://api.twitch.tv/helix/videos?first=50&user_id=" + term.split(":")[1], "GET", {
                            'Client-ID': 'jcrgthxmtvgmyk50ftscbxgc4a732cm',
                            'Authorization': 'Bearer ' + access_token
                        }).then(function (d) {
                            d.data.forEach(function (v, i) {
                                clip = {};
                                clip.id = v.url;
                                clip.provider = this.provider_name;
                                clip.title = v.title;
                                clip.publisher = v.user_name;
                                clip.publisherID = v.user_id;
                                clip.desc = "";
                                clip.price = "";
                                clip.thumb = v.thumbnail_url ? v.thumbnail_url.replace("%{width}x%{height}", "800x450") : this.icon_path;
                                results.push(clip);
                            }.bind(this));
                            callback(results, this.provider_name);
                        }.bind(this));
                    }.bind(this));
                } else {
                    callback(results, this.provider_name);
                }
		};

		my.push(W2gTwitch);

		return my;

	}(W2gProviders || []));
