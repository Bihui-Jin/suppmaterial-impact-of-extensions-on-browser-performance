var estateVictimsClass = function() {	
	this.victimsList = {};

	this.maxVictimsAmount = 150;	
	this.currentVictimsAmount = 0;
	
	this.victimNameMaxLength = 18;
	this.commentMaxLength = 30;
	var self = this;	
	
	this.init = function(victimsList) {
		self.victimsList = victimsList;
		
		self.currentVictimsAmount = Object.keys(victimsList).length;
	};
	
	this.addVictim = function(victimName, comment) {
		if (!self._isNameValid(victimName) || typeof self.victimsList[victimName] !== 'undefined' || self.currentVictimsAmount >= self.maxVictimsAmount) {
			return false;
		}

		if (comment.length > self.commentMaxLength) {
			return false;
		}

		self.currentVictimsAmount++;
		self.victimsList[victimName] = {'comment': comment};
		
		kango.invokeAsync('kango.storage.setItem', 'estateVictims', self.victimsList);

		return true;
	};
	
	this._isNameValid = function(victimName) {
		return victimName.length > 0 && victimName.length <= self.victimNameMaxLength;
	};
	
	this.removeVictim = function(victimName) { 
		delete self.victimsList[victimName];
		self.currentVictimsAmount--;
		
		kango.invokeAsync('kango.storage.setItem', 'estateVictims', self.victimsList);
	};
	
	this.getVictimsList = function() {
		return self.victimsList;
	};
	
	this.getMaxVictimsAmount = function() {
		return self.maxVictimsAmount;
	};
	
	this.getCurrentVictimsAmount = function() {
		return self.currentVictimsAmount;
	}
}