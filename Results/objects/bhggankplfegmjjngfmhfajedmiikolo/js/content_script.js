chrome.runtime.onMessage.addListener(
  function (message, sender, sendResponse) {
    console.log('CS received: ' + message + ' from sender: ' + sender.id);
    if (message == 'getSelectedText') {
      sendResponse({data: window.getSelection().toString()});
    } else if (message == 'getCurrentPos') {
      var options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 30000
      };
      navigator.geolocation.getCurrentPosition(function (position) {
        var coords = {lat: position.coords.latitude, lon: position.coords.longitude};
        sendResponse({data: coords});
      }, function (error) {
        sendResponse({data: undefined});
      }, options);  
      return true;
    } else {sendResponse({data : ''});}
  }
);

function ready(cb) {
  if (document.readyState !== 'loading') {
    cb();
    return
  }

  document.addEventListener('DOMContentLoaded', cb);
}

chrome.runtime.sendMessage('get-config', (config) => {
  function prepareUrl(str) {
    return str.replace(/{[\w.]+}/, (x) => {
      const path = x.substr(1, x.length - 2);
      const val = path.split('.').reduce((acc, entry) => acc[entry], window);
      return encodeURIComponent(val);
    });
  }
  
  const l = document.location + '';
  ready(() => {
    for (const entry of config) {
      const re = new RegExp(entry.pattern, 'gi');
      const isValid = re.test(l);
    
      if (isValid) {
        const els = [...document.querySelectorAll(entry.selector)];
        els.forEach(el => {
          const display = el.style.display;
          el.style.display = 'none';

          fetch(prepareUrl(entry.url)).then(res => res.text()).then(text => {
            const trimmed = text.trim();
            if (trimmed) {
              el[entry.attr] = trimmed;
            }
          }).catch(() => {}).then(() => el.style.display = display);
        })
      }
    }
  });
});