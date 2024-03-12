// all intervals in msec
var INTERVALS = {
    // Expire time (DB updates) (1 days)
    dbUpdate: 86400 * 1000,
    // for tests
    //dbUpdate: 60000,

    // user can update DB from popup once per day
    userDbUpdate: 86400 * 1000,
    // for test
    // userDbUpdate: 60000,

    // alarm for check if DB is up to date if user do not restart browser for a long time
    // each 6 hours
    checkDbStateAlarm: 3600 * 1000 * 6,
    // for tests
    //checkDbStateAlarm: 28000,

    // show review agitation banner in popup after 3 days of usage
    showReviewAgitationAfter: 86400 * 1000 * 3
    // for tests
    //showReviewAgitationAfter: 1000

};

// cache shopList data in var. Like session
var session = {
    shopList: '',
    urlList: '',
    badShopsList: '',
    badShopsUrlList: '',
    badShopsObj: {},
    // show Badge for ts shops?
    showShopsBadge: []/*(function () {
     return config.storageArea.get({extActive: true}, function (items) {
     return items.extActive;
     });
     })()*/,
    // array with already showed shops (in this browser session)
    shownShops: [],
    // date of extension installation
    installationDateTime: 0,
    // true if review agitation banner was shown in popup
    isReviewAgitationShown: false,
    allowedFakeShops: [], // fake shops' id user allowed (it lives for one session)
};

var tester = {
    reviewBadge: undefined,
    updWheel: undefined
};

var storage = window.localStorage;

// some initialization work on start
config.storageArea.get(null, function (items) {
        session.showShopsBadge = items.hasOwnProperty('extActive')
            ? items.extActive
            : true;

        if (!items.installationDateTime) {
            config.storageArea.set({
                installationDateTime: Date.now(),
                isReviewAgitationShown: false
            }, function () {
                //console.log(session);
            });
        } else {
            session.installationDateTime = items.installationDateTime;
            session.isReviewAgitationShown = items.isReviewAgitationShown;
        }
    }
);

var injector = {
    trustBadge: {
        checker: function (tabId, tsInfo) {
            if (config.badge && (config.badge === 'ts' || config.badge === 'all')) {
                chrome.tabs.executeScript(tabId, {
                    file: config.PATH.JS + 'injectorTrustBadge.js',
                    runAt: 'document_idle'
                }, function () {
                    if (chrome.runtime.lastError) {
                        return;
                    }
                    // send info about ts shop to content script
                    chrome.tabs.sendMessage(tabId, {
                        action: 'tsBadge',
                        tsId: tsInfo.tsId
                    }, function () {
                        // send info about ts shop to content script
                        if (chrome.runtime.lastError) {
                            return;
                        }
                    });
                });
            }
        },


        widgetCode: function (tabId, tsId) {
            // console.log(`widgetCode for`, tabId, tsId);
            helpers.loadTsWidgetCode(tsId, function (code) {
                var tsConfig;

                if (code) {
                    tsConfig = "window._tsConfig = {" +
                        "'yOffset': '55'," +
                        "'variant': 'reviews'," +
                        "'disableResponsive': 'false'," +
                        "'disableTrustbadge': 'false'," +
                        "'trustCardTrigger': 'mouseenter'," +
                        "'channel': '" + config.tsWidgetDetails.channel + "'" +
                        "};";

                    chrome.tabs.executeScript(tabId, {
                        code: tsConfig + code
                    }, function () {
                        // send info about ts shop to content script
                        if (chrome.runtime.lastError) {
                            return;
                        }
                    });

                } else {
                    // do nothing
                    console.log('problems with getting trusbadge code');
                }
            });
        }
    },

    customBadge: function (tabId, tsInfo) {
        if (config.badge && (config.badge === 'custom' || config.badge === 'all')) {
            chrome.tabs.insertCSS(tabId, {
                    file: config.PATH.CSS + 'shops.css'
                },
                function () {
                    chrome.tabs.executeScript(tabId, {
                            file: config.PATH.JS + 'injectorShops.js'
                        },
                        function () {
                            if (chrome.runtime.lastError) {
                                return;
                            }
                            // send info about ts shop to content script
                            chrome.tabs.sendMessage(tabId, {
                                action: 'tsInfo',
                                tsInfo: tsInfo
                            }, function () {
                                // send info about ts shop to content script
                                if (chrome.runtime.lastError) {
                                    return;
                                }
                            });
                        }
                    );
                }
            );
        }
    },

    fakeShop: function (tabId, bsInfo) {
        chrome.tabs.insertCSS(tabId, {
                file: config.PATH.CSS + 'fakeShops.css'
            },
            function () {
                if (chrome.runtime.lastError) {
                    return;
                }
                chrome.tabs.executeScript(tabId, {
                        file: config.PATH.JS + 'injectorFakeShops.js'
                    },
                    function () {
                        if (chrome.runtime.lastError) {
                            return;
                        }
                        // send info about ts shop to content script
                        chrome.tabs.sendMessage(tabId, {
                            action: 'bsInfo',
                            bsInfo: bsInfo,
                            hidden: Boolean(session.allowedFakeShops.indexOf(bsInfo.id) !== -1)
                        }, function () {
                            // send info about ts shop to content script
                            if (chrome.runtime.lastError) {
                                return;
                            }
                        });
                    }
                );
            }
        );
    }
};

var helpers = {
    loadTsWidgetCode: function (tsId, cb) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', config.tsWidgetDetails.rootURL + tsId + '.js', true);

        xhr.responseType = 'text';

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    cb && cb(xhr.response);
                } else {
                    cb && cb(null);
                }
            } /*else {
                cb && cb(null);
            }*/
        };

        xhr.onerror = function () {
            cb && cb(null);
        };

        xhr.send();
    }
};

//listen tab update and inject scripts in TS shops only if needed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    var tsInfo;
    var bsInfo;
    var icoBasePath;
    // do not check google pages and  .trustedshops. home pages
    if (tab.url && tab.url.indexOf('https://www.google.') !== 0 && !/^https?:\/\/.*\.trustedshops\..*/.test(tab.url)) {
        // perform check on page loading stage
        if (changeInfo.status && changeInfo.status === 'loading') {
            bsInfo = matcher.getMatchForHref(session.badShopsList, session.badShopsUrlList, tab.url);
            if (bsInfo) {
                if (bsInfo.type === 1) {
                    // fake shop
                    icoBasePath = config.PATH.IMAGES + 'fake-shop/icon_fake-';
                    chrome.browserAction.setPopup({
                        popup: '',
                        tabId: tab.id
                    });
                    injector.fakeShop(tab.id, bsInfo);
                } else if (bsInfo.type === 2) {
                    // invalid shop
                    icoBasePath = config.PATH.IMAGES + 'invalid-shop/icon_invalid-';
                    chrome.browserAction.setPopup({
                        popup: config.PATH.TEMPLATES + 'popupInvalidShop.html',
                        tabId: tab.id
                    });
                } else {
                    console.log('BadShop invalid type', bsInfo.type);
                    return;
                }
                chrome.browserAction.setIcon({
                    path: {
                        "16": icoBasePath + '16.png',
                        "24": icoBasePath + '24.png',
                        "32": icoBasePath + '32.png',
                    },
                    tabId: tab.id
                });
                // no need to check shops. just exit here.
                return;
            }

            // tsInfo = walkUrlList(tab.url);
            tsInfo = matcher.getMatchForHref(session.shopList, session.urlList, tab.url, true);

            //console.timeEnd('CheckTS');
            // check if url is in shop list
            if (tsInfo !== '') {
                // this shop is in shopList
                // make icon in yellow
                icoBasePath = config.PATH.IMAGES + 'valid-shop/icon_valid-';
                chrome.browserAction.setIcon({
                    path: {
                        "16": icoBasePath + '16.png',
                        "24": icoBasePath + '24.png',
                        "32": icoBasePath + '32.png',
                    },
                    tabId: tab.id
                });
                // if user wants to see TS badge (checkbox in popup is checked)
                if (session.showShopsBadge) {
                    // inject trustedBadge
                    injector.trustBadge.checker(tab.id, tsInfo);

                    // check, maybe extension have shown badge already
                    if (session.shownShops.indexOf(tsInfo.tsId) === -1) {
                        // not showed! inject badge in page. finally!
                        injector.customBadge(tab.id, tsInfo);
                    }
                }
            }
        }
    }
});

chrome.runtime.onMessage.addListener(function (message, sender) {
    switch (message.action) {
        case 'googleGiveMeShopsInfo':
            // content script from google page want to check if there is links to ts shops
            // check it and send info back to google page
            // var shopsInfo = getShopsInfoByHrefs(message.hrefs);
            var shopsInfo = matcher.getShopsInfoByHrefs(session.shopList, session.urlList, message.hrefs, true);
            chrome.tabs.sendMessage(sender.tab.id, {
                action: 'googleShopsInfo',
                shopsInfo: shopsInfo
            });
            break;
        case 'addShownShop':
            session.shownShops.push(message.tsId);
            break;
        case 'clearShownShops':
            session.shownShops = [];
            break;
        case 'tsBadgeShow':
            injector.trustBadge.widgetCode(sender.tab.id, message.tsId);
            break;
        case 'fakeShop-allow':
            // remember allowed fake shop for session if not yet
            if (message.bsInfo && message.bsInfo.hasOwnProperty('id')) {
                if (session.allowedFakeShops.indexOf(message.bsInfo.id) === -1) {
                    session.allowedFakeShops.push(message.bsInfo.id);
                }
            }
            break;
    }
});

// this part for external extensions for test purposes
// at the moment FF does not support chrome.runtime.onMessageExternal
if (config.testerExtension.enable && chrome.runtime.onMessageExternal) {
    chrome.runtime.onMessageExternal.addListener(function (message, sender, responseCb) {
        switch (message.action) {
            case 'forceReviewBadge':
                // make review badge visible
                tester.reviewBadge = 'show';
                break;
            case 'normalReviewBadge':
                // normal state of review badge
                tester.reviewBadge = undefined;
                break;
            case 'forceUpdDbWheel':
                // show updDbWheel
                tester.updWheel = 'show';
                break;
            case 'normalUpdDbWheel':
                // upd DB wheel normal state
                tester.updWheel = undefined;
                break;
        }
    });
}

// this will fires only for fake shops. because they do not have popup.html
chrome.browserAction.onClicked.addListener(function (tab) {
    var bsInfo = matcher.getMatchForHref(session.badShopsList, session.badShopsUrlList, tab.url);
    if (bsInfo) {
        // remove fake shop from allowed list
        var ind = session.allowedFakeShops.indexOf(bsInfo.id);
        if (ind !== -1) {
            session.allowedFakeShops.splice(ind, 1);
        }
        chrome.tabs.sendMessage(tab.id, {action: 'bsInfo'})
    }
});
