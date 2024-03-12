var matcher = {
    // possible chars which can be after url
    possibleNextChars: ['/', '?', '&', '#'],

    /**
     * Walk through shopList and try to find ts info for given url
     *
     * @param {String} href - Url to check
     * @returns {String|Object} - Empty string if there is no ts info for this url, object with ts info if it is trusted shop
     */

    /**
     * Walk through shopList and try to find ts info for given url
     *
     * @param shopList {[]}
     * @param shopUrlList {[]}
     * @param href {string} - Url to check
     * @param [needToCleanDbUrl] {boolean} - do we need to "cleanUrl" for this shops
     * @return {string|*}
     */
    getMatchForHref: function (shopList, shopUrlList, href, needToCleanDbUrl) {
        var i;
        var index;
        var len;
        var dbUrl;
        var nextChar;

        if (shopUrlList && Array.isArray(shopUrlList) && shopUrlList.length) {
            len = shopUrlList.length;
            href = utils.cleanUrl(href);
            if (href.indexOf('xn--') === 0) {
                href = punycode.ToUnicode(href);
            }
            // do not check trustedshops.* domains
            if (href.indexOf('trustedshops.') !== 0) {
                for (i = 0; i < len; i++) {
                    dbUrl = needToCleanDbUrl ? utils.cleanUrl(shopUrlList[i]) : shopUrlList[i];
                    index = href.indexOf(dbUrl);
                    if (index === 0) {
                        nextChar = href[dbUrl.length];
                        if (!nextChar || matcher.possibleNextChars.indexOf(nextChar) !== -1 || dbUrl.charAt(dbUrl.length - 1) === '/') {
                            return shopList[i];
                        }
                    }
                }
            }
        }
        return '';
    },

    getShopsInfoByHrefs: function (shopList, shopUrlList, hrefs, needToCleanDbUrl) {
        var i;
        var shopsInfo = [];

        for (i = 0; i < hrefs.length; i++) {
            shopsInfo.push(matcher.getMatchForHref(shopList, shopUrlList, hrefs[i], needToCleanDbUrl));
        }
        return shopsInfo;
    }
};
