var W2gProviders = ( function(my) {

    "use strict";

    //Load Youtube API and init player
    function W2gPinterest() {
        this.provider_name = "pinterest";
        this.provider_type = "search";
        this.icon_path = "/static/providers/13.png";
        this.description = "Paste a link to a Pinterest pin";
        this.active = false;
        this.defaultSearch = "new";
        this.saveSearch = false;
    }

    //Lookup video info through youtube API
    W2gPinterest.prototype.videoLookUp = function(url, callback) {

        var id,
            clip;

        if (url.match(/^https?:\/\/www.pinterest.[a-z.]{2,6}\/pin\/\S+$/)) {
            $w2g.getJSON((window._w2ghost || "") + "/badger_api/api/pt/lookup?q=" + url).then(function(v) {
                clip = {};
                clip.id = url;
                clip.provider = this.provider_name;
                clip.title = v.title;
                clip.publisher = "";
                clip.publisherID = null;
                clip.desc = "";
                clip.price = "";
                clip.thumb = v.imgurl;
                clip.duration = 0;
                clip.cc = false;
                clip.explicit = false;
                callback([clip], "pinterest");
            }.bind(this)).catch(function(){
                callback([], "pinterest");
            }.bind(this));
            return true;
        } else {
            return false;
        }
    };

    W2gPinterest.prototype.search = function(term, count, page, callback) {
        callback([], "pinterest");
    };

    my.push(W2gPinterest);

    return my;

}(W2gProviders || []));
