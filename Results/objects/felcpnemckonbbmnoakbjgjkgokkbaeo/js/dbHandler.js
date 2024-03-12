var dbHandler = {};

dbHandler.getShopsUrlArray = function (shops) {
    var shopsArr = [];
    var i;
    var len = shops.length;

    for (i = 0; i < len; i++) {
        shopsArr.push(shops[i].url);
    }
    return shopsArr;
};

// Return info for all shops in DB
dbHandler.getShopsFromDb = function (cb) {
    //console.log('Going to get all shops data');
    //console.time('GettingAllShops');
    shopsDB.getAllShops(function (shops) {
        //console.timeEnd('GettingAllShops');
        cb(shops);
    });
};

/* Create DB first time */
dbHandler.createDb = function (cb) {
    getDBFromSite(function (data) {
        if (isDbFromSiteOk(data)) {
            console.log('dbFromSiteOK');
            var forDb = prepareShopsForDb(data.response.data.shops);
            if (forDb.length) {
                console.log('starting Create DB');
                console.log('Shops length in json', forDb.length);
                shopsDB.updateDB(forDb, function (res) {
                    if (res !== -1) {
                        storage.lastDbUpdate = Date.now();
                    }
                    cb && cb(res);
                });
            } else {
                // empty shops.json or error
                // have to log this to logger server
                console.log('empty shops.json or error');
                cb && cb(-1);
            }

        } else {
            // problems with shops.json answer
            // have to log this to logger server
            console.log('problems with shops.json answer from API');
            cb && cb(-1);
        }
    });
};

/*
 Update existing DB
 Clear previous data and write new from shops.json
 We need to clear because there is possibility that new shops.json do not contains some shops
 It is much faster to clear and write new then try to find changes
 */
dbHandler.updDb = function (cb) {
    getDBFromSite(function (data) {
        if (isDbFromSiteOk(data)) {
            var forDb = prepareShopsForDb(data.response.data.shops);
            shopsDB.clearStorage(function (clearStatus) {
                if (clearStatus !== -1) {
                    shopsDB.updateDB(forDb, function (res) {
                        if (res !== -1) {
                            storage.lastDbUpdate = Date.now();
                        }
                        cb && cb(res);
                    });
                } else {
                    cb && cb(clearStatus);
                }
            });
        } else {
            cb && cb(-1);
        }
    });
};

/************************ Helpers ***************************************/

function isDbFromSiteOk(data) {
    return (data
    && data.response
    && data.response.code === 200
    && data.response.data
    && data.response.data.shops
    && data.response.data.shops.length);
}

// Prepare shops for writing to DB.
// Each array item will looks like
// {"tsId":"XB9F91196C2CA0F1CC7760E393236CAC7","url":"www.steg-platten.de","tm":"VALID","om":4.5,"arc":130,"omd":"EXCELLENT"}
// `tsId` and `url` can't be an empty string. Other properties can be an empty string
function prepareShopsForDb(shops) {
    var forDb = [];
    var shop;
    var shopObj;
    //console.time('prepareShopsForDb');

    // check if is it new JSON structure
    if (shops[0].hasOwnProperty('arc') || shops[0].hasOwnProperty('om') || shops[0].hasOwnProperty('omd')) {
        // it is new JSON structure
        return prepareShopsForDbNew(shops);
    }

    for (shop in shops) {
        shopObj = {};
        if (shops[shop].hasOwnProperty('url')
            && shops[shop].url.trim()
            && shops[shop].hasOwnProperty('tsId')
            && shops[shop].tsId.trim()
        ) {
            shopObj.url = shops[shop].url.trim();
            shopObj.tsId = shops[shop].tsId.trim();
            shopObj.tm = (shops[shop].hasOwnProperty('trustMark') && shops[shop].trustMark.hasOwnProperty('status'))
                ? shops[shop].trustMark.status
                : '';

            if (shops[shop].hasOwnProperty('qualityIndicators') && shops[shop].qualityIndicators.hasOwnProperty('reviewIndicator')) {
                var rI = shops[shop].qualityIndicators.reviewIndicator;
                shopObj.om = rI.hasOwnProperty('overallMark')
                    ? rI.overallMark
                    : '';
                shopObj.arc = rI.hasOwnProperty('activeReviewCount')
                    ? rI.activeReviewCount
                    : '';
                shopObj.omd = rI.hasOwnProperty('overallMarkDescription')
                    ? rI.overallMarkDescription
                    : '';
            } else {
                shopObj.om = '';
                shopObj.arc = '';
                shopObj.omd = '';
            }
            forDb.push(shopObj);
        }
    }
    //console.timeEnd('prepareShopsForDb');
    return forDb;
}

// new JSON structure
function prepareShopsForDbNew(shops) {
    var forDb = [];
    var shopObj;

    for (var i = 0; i < shops.length; i++) {
        shopObj = {};
        if (shops[i].hasOwnProperty('url')
            && shops[i].url.trim()
            && shops[i].hasOwnProperty('tsId')
            && shops[i].tsId.trim()
        ) {
            shopObj.url = shops[i].url.trim();
            shopObj.tsId = shops[i].tsId.trim();

            forDb.push({
                ind: i,
                url: shops[i].url.trim(),
                tsId: shops[i].tsId.trim(),
                arc: shops[i].hasOwnProperty('arc') ? shops[i].arc : '',
                om: shops[i].hasOwnProperty('om') ? shops[i].om : '',
                omd: shops[i].hasOwnProperty('omd') ? shops[i].omd : '',
                tm: shops[i].hasOwnProperty('tm') ? shops[i].tm : ''
            });
        }
    }
    return forDb;
}

function getDBFromSite(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config.dbUrl, true);
    xhr.responseType = 'json';
    xhr.setRequestHeader('client-token', config.clientToken);
    xhr.setRequestHeader('content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                //console.log('Received shop.json');
                cb && cb(xhr.response);
            } else {
                cb && cb(null);
            }
        }
    };
    xhr.onerror = function () {
        cb && cb(null);
    };
    xhr.send();
}
