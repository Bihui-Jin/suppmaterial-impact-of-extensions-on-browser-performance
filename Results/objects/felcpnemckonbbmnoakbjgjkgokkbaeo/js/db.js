var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;

function DbConnector(dbOps) {
    this.baseName = dbOps.baseName;
    this.storeName = dbOps.storeName;
    this.keyPath = dbOps.keyPath;
}

DbConnector.prototype = {
    connectDB: function (f) {
        var self = this;
        var request = indexedDB.open(this.baseName, 1);

        request.onerror = function (e) {
            console.log('Error connection to IndexedDB', e);
            f(-1);
        };

        request.onsuccess = function (e) {
            //console.log('connected success');
            f(e.target.result);
        };

        request.onupgradeneeded = function (e) {
            var db = e.target.result;
            var objectStore = db.createObjectStore(self.storeName, {keyPath: self.keyPath});

            objectStore.transaction.oncomplete = function (event) {
                self.connectDB(f);
            };
        }
    },

    updateDB: function (data, cb) {
        var self = this;
        this.connectDB(function (db) {
            if (db !== -1) {
                var trans = db.transaction(self.storeName, 'readwrite');
                var st = trans.objectStore(self.storeName);
                for (var i = 0; i < data.length; i++) {
                    var request = st.put(data[i]);
                    request.onerror = function (e) {
                        console.log('error written to db', e);
                        cb(-1);
                    };
                }
                trans.oncomplete = function (e) {
                    cb(true);
                }
            } else {
                cb(-1);
            }
        });
    },

    getAllShops: function (cb) {
        var self = this;
        this.connectDB(function (db) {
            if (db !== -1) {
                var rows = [];
                var transaction = db.transaction(self.storeName, "readonly");
                var objectStore = transaction.objectStore(self.storeName);

                objectStore.openCursor().onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        rows.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        cb(rows);
                    }
                };

                transaction.onerror = function(event) {
                    console.error('shopsDB.getAllShops error', event);
                    cb(-1);
                };

            } else {
                cb(-1);
            }
        });
    },

    clearStorage: function (cb) {
        var self = this;
        this.connectDB(function (db) {
            if (db !== -1) {
                var transaction = db.transaction(self.storeName, 'readwrite');
                var objectStore = transaction.objectStore(self.storeName);
                var objectStoreRequest = objectStore.clear();

                objectStoreRequest.onsuccess = function (event) {
                    console.log('Store is clear');
                    cb(true);
                };

                objectStoreRequest.onerror = function (e) {
                    cb(-1);
                }
            } else {
                cb(-1);
            }
        });
    }
};

var shopsDB = new DbConnector({
    baseName: 'tsBase',
    storeName: 'tsStore',
    keyPath: "tsId",
});

var badShopsDB = new DbConnector({
    baseName: 'bsBase',
    storeName: 'bsStore',
    keyPath: "id",
});
