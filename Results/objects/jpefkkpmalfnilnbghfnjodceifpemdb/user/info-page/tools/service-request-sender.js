var serviceRequestSenderClass = function(params) {  
	this.send = function(params, callback) {
		var details = {
			method: params.method,
			url: params.url,
			async: true,
			params: params.data,
			headers: params.headers,
			contentType: 'text',
			mimeType: params.overrideMimeType
		}; 

		kango.xhr.send(details, function(data) {
			if (data.status == 200 && data.response != null) {
				callback(data.response);
			}
		});
	}
}