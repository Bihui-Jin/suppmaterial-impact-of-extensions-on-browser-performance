var W2gProviders = ( function(my) {

    "use strict";

    //Load Youtube API and init player
    function W2gInstagram() {
        this.provider_name = "instagram";
        this.provider_type = "search";
        this.icon_path = "/static/providers/12.png";
        this.description = "Paste a link to an Instagram post or IGTV video";
        this.active = false;
        this.defaultSearch = "new";
        this.saveSearch = false;
    }

    //Lookup video info through youtube API
    W2gInstagram.prototype.videoLookUp = function(url, callback) {

        var clip;

        if (url.match(/^https?:\/\/www.instagram.com\/(p|tv)\/\S+$/)) {
            clip = {};
            clip.id = url;
            clip.provider = this.provider_name;
            clip.title = "Instagram Post";
            clip.publisher = "--";
            clip.publisherID = null;
            clip.desc = "";
            clip.price = "";
            clip.thumb = this.icon_path;
            clip.duration = 0;
            clip.cc = false;
            clip.explicit = false;
            callback([clip], "instagram");
            return true;
        } else {
            return false;
        }
    };

    W2gInstagram.prototype.search = function(term, count, page, callback) {
        callback([], "instagram");
    };

    my.push(W2gInstagram);

    return my;

}(W2gProviders || []));
