var W2gProviders = ( function (my) {

    "use strict";

    //Load Facebook API and init player
    function W2gOEmbed() {
        this.provider_name = "TikTok";
        this.provider_type = "search";
        this.icon_path = "/static/providers/22.png";
        this.active = false;
        this.description = "Paste a link to a TikTok video.";
    }

    var matcher = [
        { pattern: /^https:\/\/www\.tiktok\.com/, url: "https://www.tiktok.com/oembed?url=#{url}" }
    ];

    W2gOEmbed.prototype.videoLookUp = function (url, callback) {

        var matched = false;

        for(var i=0; i < matcher.length; i++){
            if(url.match(matcher[i].pattern)){
                matched = true;
                $w2g.getJSON(matcher[i].url.replace("#{url}", url)).then(function(vid){
                    if(vid.html) {
                        var info = {};
                        info.id = url;
                        info.provider = this.provider_name;
                        info.title = vid.title || "<untitled>";
                        info.publisher = vid.author_name;
                        info.publisherID = null;
                        info.desc = "";
                        info.price = "";
                        info.thumb = vid.thumbnail_url;
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
    W2gOEmbed.prototype.search = function (term, count, page, callback) {
        callback([], this.provider_name);
    };

    my.push(W2gOEmbed);

    return my;

}(W2gProviders || []));
