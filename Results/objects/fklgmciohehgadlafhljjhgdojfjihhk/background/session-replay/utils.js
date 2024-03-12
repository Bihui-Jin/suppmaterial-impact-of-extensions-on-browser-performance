promisify = function (funcToPromisify, context) {
    return function() {
        var args = Array.prototype.slice.call(arguments);
        var safeArgs = args.slice();
        var callback;

        // Check for callback
        if (args && args.length > 0) {
            var last = args[args.length - 1];
            if (typeof last === 'function') {
                safeArgs.splice(safeArgs.length - 1, 1);
                callback = last;
            }
        }

        return new Promise(function(resolve, reject) {
            try {
                var cbWrapper = function () {
                    var cbArgs = [].slice.call(arguments);
                    if (callback) {
                        try {
                            callback.apply(null, cbArgs);
                        }
                        catch (cbErr) {
                            reject(cbErr);
                        }
                    }

                    var err = chrome.runtime.lastError;

                    if (err) {
                        reject(err);
                    } else {
                        cbArgs = cbArgs || {length: 0};
                        switch (cbArgs.length) {
                            case 0:
                                resolve();
                                break;
                            case 1:
                                resolve(cbArgs[0]);
                                break;
                            default:
                                resolve(cbArgs);
                        }
                    }
                };

                safeArgs.push(cbWrapper);

                // Run original function with arguments without callback and after that the callback itself
                funcToPromisify.apply(context, safeArgs);
            }
            catch(e) {
                reject(e);
            }
        });
    }
}