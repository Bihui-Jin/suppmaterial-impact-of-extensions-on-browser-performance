var W2gProviders = ( function(my) {

    "use strict";

    //Load Youtube API and init player
    function W2gMedal() {
        this.provider_name = "medal.tv";
        this.provider_type = "search";
        this.icon_path = "/static/providers/26.png";
        this.description = "Search OR paste a link to a Medal.tv clip or user";
        this.active = false;
        this.defaultSearch = "funny";
        this.saveSearch = false;
    }

    //Lookup video info through youtube API
    W2gMedal.prototype.videoLookUp = function(url, callback) {

        var clip,
            matches = url.match(/^https:\/\/medal.tv\/\S*clips\/(\S+)/),
            users = url.match(/^https:\/\/medal.tv\/users\/([0-9]+)/),
            results = [];

        if (matches && matches.length === 2) {
            $w2g.getJSON("https://medal.tv/api/oembed?url=" + url).then(function(v) {
                clip = {};
                clip.id = v.url;
                clip.provider = this.provider_name;
                clip.title = v.title;
                clip.publisher = "Medal.tv";
                clip.publisherID = null;
                clip.desc = "";
                clip.price = "";
                clip.thumb = v.thumbnail_url;
                clip.duration = 0;
                clip.cc = false;
                clip.explicit = false;
                callback([clip], this.provider_name);
            }.bind(this));
            return true;
        } else if(users && users.length === 2) {
            $w2g.getJSON("https://developers.medal.tv/v1/latest?userId=" + users[1] + "&limit=30", "GET", {
                Authorization: "pub_2szj58gF7UiTP3XEyWUFouamquJhBkOK"
            }).then(function (data) {
                data.contentObjects.forEach(function(v){
                    clip = {};
                    clip.id = "https://medal.tv/clips/" +  v.contentId.split("cid")[1];
                    clip.provider = this.provider_name;
                    clip.title = v.contentTitle;
                    clip.publisher = "Medal.tv";
                    clip.publisherID = null;
                    clip.date = "";
                    clip.desc = "";
                    clip.price = "";
                    clip.thumb = v.contentThumbnail;
                    results.push(clip);
                }.bind(this));
                callback(results, this.provider_name);
            }.bind(this)).catch(function() {
                callback([], this.provider_name);
            }.bind(this));
            return true;
        } else {
            return false;
        }
    };

    W2gMedal.prototype.search = function(term, count, page, callback) {

        $w2g.getJSON("https://developers.medal.tv/v1/search?text=" + (term || this.defaultSearch) + "&limit=30", "GET", {
            Authorization: "pub_2szj58gF7UiTP3XEyWUFouamquJhBkOK"
        }).then( function (data) {
            var results = [], clip;
            data.contentObjects.forEach(function(v){
                clip = {};
                clip.id = "https://medal.tv/clips/" +  v.contentId.split("cid")[1];
                clip.provider = this.provider_name;
                clip.title = v.contentTitle;
                clip.publisher = "Medal.tv";
                clip.publisherID = null;
                clip.date = "";
                clip.desc = "";
                clip.price = "";
                clip.thumb = v.contentThumbnail;
                results.push(clip);
            }.bind(this));
            callback(results, this.provider_name);
        }.bind(this)).catch(function() {
            callback([], this.provider_name);
        }.bind(this));
    };

    my.push(W2gMedal);

    return my;

}(W2gProviders || []));
