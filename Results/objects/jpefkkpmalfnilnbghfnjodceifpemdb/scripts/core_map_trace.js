var script_map_trace = "(" +
	(function() {
		var erExtMainFraime = $('#main');
		
		var _chest = function(mainFraime, user) {
			this.user = user;
			this.mainFraime = mainFraime;
			this.autosaveToCashe = false;
			this.turnedOn = false;
			this.teamStepsOn = false;
			
			this.maps = {
				'ok': {
					overlay: null,
					footsteps: {},
					basicFootSteps: {
						5 :{ 
							259: true,
							260: true,
							261: true
						},
						6: {
							260: true
						},
						8: {
							249: true,
							250: true,
							251: true
						},
						9: {
							250: true,
							271: true
						},
						10: {
							259: true,
							270: true,
							271: true,
							272: true
						},
						11: {
							258: true,
							259: true,
							260: true
						},
						14: {
							251: true,
							252: true,
							253: true
						},
						15: {
							252: true,
							263: true,
							264: true,
							265: true
						},
						16: {
							264: true
						}
						
					},
					mapNew: false,
					customImages: {
						6: {
							260: 'sec_avto'
						},
						8: {
							249: 'sec_avto'
						},
						10: {
							271: 'sec_avto'
						},
						15: {
							252: 'sec_avto'
						},
						16: {
							264: 'sec_avto'
						}
					}
				},
				'aliens': {
					overlay: null,
					footsteps: {},
					mapNew: false 
				},
				'ovl': {
					overlay: null,
					footsteps: {},
					mapNew: true
				},
				'opp': {
					overlay: null,
					footsteps: {},
					mapNew: true
				},
				'odl': {
					overlay: null,
					footsteps: {},
					mapNew: false
				},
				'to': {
					overlay: null,
					footsteps: {},
					mapNew: true
				}
			};
			
			var self = this;
			
			this.drawOverlay = function(x, y, mapID) {
				if (self.maps[mapID].mapNew) {
					var map_div = self.mainFraime.contents().find('div#container #mapContent');
				} else {
					var map_div = self.mainFraime.contents().find('div#container #map_div');
				}

				if (map_div.length == 0) {
					return;
				}

				var overlay = self.getOverlay(mapID);
				
				self.addFootstep(x, y, mapID, overlay);
				self.moveFootstepsToPositions(overlay, mapID);
				
				map_div.append(overlay);
			};
			
			this.getOverlay = function(mapID) {
				if (self.maps[mapID]['overlay'] == null) {
					self.maps[mapID]['overlay'] = self.initOverlay(mapID, self.maps[mapID]['mapNew']);
				}
				
				return self.maps[mapID]['overlay'];
			};
			
			this.initOverlay = function(mapID, newmap) {
				var overlay = $('<div></div>');
				
				if (!newmap) {
					overlay.css({'position': 'absolute', 'overflow':'hidden', 'left': '28px', 'top': '22px', 'width':'504px', 'height':'300px'});
				}
				
				self.mergeFootsteps(mapID, self.getFootstepsFromCache(mapID));
				self.mergeFootsteps(mapID, self.maps[mapID]['basicFootSteps']);
				self.drawBasicFootsteps(overlay, mapID);
				
				return overlay;
			};

			this.getSectorPosition = function(x, y, newmap) {
				if (newmap) {
					Point = main.Map.globalCoordsToRelative(main.Map.getCellGlobalCoords(x, y))
					PointX = Point.x;
					PointY = Point.y;
				} else {
					var dx = (main.px - x) * 64 - (Math.abs(main.py - y) % 2) * 32 + (Math.abs(main.py - y) % 2) * (main.py % 2) * 64;
					var dy = (main.py - y) * 16;
					PointX = main.CenterX - dx;
					PointY = main.CenterY - dy;
				}

				return {
					X: PointX,
					Y: PointY
				};			
			};

			this.moveFootstepsToPositions = function(overlay, mapID) {
				overlay.children().each(function() {
					var footstep = $(this);
					
					var sectorPositions = self.getSectorPosition(footstep.attr('sectorX'), footstep.attr('sectorY'), self.maps[mapID].mapNew);
					footstep.css({
						left: sectorPositions.X,
						top: sectorPositions.Y,
					});
				});
			};
			
			this.addFootstep = function(x, y, mapID, overlay) {
				if (self.isFootstepExists(x, y, mapID)) {
					return;
				}
				
				overlay.append(self.getFootprint(x, y, mapID));				
				self.saveFootstep(x, y, mapID);
			};
			
			this.isFootstepExists = function(x, y, mapID) {
				if (typeof self.maps[mapID]['footsteps'][x] == 'undefined' || typeof self.maps[mapID]['footsteps'][x][y] == 'undefined') {
					return false;
				}
				
				return self.maps[mapID]['footsteps'][x][y];
			};
			
			this.saveFootstep = function(x, y, mapID) {
				if (typeof self.maps[mapID]['footsteps'][x] == 'undefined') {
					self.maps[mapID]['footsteps'][x] = {};
				}
				
				self.maps[mapID]['footsteps'][x][y] = true;
				
				if (self.autosaveToCashe) { 
					self.saveFootstepsToCache(mapID, self.maps[mapID]['footsteps']);
				}
			};
			
			this.saveFootsteps = function() {
				var mapID = self.detectMapID();
				
				if (mapID == null) {
					return;
				}
				
				self.saveFootstepsToCache(mapID, self.maps[mapID]['footsteps']);
			}
			
			this.saveFootstepsToCache = function(mapID, footsteps) {
				localStorage['ErExtFootsteps_' + mapID] = JSON.stringify(footsteps);
			};
			
			this.getFootstepsFromCache = function(mapID) {
				if (typeof localStorage['ErExtFootsteps_' + mapID] != 'undefined') {
					return JSON.parse(localStorage['ErExtFootsteps_' + mapID]);
				}
				
				return {};				
			};
			
			this.removeFootstepsFromCache = function(mapID) {
				localStorage.removeItem('ErExtFootsteps_' + mapID);
			}
			
			this.drawBasicFootsteps = function(overlay, mapID) {
				for (x in self.maps[mapID]['footsteps']) {					
					for (y in self.maps[mapID]['footsteps'][x]) {
						if (self.maps[mapID]['footsteps'][x][y]) {
							overlay.append(self.getFootprint(x, y, mapID));	
						}
					}
				}
			};
			
			this.mergeFootsteps = function(mapID, footsteps) {
				for (x in footsteps) {					
					for (y in footsteps[x]) {
						if (typeof self.maps[mapID]['footsteps'][x] == 'undefined') {
							self.maps[mapID]['footsteps'][x] = {};
						} 
						
						self.maps[mapID]['footsteps'][x][y] = footsteps[x][y];
					}
				}
			}
			
			this.getFootprint = function(positionX, positionY, mapID) {
				return $('<div sectorX="' + positionX + '" sectorY="' + positionY + '"><span>' + positionX + ':' + positionY + '</span></div>').css({
					position: 'absolute',
					height: '32px',
					width: '64px',
					lineHeight: '32px',
					textAlign: 'center',
					zIndex: '10',
					fontSize: '10px',
					fontWeight: 'bold',
					opacity: '0.6',
					color: '#222',
					textShadow: '0 0 5px #eee',
					'background-image': 'url(' + self.getBackgroundImg(positionX, positionY, mapID) + ')'
				});
			};
			
			this.getBackgroundImg = function(positionX, positionY, mapID) {
				var backgroundImg = 'sec_red.png';

				if (typeof self.maps[mapID]['customImages'] != 'undefined' 
					&& typeof self.maps[mapID]['customImages'][positionX] != 'undefined' 
						&& typeof self.maps[mapID]['customImages'][positionX][positionY] != 'undefined') {
					backgroundImg = self.maps[mapID]['customImages'][positionX][positionY];
	
				}

				return backgroundImg;
			}
			
			this.userMadeFootstep = function() {
				var mapID = self.detectMapID();
				
				if (mapID == null) {
					return;
				}
				
				self.footstepsForTeammate(mapID);
				self.drawOverlay(main.px, main.py, mapID);
			};
			
			this.detectMapID = function() {
				var mapID = null;
				
				if (self.user.coldX != "0,0") {
					mapID = 'odl';
				} else if (self.user.place2 == 8) {
					mapID = 'ok';
				} else if (self.user.place2 == 1) {
					mapID = 'ovl';
				} else if (self.user.place2 == 3) {
					mapID = 'opp';
				} else if (self.user.place2 == 14) {
					mapID = 'to';
				} else if (self.user.place2 >= 201 && self.user.place2 <= 340) {
					mapID = 'aliens';
				}
				
				return mapID;
			}
			
			this.clearOverlay = function(mapID) {
				if (typeof self.maps[mapID] == 'undefined') {
					return;
				}
				
				self.maps[mapID]['footsteps'] = {};
				
				if (typeof self.maps[mapID]['overlay'] != 'undefined') {
					self.maps[mapID]['overlay'] = null;
				}
			};
			
			this.clearFootstepsMap = function(mapID) {				
				self.clearOverlay(mapID);
				
				self.removeFootstepsFromCache(mapID);
			};
			
			this.clearFootstepsMaps = function() {
				for (mapID in self.maps) {
					self.clearFootstepsMap(mapID);
				}
			};
			
			this.isAutosaveToCashe = function() {
				return self.autosaveToCashe;
			};
			
			this.setAutosaveToCashe = function(autosaveToCashe) {
				self.autosaveToCashe = autosaveToCashe;
			};
			
			this.isTurnedOn = function() {
				return self.turnedOn;
			};

			this.setTurnedOn = function(turnedOn) {
				self.turnedOn = turnedOn;
			}
			
			this.setTeamStepsOn = function(teamStepsOn) { 
				self.teamStepsOn = teamStepsOn;
			};
						
			this.footstepsForTeammate = function(mapID) {
				if (mapID == 'to') {
					if (self.teamStepsOn && main.Map.additionalObjects!=undefined) {		
						var overlay = self.getOverlay(mapID);
						
						$.each(main.Map.additionalObjects, function(key) {
							var coords = key.split(":");
							self.addFootstep(coords[0], coords[1], mapID, overlay);
						});
					}
				}
			};
	};
		
		var chest = new _chest(erExtMainFraime, user);		
		chest.setTeamStepsOn('teamStepsOnReplace');
		
		
		$("#span_mode5").children().on("click", function() {
			chest.clearOverlay('aliens');
			chest.clearFootstepsMap('alians');
			
			chest.clearOverlay('odl');
			chest.clearFootstepsMap('odl');
		});				


		$(document).ready(function() {
			if (localStorage['isEnableTrace'] == 'true') { 
				chest.setTurnedOn(true);
				erExtMainFraime.on('load', chest.userMadeFootstep);
			}
			
			if (localStorage['isEnableTraceAutosave'] == 'true') {
				chest.setAutosaveToCashe(true);
			}

			$('#er-ex-footstep_img').on('click', function() {
				if (chest.isTurnedOn()) {
					chest.setTurnedOn(false);
					erExtMainFraime.off('load', chest.userMadeFootstep);
				}
				else {
					chest.setTurnedOn(true);
					erExtMainFraime.on('load', chest.userMadeFootstep);
				} 		
				
				localStorage['isEnableTrace'] = chest.isTurnedOn();
			});
			
			$('body').delegate('#footprint_clear', 'click', function() {
				chest.clearFootstepsMaps();
			}).delegate('#footprint_autosave', 'click', function() {
				if (chest.isAutosaveToCashe()) {
					chest.setAutosaveToCashe(false);
					$('#footprint_autosave_img_on').hide();
					$('#footprint_autosave_img_off').show();
				}
				else {
					chest.setAutosaveToCashe(true);
					$('#footprint_autosave_img_off').hide();
					$('#footprint_autosave_img_on').show();
				}
				
				localStorage['isEnableTraceAutosave'] = chest.isAutosaveToCashe();
			}).delegate('#footprint_save', 'click', function() {
				chest.saveFootsteps();
			});
		});
	}).toString() + ")();";