/* CHROME EXTENSION CONFIG */

var config = {
    // which badge extension have to inject (trustbadge - `ts`, custom (old) -  `custom`, `all` - for both, an empty string for none)
    badge: 'ts',
    // details for trustbadge widget from ts API
    tsWidgetDetails: {
        // chanel parameter for _tsConfig
        channel: 'BROWSER_EXTENSION_CHROME',
        // root part of URL to call for get tsWidget
        rootURL: 'https://widgets.trustedshops.com/js/'
    },
    // google injector
    googleInjection: {
        // parameter in link to the TS
        utm_medium: 'Chrome',
        // check url on load (true) or only with observer (false)
        checkOnLoad: false
    },
    tsHome: {
        pluginContentId: 'ChromePluginContent'
    },
    // tester extension integration
    // https://bitbucket.org/tsextensions/tschrometester/src
    // at the moment only Chrome supports external messaging
    testerExtension: {
        enable: true
    },
    // TrustedShops shopList. URL to list of ts shops
    // PRODUCTION
    dbUrl: 'https://static.trustedshops.com/browser-extension/v2-shops-chrome.json',
    // dbUrl: 'https://api.trustedshops.com/rest/internal/v2/ts/resources/browsers/extensions/chrome/shops.json',
    // OLD
    //dbUrl: 'https://api.trustedshops.com/rest/internal/v2/shops.json',
    // url to local server for tests
    // dbUrl: 'http://test/shops.json',
    dbBadShopsUrl: 'https://widgets.trustedshops.com/bad-shops/shops.json', // prod
    // dbBadShopsUrl: 'https://qa.trustedshops.de/wp-json/ts-wp-api/v1/bad-shops/shops', // dev
    clientToken: '4936c1e06ed9dd706fa835b81061ece0bf6c275f13d15ac3ac3bcd7e916af477',
    reviewUrl: 'https://chrome.google.com/webstore/detail/trusted-shops-erweiterung/felcpnemckonbbmnoakbjgjkgokkbaeo/reviews',
    PATH: {
        ROOT: chrome.runtime.getURL(''),
        JS: 'js/',
        CSS: 'css/',
        IMAGES: chrome.runtime.getURL('images') + '/',
        TEMPLATES: chrome.runtime.getURL('templates') + '/',
    },
    // At the moment only Chrome supports `sync` storage
    storageArea: chrome.storage.sync
};
