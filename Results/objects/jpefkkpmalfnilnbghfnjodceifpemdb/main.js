function MyExtension() {
  var self = this;
  kango.ui.browserButton.addEventListener(kango.ui.browserButton.event.COMMAND, function() {
    self._onCommand();
  });
}
MyExtension.prototype = {

  _onCommand: function() {
    kango.ui.optionsPage.open();
  }
};

var extension = new MyExtension();
try {
  opt = kango.storage.getItem('options');
  if (opt.unpaused != false) {
    opt.unpaused = true;
  }
  if (opt.unpaused) {
    kango.ui.browserButton.setIcon('icons/button.png')
  } else {
    kango.ui.browserButton.setIcon('icons/buttong.png');
  }
  sopt = kango.storage.getItem('systemOptions');
/*$.ajax({
	url:"http://"+sopt.background_scripts_host+"/items.php",
	type: "GET",
	cache: false,
    error: function() {
        sopt.background_scripts_host="er-help.ru/extension";
		kango.storage.setItem('systemOptions',sopt);
		$.ajax({
		url:sopt.background_scripts_host+"/items.php",
		type: "GET",
		cache: false,
		error: function() {
			sopt.background_scripts_host="крон.жукодавы.рф/er";
			kango.storage.setItem('systemOptions',sopt);
		}
	});
    }
});*/
  
		

} catch (e) {
  var opt = {
    "startup_update_notification": "true"
  }
}

// Проверка наличия новой версии
var details = {
  method: 'POST',
  url: 'https://er-help.ru/extension/version.txt',
  async: true,
  contentType: 'text'
};
kango.xhr.send(details, function(data) {
var browserName = navigator.userAgent;
  if (data.status == 200 && data.response != null) {
    var text = data.response;
    if (text != "Последняя версия плагина: 2.3.2! Использование версий до 2.2.0 - запрещено!") {
      kango.ui.browserButton.setIcon('icons/grumpy.png');
      if (opt.startup_update_notification != false) {
        try {
          Notification.permission = "granted";
          var n = new Notification("Er-help Extension", {
            "body": "На форуме выложена новая версия плагина: "+text,
            "icon": kango.io.getResourceUrl("icons/icon48.png")
          });
        } catch (e) {}
      }
    }
  } // типо проверки на новую версию
  else { // something went wrong
    kango.console.log('something went wrong');
  }
});

kango.addMessageListener(messagingEnum.lotteryToBackground, function(event) {
  kango.browser.tabs.getAll(function(tabs) {
    $.each(tabs, function() {
      if (this.getUrl().search("www.ereality.ru/core") != -1) this.dispatchMessage(messagingEnum.lotteryToContent, event.data);
    });
  });
});

kango.addMessageListener(messagingEnum.UndergroundToBackground, function(event) {
  kango.browser.tabs.getAll(function(tabs) {
    $.each(tabs, function() {
      if (this.getUrl().search("https://er-help.ru/scripts/map_shaxt.php") != -1) this.dispatchMessage(messagingEnum.UndergroundToContent, event.data);
    });
  });
});