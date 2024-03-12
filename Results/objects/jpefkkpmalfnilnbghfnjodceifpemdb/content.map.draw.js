// ==UserScript==
// @name     ErExt_MapDraw
// @include     www.ereality.ru/core/*
// @require     tools.js
// @all-frames  false
// ==/UserScript==

var pluginOptions = mergeOptions(kango.storage.getItem('options'), defaultConfig.myoptions);
var pluginSystemOptions =  mergeOptions(kango.storage.getItem('systemOptions'), defaultConfig.systemOptions);

var contentMapDraw = "(" +
    (function() {
        var pluginOptions = pluginOptionsReplace;
        var pluginSystemOptions = pluginSystemOptionsReplace;

        var turquoiseGridConfig = {
            'sectors': [
                {x: 12, y: 321},
                {x: 13, y: 321},
                {x: 14, y: 321},
                {x: 15, y: 321},
                {x: 16, y: 321},
                {x: 17, y: 321},
                {x: 18, y: 321},
                {x: 19, y: 321},
                {x: 13, y: 322},
                {x: 14, y: 322},
                {x: 15, y: 322},
                {x: 16, y: 322},
                {x: 17, y: 322},
                {x: 18, y: 322},
                {x: 19, y: 322},
                {x: 20, y: 322},
                {x: 12, y: 323},
                {x: 13, y: 323},
                {x: 14, y: 323},
                {x: 15, y: 323},
                {x: 16, y: 323},
                {x: 17, y: 323},
                {x: 18, y: 323},
                {x: 19, y: 323},
                {x: 13, y: 324},
                {x: 14, y: 324},
                {x: 15, y: 324},
                {x: 16, y: 324},
                {x: 17, y: 324},
                {x: 18, y: 324},
                {x: 19, y: 324},
                {x: 20, y: 324},
                {x: 12, y: 325},
                {x: 13, y: 325},
                {x: 14, y: 325},
                {x: 15, y: 325},
                {x: 16, y: 325},
                {x: 17, y: 325},
                {x: 18, y: 325},
                {x: 19, y: 325},
                {x: 13, y: 326},
                {x: 14, y: 326},
                {x: 15, y: 326},
                {x: 16, y: 326},
                {x: 17, y: 326},
                {x: 18, y: 326},
                {x: 19, y: 326},
                {x: 20, y: 326},
                {x: 12, y: 327},
                {x: 13, y: 327},
                {x: 14, y: 327},
                {x: 15, y: 327},
                {x: 16, y: 327},
                {x: 17, y: 327},
                {x: 18, y: 327},
                {x: 19, y: 327},
                {x: 13, y: 328},
                {x: 14, y: 328},
                {x: 15, y: 328},
                {x: 16, y: 328},
                {x: 17, y: 328},
                {x: 18, y: 328},
                {x: 19, y: 328},
                {x: 20, y: 328},
                {x: 12, y: 329},
                {x: 13, y: 329},
                {x: 14, y: 329},
                {x: 15, y: 329},
                {x: 16, y: 329},
                {x: 17, y: 329},
                {x: 18, y: 329},
                {x: 19, y: 329},
                {x: 13, y: 330},
                {x: 14, y: 330},
                {x: 15, y: 330},
                {x: 16, y: 330},
                {x: 17, y: 330},
                {x: 18, y: 330},
                {x: 19, y: 330},
                {x: 20, y: 330},
                {x: 12, y: 331},
                {x: 13, y: 331},
                {x: 14, y: 331},
                {x: 15, y: 331},
                {x: 16, y: 331},
                {x: 17, y: 331},
                {x: 18, y: 331},
                {x: 19, y: 331},
                {x: 13, y: 332},
                {x: 14, y: 332},
                {x: 15, y: 332},
                {x: 16, y: 332},
                {x: 17, y: 332},
                {x: 18, y: 332},
                {x: 19, y: 332},
                {x: 20, y: 332},
            ]
        };
        var malachiteGridConfig = {
            'sectors': [
                {x: 45, y: 389},
                {x: 45, y: 391},
                {x: 45, y: 393},
                {x: 45, y: 395},
                {x: 45, y: 397},
                {x: 45, y: 399},
                {x: 45, y: 401},
                {x: 46, y: 389},
                {x: 46, y: 390},
                {x: 46, y: 391},
                {x: 46, y: 392},
                {x: 46, y: 393},
                {x: 46, y: 394},
                {x: 46, y: 395},
                {x: 46, y: 396},
                {x: 46, y: 397},
                {x: 46, y: 398},
                {x: 46, y: 399},
                {x: 46, y: 400},
                {x: 46, y: 401},
                {x: 46, y: 402},
                {x: 47, y: 389},
                {x: 47, y: 390},
                {x: 47, y: 391},
                {x: 47, y: 392},
                {x: 47, y: 393},
                {x: 47, y: 394},
                {x: 47, y: 395},
                {x: 47, y: 396},
                {x: 47, y: 397},
                {x: 47, y: 398},
                {x: 47, y: 399},
                {x: 47, y: 400},
                {x: 47, y: 401},
                {x: 47, y: 402},
                {x: 48, y: 389},
                {x: 48, y: 390},
                {x: 48, y: 391},
                {x: 48, y: 392},
                {x: 48, y: 393},
                {x: 48, y: 394},
                {x: 48, y: 395},
                {x: 48, y: 396},
                {x: 48, y: 397},
                {x: 48, y: 398},
                {x: 48, y: 399},
                {x: 48, y: 400},
                {x: 48, y: 401},
                {x: 48, y: 402},
                {x: 49, y: 389},
                {x: 49, y: 390},
                {x: 49, y: 391},
                {x: 49, y: 392},
                {x: 49, y: 393},
                {x: 49, y: 394},
                {x: 49, y: 395},
                {x: 49, y: 396},
                {x: 49, y: 397},
                {x: 49, y: 398},
                {x: 49, y: 399},
                {x: 49, y: 400},
                {x: 49, y: 401},
                {x: 49, y: 402},
                {x: 50, y: 389},
                {x: 50, y: 390},
                {x: 50, y: 391},
                {x: 50, y: 392},
                {x: 50, y: 393},
                {x: 50, y: 394},
                {x: 50, y: 395},
                {x: 50, y: 396},
                {x: 50, y: 397},
                {x: 50, y: 398},
                {x: 50, y: 399},
                {x: 50, y: 400},
                {x: 50, y: 401},
                {x: 50, y: 402},
                {x: 51, y: 389},
                {x: 51, y: 390},
                {x: 51, y: 391},
                {x: 51, y: 392},
                {x: 51, y: 393},
                {x: 51, y: 394},
                {x: 51, y: 395},
                {x: 51, y: 396},
                {x: 51, y: 397},
                {x: 51, y: 398},
                {x: 51, y: 399},
                {x: 51, y: 400},
                {x: 51, y: 401},
                {x: 51, y: 402},
                {x: 52, y: 390},
                {x: 52, y: 392},
                {x: 52, y: 394},
                {x: 52, y: 396},
                {x: 52, y: 398},
                {x: 52, y: 400},
                {x: 52, y: 402}
            ]
        };

        var turquoiseGridClass = function(mainFrame, config) {
            this.mainFrame = mainFrame;
            this.config = config;
            this.overlay = null;

            var self = this;

            this.usersMoved = function(map) {
                var overlay = self.getOverlay(map);
                self.moveCellsToPosition(overlay);

                map.append(self.overlay);
            }

            this.moveCellsToPosition = function(overlay) {
                overlay.children().each(function() {
                    var footstep = $(this);

                    var sectorPositions = main.Map.globalCoordsToRelative(
                        main.Map.getCellGlobalCoords(footstep.attr('sectorX'), footstep.attr('sectorY'))
                    );

                    footstep.css({
                        left: sectorPositions.x + "px",
                        top: sectorPositions.y + "px"
                    });
                });
            }

            this.getOverlay = function(map) {
                if (!self.overlay) {
                    self.overlay = $('<div class="sectors_overlay"></div>');

                    for (var i in self.config['sectors']) {
                        self.overlay.append(self.getCell(
                            self.config['sectors'][i]['x'],
                            self.config['sectors'][i]['y']
                        ))
                    }
                }

                return self.overlay;
            }

            this.getCell = function(positionX, positionY) {
                return $('<div sectorX="' + positionX + '" sectorY="' + positionY + '"></div>').css({
                    position: 'absolute',
                    height: '32px',
                    width: '64px',
                    lineHeight: '32px',
                    textAlign: 'center',
                    zIndex: '30',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    opacity: '0.6',
                    color: '#222',
                    textShadow: '0 0 5px #eee',
                    'background-image': 'url(turquoiseGridImgReplace)'
                });
            }
        }
        var turquoiseFlagsClass = function(mainFrame) {
            this.mainFrame = mainFrame;
            this.overlay = null;

            this.flags = {};

            var self = this;

            this.init = function() {
                self.getOverlay();

                self.loadFlags();
                self.updateFlags();

                return self;
            }

            this.usersMoved = function(map) {
                var overlay = self.getOverlay();

                if (typeof localStorage['turquoise_flags_update'] == 'undefined' ||
                    localStorage['turquoise_flags_update'] == 'true') {

                    localStorage['turquoise_flags_update'] = false;

                    self.loadFlags();
                    self.updateFlags();
                }

                if (typeof localStorage['turquoise_flags_cleared'] != 'undefined' &&
                    localStorage['turquoise_flags_cleared'] == 'true' ) {
                    localStorage['turquoise_flags_cleared'] = false;

                    self.clear();
                }

                self.moveCellsToPosition();
                self.moveCellsToPosition(overlay);

                map.append(self.overlay);
            }

            this.clear = function() {
                self.flags = {};
                self.overlay = null;
            }

            this.moveCellsToPosition = function() {
                for (var x in self.flags) {
                    for (var y in self.flags[x]) {
                        var currentFlag = self.flags[x][y];

                        var sectorPositions = main.Map.globalCoordsToRelative(
                            main.Map.getCellGlobalCoords(x, y)
                        );

                        currentFlag['block'].css({
                            left: sectorPositions.x + "px",
                            top: sectorPositions.y + "px"
                        })
                    }
                }
            }

            this.loadFlags = function() {
                var turquoiseFlags = localStorage['turquoise_flags'];
                if (typeof turquoiseFlags != "undefined") {
                    turquoiseFlags = JSON.parse(turquoiseFlags);
                }
                else {
                    turquoiseFlags = {};
                }

                for (var x in turquoiseFlags) {
                    for (var y in turquoiseFlags[x]) {
                        if (typeof self.flags[x] == 'undefined') {
                            self.flags[x] = {};
                        }

                        if (typeof self.flags[x][y] == 'undefined') {
                            self.flags[x][y] = {
                                'block': null
                            };
                        }

                        self.flags[x][y]['percent'] = turquoiseFlags[x][y]['percent'];
                        self.flags[x][y]['totalPercent'] = turquoiseFlags[x][y]['totalPercent'];
                    }
                }
            }

            this.updateFlags = function() {
                for (var x in self.flags) {
                    for (var y in self.flags[x]) {
                        var currentFlag = self.flags[x][y];

                        if (!currentFlag['block']) {
                            var flag = self.getCell();
                            currentFlag['block'] = flag;

                            self.overlay.append(flag);
                        }

                        currentFlag['block'].find('p').text(currentFlag['percent'] + '(' + currentFlag['totalPercent'] + ')%');
                    }
                }
            }

            this.getOverlay = function() {
                if (!self.overlay) {
                    self.overlay = $('<div class="flags_overlay"></div>');
                }

                return self.overlay;
            }

            this.getCell = function() {
                return $('<div></div>').css({
                    position: 'absolute',
                    height: '32px',
                    width: '64px',
                    lineHeight: '32px',
                    textAlign: 'center',
                    zIndex: '41',
                    fontWeight: 'bold',
                    'font-size': '8px',
                    'color': 'white',
                    'font-weight': '400'
                }).append(
                    $('<p></p>').css({
                        'margin-top': '9px'
                    })
                );
            }
        }

        $(document).ready(function() {
            var erExtMainFraime = $('#main');

            if (pluginOptions.turquoise_grid) {
                var turquoiseGrid = new turquoiseGridClass(erExtMainFraime, turquoiseGridConfig);
                var malachiteGrid = new turquoiseGridClass(erExtMainFraime, malachiteGridConfig);
            }
			pluginOptions.geologistEnabled = true;
            if (pluginOptions.geologistEnabled) {
                var turquoiseFlags = new turquoiseFlagsClass(erExtMainFraime).init();
                var malachiteFlags = new turquoiseFlagsClass(erExtMainFraime).init();
            }

            erExtMainFraime.on('load', function() {
                var drawed = false;
                var turquoiseGridEnabled = pluginOptions.turquoise_grid;
				var turqoiseFlagsEnabled = pluginOptions.geologistEnabled
                && typeof localStorage['turquoise_flags_run'] != 'undefined'
                    && localStorage['turquoise_flags_run'] == 'true';

                if (typeof window.frames.main.Map == 'undefined' ||
                    typeof window.frames.main.Map.draw == 'undefined') {
                    return;
                }

                window.frames.main.Map.drawOld = window.frames.main.Map.draw;

                window.frames.main.Map.extensionDraw = function(mainFrame) {
                    if (drawed) {
                        return;
                    }

                    var map = mainFrame.contents().find('#mapContent');

                    if (map.length == 0) {
                        return;
                    }

                    drawed = true;

                    if (user.place2 == 25) {
                        if (turquoiseGridEnabled) {
                            turquoiseGrid.usersMoved(map);
                        }

                        if (turqoiseFlagsEnabled) {
                            turquoiseFlags.usersMoved(map);
                        }
                    }

                    if (user.place2 == 28) {
                        if (turquoiseGridEnabled) {
                            malachiteGrid.usersMoved(map);
                        }

                        if (turqoiseFlagsEnabled) {
                            malachiteFlags.usersMoved(map);
                        }
                    }
                }

                window.frames.main.Map.draw = function() {
                    window.frames.main.Map.drawOld();

                    window.frames.main.Map.extensionDraw(erExtMainFraime);
                }

                window.frames.main.Map.extensionDraw(erExtMainFraime);
            });
        });
    }).toString() + ")();";

contentMapDraw = contentMapDraw.replace('pluginOptionsReplace', JSON.stringify(pluginOptions))
    .replace('pluginSystemOptionsReplace', JSON.stringify(pluginSystemOptions))
    .replace("turquoiseGridImgReplace", ((pluginSystemOptions.turquoise_grid_map).length>0)?(((pluginSystemOptions.turquoise_grid_map).search("res/")>=0)?(kango.io.getResourceUrl(pluginSystemOptions.turquoise_grid_map)):(pluginSystemOptions.turquoise_grid_map)):(kango.io.getResourceUrl('res/infliction_layer_blue.png')));

inject_global(contentMapDraw);