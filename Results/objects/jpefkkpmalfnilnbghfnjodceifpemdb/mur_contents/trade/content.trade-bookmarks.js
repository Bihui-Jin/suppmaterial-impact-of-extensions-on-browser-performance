// ==UserScript==
// @name     ErExt_trade_bookmarks
// @include www.ereality.ru/map*n=alltypes
// @include www.ereality.ru/map*e=alltypes
// @include www.ereality.ru/move/stock*
// @require tools/jquery.js
// @require tools.js
// @all-frames  true
// ==/UserScript==
$(document).ready(function() {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }

        if (extOptions.options.trade_bookmarks) {
            function add_bookmark(text) {
                if (text.length < 4) return;
                var button_del = $("<img>", {'title':"удалить закладку", 'style':"display: inline; margin: 0px 0px -5px 5px; cursor:pointer;", 'src':kango.io.getResourceUrl("res/deletered.png")});
				//var button_del = $("<img title=\"удалить закладку\" style=\"display: inline; margin: 0px 0px -5px 5px;cursor:pointer\" src=\"" + kango.io.getResourceUrl("res/deletered.png") + "\">");
                button_del.on("click", function() {
                    var index = $.inArray($(this).prev().children().text(), bookmarks)
                    if (index > -1) bookmarks.splice(index, 1);
                    $(this).prev().remove();
                    $(this).prev().remove();
                    $(this).remove();
                    kango.storage.setItem("trade_bookmarks",JSON.stringify(bookmarks));
                });
                var bookmark = ($("<a>", {'href':"javascript:void(0);", text:text })).on('click', function() {
                    $("#nm").val(text);
                    $("input[value*=Подобрать]").click();
                });
                $("input[name=submit]").after($('<br>'),$('<b>').append(bookmark),button_del);
            }
            var bookmarks_data = kango.storage.getItem("trade_bookmarks");
            if (bookmarks_data) {
                var bookmarks = JSON.parse(bookmarks_data);
                $.each(bookmarks, function() {
                    add_bookmark(this);
                });
            } else {
                var bookmarks = [];
            }


            var button_add = $("<img>", {'title':"добавить закладку", 'style':"position:relative;top:-20px;left:220px;cursor:pointer;", 'src':kango.io.getResourceUrl("res/add.png")}).on('click', function() {
                var text = $("#nm").val();
                var index = $.inArray(text, bookmarks)
                if (index == -1) {
                    add_bookmark(text);
                    bookmarks.push(text);
                    kango.storage.setItem("trade_bookmarks",JSON.stringify(bookmarks));
                }

            });
            if (location.href.search("usercp.ereality.ru") != -1) button_add.css({
                top: 0,
                left: "20px"
            });
            $("#nm").after(button_add);
        }
    }

    var loadOptions = [{
        systemName: 'options',
        defaultName: "myoptions"
    }];


	tools.loadOptions(loadOptions, controller);
});