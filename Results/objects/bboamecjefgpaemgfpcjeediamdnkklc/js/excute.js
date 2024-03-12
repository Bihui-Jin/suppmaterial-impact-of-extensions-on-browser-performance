///////////////////////////////////////////
//console.log("Let's start");
///////////////////////////////////////////

//////// Block All Body ////////
document.body.classList.add("notranslate");
//console.log("Body had been blocked");
//////// Block All Body ////////

//////////inject script into html//////////
injectscript();
//console.log("script had been added");
//////////inject script into html//////////

///////////////////////////////////////////
function injectscript() {
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

(function(){(function StartServ() {

var SelectedLang = '${settings.storageSelectedLang}';

function TranslateElementF() {
var Telem = new google.translate.TranslateElement({
autoDisplay: false,
floatPosition: 0,
multilanguagePage: true
});
return Telem;
}

var UserId = ''; //Ignore User ID 
var TranslateID = 'TE_' + UserId;
var TECBId = 'TECB_' + UserId;

function show() {
window.setTimeout(function() {
window[TranslateID].showBanner(true);
}, 10);
}

if (window[TranslateID]) {
show();
} else {
if (!window.google || !google.translate || !google.translate.TranslateElement) {
if (!window[TECBId]) {
window[TECBId] = function() {
window[TranslateID] = TranslateElementF();
show();
};
}
var linkappend = document.createElement('script');
linkappend.src = 'https://translate.google.com/translate_a/element.js?cb=' + encodeURIComponent(TECBId) + '&client=tee&hl=' + SelectedLang;
document.getElementsByTagName('head')[0].appendChild(linkappend);
}
}
})();})(); `;

    document.head.prepend(script);
  });
}
///////////////////////////////////////////
