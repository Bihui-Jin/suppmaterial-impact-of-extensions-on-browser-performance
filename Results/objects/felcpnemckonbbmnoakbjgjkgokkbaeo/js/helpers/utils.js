var utils = {
    // cut `http://`, `https://`, `www.` at the start
    // and `/` at the end
    cleanUrl: function(url) {
        url = url.toLowerCase();
        if (url.indexOf('http://') === 0) {
            url = url.replace('http://', '');
        } else if (url.indexOf('https://') === 0) {
            url = url.replace('https://', '');
        }

        if (url.indexOf('www.') === 0) {
            url = url.replace('www.', '');
        }

        var lastSlashInd = url.lastIndexOf('/');
        if (lastSlashInd === url.length - 1) {
            url = url.substr(0, lastSlashInd);
        }
        return url;
    }
};
