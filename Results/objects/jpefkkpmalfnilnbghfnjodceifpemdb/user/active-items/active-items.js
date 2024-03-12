var userActiveItems = function(dataUrl, messagingEnum) {
	this.dataUrl = dataUrl;
	this.messagingEnum = messagingEnum;

	this.requestId = 0;
	this.successStatus = 200;
	this.items;
	
	var self = this;

	this.getItems = function(userName, hash) {
		kango.browser.tabs.getCurrent(function(tab) {
			var requestId = self.requestId + 1;
			self.requestId = requestId;

			kango.xhr.send(self.prepareRequestParams(userName), function(data) {
				if (!self.checkResponse(data, requestId)) {
					return;
				}
				
				try {
					self.items = $.parseJSON(data.response);
				}
				catch(e) {
					self.items = {};
				}
			
				tab.dispatchMessage(self.messagingEnum.usersListActiveItemsContent, {items: self.items, hash: hash});
			});
		});
	};
	
	this.prepareRequestParams = function(userName) {
		return {
			url: this.dataUrl,
			method: 'GET',
			params: {
				user: userName
			},
			async: true,
			contentType: 'text'
		};	
	};
	
	this.checkResponse = function(data, requestId) {
		return data.status == this.successStatus && data.response != null && requestId == this.requestId;
	}
}
