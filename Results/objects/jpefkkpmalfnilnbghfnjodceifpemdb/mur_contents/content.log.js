// ==UserScript==
// @name        log
// @include     www.ereality.ru/log/*
// @require  	tools/jquery.js
// @require     tools.js
// @require 	css/info-buttons-css.js
// ==/UserScript==

//================================================================Begin

kango.invokeAsync('kango.storage.getItem', "options", function(options) {
	var myoptions = mergeOptions(options, defaultConfig.myoptions);
        window.setTimeout(function() { log_init(); }, 100);
});

function log_init() {
    script = "";
    // Инвертировать лог(последние рауды отображать сверху)
    //var logObject = log;
    if (myoptions.inverse_log) {
        script += "(" +
            (function() {
                var logObject = log;
                var ajaxSuccessCallback = log.ajaxSuccess;
                log.ajaxSuccess = function(data) {
                    var myrezult = ajaxSuccessCallback.apply(log, arguments);
                    var objArrRounds = $('#tbl_logs').find('.round').parents('tr');
                    var arrTable = [];
                    $.each(objArrRounds, function(key, val) {
                        var obj = $(val).nextUntil("tr td .round").andSelf().detach();
                        arrTable.push(obj);
                    });
                    $('#tbl_logs').append(arrTable);
                    return myrezult
                }
                var objArrRounds = $('#tbl_logs').find('.round').parents('tr');
                var arrTable = [];
                $.each(objArrRounds, function(key, val) {
                    var obj = $(val).nextUntil("tr td .round").andSelf().detach();
                    arrTable.push(obj);
                });
                $('#tbl_logs').append(arrTable);
                $('body').prepend('<br /><input type="button" class="butt1" value=" Обновить " onclick="log.get(999, log.params);"/>');
            }).toString() + ")();";

    }
    //менять цвет/стиль ослабленного удара                                
    if (myoptions.change_weak) {
        script += "(" +
            (function() {
                
                var logObject = log;
                var ajaxSuccessCallback = log.ajaxSuccess;
                log.ajaxSuccess = function(data) {
                    var myrezult = ajaxSuccessCallback.apply(log, arguments);
                    var objArrRounds = $('#tbl_logs').find('.round').parents('tr');
                    $('.bWeak').css({'color': 'green','font-style': 'normal'});
                    return myrezult
                }
                $('.bWeak').css({'color': 'green','font-style': 'normal'});
            }).toString() + ")();";
    }

    inject_global(script);
}