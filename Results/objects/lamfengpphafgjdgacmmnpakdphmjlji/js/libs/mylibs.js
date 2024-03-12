
var MyLibs = {

    getHostWithUrl: function(str) {
        try {
            var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/|:]+)', 'im');
            return str.match(re)[1].toString();
        } catch (e) {
            return null;
        }
    },

    isLocalHost: function(hostname) {
        var re = /^((^[a-z0-9-_]+$)|((10|127)\.\d+|(172\.(1[6-9]|2[0-9]|3[01])|192\.168))\.\d+\.\d+)$/i;
        return re.test(hostname);
    },

    ipv4ToLong: function(ipString) {
        var cols = ipString.split(".");
        if (cols.length != 4)
            throw "invalid IPv4 address string";
        return (16777216 * parseInt(cols[0],10)) + (65536 * parseInt(cols[1],10)) + (256 * parseInt(cols[2],10)) + parseInt(cols[3],10);
    },

    trace: function(msg) {
        //console.log("<" + String(JSON.stringify(msg)) + ">");
    },

    isUrlOk: function(url) {
        var RegExp = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (RegExp.test(url))
            return true;
        else
            return false;
    },

    deleteUrlParameter: function(url) {
        var out = url;
        out = out.split('?')[0];
        out = out.split('#')[0];
        out = out.replace(/\/$/, '');
        return out;
    },

    numberWithCommas: function(x) {
        if (x)
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        else
            return 0;
    }
};

String.prototype.isEndWith = function(a) {
    if (a == null || a == "" || this == null || this.length == 0 || a.length > this.length)
        return false

    if (this.substring(this.length - a.length).toLowerCase() == a.toLowerCase())
        return true
    else
        return false
};

// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}