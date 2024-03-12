// ==UserScript==
// @name     ErExt_trade_bookmarks
// @include http://usercp.ereality.ru/services/stock/search*
// @require tools/jquery.js
// @require tools.js
// @require css/popup-css.js
// @require tools/popup.js
// @all-frames  true
// ==/UserScript==
$(document).ready(function() {
    function controller(extOptions) {
        if (!extOptions.options.unpaused) {
            return;
        }

        var tradeBookmarkClass = function(popup) {
            this.popup = popup;
            this.bookMarsk = [];

            this.bookMarksHolder = $('<table/>', {style:"margin: 5px;"});
            this.addButton =  $("<img/>", {title:"Добавить закладку", style:"cursor:pointer", src:kango.io.getResourceUrl("res/add.png")});
            this.searchButton = $('#rialtoForm button[type="submit"]');
            this.nameInput = $("input[name=nm]");

            var self = this;

            this.init = function() {
                self.loadBookmarks();
                self.initSavedBookmarks();

                $("#rialto-filters-dropdown").append(self.addButton);

                self.initListeners();
                return this;
            }

            this.initListeners = function() {
                self.addButton.on('click', function() {
                    var bookmark = self.nameInput.val();

                    if (bookmark.length < 4 || bookmark.length > 40) {
                        return;
                    }

                    self.addBookmark(bookmark);
                    self.checkPopupVisible();
                });
            }

            this.initPopupListeners = function() {
                self.bookMarksHolder.on('click', '.bookmark',  function() {
                    var text = $(this).text();
                    self.nameInput.val(text);
                    self.searchButton.click();
                }).on('click', '.delete-bookmark', function() {
                    var current = $(this);

                    self.deleteBookmark(current.parent().prev().children().text());
                    current.parent().parent().remove();
                    self.checkPopupVisible();
                });
            }

            this.deleteBookmark = function(bookmark) {
                var index = $.inArray(bookmark, self.bookMarsk);
                if (index > -1) {
                    self.bookMarsk.splice(index, 1);
                    self.saveBookmarks();
                }
            }

            this.addBookmark = function(bookmark) {
                if ($.inArray(bookmark, self.bookMarsk) == -1) {
                    self.bookMarsk.push(bookmark);
                    self.bookMarksHolder.append(self.getBookmarkView(bookmark));
                    self.saveBookmarks();
                }
            }

            this.initSavedBookmarks = function() {
                $.each(self.bookMarsk, function() {
                    self.bookMarksHolder.append(self.getBookmarkView(this));
                });
                self.checkPopupVisible();
            }

            this.checkPopupVisible = function() {
                if (self.bookMarsk.length > 0) {
                    var position = self.nameInput.offset();
                    self.popup.show(self.bookMarksHolder).move(position.left - 15, position.top + 35, 0, 0);
                    self.initPopupListeners();
                }
                else {
                    self.popup.hide();
                }
            }

            this.getBookmarkView = function(bookmark) {
                var textTd = $('<td></td>').append($('<a>', {href:"#", class:"bookmark"}).css({"cursor": "pointer", "color": "black"}).append(bookmark));

			var imgTd = $('<td/>', {style:"padding-left: 5px;"})
                    .append($("<img/>", { class:"delete-bookmark", title:"Удалить закладку", style:"cursor:pointer", src:kango.io.getResourceUrl("res/deletered.png")}));

                return $('<tr/>',{style:"padding-top: 2px"}).append(textTd).append(imgTd);
            }

            this.saveBookmarks = function() {
                kango.storage.setItem("trade_bookmarks",JSON.stringify(self.bookMarsk));
            }

            this.loadBookmarks = function() {
                var bookMarks = kango.storage.getItem("trade_bookmarks");

                if (bookMarks) {
                    bookMarks = JSON.parse(bookMarks);
                }
                else {
                    bookMarks = [];
                }

                self.bookMarsk = bookMarks;
            }
        }

        if (extOptions.options.trade_bookmarks) {
            new tradeBookmarkClass(popup).init();
        }

    }

    var loadOptions = [{
        systemName: 'options',
        defaultName: "myoptions"
    }];

    tools.loadOptions(loadOptions, controller);
});