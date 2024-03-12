/////////////////////////////////////////
function ChangeCaptionLinkReq() {
  var injectScript = document.createElement("script");
  injectScript.type = "text/javascript";
  injectScript.innerHTML = `
(function() {
var XmlHReq = XMLHttpRequest.prototype;
var sendReq = XmlHReq.send;
var openReq = XmlHReq.open;
XmlHReq.open = function(method, url) {
if (url.includes('timedtext')) {

arguments[1] = url + "&tlang=" + window.ultimateVideotranslator.language; 

return openReq.apply(this, arguments);

} else {

return openReq.apply(this, arguments);
}   
}
})();
`;
  document.head.prepend(injectScript);
}
/////////////////////////////////////////

/////////////////////////////////////////
function listentolang() {
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    chrome.storage.sync.get(["storageSelectedLang"], function (settings) {
      let event = new CustomEvent("changelangconfig", {
        detail: {
          language: settings.storageSelectedLang,
        },
      });
      document.dispatchEvent(event);
    });
  });

  chrome.storage.sync.get(["storageSelectedLang"], function (settings) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
(function() {
window.ultimateVideotranslator = {
"language": "${settings.storageSelectedLang}",
}
document.addEventListener("changelangconfig", function(event) {
window.ultimateVideotranslator = {
"language": event.detail.language 
}
});

try {
  var EnableCaption = document.getElementsByClassName(
    "ytp-subtitles-button"
  )[0];
  EnableCaption.click();
} catch (error) {
  console.log("Something went wrong");
}
  
})();`;
    document.head.prepend(script);
  });
}
/////////////////////////////////////////

/////////////////////////////////////////
function CheckHtmlPage() {
  if (document.body && document.head) {
    listentolang();
    ChangeCaptionLinkReq();
  } else {
    requestIdleCallback(CheckHtmlPage);
  }
}
/////////////////////////////////////////

/////////////////////////////////////////
requestIdleCallback(CheckHtmlPage);
/////////////////////////////////////////
