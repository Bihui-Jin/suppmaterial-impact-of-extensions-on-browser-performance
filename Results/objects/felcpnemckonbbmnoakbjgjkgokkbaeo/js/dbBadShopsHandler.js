var dbBadShopsHandler = {
    // Return info for all shops in DB
    getShopsFromDb: function (cb) {
        //console.log('Going to get all shops data');
        //console.time('GettingAllShops');
        badShopsDB.getAllShops(function (shops) {
            //console.timeEnd('GettingAllShops');
            cb(shops);
        });
    },

    /* Create DB first time */
    createDb: function (cb) {
        getBadShopsFromSite(function (data) {
            if (isBadShopsFromSiteOk(data)) {
                var forDb = prepareBadShopsForDb(data);
                if (forDb.length) {
                    console.log('starting Create Bad Shops DB');
                    console.log('Shops length in json', forDb.length);
                    badShopsDB.updateDB(forDb, function (res) {
                        if (res !== -1) {
                            storage.lastBadShopsDbUpdate = Date.now();
                        }
                        cb && cb(res);
                    });
                } else {
                    // empty shops.json or error
                    // have to log this to logger server
                    console.log('empty badShops.json or error');
                    cb && cb(-1);
                }

            } else {
                // problems with shops.json answer
                // have to log this to logger server
                console.log('problems with badShops.json answer from API');
                cb && cb(-1);
            }
        });
    },

    updDb: function (cb) {
        getBadShopsFromSite(function (data) {
            if (isBadShopsFromSiteOk(data)) {
                var forDb = prepareBadShopsForDb(data);
                badShopsDB.clearStorage(function (clearStatus) {
                    if (clearStatus !== -1) {
                        badShopsDB.updateDB(forDb, function (res) {
                            if (res !== -1) {
                                storage.lastBadShopsDbUpdate = Date.now();
                            }
                            cb && cb(res);
                        });
                    } else {
                        cb && cb(clearStatus);
                    }
                });
            } else {
                console.log('problems with badShops.json answer from API');
                cb && cb(-1);
            }
        });
    }
};

/************************ Helpers ***************************************/

function isBadShopsFromSiteOk(data) {
    return (data && Array.isArray(data));
}

function prepareBadShopsForDb(shops) {
    var forDb = [];

    shops.forEach(function (shop) {
        forDb.push({
            id: shop.id,
            url: utils.cleanUrl(shop.name.trim()),
            type: shop.type
        });
    });
    return forDb;
}

function getBadShopsFromSite(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', config.dbBadShopsUrl + '?source=' + config.tsWidgetDetails.channel, true);
    xhr.responseType = 'json';
    // xhr.setRequestHeader('client-token', config.clientToken);
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
