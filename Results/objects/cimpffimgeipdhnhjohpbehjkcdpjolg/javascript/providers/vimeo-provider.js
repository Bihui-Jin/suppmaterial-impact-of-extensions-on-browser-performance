var W2gProviders = ( function(my) {

		"use strict";

		//Load Youtube API and init player
		function W2gVimeo() {
			this.provider_name = "vimeo";
			this.provider_type = "search";
            this.icon_path = "/static/providers/2.png";
            this.description = "Search OR Paste a link to a Vimeo video";
            this.active = false;
			this.defaultSearch = "short film";
			this.saveSearch = false;
		}

		//Lookup video info through youtube API
		W2gVimeo.prototype.videoLookUp = function(url, callback) {

			var clip = {};

			if(url.match(/^https?:\/\/vimeo\.com/)){
                $w2g.getJSON("https://vimeo.com/api/oembed.json?url=" + url).then(function(v) {
                    clip.id = url;
                    clip.provider = this.provider_name;
                    clip.title = v.title || "Vimeo Video";
                    clip.publisher = v.author_name || "Vimeo";
                    clip.publisherID = null;
                    clip.desc = "";
                    clip.price = "";
                    clip.thumb = v.thumbnail_url || this.icon_path;
                    clip.duration = v.duration || 1;
                    clip.cc = false;
                    clip.explicit = false;
                    callback([clip], "vimeo");
                }.bind(this)).catch(function(err){
                    callback([], "vimeo");
                }.bind(this));
                return true;
            } else {
                return false;
            }
		};

		W2gVimeo.prototype.search = function(term, count, page, callback) {

			function parseResponse(data) {
																			
				var results = [],
				    clip;
				data.data.forEach(function(v, i) {
					clip = {};
					clip.id = "//vimeo.com/" + v.uri.split("/")[2];
                    clip.provider = this.provider_name;
					clip.title = v.name;
					clip.publisher = v.user.name;
					clip.publisherID = v.user.uri.split("/")[2];
					clip.date = new Date(v.created_time).toDateString();
					clip.desc = v.description;
					clip.price = "";
					clip.thumb = v.pictures[2].link;
					results.push(clip);
				}.bind(this));
				
				callback(results, "vimeo");
			}

			function getJSON(url){
				return new Promise(function(resolve, reject){
					fetch(url).then(function(d){
						if(d.ok){
							d.json().then(function(data){
								resolve(data);
							});
						}
					});
				});
			}
						
			var safe = this.saveSearch;

			var safesearch = safe === true ? "&filter=content_rating&filter_content_rating=safe" : "";

			if(term.indexOf("publisher:") === 0){
				getJSON("https://api.vimeo.com/users/" + term.split(":")[1] + "/videos?client_id=1857ad39c4dbead68e92c46df04539664debda97&page=" + page + "&fields=uri,name,description,pictures,created_time,user.uri,user.name&sort=modified_time&per_page=" + count).then(parseResponse.bind(this));
			} else if (term !== "") {
				getJSON("https://api.vimeo.com/videos?query=" + term + safesearch + "&client_id=1857ad39c4dbead68e92c46df04539664debda97&page=" + page + "&fields=uri,name,description,pictures,created_time,user.uri,user.name&per_page=" + count).then(parseResponse.bind(this));
			} else {
				getJSON((window._w2ghost || "") + "/staticprov/" + this.provider_name + ".json").then(parseResponse.bind(this));
			}
			
		};
		
		my.push(W2gVimeo);

		return my;

	}(W2gProviders || []));
