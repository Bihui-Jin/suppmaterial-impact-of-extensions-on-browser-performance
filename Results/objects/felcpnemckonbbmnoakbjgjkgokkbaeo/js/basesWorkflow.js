function DbOperator(opts) {
    this.dbHandler = opts.dbHandler;
    this.noDbMark = opts.noDbMark;
    this.shopsToSession = opts.shopsToSession;
    this.isDbRechecked = false;
}

DbOperator.prototype = {
    createBase: function () {
        var self = this;
        self.dbHandler.createDb(function (createStatus) {
            if (createStatus === -1) {
                self.noDbMark = true;
            } else {
                self.noDbMark = false;
                self.initSession();
            }
        });
    },

    updateBase: function (cb) {
        var self = this;
        self.dbHandler.updDb(function (answ) {
            if (answ !== -1) {
                self.initSession(cb);
            } else {
                cb && cb(-1);
            }
        });
    },

    initSession: function (cb) {
        var self = this;
        self.dbHandler.getShopsFromDb(function (shops) {
            if (shops && shops !== -1 && Array.isArray(shops) && shops.length) {
                self.shopsToSession(shops);
                cb && cb(1);
            } else if (!self.isDbRechecked) {
                console.log('Problems with getting Shops form indexedDB. Trying reDownload DB from site');
                self.isDbRechecked = true; // remember that we already tried recheck from site to prevent endless recursion
                self.updateBase(cb);
            } else {
                cb && cb(-1);
            }
        });
    }
};

var shopsOperator = new DbOperator({
    dbHandler: dbHandler,
    noDbMark: storage.noDb,
    // initSessionHandler: initShopsSession,
    shopsToSession: function (shops) {
        if (shops[0].hasOwnProperty('ind')) {
            shops.sort(function (a, b) {
                return a['ind'] - b['ind'];
            });
            session.shopList = shops;
        } else {
            session.shopList = shops;
        }
        session.urlList = dbHandler.getShopsUrlArray(shops);
        console.log('Shops Initialized'/*, session.shopList, session.urlList*/);
    }
});

var badShopsOperator = new DbOperator({
    dbHandler: dbBadShopsHandler,
    noDbMark: storage.noBadShopDb,
    shopsToSession: function (shops) {
        // session.badShopsObj = shops.reduce(function (obj, shop) {
        //     obj[shop['url']] = shop;
        //     return obj;
        // }, {});
        session.badShopsList = shops;
        session.badShopsUrlList = shops.map(shop => {
            return shop['url'];
        });
        console.log('Bad Shops Initialized'/*, session.badShopsList, session.badShopsUrlList*/);
    },
});

var mainOperator = {
    createBases: function () {
        clearStorageFromPrevVersion();
        shopsOperator.createBase();
        badShopsOperator.createBase();
    },

    updateBases: function (cb) {
        shopsOperator.updateBase(function (answ) {
            badShopsOperator.updateBase(function () {
                cb && cb(answ);
            });
        });
    },

    initSessions: function (cb) {
        shopsOperator.initSession(function () {
            badShopsOperator.initSession(cb);
        });
    }
};

if (!storage.lastDbUpdate) {
    mainOperator.createBases();
} else if (Date.now() - storage.lastDbUpdate >= INTERVALS.dbUpdate) {
    mainOperator.updateBases();
} else {
    mainOperator.initSessions();
}

function clearStorageFromPrevVersion() {
    storage.shopListData && storage.removeItem('shopListData');
    storage.dateOfSavedShopListData && storage.removeItem('dateOfSavedShopListData');
    storage.version && storage.removeItem('version');
}

function checkDbIfTime() {
    if (storage && (storage.noDb === 'true' || !storage.lastDbUpdate || Date.now() - storage.lastDbUpdate >= INTERVALS.dbUpdate)) {
        // is time to get a new DB !
        console.log('Go to upd DB');
        mainOperator.updateBases();
    }
}

// create alarm to check if db is up to date
// useful if user do not restart browser for a long time (more than INTERVALS.dbUpdate)
// 100000 msec is for fire a little later
function setAlarm() {
    // console.log('setting alarm to fire each, min', INTERVALS.checkDbStateAlarm / 1000 / 60);
    chrome.alarms.create('checkLastDbUpdate', {
        // when: Date.now() + INTERVALS.checkDbStateAlarm + 100000,
        periodInMinutes: INTERVALS.checkDbStateAlarm / 1000 / 60
    });
}

// alarms handling
chrome.alarms.onAlarm.addListener(function (alarm) {
    //console.log('alarm fired');
    if (alarm.name === 'checkLastDbUpdate') {
        // console.log('checkDbIfTime on alarm');
        checkDbIfTime();
    }
});

setAlarm();

// check if time to update db each time user unlocked machine.
// because of this chrome.alarms issue // alarms issue https://bugs.chromium.org/p/chromium/issues/detail?id=471524
var prevIdleState;
chrome.idle.onStateChanged.addListener(function (idleState) {
    if (prevIdleState === 'locked') {
        console.log('checkDbIfTime on unlocked', idleState);
        checkDbIfTime();
    }
    prevIdleState = idleState;
});
