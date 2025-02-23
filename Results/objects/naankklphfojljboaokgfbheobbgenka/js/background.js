// make sure all existing pages get injected with the payload after installing the addon

chrome.runtime.onInstalled.addListener(function() {
    chrome.tabs.query({}, function(tabs) {
        tabs.forEach(function(tab) {
			// check to make sure we're not on a chrome page
            /*if (tab.url.indexOf('chrome://') !== -1 || tab.url.indexOf('chrome.google.com/webstore') !== -1) {
				return false;
			}
			else {
				chrome.tabs.executeScript(tab.id, {file: "js/contentscript.js"}, function() {
					return true;
				});
			}*/
        })
    })
});

chrome.browserAction.onClicked.addListener(function() {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            type: 'csToggleFrame',
            content: 'toggleFrame'
        })
    })
})

chrome.runtime.onMessage.addListener(function(message) {
	if (message.type === 'bgToggleFrame') {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				type: 'csToggleFrame',
				content: 'toggleFrame'
			})
		})
	}
});

chrome.runtime.onMessage.addListener(function(message, sender, response) {
	if (message.type === 'bgGetUrl') {	
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			response(tabs[0].url);
			
		});		
		return true;
	}		
});

chrome.runtime.onMessage.addListener(function(message) {
	if (message.type === 'bgHighlightedText') {
		chrome.tabs.query({
			active: true,
			currentWindow: true
		}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {
				type: 'tbsHighlightedText',
				content: message.content
			})
		})
	}
});

chrome.runtime.onMessage.addListener(function(message) {
	if (message.type === 'bgOpenUrl') {
		chrome.tabs.query({url: 'https://www.citemaker.com/*'}, function (tabs) {
			if (tabs.length > 0)
			{
				tab = tabs[0];
					chrome.tabs.update(tab.id, {url:message.content,active: true});
			}
			else
			{
				chrome.tabs.create({url: message.content}, null);
			}
		});
	}
});