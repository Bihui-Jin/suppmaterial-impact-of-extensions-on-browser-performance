///////////// Start the translation service /////////////
let StartTrans = document.getElementById("StartTrans");
StartTrans.onclick = function () {
  chrome.extension.sendMessage({ command: "start" });
  chrome.tabs.executeScript({
    file: "/js/excute.js",
  });

  window.close();
};
///////////// Start the translation service /////////////

///////////// Translate the whole page /////////////
let wholepage = document.getElementById("wholepage");
wholepage.onclick = function () {
  chrome.tabs.executeScript({
    file: "/js/wholepage.js",
  });

  window.close();
};
///////////// Translate the whole page /////////////

/////////////  YouTube caption translation //////////////
let DefYouTube = document.getElementById("DefYouTube");
DefYouTube.onclick = function () {
  chrome.tabs.executeScript({
    file: "/js/DefTyoutube.js",
  });

  window.close();
};
/////////////  YouTube caption translation //////////////

/////////////  Storage Selected Lang ////////////////////
function DefConfig() {
  var body = document.body;

  chrome.storage.sync.get(["darkcheckstatus"], function (settings) {
    if (settings.darkcheckstatus == false) {
      body.id = "body";
    } else if (settings.darkcheckstatus == true) {
      body.id = "darkbody";
    }
  });

  chrome.storage.sync.get(["storageSelectedLang"], function (settings) {
    document.getElementById("SelectedLang").value =
      settings.storageSelectedLang;
  });
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  DefConfig();
});

document.getElementById("SelectedLang").onchange = function () {
  var language = this.selectedIndex
    ? this.options[this.selectedIndex].value
    : "nl";
  chrome.storage.sync.set({ storageSelectedLang: language }, function () {});
};

DefConfig();

/////////////  Storage Selected Lang ////////////////////
