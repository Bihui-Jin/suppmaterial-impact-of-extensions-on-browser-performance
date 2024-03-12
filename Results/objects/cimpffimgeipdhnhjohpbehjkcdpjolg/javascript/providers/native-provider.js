var W2gProviders = ( function (my) {

    "use strict";

    function W2gSync() {
        this.provider_name = "Direct Link";
        this.provider_type = "search";
        this.icon_path = "/static/providers/28.png";
        this.active = false;
        this.description = "Paste a direct https link to a video or audio file. (.mp4|.mp3|.aac|.wav|.webm|.ogv|.mpd|.m3u8|gifv)";
    }

    W2gSync.prototype.videoLookUp = function (url, callback) {
        var res = url.match(/^https?:\/\/[^?]+\.(mp4|mpd|mp3|aac|wav|webm|ogv|m3u8|gifv)(?:$|\?)\S*/);
        if (res) {
            var info = {};
            info.id = url;
            info.provider = this.provider_name;
            info.title = url;
            info.publisher = "";
            info.publisherID = null;
            info.desc = "";
            info.price = "";
            info.thumb = "/static/providers/28.png";
            info.cc = false;
            info.duration = 0;
            info.explicit = false;
            callback([info], this.provider_name);
            return true
        } else {
            return false;
        }
    };

    //Search for video through facebook API
    W2gSync.prototype.search = function (term, count, page, callback) {
        callback([], this.provider_name);
    };

    my.push(W2gSync);

    return my;

}(W2gProviders || []));
