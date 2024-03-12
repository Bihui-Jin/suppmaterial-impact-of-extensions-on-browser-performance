createRegex = function(regexString) {
    var regex = null;
    try {
        regex = new RegExp(regexString);
    } catch(e) {
        console.log("invalid regex: " + e);
    }
    return regex;
}

createRandomString = function(length) {
    var array = new Int8Array(length);
    crypto.getRandomValues(array);
    var resultArray = [];
    for (i = 0; i < array.length; i++) {
        var curVal = Math.abs(array[i] % 32);
        var character = String.fromCharCode(curVal + (curVal <= 9 ? 48 : 55)); //48 = '0'
        resultArray.push(character);
    }
    return resultArray.join('');
}

log = function(msg) {
    console.log(msg);
}
