var script_dialogTP = "(" +
	(function() {  
        var _Dialogs = function () {
            var self = this;

            this.ParentElement = "#dialogData",
                this.TeleportPlaces = {},
                this.ParentElementGlobal = null,
                this.Form = null,
                this.FormID = "#dialogsForm",

                this.ShowForm = function () {
                    this.Form || this.CreateForm(),
                        this.Form.show()
                },
                this.CreateForm = function () {
                    this.Form || (this.Form = $("#dialogsForm")),
                    this.Form.length || (this.Form = $("<div></div>").css({
                            "z-index": "999",
                            width: "100%",
                            height: "\t100%",
                            display: "none",
                            position: "absolute",
                            left: "0px",
                            top: "0px"
                        }).attr("id", "dialogsForm"),
                            this.Form.css("display", "none"),
                            this.Form.html('<div style="position: absolute; width: 100%; height: 100%;"><img src="' + top.core.imgPath + 'd3/nquest/1x1ser.png" width="100%" height="100%"></div><div id="messenger_box" class="messenger_box" >\t<div class="div_messenger_bg">&nbsp;</div>\t<div class="border_left">&nbsp;</div>\t<div class="border_right">&nbsp;</div>\t<div class="border_left_i">&nbsp;</div>\t<div class="border_right_i">&nbsp;</div>\t<div class="div_messenger_content">\t\t<div id="dialogMenu"></div><div id="dialogDataContainer">\t<div id="dialogData" >\t</div></div>\t</div>\t<a href="#" class="close"title="Закрыть" id="messengerCloseButton">&nbsp;</a></div>'),
                            this.Form.appendTo($("body")),
                            this.ParentElementGlobal = $("#messenger_box", this.FormID),
                            $("#messengerCloseButton", this.Form).on('click', function () {
                                self.HideForm()
                            })
                    )
                }
                ,
                this.HideForm = function () {
                    this.Form.hide()
                },
                this.TeleportImage = function (title) {
                    let img = "https://img.ereality.ru/map/obj/1072.png";
                    let obj = {
                        'Биржа': "https://img.ereality.ru/map/obj/3006.png",
                        'Шахта': "https://img.ereality.ru/map/obj/1028.png?v2016c",
                        'Ярмарка': "https://img.ereality.ru/map/obj/11002.png?v2016c",

                        'Центр. лесопилка': "https://img.ereality.ru/map/obj/1073.png?v2016c",
                        'Южные опилки': "https://img.ereality.ru/map/obj/1073.png?v2016c",
                        'Северные опилки': "https://img.ereality.ru/map/obj/1073.png?v2016c",

                        'Телепорт Песка': "https://img.ereality.ru/map/obj/1063.png?v2016c",
                        'Кладбище': "https://img.ereality.ru/map/obj/1018.png?v2016c",

                        'Туманный город': "https://img.ereality.ru/map/obj/new/1075.png?v2016c",
                        'Турнирная арена': "https://img.ereality.ru/map/obj/1065.png?v2016c",
                        'Большое поместье': "https://img.ereality.ru/map/obj/1078.png?v2016c",
                        'Среднее поместье': "https://img.ereality.ru/map/obj/1077.png?v2016c",
                        'Малое поместье': "https://img.ereality.ru/map/obj/1076.png?v2016c",
                        'Храм Листа': "https://img.ereality.ru/map/obj/1072.png?v2016c",
                        'Гильдии Мастерства': "https://img.ereality.ru/map/obj/1067.png?v2016c",
                        'Полянка кудесников': "https://img.ereality.ru/map/obj/1070.png?v2016c",
                        'Солидная Лавка': "https://img.ereality.ru/map/obj/1071.png?v2016c",
                        'Порт': "https://img.ereality.ru/map/obj/22006.png?v2016c",

                        'Храма Солнца': "https://img.ereality.ru/map/obj/11025.png?v2016c",
                        'Следопыт': "https://img.ereality.ru/map/obj/22003.png?v2016c",
                        'Пристанище следопыта': "https://img.ereality.ru/map/obj/22003.png?v2016c",

                        'Хижина отшельника': "https://img.ereality.ru/map/obj/1017.png?v2016c", // ?
                        'Амур': "https://img.ereality.ru/map/obj/1017.png?v2016c", // ?

                        'Последний Оплот': "https://img.ereality.ru/map/obj/1031.png?v2016c",
                        'Литейная': "https://img.ereality.ru/map/obj/1062.png?v2016c",
                        'Литейная 2': "https://img.ereality.ru/map/obj/1062.png?v2016c",

                        'Аскиру Чуратай': "https://img.ereality.ru/map/obj/1035.png?v2016c",
                        'Усганоли Хоунихи': "https://img.ereality.ru/map/obj/1033.png?v2016c",
                        'Кэна ка Кхотсо': "https://img.ereality.ru/map/obj/1036.png?v2016c",
                        'Тереба-о-Бисса': "https://img.ereality.ru/map/obj/1037.png?v2016c",
                        'Тала Иголиига': "https://img.ereality.ru/map/obj/1034.png?v2016c",

                        'Живит. Источник': "https://img.ereality.ru/map/obj/3005.png?v2016c",
                        'Лаб. Ксенологов': "https://img.ereality.ru/map/obj/3004.png?v2016c",
                        'Диспетчерский Центр': "https://img.ereality.ru/map/obj/3028.png?v2016c",
                        'Телепорт Листа': "https://img.ereality.ru/map/obj/3027.png?v2016c",
                        'Гильдии Выбора': "https://img.ereality.ru/map/obj/3007.png?v2016c",
                        'Лесопилка Карлыча': "https://img.ereality.ru/map/obj/3002.png?v2016c",
                        'Заброшенный завод': "https://img.ereality.ru/map/obj/3029.png?v2016c",
                        'Кузница': "https://img.ereality.ru/map/obj/3003.png?v2016c",

                        'Храм': "https://img.ereality.ru/map/obj/22010.png?v2016c",
                        'Колониальный магазин': "https://img.ereality.ru/map/obj/22011.png?v2016c",
                        'Ювелирная мастерская': "https://img.ereality.ru/map/obj/22009.png?v2016c",

                        'Флаг пиратский': "https://img.ereality.ru/map/obj/22054.png?v2016c",
                        'Затерянная гавань': "https://img.ereality.ru/map/obj/22052.png?v2016c",
                        'Затерянная гавань': "https://img.ereality.ru/map/obj/22051.png?v2016c",
                        'Древний портал': "https://img.ereality.ru/map/obj/22055.png?v2016c",
                        'Камень перерождения': "https://img.ereality.ru/map/obj/22058.png?v2016c",
                        'Гильдия Призывателей': "https://img.ereality.ru/map/obj/22056.png?v2016c",

                        'Академия': "https://img.ereality.ru/map/obj/22004.png?v2016c",
                        'Гильдия мастеровых': "https://img.ereality.ru/map/obj/11009.png?v2016c",
                    }
                    if (obj[title] !== undefined) {
                        return obj[title];
                    }
                    let title_custom = title.split(' ');
                    let tc = "";
                    $.each(title_custom, function (k, v) {
                        tc += v;
                        if (obj[tc] !== undefined) {
                            img = obj[tc];
                            return img;
                        }
                        tc += " ";
                    });
                    return img;
                },
                this.TeleportPlace = function (key) {
                    if (this.TeleportPlaces[user.place2] === undefined) {
                        return 0;
                    }
                    if (this.TeleportPlaces[user.place2][key] === undefined) {
                        return 0;
                    }
                    return this.TeleportPlaces[user.place2][key];
                },
                this.TeleportSort = function (places) {
                    let places_new = [];
                    $.each(places, function (key, val) {
                        let new_place = {
                            id: key,
                            title: val,
                            count: self.TeleportPlace(key)
                        }
                        places_new.push(new_place);
                    });
                    console.info(places_new);
                    places_new.sort((a, b) => b.count - a.count);
                    return places_new;
                },
                this.TeleportItem = function (key, uid, title) {
                    let item = '<li id="trapItem' + key + '" style="padding: 0 2px">\n' +
                        '    <a href="#" onclick="dialogs.TeleportUse(' + uid + ',' + key + ');">\n' +
                        '        <b class="itemName">' + title + '</b><br>\n' +
                        '        <img src="' + this.TeleportImage(title) + '" style="display: inline">\n' +
                        '    </a>\n' +
                        '</li>';
                    return item;
                },
                this.TemplateTeleport = function (title, subtitle, uid, places) {

                    let HTML = '<ul class="CutMonster CutTeleport" id="trapItemsList">';
                    let places_sort = this.TeleportSort(places);
                    $.each(places_sort, function (key, place) {
                        HTML += self.TeleportItem(place.id, uid, place.title);
                    });
                    HTML += "</ul>";
                    this.ShowForm();
                    this.PrintMenu(title, subtitle);
                    this.PrintHTML(HTML);
                },
                this.TeleportUse = function (uid, cpdPlace) {

                    if (this.TeleportPlaces[user.place2] === undefined) {
                        this.TeleportPlaces[user.place2] = {};
                    }
                    if (this.TeleportPlaces[user.place2][cpdPlace] === undefined) {
                        this.TeleportPlaces[user.place2][cpdPlace] = 0;
                    }
                    this.TeleportPlaces[user.place2][cpdPlace]++;
                    this.saveOptions();

                    var data = {
                        controller: "map",
                        action: "mapUseTeleport",
                        params: {
                            client: 1,
                            cpdPlace: cpdPlace,
                            uid: uid
                        }
                    };
                    $.ajax({
                        type: "POST",
                        url: "/ajax/json.php",
                        dataType: "json",
                        data: JSON.stringify(data),
                        success: function (data) {
                            self.HideForm();
                            top.core.isset(data.response.core.messages) && (top.core.trigger("move"),
                                top.core.alertMsg(data.response.core.messages[0])),
                            top.core.isset(data.response.core.errors) && top.core.alertError(data.response.core.errors[0])
                        }
                    });
                    return false;
                },
                this.PrintMenu = function (title, subtitle) {
                    let HTML = '<table  class="textM"  align="center" width="100%"><tr><td align="left"><b>' + title + '</b></td><td id="mess_menu" valign="top" align="right"><table class="textM"><tr>';
                    HTML += '<td><b>' + subtitle + "</b></td>"
                    HTML += "<td>|</td>"
                    HTML += "</tr></table></td></tr></table>";
                    $("#dialogMenu", this.FormID).html(HTML)
                },
                this.PrintHTML = function (LoadData) {
                    $(this.ParentElement).html(LoadData)
                },

                this.loadOptions = function () {
                    let teleportOptions = localStorage.getItem('teleport');
                    if (teleportOptions) {
                        this.TeleportPlaces = JSON.parse(teleportOptions);

                    }

                },
                this.saveOptions = function () {
                    localStorage.setItem('teleport', JSON.stringify(this.TeleportPlaces))
        }

        };
        var dialogsTP = new _Dialogs();
        dialogsTP.loadOptions();
	}).toString() + ")();";