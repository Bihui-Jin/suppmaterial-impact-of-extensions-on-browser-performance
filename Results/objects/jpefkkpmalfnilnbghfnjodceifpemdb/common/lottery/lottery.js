var lotteryClass = function () {
	var self = this;
		
	this.fillArray = function(arrayLength) {
		var filledArray = [];
		for (var i = 0; i < arrayLength; i++) {
			filledArray[i] = i + 1;
		} 
		
		return filledArray;
	};
	
	/**
		@param array - array of numbers
		@param amount - amount of random numbers from array
		@return sorted array of random numbers
	*/
	this.getRandomNumbers = function(array, amount) {
		var randomNumbers = [];
		var maxArrayIndex = array.length - 1;
		
		for (var i = 0; i < amount; i++) {
			var position = Math.round(Math.random() * maxArrayIndex);
			
			randomNumbers.push(array[position]);
			
			array[position] = array[maxArrayIndex];
			maxArrayIndex--;	
		}
		
		return randomNumbers.sort(function(a, b) {
			if (a > b) {
				return 1;
			}		
			return -1;
		});
	};
	
	this.resetLotteryTicket = function() {
		$("img[src$='_b.png']", top.frames.main.document).each(function() {
			this.click();
		});
	};
	
	this.selectLotteryNumbers = function(lotteryNumbers) {
		$.each(lotteryNumbers, function(key) {
			$("img[src$='" + this + "_a.png']", top.frames.main.document)[0].click();
		});		
	};
	
	this.fillLotteryTicket = function(arrayOfNumbers, numbersToFill) {
		var randomNumbers = self.getRandomNumbers(arrayOfNumbers, numbersToFill);
		
		self.selectLotteryNumbers(randomNumbers);
	};
	
	this.fillSilverTicket = function() {
		self.resetLotteryTicket();
		self.fillLotteryTicket(self.fillArray(15), 5);
	};
	
	this.fillGoldTicket = function() {
		self.resetLotteryTicket();
		self.fillLotteryTicket(self.fillArray(14), 4);
	};
}