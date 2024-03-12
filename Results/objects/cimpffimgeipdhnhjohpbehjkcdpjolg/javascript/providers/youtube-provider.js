var W2gProviders = ( function(my) {

		"use strict";

		//Load Youtube API and init player
		function W2gYoutube() {
			this.provider_name = "youtube";
			this.provider_type = "search";
            this.icon_path = "/static/providers/1.png";
            this.description = "Search OR Paste a link to a Youtube video";
            this.active = false;
			this.nextToken = "";
			this.saveSearch = "Save Search";
			this.ytRegions = ["DE", "US", "GB", "FR", "SE", "CA", "IT", "ES", "PL", "AT", "NL"];
		}

		//Lookup video info through youtube API
		W2gYoutube.prototype.videoLookUp = function(url, callback) {

            var listparser = url.match(/\/\/(?:www\.|music\.|m\.)?youtube.com\/\S+list=(\S+)$/);
			var idparser = url.match(/\/\/(?:www\.|music\.|m\.)?(?:youtube\.com|youtu\.be|youtube-nocookie\.com)[\S]*(?:v=|embed\/|v\/|\/)([^"&?=\/\s]{11})/);
			var results = [], shouldWait = 0, waitCount = 0;

			if(listparser){
			    shouldWait++;
                $w2g.getJSON((window._w2ghost || "") + "/w2g_search/playlist?id=" + listparser[1]).then(function(videos) {
                    var clip;
                    videos.forEach(function(v){
                        clip = {};
                        clip.id = v.url;
                        clip.provider = this.provider_name;
                        clip.title = v.title;
                        clip.publisher = v.creator;
                        clip.publisherID = null;
                        clip.desc = "";
                        clip.price = "";
                        clip.thumb = v.thumb;
                        results.push(clip);
                    }.bind(this));
                    check();
                }.bind(this));
            }

			if(idparser){
                shouldWait++;
                $w2g.getJSON((window._w2ghost || "") + "/w2g_search/lookup?url=//www.youtube.com/watch?v=" + idparser[1]).then(function(data){
                    var info = {};
                    info.id = data.url;
                    info.provider = this.provider_name;
                    info.title = data.title;
                    info.publisher = data.creator || "";
                    info.publisherID = null;
                    info.desc = "";
                    info.price = "";
                    info.thumb = data.thumb;
                    results.unshift(info);
                    check();
                }.bind(this)).catch(function(){
                    var info = {};
                    info.id = "//www.youtube.com/watch?v=" + idparser[1];
                    info.provider = this.provider_name;
                    info.title = url;
                    info.publisher = "";
                    info.publisherID = null;
                    info.desc = "";
                    info.price = "";
                    info.thumb = "https://i.ytimg.com/vi/" + idparser[1] + "/mqdefault.jpg";
                    results.unshift(info);
                    check();
                }.bind(this));
            }

            function check(){
                waitCount++;
                if(waitCount >= shouldWait){
                    callback(results, "youtube");
                }
            }

			return (listparser !== null || idparser !== null);
		};

		W2gYoutube.prototype.search = function(term, count, page, callback) {

            if (term.indexOf("publisher:") === 0) {
                $w2g.getJSON((window._w2ghost || "") + "/w2g_search/channel?id=" + term.split(":")[1]).then(function(videos) {
                    var results = [], clip, channelID;
                    videos.forEach(function(v){
                        //channelID = v.creatorurl ? v.creatorurl.match(/\/channel\/(\S+)$/) : null;
                        //channelID = channelID && channelID.length === 2 ? channelID[1] : "";
                        clip = {};
                        clip.id = v.url;
                        clip.provider = this.provider_name;
                        clip.title = v.title;
                        clip.publisher = v.creator || "";
                        clip.publisherID = nullS;
                        clip.desc = "";
                        clip.price = "";
                        clip.thumb = v.thumb;
                        results.push(clip);
                    }.bind(this));
                    callback(results, "youtube");
                }.bind(this));
            } else if (term !== "") {
                $w2g.getJSON((window._w2ghost || "") + "/w2g_search/search?q=" + term).then(function(videos) {
                    var results = [], clip, channelID;
                    videos.forEach(function(v){
                        //channelID = v.creatorurl ? v.creatorurl.match(/\/channel\/(\S+)$/) : null;
                        //channelID = channelID && channelID.length === 2 ? channelID[1] : "";
                        clip = {};
                        clip.id = v.url;
                        clip.provider = this.provider_name;
                        clip.title = v.title;
                        clip.publisher = v.creator || "";
                        clip.publisherID = null;
                        clip.desc = "";
                        clip.price = "";
                        clip.thumb = v.thumb;
                        results.push(clip);
                    }.bind(this));
                    callback(results, "youtube");
                }.bind(this)).catch(function(){
                    callback([], "youtube");
                });
            } else {
                var region = this.ytRegions.indexOf(w2g.userInfo.country) !== -1 ? w2g.userInfo.country : "US";
                fetch((window._w2ghost || "") + "/staticprov/youtube-" + region + ".json").then(function(data){
                    data.json().then(function(obj){
                        var itms = obj.items.slice(0, 15), results = [], clip;
                        itms.forEach(function(v, i) {
                            clip = {};
                            clip.id = "//www.youtube.com/watch?v=" + ( typeof v.id === "object" ? v.id.videoId : v.id);
                            clip.provider = this.provider_name;
                            clip.title = v.snippet.title;
                            clip.publisher = v.snippet.channelTitle;
                            clip.publisherID = null;
                            clip.date = new Date(v.snippet.publishedAt).toDateString();
                            clip.desc = v.snippet.description;
                            clip.price = "";
                            clip.thumb = v.snippet.thumbnails.medium.url;
                            results.push(clip);
                        }.bind(this));
                        callback(results, "youtube");
                    }.bind(this));
                }.bind(this));
            }
		};

		my.push(W2gYoutube);

		return my;

	}(W2gProviders || []));
