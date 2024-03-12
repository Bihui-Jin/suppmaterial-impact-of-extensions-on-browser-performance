var W2gProviders = ( function(my) {

    "use strict";

    function W2gShorts() {
        this.provider_name = "w2gshorts";
        this.provider_type = "browse";
        this.icon_path = "/static/providers/19.png";
        this.description = "Select one of the videos bellow.";
        this.active = false;
        this._videoDB = null;
    }

    W2gShorts.prototype.videoLookUp = function(url, callback) {
        var matches = url.match(/^https:\/\/w2gshorts.com\/view\.html\?id=([0-9a-z]+)$/), results = [];
        if (matches && matches.length === 2) {
            this._videoDB = this._videoDB || $w2g.getJSON("https://w2gshorts.com/content.json");
            this._videoDB.then(function(videos) {
                var video = videos.find(function(v) {
                    return v.id === matches[1];
                }), clip;
                clip = {};
                clip.id = url;
                clip.provider = this.provider_name;
                clip.title = video.title;
                clip.publisher = video.attribution;
                clip.publisherID = null;
                clip.desc = video.desc;
                clip.price = "";
                clip.thumb = video.thumb;
                results.push(clip);
                callback(results, "W2gShorts");
            }.bind(this));
            return true;
        } else {
            return false;
        }
    };

    W2gShorts.prototype.search = function(term, count, page, callback, safe) {
        this._videoDB = this._videoDB || $w2g.getJSON("https://w2gshorts.com/content.json");
        var results = [], clip;
        this._videoDB.then(function(videos){
            videos.forEach(function(video){
                clip = {};
                clip.id = "https://w2gshorts.com/view.html?id=" + video.id;
                clip.provider = this.provider_name;
                clip.title = video.title;
                clip.publisher = video.attribution;
                clip.publisherID = null;
                clip.desc = video.desc;
                clip.price = "";
                clip.thumb = video.thumb;
                results.push(clip);
            }.bind(this));
            callback(results, "W2gShorts");
        }.bind(this));
    };

    my.push(W2gShorts);

    return my;

}(W2gProviders || []));

