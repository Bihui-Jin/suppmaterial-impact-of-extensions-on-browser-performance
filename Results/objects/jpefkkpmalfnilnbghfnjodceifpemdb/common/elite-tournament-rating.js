var eliteTournamentRatingClass = function(popup) {
    this.popup = popup;
    this.imgResultMap = {
        'https://img.ereality.ru/t/1.png': 'lost',
        'https://img.ereality.ru/t/2.png': 'nowinner',
        'https://img.ereality.ru/t/3.png': 'win'
    };

    this.battleTypeMap = {
        1: 'win',
        2: 'nowinner',
        3: 'lost',
        5: 'waiting'
    };

    this.battleTypeNames = {
        'win': 'Победы',
        'nowinner': 'Ничьи',
        'lost': 'Поражения',
        'waiting': 'Предстоящие'
    };

    this.eliteMember = {};
    this.backgroundColorInActive = '#D5D5D5';
    this.backgroundColorActive = '#BBB';

    var self = this;

    this.init = function() {
        var trs = $('b:contains("Участники")').parent().parent().parent().find('tr').slice(2);

        self.initMembers(trs);
        self.initListeners(trs);
    }

    this.initMembers = function(trs) {
        trs.each(function() {
            var current = $(this);
            var tds = current.find('td');

            var id = parseInt(tds.eq(0).text());

            var memberName = tds.eq(1).find('b').text();

            var memberBattles = {
                'win': [],
                'lost': [],
                'nowinner': [],
                'waiting': []
            };

            tds.slice(3, 8).each(function(key) {
                var current = $(this);

                if (typeof self.battleTypeMap[key + 1] != 'undefined') {
                    current.attr('battleID', self.battleTypeMap[key + 1])
                        .attr('heroID', id).css({"cursor": "pointer"});
                }
            });

            tds.slice(8).each(function(key) {
                var img = $(this).attr('heroID', key + 1).find('img');

                if (img.length == 0) {
                    memberBattles['waiting'].push(key + 1);
                }

                var resultKey = img.attr('src');

                if (typeof self.imgResultMap[resultKey] != 'undefined') {
                    memberBattles[self.imgResultMap[resultKey]].push(key + 1);
                }
            });

            self.eliteMember[id] = {
                'name': memberName,
                'battles': memberBattles
            }
        });
    }

    this.initListeners = function(trs) {
        trs.on('click', function() {
            trs.css({'background-color': self.backgroundColorInActive});

            $(this).css({'background-color': self.backgroundColorActive})
        }).on('mouseenter', 'td', function() {
            var current = $(this);

            var battleID = current.attr('battleID');
            var heroID = current.attr('heroID');

            if(typeof heroID == 'undefined' || typeof battleID != 'undefined') {
                return;
            }
			
			var view = $("<div/>", {class:"text"}).css({
                "font-size": "14px",
                "padding": "5px"
            }).text(self.eliteMember[heroID]['name']);

            self.popup.hide().show(view).move(current.offset().left - view.width(), current.offset().top - view.height(), 0, -10);
        }).on('mouseleave', 'td', function() {
            if(typeof $(this).attr('battleID') != 'undefined') {
                return;
            }

            self.popup.hide();
        }).on('click', 'td', function() {
            var current = $(this);

            var battleID = current.attr('battleID');
            var heroID = current.attr('heroID');

            if (typeof battleID == 'undefined') {
                return;
            }
		
			var view = $('<div/>', {class:"text"}).css({
                "font-size": "14px",
                "padding": "5px"
            }).text(self.eliteMember[heroID]['name']);
          
			var view = $('<table/>', {class:"text"}).css({
                "font-size": "14px",
                "padding": "5px"
            });

            view.append(
				$("<tr/>").append($("<td/>", {colspan:6})).css({"text-align": "center"})
                    .children()
					.append($('<b>', {text:self.battleTypeNames[battleID]}))
                    .parent()
            );

            var tr = $('<tr/>');

            for(var i in self.eliteMember[heroID]['battles'][battleID]) {
                var id = self.eliteMember[heroID]['battles'][battleID][i];

                if (i > 0 && i % 6 == 0) {
                    view.append(tr);

                    tr = $('<tr/>');
                }

                var td = $('<td/>').append(self.eliteMember[id]['name'])
                    .append(
                    $('<a/>', {target:"_blank"})
                       .attr("href", "https://www.ereality.ru/~" + encodeURI(self.eliteMember[id]['name']))
					   .append('<img/>', {border:"0", src:"https://img.ereality.ru/inf.gif", 'class':"inf"})
                );

                tr.append(td);
            }

            view.append(tr);

            self.popup.hide().show(view).move(current.offset().left, current.offset().top - view.height(), 10, -10);
        });
    }
}