// ==UserScript==
// @name     ErExt_forum
// @include forum.ereality.ru*page*.html
// @include forum.ereality.ru/search/*
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==
$(document).ready(function () {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }


        if (extOptions.options.forum_pages) {
            var fp = +location.href.match(/page(\d{1,}).html/)[1];

            function mur_nextpage() {
                if (fp < +$("a[href*=page]:last", $("#Content").children().first()).text()) location.href = location.href.replace(/page(\d{1,}).html/, "page" + (fp + 1) + ".html")
            }

            function mur_prevpage() {
                if (fp > 1) location.href = location.href.replace(/page(\d{1,}).html/, "page" + (fp - 1) + ".html")
            }

            if ($(".SelectPage").length > 1) {
                $(".SelectPage").parent().append($("<span/>",{text:"•"})).append($("<img>",{src:kango.io.getResourceUrl('res/next_page.png'), style:"cursor:pointer"}).on("click", mur_nextpage));
                $(".SelectPage").parent().children().first().after($("<span/>",{text:"•"})).after($("<img>",{src:kango.io.getResourceUrl('res/prev_page.png'),style:"cursor:pointer"}).on("click", mur_prevpage));
                $(".SelectPage").last().parent().children().first().after($("<span/>",{text:"•"})).after($("<img>", {src:kango.io.getResourceUrl('res/prev_page.png'), style:"cursor:pointer"}).on("click", mur_prevpage));
            }
			
        }
    }

    var loadOptions = [{
        systemName: 'options',
        defaultName: "myoptions"
    }];


    tools.loadOptions(loadOptions, controller);
});