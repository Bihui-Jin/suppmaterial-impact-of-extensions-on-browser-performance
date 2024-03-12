	var estateVictimsListViewerClass = function(estateVictimsList, popup, css, anchorID, systemOptions) {
		this.estateVictimsList = estateVictimsList;
		this.popup = popup;
		this.css = css;
		this.anchor = $('#' + anchorID);
		
		this.isVisible = false;
		this.popupPositionX = 0; 
		this.popupPositionY = 0; 
		
		this.mainHolder = $('<table></table>');
		this.victimsHolder = $('<table></table>').css(this.css.victimsHolder);
		this.globalHolder = $(document);
		
		this.dragNdropHolder = null;
		this.victimNameInput = null;
		this.victimCommentInput = null;
		this.addButton = null;
		this.closeButton = null;		
		
		this.victimsAmount = null;
		
		this.inMove = false;
		
		var self = this;
		
		this.init = function() {
			self.initForm();
			self.popup.setCanGoOverBorder(true);
			self.initPopupPosition();
		}
		
		this.initForm = function() {
			self.mainHolder.append(self.buildTop())
				.append(self.buildMiddle())
				.append(self.buildBottom());		
		};
		
		this.initPopupPosition = function() {
			if (systemOptions.estateVictims.popupPositionX != -1) {
				self.popupPositionX = systemOptions.estateVictims.popupPositionX;
				self.popupPositionY = systemOptions.estateVictims.popupPositionY;
				
				return;
			}
			
			var position = self.anchor.offset();
			
			self.popupPositionX = position.left + self.anchor.width() + 10;
			self.popupPositionY = position.top;
		};
		
		this.initListeners = function() {
			self.closeButton.on('click', function() {
				self.closeButton.attr('src', self.css.closeButtonImg);
				self.hide();
			}).hover(function() {
				self.closeButton.attr('src', self.css.closeButtonHoverImg);
			}, function() {
				self.closeButton.attr('src', self.css.closeButtonImg);
			});		
		
			self.victimAddButton.on('click', function() {			
				self.processAddVictimClick(self.victimNameInput, self.victimCommentInput);
			});
			
			self.initDragNDrop(self.globalHolder, self.dragNdropHolder);
		};
		
		this.buildTop = function() {
			var victimsAmountHolder = $('<span></span>').css(self.css.amountHolder);
					
			self.victimsAmount = $('<span></span>').html(self.estateVictimsList.getCurrentVictimsAmount());
			
			victimsAmountHolder.append($('<span/>', {text:"Жертв: "})).append(self.victimsAmount).append($('<span/>', {text:" из " + self.estateVictimsList.getMaxVictimsAmount()}));
			self.closeButton = $('<img/>', {src:self.css.closeButtonImg }).css(self.css.closeButton);

			var topTr = $('<tr></tr>').css(self.css.topLine);
			self.dragNdropHolder = topTr;			
			
			var topTd = $('<td/>', {colspan:2, align:"right"})
				.append(victimsAmountHolder)
				.append(self.closeButton);			

			return topTr.append(topTd);
		};
		
		this.savePopupPosition = function() {
			systemOptions.estateVictims.popupPositionX = self.popupPositionX;
			systemOptions.estateVictims.popupPositionY = self.popupPositionY;
			
			kango.invokeAsync('kango.storage.setItem', 'systemOptions', systemOptions);
		};		
		
		this.buildMiddle = function() {
			var bottomTd = $('<td/>', {colspan:2, align:"right"}).append(self.victimsHolder);
			
			return $('<tr></tr>').append(bottomTd);
		};
		
		this.buildBottom = function() {
			self.victimNameInput = $('<input/>', {type:"text", title:"Имя жертвы"}).css(self.css.victimNameInput);
			self.victimCommentInput = $('<input/>', {type:"text", title:"Комментарий"}).css(self.css.victimCommentInput);
			
			self.victimAddButton = $("<img/>", {title:"Добавить", src:self.css.addVictimButtonImg}).css(self.css.victimAddButton);
					
			var bottomTr = $('<tr></tr>');
			var leftTd = $('<td>', {align:"right"}).append(self.victimNameInput).append($('<br>')).append(self.victimCommentInput);
			var rightTd = $('<td></td>').append(self.victimAddButton);
			
			return bottomTr.append(leftTd).append(rightTd);
		};
		
		this.processAddVictimClick = function(victimNameInput, commentInput) {
			var victimName = victimNameInput.val();
			var comment = commentInput.val();
			if (self.estateVictimsList.addVictim(victimName, comment)) {		
				self.victimsHolder.append(
					self.buildVictimListItem(victimName, comment)
				);
				
				self.victimsAmount.html(self.estateVictimsList.getCurrentVictimsAmount());
				victimNameInput.val('');
				commentInput.val('');
			}
		};
		
		this.initDragNDrop = function(globalHolder, eventTarget) {
			var xDelta = 0;
			var yDelta = 0;
			
			globalHolder.on('mousemove', function(event) {				
				if (!self.inMove) {
					return;
				}

				self.popupPositionX = event.pageX + xDelta;
				self.popupPositionY = event.pageY + yDelta;
				
				if (self.popupPositionY < 0) {
					self.popupPositionY = 0;
				}
				
				if (self.popupPositionY > 500) {
					self.popupPositionY = 500;
				}

				self.popup.move(self.popupPositionX, self.popupPositionY, 0, 0);
			}).on('mouseup', function() {
				self.inMove = false;
				self.savePopupPosition();
			});
			
			eventTarget.on('mousedown', function() {
				self.inMove = true;		
				
				xDelta = self.popupPositionX - event.pageX;
				yDelta = self.popupPositionY - event.pageY;
			});
		};
		
		this.processDeleteVictimClick = function (victimName, button) {
			self.estateVictimsList.removeVictim(victimName);
			$(button).parent().parent().remove();	
			
			self.victimsAmount.html(self.estateVictimsList.getCurrentVictimsAmount());
		};
		
		this.buildVictimListItem = function(victimName, comment) {
			var victimTr = $('<tr></tr>');
			
			var attackButton = $("<img/>", {title:"Атаковать", src:self.css.attackButtonImg}).css(self.css.attackButton).on('click', function() {
				self.processAttackVictimClick(victimName);	
			});
			
			var deleteButton = $("<img/>", {title:"Удалить", src:self.css.deleteButtonImg}).css(self.css.deleteButton).on('click', function() {
				self.processDeleteVictimClick(victimName, this);
			});			
			
			var victimNameLink = $('<a/>', {href:"http://usercp.ereality.ru/services/estate?name=" + victimName, target:"_blank", text: victimName}).css(self.css.victimNameLink);
			var victimCommentDiv = $('<div/>', {text:comment}).css(self.css.victimCommentDiv);
			
			var victimNameTd = $('<td></td>').append(victimNameLink).append(victimCommentDiv);
			var attackTd = $('<td></td>').append(attackButton);
			var deleteTd = $('<td></td>').append(deleteButton);
			
			victimTr.append(victimNameTd)
				.append(attackTd)
				.append(deleteTd);
			
			return victimTr;			
		};
		
		this.show = function() {
			$.each(self.estateVictimsList.getVictimsList(),  function(key) {
				self.victimsHolder.append(self.buildVictimListItem(key, this.comment));
			});

			self.initListeners();
			self.popup.show(self.mainHolder).move(self.popupPositionX, self.popupPositionY, 0, 0);
			
			self.isVisible = true;
		};
		
		this.hide = function() {
			self.victimsHolder.empty();
			self.popup.hide();			
			self.isVisible = false;
		};
		
		this.processAttackVictimClick = function(victimName) {
			var attackInput = $('#estateAttackHeroField');
			
			if (attackInput.length > 0) { 
				$('#estateAttackHeroField').val(victimName);
				$('#estateAnswer_0')[0].click();
			} 
		};
		
		this.toggleShow = function() {
			if (self.isVisible) {
				self.hide();
				return;
			}			
			
			self.show(); 
		};
		
		this.getIsVisible = function() {
			return self.isVisible;
		};
		
		this.setVictimName = function(victimName) {
			self.victimNameInput.val(victimName);
		};
	}