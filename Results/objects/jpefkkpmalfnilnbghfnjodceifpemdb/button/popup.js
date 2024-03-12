var popupClass = function(config) {
	var self = this;
	this.config = config;
	
	this.init = function() {
		if (self.config.unpaused) {
			$('#pause').show().click(function() {
				self.pauseListener(false, self.setImgOffLine);
			});
			self.setImgOnLine();
		}	  
		else {
			$('#unpause').show().click(function() {
				self.pauseListener(true, self.setImgOnLine);
			});
			self.setImgOffLine();
		}
		
		
		
		$('#options').click(function() {
			kango.ui.optionsPage.open();
			window.close();
		});	

		$('#changelog').click(function() {
			kango.browser.tabs.create({url:"https://er-help.ru/index.php/glavnaya/plagin-er-help-extension"});
			window.close();
		});	
		
		$("#titletext").html("Er-help Extension "+kango.getExtensionInfo().version).click(function() { 
			kango.browser.tabs.create({url:kango.getExtensionInfo().homepage_url}); 
		});
		
		$("#dp_stats").click(function() {
		 	if (kango.browser.getName() != "firefox") { var url_dp_stats = kango.io.getResourceUrl("services/dp_stats.html");
		 } 	else { var url_dp_stats = kango.io.getResourceUrl("content/services/dp_stats.html").replace("resource","chrome")}
			kango.browser.tabs.create({url:url_dp_stats}); 
			window.close();
		});	

		$("#calc_cloak").click(function() {
			kango.browser.tabs.create({url:"https://er-help.ru/s/158.php"});
			window.close();
		});	

		$("#calc_cloak2").click(function() {
			if (kango.browser.getName() != "firefox") { var url_calc_cloak = kango.io.getResourceUrl("services/calc_cloak.html");
			} else { var url_calc_cloak = kango.io.getResourceUrl("content/services/calc_cloak.html").replace("resource","chrome")}
			kango.browser.tabs.create({url:url_calc_cloak});
			window.close();
		});	

		$("#all_smiles").click(function() {
		 	if (kango.browser.getName() != "firefox") { var url_all_smiles = kango.io.getResourceUrl("services/all_smiles.html");
		 } 	else { var url_all_smiles = kango.io.getResourceUrl("content/services/all_smiles.html").replace("resource","chrome")}
			kango.browser.tabs.create({url:url_all_smiles}); 
			window.close();
		});	

		$('#wana_clan').click(function() {
			kango.browser.tabs.create({url:"http://usercp.ereality.ru/check/rules"});
			window.close();
		});	

		$('#sp_is_bad').click(function() {
			kango.browser.tabs.create({url:"http://order.ereality.ru/ork/femida_"});
			window.close();
		});	

		$('#cavil').click(function() {
			kango.browser.tabs.create({url:"http://usercp.ereality.ru/complaints/add"});
			window.close();
		});	
	};
	
	this.pauseListener = function(isPaused, setImgCallback) {
		self.config["unpaused"] = isPaused;
		
		kango.invokeAsync('kango.storage.setItem', "options", self.config);
		setImgCallback();
		
		if (config.tab_refresh) { 
			self.reloadPages();
		}
		
		KangoAPI.closeWindow();	
	};
	
	this.reloadPages = function() {
		kango.browser.tabs.getAll(function(tabs) {
			$.each(tabs, function() {
				var url = this.getUrl();
				
				if (url.search("www.ereality.ru") != -1) {
					this.navigate(url);
				}
			});
		});	
	};
	
	this.setImgOnLine = function() {
		kango.ui.browserButton.setIcon('icons/button.png'); 
	};
	
	this.setImgOffLine = function() {
		kango.ui.browserButton.setIcon('icons/buttong.png');
	};
}

KangoAPI.onReady(function() { 
	kango.invokeAsync('kango.storage.getItem', "options", function(value) { 
		new popupClass(mergeOptions(value, defaultConfig.myoptions)).init();
	});
});