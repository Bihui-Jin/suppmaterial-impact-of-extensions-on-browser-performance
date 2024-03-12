var W2gProviders = ( function (my) {

    "use strict";

    //Load Facebook API and init player
    function W2gVlive() {
        this.provider_name = "vlive";
        this.provider_type = "search";
        this.icon_path = "/static/providers/27.png";
        this.active = false;
        this.description = "Paste a link to a V LIVE video.";
    }

    var matcher = [
        { pattern: /^https:\/\/(?:www|m)\.vlive\.tv\/video\/([0-9]+)/, frame: "https://vlive.tv/embed/#{1}?autoPlay=true" }
    ];

    W2gVlive.prototype.videoLookUp = function (url, callback) {
        var matched = false;
        for(var i=0; i < matcher.length; i++){
            if(url.match(matcher[i].pattern)){
                matched = true;
                $w2g.getJSON((window._w2ghost || "") + "/badger_api/api/vlive/lookup?id=" + url).then(function(vid) {
                    if(vid.title) {
                        var info = {};
                        info.id = vid.url;
                        info.provider = this.provider_name;
                        info.title = vid.title;
                        info.publisher = vid.user;
                        info.publisherID = null;
                        info.desc = "";
                        info.price = "";
                        info.thumb = vid.imgurl;
                        info.cc = false;
                        info.duration = 0;
                        info.explicit = false;
                        callback([info], this.provider_name);
                    } else {
                        callback([], this.provider_name);
                    }
                }.bind(this)).catch(function(){
                    callback([], this.provider_name);
                }.bind(this));
                break;
            }
        }
        return matched;
    };

    //Search for video through facebook API
    W2gVlive.prototype.search = function (term, count, page, callback) {
        callback([], this.provider_name);
    };

    my.push(W2gVlive);

    return my;

}(W2gProviders || []));
